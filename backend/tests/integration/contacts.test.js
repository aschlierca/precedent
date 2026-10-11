process.env.AUTH_BYPASS = 'true';

const request = require('supertest');
const app = require('../../src/app');
const { sequelize, Contact, Group, GroupInsight, CareerHistoryEntry, ContactGroup } = require('../../src/models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterEach(async () => {
  await GroupInsight.destroy({ where: {}, truncate: true, cascade: true });
  await ContactGroup.destroy({ where: {}, truncate: true, cascade: true });
  await CareerHistoryEntry.destroy({ where: {}, truncate: true, cascade: true });
  await Group.destroy({ where: {}, truncate: true, cascade: true });
  await Contact.destroy({ where: {}, truncate: true, cascade: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('contacts + groups API', () => {
  it('creates, lists, and fetches a contact', async () => {
    const createRes = await request(app)
      .post('/api/contacts')
      .send({ firstName: 'Ada', lastName: 'Lovelace', currentTitle: 'Analyst' });
    expect(createRes.status).toBe(201);

    const listRes = await request(app).get('/api/contacts');
    expect(listRes.status).toBe(200);
    expect(listRes.body).toHaveLength(1);

    const getRes = await request(app).get(`/api/contacts/${createRes.body.id}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.firstName).toBe('Ada');
  });

  it('rejects a contact without a name', async () => {
    const res = await request(app).post('/api/contacts').send({ firstName: 'NoLastName' });
    expect(res.status).toBe(400);
  });

  it('creates a group, assigns a contact, and reflects the count', async () => {
    const contact = await request(app)
      .post('/api/contacts')
      .send({ firstName: 'Grace', lastName: 'Hopper' });
    const group = await request(app).post('/api/groups').send({ name: 'Pioneers' });

    const assignRes = await request(app).post(
      `/api/groups/${group.body.id}/contacts/${contact.body.id}`
    );
    expect(assignRes.status).toBe(204);

    const listRes = await request(app).get('/api/groups');
    expect(listRes.body[0].contactCount).toBe(1);
  });

  it('returns 204 for a group with no cached insight yet', async () => {
    const group = await request(app).post('/api/groups').send({ name: 'Empty' });
    const insightRes = await request(app).get(`/api/groups/${group.body.id}/insight`);
    expect(insightRes.status).toBe(204);
  });

  it('scopes contacts to the requesting user only', async () => {
    await request(app).post('/api/contacts').send({ firstName: 'Scoped', lastName: 'User' });
    const otherContact = await Contact.create({ userId: 'someone-else', firstName: 'Other', lastName: 'Person' });

    const listRes = await request(app).get('/api/contacts');
    expect(listRes.body.map((c) => c.id)).not.toContain(otherContact.id);
  });
});
