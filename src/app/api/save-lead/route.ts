import { supabase }
from "@/lib/supabase";

import { v4 as uuid }
from "uuid";

export async function POST(
  req: Request
) {

  try {

    const body =
      await req.json();

    await supabase
      .from("leads")
      .insert({
        id: uuid(),
        audit_id:
          body.auditId,
        email:
          body.email,
        company:
          body.company,
        role:
          body.role,
        team_size:
          body.teamSize,
      });

    return Response.json({
      success: true,
    });

  } catch {

    return Response.json({
      success: false,
    });
  }
}