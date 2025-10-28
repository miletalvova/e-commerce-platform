const { QueryTypes } = require('sequelize');
const fs = require('fs');
const path = require('path');

class CategoryService {
    constructor(db) {
        this.client = db.sequelize;
        this.Category = db.Category;
    }

    async getAll() {
        return this.Category.findAll({
            where: {},
        })
    }

    async createCategory(category) {
        try {
            return this.Category.create({
                category
            })
        } catch (err) {
            throw new Error('Error creating a category');
        }
    }

    async updateCategory(condition, newCategory) {
        try {
            let firstCondition;
            if(!isNaN(condition)) {
                firstCondition = { id: Number(condition)};
            } else if (typeof condition === 'string') {
                firstCondition = { category: condition};
            } else {
                throw new Error('It must be category ID or category name')
            }
            await this.Category.update(
                { category: newCategory},
                { where: firstCondition}
            );
            const updatedCategory = await this.Category.findOne({ where: { category: newCategory } });
            return updatedCategory;
        } catch (err) {
            throw new Error('Error updating category');
        }
    }

    async deleteCategory(categoryId) {
        try {
            await this.Category.destroy({
                where: {id: categoryId}
            });
        } catch (err) {
            throw new Error('Error deleting a category');
        }
    }    

    async populate() {
        const products = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/products.json')));
        const categories = [...new Set(products.map(item => item.category))]

        for (const category of categories) {
            await this.client.query('INSERT INTO Categories (category) VALUES (?)',
        { type: QueryTypes.INSERT,
            replacements: [category]
         });
        }
    }
}

module.exports = CategoryService;