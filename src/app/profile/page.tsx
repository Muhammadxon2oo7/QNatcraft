import ProfileHeader from "@/components/profile/profile-header"
import ProductsList from "@/components/profile/products-list"
import TransactionsList from "@/components/profile/transactions-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-[1360px]">
        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <a href="#" className="text-primary hover:underline">
            Bosh sahifa
          </a>
          <span>/</span>
          <span>Profil</span>
        </div>

        <h1 className="text-3xl font-bold text-center mb-8 animate-fade-in">Mening profilim</h1>

        <div className="rounded-xl border bg-card shadow-sm overflow-hidden mb-8 animate-slide-up">
          <ProfileHeader />
        </div>

        <Tabs defaultValue="products" className="animate-slide-up-delayed">
          <div className="bg-white rounded-xl border shadow-sm p-4 mb-6">
            <TabsList className="grid grid-cols-3 md:grid-cols-5 gap-2">
              <TabsTrigger value="orders" className="data-[state=active]:bg-primary/10">
                <span className="flex items-center gap-2">
                  <span className="size-4 rounded-full bg-red-100 flex items-center justify-center">
                    <span className="size-2 rounded-full bg-red-500"></span>
                  </span>
                  Tolovlar tarixi
                </span>
              </TabsTrigger>
              <TabsTrigger value="products" className="data-[state=active]:bg-primary/10">
                <span className="flex items-center gap-2">
                  <span className="size-4 rounded-full bg-red-100 flex items-center justify-center">
                    <span className="size-2 rounded-full bg-red-500"></span>
                  </span>
                  Mening mahsulotlarim
                </span>
              </TabsTrigger>
              <TabsTrigger value="text1" className="data-[state=active]:bg-primary/10">
                <span className="flex items-center gap-2">
                  <span className="size-4 rounded-full bg-red-100 flex items-center justify-center">
                    <span className="size-2 rounded-full bg-red-500"></span>
                  </span>
                  Text
                </span>
              </TabsTrigger>
              <TabsTrigger value="text2" className="data-[state=active]:bg-primary/10">
                <span className="flex items-center gap-2">
                  <span className="size-4 rounded-full bg-red-100 flex items-center justify-center">
                    <span className="size-2 rounded-full bg-red-500"></span>
                  </span>
                  Text
                </span>
              </TabsTrigger>
              <TabsTrigger value="exit" className="data-[state=active]:bg-primary/10">
                <span className="flex items-center gap-2">
                  <span className="size-4 rounded-full bg-red-100 flex items-center justify-center">
                    <span className="size-2 rounded-full bg-red-500"></span>
                  </span>
                  Profildan chiqish
                </span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="orders" className="mt-0">
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
              <TransactionsList />
            </div>
          </TabsContent>

          <TabsContent value="products" className="mt-0">
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Mening mahsulotlarim</h2>
                <div className="flex gap-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Qidirish..."
                      className="pl-3 pr-10 py-2 border rounded-md w-full md:w-[300px]"
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-primary">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-search"
                      >
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                      </svg>
                    </button>
                  </div>
                  <button className="bg-primary text-white px-4 py-2 rounded-md flex items-center gap-2">
                    Mahsulot qo'shish
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-plus"
                    >
                      <path d="M5 12h14" />
                      <path d="M12 5v14" />
                    </svg>
                  </button>
                </div>
              </div>
              <ProductsList />
            </div>
          </TabsContent>

          <TabsContent value="text1" className="mt-0">
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Text Content 1</h2>
              <p>This tab content is not shown in the screenshots.</p>
            </div>
          </TabsContent>

          <TabsContent value="text2" className="mt-0">
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Text Content 2</h2>
              <p>This tab content is not shown in the screenshots.</p>
            </div>
          </TabsContent>

          <TabsContent value="exit" className="mt-0">
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Profildan chiqish</h2>
              <p>Are you sure you want to log out?</p>
              <button className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md">Log out</button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

