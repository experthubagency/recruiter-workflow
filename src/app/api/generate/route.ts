import { NextResponse } from "next/server";

const STEP_PROMPTS: Record<number, string> = {
  1: `You are an elite Executive Search Consultant writing a Step 1 First Outreach message.
GOAL: Write a discreet, peer-level executive outreach email based on the candidate's exact career trajectory.
RULES:
- Open with a warm greeting ("Hello [First Name],") and introduce the recruiter using the exact Recruiter Details provided.
- Reference 2-3 specific career milestones, companies, and scope progressions from their profile to prove this is bespoke.
- Keep the mandate confidential and discreet—no hype or clichés.
- Close with a low-friction question asking if they are open to receiving a concise overview of the mandate and its executive scope.
- Sign off with the Recruiter Details.`,

  2: `You are an elite Executive Search Consultant writing a Step 2 Opportunity Overview.
GOAL: The candidate replied positively to Step 1. Share a structured, high-level executive overview of the mandate.
RULES:
- Thank the candidate promptly for their reply and reference their current momentum.
- Present a clean, structured breakdown of the mandate (Position, Location, Reporting Line, Compensation/Scope, and Strategic Mandate).
- Integrate the Target Company, Location, and Reporting Structure if provided.
- Ask for their updated CV/resume or availability for a brief confidential alignment call.`,

  3: `You are an elite Executive Search Consultant writing a Step 3 CV / Next Stage progression email.
GOAL: Extract the company, role, location, and reporting details from the Step 2 text, incorporate live company research if available, and move the candidate toward CV submission.
RULES:
- Acknowledge the candidate's latest reply and directly answer any questions or nuances they raised.
- Synthesize the opportunity context and live company research seamlessly.
- Clearly outline the next step: securing their latest CV/resume to prepare their formal executive profile for stakeholder review.`,

  4: `You are an elite Executive Search Partner conducting a Step 4 Executive Resume Review.
GOAL: Deliver a rigorous, constructive, executive-level evaluation of the candidate's CV against the exact position and company mandate.
RULES:
- Address the candidate professionally and thank them for sending their CV.
- Highlight 3-4 specific executive strengths in their CV that directly align with the target company's mandate.
- Identify 2-3 strategic areas where metrics, board/stakeholder scope, P&L impact, or leadership scale can be sharpened before formal submission.
- Keep the tone consultative, supportive, and authoritative.`,

  5: `You are an elite Executive Search Consultant writing a Step 5 Profile Submission confirmation.
GOAL: Formally confirm to the candidate that their executive resume and briefing profile have been submitted to the hiring manager and key stakeholders.
RULES:
- Confirm formal submission of their dossier for the specific role and company identified in the Step 2/opportunity text.
- Summarize the core positioning pillars you emphasized to the client stakeholders based on their CV and additional verified details.
- Set clear expectations on feedback timelines and next-stage interview preparation.`,

  6: `You are an elite Executive Search Consultant writing a Step 6 Candidate Progression & Document Request.
GOAL: Congratulate/update the candidate on their confirmed progression to the next stage and issue a personalized Four-Document Verification Request.
RULES:
- Confirm the exact progression stage and stakeholder feedback using ONLY the verified progression details provided.
- Clearly request the 4 required executive onboarding/verification documents tailored to the mandate (1. Updated Executive CV/Bio, 2. Proof of Identity/Right to Work, 3. Executive References/Stakeholder List, 4. Compensation & Notice Period Verification / Reimbursement details if verified).
- Maintain a polished, white-glove executive search tone.`
};

async function fetchLiveWebResearch(queryText: string): Promise<string> {
  if (!queryText || queryText.trim().length < 3) return "";
  try {
    const urlMatch = queryText.match(/https?:\/\/[^\s)]+/i);
    const target = urlMatch
      ? `https://r.jina.ai/${urlMatch[0]}`
      : `https://s.jina.ai/${encodeURIComponent(queryText.slice(0, 120) + " company executive overview")}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4500);

    const res = await fetch(target, {
      headers: { Accept: "text/plain" },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) return "";
    const text = await res.text();
    return text.slice(0, 2200);
  } catch {
    return "";
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { step, inputs, enableWebResearch } = body;

    const apiKey = process.env.DEEPSEEK_API_KEY;
    const baseUrl = process.env.DEEPSEEK_BASE_URL || "https://inference.dahl.global/v1";

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing DEEPSEEK_API_KEY in Vercel Environment Variables." },
        { status: 500 }
      );
    }

    let liveResearchContext = "";
    if (enableWebResearch || Number(step) === 3 || inputs.targetCompany) {
      const searchTarget =
        inputs.targetCompany ||
        inputs.opportunityDetails?.slice(0, 200) ||
        "";
      if (searchTarget) {
        liveResearchContext = await fetchLiveWebResearch(searchTarget);
      }
    }

    const systemInstruction = STEP_PROMPTS[Number(step)] || STEP_PROMPTS[1];

    const userPrompt = `
RECRUITER DETAILS:
${inputs.recruiterDetails || "Independent Executive Recruiter / Search Consultant"}

CANDIDATE PROFILE / CV:
${inputs.candidateProfile || "Not provided"}

${inputs.candidateReply ? `CANDIDATE LATEST REPLY:\n${inputs.candidateReply}\n` : ""}
${inputs.targetCompany ? `TARGET COMPANY:\n${inputs.targetCompany}\n` : ""}
${inputs.location ? `LOCATION:\n${inputs.location}\n` : ""}
${inputs.reportingStructure ? `REPORTING STRUCTURE:\n${inputs.reportingStructure}\n` : ""}

OPPORTUNITY / MANDATE / STEP 2 DETAILS:
${inputs.opportunityDetails || "Not provided"}

${inputs.additionalDetails ? `ADDITIONAL VERIFIED DETAILS / PROGRESSION:\n${inputs.additionalDetails}\n` : ""}
${liveResearchContext ? `LIVE WEB RESEARCH CONTEXT:\n${liveResearchContext}\n` : ""}

FORMAT REQUIREMENT:
You MUST return your response in this exact format with these exact tags:
[SUBJECT]
(Write the exact email subject line here - e.g., Confidential Executive Search | Role | Compensation/Location)
[/SUBJECT]
[BODY]
(Write the complete email body or review here, ready to copy and send without placeholders)
[/BODY]`;

    const response = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-ai/DeepSeek-V4-Flash-0731",
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.4,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error?.message || `API Error (${response.status})` },
        { status: response.status }
      );
    }

    const rawText: string = data.choices?.[0]?.message?.content || "";
    const usage = data.usage || {
      prompt_tokens: Math.round(userPrompt.length / 4),
      completion_tokens: Math.round(rawText.length / 4),
      total_tokens: Math.round((userPrompt.length + rawText.length) / 4),
    };

    let subject = "";
    let messageBody = rawText;

    const subjectMatch = rawText.match(/\[SUBJECT\]([\s\S]*?)\[\/SUBJECT\]/i);
    const bodyMatch = rawText.match(/\[BODY\]([\s\S]*?)\[\/BODY\]/i);

    if (subjectMatch && bodyMatch) {
      subject = subjectMatch[1].trim();
      messageBody = bodyMatch[1].trim();
    } else {
      const lines = rawText.trim().split("\n");
      if (lines[0].toLowerCase().startsWith("subject:")) {
        subject = lines[0].replace(/^subject:\s*/i, "").trim();
        messageBody = lines.slice(1).join("\n").trim();
      } else {
        subject = "Confidential Executive Search";
        messageBody = rawText.trim();
      }
    }

    return NextResponse.json({
      subject,
      body: messageBody,
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
