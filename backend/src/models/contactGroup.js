module.exports = (sequelize, DataTypes) => {
  const ContactGroup = sequelize.define(
    'ContactGroup',
    {
      contactId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Contacts', key: 'id' },
      },
      groupId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Groups', key: 'id' },
      },
    },
    {
      tableName: 'ContactGroups',
    }
  );

  return ContactGroup;
};
