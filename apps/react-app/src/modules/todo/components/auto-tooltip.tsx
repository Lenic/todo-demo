import type { FC } from 'react';

import { useEffect, useRef, useState } from 'react';

import { Tooltip, TooltipContent, TooltipPortal, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export interface IAutoTooltipWithDescriptionProps {
  title: string;
  description: string;
  className?: string;
  onClick: () => void;
}

export const AutoTooltip: FC<IAutoTooltipWithDescriptionProps> = (props) => {
  const { className, onClick, description, title } = props;

  const [disabled, setDisabled] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const realElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const targetElement = realElementRef.current;
    if (!targetElement) return;

    if (title !== description) {
      setDisabled(false);
    } else {
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
    }
  }, [title, description, disabled]); // fire effect after changed disabled variable

  const containerClassName = ['relative overflow-hidden', className ?? ''].join(' ');
  const trigger = (
    <div ref={containerRef} className={disabled ? containerClassName : ''} onClick={onClick}>
      <div className="truncate">{title}</div>
      <div ref={realElementRef} className="absolute invisible top-0 left-0 text-wrap">
        {title}
      </div>
    </div>
  );

  if (disabled) return trigger;
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className={containerClassName}>{trigger}</TooltipTrigger>
        <TooltipPortal>
          <TooltipContent>
            <div className="max-w-lg whitespace-break-spaces">{description}</div>
          </TooltipContent>
        </TooltipPortal>
      </Tooltip>
    </TooltipProvider>
  );
};
