import {
  ref,
  onMounted,
  onBeforeUnmount
} from 'vue'

export function useSnakeGame() {
    const boardSize = 20
    const difficulty = ref('easy')
    const scene = ref('classic')
    const isSetting = ref(true)


    const direction = ref('right')

    const score = ref(0)
    const speed = ref(250)
    const ObstaclesSpeed = ref(250)
    const ObstaclesLoop = ref(null)
    const isStarted = ref(false)
    const isGameOver = ref(false)
    
    let gameLoop = null

    const snake = ref([
    {
        x: Math.floor(Math.random() * boardSize),
        y: Math.floor(Math.random() * boardSize)
    }
    ])
    const obstacles = ref([])
    const obstacleDirection = ref({ x: 1, y: 0 },{ x:-1, y:0})

    const highScore = ref(
    Number(localStorage.getItem('highScore')) || 0
    )
    const food = ref({
    x: 5,
    y: 5
    })

    // 產生隨機食物
    function generateFood() {
    food.value = {
        x: Math.floor(Math.random() * boardSize),
        y: Math.floor(Math.random() * boardSize)
    }
    }
    //產生障礙物
    function generateObstacles() {
    const newObstacles = []
    const x1 = Math.floor(Math.random() * (boardSize - 1)) + 1
    const y1 = Math.floor(Math.random() * boardSize)

    const x2 = Math.floor(Math.random() * (boardSize - 6)) + 1
    const y2 = Math.floor(Math.random() * (boardSize - 5))

    
    if (difficulty.value === 'easy'){
        while (newObstacles.length < 5) {
            const pos = {
                x:Math.floor(Math.random() * boardSize),
                y:Math.floor(Math.random() * boardSize)
            }

            // 避免生成在蛇身上
            const onSnake = snake.value.some(
            s => s.x === pos.x && s.y === pos.y
            )

            // 避免重複
            const duplicate = newObstacles.some(
            o => o.x === pos.x && o.y === pos.y
            )

            // 避免生成在食物上
            const onFood =
            food.value.x === pos.x &&
            food.value.y === pos.y

            if (!onSnake && !duplicate && !onFood) {
            newObstacles.push([pos])
            }
        }
    }
    if (difficulty.value === 'medium' || difficulty.value === 'hard') {
        newObstacles.push (
                [{ x: x1, y: y1 },
                { x: x1 - 1, y: y1 }],
                [{ x: x2, y: y2 },
                { x: x2 - 1, y: y2 }]
        )

    }

    obstacles.value = newObstacles
    }
    //障礙物控制
    function moveObstacles() {

        // 20%機率改方向
        

        const directions = [
            { x: 0, y: -1 },
            { x: 0, y: 1 },
            { x: -1, y: 0 },
            { x: 1, y: 0 }
        ]
        obstacles.value = obstacles.value.map(enemy => {
            if (Math.random() < 0.2) {
                obstacleDirection.value =
                    directions[Math.floor(Math.random() * directions.length)]
            }


            const head = { ...enemy[0] }

            let newHead = {
                x: head.x + obstacleDirection.value.x,
                y: head.y + obstacleDirection.value.y
            }

            
            // 撞牆就反方向
            if (
                newHead.x < 0 ||
                newHead.x >= boardSize ||
                newHead.y < 0 ||
                newHead.y >= boardSize
            ) {

                obstacleDirection.value.x *= -1
                obstacleDirection.value.y *= -1

                newHead = {
                    x: head.x + obstacleDirection.value.x,
                    y: head.y + obstacleDirection.value.y
                }
            }

        

            return [newHead, ...enemy.slice(0, -1)]
        
        })
        const hitSnake = obstacles.value.some(enemy =>
                enemy.some(part =>
                    snake.value.some(s =>
                        s.x === part.x && s.y === part.y
                    )
                )
            )

            if (hitSnake) {
                gameOver()
                return
            }
    }
    function startObstacles() {
        clearInterval(ObstaclesLoop.value)

        ObstaclesLoop.value = setInterval(() => {
            moveObstacles()
        }, ObstaclesSpeed.value)
    }
    
    //判斷撞障礙物
    function isObstacle(x, y) {
    return obstacles.value.some(enemy =>
        enemy.some(part =>
            part.x === x && part.y === y
        )
    )
        
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
        gameOver()
        return
    }

    // 撞障礙物
    if (isObstacle(head.x, head.y)) {
        gameOver()
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
        generateObstacles()
        updateSpeed()
    } else {
        // 沒吃到就刪尾巴
        snake.value.pop()
    }
    }

    function updateSpeed() {
        speed.value -= 20

        if (speed.value < 50) {
            speed.value = 50
        }

        clearInterval(gameLoop)

        gameLoop = setInterval(() => {
            moveSnake()
        }, speed.value)
        if (difficulty.value === 'hard') {
            ObstaclesSpeed.value = speed.value

            clearInterval(ObstaclesLoop.value)

            ObstaclesLoop.value = setInterval(() => {
                moveObstacles()
            }, ObstaclesSpeed.value)
        }
    }
    function startGame() {
    if (isStarted.value || isGameOver.value) return

    isStarted.value = true

    gameLoop = setInterval(() => {
        moveSnake()
    }, speed.value)
    if (
        difficulty.value === 'medium' ||
        difficulty.value === 'hard'
  ) {
    startObstacles()
  }
    }
    // 鍵盤控制
    function handleKey(e) {
    if (e.code === 'Space') {
        startGame() 
        return 
    }

    if (!isStarted.value) return

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
    //設定難易度、場景介面
    function confirmSetting() {
        isSetting.value = false
        restartGame()
        if (difficulty.value === 'medium') {
            ObstaclesSpeed.value = 250
        }
        if (difficulty.value === 'hard') {
            ObstaclesSpeed.value = speed.value
        }

    }
    //重新開始
    function restartGame() {
    
    snake.value = [{
        x: Math.floor(Math.random() * boardSize),
        y: Math.floor(Math.random() * boardSize)
    }]

    direction.value = 'right'

    score.value = 0
    speed.value = 250

    isGameOver.value = false
    isStarted.value = false
    generateFood()
    generateObstacles()
    clearInterval(gameLoop)
    clearInterval(ObstaclesLoop.value)
    
    
    }
    //回主選單
    function backToMenu() {
        clearInterval(gameLoop)
        isSetting.value = true
        isStarted.value = false
        isGameOver.value = false
        
    }

    function gameOver() {
    isGameOver.value = true
    clearInterval(gameLoop)

    if (score.value > highScore.value) {
        highScore.value = score.value
        localStorage.setItem('highScore', score.value)
    }
    clearInterval(ObstaclesLoop.value)

    }

    onMounted(() => {
    window.addEventListener('keydown', handleKey)
    generateFood()
    generateObstacles()
    })

    onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKey)
    clearInterval(gameLoop)
    })
    return {
        boardSize,
        snake,
        food,
        obstacles,
        score,
        highScore,
        direction,
        isStarted,
        isGameOver,
        difficulty,
        scene,
        isSetting,
        confirmSetting,
        restartGame,
        startGame,
        gameOver,
        handleKey,
        isSnake,
        isFood,
        isObstacle,
        backToMenu

    }
}