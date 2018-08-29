window.onload = function() {
    var pebble = '<img class="stone" src="pohledy/images/stone-0.png"/>'
    var turn = 0;

    function setInfo(info) {
        document.getElementById("info").innerHTML = info;
    }

    function appendInfo(info) {
        document.getElementById("info").innerHTML += info;
    }

    function addFirstInfo(info) {
        document.getElementById("info").innerHTML = info + " " + document.getElementById("info").innerHTML;
    }

    function fillWithPebbles(numberOfPebbles, id) {
        clearPlace(id);
        for (var x = 0; x < numberOfPebbles; x++)
            addPebble(id);
    }

    function addPebbles(number, id) {
        for (var i = 0; i < number; i++)
            addPebble(id);
    }

    function addPebble(id) {
        var place = document.getElementById(id);
        var score = document.getElementById(id + "Score");
        if (score.innerHTML == 0)
            place.innerHTML += "<div>" + pebble;
        else if (score.innerHTML % 3 == 0)
            place.innerHTML += "<div>" + pebble;
        else {
            var a = place.innerHTML.substring(0, place.innerHTML.length - 6);
            place.innerHTML = a + pebble;
        }
        score.innerHTML = ++score.innerHTML;
    }

    function clearPlace(id) {
        var doc = document.getElementById(id);
        var score = document.getElementById(id + "Score");
        doc.innerHTML = "";
        var pebbles = score.innerHTML;
        score.innerHTML = 0;
        return pebbles;
    }

    function setTurnColorOn(id) {
        document.getElementById(id).classList.add("active");
    }

    function setTurnColorOff(id) {
        document.getElementById(id).classList.remove("active");
    }

    function moveStones(place, parentId) {
        //alert(place);
        if (parentId != turn) {
            setInfo("It's not your turn! It is Player" + turn + " turn!");
            return;
        }
        var pebbles = clearPlace("place" + place);
        if(pebbles == 0) {
            setInfo("That's empty pit! It is Player" + turn + " turn!");
            return;
        }
        while (pebbles--) {
            place = (+1 + +place) % 14;
            if ((place == 0 && parentId != 0) || (place == 7 && parentId != 1)) {
                pebbles++;
            } else
                addPebble("place" + place);
        }
        if ((place == 0 && parentId == 0) || (place == 7 && parentId == 1)) {
            setInfo("You get another turn!");
            return;
        }
        takeOppositePebbles(place);
        setTurnColorOff(turn);
        if (shouldEnd())
            return;
        turn = (+turn + +1) % 2;
        if (shouldEnd())
            return;
        setTurnColorOn(turn);
        setInfo("It is Player" + turn + " turn!");

    }

    function takeOppositePebbles(id) {
        var place = document.getElementById("place" + id);
        if (place.parentElement.id != turn)
            return;
        var oppositeId = +14 - +id;
        var oppositeScore = document.getElementById("place" + oppositeId + "Score").innerHTML;
        var myScore = document.getElementById("place" + id + "Score").innerHTML;
        if (myScore == 1 && oppositeScore > 0) {
            var last = turn == 0 ? 0 : 7;
            clearPlace("place" + oppositeId);
            clearPlace("place" + id);
            addPebbles(+myScore + +oppositeScore, "place" + last);
        }
    }

    function onClick(event) {
        event.preventDefault();
        //alert(event.target.id);
        moveStones(this.id.substr(5), this.parentElement.id);
    }

    function start() {
        clearPlace("place" + 0);
        for (var i = 1; i < 14; i++) {
            if (i == 7) {
                clearPlace("place" + i);
                continue;
            }
            fillWithPebbles(4, "place" + i);
        }
        var places = document.getElementsByClassName("place");
        for (var i = 0; i < places.length; i++)
            places[i].addEventListener("click", onClick);

        setTurnColorOn(turn);
        setInfo("It is Player" + turn + " turn!");
    }

    function getWinner() {
        var playerOneScore = document.getElementById("place0Score").innerHTML;
        var playerTwoScore = document.getElementById("place7Score").innerHTML;
        return playerOneScore > playerTwoScore ? "Player One" : "Player Two";

    }

    function transferAllPebbles(playerId) {
        var player = document.getElementById(playerId);
        var pebbles = 0;
        for (var i = 0; i < player.childElementCount; i++) {
            var placeId = player.children[i].id;
            pebbles += +clearPlace(placeId);
        }
        var last = playerId == 0 ? 0 : 7;
        addPebbles(pebbles, "place" + last);

    }

    function shouldEnd() {
        if (isEnd()) {
            end();
            return true;
        }
        return false;
    }

    function isEnd() {
        var player = document.getElementById(turn);
        for (var i = 0; i < player.childElementCount; i++) {
            var a = player.children[i].innerHTML;
            if (player.children[i].innerHTML !== "")
                return false;
        }
        return true;
    }

    function end() {
        var lastTurn = (+turn + +1) % 2;
        transferAllPebbles(lastTurn);
        var places = document.getElementsByClassName("place");
        for (var i = 0; i < places.length; i++)
            places[i].removeEventListener("click", onClick);

        setTurnColorOff(turn);

        setInfo(getWinner() + " won!");
    }

    function load() {

        document.getElementById("newGame").addEventListener("click", start);
        start();
    }

    document.addEventListener("load", load());
};