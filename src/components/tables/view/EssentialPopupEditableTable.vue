<template>
  <div
    v-if="!$q.screen.xs && datos.length && permitirEditarCeldas"
    class="text-right text-grey-7"
  >
    <q-chip class="bg-grey-2 text-info" color="info">
      <q-icon
        name="bi-info-circle-fill"
        color="info"
        size="xs"
        class="q-mr-sm"
      ></q-icon>
      <small>Haz clic sobre una celda para editarla</small>
    </q-chip>
  </div>
  <q-table
    ref="referencia"
    :grid="grid || $q.screen.xs"
    flat
    bordered
    title="Treats"
    :rows="datos"
    :columns="configuracionColumnas"
    :filter="filter"
    :visible-columns="visibleColumns"
    :separator="$q.screen.xs ? 'horizontal' : separador"
    :hide-bottom="!mostrarFooter"
    row-key="id"
    v-model:selected="selected"
    :style="estilos"
    class="bg-body-table my-sticky-column-table borde"
    :class="{
      'alto-fijo-desktop': !inFullscreen && altoFijo && !$q.screen.xs,
      'alto-fijo-mobile': !inFullscreen && altoFijo && $q.screen.xs,
      'my-sticky-dynamic2': !inFullscreen && altoFijo,
      'bg-body-table-dark-color': $q.screen.xs && $q.dark.isActive,
      'my-sticky-column-table-dark': $q.dark.isActive,
      'my-sticky-column-table-light': !$q.dark.isActive,
      'rounded-header': $q.screen.xs,
      'bg-header-table': mostrarFiltros,
    }"
    virtual-scroll
    :virtual-scroll-item-size="offset"
    :pagination="pagination"
    no-data-label="Aún no se han agregado elementos"
    wrap-cells
  >
    <!-- No data  -->
    <template v-slot:no-data="{ message }">
      <div class="full-width row flex-center text-primary q-gutter-sm">
        <q-icon size="2em" name="bi-exclamation-triangle-fill" />
        <span> {{ message }} </span>
      </div>
    </template>

    <!-- Pagination -->
    <template #pagination="scope">
      <botones-paginacion :scope="scope"> </botones-paginacion>
    </template>

    <!-- Header table -->
    <template v-if="mostrarHeader" v-slot:top="props">
      <div
        v-if="mostrarFiltros"
        class="text-bold text-center full-width rounded q-mb-md"
      >
        <q-chip class="bg-white text-positive">
          <q-icon name="bi-funnel" class="q-mr-sm"></q-icon>
          Modo filtro activado
        </q-chip>
      </div>

      <div
        v-if="titulo"
        class="row text-primary text-subtitle2 q-mb-lg items-center justify-center block"
        :class="{
          'titulo-tabla2': !$q.screen.xs,
          'justify-center': $q.screen.xs,
        }"
      >
        <q-icon
          v-if="!$q.screen.xs"
          name="bi-grip-vertical"
          color="info"
          class="q-mr-sm"
        ></q-icon>
        {{ titulo }}
      </div>

      <div v-if="permitirBuscar" class="row q-col-gutter-xs full-width q-mb-md">
        <div class="col-md-8 col-12">
          <q-input
            v-model="filter"
            outlined
            dense
            clearable
            class=""
            placeholder="Buscar..."
            debounce="300"
            color="primary"
          >
            <template v-slot:append>
              <q-icon name="search"></q-icon>
            </template>
          </q-input>
        </div>

        <div v-if="mostrarColumnasVisibles" class="col-md-4 col-12">
          <div class="row">
            <q-select
              v-model="visibleColumns"
              multiple
              outlined
              dense
              options-dense
              :display-value="$q.lang.table.columns"
              emit-value
              map-options
              :options="configuracionColumnas"
              option-value="name"
              options-cover
              class="col-9"
            />

            <q-btn
              flat
              round
              dense
              :icon="
                props.inFullscreen ? 'bi-fullscreen-exit' : 'bi-fullscreen'
              "
              @click="
                () => {
                  props.toggleFullscreen()
                  inFullscreen = !props.inFullscreen
                }
              "
              class="q-ml-md"
            >
              <q-tooltip class="bg-dark">{{
                props.inFullscreen
                  ? 'Salir de pantalla completa'
                  : 'Abrir en pantalla completa'
              }}</q-tooltip>
            </q-btn>
          </div>
        </div>
        <div class="col-12 col-md-12" v-if="false">
          <q-chip class="q-px-md" :class="{ 'bg-grey-8': $q.dark.isActive }">
            {{ 'Total de elementos: ' }}
            <b>{{ datos == undefined ? 0 : datos.length }}</b>
          </q-chip>
        </div>
      </div>

      <div
        v-if="permitirFiltrar || (true && mostrarCantidadElementos)"
        class="row full-width justify-between q-col-gutter-x-sm items-center q-mb-md"
      >
        <q-chip class="q-px-md" :class="{ 'bg-grey-8': $q.dark.isActive }">
          {{ 'Total de elementos: ' }} <b>{{ datos.length }}</b>
        </q-chip>

        <div class="row q-gutter-xs justify-end q-mb-md">
          <q-btn
            v-if="mostrarFiltros"
            color="indigo-4"
            no-caps
            push
            @click="agregarFiltro()"
          >
            <q-icon name="bi-plus" size="xs" class="q-mr-sm"></q-icon>
            Agregar filtro</q-btn
          >

          <q-btn
            v-if="mostrarFiltros"
            color="indigo"
            no-caps
            push
            @click="filtrar()"
          >
            <q-icon name="bi-funnel" class="q-mr-sm" size="xs"></q-icon>
            Aplicar filtros</q-btn
          >

          <q-btn
            v-if="mostrarExportar"
            color="positive"
            icon="archive"
            label="Exportar a csv"
            no-caps
            push
            @click="exportTable"
          />

          <q-btn
            v-if="permitirFiltrar"
            :color="mostrarFiltros ? 'negative' : 'primary'"
            no-caps
            push
            @click="toggleFiltros()"
          >
            <q-icon
              :name="mostrarFiltros ? 'bi-eye-slash' : 'bi-eye'"
              class="q-mr-sm"
              size="xs"
            ></q-icon>
            {{ tituloBotonFiltros }}</q-btn
          >
        </div>
      </div>

      <!-- Filtros -->
      <div class="row col-12">
        <table-filters
          ref="refTableFilters"
          v-if="permitirFiltrar && mostrarFiltros"
          :configuracionColumnas="configuracionColumnas"
          @filtrar="establecerFiltros"
        ></table-filters>
      </div>

      <!-- Botones Header -->
      <div class="row full-width q-gutter-xs">
        <!-- Boton 1 Header -->
        <q-btn
          v-if="extraerVisible(accion1Header, props)"
          :color="accion1Header?.color ?? 'primary'"
          :class="{ 'q-mb-sm': $q.screen.xs, 'full-width': $q.screen.xs }"
          push
          rounded
          no-caps
          glossy
          @click="accion1Header.accion"
        >
          <q-icon
            :name="extraerIcono(accion1Header) ?? ''"
            size="xs"
            class="q-pr-sm"
          ></q-icon>
          <span>{{ accion1Header.titulo }}</span>
          <q-tooltip class="bg-dark">{{ accion1Header.tooltip }}</q-tooltip>
        </q-btn>

        <!-- Boton 2 Header -->
        <q-btn
          v-if="extraerVisible(accion2Header, props)"
          :color="accion2Header?.color ?? 'primary'"
          :class="{ 'q-mb-sm': $q.screen.xs, 'full-width': $q.screen.xs }"
          push
          rounded
          glossy
          no-caps
          @click="accion2Header.accion"
        >
          <q-icon
            :name="extraerIcono(accion2Header) ?? ''"
            size="xs"
            class="q-pr-sm"
          ></q-icon>
          <span>{{ accion2Header.titulo }}</span>
        </q-btn>

        <!-- Boton 3 Header -->
        <q-btn
          v-if="extraerVisible(accion3Header, props)"
          :color="accion3Header?.color ?? 'primary'"
          :class="{ 'q-mb-sm': $q.screen.xs, 'full-width': $q.screen.xs }"
          push
          glossy
          rounded
          no-caps
          @click="accion3Header.accion"
        >
          <q-icon
            :name="extraerIcono(accion3Header) ?? ''"
            size="xs"
            class="q-pr-sm"
          ></q-icon>
          <span>{{ accion3Header.titulo }}</span>
        </q-btn>

        <!-- Boton 4 Header -->
        <q-btn
          v-if="extraerVisible(accion4Header, props)"
          :color="accion4Header?.color ?? 'primary'"
          :class="{ 'q-mb-sm': $q.screen.xs, 'full-width': $q.screen.xs }"
          push
          glossy
          rounded
          no-caps
          @click="accion4Header.accion"
        >
          <q-icon
            :name="extraerIcono(accion4Header) ?? ''"
            size="xs"
            class="q-pr-sm"
          ></q-icon>
          <span>{{ accion4Header.titulo }}</span>
        </q-btn>

        <!-- Boton 5 Header -->
        <q-btn
          v-if="extraerVisible(accion5Header, props)"
          :color="accion5Header?.color ?? 'primary'"
          :class="{ 'q-mb-sm': $q.screen.xs, 'full-width': $q.screen.xs }"
          push
          glossy
          rounded
          no-caps
          @click="accion5Header.accion"
        >
          <q-icon
            :name="extraerIcono(accion5Header) ?? ''"
            size="xs"
            class="q-pr-sm"
          ></q-icon>
          <span>{{ accion5Header.titulo }}</span>
        </q-btn>
      </div>
    </template>

    <!-- Botones de acciones Desktop -->
    <template #body-cell-acciones="props">
      <q-td v-if="!$q.screen.xs" :props="props">
        <div class="row inline full-width block q-col-gutter-x-xs text-left">
          <q-btn-group
            v-if="permitirConsultar || permitirEditar || permitirEliminar"
            rounded
            unelevated
            class="inline text-left"
          >
            <!-- Consultar -->
            <q-btn
              v-if="permitirConsultar"
              class="bg-primary q-px-md"
              dense
              glossy
              @click="
                consultar({ entidad: props.row, posicion: props.rowIndex })
              "
            >
              <q-icon name="bi-eye" size="xs" color="white"></q-icon>
              <q-tooltip class="bg-dark"> Consultar </q-tooltip>
            </q-btn>

            <!-- Editar -->
            <q-btn
              v-if="permitirEditar"
              class="bg-secondary q-px-md"
              glossy
              dense
              @click="editar({ entidad: props.row, posicion: props.rowIndex })"
            >
              <q-icon name="bi-pencil-square" size="xs" color="white"></q-icon>
              <q-tooltip class="bg-dark"> Editar </q-tooltip>
            </q-btn>

            <!-- Eliminar -->
            <q-btn
              v-if="permitirEliminar"
              class="bg-negative q-px-md"
              glossy
              dense
              @click="
                eliminar({ entidad: props.row, posicion: props.rowIndex })
              "
            >
              <q-icon name="bi-trash3" size="xs" color="white"></q-icon>
              <q-tooltip class="bg-dark"> Eliminar </q-tooltip>
            </q-btn>
          </q-btn-group>

          <CustomButtons
            v-if="accion1"
            :accion1="accion1"
            :accion2="accion2"
            :accion3="accion3"
            :accion4="accion4"
            :accion5="accion5"
            :accion6="accion6"
            :accion7="accion7"
            :accion8="accion8"
            :accion9="accion9"
            :accion10="accion10"
            :propsTable="props"
          ></CustomButtons>
        </div>
      </q-td>
    </template>

    <!-- Botones de acciones Mobile (Grid)  -->
    <template v-slot:item="props">
      <q-card
        v-if="$q.screen.xs"
        :class="props.selected ? 'bg-grey-2' : ''"
        class="q-py-xs q-my-none custom-shadows full-width border-bottom no-border srodunded-card"
        :style="props.selected ? 'transform: scale(0.95);' : ''"
      >
        <q-card-section v-if="tipoSeleccion !== 'none'">
          <q-checkbox dense v-model="props.selected" :label="props.row.name" />
        </q-card-section>

        <q-list dense>
          <q-item v-for="col in props.cols" :key="col.name">
            <!-- Clave -->
            <q-item-section>
              <q-item-label>{{ col.label }}</q-item-label>
            </q-item-section>

            <!-- Valor -->
            <q-item-section
              caption
              class="text-right text-grey-7 label-card-table"
            >
              <div
                v-if="col.name === 'acciones'"
                :props="props"
                class="q-gutter-sm"
              >
                <!-- Consultar -->
                <q-btn
                  v-if="permitirConsultar"
                  class="bg-btn-table"
                  round
                  glossy
                  dense
                  @click="
                    consultar({ entidad: props.row, posicion: props.rowIndex })
                  "
                >
                  <q-icon name="bi-eye" size="xs"></q-icon>
                  <q-tooltip class="bg-dark"> Consultar </q-tooltip>
                </q-btn>

                <!-- Editar -->
                <q-btn
                  v-if="permitirEditar"
                  class="bg-btn-table"
                  round
                  glossy
                  color="secondary"
                  dense
                  @click="
                    editar({ entidad: props.row, posicion: props.rowIndex })
                  "
                >
                  <q-icon
                    name="bi-pencil-square"
                    color="white"
                    size="xs"
                  ></q-icon>
                  <q-tooltip class="bg-dark"> Editar </q-tooltip>
                </q-btn>

                <!-- Eliminar -->
                <q-btn
                  v-if="permitirEliminar"
                  class="bg-btn-table"
                  round
                  color="negative"
                  glossy
                  dense
                  @click="
                    eliminar({ entidad: props.row, posicion: props.rowIndex })
                  "
                >
                  <q-icon name="bi-trash3" size="xs"></q-icon>
                  <q-tooltip class="bg-dark"> Eliminar </q-tooltip>
                </q-btn>

                <CustomButtons
                  :accion1="accion1"
                  :accion2="accion2"
                  :accion3="accion3"
                  :accion4="accion4"
                  :accion5="accion5"
                  :accion6="accion6"
                  :accion7="accion7"
                  :accion8="accion8"
                  :accion9="accion9"
                  :accion10="accion10"
                  :propsTable="props"
                ></CustomButtons>
              </div>

              <!-- <q-item-label v-else caption>{{ col.value }}</q-item-label> -->
              <q-item-label v-else>
                <span v-if="col.name === 'pagado'">
                  <q-icon
                    v-if="col.value"
                    name="bi-check"
                    color="positive"
                    size="md"
                  ></q-icon>
                  <q-icon
                    v-else
                    name="bi-x"
                    color="negative"
                    size="md"
                  ></q-icon>
                </span>

                <span v-if="col.name === 'activo'">
                  <q-icon
                    v-if="col.value"
                    name="bi-check-circle-fill"
                    color="positive"
                    size="xs"
                  ></q-icon>
                </span>

                <span v-if="col.name === 'es_ventana'">
                  <q-icon
                    v-if="col.value"
                    name="bi-check-circle-fill"
                    color="positive"
                    size="xs"
                  ></q-icon>
                </span>

                <span v-if="col.name === 'finalizado'">
                  <q-icon
                    v-if="col.value"
                    name="bi-check-circle-fill"
                    color="positive"
                    size="xs"
                  ></q-icon>
                  <q-icon
                    v-else
                    name="bi-check-circle"
                    color="grey-6"
                    size="xs"
                  ></q-icon>
                </span>

                <span v-if="col.name === 'es_responsable'">
                  <q-icon
                    v-if="col.value"
                    name="bi-check-circle-fill"
                    color="positive"
                    size="xs"
                  ></q-icon>
                </span>

                <span v-if="col.name === 'tamanio_bytes'">
                  {{ formatBytes(col.value) }}
                </span>

                <span v-if="col.name === 'tiene_subtareas'">
                  <q-icon
                    v-if="col.value"
                    name="bi-check-circle-fill"
                    color="positive"
                    size="sm"
                  ></q-icon>
                </span>

                <div :class="{ 'q-mb-xs': $q.screen.xs }">
                  <estados-subtareas
                    v-if="col.name === 'estado'"
                    :propsTable="col"
                  />

                  <q-chip
                    v-if="col.value === 'EN CAMINO'"
                    class="bg-blue-1 text-primary"
                  >
                    <q-icon
                      name="bi-car-front-fill"
                      color="primary"
                      class="q-mr-xs"
                    ></q-icon
                    >{{ 'En camino' }}
                  </q-chip>

                  <q-chip
                    v-if="col.value === 'RUTA COMPLETADA'"
                    class="bg-green-1 text-positive"
                  >
                    <q-icon
                      name="bi-check-circle-fill"
                      color="positive"
                      class="q-mr-xs"
                    ></q-icon
                    >{{ 'RUTA COMPLETADA' }}
                  </q-chip>
                </div>

                <span
                  v-if="
                    ![
                      'pagado',
                      'activo',
                      'es_ventana',
                      'finalizado',
                      'estado',
                      'es_responsable',
                      'tamanio_bytes',
                      'tiene_subtareas',
                    ].includes(col.name)
                  "
                  >{{ col.value }}</span
                >
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </template>

    <!-- Edicion de celdas -->
    <template v-slot:body-cell="props" v-if="permitirEditarCeldas">
      <q-td :key="props.col.name" :props="props">
        {{ props.row[props.col.name] }}
        <!-- :title="'Modificar ' + props.col.label" -->
        <q-popup-edit
          v-if="props.col.editable"
          v-model="props.row[props.col.name]"
          auto-save
          v-slot="scope"
          @hide="guardarCeldaEditada(props.row)"
          ><q-input
            v-if="props.col.type != 'toggle' || props.col.type != 'select'"
            v-model="scope.value"
            :type="props.col.type ? props.col.type : 'text'"
            :hint="props.col.hint"
            dense
            autofocus
            @keyup.enter="scope.set"
          />
          <q-toggle
            v-else
            keep-color
            v-model="scope.value"
            :label="scope.value ? 'SIi' : 'NOi'"
          /><template> </template>
        </q-popup-edit>
      </q-td>
    </template>
    <!-- Personalizacion de celdas -->
    <!-- Facturable -->
    <template v-slot:body-cell-facturable="props">
      <q-td :key="props.col.name" :props="props">
        <q-icon
          size="md"
          :name="props.row[props.col.name] ? 'bi-toggle2-on' : 'bi-toggle2-off'"
          :color="props.row[props.col.name] ? 'positive' : 'negative'"
        />
        <q-popup-edit
          v-if="props.col.editable && permitirEditarCeldas"
          v-model="props.row[props.col.name]"
          :title="'¿Es ' + props.col.name + '?'"
          auto-save
          v-slot="scope"
          @hide="guardarCeldaEditada(props.row)"
        >
          <q-toggle v-model="scope.value" :label="scope.value ? 'SI' : 'NO'" />
        </q-popup-edit>
      </q-td>
    </template>
    <!-- Grava IVA -->
    <template #body-cell-grava_iva="props">
      <q-td :key="props.col.name" :props="props">
        <q-icon
          size="md"
          :name="props.row[props.col.name] ? 'bi-toggle2-on' : 'bi-toggle2-off'"
          :color="props.row[props.col.name] ? 'positive' : 'negative'"
        />
        <q-popup-edit
          v-if="props.col.editable && permitirEditarCeldas"
          v-model="props.row[props.col.name]"
          :title="'¿Grava IVA? '"
          auto-save
          v-slot="scope"
          @hide="guardarCeldaEditada(props.row)"
        >
          <q-toggle v-model="scope.value" :label="scope.value ? 'SI' : 'NO'" />
        </q-popup-edit>
      </q-td>
    </template>
    <!--Select de unidad de medida-->
    <template #body-cell-unidad_medida="props">
      <q-td :key="props.col.name" :props="props">
        <q-select
          v-if="props.col.type==='select' && props.col.editable"
          v-model="props.row[props.col.name]"
          :options="props.col.options"
          :options-label="(v) => v.label"
          :options-value="(v) => v.value"
          options-dense
          outlined
          dense
          emit-value
          map-options
        />
        <span v-else>{{props.row[props.col.name]}}</span>
      </q-td>
    </template>
  </q-table>
</template>

<style lang="scss">
.my-sticky-dynamic {
  /* height or max-height is important */
  height: 410px;

  thead tr th {
    position: sticky;
    z-index: 1;
  }

  /* this will be the loading indicator */
  thead tr:last-child th {
    /* height of all previous header rows */
    top: 48px;
  }

  thead tr:first-child th {
    top: 0;
  }
}

.alto-fijo-desktop {
  height: calc(100vh - 100px);
}

.alto-fijo-mobile {
  height: 100vh;
}

.rounded {
  border-radius: 16px;
}

.custom-border {
  border-radius: 0 0 8px 8px;
}

// Columna estatica ---
.my-sticky-column-table {
  max-width: 100%;

  th:last-child,
  td:last-child {
    position: sticky;
    right: 0;
    z-index: 1;
    border-left: 1px solid $grey-4;
    border-bottom: 1px solid $grey-4;
  }
}

.my-sticky-column-table-dark {
  thead tr:first-child th:last-child {
    background-color: #1f1f1f;
  }

  td:last-child {
    background-color: #060606;
  }
}

.my-sticky-column-table-light {
  thead tr:first-child th:last-child {
    background-color: $grey-2;
  }

  td:last-child {
    background-color: #fff;
  }
}
</style>

<script src="./EssentialPopupEditableTable.ts"></script>
