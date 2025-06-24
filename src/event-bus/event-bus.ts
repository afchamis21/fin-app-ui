import type { ICategory } from "@/types/ICategory"
import type { IEntry } from "@/types/IEntry"

type EbEvent = Record<string, unknown>

export class EventBus<Events extends EbEvent> {
  private subscriptions: Map<string, (payload: unknown) => void> = new Map()

  private counter = 0

  public on<K extends keyof Events>(event: K, callback: Events[K] extends void ? () => void : (payload: Events[K]) => void): string {
    const id = `${String(event)}-${this.counter++}`
    this.subscriptions.set(id, callback as (payload: unknown) => void)
    return id
  }

  public emit<K extends keyof Events>(event: K, ...payload: Events[K] extends void ? [] : [Events[K]]): void {
    this.subscriptions.forEach((callback, k) => {
      if (k.startsWith(String(event))) {
        callback(...(payload as [unknown]))
      }
    })
  }

  public off(id: string): void {
    this.subscriptions.delete(id)
  }
}

type EventMap = {
  "reset-input": { inputIds: string[] },
  "mark-input-touched": { inputIds: string[] },
  "edit-entry": { entry: IEntry },
  "select-category": { selectId: string, category?: ICategory }
  "select-categories": { selectId: string, categories: ICategory[] }
}

export const eventBus = new EventBus<EventMap>()

export const sseEvents = ["NEW_ENTRIES"] as const
type SseEvent = typeof sseEvents[number]

type SseEventMap = {
  [K in SseEvent]: { event: Event }
}
export const sseEventBus = new EventBus<SseEventMap>()
