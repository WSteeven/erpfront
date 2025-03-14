//Dependencias
import { configuracionColumnasProveedores } from './../domain/configuracionColumnasProveedores'
import { configuracionColumnasContactosProveedores } from 'pages/comprasProveedores/contactosProveedor/domain/configuracionColumnasContactosProveedores'
import { required, requiredIf } from 'shared/i18n-validators'
import { useVuelidate } from '@vuelidate/core'

//Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import LabelAbrirModal from 'components/modales/modules/LabelAbrirModal.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import GestorArchivos from 'components/gestorArchivos/GestorArchivos.vue'
import NoOptionComponent from 'components/NoOptionComponent.vue'
import ErrorComponent from 'components/ErrorComponent.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { computed, defineComponent, reactive, ref } from 'vue'
import { ProveedorController } from '../infraestructure/ProveedorController'
import { Proveedor } from '../domain/Proveedor'
import { acciones } from 'config/utils'
import { ComportamientoModalesProveedores } from '../application/ComportamientoModalesProveedores'
import { EmpresaController } from 'pages/administracion/empresas/infraestructure/EmpresaController'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { Empresa } from 'pages/administracion/empresas/domain/Empresa'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import {
  estadosCalificacionProveedor,
  formasPagos,
  opcionesTipoContribuyente,
  opcionesTipoNegocio,
  tiposEnvios
} from 'config/utils_compras_proveedores'
import { ParroquiaController } from 'sistema/parroquia/infraestructure/ParroquiaController'
import { OfertaProveedorController } from '../modules/ofertas_proveedores/infraestructure/OfertaProveedorController'
import { DepartamentoController } from '../modules/departamentos/infraestructure/DepartamentoController'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useNotificaciones } from 'shared/notificaciones'
import { ContactoProveedorController } from 'pages/comprasProveedores/contactosProveedor/infraestructure/ContactoProveedorController'
import { useProveedorStore } from 'stores/comprasProveedores/proveedor'
import { useAuthenticationStore } from 'stores/authentication'
import { useCalificacionProveedorStore } from 'stores/comprasProveedores/calificacionProveedor'
import { DetalleDepartamentoProveedorController } from 'pages/comprasProveedores/detallesDepartamentosProveedor/infraestructure/DetalleDepartamentoProveedorController'
import { LocalStorage, useQuasar } from 'quasar'
import { CategoriaOfertaController } from 'pages/comprasProveedores/categoriaOfertas/infraestructure/CategoriaOfertaController'
import { CategoriaOferta } from 'pages/comprasProveedores/categoriaOfertas/domain/CategoriaOferta'
import { ordernarListaString } from 'shared/utils'
import { Departamento } from 'pages/recursosHumanos/departamentos/domain/Departamento'
import { useNotificacionStore } from 'stores/notificacion'
import { useCargandoStore } from 'stores/cargando'
import { configuracionColumnasDatosBancariosProveedor } from 'pages/comprasProveedores/datosBancariosProveedor/domain/configuracionColumnasDatosBancariosProveedor'
import { ArchivoController } from 'pages/gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/infraestructure/ArchivoController'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { ValidarPropiedadesProveedor } from '../application/validaciones/ValidarPropiedadesProveedor'
import { DatoBancarioController } from 'pages/comprasProveedores/datosBancariosProveedor/infraestructure/DatoBancarioController'

export default defineComponent({
  components: {
    ErrorComponent,
    NoOptionComponent,
    TabLayout,
    LabelAbrirModal,
    ModalesEntidad,
    EssentialTable,
    GestorArchivos
  },
  setup() {
    const mixinEmpresas = new ContenedorSimpleMixin(
      Empresa,
      new EmpresaController(),
      new ArchivoController()
    )
    const mixin = new ContenedorSimpleMixin(
      Proveedor,
      new ProveedorController()
    )
    const {
      entidad: proveedor,
      disabled,
      accion,
      listadosAuxiliares,
      listado
    } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados, listar } =
      mixin.useComportamiento()
    const { onConsultado, onReestablecer, onGuardado, onBeforeModificar } =
      mixin.useHooks()
    const { confirmar, prompt, notificarCorrecto, notificarError } =
      useNotificaciones()
    const refContactos = ref()
    const mostrarLabelModal = computed(
      () => accion.value === acciones.nuevo || accion.value === acciones.editar
    )
    /**************************************************************
     * Stores
     **************************************************************/
    useNotificacionStore().setQuasar(useQuasar())
    useCargandoStore().setQuasar(useQuasar())
    const modales = new ComportamientoModalesProveedores()
    const StatusLoading = new StatusEssentialLoading()
    const proveedorStore = useProveedorStore()
    const calificacionStore = useCalificacionProveedorStore()
    const store = useAuthenticationStore()

    //variables
    const refArchivo = ref()
    const esReferido = ref(false)
    const detalleDepartamentoProveedor = ref()
    const empresa: Empresa = reactive(new Empresa())
    const categorias = ref([])
    const departamentos = ref([])
    const ofertas = ref([])
    const departamentoFinanciero = computed(() =>
      listadosAuxiliares.departamentos.length > 0
        ? listadosAuxiliares.departamentos.filter(
            (v: Departamento) => v.nombre == 'FINANCIERO'
          )[0]
        : new Departamento()
    )
    cargarVista(async () => {
      await obtenerListados({
        empresas: {
          controller: new EmpresaController(),
          params: { es_proveedor: 1 }
        },
        parroquias: new ParroquiaController(),
        categorias: new CategoriaOfertaController(),
        departamentos: new DepartamentoController(),
        ofertas: new OfertaProveedorController()
      }).then(() => {
        proveedor.departamentos = [
          ...proveedor.departamentos,
          departamentoFinanciero.value.id
        ]
      })
      listadosAuxiliares.cantones = JSON.parse(
        LocalStorage.getItem('cantones')!.toString()
      )
      cantones.value = JSON.parse(LocalStorage.getItem('cantones')!.toString())
      await listar({ filtrarProveedores: true }) // aqui se lista solo los proveedores que me corresponde calificar
    })

    /**************************************************************
     * Hooks
     **************************************************************/
    onConsultado(() => {
      // proveedor.tipo_envio = proveedor.tipo_envio != null ? JSON.parse(proveedor.tipo_envio.toString()) : []
      obtenerEmpresa(proveedor.empresa).then(() =>
        refArchivo.value.listarArchivosAlmacenados(empresa.id)
      )
      categorias.value = listadosAuxiliares.categorias.filter(v =>
        proveedor.tipos_ofrece.includes(v.tipo_oferta_id)
      )
    })
    onReestablecer(() => {
      empresa.hydrate(new Empresa())
      cantones.value = JSON.parse(LocalStorage.getItem('cantones')!.toString())
      proveedor.departamentos = [
        ...proveedor.departamentos,
        departamentoFinanciero.value.id
      ]
      refArchivo.value.limpiarListado()
      categorias.value = listadosAuxiliares.categorias
    })

    onGuardado(() => {
      subirArchivos()
    })

    onBeforeModificar(() => {
      subirArchivos()
    })

    /**************************************************************
     * Validaciones
     **************************************************************/
    const reglas = {
      parroquia: { required },
      empresa: { required },
      sucursal: { required },
      direccion: { required },
      tipos_ofrece: { required },
      categorias_ofrece: { required },
      departamentos: { required },

      tipo_envio: { requiredIfRealizaEnvios: requiredIf(proveedor.envios) }
    }
    const v$ = useVuelidate(reglas, proveedor)
    setValidador(v$.value)

    const validarPropiedadesProveedor = new ValidarPropiedadesProveedor(
      proveedor
    )
    mixin.agregarValidaciones(validarPropiedadesProveedor)

    /***************************
     * Configuracion de columnas
     ****************************/
    const columnasContactosProveedor: any = [
      ...configuracionColumnasContactosProveedores
      // accionesTabla,
    ]
    columnasContactosProveedor.splice(2, 1)

    const columnasDatosBancarios: any = [
      ...configuracionColumnasDatosBancariosProveedor
    ]
    columnasDatosBancarios.splice(0, 1) //se elimina el campo empresa por ser irrelevante en este caso

    /**************************************************************
     * Botones de tablas
     **************************************************************/
    const botonDesactivarProveedor: CustomActionTable = {
      titulo: 'Desactivar',
      icono: 'bi-toggle2-off',
      color: 'negative',
      tooltip: 'Desactivar proveedor',
      accion: ({ entidad, posicion }) => {
        confirmar('¿Está seguro de desactivar el proveedor?', () => {
          const data: CustomActionPrompt = {
            titulo: 'Causa de deactivación',
            mensaje:
              'Ingresa el motivo por el que quieres desactivar este proveedor?',
            accion: async data => {
              try {
                proveedorStore.idProveedor = entidad.id
                const response = await proveedorStore.anularProveedor({
                  motivo: data
                })
                if (response?.status == 200) {
                  notificarCorrecto(
                    'Se ha desactivado correctamente el proveedor'
                  )
                  listado.value.splice(posicion, 1, response.data.modelo)
                }
              } catch (error: any) {
                notificarError('No se pudo desactivar el proveedor!')
              }
            }
          }
          prompt(data)
        })
      },
      visible: ({ entidad }) =>
        entidad.estado &&
        (store.esCompras || store.can('puede.desactivar.proveedores'))
    }
    const botonActivarProveedor: CustomActionTable = {
      titulo: 'Activar',
      icono: 'bi-toggle2-off',
      color: 'positive',
      tooltip: 'Activar proveedor',
      accion: ({ entidad, posicion }) => {
        confirmar('¿Está seguro de activar el proveedor?', () => {
          const data: CustomActionPrompt = {
            titulo: 'Causa de deactivación',
            mensaje:
              'Ingresa el motivo por el que quieres desactivar este proveedor?',
            accion: async data => {
              try {
                proveedorStore.idProveedor = entidad.id
                const response = await proveedorStore.anularProveedor({
                  motivo: data
                })
                if (response?.status == 200) {
                  notificarCorrecto('Se ha activado correctamente el proveedor')
                  listado.value.splice(posicion, 1, response.data.modelo)
                }
              } catch (error: any) {
                notificarError('No se pudo activar el proveedor!')
              }
            }
          }
          prompt(data)
        })
      },
      visible: ({ entidad }) =>
        !entidad.estado &&
        (store.esCompras || store.can('puede.activar.proveedores'))
    }
    const abrirModalContacto: CustomActionTable = {
      titulo: 'Agregar Contacto',
      icono: 'bi-person-fill-add',
      color: 'positive',
      tooltip:
        'Puede modificar o eliminar un contacto desde el panel contactos de proveedores',
      accion: () => {
        modales.abrirModalEntidad('ContactoProveedorPage')
      },
      visible: () => {
        return accion.value == acciones.nuevo || accion.value == acciones.editar
      }
    }
    const abrirModalDatoBancario: CustomActionTable = {
      titulo: 'Agregar N° Cuenta',
      icono: 'bi-bank',
      color: 'positive',
      tooltip: 'Agregar N° Cuenta asociado al proveedor',
      accion: () => {
        modales.abrirModalEntidad('DatoBancarioPage')
      }
    }

    const botonActualizarCalificacion: CustomActionTable = {
      titulo: 'Actualizar calificación',
      icono: 'bi-arrow-clockwise',
      color: 'positive',
      accion: async ({ entidad, posicion }) => {
        proveedorStore.idProveedor = entidad.id
        const response = await proveedorStore.actualizarCalificacion()
        if (response?.status == 200) {
          notificarCorrecto(
            'Se ha actualizado correctamente la calificación del proveedor'
          )
          listado.value.splice(posicion, 1, response.data.modelo)
        }
      },
      visible: () => false //store.esAdministrador
    }
    const botonCalificarProveedor: CustomActionTable = {
      titulo: 'Calificar',
      icono: 'bi-stars',
      color: 'positive',
      accion: async ({ entidad }) => {
        proveedorStore.idDepartamento = store.user.departamento
        proveedorStore.idProveedor = entidad.id
        proveedorStore.proveedor = entidad
        consultarDetalleDepartamentoProveedor().then(() => {
          proveedorStore.idDetalleDepartamento =
            detalleDepartamentoProveedor.value.id
        })
        modales.abrirModalEntidad('CalificacionProveedorPage', { mixin })
      },
      visible: ({ entidad }) => {
        const departamento_calificador = entidad.related_departamentos.filter(
          v => v.id === store.user.departamento
        )[0]
        if (departamento_calificador) {
          if (
            departamento_calificador.pivot.fecha_calificacion == null ||
            departamento_calificador.pivot.calificacion == null
          ) {
            // se retorna true ya que aún no está calificado
            return entidad.estado
          }
        }
        // return false
        return true
      }
    }

    const botonRecalificarProveedor: CustomActionTable<Proveedor> = {
      titulo: 'Recalificar',
      icono: 'bi-stars',
      color: 'positive',
      accion: async ({ entidad }) => {
        proveedorStore.idDepartamento = store.user.departamento
        proveedorStore.idProveedor = entidad.id
        proveedorStore.proveedor = entidad
        consultarDetalleDepartamentoProveedor(true).then(() => {
          proveedorStore.idDetalleDepartamento =
            detalleDepartamentoProveedor.value.id
        })
        modales.abrirModalEntidad('RecalificacionProveedorPage', { mixin })
      },
      visible: ({ entidad }) => {
        const calificaciones_departamento =
          entidad.related_departamentos.filter(
            v => v.id === store.user.departamento
          )

        if (calificaciones_departamento.length > 0) {
          const mas_reciente = calificaciones_departamento.reduce(
            (latest, current) => {
              //Comparamos las fechas de created_at para obtener el más reciente
              return new Date(current.pivot.created_at) >
                new Date(latest.pivot.created_at)
                ? current
                : latest
            }
          )
          return (
            entidad.require_recalificacion &&
            entidad.estado &&
            (mas_reciente.pivot.fecha_calificacion == null ||
              mas_reciente.pivot.calificacion == null)
          )
        }
        return false
      }
    }
    const botonVerMiCalificacionProveedor: CustomActionTable = {
      titulo: 'Mi calificación',
      icono: 'bi-search',
      color: 'positive',
      accion: async ({ entidad }) => {
        proveedorStore.idDepartamento = store.user.departamento
        proveedorStore.idProveedor = entidad.id
        proveedorStore.proveedor = entidad
        calificacionStore.idDepartamento = proveedorStore.idDepartamento
        calificacionStore.verMiCalificacion = true
        await consultarDetalleDepartamentoProveedor().then(() => {
          proveedorStore.idDetalleDepartamento =
            detalleDepartamentoProveedor.value.id
          calificacionStore.idDetalleDepartamentoProveedor =
            detalleDepartamentoProveedor.value.id
          // calificacionStore.detalleDepartamentoProveedor = detalleDepartamentoProveedor.value
        })
        modales.abrirModalEntidad('MiCalificacionProveedorPage', { mixin })
      },
      visible: ({ entidad }) => {
        const departamento_calificador = entidad.related_departamentos.filter(
          v => v.id === store.user.departamento
        )[0]
        if (departamento_calificador) {
          return departamento_calificador.pivot.calificacion !== null //aqui se muestra aunque de 0, corregir esta parte
        }
        return false
      }
    }
    const botonVerTodasCalificacionesProveedor: CustomActionTable = {
      titulo: 'Todas calificaciones',
      icono: 'bi-eye',
      color: 'info',
      accion: async ({ entidad }) => {
        // proveedorStore.idDepartamento = store.user.departamento
        proveedorStore.idDepartamento = null
        proveedorStore.idProveedor = entidad.id
        proveedorStore.proveedor = entidad
        await consultarDetalleDepartamentoProveedor().then(() => {
          proveedorStore.idDetalleDepartamento =
            detalleDepartamentoProveedor.value.id
        })
        modales.abrirModalEntidad('InfoCalificacionProveedorPage', { mixin })
      },
      visible: ({ entidad }) => {
        return (
          entidad.estado_calificado ===
            estadosCalificacionProveedor.calificado ||
          entidad.estado_calificado == estadosCalificacionProveedor.parcial
        ) // || (store.esCompras && (entidad.estado_calificado !== estadosCalificacionProveedor.vacio || entidad.estado_calificado !== estadosCalificacionProveedor.parcial || entidad.estado_calificado !== estadosCalificacionProveedor.pendiente))
      }
    }

    const botonDescargarProveedores: CustomActionTable = {
      titulo: 'Descargar Excel',
      icono: 'bi-file-earmark-excel-fill',
      color: 'positive',
      tooltip:
        'Descarga todos los datos de proveedores en formato de Contifico',
      accion: async () => {
        await proveedorStore.obtenerProveedores()
      }
    }

    /**************************************************************
     * Funciones
     **************************************************************/

    async function subirArchivos() {
      await refArchivo.value.subir()
    }

    async function obtenerEmpresa(empresaId: number | null) {
      if (empresaId !== null) {
        StatusLoading.activar()
        const { result } = await new EmpresaController().consultar(empresaId)
        empresa.hydrate(result)
        proveedor.correo = proveedor.correo ? proveedor.correo : empresa.correo
        proveedor.contactos = empresa.contactos
        proveedor.canton = proveedor.canton ? proveedor.canton : empresa.canton
        proveedor.direccion = proveedor.direccion
          ? proveedor.direccion
          : empresa.direccion
        if (!proveedor.parroquia) await obtenerParroquias(proveedor.canton)
        proveedor.sucursal = proveedor.sucursal
          ? proveedor.sucursal
          : empresa.sucursal
        StatusLoading.desactivar()
      }
    }

    async function guardado(data) {
      switch (data) {
        case 'CategoriaOfertaPage':
          await consultarCategoriasOfertas()
          break
        case 'ContactoProveedorPage':
          await consultarContactosProveedor()
          break
        case 'CalificacionProveedorPage':
          await listar()
          break
        case 'DatoBancarioPage':
          await consultarDatosBancarios()
          break
        default:
          await consultarEmpresas()
      }
    }

    async function obtenerParroquias(parroquiaId: number | string | null) {
      proveedor.parroquia = null
      if (parroquiaId !== null) {
        StatusLoading.activar()
        listadosAuxiliares.parroquias = (
          await new ParroquiaController().listar({ canton_id: parroquiaId })
        ).result
        parroquias.value = listadosAuxiliares.parroquias
        StatusLoading.desactivar()
      }
      // parroquias.value = JSON.parse(LocalStorage.getItem('parroquias')!.toString()).filter((v) => v.canton_id == proveedor.canton)
    }

    async function consultarDetalleDepartamentoProveedor(
      recalificacion = false
    ) {
      const { result } =
        await new DetalleDepartamentoProveedorController().listar({
          proveedor_id: proveedorStore.idProveedor,
          departamento_id: proveedorStore.idDepartamento
        })
      console.log('Los detalles del departamento proveedor es: ', result)
      console.log('El detalle departamento proveedor es: ', result[0])
      if (result) {
        detalleDepartamentoProveedor.value = result[0]
        if (recalificacion) {
          detalleDepartamentoProveedor.value = result.reduce(
            (max, item) => (item.id > max.id ? item : max),
            result[0]
          )
        }
      }
    }

    function actualizarCategorias() {
      categorias.value = listadosAuxiliares.categorias.filter(
        (v: CategoriaOferta) =>
          proveedor.tipos_ofrece.includes(v.tipo_oferta_id)
      )
    }

    async function consultarEmpresas() {
      const { result } = await new EmpresaController().listar()
      listadosAuxiliares.empresas = result
      empresas.value = result
    }

    async function consultarDatosBancarios() {
      const { result } = await new DatoBancarioController().listar({
        empresa_id: proveedor.empresa
      })
      empresa.datos_bancarios = result
    }

    async function consultarContactosProveedor() {
      const { result } = await new ContactoProveedorController().listar({
        empresa_id: proveedor.empresa,
        proveedor_id: proveedor.id
      })
      proveedor.contactos = result
    }

    async function consultarCategoriasOfertas() {
      const { result } = await new CategoriaOfertaController().listar()
      listadosAuxiliares.categorias = result
      categorias.value = result
    }

    const {
      cantones,
      filtrarCantones,
      parroquias,
      filtrarParroquias,
      empresas,
      filtrarEmpresas,
      ordenarEmpresas
    } = useFiltrosListadosSelects(listadosAuxiliares)

    //llenar listados
    parroquias.value = listadosAuxiliares.parroquias
    categorias.value = listadosAuxiliares.categorias
    empresas.value = listadosAuxiliares.empresas
    departamentos.value = listadosAuxiliares.departamentos
    ofertas.value = listadosAuxiliares.ofertas
    cantones.value = listadosAuxiliares.cantones

    return {
      mixinEmpresas,
      mixin,
      proveedor,
      disabled,
      v$,
      accion,
      acciones,
      configuracionColumnas: configuracionColumnasProveedores,
      columnasContactosProveedor,
      columnasDatosBancarios,
      departamentoFinanciero,
      refArchivo,
      esReferido,

      empresa,
      //listados
      categorias,
      departamentos,
      ofertas,
      tiposEnvios,
      formasPagos,
      opcionesTipoContribuyente,
      opcionesTipoNegocio,
      cantones,
      filtrarCantones,
      parroquias,
      filtrarParroquias,
      empresas,
      filtrarEmpresas,

      //modal
      modales,
      mostrarLabelModal,
      guardado,
      abrirModalContacto,
      abrirModalDatoBancario,
      refContactos,

      //funciones
      obtenerEmpresa,
      obtenerParroquias,
      actualizarCategorias,
      ordenarEmpresas,
      ordenarCategorias() {
        categorias.value.sort((a: CategoriaOferta, b: CategoriaOferta) =>
          ordernarListaString(a.nombre!, b.nombre!)
        )
      },
      actualizarDepartamentos() {
        if (accion.value == acciones.nuevo) {
          const catSeleccionadas = categorias.value.filter(
            (v: CategoriaOferta) => proveedor.categorias_ofrece.includes(v.id)
          )
          // console.log(catSeleccionadas)
          // console.log(new Set(catSeleccionadas.flatMap((v: CategoriaOferta) => v.departamentos)))
          proveedor.departamentos = [
            ...new Set(
              catSeleccionadas.flatMap((v: CategoriaOferta) => v.departamentos)
            )
          ]
        }
      },

      //botones
      botonCalificarProveedor,
      botonRecalificarProveedor,
      botonVerTodasCalificacionesProveedor,
      botonVerMiCalificacionProveedor,
      botonDesactivarProveedor,
      botonActivarProveedor,
      botonActualizarCalificacion,
      botonDescargarProveedores
    }
  }
})
