"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

/* ================= TYPES ================= */

export type ComboboxOption = {
  id: number;
  label: string;
};

type BaseProps = {
  options: ComboboxOption[];

  open: boolean;
  onOpenChange: (v: boolean) => void;

  search: string;
  onSearchChange: (v: string) => void;

  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
};

/* ---------- SINGLE ---------- */
type SingleProps = BaseProps & {
  multiple?: false;
  value: number | null;
  onChange: (value: number) => void;
};

/* ---------- MULTI ---------- */
type MultiProps = BaseProps & {
  multiple: true;
  value: number[];
  onChange: (value: number[]) => void;
};

type Props = SingleProps | MultiProps;

/* ================= COMPONENT ================= */

export function SearchableCombobox(props: Props) {
  const {
    options,
    open,
    onOpenChange,
    search,
    onSearchChange,
    placeholder = "Pilih",
    disabled,
    loading,
  } = props;

  const isMultiple = props.multiple === true;

  /* ===== label ===== */
  const label = React.useMemo(() => {
    if (isMultiple) {
      const ids = props.value;
      if (ids.length === 0) return placeholder;

      const names = options
        .filter((o) => ids.includes(o.id))
        .map((o) => o.label);

      return names.length <= 2
        ? names.join(", ")
        : `${names.slice(0, 2).join(", ")} +${names.length - 2}`;
    }

    const selected = options.find((o) => o.id === props.value);
    return selected?.label ?? placeholder;
  }, [props, options, isMultiple, placeholder]);

  /* ===== toggle ===== */
  const toggle = (id: number) => {
    if (!isMultiple) {
      props.onChange(id);
      onOpenChange(false);
      return;
    }

    const values = props.value;
    props.onChange(
      values.includes(id)
        ? values.filter((v) => v !== id)
        : [...values, id]
    );
  };

  /* ===== autofocus search ===== */
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  React.useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 0);
    return () => clearTimeout(t);
  }, [open]);

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          disabled={disabled}
          className="w-full justify-between"
        >
          <span className={cn("truncate", !label && "text-muted-foreground")}>
            {label}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="p-0 w-[--radix-popover-trigger-width]">
        <Command shouldFilter={false}>
          <CommandInput
            ref={inputRef}
            placeholder="Cari..."
            value={search}
            onValueChange={onSearchChange}
          />

          <CommandList>
            <CommandEmpty>
              {loading ? "Loading..." : "Data tidak ditemukan"}
            </CommandEmpty>

            <CommandGroup>
              {options.map((o) => {
                const checked = isMultiple
                  ? props.value.includes(o.id)
                  : props.value === o.id;

                return (
                  <CommandItem
                    key={o.id}
                    value={o.label}
                    onSelect={() => toggle(o.id)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        checked ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="truncate">{o.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
