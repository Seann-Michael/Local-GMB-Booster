export interface BusinessProfile {
  id: string;
  accountId: string; // Format: XXX-XXX-XXX
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  website?: string;
  logo?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer" | "superadmin" | "agency";
  avatar?: string;
  isImpersonated?: boolean;
  agencyId?: string;
  agencyName?: string;
  firstName?: string;
  lastName?: string;
  currentBusinessId?: string;
  businesses?: BusinessProfile[];
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
        firstName: "John",
        lastName: "Smith",
        currentBusinessId: "business-1",
        businesses: [
          {
            id: "business-1",
            accountId: "102-456-789",
            name: "Smith Construction LLC",
            description: "General contracting and home renovations",
            address: "123 Main St, Springfield, IL 62701",
            phone: "(555) 123-4567",
            website: "https://smithconstruction.com",
          },
          {
            id: "business-2",
            accountId: "203-567-890",
            name: "Smith Property Management",
            description: "Residential and commercial property management",
            address: "456 Oak Ave, Springfield, IL 62702",
            phone: "(555) 234-5678",
            website: "https://smithproperties.com",
          },
          {
            id: "business-3",
            accountId: "304-678-901",
            name: "Elite Home Renovations",
            description: "Premium kitchen and bathroom remodeling",
            address: "789 Pine St, Springfield, IL 62703",
            phone: "(555) 345-6789",
            website: "https://elitehomerenos.com",
          },
        ],
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

export function getCurrentBusiness(): BusinessProfile | null {
  const user = getCurrentUser();
  if (!user?.businesses || !user.currentBusinessId) {
    return null;
  }
  return user.businesses.find((b) => b.id === user.currentBusinessId) || null;
}

export function getUserBusinesses(): BusinessProfile[] {
  const user = getCurrentUser();
  return user?.businesses || [];
}

export function switchToBusiness(businessId: string): boolean {
  const user = getCurrentUser();
  if (!user?.businesses) {
    return false;
  }

  const business = user.businesses.find((b) => b.id === businessId);
  if (!business) {
    return false;
  }

  const updatedUser = {
    ...user,
    currentBusinessId: businessId,
  };

  localStorage.setItem("auth_user", JSON.stringify(updatedUser));
  return true;
}

export function canSwitchBusinesses(): boolean {
  const user = getCurrentUser();
  return user?.role === "admin" && (user?.businesses?.length || 0) > 1;
}
