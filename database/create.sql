CREATE DATABASE ventas_db;
USE ventas_db;
CREATE TABLE ventas (
 id INT AUTO_INCREMENT PRIMARY KEY,
 cliente VARCHAR(100),
 producto VARCHAR(100),
 cantidad INT,
 precio DECIMAL(10,2),
 total DECIMAL(10,2)
);