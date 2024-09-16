# Banco de Dados.
é preciso que informe os dados de acesso ao banco de dados, e  este tenha a seguintes tabelas:

CREATE TABLE `sites` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `url` varchar(45) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `contact_id` int(11) NOT NULL,
  `enabled` tinyint(4) DEFAULT 1 COMMENT 'os contatos disabilitados em versão futura serão movidos para uma tabela de contatos desabilitados.\n',
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_site_contacts1_idx` (`contact_id`),
  CONSTRAINT `fk_site_contacts1` FOREIGN KEY (`contact_id`) REFERENCES `contacts` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `sites_shortener_stats` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `short_url_id` int(11) NOT NULL,
  `accessed_at` datetime NOT NULL DEFAULT current_timestamp(),
  `request_ip` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `short_url_id` (`short_url_id`),
  CONSTRAINT `sites_shortener_stats_ibfk_1` FOREIGN KEY (`short_url_id`) REFERENCES `sites_shortenes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `sites_shortenes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `site_id` int(11) NOT NULL,
  `hash` varchar(255) NOT NULL,
  `original_url` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `site_id` (`site_id`),
  CONSTRAINT `sites_shortenes_ibfk_1` FOREIGN KEY (`site_id`) REFERENCES `sites` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;