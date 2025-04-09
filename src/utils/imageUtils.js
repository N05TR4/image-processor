/**
 * Procesa las imágenes: las redimensiona y les añade el fondo seleccionado
 * @param {Array} images - Lista de objetos de imagen con sus datos
 * @param {Object} backgroundImage - Objeto con la información del fondo seleccionado
 * @param {Function} progressCallback - Función para reportar el progreso del procesamiento
 * @returns {Promise<Array>} Promesa que resuelve a un array con las imágenes procesadas
 */
export const processImages = async (images, backgroundImage, progressCallback) => {
  const processedImages = [];
  
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    
    // Crear un canvas para procesar la imagen
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Dimensiones del canvas (similar al fondo original)
    canvas.width = 640;
    canvas.height = 480;
    
    // Primero dibujamos el fondo
    if (backgroundImage) {
      if (backgroundImage.type === 'custom') {
        // Fondo personalizado (imagen)
        const bgImg = await createImageBitmap(backgroundImage.file);
        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
      } else {
        // Fondo predefinido
        const bgColors = {
          1: '#FFFFFF', // Blanco
          2: '#E6F0FF', // Azul claro
          3: '#F3F4F6', // Gris claro
        };
        
        ctx.fillStyle = bgColors[backgroundImage.id] || '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    } else {
      // Fondo blanco por defecto
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    // Luego dibujamos la imagen redimensionada en el centro
    const img = await createImageBitmap(image.file);
    
    // Calcular dimensiones para mantener proporciones (similar a LANCZOS en PIL)
    const targetWidth = 280;
    const targetHeight = 350;
    const targetX = 180; // Posición X (centro del canvas)
    const targetY = 65;  // Posición Y ajustada para centrar mejor
    
    ctx.drawImage(img, targetX, targetY, targetWidth, targetHeight);
    
    // Convertir el canvas a una URL de datos para previsualización
    const resultDataUrl = canvas.toDataURL('image/jpeg', 0.9);
    
    // Obtener el blob para la descarga
    const resultBlob = await new Promise(resolve => {
      canvas.toBlob(blob => resolve(blob), 'image/jpeg', 0.9);
    });
    
    // Guardar la imagen procesada
    processedImages.push({
      ...image,
      resultPreview: resultDataUrl,
      resultBlob: resultBlob
    });
    
    // Reportar progreso
    progressCallback(Math.round((i + 1) / images.length * 100));
  }
  
  return processedImages;
};