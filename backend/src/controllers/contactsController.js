const { Contact, CareerHistoryEntry } = require('../models');
const { parseLinkedInCsv } = require('../services/csvImportService');

function notFound() {
  return Object.assign(new Error('Contact not found'), { status: 404 });
}

async function list(req, res) {
  const contacts = await Contact.findAll({
    where: { userId: req.userId },
    order: [['lastName', 'ASC'], ['firstName', 'ASC']],
  });
  res.json(contacts);
}

async function create(req, res) {
  const { firstName, lastName, linkedinUrl, currentCompany, currentTitle, connectedOn, notes } = req.body;
  if (!firstName || !lastName) {
    throw Object.assign(new Error('firstName and lastName are required'), { status: 400 });
  }
  const contact = await Contact.create({
    userId: req.userId,
    firstName,
    lastName,
    linkedinUrl,
    currentCompany,
    currentTitle,
    connectedOn,
    notes,
  });
  res.status(201).json(contact);
}

async function get(req, res) {
  const contact = await Contact.findOne({
    where: { id: req.params.id, userId: req.userId },
    include: [{ model: CareerHistoryEntry }],
  });
  if (!contact) throw notFound();
  res.json(contact);
}

async function update(req, res) {
  const contact = await Contact.findOne({ where: { id: req.params.id, userId: req.userId } });
  if (!contact) throw notFound();
  const { firstName, lastName, linkedinUrl, currentCompany, currentTitle, connectedOn, notes } = req.body;
  await contact.update({ firstName, lastName, linkedinUrl, currentCompany, currentTitle, connectedOn, notes });
  res.json(contact);
}

async function remove(req, res) {
  const contact = await Contact.findOne({ where: { id: req.params.id, userId: req.userId } });
  if (!contact) throw notFound();
  await contact.destroy();
  res.status(204).end();
}

async function importCsv(req, res) {
  if (!req.file) {
    throw Object.assign(new Error('No CSV file uploaded'), { status: 400 });
  }
  const rows = parseLinkedInCsv(req.file.buffer.toString('utf-8'));
  const created = await Contact.bulkCreate(
    rows.map((row) => ({ ...row, userId: req.userId }))
  );
  res.status(201).json({ imported: created.length });
}

async function listCareerHistory(req, res) {
  const contact = await Contact.findOne({ where: { id: req.params.id, userId: req.userId } });
  if (!contact) throw notFound();
  const entries = await CareerHistoryEntry.findAll({
    where: { contactId: contact.id },
    order: [['startDate', 'DESC']],
  });
  res.json(entries);
}

async function createCareerHistory(req, res) {
  const contact = await Contact.findOne({ where: { id: req.params.id, userId: req.userId } });
  if (!contact) throw notFound();
  const { company, title, startDate, endDate, notes } = req.body;
  if (!company || !title) {
    throw Object.assign(new Error('company and title are required'), { status: 400 });
  }
  const entry = await CareerHistoryEntry.create({
    contactId: contact.id,
    company,
    title,
    startDate,
    endDate,
    notes,
  });
  res.status(201).json(entry);
}

module.exports = {
  list,
  create,
  get,
  update,
  remove,
  importCsv,
  listCareerHistory,
  createCareerHistory,
};
