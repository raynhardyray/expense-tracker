export interface AccountDTO {
    name: string;
    balance: string;
};

export interface Account extends AccountDTO {
    id: number;
    userId: number;
    createdAt: string | Date;
};