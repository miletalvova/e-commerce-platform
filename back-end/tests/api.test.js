const express = require('express');
const request = require('supertest');
const app = require('../app');
const jwt = require('jsonwebtoken');
const { describe } = require('node:test');

describe('testing-creating-category', () => {
    let token;
    test('POST /login - success', async () => {
        const credentials = { credentials: 'admin@noroff.no', password: 'P@ssword2023' };
        const { body } = await request(app).post('/login').send(credentials);
        console.log('Login:', body);
        expect(body).toHaveProperty('data');
        expect(body.data).toHaveProperty('token');
        expect(body.status).toBe('success'); 
        expect(body.statuscode).toBe(200);
        token = body.data.token;
    })
    test('POST /categories - success', async () => {
        let categoryObj = {
            category: "TEST_CATEGORY"
        }
        const { body } = await request(app)
        .post('/categories')
        .set('Authorization', 'Bearer ' + token)
        .send(categoryObj);
        console.log('Body:', body);
        expect(body.status).toBe('success');
        expect(body.statuscode).toBe(200);
        expect(body.data).toHaveProperty('result', 'Category created successfully');
        expect(body.data.category.category).toBe(categoryObj.category);
    })
    test('POST /brands - success', async () => {
        let brandObj = {
            brand: "TEST_BRAND"
        }
        const { body } = await request(app)
        .post('/brands')
        .set('Authorization', 'Bearer ' + token)
        .send(brandObj);
        console.log('Body:', body);
        expect(body.status).toBe('success');
        expect(body.statuscode).toBe(200);
        expect(body.data).toHaveProperty('result', 'Brand created successfully');
        expect(body.data.brand.brand).toBe(brandObj.brand);
    })
    test('POST /products - success', async () => {
        let productObj = {
            name: "TEST_PRODUCT", 
            description: "PRODUCT", 
            price: 99.99, 
            quantity: 10,
            brand: "TEST_BRAND", 
            category: "TEST_CATEGORY"
        }
        const { body } = await request(app)
        .post('/products/add')
        .set('Authorization', 'Bearer ' + token)
        .send(productObj);
        console.log('Body:', body);
        expect(body.status).toBe('success');
        expect(body.statuscode).toBe(200);
        expect(body.data).toHaveProperty('result', 'Product created successfully')
    })
    test('GET /products/:name - success', async () => {
        const productName = "TEST_PRODUCT";
        const { body } = await request(app)
        .get(`/products/${productName}`)
        .set('Authorization', 'Bearer ' + token)
        expect(body.status).toBe('success');
        expect(body.statuscode).toBe(200);
        expect(body.data).toHaveProperty('name', 'TEST_PRODUCT');
        expect(body.data).toHaveProperty('price', 99,99);
        expect(body.data).toHaveProperty('quantity', 10);
    })
    test('PUT /categories/:id - success', async () => {
        const id = "TEST_CATEGORY"
        let newCategory = {
            category: "TEST_CATEGORY2"
        }
        const { body } = await request(app)
        .put(`/categories/${id}`)
        .set('Authorization', 'Bearer ' + token)
        .send(newCategory);
        console.log('Body:', body);
        expect(body.status).toBe('success');
        expect(body.statuscode).toBe(200);
        expect(body.data.category).toHaveProperty('category', 'TEST_CATEGORY2');
    })
    test('PUT /brands/:id - success', async () => {
        const id = "TEST_BRAND"
        let newBrand = {
            brand: "TEST_BRAND2"
        }
        const { body } = await request(app)
        .put(`/brands/${id}`)
        .set('Authorization', 'Bearer ' + token)
        .send(newBrand);
        expect(body.status).toBe('success');
        expect(body.statuscode).toBe(200);
        expect(body.data).toHaveProperty('result', 'Brand updated successfully')
        expect(body.data.brand).toHaveProperty('brand', 'TEST_BRAND2');
    })
    test('GET /products/:name - success', async () => {
        const productName = "TEST_PRODUCT";
        const { body } = await request(app)
        .get(`/products/${productName}`)
        .set('Authorization', 'Bearer ' + token)
        expect(body.status).toBe('success');
        expect(body.statuscode).toBe(200);
        expect(body.data).toHaveProperty('name', 'TEST_PRODUCT');
        expect(body.data.Brand).toHaveProperty('brand', 'TEST_BRAND2');
        expect(body.data.Category).toHaveProperty('category', 'TEST_CATEGORY2');
        expect(body.data).toHaveProperty('price', 99.99);
        expect(body.data).toHaveProperty('quantity', 10);
    })
    test('DELETE /products/:id - success', async () => {
        const productName = "TEST_PRODUCT";
        const { body } = await request(app)
        .delete(`/products/${productName}`)
        .set('Authorization', 'Bearer ' + token)
        expect(body.status).toBe('success');
        expect(body.statuscode).toBe(200);
        expect(body.data.result).toBe('Product deleted successfully');        
    })
})
