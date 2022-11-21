<template>
  <div
    v-if="titulo"
    class="row bg-white text-bold q-px-sm q-py-xs items-center"
    :class="{ 'titulo-tabla': !$q.screen.xs, 'justify-center': $q.screen.xs }"
  >
    <q-icon
      v-if="!$q.screen.xs"
      name="bi-circle-fill"
      color="grey-4"
      class="q-mr-sm"
    ></q-icon>
    {{ titulo }}
  </div>

  <EditarTablaModal
    :configuracionColumnas="configuracionColumnas"
    :fila="fila"
    @limpiar="limpiarFila"
    @guardar="guardarFila"
  ></EditarTablaModal>

  <q-table
    :hide-header="grid"
    :grid="grid || $q.screen.xs"
    :columns="configuracionColumnas"
    :rows="listado"
    :filter="filter"
    row-key="id"
    :visible-columns="visibleColumns"
    :separator="separador"
    :hide-bottom="!mostrarFooter"
    flat
    bordered
    :pagination="{ rowsPerPage: 0 }"
    :rows-per-page-options="[0]"
    :selection="tipoSeleccion"
    v-model:selected="selected"
    wrap-cells
    class="bg-white custom-border"
    :class="{
      'alto-fijo': !inFullscreen && altoFijo,
      'my-sticky-dynamic': !inFullscreen && altoFijo,
    }"
    virtual-scroll
    :virtual-scroll-item-size="offset"
    :virtual-scroll-sticky-size-start="offset"
    @virtual-scroll="onScroll"
  >
    <!-- Editar celdas -->
    <template v-if="permitirEditarCeldas" v-slot:body-cell="props">
      <q-td :key="props.col.name" :props="props" placeholder="fdfdfd">
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
      <!-- <div class="column full-width"> -->
      <div class="row justify-between items-center full-width q-mb-md">
        <q-btn
          v-if="agregarElemento"
          color="primary"
          :class="{ 'q-mb-sm': $q.screen.xs, 'full-width': $q.screen.xs }"
          push
          rounded
          no-caps
          @click="agregarElemento.accion"
        >
          <q-icon name="bi-plus" size="xs" class="q-pr-sm"></q-icon>
          <span>{{ agregarElemento.titulo }}</span>
        </q-btn>

        <div class="row q-col-gutter-sm">
          <q-input
            outlined
            dense
            rounded
            :class="{ 'full-width': $q.screen.xs }"
            debounce="300"
            color="primary"
            v-model="filter"
          >
            <template v-slot:append>
              <q-icon name="search"></q-icon>
            </template>
          </q-input>

          <div
            v-if="mostrarBotones"
            class="row q-gutter-sm justify-end"
            :class="{ 'no-wrap': !$q.screen.xs }"
          >
            <q-select
              v-model="visibleColumns"
              multiple
              outlined
              dense
              rounded
              options-dense
              :display-value="$q.lang.table.columns"
              emit-value
              map-options
              :options="configuracionColumnas"
              option-value="name"
              options-cover
              :class="{ 'full-width': $q.screen.xs }"
              style="min-width: 150px"
            />

            <!-- Exportar a Excel -->
            <q-btn
              flat
              round
              unelevated
              dense
              icon="bi-download"
              @click="exportTable"
            >
              <q-tooltip class="bg-dark" :disable="$q.platform.is.mobile">{{
                'Exportar a Excel'
              }}</q-tooltip>
            </q-btn>

            <!-- Importar desde Excel -->
            <q-btn flat round dense icon="bi-upload">
              <q-tooltip class="bg-dark" :disable="$q.platform.is.mobile">{{
                'Importar desde Excel'
              }}</q-tooltip>
            </q-btn>

            <!-- Imprimir -->
            <q-btn
              flat
              round
              dense
              icon="bi-printer"
              @click="previsualizarPdf()"
            >
              <q-tooltip class="bg-dark" :disable="$q.platform.is.mobile">{{
                'Imprimir PDF'
              }}</q-tooltip>
            </q-btn>

            <!-- Maximizar - Minimizar -->
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

            <!-- Grid - List -->
            <q-btn
              flat
              round
              dense
              :icon="grid ? 'bi-list' : 'bi-grid-3x3'"
              @click="grid = !grid"
            >
              <q-tooltip class="bg-dark" :disable="$q.platform.is.mobile">{{
                grid ? 'Formato de lista' : 'Formato de cuadrícula'
              }}</q-tooltip>
            </q-btn>
          </div>
        </div>
      </div>

      <!-- </div> -->
      <!-- Botones exportar
        <div v-if="mostrarBotones" class="row q-gutter-sm justify-end">
          <q-btn color="primary" push @click="previsualizarPdf()" no-caps>
            <q-icon name="bi-printer" class="q-pr-sm" size="xs"></q-icon>
            <div>Imprimir PDF</div>
          </q-btn>

          <q-btn color="primary" no-caps push @click="exportTable()">
            <q-icon name="bi-file-spreadsheet" class="q-pr-sm" size="xs"></q-icon>
            <div>Exportar Excel</div>
          </q-btn>

          <q-btn color="primary" push @click="exportTable()" no-caps>
            <q-icon name="bi-eye" class="q-pr-sm" size="xs"></q-icon>
            <div>Mostrar filtros</div>
          </q-btn>
        </div> -->
    </template>

    <!-- Botones de acciones Desktop -->
    <template #body-cell-acciones="props">
      <q-td v-if="!$q.screen.xs" :props="props" class="q-gutter-sm">
        <!-- Consultar -->
        <q-btn
          v-if="permitirConsultar"
          color="grey-3"
          round
          unelevated
          dense
          @click="consultar({ entidad: props.row, posicion: props.rowIndex })"
        >
          <q-icon name="bi-eye" color="primary" size="xs"></q-icon>
          <q-tooltip class="bg-dark"> Consultar </q-tooltip>
        </q-btn>

        <!-- Editar -->
        <q-btn
          v-if="permitirEditar"
          color="grey-3"
          round
          unelevated
          dense
          @click="editar({ entidad: props.row, posicion: props.rowIndex })"
        >
          <q-icon name="bi-pencil" color="primary" size="xs"></q-icon>
          <q-tooltip class="bg-dark"> Editar </q-tooltip>
        </q-btn>

        <!-- Eliminar -->
        <q-btn
          v-if="permitirEliminar"
          color="grey-3"
          round
          unelevated
          dense
          @click="eliminar({ entidad: props.row, posicion: props.rowIndex })"
        >
          <q-icon name="bi-trash" color="primary" size="xs"></q-icon>
          <q-tooltip class="bg-dark"> Eliminar </q-tooltip>
        </q-btn>

        <!-- custom botons -->
        <CustomButtons
          :accion1="accion1"
          :accion2="accion2"
          :accion3="accion3"
          :accion4="accion4"
          :accion5="accion5"
          :propsTable="props"
        ></CustomButtons>
      </q-td>
    </template>

    <!-- Botones de acciones Mobile (Grid)  -->
    <template v-slot:item="props">
      <q-card
        v-if="$q.screen.xs"
        :class="props.selected ? 'bg-grey-2' : ''"
        class="q-pa-sm q-mb-md full-width custom-shadow"
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
            <q-item-section caption class="text-right text-grey-7">
              <div
                v-if="col.name === 'acciones'"
                :props="props"
                class="q-gutter-sm"
              >
                <!-- Consultar -->
                <q-btn
                  v-if="permitirConsultar"
                  color="indigo-1"
                  round
                  unelevated
                  dense
                  @click="
                    consultar({ entidad: props.row, posicion: props.rowIndex })
                  "
                >
                  <q-icon name="bi-eye" color="primary" size="xs"></q-icon>
                  <q-tooltip class="bg-dark"> Consultar </q-tooltip>
                </q-btn>

                <!-- Editar -->
                <q-btn
                  v-if="permitirEditar"
                  color="indigo-1"
                  round
                  unelevated
                  dense
                  @click="
                    editar({ entidad: props.row, posicion: props.rowIndex })
                  "
                >
                  <q-icon name="bi-pencil" color="primary" size="xs"></q-icon>
                  <q-tooltip class="bg-dark"> Editar </q-tooltip>
                </q-btn>

                <!-- Eliminar -->
                <q-btn
                  v-if="permitirEliminar"
                  color="indigo-1"
                  round
                  unelevated
                  dense
                  @click="
                    eliminar({ entidad: props.row, posicion: props.rowIndex })
                  "
                >
                  <q-icon name="bi-trash" color="primary" size="xs"></q-icon>
                  <q-tooltip class="bg-dark"> Eliminar </q-tooltip>
                </q-btn>

                <CustomButtons
                  :accion1="accion1"
                  :accion2="accion2"
                  :accion3="accion3"
                  :accion4="accion4"
                  :accion5="accion5"
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
                <span v-else>{{ col.value }}</span>
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
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
          class="bg-green-1"
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
          class="bg-red-1"
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
          class="bg-yellow-1"
        >
          <q-icon
            name="bi-circle-fill"
            color="warning"
            class="q-mr-xs"
          ></q-icon>
          PENDIENTE
        </q-chip>
      </q-td>
    </template>

    <template #body-cell-estado="props">
      <q-td :props="props">
        <q-chip
          v-if="props.value === estadosTransacciones['completa']"
          class="bg-green-1"
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
          class="bg-red-1"
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
          class="bg-yellow-1"
        >
          <q-icon
            name="bi-circle-fill"
            color="warning"
            class="q-mr-xs"
          ></q-icon>
          PENDIENTE
        </q-chip>
        <q-chip v-if="props.value === 1" class="bg-green-1">
          <q-icon
            name="bi-circle-fill"
            color="positive"
            class="q-mr-xs"
          ></q-icon
          >ACTIVO
        </q-chip>
        <q-chip v-if="props.value === 0" class="bg-red-1">
          <q-icon
            name="bi-circle-fill"
            color="negative"
            class="q-mr-xs"
          ></q-icon
          >INACTIVO
        </q-chip>

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

        <!-- Estados subtareas -->
        <q-chip
          v-if="props.value === estadosSubtareas.CREADO"
          class="bg-yellow-1"
        >
          <q-icon name="bi-circle-fill" color="warning" class="q-mr-xs"></q-icon
          >{{ estadosSubtareas.CREADO }}
        </q-chip>
        <q-chip
          v-if="props.value === estadosSubtareas.ASIGNADO"
          class="bg-purple-1"
        >
          <q-icon
            name="bi-circle-fill"
            color="purple-5"
            class="q-mr-xs"
          ></q-icon
          >{{ estadosSubtareas.ASIGNADO }}
        </q-chip>
        <q-chip
          v-if="props.value === estadosSubtareas.EJECUTANDO"
          class="bg-blue-1"
        >
          <q-icon name="bi-circle-fill" color="blue" class="q-mr-xs"></q-icon
          >{{ estadosSubtareas.EJECUTANDO }}
        </q-chip>
        <q-chip
          v-if="props.value === estadosSubtareas.PAUSADO"
          class="bg-indigo-1"
        >
          <q-icon
            name="bi-circle-fill"
            color="indigo-5"
            class="q-mr-xs"
          ></q-icon
          >{{ estadosSubtareas.PAUSADO }}
        </q-chip>
        <q-chip
          v-if="props.value === estadosSubtareas.SUSPENDIDO"
          class="bg-yellow-1"
        >
          <q-icon name="bi-circle-fill" color="warning" class="q-mr-xs"></q-icon
          >{{ estadosSubtareas.SUSPENDIDO }}
        </q-chip>
        <q-chip
          v-if="props.value === estadosSubtareas.CANCELADO"
          class="bg-green-1"
        >
          <q-icon
            name="bi-circle-fill"
            color="positive"
            class="q-mr-xs"
          ></q-icon
          >{{ estadosSubtareas.CANCELADO }}
        </q-chip>
        <q-chip
          v-if="props.value === estadosSubtareas.REALIZADO"
          class="bg-green-1"
        >
          <q-icon
            name="bi-circle-fill"
            color="positive"
            class="q-mr-xs"
          ></q-icon
          >{{ estadosSubtareas.REALIZADO }}
        </q-chip>

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

    <!-- <template v-slot:body="props">
      <q-tr :props="props">
        <q-td key="cantidad_solicitada" :props="props">
          {{ props.row.cantidad_solicitada }}
          <q-popup-edit v-model="props.row.cantidad_solicitada" v-slot="scope">
            <q-input v-model="scope.value" dense autofocus counter />
          </q-popup-edit>
        </q-td>

        <q-td key="protein" :props="props">{{ props.row.protein }}</q-td>
      </q-tr>
    </template> -->
  </q-table>

  <previsualizar-tabla-pdf
    :configuracionColumnas="configuracionColumnas"
    :datos="datos"
    :print-table="printTable"
    :titulo="'Listado de ' + titulo"
  ></previsualizar-tabla-pdf>
</template>

<style lang="scss">
.q-table__top,
.q-table__bottom,
thead tr:first-child th {
  /* bg color is important for th; just specify one */
  background-color: #fff;
}

.my-sticky-dynamic {
  /* height or max-height is important */
  height: 410px;

  /*.q-table__top,
  .q-table__bottom,
  thead tr:first-child th {*/
  /* bg color is important for th; just specify one */
  //background-color: #fff;
  //}

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

.alto-fijo {
  height: calc(100vh - 240px);
}

.rounded {
  border-radius: 16px;
}

.custom-border {
  border-radius: 0 0 8px 8px;
}

.titulo-tabla {
  border-top: 1px solid $grey-4;
  border-right: 1px solid $grey-4;
  border-left: 1px solid $grey-4;
  border-radius: 4px 4px 0 0;
}
</style>

<script src="./EssentialTable.ts"></script>
