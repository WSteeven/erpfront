import { defineComponent, reactive, ref, watchEffect } from 'vue'

import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { TipoFondoController } from 'pages/fondosRotativos/tipoFondo/infrestructure/TipoFonfoController'
import { FondoRotativoContabilidad } from '../domain/FondoRotativoContabilidad'
import { FondoRotativoContabilidadController } from '../infrestructure/FondoRotativoContabilidadController'
import { UsuarioController } from 'pages/fondosRotativos/usuario/infrestructure/UsuarioController'
import { useFondoRotativoStore } from 'stores/fondo_rotativo'

export default defineComponent({
  components: { TabLayout },
  setup() {
    /*********
     * Stores
     *********/
    useNotificacionStore().setQuasar(useQuasar())
    /***********
     * Mixin
     ************/
    const mixin = new ContenedorSimpleMixin(
      FondoRotativoContabilidad,
      new FondoRotativoContabilidadController()
    )
    const {
      entidad: fondo_rotativo_contabilidad,
      disabled,
      accion,
      listadosAuxiliares,
      listado,
    } = mixin.useReferencias()
    const store_fondos_rotativos = useFondoRotativoStore();
    const { setValidador, obtenerListados, cargarVista,listar } =
      mixin.useComportamiento()

    /*************
     * Validaciones
     **************/
    const reglas = {
      usuario: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
      fecha_inicio: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
      fecha_fin: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
    }
    const v$ = useVuelidate(reglas, fondo_rotativo_contabilidad)
    setValidador(v$.value)
    const usuarios = ref([])
    const tiposFondos = ref([])
    const tiposFondoRotativoFechas = ref([])
    usuarios.value = listadosAuxiliares.usuarios

    cargarVista(async () => {
      await obtenerListados({
        usuarios: {
          controller: new UsuarioController(),
          params: { campos: 'id,name' },
        },
        tiposFondos: {
          controller: new TipoFondoController(),
          params: { campos: 'id,descripcion' },
        },
      })

      usuarios.value = listadosAuxiliares.usuarios
      tiposFondos.value = listadosAuxiliares.tiposFondos
      tiposFondoRotativoFechas.value =
        listadosAuxiliares.tiposFondoRotativoFechas
    })
    /*********
     * Filtros
     **********/
    // - Filtro AUTORIZACIONES ESPECIALES

    function filtrarUsuarios(val, update) {
      if (val === '') {
        update(() => {
          usuarios.value = listadosAuxiliares.usuarios
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        usuarios.value = listadosAuxiliares.usuarios.filter(
          (v) => v.name.toLowerCase().indexOf(needle) > -1
        )
      })
    }
    // - Filtro TIPOS FONDOS
    function filtrarTiposFondos(val, update) {
      if (val === '') {
        update(() => {
          tiposFondos.value = listadosAuxiliares.tiposFondos
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        tiposFondos.value = listadosAuxiliares.tiposFondos.filter(
          (v) => v.descripcion.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    // - Filtro TIPOS FONDOS
    function filtrarTiposFondoRotativoFechas(val, update) {
      if (val === '') {
        update(() => {
          tiposFondoRotativoFechas.value =
            listadosAuxiliares.tiposFondoRotativoFechas
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        tiposFondoRotativoFechas.value =
          listadosAuxiliares.tiposFondoRotativoFechas.filter(
            (v) => v.descripcion.toLowerCase().indexOf(needle) > -1
          )
      })
    }
    async function abrir_reporte(
      valor: FondoRotativoContabilidad
    ): Promise<void> {
      listar({ usuario: valor.usuario,
         fecha_inicio: valor.fecha_inicio,
          fecha_fin: valor.fecha_fin })

    }

    return {
      mixin,
      fondo_rotativo_contabilidad,
      disabled,
      accion,
      v$,
      usuarios,
      tiposFondos,
      tiposFondoRotativoFechas,
      abrir_reporte,
      filtrarUsuarios,
      filtrarTiposFondos,
      filtrarTiposFondoRotativoFechas,
      watchEffect,
      listado,
    }
  },
})
