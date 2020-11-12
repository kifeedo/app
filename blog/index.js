const express = require('express')
const expressSession = require('express-session')
const cookieParser=require('cookie-parser')
const app = express()
const path = require('path')
const config = require('../config.js')
const api= require('../admin/api.js')
const commons=require('../commons.js')
const bodyParser = require('body-parser')
const multer = require('multer')
const upload = multer({dest:'./uploads'})

function contextCreateBlog(req){
	return new Promise((success,error)=>{
					  let parameters={}
					  let page_blog={}
					  let liste_categories=[]
					  let liste_tags=[]
					  let last_posts=[]
					  api.get('parameter',['id'],[1]).then((params)=>{
					  	 parameters=params[0]
					 
					  	api.select('categorie').then((res_categories)=>{
					  		liste_categories=res_categories;
					  	})
					  	api.select('tag').then((res_tags)=>{
					  		liste_tags=res_tags;
					  	})
					  	api.get('publication',['id'],[4]).then((page)=>{
					  		page_blog=page[0]
					  		success(
					  			{
					  			title:page_blog['title'],
					  			description:page_blog['description'],
					  			keywords:page_blog['keywords'],
					  			params:parameters,
					  			categories:liste_categories,
					  			tags:liste_tags,
					  			last_posts:[],
					  			liste_posts:[],
					  			styles:config.css_common,
					  			scripts:config.scripts_common,
					  			context:commons.contextCreate(req,'kifeedo')
					  			})
					  		})
					  	})
					})//end of promise
}

//app.set('view option',{layout:false})
app.use(cookieParser())
app.use(expressSession({
	secret:'1234',
	resave:false,
	saveUninitialized:true,
	cookie:{secure:false}
	})
)
app.use(express.static(config.node_modules))
app.use(express.static(path.join(__dirname,'/static')))
app.use(express.static(path.join(__dirname,'/uploads')))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(express.json())

app.get('/', (req, res) => {
  api.get('publication',['id_type'],[1]).then((res2)=>{
  			contextCreateBlog(req).then((datas)=>{
		  			datas.last_posts=res2.slice(1,5);
		  			datas.liste_posts=res2;
		  			res.render('./blog/index',datas)
		  	})
  		})
}),
app.get('/article/:id',(req,res)=>{
	let id=req.params.id;
	let last_posts=[];
	let categorie='';
	let tags=[];
	let masque_nb_id_iter=[];
	api.get('publication',['id'],[id]).then(async(post)=>{
		contextCreateBlog(req).then(async(datas)=>{
			datas.post=post[0];
			for(ind in post[0].tags_posts){
				masque_nb_id_iter.push('id');
			}
			await api.get('categorie',['id'],[post[0].id_categorie]).then((rcat)=>{
				categorie=rcat[0].categorie;
			})
			await api.get('tag',masque_nb_id_iter,post[0].tags_posts,'OR').then((rtags)=>{
				tags=rtags.map(function(x){return x['tag']})
			})
			await api.get('publication',['id_type'],[1]).then((lposts)=>{
				last_posts=lposts.slice(1,5)	
			})
			datas.post.categorie=categorie;
			datas.post.tags=tags;
			datas.last_posts=last_posts;
			res.render('./blog/details_post',datas)
		})
	})
})
app.post('/search/',(req,res)=>{
	let pattern="%"+req.body.pattern+"%";
	let last_posts=[];
	api.get('publication',['id_type','titre','content'],[1,pattern,pattern],'LIKE','OR').then(async(posts)=>{
		await api.get('publication',['id_type'],[1]).then((lposts)=>{
				last_posts=lposts.slice(1,5)	
		})
		contextCreateBlog(req).then((datas)=>{
		  			datas.last_posts=last_posts;
		  			datas.liste_posts=posts;
		  			res.render('./blog/index',datas)
		  	})

	})

})
app.get('/tag/:id',(req,res)=>{
	let id=parseInt(req.params.id)
	let last_posts=[]
	let posts=[]
	api.get('tags_posts',['id_tag'],(id_posts)=>{
		
	})
})
app.get('/categorie/:id',(req,res)=>{
	let id=parseInt(req.params.id)
	let last_posts=[]

	api.get('publication',['id_type'],[1]).then((posts)=>{
		last_posts=posts.slice(1,5);
	})

	api.get('publication',['id_type','id_categorie'],[1,id]).then((res2)=>{
				contextCreateBlog(req).then((datas)=>{
					datas.last_posts=last_posts;
					datas.liste_posts=res2
					res.render('./blog/index',datas)
  				})
	})
 })

app.get('/tag/:id',(req,res)=>{
	let id=parseInt(req.params.id)
	let last_posts=[]

	api.get('publication',['id_type'],[1]).then((posts)=>{
		last_posts=posts.slice(1,5);
	})
	api.get('publication',['id_type','id_tag'],[1,id]).then((res2)=>{
				contextCreateBlog(req).then((datas)=>{
						datas.liste_posts=res2
						datas.last_posts=last_posts
						res.render('./blog/index',datas)
  				})
  		})
})


module.exports=app
