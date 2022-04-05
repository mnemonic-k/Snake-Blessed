const blessed = require('blessed');
const contrib = require('blessed-contrib');

const snake = [{x:10, y:0}, {x:9, y:0}, {x:8, y:0}, {x:6, y:0},  {x:5, y:0}, {x:4, y:0},  {x:3, y:0} ] 
let direction = "right"
const fruite = {}
let score = 0
let timer

  const screen = blessed.screen()

  screen.key(['escape', 'q'], function(ch, key) {
    return process.exit(0);
  })
  screen.key(['up', 'down', 'left', 'right'], function(ch, key) {
    if (key.name === 'up' ){
      direction = "up"
    }
    if (key.name === 'down' ){
      direction = "down"
    }
    if (key.name === 'left' ){
      direction = "left"
    }
    if (key.name === 'right' ){
      direction = "right"
    }
  })

  let scoreBox = contrib.markdown()
  screen.append(scoreBox)
  scoreBox.setMarkdown(`Score: ${score}`)

  function updateScore(){
    scoreBox.setMarkdown(`Score: ${++score}`)
  }

  function createGameBox (){
   return blessed.box({
      parent: screen,
      top: 1,
      left: 0,
      width: '100%',
      height: '100%-1',
      border: {
        type: 'line'
      },
      style: {
        fg: 'black',
        bg: 'black',
        border: {
          fg: 'yellow',
        }
      },
    })
  }

  function createGameOverBox (){
    return blessed.box({
       parent: screen,
       top: "center",
       left: "center",
       width: '20%',
       height: '20%',
       valign:'middle',
       align: 'center',
      content: `Game Over!\n Press q to exit`,
       border: {
         type: 'line'
       },
       style: {
         fg: 'black',
         bg: 'yellow',
       
       },
     })
   } 
  
let gameBox = createGameBox()

function clearScreen(){
  gameBox = createGameBox()
} 

 function drawSnake() {
   snake.forEach(({x,y})=>{
      blessed.box({
      parent: gameBox,
      top: y,
      left: x,
      height:1,
      width:1,
      style:{ bg: 'red'}
    })
  })
 }

 function newHead({x,y}){
  switch(direction){
    case "up": 
      return {x, y:y-1}
    case "down":
      return {x, y:y+1}
    case "left":
      return {x:x-1, y}
    case "right":
      return {x:x+1, y}
    default: 
      return {x,y}
  }
 }

 function move(){
  
  snake.unshift(newHead(snake[0]))
   if (snake[0].x === fruite.x && snake[0].y === fruite.y) {
    updateScore()
    generateFruite()
    snake.unshift(newHead(snake[0]))
   } else snake.pop()
 }

 function isGameOver(){

   const collision = snake.filter((_, i) => i > 0).some(obj => obj.x === snake[0].x && obj.y === snake[0].y)

  return (
    collision ||
    snake[0].x >= gameBox.width - 1||
    snake[0].x <= -1 ||
    snake[0].y >= gameBox.height - 1 ||
    snake[0].y <= -1
  )
 }

 function getRandomArbitrary(min, max) {
  return Math.round(Math.random() * (max - min) + min)
}

 function generateFruite() {
  fruite.x = getRandomArbitrary(1, gameBox.width - 2)
  fruite.y = getRandomArbitrary(2, gameBox.height - 2)
}

function drawFruite(){
  blessed.box({
    parent: gameBox,
    top: fruite.y,
    left: fruite.x,
    height:1,
    width:1,
    style:{ bg: 'green'}
  })
}


function tick(){ 
  if(isGameOver()){
  
    createGameOverBox()
    screen.render()
      
    clearInterval(timer)
    
      return
  }
    clearScreen()
    drawFruite()
    move()
    drawSnake()
    screen.render()
}
function start() {
    timer = setInterval(tick, 50)
}
generateFruite()
start()

