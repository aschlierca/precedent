const mockGenerateContent = jest.fn();

jest.mock('@google/genai', () => {
  return {
    GoogleGenAI: jest.fn().mockImplementation(() => ({
      models: { generateContent: mockGenerateContent },
    })),
  };
});

const { generateGroupInsight } = require('../../src/services/aiService');

describe('generateGroupInsight', () => {
  beforeEach(() => {
    mockGenerateContent.mockReset();
  });

  const group = { name: 'Startup founders', description: null };
  const contacts = [
    {
      firstName: 'Maya',
      lastName: 'Chen',
      currentTitle: 'Product Designer',
      currentCompany: 'Stripe',
      CareerHistoryEntries: [],
    },
  ];

  it('parses a well-formed structured JSON response', async () => {
    mockGenerateContent.mockResolvedValue({
      candidates: [{ finishReason: 'STOP' }],
      text: JSON.stringify({
        summary: 'This group moved from design roles into product leadership.',
        suggestedRoles: ['Head of Design', 'Product Design Lead'],
      }),
    });

    const result = await generateGroupInsight(group, contacts);

    expect(result.summary).toMatch(/design/);
    expect(result.suggestedRoles).toContain('Head of Design');
    expect(mockGenerateContent).toHaveBeenCalledTimes(1);
  });

  it('throws a clear error when the AI declines', async () => {
    mockGenerateContent.mockResolvedValue({
      candidates: [{ finishReason: 'SAFETY' }],
      text: undefined,
    });
    await expect(generateGroupInsight(group, contacts)).rejects.toThrow(/declined/);
  });

  it('throws a clear error on malformed JSON', async () => {
    mockGenerateContent.mockResolvedValue({
      candidates: [{ finishReason: 'STOP' }],
      text: 'not json',
    });
    await expect(generateGroupInsight(group, contacts)).rejects.toThrow(/not valid JSON/);
  });
});
