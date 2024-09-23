## Rapport Shortener Backend.

Este é o backend do encurtador de URL do projeto Rapport. Identificado como Rapport Shortener Bbackend. Ele pode ser baixado via npm usando o comando: `npm i rapport-shortener-backend`.

Ele foi criado para uso integrado ao Rapport Bot, e foi autorizado por meu sócio e pelo cliente que o solicitou, que seja compartilhado como _Open Source_ com certas resalvas, como por exemplo:

* A licença deve ser GPL
* As versões públicada deverão ter uma defasagem de duas versões aprovadas para produção.
* O suporte será negociado, e devem ser solicitado direto via whatsapp (85) 985205490
* Melhorias solicitadas serão negociados também pelo meu whatsapp.
* Melhorias propostas pelos usuários deverão ser apresentadas pelo Pull Request no repositório do projeto.

## Banco de Dados.

É preciso que informe os dados de acesso ao banco de dados, e  este tenha a seguintes tabelas:

```
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

```

Para informar os dados de acesso use um arquivo .env no diretório do projeto. O arquivo deve ter as seguintes váriais que são autoexplicativas:

```
DB_NAME
DB_USER
DB_PASS
DB_HOST
```

## Porta de resposta das requisições

Para atender as requisições deve ser informado a porta de escuta do Express.

```
PORT
```