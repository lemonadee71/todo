import { html } from 'poor-man-jsx';
import Core from '../core';
import { PATHS } from '../constants';
import heroImage from '../assets/images/hero_image.svg';
import {
  CalendarIcon,
  GithubIcon,
  KanbanIcon,
  SortIcon,
  SyncIcon,
} from '../assets/icons';

const Landing = () => {
  const goToHome = () =>
    Core.router.navigate(PATHS.dashboard.url, { title: PATHS.dashboard.title });

  const goToLogin = () =>
    Core.router.navigate(PATHS.login.url, { title: PATHS.login.title });

  return html`
    <header class="h-16 bg-[#1F2937]">
      <div class="h-full container-auto px-6 flex justify-between items-center">
        <h1
          class="font-poppins font-semibold text-2xl text-white tracking-wide"
        >
          todo
        </h1>
        <button
          class="px-3 py-1 font-medium text-white text-center align-middle rounded-md bg-sky-500 hover:bg-sky-600 active:ring active:ring-sky-300 focus:ring focus:ring-sky-300"
          onClick=${Core.state.currentUser ? goToHome : goToLogin}
        >
          ${Core.state.currentUser ? 'Open App' : 'Login'}
        </button>
      </div>
    </header>

    <main>
      <!-- Hero -->
      <div class="bg-[#1F2937]">
        <h2 class="sr-only">Hero</h2>
        <div
          class="container-auto px-6 py-10 space-y-4 lg:gap-6 lg:py-20 lg:flex lg:flex-row-reverse lg:justify-between lg:items-center"
        >
          <img class="h-full md:w-96 mx-auto" src="${heroImage}" alt="" />
          <div class="space-y-3 text-center lg:text-left">
            <p class="font-extrabold text-5xl text-[#F9FAF8]">
              Manage your tasks efficiently
            </p>
            <p class="text-lg text-[#E5E7EB]">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quae ea
              eaque molestiae explicabo nihil corporis ipsum error maxime
              voluptas impedit!
            </p>
            <button
              class="font-medium text-white text-lg text-center px-4 py-2 rounded-md bg-sky-500 hover:bg-sky-600 active:ring active:ring-sky-300 focus:ring focus:ring-sky-300"
              onClick=${goToLogin}
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
      <!-- Features -->
      <div
        class="container-auto px-8 pt-16 pb-20 space-y-10 md:px-14 md:pt-20 md:pb-24"
      >
        <h2 class="font-extrabold text-center text-4xl">Features</h2>
        <div class="flex flex-wrap gap-5 justify-around items-start">
          <div class="group w-52 p-3 space-y-2">
            ${KanbanIcon(
              'stroke-sky-500 group-hover:stroke-sky-600 mx-auto',
              130,
              1.25
            )}
            <h3 class="font-medium text-xl text-center">Kanban boards</h3>
            <p class="text-neutral-700 text-center">
              Inspired by desktop app for
              <a
                class="underline hover:text-black"
                href="https://chrome.google.com/webstore/detail/desktop-app-for-google-ta/lpofefdiokgmcdnnaigddelnfamkkghi?hl=en"
              >
                Google Tasks
              </a>
              , easily manage tasks on a Kanban board
            </p>
          </div>
          <div class="group w-52 p-3 space-y-2">
            ${SortIcon(
              'stroke-sky-500 group-hover:stroke-sky-600 mx-auto',
              130,
              1.25
            )}
            <h3 class="font-medium text-xl text-center">Sorting</h3>
            <p class="text-neutral-700 text-center">
              Sort your projects, lists, and tasks however you want!
            </p>
          </div>
          <div class="group w-52 p-3 space-y-2">
            ${CalendarIcon(
              'stroke-sky-500 group-hover:stroke-sky-600 mx-auto',
              130,
              1.25
            )}
            <h3 class="font-medium text-xl text-center">Calendar View</h3>
            <p class="text-neutral-700 text-center">
              Easily switch between list and calendar view to easily manage your
              tasks.
            </p>
          </div>
          <div class="group w-52 p-3 space-y-2">
            ${SyncIcon(
              'stroke-sky-500 group-hover:stroke-sky-600 mx-auto',
              130,
              1.2
            )}
            <h3 class="font-medium text-xl text-center">Backup your data</h3>
            <p class="text-neutral-700 text-center">
              Sync your tasks online with Firebase!
            </p>
          </div>
        </div>
        <p class="font-bold text-3xl text-center">...and more!</p>
      </div>
      <!-- Testimonial -->
      <div class="bg-[#E5E7EB]">
        <h2 class="sr-only">Testimonial</h2>
        <div class="container-auto px-8 py-20 md:px-20 md:py-28">
          <p
            class="font-extralight italic text-3xl text-[#1F2937] mb-4 md:text-4xl"
          >
            This is an inspiring quote, or a testimonial from a customer. Maybe
            it's just filling up space or maybe people will actually read it.
            Who knows? All I know is that it looks nice.
          </p>
          <p class="font-medium text-xl text-[#1F2937] text-right md:text-2xl">
            - Anonymous
          </p>
        </div>
      </div>
      <!-- Call to action -->
      <div class="container-auto px-8 py-16 md:py-20">
        <div
          class="p-12 space-y-4 bg-[#3882F6] text-center rounded-lg md:px-20 md:flex md:justify-between md:items-center md:gap-3"
        >
          <div class="space-y-2 md:text-left">
            <p class="font-bold text-2xl text-white">
              What are you waiting for? Try it now!
            </p>
            <p class="text-white">
              Sign up now by clicking that button right over there!
            </p>
          </div>
          <button
            class="text-white text-lg px-8 py-2 rounded-md border-2 border-solid border-white"
            onClick=${goToLogin}
          >
            Sign up
          </button>
        </div>
      </div>
    </main>

    <footer class="h-20 bg-[#1F2937]">
      <div
        class="container-auto h-full px-6 flex flex-col justify-center items-center space-y-1"
      >
        <p class="text-center text-white">
          Created with &#10084 <span class="sr-only">love</span> by
          <a
            class="font-medium hover:underline"
            href="https://github.com/lemonadee71"
          >
            Shin Andrei Riego
          </a>
          . See
          <a
            class="font-medium hover:underline"
            href="https://github.com/lemonadee71/todo"
            target="_blank"
          >
            code on Github
            <span class="sr-only">Opens in new window</span>
            <span class="inline-block" aria-hidden="true">
              ${GithubIcon('stroke-white group-hover:stroke-gray-300', 15)}
            </span>
          </a>
          .
        </p>
      </div>
    </footer>
  `;
};

export default Landing;
