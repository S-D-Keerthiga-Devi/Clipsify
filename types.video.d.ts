export interface Videos {
    _id: string;
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
    controls?: boolean;
    transformation?: {
      height: number;
      width: number;
      quality?: number;
    };
    postedBy: {
      id: string;
      name: string;
      email: string;
    };
}
  