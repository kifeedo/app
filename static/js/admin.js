$(function(){
	$(".delfile").on('click',(event)=>{
		event.PreventDefault;
		event.StopPropagation;
		let field=$(event.target).attr('data-field')
		let id=$("#id").val()
		let params={'id':id,
					'schema':$("#schema").val(),
					'field':field,
					'file':$("#span"+field).html()
					}
		$.post('/admin/delfile/',params,(response,err)=>{
			console.log(response)
			$("#span"+field).empty();
			$("#td-"+field+"-"+id).empty();
		})
	})

	$("#chgpwd").on('click',(event)=>{
			event.PreventDefault;
			event.StopPropagation;
			$("#div-password-change").toggleClass("hide");
	})

	$("#spwd").on('click',(event)=>{
			event.PreventDefault;
			event.StopPropagation;
			let password=$("#mpassword").val();
			let confirm=$("#mconfirm").val();
			$.post('/admin/chgpwd/',{'password':password,'confirm':confirm},(response)=>{
				
				if(response.message == 'not match'){
					$("#div-password-message").addClass('alert-danger').empty().html("Les mots de passe ne correspondent pas");
					$("#password").val(response.value);
				}else{
					$("#div-password-message").addClass('alert-success').empty().html("mot de passe modifié avec succès, validez l'utilisateur.")
					$("#div-password-change").toggleClass("hide");
					$("#password").val(response.value);
				}
			})
	})

	$("#check").on('click',(event)=>{
		let ids=$("idslot").val();
	})

	
	/*! Calendrier mettre a jour le calendrier en recuperant les donnees
 * depuis le serveur et en ajoutant les marqueurs appropries */
/*! Calendrier decalage de la premiere cellule du tableau */

function recupere_mois_annee(){
    var mois=parseInt($("#select_mois_0").val())+1;
    var annee=$("#texte_annee_0").val();
    return annee+"/"+mois;
};
function decalage(){
    var td_list=$("#fond_calendrier_0 td");
    var i=1;//Ne prend pas en compte la case numero de semaine
    var find=false;
    while (i<8 && find==false){
        if (parseInt(td_list[i].innerHTML)==1){
            find=true;
        }else{
            i+=1;
        }
    }
    return parseInt(td_list[i].id.substring(7,td_list[i].id.length)-1);
};
 function maj_calendrier(){
     var urlaction="/blog/calendar/"+recupere_mois_annee();
     $.ajax({
        url:urlaction,
        //data:parametres,
        dataType:'json',
        success:function(datas){
            for (var i=0;i<datas.length;i++){
                /*! on prend chaque element du tableau, on parse le jour auquel
                 * on ajoute le decalage pour avoir la position de la case correspondante
                 * dans le calendrier */
                 var jour=parseInt(datas[i].day);
                 $("#case_0_"+(jour+decalage()))[0].className="mark_case_0";
            }//fin for
        }//fin success
    }); //fin ajax

 };

/*! evenements correspondants */

/*! elements maj commandant une mise a jour du calendrier*/
var tab_elements_click=['#bouton_moins_mois_0','#bouton_plus_mois_0','#bouton_moins_annee_0','#bouton_plus_annee_0'];
var tab_elements_change=['#select_mois_0','#texte_annee_0'];
/*! liaison des evenements */
for (var i=0; i<tab_elements_change.length;i++){
    $(document).on('change',tab_elements_change[i],function(){
        maj_calendrier();
    });
}
for (var i=0; i<tab_elements_click.length;i++){
    $(document).on('click',tab_elements_click[i],function(){
        maj_calendrier();
    });
}

maj_calendrier();

});
