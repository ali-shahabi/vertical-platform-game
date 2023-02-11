class CollisionsBlock {
  constructor({ position, height = 16 }) {
    this.position = position;
    this.width = 16;
    this.height = height;
  }
  draw() {
    context.fillStyle = "rgba(0, 0 ,0 ,0)";
    context.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
  update() {
    this.draw();
  }
}
