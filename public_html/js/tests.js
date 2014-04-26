var $resultTable;
var testBlocks = [["categoryTests", 3], ["userTests", 2], ["letterTests", 2], ["pageTests", 1]];

$(function() {
    $resultTable = $('#resultTable');
    for (i = 0; i < testBlocks.length; i++)
        eval(testBlocks[i][0] + '(' + i + ');');
});

addBlockTestHeader = function(text) {
    $resultTable.append('<tr><th colspan="4">' + text + '</th></tr>');
};

addTestHeader = function(text) {
    $resultTable.append('<tr><th colspan="4"><small>' + text + '</small></th></tr>');
};

addTestResult = function(real, ideal, description) {
    var passed = (real === ideal) ? '<i class="glyphicon glyphicon-ok"></i>' : '<i class="glyphicon glyphicon-remove"></i>';
    $resultTable.append('<tr><td>' + passed + '</td><td>' + real + '</td><td>' + ideal + '</td><td>' + description + '</td></tr>');
};

// first layer tests
categoryTests = function(idx) {
    addBlockTestHeader("Работа с категориями писем");

    window.localStorage.clear();
    for (j = 0; j < testBlocks[idx][1]; j++)
        eval(testBlocks[idx][0] + '_' + j + '();');
};

userTests = function(idx) {
    addBlockTestHeader("Работа с пользовательскими данными");

    window.localStorage.clear();
    for (j = 0; j < testBlocks[idx][1]; j++)
        eval(testBlocks[idx][0] + '_' + j + '();');
};

letterTests = function(idx) {
    addBlockTestHeader("Работа с письмами");
    
    window.localStorage.clear();
    for (j = 0; j < testBlocks[idx][1]; j++)
        eval(testBlocks[idx][0] + '_' + j + '();');
};

pageTests = function(idx) {
    addBlockTestHeader("Работа со страницами");
    
    window.localStorage.clear();
    for (j = 0; j < testBlocks[idx][1]; j++)
        eval(testBlocks[idx][0] + '_' + j + '();');
    
    currentLettersCount = 0;
};

//second layer tests
categoryTests_0 = function() {
    addTestHeader("Проверка получения категорий");

    window.localStorage["PC.category"] = "send";
    getCategory();
    addTestResult(currentCategory, "send", "Получение текущей категории");

    window.localStorage["PC.category"] = "inbox";
    getCategory();
    addTestResult(currentCategory, "inbox", "Получение текущей категории");

    window.localStorage["PC.category"] = "important";
    getCategory();
    addTestResult(currentCategory, "important", "Получение текущей категории");

    window.localStorage["PC.category"] = "spam";
    getCategory();
    addTestResult(currentCategory, "spam", "Получение текущей категории");

    window.localStorage.clear();
};

categoryTests_1 = function() {
    addTestHeader("Проверка задания категорий");

    setCategory("important");
    addTestResult(currentCategory, "important", "Получение текущей категории через переменную currentCategory");
    getCategory();
    addTestResult(currentCategory, "important", "Получение текущей категории через getCategory");

    window.localStorage.clear();
};

categoryTests_2 = function() {
    addTestHeader("Проверка правильности названия категорий");

    addTestResult(false, isRightCategory("indox"), "Проверка неправильной категории");
    addTestResult(false, isRightCategory(""), "Проверка неправильной категории с пустым значением");
    addTestResult(false, isRightCategory(null), "Проверка неправильной категории со значением null");
    addTestResult(true, isRightCategory("inbox"), "Проверка правильной категории");
    addTestResult(true, isRightCategory("send"), "Проверка правильной категории");
    addTestResult(true, isRightCategory("important"), "Проверка правильной категории");
    addTestResult(true, isRightCategory("spam"), "Проверка правильной категории");
};

userTests_0 = function() {
    addTestHeader("Проверка получения пользовательских данных");
    
    window.localStorage.clear();
    getUserData();
    addTestResult("", userData["email"], "Значение email неавторизованного пользователя");
    addTestResult("", userData["password"], "Значение пароля неавторизованного пользователя");
    
    window.localStorage.clear();
    setUserData('user', 'password');
    getUserData();
    addTestResult("user", userData["email"], "Значение email авторизованного пользователя");
    addTestResult("password", userData["password"], "Значение пароля авторизованного пользователя");
    
    window.localStorage.clear();
};

userTests_1 = function() {
    addTestHeader("Проверка заполненности полей пользователя");
    
    addTestResult(false, isUserDataFill("", ""), "Все поля пустые");
    addTestResult(false, isUserDataFill("", "password"), "Email пустой");
    addTestResult(false, isUserDataFill("user", ""), "Пароль пустой");
    addTestResult(true, isUserDataFill("user", "password"), "Поля заполнены");
};

letterTests_0 = function() {
    addTestHeader("Проверка числа сообщений");
    
    addTestResult(0, getLettersCount("inbox"), "Писем в пустой категории");
    addTestResult(0, getLettersCount("idbox"), "Писем в несуществующей категории");
    
    window.localStorage["PC.letters.data.inbox.1"] = '{"test": "true"}';
    addTestResult(1, getLettersCount("inbox"), "Писем в непустой категории");
};

letterTests_1 = function() {
    addTestHeader("Получение сообщения");
    addTestResult("true", getLetter("PC.letters.data.inbox.1").test, "Получение сообщения");
    window.localStorage.clear();
};

pageTests_0 = function() {
    addTestHeader("Число страниц");
    
    currentLettersCount = 0;
    lettersPerList = 5;
    addTestResult(1, getPagesCount(), "0 писем, 5 на странице");
    
    currentLettersCount = 2;
    addTestResult(1, getPagesCount(), "2 письма, 5 на странице");
    
    currentLettersCount = 5;
    addTestResult(1, getPagesCount(), "5 писем, 5 на странице");
    
    currentLettersCount = 6;
    addTestResult(2, getPagesCount(), "6 писем, 5 на странице");
    
    lettersPerList = 6;
    addTestResult(1, getPagesCount(), "6 писем, 6 на странице");
    
    lettersPerList = 10;
    addTestResult(1, getPagesCount(), "6 писем, 10 на странице");
};