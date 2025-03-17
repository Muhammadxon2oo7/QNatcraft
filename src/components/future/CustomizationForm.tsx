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
  color: string;
  pattern: string;
  extra: string;
}

interface CustomizationFormProps {
  product: string;
  design: Design;
  onDesignChange: (key: string, value: string) => void;
}

export default function CustomizationForm({
  product,
  design,
  onDesignChange,
}: CustomizationFormProps) {
  const handleSubmit = () => {
    console.log("Buyurtma:", { product, ...design });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">
        {product}ni Sozlash
      </h2>

      <div>
        <label className="block mb-2 font-medium text-gray-700">Rang</label>
        <Input
          type="color"
          value={design.color}
          onChange={(e) => onDesignChange("color", e.target.value)}
          className="w-full h-12"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium text-gray-700">Naqsh</label>
        <Select
          value={design.pattern}
          onValueChange={(value) => onDesignChange("pattern", value)}
        >
          <SelectTrigger className="w-full">
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
        <label className="block mb-2 font-medium text-gray-700">Qo‘shimcha</label>
        <Select
          value={design.extra}
          onValueChange={(value) => onDesignChange("extra", value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Detal tanlang" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Yo‘q</SelectItem>
            <SelectItem value="handle">Tutqich</SelectItem>
            <SelectItem value="ornament">Bezak</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button onClick={handleSubmit} className="w-full bg-green-600 hover:bg-green-700">
        Buyurtma Berish
      </Button>
    </div>
  );
}