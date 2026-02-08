require('dotenv').config();
const { connectDB, sequelize } = require('../config/database');
const Crop = require('../models/Crop');

const sampleCrops = [
    {
        name: "Soybean",
        season: "Kharif",
        soil_suitability: ["Black", "Alluvial"],
        duration_days: 90,
        expected_yield: "8-10 quintals/acre",
        avg_profit_per_acre: 45000,
        min_rainfall: 600,
        max_rainfall: 1000,
        min_temp: 20,
        max_temp: 35
    },
    {
        name: "Wheat",
        season: "Rabi",
        soil_suitability: ["Alluvial", "Loamy"],
        duration_days: 120,
        expected_yield: "15-20 quintals/acre",
        avg_profit_per_acre: 35000,
        min_rainfall: 400,
        max_rainfall: 600,
        min_temp: 10,
        max_temp: 25
    },
    {
        name: "Cotton",
        season: "Kharif",
        soil_suitability: ["Black"],
        duration_days: 160,
        expected_yield: "10-12 quintals/acre",
        avg_profit_per_acre: 60000,
        min_rainfall: 500,
        max_rainfall: 800,
        min_temp: 25,
        max_temp: 35
    },
    {
        name: "Rice",
        season: "Kharif",
        soil_suitability: ["Clay", "Alluvial"],
        duration_days: 120,
        expected_yield: "20-25 quintals/acre",
        avg_profit_per_acre: 40000,
        min_rainfall: 1000,
        max_rainfall: 1500,
        min_temp: 22,
        max_temp: 32
    },
    {
        name: "Tur (Pigeon Pea)",
        season: "Kharif",
        soil_suitability: ["Red", "Black"],
        duration_days: 150,
        expected_yield: "6-8 quintals/acre",
        avg_profit_per_acre: 50000,
        min_rainfall: 600,
        max_rainfall: 800,
        min_temp: 25,
        max_temp: 35
    }
];

const seedDB = async () => {
    await connectDB();
    await sequelize.sync({ alter: true });

    for (const crop of sampleCrops) {
        await Crop.findOrCreate({
            where: { name: crop.name },
            defaults: crop
        });
    }

    console.log("✅ Seed Data Inserted for Crops");
    process.exit();
};

seedDB();
