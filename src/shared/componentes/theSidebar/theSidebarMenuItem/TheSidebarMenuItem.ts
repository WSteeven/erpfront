import {computed, defineComponent, ref} from "vue"
import {useRoute} from "vue-router"
import {useStore} from "vuex"

export default defineComponent({
  name: "SidebarMenuItem",
  props: {
    to: {type: String, required: true},
    icon: {type: String, required: true},
    children: {type: Array, required: true},
    hasParent: {type: Boolean, required: true},
  },
  setup(props) {
    const route = useRoute()
    const store = useStore()
    // Computed properties
    const collapsed = computed(() => store.state.sidebar.collapsed)
    const isActive = computed(() => route.path === props.to)
    const showArrow = computed(
      () => props.children.length > 0 && !collapsed.value
    )

    const openSubmenu = ref(false)

    const toggleSubmenu = () => {
      openSubmenu.value = !openSubmenu.value
    }

    return {
      // ref
      collapsed,
      openSubmenu,
      // computed properties
      isActive,
      showArrow,
      tienePadre: computed(() => props.hasParent),
      // functions
      toggleSubmenu,
    }
  },
})
