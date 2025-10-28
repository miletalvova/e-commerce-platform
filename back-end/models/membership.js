module.exports = (sequelize, Sequelize) => {
	const Membership = sequelize.define('Membership', {
        membership: {
				type: Sequelize.DataTypes.STRING,
				allowNull: false,
                defaultValue: "Bronze",
			},
			discount: {
				type: Sequelize.DataTypes.DECIMAL(5, 2),
				allowNull: false,
                defaultValue: 0.00,
			}
	},{
			timestamps: false
	});
	Membership.associate = function(models) {
		Membership.hasMany(models.User);
	};
return Membership
}