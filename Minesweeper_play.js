var bomb = '<i class="fa fa-bomb" aria-hidden="true"></i>';
var smile = '<i class="fa fa-smile-o fa-2x" aria-hidden="true"></i>';
var frown = '<i class="fa fa-frown-o fa-2x" aria-hidden="true"></i>';

var rowIndex = 0;
var colIndex = 0;
var count = 0;
var time = 0;
var flagCount = 10;
var bombCount = 0;

var boxElts = document.getElementsByClassName("box");
var backgroundedElts = document.getElementsByClassName("backgrounded");
var modalElt = document.querySelector("#modal");
var playElt = document.querySelector(".play");
var msgElt = document.querySelector(".msg");
var mineBody = document.querySelector(".mine-body");
var flagElt = document.querySelector(".flagN");
var smileElt = document.querySelector(".smile");
var timeElt = document.querySelector(".timeN");

playElt.addEventListener("click", startGame);
                         
function startGame() {
  addBombs(10);
  
  for (var i=0; i<boxElts.length; i++) {
    boxElts[i].addEventListener("click", checkBoxes);
    boxElts[i].addEventListener("contextmenu", manageFlag);
    if (boxElts[i].innerHTML !== bomb) {
      addNumbers(boxElts[i], boxElts[i].parentNode.rowIndex, boxElts[i].cellIndex);
    }
  }
  
  modalElt.classList.add("hidden");
  timer = setInterval(function() {
    document.querySelector(".timeN").innerHTML = time++;
  }, 1000);
}

function addBombs(number) {
  for (var i=0; i<number; i++) {
    var rand = Math.floor(Math.random() * boxElts.length);
    while (boxElts[rand].innerHTML === bomb) {
      rand = Math.floor(Math.random() * boxElts.length);
    }
    boxElts[rand].innerHTML = bomb;
  }
}

function checkBoxes(e) {
  var curr = e.currentTarget;
  if (!curr.classList.contains("flagged")) {
    curr.classList.remove("backgrounded");
    if (curr.innerHTML === bomb) {
      endGame("lose");
    }
    else if (curr.innerHTML !== bomb && backgroundedElts.length == 10) {
      endGame("win");
    }
    else if (curr.innerHTML>0 && curr.innerHTML<9) {}
    else {
      checkSides(curr, curr.parentNode.rowIndex, curr.cellIndex);
    }
  }  
}

function manageFlag(e) {
  e.preventDefault();
  var curr = e.currentTarget;
  if (!curr.classList.contains("flagged") && flagCount > 0) {
    flagCount--;
    curr.classList.add("flagged");
  }
  else if (curr.classList.contains("flagged") && flagCount >= 0) {
    flagCount++;
    curr.classList.remove("flagged");
  }
  flagElt.innerHTML = flagCount;
}

function addNumbers(curr, rowI, colI) {
  var bombCount = 0;
  if (mineBody.rows[rowI-1]) {
    if (mineBody.rows[rowI-1].cells[colI-1] && 
        mineBody.rows[rowI-1].cells[colI-1].innerHTML === bomb) {
      bombCount++;
    }
    if (mineBody.rows[rowI-1].cells[colI] && 
        mineBody.rows[rowI-1].cells[colI].innerHTML === bomb) {
      bombCount++;
    }
    if (mineBody.rows[rowI-1].cells[colI+1] && 
        mineBody.rows[rowI-1].cells[colI+1].innerHTML === bomb) {
      bombCount++;
    }
  }
  if (mineBody.rows[rowI]) {
    if (mineBody.rows[rowI].cells[colI-1] &&
        mineBody.rows[rowI].cells[colI-1].innerHTML === bomb) {
      bombCount++;
    }
    if (mineBody.rows[rowI].cells[colI] && 
        mineBody.rows[rowI].cells[colI].innerHTML === bomb) {
      bombCount++;
    }
    if (mineBody.rows[rowI].cells[colI+1] && 
        mineBody.rows[rowI].cells[colI+1].innerHTML === bomb) {
      bombCount++;
    }
  }

  if (mineBody.rows[rowI+1]) {
    if (mineBody.rows[rowI+1].cells[colI-1] && 
        mineBody.rows[rowI+1].cells[colI-1].innerHTML === bomb) {
      bombCount++;
    }
    if (mineBody.rows[rowI+1].cells[colI] && 
        mineBody.rows[rowI+1].cells[colI].innerHTML === bomb) {
      bombCount++;
    }
    if (mineBody.rows[rowI+1].cells[colI+1] && 
        mineBody.rows[rowI+1].cells[colI+1].innerHTML === bomb) {
      bombCount++;
    }
  }
  if (bombCount>0) {curr.innerHTML = bombCount;}
}

function checkSides(curr, rowI, colI) {
  if (!curr.classList.contains("backgrounded")) {
    if (mineBody.rows[rowI-1]) {
      checkRowCell(curr, rowI-1, colI-1);
      checkRowCell(curr, rowI-1, colI);
      checkRowCell(curr, rowI-1, colI+1);
    }
    if (mineBody.rows[rowI]) {
      checkRowCell(curr, rowI, colI-1);
      checkRowCell(curr, rowI, colI+1);
    }
    if (mineBody.rows[rowI+1]) {
      checkRowCell(curr, rowI+1, colI-1);
      checkRowCell(curr, rowI+1, colI);
      checkRowCell(curr, rowI+1, colI+1);
    }
  }
}

function checkRowCell(curr, roww, coll) {
  if (mineBody.rows[roww].cells[coll] && 
      mineBody.rows[roww].cells[coll].classList.contains("backgrounded")) {
    mineBody.rows[roww].cells[coll].classList.remove("backgrounded");
    if (mineBody.rows[roww].cells[coll].innerHTML === "") {
      checkSides(curr, mineBody.rows[roww].cells[coll].parentNode.rowIndex, mineBody.rows[roww].cells[coll].cellIndex);
    }
  }
}

function endGame(result) {
  clearInterval(timer);
  if (result === "lose") {
    for (var i=0; i<boxElts.length; i++) {boxElts[i].classList.remove("backgrounded");}
    smileElt.innerHTML = frown;
    msgElt.innerHTML = "You lose !"; 
  }
  else if (result === "win") {
    msgElt.innerHTML = "You win in " + time + " sec!";    
  }
  setTimeout(function() {
    resetGame();
  }, 1200);
}

function resetGame() {
  for (var i=0; i<boxElts.length; i++) {
    boxElts[i].classList.add("backgrounded");
    boxElts[i].classList.remove("flagged");
    boxElts[i].innerHTML = "";
  }
  modalElt.classList.remove("hidden");
  playElt.innerHTML = "REPLAY";
  smileElt.innerHTML = smile;
  time = 0;
  flagCount = 10;
  flagElt.innerHTML = flagCount;
  timeElt.innerHTML = time;
  count = 0;
}
