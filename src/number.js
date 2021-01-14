export function humanReadableNumber(number) {
  if (number === 0) {
    return "0";
  }
  var e = Math.floor(Math.log(number) / Math.log(1024));
  let fixed = (number / Math.pow(1024, e)).toFixed(1);
  if (fixed.endsWith(".0")) fixed = (number / Math.pow(1024, e)).toFixed(0);
  return fixed + " kmgtp".charAt(e);
}
