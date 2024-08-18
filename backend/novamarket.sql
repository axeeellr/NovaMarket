-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 18-08-2024 a las 20:37:59
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

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
-- Estructura de tabla para la tabla `address`
--

CREATE TABLE `address` (
  `id` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `latitude` varchar(100) NOT NULL,
  `longitude` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `address`
--

INSERT INTO `address` (`id`, `id_user`, `name`, `latitude`, `longitude`) VALUES
(1, 2, 'Casa', '13.718922522730699', '-89.15350678139549');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cards`
--

CREATE TABLE `cards` (
  `id` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `number` varchar(100) NOT NULL,
  `holder` varchar(100) NOT NULL,
  `date` date NOT NULL,
  `cvv` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cards`
--

INSERT INTO `cards` (`id`, `id_user`, `number`, `holder`, `date`, `cvv`) VALUES
(1, 2, '1234567891234567', 'Axel Ramirez', '2026-07-01', 465);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cart`
--

CREATE TABLE `cart` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `date` datetime NOT NULL,
  `card_id` int(11) NOT NULL,
  `total` varchar(100) NOT NULL,
  `type` varchar(100) NOT NULL,
  `address_id` int(11) NOT NULL,
  `status` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cart`
--

INSERT INTO `cart` (`id`, `user_id`, `name`, `date`, `card_id`, `total`, `type`, `address_id`, `status`) VALUES
(1, 2, 'limpieza', '2024-08-18 12:36:27', 1, '11.32', 'Domicilio', 1, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cart_items`
--

CREATE TABLE `cart_items` (
  `id` int(11) NOT NULL,
  `cart_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cart_items`
--

INSERT INTO `cart_items` (`id`, `cart_id`, `product_id`, `quantity`) VALUES
(1, 1, 25, 1),
(2, 1, 5, 1),
(3, 1, 13, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `code` varchar(100) NOT NULL,
  `name` varchar(100) NOT NULL,
  `brand` varchar(100) NOT NULL,
  `price` decimal(5,2) NOT NULL,
  `img` varchar(300) NOT NULL,
  `calories` varchar(50) NOT NULL,
  `weight` varchar(50) NOT NULL,
  `category` varchar(100) NOT NULL,
  `type` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `products`
--

INSERT INTO `products` (`id`, `code`, `name`, `brand`, `price`, `img`, `calories`, `weight`, `category`, `type`) VALUES
(1, 'nm-fabulosolavanda-0', 'Fabuloso Lavanda', 'Fabuloso', 5.00, '', '', '1 gal', 'Limpieza', 'Desinfectante'),
(2, 'nm-fabulosomanzana-0', 'Fabuloso Manzana', 'Fabuloso', 5.00, '', '', '1 gal', 'Limpieza', 'Desinfectante'),
(3, 'nm-azistinlavanda-0', 'Azistín Lavanda', 'Azistín', 2.50, '', '', '900 ml', 'Limpieza', 'Desinfectante'),
(4, 'nm-azistinmanzanaverde-0', 'Azistín Manzana Verde', 'Azistín', 2.00, '', '', '900 ml', 'Limpieza', 'Desinfectante'),
(5, 'nm-xedexsport-0', 'Xedex Sport', 'Xedex ', 7.16, '', '', '2.3 kg', 'Limpieza', 'Detergente en polvo'),
(6, 'nm-xedexsport900g-0', 'Xedex Sport ', 'Xedex ', 3.22, '', '', '900 g', 'Limpieza', 'Detergente en polvo'),
(7, 'nm-rinsorosaslilas-0', 'Rinso Rosas Lilas ', 'Rinso ', 5.91, '', '', '2.3 kg', 'Limpieza', 'Detergente en polvo'),
(8, 'nm-rinsorosaslilas900g-0', 'Rinso Rosas Lilas', 'Rinso ', 3.76, '', '', '900 g', 'Limpieza', 'Detergente en polvo'),
(9, 'nm-rinsolavanda-0', 'Rinso Lavanda', 'Rinso ', 5.91, '', '', '2.3 kg', 'Limpieza', 'Detergente en polvo'),
(10, 'nm-rinsolavanda900g-0', 'Rinso Lavanda ', 'Rinso ', 3.25, '', '', '900 g', 'Limpieza', 'Detergente en polvo'),
(11, 'nm-axionlimonpasta-0', 'Axión limón pasta', 'Axión ', 2.30, '', '', '600 g', 'Limpieza', 'Lavaplatos'),
(12, 'nm-zagazcitruspasta-0', 'Zagaz citrus pasta', 'Zagaz', 2.00, '', '', '800 g', 'Limpieza', 'Lavaplatos'),
(13, 'nm- doñablancalimon-0', ' Doña Blanca Limón ', 'Doña Blanca ', 0.86, '', '', '340 g', 'Limpieza', 'Lavaplatos'),
(14, 'nn-axionlimonliquido-0', 'Axión limón líquido', 'Axión ', 3.30, '', '', '750 ml', 'Limpieza', 'Lavaplatos'),
(15, 'nn-axionlimonliquido-0', 'Axión limón líquido', 'Axión ', 3.30, '', '', '750 ml', 'Limpieza', 'Lavaplatos'),
(16, 'nm-lejiamagiablanca-0', 'Lejía Magia Blanca', 'Magia Blanca', 3.30, '', '', '3.785 L', 'Limpieza', 'Lejía'),
(17, 'nm-lejiamagiablancalavanda-0', 'Lejía Magia Blanca lavanda', 'Magia Blanca', 3.30, '', '', '3.785 L', 'Limpieza', 'Lejía'),
(18, 'nm-lejiamaxisollimon6pack-0', 'Lejía Maxisol limón 6 pack', 'Maxisol ', 0.55, '', '', '210 ml', 'Limpieza', 'Lejía'),
(19, 'nm-tersodulceencanto-0', 'Terso Dulce Encanto ', 'Terso ', 1.50, '', '', '720 ml', 'Limpieza', 'Suavizante'),
(20, 'nm-tersofinosdetalles-0', 'Terso Finos Detalles ', 'Terso ', 1.50, '', '', '720 ml', 'Limpieza', 'Suavizante'),
(21, 'nm-suavitelanochecer-0', 'Suavitel Anochecer ', 'Suavitel ', 4.35, '', '', '1.3 L', 'Limpieza', 'Suavizante'),
(22, 'nm-suavitelprimaveral-0', 'Suavitel Primaveral ', 'Suavitel ', 4.35, '', '', '1.3 L', 'Limpieza', 'Suavizante'),
(23, 'nm-suavitelcompleteacqua-0', 'Suavitel Complete Acqua ', 'Suavitel ', 4.35, '', '', '1.3 L', 'Limpieza', 'Suavizante'),
(24, 'nm-xtra-0', 'Xtra', 'Xtra', 3.30, '', '', '1125 g', 'Limpieza', 'Jabón de limpieza'),
(25, 'nm-xtralimon-0', 'Xtra Limón', 'Xtra ', 3.30, '', '', '1125 g', 'Limpieza', 'Jabón de limpieza'),
(26, 'nm-xtraaloevera-0', 'Xtra Aloe Vera', 'Xtra ', 3.30, '', '', '1125 g', 'Limpieza', 'Jabón de limpieza'),
(28, 'nm-bolsasplasticasparabasura-0', 'Bolsas plásticas para basura', 'Plasticbag', 2.90, '', '', '6 g', 'Limpieza', 'Bolsas plásticas para basura'),
(29, 'nm-dospinosentera-0', 'Dos Pinos entera ', 'Dos Pinos ', 1.84, '', '161 kcal', '1 L', 'Lácteos', 'Leche'),
(30, 'nm-dospinossemidescremada-0', 'Dos Pinos semidescremada ', 'Dos Pinos ', 1.84, '', '125 kcal', '1 L', 'Lácteos', 'Leche'),
(31, 'nm-saludentera-0', 'Salud entera ', 'Salud ', 1.80, '', '163 kcal', '1 L', 'Lácteos', 'Leche'),
(32, 'nm-australiandeslactosada-0', 'Australian deslactosada ', 'Australian ', 1.85, '', '145 kcal', '1 L', 'Lácteos', 'Leche');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `verification_token` varchar(100) NOT NULL,
  `role` varchar(100) NOT NULL,
  `verified` int(11) NOT NULL,
  `banned` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `verification_token`, `role`, `verified`, `banned`) VALUES
(1, 'NovaMarket', 'novamarket.sv@gmail.com', 'U2FsdGVkX1/l/JetN5d2UyHNTGDFZzcrH/ihfwERAto=', '', 'admin', 1, 0),
(2, 'axel', 'axelramireezz@gmail.com', 'U2FsdGVkX1/fsQdSqPK2qwBka1e3gqIvFmO9qGmZfgk=', '', 'user', 1, 0);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `address`
--
ALTER TABLE `address`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `cards`
--
ALTER TABLE `cards`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`id`);

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
-- AUTO_INCREMENT de la tabla `address`
--
ALTER TABLE `address`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `cards`
--
ALTER TABLE `cards`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
