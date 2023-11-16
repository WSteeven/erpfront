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

        <q-toolbar-title>Seleccionar Fecha</q-toolbar-title>

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
            <label class="q-mb-sm block">{{ label ? label : 'Fecha' }}</label>
            <q-input v-model="fecha" placeholder="Obligatorio" outlined dense>
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date v-model="fecha" :mask="maskFecha" today-btn>
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Cerrar"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>

          <div class="col-12">
            <q-btn
              color="primary"
              class="full-width"
              push
              @click="guardar()"
              no-caps
            >
              Continuar
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
import { useNotificaciones } from 'shared/notificaciones'
import { maskFecha } from 'config/utils'

export default defineComponent({
  components: {},
  props: {
    mostrar: Boolean,
    confirmar: {
      type: Function,
      required: true,
    },
    label: { type: String, required: false },
  },
  emits: ['cerrar'],
  setup(props, { emit }) {
    const { notificarAdvertencia } = useNotificaciones()
    const fecha = ref()
    const abierto = computed(() => props.mostrar)

    function cerrarModalEntidad() {
      fecha.value = null
      emit('cerrar')
    }

    function guardar() {
      if (!fecha.value)
        return notificarAdvertencia('Debe seleccionar una fecha')
      props.confirmar(fecha.value)
      cerrarModalEntidad()
    }

    return {
      abierto,
      guardar,
      fecha,
      cerrarModalEntidad,
      maskFecha,
    }
  },
})
</script>
