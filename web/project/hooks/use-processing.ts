import { useState } from 'react';

const useProcessing = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const startProcessing = async (f: () => Promise<void> | void) => {
    setIsProcessing(true);
    try {
      await f();
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    startProcessing,
  };
};
export default useProcessing;
