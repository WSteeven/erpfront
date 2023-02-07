/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { HttpRepository } from '../domain/HttpRepository'
import { Endpoint } from '../domain/Endpoint'
import { LocalStorage } from 'quasar'

// SINGLETON
export class AxiosHttpRepository implements HttpRepository {
  private static instance: AxiosHttpRepository
  private static axiosInst: AxiosInstance

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() { }

  private static initialize(): void {
    this.axiosInst = axios.create({
      baseURL: 'http://localhost:8000', //process.env.VUE_APP_API_URL,
      // baseURL: 'https://api-sistemas.jpconstrucred.com', //process.env.VUE_APP_API_URL,
      withCredentials: true,
    })
  }

  static config

  public static getInstance(): AxiosHttpRepository {
    if (!this.instance) {
      this.initialize()
      this.instance = new AxiosHttpRepository()
    }
    AxiosHttpRepository.config = AxiosHttpRepository.getHeaderToken()
    return this.instance
  }

  post<HttpResponse>(url: string, data?: any): Promise<HttpResponse> {
    return AxiosHttpRepository.axiosInst.post(url, data, AxiosHttpRepository.config)
  }

  get<HttpResponse>(
    url: string,
    options?: AxiosRequestConfig
  ): Promise<HttpResponse> {
    return AxiosHttpRepository.axiosInst.get(url, AxiosHttpRepository.getHeaderToken())
  }

  put<HttpResponse>(url: string, data: any): Promise<HttpResponse> {
    return AxiosHttpRepository.axiosInst.put(url, data, AxiosHttpRepository.config)
  }

  delete<HttpResponse>(url: string): Promise<HttpResponse> {
    return AxiosHttpRepository.axiosInst.delete(url, AxiosHttpRepository.config)
  }

  patch<HttpResponse>(url: string, data: any): Promise<HttpResponse> {
    return AxiosHttpRepository.axiosInst.patch(url, data, AxiosHttpRepository.config)
  }

  public getEndpoint(
    endpoint: Endpoint | { endpoint: Endpoint; id: number | null },
    args?: Record<string, any>
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
      //accessor = `${endpoint.endpoint.accessor}${endpoint.id ?? ''}/`
      accessor = `${endpoint.endpoint.accessor}/${endpoint.id ?? ''}`
      includeApiPath = endpoint.endpoint.includeApiPath
    }

    if (includeApiPath || includeApiPath === undefined) {
      accessor = `api/${accessor}`
    }

    if (args) accessor += this.mapearArgumentos(args)
    return accessor
  }

  private mapearArgumentos(args: Record<string, any>): string {
    const query: any = []

    // comprueba si el valor es valido
    for (const key in args)
      if (args[key] !== null && args[key] !== undefined) {
        query.push(`${key}=${args[key]}`)
      }
    return `?${query.join('&')}`
  }

  static getHeaderToken() {
    const token = LocalStorage.getItem('token')

    return {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  }
}
