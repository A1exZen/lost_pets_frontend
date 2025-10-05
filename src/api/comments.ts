import axiosConfig from '../config/axiosConfig';
import type { Comment, CreateCommentInput } from '../types/comments';

export const commentsApi = {
	createComment: async (data: CreateCommentInput): Promise<Comment> => {
		const response = await axiosConfig.post('/api/comments', data);
		return response.data;
	},

	getComments: async (listingId: string): Promise<Comment[]> => {
		const response = await axiosConfig.get(`/api/comments/${listingId}`);
		return response.data;
	},

	deleteComment: async (commentId: string): Promise<void> => {
		await axiosConfig.delete(`/api/comments/${commentId}`);
	}
};
