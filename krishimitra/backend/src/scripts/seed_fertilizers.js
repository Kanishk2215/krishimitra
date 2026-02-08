const { sequelize } = require('../config/database');
const Fertilizer = require('../models/Fertilizer');

const fertilizers = [
    // Nitrogen Fertilizers
    {
        fertilizer_name: 'Urea',
        fertilizer_type: 'Chemical',
        npk_ratio: '46:0:0',
        nitrogen_percent: 46.0,
        phosphorus_percent: 0.0,
        potassium_percent: 0.0,
        application_method: ['Broadcast', 'Top-dressing'],
        suitable_crops: ['Wheat', 'Rice', 'Maize', 'Sugarcane', 'Cotton'],
        price_per_kg: 6.50,
        manufacturer: 'IFFCO'
    },
    {
        fertilizer_name: 'Ammonium Sulphate',
        fertilizer_type: 'Chemical',
        npk_ratio: '20:0:0',
        nitrogen_percent: 20.0,
        phosphorus_percent: 0.0,
        potassium_percent: 0.0,
        application_method: ['Broadcast'],
        suitable_crops: ['Rice', 'Wheat', 'Sugarcane'],
        price_per_kg: 8.00,
        manufacturer: 'Coromandel'
    },
    {
        fertilizer_name: 'Calcium Ammonium Nitrate (CAN)',
        fertilizer_type: 'Chemical',
        npk_ratio: '25:0:0',
        nitrogen_percent: 25.0,
        phosphorus_percent: 0.0,
        potassium_percent: 0.0,
        application_method: ['Broadcast', 'Fertigation'],
        suitable_crops: ['Vegetables', 'Fruits', 'Cotton'],
        price_per_kg: 12.00,
        manufacturer: 'Tata Chemicals'
    },
    // Phosphatic Fertilizers
    {
        fertilizer_name: 'DAP (Di-Ammonium Phosphate)',
        fertilizer_type: 'Chemical',
        npk_ratio: '18:46:0',
        nitrogen_percent: 18.0,
        phosphorus_percent: 46.0,
        potassium_percent: 0.0,
        application_method: ['Basal application', 'Broadcast'],
        suitable_crops: ['Wheat', 'Rice', 'Pulses', 'Oilseeds'],
        price_per_kg: 27.00,
        manufacturer: 'IFFCO'
    },
    {
        fertilizer_name: 'SSP (Single Super Phosphate)',
        fertilizer_type: 'Chemical',
        npk_ratio: '0:16:0',
        nitrogen_percent: 0.0,
        phosphorus_percent: 16.0,
        potassium_percent: 0.0,
        application_method: ['Basal application'],
        suitable_crops: ['Groundnut', 'Soybean', 'Pulses'],
        price_per_kg: 8.50,
        manufacturer: 'Coromandel'
    },
    {
        fertilizer_name: 'Rock Phosphate',
        fertilizer_type: 'Organic',
        npk_ratio: '0:20:0',
        nitrogen_percent: 0.0,
        phosphorus_percent: 20.0,
        potassium_percent: 0.0,
        application_method: ['Basal application'],
        suitable_crops: ['All crops'],
        price_per_kg: 15.00,
        manufacturer: 'Rajasthan State Fertilizers'
    },
    // Potassic Fertilizers
    {
        fertilizer_name: 'MOP (Muriate of Potash)',
        fertilizer_type: 'Chemical',
        npk_ratio: '0:0:60',
        nitrogen_percent: 0.0,
        phosphorus_percent: 0.0,
        potassium_percent: 60.0,
        application_method: ['Broadcast', 'Fertigation'],
        suitable_crops: ['Potato', 'Banana', 'Sugarcane', 'Cotton'],
        price_per_kg: 18.00,
        manufacturer: 'IPL'
    },
    {
        fertilizer_name: 'SOP (Sulphate of Potash)',
        fertilizer_type: 'Chemical',
        npk_ratio: '0:0:50',
        nitrogen_percent: 0.0,
        phosphorus_percent: 0.0,
        potassium_percent: 50.0,
        application_method: ['Fertigation', 'Foliar'],
        suitable_crops: ['Fruits', 'Vegetables', 'Tobacco'],
        price_per_kg: 35.00,
        manufacturer: 'Yara'
    },
    // NPK Complexes
    {
        fertilizer_name: 'NPK 10:26:26',
        fertilizer_type: 'Chemical',
        npk_ratio: '10:26:26',
        nitrogen_percent: 10.0,
        phosphorus_percent: 26.0,
        potassium_percent: 26.0,
        application_method: ['Basal application', 'Top-dressing'],
        suitable_crops: ['Cotton', 'Soybean', 'Chilli'],
        price_per_kg: 22.00,
        manufacturer: 'Coromandel'
    },
    {
        fertilizer_name: 'NPK 12:32:16',
        fertilizer_type: 'Chemical',
        npk_ratio: '12:32:16',
        nitrogen_percent: 12.0,
        phosphorus_percent: 32.0,
        potassium_percent: 16.0,
        application_method: ['Basal application'],
        suitable_crops: ['Wheat', 'Rice', 'Maize'],
        price_per_kg: 24.00,
        manufacturer: 'IFFCO'
    },
    {
        fertilizer_name: 'NPK 20:20:0',
        fertilizer_type: 'Chemical',
        npk_ratio: '20:20:0',
        nitrogen_percent: 20.0,
        phosphorus_percent: 20.0,
        potassium_percent: 0.0,
        application_method: ['Basal application'],
        suitable_crops: ['Wheat', 'Rice', 'Sugarcane'],
        price_per_kg: 20.00,
        manufacturer: 'IFFCO'
    },
    {
        fertilizer_name: 'NPK 19:19:19',
        fertilizer_type: 'Chemical',
        npk_ratio: '19:19:19',
        nitrogen_percent: 19.0,
        phosphorus_percent: 19.0,
        potassium_percent: 19.0,
        application_method: ['Fertigation', 'Foliar'],
        suitable_crops: ['Vegetables', 'Fruits', 'Flowers'],
        price_per_kg: 30.00,
        manufacturer: 'Yara'
    },
    // Organic Fertilizers
    {
        fertilizer_name: 'Vermicompost',
        fertilizer_type: 'Organic',
        npk_ratio: '1.5:1:1',
        nitrogen_percent: 1.5,
        phosphorus_percent: 1.0,
        potassium_percent: 1.0,
        application_method: ['Basal application'],
        suitable_crops: ['All crops'],
        price_per_kg: 6.00,
        manufacturer: 'Local producers'
    },
    {
        fertilizer_name: 'FYM (Farm Yard Manure)',
        fertilizer_type: 'Organic',
        npk_ratio: '0.5:0.2:0.5',
        nitrogen_percent: 0.5,
        phosphorus_percent: 0.2,
        potassium_percent: 0.5,
        application_method: ['Basal application'],
        suitable_crops: ['All crops'],
        price_per_kg: 2.50,
        manufacturer: 'Farm produced'
    },
    {
        fertilizer_name: 'Neem Cake',
        fertilizer_type: 'Organic',
        npk_ratio: '5:1:2',
        nitrogen_percent: 5.0,
        phosphorus_percent: 1.0,
        potassium_percent: 2.0,
        application_method: ['Basal application', 'Broadcast'],
        suitable_crops: ['All crops'],
        price_per_kg: 25.00,
        manufacturer: 'Neem Foundation'
    },
    {
        fertilizer_name: 'Bone Meal',
        fertilizer_type: 'Organic',
        npk_ratio: '4:20:0',
        nitrogen_percent: 4.0,
        phosphorus_percent: 20.0,
        potassium_percent: 0.0,
        application_method: ['Basal application'],
        suitable_crops: ['Vegetables', 'Fruits'],
        price_per_kg: 35.00,
        manufacturer: 'Organic India'
    },
    // Bio-Fertilizers
    {
        fertilizer_name: 'Rhizobium',
        fertilizer_type: 'Bio-fertilizer',
        npk_ratio: '0:0:0',
        nitrogen_percent: 0.0,
        phosphorus_percent: 0.0,
        potassium_percent: 0.0,
        application_method: ['Seed treatment'],
        suitable_crops: ['Pulses', 'Groundnut', 'Soybean'],
        price_per_kg: 80.00,
        manufacturer: 'IARI'
    },
    {
        fertilizer_name: 'Azotobacter',
        fertilizer_type: 'Bio-fertilizer',
        npk_ratio: '0:0:0',
        nitrogen_percent: 0.0,
        phosphorus_percent: 0.0,
        potassium_percent: 0.0,
        application_method: ['Seed treatment', 'Soil application'],
        suitable_crops: ['Wheat', 'Rice', 'Cotton'],
        price_per_kg: 75.00,
        manufacturer: 'IARI'
    },
    {
        fertilizer_name: 'PSB (Phosphate Solubilizing Bacteria)',
        fertilizer_type: 'Bio-fertilizer',
        npk_ratio: '0:0:0',
        nitrogen_percent: 0.0,
        phosphorus_percent: 0.0,
        potassium_percent: 0.0,
        application_method: ['Seed treatment', 'Soil application'],
        suitable_crops: ['All crops'],
        price_per_kg: 70.00,
        manufacturer: 'IARI'
    },
    // Micronutrient Fertilizers
    {
        fertilizer_name: 'Zinc Sulphate',
        fertilizer_type: 'Chemical',
        npk_ratio: '0:0:0',
        nitrogen_percent: 0.0,
        phosphorus_percent: 0.0,
        potassium_percent: 0.0,
        application_method: ['Soil application', 'Foliar'],
        suitable_crops: ['Rice', 'Wheat', 'Maize'],
        price_per_kg: 45.00,
        manufacturer: 'RCF'
    },
    {
        fertilizer_name: 'Ferrous Sulphate',
        fertilizer_type: 'Chemical',
        npk_ratio: '0:0:0',
        nitrogen_percent: 0.0,
        phosphorus_percent: 0.0,
        potassium_percent: 0.0,
        application_method: ['Foliar spray'],
        suitable_crops: ['Paddy', 'Groundnut'],
        price_per_kg: 35.00,
        manufacturer: 'RCF'
    }
];

const seedFertilizers = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ alter: true }); // Ensure table exists
        console.log('Database connected!');

        // Check if data exists
        const count = await Fertilizer.count();
        if (count > 0) {
            console.log('Fertilizers already seeded!');
            return;
        }

        await Fertilizer.bulkCreate(fertilizers);
        console.log('✅ Fertilizers seeded successfully!');
    } catch (error) {
        console.error('❌ Error seeding fertilizers:', error);
    } finally {
        process.exit();
    }
};

seedFertilizers();
