import { html } from 'poor-man-jsx';
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { signIn } from '../utils/auth';
import logger from '../utils/logger';
import Core from '../core';

const Login = () => {
  async function signInFirebase(provider) {
    try {
      const credential = await signInWithPopup(getAuth(), provider);
      // store crendential to check if first time user
      Core.state.currentUserCredential = credential;

      await signIn(credential.user.uid);
    } catch (e) {
      logger.error(e.message);
    }
  }

  async function signInWithGoogle() {
    signInFirebase(new GoogleAuthProvider());
  }

  async function signInWithGithub() {
    signInFirebase(new GithubAuthProvider());
  }

  return html`
    <div>
      <button ${{ onClick: signInWithGoogle }}>Sign in with Google</button>
      <button ${{ onClick: signInWithGithub }}>Sign in with Github</button>
      <button ${{ onClick: () => signIn() }}>Sign in as Guest</button>
    </div>
  `;
};

export default Login;
