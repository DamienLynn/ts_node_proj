
export const calculateMargin = (price: number, cost: number): number => {
    return (price - cost) * 100 / price ?? 0;
};