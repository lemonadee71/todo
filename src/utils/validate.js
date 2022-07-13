import { html, render } from 'poor-man-jsx';
import { debounce } from './delay';
import { dispatchCustom } from './dispatch';
import { copy } from './misc';

const defaultErrorDisplay = () =>
  html`<div class="text-xs text-red-500" data-error-message></div>`;

const invalidClass = ['ring-2', 'ring-red-600'];
const nativeValidityMap = {
  badInput: 'badInput',
  typeMismatch: 'type',
  patternMismatch: 'pattern',
  stepMismatch: 'step',
  rangeOverflow: 'max',
  rangeUnderflow: 'min',
  tooLong: 'maxlength',
  tooShort: 'minlength',
};
const schemas = {};

export const addSchema = (id, props) => {
  schemas[id] = props;
};

// BUG: Since submit triggers reportValidity and we call setCustomValidity everytime
//      After submit, inputs act 'aggressive' because the error tooltip is visible for a time
export const applyValidation = (target) => {
  // to make sure invalid style is visible
  target.classList.add('focus:ring');

  const {
    schema: schemaId,
    validate: type,
    validateOn: changeEvent = 'input',
    validateDelay: delay = '0',
    validateShowError: showValidationErrors,
  } = target.dataset;
  const schema = schemas[schemaId];

  // apply attributes from schema
  if (schema) {
    const attrs = Object.entries(copy(schema, ['custom', 'messages']));

    for (const [key, value] of attrs) {
      if (key === 'required' && value) target.setAttribute('required', '');
      else target.setAttribute(key, value);
    }
  }

  /** Core functions */

  const getValidationMessage = (name, value) => {
    const message = schema?.messages?.[name];

    if (message && typeof message === 'function') return message(value);
    return message;
  };

  const validate = (input) => {
    // constraints are true if it passed, otherwise false
    const validity = { constraints: {}, errorMessages: [], isValid: true };
    let nativeValidationErrors = 0;

    // native validations
    for (const [name, attrName] of Object.entries(nativeValidityMap)) {
      const isInvalid = target.validity[name];
      const message = getValidationMessage(
        attrName,
        target.getAttribute(attrName)
      );

      validity.constraints[attrName] = !isInvalid;

      if (isInvalid) {
        // show custom message instead if any
        if (message) {
          validity.errorMessages.push(message);

          // only push validationMessage once to avoid repetition
          // if there are multiple failed constraints
        } else if (!nativeValidationErrors) {
          validity.errorMessages.push(target.validationMessage);
          nativeValidationErrors++;
        }
      }

      validity.isValid = target.validity.valid;
    }

    // custom validations
    if (schema) {
      for (const [key, fn] of Object.entries(schema.custom ?? {})) {
        const isValid = fn?.(input);
        validity.constraints[key] = isValid;

        if (!isValid) {
          validity.isValid = false;

          const message = getValidationMessage(key);
          if (message) validity.errorMessages.push(message);
        }
      }
    }

    validity.constraints.required = target.required ? !!input : true;
    // if target is required, show that error over anything else
    if (!validity.constraints.required) {
      validity.isValid = false;
      validity.errorMessages = [
        getValidationMessage('required') || 'This field is required',
      ];
    }

    return validity;
  };

  const toggleInvalidStyle = (hasErrors) => {
    if (hasErrors) target.classList.add(...invalidClass);
    else target.classList.remove(...invalidClass);
  };

  // currently no way of communicating errors if inline is not used
  // user will have to submit first before seeing the errors
  const displayErrors = (errors) => {
    const errorDisplay = target.nextElementSibling;
    errorDisplay.innerHTML = '';

    if (errors.length) {
      errorDisplay.setAttribute('role', 'alert');

      if (errors.length === 1) {
        errorDisplay.append(`⚠ ${errors[0]}`);
      } else {
        errorDisplay.append(
          render(html`
            <p>⚠ The input has some errors:</p>
            <ul class="list-disc">
              ${errors.map((error) => `<li>${error}</li>`)}
            </ul>
          `)
        );
      }
    } else {
      errorDisplay.removeAttribute('role', 'alert');
    }
  };

  let touched = false;
  let currentValidity = [];

  /**
   * The idea here is that we validate input on each change
   * then we use `setCustomValidity` to block form submission.
   * This is important for custom validations.
   *
   * But we only show the errors we get depending on the type:
   * aggressive - show errors on each change
   * lazy       - show errors on blur (leaving the input)
   * passive    - show errors on submission only
   * eager      - default; act as `lazy`. if there are errors,
   *              will act as `aggressive` till the error is gone
   *              and will act as lazy again
   *
   * Also, for lazy and eager, on blur will show error only if input is previously
   * `touched` meaning that user already typed in some input
   */

  const validateInput = debounce((e) => {
    // clear custom error so we get native validationMessage
    target.setCustomValidity('');

    currentValidity = validate(e.target.value.trim());

    target.setCustomValidity(currentValidity.errorMessages.join(', '));
  }, +delay);

  const showCurrentErrors = () => {
    toggleInvalidStyle(!currentValidity.isValid);
    displayErrors(currentValidity.errorMessages);
    dispatchCustom('validate', target, currentValidity);
  };

  /** Add listeners */

  target.addEventListener('focus', validateInput);
  target.addEventListener(changeEvent, (e) => {
    touched = true;
    validateInput(e);
  });
  target.addEventListener('invalid', showCurrentErrors);

  // BUG: Errors are still shown after onblur two times following a submit event
  //      Even if there are no change in input
  switch (type) {
    case 'aggressive':
      target.addEventListener(changeEvent, debounce(showCurrentErrors, +delay));
      target.addEventListener('blur', showCurrentErrors);
      break;
    case 'lazy':
      target.addEventListener('blur', () => touched && showCurrentErrors());
      break;
    case 'passive': {
      const parentIsForm = target.parentElement.tagName === 'FORM';

      if (parentIsForm) {
        // to remove error on valid submission
        target.parentElement.addEventListener('submit', () => {
          touched = false;
          showCurrentErrors();
        });
      } else {
        // if there's no parent form we use 'ENTER' key to signify submit
        // though it is recommendable to use 'lazy' instead
        target.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' && target.tagName === 'INPUT') {
            showCurrentErrors();
          }
        });
      }

      break;
    }

    // eager is default
    default: {
      let isInvalid = false;

      target.addEventListener('blur', () => {
        if (!isInvalid && touched) {
          isInvalid = !currentValidity.isValid;
          showCurrentErrors();
        }
      });

      target.addEventListener(
        changeEvent,
        debounce(() => {
          if (isInvalid) {
            isInvalid = !currentValidity.isValid;
            showCurrentErrors();
          }
        }, +delay)
      );

      target.addEventListener('invalid', () => {
        isInvalid = true;
      });
    }
  }

  /** Modify siblings */

  const shouldNotUseSibling =
    target.nextElementSibling?.dataset.errorMessage === undefined;

  // add element to show and announce errors
  if (shouldNotUseSibling) target.after(render(defaultErrorDisplay()));
  if (showValidationErrors === undefined)
    target.nextElementSibling.classList.add('sr-only');
};
