var express   = require('express');
var cookieParser=require('cookie-parser');
var app    = express();
var fs     = require('fs');
var path   = require('path');
var config=require('./config.js');
var env = config.environment;
/*var crypto = require('crypto');	
var imagemagick=require('imagemagick');
var async=require('async');*/
/* *************************************
 * ****** FONCTIONS PRIVEES  ***********
 * ************************************/

module.exports = {
	range           : function(initial,final){
		var result=[];
		if ((final-initial)<0){var temp=final;final=initial;initial=temp};
		for(var i=initial;i<=final;i++){
			result.push(i);
		}
		return result;
	},
	datetostr       : function(value){
		try{
			 return [value.getFullYear(),("00"+(parseInt(value.getMonth())+1)).slice(-2),("00"+parseInt(value.getDate())).slice(-2)].join('-');
		}catch(err){
			console.log(err);
			return "";
		}
	},
	datefr           : function(value){
		try{
			var tab=value.split('-');
			return tab[2]+"/"+tab[1]+"/"+tab[0];
		}catch(error){
			console.log(error);
			return "01/01/1970";
		}
	},
	todate           : function(value){
		var re;
		var format;
		var error='';
		if(/-/.test(value)){
			re=/-/;
			try{
				date=value.split(re);
				format=new Date(parseInt(date[0]),parseInt(date[1])-1,parseInt(date[2]));
			}catch(error){
				error="le format de date est invalide";
			}
		}else if(/\//.test(value)){
			re=/\//;
			try{
				date=value.split(re);
				format=new Date(parseInt(date[2]),parseInt(date[1])-1,parseInt(date[0]));
			}catch(error){
				error="le format de date est invalide";
			}
		}else{
			error="le séparateur de date est invalide";
		}
		if(error == ''){
			console.log(format);
			return format;
		}else{
			console.log(error);
			return new Date();
		}
	},
	createStaticPath : function(dir,ext){
		if(dir != 'angular/mod-enabled' && ext == 'js'){
			var files=Array('filters.js','services.js','controllers.js','directives.js');
		}else{
			var files=Array();
		}
		var directory=[ext];
		if( dir != ''){	
			directory.push(dir);
		}
		var list=fs.readdirSync('public/'+directory.join('/'));
		for(var i=0; i<list.length;i++){
			if(list[i].match('^.*\.'+ext+'$') && files.indexOf(list[i])== -1 ){
				files.push(list[i]);
			}
		}
		if(files.length > 0){
			return files.map(function(file){return directory.join('/')+'/'+file;});
		}else{
			return files;
		}
	},
	contextCreate  : function(req,application){
		var sha1=crypto.createHash('sha1');
		var sha2=crypto.createHash('sha1');
		var seed = crypto.randomBytes(20);
		var csrf = sha1.update(seed).digest('hex');
		req.sessionStore.csrf_value=sha2.update(req.hostname+req.headers['user-agent']+csrf+config.SALT).digest('hex');
		var scripts_angular = this.createStaticPath('angular/mod-enabled','js');
		var scripts_common_angular=config.angular_commons.map(function(x){return "js/"+x;});
		var scripts_application = this.createStaticPath(application,'js');
		var flash=req.sessionStore.flash;
		req.sessionStore.flash="";
		(req.sessionStore.log)?log=req.sessionStore.log:log=null;
		return {
		/*! --- recupere le message flash --*/
		flash : flash,
		/*! --- recupere l'information d'espace ---*/
		espace : application,
		/*! --- recupere des donnees de log eventuelles ---*/
		log : log,
		/*! --- recupere le token csrf --*/
		/*! --- recupere le jeton google api ---*/
		google_api_key:config.GOOGLE_API_KEY,
		csrf_token : csrf,
		/*! --- cree les stylesheets --*/
		stylesheets : this.createStaticPath(application,'css'),
		/*! --- cree les scripts     --*/
		scripts: scripts_angular.concat(scripts_common_angular).concat(scripts_application)
		}
		
	},
	
	csrf_check : function(req){
		var server = req.sessionStore.csrf_value;
		var sha1 = crypto.createHash('sha1');
		var client = sha1.update(req.hostname+req.headers['user-agent']+req.body.csrf_token+config.SALT).digest('hex');
		if (server == client){
			return true;
		}else{
			return false;
		}
	},
	create_sha1:function(value){
		var sha1=crypto.createHash('sha1');
		return sha1.update(value+config.SALT).digest('hex');
	},
	fixtures_load : function(env,tag,schema,fixture){
		var Model = orm.model(tag,schema);
		for(var line=0;line < fixture.length;line++){
			var elt=new Model(fixture[line]);
			elt.save(function(err,result){
				if(err){
					console.log(err);
				}else{
					console.log(result);
				}
			});
		}//endfor
	},
	upload : function(file,upload_dir,test){
		var time=0;
		function sync(){
			try{
				if(!test){
					var __uploaded__=upload_dir+"/"+file.originalname;
				}else{
					var __uploaded__=test+"/"+file.originalname;
				}
				var f=fs.readFileSync(file.path);
				fs.appendFileSync(__uploaded__,f);
				/*if(file.mimetype == 'application/pdf'){
					var filename=file.originalname.slice(0,-4);
					imagemagick.convert([__uploaded__+'[0]','-resize','100x150','-density','200',config.UPLOADS_DIR+upload_dir+'/thumbnails/'+filename+'.png'],function(err,stdout){
							if(err){
								console.log(err);
							}
							clearInterval(pending);
						});
				}else{
					console.log(file.mimetype);
				}*/
				clearInterval(pending);
			}catch(error){
				if(time<30000){
					console.log("pending upload");
					time+=20;
				}else{
					console.log(error);
					console.log("impossible d'uploader le fichier, time out");
					clearInterval(pending);
				}
			}
		}//end of sync
		var pending=setInterval(sync,20);
	},
	imageCrop : function(fileName,src,dest,index,width,height,callback){
		imagemagick.crop({
				srcPath:src,
				dstPath:dest,
				width:width,
				height:height,
				quality:1,
				gravity:'center',
				},function(err,stdOut,stdErr){
					if(err){
						console.log(err);
						console.log('Le thumbnail na pas pu etre cree');
					}else{
						console.log('le thumbnail %s a correctement ete cree',dest);
						callback(null,{index:index,name:fileName,path:dest});
					}
				});
		},
	
	create_model : function(schemaName){
		try{
			var selectSchema=schema[schemaName+'Schema'];
			return orm.model(schemaName,selectSchema);
		}catch(err){
			console.log(err);
			return null;
		}
	},
	create_dir : function(rep){
	fs.readdir(rep,function(error,files){
				if(error){
					async.series([
						function(callback){
							fs.mkdir(rep,'766',function(error,dir){
													if(error){
														return callback(error);
													}
													if(dir){
														console.log('le repertoire '+dir+' a ete cree');
													}
													callback();
												});
						
						},
						function(callback){
							fs.mkdir(rep+'/thumbnails','766',function(error,dir){
													if(error){
														return callback(error);
													}
													if(dir){
														console.log('le repertoire '+dir+' a ete cree');
													}
													callback();
												});
						}
					],function(err){
						if(err){
							return false;
							console.log(err);
						}else{
							return true;
							console.log('les deux repertoires ont été créés correctement');
						}
					});
				}
	});// end readdir
	},// end create dir
	delete_dir : function(path){
		var deleteFolderRecursive = function(path){
			if( fs.existsSync(path) ) {
				fs.readdirSync(path).forEach(function(file,index){
												var curPath = path + "/" + file;
												if(fs.lstatSync(curPath).isDirectory()) { // recurse
													deleteFolderRecursive(curPath);
												} else { // delete file
													fs.unlinkSync(curPath);
												}
											});
											fs.rmdirSync(path);
			}
		};
		deleteFolderRecursive(path);
	}

}//fin module exports
