import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin';
import { defineComponent, reactive } from 'vue';
import { Postulacion } from '../../../domain/Postulacion';
import { CargoController } from 'pages/recursosHumanos/cargos/infraestructure/CargoController';
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales';
import { ordenarLista } from 'shared/utils';
import { required } from 'shared/i18n-validators';
import useVuelidate from '@vuelidate/core';
import { useNotificaciones } from 'shared/notificaciones';
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading';
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository';
import { endpoints } from 'config/api';
import { BancoPostulante } from '../../../../bancoPostulante/domain/BancoPostulante';
import { AxiosResponse } from 'axios';
import { usePostulacionStore } from 'stores/recursosHumanos/seleccionContratacion/postulacion';
import { likertCalificacionPostulante } from 'config/seleccionContratacionPersonal.utils';

export default defineComponent({
  components: {},
  props: {
    mixinModal: {
      type: Object as () => ContenedorSimpleMixin<Postulacion>,
      required: true,
    },
  },
  emits: ['cerrar-modal', 'guardado'],
  setup(props, { emit }) {
    const { listadosAuxiliares } = props.mixinModal.useReferencias()
    const { cargarVista, obtenerListados } = props.mixinModal.useComportamiento()
    const { confirmar, notificarCorrecto, notificarAdvertencia } = useNotificaciones()
    const banco = reactive(new BancoPostulante())
    const cargando = new StatusEssentialLoading()
    const postulacionStore = usePostulacionStore()


    const { cargos, filtrarCargos } = useFiltrosListadosSelects(listadosAuxiliares)
    cargarVista(async () => {
      await obtenerListados({
        cargos: { controller: new CargoController(), params: { estado: 1 } }
      })
      cargos.value = listadosAuxiliares.cargos
      banco.postulacion = postulacionStore.idPostulacion
    })
    const reglas = {
      cargo: { required },
      puntuacion: { required },
      // observacion: (v: string) => v.length <= 250,
    }
    const v$ = useVuelidate(reglas, banco)


    /***************************************************************************
     * FUNCIONES
    ***************************************************************************/
    async function agregarBanco() {
      if (await v$.value.$validate()) {
        try {
          confirmar('¿Está seguro de continuar?', async () => {
            cargando.activar()
            const axios = AxiosHttpRepository.getInstance()
            const ruta = axios.getEndpoint(endpoints.bancos_postulantes)
            const response: AxiosResponse = await axios.post(ruta, banco)
            notificarCorrecto(response.data.mensaje)
            cargando.desactivar()
            emit('cerrar-modal', false)
            emit('guardado', { formulario: 'AgregarBancoPostulantePage' })
          })

        } catch (error: any) {
          notificarAdvertencia(error);
        }
        finally {
          cargando.desactivar()
          v$.value.$reset()
        }
      }
    }

    function cancelar() {
      emit('cerrar-modal', false)
    }

    return {
      banco, v$,
      //listados
      cargos, filtrarCargos,
      likertCalificacionPostulante,

      //funciones
      ordenarLista,
      agregarBanco,
      cancelar,
    }
  }
})
