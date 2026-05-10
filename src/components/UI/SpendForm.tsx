"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

export default function SpendForm() {

  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      teamSize: 2,

      primaryUseCase: "coding",

      tools: [
        {
          name: "ChatGPT",

          plan: "Team",

          monthlySpend: 60,

          seats: 2,
        },
      ],
    });

  async function runAudit() {

    try {

      setLoading(true);

      const response =
        await fetch("/api/audit", {

          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify(formData),
        });

      const data =
        await response.json();

      console.log(data);

      if (data.success) {

        router.push(
          `/results/${data.id}`
        );
      }

    } catch (error) {

      console.log(error);

      alert("Something went wrong");
    }

    setLoading(false);
  }

  return (

    <section className="max-w-3xl mx-auto p-6">

      <div className="border rounded-xl p-6 space-y-4">

        <h2 className="text-3xl font-bold">

          Run Your Audit

        </h2>

        <input
          type="number"

          placeholder="Team Size"

          className="w-full border p-3 rounded-lg"

          value={formData.teamSize}

          onChange={(e) =>
            setFormData({
              ...formData,

              teamSize:
                Number(e.target.value),
            })
          }
        />

        <select
          className="w-full border p-3 rounded-lg"

          value={
            formData.tools[0].plan
          }

          onChange={(e) =>
            setFormData({
              ...formData,

              tools: [
                {
                  ...formData.tools[0],

                  plan:
                    e.target.value,
                },
              ],
            })
          }
        >

          <option>
            Team
          </option>

          <option>
            Plus
          </option>

        </select>

        <input
          type="number"

          placeholder="Monthly Spend"

          className="w-full border p-3 rounded-lg"

          value={
            formData.tools[0]
              .monthlySpend
          }

          onChange={(e) =>
            setFormData({
              ...formData,

              tools: [
                {
                  ...formData.tools[0],

                  monthlySpend:
                    Number(
                      e.target.value
                    ),
                },
              ],
            })
          }
        />

        <button
          onClick={runAudit}

          className="w-full bg-black text-white p-3 rounded-lg"
        >

          {
            loading
              ? "Running..."
              : "Get Audit"
          }

        </button>

      </div>

    </section>
  );
}