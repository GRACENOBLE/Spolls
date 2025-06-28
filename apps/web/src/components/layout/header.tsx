"use client";
import Link from "next/link";

import { ModeToggle } from "../mode-toggle";
import { Button, buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import Container from "../common/container";

export default function Header() {
  return (
    <>
      <Container>
        <div className="flex flex-row items-center justify-between  py-1">
          <Link href={"/"} aria-label="go to home" className="text-2xl font-semibold">
            Shadow Polls
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href={"/create"}
              className={cn(
                "hover:cursor-pointer",
                buttonVariants({ variant: "outline" })
              )}
            >
              Create a poll
            </Link>
            <ModeToggle />
          </div>
        </div>
      </Container>
      <hr />
    </>
  );
}
