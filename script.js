// Define HTML Elements
const border3 = document.getElementById('border-3');
// const mainData = document.querySelectorAll('main-data');
const imglogo = document.getElementById('img-logo');
const maintext = document.getElementById('main-text');
const score1 = document.getElementById('score-1');
const score2 = document.getElementById('score-2');

// Define game variables
const gridSize = 20;
let snake = [{x : 10, y : 10}];
let food = generateFood();
let highScore = 0;
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;

// Draw game map , snake , food 
function draw(){
    border3.innerHTML = '';
    drawSnake();
    drawFood();
    updateScore();
}

// draw Snake
function drawSnake(){
    if(gameStarted){
        snake.forEach((segment) => {
            const snakeElement = createGameElement('div', 'snake');
            setPosition(snakeElement, segment);
            border3.appendChild(snakeElement);
        })
    }    
}

// create a snake and food cube/div
function createGameElement(tag, className){
    const element = document.createElement(tag);
    // element.textContent = ":";
    // element.className = className; -> we can use both 
    element.classList.add(className);  // this one as well
    return element;
}

// set the position of snake and food
function setPosition(element, position){
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
    
}

// draw food function
function drawFood(){
    if(gameStarted){
        const foodElement = createGameElement('div', 'food');
        setPosition(foodElement, food);
        border3.appendChild(foodElement);
    }
}

// function for generate food
function generateFood(){
    const x = Math.floor(Math.random() * gridSize) + 1;
    const y = Math.floor(Math.random() * gridSize) + 1;
    return {x, y};
}

// testing draw function
// draw();

//moving the snake
function move(){
    const head = { ...snake[0] };
    switch(direction){
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }
    snake.unshift(head);

    if(head.x === food.x && head.y === food.y){
        food = generateFood();
        increaseSpeed();
        clearInterval(gameInterval); // clear past interval
        gameInterval = setInterval(() => {
            move();
            checkCollision();
            draw();
        }, gameSpeedDelay);
    }
    else{
        snake.pop();
    }
}

// Start game function
function startGame(){
    gameStarted = true;
    imglogo.style.display = 'none';
    maintext.style.display = 'none';
    gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay);
}

// keypress event listener
function handleKeyPress(event){
    if((!gameStarted && event.code === 'Space') || (!gameStarted && event.key === '')){
        startGame();
    }
    else{
        switch(event.key){
            case 'ArrowUp':
                direction = 'up';
                break;
            case 'ArrowDown':
                direction = 'down';
                break;
            case 'ArrowLeft':
                direction = 'left';
                break;
            case 'ArrowRight':
                direction = 'right';
                break;
        }
    }
}

document.addEventListener('keydown', handleKeyPress);

// increase speed of snake
function increaseSpeed(){
    if(gameSpeedDelay > 150){
        gameSpeedDelay -= 5;
    }
    else if(gameSpeedDelay > 100){
        gameSpeedDelay -= 3;
    }
    else if(gameSpeedDelay > 50){
        gameSpeedDelay -= 2;
    }
    else if(gameSpeedDelay > 25){
        gameSpeedDelay -= 1;
    }
}

// check collision with border and snake
function checkCollision(){
    const head = snake[0];
    if(head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize){
        resetGame();
    }
    else{
        for(let i=1; i<snake.length; i++){
            if(head.x === snake[i].x && head.y === snake[i].y){
                resetGame();
            }
        }
    }    
}

// restart the game again
function resetGame(){
    updateHighScore();
    stopGame();
    snake = [{x : 10, y : 10}];
    food = generateFood();
    gameSpeedDelay = 200;
    direction = 'right';
    updateScore();
}

function updateScore(){
    const currentScore = snake.length-1;
    score1.textContent = currentScore.toString().padStart(3,'0');
}

// stop game 
function stopGame(){
    clearInterval(gameInterval);
    gameStarted = false;
    imglogo.style.display = 'block';
    maintext.style.display = 'block';    
}

// updatehighscore tracker
function updateHighScore(){
    const currentScore = snake.length-1;
    if(currentScore > highScore){
        highScore = currentScore;
        score2.textContent = currentScore.toString().padStart(3,'0');
    }
    score2.style.display = 'block';
}
