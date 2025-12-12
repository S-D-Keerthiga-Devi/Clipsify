import mongoose, { Schema, model, models, Document } from "mongoose";

export const VIDEO_DIMENSIONS = {
    width: 1080,
    height: 1920
} as const;

export interface IVideo extends Document {
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
    controls?: boolean;
    transformation?: {
        height: number;
        width: number;
        quality?: number;
    }
    postedBy: {
        id: string;
        name: string;
        email: string;
      };
}

const videoSchema = new Schema<IVideo>(
    {
        title: {type: String, required: true},
        description: {type: String, required: true},
        thumbnailUrl: {type: String},
        videoUrl: {type: String, required: true},
        controls: {type: Boolean, default: true},
        transformation: {
            height: {type: Number, default: VIDEO_DIMENSIONS.height},
            width: {type: Number, default: VIDEO_DIMENSIONS.width},
            quality: {type: Number, min: 1, max:100},
        },

        postedBy: {
            id: { type: String, required: true },
            name: { type: String, required: true },
            email: { type: String, required: true },
          },
    },
    { timestamps: true }
)

const Video = models?.Video || model<IVideo>("Video", videoSchema)

export default Video