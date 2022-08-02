import {EmptyHandler} from "./EmptyHandler"
import {Handler} from "./Handler"

export abstract class BaseHandler implements Handler {
  nextHandler: Handler = new EmptyHandler()

  setNext(next: Handler): Handler {
    this.nextHandler = next
    return this.nextHandler
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async handle(...context: any[]) {}
}
