var seed = 1;
export function random() {
  var x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}
