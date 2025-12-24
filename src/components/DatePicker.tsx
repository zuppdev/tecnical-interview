"use client"
import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DateTimePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  label?: string
  id?: string
  error?: string
  required?: boolean
}

export function DateTimePicker({
  value,
  onChange,
  label = "Date and Time",
  id = "date",
  error,
  required = false,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(value)
  const [selectedHour, setSelectedHour] = React.useState<string>(
    value ? value.getHours().toString().padStart(2, "0") : "12"
  )

  React.useEffect(() => {
    if (value) {
      setSelectedDate(value)
      setSelectedHour(value.getHours().toString().padStart(2, "0"))
    }
  }, [value])

  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"))

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    if (date && selectedHour) {
      const newDate = new Date(date)
      newDate.setHours(parseInt(selectedHour), 0, 0, 0)
      onChange?.(newDate)
    } else {
      onChange?.(date)
    }
  }

  const handleHourChange = (hour: string) => {
    setSelectedHour(hour)
    if (selectedDate) {
      const newDate = new Date(selectedDate)
      newDate.setHours(parseInt(hour), 0, 0, 0)
      onChange?.(newDate)
    }
  }

  const formatDateTime = (date: Date | undefined) => {
    if (!date) return "Select date and time"
    const dateStr = date.toLocaleDateString()
    const timeStr = `${date.getHours().toString().padStart(2, "0")}:00`
    return `${dateStr} at ${timeStr}`
  }

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <Label htmlFor={id} className="px-1">
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id={id}
            className="w-full justify-between font-normal transition-all hover:scale-[1.01]"
            aria-invalid={error ? "true" : "false"}
          >
            <span className={selectedDate ? "" : "text-muted-foreground"}>
              {formatDateTime(selectedDate)}
            </span>
            <CalendarIcon className="h-4 w-4 transition-transform group-hover:scale-110" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0 animate-in fade-in-50 slide-in-from-top-2 duration-200" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            captionLayout="dropdown"
            onSelect={handleDateSelect}
          />
          <div className="border-t p-3">
            <Label htmlFor="hour-select" className="text-xs mb-2 block">
              Select Hour
            </Label>
            <Select value={selectedHour} onValueChange={handleHourChange}>
              <SelectTrigger id="hour-select" className="w-full">
                <SelectValue placeholder="Hour" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                {hours.map((hour) => (
                  <SelectItem key={hour} value={hour}>
                    {hour}:00
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </PopoverContent>
      </Popover>
      {error && <p className="text-sm text-destructive px-1">{error}</p>}
    </div>
  )
}
