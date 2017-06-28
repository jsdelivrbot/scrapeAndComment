
var articleId;


$(".writeCommentBtn").on("click", function(){




	event.preventDefault();

	articleId = $(this).attr("data-id");

	console.log(articleId);
});

$("#submitComment").on("click", function(){


	$.ajax({
		method: "POST",
		url: "/articles/" + articleId,
		data: {
      // Value taken from title input
      title: $("#title").val().trim(),
      // Value taken from note textarea
      body: $("#comment").val().trim()
  		}
	}).then(function(data){
		console.log(data);
		$("#title").val("");
		$("#comment").val("");
	});

});

//receive comments
$(".viewCommentBtn").on("click", function(){

	$("#commentsBody").empty();
	event.preventDefault();	
	//save the artile id
	articleId = $(this).attr("data-id");

	showComments(articleId);

});

//delete a comment 

$(document).on("click", ".deleteButton", function(event){
	

	var btnId = $(this).attr("id");
	console.log(btnId);
	//make ajax call to the btnId
	$.ajax({
		url: '/comments/'+btnId,
		type: 'DELETE',
		success: showComments(articleId)
	});



})


function showComments(articleId){

	$("#commentsBody").empty();

	//get specific article
	$.get("articles/"+articleId).then(function(data){	
		var comments = data[0].comment;
		//if there are no comments, display this message
		if(comments.length === 0){
			var commentDiv = "<h3>No comments have been left for this article yet</h3>"

			$("#commentsBody").append(commentDiv);

		}
		else{

			for(i=0; i<comments.length; i++){

				console.log(comments[i]);
				//display each comment in a panel
				

				var commentDiv = '<div class="panel panel-default">';
				commentDiv+='<div class="panel-heading" id="reviewHeading">'+comments[i].title;
				commentDiv+='<button class="btn btn-danger deleteButton" id='+comments[i]._id+'>X</button></div>';
				commentDiv+='<div class="panel-body" id="reviewBody">'+comments[i].body+'</div>';

				//place comments in the modal
				$("#commentsBody").append(commentDiv);
				
			};
		};	
		
	});
};

