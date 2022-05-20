(() => {
//create the boredle
let d = document
let currentRow = 0
let streak = 0
let styles = {
    "none": "",
    "message": "display:flex;position:absolute;top:0;right:0;left:0;margin:auto;top:25%;width:fit-content;text-align:center;height:auto;background:white;border:1px solid black;color:black;",
    "bWindow": "display: flex;flex-direction: column;position: fixed;background: white;border-radius: 5px;overflow: hidden;box-shadow: 0px 12px 26px -9px rgba(189, 189, 189, 1);-webkit-box-shadow: 0px 12px 26px -9px rgba(189, 189, 189, 1);transition: min-width .25s, min-height .25s;z-index: 999999;min-width:200px;min-height:300px;bottom:20px;right:20px;",
    "bTitle": "display:flex;width:100%;height:25px;background:green;flex-direction:row;justify-content:space-between;align-items:center;background:rgb(202,202,202);background:linear-gradient(0deg, rgba(202,202,202,1) 0%, rgba(202,202,202,1) 80%, rgba(232,233,232,1) 100%);border-bottom:1px solid darkgrey;",
    "bButtons": "padding:0 5px;display:flex;justify-content:center;align-items:center;",
    "bButtonsButton": "display:flex;width:15px;height:15px;justify-content:center;align-items:center;border-radius:50%;border:1px solid darkgrey;margin:0 5px;text-align:center;padding:0;",
    "decrease": "background:rgb(246,244,22);padding-bottom:1px;cursor:pointer;",
    "increase": "background: rgb(4, 177, 4);cursor:pointer;",
    "bBoard": "display:flex;width:100%;flex-direction:column;margin:0 auto;",
    "bBoardRow": "height:auto;width:100%;display:flex;justify-content:center;align-items:center;",
    "bBoardCell": "border:1px solid #d3d6da;margin:2px;justify-content:center;align-items:center;display:flex;width:22px;height:22px;font-size:16px;color:black;background:white;transition:background 1s;font-family:Arial;",
    "bKeyboard": "margin-top:10px;",
    "bKeyboardRow": "height:auto;width:100%;display:flex;justify-content:center;align-items:center;",
    "bKeyboardKey": "margin:1%;justify-content:center;align-items:center;display:flex;background:#d3d6da;width:16px;height:18px;font-size:14px;cursor:pointer;color:black;font-family:Arial;"
}

//window
let bWindow = createAppendElement("div", "id", "boredle-window", styles["bWindow"], d.body)
//title
let bTitle = createAppendElement("div", "class", "boredle-title", styles["bTitle"], bWindow)
let bButtons = createAppendElement("div", "class", "boredle-buttons", styles["bButtons"], bTitle)
let decrease = createAppendElement("button", "id", "decrease", styles["decrease"] + styles["bButtonsButton"], bButtons)
let increase = createAppendElement("button", "id", "increase", styles["increase"] + styles["bButtonsButton"], bButtons)
//streak
let streakEl = createAppendElement("p", "class", "boredle-streak", "position:absolute;font-size:12px;left:0;right:0;margin:auto;top:-20px;text-align:center;color:black;max-width:100px;background:white;", bWindow)
streakEl.innerText = `Streak: ${streak}`

//boredle body
let bBody = createAppendElement("div", "id", "boredle-body", styles["none"], bWindow)
//boredle board
let bBoard = createAppendElement("div", "class", "boredle-board", styles["bBoard"], bBody)
//create 6 rows of 5 cells for board
let bBoardRows = []
let bBoardCells = []
for (let i = 0; i < 6; i++){
    let bBoardRow = createAppendElement("div", "class", "boredle-row", styles["bBoardRow"], bBoard)
    bBoardRows.push(bBoardRow)

    for (let b = 0; b < 5; b++){
        let bBoardCell = createAppendElement("div", "class", "empty", styles["bBoardCell"], bBoardRow)
        bBoardCells.push(bBoardCell)
    }
}

//boredle keyboard
let bKeyboard = createAppendElement("div", "class", "boredle-keyboard", styles["bKeyboard"], bBody)
let keyboardArray = "Q W E R T Y U I O P A S D F G H J K L backspace Z X C V B N M enter".split(" ")
let bKeyboardRows = []
let bKeyboardKeys = []
//make 3 keyboard rows with 10 key 9 key 9 key
let rowLength = 10
for (let i = 0; i < 3; i++){
    let bKeyboardRow = createAppendElement("div", "class", "keyboard-row", styles["bKeyboardRow"], bKeyboard)
    bKeyboardRows.push(bKeyboardRow)

    for (let b = 0; b < rowLength; b++){
        let bKeyboardKey = createAppendElement("div", "class", "key", styles["bKeyboardKey"], bKeyboardRow)
        bKeyboardKey.setAttribute("id", keyboardArray[b])
        bKeyboardKey.innerText = keyboardArray[b]
        bKeyboardKeys.push(bKeyboardKey)
    }

    keyboardArray.splice(0, rowLength)
    rowLength = 9 
}

//backspace
let backspace = bKeyboardKeys[19]
backspace.removeAttribute("class")
backspace.innerText = "⌫"
backspace.setAttribute("style", backspace.getAttribute("style") + "background: rgb(255, 91, 91);color: white;")

//enter
let enter = bKeyboardKeys[27]
enter.removeAttribute("class")
enter.innerText = "➔"
enter.setAttribute("style", enter.getAttribute("style") + "background: rgb(66, 211, 66);color: white;")
bKeyboardKeys.splice(19, 1)
bKeyboardKeys.splice(26, 1)


//create word list, 5 characters each, no special characters
let bWordList = []

for (let el of d.querySelectorAll("h1, h2, h3, h4, h5, h6, p, a, ul, ol, span, div")){
    let text = el.innerText.replace(/[\n\r]+/g, ' ').normalize("NFKD").toUpperCase()
    let words = text.split(" ")
    for (let word of words){
        word = word.replace(/[^A-Za-z]/g, "")
        if (word.length == 5 && word.split("").filter(x => ["A", "E", "I", "O", "U"].indexOf(x)).length > 1 && bWordList.indexOf(word) == -1){
            bWordList.push(word)
        }
    }

}
let bWord
if (bWordList.length !== 0){
    bWord = bWordList[Math.floor(Math.random()*bWordList.length)]
    bWordList.splice(bWordList.indexOf(bWord), 1)
} else {
    postMessage("Page has no words!", 5000, () => {bWindow.remove()})
}

function createAppendElement(elType, attType, attName, style, toAppend){
    let element = d.createElement(elType)
    element.setAttribute(attType, attName)
    element.setAttribute("style", style)
    toAppend.appendChild(element)
    return element
}

//change size function
function changeSize(el, sVal, fVal){
    el.style.width = `${parseInt(el.style.width.replace("px", "")) + sVal}px`
    el.style.height = `${parseInt(el.style.height.replace("px", "")) + sVal}px`
    el.style.fontSize = `${parseInt(el.style.fontSize.replace("px", "")) + fVal}px`
}

//increase button action
increase.addEventListener("click", () => {
    if (bWindow.style.minWidth != "450px"){
        bWindow.style.minWidth = `${parseInt(bWindow.style.minWidth.replace("px", "")) + 50}px`
        bWindow.style.minHeight = `${parseInt(bWindow.style.minHeight.replace("px", "")) + 50}px`

        for (let element of bBoardCells){changeSize(element, 5, 2)}
        for (let element of bKeyboardKeys.concat(backspace, enter)){changeSize(element, 2, 2)}
    }
})

//decrease button action
decrease.addEventListener("click", () => {
    if (bWindow.style.minWidth != "100px"){
        bWindow.style.minWidth = `${parseInt(bWindow.style.minWidth.replace("px", "")) - 50}px`
        bWindow.style.minHeight = `${parseInt(bWindow.style.minHeight.replace("px", "")) - 50}px`

        for (let element of bBoardCells){changeSize(element, -5, -2)}
        for (let element of bKeyboardKeys.concat(backspace, enter)){changeSize(element, -2, -2)}
    }
})

//shorter query function
function f(x, bool = false){
    if (bool){
        return d.querySelectorAll(x)
    } else {
        return d.querySelector(x)
    }
}

//game functions
for (let el of bKeyboardKeys){
    el.addEventListener("click", (e) => {
        if (f(".pending", true).length < 5){
            let empties = f(".empty", true)
            empties[0].innerText = e.target.id
            empties[0].setAttribute("class", "pending")
        } else {
            postMessage("No room! Use backspace!", 1000, () => {return 1})
        }
    })
}

backspace.addEventListener("click", () => {
    let pendings = f(".pending", true)

    if (pendings.length > 0){
        let lastPending = pendings[pendings.length - 1]
        lastPending.innerText = ""
        lastPending.setAttribute("class", "empty")
    } else {
        postMessage("The row is empty...", 1000, () => {return 1})
    }
})

enter.addEventListener("click", (e) => {
    if (f(".pending", true).length == 5){
        let pendings = f(".pending", true)
        let pendingArray = Array.from(f(".pending", true)).map(x => x.innerText)
        let wordArray = bWord.split("")
        let keyboardLetters = Array.from(bKeyboardKeys).map(x => x.innerText)

        let wordObj = {}
        for (let i = 0; i < 5; i++){
            if (wordArray[i] !== pendingArray[i]){
                wordObj[wordArray[i]] = wordObj[wordArray[i]] ? wordObj[wordArray[i]] + 1 : 1;
            }
        }

        for (let i = 0; i < pendingArray.length; i++){
            let bKeyboardKey = bKeyboardKeys[keyboardLetters.indexOf(pendingArray[i])]
            let letter = pendingArray[i]
            if (wordArray[i] === letter){
                wordObj[letter] = wordObj[letter] - 1;
                pendings[i].style.background = "green"
                pendings[i].style.color = "white"
                bKeyboardKey.style.background = "green"
                bKeyboardKey.style.color = "white"
                pendings[i].setAttribute("class", "correct")
            } else if (wordArray.indexOf(letter) !== -1 && wordObj[letter] > 0){
                wordObj[letter] = wordObj[letter] - 1;
                pendings[i].style.background = "#c9b458"
                pendings[i].style.color = "white"
                bKeyboardKey.style.background = "#c9b458"
                bKeyboardKey.style.color = "white"
                pendings[i].setAttribute("class", "inword")
            } else {
                pendings[i].style.background = "grey"
                pendings[i].style.color = "white"
                if (bKeyboardKey.style.background !== "green" && bKeyboardKey.style.background !== "yellow"){
                    bKeyboardKey.style.background = "#787c7e"
                    bKeyboardKey.style.color = "white"
                }
                pendings[i].setAttribute("class", "outword")
            }
        }
        
        if (bBoardRows[currentRow].querySelectorAll(".correct").length == 5 ){
            postMessage("Nice! You win!", 2000, () => {clear();currentRow=0})
            streakEl.innerText = `Streak: ${++streak}`
        } else if (currentRow == 5 && bBoardRows[currentRow].querySelectorAll(".empty").length == 0){
            postMessage(`The word was "${bWord}"`, 3000, () => {clear();currentRow=0})
            streak = 0
            streakEl.innerText = `Streak: ${streak}`
        } else {
            currentRow = currentRow + 1
        }

    } else {
        postMessage("Fill the current row to enter...", 1000, () => {return 1})
    }
})

function clear(){
    currentRow = 0
    for (let el of bBoardCells){
        el.setAttribute("class", "empty")
        el.style.background = "white"
        el.innerText = ""
    }

    for (let el of bKeyboardKeys){
        el.style.background = "#d3d6da"
    }

    if (bWordList.length !== 0) {
        bWord = bWordList[Math.floor(Math.random()*bWordList.length)]
        bWordList.splice(bWordList.indexOf(bWord), 1)
    } else {
        postMessage("Out of words!", 60000, () => {bWindow.remove()})
    }
}

function postMessage(messageText, duration, callback){
    let message = createAppendElement("div", "id", "message", styles["message"] + `font-size:${bKeyboardKeys[0].style.fontSize}`, bWindow)
    message.innerText = messageText
    setTimeout(() => {message.remove();callback()}, duration)
}
})()
