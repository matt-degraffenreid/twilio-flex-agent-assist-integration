import { useState } from 'react';

import { CustomerInfo } from '../CustomerInfo/CustomerInfo';
import { EditOrder } from '../EditOrder/EditOrder';

export const OrderManagementModule = () => {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <>
      <CustomerInfo currentStep={currentStep} handleOrderManagement={() => setCurrentStep(2)} />
      <EditOrder currentStep={currentStep} handleClose={() => setCurrentStep(1)} />
    </>
  );
};
