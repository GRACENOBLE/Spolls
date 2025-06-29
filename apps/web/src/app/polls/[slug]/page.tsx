import Container from "@/components/common/container";
import { Button } from "@/components/ui/button";

const page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  return (
    <section className="min-h-screen mt-10">
      <Container>
        <div className="bg-muted p-8 rounded-2xl min-h-96 ">
          <h1 className=" text-xl md:text-4xl font-semibold">Poll title</h1>
          {/* {slug} */}
          <div className="flex flex-col gap-2">
            {["option 1", "option 2"].map((option, idx) => (
              <Button key={idx} variant="outline">
                Choose {option}
              </Button>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default page;
