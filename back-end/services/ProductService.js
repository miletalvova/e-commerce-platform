const { QueryTypes } = require('sequelize');
const fs = require('fs');
const path = require('path');

class ProductService {
    constructor(db) {
        this.client = db.sequelize;
        this.Product = db.Product;
        this.Brand = db.Brand;
        this.Category = db.Category;
    }

    async getAll() {
        let Products = await this.client.query('SELECT Products.id, Products.name, Products.description, Products.price, Products.quantity, Products.date_added, Products.imgurl, Products.isDeleted, Products.BrandId, Products.CategoryId, Brands.brand AS brand, Categories.category AS category FROM Products JOIN Brands on Products.BrandId = Brands.id JOIN Categories on Products.CategoryId = Categories.id ORDER BY id ASC',
            { type: QueryTypes.SELECT });
            return Products
    }

    async searchProduct(name, brand, category) {
        let query = `SELECT Products.id, Products.name, Products.description, Products.price, Products.quantity, Products.date_added, Products.imgurl, Products.isDeleted, Products.BrandId, Products.CategoryId, Brands.brand AS brand, Categories.category AS category FROM Products JOIN Brands on Products.BrandId = Brands.id JOIN Categories on Products.CategoryId = Categories.id`;
        let replacements = {};

        if(name || brand || category) {
            query += ` WHERE 1=1`
        
            if (name) {
                query += ` AND Products.name LIKE :ProductName`;
                replacements.ProductName = `%${name}%`;
            }

            if (brand) {
                query += ` AND Brands.brand = :ProductBrand`;
                replacements.ProductBrand = brand;
            }
            if (category) {
                query += ` AND Categories.category = :ProductCategory`;
                replacements.ProductCategory = category;
            }
        }
            let Products = await this.client.query(query, 
                { type: QueryTypes.SELECT,
                replacements,
            });
    
            return { count: Products.length, Products };
        }

    async createProduct(name, description, price, quantity, date_added, imgurl, brand, category) {
        try {
            const brands = await this.Brand.findOne({ where: { brand: brand } });
            const categories = await this.Category.findOne({ where: { category: category } });
            if (!brand || !category) {
                throw new Error('Brand or Category not found');
            }
            return this.Product.create({
                name,
                description,
                price, 
                quantity, 
                date_added, 
                imgurl, 
                BrandId: brands.id, 
                CategoryId: categories.id

            })
        } catch (err) {
            throw new Error('Error creating a product');
        }
    }

    async updateProduct(productId, name, description, price, quantity, imgurl, brand, category) {
        try {
            await this.Product.update({name, description, price, quantity, imgurl, BrandId: brand, CategoryId: category}, {where: {id: productId}
            });
        } catch (err) {
            throw new Error('Error updating a product');
        }
    }
    
    async deleteProduct(condition) {
        try {
            let firstCondition;
            if(!isNaN(condition)) {
                firstCondition = { id: Number(condition)};
            } else if (typeof condition === 'string') {
                firstCondition = { name: condition};
            } else {
                throw new Error('It must be product ID or product name')
            }
            await this.Product.update(
                { isDeleted: 1},
                { where: firstCondition}
            );
        } catch (err) {
            throw new Error('Error deleting a product');
        }
    }

    async getProductByName(productName) {
        try {
            const product = await this.Product.findOne({
                where: { name: productName },
                include: [
                    {
                        model: this.Brand,
                        attributes: ['brand'],
                    },
                    {
                        model: this.Category,
                        attributes: ['category'],
                    }
                ]
            });
    
            if (!product) {
                throw new Error('Product not found');
            }
            return product;
        } catch (err) {
            throw new Error('Error fetching product: ' + err.message);
        }
    }

    async populate() {
        const brands = await this.Brand.findAll();
        const categories = await this.Category.findAll();
        const products = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/products.json')));

        for (const product of products) {
            const { id, name, description, price, quantity, date_added, imgurl, brand, category } = product;
            const brandData = brands.find(item => item.brand === brand);
            const categoryData = categories.find(item => item.category === category);

            await this.client.query('INSERT INTO Products (id, name, description, price, quantity, date_added, imgurl, BrandId, CategoryId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        { type: QueryTypes.INSERT,
            replacements: [id, name, description, price, quantity, date_added, imgurl, brandData.id, categoryData.id ]
         });

        }
       
    }
    
}

module.exports = ProductService;