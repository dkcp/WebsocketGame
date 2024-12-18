import Enemy from "./Enemy.js";

class EnemyController {
	INTERVAL_MIN = 3000;
	INTERVAL_MAX = 4000;
	SPACESHIP_COUNT = 5;

	nextInterval = null;

	spaceshipImages = [];
	spaceshipHitImages = [];

	unlockedEnemys = [
		{ id:1, score:10, size:80, hp:3, speed:1 },
	];

	constructor(ctx, scaleRatio, ground_speed) {
		this.ctx = ctx;
		this.canvas = ctx.canvas;
		this.scaleRatio = scaleRatio;
		this.ground_speed = ground_speed;
		this.enemies = [];

		for(let i=1; i<=this.SPACESHIP_COUNT; i++){
			const spaceshipImage = new Image();
			const spaceshipHitImage = new Image();
			spaceshipImage.src = 'images/enemy/spaceship_'+i+'.png';
			spaceshipHitImage.src = 'images/enemy/spaceship_'+i+'_hit.png';
			this.spaceshipImages.push(spaceshipImage);
			this.spaceshipHitImages.push(spaceshipHitImage);
		}

		this.setNextEnemyTime();
	}

	createEnemy() {
		const imageIndex = this.getRandomNumber(0, this.SPACESHIP_COUNT - 1);
		const typeIndex = this.getRandomNumber(0, this.unlockedEnemys.length - 1);
		const x = this.canvas.width * 1.5;
		const y = this.getRandomNumber(10, this.canvas.height - 110);

		const enemy = new Enemy(this.ctx, this.spaceshipImages[imageIndex], this.spaceshipHitImages[imageIndex], 
			this.unlockedEnemys[typeIndex], this.scaleRatio);
		this.enemies.push(enemy);
	}

	update(gameSpeed, deltaTime) {
		if (this.nextInterval <= 0) {
			this.createEnemy();
			this.setNextEnemyTime();
		}

		this.nextInterval -= deltaTime;

		// 각 객체의 좌표,이미지 업데이트
		this.enemies.forEach(enemy => {
			enemy.update(this.ground_speed, gameSpeed, deltaTime, this.scaleRatio);
		});

		this.enemies = this.enemies.filter(enemy => (enemy.x > -enemy.width && !enemy.isDie) );
	}

	draw() {
		this.enemies.forEach(item => item.draw());
	}

	collideWith(sprite) {
		const collidedItem = this.enemies.find(item => item.collideWith(sprite));
		// if (collidedItem) {
		// 	this.ctx.clearRect(collidedItem.x, collidedItem.y, collidedItem.width, collidedItem.height);
		// 	return {
		// 		itemId: collidedItem.id
		// 	};
		// }
        return this.enemies.some(cactus => cactus.collideWith(sprite));
	}

	reset() {
		this.enemies = [];
	}

	unlockEnemy(unlockEnemys){
		unlockEnemys.forEach(unlockEnemy => {
			const isExist = this.unlockedEnemys.find(unlockedEnemy => unlockedEnemy.id === unlockEnemy.id);
			if(!isExist) this.unlockedEnemys.push(unlockEnemy);
		})
	}

	setNextEnemyTime() {
		this.nextInterval = this.getRandomNumber(this.INTERVAL_MIN, this.INTERVAL_MAX);
	}

	getRandomNumber(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}
}

export default EnemyController;
