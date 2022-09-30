import { arrow, computePosition, flip, offset, shift } from '@floating-ui/dom';

export const useFloating = (
  anchor,
  floating,
  arrowElement = null,
  options = {}
) => {
  const middleware = [
    offset(options.offset || 5),
    flip(),
    shift({ padding: options.padding || 5 }),
  ];

  if (arrowElement) middleware.push(arrow({ element: arrowElement }));

  const update = (callback) =>
    // taken from the docs
    computePosition(anchor, floating, {
      placement: options.placement || 'bottom',
      strategy: options.strategy || 'absolute',
      middleware,
    }).then(({ x, y, placement, middlewareData }) => {
      Object.assign(floating.style, {
        left: `${x}px`,
        top: `${y}px`,
      });

      if (arrowElement) {
        const { x: arrowX, y: arrowY } = middlewareData.arrow;

        const staticSide = {
          top: 'bottom',
          right: 'left',
          bottom: 'top',
          left: 'right',
        }[placement.split('-')[0]];

        Object.assign(arrowElement.style, {
          left: arrowX != null ? `${arrowX}px` : '',
          top: arrowY != null ? `${arrowY}px` : '',
          right: '',
          bottom: '',
          [staticSide]: '-4px',
        });
      }

      callback?.();
    });

  return update;
};
