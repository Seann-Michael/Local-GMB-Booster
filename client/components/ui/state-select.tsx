import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export const US_STATES = [
  { value: "AL", label: "Alabama", fullName: "Alabama" },
  { value: "AK", label: "Alaska", fullName: "Alaska" },
  { value: "AZ", label: "Arizona", fullName: "Arizona" },
  { value: "AR", label: "Arkansas", fullName: "Arkansas" },
  { value: "CA", label: "California", fullName: "California" },
  { value: "CO", label: "Colorado", fullName: "Colorado" },
  { value: "CT", label: "Connecticut", fullName: "Connecticut" },
  { value: "DE", label: "Delaware", fullName: "Delaware" },
  { value: "FL", label: "Florida", fullName: "Florida" },
  { value: "GA", label: "Georgia", fullName: "Georgia" },
  { value: "HI", label: "Hawaii", fullName: "Hawaii" },
  { value: "ID", label: "Idaho", fullName: "Idaho" },
  { value: "IL", label: "Illinois", fullName: "Illinois" },
  { value: "IN", label: "Indiana", fullName: "Indiana" },
  { value: "IA", label: "Iowa", fullName: "Iowa" },
  { value: "KS", label: "Kansas", fullName: "Kansas" },
  { value: "KY", label: "Kentucky", fullName: "Kentucky" },
  { value: "LA", label: "Louisiana", fullName: "Louisiana" },
  { value: "ME", label: "Maine", fullName: "Maine" },
  { value: "MD", label: "Maryland", fullName: "Maryland" },
  { value: "MA", label: "Massachusetts", fullName: "Massachusetts" },
  { value: "MI", label: "Michigan", fullName: "Michigan" },
  { value: "MN", label: "Minnesota", fullName: "Minnesota" },
  { value: "MS", label: "Mississippi", fullName: "Mississippi" },
  { value: "MO", label: "Missouri", fullName: "Missouri" },
  { value: "MT", label: "Montana", fullName: "Montana" },
  { value: "NE", label: "Nebraska", fullName: "Nebraska" },
  { value: "NV", label: "Nevada", fullName: "Nevada" },
  { value: "NH", label: "New Hampshire", fullName: "New Hampshire" },
  { value: "NJ", label: "New Jersey", fullName: "New Jersey" },
  { value: "NM", label: "New Mexico", fullName: "New Mexico" },
  { value: "NY", label: "New York", fullName: "New York" },
  { value: "NC", label: "North Carolina", fullName: "North Carolina" },
  { value: "ND", label: "North Dakota", fullName: "North Dakota" },
  { value: "OH", label: "Ohio", fullName: "Ohio" },
  { value: "OK", label: "Oklahoma", fullName: "Oklahoma" },
  { value: "OR", label: "Oregon", fullName: "Oregon" },
  { value: "PA", label: "Pennsylvania", fullName: "Pennsylvania" },
  { value: "RI", label: "Rhode Island", fullName: "Rhode Island" },
  { value: "SC", label: "South Carolina", fullName: "South Carolina" },
  { value: "SD", label: "South Dakota", fullName: "South Dakota" },
  { value: "TN", label: "Tennessee", fullName: "Tennessee" },
  { value: "TX", label: "Texas", fullName: "Texas" },
  { value: "UT", label: "Utah", fullName: "Utah" },
  { value: "VT", label: "Vermont", fullName: "Vermont" },
  { value: "VA", label: "Virginia", fullName: "Virginia" },
  { value: "WA", label: "Washington", fullName: "Washington" },
  { value: "WV", label: "West Virginia", fullName: "West Virginia" },
  { value: "WI", label: "Wisconsin", fullName: "Wisconsin" },
  { value: "WY", label: "Wyoming", fullName: "Wyoming" },
  {
    value: "DC",
    label: "District of Columbia",
    fullName: "District of Columbia",
  },
];

interface StateSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  name?: string;
}

export function StateSelect({
  value,
  onValueChange,
  placeholder = "Select state...",
  disabled = false,
  className,
  id,
  name,
}: StateSelectProps) {
  const [open, setOpen] = useState(false);

  const selectedState = US_STATES.find((state) => state.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled}
          id={id}
          name={name}
        >
          {selectedState ? (
            <span className="flex items-center gap-2">
              <span className="font-medium">{selectedState.value}</span>
              <span className="text-muted-foreground">
                {selectedState.fullName}
              </span>
            </span>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Search states..." />
          <CommandEmpty>No state found.</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            {US_STATES.map((state) => (
              <CommandItem
                key={state.value}
                value={`${state.value} ${state.fullName}`}
                onSelect={() => {
                  onValueChange?.(state.value);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === state.value ? "opacity-100" : "opacity-0",
                  )}
                />
                <span className="font-medium mr-2">{state.value}</span>
                <span className="text-muted-foreground">{state.fullName}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// Simple Select version (without search)
export function StateSelectSimple({
  value,
  onValueChange,
  placeholder = "Select state...",
  disabled = false,
  className,
  id,
  name,
}: StateSelectProps) {
  return (
    <Select
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      name={name}
    >
      <SelectTrigger className={className} id={id}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {US_STATES.map((state) => (
          <SelectItem key={state.value} value={state.value}>
            <span className="flex items-center gap-2">
              <span className="font-medium">{state.value}</span>
              <span className="text-muted-foreground">{state.fullName}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
