const { QueryTypes } = require('sequelize');
const fs = require('fs');
const path = require('path');

class BrandService {
    constructor(db) {
        this.client = db.sequelize;
        this.Brand = db.Brand;
    }

    async getAll() {
        return this.Brand.findAll({
            where: {},
        })
    }

    async createBrand(brand) {
        try {
            return this.Brand.create({
                brand
            })
        } catch (err) {
            throw new Error('Error creating a brand');
        }
    }

    async updateBrand(condition, newBrand) {
        try {
            let firstCondition;
            if(!isNaN(condition)) {
                firstCondition = { id: Number(condition)};
            } else if (typeof condition === 'string') {
                firstCondition = { brand: condition};
            } else {
                throw new Error('It must be brand ID or brand name')
            }
            await this.Brand.update(
                { brand: newBrand},
                { where: firstCondition}
            );
            const updatedBrand = await this.Brand.findOne({ where: { brand: newBrand } });
            return updatedBrand;
        } catch (err) {
            throw new Error('Error updating a product');
        }
    }
    
    async deleteBrand(brandId) {
        try {
            await this.Brand.destroy({
                where: {id: brandId}
            });
        } catch (err) {
            throw new Error('Error deleting a brand');
        }
    }
    async populate() {
        const products = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/products.json')));
        const brands = [...new Set(products.map(item => item.brand))]

        for (const brand of brands) {
            await this.client.query('INSERT INTO Brands (brand) VALUES (?)',
        { type: QueryTypes.INSERT,
            replacements: [brand]
         });
        }
    }

}

module.exports = BrandService;