import Toast from '../components/Toast';
import { showToast } from './showToast';

const logger = function (message, type = '') {
  const msg = message instanceof Error ? message.message : message;

  showToast({
    className: `custom-toast${type}`,
    close: true,
    node: Toast(msg),
  });
};

logger.success = function (message) {
  logger(message, '--success');
};

logger.warning = function (message) {
  logger(message, '--warning');
};

logger.error = function (message) {
  logger(message, '--danger');
};

logger.info = function (message) {
  logger(message, '--info');
};

logger.primary = function (message) {
  logger(message, '--primary');
};

logger.secondary = function (message) {
  logger(message); // secondary is the default
};

export default logger;
