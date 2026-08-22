const Papa = require('papaparse');

const REQUIRED_HEADER = 'First Name';

// LinkedIn's Connections.csv export prepends a few "Notes:" explainer lines before the real
// header row, so the real header has to be located rather than assumed to be line 1.
function stripPreamble(raw) {
  const lines = raw.split(/\r?\n/);
  const headerIndex = lines.findIndex((line) => line.trim().startsWith(REQUIRED_HEADER));
  if (headerIndex === -1) {
    throw Object.assign(
      new Error(`CSV is missing the expected "${REQUIRED_HEADER}" header row`),
      { status: 400 }
    );
  }
  return lines.slice(headerIndex).join('\n');
}

function parseConnectedOn(raw) {
  if (!raw) return null;
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString().slice(0, 10);
}

// Parses a raw LinkedIn Connections.csv buffer/string into Contact-shaped objects.
// Does not touch the database — callers are responsible for persisting the result.
function parseLinkedInCsv(rawCsv) {
  const cleaned = stripPreamble(rawCsv);
  const { data, errors } = Papa.parse(cleaned, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  });

  if (errors.length) {
    throw Object.assign(new Error(`Failed to parse CSV: ${errors[0].message}`), { status: 400 });
  }

  return data
    .filter((row) => row['First Name'] || row['Last Name'])
    .map((row) => ({
      firstName: (row['First Name'] || '').trim(),
      lastName: (row['Last Name'] || '').trim(),
      linkedinUrl: (row['URL'] || '').trim() || null,
      currentCompany: (row['Company'] || '').trim() || null,
      currentTitle: (row['Position'] || '').trim() || null,
      connectedOn: parseConnectedOn(row['Connected On']),
    }));
}

module.exports = { parseLinkedInCsv };
