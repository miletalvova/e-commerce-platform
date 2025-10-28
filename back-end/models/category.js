module.exports = (sequelize, Sequelize) => {
	const Category = sequelize.define('Category', {
			category: {
				type: Sequelize.DataTypes.STRING,
				allowNull: false
			}
	},{
			timestamps: false
	});
	Category.associate = function(models) {
		Category.hasMany(models.Product)
	};
return Category
}