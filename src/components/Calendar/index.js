import format from 'date-fns/format';
import { createPopper } from '@popperjs/core';
import { createHook, html } from 'poor-man-jsx';
import ToastUICalendar from 'tui-calendar';
import Core from '../../core';
import { EDIT_TASK, TASK } from '../../core/actions';
import { POPPER_CONFIG } from '../../core/constants';
import { $ } from '../../utils/query';
import { dispatchCustomEvent } from '../../utils/dispatch';
import { formatToDateTime, getDueDateRange } from '../../utils/date';
import { useUndo } from '../../utils/undo';
import Sidebar from './Sidebar';
import CreationPopup from './CreationPopup';
import { template } from './template';

const Calendar = (projectId) => {
  const [state] = createHook({ date: new Date() });
  let calendar;

  /** wrappers */
  const createSchedule = (data, start, end) => {
    const schedule = {
      start,
      end,
      id: data.id,
      calendarId: data.list,
      category: 'time',
      title: data.title,
      body: data.notes,
      raw: {
        project: data.project,
        list: data.list,
        task: data.id,
      },
    };

    calendar.createSchedules([schedule]);
  };

  const updateSchedule = (id, calendarId, changes) => {
    calendar.updateSchedule(id, calendarId, changes);
  };

  const deleteSchedule = (id, calendarId) => {
    calendar.deleteSchedule(id, calendarId);
  };

  const toggleSchedule = (calendarId, toHide) => {
    calendar.toggleSchedules(calendarId, toHide);
  };

  const showTasks = () => {
    Core.main
      .getTasksFromProject(projectId)
      .filter((task) => task.dueDate)
      .forEach((task) => {
        createSchedule(task, ...getDueDateRange(task.dueDate));
      });
  };

  const setDate = () => {
    state.date = calendar.getDate().toDate();
  };

  const goToToday = () => {
    calendar.today();
    setDate();
  };

  const previous = () => {
    calendar.prev();
    setDate();
  };

  const next = () => {
    calendar.next();
    setDate();
  };

  /** core */
  const initListeners = () => {
    calendar.on({
      clickSchedule: () =>
        dispatchCustomEvent($('#creation-popup'), 'popup:close'),
      beforeCreateSchedule: (e) => {
        const popup = $('#creation-popup');
        // make sure to close previous popup first
        dispatchCustomEvent(popup, 'popup:close');
        // change initial date
        dispatchCustomEvent(popup, 'datechange', { date: e.start.toDate() });
        // show popup
        dispatchCustomEvent(popup, 'popup:open');

        // init popper
        const ref =
          e.guide.guideElement ?? Object.values(e.guide.guideElements)[0];
        const instance = createPopper(ref, popup, {
          ...POPPER_CONFIG,
          placement: 'right',
        });

        popup.addEventListener(
          'popup:close',
          () => {
            e.guide.clearGuideElement();
            instance.destroy();
          },
          { once: true }
        );
      },
      beforeUpdateSchedule: ({ schedule, changes }) => {
        dispatchCustomEvent($('#creation-popup'), 'popup:close');

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
        useUndo({
          type: TASK,
          text: 'Task removed',
          payload: { ...schedule.raw, id: schedule.id },
        })();
        deleteSchedule(schedule.id, schedule.calendarId);
      },
    });
  };

  const init = function () {
    calendar = new ToastUICalendar(this, {
      template,
      defaultView: 'month',
      taskView: false,
      usageStatistics: false,
      useDetailPopup: true,
    });

    initListeners();
    showTasks();
  };

  const destroy = () => {
    unsubscribe.forEach((cb) => cb());
    calendar.destroy();
  };

  /** listeners */
  const unsubscribe = [
    Core.event.onSuccess([TASK.ADD, TASK.INSERT], (data) => {
      if (data.dueDate) createSchedule(data, ...getDueDateRange(data.dueDate));
    }),
    Core.event.onSuccess(TASK.TRANSFER, ({ type, changes, result }) => {
      switch (type) {
        case 'project':
          if (changes.project.to === projectId && result.dueDate) {
            createSchedule(result, ...getDueDateRange(result.dueDate));
          } else {
            deleteSchedule(result.id, changes.list.from);
          }

          break;
        case 'list':
          updateSchedule(result.id, changes.list.from, {
            calendarId: changes.list.to,
            raw: {
              project: result.project,
              list: result.list,
              task: result.id,
            },
          });
          break;

        default:
          throw new Error('Type must be either project, list, or task');
      }
    }),
    Core.event.onSuccess(TASK.UPDATE, (data) => {
      // check if there's an existing schedule
      const schedule = calendar.getSchedule(data.id, data.list);

      if (data.dueDate) {
        const [start, end] = getDueDateRange(data.dueDate);

        if (schedule) updateSchedule(data.id, data.list, { start, end });
        else createSchedule(data, start, end);
      } else {
        deleteSchedule(data.id, data.list);
      }
    }),
  ];

  return html`
    ${Sidebar(projectId, toggleSchedule)}
    <div data-name="taskbar">
      <button name="today" onClick=${goToToday}>Today</button>
      <button name="previous" onClick=${previous}><</button>
      <button name="next" onClick=${next}>></button>
      <h1>${state.$date((date) => format(date, 'MMMM yyyy'))}</h1>
    </div>
    <div data-name="calendar">
      <div onCreate=${init} onDestroy=${destroy}></div>
    </div>
    ${CreationPopup(projectId)}
  `;
};

export default Calendar;
