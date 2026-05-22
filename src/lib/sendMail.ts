import nodemailer from "nodemailer";

export async function sendStudentMail(
  email:string,
  username:string,
  password:string
){

const transporter =
nodemailer.createTransport({

service:"gmail",

auth:{

user:process.env.EMAIL_USER,

pass:process.env.EMAIL_PASS

}

});

await transporter.sendMail({

from:process.env.EMAIL_USER,

to:email,

subject:"Arihant Coaching Login Credentials",

html:`

<h2>Welcome to Arihant Coaching</h2>

<p>Your account has been created.</p>

<p>
<b>Username:</b>
${username}
</p>

<p>
<b>Password:</b>
${password}
</p>

<p>
Please login using these credentials.
</p>

`

});

}