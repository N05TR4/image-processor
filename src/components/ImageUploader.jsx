import React, { useRef, useState } from 'react';

const ImageUploader = ({ images, setImages, nextStep, prevStep }) => {
  const fileInputRef = useRef(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validar que sean imágenes
    const invalidFiles = files.filter(file => !file.type.startsWith('image/'));
    if (invalidFiles.length > 0) {
      setError('Solo se permiten archivos de imagen');
      return;
    }
    
    setError('');
    
    // Procesar las imágenes
    const newImages = files.map(file => ({
      file,
      name: file.name,
      preview: URL.createObjectURL(file)
    }));
    
    setImages([...images, ...newImages]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    
    const files = Array.from(e.dataTransfer.files);
    
    // Validar que sean imágenes
    const invalidFiles = files.filter(file => !file.type.startsWith('image/'));
    if (invalidFiles.length > 0) {
      setError('Solo se permiten archivos de imagen');
      return;
    }
    
    setError('');
    
    // Procesar las imágenes
    const newImages = files.map(file => ({
      file,
      name: file.name,
      preview: URL.createObjectURL(file)
    }));
    
    setImages([...images, ...newImages]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleRemoveImage = (index) => {
    const newImages = [...images];
    URL.revokeObjectURL(newImages[index].preview); // Liberar la URL
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleContinue = () => {
    if (images.length === 0) {
      setError('Por favor, carga al menos una imagen antes de continuar.');
      return;
    }
    
    nextStep();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Cargar Imágenes</h2>
        <p className="text-gray-600 mb-6">
          Carga las imágenes de los empleados que serán procesadas
        </p>
      </div>

      <div 
        className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          multiple
          className="hidden"
        />
        
        <button 
          onClick={handleButtonClick}
          className="btn btn-primary mb-4"
        >
          Seleccionar Imágenes
        </button>
        
        <p className="text-sm text-gray-500">
          O arrastra y suelta las imágenes aquí
        </p>
        
        {error && (
          <div className="text-sm font-medium text-red-500 mt-2">
            {error}
          </div>
        )}
      </div>

      {images.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Imágenes cargadas: {images.length}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <img 
                  src={image.preview} 
                  alt={`Imagen ${index + 1}`}
                  className="w-full h-32 object-cover rounded-md border border-gray-200"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center rounded-md">
                  <button 
                    onClick={() => handleRemoveImage(index)}
                    className="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-1 rounded-full"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1 truncate">
                  {image.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between mt-6">
        <button
          onClick={prevStep}
          className="btn btn-secondary"
        >
          Atrás
        </button>
        
        <button
          onClick={handleContinue}
          className="btn btn-primary"
          disabled={images.length === 0}
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

export default ImageUploader;