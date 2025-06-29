"use client";
import Container from "@/components/common/container";
import { Button } from "@/components/ui/button";
import { fetchPollBySlug } from "@/server";
import type { Comment, Poll } from "@/types";
import { useQuery } from "@tanstack/react-query";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import CommentsComponent from "./comment-section";
import { Card, CardContent } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { Dot, Forward, MessageCircle, Reply } from "lucide-react";
import { GoComment } from "react-icons/go";
const LivePoll = ({ slug }: { slug: string }) => {
  const [newComment, setNewComment] = useState("");
  const [showCommentForm, setShowCommentForm] = useState(false);

  const { isLoading, isSuccess, data, isError } = useQuery({
    queryKey: ["poll"],
    gcTime: 0,
    queryFn: async (): Promise<Poll> => {
      const poll = await fetchPollBySlug(slug);
      console.log(poll);
      return poll;
    },
  });

  const handleAddComment = () => {
    // if (newComment.trim() && onAddComment) {
    //   onAddComment(newComment);
    //   setNewComment("");
    // }
  };
  return (
    <>
      <section className=" mt-10">
        <Container>
          <div className="bg-muted max-w-3xl mx-auto p-8 rounded-2xl  ">
            {isLoading ? (
              <LoadingUI />
            ) : isError ? (
              <div className="text-red-500">Failed to load poll.</div>
            ) : isSuccess && data ? (
              <>
                <div>
                  <h1 className="text-xl md:text-4xl font-semibold">
                    {data.question}
                  </h1>
                  <div className="flex flex-col gap-2 mt-6">
                    {[
                      { text: data.optionA_text, votes: data.optionA_votes },
                      { text: data.optionB_text, votes: data.optionB_votes },
                      { text: data.optionC_text, votes: data.optionC_votes },
                      { text: data.optionD_text, votes: data.optionD_votes },
                    ]
                      .filter((option) => option.text)
                      .map((option, idx) => (
                        <Button key={idx} variant="outline">
                          {option.text}
                        </Button>
                      ))}
                  </div>
                </div>
                <div className="flex justify-between mt-8 mb-4">
                  <div className="flex gap-3">
                    <Button
                      className=" px-4 text-xs rounded-full bg-muted-foreground/20 text-white hover:cursor-pointer hover:bg-muted-foreground/30"
                      onClick={() => setShowCommentForm(!showCommentForm)}
                    >
                      <GoComment className="text-[16px]" />
                      {data.comments_count}
                    </Button>
                    <Button className=" px-4 text-xs rounded-full bg-muted-foreground/20 text-white hover:cursor-pointer hover:bg-muted-foreground/30">
                      <Forward className="w-3 h-3 mr-1" />
                      Share
                    </Button>
                  </div>
                  <div className="flex gap-2 items-center text-xs">
                    <span>160</span>{" "}
                    <p className="flex gap-1 items-center">
                      <span className=" border w-2 h-2 rounded-full bg-green-500" />
                      <span>Online</span>
                    </p>
                  </div>
                </div>
                {showCommentForm && (
                  <div className="space-y-3  relative">
                    <Textarea
                      placeholder="Share your thoughts..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="min-h-[100px] resize-none rounded-2xl pb-12"
                    />

                    <Button
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                      className="px-6 absolute bottom-2 right-2 rounded-full hover:cursor-pointer"
                    >
                      Comment
                    </Button>
                  </div>
                )}
              </>
            ) : null}
          </div>
        </Container>
      </section>
      <section className="pt-8 mx-auto max-w-3xl ">
        {data?.comments && (
          <CommentsComponent
            comments={data.comments}
            count={data.comments_count}
          />
        )}
      </section>
    </>
  );
};

const LoadingUI = () => {
  return (
    <div className="h-full w-full grid place-items-center">Loading.......</div>
  );
};

export default LivePoll;
