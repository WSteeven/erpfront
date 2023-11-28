<template>
  <q-dialog v-model="abierto" persistent top>
    <q-card
      flat
      class="bg-transparent rounded-card no-border"
      :class="{ 'q-py-md q-px-xl': !$q.screen.xs }"
      style="width: 500px"
    >
      <q-toolbar class="bg-body rounded-header">
        <q-avatar square>
          <img src="~assets/logo.png" />
        </q-avatar>

        <q-toolbar-title>Seleccionar imagen</q-toolbar-title>

        <q-btn
          round
          glossy
          push
          dense
          color="negative"
          icon="bi-x"
          v-close-popup
          @click="cerrarModalEntidad()"
        />
      </q-toolbar>

      <q-card-section class="bg-body rounded-footer">
        <div class="row q-mb-md">
          <div class="col-12 q-mb-md">
            <label class="q-mb-sm block">Captura del informe enviado</label>
            <selector-imagen
              :imagen="imagen"
              file_extensiones=".jpg, image/*"
              @update:modelValue="(data) => (imagen = data)"
              hint="Obligatorio"
            >
            </selector-imagen>
          </div>

          <div class="col-12">
            <q-btn
              color="primary"
              class="full-width"
              push
              @click="guardar()"
              no-caps
            >
              Continuar y finalizar
              <q-icon
                name="bi-arrow-right-circle-fill"
                class="q-ml-sm"
                size="xs"
              ></q-icon>
            </q-btn>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { ref, defineComponent, computed } from 'vue'
import SelectorImagen from 'components/SelectorImagen.vue'
import { useNotificaciones } from 'shared/notificaciones'

export default defineComponent({
  components: {
    SelectorImagen,
  },
  props: {
    mostrar: Boolean,
    confirmar: {
      type: Function,
      required: true,
    },
  },
  emits: ['cerrar'],
  setup(props, { emit }) {
    const { notificarAdvertencia } = useNotificaciones()
    const imagen = ref()
    const abierto = computed(() => props.mostrar)

    function cerrarModalEntidad() {
      imagen.value = null
      emit('cerrar')
    }

    function guardar() {
      if (!imagen.value)
        return notificarAdvertencia('Debe seleccionar una imagen')
      props.confirmar(imagen.value)
      cerrarModalEntidad()
    }

    return {
      abierto,
      guardar,
      imagen,
      cerrarModalEntidad,
    }
  },
})
</script>
