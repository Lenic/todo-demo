import type { JSX } from 'solid-js';

import { nanoid } from 'nanoid';
import { createMemo } from 'solid-js';

export interface ContentLoaderProps {
  width?: number | string;
  height?: number | string;
  viewBox?: string;
  preserveAspectRatio?: JSX.SVGPreserveAspectRatio;
  speed?: number;
  baseUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  primaryOpacity?: number;
  secondaryOpacity?: number;
  uniqueKey?: string;
  animate?: boolean;
  children?: JSX.Element;
}

const defaultProps: Partial<ContentLoaderProps> = {
  primaryColor: '#f9f9f9',
  secondaryColor: '#ecebeb',
  primaryOpacity: 1,
  secondaryOpacity: 1,
  animate: true,
};

export const ContentLoader = (props: ContentLoaderProps) => {
  const args = createMemo(() => ({ ...defaultProps, ...props }));
  const idClip = createMemo(() => {
    const res = args().uniqueKey;
    return res ? `${res}-idClip` : nanoid();
  });
  const idGradient = createMemo(() => {
    const res = args().uniqueKey;
    return res ? `${res}-idGradient` : nanoid();
  });
  const width = createMemo(() => args().width ?? 400);
  const height = createMemo(() => args().height ?? 130);
  const speed = createMemo(() => args().speed ?? 2);
  const computedViewBox = createMemo(() => args().viewBox ?? `0 0 ${width().toString()} ${height().toString()}`);

  return (
    <svg
      width={width()}
      height={height()}
      viewBox={computedViewBox()}
      version="1.1"
      preserveAspectRatio={args().preserveAspectRatio ?? 'xMidYMid meet'}
    >
      <rect
        style={{ fill: `url(${args().baseUrl ?? ''}#${idGradient()})` }}
        clip-path={`url(${args().baseUrl ?? ''}#${idClip()})`}
        x="0"
        y="0"
        width="100%"
        height="100%"
      />

      <defs>
        <clipPath id={idClip()}>
          {props.children ?? <rect x="0" y="0" rx="5" ry="5" width="100%" height="100%" />}
        </clipPath>

        <linearGradient id={idGradient()}>
          <stop offset="0%" stop-color={args().primaryColor} stop-opacity={args().primaryOpacity}>
            {args().animate ? (
              <animate attributeName="offset" values="-2; 1" dur={`${speed().toString()}s`} repeatCount="indefinite" />
            ) : null}
          </stop>
          <stop offset="50%" stop-color={args().secondaryColor} stop-opacity={args().secondaryOpacity}>
            {args().animate ? (
              <animate
                attributeName="offset"
                values="-1.5; 1.5"
                dur={`${speed().toString()}s`}
                repeatCount="indefinite"
              />
            ) : null}
          </stop>
          <stop offset="100%" stop-color={args().primaryColor} stop-opacity={args().primaryOpacity}>
            {args().animate ? (
              <animate attributeName="offset" values="-1; 2" dur={`${speed().toString()}s`} repeatCount="indefinite" />
            ) : null}
          </stop>
        </linearGradient>
      </defs>
    </svg>
  );
};
