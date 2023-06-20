import { useEffect, useState } from 'react';

export const useVisibilityChange = (
  onShow: () => void,
  onHide: () => void,
  visible: boolean
) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!mounted && visible) {
      setMounted(true);
      onShow();
    }

    if (mounted && !visible) {
      setMounted(false);
      onHide();
    }
  }, [visible, mounted, onShow, onHide]);

  return undefined;
};
