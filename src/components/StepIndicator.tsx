interface StepIndicatorProps {
  currentStep: number;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const steps = [
    { number: 1, title: 'Choose Source' },
    { number: 2, title: 'Customize' },
    { number: 3, title: 'Download' }
  ];

  return (
    <div className="mb-8">
      <div className="flex justify-between">
        {steps.map((step) => (
          <div 
            key={step.number} 
            className={`relative flex flex-col items-center ${
              step.number < steps.length ? 'w-full' : ''
            }`}
          >
            {/* Step connector line */}
            {step.number < steps.length && (
              <div className={`absolute top-4 w-full h-0.5 left-1/2 ${
                step.number < currentStep ? 'bg-soft-pink' : 'bg-gray-200'
              }`}></div>
            )}
            
            {/* Step circle */}
            <div className={`
              flex items-center justify-center w-8 h-8 rounded-full
              transition-all duration-200 z-10
              ${step.number === currentStep 
                ? 'bg-soft-pink text-white' 
                : step.number < currentStep 
                  ? 'bg-soft-pink text-white' 
                  : 'bg-gray-200 text-gray-500'}
            `}>
              {step.number < currentStep ? '✓' : step.number}
            </div>
            
            {/* Step title */}
            <div className={`
              mt-2 text-xs text-center
              ${step.number === currentStep ? 'font-medium text-soft-black' : 'text-gray-500'}
            `}>
              {step.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}