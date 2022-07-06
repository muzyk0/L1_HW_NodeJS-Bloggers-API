import nodemailer from 'nodemailer';
import { settings } from '../constants';

export class EmailService {
    async sendEmail(email: string, subject: string, template: string) {
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        // let testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: settings.EMAIL_FROM, // generated ethereal user
                pass: settings.EMAIL_FROM_PASSWORD, // generated ethereal password
            },
        });

        try {
            // send mail with defined transport object
            const info = await transporter.sendMail({
                from: '"9ART.ru 👻" <info@9art.ru>', // sender address
                to: email, // list of receivers
                subject, // Subject line
                // text: "Hello world?", // plain text body
                html: template, // html body
            });

            console.log('Message sent: %s', info);
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        } catch (e) {
            console.log(`email isn't send. Error: ` + e);
        }
    }
}
