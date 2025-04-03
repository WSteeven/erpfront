// Dependencias
import { configuracionColumnasCargos } from '../domain/configuracionColumnasCargos'
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import useVuelidate from "@vuelidate/core";

// Componentes
import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue';


import { defineComponent } from "vue";
import { Cargo } from "../domain/Cargo";
import { CargoController } from "../infraestructure/CargoController";
import { required } from "shared/i18n-validators";
import { removeAccents } from "shared/utils";
import { acciones } from 'config/utils';
import { useCargandoStore } from 'stores/cargando';

export default defineComponent({
    components: { ButtonSubmits },
    setup(props, { emit }) {
        const mixin = new ContenedorSimpleMixin(Cargo, new CargoController())
        const { entidad: cargo, disabled } = mixin.useReferencias()
        const { setValidador, guardar, cargarVista } = mixin.useComportamiento()
        const { onGuardado } = mixin.useHooks()

        // Seteamos falso en aprobado_rrhh ya que es un cargo nuevo creado por X coordinador
        cargo.aprobado_rrhh = false


        //Reglas de validacion
        const reglas = {
            nombre: { required }
        }

        const v$ = useVuelidate(reglas, cargo)
        setValidador(v$.value)

        onGuardado((id, response) => {
            emit('cerrar-modal', false)
            emit('guardado', { formulario: 'CrearCargoPage', id: id, modelo: response.modelo })
        })

        function cancelar() {
            emit('cerrar-modal', false)

        }


        return {
            removeAccents,
            mixin,
            acciones,
            disabled,
            cargo,
            v$,
            configuracionColumnas: configuracionColumnasCargos,
            storeCargando: useCargandoStore(),
            //funciones
            cancelar,
            guardar,

        }
    }
})