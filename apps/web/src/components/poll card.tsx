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

const PollCard = ({ poll }: { poll: Poll }) => {
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
  const getTotalVotes = (poll: Poll) => poll.optionA_votes + poll.optionB_votes;

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
              <span>{poll.optionA_votes.toLocaleString()} votes</span>
              <span>{poll.optionB_votes.toLocaleString()} votes</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default PollCard;
