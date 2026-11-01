import { NextResponse } from "next/server";
import OpenAI from "openai";

const deepseek = new OpenAI({
  baseURL: process.env.DEEPSEEK_BASE_URL || "https://inference.dahl.global/v1",
  apiKey: process.env.DEEPSEEK_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { step, inputs } = await req.json();

    let systemPrompt =
      "You are an executive recruiting assistant. Format output strictly with these tags:\n[SUBJECT]Subject line here[/SUBJECT]\n[BODY]Email body here[/BODY]";
    let userPrompt = "";

    switch (step) {
      case 1:
        userPrompt = `Draft an initial cold outreach message.\nCandidate Profile: ${inputs.candidateProfile}\nJob Details: ${inputs.opportunityDetails}`;
        break;
      case 2:
        userPrompt = `Draft an Opportunity Overview response based on candidate reply.\nRecruiter: ${inputs.recruiterDetails}\nCandidate: ${inputs.candidateProfile}\nCandidate Reply: ${inputs.candidateReply}\nMandate: ${inputs.opportunityDetails}`;
        break;
      case 3:
        userPrompt = `Draft a next-stage / CV request message.\nCandidate: ${inputs.candidateProfile}\nCandidate Reply: ${inputs.candidateReply}\nMandate: ${inputs.opportunityDetails}`;
        break;
      case 4:
        systemPrompt =
          "You are an executive search consultant. Provide a detailed recruiter assessment of the candidate relative to the mandate criteria.";
        userPrompt = `Evaluate this candidate:\nCandidate: ${inputs.candidateProfile}\nRole Details: ${inputs.opportunityDetails}`;
        break;
      case 5:
        userPrompt = `Draft a formal client candidate submission profile.\nCandidate: ${inputs.candidateProfile}\nOpportunity: ${inputs.opportunityDetails}\nAdditional Context: ${inputs.additionalDetails}`;
        break;
      case 6:
        userPrompt = `Draft a candidate progression update and documentation verification request.\nMandate: ${inputs.opportunityDetails}\nProgression Context: ${inputs.additionalDetails}`;
        break;
      default:
        return NextResponse.json({ error: "Invalid step requested" }, { status: 400 });
    }

    const completion = await deepseek.chat.completions.create({
      model: "deepseek-ai/DeepSeek-V4-Flash-0731",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
    });

    const raw = completion.choices[0].message.content || "";

    const subjectMatch = raw.match(/\[SUBJECT\]([\s\S]*?)\[\/SUBJECT\]/);
    const bodyMatch = raw.match(/\[BODY\]([\s\S]*?)\[\/BODY\]/);

    const subject = subjectMatch ? subjectMatch[1].trim() : "";
    const body = bodyMatch ? bodyMatch[1].trim() : raw.trim();

    return NextResponse.json({ subject, body, raw });
  } catch (error: any) {
    console.error("DeepSeek call error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to call DeepSeek API" },
      { status: 500 }
    );
  }
}