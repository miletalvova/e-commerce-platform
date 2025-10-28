module.exports = (sequelize, Sequelize) => {
	const Order = sequelize.define('Order', {
			id: {
				type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
                autoIncrement: true,
                primaryKey: true
			},
			OrderNumber: {
				type: Sequelize.DataTypes.STRING,
				allowNull: false,
				unique: true
			}	
	},{
			timestamps: true
	});
	Order.associate = function(models) {
		Order.belongsTo(models.User);
        Order.hasMany(models.OrderItem, {foreignKey: 'OrderId'});
		Order.belongsTo(models.Status, { foreignKey: 'StatusId' });
	};
return Order
}