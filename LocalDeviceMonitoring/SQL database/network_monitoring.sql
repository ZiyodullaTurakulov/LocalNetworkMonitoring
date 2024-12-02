-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1:3306
-- Время создания: Дек 02 2024 г., 09:58
-- Версия сервера: 5.5.62
-- Версия PHP: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `network_monitoring`
--

-- --------------------------------------------------------

--
-- Структура таблицы `devices`
--

CREATE TABLE `devices` (
  `id` int(11) NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ip_address` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mac_address` varchar(17) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('online','offline','warning') COLLATE utf8mb4_unicode_ci DEFAULT 'offline',
  `speed` int(11) DEFAULT '0',
  `location` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `floor` int(11) DEFAULT NULL,
  `room` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `total_ports` int(11) DEFAULT '0',
  `used_ports` int(11) DEFAULT '0',
  `free_ports` int(11) DEFAULT '0',
  `last_active` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `last_warning_at` datetime DEFAULT NULL,
  `warning_count` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `devices`
--

INSERT INTO `devices` (`id`, `name`, `type`, `ip_address`, `mac_address`, `status`, `speed`, `location`, `floor`, `room`, `total_ports`, `used_ports`, `free_ports`, `last_active`, `created_at`, `last_warning_at`, `warning_count`) VALUES
(26, 'SW-Main-01', 'Switch', '192.168.1.10', '00:1A:2B:3C:4D:5E', 'online', 1000, 'Asosiy Bino', 1, '101', 48, 35, 13, NULL, NULL, NULL, 0),
(27, 'SW-Main-02', 'Switch', '192.168.1.11', '00:1A:2B:3C:4D:5F', 'online', 1000, 'Asosiy Bino', 1, '102', 24, 20, 4, NULL, NULL, NULL, 0),
(28, 'SW-Floor2-01', 'Switch', '192.168.1.12', '00:1A:2B:3C:4D:60', 'online', 1000, 'Asosiy Bino', 2, '201', 48, 40, 8, NULL, NULL, NULL, 0),
(29, 'SW-Floor3-01', 'Switch', '192.168.1.13', '00:1A:2B:3C:4D:61', 'warning', 1000, 'Asosiy Bino', 3, '301', 24, 22, 2, NULL, NULL, NULL, 0),
(30, 'RT-Core-01', 'Router', '192.168.1.1', '00:1B:2C:3D:4E:5F', 'online', 10000, 'Server Xona', 1, '105', 8, 6, 2, NULL, NULL, NULL, 0),
(31, 'RT-Backup-01', 'Router', '192.168.1.2', '00:1B:2C:3D:4E:60', 'online', 10000, 'Server Xona', 1, '105', 8, 4, 4, NULL, NULL, NULL, 0),
(32, 'AP-Floor1-01', 'Access Point', '192.168.1.20', '00:1C:2D:3E:4F:60', 'online', 300, 'Asosiy Bino', 1, '103', 0, 0, 0, NULL, NULL, NULL, 0),
(33, 'AP-Floor2-01', 'Access Point', '192.168.1.21', '00:1C:2D:3E:4F:61', 'online', 300, 'Asosiy Bino', 2, '203', 0, 0, 0, NULL, NULL, NULL, 0),
(34, 'AP-Floor3-01', 'Access Point', '192.168.1.22', '00:1C:2D:3E:4F:62', 'offline', 300, 'Asosiy Bino', 3, '303', 0, 0, 0, NULL, NULL, NULL, 0),
(35, 'SRV-Main-01', 'Server', '192.168.1.100', '00:1D:2E:3F:4G:60', 'online', 10000, 'Server Xona', 1, '105', 4, 4, 0, NULL, NULL, NULL, 0),
(36, 'SRV-Main-02', 'Server', '192.168.1.101', '00:1D:2E:3F:4G:61', 'online', 10000, 'Server Xona', 1, '105', 4, 3, 1, NULL, NULL, NULL, 0),
(37, 'SRV-Backup-01', 'Server', '192.168.1.102', '00:1D:2E:3F:4G:62', 'online', 10000, 'Server Xona', 1, '105', 4, 2, 2, NULL, NULL, NULL, 0),
(38, 'FW-Main-01', 'Firewall', '192.168.1.250', '00:1E:2F:3G:4H:60', 'online', 10000, 'Server Xona', 1, '105', 8, 6, 2, NULL, NULL, NULL, 0),
(39, 'FW-Backup-01', 'Firewall', '192.168.1.251', '00:1E:2F:3G:4H:61', 'online', 10000, 'Server Xona', 1, '105', 8, 4, 4, NULL, NULL, NULL, 0),
(40, 'MON-Main-01', 'Monitor', '192.168.1.240', '00:1F:2G:3H:4I:60', 'online', 1000, 'Server Xona', 1, '105', 2, 2, 0, NULL, NULL, NULL, 0),
(41, 'MON-Backup-01', 'Monitor', '192.168.1.241', '00:1F:2G:3H:4I:61', 'online', 1000, 'Server Xona', 1, '105', 2, 1, 1, NULL, NULL, NULL, 0),
(42, 'NAS-Main-01', 'Storage', '192.168.1.200', '00:1G:2H:3I:4J:60', 'online', 10000, 'Server Xona', 1, '105', 4, 3, 1, NULL, NULL, NULL, 0),
(43, 'NAS-Backup-01', 'Storage', '192.168.1.201', '00:1G:2H:3I:4J:61', 'online', 10000, 'Server Xona', 1, '105', 4, 2, 2, NULL, NULL, NULL, 0),
(44, 'LB-Main-01', 'Load Balancer', '192.168.1.230', '00:1H:2I:3J:4K:60', 'online', 10000, 'Server Xona', 1, '105', 4, 4, 0, NULL, NULL, NULL, 0),
(45, 'LB-Backup-01', 'Load Balancer', '192.168.1.231', '00:1H:2I:3J:4K:61', 'warning', 10000, 'Server Xona', 1, '105', 4, 3, 1, NULL, NULL, NULL, 0);

-- --------------------------------------------------------

--
-- Структура таблицы `ports`
--

CREATE TABLE `ports` (
  `id` int(11) NOT NULL,
  `device_id` int(11) NOT NULL,
  `port_number` int(11) NOT NULL,
  `ip_address` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mac_address` varchar(17) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('Active','Inactive','Error') COLLATE utf8mb4_unicode_ci DEFAULT 'Inactive',
  `speed` int(11) DEFAULT '100',
  `user` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cable_type` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cable_length` int(11) DEFAULT NULL,
  `vlan` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_activity` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `port_history`
--

CREATE TABLE `port_history` (
  `id` int(11) NOT NULL,
  `port_id` int(11) NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `speed` int(11) DEFAULT NULL,
  `user` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ip_address` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `changed_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `warning_history`
--

CREATE TABLE `warning_history` (
  `id` int(11) NOT NULL,
  `device_id` int(11) NOT NULL,
  `reason` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `is_resolved` tinyint(1) DEFAULT '0',
  `resolved_at` datetime DEFAULT NULL,
  `resolved_by` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `devices`
--
ALTER TABLE `devices`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `ports`
--
ALTER TABLE `ports`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_port` (`device_id`,`port_number`);

--
-- Индексы таблицы `port_history`
--
ALTER TABLE `port_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `port_id` (`port_id`);

--
-- Индексы таблицы `warning_history`
--
ALTER TABLE `warning_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `device_id` (`device_id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `devices`
--
ALTER TABLE `devices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT для таблицы `ports`
--
ALTER TABLE `ports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT для таблицы `port_history`
--
ALTER TABLE `port_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT для таблицы `warning_history`
--
ALTER TABLE `warning_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `ports`
--
ALTER TABLE `ports`
  ADD CONSTRAINT `ports_ibfk_1` FOREIGN KEY (`device_id`) REFERENCES `devices` (`id`);

--
-- Ограничения внешнего ключа таблицы `port_history`
--
ALTER TABLE `port_history`
  ADD CONSTRAINT `port_history_ibfk_1` FOREIGN KEY (`port_id`) REFERENCES `ports` (`id`);

--
-- Ограничения внешнего ключа таблицы `warning_history`
--
ALTER TABLE `warning_history`
  ADD CONSTRAINT `warning_history_ibfk_1` FOREIGN KEY (`device_id`) REFERENCES `devices` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
