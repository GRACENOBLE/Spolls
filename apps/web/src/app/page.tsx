"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, TrendingUp, Zap } from "lucide-react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import HeroSection from "@/components/home/hero-section";

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
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const query = useQuery({
    queryKey: ["todos"],
    queryFn: async (): Promise<Array<Poll>> => {
      const response = await fetch("http://localhost:3000/polls");
      return await response.json();
    },
  });

  query.isLoading
    ? console.log("Fetching...")
    : query.isSuccess && console.log(query.data);
  // Mock data for demonstration
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
        question: "Would you rather have unlimited money or unlimited time?",
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

  const getTotalVotes = (poll: Poll) => poll.optionA_votes + poll.optionB_votes;

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
    <div className="min-h-screen">
      <div className="relative z-10">
        {/* Hero Section */}
        {/* <HeroSection /> */}
        {/* Polls Grid */}
        <section className="container mx-auto px-4 pb-12">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">Active Polls</h3>
            <p className="text-gray-400">
              Join the conversation and make your voice heard
            </p>
          </div>

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
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {polls.map((poll) => {
                const totalVotes = getTotalVotes(poll);
                const optionAPercentage =
                  totalVotes > 0 ? (poll.optionA_votes / totalVotes) * 100 : 0;
                const optionBPercentage =
                  totalVotes > 0 ? (poll.optionB_votes / totalVotes) * 100 : 0;

                return (
                  <Link key={poll.id} href={`/polls/${poll.id}`}>
                    <Card className="group bg-black/40 border-white/10 backdrop-blur-sm hover:bg-black/60 hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 cursor-pointer h-full">
                      <CardContent className="p-6">
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

                        <h4 className="text-lg font-semibold text-white mb-4 group-hover:text-purple-200 transition-colors line-clamp-2">
                          {poll.question}
                        </h4>

                        <div className="space-y-3">
                          <div className="relative">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm text-gray-300 truncate pr-2">
                                {poll.optionA_text}
                              </span>
                              <span className="text-sm font-medium text-purple-400">
                                {optionAPercentage.toFixed(0)}%
                              </span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full transition-all duration-500 shadow-sm shadow-purple-500/50"
                                style={{ width: `${optionAPercentage}%` }}
                              ></div>
                            </div>
                          </div>

                          <div className="relative">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm text-gray-300 truncate pr-2">
                                {poll.optionB_text}
                              </span>
                              <span className="text-sm font-medium text-cyan-400">
                                {optionBPercentage.toFixed(0)}%
                              </span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full transition-all duration-500 shadow-sm shadow-cyan-500/50"
                                style={{ width: `${optionBPercentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-white/10">
                          <div className="flex justify-between items-center text-xs text-gray-400">
                            <span>
                              {poll.optionA_votes.toLocaleString()} votes
                            </span>
                            <span>
                              {poll.optionB_votes.toLocaleString()} votes
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
