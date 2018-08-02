$(document).ready(function () {

    $("#searchButton").click(function () {
        $.post("localhost:4000/search", {
                artistName: $("#artistSearch").val(),
                songName: $("#songSearch").val(),
                tag: $("#tagSearch").val()
            },
            function (data, status) {
                alert("Data: " + data + "\nStatus: " + status);
            });
    })

});
