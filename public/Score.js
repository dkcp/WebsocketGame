import { sendEvent } from './Socket.js';

class Score {
    highScore = 0;
    score = 0;
    HIGH_SCORE_KEY = 'highScore';
    stageLevel = 0;
    currentStageId = 1000;
    targetScore = 60;
    stageText = 1;


    constructor(ctx, scaleRatio) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.scaleRatio = scaleRatio;
    }

    setStageInfo(stageInfo){
        this.stageLevel++;
        this.currentStageId = stageInfo.id;
        this.targetScore = stageInfo.score;
        this.stageText = stageInfo.level;
    }

    update(deltaTime) {
        if (Math.floor(this.score) >= this.targetScore) {
            sendEvent(11, { currentStage: this.currentStageId}); //moveStage(userId, payload)
        }
    }

    stageClear() {

    }

    updateScore(updatedScore) {
        this.score = updatedScore;
        console.log('현재점수:',this.score, '목표점수:', this.targetScore);
    }

    reset() {
        this.score = 0;
    }

    setHighScore(highScore) {
        if(highScore>=this.highScore){
            console.log('최고점수 갱신 완료', highScore);
            this.highScore = highScore;
        }else{
            console.log('서버에서 보낸 최고점수가 더 낮음... 이러면 안돼', highScore);
        }
    }

    getScore() {
        return this.score;
    }

    draw() {
        const y = 20 * this.scaleRatio;

        const fontSize = 20 * this.scaleRatio;
        this.ctx.font = `bold ${fontSize}px sans-serif`;
        this.ctx.fillStyle = 'white';

        const scoreX = this.canvas.width - 75 * this.scaleRatio;
        const highScoreX = scoreX - 125 * this.scaleRatio;

        const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
        const highScorePadded = this.highScore.toString().padStart(6, 0);

        this.ctx.fillText(scorePadded, scoreX, y);
        this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);

        const fontSize2 = 80 * this.scaleRatio;
        this.ctx.font = `bold ${fontSize2}px sans-serif`;
        this.ctx.fillStyle = '#0070f0';
        this.ctx.fillText(`STAGE ${this.stageText}`, this.canvas.width/2-fontSize2*2, fontSize2);
    }
}

export default Score;
