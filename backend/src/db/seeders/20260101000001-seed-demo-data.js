'use strict';

const userId = process.env.SEED_USER_ID || 'dev-user';

const contacts = [
  {
    firstName: 'Maya',
    lastName: 'Chen',
    linkedinUrl: 'https://linkedin.com/in/mayachen',
    currentCompany: 'Stripe',
    currentTitle: 'Senior Product Designer',
    connectedOn: '2022-03-14',
    notes: 'Met at a UX meetup.',
    history: [
      { company: 'Figma', title: 'Product Designer', startDate: '2019-06-01', endDate: '2021-12-01' },
      { company: 'Freelance', title: 'UI Designer', startDate: '2017-09-01', endDate: '2019-05-01' },
    ],
  },
  {
    firstName: 'Daniel',
    lastName: 'Okafor',
    linkedinUrl: 'https://linkedin.com/in/danielokafor',
    currentCompany: 'Google',
    currentTitle: 'Software Engineer III',
    connectedOn: '2021-11-02',
    notes: 'Former TTP classmate.',
    history: [
      { company: 'Google', title: 'Software Engineer II', startDate: '2021-01-01', endDate: '2023-06-01' },
      { company: 'Amazon', title: 'SDE I', startDate: '2019-07-01', endDate: '2020-12-01' },
    ],
  },
  {
    firstName: 'Priya',
    lastName: 'Ramanathan',
    linkedinUrl: 'https://linkedin.com/in/priyaramanathan',
    currentCompany: 'Notion',
    currentTitle: 'Engineering Manager',
    connectedOn: '2020-05-19',
    notes: null,
    history: [
      { company: 'Notion', title: 'Senior Software Engineer', startDate: '2020-05-01', endDate: '2022-08-01' },
      { company: 'Microsoft', title: 'Software Engineer', startDate: '2016-08-01', endDate: '2020-04-01' },
    ],
  },
  {
    firstName: 'Ben',
    lastName: 'Whitfield',
    linkedinUrl: 'https://linkedin.com/in/benwhitfield',
    currentCompany: 'Example AI Company',
    currentTitle: 'Applied AI Engineer',
    connectedOn: '2023-01-08',
    notes: 'Introduced by Priya.',
    history: [
      { company: 'OpenAI', title: 'ML Engineer', startDate: '2021-03-01', endDate: '2022-11-01' },
      { company: 'Palantir', title: 'Forward Deployed Engineer', startDate: '2018-07-01', endDate: '2021-02-01' },
    ],
  },
  {
    firstName: 'Sofia',
    lastName: 'Martinez',
    linkedinUrl: 'https://linkedin.com/in/sofiamartinez',
    currentCompany: 'Sequoia Capital',
    currentTitle: 'Investment Associate',
    connectedOn: '2022-09-27',
    notes: null,
    history: [
      { company: 'Goldman Sachs', title: 'Investment Banking Analyst', startDate: '2020-07-01', endDate: '2022-06-01' },
    ],
  },
  {
    firstName: 'Jordan',
    lastName: 'Lee',
    linkedinUrl: 'https://linkedin.com/in/jordanlee',
    currentCompany: 'Datadog',
    currentTitle: 'Product Manager',
    connectedOn: '2021-04-12',
    notes: null,
    history: [
      { company: 'Datadog', title: 'Associate Product Manager', startDate: '2020-01-01', endDate: '2022-01-01' },
      { company: 'Deloitte', title: 'Business Analyst', startDate: '2018-08-01', endDate: '2019-12-01' },
    ],
  },
  {
    firstName: 'Aisha',
    lastName: 'Bello',
    linkedinUrl: 'https://linkedin.com/in/aishabello',
    currentCompany: 'Airbnb',
    currentTitle: 'Staff Software Engineer',
    connectedOn: '2019-10-03',
    notes: 'Former teammate at Amazon.',
    history: [
      { company: 'Airbnb', title: 'Senior Software Engineer', startDate: '2019-10-01', endDate: '2023-02-01' },
      { company: 'Amazon', title: 'SDE II', startDate: '2016-06-01', endDate: '2019-09-01' },
    ],
  },
  {
    firstName: 'Marcus',
    lastName: 'Ito',
    linkedinUrl: 'https://linkedin.com/in/marcusito',
    currentCompany: 'Two Sigma',
    currentTitle: 'Quantitative Researcher',
    connectedOn: '2020-02-14',
    notes: null,
    history: [
      { company: 'Jane Street', title: 'Trading Analyst', startDate: '2018-07-01', endDate: '2020-01-01' },
    ],
  },
];

const groups = [
  { name: 'Startup founders & operators', description: 'People building or scaling startups.', memberIndexes: [0, 3, 4] },
  { name: 'Big Tech engineers', description: 'Software engineers at large tech companies.', memberIndexes: [1, 2, 6] },
  { name: 'Grad school & bootcamp friends', description: 'People from TTP and other programs.', memberIndexes: [1, 5, 7] },
];

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    const contactRows = contacts.map((c) => ({
      userId,
      firstName: c.firstName,
      lastName: c.lastName,
      linkedinUrl: c.linkedinUrl,
      currentCompany: c.currentCompany,
      currentTitle: c.currentTitle,
      connectedOn: c.connectedOn,
      notes: c.notes,
      createdAt: now,
      updatedAt: now,
    }));

    await queryInterface.bulkInsert('Contacts', contactRows);
    const insertedContacts = await queryInterface.sequelize.query(
      `SELECT id, "firstName", "lastName" FROM "Contacts" WHERE "userId" = :userId ORDER BY id ASC`,
      { replacements: { userId }, type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const historyRows = [];
    contacts.forEach((c, index) => {
      const contactId = insertedContacts[index].id;
      c.history.forEach((h) => {
        historyRows.push({
          contactId,
          company: h.company,
          title: h.title,
          startDate: h.startDate,
          endDate: h.endDate,
          notes: null,
          createdAt: now,
          updatedAt: now,
        });
      });
    });
    if (historyRows.length) {
      await queryInterface.bulkInsert('CareerHistoryEntries', historyRows);
    }

    const groupRows = groups.map((g) => ({
      userId,
      name: g.name,
      description: g.description,
      createdAt: now,
      updatedAt: now,
    }));
    await queryInterface.bulkInsert('Groups', groupRows);
    const insertedGroups = await queryInterface.sequelize.query(
      `SELECT id, name FROM "Groups" WHERE "userId" = :userId ORDER BY id ASC`,
      { replacements: { userId }, type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const contactGroupRows = [];
    groups.forEach((g, index) => {
      const groupId = insertedGroups[index].id;
      g.memberIndexes.forEach((memberIndex) => {
        contactGroupRows.push({
          contactId: insertedContacts[memberIndex].id,
          groupId,
          createdAt: now,
          updatedAt: now,
        });
      });
    });
    await queryInterface.bulkInsert('ContactGroups', contactGroupRows);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('ContactGroups', null, {});
    await queryInterface.bulkDelete('GroupInsights', null, {});
    await queryInterface.bulkDelete('Groups', { userId }, {});
    await queryInterface.bulkDelete('CareerHistoryEntries', null, {});
    await queryInterface.bulkDelete('Contacts', { userId }, {});
  },
};
