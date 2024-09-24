import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin';
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue';
import { defineComponent, ref } from 'vue';
import { BancoPostulante } from '../domain/BancoPostulante';
import { BancoPostulanteController } from '../infraestructure/BancoPostulanteController';
import useVuelidate from '@vuelidate/core';
import { acciones, maskFecha, tiposDocumentosIdentificaciones } from 'config/utils';
import { required } from 'shared/i18n-validators';
import { configuracionColumnasBancoPostulante } from '../domain/configuracionColumnasBancoPostulante';
import { tabOptionsBancoPostulante } from 'config/seleccionContratacionPersonal.utils';
import { IdentidadGeneroController } from 'pages/medico/gestionarPacientes/modules/fichaPeriodicaPreocupacional/infraestructure/IdentidadGeneroController';
import { PaisController } from 'sistema/pais/infraestructure/PaisController';
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales';
import GestorArchivos from 'components/gestorArchivos/GestorArchivos.vue';
import { Postulacion } from '../../postulacionVacante/domain/Postulacion';
import { PostulacionController } from '../../postulacionVacante/infraestructure/PostulacionController';
import { CargoController } from 'pages/recursosHumanos/cargos/infraestructure/CargoController';
import OptionGroupComponent from 'components/optionGroup/view/OptionGroupComponent.vue';

export default defineComponent({
  components: { TabLayoutFilterTabs2, GestorArchivos, OptionGroupComponent },
  setup() {
    const mixin = new ContenedorSimpleMixin(BancoPostulante, new BancoPostulanteController())
    const mixinPostulaciones = new ContenedorSimpleMixin(Postulacion, new PostulacionController())
    const { entidad: banco, disabled, listadosAuxiliares, tabs, accion } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados, consultar, listar } = mixin.useComportamiento()
    const { onConsultado, onGuardado, onBeforeModificar, onReestablecer } = mixin.useHooks()

    const tabActual = ref('0')
    const CURRICULUM = 'CURRICULUM'
    const refArchivo = ref()
    const identidades = ref()

    const { paises, cargos, } = useFiltrosListadosSelects(listadosAuxiliares)

    cargarVista(async () => {
      await obtenerListados({
        identidades: new IdentidadGeneroController(),
        paises: new PaisController(),
        cargos: {
          controller: new CargoController(),
          params: { estado: 1 },
        },
      })
      //more code on initialization time
      paises.value = listadosAuxiliares.paises
      cargos.value = listadosAuxiliares.cargos
      identidades.value = listadosAuxiliares.identidades
    })

    const reglas = {
      cargo: { required },
      puntuacion: { required },
      // observacion: (v: string) => v.length <= 250,
    }
    const v$ = useVuelidate(reglas, banco)

    onConsultado(async () => {
      setTimeout(() => {
        refArchivo.value?.listarArchivosAlmacenados(banco.postulacion_id, { tipo: CURRICULUM })
      }, 300)

    })

    /*******************************************************************************************
     * Funciones
     ******************************************************************************************/
    async function filtrarCandidatos(tab: string) {
      tabActual.value = tab
      listar({ descartado: tab })
    }


    return {
      mixin, v$, accion, acciones,
      mixinPostulaciones,
      configuracionColumnas: configuracionColumnasBancoPostulante,
      banco,
      disabled,
      tabActual,
      maskFecha,
      refArchivo,

      //listados
      tabOptions: tabOptionsBancoPostulante,
      tiposDocumentosIdentificaciones,
      identidades,
      paises,
      cargos,

      //funciones
      filtrarCandidatos,
    }
  }
})
