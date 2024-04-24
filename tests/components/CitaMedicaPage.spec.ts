import CitaMedicaPage from '../../src/pages/medico/citaMedica/view/CitaMedicaPage.vue'
import { mount } from '@vue/test-utils'

it('Should mount the component ', () => {
  const message = ''
  const citaMedicaPage = mount(CitaMedicaPage, {
    propsData: {
      msg: message,
    }
  })
  // expect(citaMedicaPage.text()).toContain(message)
  expect(true).toBe(true)
})
