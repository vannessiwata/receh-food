export type Category = 'transport' | 'alat' | 'makanan';

export interface Expense {
    id: string;
    title: string;
    amount: number;
    payer: string; // Name of the person who paid
    category: Category;
    date: string;
    type?: 'group' | 'personal';
}

export interface InventoryItem {
    id: string;
    name: string;
    quantityNeeded: string;
    isBought: boolean;
    price?: number; // Optional, if they want to track how much it actually cost
    purchaser?: string; // Who bought it
}

export interface User {
    name: string;
}

export interface AppState {
    expenses: Expense[];
    inventory: InventoryItem[];
    users: User[];
    addExpense: (expense: Omit<Expense, 'id'>) => void;
    deleteExpense: (id: string) => void;
    addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
    toggleInventoryItem: (id: string) => void;
    updateInventoryItem: (id: string, updates: Partial<InventoryItem>) => void;
    deleteInventoryItem: (id: string) => void;
    addUser: (name: string) => void;
    currentUser: User | null;
    setCurrentUser: (user: User) => void;
    logout: () => void;
}
