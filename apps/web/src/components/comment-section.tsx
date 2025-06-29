"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Reply, ThumbsUp, ThumbsDown } from "lucide-react";

interface Comment {
  id: string;
  pollId: string;
  parentId: string | null;
  commentText: string;
  createdAt: string;
  voterIdentifier: string;
  children?: Comment[];
}

interface CommentSectionProps {
  commetsCount: number;
  comments: Comment[];
  onAddComment?: (text: string, parentId?: string) => void;
  onReaction?: (commentId: string, reaction: "like" | "dislike") => void;
}

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

const CommentItem = ({
  comment,
  onAddComment,
  onReaction,
  depth = 0,
}: {
  comment: Comment;
  onAddComment?: (text: string, parentId?: string) => void;
  onReaction?: (commentId: string, reaction: "like" | "dislike") => void;
  depth?: number;
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [reactions, setReactions] = useState<Record<string, number>>({
    like: 0,
    dislike: 0,
  });

  const handleReply = () => {
    if (replyText.trim() && onAddComment) {
      onAddComment(replyText, comment.id);
      setReplyText("");
      setShowReplyForm(false);
    }
  };

  const handleReaction = (reaction: "like" | "dislike") => {
    setReactions((prev) => ({
      ...prev,
      [reaction]: (prev[reaction] || 0) + 1,
    }));
    if (onReaction) {
      onReaction(comment.id, reaction);
    }
  };

  return (
    <div
      className={`relative border-l ${depth > 0 ? "ml-12" : ""} ${
        comment.children && comment.children.length > 0 && ""
      }`}
    >
      {/* Curved threading line for replies */}
      {/* {depth > 0 && (
        <div className="absolute -left-6 top-0 w-6 h-12 pointer-events-none">
          <div className="absolute  -top-36 -z-10 w-px h-42 bg-gray-300"></div>
         
          <div className="absolute   w-10 h-12 border-l border-b border-gray-300 rounded-bl-2xl"></div>
        </div>
      )} */}

      <Card className="mb-4 relative border-none bg-transparent p-0">
        <CardContent className="px-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {formatTimeAgo(comment.createdAt)}
              </span>
            </div>

            <p className=" ">{comment.commentText}</p>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-xs"
                  onClick={() => handleReaction("like")}
                >
                  <ThumbsUp className="w-3 h-3 mr-1" />
                  {reactions.like > 0 && reactions.like}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-xs"
                  onClick={() => handleReaction("dislike")}
                >
                  <ThumbsDown className="w-3 h-3 mr-1" />
                  {reactions.dislike > 0 && reactions.dislike}
                </Button>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs"
                onClick={() => setShowReplyForm(!showReplyForm)}
              >
                <Reply className="w-3 h-3 mr-1" />
                Reply
              </Button>
            </div>

            {showReplyForm && (
              <div className="mt-3 relative">
                <Textarea
                  placeholder="Write a reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="min-h-[80px] resize-none pb-12"
                />
                <div className="absolute flex gap-2 bottom-2 right-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      setShowReplyForm(false);
                      setReplyText("");
                    }}
                    className=" px-4 text-xs rounded-full bg-muted-foreground/20 text-white hover:cursor-pointer hover:bg-muted-foreground/30"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleReply}
                    disabled={!replyText.trim()}
                    className="rounded-full"
                  >
                    Reply
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {comment.children && comment.children.length > 0 && (
        <div className="space-y-4 relative">
          {comment.children.map((childComment, index) => (
            <div key={childComment.id} className="relative">
              {/* Connecting line for each child */}
              {/* {depth === 0 && (
                <div className="absolute -left-6 top-0 w-6 h-12 pointer-events-none">
                  <div className="absolute left-3 top-0 w-px h-8 bg-gray-300"></div>
                  <div className="absolute left-3 top-8 w-3 h-px bg-gray-300"></div>
                  <div className="absolute left-3 top-7 w-1 h-1 border-l border-b border-gray-300 rounded-bl-sm"></div>
                </div>
              )} */}
              <CommentItem
                comment={childComment}
                onAddComment={onAddComment}
                onReaction={onReaction}
                depth={depth + 1}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const CommentSection = ({
  commetsCount,
  comments,
  onAddComment,
  onReaction,
}: CommentSectionProps) => {
  // Filter top-level comments (those without parentId)
  const topLevelComments = comments.filter((comment) => !comment.parentId);

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6 isolate">
      {/* Add new comment form */}

      {/* Comments list */}
      <div className="space-y-8">
        {topLevelComments.length > 0 ? (
          topLevelComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onAddComment={onAddComment}
              onReaction={onReaction}
            />
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Example usage with sample data
export default function CommentsComponent({
  comments,
  count,
}: {
  comments: Comment[];
  count: number;
}) {
  const handleAddComment = (text: string, parentId?: string) => {
    console.log("Adding comment:", { text, parentId });
    // Implement your comment addition logic here
  };

  const handleReaction = (commentId: string, reaction: "like" | "dislike") => {
    console.log("Adding reaction:", { commentId, reaction });
    // Implement your reaction logic here
  };

  return (
    <CommentSection
      comments={comments}
      onAddComment={handleAddComment}
      onReaction={handleReaction}
      commetsCount={count}
    />
  );
}
