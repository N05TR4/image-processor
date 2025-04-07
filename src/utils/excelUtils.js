/**
 * Procesa un archivo Excel para extraer los datos de empleados y crear las columnas necesarias
 * @param {Object} workbook - Objeto workbook de XLSX
 * @returns {Array} Array con los datos procesados de empleados
 */

import * as XLSX from 'xlsx';


export const processExcelFile = (workbook) => {
    // Obtenemos la primera hoja del archivo
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convertimos la hoja a JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    
    // Verificamos que tenga las columnas necesarias
    if (!jsonData.length || !jsonData[0]['Nombre de usuario'] || !jsonData[0]['Código de empleado']) {
      throw new Error('El archivo Excel no tiene el formato correcto. Debe contener las columnas "Nombre de usuario" y "Código de empleado".');
    }
    
    // Procesamos los datos como lo hacía el script original en Python
    return jsonData.map(row => ({
      ...row,
      filename: `${row['Nombre de usuario']}.jpg`,
      codigo_img: `${row['Código de empleado']}.jpg`
    }));
  };
  
  /**
   * Crea un archivo Excel con los nombres de usuario y los nombres de archivo
   * @param {Array} data - Array con los datos de imágenes procesadas
   * @returns {Blob} Blob con el archivo Excel generado
   */
  export const createExcelReport = (data) => {
    // Implementación similar a create_excel_columns.py
    const excelData = data.map(img => ({
      'Username': img.employeeData['Nombre de usuario'],
      'Filename': img.newName
    }));
    
    // Se utilizaría XLSX para generar el archivo
    // En una implementación real, se devolvería el Blob para descarga
  };