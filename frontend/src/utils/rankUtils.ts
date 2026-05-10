export function getLevel(xp: number) {
    return Math.floor(Math.sqrt(xp / 100));
}

export function getRank(level: number) {
    if (level >= 36) return "Terabyte";
    if (level >= 24) return "Gigabyte";
    if (level >= 16) return "Megabyte";
    if (level >= 8)  return "Kilobyte";
    if (level >= 4)  return "Byte";
    return "Bit";
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
    const currentLevelMinXP = 100 * Math.pow(level, 2);
    const nextLevelMinXP = 100 * Math.pow(level + 1, 2);
    
    const progressInLevel = xp - currentLevelMinXP;
    const totalLevelXP = nextLevelMinXP - currentLevelMinXP;
    
    return {
        percentage: (progressInLevel / totalLevelXP) * 100,
        currentLevelXP: progressInLevel,
        neededXP: totalLevelXP
    };
};