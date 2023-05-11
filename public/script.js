$(document).ready(function () {
    loadFromServer(8);
    (function ($) {
        $.fn.createDiscussionDetailsRow = function (options) {
            const settings = $.extend({
                subject: '',
                question: '',
                responses: []
            }, options)
            let rowSpanSize = settings.responses.length+1;
            console.log(rowSpanSize)
            let $tableRow = $(`<tr>`)
            $tableRow.html(`
            <td rowSpan=${rowSpanSize}>${settings.question}</td>
            <td rowSpan=${rowSpanSize}>${settings.subject}</td>
            
    `);
            return this.append($tableRow);
        };
        $.fn.createDiscussionResponseRow = function (options) {
            const settings = $.extend({
                name: '',
                comment: '',
                upVote: '',
                downVote: ''
            }, options)
            let $tableRow = $(`<tr>`)
            $tableRow.html(`
            <td>${settings.name}</td>
            <td>${settings.comment}</td>
            <td>${settings.upVote}</td>
            <td>${settings.downVote}</td>
            `);
            return this.append($tableRow);
        };
    })(jQuery); 
});

let discussions = [];
const url = "http://localhost:3000";
const favFillSVG = '<svg fill="#000000" width="20px" height="20px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M30.943 8.494c-0.816-2.957-3.098-5.239-5.994-6.040l-0.060-0.014c-0.651-0.159-1.399-0.25-2.169-0.25-2.624 0-5 1.062-6.722 2.779l0-0c-1.558-1.505-3.682-2.433-6.023-2.433-0.77 0-1.516 0.1-2.226 0.288l0.060-0.014c-3.104 0.882-5.499 3.277-6.365 6.317l-0.016 0.065c-0.171 0.648-0.269 1.393-0.269 2.16 0 2.588 1.117 4.915 2.896 6.525l0.008 0.007 11.381 12.619c0.138 0.153 0.336 0.248 0.557 0.248s0.419-0.095 0.556-0.247l0.001-0.001 11.369-12.605c2.002-1.789 3.256-4.379 3.256-7.261 0-0.759-0.087-1.498-0.252-2.208l0.013 0.066z"></path></svg>';
const favUnfillSVG = '<svg fill="#000000" width="20px" height="20px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M30.943 8.494c-0.816-2.957-3.098-5.239-5.994-6.040l-0.060-0.014c-0.651-0.159-1.399-0.25-2.169-0.25-2.624 0-5 1.062-6.722 2.779l0-0c-1.558-1.505-3.682-2.433-6.023-2.433-0.77 0-1.516 0.1-2.226 0.288l0.060-0.014c-3.104 0.882-5.499 3.277-6.365 6.317l-0.016 0.065c-0.171 0.648-0.269 1.393-0.269 2.16 0 2.588 1.117 4.915 2.896 6.525l0.008 0.007 11.381 12.619c0.138 0.153 0.336 0.248 0.557 0.248s0.419-0.095 0.556-0.247l0.001-0.001 11.369-12.605c2.002-1.789 3.256-4.379 3.256-7.261 0-0.759-0.087-1.498-0.252-2.208l0.013 0.066zM26.85 16.851l-0.025 0.028-10.824 12.002-10.851-12.030c-1.526-1.359-2.483-3.329-2.483-5.523 0-0.621 0.077-1.224 0.221-1.8l-0.011 0.051c0.736-2.588 2.733-4.585 5.267-5.307l0.054-0.013c0.53-0.149 1.138-0.235 1.766-0.236h0.001c2.18 0.065 4.126 1.015 5.5 2.503l0.005 0.005c0.138 0.131 0.325 0.211 0.53 0.211s0.392-0.080 0.531-0.211l-0 0c1.507-1.742 3.722-2.838 6.192-2.838 0.63 0 1.244 0.071 1.833 0.206l-0.055-0.011c2.439 0.674 4.321 2.555 4.982 4.944l0.012 0.050c0.124 0.534 0.195 1.147 0.195 1.776 0 2.471-1.097 4.685-2.83 6.184l-0.010 0.009z"></path></svg>';
$('#sortBy').on({
    change: () => {
        $('#questionContainer').empty();
        loadFromServer($('#sortBy').val());
    }
});

//Retreving the Discussions from the server
function loadFromServer(sort) {
    $.ajax({
        url: url + '/data/' + sort,
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            if (response.data === '') {
                discussions = [];
            } else {
                discussions = response.data;
            }
            afterLoad();
            setTimePassedInterval();
        },
        error: function (error) {
            console.log(error);
        }
    });
}
//Getting the  user analytics from the server
function getUserAnalytics(username, callback) {
    $.ajax({
        url: url + '/analysis/' + username,
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            callback(response);
        },
        error: function (error) {
            console.log(error);
        }
    });
}
//Saving the Discussion to server
function saveToServer(discussion, callback) {
    $.ajax({
        type: "POST",
        url: url + '/data',
        data: JSON.stringify(discussion),
        contentType: "application/json",
        success: function (response) {
            callback(response);
        }

    });
}
//Saving the response to server
function saveResponse(discussionId, response, callback) {
    $.ajax({
        type: "POST",
        url: url + '/response',
        data: JSON.stringify({ id: discussionId, response: response }),
        contentType: "application/json",
        success: function (response) {
            callback(response);
        }
    });
}
//Updating the favourite to server
function updateFavourite(discussionID, isFav, callback) {
    $.ajax({
        type: "POST",
        url: url + '/fav',
        data: JSON.stringify({ id: discussionID, isFav: isFav }),
        contentType: "application/json",
        success: function (response) {
            callback(response);
        }
    });
}
//Resolving the Discussion count to server
function resolveFromServer(discussionID, callback) {
    $.ajax({
        type: "DELETE",
        url: url + '/resolve',
        data: JSON.stringify({ id: discussionID }),
        contentType: "application/json",
        success: function (response) {
            callback(response);
        }
    });
}
//Updating vote count to server
function updateVoteCount(discussionID, responseId, upVote, downVote, callback) {
    $.ajax({
        type: "POST",
        url: url + '/vote',
        data: JSON.stringify({ dId: discussionID, rId: responseId, upVote: upVote, downVote: downVote }),
        contentType: "application/json",
        success: function (response) {
            callback(response);
        }
    })
}
//Setting the time passed of a discussion
function setTimePassedInterval() {
    intervalID = setInterval(() => {
        const $timePassed = $(".timePassed");
        $.each(discussions, function (i, discussion) {
            $($timePassed[i]).html(getTimePassed(discussion));
        });
    }, 1000);
}
//Getting the time passed of a discussion
function getTimePassed(discussion) {

    let timePassed = "";
    let time = Math.floor((Date.now() - Date.parse(discussion.createdAt)) / 1000)
    if (time <= 10)
        timePassed = "few seconds ago...";
    else {
        if (time < 60)
            timePassed = time + " seconds ago...";
        else if (Math.floor(time / 60) < 60)
            timePassed = Math.floor(time / 60) + " minutes ago...";
        else if (Math.floor(time / 3600) < 24)
            timePassed = Math.floor(time / 3600) + " hours ago...  ";
        else
            timePassed = Math.floor(time / 86400) + " days ago...";
    }
    return timePassed;
}
//Restoring the responses
function reStoreResponses(discussion) {

    $.each(discussion.responses, function (index, res) {
        const $element = createResponseElement(res);
        $("#responses").append($element);
    });
}
//Clear Responses
function removeResponses() {
    const $responses = $("#responses");
    while ($responses.children().length > 1) {
        $responses.children(":nth-child(2)").remove();
    }
}
//sort the responses by upvotes
function sortResponses() {
    $.each(discussions, function (index, discussion) {
        discussion.responses.sort(function (a, b) {
            return b.upVote - a.upVote;
        });
    });
}
//load the questions
function loadQuestions() {
    $.each(discussions, function (index, dis) {
        let $element = createDiscussionElement(dis);
        $("#questionContainer").append($element);
    });
}
//load the usernames
function loadUserNames() {
    const uniqueUserNames = [];
    const seenUserNames = {};

    $.each(discussions, function (index, obj) {
        const username = $.trim(obj.username).toLowerCase();
        if (!seenUserNames[username]) {
            uniqueUserNames.push(username);
            seenUserNames[username] = true;
        }
    });
    $('#select_username').empty();
    $('#analysis').empty();
    $('#select_username').append('<option value="">-- Select Username --</option>');
    $.each(uniqueUserNames, function (index, element) {
        $('#select_username').append('<option value="' + element + '">' + element + '</option>');
    });

}
//loading the user analytics to the screen
function loadUserAnalytics(username) {
    getUserAnalytics(username, (data) => {
        $('#analysis').empty();
        if (data.data.length === 0)
            $('#analysis').html('<span>--No data Found--</span>');
        else {
            const $table = $('<table class="analysis-table"></table>');
            $table.html(`
                <thead>
                    <tr>
                        <th rowSpan=2>Subject</th>
                        <th rowSpan=2>Question</th>
                        <th colSpan=2>Responses</th>
                        <th rowSpan=2>Up Votes</th>
                        <th rowSpan=2>Down Votes</th>
                    </tr>
                    <tr>
                        <th>Name</th>
                        <th>Comment</th>
                    </tr>
                </thead>
            `);
            $('#analysis').append($table);
            $.each(data.data, function (index, element) {
                createAnAnalysisElement($table, element);
            })
        }
    });
}
//creating a discussion for left side panel
function createDiscussionElement(discussion) {

    let $discussionElement = $("<div>");
    let $usernameElement = $("<span>");
    let $subjectElement = $("<p>");
    let $questionElement = $("<p>");
    let $favouriteElement = $("<button>");
    let $timePassed = $("<label>");

    $timePassed.html(getTimePassed(discussion));
    $timePassed.addClass("timePassed");
    $discussionElement.addClass("discussionElement");
    $usernameElement.addClass("textSize3");
    $usernameElement.addClass("usernameElement");
    $subjectElement.addClass("textSize2");
    $questionElement.addClass("textSize3");

    $usernameElement.html(' ~' + discussion.username);
    $subjectElement.html(discussion.subject);
    $questionElement.html(discussion.question);
    $subjectElement.append($usernameElement);
    $discussionElement.append($subjectElement);
    $discussionElement.append($questionElement);
    $discussionElement.append($favouriteElement);
    $discussionElement.append($timePassed);
    $favouriteElement.attr("id", "favourite");
    $favouriteElement.addClass("favourite");
    $favouriteElement.html((
        discussion.isFavorite === true) ? favFillSVG : favUnfillSVG);

    $favouriteElement.on({
        click: (event) => {
            event.stopPropagation();
            updateFavourite(discussion._id, !(
                discussion.isFavorite), function (res) {

                    console.log("message:", res.message);
                    let index = $.inArray(discussion, discussions)
                    let discussionObject = discussions[index];
                    if ($favouriteElement.html() === favUnfillSVG) {
                        $favouriteElement.html(favFillSVG);

                        discussion.isFavorite = true;

                        discussions.splice(index, 1);
                        discussions.unshift(discussionObject);
                        $("#questionContainer").empty();
                        loadQuestions();
                    }
                    else if ($favouriteElement.html(favFillSVG)) {
                        $favouriteElement.html(favUnfillSVG);
                        discussion.isFavorite = false;
                        discussions.splice(index, 1);
                        discussions.push(discussionObject);
                        $("#questionContainer").empty();
                        // loadQuestions();
                        loadFromServer(8);
                    }
                });
        }
    });

    $discussionElement.on({
        click: () => {
            let $responses = $("#responses");
            let $onQuestion = $("#onQuestion");
            let $askQuestion = $("#askQuestion");
            let $sub = $("#sub");
            let $ques = $("#ques");
            let $addResponse = $('#addResponse');
            let $analytics_container = $('#analytics_container');
            

            sortResponses();
            removeResponses();
            reStoreResponses(discussion);

            $askQuestion.addClass("d-none");
            $analytics_container.addClass("d-none");
            $onQuestion.removeClass("d-none");
            $responses.removeClass("d-none");
            $addResponse.removeClass("d-none");
            $addResponse.find('input[name="d-id"]').val(discussion._id);
            $sub.html(discussion.subject);
            $ques.html(discussion.question);

        }
    });

    return $discussionElement;
}
//creating a response element 
function createResponseElement(response) {
    let $resId = $("<label>");
    let $responseElement = $("<div>");
    let $nameElement = $("<p>");
    let $responeOfName = $("<p>");
    let $upVote = $("<button>");
    let $downVote = $("<button>");
    let $upVoteCount = $("<label>");
    let $downVoteCount = $("<label>");
    let $r_submit = $('#addResponse');

    $resId.addClass("resID");
    $responseElement.addClass("response");
    $nameElement.addClass("textSize2");
    $responeOfName.addClass("textSize3");
    $upVoteCount.attr("for", "downVote");
    $downVoteCount.attr("for", "upVote");
    $upVoteCount.addClass("upVoteCount");
    $downVoteCount.addClass("downVoteCount");
    $upVote.addClass("upVote");
    $downVote.addClass("downVote");

    $resId.html(response._id);
    $nameElement.html(response.name);
    $responeOfName.html(response.comment);
    $upVoteCount.html(response.upVote);
    $downVoteCount.html(response.downVote);
    $upVote.html("like");
    $downVote.html("dislike");

    $upVote.on({
        click: () => {
            let dId = $r_submit.find('input[name="d-id"]').val();

            updateVoteCount(dId, response._id, ++response.upVote, response.downVote, function (res) {
                console.log("message:", res.message);
                let discussion = $.grep(discussions, function (dis) {
                    return dis._id === dId;
                })[0];
                $upVoteCount.html(response.upVote);
                sortResponses();
                removeResponses();
                reStoreResponses(discussion);
            });
        }
    });
    $downVote.on({
        click: () => {
            let dId = $r_submit.find('input[name="d-id"]').val();
            updateVoteCount(dId, response._id, response.upVote, ++response.downVote, function (res) {
                console.log("message:", res.message);
                $downVoteCount.html(response.downVote);
            });
        }
    });
    $responseElement.append($resId);
    $responseElement.append($nameElement);
    $responseElement.append($responeOfName);
    $responseElement.append($upVoteCount);
    $responseElement.append($upVote);
    $responseElement.append($downVoteCount);
    $responseElement.append($downVote);
    return $responseElement;

}
//creating analytic element
function createAnAnalysisElement($table, element) {
    $table.createDiscussionDetailsRow(element);
    $.each(element.responses, function (index, response) {
        $table.createDiscussionResponseRow(response);
    })
}
//after the discussion is loaded from server
function afterLoad() {

    let $q_submit = $("#askQuestion");
    let $r_submit = $("#addResponse");
    let $questionContainer = $("#questionContainer");
    let $askQuestion = $("#askQuestion");
    let $onQuestion = $("#onQuestion");
    let $responses = $("#responses");
    let $addResponse = $("#addResponse");
    let $newQues = $("#newQues");
    let $search = $("#search");
    let $resolve = $("#resolve");
    let $sortBy = $('#sortBy');
    let $analytics_container=$("#analytics_container")
    loadQuestions();
    loadUserNames();
    $q_submit.on({
        submit: function (event) {
            event.preventDefault();
            let username = $q_submit.find('input[name="username"]').val().trim();
            let subject = $q_submit.find('input[name="subject"]').val().trim();
            let question = $q_submit.find('textarea[name="question"]').val().trim();
            if (subject === "") {
                $q_submit.find('input[name="subject"]').val("");
            }

            if (question === "") {
                $q_submit.find('textarea[name="question"]').val("");
            }
            if (subject !== "" && question !== "") {
                let discussion = {
                    username: username,
                    subject: subject,
                    question: question,
                    responses: [],
                    favourite: false
                };

                saveToServer(discussion, function (res) {
                    console.log("message:", res.message);
                    let $element = createDiscussionElement(res.discussion);
                    $questionContainer.append($element);
                    discussions.push(res.discussion);
                    loadUserNames();
                    $q_submit[0].reset();
                });

            }
        }
    });
    $r_submit.on({
        submit: function (event) {
            event.preventDefault();
            let name = $r_submit.find('input[name="name"]').val().trim();
            let comment = $r_submit.find('textarea[name="comment"]').val().trim();

            if (name === "") {
                $r_submit.find('input[name="name"]').val("");
            }

            if (comment === "") {
                $r_submit.find('textarea[name="comment"]').val("");
            }


            if (name !== "" && comment !== "") {
                let dId = $r_submit.find('input[name="d-id"]').val();

                const response = {
                    name: name,
                    comment: comment,
                    upVote: 0,
                    downVote: 0
                };
                const $element = createResponseElement(response);

                saveResponse(dId, response, function (res) {
                    console.log("message:", res.message);
                    $responses.append($element);
                    let obj = $.grep(discussions, function (discussion) {
                        return discussion._id === dId;
                    })[0];
                    obj.responses.push(response);
                    $r_submit.find('input[name="name"]').val("");
                    $r_submit.find('textarea[name="comment"]').val("");
                });
            }
        }
    });
    $resolve.on({
        click: () => {
            let dId = $r_submit.find('input[name="d-id"]').val();
            console.log("DID:  ", dId);
            let index = $.inArray($.grep(discussions, function (dis) {
                return dis._id === dId;
            })[0], discussions);

            resolveFromServer(discussions[index]._id, function (res) {

                console.log("message:", res.message);
                discussions.splice(index, 1);
                $questionContainer.empty();
                loadQuestions();
                $askQuestion.removeClass("d-none");
                $onQuestion.addClass("d-none");
                $responses.addClass("d-none");
                $addResponse.addClass("d-none");


            });
        }
    });
    $newQues.on({
        click: () => {
            $askQuestion.removeClass("d-none");
            $onQuestion.addClass("d-none");
            $responses.addClass("d-none");
            $addResponse.addClass("d-none");
            $analytics_container.removeClass("d-none");
            loadUserNames();
        }
    });
    $search.on({
        keyup: () => {
            let searchValue = $search.val().trim();
            let reg = new RegExp(searchValue, "gi");
            searchValue.trim();
            $questionContainer.empty();

            $.each(discussions, function (index, dis) {
                if (reg.test(dis.question) || reg.test(dis.subject)) {
                    let $element = createDiscussionElement(dis);
                    $questionContainer.append($element);
                    $($element).children().eq(0).html(function (_, html) {
                        return html.replace(reg, "<mark>$&</mark>");
                    });

                    $($element).children().eq(1).html(function (_, html) {
                        return html.replace(reg, "<mark>$&</mark>");
                    });
                }
                else {
                    let $element = createDiscussionElement(dis);
                    $element.css("display", "none");
                    $questionContainer.append($element);
                }
            });
        }
    });
    $('#search_user').on({
        click: () => {
            if ($('#search_username').val().trim() !== '') {
                loadUserAnalytics($('#search_username').val().trim());
            }
        }
    })
    $('#select_username').on({
        change: () => {
            if ($('#select_username').val().trim() !== '') {
                loadUserAnalytics($('#select_username').val().trim());
            }
        }
    })
}

