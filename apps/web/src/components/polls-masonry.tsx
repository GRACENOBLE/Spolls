"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import Masonry from "@mui/lab/Masonry";
import Box from "@mui/material/Box";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Users } from "lucide-react";
import { GoComment } from "react-icons/go";
import { useQuery } from "@tanstack/react-query";
import { fetchPolls } from "@/server";

interface Poll {
  id: string;
  comments_count: number;
  question: string;
  optionA_text: string;
  optionB_text: string;
  optionC_text?: string;
  optionD_text?: string;
  optionA_votes: number;
  optionB_votes: number;
  optionC_votes?: number;
  optionD_votes?: number;
  topics: Array<{ name: string; slug: string }>;
  createdAt: string;
  slug: string;
}

const PollsMasonry = ({ category }: { category: string }) => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { isLoading, isSuccess, data, isError } = useQuery({
    queryKey: ["all-polls"],
    queryFn: async (): Promise<Array<Poll>> => {
      const polls = await fetchPolls();
      console.log(polls);

      return polls;
    },
  });

  useEffect(() => {
    if (isError) {
      setError(
        "Failed to retrieve polls at this time. Please refresh the window to try again"
      );
    } else {
      setError(null);
      data && setPolls(data);
    }
  }, [isSuccess, isError]);

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
      {isLoading ? (
        <LoadingUI />
      ) : error ? (
        <ErrorUI error={error} />
      ) : (
        <Box sx={{ width: "100%", minHeight: 393 }}>
          <Masonry columns={{ xs: 1, sm: 2, md: 3 }} spacing={2}>
            {polls
              .filter(
                (poll) =>
                  category === "trending" ||
                  category === "latest" ||
                  poll.topics?.some(
                    (topic: { slug: string }) => topic.slug === category
                  )
              )
              .map((poll) => (
                <Link key={poll.id} href={`/polls/${poll.slug}`}>
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
                            {poll.optionA_votes +
                              poll.optionB_votes +
                              (poll.optionC_votes ?? 0) +
                              (poll.optionD_votes ?? 0)}
                          </span>
                        </div>
                      </div>

                      <h4 className="text-xl font-semibold text-white my-8 group-hover:text-purple-200 transition-colors ">
                        {poll.question}
                      </h4>

                      <div className="mt-8 pt-4 border-t border-white/10">
                        <div className="flex justify-end gap-1 items-center text-xs text-gray-400">
                          <GoComment className="text-[16px]" />
                          {poll.comments_count.toLocaleString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
          </Masonry>
        </Box>
      )}
    </section>
  );
};

const LoadingUI = () => {
  return (
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
  );
};

const ErrorUI = ({ error }: { error: string }) => {
  return <div className="min-h-96 grid place-items-center">{error}</div>;
};

export default PollsMasonry;
