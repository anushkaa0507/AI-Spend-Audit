'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { auditApi } from '@/lib/api';
import { SavingsHero } from '@/src/frontend-src/src/components/SavingsHero';
import { RecommendationCard, NoOpRow } from '@/src/components/RecommendationCard';
import {
  LeadCaptureModal,
  InlineLeadCapture,
} from '@/src/components/LeadCaptureModal';
import { ButtonDark } from '@/src/components/ui/Button';
import type { ResultData } from '@/lib/types';

export default function ResultsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const [data, setData] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await auditApi.getResult(id);
        if (res.success) {
          setData(res.data);
        } else {
          setError('Audit not found.');
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load audit.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // ── Loading ────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="page-light flex items-center justify-center min-h-dvh">
        <div className="text-center">
          <div
            className="text-black mb-3"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2.5rem',
              letterSpacing: '0.05em',
            }}
          >
            AUDITING...
          </div>
          <p className="font-mono text-sm text-black/40">
            Analysing your AI stack
          </p>
        </div>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────
  if (error || !data) {
    return (
      <div className="page-light flex items-center justify-center min-h-dvh">
        <div className="text-center max-w-md px-6">
          <div
            className="text-black mb-3"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2.5rem',
            }}
          >
            NOT FOUND
          </div>
          <p className="font-mono text-sm text-black/50 mb-6">
            {error || 'This audit does not exist or has expired.'}
          </p>
          <ButtonDark variant="outline" size="md" onClick={() => router.push('/')}>
            ← Run a new audit
          </ButtonDark>
        </div>
      </div>
    );
  }

  const { results, tools, ai_summary, total_monthly_savings, total_annual_savings } = data;
  const isHighSavings = total_monthly_savings > 500;
  const isLowSavings = total_monthly_savings < 100;

  // Build a lookup: tool name → current spend
  const spendByTool: Record<string, number> = {};
  tools.forEach((t) => {
    spendByTool[t.name] = t.monthlySpend;
  });

  // Tools with no recommendation
  const recommendedToolNames = new Set(results.map((r) => r.tool));
  const unrecommendedTools = tools.filter((t) => !recommendedToolNames.has(t.name));

  const date = new Date(data.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="page-light">
      {/* Lead capture modal */}
      {showModal && (
        <LeadCaptureModal
          auditId={id}
          totalMonthlySavings={total_monthly_savings}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setLeadCaptured(true);
            setShowModal(false);
          }}
        />
      )}

      {/* ── Nav ────────────────────────────────────────────────────────── */}
      <nav
        className="flex items-center justify-between px-6 py-5"
        style={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}
      >
        <button
          onClick={() => router.push('/')}
          className="font-mono text-xs text-black/40 hover:text-black transition-colors"
          style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', letterSpacing: '0.08em' }}
        >
          STACKAUDIT
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyLink}
            className="font-mono text-xs text-black/40 hover:text-black transition-colors flex items-center gap-1.5"
          >
            {copied ? '✓ Copied' : '↗ Share'}
          </button>
          <ButtonDark variant="outline" size="sm" onClick={() => router.push('/')}>
            New Audit
          </ButtonDark>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">

        {/* Audit meta */}
        <div className="flex items-center gap-3 mb-10 fade-up">
          <span className="font-mono text-xs text-black/30 uppercase tracking-widest">
            Audit
          </span>
          <span className="font-mono text-xs text-black/20">·</span>
          <span className="font-mono text-xs text-black/30 uppercase tracking-widest">
            {date}
          </span>
          <span className="font-mono text-xs text-black/20">·</span>
          <span className="font-mono text-xs text-black/20" title={id}>
            {id.split('-')[0].toUpperCase()}
          </span>
        </div>

        {/* ── Hero savings ─────────────────────────────────────────────── */}
        <div className="mb-12 fade-up fade-up-1">
          <SavingsHero
            totalMonthlySavings={total_monthly_savings}
            totalAnnualSavings={total_annual_savings}
          />
        </div>

        {/* ── High-savings Credex CTA ───────────────────────────────────── */}
        {isHighSavings && (
          <div
            className="mb-12 p-6 bg-black text-white fade-up fade-up-2"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div
                  className="text-white mb-1"
                  style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}
                >
                  SAVE EVEN MORE WITH CREDEX
                </div>
                <p className="font-mono text-xs text-white/50 leading-relaxed max-w-md">
                  Credex sells discounted AI credits — Cursor, Claude, ChatGPT Enterprise
                  and others — sourced from companies that overforecast. Your savings
                  opportunity qualifies you for a consultation.
                </p>
              </div>
              <ButtonDark
                variant="primary"
                size="md"
                onClick={() => setShowModal(true)}
                className="shrink-0"
                style={{
                  background: 'white',
                  color: 'black',
                  border: '1px solid white',
                }}
              >
                Book a consultation →
              </ButtonDark>
            </div>
          </div>
        )}

        {/* ── Per-tool recommendations ──────────────────────────────────── */}
        <section className="mb-12 fade-up fade-up-2">
          <h2 className="font-mono text-xs uppercase tracking-widest text-black/40 mb-4">
            Tool-by-tool breakdown
          </h2>
          <div style={{ border: '1px solid rgba(0,0,0,0.1)' }} className="px-6">
            {results.map((rec, i) => (
              <RecommendationCard
                key={rec.tool}
                recommendation={rec}
                currentSpend={spendByTool[rec.tool] ?? 0}
                isLast={i === results.length - 1 && unrecommendedTools.length === 0}
              />
            ))}
            {unrecommendedTools.map((tool, i) => (
              <NoOpRow
                key={tool.name}
                toolName={tool.name}
                currentSpend={tool.monthlySpend}
                isLast={i === unrecommendedTools.length - 1}
              />
            ))}
          </div>
        </section>

        {/* ── AI Summary ───────────────────────────────────────────────── */}
        {ai_summary && (
          <section className="mb-12 fade-up fade-up-3">
            <h2 className="font-mono text-xs uppercase tracking-widest text-black/40 mb-4">
              AI Assessment
            </h2>
            <div
              className="p-6"
              style={{ border: '1px solid rgba(0,0,0,0.1)', borderLeft: '3px solid #000' }}
            >
              <p className="font-mono text-sm text-black/70 leading-relaxed">
                {ai_summary.trim()}
              </p>
            </div>
          </section>
        )}

        {/* ── Lead capture ─────────────────────────────────────────────── */}
        {!leadCaptured && (
          <section className="mb-12 fade-up fade-up-4">
            <div
              className="p-6"
              style={{ border: '1px solid rgba(0,0,0,0.1)' }}
            >
              {isLowSavings ? (
                // Low-savings: inline, no-pressure
                <div>
                  <h2 className="font-mono text-xs uppercase tracking-widest text-black/40 mb-1">
                    Your stack looks healthy
                  </h2>
                  <p className="font-mono text-sm text-black/50 mb-5">
                    No significant savings found right now. Want us to notify you
                    when new optimizations apply to your stack?
                  </p>
                  <InlineLeadCapture auditId={id} />
                </div>
              ) : (
                // Has savings: full capture
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2
                      className="text-black mb-1"
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.6rem',
                      }}
                    >
                      GET YOUR FULL REPORT
                    </h2>
                    <p className="font-mono text-xs text-black/50">
                      We'll email you this audit plus specific next steps.
                    </p>
                  </div>
                  <ButtonDark
                    variant="primary"
                    size="md"
                    onClick={() => setShowModal(true)}
                    className="shrink-0"
                  >
                    Email me this report →
                  </ButtonDark>
                </div>
              )}
            </div>
          </section>
        )}

        {leadCaptured && (
          <div
            className="mb-12 p-6 fade-up"
            style={{ border: '1px solid rgba(0,0,0,0.1)' }}
          >
            <p className="font-mono text-sm text-black/50">
              ✓ Report on its way — check your inbox.
            </p>
          </div>
        )}

        {/* ── Share ────────────────────────────────────────────────────── */}
        <section className="mb-12 fade-up fade-up-5">
          <h2 className="font-mono text-xs uppercase tracking-widest text-black/40 mb-4">
            Share this audit
          </h2>
          <div
            className="p-5 flex flex-col sm:flex-row sm:items-center gap-3"
            style={{ border: '1px solid rgba(0,0,0,0.1)' }}
          >
            <code
              className="font-mono text-xs text-black/50 flex-1 break-all"
            >
              {typeof window !== 'undefined' ? window.location.href : `stackaudit.io/results/${id}`}
            </code>
            <ButtonDark
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="shrink-0"
            >
              {copied ? '✓ Copied' : 'Copy link'}
            </ButtonDark>
          </div>
        </section>

        {/* ── Footer ───────────────────────────────────────────────────── */}
        <div
          className="pt-6 flex items-center justify-between"
          style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}
        >
          <span
            className="text-black/20"
            style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', letterSpacing: '0.08em' }}
          >
            STACKAUDIT
          </span>
          <button
            onClick={() => router.push('/')}
            className="font-mono text-xs text-black/30 hover:text-black transition-colors"
          >
            ← Run another audit
          </button>
        </div>
      </div>
    </div>
  );
}