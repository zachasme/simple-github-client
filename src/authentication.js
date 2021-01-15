let authenticatedToken = localStorage.getItem("token");

export async function login(accessToken) {
  try {
    const response = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (response.status !== 200) {
      const text = await response.text();
      throw new Error(text);
    }
    const json = await response.json();
    if (json) {
      setToken(accessToken);
    }
  } catch (error) {
    console.error(error);
    setToken(null);
  }
}

export function logout() {
  console.log("loggin out");
  setToken(null);
}

function setToken(value) {
  authenticatedToken = value;
  if (value) {
    localStorage.setItem("token", authenticatedToken);
  } else {
    localStorage.removeItem("token");
  }
  broadcast();
}
export const getToken = () => {
  return authenticatedToken;
};

window.addEventListener("storage", () => {
  const token = localStorage.getItem("token");
  if (token !== authenticatedToken) login(token);
});

const listeners = new Set();
export function listen(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function broadcast() {
  for (const listener of listeners) {
    console.log("listener x");
    listener(getToken());
  }
}
