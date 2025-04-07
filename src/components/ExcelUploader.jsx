import React, { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { processExcelFile } from '../utils/excelUtils';

const ExcelUploader = ({ setEmployeeData, employeeData, nextStep }) => {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validExtensions = ['.xlsx', '.xls'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!validExtensions.includes(fileExtension)) {
      setError('Por favor, selecciona un archivo Excel válido (.xlsx o .xls)');
      return;
    }

    setFileName(file.name);
    setError('');

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        const processedData = processExcelFile(workbook);
        setEmployeeData(processedData);
      } catch (error) {
        console.error('Error al procesar el archivo Excel:', error);
        setError('Error al procesar el archivo. Verifica que tenga el formato correcto.');
      }
    };
    
    reader.readAsArrayBuffer(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleContinue = () => {
    if (!employeeData || employeeData.length === 0) {
      setError('Por favor, carga un archivo Excel válido antes de continuar.');
      return;
    }
    
    nextStep();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Cargar Archivo Excel</h2>
        <p className="text-gray-600 mb-6">
          Carga el archivo Excel con los datos de empleados (Reporte_Img_Empleados_SAP.xlsx)
        </p>
      </div>

      <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".xlsx,.xls"
          className="hidden"
        />
        
        <button 
          onClick={handleButtonClick}
          className="btn btn-primary mb-4"
        >
          Seleccionar Archivo Excel
        </button>
        
        {fileName && (
          <div className="text-sm font-medium text-gray-700 flex items-center">
            <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            Archivo cargado: {fileName}
          </div>
        )}
        
        {error && (
          <div className="text-sm font-medium text-red-500 mt-2">
            {error}
          </div>
        )}
      </div>

      {employeeData && employeeData.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Datos cargados:</h3>
          <div className="max-h-48 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {Object.keys(employeeData[0]).map((key) => (
                    <th key={key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employeeData.slice(0, 5).map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value, i) => (
                      <td key={i} className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
                {employeeData.length > 5 && (
                  <tr>
                    <td colSpan={Object.keys(employeeData[0]).length} className="px-6 py-2 text-sm text-gray-500 text-center">
                      ... y {employeeData.length - 5} filas más
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex justify-end mt-6">
        <button
          onClick={handleContinue}
          className="btn btn-primary"
          disabled={!employeeData || employeeData.length === 0}
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

export default ExcelUploader;