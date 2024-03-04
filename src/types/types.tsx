import { Timestamp } from "firebase/firestore";

export interface PostObj {
  title: string;
  body: string;
  createdByUid: string;
  postId: string;
  published: Timestamp;
  displayName: string;
  score: number;
  upvoteArr: string[];
  downvoteArr: string[];
}
