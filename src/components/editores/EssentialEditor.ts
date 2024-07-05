import { useQuasar } from 'quasar'
import { defineComponent } from 'vue'
import { ref, Ref } from 'vue'
export default defineComponent({
    props: {
        v: Object as () => Ref,
        v_error_key: String,
        value: () => String,
        error: {
            type: Boolean,
            default: false,
        },
        disable: {
            type: Boolean,
            required: true,
        },
        label: {
            type: String,
            required: false,
        },
    },
    emits: ['update:value'],
    setup(props, { emit }) {
        const $q = useQuasar()
        const internalValue = ref(props.value === null ? '' : props.value)
        const v$ = ref(props.v)

        const toolbar = [
            [
                {
                    label: $q.lang.editor.align,
                    icon: $q.iconSet.editor.align,
                    fixedLabel: true,
                    list: 'only-icons',
                    options: ['left', 'center', 'right', 'justify'],
                },
            ],
            ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
            ['token', 'hr', 'link', 'custom_btn'],
            ['fullscreen'],
            [
                {
                    label: $q.lang.editor.formatting,
                    icon: $q.iconSet.editor.formatting,
                    list: 'no-icons',
                    options: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code'],
                },
                'removeFormat',
            ],
            ['quote', 'unordered', 'ordered', 'outdent', 'indent'],

            ['undo', 'redo'],
        ]

        const updateValue = (value) => {
            internalValue.value = value
            emit('update:value', value)
        }

        return {
            internalValue,
            toolbar,
            v$,
            updateValue,
        }
    }




})