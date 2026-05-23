<script setup>
import GameBoard from './components/GameBoard.vue'
import { useSnakeGame } from './composables/useSnakeGame'

const game = useSnakeGame()

</script>

<template>
  <div>
    <div v-if="game.isSetting.value" class="setting-panel">
      <h1>Snake Game</h1>

      <h2>選擇難易度</h2>

      <select v-model="game.difficulty.value">
        <option value="easy">簡單</option>
        <option value="medium">中等</option>
        <option value="hard">困難</option>
      </select>


      <button @click="game.confirmSetting">
        確認設定
      </button>
    </div>
    <div v-else class="container">
      <h1>Snake Game</h1>
      <h3>Score: {{ game.score }};High Score: {{ game.highScore }}</h3>
      <h4>按下空白鍵開始遊戲</h4>
      <button @click="game.restartGame">重新開始</button>
      <button @click="game.backToMenu">回主選單</button>
      <h3 v-if="!game.isStarted && !game.isGameOver">
        按空白鍵或開始鍵開始遊戲
      </h3>
      <div class="game-area">
        <GameBoard
          :board-size="game.boardSize"
          :is-snake="game.isSnake"
          :is-food="game.isFood"
          :is-obstacle="game.isObstacle"
          :is-game-over="game.isGameOver.value"
          :restart-game="game.restartGame"
          :back-to-menu="game.backToMenu"

        />
      </div>
      <div class="joystick">
        <button @click="game.changeDirection('up')">↑</button>

        <div>
          <button @click="game.changeDirection('left')">←</button>
          <button @click="game.startGame()">▶</button>
          <button @click="game.changeDirection('right')">→</button>
        </div>
        <button @click="game.changeDirection('down')">↓</button>
          
      </div>
            
    
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
.container h1,
.container h4,
.container h3 {
  line-height: 1.5;
  margin: 4px 0;
}
.setting-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: Arial;
}
.joystick {
  margin-top: 15px;
  text-align: center;
}

.joystick button {
  width: 50px;
  height: 50px;
  margin: 5px;
  font-size: 24px;
  border-radius: 12px;
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