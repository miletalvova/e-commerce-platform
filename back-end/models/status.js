module.exports = (sequelize, Sequelize) => {
	const Status = sequelize.define('Status', {
        OrderStatus: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
            defaultValue: "In Progress",
            values: ['In Progress', 'Ordered', 'Completed']
			}
	},{
			timestamps: false
	});
    Status.associate = function(models) {
		Status.hasMany(models.Order);
	};
return Status
}