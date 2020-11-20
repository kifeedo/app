const config=require('../config');
const commons=require('../commons');
const api=require('../admin/api');
/* GET users listing. */
var users={
        is_login : function(req,res,callback){
                /*! si not is login alors redirection vers page de login sinon la page s'affiche normalement */
                req.sessionStore.target_url=req.originalUrl;
                if(req.sessionStore.log){
                    callback();
                }else{
                    res.redirect("/login/");
                }
        },
        authentificate : function(req,res){
                req.sessionStore.flash=null;
                if(!req.body.target_url){
                    var target='/';
                }else{
                    var target=req.body.target_url;
                }
                api.get('author',['login','password'],[req.body.login,commons.create_sha1(req.body.password)]).then((resp,err)=>{
                   /*console.log(req.body.password)
                    console.log(commons.create_sha1(req.body.password))*/
                        if(resp.length==0 || err){
                            req.sessionStore.log=null
                            req.sessionStore.alert="danger"
                            req.sessionStore.flash="Merci de vérifiez votre pseudo ou mot de passe et réessayer."
                            res.redirect("/login/")
                        }else{
                            req.sessionStore.log=resp
                            req.sessionStore.alert="success"
                            req.sessionStore.flash="Vous êtes loggé en tant que "+resp[0]['login']
                            res.redirect(target);

                        }


                })
              

        },
        log_out : function(req,res){
            req.sessionStore.log=null;
            res.redirect("/");
        },
        chgpwd : function(req,res){
            /*! *** on verifie que les champs password et confirm ont bien été rempli ***/
            if(req.body.password && req.body.confirm){
                /*! *** on verifie que les deux champs sont identiques *** */
                if(req.body.password == req.body.confirm){
                    /*! *** on change le mot de passe dans la base */
                    
                }else{
                    message="Les champs password et confirmation ne coincident pas, le changement \
                    n'a pas été pris en compte";
                    res.json({error:true,message:message});
                }
            }else{
                    message="Erreur, les champs password et confirmation ne peuvent pas être vides"
                    res.json({error:true,message:message});
            }
        }
}
module.exports = users;
