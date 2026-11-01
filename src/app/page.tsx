"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Menu,
  X,
  Check,
  Search as SearchIcon,
  FileText,
  ArrowRight,
  Download,
  FolderPlus,
  Trash2,
  BarChart3,
  UserCheck,
  Clock,
  Home as HomeIcon,
} from "lucide-react";

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

interface UploadedFileChip {
  id: string;
  name: string;
  text: string;
}

type StepDataMap = Record<
  number,
  {
    inputs: Record<string, string>;
    files?: Record<string, UploadedFileChip[]>;
    output: { subject: string; body: string };
  }
>;

interface HistoryItem {
  id: string;
  stepId: number;
  stepTitle: string;
  candidateName: string;
  subject: string;
  body: string;
  tokens: number;
  timestamp: string;
}

interface CandidateDossier {
  id: string;
  name: string;
  role: string;
  updatedAt: string;
  stepState: StepDataMap;
}

interface UsageStats {
  totalGenerations: number;
  totalTokens: number;
  promptTokens: number;
  completionTokens: number;
  byStep: Record<number, number>;
}

const EMPTY_STEP_STATE = (): StepDataMap => ({
  1: { inputs: {}, files: {}, output: { subject: "", body: "" } },
  2: { inputs: {}, files: {}, output: { subject: "", body: "" } },
  3: { inputs: {}, files: {}, output: { subject: "", body: "" } },
  4: { inputs: {}, files: {}, output: { subject: "", body: "" } },
  5: { inputs: {}, files: {}, output: { subject: "", body: "" } },
  6: { inputs: {}, files: {}, output: { subject: "", body: "" } },
});

export default function WorkflowPage() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [activeView, setActiveView] = useState<
    "home" | "step" | "history" | "search" | "usage" | "account"
  >("step");
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [recruiterDetails, setRecruiterDetails] = useState<string>(
    "Ann Blythe\nIndependent Executive Recruiter / Search Consultant"
  );
  const [accountEmail, setAccountEmail] = useState<string>("consultant@executivesearch.com");
  const [agencyName, setAgencyName] = useState<string>("Domingo Papalaya Workflow");
  const [editingRecruiter, setEditingRecruiter] = useState<boolean>(false);

  const [activeCandidateName, setActiveCandidateName] = useState<string>("");
  const [stepState, setStepState] = useState<StepDataMap>(EMPTY_STEP_STATE());
  const [dossiers, setDossiers] = useState<CandidateDossier[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [usage, setUsage] = useState<UsageStats>({
    totalGenerations: 0,
    totalTokens: 0,
    promptTokens: 0,
    completionTokens: 0,
    byStep: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [targetFieldKey, setTargetFieldKey] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedRecruiter = localStorage.getItem("rw_recruiter");
      if (savedRecruiter) setRecruiterDetails(savedRecruiter);
      const savedEmail = localStorage.getItem("rw_email");
      if (savedEmail) setAccountEmail(savedEmail);
      const savedAgency = localStorage.getItem("rw_agency");
      if (savedAgency) setAgencyName(savedAgency);
      const savedSteps = localStorage.getItem("rw_steps");
      if (savedSteps) setStepState(JSON.parse(savedSteps));
      const savedHistory = localStorage.getItem("rw_history");
      if (savedHistory) setHistory(JSON.parse(savedHistory));
      const savedDossiers = localStorage.getItem("rw_dossiers");
      if (savedDossiers) setDossiers(JSON.parse(savedDossiers));
      const savedUsage = localStorage.getItem("rw_usage");
      if (savedUsage) setUsage(JSON.parse(savedUsage));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("rw_recruiter", recruiterDetails);
      localStorage.setItem("rw_email", accountEmail);
      localStorage.setItem("rw_agency", agencyName);
      localStorage.setItem("rw_steps", JSON.stringify(stepState));
      localStorage.setItem("rw_history", JSON.stringify(history));
      localStorage.setItem("rw_dossiers", JSON.stringify(dossiers));
      localStorage.setItem("rw_usage", JSON.stringify(usage));
    } catch {}
  }, [recruiterDetails, accountEmail, agencyName, stepState, history, dossiers, usage]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const activeConfig = STEPS.find((s) => s.id === currentStep) || STEPS[0];
  const currentInputs = stepState[currentStep]?.inputs || {};
  const currentFiles = stepState[currentStep]?.files || {};
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
      const newChips: UploadedFileChip[] = [];
      const extractedChunks: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const text = await extractFileText(files[i]);
        if (text) {
          extractedChunks.push(text);
          newChips.push({
            id: `${Date.now()}-${i}`,
            name: files[i].name,
            text,
          });
        }
      }

      const combined = extractedChunks.join("\n\n---\n\n");
      const existingText = currentInputs[targetFieldKey] || "";
      const existingChips = currentFiles[targetFieldKey] || [];

      setStepState((prev) => ({
        ...prev,
        [currentStep]: {
          ...prev[currentStep],
          inputs: {
            ...(prev[currentStep]?.inputs || {}),
            [targetFieldKey]: existingText ? `${existingText}\n\n${combined}` : combined,
          },
          files: {
            ...(prev[currentStep]?.files || {}),
            [targetFieldKey]: [...existingChips, ...newChips],
          },
        },
      }));

      showToast(`${newChips.length} file(s) extracted`);
    } catch {
      alert("Could not extract text from file. Please paste the text directly.");
    } finally {
      setUploadingField(null);
      e.target.value = "";
    }
  };

  const removeFileChip = (fieldKey: string, chipId: string) => {
    const chips = currentFiles[fieldKey] || [];
    const targetChip = chips.find((c) => c.id === chipId);
    const remaining = chips.filter((c) => c.id !== chipId);

    let updatedText = currentInputs[fieldKey] || "";
    if (targetChip && updatedText.includes(targetChip.text)) {
      updatedText = updatedText.replace(targetChip.text, "").trim();
    }

    setStepState((prev) => ({
      ...prev,
      [currentStep]: {
        ...prev[currentStep],
        inputs: {
          ...(prev[currentStep]?.inputs || {}),
          [fieldKey]: updatedText,
        },
        files: {
          ...(prev[currentStep]?.files || {}),
          [fieldKey]: remaining,
        },
      },
    }));
    showToast("Removed file");
  };

  const triggerFileUpload = (key: string) => {
    setTargetFieldKey(key);
    fileInputRef.current?.click();
  };

  const guessCandidateName = (text: string): string => {
    if (activeCandidateName) return activeCandidateName;
    if (!text) return "Unnamed Candidate";
    const firstLine = text.trim().split("\n")[0].replace(/^(hello|dear|hi)\s+/i, "");
    return firstLine.slice(0, 36).trim() || "Executive Candidate";
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step: currentStep,
          enableWebResearch: currentStep === 3 || Boolean(currentInputs.targetCompany),
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

        const tokenCount = data.usage?.total_tokens || 450;
        const pTokens = data.usage?.prompt_tokens || 250;
        const cTokens = data.usage?.completion_tokens || 200;

        setUsage((prev) => ({
          totalGenerations: prev.totalGenerations + 1,
          totalTokens: prev.totalTokens + tokenCount,
          promptTokens: prev.promptTokens + pTokens,
          completionTokens: prev.completionTokens + cTokens,
          byStep: {
            ...prev.byStep,
            [currentStep]: (prev.byStep[currentStep] || 0) + 1,
          },
        }));

        const detectedName = guessCandidateName(currentInputs.candidateProfile);

        setHistory((prev) => [
          {
            id: Date.now().toString(),
            stepId: currentStep,
            stepTitle: activeConfig.title,
            candidateName: detectedName,
            subject: newOut.subject,
            body: newOut.body,
            tokens: tokenCount,
            timestamp: new Date().toLocaleString(),
          },
          ...prev.slice(0, 49),
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

  // Auto-Carry Context Pipeline to Next Step
  const pushToNextStep = () => {
    if (currentStep >= 6) return;
    const nextStep = currentStep + 1;

    const baseProfile =
      currentInputs.candidateProfile ||
      stepState[1]?.inputs?.candidateProfile ||
      "";

    const step2OutputOrMandate =
      currentStep === 2 && currentOutput.body
        ? `${currentOutput.subject}\n\n${currentOutput.body}\n\n---\n${currentInputs.opportunityDetails || ""}`
        : currentInputs.opportunityDetails ||
          stepState[2]?.output?.body ||
          stepState[1]?.inputs?.opportunityDetails ||
          "";

    setStepState((prev) => ({
      ...prev,
      [nextStep]: {
        ...prev[nextStep],
        inputs: {
          ...(prev[nextStep]?.inputs || {}),
          candidateProfile: baseProfile,
          opportunityDetails: step2OutputOrMandate,
        },
      },
    }));

    setCurrentStep(nextStep);
    setActiveView("step");
    window.scrollTo({ top: 0, behavior: "smooth" });
    showToast(`Carried context to Step ${nextStep}`);
  };

  // Save Candidate Dossier for Multi-Candidate Management
  const saveCandidateDossier = () => {
    const rawProfile =
      currentInputs.candidateProfile || stepState[1]?.inputs?.candidateProfile || "";
    const defaultName = guessCandidateName(rawProfile);
    const name = window.prompt("Enter Candidate Name for this Dossier:", defaultName);
    if (!name) return;

    const role =
      currentOutput.subject ||
      currentInputs.opportunityDetails?.slice(0, 50) ||
      "Executive Mandate";

    setActiveCandidateName(name);
    const newDossier: CandidateDossier = {
      id: Date.now().toString(),
      name,
      role,
      updatedAt: new Date().toLocaleString(),
      stepState,
    };

    setDossiers((prev) => [newDossier, ...prev.filter((d) => d.name !== name)]);
    showToast(`Saved dossier: ${name}`);
  };

  const loadDossier = (dossier: CandidateDossier) => {
    setStepState(dossier.stepState);
    setActiveCandidateName(dossier.name);
    setActiveView("step");
    setDrawerOpen(false);
    showToast(`Loaded ${dossier.name}`);
  };

  // Export Formatted Executive Dossier PDF
  const exportExecutivePDF = () => {
    if (!currentOutput.body) return;
    const printWindow = window.open("", "_blank", "width=850,height=950");
    if (!printWindow) return;

    const candidateTitle = activeCandidateName || "Confidential Candidate";
    printWindow.document.write(`
      <html>
        <head>
          <title>${currentOutput.subject || "Executive Search Dossier"}</title>
          <style>
            body { font-family: 'Segoe UI', -apple-system, sans-serif; padding: 48px; color: #0f172a; line-height: 1.65; max-width: 760px; margin: 0 auto; }
            .header { border-bottom: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 28px; display: flex; justify-content: space-between; align-items: flex-end; }
            .tag { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #475569; font-weight: 700; }
            h1 { font-size: 20px; margin: 6px 0 0 0; color: #0f172a; }
            .meta { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 18px; margin-bottom: 24px; font-size: 13px; }
            .content { white-space: pre-wrap; font-size: 14px; color: #1e293b; }
            .footer { margin-top: 48px; padding-top: 16px; border-top: 1px solid #cbd5e1; font-size: 12px; color: #64748b; display: flex; justify-content: space-between; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="tag">${agencyName} · ${activeConfig.title}</div>
              <h1>${currentOutput.subject || "Confidential Executive Search"}</h1>
            </div>
            <div style="text-align:right; font-size:12px; color:#475569;">
              ${new Date().toLocaleDateString()}
            </div>
          </div>
          <div class="meta">
            <strong>Candidate / Mandate:</strong> ${candidateTitle}<br/>
            <strong>Prepared By:</strong> ${recruiterDetails.replace(/\n/g, " · ")}
          </div>
          <div class="content">${currentOutput.body.replace(/</g, "&lt;")}</div>
          <div class="footer">
            <span>Confidential Executive Search Document</span>
            <span>${accountEmail}</span>
          </div>
          <script>window.onload = () => { window.print(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
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

  const startNewCandidate = () => {
    setStepState(EMPTY_STEP_STATE());
    setActiveCandidateName("");
    setCurrentStep(1);
    setActiveView("step");
    showToast("Ready for New Candidate");
  };

  const filteredHistory = history.filter(
    (h) =>
      h.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.candidateName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDossiers = dossiers.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

      {/* Top Header (Matches Reference Video) */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDrawerOpen(true)}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-700 cursor-pointer"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div>
            <span className="font-bold text-slate-900 text-sm sm:text-base leading-tight block">
              {agencyName}
            </span>
            {activeCandidateName && (
              <span className="text-[11px] font-semibold text-emerald-700 block">
                Active Dossier: {activeCandidateName}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden md:inline text-xs text-slate-500 mr-1">
            {accountEmail}
          </span>
          <button
            onClick={saveCandidateDossier}
            className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center gap-1 cursor-pointer"
            title="Save Candidate Dossier"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Save Dossier</span>
          </button>
          <button
            onClick={startNewCandidate}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-800 cursor-pointer"
          >
            New Candidate
          </button>
        </div>
      </header>

      {/* Full Slide-Out Navigation Drawer (Matches All Video Menu Items) */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-[1px]"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="relative w-72 max-w-[84vw] bg-white h-full shadow-2xl flex flex-col justify-between p-5 z-10 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 mb-3 border-b border-slate-100">
                <div>
                  <span className="font-bold text-slate-900 text-sm block">
                    {agencyName}
                  </span>
                  <span className="text-xs text-slate-400">{accountEmail}</span>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1">
                <button
                  onClick={() => {
                    setActiveView("home");
                    setDrawerOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer ${
                    activeView === "home"
                      ? "bg-blue-50/90 text-slate-900 font-semibold border border-blue-200"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  Home
                </button>

                {STEPS.map((step) => {
                  const active = activeView === "step" && currentStep === step.id;
                  const hasOutput = Boolean(stepState[step.id]?.output?.body);
                  return (
                    <button
                      key={step.id}
                      onClick={() => {
                        setCurrentStep(step.id);
                        setActiveView("step");
                        setDrawerOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition flex items-center justify-between cursor-pointer ${
                        active
                          ? "bg-blue-50/90 text-slate-900 font-semibold border border-blue-200"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span>{step.title}</span>
                      {hasOutput && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      )}
                    </button>
                  );
                })}

                <div className="pt-3 mt-3 border-t border-slate-100 space-y-1">
                  <button
                    onClick={() => {
                      setActiveView("history");
                      setDrawerOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer ${
                      activeView === "history"
                        ? "bg-blue-50 text-slate-900 font-semibold"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    History
                  </button>

                  <button
                    onClick={() => {
                      setActiveView("search");
                      setDrawerOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer ${
                      activeView === "search"
                        ? "bg-blue-50 text-slate-900 font-semibold"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    Search
                  </button>

                  <button
                    onClick={() => {
                      setActiveView("usage");
                      setDrawerOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer ${
                      activeView === "usage"
                        ? "bg-blue-50 text-slate-900 font-semibold"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    Usage
                  </button>

                  <button
                    onClick={() => {
                      setActiveView("account");
                      setDrawerOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer ${
                      activeView === "account"
                        ? "bg-blue-50 text-slate-900 font-semibold"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    Account
                  </button>
                </div>
              </nav>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <main className="w-full max-w-2xl mx-auto px-4 pt-6 space-y-5">
        {/* HOME VIEW: Pipeline Overview & Saved Candidate Dossiers */}
        {activeView === "home" && (
          <div className="space-y-5">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Executive Recruiting Pipeline
              </h1>
              <p className="text-sm text-slate-500">
                Select any workflow stage below or resume a saved Candidate Dossier.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {STEPS.map((s) => {
                const done = Boolean(stepState[s.id]?.output?.body);
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      setCurrentStep(s.id);
                      setActiveView("step");
                    }}
                    className="bg-white p-4 rounded-2xl border border-slate-200 text-left hover:border-slate-400 transition shadow-xs cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-slate-900">
                        {s.title}
                      </span>
                      {done && (
                        <span className="text-[11px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">
                          Ready
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {s.subtitle}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900">
                  Saved Candidate Dossiers ({dossiers.length})
                </h2>
                <button
                  onClick={saveCandidateDossier}
                  className="text-xs font-semibold text-slate-800 px-3 py-1.5 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                  + Save Current Workspace
                </button>
              </div>
              {dossiers.length === 0 ? (
                <p className="text-xs text-slate-500">
                  No candidate dossiers saved yet. Click &quot;Save Dossier&quot; in the top bar while working on a candidate to store all 6 steps of their progress.
                </p>
              ) : (
                <div className="space-y-2">
                  {dossiers.map((d) => (
                    <div
                      key={d.id}
                      className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50"
                    >
                      <div>
                        <div className="text-sm font-bold text-slate-900">
                          {d.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          {d.role} · {d.updatedAt}
                        </div>
                      </div>
                      <button
                        onClick={() => loadDossier(d)}
                        className="text-xs font-semibold px-3 py-1.5 bg-slate-900 text-white rounded-lg cursor-pointer"
                      >
                        Load Dossier
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* SEARCH VIEW */}
        {activeView === "search" && (
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-slate-900">
              Search Candidates & Messages
            </h1>
            <div className="relative">
              <SearchIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by candidate name, company, role, or message keyword..."
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:border-slate-900"
              />
            </div>

            {filteredDossiers.length > 0 && (
              <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
                <h2 className="text-xs font-bold uppercase text-slate-400">
                  Matching Candidate Dossiers
                </h2>
                {filteredDossiers.map((d) => (
                  <div
                    key={d.id}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"
                  >
                    <div>
                      <div className="text-sm font-bold">{d.name}</div>
                      <div className="text-xs text-slate-500">{d.role}</div>
                    </div>
                    <button
                      onClick={() => loadDossier(d)}
                      className="text-xs font-semibold px-3 py-1.5 bg-slate-900 text-white rounded-lg"
                    >
                      Open
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase text-slate-400">
                Matching Generated Outputs ({filteredHistory.length})
              </h2>
              {filteredHistory.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2"
                >
                  <div className="flex justify-between text-xs text-slate-500">
                    <span className="font-bold text-slate-800">
                      {item.candidateName} · {item.stepTitle}
                    </span>
                    <span>{item.timestamp}</span>
                  </div>
                  <div className="text-sm font-semibold text-slate-900">
                    {item.subject}
                  </div>
                  <pre className="text-xs text-slate-600 whitespace-pre-wrap font-sans bg-slate-50 p-3 rounded-xl">
                    {item.body}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* HISTORY VIEW */}
        {activeView === "history" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-slate-900">
                Generation History
              </h1>
              {history.length > 0 && (
                <button
                  onClick={() => {
                    setHistory([]);
                    showToast("History cleared");
                  }}
                  className="text-xs text-rose-600 font-semibold px-3 py-1.5 border border-rose-200 rounded-xl hover:bg-rose-50"
                >
                  Clear History
                </button>
              )}
            </div>
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
                    <span className="font-bold text-slate-800">
                      {item.candidateName} — {item.stepTitle}
                    </span>
                    <span>{item.timestamp}</span>
                  </div>
                  <div className="text-sm font-semibold text-slate-900">
                    {item.subject}
                  </div>
                  <pre className="text-xs text-slate-600 whitespace-pre-wrap font-sans bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {item.body}
                  </pre>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => copyToClipboard(item.subject)}
                      className="text-xs px-3 py-1.5 border border-slate-200 rounded-lg font-semibold hover:bg-slate-50"
                    >
                      Copy Subject
                    </button>
                    <button
                      onClick={() => copyToClipboard(item.body)}
                      className="text-xs px-3 py-1.5 border border-slate-200 rounded-lg font-semibold hover:bg-slate-50"
                    >
                      Copy Body
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* USAGE VIEW */}
        {activeView === "usage" && (
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-slate-900">
              API & Workflow Usage
            </h1>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white p-4 rounded-2xl border border-slate-200">
                <span className="text-xs text-slate-500 block">
                  Total Generations
                </span>
                <span className="text-2xl font-bold text-slate-900">
                  {usage.totalGenerations}
                </span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200">
                <span className="text-xs text-slate-500 block">
                  Total Tokens
                </span>
                <span className="text-2xl font-bold text-slate-900">
                  {usage.totalTokens.toLocaleString()}
                </span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200">
                <span className="text-xs text-slate-500 block">
                  Est. API Cost
                </span>
                <span className="text-2xl font-bold text-emerald-700">
                  ${((usage.totalTokens / 1000000) * 0.28).toFixed(4)}
                </span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
              <h2 className="text-sm font-bold text-slate-900">
                Generations by Workflow Step
              </h2>
              {STEPS.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 last:border-0"
                >
                  <span className="font-medium text-slate-700">{s.title}</span>
                  <span className="font-bold text-slate-900">
                    {usage.byStep[s.id] || 0} runs
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ACCOUNT VIEW */}
        {activeView === "account" && (
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
            <h1 className="text-xl font-bold text-slate-900">
              Account & Recruiter Settings
            </h1>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Workflow / Agency Name
              </label>
              <input
                type="text"
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                className="w-full text-sm p-3 border border-slate-200 rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Account Email (Top Bar)
              </label>
              <input
                type="email"
                value={accountEmail}
                onChange={(e) => setAccountEmail(e.target.value)}
                className="w-full text-sm p-3 border border-slate-200 rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Default Recruiter Signature / Details
              </label>
              <textarea
                rows={4}
                value={recruiterDetails}
                onChange={(e) => setRecruiterDetails(e.target.value)}
                className="w-full text-sm p-3 border border-slate-200 rounded-xl"
              />
            </div>
            <button
              onClick={() => {
                setActiveView("step");
                showToast("Settings saved");
              }}
              className="px-4 py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-xl cursor-pointer"
            >
              Save & Return to Workflow
            </button>
          </div>
        )}

        {/* ACTIVE STEP WORKFLOW VIEW */}
        {activeView === "step" && (
          <>
            <div className="space-y-1.5">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                {activeConfig.title}
              </h1>
              <p className="text-sm text-slate-500 leading-relaxed">
                {activeConfig.subtitle}
              </p>
            </div>

            {/* Recruiter Details Box */}
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

            {/* Dynamic Step Form Card */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-5">
              {activeConfig.fields.map((field) => {
                const chips = currentFiles[field.key] || [];
                return (
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

                    {/* Uploaded File Chips */}
                    {chips.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {chips.map((chip) => (
                          <span
                            key={chip.id}
                            className="inline-flex items-center gap-1.5 text-xs bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 font-medium"
                          >
                            <FileText className="w-3 h-3 text-slate-500" />
                            {chip.name}
                            <button
                              type="button"
                              onClick={() => removeFileChip(field.key, chip.id)}
                              className="text-slate-400 hover:text-rose-600 ml-0.5 cursor-pointer"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

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
                );
              })}

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

            {/* Subject Box */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
              <label className="text-xs font-bold text-slate-800 block">
                Subject
              </label>
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

            {/* Body / Review Box + PDF Export + Auto-Advance to Next Step */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <label className="text-xs font-bold text-slate-800 block">
                {activeConfig.outputLabel}
              </label>
              <textarea
                readOnly
                rows={12}
                value={currentOutput.body}
                className="w-full text-sm p-3 border border-slate-200 rounded-xl bg-white outline-none leading-relaxed font-sans"
              />
              <div className="flex flex-wrap items-center justify-between gap-2">
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
                  <button
                    onClick={exportExecutivePDF}
                    className="text-xs font-semibold text-slate-800 px-3 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Export PDF
                  </button>
                </div>

                {currentStep < 6 && (
                  <button
                    onClick={pushToNextStep}
                    className="text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Send & Advance to Step {currentStep + 1}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
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

      {/* Persistent Sticky Bottom Bar (Matches Reference Video) */}
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
                setActiveView("home");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-semibold rounded-lg border border-slate-200 cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => {
                setStepState((prev) => ({
                  ...prev,
                  [currentStep]: {
                    inputs: {},
                    files: {},
                    output: { subject: "", body: "" },
                  },
                }));
                showToast("Cleared");
              }}
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
