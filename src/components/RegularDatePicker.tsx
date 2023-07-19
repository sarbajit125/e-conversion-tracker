import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react"
import dayjs from 'dayjs';
function RegularDatePicker({additionalStyle, id, label, value, selectDate}: RegularDatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className={additionalStyle?.div}>
        <label htmlFor={id}>{label}</label>
        <Button
          id={id}
          variant={"outline"}
          className={cn(
            "h-10 border mt-1 rounded w-full bg-gray-50 text-left font-normal",
            !(value.length === 0) && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value.length  > 0 ? value : <span>Pick a date</span>}
        </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={new Date(value)}
          onSelect={(date) => selectDate(dayjs(date).format('DD-MM-YYY'))}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
interface RegularDatePickerProps extends RegularTextfieldProps {
  selectDate: (date: string) => void
}

export default RegularDatePicker;
