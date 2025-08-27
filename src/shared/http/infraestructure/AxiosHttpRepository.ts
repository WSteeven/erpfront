/* eslint-disable @typescript-eslint/no-explicit-any */
import {AxiosInstance, AxiosRequestConfig} from 'axios'
import {HttpRepository} from '../domain/HttpRepository'
import {Endpoint} from '../domain/Endpoint'
import {LocalStorage} from 'quasar'
import {api} from 'boot/axios';

// SINGLETON
export class AxiosHttpRepository implements HttpRepository {
  private static instance: AxiosHttpRepository
  private static axiosInst: AxiosInstance
  // private static responseType: Ref<ResponseType>

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() { }

  private static initialize(): void {
    this.axiosInst = api
  }

  // static config

  public static getInstance(): AxiosHttpRepository {
    if (!this.instance) {
      this.initialize()
      this.instance = new AxiosHttpRepository()
    }
    // AxiosHttpRepository.config = AxiosHttpRepository.getHeaderToken()
    return this.instance
  }

  post<HttpResponse>(url: string, data?: any, options?: AxiosRequestConfig): Promise<HttpResponse> {
    const baseOptions = this.getOptions()
    const finalOptions = {
      ...baseOptions,
      ...options,
      headers: {
        ...baseOptions.headers,
        ...options?.headers
      }
    }
    return AxiosHttpRepository.axiosInst.post(url, data, finalOptions)
  }

  get<HttpResponse>(
    url: string,
    options?: AxiosRequestConfig
  ): Promise<HttpResponse> {
    return AxiosHttpRepository.axiosInst.get(url, { ...this.getOptions(), ...options })
  }

  put<HttpResponse>(url: string, data: any, options?: AxiosRequestConfig): Promise<HttpResponse> {
    return AxiosHttpRepository.axiosInst.put(url, data,  { ...this.getOptions(), ...options })
  }

  delete<HttpResponse>(url: string, options?: AxiosRequestConfig): Promise<HttpResponse> {
    return AxiosHttpRepository.axiosInst.delete(url, { ...this.getOptions(), ...options })
  }

  patch<HttpResponse>(url: string, data: any, options?: AxiosRequestConfig): Promise<HttpResponse> {
    return AxiosHttpRepository.axiosInst.patch(url, data, { ...this.getOptions(), ...options })
  }

  public getEndpoint(
    endpoint: Endpoint | { endpoint: Endpoint; id: number | null },
    args?: Record<string, any>,
  ): string {
    let accessor: string
    let includeApiPath: boolean
    // si recibe un endpoint
    if (endpoint instanceof Endpoint) {
      accessor = endpoint.accessor
      includeApiPath = endpoint.includeApiPath
    }
    // si recibe un endpoint y una id
    else {
      accessor = `${endpoint.endpoint.accessor}/${endpoint.id ?? ''}`
      includeApiPath = endpoint.endpoint.includeApiPath
    }

    if (includeApiPath || includeApiPath === undefined) {
      accessor = `api/${accessor}`
    }

    if (args) accessor += this.mapearArgumentos(args)
    return accessor
  }


  public mapearArgumentos(args: Record<string, any>, filtrar = false): string {
    const query: any = []

    // comprueba si el valor es valido
    for (const key in args)
      if (args[key] !== null && args[key] !== undefined) {
        if (!filtrar) {
          const operador = ['filter'].includes(key) ? '' : '='
          //const clave = key // ['filter'].includes(key) ? '' : key
          query.push(`${key}${operador}${args[key]}`)
        } else {
          query.push(`${key}[like]=%${args[key]}%`)
        }
      }

    let cadena = `?${query.join('&')}`
    cadena = cadena.includes('&filter') ? cadena.replace('&filter', '|') : cadena
    cadena = cadena.includes('filter') ? cadena.replace('filter', '') : cadena
    return cadena
  }

  getOptions() {
    const options: AxiosRequestConfig = { headers: {} }
    const token = LocalStorage.getItem('token')

    if (token) {
      options.headers = { Authorization: `Bearer ${token}`, }
    }
    return options
  }
}
