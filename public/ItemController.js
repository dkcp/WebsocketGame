import Item from './Item.js';

class ItemController {
	INTERVAL_MIN = 0;
	INTERVAL_MAX = 12000;

	nextInterval = null;
	items = [];

	itemImages = {	// item.json 아이템 id에 해당하는 이미지들
		1: new Image(),
		2: new Image(),
		3: new Image(),
		4: new Image(),
		5: new Image(),
		6: new Image(),
		11: new Image(),
		12: new Image(),
	};

	unlockedItems = [
		{ id:1, score:10 },
		{ id:11, score:0 },
		{ id:12, score:0 },
	]

	collidedItems = [];

	constructor(ctx, scaleRatio, speed) {
		this.ctx = ctx;
		this.canvas = ctx.canvas;
		this.scaleRatio = scaleRatio;
		this.speed = speed;
        this.width = 80 * scaleRatio;
        this.height = 80 * scaleRatio;

		for(let i=1; i<=6; i++)
			this.itemImages[i].src = 'images/items/pokeball_'+i+'.png';
		this.itemImages[11].src = 'images/items/item_potion.png';
		this.itemImages[12].src = 'images/items/item_boots.png';

		this.setNextItemTime();
	}

	createItem() {
		const index = this.getRandomNumber(0, this.unlockedItems.length - 1);
		const image = this.itemImages[this.unlockedItems[index].id];
		const x = this.canvas.width * 1.5;
		const y = this.getRandomNumber(10, this.canvas.height - this.height);

		const item = new Item(this.ctx, this.unlockedItems[index].id, x, y, this.width*this.scaleRatio, this.height*this.scaleRatio, image);

		this.items.push(item);
	}

	update(gameSpeed, deltaTime) {
		if (this.nextInterval <= 0) {
			this.createItem();
			this.setNextItemTime();
		}

		this.nextInterval -= deltaTime;

		this.items.forEach(item => {
			item.update(this.speed, gameSpeed, deltaTime, this.scaleRatio);
		});

		this.items = this.items.filter(item => item.x > -item.width);
	}

	draw() {
		this.items.forEach(item => item.draw());
		this.collidedItems.forEach((collidedItem, index) => {
			if(collidedItem.timer>0){
				const score = this.unlockedItems.find(item=>item.id===collidedItem.id).score;
				if(score>0){
					this.ctx.font = `bolder 20px serif`;
					this.ctx.fillStyle = '#dddd00';
					this.ctx.fillText('+'+score, collidedItem.x, collidedItem.y);
					collidedItem.y-=0.5;
					collidedItem.timer--;
				}
			}else this.collidedItems.splice(index, 1);
		});
	}

	collideWith(player) {
		const collidedItem = this.items.find(item => item.collideWith(player));
		if (collidedItem) {
			this.collidedItems.push({x:collidedItem.textX, y:collidedItem.textY, id:collidedItem.id, timer: 100});

			this.ctx.clearRect(collidedItem.x, collidedItem.y, collidedItem.width, collidedItem.height);

			if(collidedItem.id < 6){
			}
			if(collidedItem.id === 11){
				player.recover();
			}
			if(collidedItem.id === 12){
				player.speedUp();
			}


			return {
				itemId: collidedItem.id,
				score: this.unlockedItems.find(item=>item.id===collidedItem.id).score,
			};
		}
	}

	reset() {
		this.items = [];
	}

	unlockItem(unlockItems){
		unlockItems.forEach(unlockItem => {
			const isExist = this.unlockedItems.find(unlockedItem => unlockedItem.id === unlockItem.id);
			if(!isExist) this.unlockedItems.push(unlockItem);
		})
	}

	setNextItemTime() {
		this.nextInterval = this.getRandomNumber(this.INTERVAL_MIN, this.INTERVAL_MAX);
	}

	getRandomNumber(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}
}

export default ItemController;
