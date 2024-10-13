import type { FC, ReactNode } from 'react';

import { useEffect, useRef, useState } from 'react';

import { Tooltip, TooltipContent, TooltipPortal, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export interface IAutoTooltipWithDescriptionProps {
  title: string;
  description: string;
}

export interface IAutoTooltipWithChildrenProps {
  title: string;
  children: ReactNode;
}

export type TAutoTooltipProps = (IAutoTooltipWithChildrenProps | IAutoTooltipWithDescriptionProps) & {
  className?: string;
  onClick: () => void;
};

export const AutoTooltip: FC<TAutoTooltipProps> = (props) => {
  const { className, onClick } = props;

  const [disabled, setDisabled] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const realElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const targetElement = realElementRef.current;
    if (!targetElement) return;

    const observer = new ResizeObserver((entries) => {
      if (!entries.length) return;

      const entry = entries[0];
      const containerElement = containerRef.current;
      setDisabled(
        containerElement ? entry.contentRect.height <= containerElement.getBoundingClientRect().height : false,
      );
    });
    observer.observe(targetElement);

    return () => {
      observer.unobserve(targetElement);
      observer.disconnect();
    };
  }, [disabled]); // fire effect after changed disabled variable

  const containerClassName = ['relative overflow-hidden', className ?? ''].join(' ');
  const trigger = (
    <div ref={containerRef} className={disabled ? containerClassName : ''} onClick={onClick}>
      <div className="truncate">{props.title}</div>
      <div ref={realElementRef} className="absolute invisible top-0 left-0 text-wrap">
        {props.title}
      </div>
    </div>
  );

  if (disabled) return trigger;
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className={containerClassName}>{trigger}</TooltipTrigger>
        <TooltipPortal>
          <TooltipContent>{'description' in props ? props.description : props.children}</TooltipContent>
        </TooltipPortal>
      </Tooltip>
    </TooltipProvider>
  );
};
