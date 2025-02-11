import type { PolymorphicProps } from '@kobalte/core/polymorphic';
import type { TooltipContentProps, TooltipRootProps } from '@kobalte/core/tooltip';

import { Tooltip as TooltipPrimitive } from '@kobalte/core/tooltip';
import { mergeProps, splitProps, type ValidComponent } from 'solid-js';

import { cn } from '@/libs/cn';

export const TooltipTrigger = TooltipPrimitive.Trigger;

export const Tooltip = (props: TooltipRootProps) => {
  const merge = mergeProps<TooltipRootProps[]>(
    {
      gutter: 4,
      flip: false,
    },
    props,
  );

  return <TooltipPrimitive {...merge} />;
};

type tooltipContentProps<T extends ValidComponent = 'div'> = TooltipContentProps<T> & {
  class?: string;
};

export const TooltipContent = <T extends ValidComponent = 'div'>(
  props: PolymorphicProps<T, tooltipContentProps<T>>,
) => {
  const [local, rest] = splitProps(props as tooltipContentProps, ['class']);

  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        class={cn(
          'z-50 overflow-hidden rounded-md bg-popover text-popover-foreground shadow-md data-[expanded]:animate-in data-[closed]:animate-out data-[closed]:fade-out-0 data-[expanded]:fade-in-0 data-[closed]:zoom-out-95 data-[expanded]:zoom-in-95',
          'border px-3 py-1.5 text-sm shadow-md animate-in fade-in-0',
          local.class,
        )}
        {...rest}
      />
    </TooltipPrimitive.Portal>
  );
};
