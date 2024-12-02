-- CREATE DATABASE network_monitoring;
-- USE network_monitoring;

-- CREATE TABLE devices (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     name VARCHAR(100) NOT NULL,
--     type VARCHAR(50),
--     ip_address VARCHAR(15),
--     mac_address VARCHAR(17),
--     status ENUM('online', 'offline', 'warning') DEFAULT 'offline',
--     speed INT DEFAULT 0,
--     location VARCHAR(100),
--     floor INT,
--     room VARCHAR(20),
--     total_ports INT DEFAULT 0,
--     used_ports INT DEFAULT 0,
--     free_ports INT DEFAULT 0,
--     last_active DATETIME DEFAULT CURRENT_TIMESTAMP,
--     created_at DATETIME DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE ports (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     device_id INT NOT NULL,
--     port_number INT NOT NULL,
--     status ENUM('Active', 'Inactive', 'Error') DEFAULT 'Inactive',
--     speed INT DEFAULT 100,
--     user VARCHAR(100),
--     cable_type VARCHAR(20),
--     cable_length INT,
--     vlan VARCHAR(20),
--     last_activity DATETIME DEFAULT CURRENT_TIMESTAMP,
--     FOREIGN KEY (device_id) REFERENCES devices(id),
--     UNIQUE KEY unique_port (device_id, port_number)
-- );

-- CREATE TABLE port_history (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     port_id INT NOT NULL,
--     status VARCHAR(20),
--     speed INT,
--     user VARCHAR(100),
--     changed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
--     FOREIGN KEY (port_id) REFERENCES ports(id)
-- );

CREATE DATABASE network_monitoring;
USE network_monitoring;

CREATE TABLE devices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50),
    ip_address VARCHAR(15),
    mac_address VARCHAR(17),
    status ENUM('online', 'offline', 'warning') DEFAULT 'offline',
    speed INT DEFAULT 0,
    location VARCHAR(100),
    floor INT,
    room VARCHAR(20),
    total_ports INT DEFAULT 0,
    used_ports INT DEFAULT 0,
    free_ports INT DEFAULT 0,
    last_active DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    device_id INT NOT NULL,
    port_number INT NOT NULL,
    ip_address VARCHAR(15),
    mac_address VARCHAR(17),
    status ENUM('Active', 'Inactive', 'Error') DEFAULT 'Inactive',
    speed INT DEFAULT 100,
    user VARCHAR(100),
    cable_type VARCHAR(20),
    cable_length INT,
    vlan VARCHAR(20),
    last_activity DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (device_id) REFERENCES devices(id),
    UNIQUE KEY unique_port (device_id, port_number)
);

CREATE TABLE port_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    port_id INT NOT NULL,
    status VARCHAR(20),
    speed INT,
    user VARCHAR(100),
    ip_address VARCHAR(15),
    changed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (port_id) REFERENCES ports(id)
);




-- warning_history jadvalini yangilash
CREATE TABLE IF NOT EXISTS warning_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    device_id INT NOT NULL,
    reason TEXT NOT NULL,
    created_at DATETIME NOT NULL,
    is_read BOOLEAN DEFAULT 0,
    is_resolved BOOLEAN DEFAULT 0,
    resolved_at DATETIME DEFAULT NULL,
    resolved_by VARCHAR(100) DEFAULT NULL,
    FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE
);

-- devices jadvaliga yangi ustunlar qo'shish
ALTER TABLE devices 
ADD COLUMN last_warning_at DATETIME DEFAULT NULL,
ADD COLUMN warning_count INT DEFAULT 0;