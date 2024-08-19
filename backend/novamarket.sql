-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 19-08-2024 a las 06:59:36
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
(28, 'nm-bolsasplasticasparabasura-0', 'Bolsas plásticas para basura', 'Plasticbag', 2.90, '', '', '6 u', 'Limpieza', 'Bolsas plásticas para basura'),
(29, 'nm-dospinosentera-0', 'Dos Pinos entera ', 'Dos Pinos ', 1.84, '', '161 kcal', '1 L', 'Lácteos', 'Leche'),
(30, 'nm-dospinossemidescremada-0', 'Dos Pinos semidescremada ', 'Dos Pinos ', 1.84, '', '125 kcal', '1 L', 'Lácteos', 'Leche'),
(31, 'nm-saludentera-0', 'Salud entera ', 'Salud ', 1.80, '', '163 kcal', '1 L', 'Lácteos', 'Leche'),
(32, 'nm-australiandeslactosada-0', 'Australian deslactosada ', 'Australian ', 1.85, '', '145 kcal', '1 L', 'Lácteos', 'Leche'),
(33, 'nm-yesfresa-0', 'Yes Fresa', 'Yes ', 0.69, '', '160 kcal', '212 Kg', 'Lácteos', 'Yogurt'),
(34, 'nm-yesdurazno-0', 'Yes Durazno', 'Yes', 0.69, '', '162 kcal', '212 Kg', 'Lácteos', 'Yogurt'),
(35, 'nm-yesmelocoton-0', 'Yes Melocotón', 'Yes', 0.69, '', '160 kcal', '212 Kg', 'Lácteos', 'Yogurt'),
(36, 'nm-yogurtgriego-0', 'Yogurt Griego', 'Yes', 5.15, '', '130 kcal', '1 Kg', 'Lácteos', 'Yogurt'),
(37, 'nm-yesfresa1kg-0', 'Yes Fresa', 'Yes ', 3.20, '', '160 kcal', '1 Kg', 'Lácteos', 'Yogurt'),
(38, 'nm-yesvainilla1kg-0', 'Yes Vainilla', 'Yes ', 3.25, '', '163 kcal', '1 Kg', 'Lácteos', 'Yogurt'),
(39, 'nm-flanyoplait-0 ', 'Flan Yoplait ', 'Yoplait ', 1.55, '', '120 kcal', '220 g', 'Lácteos', 'Flan'),
(40, 'nm-danettedanone-0', 'Danette Danone', 'Danette ', 1.25, '', '110 kcal', '200 g', 'Lácteos', 'Flan'),
(41, 'nm-cofileche-0', 'Cofileche', 'Salud', 1.75, '', '150 kcal', '473 ml', 'Lácteos', 'Cofileche'),
(42, 'nm-laCatalanamediano-0', 'La Catalana mediano', 'La Catalana ', 5.90, '', '', '30 u', 'Lácteos', 'Huevos'),
(43, 'nm-lacatalanamediano15u-0', 'La Catalana mediano', 'La Catalana', 4.95, '', '', '15 u', 'Lácteos', 'Huevos'),
(44, 'nm-elgranjerorojomediano-0', 'El Granjero rojo mediano', 'El Granjero rojo ', 5.71, '', '', '30 u', 'Lácteos', 'Huevos'),
(45, 'nm-elgranjerorojomediano15u-0', 'El Granjero rojo mediano', 'El Granjero rojo', 3.21, '', '', '15 u', 'Lácteos', 'Huevos'),
(46, 'nm-elgranjerorojogrande-0', 'El Granjero rojo grande', 'El Granjero rojo ', 11.49, '', '', '15 u', 'Lácteos', 'Huevos'),
(47, 'nm-duroblandopetacones-0', 'Duro Blando Petacones', 'Petacones', 3.25, '', '100 kcal', '170 g', 'Lácteos', 'Queso'),
(48, 'nm-duroviejopetacones-0', 'Duro Viejo Petacones', 'Petacones', 3.55, '', '200 kcal', '170 g', 'Lácteos', 'Queso'),
(49, 'nm-quesocremalactolac-0', 'Queso Crema Lactolac', 'Lactolac', 1.60, '', '120 kcal', '210 g', 'Lácteos', 'Queso'),
(50, 'nm-quesoamericanolactolac-0', 'Queso Americano Lactolac', 'Lactolac', 1.66, '', '95 kcal', '240 g', 'Lácteos', 'Queso'),
(51, 'nm-cremalactolac-0', 'Crema Lactolac ', 'Lactolac ', 1.95, '', '110 kcal', '380 g', 'Lácteos', 'Crema'),
(52, 'nm-creamlightpetacones-0', 'Cream Light Petacones ', 'Petacones ', 2.85, '', '29 kcal ', '340 g', 'Lácteos', 'Crema'),
(53, 'nm-cremapuracanjulian-0', 'Crema pura San Julián', 'San Julián', 4.15, '', '90 kcal', '340 g', 'Lácteos', 'Crema'),
(54, 'nm-head&shouldersmanzana-0', 'Head & Shoulders Manzana', 'Head & Shoulders ', 5.70, '', '', '375 ml', 'Higiene', 'Shampoo'),
(55, 'nm-head&shoulderscaida-0', 'Head & Shoulders Caída', 'Head & Shoulders', 3.70, '', '', '370 ml', 'Higiene', 'Shampoo'),
(56, 'nm-soveregeneracionextrema-0', 'Dove Regeneración Extrema', 'Dove ', 11.50, '', '', '750 ml', 'Higiene', 'Shampoo'),
(57, 'nm-pantenelisoextremo-0', 'Pantene Liso Extremo', 'Pantene ', 7.25, '', '', '400 ml', 'Higiene', 'Shampoo'),
(58, 'nm-sedalkeratinaconantioxidante-0', 'Sedal Keratina con Antioxidante ', 'Sedal ', 4.50, '', '', '650 ml', 'Higiene', 'Shampoo'),
(59, 'nm-doveoriginal-0', 'Dove Original', 'Dove ', 1.50, '', '', '90 g', 'Higiene', 'Jabón de higiene personal'),
(60, 'nm-venzavite4Pack-0', 'Venza Vite 4 Pack', 'Venza ', 2.42, '', '', '110 g', 'Higiene', 'Jabón de higiene personal'),
(61, 'nm-rexonaantibacterialavena3pack-0', 'Rexona Antibacterial Avena 3 Pack', 'Rexona ', 2.59, '', '', '110 g', 'Higiene', 'Jabón de higiene personal'),
(62, 'nm-asepxianeutro-0', 'Asepxia Neutro', 'Asepxia ', 5.00, '', '', '100 g', 'Higiene', 'Jabón de higiene personal'),
(63, 'nm-asepxiacarbon-0', 'Asepxia Carbón', 'Asepxia', 5.00, '', '', '100 g', 'Higiene', 'Jabón de higiene personal'),
(64, 'nm-niveaaclaradonatural-0', 'Nivea Aclarado Natural ', 'Nivea ', 10.85, '', '', '220 ml', 'Higiene', 'Crema corporal'),
(65, 'nm-lubridermpielnormal-0', 'Lubriderm Piel Normal', 'Lubriderm ', 12.19, '', '', '400 ml', 'Higiene', 'Crema corporal'),
(66, 'nm-colgateanticaries-0', 'Colgate Anticaries ', 'Colgate', 2.55, '', '', '150 ml', 'Higiene', 'Pasta dental'),
(67, 'nm-colgateluminouswhite-0', 'Colgate Luminous White', 'Colgate ', 6.80, '', '', '170 ml', 'Higiene', 'Pasta dental'),
(68, 'nm-oralb3dwhite-0', 'Oral B 3D White', 'Oral B ', 3.61, '', '', '140 g', 'Higiene', 'Pasta dental'),
(69, 'nm-encantosuper4rollos-0', 'Encanto Super 4 rollos', 'Encanto ', 1.50, '', '', '4 u', 'Higiene', 'Papel higiénico'),
(70, 'nm-encanto1000hojas4rollos-0', 'Encanto 1000 hojas 4 rollos', 'Encanto ', 1.99, '', '', '4 u', 'Higiene', 'Papel higiénico'),
(71, 'nm-scott12rollos-0', 'Scott 12 rollos', 'Scott ', 5.00, '', '', '12 u', 'Higiene', 'Papel higiénico'),
(72, 'nm-rosalverde18rollos-0', 'Rosal Verde 18 rollos', 'Rosal ', 12.60, '', '', '18 u', 'Higiene', 'Papel higiénico'),
(73, 'nm-hawaiiantropic70spf-0', 'Hawaiian Tropic 70 SPF', 'Hawaiian Tropic', 15.99, '', '', '180 ml', 'Higiene', 'Protector solar'),
(74, 'nm-niveasunf50-0', 'Nivea Sun F50', 'Nivea', 14.15, '', '', '200 ml', 'Higiene', 'Protector solar'),
(75, 'nm-niveasunpielsensible50spf-0', 'Nivea Sun Piel Sensible 50 SPF', 'Nivea ', 20.15, 'https://novamarket-img.s3.amazonaws.com/nm-niveasunpielsensible50spf-0', '', '200 ml', 'Higiene', 'Protector solar'),
(76, 'sdfsdf', 'fdsfs', 'dfsd', 534.00, 'https://novamarket-img.s3.amazonaws.com/sdfsdf', 'sfds', 'fsd', 'Carnes', 'Detergente en polvo'),
(77, 'vvvvv', 'vvvvv', 'vvvv', 54.00, 'https://novamarket-img.s3.amazonaws.com/vvvvv', 'vvv', 'vvv', 'Carnes', 'Desinfectante');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=78;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
