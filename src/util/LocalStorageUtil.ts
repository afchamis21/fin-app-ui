export class LocalStorageUtil {
  private static key = "fin-app."

  public static get<T extends string>(key: string): T | undefined {
    const res = localStorage.getItem(LocalStorageUtil.key + key) as T
    if (res === 'undefined') {
      return undefined
    }

    return res
  }

  static set<T extends string>(key: string, value: T) {
    localStorage.setItem(LocalStorageUtil.key + key, value)
  }

  static remove(key: string) {
    localStorage.removeItem(LocalStorageUtil.key + key)
  }
}
