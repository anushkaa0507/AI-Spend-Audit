import { supabase } from "@/lib/supabase";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  try {

    const { id } = await params;

    const { data, error } =
      await supabase

        .from("audits")

        .select("*")

        .eq("id", id)

        .single();

    if (error) {

      return Response.json({
        success: false,
        error,
      });
    }

    return Response.json({
      success: true,
      data,
    });

  } catch (error) {

    console.log(error);

    return Response.json({
      success: false,
      error,
    });
  }
}