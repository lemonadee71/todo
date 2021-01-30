/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is not neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/uuid/dist/esm-browser/regex.js":
/*!*****************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/regex.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i);\n\n//# sourceURL=webpack://todo/./node_modules/uuid/dist/esm-browser/regex.js?");

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/rng.js":
/*!***************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/rng.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => /* binding */ rng\n/* harmony export */ });\n// Unique ID creation requires a high quality random # generator. In the browser we therefore\n// require the crypto API and do not support built-in fallback to lower quality random number\n// generators (like Math.random()).\nvar getRandomValues;\nvar rnds8 = new Uint8Array(16);\nfunction rng() {\n  // lazy load so that environments that need to polyfill have a chance to do so\n  if (!getRandomValues) {\n    // getRandomValues needs to be invoked in a context where \"this\" is a Crypto implementation. Also,\n    // find the complete implementation of crypto (msCrypto) on IE11.\n    getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== 'undefined' && typeof msCrypto.getRandomValues === 'function' && msCrypto.getRandomValues.bind(msCrypto);\n\n    if (!getRandomValues) {\n      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');\n    }\n  }\n\n  return getRandomValues(rnds8);\n}\n\n//# sourceURL=webpack://todo/./node_modules/uuid/dist/esm-browser/rng.js?");

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/stringify.js":
/*!*********************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/stringify.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__\n/* harmony export */ });\n/* harmony import */ var _validate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./validate.js */ \"./node_modules/uuid/dist/esm-browser/validate.js\");\n\n/**\n * Convert array of 16 byte values to UUID string format of the form:\n * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX\n */\n\nvar byteToHex = [];\n\nfor (var i = 0; i < 256; ++i) {\n  byteToHex.push((i + 0x100).toString(16).substr(1));\n}\n\nfunction stringify(arr) {\n  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;\n  // Note: Be careful editing this code!  It's been tuned for performance\n  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434\n  var uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one\n  // of the following:\n  // - One or more input array values don't map to a hex octet (leading to\n  // \"undefined\" in the uuid)\n  // - Invalid input values for the RFC `version` or `variant` fields\n\n  if (!(0,_validate_js__WEBPACK_IMPORTED_MODULE_0__.default)(uuid)) {\n    throw TypeError('Stringified UUID is invalid');\n  }\n\n  return uuid;\n}\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (stringify);\n\n//# sourceURL=webpack://todo/./node_modules/uuid/dist/esm-browser/stringify.js?");

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/v4.js":
/*!**************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/v4.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__\n/* harmony export */ });\n/* harmony import */ var _rng_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./rng.js */ \"./node_modules/uuid/dist/esm-browser/rng.js\");\n/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./stringify.js */ \"./node_modules/uuid/dist/esm-browser/stringify.js\");\n\n\n\nfunction v4(options, buf, offset) {\n  options = options || {};\n  var rnds = options.random || (options.rng || _rng_js__WEBPACK_IMPORTED_MODULE_0__.default)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`\n\n  rnds[6] = rnds[6] & 0x0f | 0x40;\n  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided\n\n  if (buf) {\n    offset = offset || 0;\n\n    for (var i = 0; i < 16; ++i) {\n      buf[offset + i] = rnds[i];\n    }\n\n    return buf;\n  }\n\n  return (0,_stringify_js__WEBPACK_IMPORTED_MODULE_1__.default)(rnds);\n}\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (v4);\n\n//# sourceURL=webpack://todo/./node_modules/uuid/dist/esm-browser/v4.js?");

/***/ }),

/***/ "./node_modules/uuid/dist/esm-browser/validate.js":
/*!********************************************************!*\
  !*** ./node_modules/uuid/dist/esm-browser/validate.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__\n/* harmony export */ });\n/* harmony import */ var _regex_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./regex.js */ \"./node_modules/uuid/dist/esm-browser/regex.js\");\n\n\nfunction validate(uuid) {\n  return typeof uuid === 'string' && _regex_js__WEBPACK_IMPORTED_MODULE_0__.default.test(uuid);\n}\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (validate);\n\n//# sourceURL=webpack://todo/./node_modules/uuid/dist/esm-browser/validate.js?");

/***/ }),

/***/ "./src/ProjectController.js":
/*!**********************************!*\
  !*** ./src/ProjectController.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"createNewProject\": () => /* binding */ createNewProject,\n/* harmony export */   \"selectProject\": () => /* binding */ selectProject,\n/* harmony export */   \"selectAllTasks\": () => /* binding */ selectAllTasks,\n/* harmony export */   \"getProjectsDetails\": () => /* binding */ getProjectsDetails\n/* harmony export */ });\n/* harmony import */ var _list_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./list.js */ \"./src/list.js\");\n/* harmony import */ var _helpers_getElement__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./helpers/getElement */ \"./src/helpers/getElement.js\");\n/* harmony import */ var _TaskController__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./TaskController */ \"./src/TaskController.js\");\n/* harmony import */ var _components_ProjectLi__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/ProjectLi */ \"./src/components/ProjectLi.js\");\n/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./component */ \"./src/component.js\");\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n// Work on displaying tasks in a selected project\r\n// Add a function that process drop events\r\n// Add functions for handling labels\r\n/*\r\nPass the task's labels to LabelList\r\nIf label in labels, add class \"checked\"\r\nFor each label element, add click event\r\nIf checked, remove label, otherwise add it\r\n*/\r\nconst allProjects = (0,_list_js__WEBPACK_IMPORTED_MODULE_0__.default)('all', 'root', [\r\n  (0,_list_js__WEBPACK_IMPORTED_MODULE_0__.default)('uncategorized', 'project'),\r\n]);\r\n\r\nlet currentSelectedProj = allProjects.getItem(\r\n  (proj) => proj.listName === 'uncategorized'\r\n).id;\r\n\r\nconst segregateTasks = (tasks) => {\r\n  return [\r\n    tasks.filter((task) => !task.completed),\r\n    tasks.filter((task) => task.completed),\r\n  ];\r\n};\r\n\r\nconst transferTask = (id, target) => {\r\n  task = allProjects\r\n    .getItem((proj) => proj.id === currentSelectedProj)\r\n    .getItem((task) => task.id === id);\r\n\r\n  allProjects.getItem((proj) => proj.id === target).addItem(task);\r\n};\r\n\r\nconst getProjectTasks = (id) => {\r\n  currentSelectedProj = id;\r\n  return allProjects.getItem((proj) => proj.id === id).items;\r\n};\r\n\r\nconst addProject = (projName) => {\r\n  let newProject = (0,_list_js__WEBPACK_IMPORTED_MODULE_0__.default)(projName, 'project');\r\n  allProjects.addItem(newProject);\r\n\r\n  return newProject;\r\n};\r\n\r\nconst addTask = (task) => {\r\n  allProjects\r\n    .getItem((proj) => proj.id === currentSelectedProj)\r\n    .addItem(task);\r\n};\r\n\r\nconst deleteTask = (task) => {\r\n  allProjects\r\n    .getItem((proj) => proj.id === task.location)\r\n    .removeItems((item) => item.id === task.id);\r\n};\r\n\r\nconst getAllTasks = () => {\r\n  currentSelectedProj = allProjects.getItem(\r\n    (proj) => proj.listName === 'uncategorized'\r\n  ).id;\r\n  return [...allProjects].map((proj) => proj.items).flat();\r\n};\r\n\r\nconst getDueToday = () => {\r\n  return [...allProjects]\r\n    .map((proj) => proj.items)\r\n    .flat()\r\n    .filter((task) => task.dueDate === '');\r\n};\r\n\r\nconst getDueThisWeek = () => {\r\n  return [...allProjects]\r\n    .map((proj) => proj.items)\r\n    .flat()\r\n    .filter((task) => task.dueDate === '');\r\n};\r\n\r\nconst getUpcoming = () => {\r\n  return [...allProjects]\r\n    .map((proj) => proj.items)\r\n    .flat()\r\n    .filter((task) => task.dueDate === '');\r\n};\r\n\r\nconst getProjectsDetails = () => {\r\n  let projects = allProjects.items;\r\n\r\n  return projects\r\n    ? projects.map((proj) => {\r\n        return {\r\n          id: proj.id,\r\n          name: proj.listName,\r\n        };\r\n      })\r\n    : null;\r\n};\r\n\r\nconst renderTasks = (tasks) => {\r\n  let currentTasks = (0,_helpers_getElement__WEBPACK_IMPORTED_MODULE_1__.default)('#current-tasks');\r\n  let completedTasks = (0,_helpers_getElement__WEBPACK_IMPORTED_MODULE_1__.default)('#completed-tasks');\r\n\r\n  currentTasks.innerHTML = '';\r\n  completedTasks.innerHTML = '';\r\n\r\n  let [current, completed] = segregateTasks(tasks);\r\n\r\n  currentTasks.append(...current.map((task) => (0,_TaskController__WEBPACK_IMPORTED_MODULE_2__.createTaskCard)(task)));\r\n  currentTasks.append(\r\n    ...completed.map((task) => (0,_TaskController__WEBPACK_IMPORTED_MODULE_2__.createTaskCard)(task))\r\n  );\r\n};\r\n\r\nconst selectProject = (id) => {\r\n  let tasks = getProjectTasks(id);\r\n  renderTasks(tasks);\r\n};\r\n\r\nconst selectAllTasks = () => {\r\n  // let tasks = getAllTasks();\r\n  // renderTasks(tasks);\r\n  console.log('Fetching all tasks...');\r\n};\r\n\r\nconst createNewProject = (e) => {\r\n  e.preventDefault();\r\n  let input = (0,_helpers_getElement__WEBPACK_IMPORTED_MODULE_1__.default)('#new-proj');\r\n  let newProject = addProject(input.value);\r\n  let { id, listName: name } = newProject;\r\n\r\n  let userProjects = (0,_helpers_getElement__WEBPACK_IMPORTED_MODULE_1__.default)('#user-proj');\r\n  userProjects.appendChild(\r\n    _component__WEBPACK_IMPORTED_MODULE_4__.default.createFromString(\r\n      ...Array.from((0,_components_ProjectLi__WEBPACK_IMPORTED_MODULE_3__.default)({ id, name }, { selectProject }))\r\n    )\r\n  );\r\n  e.target.reset();\r\n};\r\n\r\n\r\n\n\n//# sourceURL=webpack://todo/./src/ProjectController.js?");

/***/ }),

/***/ "./src/Task.js":
/*!*********************!*\
  !*** ./src/Task.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__\n/* harmony export */ });\n/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! uuid */ \"./node_modules/uuid/dist/esm-browser/v4.js\");\n\r\n\r\nclass Task {\r\n  constructor({ title, desc, dueDate }) {\r\n    this.title = title || 'Unnamed Task';\r\n    this.desc = desc || '';\r\n    this.dueDate = dueDate || '';\r\n    this.completed = false;\r\n    this.labels = [];\r\n    this.subtasks = [];\r\n    this.id = (0,uuid__WEBPACK_IMPORTED_MODULE_0__.default)();\r\n  }\r\n\r\n  /**\r\n   * @param {string} newTitle\r\n   */\r\n  set title(newTitle) {\r\n    if (typeof newTitle !== 'string') {\r\n      throw new Error('Invalid type. Title must be string.');\r\n    }\r\n\r\n    this.title = newTitle;\r\n  }\r\n\r\n  /**\r\n   * @param {string} newDesc\r\n   */\r\n  set desc(newDesc) {\r\n    if (typeof newDesc !== 'string') {\r\n      throw new Error('Invalid type. Desc must be string.');\r\n    }\r\n\r\n    this.desc = newDesc;\r\n  }\r\n\r\n  get dueDate() {\r\n    let [year, month, day] = this.dueDate.split('-');\r\n    month = +month - 1;\r\n\r\n    return new Date(year, month, day);\r\n  }\r\n\r\n  set dueDate(newDueDate) {\r\n    if (typeof newDueDate !== 'string') {\r\n      throw new Error('Invalid type. dueDate must be string.');\r\n    }\r\n\r\n    this.dueDate = newDueDate;\r\n  }\r\n\r\n  get labels() {\r\n    return [...this.labels];\r\n  }\r\n\r\n  set labels(label) {\r\n    throw new Error('Invalid. Use addLabel to add a label.');\r\n  }\r\n\r\n  get subtasks() {\r\n    return [...this.subtasks];\r\n  }\r\n\r\n  set subtasks(subtask) {\r\n    throw new Error('Invalid. Use addSubtask to add a subtask.');\r\n  }\r\n\r\n  getData() {\r\n    return {\r\n      ...this,\r\n    };\r\n  }\r\n\r\n  addSubtask(task) {\r\n    this.subtasks.push(task);\r\n  }\r\n\r\n  removeSubtask(id) {\r\n    this.subtasks = this.subtasks.filter(\r\n      (subtask) => subtask.id !== id\r\n    );\r\n  }\r\n\r\n  removeAllSubtasks() {\r\n    this.subtasks = [];\r\n  }\r\n\r\n  addLabel(label) {\r\n    this.label.push(label);\r\n  }\r\n\r\n  removeLabels() {\r\n    this.labels = [];\r\n  }\r\n\r\n  toggleComplete() {\r\n    this.completed = !this.completed;\r\n\r\n    return this.completed;\r\n  }\r\n}\r\n\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Task);\r\n\n\n//# sourceURL=webpack://todo/./src/Task.js?");

/***/ }),

/***/ "./src/TaskController.js":
/*!*******************************!*\
  !*** ./src/TaskController.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"createNewTask\": () => /* binding */ createNewTask,\n/* harmony export */   \"createTaskCard\": () => /* binding */ createTaskCard\n/* harmony export */ });\n/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./component */ \"./src/component.js\");\n/* harmony import */ var _components_TaskCard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/TaskCard */ \"./src/components/TaskCard.js\");\n/* harmony import */ var _Task__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Task */ \"./src/Task.js\");\n/* harmony import */ var _helpers_getElement__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./helpers/getElement */ \"./src/helpers/getElement.js\");\n\r\n\r\n\r\n\r\n//         type: 'div',\r\n//         text: format(task.dueDate, 'E..EEE, MMM dd'),\r\n//       },\r\n\r\nconst createNewTask = (details, { deleteTask }) => {\r\n  let newTask = new _Task__WEBPACK_IMPORTED_MODULE_2__.default(details);\r\n  return createTaskCard(newTask, { deleteTask });\r\n};\r\n\r\nconst createTaskCard = (task, { deleteTask }) => {\r\n  const editTask = () => {};\r\n\r\n  const onDelete = () => {\r\n    let taskCard = (0,_helpers_getElement__WEBPACK_IMPORTED_MODULE_3__.default)(`#${task.id}`);\r\n\r\n    deleteTask(task);\r\n    taskCard.remove();\r\n  };\r\n\r\n  const toggleCheckmark = (e) => {\r\n    e.target.classList.toggle('checked');\r\n    e.stopPropagation();\r\n\r\n    let done = task.toggleComplete();\r\n    let taskCard = (0,_helpers_getElement__WEBPACK_IMPORTED_MODULE_3__.default)(`#${task.id}`);\r\n    taskCard.classList.toggle('completed');\r\n\r\n    if (done) {\r\n      (0,_helpers_getElement__WEBPACK_IMPORTED_MODULE_3__.default)('#completed-tasks').appendChild(taskCard);\r\n    } else {\r\n      (0,_helpers_getElement__WEBPACK_IMPORTED_MODULE_3__.default)('#current-tasks').appendChild(taskCard);\r\n    }\r\n  };\r\n\r\n  return (0,_components_TaskCard__WEBPACK_IMPORTED_MODULE_1__.default)({\r\n    onDelete,\r\n    toggleCheckmark,\r\n    id: task.id,\r\n  });\r\n};\r\n\r\n\r\n\n\n//# sourceURL=webpack://todo/./src/TaskController.js?");

/***/ }),

/***/ "./src/component.js":
/*!**************************!*\
  !*** ./src/component.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__\n/* harmony export */ });\nconst Component = (() => {\r\n  const _randNo = (seed) => Math.floor(Math.random() * seed);\r\n\r\n  const _generateID = () =>\r\n    `${_randNo(10)}${_randNo(10)}${_randNo(50)}`;\r\n\r\n  const createFromObject = (template, reference = null) => {\r\n    let element, type, text;\r\n    let id, className;\r\n\r\n    const _checkForClass = (type) => {\r\n      try {\r\n        let _className = '';\r\n        let _type = type;\r\n\r\n        _className = type.match(/(\\.\\w+)/g);\r\n        _className.forEach((cls) => {\r\n          _type = _type.replace(cls, '');\r\n        });\r\n        className = _className\r\n          .map((cls) => cls.replace('.', ''))\r\n          .join(' ');\r\n\r\n        return _type;\r\n      } catch (error) {\r\n        className = template.className;\r\n\r\n        return type;\r\n      }\r\n    };\r\n\r\n    const _checkForId = (type) => {\r\n      try {\r\n        let _id = '';\r\n        let _type = type;\r\n\r\n        _id = _type.match(/#(\\w+)/)[1];\r\n        _type = _type.replace(`#${_id}`, '');\r\n        id = _id;\r\n\r\n        return _type;\r\n      } catch (error) {\r\n        id = template.id;\r\n\r\n        return type;\r\n      }\r\n    };\r\n\r\n    /*\r\n      Special properties paragraph, span, link\r\n      Example: \r\n        {\r\n          paragraph: 'Text',\r\n        } \r\n        or\r\n        {\r\n          type: 'p',\r\n          text: 'Text',\r\n        }\r\n        creates <p>Text</p>\r\n      */\r\n    if (template.type) {\r\n      type = template.type;\r\n      type = _checkForClass(type);\r\n      type = _checkForId(type);\r\n\r\n      text = template.text || '';\r\n    } else if (template.paragraph) {\r\n      type = 'p';\r\n      text = template.paragraph;\r\n    } else if (template.span) {\r\n      type = 'span';\r\n      text = template.span;\r\n    } else if (template.link) {\r\n      type = 'a';\r\n      text = template.link;\r\n    }\r\n\r\n    // Create element\r\n    if (type === 'fragment') {\r\n      element = document.createDocumentFragment();\r\n    } else {\r\n      element = document.createElement(type);\r\n    }\r\n\r\n    // Add classes\r\n    if (className) {\r\n      let classes = className.split(' ');\r\n      element.classList.add(...classes);\r\n    }\r\n\r\n    // Add id\r\n    if (id) {\r\n      element.id = id;\r\n    }\r\n\r\n    // Add text\r\n    if (text) {\r\n      let textNode = document.createTextNode(text);\r\n      element.appendChild(textNode);\r\n    }\r\n\r\n    // Add attributes\r\n    if (template.attr) {\r\n      let attributes = template.attr;\r\n      for (let name in attributes) {\r\n        let value = attributes[name];\r\n        if (value) {\r\n          element.setAttribute(name, value);\r\n        }\r\n      }\r\n    }\r\n\r\n    // Add style\r\n    if (template.style) {\r\n      let { style } = template;\r\n      for (let property in style) {\r\n        let value = style[property];\r\n        if (value) {\r\n          element.style[property] = value;\r\n        }\r\n      }\r\n    }\r\n\r\n    // Add properties\r\n    if (template.prop) {\r\n      for (let property in template.prop) {\r\n        let value = template.prop[property];\r\n        if (value) {\r\n          element[property] = value;\r\n        }\r\n      }\r\n    }\r\n\r\n    // Add event listeners\r\n    if (template.listeners) {\r\n      let { listeners } = template;\r\n      for (let type in listeners) {\r\n        element.addEventListener(type, listeners[type]);\r\n      }\r\n    }\r\n\r\n    // Add children\r\n    if (template.children) {\r\n      template.children.forEach((child) => {\r\n        element.appendChild(createFromObject(child, reference));\r\n      });\r\n    }\r\n\r\n    // Store elements in the object passed to our function\r\n    if (reference && template.name) {\r\n      reference[template.name] = element;\r\n    }\r\n\r\n    return element;\r\n  };\r\n\r\n  const createFromString = (str, handlers = []) => {\r\n    let createdElement = document\r\n      .createRange()\r\n      .createContextualFragment(str);\r\n\r\n    handlers.forEach((handler) => {\r\n      let el = createdElement.querySelector(handler.query);\r\n      el.addEventListener(handler.type, handler.callback);\r\n\r\n      if (handler.remove) {\r\n        el.removeAttribute(handler.attr);\r\n      }\r\n    });\r\n\r\n    return createdElement;\r\n  };\r\n\r\n  const objectToString = (template) => {\r\n    let {\r\n      type,\r\n      className,\r\n      id,\r\n      text,\r\n      attr,\r\n      style,\r\n      children,\r\n      listeners,\r\n    } = template;\r\n\r\n    let idStr = id ? ` id=\"${id}\" ` : '';\r\n    let classStr = className ? ` class=\"${className}\"` : '';\r\n\r\n    let styleStr = ` style=\"${Object.keys(style)\r\n      .map((type) => `${type}: ${style[type]};`)\r\n      .join(' ')}\"`;\r\n\r\n    let attrStr = Object.keys(attr)\r\n      .map((type) => `${type}=\"${attr[type]}\"`)\r\n      .join(' ');\r\n\r\n    let childrenStr = Array.isArray(children)\r\n      ? children.map((child) => objectToString(child)).join('\\n')\r\n      : '';\r\n\r\n    return `<${type}${idStr}${classStr}${attrStr}${styleStr}>\r\n      ${text || ''}${childrenStr}\r\n      </${type}>`;\r\n  };\r\n\r\n  const parseString = (strings, ...exprs) => {\r\n    let eventHandlers = [];\r\n\r\n    const _parser = (expr) => {\r\n      if (typeof expr === 'object') {\r\n        // If array, convert each item to one of the acceptable types\r\n        if (Array.isArray(expr)) {\r\n          return expr.map((item) => _parser(item)).join('');\r\n\r\n          // if parsedString (the Array-like object returned by parseString)\r\n          // add its eventHandlers to ours\r\n        } else if (expr._type && expr._type === 'parsedString') {\r\n          eventHandlers.push(...expr[1]);\r\n          return expr[0];\r\n\r\n          // if Object and that object contains only keys which name is an event\r\n          // generate a temporary id and replace the object with it\r\n          // then add the event listeners to our eventHandlers\r\n        } else if (\r\n          Object.keys(expr).every((prop) => prop.includes('on'))\r\n        ) {\r\n          let callbacks = expr;\r\n          let temporaryPlaceholder = '';\r\n          let temporaryId = `${_generateID()}${_generateID()}`;\r\n\r\n          for (let type in callbacks) {\r\n            eventHandlers.push({\r\n              type: type.replace('on', '').toLowerCase(),\r\n              query: `[data-tempId=\"${temporaryId}\"]`,\r\n              callback: callbacks[type],\r\n              attr: 'data-tempId',\r\n              remove: false,\r\n            });\r\n\r\n            temporaryPlaceholder += `data-tempId=\"${temporaryId}\"`;\r\n          }\r\n\r\n          eventHandlers[eventHandlers.length - 1].remove = true;\r\n\r\n          return temporaryPlaceholder;\r\n        }\r\n\r\n        // If the argument isn't one of the three object kinds above\r\n        // We assume it's an object with a specific structure\r\n        // so parse it with objectToString\r\n        return objectToString(expr);\r\n\r\n        // if string, just return it\r\n      } else if (typeof expr === 'string') {\r\n        return expr;\r\n\r\n        // otherwise we have an error\r\n        // we only accept objects and string\r\n      } else {\r\n        throw new Error('Invalid type');\r\n      }\r\n    };\r\n\r\n    let evaluatedExprs = exprs.map((expr) => _parser(expr));\r\n\r\n    let parsedString = evaluatedExprs.reduce(\r\n      (fullString, expr, i) =>\r\n        (fullString += `${expr}${strings[i + 1]}`),\r\n      strings[0]\r\n    );\r\n\r\n    let parsedObj = {\r\n      0: parsedString,\r\n      1: eventHandlers,\r\n      length: 2,\r\n      _type: 'parsedString',\r\n    };\r\n\r\n    Object.defineProperty(parsedObj, '_type', {\r\n      enumerable: false,\r\n    });\r\n\r\n    return parsedObj;\r\n  };\r\n\r\n  return {\r\n    parseString,\r\n    objectToString,\r\n    createFromObject,\r\n    createFromString,\r\n  };\r\n})();\r\n\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Component);\r\n\n\n//# sourceURL=webpack://todo/./src/component.js?");

/***/ }),

/***/ "./src/components/Footer.js":
/*!**********************************!*\
  !*** ./src/components/Footer.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__\n/* harmony export */ });\nconst Footer = () => {\r\n  return `\r\n  <footer>\r\n    <div>\r\n      Icons made by\r\n      <a href=\"https://www.freepik.com\" title=\"Freepik\">Freepik</a>,\r\n      <a href=\"\" title=\"Gregor Cresnar\">Gregor Cresnar</a>,\r\n      <a\r\n        href=\"https://www.flaticon.com/authors/good-ware\"\r\n        title=\"Good Ware\"\r\n        >Good Ware</a\r\n      >,\r\n      <a\r\n        href=\"https://www.flaticon.com/authors/google\"\r\n        title=\"Google\"\r\n        >Google</a\r\n      >, <a href=\"\" title=\"Those Icons\">Those Icons</a>,\r\n      <a href=\"https://www.flaticon.com/authors/bqlqn\" title=\"bqlqn\"\r\n        >bqlqn</a\r\n      >, and\r\n      <a href=\"https://creativemarket.com/Becris\" title=\"Becris\"\r\n        >Becris</a\r\n      >\r\n      from\r\n      <a href=\"https://www.flaticon.com/\" title=\"Flaticon\"\r\n        >www.flaticon.com</a\r\n      >\r\n    </div>\r\n    <p>Created by Shin Andrei Riego</p>\r\n  </footer>\r\n  `;\r\n};\r\n\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Footer);\r\n\n\n//# sourceURL=webpack://todo/./src/components/Footer.js?");

/***/ }),

/***/ "./src/components/Header.js":
/*!**********************************!*\
  !*** ./src/components/Header.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__\n/* harmony export */ });\n/* harmony import */ var _component_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../component.js */ \"./src/component.js\");\n\r\n\r\nconst Header = () => {\r\n  const showSidebar = (e) => {\r\n    e.target.classList.toggle('is-active');\r\n\r\n    let projects = document.getElementById('projects');\r\n    projects.classList.toggle('show');\r\n  };\r\n\r\n  return _component_js__WEBPACK_IMPORTED_MODULE_0__.default.parseString`\r\n  <header>\r\n    <ul>\r\n      <li>\r\n        <button ${{\r\n          onClick: showSidebar,\r\n        }}class=\"hamburger hamburger--slider-r\" type=\"button\">\r\n          <span class=\"hamburger-box\">\r\n            <span class=\"hamburger-inner\"></span>\r\n          </span>\r\n        </button>\r\n      </li>\r\n      <li><h1>ToDo</h1></li>\r\n    </ul>\r\n    <input\r\n      type=\"text\"\r\n      name=\"search\"\r\n      class=\"dark\"\r\n      id=\"search-bar\"\r\n      placeholder=\"Search your tasks\"\r\n    />\r\n  </header>\r\n  `;\r\n};\r\n\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Header);\r\n\n\n//# sourceURL=webpack://todo/./src/components/Header.js?");

/***/ }),

/***/ "./src/components/Icons.js":
/*!*********************************!*\
  !*** ./src/components/Icons.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__\n/* harmony export */ });\nconst Icons = (iconName) => {\r\n  let images = {\r\n    edit: `<img src=\"icons/edit.svg\" class=\"edit\" alt=\"edit\" />`,\r\n    tag: `<img src=\"icons/tag.svg\" class=\"icon\" alt=\"tag\" />`,\r\n    details: `<img src=\"icons/justify.svg\" class=\"icon\" alt=\"details\" />`,\r\n    calendar: `<img src=\"icons/date.svg\" class=\"icon\" alt=\"calendar\" />`,\r\n    delete: `<img src=\"icons/delete.svg\" class=\"delete\" alt=\"delete\" />`,\r\n    checkmark: `<img src=\"icons/check-mark.svg\" class=\"checkmark\" alt=\"checkmark\" />`,\r\n  };\r\n\r\n  return images[iconName];\r\n};\r\n\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Icons);\r\n\n\n//# sourceURL=webpack://todo/./src/components/Icons.js?");

/***/ }),

/***/ "./src/components/MainContent.js":
/*!***************************************!*\
  !*** ./src/components/MainContent.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__\n/* harmony export */ });\n/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../component */ \"./src/component.js\");\n/* harmony import */ var _Modal__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Modal */ \"./src/components/Modal.js\");\n\r\n\r\n\r\nconst MainContent = () => {\r\n  return _component__WEBPACK_IMPORTED_MODULE_0__.default.parseString`\r\n  <main>\r\n    <div id=\"taskbar\">\r\n      <button id=\"add-task\">+</button>\r\n    </div>\r\n    <div id=\"tasks-list\">\r\n      <div id=\"current-tasks\"></div>\r\n      <div id=\"completed-tasks\"></div>\r\n    </div>\r\n    ${(0,_Modal__WEBPACK_IMPORTED_MODULE_1__.default)()}\r\n  </main>\r\n  `;\r\n};\r\n\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MainContent);\r\n\n\n//# sourceURL=webpack://todo/./src/components/MainContent.js?");

/***/ }),

/***/ "./src/components/Modal.js":
/*!*********************************!*\
  !*** ./src/components/Modal.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__\n/* harmony export */ });\n/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../component */ \"./src/component.js\");\n/* harmony import */ var _helpers_getElement__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers/getElement */ \"./src/helpers/getElement.js\");\n\r\n\r\n\r\nconst Modal = () => {\r\n  const closeModal = (e) => {\r\n    (0,_helpers_getElement__WEBPACK_IMPORTED_MODULE_1__.default)('#modal').style.display = 'none';\r\n    (0,_helpers_getElement__WEBPACK_IMPORTED_MODULE_1__.default)('#modalContent').innerHTML = '';\r\n    e.stopPropagation();\r\n  };\r\n\r\n  return _component__WEBPACK_IMPORTED_MODULE_0__.default.parseString`\r\n  <div class=\"modal-backdrop\">\r\n    <div id=\"modal\">\r\n      <span class=\"close\" ${{ onClick: closeModal }}>&times;</span>\r\n      <div id=\"modal-content\"></div>\r\n    </div>\r\n  </div>\r\n  `;\r\n};\r\n\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Modal);\r\n\n\n//# sourceURL=webpack://todo/./src/components/Modal.js?");

/***/ }),

/***/ "./src/components/ProjectLi.js":
/*!*************************************!*\
  !*** ./src/components/ProjectLi.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__\n/* harmony export */ });\n/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../component */ \"./src/component.js\");\n\r\n\r\nconst ProjectLi = (proj, { selectProject }) => {\r\n  return _component__WEBPACK_IMPORTED_MODULE_0__.default.parseString`\r\n  <li id=${proj.id} ${{\r\n    onClick: () => {\r\n      selectProject(proj.id);\r\n    },\r\n  }}>\r\n    ${proj.name}\r\n  </li>\r\n  `;\r\n};\r\n\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ProjectLi);\r\n\n\n//# sourceURL=webpack://todo/./src/components/ProjectLi.js?");

/***/ }),

/***/ "./src/components/Sidebar.js":
/*!***********************************!*\
  !*** ./src/components/Sidebar.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__\n/* harmony export */ });\n/* harmony import */ var _component_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../component.js */ \"./src/component.js\");\n/* harmony import */ var _ProjectLi__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ProjectLi */ \"./src/components/ProjectLi.js\");\n\r\n\r\n\r\nconst Sidebar = ({\r\n  projects,\r\n  getAllTasks,\r\n  getDueToday,\r\n  getDueThisWeek,\r\n  getUpcoming,\r\n  createNewProject,\r\n  selectProject,\r\n}) => {\r\n  return _component_js__WEBPACK_IMPORTED_MODULE_0__.default.parseString`\r\n  <aside id=\"projects\">\r\n    <div>\r\n      <ul id=\"default-proj\">\r\n        <li ${{ onClick: getAllTasks }}>All Tasks</li>\r\n        <li>Today</li>\r\n        <li>This Week</li>\r\n        <li>Upcoming</li>\r\n      </ul>\r\n      <br />\r\n    </div>\r\n    <div>\r\n      <form ${{ onSubmit: createNewProject }}>\r\n        <input\r\n          type=\"text\"\r\n          name=\"new-project\"\r\n          class=\"dark\"\r\n          id=\"new-proj\"\r\n          placeholder=\"Create New Project\"\r\n        />\r\n        <button type=\"submit\">+</button>\r\n      </form>\r\n      <br />\r\n      <ul id=\"user-proj\">\r\n        ${\r\n          projects\r\n            ? projects.map((proj) =>\r\n                (0,_ProjectLi__WEBPACK_IMPORTED_MODULE_1__.default)(proj, { selectProject })\r\n              )\r\n            : ''\r\n        }\r\n      </ul>\r\n    </div>\r\n  </aside>\r\n  `;\r\n};\r\n\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Sidebar);\r\n\n\n//# sourceURL=webpack://todo/./src/components/Sidebar.js?");

/***/ }),

/***/ "./src/components/TaskCard.js":
/*!************************************!*\
  !*** ./src/components/TaskCard.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__\n/* harmony export */ });\n/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../component */ \"./src/component.js\");\n/* harmony import */ var _Icons__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Icons */ \"./src/components/Icons.js\");\n\r\n\r\n\r\nconst TaskCard = ({ id, onDelete, onEdit, toggleCheckmark }) => {\r\n  return _component__WEBPACK_IMPORTED_MODULE_0__.default.parseString`\r\n  <div id=\"${id}\" \"class=\"task\" draggable=\"true\">\r\n    <div class=\"actions\">\r\n      <button>${(0,_Icons__WEBPACK_IMPORTED_MODULE_1__.default)('edit')}</button>\r\n      <button ${{ onClick: onDelete }}>${(0,_Icons__WEBPACK_IMPORTED_MODULE_1__.default)('delete')}</button>\r\n    </div>\r\n    <div class=\"checkbox\">\r\n      <div ${{\r\n        onClick: toggleCheckmark,\r\n      }} class=\"check\">${(0,_Icons__WEBPACK_IMPORTED_MODULE_1__.default)('checkmark')}</div>\r\n    </div>\r\n    <div class=\"brief-content\">\r\n      <div class=\"label-chips\"></div>\r\n      <p>Title</p>\r\n      <div class=\"badges\"></div>\r\n    </div>\r\n  </div>  \r\n  `;\r\n};\r\n\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (TaskCard);\r\n\n\n//# sourceURL=webpack://todo/./src/components/TaskCard.js?");

/***/ }),

/***/ "./src/helpers/getElement.js":
/*!***********************************!*\
  !*** ./src/helpers/getElement.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__\n/* harmony export */ });\nconst $ = (query) => {\r\n  let queryIsId = query.includes('#');\r\n  let queryIsAll = query.includes('--all');\r\n\r\n  if (queryIsId) {\r\n    return document.getElementById(query.replace('#', ''));\r\n  } else if (queryIsAll) {\r\n    return document.querySelectorAll(query.replace('--all', ''));\r\n  }\r\n\r\n  return document.querySelector(query);\r\n};\r\n\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ($);\r\n\n\n//# sourceURL=webpack://todo/./src/helpers/getElement.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./component */ \"./src/component.js\");\n/* harmony import */ var _components_Header__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/Header */ \"./src/components/Header.js\");\n/* harmony import */ var _components_MainContent__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/MainContent */ \"./src/components/MainContent.js\");\n/* harmony import */ var _components_Sidebar__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/Sidebar */ \"./src/components/Sidebar.js\");\n/* harmony import */ var _components_Footer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/Footer */ \"./src/components/Footer.js\");\n/* harmony import */ var _ProjectController__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./ProjectController */ \"./src/ProjectController.js\");\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\nconst App = () => {\r\n  return _component__WEBPACK_IMPORTED_MODULE_0__.default.createFromString(\r\n    ...Array.from(_component__WEBPACK_IMPORTED_MODULE_0__.default.parseString`\r\n      ${(0,_components_Header__WEBPACK_IMPORTED_MODULE_1__.default)()}\r\n      ${(0,_components_Sidebar__WEBPACK_IMPORTED_MODULE_3__.default)({\r\n        selectProject: _ProjectController__WEBPACK_IMPORTED_MODULE_5__.selectProject,\r\n        createNewProject: _ProjectController__WEBPACK_IMPORTED_MODULE_5__.createNewProject,\r\n        getAllTasks: _ProjectController__WEBPACK_IMPORTED_MODULE_5__.selectAllTasks,\r\n        projects: (0,_ProjectController__WEBPACK_IMPORTED_MODULE_5__.getProjectsDetails)(),\r\n      })}\r\n      ${(0,_components_MainContent__WEBPACK_IMPORTED_MODULE_2__.default)()}\r\n      ${(0,_components_Footer__WEBPACK_IMPORTED_MODULE_4__.default)()}\r\n    `)\r\n  );\r\n};\r\n\r\ndocument.body.prepend(App());\r\n\n\n//# sourceURL=webpack://todo/./src/index.js?");

/***/ }),

/***/ "./src/list.js":
/*!*********************!*\
  !*** ./src/list.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__\n/* harmony export */ });\n/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! uuid */ \"./node_modules/uuid/dist/esm-browser/v4.js\");\n\r\n\r\nconst List = (name, type, defaultItems = []) => {\r\n  let items = [...defaultItems];\r\n  let length = 0;\r\n  let listType = type;\r\n  let listName = name;\r\n  let id = (0,uuid__WEBPACK_IMPORTED_MODULE_0__.default)();\r\n\r\n  const addItem = (item) => {\r\n    if (Array.isArray(item)) {\r\n      items.push(...item);\r\n    } else {\r\n      items.push(item);\r\n    }\r\n    length = items.length;\r\n  };\r\n\r\n  const getItem = (condition) => {\r\n    return items.find(condition);\r\n  };\r\n\r\n  const removeItems = (condition) => {\r\n    items = items.filter((item) => condition(item));\r\n    length = items.length;\r\n  };\r\n\r\n  const removeAll = () => {\r\n    items = [];\r\n    length = 0;\r\n  };\r\n\r\n  const sortItems = (condition) => {\r\n    items.sort((a, b) => {\r\n      if (condition(a, b)) return 1;\r\n      return -1;\r\n    });\r\n  };\r\n\r\n  const filterItems = (condition) => {\r\n    return items.filter((item) => condition(item));\r\n  };\r\n\r\n  let listObj = {\r\n    id,\r\n    listName,\r\n    listType,\r\n    addItem,\r\n    getItem,\r\n    removeItems,\r\n    removeAll,\r\n    sortItems,\r\n    filterItems,\r\n  };\r\n\r\n  Object.defineProperty(listObj, 'id', {\r\n    writable: false,\r\n  });\r\n  Object.defineProperty(listObj, 'listName', {\r\n    writable: false,\r\n  });\r\n  Object.defineProperty(listObj, 'listType', {\r\n    writable: false,\r\n  });\r\n\r\n  return listObj;\r\n};\r\n\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (List);\r\n\n\n//# sourceURL=webpack://todo/./src/list.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__("./src/index.js");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;