const Warehouse = require('../models/Warehouse');
const { connectDB, sequelize } = require('../config/database');

const seedWarehouses = async () => {
    try {
        await connectDB();
        await sequelize.sync({ alter: true }); // Create tables if they don't exist

        const data = [
            {
                name: "Maharashtra State Warehousing Corp",
                location: "Ambad, Nashik",
                capacity: "10,000 MT",
                availableSpace: "2,500 MT",
                type: "Dry Storage",
                contact: "0253-238XXXX",
                pricePerQuintal: 15.50,
                lat: 19.9547,
                lng: 73.7424
            },
            {
                name: "Green Cold Storage & Logistics",
                location: "Pimpalgaon, Nashik",
                capacity: "5,000 MT",
                availableSpace: "1,200 MT",
                type: "Cold Storage",
                contact: "98220XXXXX",
                pricePerQuintal: 45.00,
                lat: 20.1747,
                lng: 73.9845
            },
            {
                name: "Vidarbha Grain Silos",
                location: "Akola Industrial Area",
                capacity: "25,000 MT",
                availableSpace: "8,000 MT",
                type: "Grain Silos",
                contact: "0724-225XXXX",
                pricePerQuintal: 12.00,
                lat: 20.7002,
                lng: 77.0082
            }
        ];

        for (const item of data) {
            await Warehouse.findOrCreate({
                where: { name: item.name },
                defaults: item
            });
        }

        console.log("✅ Warehouses Seeded Successfully");
        process.exit();
    } catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    }
};

seedWarehouses();
