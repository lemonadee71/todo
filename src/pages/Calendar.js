import { html } from 'poor-man-jsx';
import ToastUICalendar from 'tui-calendar';

const Calendar = () => {
  let instance;

  const init = function () {
    instance = new ToastUICalendar(this, {
      defaultView: 'month',
      // taskView: true,
      // scheduleView: true,
      disableClick: true,
      usageStatistics: false,
      useCreationPopup: true,
      useDetailPopup: true,
    });
  };

  const destroy = () => instance.destroy();

  return html`<div ${{ onCreate: init, onDestroy: destroy }}></div>`;
};

export default Calendar;
