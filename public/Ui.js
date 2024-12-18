class Ui {

    stageTextPos = { x:0, y:0 };

    constructor(ctx, scaleRatio, score) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.scaleRatio = scaleRatio;

        this.hp = 0;
        this.hiScoreText = 0;
        this.scoreText = 0;

        const stageFontSize = 80 * scaleRatio;
        this.stageTextPos.x = this.canvas.width/2;
        this.stageTextPos.y = 20 * scaleRatio;
        this.stageText = 


        this.HealthImage = new Image();
        this.HealthImage.src = "images/ui/ui_health.png";
    }

    showStageInfo(){

    }

    update(gameSpeed, deltaTime) {
        this.x -= deltaTime * this.speed * this.scaleRatio;
    }

    draw() {
        this.ctx.drawImage(
            this.backGroundImage,
            this.x,
            this.y,
            this.width,
            this.height
        );

        this.ctx.drawImage(
            this.backGroundImage,
            // 2개 연결
            this.x + this.width-10,
            this.y,
            this.width,
            this.height
        );

        //땅이 끝났을 때 처음으로
        if (this.x < -this.width) {
            this.x = 0;
        }
    }

    reset() {
        this.x = 0;
    }

    setHP(hp){
        this.hp = hp;
    }

    setStage(stage){
        this.stageText = stage;
    }

    setHiScore(hiScore){
        this.hiScoreText = hiScore;
    }

    setScore(score){
        this.scoreText = score;
    }

    

}

export default Ui;