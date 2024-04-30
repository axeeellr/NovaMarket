-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 30-04-2024 a las 05:45:31
-- Versión del servidor: 10.4.24-MariaDB
-- Versión de PHP: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `novamarket`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `code` varchar(100) NOT NULL,
  `name` varchar(100) NOT NULL,
  `brand` varchar(100) NOT NULL,
  `price` double NOT NULL,
  `img` varchar(300) NOT NULL,
  `calories` varchar(50) NOT NULL,
  `weight` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `products`
--

INSERT INTO `products` (`id`, `code`, `name`, `brand`, `price`, `img`, `calories`, `weight`) VALUES
(1, 'nm-trix-0', 'Cereal Trix', 'Nestle', 3.99, 'https://www.nestle-cereals.com/cl/sites/g/files/qirczx891/files/styles/1_1_768px_width/public/2023-08/Trix.PNG.png.webp?itok=rWibg3ur', '120kcal', '460g'),
(2, 'nm-bandejade300fresas-0', 'Bandeja de Fresas', 'NovaMarket', 4, 'https://static.vecteezy.com/system/resources/previews/035/995/131/non_2x/freshly-picked-large-red-strawberries-in-trays-png.png', '100kcal', '300g'),
(3, 'nm-bandejade500fresas-0', 'Bandeja de Fresas', 'NovaMarket', 6, 'https://png.pngtree.com/png-clipart/20231016/original/pngtree-plump-strawberries-arranged-in-a-plastic-tray-with-photo-png-image_13320445.png', '100kcal', '500g'),
(4, 'nm-nido1-0', 'Leche Nido 1+', 'Nestle', 20, 'https://www.nestleagustoconlavida.com/sites/default/files/2022-05/NIDO-1%2B-Proteccion-400g-Lata_0.png', '50kcal', '400g'),
(5, 'nm-nidofortificada-0', 'Leche Nido Fortificada', 'Nestle', 25, 'https://www.goodnes.com/sites/g/files/jgfbjl321/files/gdn_product/field_product_images/nido-905b9b717c8dae50049f3cbd5aa347a977f6af85.png', '150kcal', '77oz');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`) VALUES
(1, 'axelk', 'axek@gmail.com', 'sdjhdjsd'),
(2, 'axel', 'axel@gmail.com', '12345'),
(3, 'ddd', 'ddd@gmail.com', '12345'),
(4, 'sexo', 'sexo@gmail.com', '12345'),
(5, 'ozuna', 'ozuna@gmail.com', '12345'),
(6, 'lop', 'lop@fmas.com', '243243'),
(7, 'axelitouu', 'axelito@gmail.com', '12345');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
