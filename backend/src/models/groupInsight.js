module.exports = (sequelize, DataTypes) => {
  const GroupInsight = sequelize.define(
    'GroupInsight',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      groupId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: { model: 'Groups', key: 'id' },
      },
      summaryText: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      suggestedRoles: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
      },
      generatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: 'GroupInsights',
    }
  );

  GroupInsight.associate = (db) => {
    GroupInsight.belongsTo(db.Group, { foreignKey: 'groupId' });
  };

  return GroupInsight;
};
