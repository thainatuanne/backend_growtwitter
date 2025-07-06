export interface CreateLikeDTO {
    usuarioId: number;
    tweetId: number;
}

export interface UpdateLikeDTO {
    id: number;
    usuarioId?: number;
    tweetId?: number;
}