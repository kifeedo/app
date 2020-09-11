const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const config = require('./config.js')
const admin= require('./admin/index.js')
const api= require('./admin/api.js')
const nodemailer = require('nodemailer')
const bodyParser = require('body-parser')
const multer = require('multer')
var upload = multer({dest:'./uploads'})
// view engine setup
app.set('env',"dev");
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//app.set('view option',{layout:false})
app.use(express.static(config.node_modules))
app.use(express.static(path.join(__dirname,'/static')))
app.use(express.static(path.join(__dirname,'/uploads')))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(express.json())
app.use('/admin',admin)

app.get('/', (req, res) => {
  //res.send('Hello World!')
  let parameters={}
  api.get('parameter',1).then((res1)=>{
  	parameters=res1[0]
  	api.get('publication',1).then((res2)=>{
  				res.render('index',{
  				title:res2[0]['title'],
  				description:res2[0]['description'],
  				keywords:res2[0]['keywords'],
  				params:parameters,
  				content:res2[0],
  				styles:config.css_common,
  				scripts:config.scripts_common,
  				message:"hello everybody",
  				})
  		})
	})
})
app.get('/prestations/',(req,res)=>{
	let parameters={}
	let publication={}
	let prestations=[]
	api.get('parameter',1).then((res1)=>{
  		parameters=res1[0]
  		api.get('publication',2).then((res2)=>{
  				publication=res2[0]
  		})
  		api.select('prestation').then((res3)=>{
  			prestations=res3;
  			res.render('prestations',{
  				title:publication['title'],
  				description:publication['description'],
  				keywords:publication['keywords'],
  				params:parameters,
  				prestations:prestations,
  				styles:config.css_common,
  				scripts:config.scripts_common
  				})
  		})
  })

})
app.get('/prestation/:id/',(req,res)=>{
	let parameters={}
	let prestation={}
	let id=req.params.id
	api.get('prestation',id).then((res1)=>{
		api.get('parameter',1).then((res2)=>{
			parameters=res2[0];
			prestation=res1[0];
			res.render('details_prestation',{
				title:prestation.title,
				description:prestation.description,
				keywords:prestation.keywords,
				params:parameters,
				prestation:prestation,
				styles:config.css_common,
				scripts:config.scripts_common
				})
			})
		})
})
app.get('/infos/',(req,res)=>{
	let parameters={}
	let infos={}
	api.get('publication',3).then((res1)=>{
		api.get('parameter',1).then((res2)=>{
			parameters=res2[0]
			infos=res1[0]
			res.render('index',{
				title:infos.title,
				description:infos.description,
				keywords:infos.keywords,
				params:parameters,
				content:infos,
				styles:config.css_common,
				scripts:config.scripts_common
			})
		})

	})
})
app.get('/contact/',(req,res)=>{
	let parameters={}
	api.get('parameter',1).then((res1)=>{
		parameters=res1[0]
		res.render('contact',{
			title:'kifeedo|contact',
			description:'kifeedo formulaire de contact',
			keywords:'kifeedo,contact',
			contact:{lastname:'',firstname:'',subject:'',email:'',content:''},
			params:parameters,
			styles:config.css_common,
			scripts:config.scripts_common
		})
	})
})

app.post('/send/',upload,(req,res)=>{
	let parameters={}
	let contact=req.body
	console.log(contact)
	api.get('parameter',1).then((res1)=>{
		parameters=res1[0]
		let transp=nodemailer.createTransport({
								host:parameters.smtp,
								port:parameters.port,
								secure:false,
								requireTLS:true,
								auth:{
									user:parameters.login_mail,
									pass:parameters.mdp_mail
								},
								
							})
		let mailOptions={
			from:contact.email,
			to:'kifeedo@gmail.com',
			subject:contact.subject,
			html:contact.content
		}
		transp.sendMail(mailOptions, function(error, info){
  				if (error) {
    				message='envoi mail interrompu '+error.message;
  				} else {
    				message='mail envoyé: ' + info.response;
  				}
  				console.log(message)
  		})
  		res.redirect('/contact/')
		
	})
})
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

module.exports=app
