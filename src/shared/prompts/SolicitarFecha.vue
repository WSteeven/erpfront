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
          <!-- <img src="~assets/logo.png" /> -->
          <img :src="!$q.dark.isActive ? logoClaro! : logoOscuro!" />
        </q-avatar>

        <q-toolbar-title>Seleccionar fecha</q-toolbar-title>

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
            <label class="q-mb-sm block">{{ label }}</label>
            <q-input
              v-model="fecha"
              placeholder="Obligatorio"
              :readonly="true"
              outlined
              dense
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                    v-model="isMonth"
                  >
                    <q-date
                      v-model="fecha"
                      minimal
                      :mask="mask"
                      emit-immediately
                      default-view="Years"
                      @update:model-value="checkFecha"
                    >
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
import { useConfiguracionGeneralStore } from 'stores/configuracion_general'
import { maskFecha } from 'config/utils'

export default defineComponent({
  props: {
    mostrar: Boolean,
    confirmar: {
      type: Function,
      required: true,
    },
    label: {
      type: String,
      default: 'Seleccionar Fecha',
    },
    mask: {
      type: String,
      default: maskFecha,
    },
    reason:{
      type: String,
      default: "month"
    },
  },
  emits: ['cerrar'],
  setup(props, { emit }) {
    const { notificarAdvertencia } = useNotificaciones()
    const configuracionGeneralStore = useConfiguracionGeneralStore()
    const fecha = ref()
    const isMonth = ref(false)
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
    function checkFecha(val, reason, details) {
      isMonth.value = reason === props.reason ? false : true
    }

    return {
      abierto,
      fecha,
      isMonth,
      guardar,
      checkFecha,
      cerrarModalEntidad,
      logoClaro: computed(
        () => configuracionGeneralStore.configuracion?.logo_claro
      ),
      logoOscuro: computed(
        () => configuracionGeneralStore.configuracion?.logo_oscuro
      ),
    }
  },
})
</script>
