import * as XLSX from 'xlsx';

import {useCargandoPagina} from "@/composables/useCargandoPagina";

/**
 * Exporta un array de objetos a un archivo CSV
 * @param {Array} data - Array de objetos (e.g., [{ nombre: 'Juan', edad: 25 }, ...])
 * @param {string} filename - Nombre del archivo de salida (e.g., 'datos.csv')
 * @param {Array} headers - Array con los nombres de las columnas (e.g., ['Nombre', 'Edad'])
 */
export function exportarDataFormatoCSV(data, filename = 'archivo.csv', headers) {

  const {paginaEspera} = useCargandoPagina();

  paginaEspera.value = true;

  if (Array.isArray(data) || data.length > 0) {

    const dataExportable = filtrarDataExportable(data, headers);

    const worksheet = XLSX.utils.json_to_sheet(dataExportable);

    const csvData = XLSX.utils.sheet_to_csv(worksheet);

    const blob = new Blob([csvData], {type: 'text/csv;charset=utf-8;'});
    const link = document.createElement('a');

    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

  } else {

    console.error('El array de datos está vacío o no es válido.');

  }

  paginaEspera.value = false;

}

/**
 * Exporta un array de objetos a un archivo XLSX
 * @param {Array} data - Array de objetos (e.g., [{ nombre: 'Juan', edad: 25 }, ...])
 * @param {string} filename - Nombre del archivo de salida (e.g., 'datos.xlsx')
 * @param {Array} headers - Array con los nombres de las columnas (e.g., ['Nombre', 'Edad'])
 */
export function exportarDataFormatoXLSX(data, filename = 'archivo.xlsx', headers = []) {

  const {paginaEspera} = useCargandoPagina();

  paginaEspera.value = true;

  if (Array.isArray(data) || data.length > 0) {

    const dataExportable = filtrarDataExportable(data, headers);

    const worksheet = XLSX.utils.json_to_sheet(dataExportable);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');

    if (filename.indexOf('.xlsx') === -1) {
      filename += '.xlsx';
    }

    XLSX.writeFile(workbook, filename);

  } else {

    console.error('El array de datos está vacío o no es válido.');

  }

  paginaEspera.value = false;

}

/**
 * Exporta un array de objetos a un archivo PDF
 * @param {Array} data - Array de objetos (e.g., [{ nombre: 'Juan', edad: 25 }, ...])
 * @param {string} filename - Nombre del archivo de salida (e.g., 'datos.csv')
 * @param {Array} headers - Array con los nombres de las columnas (e.g., ['Nombre', 'Edad'])
 */
// export async function exportarDataFormatoPDF(data, filename = 'archivo.pdf', headers) {
//
//   const {paginaEspera} = useCargandoPagina();
//
//   paginaEspera.value = true;
//
//   const dataExportable = filtrarDataExportable(data, headers);
//
//   try {
//
//     const response = await fetch('/api/generaPdf/dataTable/export', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({dataExportable}),
//     });
//
//     if (!response.ok) {
//       throw new Error('Error al generar el PDF');
//     }
//
//     if (filename.indexOf('.pdf') === -1) {
//       filename += '.pdf';
//     }
//
//     const blob = await response.blob();
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement('a');
//
//     link.href = url;
//     link.download = filename;
//     link.click();
//     URL.revokeObjectURL(url);
//
//   } catch (error) {
//
//     console.error('Error al generar el PDF:', error);
//
//   } finally {
//
//     paginaEspera.value = false;
//   }
//
// }

/**
 * Filtra un array de objetos según las columnas exportables
 * @param {Array} data - Array de objetos (e.g., [{ nombre: 'Juan', edad: 25 }, ...])
 * @param {Array} headers - Array con los nombres de las columnas (e.g., ['Nombre', 'Edad'])
 */
function filtrarDataExportable(data, headers) {

  const columnasAExportar = headers.filter(header => header?.exportable === true || header?.exportable === undefined);

  return data.map(item => {
    const newItem = {};
    columnasAExportar.forEach(columna => {
      newItem[columna.key] = item[columna.key];
    });
    return newItem;
  });

}

