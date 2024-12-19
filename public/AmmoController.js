import Ammo from './Ammo.js';

class AmmoController {
	ammos = [];
	hitAmmos = [];
	upgrade = 1;

	MIN_UPGRADE = 1;
	MAX_UPGRADE = 5;

	constructor(ctx, x, y, scaleRatio, speed) {
		this.ctx = ctx;
		this.canvas = ctx.canvas;
		this.scaleRatio = scaleRatio;
		this.speed = speed;

		this.x = x;
		this.y = y;

		this.newImage = new Image();
		this.newImage.src = 'images/ammo/ammo_1.png';
		this.ammoImage = this.newImage;

		//this.weaponUpgrade();
	}

	getRandomNumber(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	createAmmos(x, y) {
		//const index = this.getRandomNumber(0, this.cactiImages.length - 1);
		//const cactusImage = this.cactiImages[index];

		for(let i=0; i<this.upgrade; i++){
			const diff = Math.floor((i+1)/2)*(i%2?-1:1)*10;
			const newY = y + diff;
			const ammo = new Ammo(this.ctx, x, newY, this.ammoImage.width, this.ammoImage.height, this.ammoImage);
			this.ammos.push(ammo);
		}
	}

	update(gameSpeed, deltaTime) {
		this.ammos.forEach(ammo => {
			ammo.update(this.speed, gameSpeed, deltaTime, this.scaleRatio);
		});
		this.hitAmmos.forEach(hitAmmo => {
			hitAmmo.update();
			if(!hitAmmo.isHit) {
				this.hitAmmos.shift();	//제일 먼저 터진 총알 이펙트 제거
			}
		})

		// 지나간 선인장 삭제
		this.ammos = this.ammos.filter(ammo => ammo.x < this.canvas.width);
	}

	draw() {
		this.ammos.forEach(ammo => ammo.draw());
		this.hitAmmos.forEach(hitAmmo => {
			hitAmmo.draw();
		});
	}

	collideWithEnemies(enemyController) {
		let enemyScore = 0;
		this.ammos.forEach((ammo, ammoIndex) => {
			enemyController.enemies.forEach((enemy) => {
				if (enemy.collideWith(ammo)) {
					// 총알 충돌 처리
					ammo.hit();
					this.hitAmmos.push(ammo);
					this.ammos.splice(ammoIndex, 1);

					// 적 충돌 처리
					enemy.hit();
					enemyScore = enemy.score;
					return enemyScore;
				}
			});
		});
		return enemyScore;
	}

	reset() {
		this.ammos = [];
		this.hitAmmos = [];
	}

	weaponUpgrade() {
		console.log('업그레이드!', this.upgrade);
		this.upgrade++;
		if(this.upgrade>this.MAX_UPGRADE) this.upgrade = this.MAX_UPGRADE;
	}

	downgrade(){
		this.upgrade--;
		if(this.upgrade<this.MIN_UPGRADE) this.upgrade = this.MIN_UPGRADE;
	}
}

export default AmmoController;
