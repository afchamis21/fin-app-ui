export class SessionStorageUtil {
  private static key = "fin-app."

  public static get<T extends string>(key: string): T | undefined {
    const res = sessionStorage.getItem(SessionStorageUtil.key + key) as T
    if (res === 'undefined') {
      return undefined
    }

    return res
  }

  static set<T extends string>(key: string, value: T) {
    sessionStorage.setItem(SessionStorageUtil.key + key, value)
  }

  static remove(key: string) {
    sessionStorage.removeItem(SessionStorageUtil.key + key)
  }
}
