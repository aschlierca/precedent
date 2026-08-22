'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Contacts', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      linkedinUrl: Sequelize.STRING,
      currentCompany: Sequelize.STRING,
      currentTitle: Sequelize.STRING,
      connectedOn: Sequelize.DATEONLY,
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
    await queryInterface.addIndex('Contacts', ['userId']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Contacts');
  },
};
