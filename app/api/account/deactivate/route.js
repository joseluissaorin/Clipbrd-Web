import { createClient } from "@/libs/supabase/server";
import { deactivateAccount } from "@/libs/user";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    await deactivateAccount(user.id);

    // Sign out the user
    await supabase.auth.signOut();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deactivating account:", error);
    return NextResponse.json(
      { error: "Failed to deactivate account" },
      { status: 500 }
    );
  }
} 