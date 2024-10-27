import { Router } from "express";
import Stripe from "stripe";
import { verifyUser } from "../../../middleware/verifyUser";

const products = Router();
products.use(verifyUser);

products.get("/", async (req, res) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    const products = await stripe.products.list();

    const prices = await stripe.prices.list();

    let data = [];

    for (const product of products.data) {
        const price = prices.data.find((price) => price.product === product.id);

        data.push({
            id: product.id,
            name: product.name,
            description: product.description,
            price: price?.unit_amount,
            currency: price?.currency,
        });
    }

    res.status(200).json(data);
});

export default products;