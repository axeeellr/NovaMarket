-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 23-05-2024 a las 07:07:56
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
-- Estructura de tabla para la tabla `cards`
--

CREATE TABLE `cards` (
  `id` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `number` varchar(100) NOT NULL,
  `holder` varchar(100) NOT NULL,
  `date` date NOT NULL,
  `cvv` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `cards`
--

INSERT INTO `cards` (`id`, `id_user`, `number`, `holder`, `date`, `cvv`) VALUES
(1, 1, '4657398754673472', 'Axel Ramirez', '2027-07-01', 567);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cart`
--

CREATE TABLE `cart` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `date` date NOT NULL,
  `card_id` int(11) NOT NULL,
  `total` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `cart`
--

INSERT INTO `cart` (`id`, `user_id`, `name`, `date`, `card_id`, `total`) VALUES
(1, 1, 'verduras', '2024-05-23', 1, '16.2');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cart_items`
--

CREATE TABLE `cart_items` (
  `id` int(11) NOT NULL,
  `cart_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `cart_items`
--

INSERT INTO `cart_items` (`id`, `cart_id`, `product_id`, `quantity`) VALUES
(1, 1, 3, 3),
(2, 1, 11, 1),
(3, 1, 9, 2);

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
(1, 'nm-mandarina-0', 'Mandarinas', 'NovaMarket', 2.25, 'https://tienda.frutamare.com/cdn/shop/products/mandarinas-premium-min_1024x1024_2x_d79f85f7-dd4c-4e54-9247-c6ae1f20e974.webp?v=1680175833&width=533', '318kcal', '454g'),
(2, 'nm-pera-0', 'Peras', 'NovaMarket', 1.75, 'https://lpdimportexport.com.br/wp-content/uploads/2023/05/17a.png', '228kcal', '454g'),
(3, 'nm-tomate-0', 'Tomates', 'NovaMarket', 2.35, 'https://obahortifruti.vtexassets.com/arquivos/ids/5692016/Tomate-Italiano-Organico-500-G.png?v=638390190788400000', '72kcal', '454g'),
(4, 'nm-uva-0', 'Uvas', 'NovaMarket', 2.3, 'https://phygital-files.mercafacil.com/comercial-tradicao/uploads/produto/uva_red_glob_bdj_500g_e87da9c8-0224-4133-b006-08442252b53e.png', '228kcal', '454g'),
(5, 'nm-manzana-0', 'Manzana Roja', 'NovaMarket', 2.3, 'https://hebmx.vtexassets.com/arquivos/ids/726706/825799_image.png?v=638498029419570000', '468kcal', '500g'),
(6, 'nm-naranja-0', 'Naranjas', 'NovaMarket', 2.75, 'https://naranjassanjose.com/wp-content/uploads/2023/06/f9c33f36-d60f-42b9-8193-6ad8e9d65f9f.png', '141kcal', '454g'),
(7, 'nm-mango-0', 'Mangos', 'NovaMarket', 2.75, 'https://mnib.gd/wp-content/uploads/2021/07/CeylonMango-1.png', '180kcal', '454g'),
(8, 'nm-rabano-0', 'Rábanos', 'NovaMarket', 1.5, 'https://www.calfruitos.com/fotos/pr_191_20211015113501.png', '176kcal', '454g'),
(9, 'nm-cilantro-0', 'Cilantro Orgánico', 'NovaMarket', 2.75, 'https://www.florempaque.com/web/media/pictures/_productos2/4-1.png', '69kcal', '260g'),
(10, 'nm-pepino-0', 'Pepino', 'NovaMarket', 1.35, 'https://smattcom.com/img/header-pepino2@x1.png', '45kcal', '454g'),
(11, 'nm-papa-0', 'Papa Americana', 'NovaMarket', 3.65, 'https://stoller.com.gt/sv/wp-content/uploads/2019/05/papa-1.png', '225kcal', '454g'),
(12, 'nm-carnemol-0', 'Carne Molida de Res Especial', 'DonCristóbal ', 3.9, 'https://i0.wp.com/supeyfruteriaaj.com/wp-content/uploads/2023/07/8020-removebg-preview.png?fit=360%2C360&ssl=1', '132kcal', '454g'),
(13, 'nm-filete-0', 'Filete de Res sabor Chimichurri', 'DiacoFoods', 3.9, 'https://diacofoods.sv/wp-content/uploads/2023/01/EmpaqueFileteChimichurri_v001.png', '135kcal', '454g'),
(14, 'nm-molleja-0', 'Mollejas de Res', 'RumbaMeats', 1.9, 'https://rumbameats.com/wp-content/uploads/2017/08/53001_RumbaMeats_Sweetbreads_FRESH_Mockup_FA_cp-768x664.png', '534kcal', '454g'),
(15, 'nm-lomo-0', 'Lomo de Res', 'DonCristobal', 5.46, 'https://perulabecologic.com.pe/wp-content/uploads/2020/05/RES-LOMO-FINO.png', '166kcal', '454g'),
(16, 'nm-tomahawk-0', 'Tomahawk', 'CarnesGrin', 6.16, 'https://carnesgrin.com/wp-content/uploads/2020/04/tomahawk.png', '149kcal', '454g'),
(17, 'nm-churrasco-0', 'Churrasco Redondo Parrillero de Res', 'MarketCircolo', 3.45, 'https://aceleralastatic.nyc3.cdn.digitaloceanspaces.com/files/uploads/1499/1637589934-58-churrasco-redondo-png.png', '130kcal', '454g'),
(18, 'nm-hueso-0', 'Hueso Especial de Res', 'Pronaca', 2.25, 'https://pronacatqma.com/images/stories/virtuemart/product/hueso-carnudo-300.png', '104kcal', '454g'),
(19, 'nm-costilla-0', 'Costilla Corta de Res', 'RumbaMeats', 3.95, 'https://rumbameats.com/wp-content/uploads/2021/08/Short-Ribs-Flanken_1100-1-768x591.png', '400g', '454g'),
(20, 'nm-carnehambur-0', 'Carne de Hamburguesa Premium', 'RanchoEl17', 9.99, 'https://www.ranchoel17.com/cdn/shop/files/HAMBURGUESAPREMIUM_bb0f7c33-8f78-436f-9c01-4cb4082110b5.png?v=1701121772', '295kcal', '500g'),
(21, 'nm-jamon-0', 'Jamón de Pavo Premium', 'LaSelva', 2.95, 'https://laselva.es/wp-content/uploads/2021/06/CorteCharcutero_PechugaPavoCocida_780x780.png', '126kcal', '290g'),
(22, 'nm-jamonvirgi-0', 'Jamón de Pavo Virginia', 'Toledo', 2.25, 'https://toledoalimentos.com/panama/wp-content/uploads/sites/3/2022/05/Jamon-de-pavo-tipo-virginia-450g.png', '108kcal', '230g'),
(23, 'nm-salchicha-0', 'Salchicha de Pavo', 'Fritz', 2.15, 'https://www.fritz.com.ec/images/virtuemart/product/Salchicha%20de%20pavo%20400%20g.png', '120kcal', '400g'),
(24, 'nm-chorizomex-0', 'Chorizo de Cerdo Mexicano', 'Berard', 2.34, 'https://productosberard.com.pa/wp-content/uploads/2017/11/chorizo_mexicano_nw.png', '187kcal', '400g'),
(25, 'nm-chorizoargen-0', 'Chorizo Argentino', 'Chata', 2.4, 'https://productoschata.com/wp-content/uploads/2023/05/chorizo-argentino.png', '258kcal', '330g'),
(26, 'nm-tocino-0', 'Tocino Ahumado', 'LaPreferida', 3.75, 'https://s3.amazonaws.com/bsalemarket/58394/product/9292.png', '541kcal', '170g'),
(27, 'nm-pepperoni-0', 'Pepperoni', 'FieldRoast', 2.3, 'https://fieldroast.com/wp-content/uploads/2021/06/PepperoniRender_FOP1.png', '494kcal', '200g'),
(28, 'nm-salami-0', 'Salami Español Premium', 'Berard', 4.15, 'https://productosberard.com.pa/wp-content/uploads/2017/11/berard_salami_espanol_nw.png', '336kcal', '100g'),
(29, 'nm-salchichajalp-0', 'Salchichas para Asar Jalapeño', 'Bafar', 2.5, 'https://bafar.com/wp-content/uploads/2022/05/6145_400px.png', '642kcal', '400g'),
(30, 'nm-detergente-0', 'Detergente Liquido', 'Aby', 4.99, 'https://www.ahorromas.cl/cdn/shop/products/lav-detergente-azul5l.png?v=1677162885', '', '5L');

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
(1, 'axel', 'axelramireezz@gmail.com', 'U2FsdGVkX1/v1tGZjkR9+ZKT1kFr2xLohI7j6up3ho0=');

--
-- Índices para tablas volcadas
--

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
