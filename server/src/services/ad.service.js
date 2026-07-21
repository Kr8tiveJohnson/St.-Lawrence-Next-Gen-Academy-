const prisma = require('../config/database');

class AdService {
    static async getActiveAds() {
        return prisma.adSetting.findMany({
            where: { isActive: true }
        });
    }

    static async updateAdSlot(slot, data) {
        return prisma.adSetting.upsert({
            where: { slot },
            update: data,
            create: { slot, ...data }
        });
    }
}

module.exports = AdService;
