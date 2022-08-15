<template>
  <q-page padding>
    <div class="text-h6 q-my-md q-ml-md">Gestión de tareas</div>

    <!-- Tabs -->
    <q-tabs v-model="tab" align="left" narrow-indicator class="q-mb-lg">
      <q-tab name="formulario" label="Formulario" no-caps />
      <q-tab name="listado" label="Listado" no-caps />
    </q-tabs>

    <!-- Tab content -->
    <q-tab-panels
      v-model="tab"
      animated
      transition-prev="scale"
      transition-next="scale"
    >
      <!-- Formulario -->
      <q-tab-panel name="formulario" class="q-py-none">
        <slot name="formulario" />
        <div
          v-if="mostrarButtonSubmits"
          class="row justify-end q-gutter-sm q-pt-md"
        >
          <q-btn color="primary" no-caps>
            <q-icon name="bi-save" class="q-pr-sm" size="xs"></q-icon>
            <div>Guardar</div> </q-btn
          ><q-btn color="negative" no-caps>
            <q-icon name="bi-x" class="q-pr-sm" size="xs"></q-icon>
            <div>Cancelar</div>
          </q-btn>
        </div>
      </q-tab-panel>

      <!-- Listado -->
      <q-tab-panel name="listado" class="q-py-none">
        <essential-table
          :titulo="tituloTabla"
          :configuracionColumnas="columnas"
          :datos="datos"
          @consultar="consultar"
          @editar="editar()"
          @eliminar="eliminar()"
        ></essential-table>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script lang="ts">
// Dependencias
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import { useTareaStore } from 'src/stores/tarea'
import { ColumnConfig } from 'src/components/tables/domain/ColumnConfig'
import { Hidratable } from 'src/pages/shared/entidad/domain/Hidratable'

export default defineComponent({
  props: {
    mostrarButtonSubmits: {
      type: Boolean,
      default: true,
    },
    configuracionColumnas: {
      type: Object as () => ColumnConfig<Hidratable>[],
      required: true,
    },
    datos: {
      type: Array,
      required: true,
    },
  },
  components: { EssentialTable },
  setup(props) {
    const Router = useRouter()
    const tareaStore = useTareaStore()

    const columnas = [
      ...props.configuracionColumnas,
      {
        name: 'acciones',
        field: 'acciones',
        label: 'Acciones',
        align: 'center',
      },
    ]

    function consultar(entidad: object) {
      tareaStore.tarea.hydrate(entidad)
      tab.value = 'formulario'
    }

    function editar() {
      console.log('Editar')
    }
    function eliminar() {
      console.log('Eliminar')
    }

    const seleccionado = ref()
    const tab = ref('listado')

    return {
      tab,
      tituloTabla: Router.currentRoute.value.name?.toString().toLowerCase(),
      seleccionado,
      columnas,
      // acciones tabla
      consultar,
      editar,
      eliminar,
    }
  },
})
</script>
