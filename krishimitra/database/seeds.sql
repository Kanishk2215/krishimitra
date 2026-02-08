INSERT INTO "Crops" (name, season, soil_suitability, duration_days, expected_yield, avg_profit_per_acre) VALUES
('Soybean', 'Kharif', ARRAY['Black', 'Alluvial'], 90, '8-10 quintals/acre', 45000),
('Wheat', 'Rabi', ARRAY['Alluvial', 'Loamy'], 120, '15-20 quintals/acre', 35000),
('Cotton', 'Kharif', ARRAY['Black'], 160, '10-12 quintals/acre', 60000),
('Rice', 'Kharif', ARRAY['Clay', 'Alluvial'], 120, '20-25 quintals/acre', 40000),
('Tur', 'Kharif', ARRAY['Red', 'Black'], 150, '6-8 quintals/acre', 50000);
