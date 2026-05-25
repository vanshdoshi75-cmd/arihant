import nodemailer from "nodemailer";

export async function GET() {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "manibhadra809@gmail.com",
      subject: "TEST MAIL",
      text: "MAIL WORKING SUCCESSFULLY",
    });

    return Response.json({
      success: true,
      message: "Mail sent",
    });
  } catch (error: any) {
    return Response.json({
      success: false,
      error: error.message,
    });
  }
}