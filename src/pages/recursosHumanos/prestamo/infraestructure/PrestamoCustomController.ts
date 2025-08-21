import { endpoints } from 'config/api'

import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { AxiosError } from 'axios'
import { ApiError } from 'shared/error/domain/ApiError'
import { Prestamo } from '../domain/Prestamo'

export class PrestamoCustomController {
  private axios

  constructor() {
    this.axios = AxiosHttpRepository.getInstance()
  }

  async anularPrestamoEmpresarial(acreditacion: Prestamo): Promise<void> {
    try {
      await this.axios.post(
        this.axios.getEndpoint(endpoints.anular_prestamo_empresarial),
        acreditacion
      )
    } catch (error: unknown) {
      const axiosError = error as AxiosError
      throw new ApiError(axiosError)
    }
  }

  async actualizarPrestamoEmpresarial(id:number) {
    console.log('actualizarPrestamoEmpresarial')
    try {
      const ruta =`${this.axios.getEndpoint(endpoints.actualizar_prestamo_empresarial)}/${id}`
      await this.axios.get(ruta)
      console.log('paso actualizarPrestamoEmpresarial')
    } catch (error: unknown) {
      console.log('error actualizarPrestamoEmpresarial')
      const axiosError = error as AxiosError
      throw new ApiError(axiosError)
    }
  }
}
