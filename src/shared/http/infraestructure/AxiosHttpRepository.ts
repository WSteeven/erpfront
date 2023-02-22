/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { HttpRepository } from '../domain/HttpRepository'
import { Endpoint } from '../domain/Endpoint'
import { LocalStorage } from 'quasar'
import { apiConfig } from 'config/api'

// SINGLETON
export class AxiosHttpRepository implements HttpRepository {
  private static instance: AxiosHttpRepository
  private static axiosInst: AxiosInstance

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() { }

  private static initialize(): void {
    this.axiosInst = axios.create({
      // baseURL: 'https://api-sistemas.jpconstrucred.com/', //process.env.VUE_APP_API_URL,
      // baseURL: 'http://localhost:8000', //process.env.VUE_APP_API_URL,
      baseURL: process.env.API_URL, //process.env.VUE_APP_API_URL,
      // baseURL: 'http://backend_jpconstrucred.test:80',
      withCredentials: true,
    })
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
    return AxiosHttpRepository.axiosInst.post(url, data, { ...this.getOptions(), ...options })
  }

  get<HttpResponse>(
    url: string,
    options?: AxiosRequestConfig
  ): Promise<HttpResponse> {
    return AxiosHttpRepository.axiosInst.get(url, { ...this.getOptions(), ...options })
  }

  put<HttpResponse>(url: string, data: any, options?: AxiosRequestConfig): Promise<HttpResponse> {
    return AxiosHttpRepository.axiosInst.put(url, data, { ...this.getOptions(), ...options })
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
    filtrar?: boolean
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

    if (args) accessor += this.mapearArgumentos(args, filtrar)
    return accessor
  }

  private mapearArgumentos(args: Record<string, any>, filtrar = false): string {
    const query: any = []

    // comprueba si el valor es valido
    for (const key in args)
      if (args[key] !== null && args[key] !== undefined) {
        //if (['campos', 'rol'].includes(key)) {
        if (!filtrar) {
          query.push(`${key}=${args[key]}`)
        } else {
          query.push(`${key}[like]=%${args[key]}%`)
        }
      }
    return `?${query.join('&')}`
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
