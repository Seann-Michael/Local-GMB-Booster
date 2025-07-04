export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer" | "superadmin" | "agency";
  avatar?: string;
  isImpersonated?: boolean;
  agencyId?: string;
  agencyName?: string;
}

export function getCurrentUser(): User | null {
  try {
    const userStr = localStorage.getItem("auth_user");
    if (userStr) {
      return JSON.parse(userStr);
    } else {
      // Initialize with default user for demo
      const defaultUser: User = {
        id: "1",
        name: "John Smith",
        email: "john@smithconstruction.com",
        role: "admin",
      };
      localStorage.setItem("auth_user", JSON.stringify(defaultUser));
      localStorage.setItem("auth_token", "demo_token_" + Date.now());
      return defaultUser;
    }
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

export function isAgencyAdmin(): boolean {
  const user = getCurrentUser();
  return user?.role === "agency";
}

export function requireAuth(): boolean {
  if (!isAuthenticated()) {
    return false;
  }
  return true;
}
