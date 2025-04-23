import puppeteer from 'puppeteer'
import { defineEventHandler, readBody, setHeader, send } from 'h3'
import { readFile } from 'fs/promises'
import { resolve } from 'path'

function generarTablaHTML(data: any[]): string {
  if (!data.length) return '<p>No hay datos para mostrar</p>'

  const headers = Object.keys(data[0])
  const head = headers.map(header => `<th>${header}</th>`).join('')
  const body = data.map(row => {
    return '<tr>' + headers.map(header => `<td>${row[header] ?? ''}</td>`).join('') + '</tr>'
  }).join('')

  return `
    <table>
      <thead><tr>${head}</tr></thead>
      <tbody>${body}</tbody>
    </table>
  `
}

export default defineEventHandler(async (event) => {
  const data: any[] = await readBody(event)

  const plantillaPath = resolve('server/PlantillashTML/DataTable.html')

  try {
    const htmlBase = await readFile(plantillaPath, 'utf-8')
    const tablaHTML = generarTablaHTML(data)
    const htmlFinal = htmlBase.replace('{{tabla}}', tablaHTML)

    const browser = await puppeteer.launch({
      args: ['--no-sandbox'],
    })

    const page = await browser.newPage()
    await page.setContent(htmlFinal, { waitUntil: 'networkidle0' })

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
    })

    await browser.close()

    setHeader(event, 'Content-Type', 'application/pdf')
    setHeader(event, 'Content-Disposition', 'attachment; filename="reporte.pdf"')

    return send(event, pdfBuffer)

  } catch (err) {
    console.error('Error al generar PDF:', err)
    return { error: 'No se pudo generar el PDF' }
  }
})
