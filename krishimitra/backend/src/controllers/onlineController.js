const axios = require('axios');

// Using free/public APIs for testing "Online Mode"
exports.getLiveWeather = async (req, res) => {
    try {
        const lat = req.query.lat || 19.9975; // Default Nashik
        const lon = req.query.lon || 73.7898;

        // OpenWeatherMap API (Using a public key for demo/if user has one in .env)
        const API_KEY = process.env.WEATHER_API_KEY || '895284fb2d2c1ad3a920e9a78e32c63c'; // Placeholder
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
            wind: data.wind.speed
        });
    } catch (error) {
        console.error("Weather API Error:", error.message);
        // Fallback to static if offline or limit reached
        res.json({
            success: false,
            city: "Nashik",
            temp: 28,
            description: "Clear Sky",
            icon: "01d",
            humidity: 45,
            wind: 12
        });
    }
};

exports.getAgriNews = async (req, res) => {
    try {
        // Mocking a news aggregate for now, or using a real API if key available
        // In "Online Mode", we could fetch from NewsAPI.org
        const API_KEY = process.env.NEWS_API_KEY;
        if (API_KEY) {
            const url = `https://newsapi.org/v2/everything?q=agriculture+india&sortBy=publishedAt&pageSize=5&apiKey=${API_KEY}`;
            const response = await axios.get(url);
            return res.json({
                success: true,
                news: response.data.articles.map(a => ({
                    title: a.title,
                    source: a.source.name,
                    url: a.url,
                    img: a.urlToImage
                }))
            });
        }

        // Static fallback news
        res.json({
            success: true,
            news: [
                { title: "New high-yield soybean variety released for Maharashtra", source: "AgriNews", url: "#" },
                { title: "Monsoon expected to be normal this year, says IMD", source: "Times of India", url: "#" },
                { title: "Mandi prices for Cotton surge in Vidarbha region", source: "Market Watch", url: "#" }
            ]
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
