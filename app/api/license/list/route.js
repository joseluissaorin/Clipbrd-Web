import { getUserLicenses } from "@/libs/licenses";
import { createClient } from "@/libs/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req) {
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

    const licenses = await getUserLicenses(user.id);

    return NextResponse.json({ licenses });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: e?.message || "Error fetching licenses" },
      { status: 500 }
    );
  }
} 