import { NextResponse }
from "next/server";

import { adminAuth }
from "@/firebase/firebaseAdmin";

export async function POST(
req:Request
){

try{

const { uid } =
await req.json();

await adminAuth.deleteUser(uid);

return NextResponse.json({
success:true
});

}catch(error){

console.log(error);

return NextResponse.json(
{
success:false
},
{
status:500
}
);

}

}