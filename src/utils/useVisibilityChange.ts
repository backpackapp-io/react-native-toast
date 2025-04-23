import { useEffect, useState } from 'react';
import { DismissReason } from '../core/types';

export const useVisibilityChange = (
  onShow: () => void,
  onHide: (reason?: DismissReason) => void,
  visible: boolean,
  dismissReason?: DismissReason
) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!mounted && visible) {
      setMounted(true);
      onShow();
    }

    if (mounted && !visible) {
      setMounted(false);
      onHide(dismissReason);
    }
  }, [visible, mounted, dismissReason, onShow, onHide]);

  return undefined;
};
