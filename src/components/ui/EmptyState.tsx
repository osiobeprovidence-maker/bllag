import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon: Icon, title, message, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-8 text-center bg-gray-50/50 border-2 border-dashed border-gray-200">
      <div className="p-6 bg-white rounded-full shadow-sm mb-6">
        <Icon className="h-8 w-8 text-gray-300" />
      </div>
      <h3 className="text-sm font-black uppercase tracking-widest mb-2">{title}</h3>
      <p className="text-xs text-muted-foreground mb-8 max-w-xs mx-auto leading-relaxed uppercase font-bold">{message}</p>
      {action && (
        <button 
          onClick={action.onClick}
          className="bg-primary text-white px-8 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all shadow-xl"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
