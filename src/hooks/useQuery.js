import { useQuery } from "@urql/preact";

function traverse(prefix, object, callback) {
  for (const [key, value] of Object.entries(object)) {
    const isArrayElement = String(parseInt(key, 10)) === key;
    const path = isArrayElement ? prefix : [...prefix, key];
    if (typeof value === "object" && value !== null) {
      traverse(path, value, callback);
    } else {
      callback(path, value, callback);
    }
  }
}

function useDebugQuery(options) {
  if (!options.query.loc) console.log(`Not using gql tag in ${options.query}`);
  if (!options.query.definitions[0].name) {
    console.log(`No query name in ${options.query.loc.source.body}`);
  }

  const [{ data, ...a }, ...b] = useQuery(options);

  if (!data) return [{ data, ...a }, ...b];

  let unused = new Set();
  const handler = (prefix) => ({
    get: function (target, key, reciever) {
      const isArrayElement = String(parseInt(key, 10)) === key;
      const value = target[key];
      const path = isArrayElement ? prefix : [...prefix, key];
      if (typeof value === "object" && value !== null) {
        return new Proxy(value, handler(path));
      } else {
        unused.delete(path.join("."));
        return value;
      }
    },
  });

  traverse([], data, (path) => unused.add(path.join(".")));
  setTimeout(() => {
    const paths = Array.from(unused.keys()).filter(
      (path) => !path.includes("__typename")
    );
    if (paths.length) {
      console.group(
        `in ${
          options.query?.definitions?.[0]?.name?.value ||
          options.query?.loc?.source.body ||
          options.query
        }`
      );
    }
    for (let path of paths) {
      console.warn(`unused ${path}`);
    }
    if (paths.length) {
      console.groupEnd();
    }
  }, 1000);

  const proxy = new Proxy(data, handler([]));
  return [{ data: proxy, ...a }, ...b];
}

const DEBUG = false;
const useQueryImplementation = DEBUG ? useDebugQuery : useQuery;

export default useQueryImplementation;
