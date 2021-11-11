import { Calendar as FullCalendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { html } from 'poor-man-jsx';

const Calendar = () => {
  let self;

  const init = function () {
    self = new FullCalendar(this, {
      plugins: [dayGridPlugin, timeGridPlugin, listPlugin],
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,listWeek',
      },
    });

    self.render();
  };

  const destroy = () => self.destroy();

  return html`<div ${{ onMount: init, onDestroy: destroy }}></div>`;
};

export default Calendar;
