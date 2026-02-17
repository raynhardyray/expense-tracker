import type { UserRecord } from "@shared/types/user.ts";

export const toUserResponseDTO = (user: UserRecord) => {
    return {
        id: user.id,
        User: user.user_name,
        Created: new Date(user.created_at).toLocaleString()
    };
};