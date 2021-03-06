import mongoose from 'mongoose';
import { IComment } from './Comments';
import { mongooseConnection } from '../../respositories/db';

export const commentsSchema = new mongoose.Schema<IComment>({
    id: { type: String, required: true },
    content: { type: String, required: true },
    userId: { type: String, required: true },
    userLogin: { type: String, required: true },
    addedAt: { type: Date, required: true },
    postId: { type: String, required: true },
});

export const CommentsModel = mongooseConnection.model<IComment>(
    'comments',
    commentsSchema,
    'comments'
);
