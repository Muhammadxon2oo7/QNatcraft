// app/workshops/page.tsx
import Link from "next/link";
import Image from "next/image";
import { workshops } from "./data";

const WorkshopsPage = () => {
  return (
   <section className="">
   <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center my-6">
        Biz bilan san’at olamini virtual sayohat qiling!
      </h1>
      <div className="grid grid-cols-3 gap-4">
        {workshops.map((workshop) => (
          <Link key={workshop.id} href={`/workshops/${workshop.id}`}>
            <div className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition">
              <Image
                src={workshop.image}
                alt={workshop.title}
                width={400}
                height={250}
                className="w-full h-60 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold">{workshop.title}</h2>
                <p className="text-sm text-gray-600">{workshop.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
   </section>
  );
};

export default WorkshopsPage;
