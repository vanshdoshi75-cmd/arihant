import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {

  try {

    const {
      email,
      username,
      password,
    } = await req.json();

    const transporter =
      nodemailer.createTransport({
        service: "gmail",
        auth: {
          user:
            process.env.EMAIL_USER,
          pass:
            process.env.EMAIL_PASS,
        },
      });

    await transporter.sendMail({
      from:
        process.env.EMAIL_USER,

      to: email,

      subject:
        "Arihant Coaching Login Details",

      html: `
        <h2>Arihant Coaching</h2>

        <p>Your account has been created.</p>

        <p>
          <b>Username:</b>
          ${username}
        </p>

        <p>
          <b>Password:</b>
          ${password}
        </p>
      `,
    });

    return NextResponse.json({
      success: true,
    });

  } catch (error: any) {

    console.log(error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}