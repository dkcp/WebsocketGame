import { sendEvent } from "./Socket.js";

class Enemy {
	ANIMATION_TIMER = 200;
	AnimationTimer = this.ANIMATION_TIMER;

	MAX_HIT_FRAME = 10;
	hitFrameIndex = 0;

	explosionImages = [];
	explosionImageIndex = 0;

	//상태
	isSpawn = true;
	isIdle = false;
	isAttack = false;
	isHit = false;
	isExploded = false;
	isDie = false;

	constructor(ctx, image, hitImage, enemyType, scaleRatio) {
		this.ctx = ctx;
		this.canvas = ctx.canvas;
		this.x = this.canvas.width * 1.5;
		this.y = Math.random() * (this.canvas.height - enemyType.size);
		this.width = enemyType.size * scaleRatio;
		this.height = enemyType.size * scaleRatio;
		this.image = image;
		this.hitImage = hitImage;
		this.hp = enemyType.hp;
		this.score = enemyType.score;
		this.moveSpeed = enemyType.speed;
		this.id = enemyType.id;

		for (let i = 1; i <= 10; i++) {
			const newImage = new Image();
			newImage.src = 'images/effect/explosion_' + i + '.png';
			this.explosionImages.push(newImage);
		}

		// 첫등장 벡터 변수
		this.spawnSpeed = Math.random() * 2 + 1;
		this.directionY = Math.floor(Math.random() * 2); //0은 위로, 1은 아래로
		this.directionX = 0; //0은 좌로, 1은 우로
		if (this.y < this.canvas.height * 0.2) this.directionY = 1;
		else if (this.y > this.canvas.height * 0.8) this.directionY = 0;
	}

	update(speed, gameSpeed, deltaTime, scaleRatio) {
		this.setImage(gameSpeed, deltaTime);

        // 큰 몹의 움직임
		if (this.width / scaleRatio > 390) {
			this.directionX
				? (this.x += (speed * gameSpeed * deltaTime * scaleRatio) / 4)
				: (this.x -= (speed * gameSpeed * deltaTime * scaleRatio) / 4);
		} else {
			// 출현할 때 움직임
			if (this.isSpawn) {
				if (this.x < this.canvas.width && this.x >= this.canvas.width * 0.8) {
					speed *= (this.x - 0.8 * this.canvas.width) / (0.2 * this.canvas.width);
				}
				this.x -= this.moveSpeed * speed * gameSpeed * deltaTime * scaleRatio;
				if (this.directionY) {
					this.y += this.moveSpeed * speed * gameSpeed * scaleRatio * this.spawnSpeed;
				} else {
					this.y -= this.moveSpeed * speed * gameSpeed * scaleRatio * this.spawnSpeed;
				}
				if (Math.floor(this.x) === Math.floor(this.canvas.width * 0.8)) {
					this.isSpawn = false;
					this.isIdle = true;
				}
				// 출현 후 움직임
			} else if (this.isIdle) {
				if (this.directionY) {
					this.y += this.moveSpeed * speed * gameSpeed * scaleRatio * this.spawnSpeed;
				} else {
					this.y -= this.moveSpeed * speed * gameSpeed * scaleRatio * this.spawnSpeed;
				}
				if (this.directionX) {
					this.x += (this.moveSpeed * speed * gameSpeed * deltaTime * scaleRatio) / 2;
				} else {
					this.x -= this.moveSpeed * speed * gameSpeed * scaleRatio;
				}
			}
		}

		// 보스는 위치 제한, 화면 밖으로 넘어갈 때 화면 안으로 방향바꾸기기
		if (this.width / scaleRatio > 390 && this.x <= 0) {
			this.directionX = 1;
			this.isSpawn = false;
		}
		if (this.x + this.width < 0) {
			// 컨드롤러에서 필터 실행 후 없어짐
		}
		if (!this.isSpawn && this.x >= this.canvas.width - this.width) this.directionX = 0;
		if (this.y < 0) this.directionY = 1;
		if (this.y > this.canvas.height - this.height) this.directionY = 0;
	}

	hit() {
		this.isHit = true;
		this.hitFrameIndex = 0;
		this.hp--;
		if(this.hp<=0 && !this.isExploded) {
			this.isExploded = true;
			sendEvent(21, { enemy_id:this.id });
		}
		return this.hp;
	}

	setImage(gameSpeed, deltaTime) {
		if (this.AnimationTimer <= 0) {
			// 그림 너비 조절

			// 에네미 그림 업데이트
			if (this.isExploded) {
				this.image = this.explosionImages[this.explosionImageIndex];
				this.explosionImageIndex++;
				if (this.explosionImageIndex >= this.explosionImages.length) {
					this.explosionImageIndex = this.explosionImages.length;
					this.isDie = true;
				}
			}

			// 이펙트 그림 업데이트

			this.AnimationTimer = this.ANIMATION_TIMER;
		}

		this.AnimationTimer -= deltaTime * gameSpeed;
	}

	draw() {
		if (this.isDie) return;
		if (this.isHit) {
			this.isHit = false;
			this.ctx.drawImage(this.hitImage, this.x, this.y, this.width, this.height);
		} else {
			this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
		}
	}

	collideWith(sprite) {
		if(this.isExploded) return false;

		const adjustBy = 1.4;
		const isCollide =
			this.x < sprite.x + sprite.width / adjustBy &&
			this.x + this.width / adjustBy > sprite.x &&
			this.y < sprite.y + sprite.height / adjustBy &&
			this.y + this.height / adjustBy > sprite.y;

		// 충돌
		return (
			this.x < sprite.x + sprite.width / adjustBy &&
			this.x + this.width / adjustBy > sprite.x &&
			this.y < sprite.y + sprite.height / adjustBy &&
			this.y + this.height / adjustBy > sprite.y
		);
	}
}

export default Enemy;
