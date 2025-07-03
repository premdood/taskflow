function getInitials(fullName) {
  const names = fullName.split(" ");
  const initials = names.slice(0, 2).map((name) => name[0].toUpperCase());
  const initialStr = initials.join("");
  return initialStr;
}

function getUserFromLocalStorage() {
  const token = JSON.parse(localStorage.getItem("token") || null);
  const user = JSON.parse(localStorage.getItem("user") || null);
  return { token, user };
}

function removeUserFromLocalStorage() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

function saveUserToLocalStorage(token, user) {
  localStorage.setItem("token", JSON.stringify(token));
  localStorage.setItem("user", JSON.stringify(user));
}

export {
  getInitials,
  getUserFromLocalStorage,
  removeUserFromLocalStorage,
  saveUserToLocalStorage,
};
