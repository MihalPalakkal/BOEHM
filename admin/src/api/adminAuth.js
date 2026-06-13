const ADMIN_TOKEN_KEY = 'adminToken';

export const ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN || 'dummy-test-token-123';

export const getAdminToken = () => localStorage.getItem(ADMIN_TOKEN_KEY);

export const setAdminSession = () => {
  localStorage.setItem(ADMIN_TOKEN_KEY, ADMIN_TOKEN);
};

export const clearAdminSession = () => {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
};

export const hasValidAdminSession = () => getAdminToken() === ADMIN_TOKEN;
