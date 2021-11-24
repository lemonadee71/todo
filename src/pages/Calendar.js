import format from 'date-fns/format';
import { createPopper } from '@popperjs/core';
import { html, render } from 'poor-man-jsx';
import ToastUICalendar from 'tui-calendar';
import Core from '../core';
import { EDIT_TASK, TASK } from '../core/actions';
import { POPPER_CONFIG } from '../core/constants';
import { $ } from '../utils/query';
import { dispatchCustomEvent } from '../utils/dispatch';
import { formatToDateTime, getDueDateRange } from '../utils/date';
import { useUndo } from '../utils/undo';
import Taskbar from '../components/Calendar/Taskbar';
import Sidebar from '../components/Calendar/Sidebar';
import CreationPopup from '../components/Calendar/CreationPopup';

const Calendar = () => {
  const calendar = {};

  // listeners
  const unsubscribe = [
    Core.event.onSuccess([TASK.ADD, TASK.INSERT], (data) => {
      if (data.dueDate) createSchedule(data, ...getDueDateRange(data.dueDate));
    }),
    Core.event.onSuccess(TASK.UPDATE, (data) => {
      // check if there's an existing schedule
      const schedule = calendar.self.getSchedule(data.id, data.project);

      if (data.dueDate) {
        const [start, end] = getDueDateRange(data.dueDate);

        if (schedule) updateSchedule(data.id, data.project, start, end);
        else createSchedule(data, start, end);
      } else {
        deleteSchedule(data.id, data.project);
      }
    }),
  ];

  const createSchedule = (data, start, end) => {
    const schedule = {
      start,
      end,
      id: data.id,
      calendarId: data.project,
      category: 'time',
      title: data.title,
      body: data.notes,
      raw: {
        project: data.project,
        list: data.list,
        task: data.id,
      },
    };

    calendar.self.createSchedules([schedule]);
  };

  const updateSchedule = (id, calendarId, start, end) => {
    calendar.self.updateSchedule(id, calendarId, { start, end });
  };

  const deleteSchedule = (id, calendarId) => {
    calendar.self.deleteSchedule(id, calendarId);
  };

  const toggleSchedule = (calendarId, toHide) => {
    calendar.self.toggleSchedules(calendarId, toHide);
  };

  const showTasks = () => {
    Core.main
      .getAllTasks()
      .filter((task) => task.dueDate)
      .forEach((task) => {
        createSchedule(task, ...getDueDateRange(task.dueDate));
      });
  };

  const closeCreationPopup = () => {
    const prevPopup = $('#creation-popup');
    if (prevPopup) dispatchCustomEvent(prevPopup, 'popupclose');
  };

  const initListeners = (el) => {
    calendar.self.on({
      clickSchedule: closeCreationPopup,
      beforeCreateSchedule: (e) => {
        // make sure to close previous popup first
        closeCreationPopup();

        // then create a new one
        const popup = render(CreationPopup(e)).firstElementChild;
        el.after(popup);

        const ref = e.guide.guideElement
          ? e.guide.guideElement
          : Object.values(e.guide.guideElements)[0];
        const instance = createPopper(ref, popup, POPPER_CONFIG);

        popup.addEventListener('@destroy', () => {
          instance.destroy();
        });
      },
      beforeUpdateSchedule: ({ schedule, changes }) => {
        closeCreationPopup();

        const location = schedule.raw;

        if (changes) {
          Core.event.emit(TASK.UPDATE, {
            ...location,
            data: { dueDate: formatToDateTime(changes.end.toDate()) },
          });
        } else {
          Core.event.emit(
            EDIT_TASK,
            Core.main.getTask(location.project, location.list, location.task)
          );
        }
      },
      beforeDeleteSchedule: ({ schedule }) => {
        useUndo({ type: TASK, text: 'Task removed', payload: schedule.raw })();
        deleteSchedule(schedule.id, schedule.calendarId);
      },
    });
  };

  const init = function () {
    calendar.self = new ToastUICalendar(this, {
      defaultView: 'month',
      taskView: false,
      // scheduleView: true,
      usageStatistics: false,
      useDetailPopup: true,
      template: {
        popupDetailDate: (...args) =>
          format(args[2].toDate(), 'MMMM d, yyyy hh:mm a'),
      },
    });

    initListeners(this);
    showTasks();
  };

  const destroy = () => {
    unsubscribe.forEach((cb) => cb());
    calendar.self.destroy();
  };

  return html`
    ${Taskbar(calendar)} ${Sidebar(toggleSchedule)}
    <div data-name="calendar">
      <div ${{ onCreate: init, onDestroy: destroy }}></div>
    </div>
  `;
};

export default Calendar;
