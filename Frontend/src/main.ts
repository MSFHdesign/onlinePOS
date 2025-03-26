import { createApp } from 'vue'
import './style.css'
import './assets/tailwind.css'
import App from './App.vue'
import router from './router'

// PrimeVue Imports
import PrimeVue from 'primevue/config'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Textarea from 'primevue/textarea'
import ColorPicker from 'primevue/colorpicker'
import Card from 'primevue/card'
import Panel from 'primevue/panel'
import Breadcrumb from 'primevue/breadcrumb'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'

// Import only the icon styles from PrimeVue - using Tailwind for the rest
import 'primeicons/primeicons.css'                     // Icons

const app = createApp(App)

app.use(router)
app.use(PrimeVue, { 
  ripple: true,
  unstyled: true // Enable unstyled mode to use Tailwind CSS for styling
})
app.use(ToastService)

// Register PrimeVue components
app.component('Button', Button)
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('Dialog', Dialog)
app.component('InputText', InputText)
app.component('InputNumber', InputNumber)
app.component('Textarea', Textarea)
app.component('ColorPicker', ColorPicker)
app.component('Card', Card)
app.component('Panel', Panel)
app.component('Breadcrumb', Breadcrumb)
app.component('Toast', Toast)

app.mount('#app') 
