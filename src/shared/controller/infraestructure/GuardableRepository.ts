/* import { AxiosHttpRepository } from '../../http/infraestructure/AxiosHttpRepository'
import { HttpResponsePost } from '../../http/domain/HttpResponse'
import { Endpoint } from 'shared/http/domain/Endpoint'
import { ApiError } from '../../error/domain/ApiError'
import { ResponseItem } from '../domain/ResponseItem'
import { AxiosError, AxiosResponse } from 'axios'
import { ParamsType } from 'config/types'

export class GuardableRepository<T> {
  private readonly httpRepository = AxiosHttpRepository.getInstance()
  private readonly endpoint: Endpoint

  constructor(endpoint: Endpoint) {
    this.endpoint = endpoint
  }

  async guardar(entidad: T, params?: ParamsType): Promise<ResponseItem<T, HttpResponsePost<T>>> {
    try {
      const ruta = this.httpRepository.getEndpoint(this.endpoint, params)
      const formData = this.convertirJsonAFormData(entidad)
      console.log("gdfgdfgdfgdf")
      for (const [clave, valor] of formData.entries()) {
        console.log(`${clave}: ${valor}`);
      }
      const response: AxiosResponse = await this.httpRepository.post(ruta, formData)

      return {
        response,
        result: response.data.modelo,
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError
      throw new ApiError(axiosError)
    }
  }

  convertirJsonAFormData(entidad): FormData {
    const formData = new FormData();

    const convertirCampo = (campo, prefijo: string) => {
      if (Array.isArray(campo)) {
        campo.forEach((valor, indice) => {
          const nuevoPrefijo = `${prefijo}[${indice}]`;
          convertirCampo(valor, nuevoPrefijo);
        });
      } else {
        formData.append(prefijo, campo);
      }
    };

    for (const key in entidad) {
      if (entidad.hasOwnProperty(key)) {
        const campo = entidad[key];
        convertirCampo(campo, key);
      }
    }

    return formData;
  } */
/* convertirJsonAFormData(entidad: any): FormData {
  const formData = new FormData();

  for (const key in entidad) {
    if (entidad.hasOwnProperty(key)) {
      formData.append(key, entidad[key]);
    }
  }

  return formData;
} */
// }


import { AxiosHttpRepository } from '../../http/infraestructure/AxiosHttpRepository'
import { HttpResponsePost } from '../../http/domain/HttpResponse'
import { Endpoint } from 'shared/http/domain/Endpoint'
import { ApiError } from '../../error/domain/ApiError'
import { ResponseItem } from '../domain/ResponseItem'
import { AxiosError, AxiosResponse } from 'axios'
import { ParamsType } from 'config/types'

export class GuardableRepository<T> {
  private readonly httpRepository = AxiosHttpRepository.getInstance()
  private readonly endpoint: Endpoint

  constructor(endpoint: Endpoint) {
    this.endpoint = endpoint
  }

  async guardar(entidad: T, params?: ParamsType): Promise<ResponseItem<T, HttpResponsePost<T>>> {
    try {
      const ruta = this.httpRepository.getEndpoint(this.endpoint, params)
      // console.log(ruta)
      // console.log(params)
      const response: AxiosResponse = await this.httpRepository.post(ruta, entidad)

      return {
        response,
        result: response.data.modelo,
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError
      throw new ApiError(axiosError)
    }
  }
}
