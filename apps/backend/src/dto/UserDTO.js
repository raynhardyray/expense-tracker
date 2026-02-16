export const toUserResponseDTO = (user) => {
    return {
        id: user.id,
        username: user.username,
        createdAt: user.created_at
    };
};