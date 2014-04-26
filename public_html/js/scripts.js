var lettersPerList = 5;

var currentCategory;
var currentPage;
var categoryPageCount;

var currentLettersCount;
var currentLetters = new Array();

var userData = {"email": "", "password": ""};

//categories
getCategory = function() {
    if (window.localStorage.getItem("PC.category") === null) {
        window.localStorage["PC.category"] = "inbox";
    }
    currentCategory = window.localStorage["PC.category"];
};

setCategory = function(category) {
    window.localStorage["PC.category"] = category;
    currentCategory = category;
    loadLetters(category, 1);
};

isRightCategory = function(category) {
    return (category === "inbox" || category === "send" || category === "important" || category === "spam");
};

linkCategory = function(category) {
    $('#' + category + "Link").click(function() {
        setCategory(category);
    });
};

//user
getUserData = function() {
    userData["email"] = window.localStorage["PC.email"];
    userData["password"] = window.localStorage["PC.password"]; // WOW! password in LS!

    if (window.localStorage.getItem("PC.email") === null)
        userData["email"] = "";
    if (window.localStorage.getItem("PC.password") === null)
        userData["password"] = "";
};

setUserData = function(email, password) {
    window.localStorage["PC.email"] = email;
    window.localStorage["PC.password"] = password;
};

fillLoginFields = function(email, password) {
    $('#loginEmail').val(email);
    $('#loginPassword').val(password);
};

clearUserData = function() {
    window.localStorage.clear();
    window.location.reload();
};

isUserDataFill = function(email, password) {
    return (email.length !== 0 && password.length !== 0);
};

//screens
clientPageShow = function() {
    $('#loginPage').addClass("none");
    $('#detailsPage').addClass("none");
    $('#clientPage').removeClass("none");
};

detailsPageShow = function() {
    $('#loginPage').addClass("none");
    $('#detailsPage').removeClass("none");
    $('#clientPage').addClass("none");
};

loginPageWork = function() {
    $('#loginButton').click(function() {
        var email = $('#loginEmail').val();
        var password = $('#loginPassword').val();

        if (!isUserDataFill(email, password)) {
            $('#loginAlert').removeClass("none");
        } else {
            $('#loginAlert').addClass("none");
            setUserData(email, password);
            clientPageShow();
            //alert('all right');
            //TODO: refresh
        }
    });
    getUserData();
    if (isUserDataFill(userData["email"], userData["password"])) {
        clientPageShow();
    }
};

clientPageWork = function() {
    $('#logoutButton').click(function() {
        clearUserData();
    });
    $('#newLetterButton').click(function() {
        sendLetter();
    });
    linkCategory("inbox");
    linkCategory("send");
    linkCategory("important");
    linkCategory("spam");

    getCategory();
    loadLetters(currentCategory, 1);
};

detailsPageWork = function() {
    $('#detailsBackButton').click(function() {
        clientPageShow();
    });
};

updateBadges = function() {
    var inboxMessages = getLettersCount("inbox");
    var sendMessages = getLettersCount("send");
    var spamMessages = getLettersCount("spam");
    var importantMessages = getLettersCount("important");

    $('#inboxBadge').text((inboxMessages > 0) ? inboxMessages : "");
    $('#sendBadge').text((sendMessages > 0) ? sendMessages : "");
    $('#spamBadge').text((spamMessages > 0) ? spamMessages : "");
    $('#importantBadge').text((importantMessages > 0) ? importantMessages : "");
};

clearNewLetterModalFields = function() {
    $('#newLetterSender').val(null);
    $('#newLetterReciever').val(null);
    $('#newLetterTopic').val(null);
    $('#newLetterText').val(null);
};

confirmModal = function(heading, question, cancelButtonTxt, okButtonTxt, callback, data) {
    var confirmModal =
            $('<div class="modal fade">' +
                    '<div class="modal-dialog">' +
                    '<div class="modal-content">' +
                    '<div class="modal-header">' +
                    '<a class="close" data-dismiss="modal" >&times;</a>' +
                    '<h3>' + heading + '</h3>' +
                    '</div>' +
                    '<div class="modal-body">' +
                    '<p>' + question + '</p>' +
                    '</div>' +
                    '<div class="modal-footer">' +
                    '<a href="#" class="btn" data-dismiss="modal">' +
                    cancelButtonTxt +
                    '</a>' +
                    '<a href="#" id="okButton" class="btn btn-primary">' +
                    okButtonTxt +
                    '</a>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>');

    confirmModal.find('#okButton').click(function(event) {
        callback(data);
        confirmModal.modal('hide');
    });

    confirmModal.modal('show');
};

//letters
loadLetters = function(category, page) {
    if (!isRightCategory(category))
        return;
    getLettersInCategory(category);

    categoryPageCount = getPagesCount();
    currentPage = 1;
    pageLoad(page);
    updateBadges();

    var $categoryHeader = $('#categotyHeader').add($('#detailsCategory'));
    switch (category) {
        case 'inbox':
            $($categoryHeader).text("Входящие");
            break;
        case 'send':
            $($categoryHeader).text("Исходящие");
            break;
        case 'important':
            $($categoryHeader).text("Важные");
            break;
        case 'spam':
            $($categoryHeader).text("Спам");
            break;
        default:
            $($categoryHeader).text("Входящие");
            break;
    }
};

getLettersInCategory = function(category) {
    if (!isRightCategory(category))
        return;
    currentLettersCount = getLettersCount(currentCategory);

    currentLetters = new Array();
    for (var i = 0; i < localStorage.length; i++) {
        var currentKey = window.localStorage.key(i);
        if (currentKey.indexOf("PC.letters.data." + category) === 0) {
            var letterInfo = JSON.parse(window.localStorage[currentKey]);
            letterInfo["key"] = currentKey;
            currentLetters.push(letterInfo);
        }
    }
};

getLettersCount = function(category) {
    var count = 0;
    for (var i = 0; i < localStorage.length; i++) {
        var currentKey = window.localStorage.key(i);
        if (currentKey.indexOf("PC.letters.data." + category) === 0) {
            ++count;
        }
    }
    return count;
};

sendLetter = function() {
    var sender = $('#newLetterSender').val();
    var reciever = $('#newLetterReciever').val();
    var topic = $('#newLetterTopic').val();
    var text = $('#newLetterText').val();
    var category = $('#newLetterCategory').val();

    if (sender.length === 0 || reciever.length === 0 || topic.length === 0 || text.length === 0) {
        $('#newLetterModalAlert').removeClass("none");
        return;
    }
    $('#newLetterModalAlert').addClass("none");
    var letterInfo = {"sender": sender, "reciever": reciever, "topic": topic, "text": text, "date": Date.now()};
    var LSkey = category + "." + letterInfo.date;
    window.localStorage["PC.letters.data." + LSkey] = JSON.stringify(letterInfo);
    $('#newLetterModal').modal('hide');
    clearNewLetterModalFields();

    loadLetters(currentCategory, currentPage);
};

deleteLetter = function(key) {
    if (key.indexOf("PC.letters.data.") === 0) {
        window.localStorage.removeItem(key);
        loadLetters(currentCategory, currentPage);
    }
};

letterTableFunctions = function() {
    $('.letterShow').click(function() {
        var letter = getLetter($(this).data("letter"));

        $('#detailsSender').text(letter.sender);
        $('#detailsReciever').text(letter.reciever);
        $('#detailsCategory').text(letter.category);
        $('#detailsDate').text(new Date(letter.date).format("dd.mm.yyyy HH:MM"));
        $('#detailsTopic').text(letter.topic);
        $('#detailsText').text(letter.text);

        detailsPageShow();
    });

    $('.letterDelete').click(function() {
        confirmModal("Удалить сообщение", "Вы действительно хотите удалить это сообщение?", "Нет", "Да", function(data) {
            deleteLetter(data);
        }, $(this).data("letter"));
    });
};

getLetter = function(key) {
    if (key.indexOf("PC.letters.data.") === 0)
        return JSON.parse(window.localStorage[key]);
    return null;
};

//pages
getPagesCount = function() {
    if (currentLettersCount === 0)
        return 1;
    if (currentLettersCount % lettersPerList === 0)
        return Math.floor(currentLettersCount / lettersPerList);
    return Math.floor(currentLettersCount / lettersPerList) + 1;
};

paginationForm = function() {
    $('#pagination *').remove();
    if (categoryPageCount > 1) {
        for (i = 1; i <= categoryPageCount; i++) {
            $('#pagination').append('<li class="pageItem" data-page="' + i + '"><a href="#">' + i + '</a></li>');
        }
        $('.pageItem[data-page=' + currentPage + ']').addClass("disabled");
        $('.pageItem').click(function() {
            pageLoad($(this).data("page"));
        });
    }
};

pageLoad = function(page) {
    if (page > categoryPageCount)
        psge = 1;
    currentPage = page;
    paginationForm();

    if (currentLettersCount === 0) {
        $('#lettersNotFound').removeClass("none");
        $('#lettersContainer').addClass("none");
    } else {
        $('#lettersNotFound').addClass("none");
        $('#lettersContainer').removeClass("none");

        $("#lettersTable *").remove();
        $("#letterModals *").remove();
        $("#lettersTable").append("<tr><th>Заголовок</th><th>Отправитель</th><th>Получатель</th><th>Дата</th><th>&nbsp</th></tr>");
        for (i = (page - 1) * lettersPerList; i < page * lettersPerList; i++) {
            if (i < currentLetters.length) {
                var letter = currentLetters[i];
                $("#lettersTable").append('<tr><td>' +
                        letter.topic + '</td><td>' +
                        letter.sender + '</td><td>' +
                        letter.reciever + '</td><td>' +
                        new Date(letter.date).format("dd.mm.yyyy HH:MM") + '</td><td>' +
                        '<a href="#" class="btn btn-sm btn-warning letterShow" data-letter="' + letter.key + '"><i class="glyphicon glyphicon-envelope"></i></a>&nbsp;' +
                        '<a href="#" class="btn btn-sm btn-danger letterDelete" data-letter="' + letter.key + '"><i class="glyphicon glyphicon-trash"></i></a></td></tr>');
            }
        }
        letterTableFunctions();
    }
};

//main
mainFunction = function() {
    userData["email"] = "";
    userData["password"] = "";
    loginPageWork();
    clientPageWork();
    detailsPageWork();
};