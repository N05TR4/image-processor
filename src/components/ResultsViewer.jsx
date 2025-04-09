import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

const ResultsViewer = ({ processedImages, prevStep }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  
  const handleDownloadImages = async () => {
    try {
      setIsDownloading(true);
      
      // Crear un nuevo archivo ZIP
      const zip = new JSZip();
      
      // Añadir cada imagen al ZIP
      const promises = processedImages.map(async (image) => {
        // Verificar si tenemos el blob o necesitamos crearlo desde la vista previa
        const imageBlob = image.resultBlob || 
          await (await fetch(image.resultPreview)).blob();
        
        // Añadir la imagen al ZIP con su nuevo nombre
        zip.file(image.newName, imageBlob);
        
        return true;
      });
      
      // Esperar a que todas las imágenes se añadan
      await Promise.all(promises);
      
      // Generar el archivo ZIP
      const zipContent = await zip.generateAsync({ 
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: {
          level: 6 // nivel de compresión (0-9)
        }
      });
      
      // Descargar el archivo ZIP
      saveAs(zipContent, 'imagenes_procesadas.zip');
      
    } catch (error) {
      console.error('Error al crear el archivo ZIP:', error);
      alert('Ha ocurrido un error al generar el archivo ZIP.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadExcel = () => {
    // Crear datos para el Excel
    const excelData = processedImages.map(img => ({
      'Username': img.employeeData['Nombre de usuario'],
      'Filename': img.newName
    }));
    
    // Crear un libro de trabajo y una hoja
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    
    // Añadir la hoja al libro
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Usuarios_Imagenes');
    
    // Generar el archivo
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    // Descargar el archivo
    saveAs(data, 'usuarios_imagenes.xlsx');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Resultados del Procesamiento</h2>
        <p className="text-gray-600 mb-6">
          Se han procesado {processedImages.length} imágenes correctamente.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card bg-green-50 border border-green-200">
          <h3 className="text-lg font-medium mb-4 text-green-800">Imágenes procesadas</h3>
          <p className="text-sm text-green-700 mb-4">
            Las imágenes han sido renombradas, redimensionadas y se les ha aplicado el fondo seleccionado.
          </p>
          <button
            onClick={handleDownloadImages}
            className="btn bg-green-600 hover:bg-green-700 text-white"
          >
            Descargar imágenes
          </button>
        </div>
        
        <div className="card bg-blue-50 border border-blue-200">
          <h3 className="text-lg font-medium mb-4 text-blue-800">Archivo Excel generado</h3>
          <p className="text-sm text-blue-700 mb-4">
            Se ha generado un archivo Excel con los nombres de usuario y los nombres de archivo correspondientes.
          </p>
          <button
            onClick={handleDownloadExcel}
            className="btn bg-blue-600 hover:bg-blue-700 text-white"
          >
            Descargar Excel
          </button>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium mb-4">Vista previa</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-96 overflow-y-auto">
          {processedImages.map((image, index) => (
            <div key={index} className="relative">
              <img 
                src={image.resultPreview} 
                alt={image.newName}
                className="w-full h-32 object-cover rounded-md border border-gray-200"
              />
              <p className="text-xs text-gray-500 mt-1 truncate">
                {image.newName}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={prevStep}
          className="btn btn-secondary"
        >
          Atrás
        </button>
        
        <button
          onClick={() => window.location.reload()}
          className="btn bg-purple-600 hover:bg-purple-700 text-white"
        >
          Iniciar nuevo procesamiento
        </button>
      </div>
    </div>
  );
};

export default ResultsViewer;