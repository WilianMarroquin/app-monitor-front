<script setup>
import { ref } from 'vue'
import { manejaError, validaSiExisteDato } from '@/utils/funcionesComunes'

const { post } = useClienteRequest()
const { showToastSuccess } = useToast()

const props = defineProps({
  archivos: Array,
  multiple: {
    type: Boolean,
    default: false,
  },
  previsualizarArchivos: {
    type: Array,
    default: () => [],
  },
  name: {
    type: String,
    default: 'archivos[]', // o 'archivo' si solo es uno
  },
  endPointUpload: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['update:archivos'])
const files = ref([])
const previews = ref([])
const dialog = ref(false)
const dialogPreviewUrl = ref(null)
const dialogFile = ref(null)
const hiddenInput = ref(null)
const isDragging = ref(false)

const isImage = computed(() =>
  dialogFile.value ? dialogFile.value.type.startsWith('image') : false,
)

function appendFiles(newFiles) {
  const nuevos = Array.isArray(newFiles) ? newFiles : [newFiles]

  if (!props.multiple) {
    // Solo conservar el primer archivo nuevo
    const file = nuevos[0]
    const yaExiste = files.value.some(f => f.name === file.name && f.size === file.size)
    if (yaExiste) return

    const id = useUuid()
    files.value = [file]
    previews.value = []

    if (file.type.startsWith('image')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        previews.value.push({ id, file, previewUrl: e.target.result })
      }
      reader.readAsDataURL(file)
    }
    else if (file.type === 'application/pdf') {
      const blobUrl = URL.createObjectURL(file)
      previews.value.push({ id, file, previewUrl: blobUrl })
    }

    if (props.endPointUpload) {
      subirArchivo(file)
    }

    // Emitir como archivo único
    emit('update:archivos', file)
    return
  }

  nuevos.forEach(file => {
    const yaExiste = files.value.some(f => f.name === file.name && f.size === file.size)
    if (yaExiste) return

    files.value.push(file)

    const id = useUuid()

    if (file.type.startsWith('image')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        previews.value.push({ id, file, previewUrl: e.target.result })
      }
      reader.readAsDataURL(file)
    } else if (file.type === 'application/pdf') {
      const blobUrl = URL.createObjectURL(file)
      previews.value.push({ id, file, previewUrl: blobUrl })
    }
    if (props.endPointUpload) {
      subirArchivo(file)
    }
  })
  emit('update:archivos', files.value)
}

function removeFile(id) {
  const index = previews.value.findIndex(f => f.id === id)
  if (index !== -1) {
    const item = previews.value[index]

    // liberar memoria
    if (item.previewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(item.previewUrl)
    }

    previews.value.splice(index, 1)
    files.value = files.value.filter(f => f !== item.file)
  }
  emit('update:archivos', files.value)
}

function openDialog(url, file) {
  dialogPreviewUrl.value = url
  dialogFile.value = file
  dialog.value = true
}

function getImageIframeHtml(src) {
  return `
 <!DOCTYPE html>
 <html>
 <head>
 <style>
 body {
 margin: 0;
 background: #f5f5f5;
 display: flex;
 justify-content: center;
 align-items: center;
 height: 100vh;
 }
 img {
 max-width: 100%;
 height: auto;
 }
 </style>
 </head>
 <body>
 <img src="${src}" alt="Imagen" />
 </body>
 </html>
`
}

function onDragOver() {
  isDragging.value = true
}

function onDragLeave() {
  isDragging.value = false
}

function onDrop(e) {
  isDragging.value = false
  const droppedFiles = Array.from(e.dataTransfer.files)
  appendFiles(droppedFiles)
}

const subirArchivo = async () => {
  if (!props.endPointUpload) {
    manejaError('No se ha definido un endpoint para subir archivos')
    return
  }

  const formData = new FormData()
  files.value.forEach(file => {
    formData.append(props.name, file)
  })

  try {
    const response = await post(props.endPointUpload, formData)

    showToastSuccess('Archivos subidos correctamente')
  } catch (error) {
    manejaError(error)
  }
}

onMounted(() => {
  if (props?.previsualizarArchivos?.length > 0 && validaSiExisteDato(props?.previsualizarArchivos[0])) {
    props.previsualizarArchivos.forEach((url, index) => {
      const isPdf = url.toLowerCase().endsWith('.pdf')

      // Generar ID único usando timestamp e índice
      const id = `preview-${Date.now()}-${index}`
      const file = null

      previews.value.push({
        id,
        file,
        previewUrl: url,
        remote: true,
        isPdf,
      })
    })
  }
})
</script>

<template>
  <!-- Vista previa de archivos -->
  <VRow
    dense
    class="mb-5 preview-dropzone text-center "
    align="start"
    @click="hiddenInput?.click()"
    @dragover.prevent="onDragOver"
    @dragleave="onDragLeave"
    @drop.prevent="onDrop"
    :class="{ 'preview-dropzone': true, dragging: isDragging }"
  >
    <div class="dropzone-message" v-if="!previews?.length > 0">
      <VIcon size="48" class="ri-upload-cloud-2-line" color="primary"/>
      <p class="drop-text">Arrastra y suelta tus archivos aquí</p>
    </div>
    <div
      v-for="f in previews"
      :key="f.id"
      style="width: 250px"
      class="text-center"
    >
      <VCard style="padding: 10px" class="mr-3 mb-3">
        <iframe
          v-if="f.previewUrl && (f.file?.type === 'application/pdf' || f.isPdf)"
          class="preview-frame"
          :src="f.previewUrl"
          title="Vista previa PDF"
        />
        <iframe
          v-else-if="f.previewUrl && (f.file?.type?.startsWith('image') || (!f.isPdf && !f.file))"
          class="preview-frame"
          :srcdoc="getImageIframeHtml(f.previewUrl)"
          title="Vista previa imagen"
        />
        <div class="text-end mt-3" role="group" aria-label="Acciones del archivo">
          <VBtn
            icon="ri-eye-line"
            color="info"
            @click.stop="openDialog(f.previewUrl, f.file)"
            class="mr-1"
            size="small"
            aria-label="Ver archivo"
          />
          <VBtn
            icon="ri-delete-bin-5-fill"
            color="error"
            size="small"
            @click.stop="removeFile(f.id)"
            aria-label="Eliminar archivo"
          />
        </div>
      </VCard>
    </div>
  </VRow>

  <!-- Selector de archivos -->
  <VFileInput
    ref="hiddenInput"
    :model-value="files"
    label="Agrega archivos"
    :multiple="false"
    show-size
    counter
    accept="image/*,.pdf"
    prepend-icon="mdi-paperclip"
    @update:modelValue="appendFiles"
    chips
    hide-input
  />

  <!-- Modal de vista ampliada -->
  <VDialog
    v-model="dialog"
    width="80vw"
    class="dialog-viewport"
    persistent
  >
    <DialogCloseBtn @click="dialog = false" class="z-10"/>

    <VCard class="h-100 d-flex flex-column">
      <VCardText class="pa-0 h-100">
        <img
          v-if="isImage"
          :src="dialogPreviewUrl"
          alt="Vista ampliada de imagen"
          title="Vista ampliada de imagen"
          class="w-100 h-100 object-contain"
        />
        <iframe
          v-else
          :src="dialogPreviewUrl"
          title="Vista ampliada de PDF"
          class="w-100 h-100"
          frameborder="0"
        />
      </VCardText>
    </VCard>
  </VDialog>
</template>

<style scoped>
.dialog-viewport >>> .v-overlay__content {
  height: 85vh;
}

.preview-dropzone {
  border: 2px dashed rgba(var(--v-theme-primary), 0.5);
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.preview-dropzone:hover {
  background-color: rgba(var(--v-theme-primary), 0.045);;
}

.preview-frame {
  width: 100%;
  height: 200px;
  border: none;
  border-radius: 8px;
}

.preview-dropzone {
  border-radius: 12px;
  padding: 16px;
  position: relative;
  cursor: pointer;
  min-height: 300px;
}

.dropzone-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #999;
  font-size: 1rem;
  font-weight: 500;
  text-align: center;
  pointer-events: none;
  user-select: none;
  opacity: 0.5;
}

.preview-dropzone.dragging {
  background-color: rgba(var(--v-theme-primary), 0.05);
  border-color: rgba(var(--v-theme-primary), 1);
}
</style>
