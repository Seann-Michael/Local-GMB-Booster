import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { useDropdownState } from "@/hooks/useDropdownState";
import { ChevronDown, X, History, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SmartDropdownInputProps {
  fieldName: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  maxHistorySize?: number;
  allowMultiple?: boolean;
  separator?: string;
}

export function SmartDropdownInput({
  fieldName,
  value,
  onChange,
  placeholder = "Type or select...",
  className,
  disabled = false,
  maxHistorySize = 20,
  allowMultiple = false,
  separator = ",",
}: SmartDropdownInputProps) {
  const { options, addOption, removeOption, clearHistory } = useDropdownState(
    fieldName,
    maxHistorySize,
  );

  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync input value with prop value
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
  };

  const handleInputBlur = () => {
    // Add current value to history when user finishes typing
    if (inputValue.trim() && inputValue !== value) {
      if (allowMultiple) {
        // For multiple values, add each one separately
        const values = inputValue
          .split(separator)
          .map((v) => v.trim())
          .filter((v) => v);
        values.forEach((v) => addOption(v));
      } else {
        addOption(inputValue.trim());
      }
    }
  };

  const handleOptionSelect = (optionValue: string) => {
    if (allowMultiple && inputValue.trim()) {
      // For multiple values, append to existing
      const currentValues = inputValue
        .split(separator)
        .map((v) => v.trim())
        .filter((v) => v);
      if (!currentValues.includes(optionValue)) {
        const newValue = [...currentValues, optionValue].join(`${separator} `);
        setInputValue(newValue);
        onChange(newValue);
      }
    } else {
      // For single values, replace
      setInputValue(optionValue);
      onChange(optionValue);
    }
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleInputBlur();
      setIsOpen(false);
    } else if (e.key === "ArrowDown" && !isOpen) {
      setIsOpen(true);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const filteredOptions = options.filter(
    (option) =>
      option.label.toLowerCase().includes(inputValue.toLowerCase()) &&
      option.value !== inputValue.trim(),
  );

  return (
    <div className={cn("relative", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              className="pr-8"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1 h-6 w-6 p-0"
              onClick={() => setIsOpen(!isOpen)}
              disabled={disabled}
            >
              <ChevronDown className="h-3 w-3" />
            </Button>
          </div>
        </PopoverTrigger>

        <PopoverContent className="w-full p-2" align="start">
          {filteredOptions.length > 0 ? (
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-2 pb-2 border-b">
                <History className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  Recent entries
                </span>
                {options.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearHistory}
                    className="ml-auto h-6 px-2 text-xs"
                  >
                    <Trash2 className="h-3 w-3" />
                    Clear
                  </Button>
                )}
              </div>

              {filteredOptions.slice(0, 10).map((option, index) => (
                <div
                  key={`${option.value}-${index}`}
                  className="flex items-center justify-between group hover:bg-muted rounded px-2 py-1"
                >
                  <button
                    className="flex-1 text-left text-sm"
                    onClick={() => handleOptionSelect(option.value)}
                  >
                    {option.label}
                  </button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeOption(option.value);
                    }}
                    className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}

              {filteredOptions.length > 10 && (
                <div className="text-xs text-muted-foreground text-center py-1">
                  +{filteredOptions.length - 10} more options...
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground text-center py-4">
              {options.length === 0
                ? "Start typing to build your dropdown history"
                : "No matching entries found"}
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
