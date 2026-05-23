import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email, username, password } =
      await req.json();

    if (!email || !username || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing email, username, or password",
        },
        { status: 400 }
      );
    }

    const transporter =
      nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

    await transporter.verify();

    await transporter.sendMail({
      from: `"Arihant Coaching" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Arihant Coaching Login Details",
      html: `
        <h2>Arihant Coaching</h2>
        <p>Your account has been created.</p>
        <p><b>Username:</b> ${username}</p>
        <p><b>Password:</b> ${password}</p>
      `,
    });

    return NextResponse.json({
      success: true,
    });

  } catch (error: any) {
    console.log("MAIL API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}