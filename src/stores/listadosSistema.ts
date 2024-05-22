// Dependencias
import { LocalStorage } from 'quasar'
import { defineStore } from 'pinia'

// Logica y controladores
import { EstadosTransaccionController } from 'pages/administracion/estados_transacciones/infraestructure/EstadosTransaccionController'
import { SubDetalleFondoController } from 'pages/fondosRotativos/subDetalleFondo/infrestructure/SubDetalleFondoController'
import { AutorizacionController } from 'pages/administracion/autorizaciones/infraestructure/AutorizacionController'
import { DetalleFondoController } from 'pages/fondosRotativos/detalleFondo/infrestructure/DetalleFondoController'
import { CondicionController } from 'pages/administracion/condiciones/infraestructure/CondicionController'
import { SucursalController } from 'pages/administracion/sucursales/infraestructure/SucursalController'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { TareaController } from 'pages/gestionTrabajos/tareas/infraestructure/TareaController'
import { CantonController } from 'sistema/ciudad/infraestructure/CantonControllerontroller'
import { ListadosSistema } from './ListadosSistemaInterface'

export const useListadosSistemaStore = defineStore('listadosSistema', () => {
  async function cargarDatosLS() {
    const autorizaciones = (await new AutorizacionController().listar({ campos: 'id,nombre' })).result
    LocalStorage.set('autorizaciones', JSON.stringify(autorizaciones))

    const sucursales = (await new SucursalController().listar({ campos: 'id,lugar,cliente_id' })).result
    LocalStorage.set('sucursales', JSON.stringify(sucursales))

    const condiciones = (await new CondicionController().listar({ campos: 'id,nombre' })).result
    LocalStorage.set('condiciones', JSON.stringify(condiciones))

    const estados_transacciones = (await new EstadosTransaccionController().listar({ campos: 'id,nombre' })).result
    LocalStorage.set('estados_transacciones', JSON.stringify(estados_transacciones))

    const cantones = (await new CantonController().listar({ campos: 'id,canton' })).result
    LocalStorage.set('cantones', JSON.stringify(cantones))

    const detalles = (await new DetalleFondoController().listar({ campos: 'id,descripcion' })).result
    LocalStorage.set('detalles', JSON.stringify(detalles))

    const sub_detalles = (await new SubDetalleFondoController().listar({ campos: 'id,descripcion' })).result
    LocalStorage.set('sub_detalles', JSON.stringify(sub_detalles))

    const tareas = (await new TareaController().listar({ campos: 'id,titulo' })).result
    LocalStorage.set('tareas', JSON.stringify(tareas))

    const usuariosInactivos = (await new EmpleadoController().listar({ campos: 'id,nombres,apellidos', estado: 0 })).result
    LocalStorage.set('usuariosInactivos', JSON.stringify(usuariosInactivos))
  }

  function limpiarLS() {
    LocalStorage.remove('autorizaciones')
    LocalStorage.remove('sucursales')
    LocalStorage.remove('condiciones')
    LocalStorage.remove('estados_transacciones')
    LocalStorage.remove('lugares')
    LocalStorage.remove('detalles')
  }

  /****************
   * Modulo Medico
   ****************/
  const listados: ListadosSistema = {
    tiposEvaluacionesMedicasRetiros: [],
    tiposAptitudesMedicasLaborales: [],
  }

  // const obtenerListadoPorNombre = (nombre: keyof ListadosSistema) => false // listados[nombre] // listados[nombre].length ? listados[nombre] : false

  const obtenerListadoPorNombre = (nombre: keyof ListadosSistema) => {
    return new Promise((resolve, reject) => {
      // Suponiendo que listadosSistemaStore es un objeto que contiene el listado
      // Si listadosSistemaStore es un módulo de Vuex, debes acceder a él correctamente según tu configuración
      const tiposEvaluacionesMedicasRetiros = listados[nombre];

      if (tiposEvaluacionesMedicasRetiros) {
        resolve(tiposEvaluacionesMedicasRetiros);
      } else {
        reject(new Error('No se pudo obtener la lista de tipos de evaluaciones médicas para retiros.'));
      }
    });
  };

  return {
    cargarDatosLS,
    limpiarLS,
    // Modulo medico
    listados,
    obtenerListadoPorNombre,
  }
})
