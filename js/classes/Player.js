class Player extends Sprite {
  constructor({
    position,
    collisionsBlocks,
    platformCollisionsBlocks,
    imageSrc,
    frameRate,
    scale = 0.5,
    animations,
  }) {
    super({ imageSrc, frameRate, scale });
    this.position = position;
    this.velocity = { x: 0, y: 1 };
    this.collisionsBlocks = collisionsBlocks;
    this.platformCollisionsBlocks = platformCollisionsBlocks;
    this.hitBox = {
      position: { x: this.position.x, y: this.position.y },
      height: 10,
      width: 10,
    };
    this.animations = animations;
    this.lastDirection = "right";

    for (let key in this.animations) {
      const image = new Image();
      image.src = this.animations[key].imageSrc;

      this.animations[key].image = image;
    }

    this.cameraBox = {
      position: { x: this.position.x, y: this.position.y },
      width: 200,
      height: 80,
    };
  }

  switchSprite(key) {
    if (this.image === this.animations[key].image || !this.loaded) return;

    this.currentFrame = 0;
    this.image = this.animations[key].image;
    this.frameBuffer = this.animations[key].frameBuffer;
    this.frameRate = this.animations[key].frameRate;
  }

  updateCameraBox() {
    this.cameraBox = {
      position: { x: this.position.x - 50, y: this.position.y },
      width: 200,
      height: 80,
    };
  }

  checkForHorizontalCanvasCollisions() {
    if (
      this.hitBox.position.x + this.hitBox.width + this.velocity.x >= 576 ||
      this.hitBox.position.x + this.velocity.x - 2 <= 0
    ) {
      this.velocity.x = 0;
    }
  }

  shouldPanCameraToTheLeft({ canvas, camera }) {
    const cameraBoxRightSide = this.cameraBox.position.x + this.cameraBox.width;
    const scaleDownCanvasWidth = canvas.width / 4;

    if (cameraBoxRightSide >= 576) return;

    if (
      cameraBoxRightSide >=
      scaleDownCanvasWidth + Math.abs(camera.position.x)
    ) {
      camera.position.x -= this.velocity.x;
    }
  }

  shouldPanCameraToTheRight({ canvas, camera }) {
    if (this.cameraBox.position.x <= 0) return;

    if (this.cameraBox.position.x <= Math.abs(camera.position.x)) {
      camera.position.x -= this.velocity.x;
    }
  }

  shouldPanCameraToTheUp({ canvas, camera }) {
    if (
      this.cameraBox.position.y + this.cameraBox.height + this.velocity.y >=
      432
    )
      return;

    const scaledCanvasHeight = canvas.height / 4;

    if (
      this.cameraBox.position.y + this.cameraBox.height >=
      Math.abs(camera.position.y) + scaledCanvasHeight
    ) {
      camera.position.y -= this.velocity.y;
    }
  }

  shouldPanCameraToTheDown({ canvas, camera }) {
    if (this.cameraBox.position.y + this.velocity.y <= 0) return;

    if (this.cameraBox.position.y <= Math.abs(camera.position.y)) {
      camera.position.y -= this.velocity.y;
    }
  }

  update() {
    this.updateFrames();

    this.updateCameraBox();

    // context.fillStyle = "rgba(0, 0, 255, 0.2)";
    // context.fillRect(
    //   this.cameraBox.position.x,
    //   this.cameraBox.position.y,
    //   this.cameraBox.width,
    //   this.cameraBox.height
    // );

    // context.fillStyle = "rgba(0, 0, 255, 0.2)";
    // context.fillRect(
    //   this.hitBox.position.x,
    //   this.hitBox.position.y,
    //   this.hitBox.width,
    //   this.hitBox.height
    // );

    this.draw();

    this.position.x += this.velocity.x;
    this.updateHitBox();
    this.checkForHorizontalCollisions();
    this.applyGravity();
    this.updateHitBox();
    this.checkForVerticalCollisions();
  }

  updateHitBox() {
    this.hitBox = {
      position: { x: this.position.x + 35, y: this.position.y + 26 },
      height: 27,
      width: 14,
    };
  }

  applyGravity() {
    this.velocity.y += gravity;
    this.position.y += this.velocity.y;
  }

  checkForVerticalCollisions() {
    for (let i = 0; i < this.collisionsBlocks.length; i++) {
      const collisionBlock = this.collisionsBlocks[i];

      if (collision({ playerInfo: this.hitBox, blockInfo: collisionBlock })) {
        if (this.velocity.y > 0) {
          this.velocity.y = 0;

          const offset =
            this.hitBox.position.y - this.position.y + this.hitBox.height;

          this.position.y = collisionBlock.position.y - offset - 0.01;
          break;
        }
        if (this.velocity.y < 0) {
          this.velocity.y = 0;

          const offset = this.hitBox.position.y - this.position.y;

          this.position.y =
            collisionBlock.position.y + collisionBlock.height - offset + 0.01;
          break;
        }
      }
    }

    for (let i = 0; i < this.platformCollisionsBlocks.length; i++) {
      const platformCollisionBlock = this.platformCollisionsBlocks[i];

      if (
        platformCollision({
          playerInfo: this.hitBox,
          blockInfo: platformCollisionBlock,
        })
      ) {
        if (this.velocity.y > 0) {
          this.velocity.y = 0;

          const offset =
            this.hitBox.position.y - this.position.y + this.hitBox.height;

          this.position.y = platformCollisionBlock.position.y - offset - 0.01;
          break;
        }
      }
    }
  }

  checkForHorizontalCollisions() {
    for (let i = 0; i < this.collisionsBlocks.length; i++) {
      const collisionBlock = this.collisionsBlocks[i];

      if (collision({ playerInfo: this.hitBox, blockInfo: collisionBlock })) {
        if (this.velocity.x > 0) {
          this.velocity.x = 0;

          const offset =
            this.hitBox.position.x - this.position.x + this.hitBox.width;

          this.position.x = collisionBlock.position.x - offset - 0.01;
          break;
        }
        if (this.velocity.x < 0) {
          this.velocity.x = 0;

          const offset = this.hitBox.position.x - this.position.x;

          this.position.x =
            collisionBlock.position.x + collisionBlock.width - offset + 0.01;
          break;
        }
      }
    }
  }
}
