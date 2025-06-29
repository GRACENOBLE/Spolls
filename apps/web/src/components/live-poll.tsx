"use client";
import Container from "@/components/common/container";
import { Button } from "@/components/ui/button";
import { fetchPollBySlug } from "@/server";
import type { Poll } from "@/types";
import { useQuery } from "@tanstack/react-query";
const LivePoll = ({ slug }: { slug: string }) => {
  const { isLoading, isSuccess, data, isError } = useQuery({
    queryKey: ["poll"],
    gcTime: 0,
    queryFn: async (): Promise<Poll> => {
      const poll = await fetchPollBySlug(slug);
      console.log(poll);
      return poll;
    },
  });
  return (
    <section className="min-h-screen mt-10">
      <Container>
        <div className="bg-muted max-w-3xl mx-auto p-8 rounded-2xl  ">
          {isLoading ? (
            <LoadingUI />
          ) : isError ? (
            <div className="text-red-500">Failed to load poll.</div>
          ) : isSuccess && data ? (
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
                      {option.text} ({option.votes} votes)
                    </Button>
                  ))}
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                {data.comments_count} comments
              </div>
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
};

const LoadingUI = () => {
  return (
    <div className="h-full w-full grid place-items-center">Loading.......</div>
  );
};

export default LivePoll;
