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
const verifyUser_1 = require("../../../middleware/verifyUser");
const stripe_1 = __importDefault(require("stripe"));
const db_1 = require("../../../../db/db");
const subscription = (0, express_1.Router)();
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
subscription.use(verifyUser_1.verifyUser);
subscription.get("/premium-info", (req, res) => {
    const userId = req.userId;
    db_1.db.query("SELECT stripe_id, ends_at FROM subscriptions WHERE user_id = ? AND stripe_status = 'active'", [userId], (err, result) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.log(err);
            res.status(500).json({ message: "An error occurred while fetching subscription details" });
            return;
        }
        if (result.length === 0) {
            res.status(200).json({ isPremium: false });
            return;
        }
        try {
            const subscription_ = yield stripe.subscriptions.retrieve(result[0].stripe_id);
            if (subscription_.status !== "active" && subscription_.status !== "trialing") {
                db_1.db.query("UPDATE subscriptions SET stripe_status = ? WHERE user_id = ?", [subscription_.status, userId], (err) => {
                    if (err) {
                        console.log(err);
                        res.status(500).json({ message: "An error occurred while updating subscription details" });
                        return;
                    }
                    res.status(200).json({ isPremium: false });
                });
            }
            else {
                res.status(200).json({ isPremium: true, endsAt: result[0].ends_at });
            }
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ message: "An error occurred while fetching subscription details" });
        }
    }));
});
subscription.get("/", (req, res) => {
    const userId = req.userId;
    console.log("subscription get");
    db_1.db.query("SELECT stripe_id FROM users WHERE id = ?", [userId], (err, result) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        if (err) {
            console.log(err);
            res.status(500).json({ message: "An error occurred while fetching user details" });
            return;
        }
        if (result.length === 0) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const subscriptions = yield stripe.subscriptions.list({
            customer: result[0].stripe_id,
            status: "all"
        });
        let data = [];
        for (const subscription_ of subscriptions.data) {
            const paymentMethod = yield stripe.paymentMethods.retrieve(subscription_.default_payment_method);
            const product = yield stripe.products.retrieve(subscription_.items.data[0].plan.product);
            data.push({
                id: subscription_.id,
                name: product.name,
                status: subscription_.status,
                startDate: new Date(subscription_.current_period_start * 1000),
                endDate: new Date(subscription_.current_period_end * 1000),
                paymentMethod: {
                    brand: (_a = paymentMethod.card) === null || _a === void 0 ? void 0 : _a.brand,
                    last4: (_b = paymentMethod.card) === null || _b === void 0 ? void 0 : _b.last4
                },
                price: subscription_.items.data[0].plan.amount / 100,
                currency: subscription_.items.data[0].plan.currency,
                cancelAtPeriodEnd: subscription_.cancel_at_period_end
            });
        }
        res.status(200).json(data);
    }));
});
subscription.post("/cancel-auto-renew", (req, res) => {
    const userId = req.userId;
    db_1.db.query("SELECT stripe_id FROM subscriptions WHERE user_id = ? AND stripe_status = 'active';", [userId], (err, result) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.log(err);
            res.status(500).json({ message: "An error occurred while fetching subscription details" });
            return;
        }
        if (result.length === 0) {
            res.status(404).json({ message: "Subscription not found" });
            return;
        }
        yield stripe.subscriptions.update(result[0].stripe_id, {
            cancel_at_period_end: true
        });
        res.status(200).json({ message: "Subscription auto renewal has been cancelled" });
    }));
});
subscription.post("/resume-auto-renew", (req, res) => {
    const userId = req.userId;
    db_1.db.query("SELECT stripe_id FROM subscriptions WHERE user_id = ? AND stripe_status = 'active';", [userId], (err, result) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.log(err);
            res.status(500).json({ message: "An error occurred while fetching subscription details" });
            return;
        }
        if (result.length === 0) {
            res.status(404).json({ message: "Subscription not found" });
            return;
        }
        yield stripe.subscriptions.update(result[0].stripe_id, {
            cancel_at_period_end: false
        });
        res.status(200).json({ message: "Subscription auto renewal has been resumed" });
    }));
});
subscription.post("/cancel", (req, res) => {
    const userId = req.userId;
    db_1.db.query("SELECT stripe_id FROM subscriptions WHERE user_id = ? AND stripe_status = 'active';", [userId], (err, result) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.log(err);
            res.status(500).json({ message: "An error occurred while fetching subscription details" });
            return;
        }
        if (result.length === 0) {
            res.status(404).json({ message: "Subscription not found" });
            return;
        }
        yield stripe.subscriptions.cancel(result[0].stripe_id);
        db_1.db.query("UPDATE subscriptions SET stripe_status = 'canceled' WHERE user_id = ?", [userId], (err) => {
            if (err) {
                console.log(err);
                res.status(500).json({ message: "An error occurred while updating subscription details" });
                return;
            }
            res.status(200).json({ message: "Subscription has been cancelled" });
        });
    }));
});
exports.default = subscription;
