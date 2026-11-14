import type { DetailedHTMLProps, HTMLAttributes } from 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'love-stage': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      'duo-char': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        who?: 'm' | 'f';
        big?: boolean;
      };
      'duo-ghost': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        girl?: boolean;
      };
    }
  }
}
