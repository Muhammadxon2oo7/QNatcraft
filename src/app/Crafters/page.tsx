import Image from "next/image";
import { Trophy, Clock, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dot } from "@/components/dot/Dot";
import Link from "next/link";
import { Home } from "../../../public/img/Home";

export default function CraftersDirectory() {
  return (
    <div className="max-w-[1380px] mx-auto px-[10px]  ">
      <div className="flex items-center gap-2 text-sm text-muted-foreground  border-b border-[#e7e7e9] py-[16px]">
        <span>
          <Link
            href={"/"}
            className="flex items-center gap-[8px] text-[#858991] font-[500] "
          >
            <Home /> Home
          </Link>
        </span>
        <span>/</span>
        <span className="text-[#242b3a] font-[500]">Artisans</span>
      </div>

      <div className="text-center mb-12">
        <Badge className="rounded-[24px] mb-[16px] bg-[#fcdbdb] hover:bg-[#fcdbdb] cursor-pointer p-[10px_16px] h-[36px]  gap-[10px] inline-flex items-center badge">
          <Dot />
          <p className="font-sans  font-bold text-[16px] leading-none bg-gradient-to-br from-[#9e1114] to-[#530607] bg-clip-text text-transparent">
            HUNARMANDLAR
          </p>
        </Badge>
        <h1 className="text-3xl font-bold">Master Craftspeople</h1>
      </div>

      <div className="space-y-6">
        {/* Craftsperson 1 */}
        <div className="border rounded-xl overflow-hidden bg-white">
          <div className="grid md:grid-cols-[360px_1fr] gap-6">
            <div className="relative h-[300px]">
              <Image
                src="/img/craftman.png"
                alt="Craftsperson with pottery"
                width={300}
                height={300}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="px-[20px]">
              <div className="grid md:grid-cols-[1fr_250px] gap-6">
                <div>
                  <div className="mb-4 md:mb-[16px] w-full h-[28px]">
                    <Badge
                      className="rounded-[24px] primary-bg cursor-pointer inline-flex gap-[10px] h-full  text-white"
                      variant="secondary"
                    >
                      <Dot />
                      <p
                        style={{
                          fontSize: "clamp(0.75rem, 1vw + 0.75rem, 0.875rem)",
                        }}
                        className="font-medium leading-none text-white w-full"
                      >
                        Kulol
                      </p>
                    </Badge>
                  </div>
                  <h2 className="text-2xl font-bold mb-3">Michael Anderson</h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Master potter with traditional techniques. Creates
                    functional and decorative ceramics inspired by ancient
                    designs. Specializes in hand-thrown vessels with unique
                    glazes and finishes.
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    Master potter with traditional techniques. Creates
                    functional and decorative ceramics inspired by ancient
                    designs. Specializes in hand-thrown vessels with unique
                    glazes and finishes.
                  </p>
                  <p className="text-sm text-gray-600">
                    Master potter with traditional techniques. Creates
                    functional and decorative ceramics inspired by ancient
                    designs. Specializes in hand-thrown vessels with unique
                    glazes.
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-4">Achievements</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="text-red-800">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium">4 years experience</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-red-800">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium">300+ students</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-red-800">
                        <Trophy className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium">
                          International award winner
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Craftsperson 2 */}
        <div className="border rounded-xl overflow-hidden bg-white">
          <div className="grid md:grid-cols-[300px_1fr] gap-6">
            <div className="relative h-[300px]">
              <Image
                src="/placeholder.svg?height=300&width=300"
                alt="Craftsperson with ceramic plate"
                width={300}
                height={300}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-[1fr_250px] gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="destructive" className="rounded-md px-3">
                      Pottery
                    </Badge>
                  </div>
                  <h2 className="text-2xl font-bold mb-3">Sarah Johnson</h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Master potter with traditional techniques. Creates
                    functional and decorative ceramics inspired by ancient
                    designs. Specializes in hand-thrown vessels with unique
                    glazes and finishes.
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    Master potter with traditional techniques. Creates
                    functional and decorative ceramics inspired by ancient
                    designs. Specializes in hand-thrown vessels with unique
                    glazes and finishes.
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-4">Achievements</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="text-red-800">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium">4 years experience</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-red-800">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium">300+ students</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Craftsperson 3 */}
        <div className="border rounded-xl overflow-hidden bg-white">
          <div className="grid md:grid-cols-[300px_1fr] gap-6">
            <div className="relative h-[300px]">
              <Image
                src="/placeholder.svg?height=300&width=300"
                alt="Craftsperson with pottery"
                width={300}
                height={300}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-[1fr_250px] gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="destructive" className="rounded-md px-3">
                      Pottery
                    </Badge>
                  </div>
                  <h2 className="text-2xl font-bold mb-3">David Miller</h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Master potter with traditional techniques. Creates
                    functional and decorative ceramics inspired by ancient
                    designs. Specializes in hand-thrown vessels with unique
                    glazes and finishes.
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    Master potter with traditional techniques. Creates
                    functional and decorative ceramics inspired by ancient
                    designs. Specializes in hand-thrown vessels with unique
                    glazes and finishes.
                  </p>
                  <p className="text-sm text-gray-600">
                    Master potter with traditional techniques. Creates
                    functional and decorative ceramics inspired by ancient
                    designs. Specializes in hand-thrown vessels with unique
                    glazes.
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-4">Achievements</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="text-red-800">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium">4 years experience</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-red-800">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium">300+ students</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-red-800">
                        <Trophy className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium">
                          International award winner
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Craftsperson 4 */}
        <div className="border rounded-xl overflow-hidden bg-white">
          <div className="grid md:grid-cols-[300px_1fr] gap-6">
            <div className="relative h-[300px]">
              <Image
                src="/placeholder.svg?height=300&width=300"
                alt="Craftsperson with ceramic plate"
                width={300}
                height={300}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-[1fr_250px] gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="destructive" className="rounded-md px-3">
                      Pottery
                    </Badge>
                  </div>
                  <h2 className="text-2xl font-bold mb-3">Emma Thompson</h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Master potter with traditional techniques. Creates
                    functional and decorative ceramics inspired by ancient
                    designs. Specializes in hand-thrown vessels with unique
                    glazes and finishes.
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    Master potter with traditional techniques. Creates
                    functional and decorative ceramics inspired by ancient
                    designs. Specializes in hand-thrown vessels with unique
                    glazes and finishes.
                  </p>
                  <p className="text-sm text-gray-600">
                    Master potter with traditional techniques. Creates
                    functional and decorative ceramics inspired by ancient
                    designs. Specializes in hand-thrown vessels with unique
                    glazes.
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-4">Achievements</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="text-red-800">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium">4 years experience</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-red-800">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium">300+ students</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-red-800">
                        <Trophy className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium">
                          International award winner
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
