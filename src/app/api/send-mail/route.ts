import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(
req: Request
){

try{

const {
email,
username,
password
}
=
await req.json();

console.log(
"Sending mail to:",
email
);

const transporter =
nodemailer.createTransport({

service:"gmail",

auth:{
user:
process.env.EMAIL_USER,

pass:
process.env.EMAIL_PASS
}

});

const info =
await transporter.sendMail({

from:
process.env.EMAIL_USER,

to:
email,

subject:
"Arihant Coaching Login Credentials",

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

`

});

console.log(
"Mail sent:",
info.messageId
);

return NextResponse.json({
success:true
});

}catch(error:any){

console.log(
"MAIL ERROR:",
error
);

return NextResponse.json(
{
success:false,
message:error.message
},
{
status:500
}
);

}

}