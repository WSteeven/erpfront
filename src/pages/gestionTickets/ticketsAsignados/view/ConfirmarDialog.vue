<template>
  <q-dialog v-model="mostrar" maximized persistent>
    <q-card>
      <q-toolbar>
        <q-avatar square>
          <img src="~assets/logo.png" />
        </q-avatar>

        <q-toolbar-title>{{ 'Seleccione su plantilla' }}</q-toolbar-title>

        <q-btn
          flat
          round
          class="bg-grey-3"
          dense
          icon="close"
          @click="cerrar()"
        >
          <q-tooltip class="bg-dark">Cerrar</q-tooltip>
        </q-btn>
      </q-toolbar>

      <q-card-section class="q-mt-md">
        <div class="row q-col-gutter-sm">
          <div class="col-12 col-md-4 q-mb-md">
            <q-card
              @click="seleccionar('ControlProgresivas')"
              class="cursor-pointer"
            >
              <q-card-section class="text-center column q-gutter-md">
                <q-icon
                  name="bi-journal-text"
                  class="block q-mx-auto"
                  size="sm"
                ></q-icon>
                <div class="block q-mx-auto">Montajes / Tendidos</div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-md-4 q-mb-md">
            <q-card
              @click="seleccionar('ControlDesmontajes')"
              class="cursor-pointer"
            >
              <q-card-section class="text-center column q-gutter-md">
                <q-icon
                  name="bi-journal-text"
                  class="block q-mx-auto"
                  size="sm"
                ></q-icon>
                <div class="block q-mx-auto">Desmontajes</div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-md-4 q-mb-md">
            <q-card @click="seleccionar('hincado')" class="cursor-pointer">
              <q-card-section class="text-center column q-gutter-md">
                <q-icon
                  name="bi-journal-text"
                  class="block q-mx-auto"
                  size="sm"
                ></q-icon>
                <div class="block q-mx-auto">Hincados</div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-md-4 q-mb-md">
            <q-card @click="seleccionar('recorrido')" class="cursor-pointer">
              <q-card-section class="text-center column q-gutter-md">
                <q-icon
                  name="bi-journal-text"
                  class="block q-mx-auto"
                  size="sm"
                ></q-icon>
                <div class="block q-mx-auto">Recorridos</div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-md-4 q-mb-md">
            <q-card @click="seleccionar('otro')" class="cursor-pointer">
              <q-card-section class="text-center column q-gutter-md">
                <q-icon
                  name="bi-journal-text"
                  class="block q-mx-auto"
                  size="sm"
                ></q-icon>
                <div class="block q-mx-auto">Otros</div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { ComportamientoModales } from 'components/modales/application/ComportamientoModales'
import { computed } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  comportamiento: {
    type: Object as () => ComportamientoModales<any>,
    required: true,
  },
})

const emit = defineEmits(['seleccionar', 'cerrar'])

const mostrar = computed(() => props.visible)

const listadoModales = props.comportamiento.getModales()

function seleccionar(plantilla: keyof typeof listadoModales) {
  emit('seleccionar', plantilla)
}

function cerrar() {
  emit('cerrar')
}
</script>
