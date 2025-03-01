import Swal from 'sweetalert2'

export default defineNuxtPlugin(nuxtApp => {
  // Proporcionamos Swal a toda la aplicación
  nuxtApp.provide('swal', Swal)
})
