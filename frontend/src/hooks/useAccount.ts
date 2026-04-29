import { useQuery } from '@tanstack/react-query';
import { api } from '../api';
import { type IAccount } from '../entities';

export const useAccount = () => {
    return useQuery<IAccount>({
        queryKey: ['account'],
        queryFn: async () => {
            const response = await api.get('/auth/me');
            return response.data;
        },
        retry: false,
        staleTime: 1000 * 10, // 10 seconds
        refetchInterval: 1000 * 10
    });
};
