export const customDispatch = (
  el,
  name,
  data,
  bubbles = false,
  cancelable = false
) => {
  el.dispatchEvent(
    new CustomEvent(name, { bubbles, cancelable, detail: data })
  );
};
