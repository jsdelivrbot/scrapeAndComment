
$(".writeCommentBtn").on("click", function(){

	event.preventDefault();

	var thisId = $(this).attr("id");

	console.log(thisId);
});