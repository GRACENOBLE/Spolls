import LivePoll from "@/components/live-poll";

const page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  return <LivePoll slug={slug} />;
};

export default page;
