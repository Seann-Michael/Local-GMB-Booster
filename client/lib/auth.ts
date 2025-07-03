export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer" | "superadmin";
  avatar?: string;
}

export function getCurrentUser(): User | null {
  try {
    const userStr = localStorage.getItem("auth_user");
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
}

export function getAuthToken(): string | null {
  return localStorage.getItem("auth_token");
}

export function isAuthenticated(): boolean {
  return !!getCurrentUser() && !!getAuthToken();
}

export function signOut(): void {
  localStorage.removeItem("auth_user");
  localStorage.removeItem("auth_token");
}

export function isSuperAdmin(): boolean {
  const user = getCurrentUser();
  return user?.role === "superadmin";
}

export function requireAuth(): boolean {
  if (!isAuthenticated()) {
    return false;
  }
  return true;
}
