module.exports = (sequelize, Sequelize) => {
	const Product = sequelize.define('Product', {
			name: {
				type: Sequelize.DataTypes.STRING,
				allowNull: false
			},
			description: {
				type: Sequelize.DataTypes.STRING,
				allowNull: false
			},
			price: {
					type: Sequelize.DataTypes.FLOAT,
					allowNull: false
			},
			quantity: {
				type: Sequelize.DataTypes.INTEGER,
				allowNull: false
			},
			date_added: {
					type: Sequelize.DataTypes.DATEONLY,
					allowNull: true
			},
			imgurl: {
				type: Sequelize.DataTypes.STRING,
				allowNull: true
			},
			isDeleted: {
				type: Sequelize.DataTypes.BOOLEAN,
				defaultValue: false
			}
	},{
			timestamps: false
	});
	Product.associate = function(models) {
		Product.belongsTo(models.Brand);
		Product.belongsTo(models.Category);
		Product.belongsToMany(models.Order, { through: models.OrderItem})
		Product.belongsToMany(models.Cart, {through: models.CartItem})
	};
return Product
}