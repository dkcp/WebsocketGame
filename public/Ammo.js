class Ammo {
  isHit = false;
  hitImages = [];
  hitImageIndex = 0;

    constructor(ctx, x, y, width, height, image) {
      this.ctx = ctx;
      this.x = x;
      this.y = y;
      this.width = width*0.2;
      this.height = height*0.2;
      this.image = image;
      for(let i=1; i<=3; i++){
        const ammoHitImage = new Image();
        ammoHitImage.src = 'images/ammo/ammo_hit_'+i+'.png';
        this.hitImages.push(ammoHitImage);
      }
    }
  
    update(speed, gameSpeed, deltaTime, scaleRatio) {
      if(this.isHit){
        this.hitImageIndex++;
        if(this.hitImageIndex>=this.hitImages.length){
          this.hitImageIndex = -1;
          this.isHit = false;
        }
      }else {
        this.x += speed * gameSpeed * deltaTime * scaleRatio;
      }
      
    }
  
    draw() {
      if(!this.isHit)this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
      if(this.isHit && this.hitImageIndex>=0) this.ctx.drawImage(this.hitImages[this.hitImageIndex], this.x, this.y, this.width, this.width*0.8);
    }

    hit(){
      if(!this.isHit){
        this.isHit = true;
        this.hitImageIndex = 0;
      }
    }
  
    collideWith(sprite) {
      const adjustBy = 1.4;
      const width = Math.max(sprite.width, sprite.height);
      const height = Math.min(sprite.width, sprite.height);
      
      const x1 = sprite.x + (height/2);
      const y1 = sprite.y + (height/2);
      const x2 = sprite.x + width - (height/2);
      const y2 = sprite.x + (height/2);
      const rSqrt = (height/2)*(height/2);

      const distanceSqrt1 = (this.x - x1)*(this.x - x1) + (this.y - y1)*(this.y - y1);
      const distanceSqrt2 = (this.x - x2)*(this.x - x2) + (this.y - y2)*(this.y - y2);

      if(distanceSqrt1<=rSqrt || distanceSqrt2<=rSqrt) return true;
      else return false;

      // const isCollide = (
      //   this.x < sprite.x + sprite.width / adjustBy &&
      //   this.x + this.width / adjustBy > sprite.x &&
      //   this.y < sprite.y + sprite.height / adjustBy &&
      //   this.y + this.height / adjustBy > sprite.y
      // );
  
      // return { isCollide, objectPosition:[x,y], hitPosition }
  
      // 충돌
      // return (
      //   this.x < sprite.x + sprite.width / adjustBy &&
      //   this.x + this.width / adjustBy > sprite.x &&
      //   this.y < sprite.y + sprite.height / adjustBy &&
      //   this.y + this.height / adjustBy > sprite.y
      // );
    }
  }
  
  export default Ammo;
  