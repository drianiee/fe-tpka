"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type Props = {
  value?: DateRange
  onChange: (range: DateRange | undefined) => void
  className?: string
  placeholder?: string
}

export function DateRangePicker({
  value,
  onChange,
  className,
  placeholder = "Pilih rentang tanggal",
}: Props) {
  const label = React.useMemo(() => {
    if (!value?.from) return placeholder
    if (!value.to) return format(value.from, "yyyy-MM-dd")
    return `${format(value.from, "yyyy-MM-dd")} — ${format(value.to, "yyyy-MM-dd")}`
  }, [value, placeholder])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn("w-full justify-start text-left font-normal md:w-[260px]", className)}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span className={cn(!value?.from && "text-muted-foreground")}>{label}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          numberOfMonths={2}
          selected={value}
          onSelect={onChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
