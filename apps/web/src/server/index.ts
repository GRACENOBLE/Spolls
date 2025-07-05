"use server";

export const getServerStatus = async () => {
  try {
    const response = await fetch("http://localhost:3000/");
    // console.log("response from server: ", response);
    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }
    const serverStatus = await response.json();
    return serverStatus.status;
  } catch (error) {
    console.error("Failed to fetch server status:", error);
    throw error;
  }
};

export const fetchPolls = async () => {
  try {
    const response = await fetch("http://localhost:3000/polls");
    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }
    const polls = await response.json();
    return polls;
  } catch (error) {
    console.error("Failed to fetch polls:", error);
    throw error;
  }
};

export const fetchPollBySlug = async (slug: string) => {
  try {
    const response = await fetch("http://localhost:3000/polls/" + slug);
    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }
    const poll = await response.json();
    return poll;
  } catch (error) {
    console.error("Failed to fetch polls:", error);
    throw error;
  }
};

export const castVote = async (option: string, id: string) => {
  try {
    const response = await fetch("/polls/" + id + "/vote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({option: option}),
    });
    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }
  } catch (error) {
    console.error("Failed to fetch polls:", error);
    throw error;
  }
};
