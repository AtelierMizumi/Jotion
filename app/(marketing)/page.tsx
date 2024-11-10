import { Footer } from "./_components/footer";
import { Heading } from "./_components/heading";
import { Carousel } from "./_components/carousel"

const MarketingPage = () => {
  return (
    <div className="min-h-full flex flex-col dark:bg-[#1F1F1F]">
      <div className="flex flex-col items-center justify-center md:justify-start text-center flex-1">
        <Heading />
        <Carousel />
      </div>
      <Footer />
    </div>
  );
}

export default MarketingPage;

