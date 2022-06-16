import { useEffect, useState } from 'react';

const displayList = ['sp', 'tb', 'pc'] as const;
type Display = typeof displayList[number];


const useDisplayType = () => {
  const [display, setDisplay] = useState<Display>('sp');

  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout>;

    const updateDisplayType = () => {
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        if (window.innerWidth < 760) {
          setDisplay('sp');
        } else if (window.innerWidth < 980) {
          setDisplay('tb');
        } else {
          setDisplay('pc');
        }
      }, 400);
    };

    window.addEventListener('resize', updateDisplayType);
    return () => {
      window.removeEventListener('resize', updateDisplayType);
    };
  }, []);

  return { display };
};

export default useDisplayType;
