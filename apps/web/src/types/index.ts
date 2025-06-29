export type Poll = {
  id: string;
  question: string;
  optionA_text: string;
  optionB_text: string;
  optionA_votes: number;
  optionB_votes: number;
  optionC_text: string;
  optionD_text: string;
  optionC_votes: number;
  optionD_votes: number;
  createdAt: string;
  comments: Comment[];
  comments_count: number;
};

export type Comment = {
  id: string;
  commentText: string;
  createdAt: string;
  parentId: string | null;
  pollId: string;
  voterIdentifier: string;
  children: Comment[];
};
