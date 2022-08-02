export interface Handler {
  setNext(next: Handler): Handler

  handle(...context: any[]): Promise<any | void>
}
