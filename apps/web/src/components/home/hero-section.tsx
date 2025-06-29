import { Spotlight } from "@/components/ui/spotlight";

const HeroSection = () => {
  return (
    <div className="h-[60vh] w-full rounded-md flex md:items-center md:justify-center  antialiased bg-grid-white/[0.02] relative overflow-x-clip">
      <Spotlight />
      <div className=" p-4 max-w-7xl  mx-auto relative z-10  w-full pt-20 md:pt-0">
        <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
          Ask and Vote <br /> Anonymously in real time.
        </h1>
        <p className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
          The most discrete way to ask questions publically and show your stand
          on sensitive topics.
        </p>
      </div>
    </div>
  );
};

export default HeroSection;
