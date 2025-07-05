import { Tabs } from "@/components/ui/tabs";
import Container from "../common/container";
import PollsMasonry from "../polls-masonry";

export default function PollTabs() {
  const tabData = [
    { title: "Trending", value: "trending", label: "Trending polls" },
    { title: "Latest", value: "latest", label: "The latest polls" },
    { title: "Politics", value: "politics", label: "Politics" },
    { title: "Music", value: "music", label: "Music" },
    { title: "Movies", value: "movies", label: "Movies" },
    { title: "Tech", value: "tech", label: "Tech" },
  ];

  const tabs = tabData.map(({ title, value, label }) => ({
    title,
    value,
    content: (
      <div className="w-full  relative  rounded-2xl p-10 font-bold text-white bg-muted">
        <p className="text-xl md:text-4xl pb-6">{label}</p>
        <PollsMasonry category={value} />
      </div>
    ),
  }));

  return (
    <Container className="h-[20rem] md:h-[40rem] [perspective:1000px] relative flex flex-col  mx-auto w-full  items-start justify-start mb-10 ">
      <Tabs tabs={tabs} />
      {/* <div className="p-8 border border-red-500 h-96"></div> */}
    </Container>
  );
}
