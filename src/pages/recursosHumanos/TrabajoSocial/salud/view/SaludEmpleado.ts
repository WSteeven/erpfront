import { defineComponent } from 'vue'
import OptionGroupComponent from 'components/optionGroup/view/OptionGroupComponent.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import { TipoDiscapacidadPorcentaje } from 'recursosHumanos/empleados/domain/TipoDiscapacidadPorcentaje'
import { btnEliminarDefault, encontrarUltimoIdListado } from 'shared/utils'
import { Salud } from 'trabajoSocial/salud/domain/Salud'
import { configuracionColumnasTipoDiscapacidadPorcentaje as configuracionColumnasDiscapacidades } from 'recursosHumanos/empleados/domain/configuracionColumnasTipoDiscapacidadPorcentaje'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { TipoDiscapacidad } from 'recursosHumanos/tipo-discapacidad/domain/TipoDiscapacidad'
import { acciones, accionesTabla } from 'config/utils'
import { optionsLugaresAtencion, parentescos } from 'config/trabajoSocial.utils'
import useVuelidate from '@vuelidate/core'
import { helpers, minValue, required, requiredIf } from 'shared/i18n-validators'
import { TipoDiscapacidadController } from 'recursosHumanos/tipo-discapacidad/infraestructure/TipoDiscapacidadController'
import ErrorComponent from 'components/ErrorComponent.vue'
import NoOptionComponent from 'components/NoOptionComponent.vue'

export default defineComponent({
  components: {
    NoOptionComponent,
    ErrorComponent,
    EssentialTable,
    OptionGroupComponent
  },
  props: {
    mixin: {
      type: Object as () => ContenedorSimpleMixin<EntidadAuditable>,
      required: true
    },
    salud: {
      type: Salud,
      required: true
    },
    disable: { type: Boolean, default: false },
    accion: { type: String as keyof acciones, default: acciones.nuevo }
  },
  setup(props) {
    const { listadosAuxiliares } = props.mixin.useReferencias()
    const { cargarVista, obtenerListados } = props.mixin.useComportamiento()
    cargarVista(async () => {
      await obtenerListados({
        tipos_discapacidades: {
          controller: new TipoDiscapacidadController(),
          params: { campos: 'id,nombres' }
        }
      })

      // configuracion de listados
      configuracionColumnasDiscapacidades.find(
        (item: ColumnConfig<TipoDiscapacidadPorcentaje>) =>
          item.field === 'tipo_discapacidad'
      )!.options = listadosAuxiliares.tipos_discapacidades.map(
        (v: TipoDiscapacidad) => {
          return { label: v.nombre, value: v.id }
        }
      )
    })

    const reglas = {
      nombre_familiar_dependiente_discapacitado: {
        required: requiredIf(
          () => props.salud.tiene_familiar_dependiente_discapacitado
        )
      },
      parentesco_familiar_discapacitado: {
        required: requiredIf(
          () => props.salud.tiene_familiar_dependiente_discapacitado
        )
      },
      enfermedad_cronica: {
        required: requiredIf(() => props.salud.tiene_enfermedad_cronica)
      },
      lugar_atencion: { required },
      discapacidades: {
        $each: helpers.forEach({
          tipo_discapacidad: { required },
          porcentaje: { required, minValue: minValue(0) }
        })
      },
      discapacidades_familiar_dependiente: {
        $each: helpers.forEach({
          tipo_discapacidad: { required },
          porcentaje: { required, minValue: minValue(0) }
        })
      }
    }
    const v$ = useVuelidate(reglas, props.salud)

    const agregarDiscapacidad = (listado: any) => {
      const discapacidad = new TipoDiscapacidadPorcentaje()
      discapacidad.id = listado?.length
        ? encontrarUltimoIdListado(listado) + 1
        : 1
      listado.push(discapacidad)
    }

    return {
      v$,
      configuracionColumnasDiscapacidades,
      accionesTabla,
      acciones,

      // listados
      optionsLugaresAtencion,
      parentescos,

      //funciones
      agregarDiscapacidad,

      // botones de tabla
      btnEliminarDefault
    }
  }
})
