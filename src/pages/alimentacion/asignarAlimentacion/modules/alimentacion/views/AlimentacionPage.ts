import { computed, defineComponent, ref } from 'vue'

//Componentes
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'

import { required } from 'shared/i18n-validators'
import { acciones, accionesTabla, maskFecha } from 'config/utils'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue'
import { Alimentacion } from '../domain/Alimentacion'
import { AlimentacionController } from '../infraestructure/AlimentacionController'
import { configuracionColumnasAlimentacion } from '../domain/configuracionColumnasAlimentacion'
import useVuelidate from '@vuelidate/core'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useAuthenticationStore } from 'stores/authentication'

export default defineComponent({
  components: { EssentialSelectableTable, EssentialTable, ButtonSubmits },
  emits: ['cerrar-modal', 'guardado'],
  setup(props, { emit }) {
    /***********
     * Mixin
     ************/
    const mixin = new ContenedorSimpleMixin(
      Alimentacion,
      new AlimentacionController()
    )
    const {
      setValidador,
      guardar,
      editar,
      eliminar,
      reestablecer,
      cargarVista,
      obtenerListados,
    } = mixin.useComportamiento()
    const authenticationStore = useAuthenticationStore()

    const {
      entidad: alimentacion,
      disabled,
      accion,
      listado,
      listadosAuxiliares,
    } = mixin.useReferencias()
    const empleados = ref([])
    cargarVista(async () => {
      await obtenerListados({
        empleados: {
          controller: new EmpleadoController(),
          params: { campos: 'id,nombres,apellidos', estado: 1 },
        },
      })
      empleados.value = listadosAuxiliares.empleados
      const fechaActual = new Date()
      const fechaFormateada =
        fechaActual.getFullYear() +
        '-' +
        (fechaActual.getMonth() + 1) +
        '-' +
        fechaActual.getDate()
      listado.value = (
        await new AlimentacionController().listar({
          fecha_corte: fechaFormateada,
        })
      ).result
    })

    /*************
     * Validaciones
     **************/
    const reglas = {
      empleado: {
        required,
      },
      valor_asignado: {
        required,
      },
      fecha_corte: {
        required,
      },
    }
    const deshabilitar_empleado = ref(true)
    const mostrar_formulario = ref(false)

    const v$ = useVuelidate(reglas, alimentacion)
    setValidador(v$.value)

    const refListado = ref()

    function filtrarEmpleados(val, update) {
      if (val === '') {
        update(() => {
          empleados.value = listadosAuxiliares.empleados
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        empleados.value = listadosAuxiliares.empleados.filter(
          (v) =>
            v.nombres.toLowerCase().indexOf(needle) > -1 ||
            v.apellidos.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    function cerrarModal(confirmar = true) {
      emit('cerrar-modal', confirmar)
    }

    const btnEditarAlimentacion: CustomActionTable = {
      titulo: 'Editar',
      icono: 'bi-pencil',
      color: 'warning',
      visible: () => {
        return true //authenticationStore.can('puede.editar.valor_acreditar')
      },
      accion: ({ entidad }) => {
        deshabilitar_empleado.value = true
        accion.value = acciones.editar
        alimentacion.id = entidad.id
        alimentacion.empleado = entidad.empleado
        alimentacion.valor_asignado = entidad.valor_asignado
        alimentacion.fecha_corte = entidad.fecha_corte
        mostrar_formulario.value = true
      },
    }
    const btnVerAlimentacion: CustomActionTable = {
      titulo: 'Consultar',
      icono: 'bi-eye',
      color: 'primary',
      visible: () => {
        return true //authenticationStore.can('puede.ver.valor_asignar')
      },
      accion: ({ entidad }) => {
        accion.value = acciones.consultar
        alimentacion.id = entidad.id
        alimentacion.empleado = entidad.empleado
        alimentacion.valor_asignado = entidad.valor_asignado
        alimentacion.fecha_corte = entidad.fecha_corte
        mostrar_formulario.value = true
      },
    }
    const btnNuevoAlimentacion: CustomActionTable = {
      titulo: 'Agregar',
      icono: 'bi-plus',
      color: 'positive',
      visible: () => {
        return true //authenticationStore.can('puede.ver.valor_asignar')
      },
      accion: () => {
        accion.value = acciones.nuevo
        mostrar_formulario.value = true
        deshabilitar_empleado.value = false
      },
    }

    async function guardarDatos(valoracreditar: Alimentacion) {
      try {
        let entidad: Alimentacion = new Alimentacion()
        if (accion.value == acciones.nuevo) {
          entidad = await guardar(valoracreditar)
          const valorAlimentacionAux = new Alimentacion()
          valorAlimentacionAux.hydrate(entidad)
        } else {
          await editar(valoracreditar, true)
        }
        mostrar_formulario.value = false
      } catch (e) {
        console.log(e)
      }
    }
    function reestablecerDatos() {
      reestablecer()
      mostrar_formulario.value = false
    }
    const totalAlimentacion = computed(() => {
      const suma = listado.value.reduce(
        (acumulador, elemento) =>
          acumulador + parseFloat(elemento.valor_asignado.replace(/,/g, '')),
        0
      )
      return suma
    })
    const btnEliminarAlimentacion: CustomActionTable = {
      titulo: 'Eliminar',
      icono: 'bi-trash',
      color: 'secondary',
      visible: () =>true,
      accion: ({ entidad, posicion }) => {
        accion.value = 'ELIMINAR'
        eliminar(entidad)
        listado.value.splice(posicion, 1)
      },
    }
    const btnAsignarMasivo: CustomActionTable = {
      titulo: 'Asignacion Masiva',
      icono: 'bi-arrow-clockwise',
      color: 'warning',
      visible: () =>true,
      accion: () => {
            alimentacion.masivo = true
      },
    }

    return {
      listado,
      configuracionColumnasAlimentacion,
      deshabilitar_empleado,
      accionesTabla,
      accion,
      filtrarEmpleados,
      mostrar_formulario,
      alimentacion,
      guardarDatos,
      reestablecerDatos,
      empleados,
      maskFecha,
      totalAlimentacion,
      v$,
      cerrarModal,
      refListado,
      btnNuevoAlimentacion,
      btnVerAlimentacion,
      btnEditarAlimentacion,
      btnEliminarAlimentacion,
      btnAsignarMasivo
    }
  },
})
