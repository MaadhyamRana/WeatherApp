// Helpers functions for project

// Convert Kelvin to Celsius
export function KtoC(K: number): number {
    return Math.floor(K - 273.15); 
}

// Convert Metres to Kilometres
export function MtoKM(M: number): string {
    return `${(M / 1000).toFixed(0)}`;
}

// Convert Metres/Second to Kilometres/Hour
export function MStoKMH(M: number): string {
return `${(M * 3.6).toFixed(0)}`;
}