export interface Poll {
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
  comments_count: string;
}
