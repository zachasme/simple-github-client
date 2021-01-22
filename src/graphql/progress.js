import { pipe, tap } from "wonka";

export default ({ forward }) => {
  const observed = new Set();
  return (ops$) =>
    pipe(
      ops$,
      tap((operation) => {
        if (operation.kind === "query") {
          observed.add(operation.key);
          broadcast(observed);
        }
        if (operation.kind === "teardown") {
          observed.delete(operation.key);
          broadcast(observed);
        }
      }),
      forward,
      tap((result) => {
        if (observed.has(result.operation.key)) {
          observed.delete(result.operation.key);
          broadcast(observed);
        }
      })
    );
};

function broadcast(observed) {
  // DEBT: Why does it break without setTimeout???
  setTimeout(() => {
    for (const listener of listeners) {
      listener(observed);
    }
  });
}

const listeners = new Set();
export const onProgressChange = (listener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
