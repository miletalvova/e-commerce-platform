module.exports = (sequelize, Sequelize) => {
	const Role = sequelize.define('Role', {
			role: {
				type: Sequelize.DataTypes.STRING,
				defaultValue: "User" 
			 }
	},{
			timestamps: false
	});
return Role
}