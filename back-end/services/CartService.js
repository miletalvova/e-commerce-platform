const { QueryTypes } = require('sequelize');

class CartService {
    constructor(db) {
        this.client = db.sequelize;
        this.Cart = db.Cart;
        this.CartItem = db.CartItem;
        this.Order = db.Order;
        this.OrderItem = db.OrderItem;
        this.Product = db.Product;
        this.User = db.User;
        this.Membership = db.Membership;
        this.Status = db.Status;
    }

    async createCart(UserId, ProductId, quantity) {
        try {
            let cart = await this.Cart.findOne({
                where: {
                    UserId, cartStatus: 'In progress'
                }
            });
            if(!cart) {
                cart = await this.Cart.create({ UserId, cartStatus: 'In progress'});
            }
            const product = await this.Product.findByPk(ProductId);
            if(!product || product.isDeleted) {
                throw new Error('Product not found');
            }
            if(product.quantity < quantity) {
                throw new Error('Product is out-of-stock');
            }
            const cartItems = await this.CartItem.findOne({
                where: { CartId: cart.id, ProductId }
            });
            if(cartItems) {
                const increasedQuantity = cartItems.quantity + quantity;
                if (increasedQuantity > product.quantity) {
                    throw new Error('Product is out-of-stock');
                }
                cartItems.quantity = increasedQuantity;
                await cartItems.save();
            } else {
                await this.CartItem.create({
                    CartId: cart.id,
                    ProductId,
                    quantity: quantity,
                    price: product.price
                })
            }
            return { message: 'Items added successfully' }
        } catch (err) {
            throw new Error('Error adding items into a cart');
        }
    }
    async checkout(UserId) {
        try {
            let cart = await this.Cart.findOne({
                where: {
                    UserId, cartStatus: 'In Progress'
                }, include: [{ model: this.CartItem, include: [this.Product] }]
            })
            /* console.log("UserId:", UserId);
            console.log("Cart:", cart); */
            
            if (!cart) {
                throw new Error('No active cart found');
            }
            for(let cartItem of cart.CartItems) {
              const product = await this.Product.findByPk(cartItem.ProductId);
              
                if(product.quantity < cartItem.dataValues.quantity) {
                    throw new Error('There are not enough items of this product');
                }
                product.quantity -= cartItem.dataValues.quantity;
                await product.save();

            const user = await this.User.findByPk(UserId, { include: [this.Membership]});
            let newMembership = user.Membership.membership;

            const totalQuantity = cart.CartItems.reduce((accumulator, cartItem) => accumulator + cartItem.quantity, 0);

            if (totalQuantity > 15 && totalQuantity <= 30) {
                newMembership = 'Silver';
            }
            else if (totalQuantity > 30) {
                newMembership = 'Gold';
            }
            const NewMembership = await this.Membership.findOne({
                where: { membership: newMembership}
            })

            if(user.MembershipId !== NewMembership.id) {
                user.MembershipId = NewMembership.id;
                await user.save();
            }
        }
            const status = await this.Status.findOne({
                where: {OrderStatus : 'In Progress'}
            })
            const order = await this.Order.create({
                OrderNumber: this.orderNumber(),
                StatusId: status.id,
                UserId
            })
            
            for(let cartItem of cart.CartItems) {
                const product = await this.Product.findByPk(cartItem.ProductId);
                await this.OrderItem.create({
                    quantity: cartItem.dataValues.quantity,
                    price: cartItem.price,
                    OrderId: order.id,
                    ProductId: product.id,
                })
            }
            cart.cartStatus = 'Checked Out';
            await cart.save();
            const result = await this.Order.findOne({
                where: { id: order.id },
                include: [
                    { model: this.Status,
                    attributes: ['OrderStatus'] }
                ]
            });
            return result;
            /* return order; */
        } catch (error) {
            throw new Error(error.message);
        }
    }


    orderNumber() {
        return Math.random().toString(36).substr(2, 8);
    }
}

module.exports = CartService;