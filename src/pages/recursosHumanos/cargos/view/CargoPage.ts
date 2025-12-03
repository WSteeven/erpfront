// Dependencias
import { configuracionColumnasCargos } from '../domain/configuracionColumnasCargos'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, onMounted, ref } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { CargoController } from '../infraestructure/CargoController'
import { Cargo } from '../domain/Cargo'
import { removeAccents } from 'shared/utils'
import ErrorComponent from 'components/ErrorComponent.vue'
import { required } from 'shared/i18n-validators'
import { LocalStorage } from 'quasar'

export default defineComponent({
  components: { ErrorComponent, TabLayout },
  setup() {
    const mixin = new ContenedorSimpleMixin(Cargo, new CargoController())
    const { entidad: cargo, disabled, listado } = mixin.useReferencias()
    const { setValidador } = mixin.useComportamiento()
    // const { onConsultado } = mixin.useHooks()

    let areasDefault: string[] = [
      'ADMINISTRATIVO',
      'TECNICO 1',
      'TECNICO 2',
      'TECNICO CLARO',
      'CLARO',
      'GRUPO JEAN CARLOS'
    ]
    const areas = ref<string[]>(areasDefault)

    //Reglas de validacion
    const reglas = {
      nombre: { required },
      area: { required }
    }

    const v$ = useVuelidate(reglas, cargo)
    setValidador(v$.value)

    /***************
     * HOOKS
     **************/
    onMounted(() => {
      cargarAreasDB()
    })

    /***************
     * FUNCIONES
     **************/
    function cargarAreasDB() {
      setTimeout(() => {
        const areasBD = listado.value
          .map((cargo: Cargo) => cargo.area?.toString().trim().toUpperCase())
          .filter((area:string|null): area is string => !!area && area.length > 0)

        areasDefault = [...new Set([...areasDefault, ...areasBD])]
        LocalStorage.set('areasRoles', JSON.stringify(areasDefault))
        areas.value = areasDefault
      }, 1000)
    }

    function crearArea(
      val: string,
      done: (val: string, action?: string) => void
    ) {
      const nueva = val.toUpperCase()
      if (nueva.length > 0) {
        if (!areasDefault.includes(nueva)) {
          areasDefault.push(nueva)
          LocalStorage.set('areasRoles', JSON.stringify(areasDefault))
          done(nueva, 'add-unique')
        }
      }
    }

    function filtrarAreas(val: string, update: (fn: () => void) => void) {
      val = val.toUpperCase()
      update(() => {
        if (val == '') areas.value = areasDefault
        else {
          areas.value = areasDefault.filter(
            (v: string) => v.toUpperCase().indexOf(val) > -1
          )
        }
      })
    }

    return {
      removeAccents,
      mixin,
      cargo,
      v$,
      disabled,
      configuracionColumnas: configuracionColumnasCargos,
      crearArea,
      areas,
      filtrarAreas
    }
  }
})
