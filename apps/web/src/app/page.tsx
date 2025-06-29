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
import Container from "@/components/common/container";
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
    <>
      <HeroSection />
      <PollTabs />
    </>
  );
}
