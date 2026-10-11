const { parseLinkedInCsv } = require('../../src/services/csvImportService');

describe('parseLinkedInCsv', () => {
  it('strips the LinkedIn export preamble and parses rows', () => {
    const raw = [
      'Notes:',
      '"When exporting your connection data, you may notice more connections than are visible on your account..."',
      '',
      'First Name,Last Name,URL,Email Address,Company,Position,Connected On',
      'Jane,Doe,https://linkedin.com/in/janedoe,jane@example.com,Acme Corp,Software Engineer,15 Jan 2023',
      'John,Smith,https://linkedin.com/in/johnsmith,,Globex,Product Manager,02 Mar 2022',
    ].join('\n');

    const result = parseLinkedInCsv(raw);

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      firstName: 'Jane',
      lastName: 'Doe',
      linkedinUrl: 'https://linkedin.com/in/janedoe',
      currentCompany: 'Acme Corp',
      currentTitle: 'Software Engineer',
      connectedOn: '2023-01-15',
    });
    expect(result[1].firstName).toBe('John');
  });

  it('throws a 400 error when the header row is missing', () => {
    expect(() => parseLinkedInCsv('not,a,linkedin,export\n1,2,3,4')).toThrow(
      /First Name/
    );
  });

  it('skips rows with no name', () => {
    const raw = [
      'First Name,Last Name,URL,Company,Position,Connected On',
      ',,,,,',
      'Jane,Doe,,Acme,Engineer,15 Jan 2023',
    ].join('\n');

    const result = parseLinkedInCsv(raw);
    expect(result).toHaveLength(1);
  });
});
