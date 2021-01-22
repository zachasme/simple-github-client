export function humanReadableList(items) {
  const copy = [...items];
  const last = copy.splice(-1, 1);
  return copy.join(", ") + " and " + last;
}
