"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
};

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  return (
    <div className={cn("fixed inset-0 z-50", open ? "" : "hidden")}>
      <div className="absolute inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
      <div className="absolute inset-0 grid place-items-center p-4">
        <div className="w-full max-w-lg rounded-lg border bg-background text-foreground shadow-lg">
          {children}
        </div>
      </div>
    </div>
  );
}

export function DialogHeader({ children }: { children: React.ReactNode }) {
  return <div className="p-4 border-b"><h3 className="text-lg font-semibold">{children}</h3></div>;
}

export function DialogContent({ children }: { children: React.ReactNode }) {
  return <div className="p-4 space-y-4">{children}</div>;
}

export function DialogFooter({ children }: { children: React.ReactNode }) {
  return <div className="p-4 border-t flex items-center justify-end gap-2">{children}</div>;
}


