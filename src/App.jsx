import React, { useState } from 'react';
import Stepper from './components/Stepper';
import ExcelUploader from './components/ExcelUploader';
import ImageUploader from './components/ImageUploader';
import ImageProcessor from './components/ImageProcessor';
import ResultsViewer from './components/ResultsViewer';
import BackgroundSelector from './components/BackgroundSelector';

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [employeeData, setEmployeeData] = useState(null);
  const [images, setImages] = useState([]);
  const [processedImages, setProcessedImages] = useState([]);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const steps = [
    {
      title: "Cargar Excel",
      description: "Sube el reporte de empleados"
    },
    {
      title: "Cargar Imágenes",
      description: "Sube las imágenes a procesar"
    },
    {
      title: "Seleccionar Fondo",
      description: "Elige o sube una imagen de fondo"
    },
    {
      title: "Procesar Imágenes",
      description: "Renombra y procesa las imágenes"
    },
    {
      title: "Resultados",
      description: "Descarga las imágenes procesadas"
    }
  ];

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const goToStep = (step) => {
    setCurrentStep(step);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800">Procesador de Imágenes</h1>
          <p className="text-gray-600 mt-2">
            Herramienta para procesar imágenes de empleados
          </p>
        </header>

        <Stepper 
          steps={steps} 
          currentStep={currentStep} 
          goToStep={goToStep} 
        />

        <div className="card mt-8">
          {currentStep === 0 && (
            <ExcelUploader 
              setEmployeeData={setEmployeeData} 
              employeeData={employeeData}
              nextStep={nextStep}
            />
          )}
          
          {currentStep === 1 && (
            <ImageUploader 
              images={images}
              setImages={setImages}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          )}
          
          {currentStep === 2 && (
            <BackgroundSelector
              backgroundImage={backgroundImage}
              setBackgroundImage={setBackgroundImage}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          )}
          
          {currentStep === 3 && (
            <ImageProcessor 
              images={images}
              employeeData={employeeData}
              backgroundImage={backgroundImage}
              setProcessedImages={setProcessedImages}
              nextStep={nextStep}
              prevStep={prevStep}
              isProcessing={isProcessing}
              setIsProcessing={setIsProcessing}
            />
          )}
          
          {currentStep === 4 && (
            <ResultsViewer 
              processedImages={processedImages}
              prevStep={prevStep}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;