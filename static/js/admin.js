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
		let ids=$("idslot").val()
		if(event.target.val())
	})
	

});
