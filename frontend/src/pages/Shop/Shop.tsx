import { Box, Typography, Button, Avatar, CircularProgress } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api';
import { useAccount } from '../../hooks/useAccount';
import notify from '../../components/ui/ToastNotification';
import './Shop.style.css';

const EFFECTS = [
    { id: 0, name: "Default", price: 0, cssClass: "effect-none" },
    { id: 1, name: "Code Stream", price: 150, cssClass: "effect-code-stream" },
    { id: 2, name: "Velocity Strike", price: 300, cssClass: "effect-velocity-strike" },
    { id: 3, name: "Pixel Victory", price: 400, cssClass: "effect-pixel-victory" },
    { id: 4, name: "Quantum Pulse", price: 500, cssClass: "effect-quantum-pulse" }
];

function Shop() {
    const queryClient = useQueryClient();
    const { data: account, isLoading } = useAccount();

    const buyMutation = useMutation({
        mutationFn: async (effectId: number) => {
            await api.post(`/api/shop/buy/${effectId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['account'] });
            notify('Effect purchased!', 'success');
        },
        onError: () => notify('Not enough coins or error.', 'error')
    });

    const equipMutation = useMutation({
        mutationFn: async (effectId: number) => {
            await api.put(`/api/shop/activate/${effectId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['account'] });
            notify('Effect equipped!', 'success');
        }
    });

    if (isLoading || !account) {
        return <CircularProgress />;
    }

    const purchased = account.purchasedEffects;
    const active = account.activeEffect;

    return (
        <Box className="shop-container">
            <Box className="shop-header">
                <Typography variant="h4" fontWeight="bold">Avatar Effects</Typography>
                <Box className="coin-display">
                    <Typography fontWeight="bold" sx={{ color: '#FFD700' }}>
                        {account.coins} Coins
                    </Typography>
                </Box>
            </Box>

            <Box className="shop-grid">
                {EFFECTS.map(effect => {
                    const isOwned = purchased.includes(effect.id);
                    const isActive = active === effect.id;

                    return (
                        <Box key={effect.id} className={`shop-card ${isActive ? 'active-card' : ''}`}>
                            <Box className="preview-container">
                                <Box className={`avatar-wrapper ${effect.cssClass}`}>
                                    <Avatar src={account.profilePictureUrl} sx={{ width: 80, height: 80 }} />
                                </Box>
                            </Box>
                            
                            <Typography variant="h6" fontWeight="bold" mt={2}>{effect.name}</Typography>
                            {!isOwned && (
                                <Typography sx={{ color: '#FFD700', fontWeight: 'bold' }}>
                                    {effect.price} Coins
                                </Typography>
                            )}

                            <Box mt={2}>
                                {!isOwned ? (
                                    <Button 
                                        variant="contained" 
                                        color="primary" 
                                        onClick={() => buyMutation.mutate(effect.id)}
                                        disabled={account.coins < effect.price || buyMutation.isPending}
                                    >
                                        Buy
                                    </Button>
                                ) : (
                                    <Button 
                                        variant={isActive ? "outlined" : "contained"} 
                                        color={isActive ? "secondary" : "success"}
                                        onClick={() => equipMutation.mutate(effect.id)}
                                        disabled={isActive || equipMutation.isPending}
                                    >
                                        {isActive ? "Equipped" : "Equip"}
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
}

export default Shop;