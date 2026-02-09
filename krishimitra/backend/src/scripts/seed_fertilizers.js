const Fertilizer = require('../models/Fertilizer');
const { connectDB, sequelize } = require('../config/database');

const seedFertilizers = async () => {
    try {
        await connectDB();
        await sequelize.sync({ alter: true });

        const fertilizers = [
            {
                fertilizer_name: "Urea",
                fertilizer_type: "Nitrogen",
                npk_ratio: "46-0-0",
                nitrogen_percent: 46,
                phosphorus_percent: 0,
                potassium_percent: 0,
                application_method: "Broadcast or Top Dressing",
                suitable_crops: JSON.stringify(["Rice", "Wheat", "Maize", "Cotton"]),
                price_per_kg: 5.32,
                manufacturer: "IFFCO"
            },
            {
                fertilizer_name: "DAP",
                fertilizer_type: "Phosphorus",
                npk_ratio: "18-46-0",
                nitrogen_percent: 18,
                phosphorus_percent: 46,
                potassium_percent: 0,
                application_method: "Basal Application",
                suitable_crops: JSON.stringify(["Wheat", "Rice", "Soybean", "Cotton"]),
                price_per_kg: 27,
                manufacturer: "IFFCO"
            },
            {
                fertilizer_name: "MOP",
                fertilizer_type: "Potassium",
                npk_ratio: "0-0-60",
                nitrogen_percent: 0,
                phosphorus_percent: 0,
                potassium_percent: 60,
                application_method: "Soil Application",
                suitable_crops: JSON.stringify(["Sugarcane", "Cotton", "Potato", "Banana"]),
                price_per_kg: 19,
                manufacturer: "IPL"
            }
        ];

        for (const fert of fertilizers) {
            await Fertilizer.findOrCreate({
                where: { fertilizer_name: fert.fertilizer_name },
                defaults: fert
            });
        }

        console.log("✅ Fertilizers Seeded Successfully");
        process.exit();
    } catch (error) {
        console.error("❌ Fertilizer Seeding Failed:", error);
        process.exit(1);
    }
};

seedFertilizers();
