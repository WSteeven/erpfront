import { ActionHooks } from './actionHooks'

export class HooksConfigurable extends ActionHooks<HooksConfigurable> {
  onConfigurado: () => void

  constructor() {
    super()
    this.onConfigurado = () => { }
  }
}
