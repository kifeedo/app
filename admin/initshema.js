const sqlite3 = require('sqlite3').verbose()

const db = new sqlite3.Database('kifeedo.db',(err)=>{
								if(err){
									return console.error(err.message);
								}
								console.log('connecte a la base kifeedo');
								});
//CONSTRAINT chk_parameters_encrypt check( encrypt IN `None`,`SSL`,`TLS`), \
let schemas={
// Creation de la table parametres
	parameters:'CREATE TABLE IF NOT EXISTS parameters ( \
				id INTEGER PRIMARY KEY AUTOINCREMENT,	\
				logo VARCHAR(30) NULL,					\
				societe VARCHAR(30) NULL,				\
				salt VARCHAR(10) NULL,					\
				static VARCHAR(10) DEFAULT `/static`, 	\
				upload VARCHAR(10) DEFAULT `/upload`,	\
				smtp   VARCHAR(15) NULL,				\
				port   VARCHAR(3) NULL,					\
				authent BOOLEAN DEFAULT FALSE,				\
				encrypt CHAR(3) NOT NULL,				\
				login_mail VARCHAR(15) NULL,			\
				mdp_mail  VARCHAR(30) NULL			\
				)',

// Creation de la table auteurs
	authors:'CREATE TABLE IF NOT EXISTS authors ( 		\
				id INTEGER PRIMARY KEY AUTOINCREMENT,	\
				prenom VARCHAR(20) NULL,				\
				nom VARCHAR(30),						\
				login VARCHAR(30),						\
				avatar VARCHAR(150) NULL,				\
				password TEXT 							\
				)',

// Creation de la table categories

	categories:'CREATE TABLE IF NOT EXISTS categories ( 	\
					id INTEGER PRIMARY KEY AUTOINCREMENT,	\
					categorie VARCHAR(20) NOT NULL,			\
					icone VARCHAR(30) NULL					\
					)',

// Creation de la table tags

	tags:'CREATE TABLE IF NOT EXISTS tags (					\
					id INTEGER PRIMARY KEY AUTOINCREMENT,	\
					tag VARCHAR(15) NOT NULL			\
					)',
//Creation types posts
	type_posts:'CREATE TABLE IF NOT EXISTS type_posts (		\
					id INTEGER PRIMARY KEY AUTOINCREMENT,   \
					type_post VARCHAR(10) NOT NULL			\
					)',
//Creation de la table posts

	publications:'CREATE TABLE IF NOT EXISTS publications (				\
					id INTEGER PRIMARY KEY AUTOINCREMENT,	\
					id_type INTEGER NOT NULL DEFAULT 1, 	\
					created_at DATE NOT NULL,				\
					title VARCHAR(50) NOT NULL,				\
					description TEXT NOT NULL,				\
					keywords TEXT NOT NULL,					\
					id_categorie INTEGER NOT NULL,			\
					titre VARCHAR(30) NULL,					\
					resume TEXT	NULL,						\
					content TEXT NULL,						\
					template VARCHAR(50) NOT NULL DEFAULT `default`,\
					FOREIGN KEY(id_type)						\
						REFERENCES type_posts (id)				\
						ON UPDATE NO ACTION,					\
					FOREIGN KEY(id_categorie)					\
						REFERENCES categories (id)				\
						ON UPDATE NO ACTION						\
						)',									
	//Creation de la table de liaison tags_posts 
	tags_posts:'CREATE TABLE IF NOT EXISTS tags_posts ( 		\
						id INTEGER PRIMARY KEY AUTOINCREMENT,   \
						id_tag INTEGER NOT NULL,	            \
						id_post INTEGER NOT NULL,				\
						FOREIGN KEY(id_tag)					\
							REFERENCES tags (id)				\
							ON UPDATE NO ACTION,				\
						FOREIGN KEY(id_post)					\
							REFERENCES posts (id)				\
							ON UPDATE NO ACTION					\
						)',						

	//Creation de la table prestations
	prestations:'CREATE TABLE IF NOT EXISTS prestations (		\
						id INTEGER PRIMARY KEY AUTOINCREMENT,	\
						id_categorie INTEGER NULL,				\
						title VARCHAR(50) NOT NULL,				\
						description TEXT NOT NULL,				\
						keywords TEXT NOT NULL,					\
						prestation VARCHAR(30) NOT NULL,		\
						illustration VARCHAR(30) NULL,			\
						resume TEXT NULL,						\
						content TEXT NULL						\				\
						)',

	//Creation de la table commentaires
	comments:'CREATE TABLE IF NOT EXISTS comments ( 			\
						id INTEGER PRIMARY KEY AUTOINCREMENT,	\
						id_post INTEGER NOT NULL,				\
						created_at DATE NOT NULL,				\
						id_author INTEGER NOT NULL,				\
						is_validate INTEGER DEFAULT 0			\
						)'
	};
	db.serialize(()=>{
		for(schema in schemas){
			
			db.run(schemas[schema],(err)=>{
					if(err){
						return console.log(err.message);
					}
					
			})
			console.log(schema+" cree");
		}
	})
	//inserts
	let inserts={
		authors:"INSERT INTO authors ('login','nom','prenom','password') \
							VALUES ('lafee','THIRY','VALERIE','123');",
		categories:"INSERT INTO categories ('categorie') VALUES ('soins');",
		type_posts:"INSERT INTO type_posts ('type_post') VALUES ('post'),('page');"
	}
	for(insert in inserts){
		db.run(inserts[insert],(err)=>{
			if(err){
				return console.log(err.message);
			}
			
		})
		console.log('valeurs de la table '+insert+' inserees')
	}

db.close();