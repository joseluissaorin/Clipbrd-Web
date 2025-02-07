import { createClient } from "@/libs/supabase/server";
import { generateLicense } from "@/libs/licenses";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const supabase = createClient();
    const { userId, subscriptionId, expiresAt } = await req.json();

    if (!userId || !subscriptionId || !expiresAt) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || user.id !== userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user already has an active license
    const { data: existingLicenses } = await supabase
      .from('licenses')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (existingLicenses) {
      return NextResponse.json({ license: existingLicenses });
    }

    // Generate the license
    const license = await generateLicense(
      userId,
      subscriptionId,
      new Date(expiresAt)
    );

    if (!license) {
      throw new Error('Failed to generate license');
    }

    return NextResponse.json({ license });
  } catch (error) {
    console.error("Error generating license:", error);
    return NextResponse.json(
      { error: error.message || "Error generating license" },
      { status: 500 }
    );
  }
} 