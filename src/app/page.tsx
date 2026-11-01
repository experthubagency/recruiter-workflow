"use client";

import React, { useState, useRef, useEffect } from "react";
import { Menu, X, Check } from "lucide-react";

interface FieldDef {
  key: string;
  label: string;
  helperText?: string;
  placeholder: string;
  type: "input" | "textarea";
  allowUpload?: boolean;
  uploadLabel?: string;
  multiple?: boolean;
  rows?: number;
}

interface StepDef {
  id: number;
  title: string;
  subtitle: string;
  badgeText?: string;
  outputLabel: string;
  copyBodyLabel: string;
  fields: FieldDef[];
}

const STEPS: StepDef[] = [
  {
    id: 1,
    title: "Step 1 · First Outreach",
    subtitle: "Save your recruiter details once, then click New Candidate to reuse them.",
    outputLabel: "Email body",
    copyBodyLabel: "Copy Email",
    fields: [
      {
        key: "candidateProfile",
        label: "Candidate profile",
        placeholder: "Paste the candidate profile or upload a file...",
        type: "textarea",
        allowUpload: true,
        uploadLabel: "Upload file",
        rows: 6,
      },
      {
        key: "opportunityDetails",
        label: "Job description / opportunity details",
        placeholder: "Paste the job description or mandate details...",
        type: "textarea",
        allowUpload: true,
        uploadLabel: "Upload file",
        rows: 5,
      },
    ],
  },
  {
    id: 2,
    title: "Step 2 · Opportunity Overview",
    subtitle: "Use only when you intentionally choose Step 2.",
    outputLabel: "Email body",
    copyBodyLabel: "Copy Email",
    fields: [
      {
        key: "candidateProfile",
        label: "Candidate profile",
        placeholder: "Paste the candidate profile or upload a file...",
        type: "textarea",
        allowUpload: true,
        uploadLabel: "Upload file",
        rows: 5,
      },
      {
        key: "candidateReply",
        label: "Candidate latest reply",
        placeholder: "Paste the candidate latest reply...",
        type: "textarea",
        allowUpload: true,
        uploadLabel: "Upload file",
        rows: 4,
      },
      {
        key: "targetCompany",
        label: "Target company (optional)",
        placeholder: "",
        type: "input",
      },
      {
        key: "location",
        label: "Location (optional)",
        placeholder: "",
        type: "input",
      },
      {
        key: "reportingStructure",
        label: "Reporting structure (optional)",
        placeholder: "",
        type: "input",
      },
      {
        key: "opportunityDetails",
        label: "Job description / opportunity details",
        placeholder: "Paste the mandate or opportunity details...",
        type: "textarea",
        allowUpload: true,
        uploadLabel: "Upload file",
        rows: 5,
      },
    ],
  },
  {
    id: 3,
    title: "Step 3 · CV / Next Stage",
    subtitle:
      "Uses the candidate profile, Step 2 opportunity details and latest reply. Company, role, location and reporting details are extracted from the opportunity text.",
    badgeText: "Live web research is configured.",
    outputLabel: "Email body",
    copyBodyLabel: "Copy Email",
    fields: [
      {
        key: "candidateProfile",
        label: "Candidate profile",
        placeholder: "Paste the candidate profile or upload a file...",
        type: "textarea",
        allowUpload: true,
        uploadLabel: "Upload file",
        rows: 4,
      },
      {
        key: "candidateReply",
        label: "Candidate latest reply",
        placeholder: "Paste the candidate latest message...",
        type: "textarea",
        allowUpload: true,
        uploadLabel: "Upload file",
        rows: 4,
      },
      {
        key: "opportunityDetails",
        label: "Previous Step 2 / job description / opportunity details",
        placeholder:
          "Paste the Step 2 output or job description. Company, role, location and reporting details will be read from this text...",
        type: "textarea",
        allowUpload: true,
        uploadLabel: "Upload file",
        rows: 5,
      },
    ],
  },
  {
    id: 4,
    title: "Step 4 · Resume Review",
    subtitle: "Review the candidate resume against the exact position and company details.",
    outputLabel: "Resume review",
    copyBodyLabel: "Copy Review",
    fields: [
      {
        key: "candidateProfile",
        label: "Candidate name and resume / CV",
        placeholder: "Paste the candidate name and complete resume / CV or upload the file...",
        type: "textarea",
        allowUpload: true,
        uploadLabel: "Upload file",
        rows: 5,
      },
      {
        key: "opportunityDetails",
        label: "Position, company and job description / opportunity details",
        placeholder:
          "Paste the exact position, company and job description or upload the opportunity file...",
        type: "textarea",
        allowUpload: true,
        uploadLabel: "Upload file",
        rows: 5,
      },
    ],
  },
  {
    id: 5,
    title: "Step 5 · Profile Submission",
    subtitle:
      "Confirm that the candidate resume and profile have been formally submitted for hiring manager and stakeholder review.",
    outputLabel: "Email body",
    copyBodyLabel: "Copy Email",
    fields: [
      {
        key: "candidateProfile",
        label: "Candidate resume / CV",
        helperText:
          "PDF and DOCX uploads preserve extracted wording and visual page layout in the background.",
        placeholder: "Paste the candidate resume here, or upload one or more resume files.",
        type: "textarea",
        allowUpload: true,
        uploadLabel: "Upload files",
        multiple: true,
        rows: 5,
      },
      {
        key: "opportunityDetails",
        label: "Step 2 / job description / opportunity details",
        helperText:
          "Use this section for the Step 2 message and the role or mandate details required by the Step 5 prompt.",
        placeholder:
          "Paste the actual Step 2 message and the relevant job description or opportunity details. You can also upload supporting opportunity documents.",
        type: "textarea",
        allowUpload: true,
        uploadLabel: "Upload files",
        multiple: true,
        rows: 5,
      },
      {
        key: "additionalDetails",
        label: "Additional details",
        helperText: "Optional unless you have additional verified information to include.",
        placeholder:
          "Paste the candidate latest response and any verified hiring information. You may also upload supporting documents.",
        type: "textarea",
        allowUpload: true,
        uploadLabel: "Upload files",
        multiple: true,
        rows: 4,
      },
    ],
  },
  {
    id: 6,
    title: "Step 6 · Candidate Progression",
    subtitle:
      "Create the next stage progression message and personalized four document request using verified hiring information.",
    outputLabel: "Email body",
    copyBodyLabel: "Copy Email",
    fields: [
      {
        key: "candidateProfile",
        label: "Candidate resume / CV",
        helperText:
          "PDF and DOCX uploads preserve extracted wording and visual page layout in the background.",
        placeholder: "Paste the candidate resume here, or upload one or more resume files.",
        type: "textarea",
        allowUpload: true,
        uploadLabel: "Upload files",
        multiple: true,
        rows: 5,
      },
      {
        key: "opportunityDetails",
        label: "Step 2 / job description / opportunity details",
        helperText: "The company and role should be identifiable from this material.",
        placeholder:
          "Paste the actual Step 2 message and the full job description or mandate. You can also upload supporting opportunity documents.",
        type: "textarea",
        allowUpload: true,
        uploadLabel: "Upload files",
        multiple: true,
        rows: 5,
      },
      {
        key: "additionalDetails",
        label: "Additional details and confirmed progression information",
        helperText:
          "Step 6 must only be used after progression is genuinely confirmed. Include that confirmation here.",
        placeholder:
          "Paste the Step 5 submission message, candidate latest response, confirmed stakeholder feedback, confirmed progression or next stage information, and reimbursement details only if verified. You may also upload supporting documents.",
        type: "textarea",
        allowUpload: true,
        uploadLabel: "Upload files",
        multiple: true,
        rows: 5,
      },
    ],
  },
];

type StepDataMap = Record<
  number,
  {
    inputs: Record<string, string>;
    output: { subject: string; body: string };
  }
>;

interface HistoryItem {
  id: string;
  stepId: number;
  stepTitle: string;
  subject: string;
  body: string;
  timestamp: string;
}

export default function WorkflowPage() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [activeView, setActiveView] = useState<"step" | "history">("step");
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [recruiterDetails, setRecruiterDetails] = useState<string>(
    "Ann Blythe\nIndependent Executive Recruiter / Search Consultant"
  );
  const [editingRecruiter, setEditingRecruiter] = useState<boolean>(false);

  const [stepState, setStepState] = useState<StepDataMap>({
    1: { inputs: {}, output: { subject: "", body: "" } },
    2: { inputs: {}, output: { subject: "", body: "" } },
    3: { inputs: {}, output: { subject: "", body: "" } },
    4: { inputs: {}, output: { subject: "", body: "" } },
    5: { inputs: {}, output: { subject: "", body: "" } },
    6: { inputs: {}, output: { subject: "", body: "" } },
  });

  const [history, setHistory] = useState<HistoryItem[]>([]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [targetFieldKey, setTargetFieldKey] = useState<string | null>(null);

  // Load saved state from localStorage
  useEffect(() => {
    try {
      const savedRecruiter = localStorage.getItem("rw_recruiter");
      if (savedRecruiter) setRecruiterDetails(savedRecruiter);
      const savedSteps = localStorage.getItem("rw_steps");
      if (savedSteps) setStepState(JSON.parse(savedSteps));
      const savedHistory = localStorage.getItem("rw_history");
      if (savedHistory) setHistory(JSON.parse(savedHistory));
    } catch {}
  }, []);

  // Save state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("rw_recruiter", recruiterDetails);
      localStorage.setItem("rw_steps", JSON.stringify(stepState));
      localStorage.setItem("rw_history", JSON.stringify(history));
    } catch {}
  }, [recruiterDetails, stepState, history]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const activeConfig = STEPS.find((s) => s.id === currentStep) || STEPS[0];
  const currentInputs = stepState[currentStep]?.inputs || {};
  const currentOutput = stepState[currentStep]?.output || { subject: "", body: "" };

  const updateInput = (key: string, value: string) => {
    setStepState((prev) => ({
      ...prev,
      [currentStep]: {
        ...prev[currentStep],
        inputs: {
          ...(prev[currentStep]?.inputs || {}),
          [key]: value,
        },
      },
    }));
  };

  // Real Client-Side PDF, DOCX, and Text Extraction
  const extractFileText = async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop()?.toLowerCase();

    if (ext === "docx") {
      if (!(window as any).mammoth) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js";
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Failed to load DOCX parser"));
          document.head.appendChild(script);
        });
      }
      const arrayBuffer = await file.arrayBuffer();
      const result = await (window as any).mammoth.extractRawText({ arrayBuffer });
      return result.value || "";
    }

    if (ext === "pdf") {
      if (!(window as any).pdfjsLib) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Failed to load PDF parser"));
          document.head.appendChild(script);
        });
      }
      const pdfjsLib = (window as any).pdfjsLib;
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map((item: any) => item.str).join(" ");
        fullText += pageText + "\n\n";
      }
      return fullText.trim();
    }

    return await file.text();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !targetFieldKey) return;

    setUploadingField(targetFieldKey);
    try {
      const extractedChunks: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const text = await extractFileText(files[i]);
        if (text) extractedChunks.push(text);
      }
      const combined = extractedChunks.join("\n\n---\n\n");
      const existing = currentInputs[targetFieldKey] || "";
      updateInput(targetFieldKey, existing ? `${existing}\n\n${combined}` : combined);
      showToast("File uploaded & extracted");
    } catch {
      alert("Could not extract text from file. Please paste the text directly.");
    } finally {
      setUploadingField(null);
      e.target.value = "";
    }
  };

  const triggerFileUpload = (key: string) => {
    setTargetFieldKey(key);
    fileInputRef.current?.click();
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step: currentStep,
          inputs: {
            ...currentInputs,
            recruiterDetails,
          },
        }),
      });

      const data = await res.json();
      if (res.ok) {
        const newOut = { subject: data.subject || "", body: data.body || "" };
        setStepState((prev) => ({
          ...prev,
          [currentStep]: {
            ...prev[currentStep],
            output: newOut,
          },
        }));

        setHistory((prev) => [
          {
            id: Date.now().toString(),
            stepId: currentStep,
            stepTitle: activeConfig.title,
            subject: newOut.subject,
            body: newOut.body,
            timestamp: new Date().toLocaleString(),
          },
          ...prev.slice(0, 29),
        ]);
      } else {
        alert(data.error || "Failed to generate message.");
      }
    } catch {
      alert("Network error calling /api/generate");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    showToast("Copied");
  };

  const clearGenerated = () => {
    setStepState((prev) => ({
      ...prev,
      [currentStep]: {
        ...prev[currentStep],
        output: { subject: "", body: "" },
      },
    }));
  };

  const clearCurrentStepAll = () => {
    setStepState((prev) => ({
      ...prev,
      [currentStep]: {
        inputs: {},
        output: { subject: "", body: "" },
      },
    }));
    showToast("Cleared");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans pb-28">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".txt,.md,.pdf,.docx,.doc"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDrawerOpen(true)}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-700 cursor-pointer"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-bold text-slate-900 text-base leading-tight">
            Executive Recruiting Workflow
          </span>
        </div>
        <button
          onClick={clearCurrentStepAll}
          className="text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer"
        >
          New Candidate
        </button>
      </header>

      {/* Slide-out Navigation Drawer (Matches Reference Video) */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-[1px]"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="relative w-72 max-w-[82vw] bg-white h-full shadow-2xl flex flex-col justify-between p-5 z-10 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <span className="font-bold text-slate-900 text-base">
                  Recruiting Workflow
                </span>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1">
                {STEPS.map((step) => {
                  const active = activeView === "step" && currentStep === step.id;
                  return (
                    <button
                      key={step.id}
                      onClick={() => {
                        setCurrentStep(step.id);
                        setActiveView("step");
                        setDrawerOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-3 rounded-xl text-sm font-medium transition cursor-pointer ${
                        active
                          ? "bg-blue-50/80 text-slate-900 font-semibold border border-blue-200"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {step.title}
                    </button>
                  );
                })}

                <div className="pt-4 mt-4 border-t border-slate-100 space-y-1">
                  <button
                    onClick={() => {
                      setActiveView("history");
                      setDrawerOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer ${
                      activeView === "history"
                        ? "bg-blue-50 text-slate-900 font-semibold"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    History ({history.length})
                  </button>
                </div>
              </nav>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Container */}
      <main className="w-full max-w-2xl mx-auto px-4 pt-6 space-y-5">
        {activeView === "history" ? (
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-slate-900">Generation History</h1>
            {history.length === 0 ? (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 text-sm text-slate-500">
                No messages generated yet.
              </div>
            ) : (
              history.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2 shadow-xs"
                >
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span className="font-semibold text-slate-700">{item.stepTitle}</span>
                    <span>{item.timestamp}</span>
                  </div>
                  <div className="text-sm font-semibold text-slate-900">{item.subject}</div>
                  <pre className="text-xs text-slate-600 whitespace-pre-wrap font-sans bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {item.body}
                  </pre>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => copyToClipboard(item.subject)}
                      className="text-xs px-3 py-1.5 border border-slate-200 rounded-lg font-medium hover:bg-slate-50"
                    >
                      Copy Subject
                    </button>
                    <button
                      onClick={() => copyToClipboard(item.body)}
                      className="text-xs px-3 py-1.5 border border-slate-200 rounded-lg font-medium hover:bg-slate-50"
                    >
                      Copy Body
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <>
            {/* Step Title & Subtitle */}
            <div className="space-y-1.5">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                {activeConfig.title}
              </h1>
              <p className="text-sm text-slate-500 leading-relaxed">
                {activeConfig.subtitle}
              </p>
            </div>

            {/* Recruiter Details Card */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 flex-1">
                  <span className="text-xs text-slate-500 font-medium block">
                    Recruiter details
                  </span>
                  {editingRecruiter ? (
                    <textarea
                      rows={3}
                      value={recruiterDetails}
                      onChange={(e) => setRecruiterDetails(e.target.value)}
                      className="w-full text-sm p-2.5 border border-slate-300 rounded-xl outline-none focus:border-slate-900"
                    />
                  ) : (
                    <p className="text-sm font-bold text-slate-900 whitespace-pre-line leading-snug">
                      {recruiterDetails}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setEditingRecruiter(!editingRecruiter)}
                  className="text-xs font-semibold text-slate-800 px-3 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 shrink-0 cursor-pointer"
                >
                  {editingRecruiter ? "Done" : "Edit recruiter details"}
                </button>
              </div>
            </div>

            {/* Step-Specific Input Fields */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-5">
              {activeConfig.fields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <label className="text-xs font-bold text-slate-800 block">
                        {field.label}
                      </label>
                      {field.helperText && (
                        <p className="text-xs text-slate-500 leading-normal">
                          {field.helperText}
                        </p>
                      )}
                    </div>

                    {field.allowUpload && (
                      <button
                        type="button"
                        onClick={() => triggerFileUpload(field.key)}
                        className="text-xs font-semibold text-slate-800 px-3 py-1.5 border border-slate-200 rounded-xl hover:bg-slate-50 shrink-0 cursor-pointer"
                      >
                        {uploadingField === field.key
                          ? "Reading..."
                          : field.uploadLabel || "Upload file"}
                      </button>
                    )}
                  </div>

                  {field.type === "input" ? (
                    <input
                      type="text"
                      value={currentInputs[field.key] || ""}
                      onChange={(e) => updateInput(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full text-sm p-3 border border-slate-200 rounded-xl outline-none focus:border-slate-900"
                    />
                  ) : (
                    <textarea
                      rows={field.rows || 4}
                      value={currentInputs[field.key] || ""}
                      onChange={(e) => updateInput(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full text-sm p-3 border border-slate-200 rounded-xl outline-none focus:border-slate-900 leading-relaxed"
                    />
                  )}
                </div>
              ))}

              {activeConfig.badgeText && (
                <p className="text-xs font-medium text-emerald-700">
                  {activeConfig.badgeText}
                </p>
              )}

              <div className="space-y-2.5 pt-1">
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="w-full py-3.5 bg-[#0f172a] hover:bg-slate-800 text-white font-semibold text-sm rounded-xl transition cursor-pointer disabled:opacity-50"
                >
                  {loading ? "Generating..." : "Generate"}
                </button>

                <button
                  onClick={clearGenerated}
                  className="w-full py-3 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm rounded-xl border border-slate-200 transition cursor-pointer"
                >
                  Clear generated message
                </button>
              </div>
            </div>

            {/* Subject Output Box */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
              <label className="text-xs font-bold text-slate-800 block">Subject</label>
              <textarea
                readOnly
                rows={2}
                value={currentOutput.subject}
                className="w-full text-sm p-3 border border-slate-200 rounded-xl bg-white outline-none leading-snug"
              />
              <div>
                <button
                  onClick={() => copyToClipboard(currentOutput.subject)}
                  className="text-xs font-semibold text-slate-800 px-3.5 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                  Copy Subject
                </button>
              </div>
            </div>

            {/* Body / Review Output Box */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
              <label className="text-xs font-bold text-slate-800 block">
                {activeConfig.outputLabel}
              </label>
              <textarea
                readOnly
                rows={12}
                value={currentOutput.body}
                className="w-full text-sm p-3 border border-slate-200 rounded-xl bg-white outline-none leading-relaxed font-sans"
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(currentOutput.body)}
                  className="text-xs font-semibold text-slate-800 px-3.5 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                  {activeConfig.copyBodyLabel}
                </button>
                <button
                  onClick={() =>
                    copyToClipboard(
                      currentOutput.subject
                        ? `${currentOutput.subject}\n\n${currentOutput.body}`
                        : currentOutput.body
                    )
                  }
                  className="text-xs font-semibold text-slate-800 px-3.5 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                  Copy Both
                </button>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Toast Notification (`Copied`) */}
      {toast && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          {toast}
        </div>
      )}

      {/* Persistent Bottom Action Bar (Matches Reference Video) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-3 py-2 shadow-lg">
        <div className="max-w-2xl mx-auto space-y-1.5">
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => copyToClipboard(currentOutput.subject)}
              className="py-2 bg-[#0f172a] text-white text-xs font-semibold rounded-lg cursor-pointer"
            >
              Copy Subject
            </button>
            <button
              onClick={() => copyToClipboard(currentOutput.body)}
              className="py-2 bg-[#0f172a] text-white text-xs font-semibold rounded-lg cursor-pointer"
            >
              {activeConfig.copyBodyLabel}
            </button>
            <button
              onClick={() =>
                copyToClipboard(
                  currentOutput.subject
                    ? `${currentOutput.subject}\n\n${currentOutput.body}`
                    : currentOutput.body
                )
              }
              className="py-2 bg-[#0f172a] text-white text-xs font-semibold rounded-lg cursor-pointer"
            >
              Copy Both
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setActiveView("step");
                setCurrentStep(1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-semibold rounded-lg border border-slate-200 cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={clearCurrentStepAll}
              className="py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-semibold rounded-lg border border-slate-200 cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
