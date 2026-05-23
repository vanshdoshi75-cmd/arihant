import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

  try {

    const data = await req.json();

    const transporter =
      nodemailer.createTransport({

        service: "gmail",

        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }

      });

    await transporter.sendMail({

      from: process.env.EMAIL_USER,

      to: data.email,

      subject:
        "Arihant Coaching Login Credentials",

      html: `

      <h2>Welcome to Arihant Coaching</h2>

      <p>Your account has been created.</p>

      <p>
      <b>Username:</b>
      ${data.username}
      </p>

      <p>
      <b>Password:</b>
      ${data.password}
      </p>

      `

    });

    return NextResponse.json({
      success: true
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        success: false,
        error: String(error)
      },
      {
        status: 500
      }
    );

  }

}