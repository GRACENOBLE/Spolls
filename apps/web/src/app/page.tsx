"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, TrendingUp, Zap } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/10 backdrop-blur-sm bg-black/20">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/25">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    PSP
                  </h1>
                  <p className="text-sm text-gray-400">
                    The Public Shadow Poll
                  </p>
                </div>
              </div>
              <Link href="/create">
                <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white border-0 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Poll
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
              Anonymous. Real-time. Decisive.
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Cast your vote in the shadows and watch the world decide in
              real-time. Every choice matters, every vote counts, every decision
              shapes the collective mind.
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
