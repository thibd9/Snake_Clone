const canvas = document.getElementById('canvas');

const ctx = canvas.getContext('2d');

ctx.fillStyle = "white";
ctx.strokeStyle = "black";
ctx.fillRect(0,0,canvas.clientWidth, canvas.height);
ctx.strokeRect(0,0,canvas.clientWidth, canvas.height);

// Variables

// Vitesse sur X (vitesse en pixels)

vx = 10;

// Vitesse sur X (vitesse en pixels)
// La valeur est négative car il s'agit de l'axe des Y

vy = 0;

// Pomme sur l'axe X

let AppleX = 0;

// Pomme sur l'axe Y

let AppleY = 0;

// Score du Joueur

let score = 0;

// Bug lié à la direction

let BugDirection = false;

// Conserver les serpent en cas de fin du jeu

let stopGame = false;

let snake = [ 
    {x:140, y:150},
    {x:130, y:150},
    {x:120, y:150},
    {x:110, y:150},
]

function animation() {

    if(stopGame === true) {

        return;

    } else {

        setTimeout(function() {

            BugDirection = false;
    
            CleanCanvas();
    
            DrawApple();
    
            MoveTheSnake();
    
            if(EndGame()){
                Restart();
                return;
            }
     
            DrawTheSnake();
    
            animation();
    
        }, 100);

    }

}

animation();

CreateApple();

function CleanCanvas() {

    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.fillRect(0,0,canvas.clientWidth, canvas.height);
    ctx.strokeRect(0,0,canvas.clientWidth, canvas.height);

}
 
function SnakePieces(piece) {

    ctx.fillStyle = "#00fe14";
    ctx.strokeStyle = 'black';
    ctx.fillRect(piece.x, piece.y, 10, 10);
    ctx.strokeRect(piece.x, piece.y, 10, 10);

}

function DrawTheSnake() {

    snake.forEach((piece) => {
        SnakePieces(piece);
    })

}

function MoveTheSnake() {

    const head = {x: snake[0].x + vx, y: snake[0].y + vy};
    snake.unshift(head);

    if(EndGame()) {
        snake.shift(head);
        Restart();
        stopGame = true;
        return;
    }

    // snake.pop();
    const SnakeEatApple = snake[0].x === AppleX && snake[0].y === AppleY;

    if(SnakeEatApple) {

        score += 10;

        document.getElementById('score').innerHTML = score;

        CreateApple();

    } else {

        snake.pop();

    }

}

DrawTheSnake();

document.addEventListener('keydown', ChangeDirection);

function ChangeDirection(event) {

    //console.log(event);

    // éviter le bug
    if(BugDirection) return;

    BugDirection = true;

    const ARROW_LEFT = 37;
    const ARROW_RIGHT = 39;
    const ARROW_UP = 38;
    const ARROW_DOWN = 40;

    const direction = event.keyCode;

    const goUp = vy === -10;
    const goDown = vy === 10;
    const goRight = vx === 10;
    const goLeft = vx === -10;

    if(direction === ARROW_LEFT && !goRight) {
        vx = -10; 
        vy = 0;
    }

    if(direction === ARROW_UP && !goDown) {
        vx = 0; 
        vy = -10;
    }

    if(direction === ARROW_RIGHT && !goLeft) {
        vx = 10; 
        vy = 0;
    }

    if(direction === ARROW_DOWN && !goUp) {
        vx = 0; 
        vy = 10;
    }

}

function random() {

    return Math.round((Math.random() * 290) / 10) * 10;

}

function CreateApple() {

    AppleX = random();
    AppleY = random();

    snake.forEach(function(part) {

        const SnakeOnApple = part.x == AppleX && part.y == AppleY;

        if(SnakeOnApple) {

            CreateApple();

        }

    })

}

function DrawApple() {

    ctx.fillStyle = 'red';
    ctx.strokeStyle = "darkred";
    // ctx.fillRect(AppleX, AppleY, 10, 10);
    ctx.beginPath();
    ctx.arc(AppleX + 5, AppleY + 5, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

}

function EndGame() {

    let SnakeBody = snake.slice(1, -1);

    let bitten = false;

    SnakeBody.forEach(piece => {

        if(piece.x === snake[0].x && piece.y === snake[0].y){
            bitten = true;
        }

    })

    const TouchLeftWall = snake[0].x < -1;
    const TouchRightWall = snake[0].x > canvas.width -10;
    const TouchTopWall = snake[0].y < -1;
    const TouchBottomWall = snake[0].y > canvas.height - 10;

    let GameOver = false;

    if(bitten || TouchLeftWall || TouchRightWall || TouchTopWall || TouchBottomWall) {
        GameOver = true;
    }

    return GameOver;

}

function Restart() {

    const restart = document.getElementById('recommencer');
    
    restart.style.display = "block";

    document.addEventListener('keydown', (event) => {
        if(event.keyCode === 32) {
            document.location.reload(true);
        }
    })

}