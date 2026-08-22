const { CareerHistoryEntry, Contact } = require('../models');

async function findOwned(id, userId) {
  const entry = await CareerHistoryEntry.findByPk(id, { include: [{ model: Contact }] });
  if (!entry || entry.Contact.userId !== userId) {
    throw Object.assign(new Error('Career history entry not found'), { status: 404 });
  }
  return entry;
}

async function update(req, res) {
  const entry = await findOwned(req.params.id, req.userId);
  const { company, title, startDate, endDate, notes } = req.body;
  await entry.update({ company, title, startDate, endDate, notes });
  res.json(entry);
}

async function remove(req, res) {
  const entry = await findOwned(req.params.id, req.userId);
  await entry.destroy();
  res.status(204).end();
}

module.exports = { update, remove };
