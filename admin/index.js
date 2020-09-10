const express = require('express')
const app = express()
const path = require('path')
const config = require('../config.js')
const api = require('./api')
const bodyParser = require('body-parser')
const multer = require('multer')
const commons = require('../commons.js')
var upload = multer({dest:'/uploads'})
const fs=require('fs')

const FIELDS={'categorie':['id','categorie'],
				'publication':['id','title','resume'],
				'author':['id','login','prenom','nom'],
				'parameter':['id','logo','societe'],
				'prestation':['id','prestation'],
				'tag':['id','tag']}

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname,'/node_modules')))
app.use(express.static(path.join(__dirname,'/static')))
app.use(express.static(path.join(__dirname,'/uploads')))

app.post('/upload/',(req,res)=>{
	if(req.files){
	commons.upload(req.files['file'],'images',false)
}
	res.send('image upload');

})
app.get('/',(req,res)=>{
	let params={}
	api.select('parameter',1).then((resp)=>{
		params=resp[0];
		res.render('./admin/index',{
								params:params,
								context:{log:"tom"},
								styles:config.css_common,
  								scripts:config.scripts_common})
		})
})
app.get('/:schema/',(req,res)=>{
	let params={}
	let fields=[]
	let schema=req.params.schema;
	let liste=[]//liste des resultats de la requete 
	let model={} //objet vide
	let categories=[]
	let tags=[]
	let types_posts=[]
	//requetes
	api.select(schema).then(async(result)=>{
							await api.select('parameter',1).then(res=>{
								params=res[0]
							})
							fields=FIELDS[schema]
							liste=result
							await api.select('type_post').then(res=>{
							 types_posts=res
							})
							await api.select('categorie').then((res)=>{
								categories=res
							})
							api.select('tag').then((res)=>{
								tags=res
							})
							return api.model(schema)				
	}).then((model)=>{

			res.render('./admin/objet',{schema:schema,
											params:params,
											liste:liste,
											fields:fields,
											objet:model,
											action:'put',
											categories:categories,
											types_posts:types_posts,
											tags:tags,
											styles:config.css_common,
  											scripts:config.scripts_common,
											context:{log:'tom'}
											})

	})
})
app.get('/:schema/:id',(req,res)=>{
	let schema=req.params.schema;
	let id=req.params.id;
	let params={};
	let liste=[];
	let fields=[];
	let categories=[];
	let tags=[];
	let types_posts=[];
	//requetes
	api.get(schema,id).then(async(result)=>{
					fields=FIELDS[schema]
					await api.select('parameter',1).then((res)=>{
					params=res[0]
					})
					await api.select(schema).then((res)=>{
					liste=res
					})
					await api.select('type_post').then((res)=>{
					types_posts=res
					})
					await api.select('categorie').then((res)=>{
					categories=res
					})
					api.select('tag').then((res)=>{
					tags=res
					})
		res.render('./admin/objet',{schema:schema,
									liste:liste,
									action:'post',
									params:params,
									objet:result[0],
									fields:fields,
									categories:categories,
									types_posts:types_posts,
									tags:tags,
									styles:config.css_common,
									scripts:config.scripts_common,
									context:{log:'tom'}

		});

	});

})

app.post('/:schema/put/',upload,(req,res)=>{
	let schema=req.params.schema;
	let message=""
	let objet={datas:req.body,errors:{}}
	if(req.files){
		for(file in req.files){
			commons.upload(req.files[file],config.UPLOADS_DIR+'/images',false)
			req.body[file]=req.files[file].originalname
		}
	}
	
	api.put(schema,req.body).then((response)=>{
		res.send(response);

	})
	


})
app.post('/:schema/post/',upload,(req,res)=>{
	let schema=req.params.schema
	let message=""
	let objet={datas:req.body,errors:{}}
	if(req.files){
		for(file in req.files){
			commons.upload(req.files[file],config.UPLOADS_DIR+'/images',false)
			req.body[file]=req.files[file].originalname
		}
	}

	api.post(schema,req.body).then((response)=>{
		res.send(response);
	})

})
app.post('/delfile',upload,(req,res)=>{
		let schema=req.body.schema;
		let field=req.body.field;
		let file=req.body.file;
		let id=req.body.id;	
		let rep=config.UPLOADS_DIR+'/images/';
		/* Traitement du champ */
		let params={'id':id}
		params[field]="";
		api.post(schema,params).then((result)=>{
			/* Traitement du fichier */
			console.log()
				try{
					fs.unlinkSync(rep+file);
					/*fs.unlinkSync(rep+'/thumbnails/'+doc[req.body.field].slice(0,-4)+'.png');*/
					message='le fichier '+file+' a correctement été supprimé';
				}catch(error){
					message=error.message;
				}
				res.send(message);

		})
									
})
module.exports=app