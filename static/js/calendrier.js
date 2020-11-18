function domObject(node){
	this.node=node;
	return this;
}
domObject.prototype={
					applyStyle:function(style_Node){
									if (!style_Node) return;
									var cible=this.node;
									for(var s in style_Node){
										if (typeof(s)==="Node" || style_Node[s]===null || s==="undefined") return;
										cible.style[s]=style_Node[s].toString();
									}
								},
					parseStringAttr:function(chaine){
										if (chaine === null || typeof(chaine)!='string') return false;
										var chaine_to_tab=chaine.split(" ");
										var tableau_attributs=[];
										for (var i=0;i<chaine_to_tab.length;i++){
											var att_to_tab=chaine_to_tab[i].split("=");
											tableau_attributs.push({attribut:att_to_tab[0],valeur:att_to_tab[1]});
										}
										return tableau_attributs;
									},
						createNode:function(chaine_attributs,node,valeur_node){
										if(typeof(node)!=='string') return false;
										var dom_type=document.createElement(node);
										var tab_attributs=this.parseStringAttr(chaine_attributs);
										if (tab_attributs != false){
											for (var j=0;j<tab_attributs.length;j++){
												if (tab_attributs[j].attribut !="" && tab_attributs[j].valeur!=""){
													dom_type.setAttribute(tab_attributs[j].attribut,tab_attributs[j].valeur);
												}
											}
										}
										var dom_type_texte=document.createTextNode(valeur_node);
										if (valeur_node!=""){
											dom_type.appendChild(dom_type_texte);
										}
										return dom_type;
									},
							addNode:function(chaine_attributs,node,valeur_node){
										function __addNode(domObj,objet,chaine_attributs,node,valeur_node){
											var dom_type=domObj.createNode(chaine_attributs,node,valeur_node);
											dom_type=objet.appendChild(dom_type);
											return new domObject(dom_type);
										}//fin fonction interne
										if(!this.node && typeof(this.node)!=="Node") return false;
										if (this.node.length > 1 && this.node.nodeName != "SELECT"){
											for (var i=0;i < this.node.length;i++){
												var tab_retour=[];     
												tab_retour.push(__addNode(this,this.node[i],chaine_attributs,node,valeur_node));
											}
											return tab_retour[0];
										}else{
											return __addNode(this,this.node,chaine_attributs,node,valeur_node);
										}
									},
							moveNode:function(elem){
										if (this.node.length && this.node.length==1){
											var dom_type_parent=this.node[0];
										}else{
											var dom_type_parent=this.node;
										}
										if (elem.length && elem.length==1){
											var dom_type=elem[0];
										}else{
											var dom_type=elem;
										}
										this.node=dom_type_parent.appendChild(dom_type);
										return this;
										},
						insertNode:function(chaine_attributs,node,valeur_node){
										function __insertNode(domObj,objet,chaine_attributs,node,valeur_node){
											var dom_type_parent=objet.parentNode;
											if (arguments.length==2 && typeof(chaine_attributs)=="Node"){
												return dom_type_parent.replaceChild(chaine_attributs,objet);
											}else if (arguments.length==4){
												var dom_type=document.createNode(chaine_attributs,node,valeur_node);
												return dom_type_parent.insertBefore(dom_type,objet);
											}else{throw new Error("Le nombre d'arguments est invalide pour le noeud a inserer");}
										}//fin fonction interne
										if(!this.node[0] && typeof(this.node)!=="Object")return false;
										if (this.node.length>1) throw new Error("Il y a plus d'un objet de selectionne sur l insertion");
										if (this.node.length){
											var objet=this.node[0];
										}else{
											var objet=this.node;
										}
										this.node=__insertNode(this,objet,chaine_attributs,node,valeur_node);
										return this;
										},
						delNode:function(){
									function __delNode(objet){
										var dom_type_parent=objet.parentNode;
										dom_type_parent.removeChild(objet);
									}//fin fonction interne
									if(!this.node[0] && typeof(this.node)!=="Node") return false;
									if (this.node.length){
										for (var i=0;i<this.node.length;i++){
											__delNode(this.node[i]);
										}
									}else{
										__delNode(this.node);
									}
								},
					
			remplaceNode:function(chaine_attributs,node,valeur_node){
									function __remplaceNode(objet,chaine_attributs,node,valeur_node){
										var dom_type_parent=objet.parentNode;
										if (arguments.length==2 && typeof(chaine_attributs)=="Node"){
											dom_type_parent.replaceChild(chaine_attributs,objet);
										}else if (arguments.length==4){
											var dom_type=objet.createNode(chaine_attributs,node,valeur_node);
											dom_type_parent.replaceChild(dom_type,objet);
										}else{
											throw new Error("Le nombre d'arguments est invalide pour le noeud a remplacer");
										}
										return dom_type;
									}//fin fonction interne
									if (this.node.length>1) throw new Error("Il y a plus d'un objet de selectionne sur le remplacement");
									if(!this.node[0] && typeof(this.node) !=="Node")return false;
									if (this.node.length){
										var obj=this.node[0];
									}else{
										var obj=this.node;
									}
									this.node=__remplaceNode(obj,chaine_attributs,node,valeur_node);
									return this;
								},
				wrappNode:function(prefix){
									if (!prefix) prefix='wrapper';
									var div_wrapped=this.insertNode("id="+prefix+"_"+this.node.id+" class="+prefix+"_"+this.node.className,'div','');
									if (this.node.style){	
										div_wrapped.applyStyle(this.node.style);
									}
									if (div_wrapped.style.minHeight) div_wrapped.style.minHeight=this.node.offsetHeight+'px';
									if (div_wrapped.style.minWidth) div_wrapped.style.minWidth=this.node.offsetWidth+'px';
									div_wrapped.style.position='absolute';
									div_wrapped.style.border='none';
									div_wrapped.moveNode(this.node);
									this.node=div_wrapped;
									return this;
								}
							};/*!fin prototype */



function calendrier(cible,fonction,cible_calend,theme){
	var now=new Date();
	this.ANNEE_DEPART=1900;
	this.id=-1;
	this.determine_id("calendrier");
	if (theme == ""){
		this.theme="nul";
	}else{
		this.theme=theme;
	}
	this.cible=document.getElementById(cible);
	this.cible_calend=cible_calend;
	this.tableau_jour=new Array("lun","mar","mer","jeu","ven","sam","dim");
	this.tableau_mois=new Array(new t_mois("Jan",31),new t_mois("Fév",28),new t_mois("Mars",31),new t_mois("Avril",30),new t_mois("Mai",31),new t_mois("Juin",30),new t_mois("Juil",31),new t_mois("Août",31),new t_mois("Sept",30),new t_mois("Oct",31),new t_mois("Nov",30),new t_mois("Déc",31));
	this.tableau_jours_affiche=new Array();
	this.mois_en_cours=now.getMonth();
	this.annee_en_cours=now.getFullYear();
	this.fonction=fonction;
	this.is_annee_biss=this.is_annee_bissextile(this.annee_en_cours);
	this.jours_ecoules_annee_en_cours=0;
	this.nb_jours_total=0;
	this.decalage_jour_mois=0;
	this.tableau_date=new Array();
	eval("this.render_"+this.id+"=new class_affichage(this);");
	eval("this.render_"+this.id+".dessin_calendrier();");
	this.construct_calendrier(this.mois_en_cours,this.annee_en_cours);
	this.commandes=new class_commandes(this,"action","fr");
}
calendrier.prototype = {

construct_calendrier : function(mois_cherche,annee_cherchee){
	var annee_dif_moins=false;
	var annee_dif_plus=false;
	var index_mois_moins;
	var index_mois_plus;
 
/*------annee bissextile---*/ 
	if (this.is_annee_bissextile(annee_cherchee)==true){
		this.tableau_mois[1].nb_jours_mois=29;
	}else{this.tableau_mois[1].nb_jours_mois=28;}
 
/*-----Traite le cas ou mois-1=-1 ou mois+1>12--*/
	if (mois_cherche==0){
		index_mois_moins=11;
		annee_dif_moins=true;
	}else{
		index_mois_moins=mois_cherche-1;
	}
   if (mois_cherche==11){
		index_mois_plus=0;
		annee_dif_plus=true;
	}else{
		index_mois_plus=mois_cherche+1;
	} 
	this.nb_jours_total=this.calcul_nb_jours_dep_1900(annee_cherchee,mois_cherche,1);
	this.decalage_jour_mois=this.dec_jour_du_mois(this.nb_jours_total);
	this.tableau_date=this.create_tableau_date_mois(index_mois_moins,index_mois_plus,annee_dif_moins,annee_dif_plus);
/*--affichage du rendu --*/
	eval("this.render_"+this.id+".affichage_date_mois(this.id,this.tableau_date,this.jours_ecoules_annee_en_cours);");
},
determine_id : function(valeur){
	var elements_calendrier=getByClassName("div",valeur);
	this.id=elements_calendrier.length;
},
calcul_num_semaine:function(jour,mois,annee){
/*** calcul du jeudi de la meme semaine**/
	var nb_total_jeudi=this.calcul_nb_jours_dep_1900(annee,mois,jour);
	var nb_total_4_janvier=this.calcul_nb_jours_dep_1900(annee,0,4);
	var position_4_janvier=this.dec_jour_du_mois(nb_total_4_janvier);
	var nb_jour_premier_lundi_et_4_janvier=nb_total_4_janvier-position_4_janvier;
	var difference_jours=(nb_total_jeudi-nb_jour_premier_lundi_et_4_janvier);
	var num_semaine=Math.ceil(difference_jours/7);
	return num_semaine;
},
calcul_numero_de_jour_de_lannee : function(jour,mois,annee){
	var jours=0;
	for (var i=0;i<mois;i++){  
       jours=jours+this.tableau_mois[i].nb_jours_mois;
	}
	return jours=jours+jour-1;
},

calcul_nb_jours_dep_1900 : function(annee,mois,journee){
	var nb_jours;
/*-------------calcul jusqu'au 1 janvier de l'annee en cours---*/
	if (this.is_annee_bissextile(annee)==false){
		var nb_annee_biss=Math.floor((annee-this.ANNEE_DEPART)/4)+1;
	}else{
		var nb_annee_biss=Math.floor((annee-this.ANNEE_DEPART)/4);
	}
	nb_jours=365*(annee-this.ANNEE_DEPART)+nb_annee_biss-1;
	
/*-----------calcul jusqu'au mois en cours---------------*/
	var jours=this.calcul_numero_de_jour_de_lannee(journee,mois,annee);
	nb_jours=nb_jours+jours;
	return nb_jours;
},

is_annee_bissextile : function(annee){
	if (annee%4==0 && annee%100!=0){
		return true;
	}else if (annee%400==0){
		return true;
	}else if (annee%100==0){
		return false;
	}else{
		return false;
	}  
},
dec_jour_du_mois : function(nb_jours_total){
   var jour=Math.round(((nb_jours_total/7)-(Math.floor(nb_jours_total/7)))*7);
 return jour;
 },
 create_tableau_date_mois : function(index_mois_moins,index_mois_plus,annee_dif_moins,annee_dif_plus){
	var tableau_date=Array();
	var i=0;
	var depart_mois_en_cours;
	var nb_jours_mois_moins_un=this.decalage_jour_mois;
	do{
		for(var j=(this.tableau_mois[index_mois_moins].nb_jours_mois-nb_jours_mois_moins_un+1);j<this.tableau_mois[index_mois_moins].nb_jours_mois+1;j++){
			if (annee_dif_moins==true){
				var annee=this.annee_en_cours-1;
			}else{
				var annee=this.annee_en_cours;
			}
			tableau_date[i]=new t_dates(j,index_mois_moins,annee,true);
			i=i+1;
		}//fin for
		for (j=1;j<this.tableau_mois[this.mois_en_cours].nb_jours_mois+1;j++){
			tableau_date[i]=new t_dates(j,this.mois_en_cours,this.annee_en_cours,false);
			i=i+1;
		}
		for (j=1;j<(43-this.tableau_mois[this.mois_en_cours].nb_jours_mois-this.decalage_jour_mois);j++){
			if (annee_dif_plus==true){
				annee=this.annee_en_cours+1;
			}else{
				annee=this.annee_en_cours;
			}
			tableau_date[i]=new t_dates(j,index_mois_plus,annee,true);
			i=i+1;
		}//fin for
	}while(i<42);//fwhile
	return tableau_date;
}//fmethode
};//fin classe calendrier

/******************************************class_affichage retournant le rendu du calendrier********************************************/
function class_affichage(object){
	this.parent=object;
}
class_affichage.prototype={

maj_fleche_mois:function(mois){
	var e_select_mois=document.getElementById("select_mois_"+this.parent.id);
	var e_texte_annee=document.getElementById("texte_annee_"+this.parent.id);
	var mois_temp=this.parent.mois_en_cours+mois;
	if (mois_temp==12){
		//this.object_parent.mois_en_cours=0;
		this.parent.mois_en_cours=0;
		this.parent.annee_en_cours+=1;
	}else if(mois_temp<0){
		this.parent.mois_en_cours=11;
		this.parent.annee_en_cours-=1;
	}else{
		this.parent.mois_en_cours=mois_temp;
	}
	e_select_mois.selectedIndex=this.parent.mois_en_cours;
	e_texte_annee.value=this.parent.annee_en_cours;
	this.maj_mois();
},
maj_fleche_annee:function(annee){
	var e_texte_annee=document.getElementById("texte_annee_"+this.parent.id);
	this.parent.annee_en_cours=annee+this.parent.annee_en_cours;
	e_texte_annee.value=this.parent.annee_en_cours;
	this.maj_annee();
},

maj_mois:function(){
	var e_select_mois=document.getElementById("select_mois_"+this.parent.id);
	var e_texte_annee=document.getElementById("texte_annee_"+this.parent.id);
	this.parent.mois_en_cours=parseInt(e_select_mois.options[e_select_mois.selectedIndex].value);
	this.parent.annee_en_cours=parseInt(e_texte_annee.value);
	this.parent.construct_calendrier(this.parent.mois_en_cours,this.parent.annee_en_cours);
},

maj_annee:function(){
	var e_select_mois=document.getElementById("select_mois_"+this.parent.id);
	var e_texte_annee=document.getElementById("texte_annee_"+this.parent.id);
	this.parent.mois_en_cours=parseInt(e_select_mois.options[e_select_mois.selectedIndex].value);
	var annee=parseInt(e_texte_annee.value);
	if (annee<1900){
		alert("la date n'est pas valable, elle est inférieure à 1900 !");
		this.parent.annee_en_cours=1900;
		e_texte_annee.value=1900;
	}else{
		this.parent.annee_en_cours=annee;
	}
	this.parent.construct_calendrier(this.parent.mois_en_cours,this.parent.annee_en_cours);
},

affichage_bandeau:function(mois,annee){
	var e_doc_select_mois=document.getElementById("select_mois_"+this.parent.id);
	e_doc_select_mois.selectedIndex=mois;
	var e_doc_text_annee=document.getElementById("texte_annee_"+this.parent.id);
	e_doc_text_annee.value=annee;
},
affichage_semaines:function(id,jours_ecoules){
/*----calcul du decalage du premier janvier--*//*-----Traite le cas ou mois-1=-1 ou mois+1>12--*/
	var case_semaine=getByClassName("td","case_semaine_"+id);
	for (i=0;i<case_semaine.length;i++){
		case_semaine[i].innerHTML=this.parent.calcul_num_semaine(this.parent.tableau_date[(i*7)+3].jour,this.parent.tableau_date[(i*7)+3].mois,this.parent.tableau_date[(i*7)+3].annee);
	}
},

affichage_date_mois:function(id_calend,tableau,jours_ecoules){
	for (var i=0;i<42;i++){
 var we=false;
  if (((i-5)%7==0)||((i-6)%7==0)){
   we=true;
  }
 var case_temp=document.getElementById("case_"+id_calend+"_"+(i+1));
 case_temp.innerHTML=tableau[i].jour;
  if(tableau[i].pas_dans_mois==true && we==true){
    case_temp.className="casewe_"+id_calend+"_autre";
  }else if (tableau[i].pas_dans_mois==true && we==false){
    case_temp.className="case_"+id_calend+"_autre";
  }else{
  if (we==true){
     case_temp.className="casewe_"+id_calend;
   }else{case_temp.className="case_"+id_calend;}
  }
}   
this.affichage_bandeau(this.parent.mois_en_cours,this.parent.annee_en_cours);
this.affichage_semaines(id_calend,jours_ecoules);
},

dessin_calendrier:function(){

/*--dessin contour calendrier--*/
  var table_calendrier=new domObject(this.parent.cible);
  var dom_calendrier=table_calendrier.addNode('id=calendrier'+this.parent.id+' class=calendrier','div',"");
  /*--dessin bouton fermer--*/
   if (this.parent.bool_fermer=="true"){
	var bouton_fermer=dom_calendrier.addNode('id=calend_close_'+this.parent.theme+' class=calend_close href=javascript:void(0)','a','');
	bouton_fermer.addNode('id=img_close src=/static/images/bouton_close.png alt=bouton_close',"img","");
	}
/*--dessin cadre entete calendrier--*/
  var dom_entete=dom_calendrier.addNode('id=entete_'+this.parent.id+' class=entete',"div","");                                     
/*--dessin bouton moins-mois-*/
  dom_entete.addNode("id=bouton_moins_mois_"+this.parent.id+" class=bouton_moins type=button onclick=javascript:calendrier_"+this.parent.id+".render_"+this.parent.id+".maj_fleche_mois(-1); value=<","input","");
/*--dessin zone select mois--*/
  var dom_select=dom_entete.addNode("id=select_mois_"+this.parent.id+" class=select_mois onchange=javascript:calendrier_"+this.parent.id+".render_"+this.parent.id+".maj_mois();","select","");
  var tab_mois_temp=this.parent.tableau_mois; 
 
   for(var j=0;j<12;j++){
	  dom_select.addNode("value="+j,"option",tab_mois_temp[j].nom);
	   }
 /*--dessin bouton plus mois--*/
 dom_entete.addNode("id=bouton_plus_mois_"+this.parent.id+" class=bouton_plus type=button onclick=javascript:calendrier_"+this.parent.id+".render_"+this.parent.id+".maj_fleche_mois(1); value=>","input","");
  /*--dessin bouton moins-annee-*/
  dom_entete.addNode("id=bouton_moins_annee_"+this.parent.id+" class=bouton_moins type=button onclick=javascript:calendrier_"+this.parent.id+".render_"+this.parent.id+".maj_fleche_annee(-1); value=<","input","");   
 /*--dessin zone texte annee--*/
  dom_entete.addNode("id=texte_annee_"+this.parent.id+" class=texte_annee type=text value='' onchange=javascript:calendrier_"+this.parent.id+".render_"+this.parent.id+".maj_annee();","input","");
 /*--dessin bouton plus annee--*/
  dom_entete.addNode("id=bouton_plus_annee_"+this.parent.id+" class=bouton_plus type=button value=> onclick=javascript:calendrier_"+this.parent.id+".render_"+this.parent.id+".maj_fleche_annee(1);","input",""); 
  /*--dessin table--*/
  var dom_table=dom_calendrier.addNode("id=fond_calendrier_"+this.parent.id+" class=fond_calendrier","table","");
  var dom_tr_titres=dom_table.addNode("id=cols_tit_"+this.parent.id,"tr","");
  /* contenu lignes de titre*/
  for (i=0;i<8;i++){
    if (i==0){
      dom_tr_titres.addNode("class=tits_"+this.parent.id,"th","");
    }else{
      dom_tr_titres.addNode("class=tits_"+this.parent.id,"th",this.parent.tableau_jour[i-1]);
    } 
   }
   /* contenu des cases */
   for (i=0;i<6;i++){
   var dom_tr=dom_table.addNode("id=ligne_"+this.parent.id+"_"+i,"tr","");
     for (var j=0;j<8;j++){
       if (j==0){    
         dom_tr.addNode("id=case_semaine_"+(i+1)+" class=case_semaine_"+this.parent.id ,"td","");
       }else if((j==6)||(j==7)){      
         dom_tr.addNode("id=case_"+this.parent.id+"_"+((i*7)+j)+" class=casewe_"+this.parent.id+" onclick=javascript:calendrier_"+this.parent.id+".commandes.action_calendrier("+((i*7)+j)+");","td","");
       }else{     
         dom_tr.addNode("id=case_"+this.parent.id+"_"+((i*7)+j)+" class=case_"+this.parent.id+" onclick=javascript:calendrier_"+this.parent.id+".commandes.action_calendrier("+((i*7)+j)+");","td","");
       
       }//fsi
     }//fpour
   }//fpour 
  
 }//fin methode
};//fin classe affichage
/******************************************class_commandes pour gérer les actions en retour du calendrier*******************************/
/*class commandes*/
/* Les types d'actions renvoyées sont
-envoi de la valeur sur une zone input, dont les valeurs*/

function class_commandes(obj,type_action,lang){
	this.parent=obj;
	this.langage=lang;
	this.type_action=type_action;
}
class_commandes.prototype={
	
action_calendrier:function(index){
	var mois=parseInt(this.parent.tableau_date[index-1].mois)+1;
	var journee=this.parent.tableau_date[index-1].jour+"/"+mois+"/"+this.parent.tableau_date[index-1].annee;
	switch (this.parent.fonction){
		case "mise_a_jour" :
	        document.querySelector("#"+this.parent.cible_calend).value=journee;
	        calcul_age();
	        $("#calend_"+this.parent.theme).hide();
	        break;
	    default:
            break;
	}
}
};
/*********************************************** Fonctions generaliste hors objets*********************************/
/*!function bind(objet,methode){

 return function(){
  return methode.apply(objet,arguments);
 }
}
function bind_methode( o_, fct_){

  return( function(){o_[ fct_]()});

}*/



/*!--getByClassNames--*/
function getByClassName(o_element,valeur_class){
var a_Elements_Class=new Array;
var a_Elements=document.getElementsByTagName(o_element);
var j=0;
  for (i=0;i<a_Elements.length;i++){
   var nom_Class=a_Elements[i].className;
     if (nom_Class==valeur_class){
		a_Elements_Class.push(a_Elements[i]);
		j=j+1;
     }
  }
return a_Elements_Class;
}

function t_mois(nom,jours){
 this.nom=nom;
 this.nb_jours_mois=jours;
 }
 function t_dates(jour,mois,annee,pas_dans_mois){
 this.jour=jour;
 this.mois=mois;
 this.annee=annee;
 this.pas_dans_mois=pas_dans_mois;
 }
