import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Box, Typography, Button, Divider } from '@mui/material';
import { api } from '../../api';
import { useAccount } from '../../hooks/useAccount';
import AccountAvatar from '../../components/ui/AccountAvatar';
import { SHOP_ITEMS } from '../../utils/constants';

function AppearanceTab() {
    const queryClient = useQueryClient();
    const { data: account } = useAccount();

    const activateMutation = useMutation({
        mutationFn: (effectName: string) => api.put(`/api/shop/activate/${effectName || 'none'}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['account'] })
    });

    const purchasedEffects = account?.purchasedEffects || [];
    const activeEffect = account?.cssEffectStyle || '';

    const ownedItems = SHOP_ITEMS.filter(item => 
        item.cssName === '' || purchasedEffects.includes(item.cssName)
    );

    return (
        <Box sx={{ padding: '2rem', color: 'var(--text-primary)' }}>
            <Typography variant="h5" sx={{ mb: 3 }} fontFamily="Momo Trust Display" >APPEARANCE</Typography>

            <Divider className="account-header-separator" />

            <Box className="shop-grid">
                {ownedItems.map((item) => {
                    const isActive = activeEffect === item.cssName;

                    return (
                        <Box key={item.cssName || 'none'} className="shop-card">
                            <AccountAvatar avatarUrl={account?.profilePictureUrl} cssEffectStyle={item.cssName} width={80} height={80} />

                            <Typography variant="h6" className="item-name">{item.name}</Typography>

                            {isActive ? (
                                <Button disabled variant="contained" className="shop-btn active-btn">
                                    Equipped
                                </Button>
                            ) : (
                                <Button 
                                    variant="outlined" 
                                    className="shop-btn equip-btn"
                                    disabled={activateMutation.isPending}
                                    onClick={() => activateMutation.mutate(item.cssName)}
                                >
                                    Equip
                                </Button>
                            )}
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
}

export default AppearanceTab;