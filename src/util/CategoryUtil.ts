import type { ICategory } from "@/types/ICategory";
import type { IEntry } from "@/types/IEntry";

export class CategoryUtil {
  public static categoryTextColor(category: ICategory): string {
    const hex = category.color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance > 0.5 ? 'text-gray-800' : 'text-gray-50';
  }

  public static getEntryType(entry: IEntry) {
    let inCounter = 0
    let outCounter = 0

    for (const category of entry.categories) {
      if (category.type === 'IN') inCounter++;
      else outCounter++;
    }

    if (inCounter > outCounter) return 'IN'
    else if (outCounter > inCounter) return 'OUT'
    else return 'MIXED'
  }
}
