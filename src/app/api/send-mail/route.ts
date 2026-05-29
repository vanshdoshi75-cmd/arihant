export async function POST(req: Request) {
  try {
    const {
      email,
      username,
      password,
    } = await req.json();

    const response = await fetch(
      "https://api.brevo.com/v3/smtp/email",
      {
        method: "POST",
        headers: {
          accept: "application/json",
          "api-key": process.env.BREVO_API_KEY || "",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          sender: {
            name: "Arihant Coaching",
            email: "noreply@brevo.com",
          },
          to: [
            {
              email,
            },
          ],
          subject: "Arihant Coaching Login Details",
          htmlContent: `
            <h2>Arihant Coaching</h2>
            <p>Your account has been created.</p>
            <p><b>Username:</b> ${username}</p>
            <p><b>Password:</b> ${password}</p>
          `,
        }),
      }
    );

    const data = await response.json();

    return Response.json({
      success: response.ok,
      status: response.status,
      data,
    });
  } catch (error: any) {
    return Response.json({
      success: false,
      error: error.message,
    });
  }
}