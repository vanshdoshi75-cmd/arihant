import { Resend } from "resend";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

export async function GET() {

  try {

    const data =
      await resend.emails.send({
        from:
          "Arihant Coaching <onboarding@resend.dev>",

        to:
          "vanshdoshi75@gmail.com",

        subject:
          "TEST MAIL",

        html:
          "<h1>MAIL WORKING SUCCESSFULLY</h1>",
      });

    return Response.json(data);

  } catch (error: any) {

    return Response.json({
      success: false,
      error: error.message,
    });

  }
}