import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    }
  );
}

export async function POST(req: Request) {
  try {
    const { email, username, password } = await req.json();

    const transporter = nodemailer.createTransport({
  host: "64.233.184.108",
  port: 587,
  secure: false,
  tls: {
    servername: "smtp.gmail.com",
  },
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

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

    return NextResponse.json(
      { success: true },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}