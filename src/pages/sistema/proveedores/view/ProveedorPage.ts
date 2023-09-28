//Dependencias
import { configuracionColumnasProveedores } from './../domain/configuracionColumnasProveedores'
import { configuracionColumnasContactosProveedores } from 'pages/comprasProveedores/contactosProveedor/domain/configuracionColumnasContactosProveedores';
import { required, requiredIf } from 'shared/i18n-validators'
import { useVuelidate } from '@vuelidate/core';

//Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import LabelAbrirModal from 'components/modales/modules/LabelAbrirModal.vue';
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue';
import TablaDevolucionProducto from 'components/tables/view/TablaDevolucionProducto.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue';
import GestorArchivos from 'components/gestorArchivos/GestorArchivos.vue';

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin';
import { Ref, computed, defineComponent, reactive, ref } from 'vue';
import { ProveedorController } from '../infraestructure/ProveedorController';
import { Proveedor } from '../domain/Proveedor';
import { acciones } from 'config/utils';
import { ComportamientoModalesProveedores } from '../application/ComportamientoModalesProveedores';
import { EmpresaController } from 'pages/administracion/empresas/infraestructure/EmpresaController';
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales';
import { Empresa } from 'pages/administracion/empresas/domain/Empresa';
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading';
import { estadosCalificacionProveedor, opcionesTipoContribuyente, opcionesTipoNegocio, tiposEnvios, formasPagos } from 'config/utils_compras_proveedores';
import { ParroquiaController } from 'sistema/parroquia/infraestructure/ParroquiaController';
import { OfertaProveedorController } from '../modules/ofertas_proveedores/infraestructure/OfertaProveedorController';
import { DepartamentoController } from '../modules/departamentos/infraestructure/DepartamentoController';
import { CustomActionTable } from 'components/tables/domain/CustomActionTable';
import { ContactoProveedor } from 'pages/comprasProveedores/contactosProveedor/domain/ContactoProveedor';
import { useNotificaciones } from 'shared/notificaciones';
import { ContactoProveedorController } from 'pages/comprasProveedores/contactosProveedor/infraestructure/ContactoProveedorController';
import { useProveedorStore } from 'stores/comprasProveedores/proveedor';
import { useAuthenticationStore } from 'stores/authentication';
import moment from 'moment';
import { useCalificacionProveedorStore } from 'stores/comprasProveedores/calificacionProveedor';
import { DetalleDepartamentoProveedorController } from 'pages/comprasProveedores/detallesDepartamentosProveedor/infraestructure/DetalleDepartamentoProveedorController';
import { LocalStorage, useQuasar } from 'quasar';
import { CategoriaOfertaController } from 'pages/comprasProveedores/categoriaOfertas/infraestructure/CategoriaOfertaController';
import { CategoriaOferta } from 'pages/comprasProveedores/categoriaOfertas/domain/CategoriaOferta';
import { ordernarListaString } from 'shared/utils';
import { Departamento } from 'pages/recursosHumanos/departamentos/domain/Departamento';
import { useNotificacionStore } from 'stores/notificacion';
import { useCargandoStore } from 'stores/cargando';
import { configuracionColumnasDatosBancariosProveedor } from 'pages/comprasProveedores/datosBancariosProveedor/domain/configuracionColumnasDatosBancariosProveedor';
import { ArchivoController } from 'pages/gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/infraestructure/ArchivoController';
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt';
import { ValidarPropiedadesProveedor } from '../application/validaciones/ValidarPropiedadesProveedor';


export default defineComponent({
  components: { TabLayout, LabelAbrirModal, ModalesEntidad, TablaDevolucionProducto, EssentialTable, GestorArchivos },
  setup() {
    const mixinEmpresas = new ContenedorSimpleMixin(Empresa, new EmpresaController(), new ArchivoController())
    const mixin = new ContenedorSimpleMixin(Proveedor, new ProveedorController())
    const { entidad: proveedor, disabled, accion, listadosAuxiliares, listado } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados, listar } = mixin.useComportamiento()
    const { onConsultado, onReestablecer, onGuardado, onModificado, onBeforeGuardar, onBeforeModificar } = mixin.useHooks()
    const { confirmar, prompt, notificarCorrecto, notificarError } = useNotificaciones()
    const refContactos = ref()
    const contactosProveedor: Ref<ContactoProveedor[]> = ref(proveedor.contactos)
    const mostrarLabelModal = computed(() => accion.value === acciones.nuevo || accion.value === acciones.editar)
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
    const departamentoFinanciero = computed(() => listadosAuxiliares.departamentos.length > 0 ? listadosAuxiliares.departamentos.filter((v: Departamento) => v.nombre == 'FINANCIERO')[0] : new Departamento())
    cargarVista(async () => {
      await obtenerListados({
        empresas: {
          controller: new EmpresaController(),
          params: { es_proveedor: 1 }
        },
        parroquias: new ParroquiaController(),
        categorias: new CategoriaOfertaController(),
        departamentos: new DepartamentoController(),
        ofertas: new OfertaProveedorController(),
      }).then(() => {
        proveedor.departamentos = [...proveedor.departamentos, departamentoFinanciero.value.id]
      })
      listadosAuxiliares.cantones = JSON.parse(LocalStorage.getItem('cantones')!.toString())
      cantones.value = JSON.parse(LocalStorage.getItem('cantones')!.toString())
    })

    /**************************************************************
     * Hooks
    **************************************************************/
    onConsultado(() => {
      // proveedor.tipo_envio = proveedor.tipo_envio != null ? JSON.parse(proveedor.tipo_envio.toString()) : []
      obtenerEmpresa(proveedor.empresa).then(() => refArchivo.value.listarArchivosAlmacenados(empresa.id))
      categorias.value = listadosAuxiliares.categorias.filter((v)=>proveedor.tipos_ofrece.includes(v.tipo_oferta_id))
    })
    onReestablecer(() => {
      empresa.hydrate(new Empresa())
      cantones.value = JSON.parse(LocalStorage.getItem('cantones')!.toString())
      proveedor.departamentos = [...proveedor.departamentos, departamentoFinanciero.value.id]
      refArchivo.value.limpiarListado()
      categorias.value = listadosAuxiliares.categorias
    })

    onBeforeGuardar(() => {
      // console.log(empresa)
      // console.log(proveedor)
    })
    onGuardado((id: number) => {
      // console.log('id guardado: ', id)
      subirArchivos()
    })
    onBeforeModificar(() => {
      subirArchivos()
    })
    onModificado((id: number) => {
      // console.log('id modificado: ', id)
      // refArchivo.value.idModelo = id
      // console.log(idEmpresaParaArchivos.value)
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

      tipo_envio: { requiredIfRealizaEnvios: requiredIf(proveedor.envios) },
    }
    const v$ = useVuelidate(reglas, proveedor)
    setValidador(v$.value)

    const validarPropiedadesProveedor = new ValidarPropiedadesProveedor(proveedor)
    mixin.agregarValidaciones(validarPropiedadesProveedor)

    /***************************
     * Configuracion de columnas
     ****************************/
    const columnasContactosProveedor: any = [
      ...configuracionColumnasContactosProveedores,
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
            mensaje: 'Ingresa el motivo por el que quieres desactivar este proveedor?',
            accion: async (data) => {
              try {
                proveedorStore.idProveedor = entidad.id
                const response = await proveedorStore.anularProveedor({ motivo: data })
                if (response?.status == 200) {
                  notificarCorrecto('Se ha desactivado correctamente el proveedor')
                  listado.value.splice(posicion, 1, response.data.modelo)
                }
              } catch (error: any) {
                notificarError('No se pudo desactivar el proveedor!')
              }
            }
          }
          prompt(data)
        })
      }, visible: ({ entidad }) => entidad.estado && store.esCompras
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
            mensaje: 'Ingresa el motivo por el que quieres desactivar este proveedor?',
            accion: async (data) => {
              try {
                proveedorStore.idProveedor = entidad.id
                const response = await proveedorStore.anularProveedor({ motivo: data })
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
      }, visible: ({ entidad }) => !entidad.estado
    }
    const abrirModalContacto: CustomActionTable = {
      titulo: 'Agregar Contacto',
      icono: 'bi-person-fill-add',
      color: 'positive',
      tooltip: 'Puede modificar o eliminar un contacto desde el panel contactos de proveedores',
      accion: () => {
        modales.abrirModalEntidad('ContactoProveedorPage')
      },
      visible: () => { return accion.value == acciones.nuevo || accion.value == acciones.editar }
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

    const botonCalificarProveedor: CustomActionTable = {
      titulo: 'Calificar',
      icono: 'bi-stars',
      color: 'positive',
      accion: async ({ entidad, posicion }) => {
        proveedorStore.idDepartamento = store.user.departamento
        proveedorStore.idProveedor = entidad.id
        proveedorStore.proveedor = entidad
        consultarDetalleDepartamentoProveedor().then(() => {
          proveedorStore.idDetalleDepartamento = detalleDepartamentoProveedor.value.id
        })
        // proveedorStore.proveedor.hydrate(await new ProveedorController().consultar(entidad.id))
        modales.abrirModalEntidad('CalificacionProveedorPage')

      },
      visible: ({ posicion, entidad }) => {
        // console.log(posicion, entidad)
        const departamento_calificador = entidad.related_departamentos.filter((v) => v.id === store.user.departamento)[0]
        if (departamento_calificador) {
          if (departamento_calificador.pivot.fecha_calificacion) {
            const diasTranscurridos = moment().diff(moment(departamento_calificador?.pivot.fecha_calificacion), 'days')
            return diasTranscurridos > 365 && entidad.estado
          }
          return true && entidad.estado
        }
        return false

        // return true
      }
    }
    const botonVerMiCalificacionProveedor: CustomActionTable = {
      titulo: 'Mi calificación',
      icono: 'bi-search',
      color: 'positive',
      accion: async ({ entidad, posicion }) => {
        proveedorStore.idDepartamento = store.user.departamento
        proveedorStore.idProveedor = entidad.id
        proveedorStore.proveedor = entidad
        calificacionStore.idDepartamento = proveedorStore.idDepartamento
        calificacionStore.verMiCalificacion = true
        await consultarDetalleDepartamentoProveedor().then(() => {
          proveedorStore.idDetalleDepartamento = detalleDepartamentoProveedor.value.id
          calificacionStore.idDetalleDepartamentoProveedor = detalleDepartamentoProveedor.value.id
          calificacionStore.detalleDepartamentoProveedor = detalleDepartamentoProveedor.value
        })
        modales.abrirModalEntidad('MiCalificacionProveedorPage')
      },
      visible: ({ posicion, entidad }) => {
        const departamento_calificador = entidad.related_departamentos.filter((v) => v.id === store.user.departamento)[0]
        if (departamento_calificador) {
          return departamento_calificador.pivot.calificacion !== null//aqui se muestra aunque de 0, corregir esta parte
        }
        return false
      }
    }
    const botonVerCalificacionProveedor: CustomActionTable = {
      titulo: 'Todas calificaciones',
      icono: 'bi-eye',
      color: 'info',
      accion: async ({ entidad, posicion }) => {
        proveedorStore.idDepartamento = store.user.departamento
        proveedorStore.idProveedor = entidad.id
        proveedorStore.proveedor = entidad
        await consultarDetalleDepartamentoProveedor().then(() => {
          proveedorStore.idDetalleDepartamento = detalleDepartamentoProveedor.value.id
        })
        modales.abrirModalEntidad('InfoCalificacionProveedorPage')
      },
      visible: ({ posicion, entidad }) => {
        // console.log(entidad)
        // console.log(store.user.permisos)
        return entidad.estado_calificado === estadosCalificacionProveedor.calificado || (entidad.estado_calificado == estadosCalificacionProveedor.parcial)// || (store.esCompras && (entidad.estado_calificado !== estadosCalificacionProveedor.vacio || entidad.estado_calificado !== estadosCalificacionProveedor.parcial || entidad.estado_calificado !== estadosCalificacionProveedor.pendiente))
      }
    }

    /**************************************************************
     * Funciones
     **************************************************************/

    async function subirArchivos() {
      await refArchivo.value.subir();
    }

    async function obtenerEmpresa(empresaId: number | null) {
      if (empresaId !== null) {
        StatusLoading.activar()
        const { result } = await new EmpresaController().consultar(empresaId)
        empresa.hydrate(result)
        proveedor.contactos = empresa.contactos
        proveedor.canton = empresa.canton
        proveedor.direccion = empresa.direccion
        if (!proveedor.parroquia) obtenerParroquias(proveedor.canton)
        proveedor.sucursal = proveedor.sucursal ? proveedor.sucursal : empresa.sucursal
        StatusLoading.desactivar()
      }
    }
    async function guardado(data) {
      switch (data) {
        case 'CategoriaOfertaPage':
          consultarCategoriasOfertas()
          break
        case 'ContactoProveedorPage':
          consultarContactosProveedor()
          break
        case 'CalificacionProveedorPage':
          listar()
          break
        default:
          consultarEmpresas()

      }

    }
    async function obtenerParroquias(parroquiaId: number | string | null) {
      proveedor.parroquia = null
      if (parroquiaId !== null) {
        StatusLoading.activar()
        listadosAuxiliares.parroquias = (await new ParroquiaController().listar({ canton_id: parroquiaId })).result
        parroquias.value = listadosAuxiliares.parroquias
        StatusLoading.desactivar()
      }
      // parroquias.value = JSON.parse(LocalStorage.getItem('parroquias')!.toString()).filter((v) => v.canton_id == proveedor.canton)
    }

    async function consultarDetalleDepartamentoProveedor() {
      const { result } = await new DetalleDepartamentoProveedorController().listar({ proveedor_id: proveedorStore.idProveedor, departamento_id: proveedorStore.idDepartamento })
      console.log('El detalle departamento proveedor es: ', result[0])
      if (result) detalleDepartamentoProveedor.value = result[0]

    }

    function actualizarCategorias() {
      categorias.value = listadosAuxiliares.categorias.filter((v: CategoriaOferta) => proveedor.tipos_ofrece.includes(v.tipo_oferta_id))
    }

    async function consultarEmpresas() {
      const { result } = await new EmpresaController().listar()
      listadosAuxiliares.empresas = result
      empresas.value = result
    }
    async function consultarContactosProveedor() {
      const { result } = await new ContactoProveedorController().listar({ empresa_id: proveedor.empresa, proveedor_id: proveedor.id })
      proveedor.contactos = result
    }
    async function consultarCategoriasOfertas() {
      const { result } = await new CategoriaOfertaController().listar()
      listadosAuxiliares.categorias = result
      categorias.value = result
    }
    const {
      cantones, filtrarCantones,
      parroquias, filtrarParroquias,
      empresas, filtrarEmpresas, ordenarEmpresas,

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
      mixin, proveedor, disabled, v$, accion, acciones,
      configuracionColumnas: configuracionColumnasProveedores,
      columnasContactosProveedor,
      columnasDatosBancarios,
      departamentoFinanciero,
      refArchivo,
      esReferido,


      //store
      store,

      empresa,
      //listados
      categorias,
      departamentos,
      ofertas,
      tiposEnvios,
      formasPagos,
      opcionesTipoContribuyente,
      opcionesTipoNegocio,
      cantones, filtrarCantones,
      parroquias, filtrarParroquias,
      empresas, filtrarEmpresas,

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
        categorias.value.sort((a: CategoriaOferta, b: CategoriaOferta) => ordernarListaString(a.nombre!, b.nombre!))
      },
      actualizarDepartamentos(val) {
        if(accion.value==acciones.nuevo){
          let catSeleccionadas = categorias.value.filter((v: CategoriaOferta) => proveedor.categorias_ofrece.includes(v.id))
          // console.log(catSeleccionadas)
          // console.log(new Set(catSeleccionadas.flatMap((v: CategoriaOferta) => v.departamentos)))
          proveedor.departamentos = [... new Set(catSeleccionadas.flatMap((v: CategoriaOferta) => v.departamentos))]
        }

      },

      //botones
      botonCalificarProveedor,
      botonVerCalificacionProveedor,
      botonVerMiCalificacionProveedor,
      botonDesactivarProveedor,
      botonActivarProveedor,
    }

  }
})

