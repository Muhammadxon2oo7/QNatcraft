// lib/api.ts
interface FetchCraftsParams {
    page: number;
    limit: number;
    search?: string; // Ixtiyoriy qilindi
    category?: string; // Ixtiyoriy qilindi
  }
  
  interface Craft {
    id: number;
    image: string;
    title: string;
    category: string;
    description: string;
    rating: number;
    reviews: number;
    location: string;
    craftsmen: string[];
    virtualTours: string[];
  }
  
  interface FetchCraftsResponse {
    crafts: Craft[];
    total: number;
  }
  
  export async function fetchCrafts({ page, limit, search = "", category = "" }: FetchCraftsParams): Promise<FetchCraftsResponse> {
    const crafts: Craft[] = [
      {
        id: 1,
        image: "/workshop/first.png",
        title: "Qoriniyoz ota kulolchilik ustaxonasi",
        category: "HAQIDA",
        description:
          "Pole reality assessment with marginalised. Revision moments globalize backwards eye gmail. Calculator tiger solutionize iterative pushback. Opportunity accountable files time key you’re harvest. So while socialize cadence optimize baseline closer Organic usability where goalposts adoption lot lift request.",
        rating: 4.8,
        reviews: 364,
        location: "Beruny tumani, Qoraqalpog‘iston Respublikasi",
        craftsmen: [
          "Abdullayev Javohir",
          "Usmonov Shaxrizod",
          "Abobakirov Zuhriddin",
          "Ahmiddinov Jamshidbek",
        ],
        virtualTours: [
          "/workshop/workshop1.jpg",
          "/workshop/fifth.png",
          "/workshop/nineth.png",
          "/workshop/second.png",
          "/workshop/fourth.png",
          "/workshop/workshop1.jpg",
        ],
      },
      {
        id: 2,
        image: "/workshop/second.png",
        title: "Qoriniyoz ota kulolchilik ustaxonasi",
        category: "HAQIDA",
        description: "Craftsmen working together on traditional pottery techniques...",
        rating: 4.8,
        reviews: 364,
        location: "Beruny tumani, Qoraqalpog‘iston Respublikasi",
        craftsmen: [
          "Abdullayev Javohir",
          "Usmonov Shaxrizod",
          "Abobakirov Zuhriddin",
          "Ahmiddinov Jamshidbek",
        ],
        virtualTours: [
          "/workshop/workshop1.jpg",
          "/workshop/fifth.png",
          "/workshop/nineth.png",
          "/workshop/second.png",
          "/workshop/fourth.png",
          "/workshop/workshop1.jpg",
        ],
      },
    ];
  
    let filteredCrafts = crafts;
    if (search) {
      filteredCrafts = filteredCrafts.filter((craft) =>
        craft.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (category) {
      filteredCrafts = filteredCrafts.filter((craft) => craft.category === category);
    }
  
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedCrafts = filteredCrafts.slice(start, end);
  
    return {
      crafts: paginatedCrafts,
      total: filteredCrafts.length,
    };
  }