export const toUserResponseDTO = (user) => {
    return {
        id: user.id,
        User: user.user_name,
        Created: new Date(user.created_at).toLocaleString()
    };
};