import { Minus, Plus } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FontSizeInputProps {
  value: number;
  onChange: (value: number) => void;
};

export const FontSizeInput = ({
  value,
  onChange,
}: FontSizeInputProps) => {
  const safeValue = isNaN(value) || typeof value !== "number" ? 32 : Math.round(value);

  const increment = () => onChange(safeValue + 1);
  const decrement = () => onChange(Math.max(1, safeValue - 1));

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const parsed = parseInt(e.target.value, 10);
    onChange(isNaN(parsed) ? 1 : parsed);
  };

  return (
    <div className="flex items-center">
      <Button
        onClick={decrement}
        variant="outline"
        className="p-2 rounded-r-none border-r-0"
        size="icon"
      >
        <Minus className="size-4" />
      </Button>
      <Input
        onChange={handleChange}
        value={safeValue}
        className="w-[50px] h-8 focus-visible:ring-offset-0 focus-visible:ring-0 rounded-none text-center"
      />
      <Button
        onClick={increment}
        variant="outline"
        className="p-2 rounded-l-none border-l-0"
        size="icon"
      >
        <Plus className="size-4" />
      </Button>
    </div>
  );
};
