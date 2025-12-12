export interface Images {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;

  controls?: boolean;
  transformation?: {
      height: number;
      width: number;
      quality?: number;
  }
  postedBy?: {
      id: string;
      name: string;
      email: string;
  }
}
  