<template>
  <EditarTablaModal
    ref="refEditarModal"
    :configuracionColumnas="configuracionColumnas"
    :fila="fila"
    @limpiar="limpiarFila"
    @guardar="guardarFila"
    :modalMaximized="modalMaximized"
  ></EditarTablaModal>

  <q-table
    ref="referencia"
    :hide-header="grid"
    :grid="grid || $q.screen.xs"
    :columns="configuracionColumnas"
    :rows="listado"
    :filter="filter"
    row-key="id"
    :visible-columns="visibleColumns"
    :separator="$q.screen.xs ? 'horizontal' : separador"
    :hide-bottom="!mostrarFooter"
    flat
    bordered
    :selection="tipoSeleccion"
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
    }"
    virtual-scroll
    :virtual-scroll-item-size="offset"
    :pagination="pagination"
    no-data-label="Aún no se han agregado elementos"
  >
    <!-- wrap-cells -->
    <!--@virtual-scroll="onScroll" -->
    <template v-slot:no-data="{ message }">
      <div class="full-width row flex-center text-primary q-gutter-sm">
        <q-icon size="2em" name="bi-exclamation-triangle-fill" />
        <span> {{ message }} </span>
      </div>
    </template>

    <template #pagination="scope">
      <botones-paginacion :scope="scope"> </botones-paginacion>
    </template>

    <!-- Editar celdas -->
    <template v-if="permitirEditarCeldas" v-slot:body-cell="props">
      <q-td :key="props.col.name" :props="props">
        {{ props.row[props.col.name] }}
        <q-popup-edit
          v-model="props.row[props.col.name]"
          v-slot="scope"
          auto-save
        >
          <q-input
            v-model="scope.value"
            placeholder="Ingrese"
            dense
            autofocus
            @keyup.enter="scope.set"
          />
        </q-popup-edit>
      </q-td>
    </template>

    <!-- Header table -->
    <template v-if="mostrarHeader" v-slot:top="props">
      <div
        v-if="titulo"
        class="row text-bold text-primary q-mb-lg items-center justify-center block"
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

        <div class="col-md-4 col-12">
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
      </div>

      <div
        v-if="permitirFiltrar"
        class="row full-width justify-between q-col-gutter-x-sm items-center q-mb-md"
      >
        <q-chip class="q-px-md" :class="{ 'bg-grey-8': $q.dark.isActive }">
          {{ 'Total de elementos: ' }} <b>{{ datos.length }}</b>
        </q-chip>

        <div class="row q-gutter-xs justify-end q-mb-md">
          <q-btn
            v-if="mostrarFiltros"
            color="secondary"
            no-caps
            push
            @click="agregarFiltro()"
          >
            <q-icon name="bi-plus"></q-icon>
            Agregar filtro</q-btn
          >

          <!-- <q-btn
            v-if="mostrarFiltros"
            color="grey-8"
            no-caps
            push
            @click="resetearFiltros()"
          >
            <q-icon name="bi-eraser" class="q-mr-sm" size="xs"></q-icon>
            Resetear filtros</q-btn
          > -->

          <q-btn
            v-if="mostrarFiltros"
            color="positive"
            no-caps
            push
            @click="filtrar()"
          >
            <q-icon name="bi-funnel" class="q-mr-sm" size="xs"></q-icon>
            Filtrar</q-btn
          >
          <!--<q-btn-dropdown
            v-if="mostrarFiltros"
            split
            color="primary"
            push
            no-caps
            @click="consultarCien"
          >
            <template v-slot:label>
              <div class="row items-center no-wrap">
                <q-icon left name="bi-search" size="xs" />
                <div class="text-center">Consultar</div>
              </div>
            </template>

            <q-list>
              <q-item clickable v-close-popup @click="consultarTodos">
                <q-item-section avatar>
                  <q-icon name="bi-search" size="xs" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Consultar todos</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown> -->

          <q-btn
            color="primary"
            no-caps
            push
            @click="mostrarFiltros = !mostrarFiltros"
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

    <template #body-cell-tamanio_bytes="props">
      <q-td :props="props">
        {{ formatBytes(props.value) }}
      </q-td>
    </template>

    <template #body-cell-cantidad_subtareas="props">
      <q-td>
        <q-chip v-if="props.value" dense class="q-px-md bg-accent-5">
          {{ props.value }}
        </q-chip>
      </q-td>
    </template>

    <template #body-cell-cantidad_adjuntos="props">
      <q-td>
        <q-chip v-if="props.value" dense class="q-px-md bg-light-green-2">
          <b class="text-green-8">{{ props.value }}</b>
        </q-chip>
      </q-td>
    </template>

    <template #body-cell-tipo_trabajo="props">
      <q-td :props="props">
        <span :class="{ 'text-negative text-bold': resaltar(props.value) }">
          {{ props.value }}
        </span>
      </q-td>
    </template>

    <!-- Resumen tendido -->
    <template #body-cell-instalo_manga="props">
      <q-td :props="props">
        <q-icon
          v-if="props.value"
          name="bi-check-circle-fill"
          color="positive"
          size="xs"
        ></q-icon>
      </q-td>
    </template>

    <template #body-cell-firmada="props">
      <q-td :props="props">
        <q-icon
          v-if="props.value"
          name="bi-check-circle-fill"
          color="positive"
          size="xs"
        ></q-icon>
        <q-icon
          v-if="!props.value"
          name="bi-x-circle-fill"
          color="negative"
          size="xs"
        ></q-icon>
      </q-td>
    </template>

    <template #body-cell-es_ventana="props">
      <q-td :props="props">
        <q-icon
          v-if="props.value"
          name="bi-check-circle-fill"
          color="positive"
          size="xs"
        ></q-icon>
      </q-td>
    </template>

    <template #body-cell-finalizado="props">
      <q-td :props="props">
        <q-icon
          v-if="props.value"
          name="bi-check-circle-fill"
          color="positive"
          size="xs"
        ></q-icon>
        <q-icon v-else name="bi-check-circle" color="grey-6" size="xs"></q-icon>
      </q-td>
    </template>

    <template #body-cell-es_responsable="props">
      <q-td :props="props">
        <q-icon
          v-if="props.value"
          name="bi-check-circle-fill"
          color="positive"
          size="xs"
        ></q-icon>
      </q-td>
    </template>

    <template #body-cell-pagado="props">
      <q-td :props="props" class="">
        <q-icon
          v-if="props.value"
          name="bi-check"
          color="positive"
          size="md"
        ></q-icon>
        <q-icon v-else name="bi-x" color="negative" size="md"></q-icon>
      </q-td>
    </template>

    <template #body-cell-disponible="props">
      <q-td :props="props" class="">
        <q-chip v-if="props.value" class="bg-green-1">
          <q-icon
            name="bi-circle-fill"
            color="positive"
            class="q-mr-xs"
          ></q-icon
          >Disponible
        </q-chip>
        <q-chip v-else class="bg-pink-1">
          <q-icon
            name="bi-circle-fill"
            color="negative"
            class="q-mr-xs"
          ></q-icon
          >Ocupado
        </q-chip>
      </q-td>
    </template>

    <template #body-cell-accion="props">
      <q-td :props="props" class="">
        <q-chip
          v-if="props.value === accionesActivos['asignado']"
          class="bg-green-1"
        >
          <q-icon
            name="bi-circle-fill"
            color="positive"
            class="q-mr-xs"
          ></q-icon
          >Asignado
        </q-chip>
        <q-chip v-else class="bg-pink-1" color="red">
          <q-icon
            name="bi-circle-fill"
            color="negative"
            class="q-mr-xs"
          ></q-icon>
          Devuelto
        </q-chip>
      </q-td>
    </template>

    <template #body-cell-autorizacion="props">
      <q-td :props="props">
        <q-chip
          v-if="props.value === autorizacionesTransacciones['aprobado']"
          :class="{ 'bg-green-1': !$q.dark.isActive }"
        >
          <q-icon
            name="bi-circle-fill"
            color="positive"
            class="q-mr-xs"
          ></q-icon>
          APROBADO
        </q-chip>
        <q-chip
          v-if="props.value === autorizacionesTransacciones['cancelado']"
          :class="{ 'bg-red-1': !$q.dark.isActive }"
        >
          <q-icon
            name="bi-circle-fill"
            color="negative"
            class="q-mr-xs"
          ></q-icon>
          CANCELADO
        </q-chip>
        <q-chip
          v-if="props.value === autorizacionesTransacciones['pendiente']"
          :class="{ 'bg-yellow-1': !$q.dark.isActive }"
        >
          <q-icon
            name="bi-circle-fill"
            color="warning"
            class="q-mr-xs"
          ></q-icon>
          PENDIENTE
        </q-chip>

        <q-chip v-if="props.value === 'SI'" class="bg-yellow-1">
          <q-icon
            name="bi-circle-fill"
            color="primary"
            class="q-mr-xs"
          ></q-icon>
          SI
        </q-chip>
        <q-chip v-if="props.value === 'NO'" class="bg-yellow-1">
          <q-icon
            name="bi-circle-fill"
            color="negative"
            class="q-mr-xs"
          ></q-icon>
          NO
        </q-chip>
      </q-td>
    </template>
    <!-- corregir esto para que sea dinamico -->
    <template #body-cell-condiciones="props">
      <q-td :props="props">
        <q-chip
          v-if="
            props.value == estadosCondicionesId.nuevo ||
            props.value == estadosCondicionesValue.nuevo
          "
        >
          NUEVO
        </q-chip>
        <q-chip
          v-if="
            props.value == estadosCondicionesId.usado ||
            props.value == estadosCondicionesValue.usado
          "
        >
          USADO
        </q-chip>
        <q-chip
          v-if="
            props.value == estadosCondicionesId.mal_estado ||
            props.value == estadosCondicionesValue.mal_estado
          "
          >MAL ESTADO</q-chip
        >
        <q-chip
          v-if="
            props.value == estadosCondicionesId.danado ||
            props.value == estadosCondicionesValue.danado
          "
          >DAÑADO</q-chip
        >
      </q-td>
    </template>

    <template #body-cell-leida="props">
      <q-td :props="props">
        <span v-if="props.value == false || props.value == 0">
          <q-icon class="bi-check-circle-fill" color="grey-4" size="sm">
          </q-icon>
        </span>
        <span v-else>
          <q-icon class="bi-check-circle-fill" color="positive" size="sm">
          </q-icon>
        </span>
      </q-td>
    </template>

    <template #body-cell-estado="props">
      <q-td :props="props">
        <q-chip
          v-if="props.value === 'COMPLETADO'"
          :class="{ 'bg-green-1': !$q.dark.isActive }"
        >
          <q-icon
            name="bi-circle-fill"
            color="positive"
            class="q-mr-xs"
          ></q-icon>
          COMPLETA
        </q-chip>
        <q-chip
          v-if="props.value === estadosTransacciones['completa']"
          :class="{ 'bg-green-1': !$q.dark.isActive }"
        >
          <q-icon
            name="bi-circle-fill"
            color="positive"
            class="q-mr-xs"
          ></q-icon>
          COMPLETA
        </q-chip>
        <q-chip
          v-if="props.value === estadosTransacciones['parcial']"
          :class="{ 'bg-red-1': !$q.dark.isActive }"
        >
          <q-icon
            name="bi-circle-fill"
            color="negative"
            class="q-mr-xs"
          ></q-icon>
          PARCIAL
        </q-chip>
        <q-chip
          v-if="props.value === estadosTransacciones['pendiente']"
          :class="{ 'bg-yellow-1': !$q.dark.isActive }"
        >
          <q-icon
            name="bi-circle-fill"
            color="warning"
            class="q-mr-xs"
          ></q-icon>
          PENDIENTE
        </q-chip>
        <q-chip
          v-if="props.value === estadosTransacciones.no_realizada"
          :class="{ 'bg-red-1': !$q.dark.isActive }"
        >
          <!-- One of primary, secondary, accent, dark, positive, negative, info, warning -->
          <q-icon
            name="bi-circle-fill"
            color="negative"
            class="q-mr-xs"
          ></q-icon>
          NO REALIZADA
        </q-chip>
        <q-icon
          v-if="props.value === 1 || props.value === true"
          name="bi-check-circle-fill"
          color="positive"
          size="sm"
        ></q-icon>
        <q-icon
          v-if="props.value === 0 || props.value === false"
          name="bi-x-circle-fill"
          color="negative"
          size="sm"
        ></q-icon>

        <!-- Estados de la tabla inventarios -->
        <q-chip
          v-if="props.value === estadosInventarios.sin_stock"
          class="bg-red-1"
        >
          <q-icon
            name="bi-circle-fill"
            color="negative"
            class="q-mr-xs"
          ></q-icon
          >SIN STOCK
        </q-chip>
        <q-chip
          v-if="props.value === estadosInventarios.transito"
          class="bg-yellow-1"
        >
          <q-icon name="bi-circle-fill" color="warning" class="q-mr-xs"></q-icon
          >TRANSITO
        </q-chip>
        <q-chip
          v-if="props.value === estadosInventarios.inventario"
          class="bg-green-1"
        >
          <q-icon
            name="bi-circle-fill"
            color="positive"
            class="q-mr-xs"
          ></q-icon
          >INVENTARIO
        </q-chip>
        <!-- Estados de la tabla control de stock -->
        <q-chip
          v-if="props.value === estadosControlStock.minimo"
          class="bg-red-1"
        >
          <q-icon
            name="bi-circle-fill"
            color="negative"
            class="q-mr-xs"
          ></q-icon
          >{{ estadosControlStock.minimo }}
        </q-chip>

        <q-chip
          v-if="props.value === estadosControlStock.reorden"
          class="bg-yellow-1"
        >
          <q-icon name="bi-circle-fill" color="warning" class="q-mr-xs"></q-icon
          >{{ estadosControlStock.reorden }}
        </q-chip>

        <q-chip
          v-if="props.value === estadosControlStock.suficiente"
          class="bg-green-1"
        >
          <q-icon
            name="bi-circle-fill"
            color="positive"
            class="q-mr-xs"
          ></q-icon
          >{{ estadosControlStock.suficiente }}
        </q-chip>

        <q-chip
          v-if="props.value === 'EN CAMINO'"
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
          v-if="props.value === 'RUTA COMPLETADA'"
          class="bg-green-1 text-positive"
        >
          <q-icon
            name="bi-check-circle-fill"
            color="positive"
            class="q-mr-xs"
          ></q-icon
          >{{ 'RUTA COMPLETADA' }}
        </q-chip>

        <estados-subtareas :propsTable="props" />

        <!-- estados de la tabla prestamos temporales -->
        <q-chip v-if="props.value === 'DEVUELTO'" class="bg-green-1">
          <q-icon
            name="bi-circle-fill"
            color="positive"
            class="q-mr-xs"
          ></q-icon
          >DEVUELTO
        </q-chip>
      </q-td>
    </template>

    <template #body-cell-requiere_bodega="props">
      <q-td :props="props">
        <q-icon
          v-if="props.value"
          name="bi-check-circle-fill"
          color="positive"
          size="sm"
        ></q-icon>
        <q-icon
          v-if="!props.value"
          name="bi-x-circle-fill"
          color="negative"
          size="sm"
        ></q-icon>
      </q-td>
    </template>
    <template #body-cell-activo="props">
      <q-td :props="props">
        <q-icon
          v-if="props.value"
          name="bi-check-circle-fill"
          color="positive"
          size="sm"
        ></q-icon>
        <q-icon
          v-if="!props.value"
          name="bi-x-circle-fill"
          color="negative"
          size="sm"
        ></q-icon>
      </q-td>
    </template>

    <!-- tiene firma -->
    <template #body-cell-firma_url="props">
      <q-td :props="props">
        <q-icon
          v-if="props.value"
          name="bi-check-circle-fill"
          color="positive"
          size="sm"
        ></q-icon>
        <q-icon
          v-if="!props.value"
          name="bi-x-circle-fill"
          color="negative"
          size="sm"
        ></q-icon>
      </q-td>
    </template>

    <!-- Tiene subtareas -->
    <template #body-cell-tiene_subtareas="props">
      <q-td :props="props">
        <q-icon
          v-if="props.value"
          name="bi-check-circle-fill"
          color="positive"
          size="sm"
        ></q-icon>
      </q-td>
    </template>
  </q-table>

  <div
    v-if="!$q.screen.xs && permitirEditarCeldas && listado.length"
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

  <previsualizar-tabla-pdf
    :configuracionColumnas="configuracionColumnas"
    :datos="datos"
    :print-table="printTable"
    :titulo="'Listado de ' + titulo"
  ></previsualizar-tabla-pdf>
</template>

<style lang="scss">
/* .filtros {
  position: relative;
  left: -16px;
  top: -16px;
  right: 16px;
  padding: 0;
  margin: 0;
  display: block;
  width: 100%;
} */

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

<script src="./EssentialTable.ts"></script>
