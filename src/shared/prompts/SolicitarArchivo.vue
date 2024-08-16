<template>
  <q-dialog v-model="abierto" top :persistent="false" class="border-white">
    <q-card
      flat
      class="bg-transparent rounded-card no-border col-12"
      :class="{ 'q-py-md q-px-xl': !$q.screen.xs }"
    >
      <!-- style="width: 1000px" -->
      <q-toolbar class="bg-solid rounded-headerd borde-header-tabla">
        <q-avatar square>
          <img src="~assets/logo.png" />
        </q-avatar>

        <q-toolbar-title>Seleccionar archivos</q-toolbar-title>

        <q-btn
          round
          dense
          unelevated
          color="negative"
          icon="bi-x"
          v-close-popup
          @click="cerrarModalEntidad()"
        />
      </q-toolbar>

      <q-card-section class="bg-desenfoque rounded-footer border-white">
        <div class="row q-mb-md">
          <div class="col-12 q-mb-md">
            <gestor-archivos
              ref="refArchivo"
              label="Deseo subir archivos"
              :mixin="mixin"
              :listarAlGuardar="false"
              permitir-eliminar
              :idModelo="idEntidad"
              quiero-subir-archivos
            >
            </gestor-archivos>
          </div>

          <div class="row col-12 q-gutter-xs justify-end">
            <q-btn color="primary" @click="guardar()" unelevated square no-caps>
              <q-icon name="bi-save" class="q-mr-sm" size="xs"></q-icon>
              Guardar
            </q-btn>

            <q-btn
              color="negative"
              @click="cerrarModalEntidad()"
              unelevated
              square
              no-caps
            >
              <q-icon name="close" class="q-mr-sm" size="xs"></q-icon>
              Cancelar
            </q-btn>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
// Dependencias
import { useNotificaciones } from 'shared/notificaciones'
import { ref, defineComponent, computed, onMounted } from 'vue'

// Componentes
import GestorArchivos from 'components/gestorArchivos/GestorArchivos.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export default defineComponent({
  components: {
    GestorArchivos
  },
  props: {
    mostrar: Boolean,
    mixin: {
      type: Object as () => ContenedorSimpleMixin<EntidadAuditable>,
      required: true
    },
    tipoArchivo: {
      type: String,
      required: false
    }
  },
  emits: ['cerrar'],
  setup(props, { emit }) {
    /*********
     * Mixin
     *********/
    const { entidad } = props.mixin.useReferencias()

    /*************
     * Variables
     ******/
    const { notificarAdvertencia } = useNotificaciones()
    const imagen = ref()
    const refArchivo = ref()
    const abierto = computed(() => props.mostrar)
    // const abrir = ref(props.mostrar)
    /* const abierto = computed({
      set: valor => (abrir.value = valor),
      get: () => abrir.value && props.mostrar,
    }) */
    // console.log('modal', abrir.value)
    const idEntidad = ref()

    function cerrarModalEntidad() {
      imagen.value = null
      emit('cerrar')
    }

    async function guardar() {
      await refArchivo.value.subir({ tipo: props.tipoArchivo })
      cerrarModalEntidad()
    }

    async function subirArchivos() {
      await refArchivo.value.subir()
    }

    /*******
     * Init
     *******/
    onMounted(() => {
      idEntidad.value = entidad.id
      setTimeout(
        () => refArchivo.value.listarArchivosAlmacenados(entidad.id, props.tipoArchivo),
        1
      )
    })

    return {
      refArchivo,
      abierto,
      guardar,
      imagen,
      cerrarModalEntidad,
      subirArchivos,
      idEntidad
    }
  }
})
</script>
