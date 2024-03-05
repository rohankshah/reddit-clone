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
  replies: string[];
}

export interface CommentObj {
  body: string;
  level: number;
  replies: string[];
  timestamp: Timestamp;
}
