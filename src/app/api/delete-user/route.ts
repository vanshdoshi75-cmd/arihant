import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/firebase/firebaseAdmin";

export async function POST(
  request: NextRequest
) {
  try {
    const { uid } =
      await request.json();

    await adminAuth.deleteUser(uid);

    return NextResponse.json({
      success:true
    });

  } catch {

    return NextResponse.json(
      { success:false },
      { status:500 }
    );

  }
}