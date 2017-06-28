
var articleId;


$(".writeCommentBtn").on("click", function(){

	event.preventDefault();

	$("#title").empty();
	$("#comment").empty();


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
  });

});

//receive comments
$(".viewCommentBtn").on("click", function(){
	event.preventDefault();
	$("#commentsBody").empty();
	//save the artile id
	articleId = $(this).attr("data-id");

	$.get("articles/"+articleId).then(function(data){

		
		var comments = data[0].comment;
		console.log(comments);

		if(comments.length === 0){
			var commentDiv = "<h3>No comments have been left for this article yet</h3>"

			$("#commentsBody").append(commentDiv);

		}
		else{

			for(i=0; i<comments.length; i++){

				console.log(comments[i]);

				var commentDiv = '<div class="panel panel-default">';
				commentDiv+='<div class="panel-heading" id="reviewHeading">'+comments[i].title+'</div>';
				commentDiv+='<div class="panel-body" id="reviewBody">'+comments[i].body+'</div>';

				$("#commentsBody").append(commentDiv);
			};
		};	
		
	})

})

