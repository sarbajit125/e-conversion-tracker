import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import React from "react";

function RegularDropDown(props: RegularDropdownProps) {
  const [position, setPosition] = React.useState("bottom");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex py-3  rounded-lg text-gray-500 font-semibold cursor-pointer">
          {props.title.length === 0 ? props.placeholder : props.title}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="rounded-xl border border-gray-200 bg-white w-full p-2">
        <DropdownMenuRadioGroup value={position} onValueChange={(value) => props.selected(value)}>
          {props.list.map((item, idx) => {
            return (
              <DropdownMenuRadioItem key={idx} value={item} className="p-2">
                {item}
              </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default RegularDropDown;

export interface RegularDropdownProps {
  title: string;
  list: string[];
  placeholder: string;
  selected: (id: string) => void;
}
