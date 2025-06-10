import { defineComponent } from 'vue'
import ServiciosBasicos from 'trabajoSocial/servicios_basicos/view/ServiciosBasicos.vue'
import OptionGroupComponent from 'components/optionGroup/view/OptionGroupComponent.vue'
import NoOptionComponent from 'components/NoOptionComponent.vue'
import ErrorComponent from 'components/ErrorComponent.vue'
import {
  likertEspaciosFamiliares,
  materiales_predominantes,
  numero_plantas,
  opcionesDistribucion,
  optionsAmenazasPrevistas,
  tipos_amenazas_deslaves,
  tipos_amenazas_inundaciones,
  tipos_predominantes,
  tipos_viviendas
} from 'config/trabajoSocial.utils'
import { acciones } from 'config/utils'
import { Vivienda } from 'trabajoSocial/informacion_vivienda/domain/Vivienda'
import useVuelidate from '@vuelidate/core'
import { required, requiredIf } from 'shared/i18n-validators'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { ProvinciaController } from 'sistema/provincia/infraestructure/ProvinciaController'
import { LocalStorage } from 'quasar'
import { ParroquiaController } from 'sistema/parroquia/infraestructure/ParroquiaController'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { OptionGroup } from 'components/optionGroup/domain/OptionGroup'
import { obtenerUbicacion } from 'shared/utils'

export default defineComponent({
  components: {
    ServiciosBasicos,
    NoOptionComponent,
    ErrorComponent,
    OptionGroupComponent
  },
  props: {
    mixin: {
      type: Object as () => ContenedorSimpleMixin<EntidadAuditable>,
      required: true
    },
    vivienda: {
      type: Vivienda,
      required: true
    },
    disable: { type: Boolean, default: false },
    accion: { type: String as keyof acciones, default: acciones.nuevo }
  },
  emits: ['consultado'],
  setup(props, { emit }) {
    const { listadosAuxiliares } = props.mixin.useReferencias()
    const { cargarVista, obtenerListados } = props.mixin.useComportamiento()
    const { onConsultado } = props.mixin.useHooks()
    const cargando = new StatusEssentialLoading()
    const {
      provincias,
      filtrarProvincias,
      cantones,
      filtrarCantones,
      parroquias,
      filtrarParroquias
    } = useFiltrosListadosSelects(listadosAuxiliares)
    cargarVista(() => {
      listadosAuxiliares.provincias = []
      listadosAuxiliares.cantones = []
      listadosAuxiliares.parroquias = []
      listadosAuxiliares.cantones = JSON.parse(
        LocalStorage.getItem('cantones')!.toString()
      )
      cantones.value = listadosAuxiliares.cantones
      parroquias.value = listadosAuxiliares.parroquias
    })
    const reglas = {
      tipo: { required },
      numero_plantas: { required },
      material_paredes: { required },
      material_techo: { required },
      material_piso: { required },
      distribucion_vivienda: { required },
      numero_dormitorios: { required },
      numero_personas: { required },
      comodidad_espacio_familiar: { required },
      amenaza_inundacion: { required },
      amenaza_deslaves: { required },
      existe_peligro_tsunami: { required },
      existe_peligro_lahares: { required },
      otras_amenazas_previstas: { required },
      familia_acogiente: {
        parroquia: {
          required: requiredIf(() => props.vivienda.tiene_donde_evacuar)
        },
        direccion: {
          required: requiredIf(() => props.vivienda.tiene_donde_evacuar)
        },
        coordenadas: {
          required: requiredIf(() => props.vivienda.tiene_donde_evacuar)
        },
        referencia: {
          required: requiredIf(() => props.vivienda.tiene_donde_evacuar)
        },
        nombres_apellidos: {
          required: requiredIf(() => props.vivienda.tiene_donde_evacuar)
        },
        telefono: {
          required: requiredIf(() => props.vivienda.tiene_donde_evacuar)
        }
      }
    }

    const v$ = useVuelidate(reglas, props.vivienda)

    onConsultado(async () => {
      if (provincias.value == undefined || provincias.value?.length == 0) {
        await obtenerListados({ provincias: new ProvinciaController() })
        provincias.value = listadosAuxiliares.provincias
      }
      const parroquiaId = props.vivienda.familia_acogiente.parroquia
      await obtenerParroquias(props.vivienda.familia_acogiente?.canton)
      // eslint-disable-next-line vue/no-mutating-props
      props.vivienda.familia_acogiente.parroquia = parroquiaId

      emit('consultado')
    })
    const optionsTiposParroquias: OptionGroup[] = [
      {
        label: 'URBANA',
        value: 'URBANA',
        checkedIcon: 'bi-check-circle-fill',
        uncheckedIcon: 'panorama_fish_eye'
      },
      {
        label: 'RURAL',
        value: 'RURAL',
        checkedIcon: 'bi-check-circle-fill',
        uncheckedIcon: 'panorama_fish_eye'
      }
    ]

    /***************
     * FUNCIONES
     **************/
    function checkTieneDondeEvacuar(val) {
      if (val) {
        if (listadosAuxiliares.provincias.length < 1) {
          cargarVista(() => {
            obtenerListados({
              provincias: new ProvinciaController()
            })

            provincias.value = listadosAuxiliares.provincias
          })
        }
      }
    }

    function obtenerCoordenadas() {
      obtenerUbicacion(ubicacion => {
        vivienda.familia_acogiente.coordenadas =
          ubicacion.coords.latitude + ' ' + ubicacion.coords.longitude
      })
    }

    function obtenerCantones(provinciaId: number | null) {
      // eslint-disable-next-line vue/no-mutating-props
      props.vivienda.familia_acogiente.canton = null
      if (provinciaId !== null) {
        listadosAuxiliares.cantones = JSON.parse(
          LocalStorage.getItem('cantones')!.toString()
        ).filter(v => v.provincia_id == provinciaId)
        cantones.value = listadosAuxiliares.cantones
      }
    }

    async function obtenerParroquias(cantonId: number | null) {
      // eslint-disable-next-line vue/no-mutating-props
      props.vivienda.familia_acogiente.parroquia = null
      if (cantonId !== null) {
        cargando.activar()
        listadosAuxiliares.parroquias = (
          await new ParroquiaController().listar({ canton_id: cantonId })
        ).result
        parroquias.value = listadosAuxiliares.parroquias
        cargando.desactivar()
      }
    }

    return {
      v$,

      //listados
      tipos_viviendas,
      numero_plantas,
      tipos_predominantes,
      optionsTiposParroquias,
      tipos_amenazas_deslaves,
      likertEspaciosFamiliares,
      optionsAmenazasPrevistas,
      tipos_amenazas_inundaciones,
      opcionesDistribucion,
      provincias,
      filtrarProvincias,
      cantones,
      filtrarCantones,
      parroquias,
      filtrarParroquias,

      //funciones
      obtenerCantones,
      obtenerParroquias,

      checkTieneDondeEvacuar,
      obtenerListadoMaterialesPredominantes: tipo => {
        return materiales_predominantes.filter(v => v.tipo == tipo)
      }
    }
  }
})
