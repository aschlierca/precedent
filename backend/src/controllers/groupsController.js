const { Group, Contact, CareerHistoryEntry } = require('../models');

function notFound() {
  return Object.assign(new Error('Group not found'), { status: 404 });
}

async function findOwnedGroup(id, userId) {
  const group = await Group.findOne({ where: { id, userId } });
  if (!group) throw notFound();
  return group;
}

async function list(req, res) {
  const groups = await Group.findAll({
    where: { userId: req.userId },
    include: [{ model: Contact, attributes: ['id'] }],
    order: [['name', 'ASC']],
  });
  const withCounts = groups.map((g) => ({
    id: g.id,
    name: g.name,
    description: g.description,
    contactCount: g.Contacts.length,
  }));
  res.json(withCounts);
}

async function create(req, res) {
  const { name, description } = req.body;
  if (!name) throw Object.assign(new Error('name is required'), { status: 400 });
  const group = await Group.create({ userId: req.userId, name, description });
  res.status(201).json(group);
}

async function get(req, res) {
  const group = await Group.findOne({
    where: { id: req.params.id, userId: req.userId },
    include: [{ model: Contact, include: [{ model: CareerHistoryEntry }] }],
  });
  if (!group) throw notFound();
  res.json(group);
}

async function update(req, res) {
  const group = await findOwnedGroup(req.params.id, req.userId);
  const { name, description } = req.body;
  await group.update({ name, description });
  res.json(group);
}

async function remove(req, res) {
  const group = await findOwnedGroup(req.params.id, req.userId);
  await group.destroy();
  res.status(204).end();
}

async function assignContact(req, res) {
  const group = await findOwnedGroup(req.params.id, req.userId);
  const contact = await Contact.findOne({ where: { id: req.params.contactId, userId: req.userId } });
  if (!contact) throw Object.assign(new Error('Contact not found'), { status: 404 });
  await group.addContact(contact);
  res.status(204).end();
}

async function unassignContact(req, res) {
  const group = await findOwnedGroup(req.params.id, req.userId);
  const contact = await Contact.findOne({ where: { id: req.params.contactId, userId: req.userId } });
  if (!contact) throw Object.assign(new Error('Contact not found'), { status: 404 });
  await group.removeContact(contact);
  res.status(204).end();
}

module.exports = { list, create, get, update, remove, assignContact, unassignContact, findOwnedGroup };
