var mouseState = {
    button: 0, // 1 == left, 2 == middle, 3 == right
    clicking: false,
    dragging: false,
    dragAction: "",
    elemsDraggedOver: Array()
};

function mouseDownHandlder(ev) {
    // read click
    ev.preventDefault();
    console.debug("[mouseDownHandlder]", ev);
    mouseState.clicking = true;
    mouseState.button = ev.which
    mouseState.elemsDraggedOver = Array(ev.target.id)
    switch (mouseState.button) {
        case 1:
            // left == block
            if (ev.target.classList.contains("block")) {
                mouseState.dragAction = "blank"
            } else {
                mouseState.dragAction = "block"
            }
            break;
        case 3:
            if (ev.target.classList.contains("cross")) {
                mouseState.dragAction = "blank"
            } else {
                mouseState.dragAction = "cross"
            }
            break;

        default:
            mouseState.dragAction = "blank"
            break;
    }
    mouseEventUpdateCell(ev.target);
}

function mouseMoveHandlder(ev) {
    // read drag or move
    ev.preventDefault();
    if (ev.target.tagName == "TD") {
        if (mouseState.clicking)
            mouseState.dragging = true;
        if (mouseState.dragging) {
            console.debug("[mouseMoveHandlder]", ev);
            // verify last elem and inculde any cell in between
            if (mouseState.elemsDraggedOver[mouseState.elemsDraggedOver.length - 1]) {
                var lastElem = document.getElementById(mouseState.elemsDraggedOver[mouseState.elemsDraggedOver.length - 1]);
                if (lastElem.getAttribute("data-X") == ev.target.getAttribute("data-X")) {
                    // this elem and the last were on the same X-axis value
                    x = ev.target.getAttribute("data-X")
                    minY = Math.min(lastElem.getAttribute("data-Y"), ev.target.getAttribute("data-Y"))
                    maxY = Math.max(lastElem.getAttribute("data-Y"), ev.target.getAttribute("data-Y"))
                    skippedElemsY = Math.abs(maxY - minY)
                    if (skippedElemsY > 1) {
                        console.log("It looks like we skipped", skippedElemsY, "cells on Y axis (", lastElem.id, "-", ev.target.id, ")")
                        for (var y = minY + 1; y < maxY; y++) {
                            id = "cell-X" + x + "Y" + y
                            console.log("correcting cell", id, "\ny:", y, "minY:", minY, "maxY:", maxY, "<:", y < maxY);
                            if (!mouseState.elemsDraggedOver.includes(id)) {
                                if (document.getElementById(id)) {
                                    mouseState.elemsDraggedOver.push(id)
                                    mouseEventUpdateCell(document.getElementById(id));
                                } else {
                                    console.warn("Not found: #" + id);
                                }
                            }
                        }
                        console.log("Done correcting", "\ny:", y, "minY:", minY, "maxY:", maxY, "<:", y < maxY);
                    }
                } else if (lastElem.getAttribute("data-Y") == ev.target.getAttribute("data-Y")) {
                    // this elem and the last were on the same X-axis value
                    y = ev.target.getAttribute("data-Y")
                    minX = Math.min(lastElem.getAttribute("data-X"), ev.target.getAttribute("data-X"))
                    maxX = Math.max(lastElem.getAttribute("data-X"), ev.target.getAttribute("data-X"))
                    skippedElemsX = Math.abs(maxX - minX)
                    if (skippedElemsX > 1) {
                        console.log("It looks like we skipped", skippedElemsX, "cells on the X axis (", lastElem.id, "-", ev.target.id, ")")
                        for (var x = minX + 1; x < maxX; x++) {
                            id = "cell-X" + x + "Y" + y
                            console.log("correcting cell", id, "\nx:", x, "minX:", minX, "maxX:", maxX, "<:", x < maxX);
                            if (!mouseState.elemsDraggedOver.includes(id)) {
                                if (document.getElementById(id)) {
                                    mouseState.elemsDraggedOver.push(id)
                                    mouseEventUpdateCell(document.getElementById(id));
                                } else {
                                    console.warn("Not found: #" + id);
                                }
                            }
                        }
                        console.log("Done correcting", "\nx:", x, "minX:", minX, "maxX:", maxX, "<:", x < maxX);
                    }
                }
            }
            // push elem to list and apply update
            if (!mouseState.elemsDraggedOver.includes(ev.target.id)) {
                mouseState.elemsDraggedOver.push(ev.target.id)
                mouseEventUpdateCell(ev.target);
            }
        }
    }
}

function mouseUpHandlder(ev) {
    // read end of click
    ev.preventDefault();
    console.debug("[mouseUpHandlder]", ev);
    /*mouseState.dragStart = {
        ev.clientX,
        ev.clientY
    }*/
    if (!mouseState.elemsDraggedOver.includes(ev.target.id)) {
        mouseState.elemsDraggedOver.push(ev.target.id)
        mouseEventUpdateCell(ev.target);
    }
    mouseState.dragAction = ""
    mouseState.elemsDraggedOver = Array()
    mouseState.clicking = false;
    if (mouseState.dragging)
        mouseState.dragging = false;
}


function mouseEventUpdateCell(elem) {
    console.log("[mouseEventUpdateCell]", ">", mouseState.dragAction, "<", elem.id)
    switch (mouseState.dragAction) {
        case "block":
            setBlock(elem)
            break;
        case "cross":
            setCross(elem)
            break;

        case "blank":
        default:
            setBlank(elem)
            break;
    }
    elem.dispatchEvent(new Event("statusUpdate"));
}

document.getElementById("game-table").addEventListener("mousedown", mouseDownHandlder)
document.getElementById("game-table").addEventListener("mousemove", mouseMoveHandlder)
document.getElementById("game-table").addEventListener("mouseup", mouseUpHandlder)
document.getElementById("game-table").addEventListener("click", doNothing)
document.getElementById("game-table").addEventListener("contextMenu", doNothing)