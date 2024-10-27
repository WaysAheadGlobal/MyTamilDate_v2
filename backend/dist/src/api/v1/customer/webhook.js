"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stripe_1 = __importDefault(require("stripe"));
const db_1 = require("../../../../db/db");
const mail_1 = __importDefault(require("../../../../mail"));
const moment_1 = __importDefault(require("moment"));
const webhookRouter = (0, express_1.Router)();
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
const mailService = new mail_1.default();
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
webhookRouter.post('/', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const sig = request.headers['stripe-signature'];
    let event;
    try {
        event = stripe_1.default.webhooks.constructEvent(request.body, sig, endpointSecret);
    }
    catch (err) {
        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }
    // Handle the event
    switch (event.type) {
        case 'invoice.paid': {
            // Continue to provision the subscription as payments continue to be made.
            // Store the status in your database and check when a user accesses your service.
            // This approach helps you avoid hitting rate limits.   
            const object = event.data.object;
            db_1.db.beginTransaction(err => {
                if (err) {
                    db_1.db.rollback(() => {
                        console.log(err);
                    });
                    return;
                }
                db_1.db.query("SELECT id FROM users WHERE stripe_id = ?", [object.customer], (err, result) => {
                    var _a, _b, _c, _d, _e;
                    if (err) {
                        db_1.db.rollback(() => {
                            console.log(err);
                        });
                        return;
                    }
                    if (result.length === 0) {
                        db_1.db.rollback(() => {
                            console.log("User not found");
                        });
                        return;
                    }
                    db_1.db.query("INSERT INTO payments (customer_id, amount, discount_amount, price_id, created_at, updated_at, user_id) VALUES (?, ?, ?, ?, NOW(), NOW(), ?)", [object.customer, object.amount_paid, (_c = (_b = (_a = object.lines.data[0].discount_amounts) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.amount) !== null && _c !== void 0 ? _c : 0, (_e = (_d = object.lines.data[0]) === null || _d === void 0 ? void 0 : _d.plan) === null || _e === void 0 ? void 0 : _e.id, result[0].id], (err) => __awaiter(void 0, void 0, void 0, function* () {
                        if (err) {
                            db_1.db.rollback(() => {
                                console.log(err);
                            });
                            return;
                        }
                        db_1.db.commit(err => {
                            if (err) {
                                db_1.db.rollback(() => {
                                    console.log(err);
                                });
                                return;
                            }
                            console.log("Success");
                        });
                    }));
                });
            });
            break;
        }
        case 'invoice.payment_failed': {
            // The payment failed or the customer does not have a valid payment method.
            // The subscription becomes past_due. Notify your customer and send them to the
            // customer portal to update their payment information.
            /* console.log(event.data.object); */
            const object = event.data.object;
            break;
        }
        case 'customer.subscription.created': {
            const object = event.data.object;
            db_1.db.beginTransaction(err => {
                if (err) {
                    throw err;
                }
                db_1.db.query("SELECT id FROM users WHERE stripe_id = ?", [object.customer], (err, result) => {
                    if (err) {
                        db_1.db.rollback(() => {
                            console.log(err);
                        });
                        return;
                    }
                    if (result.length === 0) {
                        db_1.db.rollback(() => {
                            console.log("User not found");
                        });
                        return;
                    }
                    db_1.db.query("INSERT INTO subscriptions (user_id, name, stripe_id, stripe_status, stripe_plan, quantity, ends_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, FROM_UNIXTIME(?), NOW(), NOW())", [result[0].id, "default", object.id, object.status, object.items.data[0].plan.id, object.items.data[0].quantity, object.current_period_end], (err, _) => __awaiter(void 0, void 0, void 0, function* () {
                        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
                        if (err) {
                            db_1.db.rollback(() => {
                                console.log(err);
                            });
                            return;
                        }
                        const [profiles] = yield db_1.db.promise().query("SELECT email FROM user_profiles WHERE user_id = ?", [result[0].id]);
                        const invoice = yield stripe.invoices.retrieve(object.latest_invoice);
                        console.log(invoice);
                        if (invoice) {
                            try {
                                const interval = (_b = (_a = invoice.lines.data[0].price) === null || _a === void 0 ? void 0 : _a.recurring) === null || _b === void 0 ? void 0 : _b.interval; // e.g., "month"
                                const intervalCount = ((_d = (_c = invoice.lines.data[0].price) === null || _c === void 0 ? void 0 : _c.recurring) === null || _d === void 0 ? void 0 : _d.interval_count) || 1; // e.g., 1, 3, 6
                                const nextBillingDate = (0, moment_1.default)().add(intervalCount, interval).format('MMM DD, YYYY');
                                console.log(nextBillingDate);
                                yield mailService.sendPremiumMail(profiles[0].email, `${(_f = (_e = invoice.lines.data[0].price) === null || _e === void 0 ? void 0 : _e.recurring) === null || _f === void 0 ? void 0 : _f.interval_count} ${(_h = (_g = invoice.lines.data[0].price) === null || _g === void 0 ? void 0 : _g.recurring) === null || _h === void 0 ? void 0 : _h.interval}`, object.items.data[0].plan.amount / 100, // Convert to dollars
                                ((_l = (_k = (_j = invoice.lines.data[0].discount_amounts) === null || _j === void 0 ? void 0 : _j[0]) === null || _k === void 0 ? void 0 : _k.amount) !== null && _l !== void 0 ? _l : 0) / 100, // Convert to dollars
                                invoice.amount_paid / 100, // Convert to dollars
                                (0, moment_1.default)().format('MMM DD, YYYY'), invoice.hosted_invoice_url, nextBillingDate
                                // moment().add(3, 'month').format('MMM DD, YYYY')
                                );
                                console.log("next billling data", nextBillingDate);
                            }
                            catch (err) {
                                console.log(err);
                            }
                        }
                        db_1.db.commit(err => {
                            if (err) {
                                db_1.db.rollback(() => {
                                    console.log(err);
                                });
                                return;
                            }
                            console.log("Success");
                        });
                    }));
                });
            });
            break;
        }
        case 'customer.subscription.updated': {
            const object = event.data.object;
            db_1.db.query("UPDATE subscriptions SET stripe_status = ?, ends_at = FROM_UNIXTIME(?) WHERE stripe_id = ?", [object.status, object.current_period_end, object.id], (err, _) => {
                if (err) {
                    console.log(err);
                }
            });
            break;
        }
        case 'customer.subscription.deleted': {
            const object = event.data.object;
            db_1.db.query("UPDATE subscriptions SET stripe_status = ?, ends_at = NOW() WHERE stripe_id = ?", [object.status, object.id], (err, _) => {
                if (err) {
                    console.log(err);
                }
            });
            break;
        }
        default:
            console.log(event.type);
        // Unhandled event type
    }
    // Return a 200 response to acknowledge receipt of the event
    response.send();
}));
exports.default = webhookRouter;
