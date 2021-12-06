import { html } from 'poor-man-jsx';
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { signIn } from '../utils/auth';

const Login = () => {
  async function signInWithGoogle() {
    await signInWithPopup(getAuth(), new GoogleAuthProvider());
  }

  async function signInWithGithub() {
    await signInWithPopup(getAuth(), new GithubAuthProvider());
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
