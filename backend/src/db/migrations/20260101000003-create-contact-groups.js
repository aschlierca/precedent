'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ContactGroups', {
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
      groupId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Groups', key: 'id' },
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
    await queryInterface.addIndex('ContactGroups', ['contactId', 'groupId'], {
      unique: true,
      name: 'contact_groups_unique_pair',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('ContactGroups');
  },
};
