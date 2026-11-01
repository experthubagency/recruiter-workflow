"use client";

import { useState } from "react";
import { Copy, Check, Sparkles, Loader2 } from "lucide-react";

const STEPS = [
  { id: 1, title: "Step 1 · First Outreach" },
  { id: 2, title: "Step 2 · Opportunity Overview" },
  { id: 3, title: "Step 3 · CV / Next Stage" },
  { id: 4, title: "Step 4 · Resume Review" },
  { id: 5, title: "Step 5 · Profile Submission" },
  { id: 6, title: "Step 6 · Candidate Progression" },
];

export default function WorkflowPage() {
  const [currentStep, setCurrentStep] = useState(2);
  const [loading, setLoading] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const [inputs, setInputs] = useState({
    recruiterDetails: "Executive Search Consultant",
    candidateProfile: "",
    candidateReply: "",
    opportunityDetails: "",
    additionalDetails: "",
  });

  const [output, setOutput] = useState({
    subject: "",
    body: "",
  });

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: currentStep, inputs }),
      });
      const data = await res.json();
      if (res.ok) {
        setOutput({ subject: data.subject, body: data.body });
      } else {
        alert(data.error || "Generation error");
      }
    } catch {
      alert("Network error connecting to API route");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans">
      <aside className="w-72 border-r bg-white p-5 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <span className="h-3 w-3 rounded-full bg-emerald-500"></span>
            <h1 className="font-bold text-base text-slate-900 tracking-tight">Recruiting Workflow</h1>
          </div>
          <nav className="space-y-1">
            {STEPS.map((s) => (
              <button
                key={s.id}
                onClick={() => setCurrentStep(s.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  currentStep === s.id
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {s.title}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      <main className="flex-1 max-w-4xl p-8 space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            {STEPS.find((s) => s.id === currentStep)?.title}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Fill the inputs below and click generate to query Dahl / DeepSeek.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
              Recruiter Signature / Details
            </label>
            <textarea
              rows={2}
              className="w-full text-sm p-3 border rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
              value={inputs.recruiterDetails}
              onChange={(e) => setInputs({ ...inputs, recruiterDetails: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
              Candidate Profile / Background
            </label>
            <textarea
              rows={4}
              placeholder="Paste candidate resume, bio, or initial outreach context..."
              className="w-full text-sm p-3 border rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
              value={inputs.candidateProfile}
              onChange={(e) => setInputs({ ...inputs, candidateProfile: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
              Candidate Latest Reply
            </label>
            <textarea
              rows={3}
              placeholder="Paste what the candidate replied with..."
              className="w-full text-sm p-3 border rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
              value={inputs.candidateReply}
              onChange={(e) => setInputs({ ...inputs, candidateReply: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
              Job Description / Mandate Details
            </label>
            <textarea
              rows={4}
              placeholder="Paste target role, title, location, comp package..."
              className="w-full text-sm p-3 border rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
              value={inputs.opportunityDetails}
              onChange={(e) => setInputs({ ...inputs, opportunityDetails: e.target.value })}
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {loading ? "Generating Output..." : "Generate Output"}
          </button>
        </div>

        {(output.subject || output.body) && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-slate-600 uppercase">Subject</span>
                <button
                  onClick={() => copyToClipboard(output.subject, "subject")}
                  className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 font-medium cursor-pointer"
                >
                  {copiedField === "subject" ? (
                    <Check className="w-3.5 h-3.5 text-green-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  Copy Subject
                </button>
              </div>
              <input
                readOnly
                value={output.subject}
                className="w-full p-2.5 text-sm bg-slate-50 border rounded-lg outline-none font-medium"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-slate-600 uppercase">Message Body</span>
                <button
                  onClick={() => copyToClipboard(output.body, "body")}
                  className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 font-medium cursor-pointer"
                >
                  {copiedField === "body" ? (
                    <Check className="w-3.5 h-3.5 text-green-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  Copy Body
                </button>
              </div>
              <textarea
                readOnly
                rows={10}
                value={output.body}
                className="w-full p-3 text-sm bg-slate-50 border rounded-lg outline-none leading-relaxed"
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}