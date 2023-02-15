import { defineComponent, reactive ,ref, watchEffect} from 'vue'

import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { FondoRotativoFechaController } from '../infrestructure/FondoRotativoFechaController'
import { UsuarioController } from 'pages/fondosRotativos/usuario/infrestructure/UsuarioController'
import { TipoFondoController } from 'pages/fondosRotativos/tipoFondo/infrestructure/TipoFonfoController'
import { FondoRotativoFecha } from '../domain/FondoRotativoFecha'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { AxiosResponse } from 'axios'
import { endpoints } from 'config/api'


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
    const mixin = new ContenedorSimpleMixin(FondoRotativoFecha, new FondoRotativoFechaController())
    const { entidad: fondo_rotativo_fecha, disabled, accion,listadosAuxiliares } = mixin.useReferencias()
    const { setValidador ,obtenerListados, cargarVista} = mixin.useComportamiento()

    /*************
    * Validaciones
    **************/
    const reglas = {
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
    const v$ = useVuelidate(reglas, fondo_rotativo_fecha)
    setValidador(v$.value)
   const usuarios= ref([]);
   const tiposFondos= ref([]);
   const tiposFondoRotativoFechas= ref([]);
   usuarios.value=listadosAuxiliares.usuarios

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
    tiposFondoRotativoFechas.value = listadosAuxiliares.tiposFondoRotativoFechas

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
      tiposFondoRotativoFechas.value = listadosAuxiliares.tiposFondoRotativoFechas
    })
    return
  }
  update(() => {
    const needle = val.toLowerCase()
    tiposFondoRotativoFechas.value = listadosAuxiliares.tiposFondoRotativoFechas.filter(
      (v) => v.descripcion.toLowerCase().indexOf(needle) > -1
    )
  })
}


  async function generar_excel(valor:FondoRotativoFecha):Promise<void> {
    const titulo =  'prueba';
    const formato = 'xlsx'
    const axios = AxiosHttpRepository.getInstance()
    const ruta = axios.getEndpoint(endpoints.fondo_rotativo_fecha_excel)
    const response:AxiosResponse = await axios.post(ruta, valor)
    const fileURL = window.URL.createObjectURL(new Blob([response.data], { type: 'application/vnd.ms-excel' }));
    const link = document.createElement('a');
    link.href = fileURL
    link.target = '_blank'
    link.setAttribute('download', `${titulo}.${formato}`)
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  function generar_pdf(valor:FondoRotativoFecha):void {
    console.log('pdf',valor);
  }

     return {
      mixin,
      fondo_rotativo_fecha,
      disabled, accion, v$,
      usuarios,
      tiposFondos,
      tiposFondoRotativoFechas,
      generar_excel,
      generar_pdf,
      filtrarUsuarios,
      filtrarTiposFondos,
      filtrarTiposFondoRotativoFechas,
      watchEffect,
    }
  }
})


