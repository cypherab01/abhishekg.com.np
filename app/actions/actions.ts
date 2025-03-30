"use server";

import nodemailer from "nodemailer";

async function sendEmail(fullname: string, email: string, message: string) {
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
      subject: `${fullname} sent you a message`,
      html: `
      <h1>Message from ${fullname}</h1>
      <p>Email: ${email}</p>
      <p>${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    return {
      success: "Message sent successfully, I'll get back to you soon. 🤖",
    };
  } catch (error: any) {
    return {
      error:
        "There seems a problem with the email service, please try again later. 🤖",
    };
  }
}

export async function sendMessageServerAction(
  previousState: any,
  formData: FormData
) {
  // Validate inputs first
  const fullname = formData.get("fullname") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;

  // validate fullname
  if (fullname?.length <= 4) {
    return {
      fullnameError: "Why your name is so short? 😂 Try full name instead.",
    };
  }

  // validate email using regex
  if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return {
      emailError:
        "Uh!, seems like my regex couldn't validate your email address 😉 try again.",
    };
  }

  // validate message
  if (message?.length <= 10) {
    return {
      messageError: "Why so short? Feel free to express your thoughts.",
    };
  }

  // If validation passes, try to send email
  try {
    const response = await sendEmail(fullname, email, message);
    console.log("Response: ", response);
    if (response.success) {
      return {
        success: "Message sent successfully, I'll get back to you soon. 🤖",
      };
    }
    return {
      error: "Something went wrong, please try again later. 🤖",
    };
  } catch (error: any) {
    return {
      error: "Something went wrong, please try again later. 🤖",
    };
  }
}
