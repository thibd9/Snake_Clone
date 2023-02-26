/*================ Création du Contexte du Canva ================*/

/* le Canva que l'on utlise est un élement en 2d */ 

const canvas = document.getElementById('canvas');

const ctx = canvas.getContext('2d');

ctx.fillStyle = "white";
ctx.strokeStyle = "black";
ctx.fillRect(0,0,canvas.clientWidth, canvas.height);
ctx.strokeRect(0,0,canvas.clientWidth, canvas.height);

/*================ Création des Variables ================*/

// Vitesse sur X (vitesse en pixels)
vx = 10;

// Vitesse sur Y (vitesse en pixels)
// La valeur est négative car il s'agit de l'axe des Y
vy = 0;

// Pomme sur l'axe X
let AppleX = 0;

// Pomme sur l'axe Y
let AppleY = 0;

// Score du Joueu
let score = 0;

// Bug lié à la direction
let BugDirection = false;

// Conserver les serpent en cas de fin du jeu
let stopGame = false;

/*================ Création du Serpent ================*/

/* Ici on déclare un objet qui represente notre serpent */
/* x et y sont les coordonnées de création des cubes represetant notre serpent */

let snake = [ 
    {x:140, y:150},
    {x:130, y:150},
    {x:120, y:150},
    {x:110, y:150},
]

/*================ Création de l'Animation Globale ================*/

/* La fonction animation nous sert à appeler toutes les fonctions principales */ 

function animation() {

    /* si le joueur perd 'stopGame' passe à true */

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

/*================ Les différentes fonctions ================*/

/*--===== CleanCanvas() =====--*/

/* cette fonction nous sert à redessiner notre canva avec les nouvelles valeurs */

function CleanCanvas() {

    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.fillRect(0,0,canvas.clientWidth, canvas.height);
    ctx.strokeRect(0,0,canvas.clientWidth, canvas.height);

}

/*--===== SnakePieces() =====--*/

/* cette fonction nous sert à definir les différentes parties de  notre serpent */
 
function SnakePieces(piece) {

    ctx.fillStyle = "#00fe14";
    ctx.strokeStyle = 'black';
    ctx.fillRect(piece.x, piece.y, 10, 10);
    ctx.strokeRect(piece.x, piece.y, 10, 10);

}

/*--===== DrawTheSnake() =====--*/

/* cette fonction nous sert dessiner notre serpent en fonction des valeurs de l'objet 'snake' */

function DrawTheSnake() {

    snake.forEach((piece) => {
        SnakePieces(piece);
    })

}

/*--===== MoveTheSnake() =====--*/

/* cette fonction fait bouger le serpent en modifiant la valeur de l'objet 'snake' */

function MoveTheSnake() {

    /* la constante head définie la tete du serpent */

    const head = {x: snake[0].x + vx, y: snake[0].y + vy};

    /* ajoute une nouvelle tete au serpent pour donner l'illusion qu'il avance */

    snake.unshift(head);

    /* si le serpent se mord la queue ou touche les bords le jeu s'arrete */
    /* dans ce cas là aucune tete n'est rajoutée et le serpent s'arrete là ou il est */ 

    if(EndGame()) {
        snake.shift(head);
        Restart();
        stopGame = true;
        return;
    }

    /* sinon le jeu continue une nouvelle tete est créée et le serpent devient plus long */

    /* la constante SnakeEatApple définie la position de la tete du serpent ainsi que celle de la pomme */

    const SnakeEatApple = snake[0].x === AppleX && snake[0].y === AppleY;

    /* si le serpent mange la pomme, la variable 'score' (l.30) augmente de 10 */

    if(SnakeEatApple) {

        score += 10;

        document.getElementById('score').innerHTML = score;

        CreateApple();

    } else {

        snake.pop();

    }

}

/* ici l'on gère l'appuie sur les touches du clavier pour modifier la direction du serpent */

document.addEventListener('keydown', ChangeDirection);

/*--===== ChangeDirection() =====--*/

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

/* La fonction random() calcule une valeur aléatoire d'apparition de la pomme */

function random() {

    return Math.round((Math.random() * 290) / 10) * 10;

}

/*--===== CreateApple() =====--*/

/* les coordonnées de création de la pomme sont determinées aléatoirement */ 

function CreateApple() {

    AppleX = random();
    AppleY = random();

    /* Si le serpent entre en contact avec la pomme, une nouvelle pomme est créée */

    snake.forEach(function(part) {

        const SnakeOnApple = part.x == AppleX && part.y == AppleY;

        if(SnakeOnApple) {

            CreateApple();

        }

    })

}

/*--===== DrawApple() =====--*/

/* cette fonction se charge de dessiner la pomme sur le canva */

function DrawApple() {

    ctx.fillStyle = 'red';
    ctx.strokeStyle = "darkred";
    // ctx.fillRect(AppleX, AppleY, 10, 10);
    ctx.beginPath();
    ctx.arc(AppleX + 5, AppleY + 5, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

}

/*--===== EndGame() =====--*/

/* cette fonction determine les conditions de fin du jeu (défaite) */ 

function EndGame() {

    /* SnakeBody définie les parties du serpent qui ne sont pas la tete */

    let SnakeBody = snake.slice(1, -1);

    let bitten = false;

    SnakeBody.forEach(piece => {

        /* si la tete entre en contact avec n'importe laquelle des parties du serpent */
        /* la valeur de bitten passe à true */ 

        if(piece.x === snake[0].x && piece.y === snake[0].y){
            bitten = true;
        }

    })

    /* ces constantes servent à determiner si la tete du serpent touche les murs */

    const TouchLeftWall = snake[0].x < -1;
    const TouchRightWall = snake[0].x > canvas.width -10;
    const TouchTopWall = snake[0].y < -1;
    const TouchBottomWall = snake[0].y > canvas.height - 10;

    let GameOver = false;

    /* si le serpent se mord ou touche les murs, la variable GameOver passe à true */

    if(bitten || TouchLeftWall || TouchRightWall || TouchTopWall || TouchBottomWall) {
        GameOver = true;
    }

    return GameOver;

}

/*--===== Restart() =====--*/
  
/* la fonction restart sert juste lorsque le joueur appuie sur la barre d'espace à rzlancer le jeu */

function Restart() {

    const restart = document.getElementById('recommencer');
    
    restart.style.display = "block";

    document.addEventListener('keydown', (event) => {
        if(event.keyCode === 32) {
            document.location.reload(true);
        }
    })

}