class Background {
	constructor(ctx, width, height, speed, scaleRatio) {
		this.ctx = ctx;
		this.canvas = ctx.canvas;
		this.width = 8216 / 2.05;
		this.height = 2191 / 2.05;
		this.speed = speed;
		this.scaleRatio = scaleRatio;
		this.isHit = false;

		this.x = 0;
		this.y = 0; //

		this.backGroundImage = new Image();
		this.backGroundImage.src = 'images/background.jpg';
		this.hitBackGround = new Image();
		this.hitBackGround.src = '';
	}

	update(gameSpeed, deltaTime) {
		this.x -= deltaTime * this.speed * this.scaleRatio;
	}

	draw() {
		this.ctx.drawImage(this.backGroundImage, this.x, this.y, this.width, this.height);

		this.ctx.drawImage(this.backGroundImage, this.x + this.width - 10, this.y, this.width, this.height);

		if (this.isHit) {
            this.ctx.drawImage(this.hitBackGround, 0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            this.isHit = false;
		}

		//땅이 끝났을 때 처음으로
		if (this.x < -this.width) {
			this.x = 0;
		}
	}

	reset() {
		this.x = 0;
	}
}

export default Background;
