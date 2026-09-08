import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "danger" | "success";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-primary/15 border-primary/60 text-primary hover:bg-primary/25 hover:border-primary active:scale-[0.98]",
  ghost:
    "bg-panel/60 border-panel-edge text-foreground/80 hover:text-foreground hover:border-foreground/40 active:scale-[0.98]",
  danger:
    "bg-destructive/10 border-destructive/50 text-destructive hover:bg-destructive/25 active:scale-[0.98]",
  success:
    "bg-success/15 border-success/50 text-success hover:bg-success/25 active:scale-[0.98]",
};

export function FacilityButton({
  variant = "ghost",
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded border px-5 py-2.5 font-display text-sm tracking-[0.18em] uppercase transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40",
        VARIANTS[variant],
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Panel({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("panel-surface rounded-md", className)}>{children}</div>;
}

export function Modal({
  open,
  title,
  onClose,
  children,
  footer,
  shake,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  shake?: boolean;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <Panel
        className={cn(
          "animate-scale-in max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-b-none sm:rounded-b-md",
          shake && "shake-once",
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-panel-edge px-5 py-4">
          <h2 className="font-display text-lg tracking-[0.16em] text-emergency uppercase">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded px-2 text-xl leading-none text-muted-foreground transition-colors hover:text-foreground"
          >
            ×
          </button>
        </div>
        <div className="px-5 py-5">{children}</div>
        {footer ? (
          <div className="flex flex-wrap justify-end gap-2 border-t border-panel-edge px-5 py-4">
            {footer}
          </div>
        ) : null}
      </Panel>
    </div>
  );
}
