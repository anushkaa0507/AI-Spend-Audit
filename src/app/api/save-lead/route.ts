import { supabase } from "@/lib/supabase";

import { resend } from "@/lib/resend";

export async function POST(
  request: Request
) {

  try {

    const body =
      await request.json();

    const {
      auditId,
      email,
      company,
      role,
      teamSize,
    } = body;

    const { error } =
      await supabase

        .from("leads")

        .insert([
          {
            audit_id: auditId,
            email,
            company,
            role,
            team_size: teamSize,
          },
        ]);

    if (error) {

      return Response.json({
        success: false,
        error,
      });
    }

    await resend.emails.send({

      from:
        "onboarding@resend.dev",

      to: email,

      subject:
        "Your AI Spend Audit",

      html: `

        <h1>
          Audit Received
        </h1>

        <p>
          Thanks for using
          AI Spend Audit.
        </p>

        <p>
          Credex will reach out
          if major savings
          opportunities exist.
        </p>

      `,
    });

    return Response.json({
      success: true,
    });

  } catch (error) {

    console.log(error);

    return Response.json({
      success: false,
      error,
    });
  }
}