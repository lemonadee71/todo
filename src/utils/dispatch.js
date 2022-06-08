export const dispatchCustom = (name, to, data) => {
  to.dispatchEvent(
    new CustomEvent(name, {
      bubbles: false,
      cancelable: false,
      detail: data,
    })
  );
};
