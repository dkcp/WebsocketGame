import AmmoController from './AmmoController.js';

class Player {
	WALK_ANIMATION_TIMER = 200;
	walkAnimationTimer = this.WALK_ANIMATION_TIMER;
	SPEED_UP_TIMER = 10000;
	speedUpTimer = this.SPEED_UP_TIMER;

	Images = {
		moveImages: [],
		hitImages: [],
		dashImages: [],
		fireImage: null,
        dieImage: null
	};
	imageIndex = 0;
	fireImageIndex = 0;

	moveUpPressed = false;
	moveDownPressed = false;
	moveLeftPressed = false;
	moveRightPressed = false;
	dashRightPressed = false;
	dashLeftPressed = false;

	isHit = false;
	isDash = false;
	afterDash = false;
	isDashWidth = false;
	isFire = false;

	MOVE_SPEED = 1;
	DASH_SPEED = 1;
	AMMO_SPEED = 1;
	KNOCKBACK_SPEED = 4;
	MAX_HP = 5;
	MIN_SPEED = 1;
	MAX_SPEED = 4;

	ammoController = null;

	// 생성자
	constructor(ctx, width, height, scaleRatio) {
		this.ctx = ctx;
		this.canvas = ctx.canvas;
		this.width = width;
		this.dashWidth = width * 2.33;
		this.height = height;
		this.scaleRatio = scaleRatio;
		this.hp = this.MAX_HP;

		this.x = 10 * scaleRatio;
		this.y = this.canvas.height/2 - this.height/2 * scaleRatio;
		// 기본 위치 상수화
		this.yStandingPosition = this.y;
		this.xStandingPosition = this.x;

		this.standingStillImage = new Image();
		this.standingStillImage.src = 'images/bear_move_1.png';
		this.image = this.standingStillImage;
		this.gunfireImage = new Image();
		this.gunfireImage.src = 'images/effect/gun_fire_1.png';
		this.fireImage = this.gunfireImage;
		const healthImage = new Image();
		healthImage.src = 'images/ui/ui_health.png';
		this.hpImage = healthImage;
		this.speedImage = new Image();
		this.speedImage.src = 'images/items/item_boots.png';

		//곰돌이
		for (let i = 1; i <= 6; i++) {
			const moveImage = new Image();
			moveImage.src = 'images/bear_move_' + i + '.png';
			this.Images.moveImages.push(moveImage);
		}
		for (let i = 1; i <= 3; i++) {
			const hitImage = new Image();
			hitImage.src = 'images/bear_hit_' + i + '.png';
			this.Images.hitImages.push(hitImage);
		}
		for (let i = 1; i <= 6; i++) {
			const dashImage = new Image();
			dashImage.src = 'images/bear_dash_' + i + '.png';
			this.Images.dashImages.push(dashImage);
		}
        const dieImage = new Image();
        dieImage.src = 'images/bear_die.png';
        this.Images.dieImage = dieImage;

		this.ammoController = new AmmoController(ctx, this.x, this.y, scaleRatio, this.AMMO_SPEED);

		// 키보드 설정
		// 등록된 이벤트가 있는 경우 삭제하고 다시 등록
		window.removeEventListener('keydown', this.keydown);
		window.removeEventListener('keyup', this.keyup);

		window.addEventListener('keydown', this.keydown);
		window.addEventListener('keyup', this.keyup);
	}

    reset(){
        this.image = this.standingStillImage;
        this.MOVE_SPEED = 1;
        this.DASH_SPEED = 1;
        this.hp = this.MAX_HP;
        
        this.imageIndex = 0;
        this.fireImageIndex = 0;
    
        this.moveUpPressed = false;
        this.moveDownPressed = false;
        this.moveLeftPressed = false;
        this.moveRightPressed = false;
        this.dashRightPressed = false;
        this.dashLeftPressed = false;
    
        this.isHit = false;
        this.isDash = false;
        this.afterDash = false;
        this.isDashWidth = false;
        this.isFire = false;

		this.x = 10 * this.scaleRatio;
		this.y = this.canvas.height/2 - this.height/2 * this.scaleRatio;
    }

	keydown = event => {
		if (event.code === 'Space') {
			if (this.moveRightPressed) {
				this.imageIndex = 0;
				this.DASH_SPEED = 1;
				this.dashRightPressed = true;
				this.isDash = true;
			}
			if (this.moveLeftPressed) {
				this.imageIndex = this.Images.dashImages.length / 2;
				this.DASH_SPEED = 1;
				this.dashLeftPressed = true;
				this.isDash = true;
			}
		}
		if (event.code === 'ArrowUp') {
			this.moveDownPressed = false;
			this.moveUpPressed = true;
		}
		if (event.code === 'ArrowDown') {
			this.moveUpPressed = false;
			this.moveDownPressed = true;
		}
		if (event.code === 'ArrowLeft') {
			this.moveRightPressed = false;
			this.moveLeftPressed = true;
		}
		if (event.code === 'ArrowRight') {
			this.moveLeftPressed = false;
			this.moveRightPressed = true;
		}
		if (event.code === 'ControlLeft') {
			if (!this.isFire) {
				this.isFire = true;
			}
		}
	};

	keyup = event => {
		if (event.code === 'Space') {
		}
		if (event.code === 'ArrowUp') {
			this.moveUpPressed = false;
		}
		if (event.code === 'ArrowDown') {
			this.moveDownPressed = false;
		}
		if (event.code === 'ArrowLeft') {
			this.moveLeftPressed = false;
		}
		if (event.code === 'ArrowRight') {
			this.moveRightPressed = false;
		}
	};

	//좌표업데이트
	move(deltaTime) {
		if (this.isHit) {
			this.x -= this.KNOCKBACK_SPEED * deltaTime * this.scaleRatio;
			this.KNOCKBACK_SPEED /= 2;
		}
		if (this.isDash) {
			if (this.dashRightPressed) {
				this.x += this.DASH_SPEED * deltaTime * this.scaleRatio;
			}
			if (this.dashLeftPressed) {
				this.x -= this.DASH_SPEED * deltaTime * this.scaleRatio;
			}
			if (this.moveUpPressed) {
				this.y -= this.DASH_SPEED * deltaTime * this.scaleRatio;
			}
			if (this.moveDownPressed) {
				this.y += this.DASH_SPEED * deltaTime * this.scaleRatio;
			}
			this.DASH_SPEED /= this.DASH_SPEED * 3;
		} else {
			if (this.moveUpPressed) {
				this.y -= this.MOVE_SPEED * 0.2 * deltaTime * this.scaleRatio;
			}
			if (this.moveDownPressed) {
				this.y += this.MOVE_SPEED * 0.2 * deltaTime * this.scaleRatio;
			}
			if (this.moveRightPressed) {
				this.x += this.MOVE_SPEED * 0.2 * deltaTime * this.scaleRatio;
			}
			if (this.moveLeftPressed) {
				this.x -= this.MOVE_SPEED * 0.2 * deltaTime * this.scaleRatio;
			}
		}
		// 위치가 벗어났을때 화면에 가두기
		if (this.x > this.canvas.width - this.width) {
			this.x = this.canvas.width - this.width;
		}
		if (this.x < this.xStandingPosition) {
			this.x = this.xStandingPosition;
		}
		if (this.y > this.canvas.height - this.height) {
			this.y = this.canvas.height - this.height;
		}
		if (this.y < 0) {
			this.y = 0;
		}
	}

	update(gameSpeed, deltaTime) {
		this.setImage(gameSpeed, deltaTime);

		this.move(deltaTime);
	}

	// 신발 아이템 먹었을 때
	speedUp() {
		this.MOVE_SPEED += 1;
		this.DASH_SPEED += 5;
		if (this.MOVE_SPEED > this.MAX_SPEED) {
			this.MOVE_SPEED = this.MAX_SPEED;
		}

		this.speedUpTimer = this.SPEED_UP_TIMER;
	}

	//선인장 collide()에서 호출
	hit() {
		if (!this.isHit) {
			this.hp--;
			this.isHit = true;
			this.imageIndex = 0;
			if (this.isDash) {
				this.afterDash = true;
			}
			this.KNOCKBACK_SPEED = 4;
		}
	}

	recover() {
		if (this.hp + 1 <= this.MAX_HP) {
			this.hp++;
		}
	}

	//캐릭터 그림 업데이트
	setImage(gameSpeed, deltaTime) {
		if (this.walkAnimationTimer <= 0) {
			//너비 조절
			if (this.afterDash) {
				if (this.dashRightPressed) {
					this.x += this.dashWidth / 2;
					this.dashRightPressed = false;
				}
				if (this.dashLeftPressed) this.dashLeftPressed = false;
				this.afterDash = false;
				this.isDash = false;
				this.isDashWidth = false;
			}

			// 플레이어 그림 업데이트
			if (this.isDash) {
				if (!this.isDashWidth) this.isDashWidth = true;
				this.image = this.Images.dashImages[this.imageIndex];
				this.imageIndex++;
				if (this.dashRightPressed && this.imageIndex >= this.Images.dashImages.length / 2) {
					this.imageIndex = 0;
					this.afterDash = true;
					this.isDash = false;
				}
				if (this.dashLeftPressed && this.imageIndex >= this.Images.dashImages.length) {
					this.imageIndex = 0;
					this.afterDash = true;
					this.isDash = false;
				}
			} else if (this.isHit) {
				this.image = this.Images.hitImages[this.imageIndex];
				this.imageIndex++;
				if (this.imageIndex >= this.Images.hitImages.length) {
					this.isHit = false;
					this.imageIndex = 0;
				}
			} else {
				this.image = this.Images.moveImages[this.imageIndex];
				this.imageIndex++;
				if (this.imageIndex >= this.Images.moveImages.length) this.imageIndex = 0;
			}

			// 이펙트 그림 업데이트
			if (this.isFire) {
				this.ammoController.createAmmos(this.x + this.width, this.y + this.height / 2);
				this.isFire = false;
			}

			this.walkAnimationTimer = this.WALK_ANIMATION_TIMER;
		}
		this.walkAnimationTimer -= deltaTime * gameSpeed;

		if (this.MOVE_SPEED > 1) {
			if (this.speedUpTimer <= 0 && this.MOVE_SPEED > 1) {
				this.MOVE_SPEED--;
				this.speedUpTimer = this.SPEED_UP_TIMER;
			}
			this.speedUpTimer -= deltaTime * gameSpeed;
		}
	}

	draw() {
		const fontSize = 30 * this.scaleRatio;
		this.ctx.font = `bolder ${fontSize}px serif`;
		this.ctx.fillStyle = '#159515';

		let arrowUpText = this.moveUpPressed ? '▲' : '△';
		let arrowLRText = (this.moveLeftPressed ? '◀' : '◁').concat('  ').concat(this.moveRightPressed ? '▶' : '▷');
		let arrowDownText = this.moveDownPressed ? '▼' : '▽';
		this.ctx.fillText(
			arrowUpText,
			(this.canvas.width - 90) * this.scaleRatio,
			(this.canvas.height - 80) * this.scaleRatio
		);
		this.ctx.fillText(
			arrowLRText,
			(this.canvas.width - 115) * this.scaleRatio,
			(this.canvas.height - 50) * this.scaleRatio
		);
		this.ctx.fillText(
			arrowDownText,
			(this.canvas.width - 90) * this.scaleRatio,
			(this.canvas.height - 20) * this.scaleRatio
		);

		this.ctx.drawImage(this.image, this.x, this.y, this.isDashWidth ? this.dashWidth : this.width, this.height);

		if (this.isFire)
			this.ctx.drawImage(
				this.fireImage,
				this.x + this.width,
				this.y + this.height / 2.4,
				this.width / 2,
				this.height / 3
			);

		for (let i = 0; i < this.hp; i++) {
			this.ctx.drawImage(this.hpImage, 30 + i * 60, 30, 50 * this.scaleRatio, 50 * this.scaleRatio);
		}

		if (this.MOVE_SPEED > 1) {
			for (let i = 1; i < this.MOVE_SPEED; i++) {
				this.ctx.drawImage(this.speedImage, i * 30, 90, 20 * this.scaleRatio, 20 * this.scaleRatio);
			}
		}
	}
}

export default Player;
