import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log("API PARAMS:", params);

    const { data, error } = await supabase
      .from("audits")
      .select("*")
      .eq("id", params.id)
      .single();

    console.log("API DATA:", data);
    console.log("API ERROR:", error);

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Results fetch error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Fetch failed",
      },
      { status: 500 }
    );
  }
}