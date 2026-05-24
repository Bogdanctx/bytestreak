import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api';
import { Box, Typography, Button, Avatar } from '@mui/material';
import { useAccount } from '../../hooks/useAccount';
import './Shop.style.css';
import AccountAvatar from '../../components/ui/AccountAvatar';

const SHOP_ITEMS = [
    { name: 'Fire', cssName: 'cssEffectFire', price: 100 },
    { name: 'Ice', cssName: 'cssEffectIce', price: 200 },
    { name: 'Lightning', cssName: 'cssEffectLightning', price: 300 },
    { name: 'Quantum Pulse', cssName: 'cssEffectQuantumPulse', price: 500 },
];

export default function Shop() {
    const queryClient = useQueryClient();
    const { data: account } = useAccount();

    const buyMutation = useMutation({
        mutationFn: (effectName: string) => api.post(`/api/shop/buy/${effectName}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['account'] })
    });

    const activateMutation = useMutation({
        mutationFn: (effectName: string) => api.put(`/api/shop/activate/${effectName}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['account'] })
    });

    const purchasedEffects = account?.purchasedEffects || [];
    const activeEffect = account?.cssEffectStyle || '';

    return (
        <Box className="shop-container">
            <Typography variant="h4" className="shop-title">Avatar Shop</Typography>
            <Typography variant="subtitle1" className="shop-coins">
                Your Coins: 🪙 {account?.coins || 0}
            </Typography>

            <Box className="shop-grid">
                {SHOP_ITEMS.map((item) => {
                    const isPurchased = purchasedEffects.includes(item.cssName);
                    const isActive = activeEffect === item.cssName;
                    const canAfford = (account?.coins || 0) >= item.price;

                    return (
                        <Box key={item.cssName} className="shop-card">
                            {/* <Box className={`avatar-wrapper ${item.cssName}`}>
                                <Avatar 
                                    src={account?.profilePictureUrl} 
                                    sx={{ width: 80, height: 80 }} 
                                />
                            </Box> */}
                            <AccountAvatar avatarUrl={account?.profilePictureUrl} cssEffectStyle={item.cssName} width={80} height={80} />

                            <Typography variant="h6" className="item-name">{item.name}</Typography>
                            
                            {!isPurchased && (
                                <Typography className="item-price">🪙 {item.price}</Typography>
                            )}

                            {isActive ? (
                                <Button disabled variant="contained" className="shop-btn active-btn">
                                    Equipped
                                </Button>
                            ) : isPurchased ? (
                                <Button 
                                    variant="outlined" 
                                    className="shop-btn equip-btn"
                                    onClick={() => activateMutation.mutate(item.cssName)}
                                    disabled={activateMutation.isPending}
                                >
                                    Equip
                                </Button>
                            ) : (
                                <Button 
                                    variant="contained" 
                                    className="shop-btn buy-btn"
                                    disabled={!canAfford || buyMutation.isPending}
                                    onClick={() => buyMutation.mutate(item.cssName)}
                                >
                                    Buy
                                </Button>
                            )}
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
}