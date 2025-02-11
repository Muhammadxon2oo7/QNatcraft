import { Trophy, Users, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function ProfileCard() {
  return (
    <Card className="flex overflow-hidden bg-[#FDF6F3] max-w-5xl">
      <div className="flex-1 p-8 space-y-6">
        <div className="space-y-4">
          <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-white bg-[#8B5E3C] rounded-full">
            Kulol
          </span>

          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-gray-900">Alisher Zafarovich Polonchiyev</h2>
            <p className="text-gray-600 leading-relaxed">
              Pole reality assassin with marginalised. Revision moments globalize backwards eye gmail. Calculator tiger
              solutionize initiative pushback. Opportunity accountable files time key you're harvest. So while socialize
              cadence optimize baseline closer. Organic usability where goalposts adoption lot lift request
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-[#8B5E3C]" />
            <span className="text-gray-900">4 yillik tajriba</span>
          </div>

          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-[#8B5E3C]" />
            <span className="text-gray-900">300+ shogirtlar</span>
          </div>

          <div className="flex items-center gap-3">
            <Trophy className="w-5 h-5 text-[#8B5E3C]" />
            <span className="text-gray-900">Xalqaro musobaqalar sovrindori</span>
          </div>
        </div>

        <Button variant="outline" className="border-[#8B5E3C] text-[#8B5E3C] hover:bg-[#8B5E3C] hover:text-white">
          Batafsil
          <span className="ml-2">→</span>
        </Button>
      </div>

      <div className="relative w-[500px]">
        <img
          src="/img/craftman.png"
          alt="Artisan holding a decorative ceramic plate"
          className="object-cover w-full h-full"
        />
      </div>
    </Card>
  )
}

