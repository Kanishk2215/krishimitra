const Crop = require('../models/Crop');
const { connectDB } = require('../config/database');

const seedCrops = async () => {
    try {
        await connectDB();

        const crops = [
            {
                name: "Soybean",
                season: "Kharif",
                soil_suitability: ["Black", "Red"],
                duration_days: 90,
                min_rainfall: 600,
                max_rainfall: 1000,
                min_temp: 20,
                max_temp: 35,
                expected_yield: "15-20 quintals/acre",
                avg_profit_per_acre: 25000,
                image_url: "https://images.unsplash.com/photo-1589927986089-35812378d3d8?w=400"
            },
            {
                name: "Cotton",
                season: "Kharif",
                soil_suitability: ["Black"],
                duration_days: 150,
                min_rainfall: 500,
                max_rainfall: 800,
                min_temp: 21,
                max_temp: 35,
                expected_yield: "8-12 quintals/acre",
                avg_profit_per_acre: 35000,
                image_url: "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400"
            },
            {
                name: "Wheat",
                season: "Rabi",
                soil_suitability: ["Alluvial", "Black"],
                duration_days: 120,
                min_rainfall: 400,
                max_rainfall: 600,
                min_temp: 10,
                max_temp: 25,
                expected_yield: "20-25 quintals/acre",
                avg_profit_per_acre: 22000,
                image_url: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400"
            },
            {
                name: "Rice",
                season: "Kharif",
                soil_suitability: ["Clay", "Alluvial"],
                duration_days: 120,
                min_rainfall: 1000,
                max_rainfall: 2000,
                min_temp: 20,
                max_temp: 37,
                expected_yield: "25-30 quintals/acre",
                avg_profit_per_acre: 28000,
                image_url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400"
            },
            {
                name: "Tur Dal (Pigeon Pea)",
                season: "Kharif",
                soil_suitability: ["Red", "Black"],
                duration_days: 150,
                min_rainfall: 600,
                max_rainfall: 800,
                min_temp: 20,
                max_temp: 35,
                expected_yield: "8-10 quintals/acre",
                avg_profit_per_acre: 30000,
                image_url: "https://images.unsplash.com/photo-1599909533730-f9d7e4f2e3b1?w=400"
            },
            {
                name: "Maize",
                season: "Kharif",
                soil_suitability: ["Alluvial", "Red"],
                duration_days: 90,
                min_rainfall: 500,
                max_rainfall: 800,
                min_temp: 18,
                max_temp: 32,
                expected_yield: "18-22 quintals/acre",
                avg_profit_per_acre: 20000,
                image_url: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=400"
            },
            {
                name: "Sugarcane",
                season: "Year-round",
                soil_suitability: ["Alluvial", "Black"],
                duration_days: 365,
                min_rainfall: 1000,
                max_rainfall: 1500,
                min_temp: 20,
                max_temp: 35,
                expected_yield: "300-400 quintals/acre",
                avg_profit_per_acre: 60000,
                image_url: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400"
            },
            {
                name: "Onion",
                season: "Rabi",
                soil_suitability: ["Red", "Alluvial"],
                duration_days: 120,
                min_rainfall: 400,
                max_rainfall: 600,
                min_temp: 15,
                max_temp: 30,
                expected_yield: "100-150 quintals/acre",
                avg_profit_per_acre: 45000,
                image_url: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400"
            }
        ];

        for (const crop of crops) {
            await Crop.findOrCreate({
                where: { name: crop.name },
                defaults: crop
            });
        }

        console.log("✅ Crops Seeded Successfully");
        process.exit();
    } catch (error) {
        console.error("❌ Crop Seeding Failed:", error);
        process.exit(1);
    }
};

seedCrops();
