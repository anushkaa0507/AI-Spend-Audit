"use client";

import { useState } from "react";

export default function LeadCapture({
  auditId,
}: {
  auditId: string;
}) {

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      email: "",
      company: "",
      role: "",
      teamSize: 1,
    });

  async function saveLead() {

    try {

      setLoading(true);

      const response =
        await fetch(
          "/api/save-lead",
          {

            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              auditId,
              ...formData,
            }),
          }
        );

      const data =
        await response.json();

      if (data.success) {

        alert(
          "Lead saved successfully"
        );
      }

    } catch (error) {

      console.log(error);

      alert("Something went wrong");
    }

    setLoading(false);
  }

  return (

    <div className="border rounded-xl p-6 mt-8">

      <h2 className="text-2xl font-bold mb-4">

        Get Full Report

      </h2>

      <div className="space-y-4">

        <input
          type="email"

          placeholder="Email"

          className="w-full border p-3 rounded-lg"

          value={formData.email}

          onChange={(e) =>
            setFormData({
              ...formData,
              email: e.target.value,
            })
          }
        />

        <input
          type="text"

          placeholder="Company"

          className="w-full border p-3 rounded-lg"

          value={formData.company}

          onChange={(e) =>
            setFormData({
              ...formData,
              company:
                e.target.value,
            })
          }
        />

        <input
          type="text"

          placeholder="Role"

          className="w-full border p-3 rounded-lg"

          value={formData.role}

          onChange={(e) =>
            setFormData({
              ...formData,
              role: e.target.value,
            })
          }
        />

        <button
          onClick={saveLead}

          className="w-full bg-black text-white p-3 rounded-lg"
        >

          {
            loading
              ? "Saving..."
              : "Get Full Report"
          }

        </button>

      </div>

    </div>
  );
}