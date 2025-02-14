import { createClient } from "@/libs/supabase/server";
import { NextResponse } from "next/server";

export const runtime = 'edge';

export async function GET() {
  try {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data: licenses, error } = await supabase
      .from("licenses")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching licenses:", error);
      return NextResponse.json(
        { error: "Error fetching licenses" },
        { status: 500 }
      );
    }

    return NextResponse.json({ licenses });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: e?.message || "Internal server error" },
      { status: 500 }
    );
  }
} 