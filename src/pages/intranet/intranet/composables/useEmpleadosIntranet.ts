import { ref } from 'vue'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { DepartamentoController } from 'pages/recursosHumanos/departamentos/infraestructure/DepartamentoController'

export function useEmpleadosIntranet() {
  const empleados = ref<any[]>([])
  const empleadosCumpleaneros = ref<any[]>([])
  const empleadosConExtension = ref<any[]>([])
  const departamentos = ref<any[]>([])

  async function consultarEmpleadosDepartamento(departamento_id: number) {
    try {
      const controller = new EmpleadoController()
      empleados.value = (await controller.listar({
        departamento_id: Number(departamento_id),
        estado: 1
      })).result
    } catch (e) {
      console.error(e)
    }
  }

  async function consultarDepartamentos() {
    const controller = new DepartamentoController()
    const r = await controller.listar({ activo: 1 })
    departamentos.value = r.result.filter((d: any) => d.id !== 9)
  }

  async function obtenerEmpleadosCumpleaneros() {
    const currentMonth = new Date().getUTCMonth()
    const controller = new EmpleadoController()
    const lista = (await controller.listar({ estado: 1 })).result
    empleadosCumpleaneros.value = lista
      .filter((e: any) => e.fecha_nacimiento && new Date(e.fecha_nacimiento).getUTCMonth() === currentMonth)
      .sort((a: any, b: any) =>
        new Date(a.fecha_nacimiento).getUTCDate() - new Date(b.fecha_nacimiento).getUTCDate()
      )
  }

  async function obtenerEmpleadosConExtension() {
    const controller = new EmpleadoController()
    const lista = (await controller.listar({ estado: 1 })).result
    empleadosConExtension.value = lista.filter((e: any) => e.extension !== null && e.extension !== undefined)
  }

  const calcularAntiguedad = (fechaVinculacion: string): string => {
    const hoy = new Date()
    const vinculacion = new Date(fechaVinculacion)
    const diffAnios = hoy.getFullYear() - vinculacion.getFullYear()
    const diffMeses = hoy.getMonth() - vinculacion.getMonth()
    const anios = diffMeses < 0 ? diffAnios - 1 : diffAnios
    const meses = (diffMeses + 12) % 12
    const partes: string[] = []
    if (anios > 0) partes.push(`${anios} ${anios === 1 ? 'año' : 'años'}`)
    if (meses > 0) partes.push(`${meses} ${meses === 1 ? 'mes' : 'meses'}`)
    return partes.length > 0 ? partes.join(' y ') : 'menos de un mes'
  }

  const calcularEdadEsteAno = (fechaNacimiento: string): number =>
    new Date().getFullYear() - new Date(fechaNacimiento).getFullYear()

  // inicializaciones
  consultarDepartamentos()
  obtenerEmpleadosCumpleaneros()
  obtenerEmpleadosConExtension()

  return {
    empleados,
    empleadosCumpleaneros,
    empleadosConExtension,
    departamentos,
    consultarEmpleadosDepartamento,
    obtenerEmpleadosCumpleaneros,
    obtenerEmpleadosConExtension,
    calcularAntiguedad,
    calcularEdadEsteAno
  }
}
