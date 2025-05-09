import React, { useEffect, useState } from 'react';
import { processImages } from '../utils/imageUtils';

const ImageProcessor = ({ 
  images, 
  employeeData, 
  backgroundImage, 
  setProcessedImages, 
  nextStep, 
  prevStep,
  isProcessing,
  setIsProcessing
}) => {
  const [progress, setProgress] = useState(0);
  const [matchingImages, setMatchingImages] = useState([]);
  const [nonMatchingImages, setNonMatchingImages] = useState([]);
  const [startProcessing, setStartProcessing] = useState(false);

  useEffect(() => {
    // Al cargar el componente, intentamos encontrar coincidencias entre las imágenes y los datos de Excel
    const findMatches = () => {
      const matching = [];
      const nonMatching = [];
      
      images.forEach(image => {
        // Extraer el nombre de archivo sin extensión
        const fileName = image.name.toLowerCase();
        const fileNameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
        
        // Buscar coincidencia en employeeData
        const matchedEmployee = employeeData.find(employee => 
          employee.codigo_img.toLowerCase() === fileName || 
          String(employee.codigo_img).toLowerCase() === fileNameWithoutExt
        );
        
        if (matchedEmployee) {
          matching.push({
            ...image,
            matched: true,
            employeeData: matchedEmployee,
            newName: matchedEmployee.filename
          });
        } else {
          nonMatching.push({
            ...image,
            matched: false
          });
        }
      });
      
      setMatchingImages(matching);
      setNonMatchingImages(nonMatching);
    };
    
    if (images.length > 0 && employeeData && employeeData.length > 0) {
      findMatches();
    }
  }, [images, employeeData]);

  useEffect(() => {
    // Este efecto se encarga de procesar las imágenes cuando startProcessing cambia a true
    const processAllImages = async () => {
      if (!startProcessing) return;
      
      setIsProcessing(true);
      
      try {
        const results = await processImages(matchingImages, backgroundImage, (progress) => {
          setProgress(progress);
        });
        
        setProcessedImages(results);
        nextStep();
      } catch (error) {
        console.error('Error al procesar las imágenes:', error);
      } finally {
        setIsProcessing(false);
        setStartProcessing(false);
      }
    };
    
    processAllImages();
  }, [startProcessing, matchingImages, backgroundImage, setProcessedImages, nextStep, setIsProcessing]);

  const handleProcess = () => {
    setStartProcessing(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Procesar Imágenes</h2>
        <p className="text-gray-600 mb-6">
          Revisa las coincidencias encontradas y procesa las imágenes
        </p>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-medium mb-2">Resumen</h3>
        <div className="flex space-x-8">
          <div className="bg-green-50 p-4 rounded-md border border-green-200">
            <span className="text-2xl font-bold text-green-700">{matchingImages.length}</span>
            <p className="text-sm text-green-600">Imágenes con coincidencia</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
            <span className="text-2xl font-bold text-yellow-700">{nonMatchingImages.length}</span>
            <p className="text-sm text-yellow-600">Imágenes sin coincidencia</p>
          </div>
        </div>
      </div>

      {matchingImages.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Imágenes con coincidencia</h3>
          <div className="max-h-64 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Imagen
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre Original
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nuevo Nombre
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Empleado
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {matchingImages.map((image, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <img 
                        src={image.preview} 
                        alt={image.name}
                        className="h-12 w-12 object-cover rounded-md"
                      />
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                      {image.name}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-green-600 font-medium">
                      {image.newName}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                      {image.employeeData['Nombre de usuario']}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {nonMatchingImages.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Imágenes sin coincidencia</h3>
          <p className="text-sm text-yellow-600 mb-2">
            Estas imágenes no se procesarán porque no tienen coincidencia en los datos de empleados.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 max-h-96 overflow-y-auto">
            {nonMatchingImages.map((image, index) => (
              <div key={index} className="relative">
                <img 
                  src={image.preview} 
                  alt={image.name}
                  className="h-16 w-16 object-cover rounded-md border border-yellow-300"
                />
                <p className="text-xs text-gray-500 mt-1 truncate max-w-16">
                  {image.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {isProcessing ? (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Procesando...</h3>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-primary h-2.5 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {progress}% completado
          </p>
        </div>
      ) : (
        <div className="flex justify-between mt-6">
          <button
            onClick={prevStep}
            className="btn btn-secondary"
          >
            Atrás
          </button>
          
          <button
            onClick={handleProcess}
            className="btn btn-primary"
            disabled={matchingImages.length === 0}
          >
            Procesar {matchingImages.length} Imágenes
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageProcessor;