import { sendEvent } from './Socket.js';

class Score {
    highScore = 0;
    score = 0;
    HIGH_SCORE_KEY = 'highScore';
    stageChange = true;
    stageLevel = 0;
    currentStageId = 1000;
    targetScore = 100;
    stageText = 1;

    targetStageId = 1001;

    constructor(ctx, scaleRatio) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.scaleRatio = scaleRatio;
    }

    setStageInfo(stageInfo){
        this.stageLevel++;
        this.currentStageId = stageInfo.id;
        this.targetScore = stageInfo.score;
        this.targetStageId = this.currentStageId+1;
    }

    update(deltaTime) {
        //this.score += deltaTime * 0.001 * this.scorePerSecond * 0.1;    // 빼

        // 점수가 100점 이상이 될 시 서버에 메세지 전송
        if (Math.floor(this.score) >= this.targetScore && this.stageChange) {
            this.stageChange = false;
            sendEvent(11, { currentStage: this.currentStageId, targetStage: this.targetStageId }); //moveStage(userId, payload)
        } else {
            //console.log('[update time]', this.score); //#시간체크... 좀 이상함
        }
    }

    stageClear() {

    }

    getItem(score) {
        this.score += score;
    }
    
    killEnemy(score) {
        this.score += score;
    }

    reset() {
        this.score = 0;
        this.stageChange = true;
        this.stageText = this.currentStageId-999;
    }

    setHighScore() {
        const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
        if (this.score > highScore) {
            localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
        }
    }

    getScore() {
        return this.score;
    }

    draw() {
        const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
        const y = 20 * this.scaleRatio;

        const fontSize = 20 * this.scaleRatio;
        this.ctx.font = `bold ${fontSize}px sans-serif`;
        this.ctx.fillStyle = 'white';

        const scoreX = this.canvas.width - 75 * this.scaleRatio;
        const highScoreX = scoreX - 125 * this.scaleRatio;

        const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
        const highScorePadded = highScore.toString().padStart(6, 0);

        this.ctx.fillText(scorePadded, scoreX, y);
        this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);

        const fontSize2 = 80 * this.scaleRatio;
        this.ctx.font = `bold ${fontSize2}px sans-serif`;
        this.ctx.fillStyle = '#0070f0';
        this.ctx.fillText(`STAGE ${this.stageText}`, this.canvas.width/2-fontSize2*2, fontSize2);
    }
}

export default Score;
