<template>
  <EditarTablaModal
    :configuracionColumnas="configuracionColumnas"
    :fila="fila"
    @limpiar="limpiarFila"
    @guardar="guardarFila"
    :abierto="abierto"
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
    wrap-cells
    class="bg-white custom-border"
    :class="{
      'alto-fijo': !inFullscreen && altoFijo,
      'my-sticky-dynamic': !inFullscreen && altoFijo,
    }"
    virtual-scroll
    :virtual-scroll-item-size="offset"
    @virtual-scroll="onScroll"
    :pagination="pagination"
  >
    <!-- :pagination="{ rowsPerPage: 0 }"
    :rows-per-page-options="[0]" -->
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
        class="row bg-white text-bold q-mb-lg items-center justify-center block"
        :class="{
          'titulo-tabla2': !$q.screen.xs,
          'justify-center': $q.screen.xs,
        }"
      >
        <q-icon
          v-if="!$q.screen.xs"
          name="bi-list"
          color="grey-10"
          class="q-mr-sm"
        ></q-icon>
        {{ titulo }}
      </div>

      <div class="row full-width q-mb-md">
        <q-input
          v-model="filter"
          outlined
          dense
          clearable
          class="full-width bg-grey-2"
          placeholder="Buscar..."
          debounce="300"
          color="primary"
        >
          <template v-slot:append>
            <q-icon name="search"></q-icon>
          </template>
        </q-input>
      </div>

      <!-- Botones Header -->
      <div class="row full-width">
        <!-- Boton 1 Header -->
        <q-btn
          v-if="extraerVisible(accion1Header, props)"
          :color="accion1Header?.color ?? 'primary'"
          :class="{ 'q-mb-sm': $q.screen.xs, 'full-width': $q.screen.xs }"
          push
          rounded
          no-caps
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
      </div>

      <!--<div class="row q-col-gutter-sm"> -->
      <!-- <div
        v-if="mostrarBotones"
        class="row q-col-gutter-sm"
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
        />

        <q-btn flat round dense icon="bi-printer" @click="previsualizarPdf()">
          <q-tooltip class="bg-dark" :disable="$q.platform.is.mobile">{{
            'Imprimir PDF'
          }}</q-tooltip>
        </q-btn>

        <q-btn
          flat
          round
          dense
          :icon="props.inFullscreen ? 'bi-fullscreen-exit' : 'bi-fullscreen'"
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
      </div> -->
    </template>

    <!-- Botones de acciones Desktop -->
    <template #body-cell-acciones="props">
      <q-td v-if="!$q.screen.xs" :props="props">
        <div class="row q-gutter-x-sm justify-center">
          <!-- Consultar -->
          <q-btn
            v-if="permitirConsultar"
            color="indigo-1"
            round
            push
            dense
            @click="consultar({ entidad: props.row, posicion: props.rowIndex })"
          >
            <q-icon name="bi-eye" color="secondary" size="xs"></q-icon>
            <q-tooltip class="bg-dark"> Consultar </q-tooltip>
          </q-btn>

          <!-- Editar -->
          <q-btn
            v-if="permitirEditar"
            color="indigo-1"
            round
            push
            dense
            @click="editar({ entidad: props.row, posicion: props.rowIndex })"
          >
            <q-icon name="bi-pencil" color="secondary" size="xs"></q-icon>
            <q-tooltip class="bg-dark"> Editar </q-tooltip>
          </q-btn>

          <!-- Eliminar -->
          <q-btn
            v-if="permitirEliminar"
            color="indigo-1"
            round
            push
            dense
            @click="eliminar({ entidad: props.row, posicion: props.rowIndex })"
          >
            <q-icon name="bi-trash" color="secondary" size="xs"></q-icon>
            <q-tooltip class="bg-dark"> Eliminar </q-tooltip>
          </q-btn>

          <!-- custom botons -->
          <span>
            <CustomButtons
              :accion1="accion1"
              :accion2="accion2"
              :accion3="accion3"
              :accion4="accion4"
              :accion5="accion5"
              :accion6="accion6"
              :accion7="accion7"
              :propsTable="props"
            ></CustomButtons>
          </span>
        </div>
      </q-td>
    </template>

    <!-- Botones de acciones Mobile (Grid)  -->
    <template v-slot:item="props">
      <q-card
        v-if="$q.screen.xs"
        :class="props.selected ? 'bg-grey-2' : ''"
        class="q-py-xs custom-shadow q-mb-md full-width"
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
                  push
                  dense
                  @click="
                    consultar({ entidad: props.row, posicion: props.rowIndex })
                  "
                >
                  <q-icon name="bi-eye" color="secondary" size="xs"></q-icon>
                  <q-tooltip class="bg-dark"> Consultar </q-tooltip>
                </q-btn>

                <!-- Editar -->
                <q-btn
                  v-if="permitirEditar"
                  color="indigo-1"
                  round
                  push
                  dense
                  @click="
                    editar({ entidad: props.row, posicion: props.rowIndex })
                  "
                >
                  <q-icon name="bi-pencil" color="secondary" size="xs"></q-icon>
                  <q-tooltip class="bg-dark"> Editar </q-tooltip>
                </q-btn>

                <!-- Eliminar -->
                <q-btn
                  v-if="permitirEliminar"
                  color="indigo-1"
                  round
                  push
                  dense
                  @click="
                    eliminar({ entidad: props.row, posicion: props.rowIndex })
                  "
                >
                  <q-icon name="bi-trash" color="secondary" size="xs"></q-icon>
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
                <estados-subtareas
                  v-if="col.name === 'estado'"
                  :propsTable="col"
                />
                <span v-else>{{ col.value }}</span>
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

    <template #body-cell-activo="props">
      <q-td :props="props">
        <q-icon
          v-if="props.value"
          name="bi-check"
          color="positive"
          size="sm"
        ></q-icon>
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
