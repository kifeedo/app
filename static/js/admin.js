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
		console.log($("#span"+field).val())
		$.post('/admin/delfile/',params,(response,err)=>{
			console.log(response)
			$("#span"+field).empty();
			$("#td-"+field+"-"+id).empty();
		})
	})




});
