export class Endpoint {
  accessor: string
  includeApiPath: boolean

  constructor(accessor: string, includeApiPath = true) {
    this.accessor = accessor
    this.includeApiPath = includeApiPath
  }
}
