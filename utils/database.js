/* eslint-disable no-unused-vars */
// const { client } = require('../index.js');
const { Collection } = require('discord.js');
const badgeSchema = require('../schemas/badgeSchema');
const balanceSchema = require('../schemas/balanceSchema');
const dailySchema = require('../schemas/dailySchema');
const inventorySchema = require('../schemas/inventorySchema');
const pointSchema = require('../schemas/pointSchema');

class Database {
    constructor() {
        this.badge = new Collection();
        this.balance = new Collection();
        this.daily = new Collection();
        this.inventory = new Collection();
        this.point = new Collection();
    }

    async findOrCreateBadge(userId, name = null) {
        if (!userId) throw new Error('Missing userId');
        let badges = this.badge.get(userId);

        if (!badges) {
            const userBadges = await badgeSchema.find({ userId });
            this.badge.set(userId, userBadges);
            badges = this.badge.get(userId);
        }

        if (name == null) {
            return this.badge.get(userId);
        }
        else {
            const foundBadge = badges.find(a => a.name == name);
            if (foundBadge) {
                return foundBadge;
            }
            else {
                const badge = new badgeSchema({ userId, name });

                await badge.save();

                badges.push(badge);

                return badge;
            }
        }
    }

    async findOrCreateBalance(userId) {
        if (!userId) throw new Error('Missing userId');

        let balance = this.balance.get(userId);

        if (!balance) {
            let userBalance = await balanceSchema.findOne({ userId });
            if (!userBalance) {
                userBalance = new balanceSchema({ userId });
                await userBalance.save();
            }

            this.balance.set(userId, userBalance);
            balance = this.balance.get(userId);
        }

        return balance;
    }

    async findOrCreateDaily(userId) {
        if (!userId) throw new Error('Missing userId');

        let daily = this.daily.get(userId);

        if (!daily) {
            let userDaily = await dailySchema.findOne({ userId });
            if (!userDaily) {
                userDaily = new dailySchema({ userId });
                await userDaily.save();
            }

            this.daily.set(userId, userDaily);
            daily = this.daily.get(userId);
        }

        return daily;
    }

    async findOrCreateInv(userId, name = null, amount = 1) {
        if (!userId) throw new Error('Missing userId');
        let inventory = this.inventory.get(userId);

        if (!inventory) {
            const userInv = await inventorySchema.find({ userId });
            this.inventory.set(userId, userInv);
            inventory = this.inventory.get(userId);
        }

        if (name == null) {
            return this.inventory.get(userId);
        }
        else if (!(typeof amount === 'number' && isFinite(amount) && Math.floor(amount) === amount)) throw new Error('Invalid integer');
        else {
            const foundItem = inventory.find(a => a.name == name);
            if (foundItem) {
                foundItem.quantity += amount;

                await foundItem.save();

                return foundItem;
            }
            else if (!foundItem) {
                const item = new inventorySchema({ userId, name, quantity: amount });
                inventory.push(item);
                inventorySchema.updateOne({ userId, name }, { '$set': { quantity: amount } }, { upsert: true });
                return item;
            }
        }
    }

    async findOrCreatePoint(userId) {
        if (!userId) throw new Error('Missing userId');

        let point = this.point.get(userId);

        if (!point) {
            let userPoint = await pointSchema.findOne({ userId });
            if (!userPoint) {
                userPoint = new pointSchema({ userId });
                await userPoint.save();
            }

            this.point.set(userId, userPoint);
            point = this.point.get(userId);
        }

        return point;

    }

    deletePoint(userId) {
        if (!userId) throw new Error('Missing userId');

        return this.point.delete(userId);
    }

    deleteInv(userId) {
        if (!userId) throw new Error('Missing userId');

        return this.inventory.delete(userId);
    }

    deleteBadge(userId) {
        if (!userId) throw new Error('Missing userId');

        return this.badge.delete(userId);
    }

    deleteDaily(userId) {
        if (!userId) throw new Error('Missing userId');

        return this.daily.delete(userId);
    }

    deleteBalance(userId) {
        if (!userId) throw new Error('Missing userId');

        return this.balance.delete(userId);
    }

}

module.exports = Database;