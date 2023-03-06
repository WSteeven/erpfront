import { apiConfig, endpoints } from "config/api";
import { defineStore } from "pinia";
import { AxiosHttpRepository } from "shared/http/infraestructure/AxiosHttpRepository";
import { imprimirArchivo } from "shared/utils";
import { ref } from "vue";

export const useFondoRotativoStore = defineStore('fonso_rotativo', ()=>{
  const usuario_nombre = ref()
  const fecha_inicio = ref()
  const fecha_fin = ref()

  const setUsuario= (usuario: number)=>{
    usuario_nombre.value = usuario
  }
  const setFechaInicio= (fecha: Date)=>{
    fecha_inicio.value = fecha}
  const setFechaFin= (fecha: Date)=>{
    fecha_fin.value = fecha
  }

  const getUsuario = ()=>{
    return usuario_nombre.value
  }
  const getFechaInicio = ()=>{
    return fecha_inicio.value
  }
  const getFechaFin = ()=>{
    return fecha_fin.value
  }
  return {
    usuario_nombre,
    fecha_inicio,
    fecha_fin,
    setUsuario,
    setFechaInicio,
    setFechaFin,
    getUsuario,
    getFechaInicio,
    getFechaFin
  }
})
