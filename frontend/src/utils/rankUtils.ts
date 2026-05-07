export const rankLevels: { [key: string]: number } = {
    "Bit": 0,
    "Byte": 4,
    "Kilobyte": 8,
    "Megabyte": 16,
    "Gigabyte": 24,
    "Terabyte": 36
};

export function getRankColor(rank: string) {
    switch(rank) {
        case "Bit":
            return "#4A4A4A";
        case "Byte":
            return "#23CE6B";
        case "Kilobyte":
            return "#00F0FF";
        case "Megabyte":
            return "#7B61FF";
        case "Gigabyte":
            return "#FF8C00"; 
        case "Terabyte":
            return "#FF2E63";    
        default:
            return "#FFFFFF";
    }
};

export function getRankByLevel(level: number) {
    if(level >= rankLevels["Terabyte"]) 
        return "Terabyte";
    if(level >= rankLevels["Gigabyte"]) 
        return "Gigabyte";
    if(level >= rankLevels["Megabyte"]) 
        return "Megabyte";
    if(level >= rankLevels["Kilobyte"]) 
        return "Kilobyte";
    if(level >= rankLevels["Byte"]) 
        return "Byte";

    return "Bit";
}

export function getLevelMaxXP(level: number) {
    return 100 + (level * 20);
}

export function getLevelByXP(xp: number) {
    return "Terabyte"; // Placeholder, implement logic based on XP thresholds for each level
}