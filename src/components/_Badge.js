import PoorManJSX, { html } from 'poor-man-jsx';

const Badge = ({ children, props }) => html`
  <${props.tag}
    class=${['py-1 px-2 cursor-pointer rounded', props.class]}
    style:background-color=${props.background}
    ${props.props}
  >
    ${children}
  </${props.tag}>
`;

Badge.defaultProps = { tag: 'div' };

PoorManJSX.customComponents.define('common-badge', Badge);

export default Badge;
