import { html } from 'poor-man-jsx';
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import Core from '../core';
import { PATHS } from '../core/constants';

const Login = () => {
  const signIn = (id) => {
    Core.state.currentUser = id;
    Core.router.navigate(PATHS.app, { historyAPIMethod: 'replaceState' });
  };

  async function signInWithGoogle() {
    const response = await signInWithPopup(getAuth(), new GoogleAuthProvider());
    signIn(response.user.uid);
  }

  async function signInWithGithub() {
    const response = await signInWithPopup(getAuth(), new GithubAuthProvider());
    signIn(response.user.uid);
  }

  const signInAsGuest = () =>
    Core.router.navigate(PATHS.app, { historyAPIMethod: 'replaceState' });

  return html`
    <div>
      <button ${{ onClick: signInWithGoogle }}>Sign in with Google</button>
      <button ${{ onClick: signInWithGithub }}>Sign in with Github</button>
      <button ${{ onClick: signInAsGuest }}>Sign in as Guest</button>
    </div>
  `;
};

export default Login;
