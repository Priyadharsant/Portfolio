import React from 'react';

interface Props {
  current: any;
  original?: any;
  children: React.ReactNode;
}

export default function DiffHighlight({ current, original, children }: Props) {
  // If original is undefined, it means we are not in diff mode (e.g. public view)
  if (original === undefined) {
    return <>{children}</>;
  }

  // Check if the value has changed
  const isChanged = JSON.stringify(current) !== JSON.stringify(original);

  if (isChanged) {
    return (
      <span className="relative inline-block">
        <span className="absolute inset-0 bg-amber-500/20 rounded border border-amber-500/50 pointer-events-none animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.5)] z-0" style={{ transform: 'scale(1.05)' }} />
        <span className="relative z-10 text-amber-900 dark:text-amber-300 font-bold">
          {children}
        </span>
      </span>
    );
  }

  return <>{children}</>;
}
