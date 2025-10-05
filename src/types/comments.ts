export interface Comment {
	id: string;
	content: string;
	authorId: string;
	announcementId: string;
	createdAt: string;
	updatedAt: string;
	author: {
		id: string;
		email: string;
	};
}

export interface CreateCommentInput {
	content: string;
	announcementId: string;
}
