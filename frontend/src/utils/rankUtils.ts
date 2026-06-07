export function getRank(xp: number) {
    if (xp >= 6000) return "Terabyte";
    if (xp >= 3000) return "Gigabyte";
    if (xp >= 1500) return "Megabyte";
    if (xp >= 600)  return "Kilobyte";
    if (xp >= 200)  return "Byte";
    return "Bit";
}

export function getLevel(xp: number) {
    return Math.floor(Math.sqrt(xp / 100)) + 1;
};

export function getRankColor(rank: string) {
    if (rank === "Bit") return "#4A4A4A";
    if (rank === "Byte") return "#23CE6B";
    if (rank === "Kilobyte") return "#00F0FF";
    if (rank === "Megabyte") return "#7B61FF";
    if (rank === "Gigabyte") return "#FF8C00"; 
    if (rank === "Terabyte") return "#FF2E63";
    return "#FFFFFF";
};

export function getXPProgress(xp: number) {
    const level = getLevel(xp);
    
    const currentLevelMinXP = 100 * Math.pow(level - 1, 2);
    const nextLevelMinXP = 100 * Math.pow(level, 2);
    
    const progressInLevel = xp - currentLevelMinXP;
    const totalLevelXP = nextLevelMinXP - currentLevelMinXP;
    
    return {
        percentage: (progressInLevel / totalLevelXP) * 100,
        currentLevelXP: progressInLevel,
        neededXP: totalLevelXP
    };
}