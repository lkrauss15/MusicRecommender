$(document).ready(function () {

    $("#searchButton").click(function () {
        $.post("http://localhost:4000/search", {
                artistName: $("#artistSearch").val(),
                songName: $("#songSearch").val(),
                tag: $("#tagSearch").val()
            },
            function (data, status) {
                console.log(data);
                console.log(status);
            });
    })

});
