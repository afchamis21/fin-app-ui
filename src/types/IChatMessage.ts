export interface IChatMessage {
  content: string
  kind: 'USER' | 'ASSISTANT' | 'LOADER'
}
