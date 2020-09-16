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
                        if(err){
                            req.sessionStore.log=null
                            req.sessionStore.alert="danger"
                            req.sessionStore.flash="Merci de vérifiez votre pseudo ou mot de passe et réessayer."
                            res.redirect("/login/")
                        }else{
                            req.sessionStore.log=resp[0]
                            req.sessionStore.alert="success"
                            req.sessionStore.flash="Vous êtes loggé en tant que "+resp[0].login
                            res.redirect(target);

                        }


                })
                /** Regarde si le couple email/mot de passe correspond à un element */

                /*!*** trouve le user auquel appartient l'email   ***/
               /* model.findOne({$or:[{email:req.body.user,password:commons.create_sha1(req.body.password)},
                                    {pseudo:req.body.user,password:commons.create_sha1(req.body.password)}]})
                            .exec(function(error,result){
                                if(result){
                                    req.sessionStore.log=result;
                                    req.sessionStore.flash="Vous êtes loggé en tant que "+result.title;
                                    res.redirect(target);

                                }else{
                                    req.sessionStore.log=null;
                                    req.sessionStore.flash="Merci de vérifiez votre pseudo ou mot de passe et réessayer.";
                                    res.redirect("/login/");
                                }
                            });*/

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
                    /*commons.start_mongo();
                    var user=commons.create_model('user');
                    user.update({_id:req.body.id},{password:commons.create_sha1(req.body.password)},function(error,num){
                                                        if(!error){
                                                            console.log("le numero de ligne "+num);
                                                            message="La modification a été correctement effectuée."
                                                            res.json({error:false,message:message});
                                                        }else{
                                                            res.json({error:true,message:"Erreur lors de la sauvegarde"});
                                                        }
                                });*/
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
