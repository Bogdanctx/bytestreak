import { useQuery } from '@tanstack/react-query';
import { api } from '../api';
import { type IAccount } from '../types/account.types';

export const useAccount = () => {
    return useQuery<IAccount>({
        queryKey: ['account'],
        queryFn: async () => {
            const response = await api.get('/auth/me');
            return response.data;
        },
        refetchInterval: 5 * 60 * 1000 // Refetch every 5 minutes to keep the account data up-to-date
    });
};
