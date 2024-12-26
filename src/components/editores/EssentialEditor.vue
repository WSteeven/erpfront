<template>
  <q-editor
    v-model="internalValue"
    min-height="5rem"
    :toolbar="toolbar"
    :disable="disable"
    toolbar-bg="blue-grey-2"
    toolbar-text-color="black"
    toolbar-toggle-color="primary"
    @input="updateValue"
  >
  </q-editor>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { ref } from 'vue'

const props = defineProps({
  value: {
    type: String,
    default: ''
  },
  disable: {
    type: Boolean,
    required: true
  },
  barraHerramientas: {
    // type: Object as  Array,
    type: Array,
    default: null
  }
})

const emit = defineEmits(['update:value'])

const $q = useQuasar()
const internalValue = ref(props.value)

const toolbar =
  props.barraHerramientas == null
    ? [
        [
          {
            label: $q.lang.editor.align,
            icon: $q.iconSet.editor.align,
            fixedLabel: true,
            list: 'only-icons',
            options: ['left', 'center', 'right', 'justify']
          }
        ],
        ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
        ['token', 'hr', 'link', 'custom_btn'],
        ['fullscreen'],
        [
          {
            label: $q.lang.editor.formatting,
            icon: $q.iconSet.editor.formatting,
            list: 'no-icons',
            options: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code']
          },
          'removeFormat'
        ],
        ['quote', 'unordered', 'ordered', 'outdent', 'indent'],

        ['undo', 'redo']
      ]
    : props.barraHerramientas

const updateValue = value => {
  internalValue.value = value
  emit('update:value', value)
}
</script>
