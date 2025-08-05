export interface AdminAccount {
  id: string;
  accountNumber: string;
  name: string;
  email: string;
  phone: string;
  password: string; // In production, this would be hashed
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: string;
  role: "admin" | "agency";
  businessName: string;
  agencyName?: string; // For agency accounts
}

export class AccountManager {
  private static readonly STORAGE_KEY = "admin_accounts";

  // Generate unique account number in format 123-123-1234 (admin) or A23-123-1234 (agency)
  static generateAccountNumber(role: "admin" | "agency" = "admin"): string {
    const existingAccounts = this.getAllAccounts();
    let accountNumber: string;

    do {
      if (role === "agency") {
        // Agency format: A23-123-1234 (A + 2 digits + 3 digits + 4 digits)
        const part1 = Math.floor(Math.random() * 90) + 10; // 10-99
        const part2 = Math.floor(Math.random() * 900) + 100; // 100-999
        const part3 = Math.floor(Math.random() * 9000) + 1000; // 1000-9999
        accountNumber = `A${part1}-${part2}-${part3}`;
      } else {
        // Admin format: 123-123-1234 (3 digits + 3 digits + 4 digits)
        const part1 = Math.floor(Math.random() * 900) + 100; // 100-999
        const part2 = Math.floor(Math.random() * 900) + 100; // 100-999
        const part3 = Math.floor(Math.random() * 9000) + 1000; // 1000-9999
        accountNumber = `${part1}-${part2}-${part3}`;
      }
    } while (existingAccounts.some(acc => acc.accountNumber === accountNumber));

    return accountNumber;
  }

  // Get all admin accounts
  static getAllAccounts(): AdminAccount[] {
    try {
      const accounts = localStorage.getItem(this.STORAGE_KEY);
      return accounts ? JSON.parse(accounts) : [];
    } catch (error) {
      console.error("Error loading admin accounts:", error);
      return [];
    }
  }

  // Get account by email
  static getAccountByEmail(email: string): AdminAccount | null {
    const accounts = this.getAllAccounts();
    return accounts.find(acc => acc.email === email) || null;
  }

  // Get account by account number
  static getAccountByNumber(accountNumber: string): AdminAccount | null {
    const accounts = this.getAllAccounts();
    return accounts.find(acc => acc.accountNumber === accountNumber) || null;
  }

  // Get accounts by role
  static getAccountsByRole(role: "admin" | "agency"): AdminAccount[] {
    const accounts = this.getAllAccounts();
    return accounts.filter(acc => acc.role === role);
  }

  // Get admin accounts only
  static getAdminAccounts(): AdminAccount[] {
    return this.getAccountsByRole("admin");
  }

  // Get agency accounts only
  static getAgencyAccounts(): AdminAccount[] {
    return this.getAccountsByRole("agency");
  }

  // Create new admin or agency account
  static createAccount(accountData: Omit<AdminAccount, "id" | "accountNumber" | "createdAt">): AdminAccount {
    const accounts = this.getAllAccounts();

    // Check if email already exists
    if (accounts.some(acc => acc.email === accountData.email)) {
      throw new Error("An account with this email already exists");
    }

    // Check if phone already exists
    if (accounts.some(acc => acc.phone === accountData.phone)) {
      throw new Error("An account with this phone number already exists");
    }

    const newAccount: AdminAccount = {
      id: Date.now().toString(),
      accountNumber: this.generateAccountNumber(accountData.role),
      createdAt: new Date().toISOString(),
      ...accountData,
    };

    accounts.push(newAccount);
    this.saveAccounts(accounts);

    return newAccount;
  }

  // Update account
  static updateAccount(accountId: string, updates: Partial<AdminAccount>): AdminAccount | null {
    const accounts = this.getAllAccounts();
    const accountIndex = accounts.findIndex(acc => acc.id === accountId);
    
    if (accountIndex === -1) {
      return null;
    }

    accounts[accountIndex] = { ...accounts[accountIndex], ...updates };
    this.saveAccounts(accounts);
    
    return accounts[accountIndex];
  }

  // Verify email
  static verifyEmail(accountId: string): boolean {
    const account = this.updateAccount(accountId, { emailVerified: true });
    return account !== null;
  }

  // Verify phone
  static verifyPhone(accountId: string): boolean {
    const account = this.updateAccount(accountId, { phoneVerified: true });
    return account !== null;
  }

  // Authenticate account
  static authenticateAccount(email: string, password: string): AdminAccount | null {
    const accounts = this.getAllAccounts();
    const account = accounts.find(acc => acc.email === email && acc.password === password);
    return account || null;
  }

  // Save accounts to localStorage
  private static saveAccounts(accounts: AdminAccount[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(accounts));
    } catch (error) {
      console.error("Error saving admin accounts:", error);
      throw new Error("Failed to save account data");
    }
  }

  // Get account statistics
  static getAccountStats(): {
    totalAccounts: number;
    verifiedEmails: number;
    verifiedPhones: number;
    accountsToday: number;
  } {
    const accounts = this.getAllAccounts();
    const today = new Date().toDateString();
    
    return {
      totalAccounts: accounts.length,
      verifiedEmails: accounts.filter(acc => acc.emailVerified).length,
      verifiedPhones: accounts.filter(acc => acc.phoneVerified).length,
      accountsToday: accounts.filter(acc => 
        new Date(acc.createdAt).toDateString() === today
      ).length,
    };
  }

  // Search accounts (for admin purposes)
  static searchAccounts(query: string): AdminAccount[] {
    const accounts = this.getAllAccounts();
    const lowerQuery = query.toLowerCase();
    
    return accounts.filter(acc => 
      acc.name.toLowerCase().includes(lowerQuery) ||
      acc.email.toLowerCase().includes(lowerQuery) ||
      acc.businessName.toLowerCase().includes(lowerQuery) ||
      acc.accountNumber.includes(query)
    );
  }
}
