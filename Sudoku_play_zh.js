var currentCellId;
var mousePos = {
  x: -1,
  y: -1
};
var guessTableOpen = false;
var isRecursionDone = false;
var generated = false;
var completeSolve = false;
var recursiveCalls = 0;
var difficultyNum = 17;
var maxGeneratedPerSquare = 2;
var cellValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];
var solveMatrix = new Array(9);
var playMatrix = new Array(9);
for (var y = 0; y < 9; y++) {
  solveMatrix[y] = new Array(9);
  playMatrix[y] = new Array(9);
  for (var z = 0; z < 9; z++) {
    solveMatrix[y][z] = {
      value: null,
      valueList: null
    };
    playMatrix[y][z] = {
      value: null,
      valueList: null
    };
  }
}

function checkPlayAnswer() {
  if (isPlayBoardValid() && isBoardComplete() && !generated) {
    alert("你赢了 ！");
  } else if (generated) {
    alert("你需要自己解决数独 ！");
  } else if (!isBoardComplete()) {
    alert("数独未被解决 ！");
  }
}
function isBoardComplete() {
  var ret = true;
  for (var i = 0; i < 81; i++) {
    var cellVal = getMatrixValue(i, playMatrix)
    if (isNaN(cellVal) || cellVal === null) {
      ret = false;
      break;
    }
  }
  return ret;
}

function solveCurrentPuzzle() {
  var cell = findMostConstrainedCell(playMatrix);
  if (!isPlayBoardValid()) {
    alert("该盘面无效");
  } else {
    while (!isRecursionDone && !completeSolve) {
      solveBoard(cell, playMatrix, true);
      recursiveCalls = 0;
    }
    if (isRecursionDone) {
      isRecursionDone = false;
      completeSolve = false;
      clearBoard(solveMatrix);
      generated = true;
    }
  }
}

function startPlayBoard() {
  getDifficulty();
  generated = false;
  var matrixNumCount = new Array(9);
  for (var i = 0; i < 9; i++) {
    matrixNumCount[i] = 0;
  }
  var numCount = 0;
  while (numCount < difficultyNum) {
    var matrixRow = Math.floor((Math.random() * 3));
    var matrixCol = Math.floor((Math.random() * 3));
    var matrixNum = (matrixRow * 3) + matrixCol;

    var matrixStart = matrixNum * 9;
    var randomPos = Math.floor((Math.random() * 9));
    var currentCell = matrixStart + randomPos;
    var randomValPos = Math.floor((Math.random() * 9));
    var val = getMatrixValue(currentCell, solveMatrix);
    if (isSafe(currentCell, val, playMatrix, true)) {
      if (matrixNumCount[matrixNum] < maxGeneratedPerSquare) {
        matrixNumCount[matrixNum]++;
      } else {
        continue;
      }
      setMatrixValue(currentCell, val, playMatrix);
      showVal(currentCell, val);
      numCount++;
    }
  }
}

function isPlayBoardValid() {
  var ret = true;
  for (var i = 0; i < 81; i++) {
    var checkVal = getMatrixValue(i, playMatrix);
    if ((!isSafe(i, checkVal, playMatrix, false)) && (checkVal !== null) && (document.getElementById(i).getAttribute("name") !== "generated")) {
      ret = false;
      break;
    }
  }
  return ret;
}

function solveBoard(cell, matrix, show) {

  recursiveCalls++;
  if (recursiveCalls > 400) {
    return false;
  }
  if (cell === false) {
    completeSolve = true;
    isRecursionDone = true;
    return true;
  }
  if (cell.valCount === 0) {
    completeSolve = false;
    return false;
  } else if (cell.valCount === 1) {
    if (isSafe(cell.cellNum, cell.valueList[0], matrix, false)) {
      setCellFromList(cell, cell.valueList[0], matrix);
      if (show) {
        showVal(cell.cellNum, cell.valueList[0]);
      }
    }
    if (solveBoard(findMostConstrainedCell(matrix), matrix, show)) {
      return true;
    }
  } else {
    var cellValueList = new Array(cell.valueList.length);
    var valLen = cell.valueList.length;
    var valList = cell.valueList;
    var pos = 0;
    do {
      var randPos = Math.floor(Math.random() * valList.length);
      if (cellValueList.indexOf(valList[randPos])) {
        cellValueList[pos] = valList[randPos];
        valList.splice(randPos, 1);
        pos++;
      }
    } while (pos < valLen);

    for (i in cellValueList) {

      if (isSafe(cell.cellNum, cellValueList[i], matrix, false)) {
        setCellFromList(cell, cellValueList[i], matrix);
        if (show) {
          showVal(cell.cellNum, cellValueList[i]);
        }
      }
      var result = solveBoard(findMostConstrainedCell(matrix), matrix, show);
      if (result) {
        return true;
      }
    }
  }

  setMatrixValue(cell.cellNum, null, matrix);
  setMatrixValueList(cell.cellNum, null, matrix);
  return false;
}

function findMostConstrainedCell(matrix) {
  var emptyCell = false;
  var minCell = {
    valCount: 10,
    cellNum: 0,
    valueList: [],
    x: 0,
    y: 0
  };
  for (var i = 0; i < 81; i++) {
    if (getMatrixValue(i, matrix) === null) {
      emptyCell = true;

      var validCellValues = getValidValues(i, matrix);
      setMatrixValueList(i, validCellValues, matrix);
      var valCount = validCellValues.length;
      if (valCount < minCell.valCount) {
        minCell.valCount = valCount;
        minCell.cellNum = i;
        minCell.valueList = validCellValues;
        minCell.x = findRow(i);
        minCell.y = findCol(i);
      }
      if (valCount === 1) {
        return minCell;
      }
    }
  }
  if (emptyCell) {
    return minCell;
  } else {
    return false;
  }
}

function setCellFromList(cell, val, matrix) {
  matrix[cell.x][cell.y].value = val;
  matrix[cell.x][cell.y].valueList = null;
}

function getValidValues(cellNum, matrix) {
  possibleValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  possibleValues = diffArray(possibleValues, getRowValues(cellNum, matrix));
  possibleValues = diffArray(possibleValues, getColValues(cellNum, matrix));
  possibleValues = diffArray(possibleValues, getSquareValues(cellNum, matrix));
  return possibleValues;
}

function getRowValues(cellNum, matrix) {
  var ret = [];
  var col = findCol(cellNum);
  for (var i = 0; i < 9; i++) {
    var tmpVal = getMatrixValueXY(i, col, matrix);
    if (tmpVal > 0) {
      ret[ret.length] = tmpVal;
    }
  }
  return ret;
}

function getColValues(cellNum, matrix) {
  var ret = [];
  var row = findRow(cellNum);
  for (var i = 0; i < 9; i++) {
    var tmpVal = getMatrixValueXY(row, i, matrix);
    if (tmpVal > 0) {
      ret[ret.length] = tmpVal;
    }
  }
  return ret;
}

function getSquareValues(cellNum, matrix) {
  var ret = [];
  var matrixMeta = getMatrixMeta(cellNum);
  for (var i = matrixMeta.start; i <= matrixMeta.end; i++) {
    var tmpVal = getMatrixValue(i, matrix);
    if (tmpVal > 0) {
      ret[ret.length] = tmpVal;
    }
  }
  return ret;
}

function getDifficulty() {
  var difficulty = document.getElementById("difficulty");
  difficultyNum = difficulty.options[difficulty.selectedIndex].value
  switch (difficultyNum) {
    case "52":
      maxGeneratedPerSquare = 6;
      break;
    case "43":
      maxGeneratedPerSquare = 5;
      break;
    case "34":
      maxGeneratedPerSquare = 4;
      break;
    case "25":
      maxGeneratedPerSquare = 3;
      break;
  }
}

function fillRandomSquares() {
  while (!isRecursionDone && !completeSolve) {
    initializeBoard(solveMatrix);
    initializeBoard(playMatrix);
    getDifficulty();
    var matrixNumCount = new Array(9);
    for (var i = 0; i < 9; i++) {
      matrixNumCount[i] = 0;
    }
    var numCount = 0;
    while (numCount < 17) {
      var matrixRow = Math.floor((Math.random() * 3));
      var matrixCol = Math.floor((Math.random() * 3));
      var matrixNum = (matrixRow * 3) + matrixCol;

      var matrixStart = matrixNum * 9;
      var randomPos = Math.floor((Math.random() * 9));
      var currentCell = matrixStart + randomPos;
      var randomValPos = Math.floor((Math.random() * 9));
      var randomVal = cellValues[randomValPos];
      if (isSafe(currentCell, randomVal, solveMatrix, true)) {
        if (matrixNumCount[matrixNum] < 2) {
          matrixNumCount[matrixNum]++;
        } else {
          continue;
        }
        setMatrixValue(currentCell, randomVal, solveMatrix);
        numCount++;
      }
    }
    solveBoard(findMostConstrainedCell(solveMatrix), solveMatrix, false);
    recursiveCalls = 0;
  }
  if (isRecursionDone) {
    isRecursionDone = false;
    completeSolve = false;
    startPlayBoard();
  }

}

function showVal(cellNum, val) {
  var input = document.getElementById('ec' + cellNum + '4').children;
  input[0].value = val;
  document.getElementById(cellNum).setAttribute("name", "generated");
}

function initializeBoard(matrix) {
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      matrix[i][j].value = null;
      matrix[i][j].valueList = null;
      var cellNum = findCellNum(i, j)
      for (var k = 0; k < 9; k++) {
        var input = document.getElementById('ec' + cellNum + '' + k).children;
        input[0].value = "";
      }
      document.getElementById(cellNum).setAttribute("name", "");
    }
  }
}

function clearBoard(matrix) {
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      matrix[i][j].value = null;
      matrix[i][j].valueList = null;
    }
  }
}

function isSafe(cellNum, val, matrix, checkSelf) {
  return (noDupsCol(cellNum, val, matrix, checkSelf) && noDupsRow(cellNum, val, matrix, checkSelf) && noDupsSquare(cellNum, val, matrix, checkSelf));
}

function noDupsCol(cellNum, val, matrix, checkSelf) {
  var ret = true;
  var col = findCol(cellNum);
  var row = findRow(cellNum);
  for (var i = 0; i < 9; i++) {
    if (!checkSelf) {
      if (i === row) {
        continue;
      }
    }
    var tmpVal = getMatrixValueXY(i, col, matrix);
    if (tmpVal !== null && val !== null && (tmpVal.toString() === val.toString())) {
      ret = false;
      break;
    }
  }
  return ret;
}

function noDupsRow(cellNum, val, matrix, checkSelf) {
  var ret = true;
  var row = findRow(cellNum);
  var col = findCol(cellNum);
  for (var i = 0; i < 9; i++) {
    if (!checkSelf) {
      if (i === col) {
        continue;
      }
    }
    var tmpVal = getMatrixValueXY(row, i, matrix);
    if (tmpVal !== null && val !== null && (tmpVal.toString() === val.toString())) {
      ret = false;
      break;
    }
  }
  return ret;
}


function noDupsSquare(cellNum, val, matrix, checkSelf) {
  var matrixMeta = getMatrixMeta(cellNum);
  var ret = true;
  for (var i = matrixMeta.start; i <= matrixMeta.end; i++) {
    if (!checkSelf) {
      if (i === cellNum) {
        continue;
      }
    }
    var tmpVal = getMatrixValue(i, matrix);
    if (tmpVal !== null && val !== null && (tmpVal.toString() === val.toString())) {
      ret = false;
      break;
    }
  }
  return ret;
}

function getMatrixValueXY(x, y, matrix) {
  var ret = matrix[x][y].value;
  return ret;
}

function getMatrixValue(cellNum, matrix) {
  var row = findRow(cellNum);
  var col = findCol(cellNum);
  var ret = matrix[row][col].value;
  return ret;

}

function setMatrixValue(cellNum, val, matrix) {
  var row = findRow(cellNum, matrix);
  var col = findCol(cellNum, matrix);
  matrix[row][col].value = val;
}

function setMatrixValueList(cellNum, valList, matrix) {
  var row = findRow(cellNum);
  var col = findCol(cellNum);
  matrix[row][col].valueList = valList;
}

function findCellNum(x, y) {
  var matrixObj = {
    num: 0,
    start: 0,
    end: 0
  };
  var cellArr = new Array();
  var rowPos = Math.floor(x / 3);
  var colPos = Math.floor(y / 3);
  matrixObj.num = ((rowPos * 3) + colPos);
  matrixObj.start = matrixObj.num * 9;
  matrixObj.end = matrixObj.start + 8;

  for (var i = matrixObj.start; i <= matrixObj.end; i++) {
    cellArr.push(i);
  }
  return cellArr[((x % 3) * 3) + (y % 3)];

}

function findCol(cellNum) {
  matrixMeta = getMatrixMeta(cellNum);
  var matrixCol = Math.floor(matrixMeta.num % 3) * 3;
  var numInMatrix = cellNum % 9;
  var posInMatrixCol = numInMatrix % 3;
  return matrixCol + posInMatrixCol;
}

function findRow(cellNum) {
  matrixMeta = getMatrixMeta(cellNum);
  var matrixRow = Math.floor(matrixMeta.num / 3) * 3;
  var numInMatrix = cellNum % 9;
  var posInMatrixRow = Math.floor(numInMatrix / 3);
  return matrixRow + posInMatrixRow;

}

function getMatrixMeta(cellNum) {
  var matrixObj = {
    num: 0,
    start: 0,
    end: 0
  };
  matrixObj.num = Math.floor(cellNum / 9);
  matrixObj.start = matrixObj.num * 9;
  matrixObj.end = matrixObj.start + 8;
  return matrixObj;
}

function printBoard(matrix) {
  var line = "---------------------";
  console.log(line);
  for (var i = 0; i < 9; i++) {
    line = "|";
    for (var j = 0; j < 9; j++) {
      if (j === 8) {
        line = line + " " + matrix[i][j].value + " ";
      } else if (((j % 3) === 0) && j !== 0) {
        line = line + "|" + matrix[i][j].value;
      } else {
        line = line + " " + matrix[i][j].value;
      }
    }
    if (((i % 3) === 0) && i !== 0) {
      var line2 = "---------------------";
      console.log(line2);
    }
    line = line + "|";
    console.log(line);

  }
  var line = "---------------------";
  console.log(line);
}

function diffArray(a, b) {
  var seen = [],
    diff = [];
  for (var i = 0; i < b.length; i++)
    seen[b[i]] = true;
  for (var i = 0; i < a.length; i++)
    if (!seen[a[i]])
      diff.push(a[i]);
  return diff;
}

$(document).ready(
  function() {

    for (var i = 0; i <= 80; i++) {
      var innerHTML =
        "<div id='subMatrix'>" +
        "	<div class='subMatrixRow' id='subMatrixRow1'>" +
        "		<div id='ec" + i + "0' class='editSubCell'>" +
        "			<input type='text' class='subInput' maxlength='1' size='1' min='1' readonly>" +
        "		</div>" +
        "		<div id='ec" + i + "1' class='editSubCell'>" +
        "			<input type='text' class='subInput' maxlength='1' size='1' min='1' readonly>" +
        "		</div>" +
        "		<div id='ec" + i + "2' class='editSubCell'>" +
        "			<input type='text' class='subInput' maxlength='1' size='1' min='1' readonly>" +
        "		</div>" +
        "	</div>" +
        "	<div class='subMatrixRow' id='subMatrixRow2'>" +
        "		<div id='ec" + i + "3' class='editSubCell'>" +
        "			<input type='text' class='subInput' maxlength='1' size='1' min='1' readonly>" +
        "		</div>" +
        "		<div id='ec" + i + "4' class='editMainSubCell'>" +
        "			<input type='text' class='subInput' maxlength='1' size='1' min='1' readonly>	" +
        "		</div>" +
        "		<div id='ec" + i + "5' class='editSubCell'>" +
        "			<input type='text' class='subInput' maxlength='1' size='1' min='1' readonly>" +
        "		</div>" +
        "	</div>" +
        "	<div class='subMatrixRow' id='subMatrixRow3'>" +
        "		<div id='ec" + i + "6' class='editSubCell'>" +
        "			<input type='text' class='subInput' maxlength='1' size='1' min='1' readonly>" +
        "		</div>" +
        "		<div id='ec" + i + "7' class='editSubCell'>" +
        "			<input type='text' class='subInput' maxlength='1' size='1' min='1' readonly>" +
        "		</div>" +
        "		<div id='ec" + i + "8' class='editSubCell'>" +
        "			<input type='text' class='subInput' maxlength='1' size='1' min='1' readonly>" +
        "		</div>" +
        "	</div>" +
        "</div>";
      $('div#' + i).html(innerHTML);
    }
    fillRandomSquares();
    $('#errorButton').click(
      function() {
        for (var i = 0; i < 81; i++) {
          var checkVal = getMatrixValue(i, playMatrix);
          var matrixVal = $('#' + i).parent().parent().attr("class");
          if (matrixVal === "matrix1") {
            var colorVal = "#feffef";
          } else if (matrixVal === "matrix2") {
            var colorVal = "#f98919";
          }
          if ((!isSafe(i, checkVal, playMatrix, false)) && (checkVal !== null) && ($("#" + i).attr("name") !== "generated")) {
            for (var j = 0; j < 3; j++) {
              $('#' + i).animate({
                'backgroundColor': '#0000FF'
              }, 250);
              $('#' + i).delay(250).queue(
                function() {
                  $(this).dequeue();
                }
              );
              $('#' + i).animate({
                'backgroundColor': colorVal
              }, 250);
              $('#' + i).delay(250).queue(
                function() {
                  $(this).dequeue();
                }
              );
            }

          }

        }
      });

    $('.matrixCell').hover(
      function() {
        var curDiv = $(this).attr("id");
        var matrix = $(this).parent().parent().attr("class");
        var back;
        var fore;
        if (matrix === "matrix1") {
          $('#' + curDiv).addClass("hoverBackground1");
          back = "#f98919";
          fore = "#feffef";
        } else if (matrix === "matrix2") {
          $('#' + curDiv).addClass("hoverBackground2");
          back = "#feffef";
          fore = "#f98919";
        }

        $('#' + curDiv).stop().animate({
          backgroundColor: back
        }, 500);
        $('#ec' + curDiv + "4 input").stop().animate({
          'color': fore
        }, 500);

      },
      function() {
        var curDiv = $(this).attr("id");
        var matrix = $(this).parent().parent().attr("class");
        var back;
        if (matrix === "matrix1") {
          $('#' + curDiv).removeClass("hoverBackground1");
          back = "#feffef";
          fore = "#f98919";
        } else if (matrix === "matrix2") {
          $('#' + curDiv).removeClass("hoverBackground2");
          back = "#f98919";
          fore = "#feffef";
        }
        $('#' + curDiv).stop().animate({
          backgroundColor: back
        }, 500);
        $('#ec' + curDiv + "4 input").stop().animate({
          'color': fore
        }, 500);

      }
    );

    $('.matrixCell').click(

      function(e) {
        if ($(this).attr("name") !== "generated") {

          var curDiv = $(this).attr("id");
          currentCellId = curDiv;
          var top = $('#' + curDiv).position().top + 36.5;
          var left = $('#' + curDiv).position().left + 36.5;
          var matrix = $(this).parent().parent().attr("class");
          if (matrix === "matrix1") {
            $('#cellPopUp').css("background-color", "#f98919");
            $('.guessEdit input').css({
              "background-color": "#feffef",
              "color": "#feffef"
            });
            $('.mainGuessEdit input').css({
              "background-color": "feffef",
              "color": "#f98919"
            });
          } else if (matrix === "matrix2") {
            $('#cellPopUp').css("background-color", "#feffef");
            $('.guessEdit input').css({
              "background-color": "#f98919",
              "color": "#feffef"
            });
            $('.mainGuessEdit input').css({
              "background-color": "#f98919",
              "color": "#feffef"
            });
          }
          $('#cellPopUp').css({
            "display": "block",
            "top": top,
            "left": left
          });
          $('#cellPopUp').animate({
            height: '175px',
            width: '175px',
            top: '-=87.5px',
            left: '-=87.5px'
          }, 250);
          $('#guessCardTable').delay(250).queue(
            function() {
              guessTableOpen = true;
              $(this).css("display", "block");
              $('#cellPopUp').stop();
              $(this).dequeue();
              $('#cellPopUp').dequeue();
              $('#mainGuessInput').focus();
            }
          );

          var cellInputArr = [];
          $('#' + currentCellId + ' input').each(
            function() {
              if (!$(this).val()) {
                cellInputArr.push(0);
              } else {
                cellInputArr.push($(this).val());
              }
            }
          )
          var guessInputArr = document.getElementsByClassName('guessInput');
          for (var i = 0; i <= 8; i++) {

            if (cellInputArr[i] !== 0) {
              guessInputArr[i].value = cellInputArr[i];
            }
          }

        }

      }
    );

    $('.guessInput').on('input',
      function() {
        var currentInput = $(this).parent().attr('id');
        var inputVal = $(this).val();
        var boxLoc = currentInput.substring(1, currentInput.length);
        var subCell = "ec" + currentCellId + '' + boxLoc;
        $('#' + subCell + ' > input').val(inputVal);

        if (boxLoc === "4") {
          setMatrixValue(currentCellId, inputVal, playMatrix);
        }

      });

    $('#guessCardTable').mouseleave(
      function() {
        guessTableOpen = false;
        var val = $('#ec' + currentCellId + '4').val();
        var x = Math.floor(currentCellId / 8);
        var y = currentCellId % 8;

        $('#cellPopUp').find('input:text').val('');
        $('#guessCardTable').css("display", "none");
        $('#cellPopUp').animate({
          height: '0px',
          width: '0px',
          top: '+=87.5px',
          left: '+=87.5px'
        }, 250);
        $('#cellPopUp').delay(250).queue(
          function() {
            $(this).css({
              "display": "none",
              "top": "0px",
              "left": "0px",
              height: '0px',
              width: '0px'
            });
            $(this).stop();
            $(this).dequeue();
          }
        );
      }
    );
    $(document).mousemove(
      function(e) {
        mousePos.x = e.pageX;
        mousePos.y = e.pageY;

        var xMin = $('#cellPopUp').offset().left;
        var xMax = xMin + 150;
        var yMin = $('#cellPopUp').offset().top;
        var yMax = yMin + 168;
        var isOut = false;
        $('#mouseXY').text("MouseX: " + mousePos.x + " MouseY: " + mousePos.y);

        if (guessTableOpen) {
          $('#guessXYmin').text("GXMin: " + xMin + " GYMin: " + yMin);
          $('#guessXYmax').text("GXMax: " + xMax + " GYMax: " + yMax);
          if ((mousePos.x < xMin || mousePos.x > xMax) && (mousePos.y < yMin || mousePos.y > yMax)) {
            isOut = true;
            guessTableOpen = false;
            $('#isOut').text("Is Out: " + isOut);

            $('#cellPopUp').find('input:text').val('');
            $('#guessCardTable').css("display", "none");
            $('#cellPopUp').animate({
              height: '0px',
              width: '0px',
              top: '+=87.5px',
              left: '+=87.5px'
            }, 250);
            $('#cellPopUp').delay(250).queue(
              function() {
                $(this).css({
                  "display": "none",
                  "top": "0px",
                  "left": "0px",
                  height: '0px',
                  width: '0px'
                });
                $(this).stop();
                $(this).dequeue();
              }
            );
          }
        }

      });
  });