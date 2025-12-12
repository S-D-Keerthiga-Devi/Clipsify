import mongoose, { Schema, model, models, Document } from "mongoose";

export const IMAGE_DIMENSIONS = {
    width: 720,
    height: 1280
} as const;

export interface IImage extends Document {
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

const imageSchema = new Schema<IImage>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        imageUrl: { type: String, required: true },
        controls: { type: Boolean, default: true },
        transformation: {
            height: { type: Number, default: IMAGE_DIMENSIONS.height },
            width: { type: Number, default: IMAGE_DIMENSIONS.width },
            quality: { type: Number, min: 1, max: 100, default: 80 },
        },
        postedBy: {
            id: { type: String, required: true },
            name: { type: String, required: true },
            email: { type: String, required: true }
        }
    },
    { timestamps: true }
)

// Force recompilation of the model if it exists to ensure schema updates are applied
if (models?.Image) {
    delete models.Image;
}

const Image = model<IImage>("Image", imageSchema)

export default Image