import { Converter } from 'showdown';
import { escapeHTML } from './misc';

const options = {
  omitExtraWLInCodeBlocks: true,
  noHeaderId: true,
  ghCompatibleHeaderId: true,
  headerLevelStart: 2,
  parseImgDimensions: true,
  strikethrough: true,
  tables: true,
  ghCodeBlocks: true,
  ghMentions: true,
  tasklists: true,
  smartIndentationFix: true,
  simpleLineBreaks: true,
  openLinksInNewWindow: true,
  backslashEscapesHTMLTags: true,
  emoji: true,
};

const txtToMdConverter = new Converter(options);
txtToMdConverter.setFlavor('github');

// escape text first
// because for some reason the `backslashEscapesHTMLTags`
// doesn't work
const convertToMarkdown = (text) => txtToMdConverter.makeHtml(escapeHTML(text));

export default convertToMarkdown;
