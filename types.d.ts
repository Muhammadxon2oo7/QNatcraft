declare module '@splidejs/react-splide' {
    import { ReactNode, ComponentType, MutableRefObject } from 'react';
  
    export interface SplideProps {
      children?: ReactNode; // 👈 children props'ini qo‘shdik
      options?: any;
      onMoved?: (splide: { index: number }) => void;
      ref?: MutableRefObject<any>;
    }
  
    export const Splide: ComponentType<SplideProps>;
    export const SplideSlide: ComponentType<{ children?: ReactNode }>; // 👈 children props'ini qo‘shdik
    export type SplideRef = any;
  }
  