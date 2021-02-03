/**
 * Picture Cross Clone
 * by JimmyBear217
 * 
 * This is a simple clone of the mobile game picture cross available on iphone
 */

function initBoard(size = 15) {
    var container = document.getElementById("page");
    var table = document.createElement("table");
    table.id = "game-table"
    for (y = -1; y < size; y++) {
        var tr = document.createElement("tr");
        // columns
        for (x = -1; x < size; x++) {
            if (y < 0) {
                // first row
                var th = document.createElement("th");
                if (x >= 0) {
                    th.innerText = "0";
                }
                th.setAttribute("data-X", x);
                th.setAttribute("data-Y", "H");
                th.id = "header-X" + x;
                th.className = "FirstRow";
                tr.appendChild(th);
            } else if (x < 0) {
                // row headers
                var th = document.createElement("th");
                th.innerText = "0";
                th.setAttribute("data-X", "H");
                th.setAttribute("data-Y", y);
                th.id = "header-Y" + y;
                tr.appendChild(th);
            } else {
                // cells
                var td = document.createElement("td");
                td.innerText = "";
                td.setAttribute("data-X", x);
                td.setAttribute("data-Y", y);
                td.id = "cell-X" + x + "Y" + y;
                tr.appendChild(td);
                td.addEventListener("click", doNothing)
                td.addEventListener("contextMenu", doNothing)
                td.addEventListener("statusUpdate", cellStatusUpdateHandler);
            }
        }
        table.appendChild(tr);
    }
    container.appendChild(table);
    container.setAttribute("tableSize", size);
}

function doNothing(ev) {
    ev.preventDefault();
    console.log(ev)
}


function setBlock(target) {
    if (!target.classList.contains("block") && !target.classList.contains("cross")) {
        target.classList.add("block");
    }
}

function setCross(target) {
    if (!target.classList.contains("cross") && !target.classList.contains("block")) {
        target.classList.add("cross");
    }
}

function setBlank(target) {
    if (target.classList.contains("block")) {
        target.classList.remove("block");
    }
    if (target.classList.contains("cross")) {
        target.classList.remove("cross");
    }
}

function cellStatusUpdateHandler(ev) {
    // console.log("The status has changed.");
    target = ev.target;
    ev.preventDefault();
    var x = target.getAttribute("data-X");
    countColumn(x)
    var y = target.getAttribute("data-Y");
    countRow(y)
    checkCompletion();
}

function countColumn(index) {
    var container = document.getElementById("page");
    var size = container.getAttribute("tableSize");
    var values = Array();
    var lastStatus = "blank";
    var lastCount = 0;
    for (y = 0; y < size; y++) {
        if (document.getElementById("cell-X" + index + "Y" + y)) {
            elem = document.getElementById("cell-X" + index + "Y" + y)
                // console.log("[x] Found:", elem);
            if (elem.classList.contains("block")) {
                // block
                if (lastStatus == "block") {
                    // increment existing status
                    lastCount++;
                } else {
                    // initialize new status
                    lastStatus = "block";
                    lastCount = 1;
                }
            } else {
                // blank or cross
                if (lastStatus == "block") {
                    // commit existing status
                    values.push(lastCount);
                    lastStatus = "blank";
                    lastCount = 1;
                }
            }
        } else {
            console.error("Not Found:", "cell-X" + index + "Y" + y);
        }
    }
    if (lastStatus == "block") {
        // commit block status if remaining
        values.push(lastCount);
        lastStatus = "blank";
        lastCount = 0;
    }
    // write values
    if (document.getElementById("header-X" + index)) {
        header = document.getElementById("header-X" + index);
        // header.innerText = JSON.stringify(values);
        header.setAttribute("data-currentStatus", JSON.stringify(values));
        if (header.getAttribute("data-goalValue") == header.getAttribute("data-currentStatus")) {
            if (!header.classList.contains("correct"))
                header.classList.add("correct")
        } else {
            if (header.classList.contains("correct"))
                header.classList.remove("correct")
        }
    } else {
        console.error("Not Found:", "header-X" + index)
    }
}

function countRow(index) {
    var container = document.getElementById("page");
    var size = container.getAttribute("tableSize");
    var values = Array();
    var lastStatus = "blank";
    for (x = 0; x < size; x++) {
        if (document.getElementById("cell-X" + x + "Y" + index)) {
            elem = document.getElementById("cell-X" + x + "Y" + index);
            // console.log("[y] Found:", elem);
            if (elem.classList.contains("block")) {
                // block
                if (lastStatus == "block") {
                    // increment existing status
                    lastCount++;
                } else {
                    // initialize new status
                    lastStatus = "block";
                    lastCount = 1;
                }
            } else {
                // blank or cross
                if (lastStatus == "block") {
                    // commit existing status
                    values.push(lastCount);
                    lastStatus = "blank";
                    lastCount = 1;
                }
            }
        } else {
            console.error("Not Found:", "cell-X" + x + "Y" + index);
        }
    }
    if (lastStatus == "block") {
        // commit block status if remaining
        values.push(lastCount);
        lastStatus = "blank";
        lastCount = 0;
    }
    // write values
    if (document.getElementById("header-Y" + index)) {
        header = document.getElementById("header-Y" + index);
        // header.innerText = JSON.stringify(values);
        header.setAttribute("data-currentStatus", JSON.stringify(values));
        if (header.getAttribute("data-goalValue") == header.getAttribute("data-currentStatus")) {
            if (!header.classList.contains("correct"))
                header.classList.add("correct")
        } else {
            if (header.classList.contains("correct"))
                header.classList.remove("correct")
        }
    } else {
        console.error("Not Found:", "header-Y" + index)
    }
}

function checkCompletion() {
    var completion = 0;
    var thCount = -1;
    var thDone = 0;
    Array.from(document.getElementsByTagName("th")).forEach((elem) => {
        if (elem.classList.contains('correct')) thDone++;
        thCount++;
    })
    if (thCount > 0) {
        completion = Math.round((thDone / thCount) * 100);
    }
    // console.log("thCount:", thCount, "thDone:", thDone, "completion:", completion);
    document.getElementById("completion-percent").innerText = completion
        // @todo add 100% congratulations
}

function changeDifficulty() {
    var number = document.getElementById("difficulty-level");
    var slider = document.getElementById("difficulty-slider");
    number.innerText = slider.value;
    newGame();
}

function generateGame() {
    var container = document.getElementById("page");
    var size = parseInt(container.getAttribute("tableSize"));
    var values = Array(size);
    // generate final image
    for (var y = 0; y < size; y++) {
        values[y] = Array(size);
        console.log("[GenerateGame] Looping through row", y, "of", size);
        for (var x = 0; x < size; x++) {
            console.log("[GenerateGame] Looping through column", x, "of", size);
            var RandomNumber = Math.random() * 10;
            var difficulty = parseInt(document.getElementById("difficulty-slider").value);
            if (difficulty == 0) difficulty = 3
            if (RandomNumber > difficulty) RandomNumber = 1;
            else RandomNumber = 0;
            values[y][x] = Math.round(RandomNumber);
            // DEMO
            // if (values[y][x]) document.getElementById("cell-X" + x + "Y" + y).classList.add("block");
            console.log("Generated value", x, ";", y, "as", values[y][x]);
        }
    }
    // interpret final image into numbers for the headers
    // ROWS
    for (var y = 0; y < size; y++) {
        var rowValue = Array();
        var lastStatus = "blank";
        lastCount = 0;
        for (var x = 0; x < size; x++) {
            var val = values[y][x];
            // console.log("[y] Found:", elem);
            if (val == 1) {
                // block
                if (lastStatus == "block") {
                    // increment existing status
                    lastCount++;
                } else {
                    // initialize new status
                    lastStatus = "block";
                    lastCount = 1;
                }
            } else {
                // blank
                if (lastStatus == "block") {
                    // commit existing status
                    rowValue.push(lastCount);
                    lastStatus = "blank";
                    lastCount = 1;
                }
            }
        }
        if (lastStatus == "block") {
            // commit block status if remaining
            rowValue.push(lastCount);
            lastStatus = "blank";
            lastCount = 0;
        }
        document.getElementById("header-Y" + y).setAttribute("data-goalValue", JSON.stringify(rowValue));
        document.getElementById("header-Y" + y).innerHTML = "";
        if (rowValue.length > 0) {
            rowValue.forEach((val) => {
                var span = document.createElement("span")
                span.innerText = val;
                document.getElementById("header-Y" + y).appendChild(span);
            });
        } else {
            var span = document.createElement("span")
            span.innerText = "0";
            document.getElementById("header-Y" + y).appendChild(span);
        }
    }
    // COLUMN
    for (var x = 0; x < size; x++) {
        var columnValue = Array();
        var lastStatus = "blank";
        lastCount = 0;
        for (var y = 0; y < size; y++) {
            var val = values[y][x];
            // console.log("[y] Found:", elem);
            if (val == 1) {
                // block
                if (lastStatus == "block") {
                    // increment existing status
                    lastCount++;
                } else {
                    // initialize new status
                    lastStatus = "block";
                    lastCount = 1;
                }
            } else {
                // blank
                if (lastStatus == "block") {
                    // commit existing status
                    columnValue.push(lastCount);
                    lastStatus = "blank";
                    lastCount = 1;
                }
            }
        }
        if (lastStatus == "block") {
            // commit block status if remaining
            columnValue.push(lastCount);
            lastStatus = "blank";
            lastCount = 0;
        }
        document.getElementById("header-X" + x).setAttribute("data-goalValue", JSON.stringify(columnValue));
        document.getElementById("header-X" + x).innerHTML = "";
        if (columnValue.length > 0) {
            columnValue.forEach((val) => {
                var span = document.createElement("span")
                span.innerText = val;
                document.getElementById("header-X" + x).appendChild(span);
            });
        } else {
            var span = document.createElement("span")
            span.innerText = "0";
            document.getElementById("header-X" + x).appendChild(span);
        }
    }
    console.log("Generated Game:", values);

}

function clearBoard() {
    var container = document.getElementById("page");
    var size = parseInt(container.getAttribute("tableSize"));
    for (var y = 0; y < size; y++) {
        for (var x = 0; x < size; x++) {
            elem = document.getElementById("cell-X" + x + "Y" + y);
            if (elem.classList.contains("block")) {
                elem.classList.remove("block");
            }
            if (elem.classList.contains("cross")) {
                elem.classList.remove("cross");
            }
        }
    }
    for (var z = 0; z < size; z++) {
        document.getElementById("cell-X" + z + "Y" + z).dispatchEvent(new Event("statusUpdate"));
    }
}

function newGame() {
    generateGame();
    clearBoard();
}

initBoard();
changeDifficulty();
// generateGame();