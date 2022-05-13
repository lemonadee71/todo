import Toast from '../components/Toast';
import { TOAST_COLORS } from '../constants';
import { showToast } from './showToast';

const logger = function (message, type = 'secondary') {
  const text = message instanceof Error ? message.message : message;

  showToast({
    close: true,
    node: Toast({ text, color: TOAST_COLORS[type].text }),
    // we can't use tailwind's arbitrary values so we do this instead
    style: {
      background: TOAST_COLORS[type].background,
      border: `1px solid ${TOAST_COLORS[type].border}`,
    },
  });
};

logger.success = function (message) {
  logger(message, 'success');
};

logger.warning = function (message) {
  logger(message, 'warning');
};

logger.error = function (message) {
  logger(message, 'danger');
};

logger.info = function (message) {
  logger(message, 'info');
};

logger.primary = function (message) {
  logger(message, 'primary');
};

logger.secondary = function (message) {
  logger(message); // secondary is the default
};

export default logger;
