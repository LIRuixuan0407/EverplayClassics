var readyStateCheckInterval = setInterval( function() {
    if (document.readyState === "complete") {
        clearInterval(readyStateCheckInterval);
        initGame();
    }
}, 10);

var bgLoc = {x:0, y:0, width:32, height:32};
var groundLoc = {x:0, y:31, width:35, height:1};
var instructionsLoc = {x:6, y:49, width:17, height:21};
var gameOverLoc = {x:6, y:32, width:21, height:17};
var birdLocs = [{x:32, y:0, width:5, height:3}, {x:32, y:3, width:5, height:3}, {x:32, y:6, width:5, height:3}];
var tubeLoc = {x:0, y:32, width:6, height:44};
var hiscoreLoc = {x:6, y:70, width:30, height:10};
var scoreLocs = [32, 9, 27, 32, 32, 32, 27, 41, 32, 41, 27, 50, 32, 50, 27, 59, 32, 59, 32, 18];

var flappyBirdSource = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAABQCAYAAACecbxxAAADuElEQVR4nO1av0scQRT+Rq7Kn+AVprO4yx0HNnYRguhZSIKFTdKlSCEp0kWIXBG7VOlSGLgqhQQtxCCB2NlIxHiNhIApDORIGUIK46TwZp2dnR9vdsfbEfxgud35dd+97817M3PLHr445SgRb1bGkvvfOMbd1hIbKZEPAGCiNc3E/d/7T/Dh9hlPSHU7o6nG3c5ocsn1artQxE5fjmHmpMJmTiqsYmv8aOVH6r7bGU2VhcL+wQ4HgN3lHZ6RT7aMCkEotKUEIeBSPla2o3/eeMwAYHPhmM+vjzMAKN3RgQtrVZe/Y/fgNQcAq08NGxfygZdOav9gh0+0ptnmwjGfP6kwIAJLTbSmAYDPr48DQDzy9Q63kvt6cy4ORwcuyAhEQ0rGDSkqbkjZIM/AKEKCPPOAiCwlIwpLXYvgmVjq1cqfpPBZ51aqg1xHbeNbL4P1/30tdZE31Xqaka/y9udGeYwkIsClb8XgU2xwJYiBVAZRkRIyRhGnBkgkjMpSAjekyDh/1+Rr/UV+9usbH+b9Wn8xU1drtFFrtMFqjTaOnp/y83vvMfLxAdinL6jvzQqn84n2zNFeV6/t45x9agrQPQ+mMhftde3U8XRlopzkU/XmXGoQdVEmBpUH1/XT9dW1C+LoisV0YMqnFSRSvcOtjBWo/fKMT5YvD3z6yRLmkk9nAQcBrnyq5SmQ5fMgkOqn9jVNCrmtLU6VtiK1xilTTDLFIpNFHTMzA6d8rsF0MczWR8gk/wBV0qEnZBdpIAApm8PmRWFSpjRisoaJtHfwlL/Q02mZStCUD1O5rze5nZn6cplLCopcjvrMFssaEkwZ3VRvks60TDGyrDXatvo8AdS2EtCNl1lQBlnkyc85kCFKDp4U2SgwBU+5zGWpK8mBLl+NcosVZD3lG8FNS5pCuc8V/Fx9XfKRDjh0Tq6ZAKRNAQUUUgwADxUKTFLL5a7gKZDaaMr3UhnFUqSZTPWpYNJQMPRDM53smdPh3uQ251MNyBsHAPIhB+kLqNAREeVJRK/vzbKjqfQLE6bdjC3V6NojKzvpNCfXbsZWLz/7wGvl6QqMRZKzqd/1zH1FdyZUeP0z6pIjb3K2TRpqnEpmo3o8mNPBreHGa+Pg2iiESs5US5FOdS3tfWB/J093yuITpyinMjrpC+c+isSUfCcjVJwypRPfMYK+kxdix8NBfamLek7gcw7qGqMCAHdWqwyrSwCqg+sSOgeV6yjEdePZgudV5b5CchaafRQpKFZU+9g2Dr5/k4UC+w8FO3lHRA9lvAAAAABJRU5ErkJggg==";
var spriteSheetImage = new Image();
spriteSheetImage.src = flappyBirdSource;
var spriteSheetCanvas = document.createElement("canvas");
spriteSheetCanvas.width = spriteSheetImage.width;
spriteSheetCanvas.height = spriteSheetImage.height;
var spriteSheetContext = spriteSheetCanvas.getContext("2d");
spriteSheetContext.drawImage(spriteSheetImage, 0, 0);

var renderCanvas = document.createElement("canvas");
renderCanvas.width = renderCanvas.height = 32;
var renderContext = renderCanvas.getContext("2d");
renderContext.globalCompositeOperation = "destination-over";
var collisionCanvas = document.createElement("canvas");

function drawSpriteSheetImage(context, locRect, x, y){
    context.drawImage(spriteSheetImage, locRect.x, locRect.y, locRect.width, locRect.height, x, y, locRect.width, locRect.height);
}

var canvas, context, gameState, score, groundX = 0, birdY, birdYSpeed, birdX = 5, birdFrame = 0, activeTube, tubes = [], collisionContext, scale, scoreLoc = {width:5, height:9}, hiScore = 0;
var HOME = 0, GAME = 1, GAME_OVER = 2, HI_SCORE = 3;

function initGame(){
    canvas = document.getElementById("gameCanvas");
    context = canvas.getContext("2d");
    scale = Math.floor(Math.min(window.innerHeight, window.innerWidth) / 32);
    canvas.width = scale * 32;
    canvas.height = scale * 32;
    canvas.style.left = window.innerWidth / 2 - (scale * 32) / 2 + "px";
    canvas.style.top = window.innerHeight / 2 - (scale * 32) / 2 + "px";
    window.addEventListener( "keydown", handleUserInteraction, false );
    canvas.addEventListener('touchstart', handleUserInteraction, false);
    canvas.addEventListener('mousedown', handleUserInteraction, false);
    collisionCanvas.width = birdX + 8;
    collisionCanvas.height = 32;
    collisionContext = collisionCanvas.getContext("2d");
    collisionContext.globalCompositeOperation = "xor";
    startGame();
    setInterval(loop, 40);
}

function startGame(){
    gameState = HOME;
    birdYSpeed = score = 0;
    birdY = 14;
    for(var i = 0; i < 2; i++){
        tubes[i] = {x : Math.round(48 + i * 19) };
        setTubeY(tubes[i]);
    }
}

function loop(){
    switch(gameState){
        case HOME: renderHome();
            break;
        case GAME : renderGame();
            break;
        case GAME_OVER: renderGameOver();
            break;
        case HI_SCORE : renderHiScore();
            break;
    }
}

function handleUserInteraction(event){
    switch(gameState){
        case HOME: gameState = GAME;
            break;
        case GAME : birdYSpeed = -1.4;
            break;
        case HI_SCORE: startGame();
            break;
    }
    if(event){
        event.preventDefault();
    }
}

function renderHome(){
    renderContext.clearRect(0,0,32,32);
    drawSpriteSheetImage(renderContext, instructionsLoc, 32 - instructionsLoc.width - 1, 1);
    updateBirdHome();
    renderGround(true);
    drawSpriteSheetImage(renderContext, bgLoc, 0, 0);
    renderToScale();
}

function renderGame(){
    renderContext.clearRect(0,0,32,32);
    collisionContext.clearRect(0,0,collisionCanvas.width, collisionCanvas.height);
    renderScore(score, renderScoreXGame, 1);
    renderGround(true);
    renderTubes();
    updateBirdGame();
    checkCollision();
    drawSpriteSheetImage(renderContext, bgLoc, 0, 0);
    renderToScale();
}

function renderGameOver(){
    renderContext.clearRect(0, 0, 32, 32);
    drawSpriteSheetImage(renderContext, gameOverLoc, 5, 7 - birdFrame);
    renderGround();
    drawSpriteSheetImage(renderContext, bgLoc, 0, 0);
    renderToScale();
    if(++score % 8 == 0){
        birdFrame++;
        birdFrame %= 2;
    }
}

function renderHiScore(){
    renderContext.clearRect(0, 0, 32, 32);
    drawSpriteSheetImage(renderContext, hiscoreLoc, 1, 5);
    renderScore(hiScore, renderScoreXHiScore, 16);
    renderGround();
    drawSpriteSheetImage(renderContext, bgLoc, 0, 0);
    renderToScale();
}

function renderToScale(){
    var i, data = renderContext.getImageData(0,0,32, 32).data;
    for(i=0; i<data.length; i+=4){
        context.fillStyle = "rgb("+data[i]+","+data[i+1]+","+data[i+2]+")";
        context.fillRect(((i/4) % 32) * scale, Math.floor(i / 128) * scale, scale, scale);
    }
}

function checkCollision(){
    if(birdX == tubes[activeTube].x + 6){
        score++;
    }
    var collisionData = collisionContext.getImageData(birdX, birdY, 5, 3).data;
    var data = renderContext.getImageData(birdX, birdY, 5, 3).data;
    for(var i = 0; i< collisionData.length; i+=4){
        if(collisionData[i+3] != data[i+3]){
            gameState = GAME_OVER;
            if(score > hiScore){
                hiScore = score + 0;
            }
            setTimeout(function(){gameState = HI_SCORE}, 2500);
            break;
        }
    }
}

function renderScore(score, xFunction, y){
    var parts = score.toString().split("");
    var i, index, length = parts.length;
    for(var i=0; i<length; i++){
        index = parseInt(parts.pop())*2;
        scoreLoc.x = scoreLocs[index];
        scoreLoc.y = scoreLocs[index + 1];
        
        drawSpriteSheetImage(renderContext, scoreLoc, xFunction(i, length), y);
    }
}

function renderScoreXGame(index, total){
    return 25 - 5 * index;
}

function renderScoreXHiScore(index, total){
    return 12 + Math.floor((total/2)*5) - 5 * index;
}

function renderGround(move){
    if(move && --groundX < bgLoc.width - groundLoc.width){
        groundX = 0;
    }
    drawSpriteSheetImage(renderContext, groundLoc, groundX, 31);
}

function updateBirdHome(){
    drawSpriteSheetImage(renderContext, birdLocs[birdFrame], birdX, birdY);
    birdFrame++;
    birdFrame %= 3;
}

function updateBirdGame(){
    birdY = Math.round(birdY + birdYSpeed);
    birdYSpeed += .25;
    if(birdY < 0){
        birdY = 0;
        birdYSpeed = 0;
    }
    if(birdY + 3 > bgLoc.height){
        birdY = 28;
        birdYSpeed = 0;
    }
    renderContext.save();
    collisionContext.save();
    renderContext.translate(birdX, birdY);
    collisionContext.translate(birdX, birdY);
    drawSpriteSheetImage(renderContext, birdLocs[birdFrame], 0, 0);
    drawSpriteSheetImage(collisionContext, birdLocs[birdFrame], 0, 0);
    renderContext.restore();
    collisionContext.restore();
    birdFrame++;
    birdFrame %= 3;
}

function renderTubes(){
    var i, tube;
    activeTube = tubes[0].x < tubes[1].x ? 0 : 1;
    for(i= 0; i < 2;i++){
        tube = tubes[i];
        if(--tube.x <= -6 ){
            tube.x = 32;
            setTubeY(tube);
        }
        drawSpriteSheetImage(renderContext, tubeLoc, tube.x, tube.y );
        drawSpriteSheetImage(collisionContext, tubeLoc, tube.x, tube.y );
    }
}

function setTubeY(tube){
    tube.y = Math.floor(Math.random() * (bgLoc.height - tubeLoc.height) );
}