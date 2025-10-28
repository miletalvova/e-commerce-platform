module.exports = (sequelize, Sequelize) => {
	const Brand = sequelize.define('Brand', {
			brand: {
				type: Sequelize.DataTypes.STRING,
				allowNull: false
			}
	},{
			timestamps: false
	});
    Brand.associate = function(models) {
		Brand.hasMany(models.Product)
	};
return Brand
}