import {Handler} from "./Handler"

export class EmptyHandler implements Handler {
  setNext(): Handler {
    return this
  }

  async handle() {}
}
