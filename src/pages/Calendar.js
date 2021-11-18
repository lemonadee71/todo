import { addMonths, format } from 'date-fns';
import { html } from 'poor-man-jsx';
import ToastUICalendar from 'tui-calendar';
import { $ } from '../utils/query';

const Calendar = () => {
  let instance;

  const renderMonthName = () => {
    const currentDate = instance.getDate().toDate();
    $.data('name', 'month-name').textContent = format(currentDate, 'MMMM');
  };

  const renderDate = () => {
    let text;
    const viewName = instance.getViewName();
    const start = instance.getDateRangeStart().toDate();
    const end = instance.getDateRangeEnd().toDate();

    switch (viewName) {
      case 'day':
        text = format(start, 'yyyy.MM.dd');
        break;
      case 'month':
        // month number is minus 1
        text = format(addMonths(start, 1), 'yyyy.MM');
        break;
      default:
        text = `${format(start, 'yyyy.MM.dd')} ~ ${format(end, 'MM.dd')}`;
    }

    $.data('name', 'date-range').textContent = text;
    renderMonthName();
  };

  const init = function () {
    instance = new ToastUICalendar(this, {
      defaultView: 'month',
      // taskView: true,
      // scheduleView: true,
      // disableClick: true,
      usageStatistics: false,
      useCreationPopup: true,
      useDetailPopup: true,
    });
  };

  const destroy = () => instance.destroy();

  const selectView = (e) => {
    instance.changeView(e.target.value, true);
    renderDate();
  };

  const goToToday = () => {
    instance.today();
    renderDate();
  };

  const previous = () => {
    instance.prev();
    renderDate();
  };

  const next = () => {
    instance.next();
    renderDate();
  };

  return html`
    <div data-name="taskbar">
      <select name="calendar-view" ${{ onChange: selectView }}>
        <option value="day">Daily</option>
        <option value="week">Weekly</option>
        <option value="month" selected>Month</option>
      </select>
      <button name="today" ${{ onClick: goToToday }}>Today</button>
      <button name="previous" ${{ onClick: previous }}><</button>
      <button name="next" ${{ onClick: next }}>></button>
      <p data-name="date-range" ${{ onMount: renderDate }}></p>
    </div>
    <div data-name="calendar">
      <h1 data-name="month-name" ${{ onMount: renderMonthName }}></h1>
      <div ${{ onCreate: init, onDestroy: destroy }}></div>
    </div>
  `;
};

export default Calendar;
