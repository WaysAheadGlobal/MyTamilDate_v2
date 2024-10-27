import { Router } from "express";
import { UserRequest } from "../../../types/types";
import { verifyUser } from "../../../middleware/verifyUser";
import Stripe from "stripe";
import { db } from "../../../../db/db";
import { RowDataPacket } from "mysql2";

const subscription = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

subscription.use(verifyUser);

subscription.get("/premium-info", (req: UserRequest, res) => {
    const userId = req.userId;

    db.query<RowDataPacket[]>("SELECT stripe_id, ends_at FROM subscriptions WHERE user_id = ? AND stripe_status = 'active'", [userId], async (err, result) => {
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
            const subscription_ = await stripe.subscriptions.retrieve(result[0].stripe_id);

            if (subscription_.status !== "active" && subscription_.status !== "trialing") {
                db.query("UPDATE subscriptions SET stripe_status = ? WHERE user_id = ?", [subscription_.status, userId], (err) => {
                    if (err) {
                        console.log(err);
                        res.status(500).json({ message: "An error occurred while updating subscription details" });
                        return;
                    }

                    res.status(200).json({ isPremium: false });
                });
            } else {
                res.status(200).json({ isPremium: true, endsAt: result[0].ends_at });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: "An error occurred while fetching subscription details" });
        }
    });
});

subscription.get("/", (req: UserRequest, res) => {
    const userId = req.userId;

    console.log("subscription get");

    db.query<RowDataPacket[]>("SELECT stripe_id FROM users WHERE id = ?", [userId], async (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ message: "An error occurred while fetching user details" });
            return;
        }

        if (result.length === 0) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const subscriptions = await stripe.subscriptions.list({
            customer: result[0].stripe_id,
            status: "all"
        });

        let data: {
            id: string,
            name: string,
            status: string,
            startDate: Date,
            endDate: Date,
            paymentMethod: {
                brand: string,
                last4: string
            },
            price: number,
            currency: string,
            cancelAtPeriodEnd: boolean
        }[] = [];

        for (const subscription_ of subscriptions.data) {
            const paymentMethod = await stripe.paymentMethods.retrieve(subscription_.default_payment_method as string);
            const product = await stripe.products.retrieve(subscription_.items.data[0].plan.product as string);

            data.push({
                id: subscription_.id,
                name: product.name,
                status: subscription_.status,
                startDate: new Date(subscription_.current_period_start * 1000),
                endDate: new Date(subscription_.current_period_end * 1000),
                paymentMethod: {
                    brand: paymentMethod.card?.brand!,
                    last4: paymentMethod.card?.last4!
                },
                price: subscription_.items.data[0].plan.amount! / 100,
                currency: subscription_.items.data[0].plan.currency,
                cancelAtPeriodEnd: subscription_.cancel_at_period_end
            });
        }

        res.status(200).json(data);
    });
});

subscription.post("/cancel-auto-renew", (req: UserRequest, res) => {
    const userId = req.userId;

    db.query<RowDataPacket[]>("SELECT stripe_id FROM subscriptions WHERE user_id = ? AND stripe_status = 'active';", [userId], async (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ message: "An error occurred while fetching subscription details" });
            return;
        }

        if (result.length === 0) {
            res.status(404).json({ message: "Subscription not found" });
            return;
        }

        await stripe.subscriptions.update(result[0].stripe_id, {
            cancel_at_period_end: true
        });

        res.status(200).json({ message: "Subscription auto renewal has been cancelled" });
    });
});

subscription.post("/resume-auto-renew", (req: UserRequest, res) => {
    const userId = req.userId;

    db.query<RowDataPacket[]>("SELECT stripe_id FROM subscriptions WHERE user_id = ? AND stripe_status = 'active';", [userId], async (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ message: "An error occurred while fetching subscription details" });
            return;
        }

        if (result.length === 0) {
            res.status(404).json({ message: "Subscription not found" });
            return;
        }

        await stripe.subscriptions.update(result[0].stripe_id, {
            cancel_at_period_end: false
        });

        res.status(200).json({ message: "Subscription auto renewal has been resumed" });
    });
});

subscription.post("/cancel", (req: UserRequest, res) => {
    const userId = req.userId;

    db.query<RowDataPacket[]>("SELECT stripe_id FROM subscriptions WHERE user_id = ? AND stripe_status = 'active';", [userId], async (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ message: "An error occurred while fetching subscription details" });
            return;
        }

        if (result.length === 0) {
            res.status(404).json({ message: "Subscription not found" });
            return;
        }

        await stripe.subscriptions.cancel(result[0].stripe_id);

        db.query("UPDATE subscriptions SET stripe_status = 'canceled' WHERE user_id = ?", [userId], (err) => {
            if (err) {
                console.log(err);
                res.status(500).json({ message: "An error occurred while updating subscription details" });
                return;
            }

            res.status(200).json({ message: "Subscription has been cancelled" });
        });
    });
});

export default subscription;