module.exports = (sequelize, DataTypes) => {
  const Contact = sequelize.define(
    'Contact',
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
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      linkedinUrl: DataTypes.STRING,
      currentCompany: DataTypes.STRING,
      currentTitle: DataTypes.STRING,
      connectedOn: DataTypes.DATEONLY,
      notes: DataTypes.TEXT,
    },
    {
      tableName: 'Contacts',
      indexes: [{ fields: ['userId'] }],
    }
  );

  Contact.associate = (db) => {
    Contact.hasMany(db.CareerHistoryEntry, { foreignKey: 'contactId', onDelete: 'CASCADE' });
    Contact.belongsToMany(db.Group, {
      through: db.ContactGroup,
      foreignKey: 'contactId',
      otherKey: 'groupId',
    });
  };

  return Contact;
};
