export async function GET() {
  try {
    const response = await fetch(
      "https://api.brevo.com/v3/smtp/email",
      {
        method: "POST",
        headers: {
          "accept": "application/json",
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
              email: "manibhadra809@gmail.com",
            },
          ],
          subject: "Brevo API Test",
          htmlContent:
            "<h1>Brevo API Working Successfully</h1>",
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