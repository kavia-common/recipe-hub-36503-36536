const TOKEN_KEY = 'recipehub/token';
const USER_KEY = 'recipehub/user';

function safeParse(json) {
  try { return JSON.parse(json); } catch { return null; }
}

export const storage = {
  getToken() {
    return window.localStorage.getItem(TOKEN_KEY);
  },
  setToken(token) {
    if (!token) return window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.setItem(TOKEN_KEY, token);
  },
  getUser() {
    return safeParse(window.localStorage.getItem(USER_KEY));
  },
  setUser(user) {
    if (!user) return window.localStorage.removeItem(USER_KEY);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  clear() {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
  }
};
