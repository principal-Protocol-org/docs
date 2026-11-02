import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { defineComponent, h, onMounted } from 'vue'

import { sameDomainAppLinks } from './app-link'
import './custom.css'

const Layout = defineComponent({
  name: 'PrincipalLayout',
  setup() {
    onMounted(sameDomainAppLinks)
    return () => h(DefaultTheme.Layout)
  },
})

export default { extends: DefaultTheme, Layout } satisfies Theme
