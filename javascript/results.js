$(document).ready(function () {

    var originalTags;
    var editingTags = false;
    $(".edit-tags-button").click(function () {
        if (!editingTags) {
            originalTags = $(this).prev().text();
            var inputHTML = "<input class='tag-input' type='text' value='" + originalTags + "'>"
            $(this).prev().replaceWith(inputHTML);
            $(this).text("Done");
            editingTags = true;
        } else {
            var newTags = $(".tag-input").val();

            $.post("http://localhost:4000/search", {
                originalTags: originalTags.split(","),
                newTags: newTags.split(",")
            },
            function (data, status) {
                console.log(data);
                console.log(status)
            });


            var spanHTML = "<span class='tags'>" + newTags + "</span>"
            $(".tag-input").replaceWith(spanHTML);
            $(this).text("Edit");
            editingTags = false;
        }

    });


})
