import sgMail from '@sendgrid/mail';
import express, { Router } from 'express';
import { UserRequest } from '../types/types';

export const Sendmail = Router();

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

Sendmail.post('/', (req: UserRequest, res: express.Response) => {
  

  // Log request body and SendGrid API key
  console.log('Request body:', req.body);
  console.log('SendGrid API Key:', process.env.SENDGRID_API_KEY);

  

  const msg: sgMail.MailDataRequired = {
    to :"vedican.v44@gmail.com",
    from  : "hello@mytamildate.com",
    subject:  "Test Email from Postman",
    text:  "This is a test email sent from Postman using SendGrid",
    html:  "<strong>This is a test email sent from Postman using SendGrid</strong>"
  };

  sgMail
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
