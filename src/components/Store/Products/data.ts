export type Product = {
    id: string
    image: string
    category: string
    title: string
    workshop: string
    currentPrice: number
    originalPrice: number | null
    isFavorite: boolean,
    discount:number,
  }
  
  export const products: Product[] = [
    {
      id: "1",
      image: "/store/products/first.png",
      category: "Kulolchilik",
      title: "Qo‘l mehnati bilan ishlangan sopol choynak va piyolalar to‘plami",
      workshop: "Qoriyev ota kulolchilik ustaxonasi",
      currentPrice: 525000,
      originalPrice: 750000,
      isFavorite: false,
      discount:10
    },
    {
      id: "2",
      image: "/store/products/second.png",
      category: "Metallga ishlov berish",
      title: "Noyob metall naqshli bezak buyumlari",
      workshop: "Rustamovlar hunarmandchilik uyi",
      currentPrice: 450000,
      originalPrice: null,
      isFavorite: false,
      discount:0
    },
    {
      id: "3",
      image: "/store/products/third.png",
      category: "Kashtachilik",
      title: "Qo‘lda tikilgan milliy do‘ppi",
      workshop: "O‘zbekiston hunarmandchilik markazi",
      currentPrice: 320000,
      originalPrice: 400000,
      isFavorite: false,
      discount:60
    },
    {
      id: "4",
      image: "/store/products/fourth.png",
      category: "Kulolchilik",
      title: "Qo‘l mehnati bilan ishlangan milliy naqshli lagan",
      workshop: "Sharipovlar kulolchilik uyi",
      currentPrice: 280000,
      originalPrice: 350000,
      isFavorite: false,
      discount:1
    },
    {
      id: "5",
      image: "/store/products/fifth.png",
      category: "Metallga ishlov berish",
      title: "O‘zbek an’anaviy naqshlari tushirilgan qozon",
      workshop: "Rustamovlar hunarmandchilik uyi",
      currentPrice: 750000,
      originalPrice: 900000,
      isFavorite: false,
      discount:0
    },
    {
      id: "6",
      image: "/store/products/sixth.png",
      category: "Kashtachilik",
      title: "Qo‘lda tikilgan milliy jiyakli chopon",
      workshop: "O‘zbekiston hunarmandchilik markazi",
      currentPrice: 680000,
      originalPrice: null,
      isFavorite: false,
      discount:2
    },
    {
      id: "7",
      image: "/store/products/first.png",
      category: "Kulolchilik",
      title: "Qo‘l mehnati bilan ishlangan sopol piyolalar to‘plami",
      workshop: "Qoriyev ota kulolchilik ustaxonasi",
      currentPrice: 450000,
      originalPrice: 500000,
      isFavorite: false,
      discount:0
    },
    {
      id: "8",
      image: "/store/products/third.png",
      category: "Metallga ishlov berish",
      title: "O‘zbek milliy naqshli mis patnis",
      workshop: "Rustamovlar hunarmandchilik uyi",
      currentPrice: 500000,
      originalPrice: 600000,
      isFavorite: false,
      discount:0
    },
    {
      id: "9",
      image: "/store/products/second.png",
      category: "Kashtachilik",
      title: "Qo‘lda tikilgan gul naqshli sumka",
      workshop: "O‘zbekiston hunarmandchilik markazi",
      currentPrice: 380000,
      originalPrice: 450000,
      isFavorite: false,
      discount:20
    },
    {
      id: "10",
      image: "/store/products/fifth.png",
      category: "Kulolchilik",
      title: "Qo‘l mehnati bilan ishlangan sopol kosa to‘plami",
      workshop: "Qoriyev ota kulolchilik ustaxonasi",
      currentPrice: 420000,
      originalPrice: 480000,
      isFavorite: false,
      discount:1
    },
  ]
  