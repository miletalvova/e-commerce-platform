module.exports = (sequelize, Sequelize) => {
    const OrderItem = sequelize.define('OrderItem', {
        quantity: {
            type:
                Sequelize.DataTypes.INTEGER,
                allowNull: false,
                default: 1
        },
        price: {
            type: Sequelize.DataTypes.FLOAT,
            allowNull: false
        },
        OrderId: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false
        }
        
    },{
        timestamps: false
    });
    OrderItem.associate = function(models) {
        OrderItem.belongsTo(models.Order, { foreignKey: 'OrderId', onDelete: 'CASCADE' });
        OrderItem.belongsTo(models.Product, { foreignKey: 'ProductId', onDelete: 'CASCADE' });
    };
    return OrderItem
}