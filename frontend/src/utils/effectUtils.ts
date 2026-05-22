export const getEffectClass = (effectId?: number): string => {
    switch (effectId) {
        case 1: return 'effect-code-stream';
        case 2: return 'effect-velocity-strike';
        case 3: return 'effect-pixel-victory';
        case 4: return 'effect-quantum-pulse';
        default: return '';
    }
};
