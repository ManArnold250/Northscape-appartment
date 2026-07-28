-- NorthScape Apartment XAMPP MySQL Database Schema
-- Database Name: northscape_db

CREATE DATABASE IF NOT EXISTS `northscape_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `northscape_db`;

-- 1. Rooms Table
CREATE TABLE IF NOT EXISTS `rooms` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `name` VARCHAR(150) NOT NULL,
  `type` ENUM('Full Apartment', 'Guest Room', 'Suite', 'Deluxe') NOT NULL DEFAULT 'Full Apartment',
  `price_usd` DECIMAL(10, 2) NOT NULL DEFAULT 75.00,
  `price_rwf` DECIMAL(12, 2) NOT NULL DEFAULT 100000.00,
  `rate_3days_rwf` DECIMAL(12, 2) DEFAULT 250000.00,
  `rate_1week_rwf` DECIMAL(12, 2) DEFAULT 500000.00,
  `rate_2weeks_rwf` DECIMAL(12, 2) DEFAULT 800000.00,
  `rate_1month_rwf` DECIMAL(12, 2) DEFAULT 1500000.00,
  `bedrooms` INT NOT NULL DEFAULT 3,
  `bathrooms` INT NOT NULL DEFAULT 3,
  `has_living_room` TINYINT(1) NOT NULL DEFAULT 1,
  `capacity` INT NOT NULL DEFAULT 6,
  `size` VARCHAR(50) NOT NULL DEFAULT '95 m²',
  `status` ENUM('available', 'booked', 'maintenance') NOT NULL DEFAULT 'available',
  `available_from` DATE NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Bookings Table
CREATE TABLE IF NOT EXISTS `bookings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `booking_code` VARCHAR(50) NOT NULL UNIQUE,
  `room_slug` VARCHAR(100) NOT NULL,
  `guest_name` VARCHAR(150) NOT NULL,
  `guest_email` VARCHAR(150) NOT NULL,
  `guest_phone` VARCHAR(50) NOT NULL,
  `check_in` DATE NOT NULL,
  `check_out` DATE NOT NULL,
  `guests_count` INT NOT NULL DEFAULT 1,
  `total_rwf` DECIMAL(12, 2) NOT NULL,
  `total_usd` DECIMAL(10, 2) NOT NULL,
  `status` ENUM('confirmed', 'pending', 'checked_out', 'cancelled') NOT NULL DEFAULT 'confirmed',
  `special_requests` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`room_slug`) REFERENCES `rooms`(`slug`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Admin Users Table
CREATE TABLE IF NOT EXISTS `admins` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `role` VARCHAR(50) DEFAULT 'admin',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed Sample Data
INSERT IGNORE INTO `rooms` (`id`, `slug`, `name`, `type`, `price_usd`, `price_rwf`, `bedrooms`, `bathrooms`, `has_living_room`, `capacity`, `size`, `status`, `available_from`) VALUES
(1, 'full-apartment-luxury', 'Full NorthScape Residence (3 Bed & 3 Bath)', 'Full Apartment', 75.00, 100000.00, 3, 3, 1, 6, '95 m²', 'available', NULL),
(2, 'executive-guest-room-1', 'Executive Guest Room A', 'Guest Room', 15.00, 20000.00, 1, 1, 0, 2, '28 m²', 'available', NULL),
(3, 'executive-guest-room-2', 'Executive Guest Room B', 'Guest Room', 15.00, 20000.00, 1, 1, 0, 2, '28 m²', 'booked', '2026-07-30'),
(4, 'full-apartment-wing-b', 'NorthScape Residence Wing B (3 Bed & 3 Bath)', 'Full Apartment', 75.00, 100000.00, 3, 3, 1, 6, '95 m²', 'available', NULL);

-- Seed Default Admin User (username: admin, pin: northscape2026)
INSERT IGNORE INTO `admins` (`id`, `username`, `password_hash`, `name`, `role`) VALUES
(1, 'admin', 'northscape2026', 'NorthScape Manager', 'superadmin');
