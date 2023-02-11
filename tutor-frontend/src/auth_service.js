// import api from "../api/products";
const logout = async () => {
  localStorage.removeItem("user");
  try {
    const res = await fetch("/api/logout");
    return await res.json();
  } catch (err) {}
};

const getCurrentUser = () => {
  return getWithExpiry("user");
};
const setWithExpiry = (key, value, duration = 1000 * 60 * 60 * 2) => {
  const now = new Date();

  const item = {
    value: value,
    expiry: now.getTime() + duration,
  };

  localStorage.setItem(key, JSON.stringify(item));
};

const getWithExpiry = (key) => {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) {
    return null;
  }

  const item = JSON.parse(itemStr);

  const now = new Date();

  if (now.getTime() > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }

  return item.value;
};

const AuthService = {
  logout,
  setWithExpiry,
  getWithExpiry,
  getCurrentUser,
  // logoutUser,
};

export default AuthService;
