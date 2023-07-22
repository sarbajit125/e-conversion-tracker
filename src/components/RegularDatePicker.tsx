import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react"
import dayjs from 'dayjs';
import { RegularTextfieldProps, RegularTextfieldStyles } from "@/layouts/ComponentsStyle";
import { useField, useFormikContext } from 'formik'
function RegularDatePicker({additionalStyle, id, label}: RegularDatePickerProps) {
  const [field, { touched, error }] = useField(id)
  const { setFieldValue } = useFormikContext();
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
            !(field.value.length === 0) && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {field.value.length  > 0 ? field.value : <span>Pick a date</span>}
        </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={(field.value && new Date(field.value)) || null}
          onSelect={(date) => setFieldValue(id, dayjs(date).format('DD-MM-YYY'))}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
interface RegularDatePickerProps {
  id: string,
  label: string,
  additionalStyle?: RegularTextfieldStyles;
}

export default RegularDatePicker;
