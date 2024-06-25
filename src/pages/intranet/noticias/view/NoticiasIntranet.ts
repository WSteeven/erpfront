import { defineComponent, ref } from 'vue'

interface BlogForm {
  title: string
  author: string
  date: string
  image: File | null
  description: string
}

export default defineComponent({
  setup() {
    const form = ref<BlogForm>({
      title: '',
      author: '',
      date: '',
      image: null,
      description: '',
    })

    const submitForm = () => {
      // Lógica para manejar la subida del formulario
      console.log('Form Submitted:', form.value)
    }

    const resetForm = () => {
      form.value = {
        title: '',
        author: '',
        date: '',
        image: null,
        description: '',
      }
    }

    return {
      form,
      submitForm,
      resetForm,
    }
  },
})
