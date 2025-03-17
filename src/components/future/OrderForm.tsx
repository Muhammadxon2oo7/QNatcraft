import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Design {
  shape: string;
  color: string;
  pattern: string;
  size: string;
}

interface OrderFormProps {
  design: Design;
  onDesignChange: (key: string, value: string) => void;
}

export default function OrderForm({ design, onDesignChange }: OrderFormProps) {
  const handleSubmit = () => {
    console.log("Buyurtma tasdiqlandi:", design);
    // Backendga yuborish logikasi qo‘shiladi
  };

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <div>
        <label className="block mb-2 font-semibold">Shakl</label>
        <Select
          value={design.shape}
          onValueChange={(value) => onDesignChange("shape", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Shakl tanlang" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="round">Dumaloq</SelectItem>
            <SelectItem value="square">Kvadrat</SelectItem>
            <SelectItem value="oval">Oval</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block mb-2 font-semibold">Rang</label>
        <Input
          type="color"
          value={design.color}
          onChange={(e) => onDesignChange("color", e.target.value)}
        />
      </div>

      <div>
        <label className="block mb-2 font-semibold">Naqsh</label>
        <Select
          value={design.pattern}
          onValueChange={(value) => onDesignChange("pattern", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Naqsh tanlang" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Yo‘q</SelectItem>
            <SelectItem value="floral">Gulli</SelectItem>
            <SelectItem value="geometric">Geometrik</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block mb-2 font-semibold">O‘lcham</label>
        <Select
          value={design.size}
          onValueChange={(value) => onDesignChange("size", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="O‘lcham tanlang" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="small">Kichik</SelectItem>
            <SelectItem value="medium">O‘rtacha</SelectItem>
            <SelectItem value="large">Katta</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button onClick={handleSubmit} className="w-full">
        Buyurtma berish
      </Button>
    </div>
  );
}