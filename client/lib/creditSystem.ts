// Credit System Management
export interface CreditTransaction {
  id: string;
  type: "purchase" | "scan" | "refund" | "bonus";
  amount: number;
  description: string;
  timestamp: string;
  scanId?: string;
  scanType?: "one-time" | "recurring";
  waypointCount?: number;
  keywordCount?: number;
}

export interface CreditBalance {
  total: number;
  used: number;
  remaining: number;
  lastUpdated: string;
}

export interface ScanOptions {
  waypointCount: number;
  keywordCount: number;
  depth: number;
  apiCallType: 'circle' | 'rectangle';
  priority: 'standard' | 'expedited' | 'priority';
  isRecurring?: boolean;
}

export interface BusinessLocation {
  name: string;
  address?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  placeId?: string;
  cid?: string;
  mapUrl?: string;
  isServiceBased?: boolean;
}

export interface WaypointConfig {
  id: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  enabled: boolean;
  isCenter?: boolean;
  distance?: number; // Distance from center in selected unit
}

export interface ScanCost {
  baseCredits: number;
  perWaypoint: number;
  perKeyword: number;
  perDepthUnit: number; // Cost per depth increment (e.g., per 10 results)
  apiCallTypeMultiplier: {
    circle: number;
    rectangle: number;
  };
  priorityMultiplier: {
    standard: number;
    expedited: number;
    priority: number;
  };
  recurring?: {
    setupFee: number;
    perExecution: number;
  };
}

// Credit pricing configuration
export const CREDIT_PRICING: ScanCost = {
  baseCredits: 10, // Base cost per scan
  perWaypoint: 5, // Credits per waypoint
  perKeyword: 2, // Credits per keyword
  perDepthUnit: 1, // Credits per 10 depth results (20 results = 2 units = 2 credits)
  apiCallTypeMultiplier: {
    circle: 1.0, // Standard pricing
    rectangle: 1.2, // 20% premium for rectangle searches
  },
  priorityMultiplier: {
    standard: 1.0, // Standard pricing
    expedited: 1.5, // 50% premium for expedited
    priority: 2.0, // 100% premium for priority
  },
  recurring: {
    setupFee: 25, // One-time setup fee for recurring scans
    perExecution: 0.8, // Multiplier for each recurring execution (20% discount)
  },
};

// Credit storage keys
const CREDIT_BALANCE_KEY = "user_credit_balance";
const CREDIT_TRANSACTIONS_KEY = "user_credit_transactions";

// Initialize credit system with development balance
export function initializeCreditSystem(): void {
  const existingBalance = getStoredCreditBalance();
  if (!existingBalance) {
    // Set initial development balance of 250,000 credits
    const initialBalance: CreditBalance = {
      total: 250000,
      used: 0,
      remaining: 250000,
      lastUpdated: new Date().toISOString(),
    };

    const initialTransaction: CreditTransaction = {
      id: `tx_${Date.now()}`,
      type: "bonus",
      amount: 250000,
      description: "Development Credits - Initial Balance",
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem(CREDIT_BALANCE_KEY, JSON.stringify(initialBalance));
    localStorage.setItem(
      CREDIT_TRANSACTIONS_KEY,
      JSON.stringify([initialTransaction]),
    );
  }
}

// Get current credit balance
export function getCreditBalance(): CreditBalance {
  const stored = getStoredCreditBalance();
  if (!stored) {
    initializeCreditSystem();
    return getCreditBalance();
  }
  return stored;
}

// Get stored credit balance
function getStoredCreditBalance(): CreditBalance | null {
  try {
    const stored = localStorage.getItem(CREDIT_BALANCE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Error parsing credit balance:", error);
    return null;
  }
}

// Get credit transaction history
export function getCreditTransactions(): CreditTransaction[] {
  try {
    const stored = localStorage.getItem(CREDIT_TRANSACTIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error parsing credit transactions:", error);
    return [];
  }
}

// Calculate scan cost (backward compatibility)
export function calculateScanCost(
  waypointCount: number,
  keywordCount: number,
  isRecurring: boolean = false,
): number {
  return calculateAdvancedScanCost({
    waypointCount,
    keywordCount,
    depth: 20, // Default depth
    apiCallType: 'circle', // Default to circle
    priority: 'standard', // Default priority
    isRecurring,
  });
}

// Calculate scan cost with all options
export function calculateAdvancedScanCost(options: ScanOptions): number {
  const {
    waypointCount,
    keywordCount,
    depth,
    apiCallType,
    priority,
    isRecurring = false,
  } = options;

  const {
    baseCredits,
    perWaypoint,
    perKeyword,
    perDepthUnit,
    apiCallTypeMultiplier,
    priorityMultiplier,
    recurring,
  } = CREDIT_PRICING;

  // Calculate base cost
  const depthUnits = Math.ceil(depth / 10); // Each 10 results = 1 unit
  let totalCost =
    baseCredits +
    waypointCount * perWaypoint +
    keywordCount * perKeyword +
    depthUnits * perDepthUnit;

  // Apply API call type multiplier
  totalCost *= apiCallTypeMultiplier[apiCallType];

  // Apply priority multiplier
  totalCost *= priorityMultiplier[priority];

  // Handle recurring scans
  if (isRecurring && recurring) {
    totalCost += recurring.setupFee;
    totalCost = Math.round(totalCost * recurring.perExecution);
  }

  return Math.round(totalCost);
}

// Check if user has sufficient credits
export function hasSufficientCredits(requiredCredits: number): boolean {
  const balance = getCreditBalance();
  return balance.remaining >= requiredCredits;
}

// Deduct credits for a scan
export function deductCredits(
  amount: number,
  description: string,
  scanDetails?: {
    scanId: string;
    scanType: "one-time" | "recurring";
    waypointCount?: number;
    keywordCount?: number;
  },
): boolean {
  const balance = getCreditBalance();

  if (balance.remaining < amount) {
    return false; // Insufficient credits
  }

  // Update balance
  const newBalance: CreditBalance = {
    total: balance.total,
    used: balance.used + amount,
    remaining: balance.remaining - amount,
    lastUpdated: new Date().toISOString(),
  };

  // Create transaction record
  const transaction: CreditTransaction = {
    id: `tx_${Date.now()}`,
    type: "scan",
    amount: -amount, // Negative for deduction
    description,
    timestamp: new Date().toISOString(),
    ...scanDetails,
  };

  // Save to localStorage
  localStorage.setItem(CREDIT_BALANCE_KEY, JSON.stringify(newBalance));

  const transactions = getCreditTransactions();
  transactions.unshift(transaction); // Add to beginning
  localStorage.setItem(CREDIT_TRANSACTIONS_KEY, JSON.stringify(transactions));

  // Dispatch custom event for UI updates
  window.dispatchEvent(
    new CustomEvent("creditsUpdated", {
      detail: { balance: newBalance, transaction },
    }),
  );

  return true;
}

// Add credits (purchase, refund, bonus)
export function addCredits(
  amount: number,
  type: "purchase" | "refund" | "bonus",
  description: string,
): void {
  const balance = getCreditBalance();

  // Update balance
  const newBalance: CreditBalance = {
    total: balance.total + amount,
    used: balance.used,
    remaining: balance.remaining + amount,
    lastUpdated: new Date().toISOString(),
  };

  // Create transaction record
  const transaction: CreditTransaction = {
    id: `tx_${Date.now()}`,
    type,
    amount,
    description,
    timestamp: new Date().toISOString(),
  };

  // Save to localStorage
  localStorage.setItem(CREDIT_BALANCE_KEY, JSON.stringify(newBalance));

  const transactions = getCreditTransactions();
  transactions.unshift(transaction);
  localStorage.setItem(CREDIT_TRANSACTIONS_KEY, JSON.stringify(transactions));

  // Dispatch custom event for UI updates
  window.dispatchEvent(
    new CustomEvent("creditsUpdated", {
      detail: { balance: newBalance, transaction },
    }),
  );
}

// Format credit amount for display
export function formatCredits(amount: number): string {
  return new Intl.NumberFormat("en-US").format(Math.abs(amount));
}

// Get credit usage analytics
export function getCreditAnalytics() {
  const transactions = getCreditTransactions();
  const balance = getCreditBalance();

  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);

  const recentTransactions = transactions.filter(
    (tx) => new Date(tx.timestamp) >= last30Days,
  );

  const scanTransactions = recentTransactions.filter(
    (tx) => tx.type === "scan",
  );
  const totalSpent30Days = scanTransactions.reduce(
    (sum, tx) => sum + Math.abs(tx.amount),
    0,
  );
  const scanCount30Days = scanTransactions.length;

  return {
    totalCredits: balance.total,
    usedCredits: balance.used,
    remainingCredits: balance.remaining,
    utilizationRate:
      balance.total > 0 ? (balance.used / balance.total) * 100 : 0,
    last30Days: {
      totalSpent: totalSpent30Days,
      scanCount: scanCount30Days,
      averagePerScan:
        scanCount30Days > 0 ? totalSpent30Days / scanCount30Days : 0,
    },
    transactions: recentTransactions,
  };
}

// Initialize credit system on app load
if (typeof window !== "undefined") {
  initializeCreditSystem();
}
