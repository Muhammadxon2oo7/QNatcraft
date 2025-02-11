import * as React from "react"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import ProfileCard from "./Card"

export function CarouselSpacing() {
  return (
    <Carousel className="w-full h-[540px]">
      <CarouselContent className="-ml-1">
        {Array.from({ length: 10 }).map((_, index) => (
          <CarouselItem key={index} className="">
            <div className="">
              <Card>
                <ProfileCard/>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
