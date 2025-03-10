"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"

interface ProductModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ProductModal({ open, onOpenChange }: ProductModalProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Mahsulotni tahrirlash</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Mahsulot nomi</Label>
            <Input
              id="name"
              defaultValue="Qo'l mehnat bilan ishlangan sopol choynak va piyolalar to'plami"
              className="w-full"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Izoh/qo'shimcha izoh</Label>
            <Input id="description" defaultValue="Qoriniyoz ota kulolchilik ustaxonasi" className="w-full" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="price">Mahsulot narxi</Label>
            <Input id="price" defaultValue="525 000 so'm" className="w-full" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category">Mahsulot kategoriyasi</Label>
            <Select defaultValue="metalga">
              <SelectTrigger>
                <SelectValue placeholder="Kategoriyani tanlang" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="metalga">Metalga ishlov berish</SelectItem>
                <SelectItem value="yog">Yog'och o'ymakorligi</SelectItem>
                <SelectItem value="kulol">Kulolchilik</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="discount">Chegirma foizi (ixtiyoriy)</Label>
            <Input id="discount" defaultValue="0 %" className="w-full" />
          </div>

          <div className="grid gap-2">
            <Label>Mahsulot rasmi</Label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                {imagePreview ? (
                  <Image
                    src={imagePreview || "/placeholder.svg"}
                    alt="Preview"
                    width={96}
                    height={96}
                    className="object-cover"
                  />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-image text-muted-foreground"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                )}
              </div>
              <Button variant="outline" className="relative">
                Rasm yuklash
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setImagePreview(URL.createObjectURL(e.target.files[0]))
                    }
                  }}
                />
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Bekor qilish
          </Button>
          <Button>Mahsulotni tasdiqlash</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

