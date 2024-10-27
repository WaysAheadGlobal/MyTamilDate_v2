import ejs from 'ejs';
import sgMail from '@sendgrid/mail';

type Profile = {
    name: string;
    image: string;
    link: string;
}

class MailService {
    private from: string;

    constructor() {
        this.from = process.env.EMAIL_HOST!;
    }

    private async sendMail(to: string, subject: string, template: string, data: Record<string, string | number | Profile[]>) {
        const html: string = await ejs.renderFile(__dirname + `/templates/${template}.ejs`, {
            ...data,
            logo: `${process.env.IMAGES_URL}/logo.png`,
            couple: `${process.env.IMAGES_URL}/couple.png`,
            mobile: `${process.env.IMAGES_URL}/mobile.png`,
            instagram: `${process.env.IMAGES_URL}/insta.png`,
            facebook: `${process.env.IMAGES_URL}/fbicon.png`,
        });

        sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

        const msg = {
            to,
            from: this.from,
            subject,
            html
        };
        await sgMail.send(msg);
    }

    async sendVerificationMail(to: string, token: string) {
        await this.sendMail(to, 'Verify your email to access your myTamilDate account', 'verify', {
            link: token
        });
    }
    async sendNewApprovaRequestToadmin(to: string, name: string) {
        await this.sendMail(to, 'Verify your email to access your myTamilDate account', 'newapproval', {
           name,
          
        });
    }

    async sendSignUpMail(to: string) {
        await this.sendMail(to, 'You have successfully signed up for myTamilDate', 'signup', {
             link : `${process.env.URL}/Signinoptions`
        });
    }

    async sendReviewMail(to: string, name: string) {
        await this.sendMail(to, 'You can access your myTamilDate account soon', 'review', {
            name
        });
    }

    async sendMatchesMail(to: string, message: string, buttonText: string) {
        await this.sendMail(to, 'You have new matches on myTamilDate', 'matches', {
            type: 'match!',
            message,
            buttonText,
            image: `${process.env.IMAGES_URL}/matches.png`,
            link : `${process.env.URL}/user/home`

        });
    }

    async sendMessageMail(to: string, senderName: string) {
        await this.sendMail(to, 'You have received a new message on myTamilDate', 'matches', {
            type: 'message from ' + senderName,
            message: senderName + ' just sent you a message. Don\'t forget to reply!',
            buttonText: "Read Message",
            image: `${process.env.IMAGES_URL}/message.png`,
              link : `${process.env.URL}/user/home`
        });
    }

    async sendLikeMail(to: string, name: string, image: string) {
        await this.sendMail(to, 'You have received a new like on myTamilDate', 'likes', {
            name,
            image,
            link : `${process.env.URL}/user/home`
        });
    }

    async sendSpecialOfferMail(to: string, name: string) {
        await this.sendMail(to, 'You have a special offer on myTamilDate', 'special-offer', {
            name
        });
    }

    async sendPremiumMail(to: string, plan: string, total: number, discount: number, paid: number, date: string, invoice: string, nextPaymentDate: string) {
        await this.sendMail(to, 'You have successfully upgraded to myTamilDate Premium', 'premium', {
            plan: `MTD Premium Plan (${plan})`,
            total,
            discount,
            paid,
            date,
            invoice,
            nextPaymentDate
        });
        console.log( "next payment date" ,  nextPaymentDate)
    }

    async sendPauseAccountMail(to: string, name: string) {
        await this.sendMail(to, 'Come back! We have a special discount for you.', 'pause', {
            name,
             link : `${process.env.URL}/Signinoptions`
        });
    }

    async sendWeeklyMail(to: string, profiles: Profile[]) {
        await this.sendMail(to, 'New members have joined & one might be a perfect match! Check them out', 'week', {
            profiles: profiles,
             link : `${process.env.URL}/Signinoptions`
        });
    }
    
    async sendWeeklyLikesMail(to: string, profiles: Profile[]) {
        await this.sendMail(to, 'You have new likes! Check them out.', 'weeklike', {
            profiles: profiles,
             link : `${process.env.URL}/Signinoptions`
        });
    }

    async sendWeeklyMessagesMail(to: string, profiles: Profile[]) {
        await this.sendMail(to, 'You have new messages! Check them out.', 'weekmassage', {
            profiles: profiles,
            link : `${process.env.URL}/Signinoptions`
        });
    }
    
}

export default MailService;