'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CareerHistoryEntries', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      contactId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Contacts', key: 'id' },
        onDelete: 'CASCADE',
      },
      company: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      startDate: Sequelize.DATEONLY,
      endDate: Sequelize.DATEONLY,
      notes: Sequelize.TEXT,
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
    await queryInterface.addIndex('CareerHistoryEntries', ['contactId']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('CareerHistoryEntries');
  },
};
