export class NumberUtil {
  public static roundToNearest(num: number, digits = 2): number {
    const pow = Math.pow(10, digits);
    return Math.round(num * pow) / pow;
  }

  public static randInt(floor: number, ceiling: number): number {
    return Math.floor(Math.random() * (ceiling - floor + 1)) + floor;
  }

  public static formatCurrency(num: number): string {
    return `R$ ${num.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
  }
}
