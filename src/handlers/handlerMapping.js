import { gameEnd, gameStart } from "./game.handler.js"
import { getEnemyScore, getItemScore } from "./score.handler.js"
import { moveStageHandler } from "./stage.handler.js"

const handlerMappings = {
    2: gameStart,
    3: gameEnd,
    11: moveStageHandler,
    16: getItemScore,
    21: getEnemyScore,
}

export default handlerMappings