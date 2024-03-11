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
  replies: (string | CommentObj)[];
  timestamp: Timestamp;
  createdByUid: string;
  displayName?: string;
  commentUid?: string;
  deleted?: boolean;
}

export interface UserObj {
  displayName: string;
  email: string;
  id: string;
  followers?: string[];
}
