import HeroSection from "@/components/home/hero-section";
import PollTabs from "@/components/home/poll-tabs";

interface Poll {
  id: string;
  question: string;
  optionA_text: string;
  optionB_text: string;
  optionA_votes: number;
  optionB_votes: number;
  createdAt: string;
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PollTabs />
    </>
  );
}
