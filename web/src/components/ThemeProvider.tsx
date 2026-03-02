'use client';

import { type ReactNode } from 'react';

// Light theme only — no toggle needed
export function ThemeProvider({ children }: { children: ReactNode }) {
    return <>{children}</>;
}

export function useTheme() {
    return { theme: 'light' as const, toggleTheme: () => { } };
}
