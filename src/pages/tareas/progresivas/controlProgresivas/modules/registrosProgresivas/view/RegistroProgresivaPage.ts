import { ControlProgresiva } from "../../../domain/ControlProgresiva"
import { defineComponent } from "vue"

export default defineComponent({
    setup() {
        const progresiva = new ControlProgresiva()
        return {
            progresiva,
        }
    }
})