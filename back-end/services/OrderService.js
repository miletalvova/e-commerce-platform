class OrderService {
    constructor(db) {
        this.client = db.sequelize;
        this.Order = db.Order;
        this.OrderItem = db.OrderItem;
        this.Product = db.Product;
        this.User = db.User;
        this.Membership = db.Membership;
        this.Status = db.Status;
    }

    async getOrders(UserId) {
        const orders = await this.Order.findAll({
            where: {UserId},
            include: [
                {
                    model: this.OrderItem,
                     include: [this.Product]
                },
                { model: this.Status,
                attributes: ['OrderStatus'] 
                }
            ]
        })
       return { orders };
    }

    async getAll() {
        return this.Status.findAll({
            where: {},
        })
    }

    async updateStatus(orderId, OrderStatus) {
        try {
            const status = await this.Status.findOne({
                where: {
                    OrderStatus: OrderStatus
                }
            });
            if (!status) {
                throw new Error('Status not found')
            }
            await this.Order.update({
                StatusId: status.id
            }, 
            {where: { id: orderId }
            });
        } catch (err) {
            throw new Error('Error updating order status');
        }
    }
    
}

module.exports = OrderService;