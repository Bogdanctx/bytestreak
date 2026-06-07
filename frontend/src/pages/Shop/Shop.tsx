import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api';
import { Box, Typography, Button } from '@mui/material';
import { useAccount } from '../../hooks/useAccount';
import './Shop.style.css';
import AccountAvatar from '../../components/ui/AccountAvatar';
import { SHOP_ITEMS } from '../../utils/constants';

export default function Shop() {
    const queryClient = useQueryClient();
    const { data: account } = useAccount();

    const buyMutation = useMutation({
        mutationFn: (effectName: string) => api.post(`/api/shop/buy/${effectName}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['account'] })
    });

    const purchasedEffects = account?.purchasedEffects || [];

    return (
        <Box className="shop-container">
            <Typography variant="h4" className="shop-title">Avatar Shop</Typography>
            <Typography variant="subtitle1" className="shop-coins">
                Your coins: 🪙 <span style={{"fontFamily": 'JetBrains Mono'}} >{account?.coins || 0}</span>
            </Typography>

            <Box className="shop-grid">
                {SHOP_ITEMS.map((item) => {
                    const isPurchased = purchasedEffects.includes(item.cssName);
                    const canAfford = (account?.coins || 0) >= item.price;

                    return (
                        <Box key={item.cssName} className="shop-card">
                            <AccountAvatar avatarUrl={account?.profilePictureUrl} cssEffectStyle={item.cssName} width={80} height={80} />

                            <Typography variant="h6" className="item-name">{item.name}</Typography>
                            
                            <Typography className="item-price">🪙 {item.price}</Typography>

                            {!isPurchased ? (
                                <Button 
                                    variant="contained" 
                                    className="shop-btn buy-btn"
                                    disabled={!canAfford || buyMutation.isPending}
                                    onClick={() => buyMutation.mutate(item.cssName)}
                                >
                                    Buy
                                </Button>

                            ) : (
                                <Button 
                                    variant="contained" 
                                    className="shop-btn buy-btn"
                                    disabled={isPurchased}
                                    onClick={() => buyMutation.mutate(item.cssName)}
                                >
                                    Purchased
                                </Button>
                            ) }
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
}