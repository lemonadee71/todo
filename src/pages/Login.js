import { html } from 'poor-man-jsx';
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { signIn } from '../utils/auth';
import logger from '../utils/logger';

const Login = () => {
  async function signInFirebase(provider) {
    try {
      await signInWithPopup(getAuth(), provider);
    } catch (e) {
      logger.error(e.message);
    }
  }

  async function signInWithGoogle() {
    await signInFirebase(new GoogleAuthProvider());
  }

  async function signInWithGithub() {
    await signInFirebase(new GithubAuthProvider());
  }

  return html`
    <main>
      <h1 class="font-sans font-bold text-center text-3xl mt-40 mb-10">
        Login
      </h1>
      <div class="font-sans flex flex-col space-y-3 w-64 mx-auto">
        <button
          class="text-white text-xl rounded-lg py-2 drop-shadow-xl focus:ring focus:ring-sky-300 bg-sky-600 hover:bg-sky-700"
          onClick=${signInWithGoogle}
        >
          Google
        </button>
        <button
          class="text-white text-xl rounded-lg py-2 drop-shadow-xl focus:ring focus:ring-neutral-400 bg-neutral-700 hover:bg-neutral-800"
          onClick=${signInWithGithub}
        >
          Github
        </button>
        <button
          class="text-white text-xl rounded-lg py-2 drop-shadow-xl focus:ring focus:ring-emerald-300 bg-emerald-500 hover:bg-emerald-600"
          onClick=${() => signIn()}
        >
          As Guest
        </button>
      </div>
    </main>
  `;
};

export default Login;
