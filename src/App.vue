<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const boardSize = 20

const snake = ref([
  {
    x: Math.floor(Math.random() * boardSize),
    y: Math.floor(Math.random() * boardSize)
  }
])

const food = ref({
  x: 5,
  y: 5
})

const direction = ref('right')

const score = ref(0)

const isGameOver = ref(false)

let gameLoop = null

// 產生隨機食物
function generateFood() {
  food.value = {
    x: Math.floor(Math.random() * boardSize),
    y: Math.floor(Math.random() * boardSize)
  }
}

// 移動蛇
function moveSnake() {
  const head = { ...snake.value[0] }

  if (direction.value === 'up') {
    head.y--
  }

  if (direction.value === 'down') {
    head.y++
  }

  if (direction.value === 'left') {
    head.x--
  }

  if (direction.value === 'right') {
    head.x++
  }

  // 撞牆
  if (
    head.x < 0 ||
    head.x >= boardSize ||
    head.y < 0 ||
    head.y >= boardSize
  ) {
    isGameOver.value = true
    clearInterval(gameLoop)
    return
  }

  // 新蛇頭加進去
  snake.value.unshift(head)

  // 吃到食物
  if (
    head.x === food.value.x &&
    head.y === food.value.y
  ) {
    score.value++
    generateFood()
  } else {
    // 沒吃到就刪尾巴
    snake.value.pop()
  }
}

// 鍵盤控制
function handleKey(e) {
  if (e.key === 'ArrowUp' && direction.value !== 'down') {
    direction.value = 'up'
  }

  if (e.key === 'ArrowDown' && direction.value !== 'up') {
    direction.value = 'down'
  }

  if (e.key === 'ArrowLeft' && direction.value !== 'right') {
    direction.value = 'left'
  }

  if (e.key === 'ArrowRight' && direction.value !== 'left') {
    direction.value = 'right'
  }
}

// 判斷某格是不是蛇
function isSnake(x, y) {
  return snake.value.some(
    segment => segment.x === x && segment.y === y
  )
}

// 判斷某格是不是食物
function isFood(x, y) {
  return food.value.x === x && food.value.y === y
}

//重新開始
function restartGame() {
  snake.value = [{
    x: Math.floor(Math.random() * boardSize),
    y: Math.floor(Math.random() * boardSize)
  }]

  direction.value = 'right'

  score.value = 0

  isGameOver.value = false

  generateFood()

  clearInterval(gameLoop)

  gameLoop = setInterval(() => {
    moveSnake()
  }, 200)
}

onMounted(() => {
  window.addEventListener('keydown', handleKey)

  gameLoop = setInterval(() => {
    moveSnake()
  }, 200)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKey)
  clearInterval(gameLoop)
})
</script>

<template>
  <div class="container">
    <h1>Snake Game</h1>

    <h2>Score: {{ score }}</h2>
    <button @click="restartGame">重新開始</button>

    <div class="board">
      <template v-for="y in boardSize" :key="y">
        <template v-for="x in boardSize" :key="x">
          <div
            class="cell"
            :class="{
              snake: isSnake(x - 1, y - 1),
              food: isFood(x - 1, y - 1)
            }"
            
          ></div>
          <div v-if="isGameOver" class="overlay">
            <h1>GAME OVER</h1>
            <button @click="restartGame">
              重新開始
            </button>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: Arial;
}

.board {
  display: grid;
  grid-template-columns: repeat(20, 20px);
  grid-template-rows: repeat(20, 20px);
  gap: 1px;
  background: #333;
  position: relative;
  
}

.overlay {
  position: absolute;
  inset: 0;

  background: rgba(0, 0, 0, 0.7);

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  color: white;

  font-size: 32px;
  font-weight: bold;
}

.overlay button {
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 20px;
  cursor: pointer;
}

.cell {
  width: 20px;
  height: 20px;
  background: #eee;
}

.snake {
  background: green;
}

.food {
  background: red;
}
</style>