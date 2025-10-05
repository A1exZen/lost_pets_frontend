import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { commentsApi } from '../api/comments';
import type { CreateCommentInput } from '../types/comments';

export const useComments = (listingId: string) => {
	return useQuery({
		queryKey: ['comments', listingId],
		queryFn: () => commentsApi.getComments(listingId),
		enabled: !!listingId,
	});
};

export const useCreateComment = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateCommentInput) => commentsApi.createComment(data),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ['comments', variables.announcementId] });
		},
	});
};

export const useDeleteComment = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (commentId: string) => commentsApi.deleteComment(commentId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['comments'] });
		},
	});
};
