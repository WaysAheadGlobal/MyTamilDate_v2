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
const verifyUser_1 = require("../../../middleware/verifyUser");
const payment = (0, express_1.Router)();
payment.use(verifyUser_1.verifyUser);
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
// Function to fetch payment methods and send response
function fetchPaymentMethods(customerId, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Fetch the customer's payment methods
            const paymentMethods = yield stripe.paymentMethods.list({
                customer: customerId,
                type: "card",
            });
            // Fetch the customer's details and assert the type
            const customer = yield stripe.customers.retrieve(customerId);
            const defaultPaymentMethodId = customer.invoice_settings.default_payment_method;
            // Prepare the response data including default status
            let data = paymentMethods.data.map((method) => {
                var _a, _b;
                return ({
                    id: method.id,
                    brand: (_a = method.card) === null || _a === void 0 ? void 0 : _a.brand,
                    last4: (_b = method.card) === null || _b === void 0 ? void 0 : _b.last4,
                    isDefault: method.id === defaultPaymentMethodId, // Check if this method is the default one
                });
            });
            res.status(200).json(data);
        }
        catch (error) {
            console.error("Stripe API error:", error);
            return res.status(500).send("Failed to retrieve payment methods.");
        }
    });
}
// Function to create and attach payment method and set it as default
function createAndAttachPaymentMethod(customerId, token, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Create a new payment method with the provided token
            const paymentMethod = yield stripe.paymentMethods.create({
                type: "card",
                card: {
                    token: token,
                },
            });
            // Attach the newly created payment method to the customer
            yield stripe.paymentMethods.attach(paymentMethod.id, {
                customer: customerId,
            });
            // Update the customer's default payment method to the newly attached payment method
            yield stripe.customers.update(customerId, {
                invoice_settings: {
                    default_payment_method: paymentMethod.id, // Set the newly added payment method as the default
                },
            });
            res.status(200).send({ message: "Payment method added and set as default successfully" });
        }
        catch (error) {
            console.error(error);
            return res.status(500).send("Internal Server Error");
        }
    });
}
// Function to fetch billing history from Stripe
function fetchBillingHistory(customerId, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Fetch the user's billing history (invoices) from Stripe
            const invoices = yield stripe.invoices.list({
                customer: customerId,
                limit: 10, // Adjust the limit as needed
            });
            // Extract the relevant details from each invoice
            const formattedInvoices = yield Promise.all(invoices.data.map((invoice) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c;
                const description = ((_a = invoice.lines.data[0]) === null || _a === void 0 ? void 0 : _a.description) || "No description";
                const amount = (invoice.amount_paid / 100).toFixed(2) + " " + invoice.currency.toUpperCase();
                const date = new Date(invoice.created * 1000).toLocaleDateString();
                // Fetch the charge details to get the last 4 digits of the card
                let last4 = "N/A";
                if (invoice.charge) {
                    const charge = yield stripe.charges.retrieve(invoice.charge);
                    last4 = ((_c = (_b = charge.payment_method_details) === null || _b === void 0 ? void 0 : _b.card) === null || _c === void 0 ? void 0 : _c.last4) || "N/A";
                }
                // Fetch the subscription details to check for auto-renewal, get start/end dates, and calculate duration in months
                let autoRenewal = false;
                let subscriptionStart = "N/A";
                let subscriptionEnd = "N/A";
                let subscriptionDurationInMonths = "N/A";
                if (invoice.subscription) {
                    const subscription = yield stripe.subscriptions.retrieve(invoice.subscription);
                    autoRenewal = subscription.cancel_at_period_end === false;
                    // Convert the start and end dates from Unix timestamps to readable dates
                    subscriptionStart = new Date(subscription.current_period_start * 1000).toLocaleDateString();
                    subscriptionEnd = new Date(subscription.current_period_end * 1000).toLocaleDateString();
                    // Calculate the subscription duration in months
                    const startDate = new Date(subscription.current_period_start * 1000);
                    const endDate = new Date(subscription.current_period_end * 1000);
                    const durationInMonths = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
                    subscriptionDurationInMonths = `${durationInMonths} months`;
                }
                return {
                    description,
                    amount,
                    date,
                    last4,
                    autoRenewal: autoRenewal ? "Auto-renewal" : "Not auto-renewal",
                    subscriptionStart,
                    subscriptionEnd,
                    subscriptionDurationInMonths,
                };
            })));
            // Send the formatted invoices data back in the response
            res.status(200).json({
                message: "Billing history retrieved successfully",
                data: formattedInvoices,
            });
        }
        catch (error) {
            console.error("Error fetching billing history:", error);
            return res.status(500).send("Internal Server Error");
        }
    });
}
payment.post("/create-payment-method", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const paymentMethodId = req.body.paymentMethodId;
    const { token } = req.body;
    db_1.db.query("SELECT stripe_id FROM users WHERE id = ?", [req.userId], (err, result) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.error(err);
            return res.status(500).send("Internal Server Error");
        }
        if (result.length === 0) {
            return res.status(404).send("User not found");
        }
        let customerId = result[0].stripe_id;
        try {
            // If stripe_id is not present or is empty, retrieve the phone number and create a new Stripe customer
            if (!customerId || customerId.trim() === "") {
                // Fetch phone number from user_profiles table
                db_1.db.query("SELECT phone FROM user_profiles WHERE user_id = ?", [req.userId], (profileErr, profileResult) => __awaiter(void 0, void 0, void 0, function* () {
                    if (profileErr) {
                        console.error("Database error while fetching phone:", profileErr);
                        return res.status(500).send("Internal Server Error");
                    }
                    if (profileResult.length === 0) {
                        return res.status(404).send("User profile not found");
                    }
                    const userPhone = profileResult[0].phone;
                    if (!userPhone) {
                        console.error("No phone number associated with user:", req.userId);
                        return res.status(400).send("No phone number associated with this user.");
                    }
                    // Create a new Stripe customer using the phone number
                    const newCustomer = yield stripe.customers.create({
                        phone: userPhone,
                    });
                    customerId = newCustomer.id;
                    // Update your database with the new Stripe customer ID
                    db_1.db.query("UPDATE users SET stripe_id = ? WHERE id = ?", [customerId, req.userId], (updateErr) => {
                        if (updateErr) {
                            console.error("Failed to update Stripe customer ID in database:", updateErr);
                            return res.status(500).send("Internal Server Error");
                        }
                    });
                    // Continue to create and attach the payment method
                    yield createAndAttachPaymentMethod(customerId, token, res);
                }));
            }
            else {
                // If stripe_id exists, directly create and attach the payment method
                yield createAndAttachPaymentMethod(customerId, token, res);
            }
        }
        catch (error) {
            console.error("Stripe API error:", error);
            return res.status(500).send("Failed to create Stripe customer.");
        }
    }));
}));
payment.post("/create-subscription", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const priceId = req.body.priceId;
    db_1.db.query("SELECT stripe_id FROM users WHERE id = ?", [req.userId], (err, result) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.log(err);
            return res.status(500).send("Internal Server Error");
        }
        if (result.length === 0) {
            return res.status(404).send("User not found");
        }
        const customerId = result[0].stripe_id;
        const paymentMethods = yield stripe.paymentMethods.list({
            customer: customerId,
            type: "card",
        });
        if (paymentMethods.data.length === 0) {
            res.status(200).json({ message: "No payment method found", url: "/addpaymentmethod?type=subscribe" });
            return;
        }
        try {
            yield stripe.customers.update(customerId, {
                email: req.user.email,
            });
            yield stripe.subscriptions.create({
                customer: customerId,
                items: [{ price: priceId }],
                default_payment_method: paymentMethods.data[0].id,
            });
        }
        catch (error) {
            console.log(error);
            return res.status(500).send("Internal Server Error");
        }
        res.status(200).send({ message: "Subscription created successfully" });
    }));
}));
payment.post("/create-subscription/:coupon", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const priceId = req.body.priceId;
    const coupon = req.params.coupon;
    const productId = req.body.product;
    const [result] = yield db_1.db.promise().query("SELECT id, applies_to, once_per_user FROM promotional_codes WHERE stripe_id = ?", [coupon]);
    const promoId = result[0].id;
    if (result.length === 0) {
        return res.status(404).json({ message: "Invalid Coupon Code" });
    }
    if (result[0].applies_to !== productId) {
        console.log(result[0].applies_to, productId);
        return res.status(404).json({ message: "This coupon is not applicable for the selected product" });
    }
    if (result[0].once_per_user) {
        const [usage] = yield db_1.db.promise().query("SELECT id FROM promotional_codes_usages WHERE promotional_codes_id = ? AND user_id = ?", [result[0].id, req.userId]);
        if (usage.length > 0) {
            return res.status(404).json({ message: "Coupon can only be used once per user" });
        }
    }
    db_1.db.query("SELECT stripe_id FROM users WHERE id = ?", [req.userId], (err, result) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.log(err);
            return res.status(500).send("Internal Server Error");
        }
        if (result.length === 0) {
            return res.status(404).send("User not found");
        }
        const customerId = result[0].stripe_id;
        const paymentMethods = yield stripe.paymentMethods.list({
            customer: customerId,
            type: "card",
        });
        if (paymentMethods.data.length === 0) {
            res.status(200).json({ message: "No payment method found", url: "/addpaymentmethod?type=subscribe" });
            return;
        }
        try {
            yield stripe.customers.update(customerId, {
                email: req.user.email,
            });
            yield stripe.subscriptions.create({
                customer: customerId,
                items: [{ price: priceId }],
                default_payment_method: paymentMethods.data[0].id,
                discounts: [
                    {
                        coupon: coupon,
                    }
                ]
            });
            yield db_1.db.promise().query("INSERT INTO promotional_codes_usages (promotional_codes_id, user_id, created_at, updated_at) VALUES (?, ?, NOW(), NOW())", [promoId, req.userId]);
        }
        catch (error) {
            console.log(error);
            return res.status(500).send("Internal Server Error");
        }
        res.status(200).send({ message: "Subscription created successfully" });
    }));
}));
payment.get("/methods", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    db_1.db.query("SELECT stripe_id FROM users WHERE id = ?", [req.userId], (err, result) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).send("Internal Server Error");
        }
        if (result.length === 0) {
            return res.status(404).send("User not found");
        }
        let customerId = result[0].stripe_id;
        try {
            // If stripe_id is not present or is empty, retrieve the phone number and create a new Stripe customer
            if (!customerId || customerId.trim() === "") {
                // Fetch phone number from user_profiles table
                db_1.db.query("SELECT phone FROM user_profiles WHERE user_id = ?", [req.userId], (profileErr, profileResult) => __awaiter(void 0, void 0, void 0, function* () {
                    if (profileErr) {
                        console.error("Database error while fetching phone:", profileErr);
                        return res.status(500).send("Internal Server Error");
                    }
                    if (profileResult.length === 0) {
                        return res.status(404).send("User profile not found");
                    }
                    const userPhone = profileResult[0].phone;
                    if (!userPhone) {
                        console.error("No phone number associated with user:", req.userId);
                        return res.status(400).send("No phone number associated with this user.");
                    }
                    // Create a new Stripe customer using the phone number
                    const newCustomer = yield stripe.customers.create({
                        phone: userPhone,
                    });
                    customerId = newCustomer.id;
                    // Update your database with the new Stripe customer ID
                    db_1.db.query("UPDATE users SET stripe_id = ? WHERE id = ?", [customerId, req.userId], (updateErr) => {
                        if (updateErr) {
                            console.error("Failed to update Stripe customer ID in database:", updateErr);
                            return res.status(500).send("Internal Server Error");
                        }
                    });
                    // Continue to fetch payment methods after creating the new customer
                    fetchPaymentMethods(customerId, res);
                }));
            }
            else {
                // If stripe_id exists, directly fetch the payment methods
                fetchPaymentMethods(customerId, res);
            }
        }
        catch (error) {
            console.error("Stripe API error:", error);
            return res.status(500).send("Failed to create Stripe customer.");
        }
    }));
}));
payment.delete("/methods/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const paymentMethodId = req.params.id;
    // Retrieve the Stripe customer ID from the database
    db_1.db.query("SELECT stripe_id FROM users WHERE id = ?", [req.userId], (err, result) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.error(err);
            return res.status(500).send("Internal Server Error");
        }
        if (result.length === 0) {
            return res.status(404).send("User not found");
        }
        const customerId = result[0].stripe_id;
        try {
            // Detach the payment method from the customer
            const paymentMethod = yield stripe.paymentMethods.detach(paymentMethodId);
            if (paymentMethod.customer === null) {
                res.status(200).send("Payment method deleted successfully");
            }
            else {
                res.status(400).send("Failed to delete payment method");
            }
        }
        catch (error) {
            console.error(error);
            return res.status(500).send("Internal Server Error");
        }
    }));
}));
payment.post("/methods/default", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { paymentMethodId } = req.body; // Get the payment method ID from the request body
    db_1.db.query("SELECT stripe_id FROM users WHERE id = ?", [req.userId], (err, result) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.log(err);
            return res.status(500).send("Internal Server Error");
        }
        if (result.length === 0) {
            return res.status(404).send("User not found");
        }
        const customerId = result[0].stripe_id;
        try {
            // Attach the payment method to the customer if it's not already attached
            yield stripe.paymentMethods.attach(paymentMethodId, { customer: customerId });
            // Set the payment method as the default for the invoice and the customer
            yield stripe.customers.update(customerId, {
                invoice_settings: {
                    default_payment_method: paymentMethodId,
                }
            });
            res.status(200).send("Default payment method updated successfully");
        }
        catch (error) {
            console.log(error);
            return res.status(500).send("Internal Server Error");
        }
    }));
}));
payment.get("/check-valid-coupon/:product/:coupon", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const [result] = yield db_1.db.promise().query("SELECT applies_to FROM promotional_codes WHERE stripe_id = ?", [req.params.coupon]);
        if (result.length === 0) {
            return res.status(200).json({ valid: false });
        }
        if (result[0].applies_to !== req.params.product) {
            return res.status(200).json({ valid: false, message: "This coupon is not applicable for the selected product" });
        }
        const coupon = yield stripe.coupons.retrieve(req.params.coupon);
        if (coupon.valid) {
            res.status(200).send({
                valid: true,
                percentOff: coupon.percent_off,
                amountOff: coupon.amount_off,
                products: (_a = coupon.applies_to) === null || _a === void 0 ? void 0 : _a.products,
            });
        }
        else {
            res.status(200).send({ valid: false });
        }
    }
    catch (error) {
        console.log(error);
        res.status(200).json({ valid: false });
    }
}));
payment.get("/billing-history", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Retrieve the user's Stripe customer ID from your database
    db_1.db.query("SELECT stripe_id FROM users WHERE id = ?", [req.userId], (err, result) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.log(err);
            return res.status(500).send("Internal Server Error");
        }
        if (result.length === 0) {
            return res.status(404).send("User not found");
        }
        let customerId = result[0].stripe_id;
        try {
            // If stripe_id is not present or is empty, retrieve the phone number and create a new Stripe customer
            if (!customerId || customerId.trim() === "") {
                // Fetch phone number from user_profiles table
                db_1.db.query("SELECT phone FROM user_profiles WHERE user_id = ?", [req.userId], (profileErr, profileResult) => __awaiter(void 0, void 0, void 0, function* () {
                    if (profileErr) {
                        console.error("Database error while fetching phone:", profileErr);
                        return res.status(500).send("Internal Server Error");
                    }
                    if (profileResult.length === 0) {
                        return res.status(404).send("User profile not found");
                    }
                    const userPhone = profileResult[0].phone;
                    if (!userPhone) {
                        console.error("No phone number associated with user:", req.userId);
                        return res.status(400).send("No phone number associated with this user.");
                    }
                    // Create a new Stripe customer using the phone number
                    const newCustomer = yield stripe.customers.create({
                        phone: userPhone,
                    });
                    customerId = newCustomer.id;
                    // Update your database with the new Stripe customer ID
                    db_1.db.query("UPDATE users SET stripe_id = ? WHERE id = ?", [customerId, req.userId], (updateErr) => {
                        if (updateErr) {
                            console.error("Failed to update Stripe customer ID in database:", updateErr);
                            return res.status(500).send("Internal Server Error");
                        }
                    });
                    // Continue to fetch billing history
                    yield fetchBillingHistory(customerId, res);
                }));
            }
            else {
                // If stripe_id exists, directly fetch billing history
                yield fetchBillingHistory(customerId, res);
            }
        }
        catch (error) {
            console.error("Stripe API error:", error);
            return res.status(500).send("Failed to create Stripe customer.");
        }
    }));
}));
exports.default = payment;
