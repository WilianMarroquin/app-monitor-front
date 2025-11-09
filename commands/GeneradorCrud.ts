import fs from 'node:fs'
import path from 'node:path'
import readline from 'node:readline'
import chalk from 'chalk'
import clipboardy from 'clipboardy'
import inquirer from 'inquirer'
import { traducirTipoATipoTypeScript } from '@/utils/funcionesPocoComunes'

const propiedadesRequeridas = ['Modelo', 'Ruta', 'Columnas', 'Directorio']
interface DatosBackend {
  Modelo: string
  Ruta: string
  Columnas: Record<string, string>
  Directorio: string
  Api: string
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

function camelCaseAFraseMinusculaConPlural(texto: string): string {
  const palabras: string[] = texto
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
    .split(' ')
    .map(p => p.toLowerCase())

  // Pluralizar la última palabra
  const ultima: string = palabras.pop() || ''
  let plural: string = ultima

  if (ultima.endsWith('z'))
    plural = ultima.slice(0, -1) + 'ces'
  else if (ultima.endsWith('ión'))
    plural = ultima.replace(/ión$/, 'iones')
  else if (ultima.endsWith('s'))
    plural = ultima
  else if (/[aeo]$/.test(ultima))
    plural = ultima + 's'
  else
    plural = ultima + 'es'
  palabras.push(plural)

  return palabras.join(' ')
}

function generarEstadoInicial(campos: string[]): string {
  const estado: Record<string, null> = {}

  campos.forEach(campo => (estado[campo] = null))

  return `{ ${Object.entries(estado).map(([k, v]) => `${k}: ${v}`).join(',\n')} }`
}

function generarColumnasCodigo(campos: string[]): string {
  const columnas = campos.map(campo => ({
    title: formatearLabel(campo),
    key: campo,
  }))

  return `[\n${columnas.map(col => {
    return `  {\n    title: '${col.title}',\n    key: '${col.key}',\n  }`
  }).join(',\n')}\n]`
}

function generarInputsHTML(campos: string[]): string {
  return campos.map(campo => `
    <VCol cols="12" md="6">
      <VTextField
        v-model="data.${campo}"
        :rules="[requiredValidator]"
        label="${formatearLabel(campo)}"
        placeholder="Ingrese ${formatearLabel(campo)}"
      />
    </VCol>
  `).join('')
}

function generarCamposVista(campos: Record<string, string>): string {
  return Object.keys(campos).map(key => {
    const campo = campos[key]

    return `
      <VListItemTitle>
        <h6 class="text-h6">
          ${formatearLabel(campo)}:
          <div class="d-inline-block text-capitalize text-body-1">
            {{ item.${campo} }}
          </div>
        </h6>
      </VListItemTitle>
    `
  }).join('')
}

function leerPlantilla(ruta: string): string {
  return fs.readFileSync(path.join(__dirname, 'PlantillasCrud', ...ruta.split('/')), 'utf-8')
}

function escribirInterfazEnTypes(ruta: string, interfaz: string): void {
  if (fs.existsSync(ruta))
    fs.appendFileSync(ruta, '\n\n' + interfaz)
  else
    fs.writeFileSync(ruta, interfaz)
}

function generarInterfazTypeScript(nombre: string, campos: Record<string, string>): string {
  const propiedades = Object.entries(campos).map(([campo, tipo]) => {
    const tsTipo = traducirTipoATipoTypeScript(tipo)

    return `  ${campo}: ${tsTipo}`
  }).join('\n')

  return `export interface ${nombre} {\n${propiedades}\n}`
}

async function ejecutarGenerador(): Promise<void> {
  try {
    const respuesta = await preguntarSiIngresarJsonManualmenteODesdePortapapeles()
    let datos: DatosBackend | null = null

    if (respuesta === 'manual') {
      datos = await solicitarIngresoJsonManualmente()
    }
    else {
      datos = await leerJsonDesdePortapapeles()

      if (!datos) {
        const { opcion } = await inquirer.prompt([
          {
            type: 'list',
            name: 'opcion',
            message: '¿Qué desea hacer?',
            choices: [
              { name: '🔁 Intentar leer el portapapeles de nuevo', value: 'reintentar' },
              { name: '📝 Ingresar el JSON manualmente', value: 'manual' },
              { name: '❌ Cancelar', value: 'cancelar' },
            ],
          },
        ])

        if (opcion === 'reintentar')
          return await ejecutarGenerador()

        if (opcion === 'manual')
          datos = await solicitarIngresoJsonManualmente()

        if (opcion === 'cancelar') {
          console.log('🚫 Operación cancelada.')

          return
        }
      }
    }

    if (!datos || !datos.Modelo || !datos.Ruta || !datos.Columnas || !datos.Directorio)
      throw new Error('El contenido del portapapeles no es un JSON válido o está incompleto.')

    const modelo = datos.Modelo
    const ruta = datos.Ruta
    const campos = Object.keys(datos.Columnas).filter(Boolean)

    const modeloPlural = pluralizar(modelo.toLowerCase())
    const directorio = datos.Directorio.replace(/^\/|\/$/g, '')
    const dirPaginas = `./pages/${directorio}`
    const dirVistas = `./views/pages/${directorio}`
    const dirTipos = `./types/${directorio}`

    for (const dir of [dirPaginas, dirVistas, dirTipos]) {
      if (!fs.existsSync(dir))
        fs.mkdirSync(dir, { recursive: true })
    }

    const navActiveLink = directorio.replace(/\//g, "-");

    const columnasJS = generarColumnasCodigo([...campos, 'Acciones'])
    const estadoFormulario = generarEstadoInicial(campos)
    const inputsFormulario = generarInputsHTML(campos)
    const camposVista = generarCamposVista(campos)

    const reemplazos: Record<string, string> = {
      '{{ modelPlural }}': modeloPlural,
      '{{ nombreModeloPermiso }}': camelCaseAFraseMinusculaConPlural(modelo),
      '{{ model }}': modelo,
      '{{ headers }}': columnasJS,
      '{{ camposFormCreate }}': estadoFormulario,
      '{{ url }}': ruta,
      '{{ directory }}': directorio,
      '{{ inputsFormulario }}': inputsFormulario,
      '{{ camposForm }}': camposVista,
      '{{ fieldsInterfaz }}': generarInterfazTypeScript(`${modelo}Interface`, datos.Columnas),
      '{{ navActiveLink }}': navActiveLink,
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

    const rutaTypes = path.join(dirTipos, 'types.ts')
    const interfazTS = generarInterfazTypeScript(`${modelo}Interface`, datos.Columnas)

    escribirInterfazEnTypes(rutaTypes, interfazTS)

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

async function preguntarSiIngresarJsonManualmenteODesdePortapapeles(): Promise<string> {
  const respuesta = await inquirer.prompt([
    {
      type: 'list',
      name: 'opcion',
      message: '¿Cómo desea ingresar el JSON?',
      choices: [
        { name: '📝 Ingresar manualmente', value: 'manual' },
        { name: '📋 Obtener desde el portapapeles', value: 'portapapeles' },
      ],
    },
  ])

  return respuesta.opcion
}

export const solicitarIngresoJsonManualmente = async (): Promise<any> => {
  while (true) {
    const { json } = await inquirer.prompt([
      {
        type: 'editor',
        name: 'json',
        message: 'Ingrese el JSON:',
      },
    ])

    let parsed: any

    try {
      parsed = JSON.parse(json)
    }
    catch {
      console.log('❌ El texto ingresado no es un JSON válido. Intente nuevamente.\n')
      continue
    }

    const faltantes = propiedadesRequeridas.filter(prop => !(prop in parsed))

    if (faltantes.length > 0) {
      console.log(`❌ Faltan las siguientes propiedades requeridas: ${faltantes.join(', ')}\n`)
      continue
    }

    return parsed
  }
}

export async function leerJsonDesdePortapapeles(): Promise<DatosBackend | null> {
  try {
    const texto = clipboardy.readSync().replace(/\u0000/g, '').trim()
    const datos = JSON.parse(texto)

    const faltantes = propiedadesRequeridas.filter(prop => !(prop in datos))
    if (faltantes.length > 0) {
      console.error(`❌ Faltan propiedades requeridas: ${faltantes.join(', ')}`)

      return null
    }

    return datos
  }
  catch {
    console.error('❌ El contenido del portapapeles no es un JSON válido.')

    return null
  }
}

ejecutarGenerador()
