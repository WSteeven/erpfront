<template>
  <!-- Accion 1-->
  <!--<span
    :class="{
      'row full-width justify-left q-gutter-sm': !$q.screen.xs,
      'column justify-end q-gutter-y-sm': $q.screen.xs,
    }"
  > -->
  <span class="block text-center">
    <q-btn-group
      v-if="totalAcciones <= desplegarDesde"
      dense
      unelevated
      :rounded="$q.screen.sm || $q.screen.md || $q.screen.lg || $q.screen.xl"
      :square="$q.screen.xs"
      :class="{ 'column q-gutter-y-xs': $q.screen.xs }"
    >
      <q-btn
        v-if="extraerVisible(accion1)"
        :color="extraerColor(accion1) || 'primary'"
        dense
        rounded
        no-caps
        no-wrap
        class="q-px-sm"
        @click="ejecutarAccion(accion1)"
      >
        <q-icon
          v-if="accion1?.icono"
          :name="extraerIcono(accion1) ?? ''"
          size="xs"
          class="q-mr-xs"
        ></q-icon>
        <span>{{ extraerTitulo(accion1) }}</span>
        <q-tooltip v-if="accion1?.tooltip" class="bg-dark">{{
          accion1.tooltip
        }}</q-tooltip>
      </q-btn>

      <!-- Accion 2 -->
      <q-btn
        v-if="extraerVisible(accion2)"
        :color="extraerColor(accion2) || 'primary'"
        dense
        rounded
        no-caps
        no-wrap
        unelevated
        class="q-px-sm"
        @click="ejecutarAccion(accion2)"
      >
        <q-icon
          v-if="accion2?.icono"
          :name="extraerIcono(accion2) ?? ''"
          size="xs"
          class="q-mr-xs"
        ></q-icon>
        <span>{{ extraerTitulo(accion2) }}</span>
        <q-tooltip v-if="accion2?.tooltip" class="bg-dark">{{
          accion2.tooltip
        }}</q-tooltip>
      </q-btn>

      <!-- Accion 3 -->
      <q-btn
        v-if="extraerVisible(accion3)"
        :color="extraerColor(accion3) || 'primary'"
        dense
        rounded
        no-caps
        no-wrap
        unelevated
        class="q-px-sm"
        @click="ejecutarAccion(accion3)"
      >
        <q-icon
          v-if="accion3?.icono"
          :name="extraerIcono(accion3) ?? ''"
          size="xs"
          class="q-mr-xs"
        ></q-icon>
        <span>{{ extraerTitulo(accion3) }}</span>
        <q-tooltip v-if="accion3?.tooltip" class="bg-dark">{{
          accion3.tooltip
        }}</q-tooltip>
      </q-btn>

      <!-- Accion 4 -->
      <q-btn
        v-if="extraerVisible(accion4)"
        :color="extraerColor(accion4) || 'primary'"
        dense
        rounded
        no-caps
        no-wrap
        unelevated
        class="q-px-sm"
        @click="ejecutarAccion(accion4)"
      >
        <q-icon
          v-if="accion4?.icono"
          :name="extraerIcono(accion4) ?? ''"
          size="xs"
          class="q-mr-xs"
        ></q-icon>
        <span>{{ extraerTitulo(accion4) }}</span>
        <q-tooltip v-if="accion4?.tooltip" class="bg-dark">{{
          accion4.tooltip
        }}</q-tooltip>
      </q-btn>

      <!-- Accion 5 -->
      <q-btn
        v-if="extraerVisible(accion5)"
        :color="extraerColor(accion5) || 'primary'"
        dense
        rounded
        no-caps
        no-wrap
        unelevated
        class="q-px-sm"
        @click="ejecutarAccion(accion5)"
      >
        <q-icon
          v-if="accion5?.icono"
          :name="extraerIcono(accion5) ?? ''"
          size="xs"
          class="q-mr-xs"
        ></q-icon>
        <span>{{ extraerTitulo(accion5) }}</span>
        <q-tooltip v-if="accion5?.tooltip" class="bg-dark">{{
          accion5.tooltip
        }}</q-tooltip>
      </q-btn>

      <!-- Accion 6 -->
      <q-btn
        v-if="extraerVisible(accion6)"
        :color="extraerColor(accion6) || 'primary'"
        dense
        rounded
        no-caps
        no-wrap
        unelevated
        class="q-px-sm"
        @click="ejecutarAccion(accion6)"
      >
        <q-icon
          v-if="accion6?.icono"
          :name="extraerIcono(accion6) ?? ''"
          size="xs"
          class="q-mr-xs"
        ></q-icon>
        <span>{{ extraerTitulo(accion6) }}</span>
        <q-tooltip v-if="accion6?.tooltip" class="bg-dark">{{
          accion6.tooltip
        }}</q-tooltip>
      </q-btn>

      <!-- Accion 7 -->
      <q-btn
        v-if="extraerVisible(accion7)"
        :color="extraerColor(accion7) || 'primary'"
        dense
        rounded
        no-caps
        no-wrap
        unelevated
        class="q-px-sm"
        @click="ejecutarAccion(accion7)"
      >
        <q-icon
          v-if="accion7?.icono"
          :name="extraerIcono(accion7) ?? ''"
          size="xs"
          class="q-mr-xs"
        ></q-icon>
        <span>{{ extraerTitulo(accion7) }}</span>
        <q-tooltip v-if="accion7?.tooltip" class="bg-dark">{{
          accion7.tooltip
        }}</q-tooltip>
      </q-btn>

      <!-- Accion 8 -->
      <q-btn
        v-if="extraerVisible(accion8)"
        :color="extraerColor(accion8) || 'primary'"
        dense
        rounded
        no-caps
        no-wrap
        unelevated
        class="q-px-sm"
        @click="ejecutarAccion(accion8)"
      >
        <q-icon
          v-if="accion8?.icono"
          :name="extraerIcono(accion8) ?? ''"
          size="xs"
          class="q-mr-xs"
        ></q-icon>
        <span>{{ extraerTitulo(accion8) }}</span>
        <q-tooltip v-if="accion8?.tooltip" class="bg-dark">{{
          accion8.tooltip
        }}</q-tooltip>
      </q-btn>

      <!-- Accion 9 -->
      <q-btn
        v-if="extraerVisible(accion9)"
        :color="extraerColor(accion9) || 'primary'"
        dense
        rounded
        no-caps
        no-wrap
        unelevated
        class="q-px-sm"
        @click="ejecutarAccion(accion9)"
      >
        <q-icon
          v-if="accion9?.icono"
          :name="extraerIcono(accion9) ?? ''"
          size="xs"
          class="q-mr-xs"
        ></q-icon>
        <span>{{ extraerTitulo(accion9) }}</span>
        <q-tooltip v-if="accion9?.tooltip" class="bg-dark">{{
          accion9.tooltip
        }}</q-tooltip>
      </q-btn>

      <!-- Accion 10 -->
      <q-btn
        v-if="extraerVisible(accion10)"
        :color="extraerColor(accion10) || 'primary'"
        dense
        rounded
        no-caps
        no-wrap
        unelevated
        class="q-px-sm"
        @click="ejecutarAccion(accion10)"
      >
        <q-icon
          v-if="accion10?.icono"
          :name="extraerIcono(accion10) ?? ''"
          size="xs"
          class="q-mr-xs"
        ></q-icon>
        <span>{{ extraerTitulo(accion10) }}</span>
        <q-tooltip v-if="accion10?.tooltip" class="bg-dark">{{
          accion10.tooltip
        }}</q-tooltip>
      </q-btn>

      <!-- Accion 11 -->
      <q-btn
        v-if="extraerVisible(accion11)"
        :color="extraerColor(accion11) || 'primary'"
        dense
        rounded
        no-caps
        no-wrap
        unelevated
        class="q-px-sm"
        @click="ejecutarAccion(accion11)"
      >
        <q-icon
          v-if="accion11?.icono"
          :name="extraerIcono(accion11) ?? ''"
          size="xs"
          class="q-mr-xs"
        ></q-icon>
        <span>{{ extraerTitulo(accion11) }}</span>
        <q-tooltip v-if="accion11?.tooltip" class="bg-dark">{{
          accion11.tooltip
        }}</q-tooltip>
      </q-btn>
    </q-btn-group>

    <!-- :rounded="$q.screen.sm || $q.screen.md || $q.screen.lg || $q.screen.xl" -->
    <q-btn-group
      v-else
      dense
      rounded
      :class="{ 'column q-gutter-y-xs': $q.screen.xs }"
    >
      <q-btn-dropdown
        auto-close
        rounded
        color="primary"
        push
        label="Acciones"
        icon="bi-list"
        no-caps
        dense
      >
        <q-list
          padding
          style="width: 250px"
          class="column q-px-xs q-gutter-xs bg-desenfoque"
        >
          <q-btn
            v-if="extraerVisible(accion1)"
            :color="extraerColor(accion1) || 'primary'"
            dense
            rounded
            no-caps
            no-wrap
            unelevated
            class="q-px-sm"
            @click="ejecutarAccion(accion1)"
          >
            <q-icon
              v-if="accion1?.icono"
              :name="extraerIcono(accion1) ?? ''"
              size="xs"
              class="q-mr-xs"
            ></q-icon>
            <span>{{ extraerTitulo(accion1) }}</span>
            <q-tooltip v-if="accion1?.tooltip" class="bg-dark">{{
              accion1.tooltip
            }}</q-tooltip>
          </q-btn>

          <!-- Accion 2 -->
          <q-btn
            v-if="extraerVisible(accion2)"
            :color="extraerColor(accion2) || 'primary'"
            dense
            rounded
            no-caps
            no-wrap
            unelevated
            class="q-px-sm"
            @click="ejecutarAccion(accion2)"
          >
            <q-icon
              v-if="accion2?.icono"
              :name="extraerIcono(accion2) ?? ''"
              size="xs"
              class="q-mr-xs"
            ></q-icon>
            <span>{{ extraerTitulo(accion2) }}</span>
            <q-tooltip v-if="accion2?.tooltip" class="bg-dark">{{
              accion2.tooltip
            }}</q-tooltip>
          </q-btn>

          <!-- Accion 3 -->
          <q-btn
            v-if="extraerVisible(accion3)"
            :color="extraerColor(accion3) || 'primary'"
            dense
            rounded
            no-caps
            no-wrap
            unelevated
            class="q-px-sm"
            @click="ejecutarAccion(accion3)"
          >
            <q-icon
              v-if="accion3?.icono"
              :name="extraerIcono(accion3) ?? ''"
              size="xs"
              class="q-mr-xs"
            ></q-icon>
            <span>{{ extraerTitulo(accion3) }}</span>
            <q-tooltip v-if="accion3?.tooltip" class="bg-dark">{{
              accion3.tooltip
            }}</q-tooltip>
          </q-btn>

          <!-- Accion 4 -->
          <q-btn
            v-if="extraerVisible(accion4)"
            :color="extraerColor(accion4) || 'primary'"
            dense
            rounded
            no-caps
            no-wrap
            unelevated
            class="q-px-sm"
            @click="ejecutarAccion(accion4)"
          >
            <q-icon
              v-if="accion4?.icono"
              :name="extraerIcono(accion4) ?? ''"
              size="xs"
              class="q-mr-xs"
            ></q-icon>
            <span>{{ extraerTitulo(accion4) }}</span>
            <q-tooltip v-if="accion4?.tooltip" class="bg-dark">{{
              accion4.tooltip
            }}</q-tooltip>
          </q-btn>

          <!-- Accion 5 -->
          <q-btn
            v-if="extraerVisible(accion5)"
            :color="extraerColor(accion5) || 'primary'"
            dense
            rounded
            no-caps
            no-wrap
            unelevated
            class="q-px-sm"
            @click="ejecutarAccion(accion5)"
          >
            <q-icon
              v-if="accion5?.icono"
              :name="extraerIcono(accion5) ?? ''"
              size="xs"
              class="q-mr-xs"
            ></q-icon>
            <span>{{ extraerTitulo(accion5) }}</span>
            <q-tooltip v-if="accion5?.tooltip" class="bg-dark">{{
              accion5.tooltip
            }}</q-tooltip>
          </q-btn>

          <!-- Accion 6 -->
          <q-btn
            v-if="extraerVisible(accion6)"
            :color="extraerColor(accion6) || 'primary'"
            dense
            rounded
            no-caps
            no-wrap
            unelevated
            class="q-px-sm"
            @click="ejecutarAccion(accion6)"
          >
            <q-icon
              v-if="accion6?.icono"
              :name="extraerIcono(accion6) ?? ''"
              size="xs"
              class="q-mr-xs"
            ></q-icon>
            <span>{{ extraerTitulo(accion6) }}</span>
            <q-tooltip v-if="accion6?.tooltip" class="bg-dark">{{
              accion6.tooltip
            }}</q-tooltip>
          </q-btn>

          <!-- Accion 7 -->
          <q-btn
            v-if="extraerVisible(accion7)"
            :color="extraerColor(accion7) || 'primary'"
            dense
            rounded
            no-caps
            no-wrap
            unelevated
            class="q-px-sm"
            @click="ejecutarAccion(accion7)"
          >
            <q-icon
              v-if="accion7?.icono"
              :name="extraerIcono(accion7) ?? ''"
              size="xs"
              class="q-mr-xs"
            ></q-icon>
            <span>{{ extraerTitulo(accion7) }}</span>
            <q-tooltip v-if="accion7?.tooltip" class="bg-dark">{{
              accion7.tooltip
            }}</q-tooltip>
          </q-btn>

          <!-- Accion 8 -->
          <q-btn
            v-if="extraerVisible(accion8)"
            :color="extraerColor(accion8) || 'primary'"
            dense
            rounded
            no-caps
            no-wrap
            unelevated
            class="q-px-sm"
            @click="ejecutarAccion(accion8)"
          >
            <q-icon
              v-if="accion8?.icono"
              :name="extraerIcono(accion8) ?? ''"
              size="xs"
              class="q-mr-xs"
            ></q-icon>
            <span>{{ extraerTitulo(accion8) }}</span>
            <q-tooltip v-if="accion8?.tooltip" class="bg-dark">{{
              accion8.tooltip
            }}</q-tooltip>
          </q-btn>

          <!-- Accion 9 -->
          <q-btn
            v-if="extraerVisible(accion9)"
            :color="extraerColor(accion9) || 'primary'"
            dense
            rounded
            no-caps
            no-wrap
            unelevated
            class="q-px-sm"
            @click="ejecutarAccion(accion9)"
          >
            <q-icon
              v-if="accion9?.icono"
              :name="extraerIcono(accion9) ?? ''"
              size="xs"
              class="q-mr-xs"
            ></q-icon>
            <span>{{ extraerTitulo(accion9) }}</span>
            <q-tooltip v-if="accion9?.tooltip" class="bg-dark">{{
              accion9.tooltip
            }}</q-tooltip>
          </q-btn>

          <!-- Accion 10 -->
          <q-btn
            v-if="extraerVisible(accion10)"
            :color="extraerColor(accion10) || 'primary'"
            dense
            rounded
            no-caps
            no-wrap
            unelevated
            class="q-px-sm"
            @click="ejecutarAccion(accion10)"
          >
            <q-icon
              v-if="accion10?.icono"
              :name="extraerIcono(accion10) ?? ''"
              size="xs"
              class="q-mr-xs"
            ></q-icon>
            <span>{{ extraerTitulo(accion10) }}</span>
            <q-tooltip v-if="accion10?.tooltip" class="bg-dark">{{
              accion10.tooltip
            }}</q-tooltip>
          </q-btn>

          <!-- Accion 11 -->
          <q-btn
            v-if="extraerVisible(accion11)"
            :color="extraerColor(accion11) || 'primary'"
            dense
            rounded
            no-caps
            no-wrap
            unelevated
            class="q-px-sm"
            @click="ejecutarAccion(accion11)"
          >
            <q-icon
              v-if="accion11?.icono"
              :name="extraerIcono(accion11) ?? ''"
              size="xs"
              class="q-mr-xs"
            ></q-icon>
            <span>{{ extraerTitulo(accion11) }}</span>
            <q-tooltip v-if="accion11?.tooltip" class="bg-dark">{{
              accion11.tooltip
            }}</q-tooltip>
          </q-btn>
        </q-list>
      </q-btn-dropdown>
    </q-btn-group>
  </span>
</template>

<script lang="ts" setup>
import { useQuasar } from 'quasar'
import { CustomActionTable } from '../domain/CustomActionTable'

const props = defineProps({
  identificador: { type: Number, default: -1 },
  propsTable: {
    type: Object,
    required: true
  },
  desplegarDesde: {
    type: Number,
    default: 2
  },
  accion1: {
    type: Object as () => CustomActionTable,
    required: false
  },
  accion2: {
    type: Object as () => CustomActionTable,
    required: false
  },
  accion3: {
    type: Object as () => CustomActionTable,
    required: false
  },
  accion4: {
    type: Object as () => CustomActionTable,
    required: false
  },
  accion5: {
    type: Object as () => CustomActionTable,
    required: false
  },
  accion6: {
    type: Object as () => CustomActionTable,
    required: false
  },
  accion7: {
    type: Object as () => CustomActionTable,
    required: false
  },
  accion8: {
    type: Object as () => CustomActionTable,
    required: false
  },
  accion9: {
    type: Object as () => CustomActionTable,
    required: false
  },
  accion10: {
    type: Object as () => CustomActionTable,
    required: false
  },
  accion11: {
    type: Object as () => CustomActionTable,
    required: false
  },
  listado: {
    type: Array,
    required: true
  }
})

/* function extraerVisible(accion?: any) {
  //CustomActionTable): boolean {
  if (
    accion &&
    accion.hasOwnProperty('visible') &&
    typeof accion.visible === 'function'
  ) {
    return accion.visible({
      entidad: props.propsTable.row,
      posicion: props.propsTable.rowIndex,
    })
  } else {
    return accion !== undefined && accion.hasOwnProperty('visible')
      ? accion.visible
      : false
  }
} */

const $q = useQuasar()

function extraerVisible(accion?: any) {
  //CustomActionTable): boolean {
  if (accion) {
    if (accion.hasOwnProperty('visible')) {
      if (typeof accion.visible === 'function') {
        return accion.visible({
          entidad: props.propsTable.row,
          posicion: props.propsTable.rowIndex
        })
      } else {
        return accion.visible
      }
    } else {
      return true
    }
  } else {
    return false
  }
}

function extraerIcono(accion?: CustomActionTable) {
  return typeof accion?.icono === 'function'
    ? accion.icono({
        entidad: props.propsTable.row,
        posicion: props.propsTable.rowIndex
      })
    : accion?.icono
}

function extraerTitulo(accion?: CustomActionTable) {
  return typeof accion?.titulo === 'function'
    ? accion.titulo({
        entidad: props.propsTable.row,
        posicion: props.propsTable.rowIndex
      })
    : accion?.titulo
}

function extraerColor(accion?: CustomActionTable) {
  return typeof accion?.color === 'function'
    ? accion.color({
        entidad: props.propsTable.row,
        posicion: props.propsTable.rowIndex
      })
    : accion?.color
}

function ejecutarAccion(accion?: CustomActionTable) {
  const posicion = props.listado.findIndex(
    (fila: any) => fila.id === props.propsTable.row.id
  )
  // console.log(props.identificador)
  // También se devuelve el identificador, -1 en caso de que no se esté proporcionando en el EssentialTable
  accion?.accion({
    entidad: props.propsTable.row,
    posicion, //: props.propsTable.rowIndex,
    identificador: props.identificador
  })
}

const propKeys = Object.keys(props)
const totalAcciones = propKeys.reduce((count, propName) => {
  if (propName.startsWith('accion') && extraerVisible(props[propName])) {
    return count + 1
  }
  return count
}, 0)
</script>
