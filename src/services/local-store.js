const USER_INFO_KEY = 'jointflows:user';

export function saveUserInfo(userDetails) {
  localStorage.setItem(USER_INFO_KEY, JSON.stringify(userDetails));
}

export function getUserInfo() {
  const rawUser = localStorage.getItem(USER_INFO_KEY);

  if (!rawUser) {
    return null;
  }

  return JSON.parse(rawUser);
}

export function clearUserInfo() {
  localStorage.removeItem(USER_INFO_KEY);
}
