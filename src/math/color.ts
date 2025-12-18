export class Color {
  constructor(public r = 0, public g = 0, public b = 0) {
    this.r = r;
    this.g = g;
    this.b = b;
  }
  scale(s: number) {
    return new Color(
      Math.min(255, this.r * s),
      Math.min(255, this.g * s),
      Math.min(255, this.b * s)
    );
  }
  add(c: Color) {
    return new Color(
      Math.min(255, this.r + c.r),
      Math.min(255, this.g + c.g),
      Math.min(255, this.b + c.b)
    );
  }
}
