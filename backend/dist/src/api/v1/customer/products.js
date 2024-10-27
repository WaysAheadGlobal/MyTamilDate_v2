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
const verifyUser_1 = require("../../../middleware/verifyUser");
const products = (0, express_1.Router)();
products.use(verifyUser_1.verifyUser);
products.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
    const products = yield stripe.products.list();
    const prices = yield stripe.prices.list();
    let data = [];
    for (const product of products.data) {
        const price = prices.data.find((price) => price.product === product.id);
        data.push({
            id: product.id,
            name: product.name,
            description: product.description,
            price: price === null || price === void 0 ? void 0 : price.unit_amount,
            currency: price === null || price === void 0 ? void 0 : price.currency,
        });
    }
    res.status(200).json(data);
}));
exports.default = products;
