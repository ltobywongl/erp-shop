import { Carousel } from "antd";
import Image from "next/image";
import carousel1 from "@/public/images/carousel1.jpg";
import carousel2 from "@/public/images/carousel2.jpg";
import carousel3 from "@/public/images/carousel3.jpg";

export default function Home() {
  return (
    <main className="flex flex-col">
      <Carousel autoplay>
        <div className="w-full h-auto">
          <Image src={carousel1} alt="Image" />
        </div>
        <div>
          <Image src={carousel2} alt="Image" />
        </div>
        <div>
          <Image src={carousel3} alt="Image" />
        </div>
      </Carousel>
    </main>
  );
}
