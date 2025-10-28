module.exports = (sequelize, Sequelize) => {
    const CartItem = sequelize.define('CartItem', {
        quantity: {
            type:
                Sequelize.DataTypes.INTEGER,
                allowNull: false,
                default: 1
        },
        price: {
            type: Sequelize.DataTypes.FLOAT,
            allowNull: false
        }
    },{
        timestamps: false
    });
    CartItem.associate = function(models) {
        CartItem.belongsTo(models.Cart, { foreignKey: 'CartId', onDelete: 'CASCADE' });
        CartItem.belongsTo(models.Product, { foreignKey: 'ProductId', onDelete: 'CASCADE' });

    }
    return CartItem
}