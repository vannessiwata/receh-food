'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    collection,
    addDoc,
    deleteDoc,
    doc,
    onSnapshot,
    updateDoc,
    query,
    orderBy
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { AppState, Expense, InventoryItem, User } from '../types';

const ExpenseContext = createContext<AppState | undefined>(undefined);

const FIXED_USERS: User[] = [
    { name: 'Iwa' },
    { name: 'Caca' },
    { name: 'Ciko' },
    { name: 'Chris' },
    { name: 'Dojeng' },
    { name: 'Haneul' },
    { name: 'Adrian' },
];

export const ExpenseProvider = ({ children }: { children: React.ReactNode }) => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [users, setUsers] = useState<User[]>(FIXED_USERS);
    const [currentUser, setCurrentUserState] = useState<User | null>(null);

    // Load current user from local storage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUser = localStorage.getItem('currentUser');
            if (storedUser) {
                setCurrentUserState(JSON.parse(storedUser));
            }
        }
    }, []);

    const setCurrentUser = (user: User) => {
        setCurrentUserState(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
    };

    const logout = () => {
        setCurrentUserState(null);
        localStorage.removeItem('currentUser');
    };

    // Subscribe to Expenses
    useEffect(() => {
        const q = query(collection(db, 'expenses'), orderBy('date', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Expense[];
            setExpenses(data);
        });
        return () => unsubscribe();
    }, []);

    // Subscribe to Inventory
    useEffect(() => {
        const q = query(collection(db, 'inventory'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as InventoryItem[];
            setInventory(data);
        });
        return () => unsubscribe();
    }, []);

    // Use fixed users list instead of DB for this requirement
    // but if we wanted to sync adding new friends, we would fetch.
    // The user asked for SPECIFIC 7 users. So we stick to FIXED_USERS for the core list.
    // However, maybe we still want to support custom added users? 
    // Let's stick to FIXED_USERS as primary source for now to strictly follow request,
    // but I'll leave the add logic available locally just in case.


    const addExpense = async (expense: Omit<Expense, 'id'>) => {
        await addDoc(collection(db, 'expenses'), expense);
    };

    const deleteExpense = async (id: string) => {
        await deleteDoc(doc(db, 'expenses', id));
    };

    const addInventoryItem = async (item: Omit<InventoryItem, 'id'>) => {
        await addDoc(collection(db, 'inventory'), {
            ...item,
            isBought: item.isBought ?? false
        });
    };

    const toggleInventoryItem = async (id: string) => {
        const item = inventory.find(i => i.id === id);
        if (item) {
            await updateDoc(doc(db, 'inventory', id), {
                isBought: !item.isBought
            });
        }
    };

    const updateInventoryItem = async (id: string, updates: Partial<InventoryItem>) => {
        await updateDoc(doc(db, 'inventory', id), updates);
    };

    const deleteInventoryItem = async (id: string) => {
        await deleteDoc(doc(db, 'inventory', id));
    };

    const addUser = async (name: string) => {
        // Just update local state for session if needed, or ignore since users are fixed
        setUsers(prev => [...prev, { name }]);
    };

    return (
        <ExpenseContext.Provider
            value={{
                expenses,
                inventory,
                users,
                addExpense,
                deleteExpense,
                addInventoryItem,
                toggleInventoryItem,
                updateInventoryItem,
                deleteInventoryItem,
                addUser,
                currentUser,
                setCurrentUser,
                logout
            }}
        >
            {children}
        </ExpenseContext.Provider>
    );
};

export const useExpense = () => {
    const context = useContext(ExpenseContext);
    if (context === undefined) {
        throw new Error('useExpense must be used within an ExpenseProvider');
    }
    return context;
};
