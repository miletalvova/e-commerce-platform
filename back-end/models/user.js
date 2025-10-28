module.exports = (sequelize, Sequelize) => {
	const User = sequelize.define('User', {
			FirstName: {
				type: Sequelize.DataTypes.STRING,
				allowNull: false
			},
			LastName: {
				type: Sequelize.DataTypes.STRING,
				allowNull: false
			},
			Username: {
					type: Sequelize.DataTypes.STRING,
					allowNull: false,
					unique: true
			},
			Email: {
				type: Sequelize.DataTypes.STRING,
				allowNull: false,
				unique: true,
				validate: {
					isEmail: true
				}
			},
			EncryptedPassword: {
					type: Sequelize.DataTypes.BLOB,
					allowNull: false
			},
			Salt: {
				type: Sequelize.DataTypes.BLOB,
				allowNull: false,
			},
			Address: {
				type: Sequelize.DataTypes.STRING,
				allowNull: false
			},
			Phone: {
				type: Sequelize.DataTypes.STRING,
				allowNull: false
			}
			
	},{
			timestamps: false
	});
	User.associate = function(models) {
		User.belongsTo(models.Role, { foreignKey: 'RoleId' });
		User.belongsTo(models.Membership, { foreignKey: 'MembershipId' });
		User.hasOne(models.Cart);
		User.hasMany(models.Order);
	};
return User
}