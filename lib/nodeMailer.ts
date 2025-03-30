import nodemailer from "nodemailer";

export const sendEmail = async ({
  fullname,
  email,
  message,
}: {
  fullname: string;
  email: string;
  message: string;
}) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.NODEMAILER_HOST,
      port: parseInt(process.env.NODEMAILER_PORT!),
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
      },
    });

    const mailOptions = {
      from: process.env.USER_MAILER,
      to: process.env.USER_TO,
      subject: `${fullname} sent you a message via your website`,
      html: `
      <h1>Message from ${fullname}</h1>
      <p>Email: ${email}</p>
      <p>${message}</p>
      `,
    };

    const mailresponse = await transporter.sendMail(mailOptions);
    console.log("Mail Response: ", mailresponse);
    return mailresponse;
  } catch (error: any) {
    return {
      error:
        "There seems a problem with the email service, please try again later. 🤖",
    };
  }
};
