-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 08-11-2020 a las 22:36:02
-- Versión del servidor: 10.4.14-MariaDB
-- Versión de PHP: 7.4.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `delilah_resto`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `orders`
--

CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `status` varchar(60) NOT NULL,
  `date` datetime NOT NULL,
  `description` varchar(150) NOT NULL,
  `payment_method` varchar(60) NOT NULL,
  `total` float NOT NULL,
  `user_id` int(11) NOT NULL DEFAULT 0,
  `is_disabled` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `orders`
--

INSERT INTO `orders` (`order_id`, `status`, `date`, `description`, `payment_method`, `total`, `user_id`, `is_disabled`) VALUES
(1, 'NUEVO', '2020-11-07 22:28:27', 'This is a new ramen order', 'cash', 795, 4, 0),
(2, 'NUEVO', '2020-11-07 22:30:55', 'This is a new ramen order', 'credit card', 1600, 1, 0),
(62, 'NUEVO', '2020-11-07 22:35:36', 'This is a new ramen order', 'paypal', 665, 3, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `orders_products`
--

CREATE TABLE `orders_products` (
  `order_prod_id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `product_amount` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `orders_products`
--

INSERT INTO `orders_products` (`order_prod_id`, `order_id`, `product_id`, `product_amount`) VALUES
(1, 1, 1, 3),
(2, 2, 2, 4),
(3, 62, 2, 1),
(4, 62, 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `products`
--

CREATE TABLE `products` (
  `product_id` int(11) NOT NULL,
  `name` varchar(60) NOT NULL,
  `price` float NOT NULL,
  `img_url` varchar(200) NOT NULL,
  `description` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `products`
--

INSERT INTO `products` (`product_id`, `name`, `price`, `img_url`, `description`) VALUES
(1, 'Ramen Kimchi', 265, 'kimchi.png', 'Un delicioso caldo picante a base de cerdo y pollo, noodles acompañado de cerdo a la plancha, huevo, queso, pimenton, cebolla y alga nori'),
(2, 'Ramen Kioto', 400, 'kioto.png', 'Delicioso caldo a base de cerdo, noodles acompañado de carne de res ala plancha, brocoli salteado en salsa japonesa, puerro, huevo y alga nori.'),
(3, 'Ramen Miso', 450, 'miso.png', 'Un delicioso caldo a base de cerdo y pollo, noodles  acompañado de pollo ala plancha, huevo, brotes de soya, cebollin y alga nori.'),
(4, 'Ramen Mixto', 580, 'mixto.png', 'Delicioso caldo a base de pollo y cerdo, noodles acompañado de las tres carnes pollo, res, cerdo y chasu');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(60) NOT NULL,
  `password` varchar(60) NOT NULL,
  `full_name` varchar(60) NOT NULL,
  `email` varchar(60) NOT NULL,
  `phone` varchar(11) NOT NULL,
  `delivery_address` varchar(60) NOT NULL,
  `is_admin` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`user_id`, `username`, `password`, `full_name`, `email`, `phone`, `delivery_address`, `is_admin`) VALUES
(1, 'jhon.doe', '$2a$10$Q7n6HzoLQXBoBv.O/1S44usrlGL35EKIjbJywx.9SphsEouYpLsha', 'Jhon Doe', 'jhon.doe@gmail.com', '555 3278', 'Calle falsa 123', 1),
(2, 'omar.moreno', '$2a$10$USzNcLs3VHY2F5364hlZXeTUnslBNMocU2ndZlQmxO4.uZAwZ91Qe', 'Omar Moreno', 'omar.moreno@gmail.com', '123456789', 'Calle falsa 123', 0),
(3, 'joe.biden', '$2a$10$we14R0TJbji5vv03FrgEpeTRjJMrmgUQ1NYO3NtzF3taI8iaL0tHO', 'Joe Biden', 'joe.biden@gmail.com', '555 3278', 'White House USA', 0),
(4, 'brigith.reyes', '$2a$10$NdiV2fk9L8XiqLIvZhCpZeugLC.NjOKD1nWFSGcNA2adk80AllYdi', 'Brigith Reyes', 'bri.reyes@gmail.com', '555 3278', 'Avenida circunvalar # 20-35', 0);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `orders_ibfk_1` (`user_id`);

--
-- Indices de la tabla `orders_products`
--
ALTER TABLE `orders_products`
  ADD PRIMARY KEY (`order_prod_id`),
  ADD KEY `orders_products_ibfk_1` (`order_id`),
  ADD KEY `orders_products_ibfk_2` (`product_id`);

--
-- Indices de la tabla `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;

--
-- AUTO_INCREMENT de la tabla `orders_products`
--
ALTER TABLE `orders_products`
  MODIFY `order_prod_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT de la tabla `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `orders_products`
--
ALTER TABLE `orders_products`
  ADD CONSTRAINT `orders_products_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `orders_products_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
