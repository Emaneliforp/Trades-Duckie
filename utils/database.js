/* eslint-disable no-unused-vars */
// const { client } = require('../index.js');
const { Collection } = require('discord.js');
const badgeSchema = require('../schemas/badgeSchema');
const balanceSchema = require('../schemas/balanceSchema');
const dailySchema = require('../schemas/dailySchema');
const inventorySchema = require('../schemas/inventorySchema');
const pointSchema = require('../schemas/pointSchema');
const questConfigSchema = require('../schemas/questConfigSchema');
const userQuestSchema = require('../schemas/userQuestSchema');
const commandSchema = require('../schemas/commandSchema');
class Database {
    constructor() {
        this.badge = new Collection();
        this.balance = new Collection();
        this.daily = new Collection();
        this.inventory = new Collection();
        this.point = new Collection();
        this.questConfig = null;
        this.usage = new Collection();
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
                inventorySchema.updateOne({ userId, name }, { $inc: { quantity: amount } }, { upsert: true }).then(() => {
                    // console.log('Item saved successfully');
                }).catch((error) => {
                    // console.log('Error saving item:', error);
                });
            }
            else {
                const item = new inventorySchema({ userId, name, quantity: amount });
                inventory.push(item);
                inventorySchema.updateOne({ userId, name }, { quantity: amount }, { upsert: true }).then(() => {
                //   console.log('Item saved successfully');
                }).catch((error) => {
                //   console.log('Error saving item:', error);
                });
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

    async findOrCreateQuestConfig() {
        if (this.questConfig) return this.questConfig;
        let questConfig = await questConfigSchema.findOne({});
        if (!questConfig) {
            questConfig = new questConfigSchema({});
            await questConfig.save();
        }
        this.questConfig = questConfig;
        return questConfig;
    }

    async getUserQuest(userId) {
        if (!userId) throw new Error('Missing userId');

        const userQuest = await userQuestSchema.find({ userId });

        return userQuest.map(a => a.quest);
    }

    async addUserQuest(userId, quest) {
        if (!userId) throw new Error('Missing userId');

        const filter = { userId, quest };
        const update = filter;
        const options = { upsert: true, new: true };

        const savedQuest = await userQuestSchema.findOneAndUpdate(filter, update, options);

        if (savedQuest) return true;
        else return false;
    }

    async addUsage(userId, name) {
        const filter = { name, userId };
        const update = { $inc: { usage: 1 } };
        const options = { upsert: true, new: true };

        const savedCommand = await commandSchema.findOneAndUpdate(filter, update, options);

        // Update the cache
        if (this.usage.has(userId)) {
          const usageObject = this.usage.get(userId);
          // eslint-disable-next-line no-prototype-builtins
          if (usageObject.hasOwnProperty(name)) {
            usageObject[name] = savedCommand.usage; // Update with the updated value
          }
          else {
            usageObject[name] = savedCommand.usage;
          }
        }
        else {
          const usageObject = {};
          usageObject[name] = savedCommand.usage;
          this.usage.set(userId, usageObject);
        }

        if (savedCommand) return true;
        else return false;
    }

    async getUsage(userId, fetch = false) {
        // Check if usage is already in the cache
        if (this.usage.has(userId) && !fetch) {
          return this.usage.get(userId);
        }

        // If not in cache, fetch from database
        const pipeline = [
          { $match: { userId } },
          { $group: { _id: '$name', totalUsage: { $sum: '$usage' } } },
          { $project: { _id: 0, name: '$_id', totalUsage: 1 } },
        ];

        const result = await commandSchema.aggregate(pipeline);

        const usageObject = {};
        result.forEach(({ name, totalUsage }) => {
          usageObject[name] = totalUsage;
        });

        // Add to cache
        this.usage.set(userId, usageObject);

        return usageObject;
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