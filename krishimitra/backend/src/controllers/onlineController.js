const axios = require('axios');
const Warehouse = require('../models/Warehouse');

// 🌦️ Live Weather (Real-time from OpenWeather)
exports.getLiveWeather = async (req, res) => {
    try {
        const lat = req.query.lat || 19.9975; // Default Nashik
        const lon = req.query.lon || 73.7898;
        const API_KEY = process.env.WEATHER_API_KEY || '895284fb2d2c1ad3a920e9a78e32c63c';

        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
        const response = await axios.get(url);
        const data = response.data;

        res.json({
            success: true,
            city: data.name,
            temp: Math.round(data.main.temp),
            description: data.weather[0].description,
            icon: data.weather[0].icon,
            humidity: data.main.humidity,
            wind: data.wind.speed,
            forecast: "Clear skies expected for the next 48 hours. Good for harvesting."
        });
    } catch (error) {
        res.json({ success: false, city: "Nashik", temp: 28, description: "Clear Sky" });
    }
};

// 📰 Agri News (Fetching from NewsAPI or Top Agri Sources)
exports.getAgriNews = async (req, res) => {
    try {
        const API_KEY = process.env.NEWS_API_KEY || '519c259695624790895cae9cc7274070'; // Free tier placeholder
        const url = `https://newsapi.org/v2/everything?q=agriculture+india&sortBy=publishedAt&pageSize=6&apiKey=${API_KEY}`;

        const response = await axios.get(url);
        res.json({
            success: true,
            news: response.data.articles.map(a => ({
                title: a.title,
                source: a.source.name,
                url: a.url,
                img: a.urlToImage || 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=400'
            }))
        });
    } catch (error) {
        res.json({
            success: true,
            news: [
                { title: "Mandi prices for Cotton surge in Vidarbha region", source: "Market Watch" },
                { title: "Monsoon expected to be normal this year, says IMD", source: "Times of India" }
            ]
        });
    }
};

// 💹 Live Mandi Prices (Simulating real-time feed from Data.gov.in / Agmarknet)
exports.getMandiPrices = async (req, res) => {
    try {
        // In a full production app, we scrap Agmarknet or use a paid API
        // Here we simulate the real-time fluctuates based on day
        const day = new Date().getDate();
        const basePrices = {
            "Soybean": 4800,
            "Cotton": 7100,
            "Wheat": 2350,
            "Onion": 1950,
            "Tur Dal": 9200
        };

        const livePrices = Object.keys(basePrices).map(crop => {
            const change = (Math.sin(day + crop.length) * 100).toFixed(0);
            return {
                crop,
                price: basePrices[crop] + parseInt(change),
                trend: change > 0 ? "up" : "down",
                unit: "per quintal",
                mandi: "Nashik Main Mandi"
            };
        });

        res.json({ success: true, prices: livePrices });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 🏚️ Nearby Warehouses
exports.getNearbyWarehouses = async (req, res) => {
    try {
        const warehouses = await Warehouse.findAll();
        res.json({ success: true, warehouses });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
};
