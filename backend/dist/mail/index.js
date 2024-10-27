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
const ejs_1 = __importDefault(require("ejs"));
const mail_1 = __importDefault(require("@sendgrid/mail"));
class MailService {
    constructor() {
        this.from = process.env.EMAIL_HOST;
    }
    sendMail(to, subject, template, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const html = yield ejs_1.default.renderFile(__dirname + `/templates/${template}.ejs`, Object.assign(Object.assign({}, data), { logo: `${process.env.IMAGES_URL}/logo.png`, couple: `${process.env.IMAGES_URL}/couple.png`, mobile: `${process.env.IMAGES_URL}/mobile.png`, instagram: `${process.env.IMAGES_URL}/insta.png`, facebook: `${process.env.IMAGES_URL}/fbicon.png` }));
            mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
            const msg = {
                to,
                from: this.from,
                subject,
                html
            };
            yield mail_1.default.send(msg);
        });
    }
    sendVerificationMail(to, token) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.sendMail(to, 'Verify your email to access your myTamilDate account', 'verify', {
                link: token
            });
        });
    }
    sendNewApprovaRequestToadmin(to, name) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.sendMail(to, 'Verify your email to access your myTamilDate account', 'newapproval', {
                name,
            });
        });
    }
    sendSignUpMail(to) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.sendMail(to, 'You have successfully signed up for myTamilDate', 'signup', {
                link: `${process.env.URL}/Signinoptions`
            });
        });
    }
    sendReviewMail(to, name) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.sendMail(to, 'You can access your myTamilDate account soon', 'review', {
                name
            });
        });
    }
    sendMatchesMail(to, message, buttonText) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.sendMail(to, 'You have new matches on myTamilDate', 'matches', {
                type: 'match!',
                message,
                buttonText,
                image: `${process.env.IMAGES_URL}/matches.png`,
                link: `${process.env.URL}/user/home`
            });
        });
    }
    sendMessageMail(to, senderName) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.sendMail(to, 'You have received a new message on myTamilDate', 'matches', {
                type: 'message from ' + senderName,
                message: senderName + ' just sent you a message. Don\'t forget to reply!',
                buttonText: "Read Message",
                image: `${process.env.IMAGES_URL}/message.png`,
                link: `${process.env.URL}/user/home`
            });
        });
    }
    sendLikeMail(to, name, image) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.sendMail(to, 'You have received a new like on myTamilDate', 'likes', {
                name,
                image,
                link: `${process.env.URL}/user/home`
            });
        });
    }
    sendSpecialOfferMail(to, name) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.sendMail(to, 'You have a special offer on myTamilDate', 'special-offer', {
                name
            });
        });
    }
    sendPremiumMail(to, plan, total, discount, paid, date, invoice, nextPaymentDate) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.sendMail(to, 'You have successfully upgraded to myTamilDate Premium', 'premium', {
                plan: `MTD Premium Plan (${plan})`,
                total,
                discount,
                paid,
                date,
                invoice,
                nextPaymentDate
            });
            console.log("next payment date", nextPaymentDate);
        });
    }
    sendPauseAccountMail(to, name) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.sendMail(to, 'Come back! We have a special discount for you.', 'pause', {
                name,
                link: `${process.env.URL}/Signinoptions`
            });
        });
    }
    sendWeeklyMail(to, profiles) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.sendMail(to, 'New members have joined & one might be a perfect match! Check them out', 'week', {
                profiles: profiles,
                link: `${process.env.URL}/Signinoptions`
            });
        });
    }
    sendWeeklyLikesMail(to, profiles) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.sendMail(to, 'You have new likes! Check them out.', 'weeklike', {
                profiles: profiles,
                link: `${process.env.URL}/Signinoptions`
            });
        });
    }
    sendWeeklyMessagesMail(to, profiles) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.sendMail(to, 'You have new messages! Check them out.', 'weekmassage', {
                profiles: profiles,
                link: `${process.env.URL}/Signinoptions`
            });
        });
    }
}
exports.default = MailService;
