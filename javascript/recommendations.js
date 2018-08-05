$(document).ready(function () {

    var originalTags;
    var editingTags = false;
    var hidden = true;

    $("#showRec").click(function () {
        $("#hiddenRecs").slideToggle(300);
        if (!hidden) {
            $("#showRec").text("Show recommended artists \u25B6");
            hidden = true;
        } else {
            $("#showRec").text("Show recommended artists \u25BC");
            $("#hiddenRecs").css("display", "flex");
            hidden = false;
        }
    });

    function onClickEditTags() {
        if (!editingTags) {
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

                var tagsToAdd = "";
                var tagsToRemove = "";

                var tagsToAddWithID = "";
                var tagsToRemoveWithID = "";

                newTagsSplit.forEach(function (element) {
                    if (!originalTagsSplit.includes(element)) {
                        tagsToAdd += "(" + artistID + ",'" + element.trim().split("'").join("''") + "'),";
                        tagsToAddWithID += "(" + artistID + "," + userID + ",'" + element.trim().split("'").join("''") + "','" + new Date().toISOString().substring(0, 10) + "'),";
                    }
                });

                originalTagsSplit.forEach(function (element) {
                    if (!newTagsSplit.includes(element)) {
                        tagsToRemove += "(" + artistID + ",'" + element.trim().split("'").join("''") + "'),";
                        tagsToRemoveWithID += "(" + artistID + "," + userID + ",'" + element.trim().split("'").join("''") + "'),";
                    }
                });

                tagsToAdd = tagsToAdd.slice(0, -1);
                tagsToRemove = tagsToRemove.slice(0, -1);
                tagsToAddWithID = tagsToAddWithID.slice(0, -1);
                tagsToRemoveWithID = tagsToRemoveWithID.slice(0, -1);

                $.post("http://localhost:4000/tag", {
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


    /* Artist Generation */

    function artistTemplating(data) {
        var html = '';
        $.each(data, function (index, item) {
            html += item;
        });
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
            // template method of yourself
            var html = artistTemplating(data);
            $('#artistDataContainer').html(html);
            //$(".edit-tags-button").click(onClickEditTags);
        }
    })

    /* Tag Generation */

    function getTagData() {
        var result = [];

        $(".tag-block").each(function (index, item) {
            result.push($(item).html());
        });

        return result;
    }

    function tagTemplating(data) {
        var html = '';
        $.each(data, function (index, item) {
            html += item;
        });
        return html;
    }

    $('#tagPages').pagination({
        dataSource: function (done) {
            done(getTagData());
        },
        callback: function (data, pagination) {
            // template method of yourself
            var html = tagTemplating(data);
            $('#tagDataContainer').html(html);
        }
    })

    /* Friend Generation */

    function getFriendData() {
        var result = [];

        $(".friend-block").each(function (index, item) {
            result.push($(item).html());
        });

        return result;
    }

    function friendTemplating(data) {
        var html = '';
        $.each(data, function (index, item) {
            html += item;
        });
        return html;
    }

    $('#friendPages').pagination({
        dataSource: function (done) {
            done(getFriendData());
        },
        callback: function (data, pagination) {
            // template method of yourself
            var html = friendTemplating(data);
            $('#friendDataContainer').html(html);

            $(".friend-result").click(function () {
                $.post("http://localhost:4000/userid", {
                        userId: $(this).data("friend-id"),
                    },
                    function (data, status) {
                        $("body").html(data);
                        console.log(data);
                        console.log(status)
                    });
            });
        }
    })

    /* Recommendation Generation */

    function artistRecTemplating(data) {
        var html = '';
        $.each(data, function (index, item) {
            html += item;
        });
        return html;
    }

    function getArtistRecData() {
        var result = [];

        $(".artist-rec-block").each(function (index, item) {
            result.push($(item).html());
        });

        return result;
    }

    $('#artistRecPages').pagination({
        dataSource: function (done) {
            done(getArtistRecData());
        },
        callback: function (data, pagination) {
            // template method of yourself
            var html = artistRecTemplating(data);
            $('#artistRecDataContainer').html(html);
            $(".edit-tags-button").click(onClickEditTags);
        }
    })


})
