const { GoogleGenAI } = require('@google/genai');

const client = new GoogleGenAI({ apiKey: process.env.AI_API_KEY });
const MODEL = process.env.AI_MODEL || 'gemini-3.7-flash';

const INSIGHT_SCHEMA = {
  type: 'object',
  properties: {
    summary: {
      type: 'string',
      description: 'Plain-language summary of the career pattern in this group.',
    },
    suggestedRoles: {
      type: 'array',
      items: { type: 'string' },
      description: 'Suggested job titles/keywords to search for next, tied back to people in the group.',
    },
  },
  required: ['summary', 'suggestedRoles'],
};

function formatContact(contact) {
  const history = (contact.CareerHistoryEntries || [])
    .map((h) => `    - ${h.title} at ${h.company} (${h.startDate || '?'} – ${h.endDate || 'present'})`)
    .join('\n');
  return (
    `- ${contact.firstName} ${contact.lastName}: currently ${contact.currentTitle || 'unknown title'} at ${contact.currentCompany || 'an unknown company'}` +
    (history ? `\n${history}` : '')
  );
}

function buildPrompt(group, contacts) {
  const memberLines = contacts.map(formatContact).join('\n');
  return `You are a career-intelligence analyst helping someone learn from their own professional network.

Group: "${group.name}"${group.description ? ` — ${group.description}` : ''}

Members and their known career history:
${memberLines}

Analyze the career pattern across this group: common entry points, typical title progressions, and companies that show up repeatedly. Then suggest concrete job titles or search keywords the user should target next, with reasoning tied back to specific people in the group.`;
}

// Calls the Gemini API and returns { summary, suggestedRoles }. Does not touch the database.
async function generateGroupInsight(group, contacts) {
  const response = await client.models.generateContent({
    model: MODEL,
    contents: buildPrompt(group, contacts),
    config: {
      responseMimeType: 'application/json',
      responseSchema: INSIGHT_SCHEMA,
    },
  });

  const finishReason = response.candidates?.[0]?.finishReason;
  if (finishReason && finishReason !== 'STOP') {
    throw Object.assign(new Error('The AI declined to analyze this group.'), { status: 502 });
  }

  const text = response.text;
  if (!text) {
    throw Object.assign(new Error('AI response did not include any content'), { status: 502 });
  }

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (err) {
    throw Object.assign(new Error('AI response was not valid JSON'), { status: 502 });
  }

  if (typeof parsed.summary !== 'string' || !Array.isArray(parsed.suggestedRoles)) {
    throw Object.assign(new Error('AI response did not match the expected shape'), { status: 502 });
  }

  return { summary: parsed.summary, suggestedRoles: parsed.suggestedRoles };
}

module.exports = { generateGroupInsight };
