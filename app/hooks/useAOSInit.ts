import { useEffect, useRef } from 'react';
import AOS from 'aos';

export function useAOSInit() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 100,
    });
  }, []);
}

export function useAOSRefresh() {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      // First render - animate immediately
      setTimeout(() => {
        AOS.refresh();
      }, 100);
      initialized.current = true;
    } else {
      // Subsequent renders - refresh AOS
      AOS.refresh();
    }
  });
}
