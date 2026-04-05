"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
}

export function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Выберите...",
  className,
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const closeDropdown = useCallback(() => {
    setOpen(false);
    // visible stays true during exit animation, removed after transitionend
  }, []);

  // Sync visible state for enter animation
  useEffect(() => {
    if (open) {
      setVisible(true);
      // Force reflow so the enter transition plays
      requestAnimationFrame(() => {
        dropdownRef.current?.getBoundingClientRect();
      });
    }
  }, [open]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        closeDropdown();
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, closeDropdown]);

  const selectedOption = options.find((o) => o.value === value);

  function handleSelect(optionValue: string) {
    onChange(optionValue);
    closeDropdown();
  }

  function handleTransitionEnd() {
    if (!open) {
      setVisible(false);
    }
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => (open ? closeDropdown() : setOpen(true))}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-xl border px-5 py-3.5 text-sm",
          "bg-card/80 transition-colors",
          "border-[var(--border)] text-[var(--foreground)]",
          "hover:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30",
          !value && "text-[var(--muted-foreground)]"
        )}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-[var(--muted-foreground)] transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown */}
      {(open || visible) && (
        <div
          ref={dropdownRef}
          onTransitionEnd={handleTransitionEnd}
          className={cn(
            "absolute left-0 z-50 mt-1 w-full rounded-xl border",
            "border-[var(--border)] bg-card shadow-xl",
            "max-h-60 overflow-y-auto",
            "origin-top transition-all duration-200 ease-out",
            open && visible
              ? "scale-y-100 opacity-100"
              : "scale-y-95 opacity-0"
          )}
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                style={{
                  transitionDelay: open && visible ? `${index * 30}ms` : "0ms",
                }}
                className={cn(
                  "flex w-full items-center px-4 py-3 text-sm transition-all duration-200",
                  open && visible
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-1 opacity-0",
                  isSelected
                    ? "bg-[var(--primary)] text-white"
                    : "text-[var(--foreground)] hover:bg-[var(--muted)]"
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
