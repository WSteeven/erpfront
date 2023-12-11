import { computed, reactive } from 'vue'
import { ColumnConfig } from '../domain/ColumnConfig'

export function extraerInputsEditarTablaModal(props) {
  const fields = extraerCampos(props, (fila) =>
    fila.editable &&
    fila.field !== 'acciones' &&
    fila.type !== 'imagen' &&
    fila.type !== 'select' &&
    fila.type !== 'toggle'
  )

  const fieldsSelect = extraerCampos(props, (fila) =>
    fila.editable && fila.field !== 'acciones' && fila.type === 'select'
  )

  const fieldsToggle = extraerCampos(props, (fila) =>
    fila.editable && fila.field !== 'acciones' && fila.type === 'toggle'
  )

  const fieldsImagen = extraerCampos(props, (fila) =>
    fila.editable && fila.field !== 'acciones' && fila.type === 'imagen'
  )

  const fieldsAll = extraerCampos(props, (fila) =>
    fila.editable && fila.field !== 'acciones'
  )

  return {
    fields,
    fieldsSelect,
    fieldsToggle,
    fieldsImagen,
    fieldsAll,
  }
}

function extraerCampos(props, filtro) {
  return computed(() => props.configuracionColumnas
    .map((fila: ColumnConfig<any>) => reactive({
      label: fila.label,
      field: fila.field,
      type: fila.type ?? 'text',
      editable: fila.editable ?? true,
      valor: props.fila ? props.fila[fila.field] : '',
      options: fila.options,
      hint: fila.hint,
    }))
    .filter(filtro)
  )
}

/*import { computed, reactive } from 'vue'
import { ColumnConfig } from '../domain/ColumnConfig'

export function extraerInputsEditarTablaModal(props) {
  // Text
  const fields = computed(() =>
    props.configuracionColumnas
      .map((fila: ColumnConfig<any>) => {
        return reactive({
          label: fila.label,
          field: fila.field,
          type: fila.type ?? 'text',
          editable: fila.editable ?? true,
          valor: props.fila ? props.fila[fila.field] : '',
          hint: fila.hint,
        })
      })
      .filter(
        (fila) =>
          fila.field !== 'acciones' &&
          fila.type !== 'imagen' &&
          fila.type !== 'select' &&
          fila.type !== 'toggle' &&
          fila.editable
      )
  )

  // Select
  const fieldsSelect = computed(() =>
    props.configuracionColumnas
      .map((fila: ColumnConfig<any>) => {
        return reactive({
          label: fila.label,
          field: fila.field,
          type: fila.type ?? 'text',
          editable: fila.editable ?? true,
          valor: props.fila ? props.fila[fila.field] : '',
          options: fila.options,
          hint: fila.hint,
        })
      })
      .filter(
        (fila) =>
          fila.field !== 'acciones' && fila.type === 'select' && fila.editable
      )
  )

  // Todos los campos
  const fieldsAll = computed(() =>
    props.configuracionColumnas
      .map((fila: ColumnConfig<any>) => {
        return reactive({
          label: fila.label,
          field: fila.field,
          type: fila.type ?? 'text',
          editable: fila.editable ?? true,
          valor: props.fila ? props.fila[fila.field] : '',
          hint: fila.hint,
        })
      })
      .filter((fila) => fila.field !== 'acciones')
  )

  // Toggles
  const fieldsToggle = computed(() =>
    props.configuracionColumnas
      .map((fila: ColumnConfig<any>) => {
        return reactive({
          label: fila.label,
          field: fila.field,
          type: fila.type ?? 'text',
          editable: fila.editable ?? true,
          valor: props.fila ? props.fila[fila.field] : '',
          hint: fila.hint,
        })
      })
      .filter(
        (fila) =>
          fila.field !== 'acciones' && fila.type === 'toggle' && fila.editable
      )
  )

  // Imagenes
  const fieldsImagen = computed(() =>
    props.configuracionColumnas
      .map((fila: ColumnConfig<any>) => {
        return reactive({
          label: fila.label,
          field: fila.field,
          type: fila.type ?? 'text',
          editable: fila.editable ?? true,
          valor: props.fila ? props.fila[fila.field] : '',
          hint: fila.hint,
        })
      })
      .filter(
        (fila) =>
          fila.field !== 'acciones' && fila.type === 'imagen' && fila.editable
      )
  )

  return {
    fields,
    fieldsSelect,
    fieldsAll,
    fieldsToggle,
    fieldsImagen,
  }
}*/
