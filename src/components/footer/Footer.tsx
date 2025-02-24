import Image from "next/image"
import Link from "next/link"
import { Phone } from "../../../public/img/phone"
import { Mail } from "../../../public/img/mail"
import { Location } from "../../../public/img/location"
import { Telegram } from "../../../public/img/telegram"
import { Instagram } from "../../../public/img/instagram"
import { Youtube } from "../../../public/img/youtube"
import { Feacebook } from "../../../public/img/feacebook"

export const Footer = () => {
  return (
    <footer className="bg-[#242b3a] w-full py-6 sm:py-8 md:py-10">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Upper section */}
        <div className="bg-white/5 rounded-[24px] p-6 sm:p-8 md:p-10 lg:p-14 flex flex-col lg:flex-row gap-8 border-b border-white/20">
          {/* Footer logo and description */}
          <div className="flex-1 min-w-[200px] lg:min-w-[250px]">
            <Image
              src="/img/footer_logo.png"
              alt="footer logo"
              width={200}
              height={72}
              className="mb-4 sm:mb-6 md:mb-8 w-[150px] sm:w-[175px] md:w-[200px] h-auto object-contain"
            />
            <p className="font-medium text-sm sm:text-base leading-[137%] text-white">
              Qoraqalpoq hunarmandchiligi –{" "}
              <span className="text-white/70">tarixiy meros va nafis san'atning uyg'unligi.</span>
            </p>
          </div>
          {/* Pages */}
          <div className="flex-1 min-w-[150px] sm:min-w-[200px]">
            <p className="font-bold text-xl sm:text-2xl text-white opacity-40 mb-4 sm:mb-6">Sahifalar</p>
            <ul className="flex flex-col gap-2">
              {["Bosh sahifa", "Mening kurslarim", "Kurslar", "Yangiliklar"].map((item) => (
                <li key={item}>
                  <Link
                    className="font-normal text-base sm:text-lg text-white hover:text-white/80 transition-colors"
                    href="/"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Contact */}
          <div className="flex-1 min-w-[150px] sm:min-w-[200px]">
            <p className="font-bold text-xl sm:text-2xl text-white opacity-40 mb-4 sm:mb-6">Bog'lanish</p>
            <ul className="flex flex-col gap-2">
              <li>
                <a
                  className="font-normal text-base sm:text-lg text-white flex items-center gap-2 sm:gap-4 hover:text-white/80 transition-colors"
                  href="tel:+998933771283"
                >
                  <Phone  /> +998 93 377 1283
                </a>
              </li>
              <li>
                <a
                  className="font-normal text-base sm:text-lg text-white flex items-center gap-2 sm:gap-4 hover:text-white/80 transition-colors"
                  href="mailto:uze.investment@gmail.com"
                >
                  <Mail  /> uze.investment@gmail.com
                </a>
              </li>
              <li>
                <a
                  className="font-normal text-base sm:text-lg text-white flex items-center gap-2 sm:gap-4 hover:text-white/80 transition-colors"
                  href="/"
                >
                  <Location  /> Toshkent, O'zbekiston
                </a>
              </li>
            </ul>
          </div>
          {/* Social media */}
          <div className="flex-1 min-w-[150px] sm:min-w-[200px]">
            <p className="font-bold text-xl sm:text-2xl text-white opacity-40 mb-4 sm:mb-6">Ijtimoiy tarmoqlar</p>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              {[
                { href: "https://t.me/uzeinvestment", Icon: Telegram },
                { href: "#", Icon: Instagram },
                { href: "#", Icon: Youtube },
                { href: "#", Icon: Feacebook },
              ].map(({ href, Icon }, index) => (
                <a
                  key={index}
                  href={href}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex justify-center items-center bg-[rgba(255,255,255,0.08)] hover:bg-gradient-to-br hover:from-[#cb651c] hover:to-[#813b0a] transition-colors"
                >
                  <Icon fill="white"  />
                </a>
              ))}
            </div>
          </div>
        </div>
        {/* Bottom section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 sm:mt-6 gap-2 sm:gap-4">
          <p className="font-light text-sm sm:text-base lg:text-lg text-white/60 text-center sm:text-left">
            © QQRNatcraft.uz Barcha huquqlar himoyalangan
          </p>
          <p className="font-light text-sm sm:text-base lg:text-lg text-white/60 text-center sm:text-right">
            Sayt <span className="font-normal text-white">E-investment</span> tomonidan ishlab chiqilgan!
          </p>
        </div>
      </div>
    </footer>
  )
}

