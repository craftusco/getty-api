-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Creato il: Apr 11, 2023 alle 08:38
-- Versione del server: 5.7.34
-- Versione PHP: 8.0.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `getty`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `getty_downloads`
--

CREATE TABLE `getty_downloads` (
  `id` bigint(255) NOT NULL,
  `downloaded` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `product_type` varchar(255) DEFAULT NULL,
  `filename` varchar(500) NOT NULL,
  `meta` json DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Struttura della tabella `getty_logs`
--

CREATE TABLE `getty_logs` (
  `id` bigint(11) NOT NULL,
  `message` text NOT NULL,
  `success` tinyint(1) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dump dei dati per la tabella `getty_logs`
--

INSERT INTO `getty_logs` (`id`, `message`, `success`, `created_at`) VALUES
(1, 'Success refresh files', NULL, '2023-04-11 10:19:25'),
(2, 'Error calling /sync route', NULL, '2023-04-11 10:20:01'),
(3, 'Success refresh files', NULL, '2023-04-11 10:20:02'),
(4, 'Error calling /count route', NULL, '2023-04-11 10:22:00'),
(5, 'Error calling /count route', NULL, '2023-04-11 10:24:00'),
(6, 'Error calling /sync route', NULL, '2023-04-11 10:25:00'),
(7, 'Error calling /count route', NULL, '2023-04-11 10:26:00'),
(8, 'Error calling /count route', NULL, '2023-04-11 10:28:00'),
(9, 'Success refresh files', NULL, '2023-04-11 10:28:10'),
(10, 'Error calling /sync route', NULL, '2023-04-11 10:30:00'),
(11, 'Success refresh files', NULL, '2023-04-11 10:30:02'),
(12, 'Error calling /count route', NULL, '2023-04-11 10:32:00'),
(13, 'Error calling /count route', NULL, '2023-04-11 10:34:01'),
(14, 'Error calling /sync route', NULL, '2023-04-11 10:35:01'),
(15, 'Error calling /count route', NULL, '2023-04-11 10:36:01'),
(16, 'Error calling /count route', NULL, '2023-04-11 10:38:01');

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `getty_downloads`
--
ALTER TABLE `getty_downloads`
  ADD KEY `id` (`id`) USING BTREE;

--
-- Indici per le tabelle `getty_logs`
--
ALTER TABLE `getty_logs`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT per le tabelle scaricate
--

--
-- AUTO_INCREMENT per la tabella `getty_logs`
--
ALTER TABLE `getty_logs`
  MODIFY `id` bigint(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
