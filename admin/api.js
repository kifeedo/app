const sqlite3 = require('sqlite3').verbose()
const commons = require('../commons.js')
const fs=require('fs')
const mtm_fields={'publication':[{'table':'tags_posts','get_field':'id_tag','field':'id_post'}]}
api={
	connect:()=>{
		return new sqlite3.Database('./admin/kifeedo.db',(err)=>{
					if(err){
						error(err)
						return console.error(err.message);
					}
						/*console.log('connexion a la base de donnees')*/
				})
	},
	select:(schema)=>{
					let db=api.connect();
					return new Promise((success,error)=>{
								
								let query="SELECT DISTINCT * FROM "+schema+"s";
		
								db.all(query,[],(err,response)=>{
									if(err){
										error(err)
									}
										for(r in response){
											for(f in response[r]){
												if(f=='created_at'){
													response[r][f]=commons.datefr(commons.datetostr(new Date(response[r][f])))
												}
											}
										}
										success(response)
								})
								db.close()
							})
	},
	pkeys:(objet)=>{
		let fields=[]
		for(f in objet){
			if(mtm_fields.indexOf(f)!==-1 ){
				fields.push(f)
			}
		}
		return fields
	},
	
	get:(schema,keys,values,comparator="=",operator="AND")=>{
						return new Promise((success,error)=>{

								let query="SELECT * FROM "+schema+"s WHERE "+keys.join(" "+comparator+" ? "+operator+" ")+" "+comparator+" ? ";
								
								function findAllElements(query,values){

									return new Promise((succ,err)=>{
										let db = api.connect();
										db.all(query,values,(fail,elements)=>{
												if(fail){
													console.log(fail)
													err(fail);
												}
												for(r in elements){
													for(f in elements[r]){
														if(f=='created_at'){
															elements[r][f]=commons.datefr(commons.datetostr(new Date(elements[r][f])))
														}
													}
												}
												succ(elements)
												
											})
										db.close()
										})//end of promise
								}
								
								function findValuesInTable(query,id,get_field){
									return new Promise((resolve,reject)=>{
										let db=api.connect()
										db.all(query,[id],(err,res)=>{
											if(err){
												reject(err)
											}
											if(res != null){
												resolve(res.map(function(x){return x[get_field]}))
											}
										})
										db.close()
									})
								}
								function findManyToManyValues(elements){
									return new Promise(async(succes,err)=>{
										if(mtm_fields.hasOwnProperty(schema)){

											for(mtm in mtm_fields[schema]){
												let table=mtm_fields[schema][mtm]['table'];
												let field=mtm_fields[schema][mtm]['field'];
												let get_field=mtm_fields[schema][mtm]['get_field'];
												
												for(element in elements){
													elements[element][table]=[]
													
													let query = `SELECT ${get_field} FROM ${table} WHERE ${field} = ? `;
													await findValuesInTable(query,elements[element].id,get_field)
													.then(result=>elements[element][table]=result).catch(err=>console.log(err))
													
													
												}
											}
										}
										succes(elements)
									})
								}
								
								findAllElements(query,values)
								.then((result)=>{return findManyToManyValues(result)})
								.then(newresult=> success(newresult))
						})
					
	},
	model:(schema)=>{
		return new Promise((success)=>{
			let db = api.connect();
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
		let db = api.connect();
		return new Promise((success,error)=>{
					api.model(schema).then(model=>{
					
					for(field in model){
						if(objet[field] && objet[field] != ""){
							model[field] = objet[field];
						}else{
							delete model[field];
						}
					}
					let query_keys=Object.keys(model).join(",");
					let query_values=Object.values(model);
					let jokers="?,".repeat(query_values.length).substr(0,(query_values.length*2)-1);
					let query=`INSERT INTO ${schema}s (${query_keys}) VALUES (${jokers})`;
					db.run(query,query_values,function(err){
						if(err){
							throw err;
							error(err);
						}
						let id_post=this.lastID
						/**** Traitement des relations many to many ****/
						api.many_to_many_add(schema,objet,id_post)
						success(id_post);
						db.close()
						})//end dbrun
					})//end apimodel

				})	
	},
	post:(schema,datas)=>{
		let objet=datas
		let db = api.connect();
		return new Promise((success,error)=>{
					api.model(schema).then(model=>{
					for(field in model){
						if(Object.keys(objet).indexOf(field)===-1){
							delete model[field];
						}
						else{
							model[field] = objet[field];	
						}
						
					}
					let query_keys=Object.keys(model);
					let query_values=Object.values(model);
					let s_query=query_keys.map( x => x +" = ?" ).join(",");
					let query=`UPDATE ${schema}s SET ${s_query} WHERE id=${objet.id}`;
					db.run(query,query_values,(err,res)=>{
						if(err){
							throw err;
							error(err);
						}
						db.close()
						api.many_to_many_delete(schema,objet.id).then((r1)=>{
							api.many_to_many_add(schema,objet,objet.id).then((r2)=>{
								console.log(r2)
								
							})

						})
						success(res);
						
						
						})//end dbrun
					})//end apimodel

				})	
	},

	delete:(schema,id)=>{
		let db = api.connect();
		return new Promise((success,error)=>{
				let query=`DELETE FROM ${schema}s WHERE id=?`;
				db.run(query,id,function(err){
					if(err){
						console.log(err);
					}
					api.many_to_many_delete(schema,id)
					success(id)
					db.close();
				})
			})


	},
	many_to_many_add:(schema,objet,id)=>{

		let db=api.connect();
		return new Promise((success,error)=>{
							if(mtm_fields.hasOwnProperty(schema)){
								for(mtm in mtm_fields[schema]){
									let table=mtm_fields[schema][mtm]['table'];
									let spl_mtm=table.split('_');
									let field1='id_'+spl_mtm[0].substring(0,spl_mtm[0].length-1)
									let field2='id_'+spl_mtm[1].substring(0,spl_mtm[1].length-1)
									for(value in objet[table]){
										let query = `INSERT INTO  ${table}  (${field1},${field2}) VALUES (?, ?)`;
										db.run(query,[objet[table][value],id],function(err){
											if(err){
												throw err;
												error(err);

											}else{
												success('element inseré')
											}
										})
									}
														
								}
								db.close();
							}
						})// end of promise
	},
	many_to_many_delete:(schema,id)=>{
		let db=api.connect();
		return new Promise((success,error)=>{
							if(mtm_fields.hasOwnProperty(schema)){
								for(mtm in mtm_fields[schema]){
									let table=mtm_fields[schema][mtm]['table'];
									let field=mtm_fields[schema][mtm]['field'];
									let query = `DELETE FROM ${table} WHERE ${field}=?`;
									db.run(query,id,(err,res)=>{
										if(err){
											throw err;
											error(err);
										}else{
											success('element supprimé')
										}
										
									})
								}
								db.close();
							}
						}) //end of promise

	}

}
module.exports=api