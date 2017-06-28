
var articleId;


$(".writeCommentBtn").on("click", function(){

	$("#title").empty();
	$("#comment").empty();

	event.preventDefault();

	articleId = $(this).attr("id");

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

