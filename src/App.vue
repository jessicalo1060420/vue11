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
      
      <h2>Score: {{ game.score }}</h2>
      <h3>High Score: {{ game.highScore }}</h3>
      <button @click="game.restartGame">重新開始</button>
      <button @click="game.backToMenu">回主選單</button>
      <h3 v-if="!game.isStarted && !game.isGameOver">
        按空白鍵開始遊戲
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
.setting-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: Arial;
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