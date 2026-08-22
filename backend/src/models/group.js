module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define(
    'Group',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: DataTypes.TEXT,
    },
    {
      tableName: 'Groups',
      indexes: [{ fields: ['userId'] }],
    }
  );

  Group.associate = (db) => {
    Group.belongsToMany(db.Contact, {
      through: db.ContactGroup,
      foreignKey: 'groupId',
      otherKey: 'contactId',
    });
    Group.hasOne(db.GroupInsight, { foreignKey: 'groupId', onDelete: 'CASCADE' });
  };

  return Group;
};
