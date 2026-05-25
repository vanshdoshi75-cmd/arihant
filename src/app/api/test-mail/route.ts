import nodemailer from "nodemailer";

export async function GET() {

  try {

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

      to:
        "manibhadra809@gmail.com",

      subject:
        "TEST MAIL",

      text:
        "MAIL WORKING",

    });

    return Response.json({
      success: true,
    });

  } catch (error: any) {

    console.log(error);

    return Response.json({
      success: false,
      error: error.message,
    });

  }
}