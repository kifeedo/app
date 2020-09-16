const sqlite3 = require('sqlite3').verbose()
const fs=require('fs')

api={

	select:(schema)=>{
					return new Promise((success,error)=>{
								let db = new sqlite3.Database('./admin/kifeedo.db',(err)=>{
								if(err){
									error(err)
									return console.error(err.message);
								}
								console.log('connexion a la base de donnees')
								})

								let query="SELECT DISTINCT * FROM "+schema+"s";
		
								db.all(query,[],(err,response)=>{
									if(err){
										error(err)
									}
										success(response)
								})
								db.close()
							})
	},
	pkeys:(objet)=>{
		let fields=[]
		for(f in objet){
			fields.push(f)
		}
		return fields
	},
	
	get:(schema,keys,values)=>{
		return new Promise((success,error)=>{
								let db = new sqlite3.Database('./admin/kifeedo.db',(err)=>{
								if(err){
									error(err)
									return console.error(err.message);
								}
								console.log('connexion a la base de donnees')
								})
		console.log(keys);
		console.log(values);
		let query="SELECT * FROM "+schema+"s WHERE "+keys.join("=? AND ")+"=?";

		db.all(query,values,(err,response)=>{
			if(err){
				error(err.message);
			}
			success(response);
			})
			db.close();
		})
	},
	model:(schema)=>{
		return new Promise((success)=>{
			let db = new sqlite3.Database('./admin/kifeedo.db',(err)=>{
								if(err){
									error(err)
									return console.error(err.message);
								}
								console.log('connexion a la base de donnees')
								})
			let query="PRAGMA table_info('"+schema+"s')";
			db.all(query,(err,res)=>{
				if(err){
					console.log(err)
					throw err;
				}
				let response={}
				for( item in res ){
					if(res[item].name != 'id'){
						response[res[item].name]='';
					}
				}
				success(response)
				db.close()
			})
		})
	},
	put:(schema,datas)=>{
		let objet=datas
		let db = new sqlite3.Database('./admin/kifeedo.db',(err)=>{
								if(err){
									error(err)
									return console.error(err.message);
								}
								console.log('connexion a la base de donnees')
								})
		return new Promise((success,error)=>{
					api.model(schema).then(model=>{
					
					for(field in model){
						if(objet[field] && objet[field] != ""){
							model[field] = objet[field];
						}else{
							delete model[field]
						}
					}
					let query_keys=Object.keys(model).join(",");
					let query_values=Object.values(model);
					let jokers="?,".repeat(query_values.length).substr(0,(query_values.length*2)-1);
					let query=`INSERT INTO ${schema}s (${query_keys}) VALUES (${jokers})`;
					db.run(query,query_values,(err,res)=>{
						if(err){
							throw err;
							error(err);

						}
						success(res);
						db.close()
						})//end dbrun
					})//end apimodel

				})	
	},
	post:(schema,datas)=>{
		let objet=datas
		console.log(objet)
		let db = new sqlite3.Database('./admin/kifeedo.db',(err)=>{
								if(err){
									error(err)
									return console.error(err.message);
								}
								console.log('connexion a la base de donnees')
								})
		return new Promise((success,error)=>{
					api.model(schema).then(model=>{
					console.log(Object.keys(objet))
					for(field in model){
						console.log(Object.keys(objet).indexOf(field))
						if(Object.keys(objet).indexOf(field)===-1){
							delete model[field];
						}else{
							model[field] = objet[field];
							
						}
						
					}
					console.log(model)
					let query_keys=Object.keys(model);
					let query_values=Object.values(model);
					let s_query=query_keys.map( x => x +" = ?" ).join(",");
					let query=`UPDATE ${schema}s SET ${s_query} WHERE id=${objet.id}`;
					console.log(query)
					db.run(query,query_values,(err,res)=>{
						if(err){
							throw err;
							error(err);

						}
						success(res);
						db.close()
						})//end dbrun
					})//end apimodel

				})	
	},

	delete:(schema,objet)=>{



	}
}
module.exports=api