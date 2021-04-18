CREATE TABLE `balance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `payed_by` varchar(45) NOT NULL,
  `payed_for` varchar(45) NOT NULL,
  `balance` double NOT NULL,
  `currency` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `group_balance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `group_id` varchar(45) NOT NULL,
  `payed_by` varchar(45) NOT NULL,
  `payed_for` varchar(45) NOT NULL,
  `balance` double NOT NULL,
  `currency` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `groups` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `photo` blob,
  `creation date` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `invites` (
  `user_id` varchar(50) NOT NULL,
  `group_id` varchar(45) NOT NULL,
  `Invited_by` varchar(45) NOT NULL,
  `date` datetime NOT NULL,
  PRIMARY KEY (`group_id`,`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `transaction` (
  `id` int NOT NULL AUTO_INCREMENT,
  `payed_by` varchar(45) NOT NULL,
  `payed_for` varchar(45) NOT NULL,
  `is_group` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `amount` double NOT NULL,
  `date` datetime NOT NULL,
  `currency` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `users` (
  `idusers` int NOT NULL AUTO_INCREMENT,
  `users_name` varchar(45) NOT NULL,
  `users_phone` varchar(10) DEFAULT NULL,
  `currency_def` varchar(50) DEFAULT NULL,
  `TZ` varchar(45) DEFAULT NULL,
  `prof_photo` blob,
  `email` varchar(45) NOT NULL,
  PRIMARY KEY (`idusers`),
  UNIQUE KEY `idusers_UNIQUE` (`idusers`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `usersgroups` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `fk_users_idx` (`user_id`),
  KEY `fk_group_idx` (`group_id`),
  CONSTRAINT `fk_group` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`),
  CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`idusers`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
