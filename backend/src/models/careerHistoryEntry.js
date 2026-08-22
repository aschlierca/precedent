module.exports = (sequelize, DataTypes) => {
  const CareerHistoryEntry = sequelize.define(
    'CareerHistoryEntry',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      contactId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Contacts', key: 'id' },
      },
      company: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      startDate: DataTypes.DATEONLY,
      endDate: DataTypes.DATEONLY,
      notes: DataTypes.TEXT,
    },
    {
      tableName: 'CareerHistoryEntries',
      indexes: [{ fields: ['contactId'] }],
    }
  );

  CareerHistoryEntry.associate = (db) => {
    CareerHistoryEntry.belongsTo(db.Contact, { foreignKey: 'contactId' });
  };

  return CareerHistoryEntry;
};
