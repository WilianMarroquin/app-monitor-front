import fs from 'node:fs'
import path from 'node:path'
import readline from 'node:readline'
import chalk from 'chalk'
import clipboardy from 'clipboardy'

interface DatosBackend {
  Modelo: string
  Ruta: string
  columnas: Record<string, unknown>
}

interface ColumnaTabla {
  title: string
  value: string
}

const __dirname = path.resolve()

const lector = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function pluralizar(palabra: string): string {
  if (!palabra)
    return ''
  const vocales = ['a', 'e', 'i', 'o', 'u']
  const ultima = palabra.slice(-1).toLowerCase()
  const penultima = palabra.slice(-2, -1).toLowerCase()

  if (vocales.includes(ultima))
    return `${palabra}s`
  if (ultima === 'z')
    return `${palabra.slice(0, -1)}ces`
  if (ultima === 'n' || ultima === 'r')
    return `${palabra}es`
  if (ultima === 'l' && penultima === 'e')
    return `${palabra}es`

  return `${palabra}es`
}

function formatearLabel(campo: string): string {
  return campo
    .split('_')
    .filter(p => p.toLowerCase() !== 'id')
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ')
}

function convertirATitleCase(texto: string): string {
  return texto
    .toLowerCase()
    .split(' ')
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ')
}

function generarEstadoInicial(campos: string[]): string {
  const estado: Record<string, null> = {}

  campos.forEach(campo => (estado[campo] = null))

  return `{ ${Object.entries(estado).map(([k, v]) => `${k}: ${v}`).join(',\n')} }`
}

function generarColumnas(campos: string[]): ColumnaTabla[] {
  return campos.map(campo => ({
    title: formatearLabel(campo),
    value: campo,
  }))
}

function generarInputsHTML(campos: string[]): string {
  return campos.map(campo => `
    <VCol cols="12" md="6">
      <VTextField
        :id="useId()"
        v-model="data.${campo}"
        :rules="[requiredValidator]"
        label="${formatearLabel(campo)}"
        placeholder="Ingrese ${formatearLabel(campo)}"
        required
      />
    </VCol>
  `).join('')
}

function generarCamposVista(campos: string[]): string {
  return campos.map(campo => `
    <VListItemTitle>
      <h6 class="text-h6">
        ${formatearLabel(campo)}:
        <div class="d-inline-block text-capitalize text-body-1">
          {{ item.${campo} }}
        </div>
      </h6>
    </VListItemTitle>
  `).join('')
}

function leerPlantilla(ruta: string): string {
  return fs.readFileSync(path.join(__dirname, 'PlantillasCrud', ...ruta.split('/')), 'utf-8')
}

async function preguntarDirectorioPersonalizado(): Promise<string> {
  return new Promise(resolve => {
    lector.question('¿Desea generar el CRUD en una ruta específica? (ej: /admin/usuarios) (ENTER para usar ruta por defecto): ', respuesta => {
      resolve(respuesta.trim())
    })
  })
}
async function preguntarUrlPersonalizada(): Promise<string> {
  return new Promise(resolve => {
    lector.question('¿Desea agregar una URL específica? (ej: /api/ejemplo/usuarios) (ENTER para usar url por defecto): ', respuesta => {
      resolve(respuesta.trim())
    })
  })
}

async function ejecutarGenerador(): Promise<void> {
  try {
    const directorioPersonalizado = await preguntarDirectorioPersonalizado()
    const urlPersonalizada = await preguntarUrlPersonalizada()
    const textoPortapapeles = clipboardy.readSync().replace(/\u0000/g, '').trim()
    const datos: DatosBackend = JSON.parse(textoPortapapeles)

    if (!datos || !datos.Modelo || !datos.Ruta || !datos.columnas)
      throw new Error('El contenido del portapapeles no es un JSON válido o está incompleto.')

    const modelo = datos.Modelo
    const ruta = urlPersonalizada || datos.Ruta
    const campos = Object.keys(datos.columnas).filter(Boolean)

    const modeloPlural = pluralizar(modelo.toLowerCase())
    const directorio = directorioPersonalizado !== '' ? directorioPersonalizado.replace(/^\/|\/$/g, '') : modeloPlural

    const dirPaginas = `./pages/${directorio}`
    const dirVistas = `./views/pages/${directorio}`
    const dirTipos = `./types/${directorio}`

    for (const dir of [dirPaginas, dirVistas, dirTipos]) {
      if (!fs.existsSync(dir))
        fs.mkdirSync(dir, { recursive: true })
    }

    const columnasJSON = JSON.stringify(generarColumnas([...campos, 'Acciones']), null, 2)
    const estadoFormulario = generarEstadoInicial(campos)
    const inputsFormulario = generarInputsHTML(campos)
    const camposVista = generarCamposVista(campos)

    const reemplazos: Record<string, string> = {
      '{{ modelPlural }}': modeloPlural,
      '{{ modeloTitleCase }}': convertirATitleCase(modeloPlural),
      '{{ model }}': modelo,
      '{{ headers }}': columnasJSON,
      '{{ camposFormCreate }}': estadoFormulario,
      '{{ url }}': ruta,
      '{{ directory }}': directorio,
      '{{ inputsFormulario }}': inputsFormulario,
      '{{ fields }}': columnasJSON,
      '{{ camposForm }}': camposVista,
      '{{ fieldsInterfaz }}': JSON.stringify(datos.columnas, null, 2),
    }

    const generarArchivo = (rutaPlantilla: string, destino: string) => {
      let contenido = leerPlantilla(rutaPlantilla)
      for (const clave in reemplazos)
        contenido = contenido.replace(new RegExp(clave, 'g'), reemplazos[clave])

      fs.writeFileSync(destino, contenido)
    }

    const rutaEdit = path.join(dirPaginas, 'edit')
    const rutaShow = path.join(dirPaginas, 'show')

    if (!fs.existsSync(rutaEdit))
      fs.mkdirSync(rutaEdit, { recursive: true })
    if (!fs.existsSync(rutaShow))
      fs.mkdirSync(rutaShow, { recursive: true })

    generarArchivo('Pages/index.txt', path.join(dirPaginas, 'index.vue'))
    generarArchivo('Pages/create.txt', path.join(dirPaginas, 'create.vue'))
    generarArchivo('Pages/edit.txt', path.join(rutaEdit, '[id].vue'))
    generarArchivo('Pages/show.txt', path.join(rutaShow, '[id].vue'))
    generarArchivo('Views/fields.txt', path.join(dirVistas, 'fields.vue'))
    generarArchivo('Types/types.txt', path.join(dirTipos, 'types.ts'))

    console.log(chalk.greenBright('\n✅ Archivos generados correctamente:\n'))
    console.log(chalk.blue(`📂 ${dirPaginas}`))
    console.log(chalk.cyan(' ├─ index.vue\n ├─ create.vue\n ├─ edit/[id].vue\n └─ show/[id].vue'))
    console.log(chalk.blue(`📂 ${dirVistas}\n └─ fields.vue`))
    console.log(chalk.blue(`📂 ${dirTipos}\n └─ types.ts`))
    console.log(chalk.greenBright('\n ¡Generación de CRUD completada!\n'))
  }
  catch (error: any) {
    console.error(chalk.red(`\n❌ Error: ${error.message}\n`))
  }
  finally {
    lector.close()
  }
}

ejecutarGenerador()
