
-- Simple Database Schema for Student Project
-- Database: smart_crop_db

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    mode ENUM('farmer', 'home_plant') DEFAULT 'farmer'
);

CREATE TABLE scan_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    image_path VARCHAR(255),
    detected_disease VARCHAR(100),
    health_score INT,
    scan_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE disease_knowledge_base (
    id INT AUTO_INCREMENT PRIMARY KEY,
    disease_name VARCHAR(100),
    recommended_medicine VARCHAR(100),
    active_ingredient VARCHAR(100),
    safety_instructions TEXT
);

-- Sample Data for Viva/Demo
INSERT INTO disease_knowledge_base (disease_name, recommended_medicine, active_ingredient, safety_instructions)
VALUES 
('Late Blight', 'Ridomil Gold', 'Metalaxyl', 'Wear gloves. Do not spray near fish ponds.'),
('Powdery Mildew', 'Sulfex', 'Sulfur', 'Avoid spraying in hot sun.');
