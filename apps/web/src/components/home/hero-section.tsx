import { TrendingUp, Users, Zap } from "lucide-react";

const HeroSection = () => {
  return (
    <section className=" mx-auto px-4 h-[70vh] text-center grid place-items-center">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
          Anonymous. Real-time. Decisive.
        </h2>
        <p className="text-xl text-gray-300 mb-8 leading-relaxed">
          Cast your vote in the shadows and watch the world decide in real-time.
          Every choice matters, every vote counts, every decision shapes the
          collective mind.
        </p>
        <div className="flex items-center justify-center space-x-8 text-gray-400">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-purple-400" />
            <span>Anonymous Voting</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            <span>Real-time Results</span>
          </div>
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-pink-400" />
            <span>Instant Impact</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
