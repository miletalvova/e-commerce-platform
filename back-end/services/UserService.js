const { Op } = require("sequelize");
var crypto = require('crypto');
const fs = require("fs").promises;
const path = require("path");
const { QueryTypes } = require("sequelize");
const db = require("../models");


class UserService {
    constructor(db) {
        this.client = db.sequelize;
        this.User = db.User;
        this.Role = db.Role;
        this.Membership = db.Membership;
    }

    async getOne(credentials) {
        return this.User.findOne({
            where: {
                [Op.or]: [{Email: credentials}, {Username: credentials}]
            },
            include: [{ model: db.Role }]
        })
    }

    async getRole(userId) {
        try {
            const user = await this.User.findOne({
                where: { id: userId },
                include: [
                    { 
                        model: this.Role,
                        attributes: [ 'role' ]                        
                    }
                ],
            });
            return {
                Role: user.Role.role
            };
        } catch (error) {
            throw new Error('Error fetching a role' + error.message);
        }
    }

    async getRoles() {
        return this.Role.findAll({
            where: {},
        })
    }

    async getMemberships() {
        return this.Membership.findAll({
            where: {},
        })
    }

    async getUsers() {
        const users = await this.User.findAll({
            where: {},
            include: [{ model: this.Role }, { model: this.Membership }]
        })
        
        return users
    }

    async create(firstname, lastname, email, username, address, phone, encryptedPassword, salt) {
        const userRole = await this.Role.findOne({ where: { role: 'User'}});
        const userMembership = await this.Membership.findOne({ where: { membership: 'Bronze'}});

        return this.User.create({
            FirstName: firstname,
            LastName: lastname,
            Email: email,
            Username: username,
            Address: address,
            Phone: phone,
            EncryptedPassword: encryptedPassword,
            Salt: salt,
            RoleId: userRole.id,
            MembershipId: userMembership.id
        })
    }

    async updateUser(userId, firstname, lastname, email, username, address, phone, role, membership) {
        try {
            await this.User.update({
                FirstName: firstname, 
                LastName: lastname, 
                Email: email, 
                Username: username, 
                Address: address, 
                Phone: phone, 
                RoleId: role, 
                MembershipId: membership
            }, 
                {where: {id: userId}
            });
        } catch (error) {
            throw new Error('Error updating user' + error.message);
        }
    }

    async delete(email) {
        return this.User.destroy({
            where: {
                Email: email,
            }
        })
    }

    async hashedPassword(Password) {
        var Salt = crypto.randomBytes(16);
        return new Promise((resolve, reject) => {
        crypto.pbkdf2(Password, Salt, 310000, 32, 'sha256', function(err, hashedPassword) {
            if (err) {
                return reject(err);
            }
            resolve({ hashedPassword, Salt });
        });
        });
    }

    async populate(filename) {
        const roles = await this.Role.findOne({ where: { role: 'Admin' }});
        const memberships = await this.Membership.findOne({where: { membership: 'Bronze' }});
        const { records } = await JSON.parse(await fs.readFile(path.resolve('./data/' + filename)));
        
        for (const record of records) {
            const { FirstName, LastName, Username, Email, Password, Address, Phone } = record;
            const { hashedPassword, Salt } = await this.hashedPassword(Password);
            await this.client.query( `INSERT INTO Users (FirstName, LastName, Username, Email, EncryptedPassword, Salt, Address, Phone, RoleId, MembershipId) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, {
                raw: true,
                type: QueryTypes.INSERT,
                replacements: [FirstName, LastName, Username, Email, hashedPassword, Salt, Address, Phone, roles.id, memberships.id]
              });
        }
    }
    
}

module.exports = UserService;