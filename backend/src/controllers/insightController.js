const { Group, Contact, CareerHistoryEntry, GroupInsight } = require('../models');
const { generateGroupInsight } = require('../services/aiService');
const { findOwnedGroup } = require('./groupsController');

async function get(req, res) {
  const group = await findOwnedGroup(req.params.id, req.userId);
  const insight = await GroupInsight.findOne({ where: { groupId: group.id } });
  if (!insight) {
    res.status(204).end();
    return;
  }
  res.json(insight);
}

async function generate(req, res) {
  const group = await findOwnedGroup(req.params.id, req.userId);
  const contacts = await Contact.findAll({
    include: [
      { model: CareerHistoryEntry },
      { model: Group, where: { id: group.id }, attributes: [] },
    ],
  });

  if (contacts.length === 0) {
    throw Object.assign(new Error('Add contacts to this group before generating an insight'), {
      status: 400,
    });
  }

  const { summary, suggestedRoles } = await generateGroupInsight(group, contacts);

  const [insight] = await GroupInsight.upsert({
    groupId: group.id,
    summaryText: summary,
    suggestedRoles,
    generatedAt: new Date(),
  });

  res.json(insight);
}

module.exports = { get, generate };
