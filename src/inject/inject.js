function doubleBot() {
    $(".navbar-brand").text("Bot is waiting...");
    setTimeout(doubleBotChecker, 5);
}

function doubleBotChecker() {
    if ($("#banner").text().includes("Rolling"))
        doubleBotRunner();
    else
        doubleBot();
}

function doubleBotRunner() {
    var currentStreak = 0;
    var black = false;
    var baseBet = 50;
    var streakThreshold = 5;
    var loseMultiplier = 2;
    var currentBet = baseBet;
    var balance = parseInt($("#balance").text());
    $(".navbar-brand").text("Bot Enabled");
    var checker = setInterval(checkComplete, 1);

    function checkComplete() {
        var x = $("#banner").text();
        if (x.includes("rolled")) {
            clearInterval(checker);
            setTimeout(bet, 10000);
        }
    }

    function updateBalance() {
        balance = parseInt($("#balance").text());
        return balance;
    }
    runCurrentBet();
    var bet = function () {
        if (parseInt($("#balance").text()) > balance) {
            console.log("You won!: " + parseInt($("#balance").text()) + " | " + balance);
            currentBet = baseBet;
            currentStreak++;
            if (currentStreak >= streakThreshold) {
                black = !black;
                currentStreak = 0;
            }
        } else {
            console.log("You lost: " + parseInt($("#balance").text()) + " | " + balance);
            currentBet *= loseMultiplier;
        }
        balance = parseInt($("#balance").text());
        checker = setTimeout(checkComplete, 1);
        if (currentBet > updateBalance())
            currentBet = baseBet;
        runCurrentBet();
    }

    function runCurrentBet() {
        $("#betAmount").val(currentBet);
        $(black ? ".btn-inverse.betButton" : ".btn-danger.betButton").click();
    }
}


// Hotpatch Firefox.
if (typeof (String.prototype.includes) === "undefined") {
    String.prototype.includes = String.prototype.contains;
}

chrome.extension.sendMessage({}, function (response) {
	var readyStateCheckInterval = setInterval(function () {
		if (document.readyState === "complete") {
			clearInterval(readyStateCheckInterval);

			if (window.location.href.toLowerCase() == "http://www.csgodouble.com/")
				doubleBot();
		}
	}, 10);
});