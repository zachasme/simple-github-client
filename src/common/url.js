export function searchMerge(search, props) {
  for (let [key, value] of Object.entries(props)) {
    search.set(key, value);
  }
  return search.toString();
}
