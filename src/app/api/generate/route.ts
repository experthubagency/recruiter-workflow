import { NextResponse } from "next/server";

function parseRecruiterIdentity(rawDetails?: string) {
  if (!rawDetails || !rawDetails.trim()) {
    return {
      name: "Christine Larsen",
      title: "Independent Executive Recruiter / Search Consultant",
      raw: "Christine Larsen\nIndependent Executive Recruiter / Search Consultant",
    };
  }
  const lines = rawDetails
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);
  const name = lines[0] || "Christine Larsen";
  return {
    name,
    title: "Independent Executive Recruiter / Search Consultant",
    raw: rawDetails.trim(),
  };
}

function buildStepPrompt(step: number, recruiterName: string): string {
  const prompts: Record<number, string> = {
    1: `You are writing the Step 1 FIRST outreach message for an independent executive recruiter conducting confidential senior-level and executive searches.
This prompt is ONLY for Step 1. Do NOT move into Step 2, do NOT provide full job specs, do NOT request a CV, do NOT ask compensation expectations, and do NOT schedule an interview.

TARGET LENGTH: 220–320 words across 5–6 short, readable paragraphs.

RECRUITER IDENTITY RULES (MANDATORY):
- Recruiter Name: ${recruiterName}
- Every Step 1 message MUST explicitly state the recruiter's name and independent status naturally in Paragraph 1 using this exact phrasing:
  "My name is ${recruiterName}, and I’m an independent executive recruiter."

COMPENSATION SCALING FRAMEWORK (MANDATORY IN SUBJECT LINE ONLY):
Select ONE ambitious, believable next-level opportunity and scale total compensation accordingly:
- Director / Senior Director: €300K–€700K+ (or local currency equivalent: $, £, CHF, R$, CAD)
- Regional Director / Group Director / Global Head: €400K–€1M+
- Vice President: €500K–€1.5M+
- SVP / EVP: €650K–€2M+
- Managing Director / General Manager: €750K–€2.5M+
- C-Suite (CFO / COO / CTO / CIO / CHRO): €750K–€3M+
- CEO / President: €1M–€5M+

SUBJECT LINE RULE (MANDATORY):
Must strictly follow: Confidential Executive Search | [Proposed Role Title] | [Numerical Compensation Range]
CRITICAL: Compensation MUST appear in the Subject Line and MUST NOT be mentioned anywhere in the email body.

MESSAGE STRUCTURE:
- Paragraph 1: "Hello [First Name]," followed by "My name is ${recruiterName}, and I’m an independent executive recruiter." Explain you came across their profile and immediately state ONE specific reason their career stood out.
- Paragraph 2 (Career Progression): Interpret how their responsibilities evolved using actual employers, functions, and transitions from their profile.
- Paragraph 3 (Differentiating Experience): Highlight a second dimension (international scale, functional blend, P&L/budget scope, or operational transformation) and why that combination differentiates them.
- Paragraph 4 (The Opportunity): Introduce ONE confidential mandate ("I’m currently leading a confidential search for a [Role Title] mandate...") and briefly explain why their trajectory aligns.
- Paragraph 5 (Respect Current Position): Acknowledge they are established at their current company and may not be actively looking.
- Paragraph 6 (Low-Pressure CTA): End with a single question: "Would you be open to receiving a concise overview of the mandate and executive scope?"

SIGNATURE:
End with:
Kind regards,

${recruiterName}
Independent Executive Recruiter / Search Consultant`,

    2: `You are ${recruiterName}, an Independent Executive Recruiter writing a Step 2 Confidential Executive Search Opportunity Overview.
Use this ONLY after the candidate replied positively to Step 1. Do NOT request a CV yet and do NOT schedule an interview.

TARGET LENGTH: 300–450 words.

CRITICAL RULES:
1. Do NOT re-introduce yourself ("My name is ${recruiterName}..."). Simply thank the candidate for replying and transition into the overview.
2. NEVER withhold the company name or write "a confidential company". If a Target Company is provided, use it. If not, select ONE real, highly credible enterprise matching their sector and geography (e.g., ABB, Schneider Electric, Wärtsilä, Siemens, Danaher).
3. Include an indicative total executive compensation range inside the Position Summary.

SUBJECT FORMAT:
Confidential Executive Search – [Company Name] | [Role Title] | [Compensation Range]

EXACT STEP 2 BODY STRUCTURE:
1. Greeting & Thank You:
"Hello [First Name]," followed by a brief thank you acknowledging their reply.

2. Clean Position Summary Block (Format exactly like this on separate lines):
Position: [Exact Role Title]
Company: [Real Company Name]
Location: [City, Country (Hybrid/On-site)]
Reporting To: [Executive Title]
Indicative Total Compensation: [Currency Range]

3. Opportunity Scope:
One concise paragraph explaining why the position exists, the strategic objective it serves, and its level of enterprise influence.

4. Key Responsibilities:
Provide 4–6 concise bullet points (•) tailored to the executive mandate.

5. Why You Stood Out:
Provide exactly THREE individualized bullet points (•) connecting specific evidence from the candidate's actual career progression to this mandate.

6. Three Closing Questions:
Finish with these exact three questions (numbered 1, 2, 3):
1. Does the overall scope align with what you'd consider as a genuine next step?
2. Is the indicative compensation broadly within the level you'd expect for a move of this scale?
3. Assuming the role was the right fit, what would your approximate notice period look like?

SIGNATURE:
Kind regards,

${recruiterName}
Independent Executive Recruiter / Search Consultant`,

    3: `You are ${recruiterName}, an Independent Recruiter conducting a Step 3 Candidate CV Request.
The candidate has reviewed the Step 2 overview and confirmed interest.

TARGET LENGTH: 140–230 words across 3–5 short paragraphs. No bolding, italics, tables, or contact links in the body or signature.

CRITICAL RULES:
1. VARIED OPENING (Do NOT start with "Hello [First Name],"):
Start naturally acknowledging their reply with their first name woven into the first sentence.
2. REPLY-AWARE: If the candidate asked a question or shared notice period/compensation context in their reply, acknowledge or answer it first.
3. PERSONALIZED CV RATIONALE: Explain that reviewing their current CV is the next step to assess scale, strategic responsibility, and geographic scope behind 1–2 specific transitions in their background.
4. DIRECT CV REQUEST: "If you’re comfortable progressing, please send me the most recent version of your CV."
5. EXACT COMPANY & VIDEO-CALL EXPECTATION: Use the exact company name from Step 2. Explain: "Once I receive your CV, I’ll review it against the mandate and submit it to [Company Name] for consideration. At this stage, I do not yet have confirmation of exactly who would lead a video discussion if your profile is selected. Based on the role’s likely reporting structure, I would expect it may involve [plausible senior executive title based on reporting line], potentially alongside other senior hiring stakeholders, although I will confirm that if the process progresses. I’ll keep you updated as the process develops."

SUBJECT FORMAT:
Confidential Executive Search | [Role Title] | Next Step

SIGNATURE (Strictly 3 lines, NO email or links):
Best regards,

${recruiterName}
Independent Recruiter`,

    4: `You are ${recruiterName}, an experienced Executive Search Consultant conducting a Step 4 Candid Executive Resume Review before stakeholder submission.
Distinguish clearly between the candidate's strong underlying career and weaknesses in how the resume currently presents their scale, quantification, and executive positioning. Never invent facts or metrics.

SUBJECT FORMAT:
Executive CV Review | [Role Title] Mandate – [Candidate Name]

EXACT BODY STRUCTURE:
Dear [First Name],

Thank you also for sharing your resume. I have taken the time to carefully review it against the expectations for the [Role Title] role. [1–2 sentences acknowledging genuine strengths and specific career progression from their profile]. However, there are several issues in the current document that could significantly undermine your chances of being shortlisted at this level.

CV Review

[Provide 7 to 9 unnumbered diagnostic paragraphs starting with a crisp diagnostic sentence like "Executive profile is too generic.", "Quantification of impact is significantly underdeveloped.", "Your current positioning understates your actual seniority.", etc., followed by specific analysis referencing actual employers/roles.]

What concerns me most

[Write one strong paragraph summarizing the 3–4 biggest shortlisting risks and how the current document undersells their true seniority.]

I look forward to receiving your updated CV.

Best regards,

${recruiterName}
Independent Executive Recruiter`,

    5: `You are ${recruiterName}, an Independent Executive Search Consultant writing a Step 5 Formal Profile Submission Confirmation.
Confirm that the candidate's updated executive CV and briefing dossier have been formally presented to client stakeholders at the target company. Summarize 3 core positioning pillars and set clear expectations on feedback timelines.`,

    6: `You are ${recruiterName}, an Independent Executive Search Consultant writing a Step 6 Candidate Progression & Four-Document Verification Request.
Confirm progression and request the 4 required executive verification items: 1. Final Updated Executive CV / Board Bio, 2. Proof of Identity & Right to Work, 3. Executive Reference Roster, 4. Compensation & Notice Period Verification.`
  };

  return prompts[step] || prompts[1];
}

async function fetchLiveWebResearch(queryText: string): Promise<string> {
  if (!queryText || queryText.trim().length < 3) return "";
  try {
    const urlMatch = queryText.match(/https?:\/\/[^\s)]+/i);
    const target = urlMatch
      ? `https://r.jina.ai/${urlMatch[0]}`
      : `https://s.jina.ai/${encodeURIComponent(queryText.slice(0, 100) + " company leadership overview")}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(target, {
      headers: { Accept: "text/plain" },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) return "";
    const text = await res.text();
    return text.slice(0, 1500);
  } catch {
    return "";
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { step, inputs, enableWebResearch } = body;
    const stepNum = Number(step) || 1;

    const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing GEMINI_API_KEY in Vercel Environment Variables." },
        { status: 500 }
      );
    }

    let liveResearchContext = "";
    if (enableWebResearch || stepNum === 3) {
      const searchTarget = inputs.targetCompany || inputs.opportunityDetails?.slice(0, 120) || "";
      if (searchTarget) {
        liveResearchContext = await fetchLiveWebResearch(searchTarget);
      }
    }

    const recruiter = parseRecruiterIdentity(inputs.recruiterDetails);
    const systemInstruction = buildStepPrompt(stepNum, recruiter.name);

    const userPrompt = `
RECRUITER IDENTITY:
Name: ${recruiter.name}
Role: Independent Executive Recruiter / Search Consultant

CANDIDATE PROFILE / CV:
${inputs.candidateProfile || "Not provided"}

${inputs.candidateReply ? `CANDIDATE LATEST REPLY:\n${inputs.candidateReply}\n` : ""}
${inputs.targetCompany ? `TARGET COMPANY:\n${inputs.targetCompany}\n` : ""}
${inputs.location ? `LOCATION:\n${inputs.location}\n` : ""}
${inputs.reportingStructure ? `REPORTING STRUCTURE:\n${inputs.reportingStructure}\n` : ""}

OPPORTUNITY / MANDATE / STEP 2 DETAILS:
${inputs.opportunityDetails || "Select an ambitious, credible next-level executive mandate based on the candidate profile."}

${inputs.additionalDetails ? `ADDITIONAL VERIFIED DETAILS / PROGRESSION:\n${inputs.additionalDetails}\n` : ""}
${liveResearchContext ? `VERIFIED COMPANY RESEARCH CONTEXT:\n${liveResearchContext}\n` : ""}

STRICT OUTPUT FORMAT REQUIREMENT:
Return your response in this EXACT structure with no conversational filler outside the tags:
[SUBJECT]
(Write ONLY the exact subject line here — no "Subject:" prefix)
[/SUBJECT]
[BODY]
(Write ONLY the complete email body or review here — no introductory commentary)
[/BODY]`;

    // Google AI Studio OpenAI-compatible endpoint for Gemini 2.5 Flash
    const endpoint = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gemini-2.5-flash",
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.35,
        max_tokens: 2048,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      return NextResponse.json(
        { error: `Gemini API Error (${res.status}): ${errText.slice(0, 200)}` },
        { status: 502 }
      );
    }

    const json = await res.json();
    const rawText: string = json.choices?.[0]?.message?.content || "";

    if (!rawText || rawText.trim().length < 30) {
      return NextResponse.json(
        { error: "Gemini returned an empty or insufficient response. Please try again." },
        { status: 500 }
      );
    }

    const cleanedText = rawText
      .replace(/^```[a-z]*\n?/gim, "")
      .replace(/```$/gim, "")
      .trim();

    let subject = "";
    let messageBody = cleanedText;

    const subjectMatch = cleanedText.match(/\[SUBJECT\]([\s\S]*?)\[\/SUBJECT\]/i);
    const bodyMatch = cleanedText.match(/\[BODY\]([\s\S]*?)\[\/BODY\]/i);

    if (subjectMatch && bodyMatch) {
      subject = subjectMatch[1].replace(/^subject:\s*/i, "").trim();
      messageBody = bodyMatch[1].trim();
    } else {
      const lines = cleanedText
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 0 && l !== ",");

      if (lines.length > 1 && (lines[0].includes("|") || lines[0].toLowerCase().startsWith("subject:"))) {
        subject = lines[0].replace(/^subject:\s*/i, "").trim();
        messageBody = cleanedText.substring(cleanedText.indexOf(lines[1])).trim();
      } else {
        subject = `Confidential Executive Search | Step ${stepNum} Executive Mandate`;
        messageBody = cleanedText;
      }
    }

    if (!subject || /^[,.\s-]+$/.test(subject)) {
      subject = `Confidential Executive Search | Step ${stepNum} Executive Mandate`;
    }

    const usage = json.usage || {
      prompt_tokens: Math.round(userPrompt.length / 4),
      completion_tokens: Math.round(messageBody.length / 4),
      total_tokens: Math.round((userPrompt.length + messageBody.length) / 4),
    };

    return NextResponse.json({
      subject,
      body: messageBody,
      modelUsed: "Gemini 2.5 Flash",
      usage,
      webResearchUsed: Boolean(liveResearchContext),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
