import * as React from "react";
import { Input } from "./input";
import { cn } from "@/lib/utils";

export interface PhoneInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  onChange?: (value: string) => void;
}

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value.replace(/\D/g, "");
      
      // Format the phone number as user types
      if (value.length > 0) {
        if (value.length <= 3) {
          value = `+${value}`;
        } else if (value.length <= 6) {
          value = `+${value.slice(0, 3)} ${value.slice(3)}`;
        } else {
          value = `+${value.slice(0, 3)} ${value.slice(3, 6)} ${value.slice(6, 15)}`;
        }
      }
      
      onChange?.(value);
    };

    return (
      <Input
        {...props}
        ref={ref}
        type="tel"
        onChange={handleChange}
        className={cn("font-mono", className)}
      />
    );
  }
);

PhoneInput.displayName = "PhoneInput";