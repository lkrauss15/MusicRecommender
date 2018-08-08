$(document).ready(function () {

    var originalTags;
    var editingTags = false;

    function onClickEditTags() {
        if (!editingTags) {
            debugger;
            originalTags = $(this).prev().text();
            var inputHTML = "<input class='tag-input' type='text' value='" + originalTags.split("'").join("&#39;") + "'>" +
            "<input class='id-input' placeholder='User id...' type='text'>";
            $(this).prev().replaceWith(inputHTML);
            $(this).text("Done");
            editingTags = true;
        } else {
            debugger;
            var newTags = $(".tag-input").val();
            if (newTags.trim() !== originalTags.trim()) {
                var artistID = $(this).data("artist-id");
                var userID = $(this).prev().val().trim();
                if (userID === '') {
                    userID = '1';
                }
                var newTagsSplit = newTags.split(",").map(function(item) {
                    return item.trim();
                });
                var originalTagsSplit = originalTags.split(",").map(function(item) {
                    return item.trim();
                });

                var tags = "";
                var tagsToAdd = "";
                var tagsToRemove = "";

                var tagsToAddWithID = "";
                var tagsToRemoveWithID = "";

                newTagsSplit.forEach(function (element) {
                    if (!originalTagsSplit.includes(element)) {
                        tags += "('" + element.trim().split("'").join("''") + "'),";
                        tagsToAdd += "(" +artistID + ",'" + element.trim().split("'").join("''") + "'),";
                        tagsToAddWithID += "(" +artistID + "," + userID + ",'" + element.trim().split("'").join("''") + "','" + new Date().toISOString().substring(0, 10) + "'),";
                    }
                });

                originalTagsSplit.forEach(function (element) {
                    if (!newTagsSplit.includes(element)) {
                        tagsToRemove += "(" +artistID + ",'" + element.trim().split("'").join("''") + "'),";
                        tagsToRemoveWithID += "(" +artistID + "," + userID + ",'" + element.trim().split("'").join("''") + "'),";
                    }
                });

                tags = tags.slice(0, -1);
                tagsToAdd = tagsToAdd.slice(0, -1);
                tagsToRemove = tagsToRemove.slice(0, -1);
                tagsToAddWithID = tagsToAddWithID.slice(0, -1);
                tagsToRemoveWithID = tagsToRemoveWithID.slice(0, -1);

                $.post("http://localhost:4000/tag", {
                        tags: tags,
                        tagsToAdd: tagsToAdd,
                        tagsToRemove: tagsToRemove,
                        tagsToAddWithID: tagsToAddWithID,
                        tagsToRemoveWithID: tagsToRemoveWithID
                    },
                    function (data, status) {
                        console.log(data);
                        console.log(status)
                    });
            }

            var spanHTML = "<span class='tags'>" + newTags + "</span>"
            $(this).prev().remove();
            $(".tag-input").replaceWith(spanHTML);

            $(this).text("Edit");
            editingTags = false;
        }
    }

    function artistTemplating(data) {
        var html = '';
        $.each(data, function (index, item) {
            html += item;
        });

        if (data.length == 0) {
            html += "<p>No artists found.</p>";
        }

        return html;
    }

    function getArtistData() {
        var result = [];

        $(".artist-block").each(function (index, item) {
            result.push($(item).html());
        });

        return result;
    }



    $('#artistPages').pagination({
        dataSource: function (done) {
            done(getArtistData());
        },
        callback: function (data, pagination) {
            var html = artistTemplating(data);
            $('#artistDataContainer').html(html);
            $(".edit-tags-button").click(onClickEditTags);
        }
    })


    function getSongData() {
        var result = [];

        $(".song-block").each(function (index, item) {
            result.push($(item).html());
        });

        return result;
    }

    function songTemplating(data) {
        var html = '';
        $.each(data, function (index, item) {
            html += item;
        });

        if (data.length == 0) {
            html += "<p>No songs found.</p>";
        }


        return html;
    }

    $('#songPages').pagination({
        dataSource: function (done) {
            done(getSongData());
        },
        callback: function (data, pagination) {
            var html = songTemplating(data);
            $('#songDataContainer').html(html);
        }
    })

})
