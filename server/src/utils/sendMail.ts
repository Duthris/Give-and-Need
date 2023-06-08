const nodemailer = require("nodemailer");

export const sendEmail = async (email: string, subject: string, htmlToSend?: any, message?: string) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            }
        });

        await transporter.sendMail({
            from: {
                name: "Give & Need",
            },
            to: email,
            subject: subject,
            html: htmlToSend ? htmlToSend : null,
            text: message ? message : null
        });

        console.log("Email successfully sent!");
    } catch (error) {
        console.log(error, `Something went wrong!\n${error}`);
    }
};