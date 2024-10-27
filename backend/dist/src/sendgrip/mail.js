"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sendmail = void 0;
const mail_1 = __importDefault(require("@sendgrid/mail"));
const express_1 = require("express");
exports.Sendmail = (0, express_1.Router)();
mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
exports.Sendmail.post('/', (req, res) => {
    // Log request body and SendGrid API key
    console.log('Request body:', req.body);
    console.log('SendGrid API Key:', process.env.SENDGRID_API_KEY);
    const msg = {
        to: "vedican.v44@gmail.com",
        from: "hello@mytamildate.com",
        subject: "Test Email from Postman",
        text: "This is a test email sent from Postman using SendGrid",
        html: "<strong>This is a test email sent from Postman using SendGrid</strong>"
    };
    mail_1.default
        .send(msg)
        .then(() => {
        console.log('Email sent successfully');
        res.status(200).send('Email sent');
    })
        .catch((error) => {
        console.error('Failed to send email:', error);
        res.status(500).send('Failed to send email');
    });
});
