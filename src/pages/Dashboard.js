import { html, render } from 'poor-man-jsx';
import { useRoot } from '../core/hooks';
import { getProfilePicURL, getUserName } from '../utils/auth';
import ProjectCard from '../components/Dashboard/ProjectCard';

const Dashboard = () => {
  const [data, unsubscribe] = useRoot();

  return html`
    <div
      class="grid grid-cols-[auto_1fr] grid-rows-2 px-6 shadow-md bg-white dark:bg-[#353535]"
      onDestroy=${unsubscribe}
    >
      <img
        class="row-span-2 rounded-full h-14 w-14 mr-6 active:ring-teal-500 self-center"
        src="${getProfilePicURL()}"
        alt="profile picture"
      />
      <p class="font-bold tracking-wide text-sm self-end">Hi there,</p>
      <p class="font-bold tracking-wide text-2xl self-start">
        ${getUserName()}
      </p>
    </div>

    <div
      class="grid auto-rows-min sm:grid-rows-2 sm:grid-cols-2 lg:grid-cols-[1fr_minmax(14rem,17rem)] gap-x-6 gap-y-4 px-6"
    >
      <div class="sm:col-span-2 lg:col-span-1 lg:row-span-2 flex flex-col">
        <h2 class="font-semibold text-lg mb-3">Your Projects</h2>
        <div
          is-list
          class="flex-1 grid grid-cols-[repeat(auto-fill,minmax(12rem,1fr))] content-start gap-3 sm:scrollbar"
        >
          ${data.$projects.map(ProjectCard).map((item) => render(item))}
        </div>
      </div>

      <div class="sm:scrollbar">
        <h2 class="font-semibold text-lg mb-3">Due This Week</h2>
        <div></div>
      </div>

      <div class="sm:scrollbar">
        <h2 class="font-semibold text-lg mb-3">Stale Tasks</h2>
        <div></div>
      </div>
    </div>
  `;
};

export default Dashboard;
