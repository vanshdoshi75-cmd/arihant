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

console.log(
"Deleting UID:",
uid
);

await adminAuth.deleteUser(
uid
);

console.log(
"Deleted successfully"
);

return NextResponse.json({
success:true
});

}catch(error:any){

console.log(
"DELETE USER ERROR:",
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