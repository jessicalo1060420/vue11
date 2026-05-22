
<script setup>

const props = defineProps([
  'boardSize',
  'isSnake',
  'isFood',
  'isObstacle',
  'isGameOver',
  'restartGame',
  'backToMenu'
])
</script>

<template>
  
    <div class="board">
      <template v-for="y in boardSize" :key="y">
        <template v-for="x in boardSize" :key="x">
          <div
            class="cell"
            :class="{
              snake: isSnake(x - 1, y - 1),
              food: isFood(x - 1, y - 1),
              obstacle: isObstacle(x - 1, y - 1)
            }"
            
            
          ></div>
        </template>
      </template>
          <div v-if="props.isGameOver" class="overlay">
            <h1>GAME OVER</h1>
            <button @click="restartGame">
              重新開始
            </button>
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

.obstacle {
  background: black;
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
</style>
