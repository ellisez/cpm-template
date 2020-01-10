import { shallowMount } from '@vue/test-utils'
// @ts-ignore
import login from '@/components/login/login.vue'

describe('login.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'new message'
    const wrapper = shallowMount(login, {
      propsData: { msg }
    })
    expect(wrapper.text()).toMatch(msg)
  })
})
