module.exports = (sequelize, Sequelize) => {
	const Cart = sequelize.define('Cart', {
        id: {
				type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
                autoIncrement: true,
                primaryKey: true
			},
			cartStatus: {
				type: Sequelize.DataTypes.STRING,
				defaultValue: 'In Progress'
			}
	},{
			timestamps: false
	});
    Cart.associate = function(models) {
		Cart.belongsTo(models.User);
        Cart.belongsToMany(models.Product, {through: models.CartItem, foreignKey: 'CartId'});
		Cart.hasMany(models.CartItem);
	};
return Cart
}