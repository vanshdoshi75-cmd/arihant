import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/firebase/firebaseAdmin";

export async function POST(
  request: NextRequest
) {
  try {

    const body =
      await request.json();

    const uid =
      body.uid;

    if (!uid) {

      return NextResponse.json(
        {
          success:false,
          message:"UID missing"
        },
        { status:400 }
      );

    }

    await adminAuth.deleteUser(
      uid
    );

    return NextResponse.json({
      success:true
    });

  } catch(error){

    console.log(
      "DELETE ERROR:",
      error
    );

    return NextResponse.json(
      {
        success:false
      },
      { status:500 }
    );

  }
}