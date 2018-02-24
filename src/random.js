export var randomSeed = 1;
export function random() {
  var x = Math.sin(randomSeed++) * 10000;
  return x - Math.floor(x);
}
