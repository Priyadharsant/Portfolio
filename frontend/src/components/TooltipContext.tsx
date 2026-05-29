import { createContext, useContext, useState, type ReactNode } from 'react';

type TooltipContextType = {
    showTooltip: (content: string, position: { x: number; y: number }, placement?: 'top' | 'bottom') => void;
    hideTooltip: () => void;
    tooltip: {
        content: string;
        position: { x: number; y: number };
        visible: boolean;
        placement: 'top' | 'bottom';
    };
};

const TooltipContext = createContext<TooltipContextType | undefined>(undefined);

export const TooltipProvider = ({ children }: { children: ReactNode }) => {
    const [tooltip, setTooltip] = useState({ content: '', position: { x: 0, y: 0 }, visible: false, placement: 'bottom' as 'top' | 'bottom' });
    const showTooltip = (content: string, position: { x: number; y: number }, placement: 'top' | 'bottom' = 'bottom') => setTooltip({ content, position, visible: true, placement });
    const hideTooltip = () => setTooltip((prev) => ({ ...prev, visible: false }));
    return <TooltipContext.Provider value={{ showTooltip, hideTooltip, tooltip }}>{children}</TooltipContext.Provider>;
};

export const useTooltip = () => {
    const context = useContext(TooltipContext);
    if (!context) {
        throw new Error('useTooltip must be used within a TooltipProvider');
    }
    return context;
};