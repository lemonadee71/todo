import { Converter } from 'showdown';

const options = {
  omitExtraWLInCodeBlocks: true,
  noHeaderId: true,
  ghCompatibleHeaderId: true,
  headerLevelStart: 2,
  parseImgDimensions: true,
  strikethrough: true,
  tables: true,
  ghCodeBlocks: true,
  tasklists: true,
  smartIndentationFix: true,
  simpleLineBreaks: true,
  openLinksInNewWindow: true,
  backslashEscapesHTMLTags: true,
  emoji: true,
};

const txtToMdConverter = new Converter(options);
txtToMdConverter.setFlavor('github');

const convertToMarkdown = (text) => txtToMdConverter.makeHtml(text);

export default convertToMarkdown;
