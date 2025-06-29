"use client";

import { Tabs } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { GoComment } from "react-icons/go";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import Box from "@mui/material/Box";
import Masonry from "@mui/lab/Masonry";
import Container from "../common/container";

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
      <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 font-bold text-white bg-muted">
        <p className="text-xl md:text-4xl pb-6">{label}</p>
        <DummyContent />
      </div>
    ),
  }));

  return (
    <Container className="h-[20rem] md:h-[40rem] [perspective:1000px] relative flex flex-col  mx-auto w-full  items-start justify-start mb-10">
      <Tabs tabs={tabs} />
    </Container>
  );
}
interface Poll {
  id: string;
  question: string;
  optionA_text: string;
  optionB_text: string;
  optionA_votes: number;
  optionB_votes: number;
  createdAt: string;
}

const DummyContent = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const getTotalVotes = (poll: Poll) => poll.optionA_votes + poll.optionB_votes;

  useEffect(() => {
    const mockPolls: Poll[] = [
      {
        id: "1",
        question: "Would you rather have the ability to fly or be invisible?",
        optionA_text: "Fly through the skies",
        optionB_text: "Become invisible",
        optionA_votes: 1247,
        optionB_votes: 892,
        createdAt: "2024-01-15T10:30:00Z",
      },
      {
        id: "2",
        question: "Would you rather live in the past or the future?",
        optionA_text: "Live in the past",
        optionB_text: "Live in the future",
        optionA_votes: 634,
        optionB_votes: 1156,
        createdAt: "2024-01-15T09:15:00Z",
      },
      {
        id: "3",
        question:
          "Would you rather have unlimited money or unlimited time hoshjfiojsf  idjs;o fdsifhiod if;ioehjf  fe;ifheifhj  oijfdsiofjh;'  ifd;fiohd ;ifa oihdsfoi;hai ih; feidhfih",
        optionA_text: "Unlimited money",
        optionB_text: "Unlimited time",
        optionA_votes: 2341,
        optionB_votes: 1789,
        createdAt: "2024-01-15T08:45:00Z",
      },
    ];

    setTimeout(() => {
      setPolls(mockPolls);
      setLoading(false);
    }, 1000);
  }, []);

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <section className=" mx-auto pb-12 ">
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card
                key={i}
                className="bg-black/40 border-white/10 backdrop-blur-sm animate-pulse"
              >
                <CardContent className="p-6">
                  <div className="h-4 bg-white/10 rounded mb-4"></div>
                  <div className="h-3 bg-white/10 rounded mb-2"></div>
                  <div className="h-3 bg-white/10 rounded mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-6 w-16 bg-white/10 rounded"></div>
                    <div className="h-6 w-16 bg-white/10 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Box sx={{ width: "100%", minHeight: 393 }}>
            <Masonry columns={{ xs: 1, sm: 2, md: 3 }} spacing={2}>
              {polls.map((poll) => {
                const totalVotes = getTotalVotes(poll);
                const optionAPercentage =
                  totalVotes > 0 ? (poll.optionA_votes / totalVotes) * 100 : 0;
                const optionBPercentage =
                  totalVotes > 0 ? (poll.optionB_votes / totalVotes) * 100 : 0;

                return (
                  <Link key={poll.id} href={`/polls/${poll.id}`}>
                    <Card className="group bg-gray-950/40 border-white/10 backdrop-blur-sm hover:bg-gray-950 hover:border-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 cursor-pointer h-full">
                      <CardContent className="px-6 ">
                        <div className="flex items-start justify-between mb-4">
                          <Badge
                            variant="secondary"
                            className="bg-white/10 text-gray-300 border-0"
                          >
                            {getTimeAgo(poll.createdAt)}
                          </Badge>
                          <div className="flex items-center space-x-1 text-gray-400">
                            <Users className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              {totalVotes.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <h4 className="text-xl font-semibold text-white my-8 group-hover:text-purple-200 transition-colors ">
                          {poll.question}
                        </h4>

                        <div className="mt-8 pt-4 border-t border-white/10">
                          <div className="flex justify-end gap-1 items-center text-xs text-gray-400">
                            <GoComment className="text-[16px]" />
                            {poll.optionA_votes.toLocaleString()}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </Masonry>
          </Box>
        )}
     
    </section>
  );
};
