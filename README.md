# **E-Commerce Platform**

Full-stack e-commerce system built with Node.js, Express.js, MySQL, JWT authentication, and EJS templates.

## Overview

This project simulates a complete e-commerce system featuring user authenctication, product management, shopping cart functionality, and an admin dashboard.
Developed as part of the Noroff Backend Development program, it demonstrates full-stack architecture, database modeling, and API implementation.

## Features

Back-End

- RESTful API built with Express.js and Sequelize ORM
- Authentication and authorization using JWT tokens
- Role-based access (Admin/User)
- CRUD operations for Products, Categories, Brands, Orders, and Memberships
- API documentation with Swagger
- Unit testing using Jest and Supertest

Front-End (Admin Interface)

- Built with Express.js and EJS templates
- Admin authentication and session handling
- Product, Category, Brand, Order, and User management dashboards
- Clean Bootstrap-based UI

## Database Design

- MySQL database designed in 3rd Normal Form (3NF)
- Tomestamps fields (created_at, updated_at) for record tracking
- Relationships implemented via Sequelize models (User - Orders, Orders - Products. etc.)

## Learning Highlights

- Implemented full-stack CRUD architecture with route protection
- Strengthened understanding of authentication flows and middleware
- Gained experience with API documentation and backend testing frameworks
- Practiced agile development approach using Jira

## Tech Stack

Back-End: Node.js · Express.js · Sequelize ORM · MySQL · JWT · Jest · Supertest
Front-End: Express.js · EJS · Bootstrap · Sweetalert2
Documentation: Swagger
Project Management: Jira

## Getting Started

Prerequisites
• Node.js v18 or higher
• MySQL

Installation

```
git clone https://github.com/miletalvova/e-commerce-platform.git
```

Back-End

```
cd back-end
npm install
npm run dev
```

Front-End

```
cd front-end
npm install
npm run dev
```

## Documentation

Swagger documentation is available at:
http://localhost:3000/doc
