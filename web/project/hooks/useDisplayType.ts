import { useEffect, useState } from 'react';

const displayList = ['sp', 'tb', 'pc'] as const;
type Display = typeof displayList[number];

const useDisplayType = () => {
  const [display, setDisplay] = useState<Display>('sp');

  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout>;

    const updateDisplayType = () => {
      if (window.innerWidth < 760) {
        setDisplay('sp');
      } else if (window.innerWidth < 980) {
        setDisplay('tb');
      } else {
        setDisplay('pc');
      }
    };

    const resizeHandler = () => {
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        updateDisplayType();
      }, 400);
    };

    updateDisplayType();
    window.addEventListener('resize', resizeHandler);
    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, []);

  return { display };
};

export default useDisplayType;
