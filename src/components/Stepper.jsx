import React from 'react';

const Stepper = ({ steps, currentStep, goToStep }) => {
  return (
    <div className="flex justify-between items-center w-full">
      {steps.map((step, index) => (
        <div 
          key={index} // key
          className="flex flex-col items-center relative"
          onClick={() => index < currentStep && goToStep(index)}
        >
          <div 
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              index <= currentStep 
                ? 'bg-primary text-white' 
                : 'bg-gray-200 text-gray-500'
            } ${index < currentStep ? 'cursor-pointer hover:bg-accent' : ''}`}
          >
            {index + 1}
          </div>
          
          <span className={`text-sm mt-2 ${
            index <= currentStep ? 'text-gray-800 font-medium' : 'text-gray-500'
          }`}>
            {step.title}
          </span>
          
          {/* {index < steps.length - 1 && (
            <div className={`absolute top-5 w-full h-0.5 left-10 ${
              index < currentStep ? 'bg-primary' : 'bg-gray-200'
            }`} style={{ width: 'calc(100% - 2.5rem)' }}></div>
          )} */}
        </div>
      ))}
    </div>
  );
};

export default Stepper;