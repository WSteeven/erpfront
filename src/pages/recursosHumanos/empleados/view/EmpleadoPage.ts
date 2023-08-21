//Dependencias
import { configuracionColumnasEmpleados } from '../domain/configuracionColumnasEmpleados'
import {
  maxLength,
  minLength,
  numeric,
  required,
  requiredIf,
} from 'shared/i18n-validators'
import { useVuelidate } from '@vuelidate/core'
import { maskFecha, opcionesEstados } from 'config/utils'
import { defineComponent, ref, watchEffect, computed } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import SelectorImagen from 'components/SelectorImagen.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { RolController } from 'pages/administracion/roles/infraestructure/RolController'
import { GrupoController } from 'pages/recursosHumanos/grupos/infraestructure/GrupoController'
import { EmpleadoController } from '../infraestructure/EmpleadoController'
import { useNotificacionStore } from 'stores/notificacion'
import { Empleado } from '../domain/Empleado'
import { useQuasar } from 'quasar'
import { CargoController } from 'pages/recursosHumanos/cargos/infraestructure/CargoController'
import { CantonController } from 'sistema/ciudad/infraestructure/CantonControllerontroller'
import { TipoContratoController } from 'pages/recursosHumanos/tipo-contrato/infraestructure/TipoContratoController'
import { DepartamentoController } from 'pages/recursosHumanos/departamentos/infraestructure/DepartamentoController'
import { EstadoCivilController } from 'pages/recursosHumanos/estado-civil/infraestructure/EstadoCivilController'
import { AreasController } from 'pages/recursosHumanos/areas/infraestructure/AreasController'
import { BancoController } from 'pages/recursosHumanos/banco/infrestruture/BancoController'

export default defineComponent({
  components: { TabLayout, SelectorImagen },
  setup() {
    /*********
     * Stores
     *********/
    useNotificacionStore().setQuasar(useQuasar())

    /***********
     * Mixin
     ************/
    const mixin = new ContenedorSimpleMixin(Empleado, new EmpleadoController())
    const {
      entidad: empleado,
      disabled,
      accion,
      listadosAuxiliares,
    } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados } =
      mixin.useComportamiento()
    const { onConsultado } = mixin.useHooks()
    const opciones_cantones = ref([])
    const opciones_roles = ref([])
    const opciones_cargos = ref([])
    const opciones_empleados = ref([])
    const estado_civiles = ref([])
    const bancos = ref([])
    const areas = ref([])
    const tipos_contrato = ref([])
    const niveles_academicos = ref([
      { nombre: 'Estudio Primario' },
      { nombre: 'Estudio Secundario' },
      { nombre: 'Titulo Superior' },
    ])
    const opcionesDepartamentos = ref([])

    cargarVista(async () => {
      obtenerListados({
        cantones: new CantonController(),
        cargos: new CargoController(),
        tipos_contrato: new TipoContratoController(),
        roles: {
          controller: new RolController(),
          params: { campos: 'id,name' },
        },
        empleados: {
          controller: new EmpleadoController(),
          params: {
            campos: 'id,nombres,apellidos',
            estado: 1,
          },
        },
        estado_civiles: new EstadoCivilController(),
        bancos: new BancoController(),
        areas: new AreasController(),
        grupos: {
          controller: new GrupoController(),
          params: { activo: 1 },
        },
        departamentos: {
          controller: new DepartamentoController(),
          params: { activo: 1 },
        },
      })
    })

    /*************
     * Validaciones
     **************/
    const reglas = {
      identificacion: {
        required,
        minlength: minLength(10),
        maxlength: maxLength(10),
      },
      telefono: {
        required,
        numeric,
        minlength: minLength(10),
        maxlength: maxLength(10),
      },
      direccion: { required },
      tipo_sangre: { required },
      estado_civil: { required },
      area: { required },
      tipo_contrato: { required },
      banco: { required },
      num_cuenta: { required },
      salario: { required },
      fecha_ingreso: { required },
      nombres: { required },
      apellidos: { required },
      jefe: { required },
      email: { required },
      correo_personal: { required },
      usuario: { required },
      fecha_nacimiento: { required },
      cargo: { required },
      observacion: { required },
      departamento: { required },
      roles: { required },
      estado: { required },
      grupo: { required: requiredIf(() => empleado.tiene_grupo) },
    }

    const v$ = useVuelidate(reglas, empleado)
    setValidador(v$.value)

    opciones_cantones.value = listadosAuxiliares.cantones
    opciones_roles.value = listadosAuxiliares.roles
    opciones_cargos.value = listadosAuxiliares.cargos
    opciones_empleados.value = listadosAuxiliares.empleados
    tipos_contrato.value = listadosAuxiliares.tipos_contrato
    opcionesDepartamentos.value = listadosAuxiliares.departamentos
    estado_civiles.value = listadosAuxiliares.estado_civiles
    areas.value = listadosAuxiliares.areas
    bancos.value = listadosAuxiliares.bancos
    /********
     * Hooks
     ********/

    onConsultado(() => (empleado.tiene_grupo = !!empleado.grupo))

    const antiguedad = computed(() => {
      const fechaActual = new Date()
      const dateParts = empleado.fecha_ingreso
        ? empleado.fecha_ingreso.split('-')
        : 0 // Dividir el string en partes usando el guión como separador
      const day = parseInt(dateParts[0], 10) // Obtener el día como entero
      const month = parseInt(dateParts[1], 10) - 1 // Obtener el mes como entero (restar 1 porque en JavaScript los meses comienzan desde 0)
      const year = parseInt(dateParts[2], 10) // Obtener el año como entero
      const fechaIngreso = new Date(year, month, day)

      if (!fechaIngreso) {
        return null // O algún valor predeterminado en caso de fechaIngreso sea null
      }

      let diffYears = fechaActual.getFullYear() - fechaIngreso.getFullYear()
      let diffMonths = fechaActual.getMonth() - fechaIngreso.getMonth()
      let diffDays = fechaActual.getDate() - fechaIngreso.getDate()
      if (diffMonths < 0 || (diffMonths === 0 && diffDays < 0)) {
        diffYears--
        diffMonths += 12
      }

      if (diffDays < 0) {
        const lastMonthDate = new Date(
          fechaActual.getFullYear(),
          fechaActual.getMonth(),
          0
        ).getDate()
        diffMonths--
        diffDays += lastMonthDate
      }
      if (
        Number.isNaN(diffYears) ||
        Number.isNaN(diffMonths) ||
        Number.isNaN(diffDays)
      ) {
        return null
      }
      return diffYears + ' Años ' + diffMonths + ' Meses ' + diffDays + ' Dias'
    })

    onConsultado(() => (empleado.tiene_grupo = !!empleado.grupo))

    /************
     * Observers
     ************/
    watchEffect(() => {
      if (!empleado.tiene_grupo) empleado.grupo = null
    })

    return {
      mixin,
      empleado,
      disabled,
      accion,
      v$,
      configuracionColumnas: configuracionColumnasEmpleados,
      isPwd: ref(true),
      listadosAuxiliares,
      antiguedad,
      //listado
      opciones_cantones,
      opciones_roles,
      opciones_cargos,
      opciones_empleados,
      opcionesEstados,
      bancos,
      maskFecha,
      estado_civiles,
      areas,
      tipos_contrato,
      niveles_academicos,
      //metodos
      opcionesDepartamentos,

      //  FILTROS
      //filtro de empleados
      filtroEmpleados(val, update) {
        if (val === '') {
          update(() => {
            opciones_empleados.value = listadosAuxiliares.empleados
          })
          return
        }
        update(() => {
          const needle = val.toLowerCase()
          opciones_empleados.value = listadosAuxiliares.empleados.filter(
            (v) =>
              v.nombres.toLowerCase().indexOf(needle) > -1 ||
              v.apellidos.toLowerCase().indexOf(needle) > -1
          )
        })
      },
      //filtro de cantones
      filtroCantones(val, update) {
        if (val === '') {
          update(() => {
            opciones_cantones.value = listadosAuxiliares.cantones
          })
          return
        }
        update(() => {
          const needle = val.toLowerCase()
          opciones_cantones.value = listadosAuxiliares.cantones.filter(
            (v) => v.canton.toLowerCase().indexOf(needle) > -1
          )
        })
      },
      //filtro de cargos
      filtroCargos(val, update) {
        if (val === '') {
          update(() => {
            opciones_cargos.value = listadosAuxiliares.cargos
          })
          return
        }
        update(() => {
          const needle = val.toLowerCase()
          opciones_cargos.value = listadosAuxiliares.cargos.filter(
            (v) => v.nombre.toLowerCase().indexOf(needle) > -1
          )
        })
      },
      filtroDepartamentos(val, update) {
        if (val === '') {
          update(() => {
            opcionesDepartamentos.value = listadosAuxiliares.departamentos
          })
          return
        }
        update(() => {
          const needle = val.toLowerCase()
          opcionesDepartamentos.value = listadosAuxiliares.departamentos.filter(
            (v) => v.nombre.toLowerCase().indexOf(needle) > -1
          )
        })
      },
      filtrobancos(val, update) {
        if (val === '') {
          update(() => {
            bancos.value = listadosAuxiliares.bancos
          })
          return
        }
        update(() => {
          const needle = val.toLowerCase()
          opcionesDepartamentos.value = listadosAuxiliares.bancos.filter(
            (v) => v.nombre.toLowerCase().indexOf(needle) > -1
          )
        })
      },
    }
  },
})
