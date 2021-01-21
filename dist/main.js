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

/***/ "./src/component.js":
/*!**************************!*\
  !*** ./src/component.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__\n/* harmony export */ });\nconst Component = (() => {\r\n  const createFromObject = (template, reference = null) => {\r\n    let element, type, text;\r\n    let id, className;\r\n\r\n    const _checkForClass = (type) => {\r\n      try {\r\n        let _className = '';\r\n        let _type = type;\r\n\r\n        _className = type.match(/(\\.\\w+)/g);\r\n        _className.forEach((cls) => {\r\n          _type = _type.replace(cls, '');\r\n        });\r\n        className = _className\r\n          .map((cls) => cls.replace('.', ''))\r\n          .join(' ');\r\n\r\n        return _type;\r\n      } catch (error) {\r\n        className = template.className;\r\n\r\n        return type;\r\n      }\r\n    };\r\n\r\n    const _checkForId = (type) => {\r\n      try {\r\n        let _id = '';\r\n        let _type = type;\r\n\r\n        _id = _type.match(/#(\\w+)/)[1];\r\n        _type = _type.replace(`#${_id}`, '');\r\n        id = _id;\r\n\r\n        return _type;\r\n      } catch (error) {\r\n        id = template.id;\r\n\r\n        return type;\r\n      }\r\n    };\r\n\r\n    /*\r\n      Special properties paragraph, span, link\r\n      Example: \r\n        {\r\n          paragraph: 'Text',\r\n        } \r\n        or\r\n        {\r\n          type: 'p',\r\n          text: 'Text',\r\n        }\r\n        creates <p>Text</p>\r\n      */\r\n    if (template.type) {\r\n      type = template.type;\r\n      type = _checkForClass(type);\r\n      type = _checkForId(type);\r\n\r\n      text = template.text || '';\r\n    } else if (template.paragraph) {\r\n      type = 'p';\r\n      text = template.paragraph;\r\n    } else if (template.span) {\r\n      type = 'span';\r\n      text = template.span;\r\n    } else if (template.link) {\r\n      type = 'a';\r\n      text = template.link;\r\n    }\r\n\r\n    // Create element\r\n    if (type === 'fragment') {\r\n      element = document.createDocumentFragment();\r\n    } else {\r\n      element = document.createElement(type);\r\n    }\r\n\r\n    // Add classes\r\n    if (className) {\r\n      let classes = className.split(' ');\r\n      element.classList.add(...classes);\r\n    }\r\n\r\n    // Add id\r\n    if (id) {\r\n      element.id = id;\r\n    }\r\n\r\n    // Add text\r\n    if (text) {\r\n      let textNode = document.createTextNode(text);\r\n      element.appendChild(textNode);\r\n    }\r\n\r\n    // Add attributes\r\n    if (template.attr) {\r\n      let attributes = template.attr;\r\n      for (let name in attributes) {\r\n        let value = attributes[name];\r\n        if (value) {\r\n          element.setAttribute(name, value);\r\n        }\r\n      }\r\n    }\r\n\r\n    // Add style\r\n    if (template.style) {\r\n      let { style } = template;\r\n      for (let property in style) {\r\n        let value = style[property];\r\n        if (value) {\r\n          element.style[property] = value;\r\n        }\r\n      }\r\n    }\r\n\r\n    // Add properties\r\n    if (template.prop) {\r\n      for (let property in template.prop) {\r\n        let value = template.prop[property];\r\n        if (value) {\r\n          element[property] = value;\r\n        }\r\n      }\r\n    }\r\n\r\n    // Add event listeners\r\n    if (template.listeners) {\r\n      let { listeners } = template;\r\n      for (let type in listeners) {\r\n        element.addEventListener(type, listeners[type]);\r\n      }\r\n    }\r\n\r\n    // Add children\r\n    if (template.children) {\r\n      template.children.forEach((child) => {\r\n        element.appendChild(createFromObject(child, reference));\r\n      });\r\n    }\r\n\r\n    // Store elements in the object passed to our function\r\n    if (reference && template.name) {\r\n      reference[template.name] = element;\r\n    }\r\n\r\n    return element;\r\n  };\r\n\r\n  const createFromString = (str, handlers = []) => {\r\n    let createdElement = document\r\n      .createRange()\r\n      .createContextualFragment(str);\r\n\r\n    handlers.forEach((handler) => {\r\n      let el = createdElement.querySelector(handler.query);\r\n      el.addEventListener(handler.type, handler.callback);\r\n\r\n      if (handler.remove) {\r\n        el.removeAttribute(handler.attr);\r\n      }\r\n    });\r\n\r\n    return createdElement;\r\n  };\r\n\r\n  const objectToString = (template) => {\r\n    let {\r\n      type,\r\n      className,\r\n      id,\r\n      text,\r\n      attr,\r\n      style,\r\n      children,\r\n      listeners,\r\n    } = template;\r\n\r\n    let idStr = id ? ` id=\"${id}\" ` : '';\r\n    let classStr = className ? ` class=\"${className}\"` : '';\r\n\r\n    let styleStr = ` style=\"${Object.keys(style)\r\n      .map((type) => `${type}: ${style[type]};`)\r\n      .join(' ')}\"`;\r\n\r\n    let attrStr = Object.keys(attr)\r\n      .map((type) => `${type}=\"${attr[type]}\"`)\r\n      .join(' ');\r\n\r\n    let childrenStr = Array.isArray(children)\r\n      ? children.map((child) => objectToString(child)).join('\\n')\r\n      : '';\r\n\r\n    return `<${type}${idStr}${classStr}${attrStr}${styleStr}>\r\n      ${text || ''}${childrenStr}\r\n      </${type}>`;\r\n  };\r\n\r\n  const parseString = (strings, ...exprs) => {\r\n    let eventHandlers = [];\r\n\r\n    const _randNo = (seed) => Math.floor(Math.random() * seed);\r\n\r\n    const _generateID = () =>\r\n      `${_randNo(10)}${_randNo(10)}${_randNo(50)}`;\r\n\r\n    const _parser = (expr) => {\r\n      if (typeof expr === 'object') {\r\n        if (Array.isArray(expr)) {\r\n          return expr.map((item) => _parser(item)).join('');\r\n        } else if (expr._type && expr._type === 'parsedString') {\r\n          eventHandlers.push(...expr[1]);\r\n          return expr[0];\r\n        } else if (\r\n          Object.keys(expr).every((prop) => prop.includes('on'))\r\n        ) {\r\n          let callbacks = expr;\r\n          let temporaryPlaceholder = '';\r\n\r\n          for (let type in callbacks) {\r\n            let callbackId = `${type}${_generateID()}`;\r\n\r\n            eventHandlers.push({\r\n              type: type.replace('on', '').toLowerCase(),\r\n              query: `[data-tempId=\"${callbackId}\"]`,\r\n              callback: callbacks[type],\r\n              attr: 'data-tempId',\r\n              remove: true,\r\n            });\r\n\r\n            temporaryPlaceholder += `data-tempId=\"${callbackId}\"`;\r\n          }\r\n\r\n          return temporaryPlaceholder;\r\n        }\r\n\r\n        return objectToString(expr);\r\n      }\r\n\r\n      return expr;\r\n    };\r\n\r\n    let evaluatedExprs = exprs.map((expr) => _parser(expr));\r\n\r\n    let parsedString = evaluatedExprs.reduce(\r\n      (fullString, expr, i) =>\r\n        (fullString += `${expr}${strings[i + 1]}`),\r\n      strings[0]\r\n    );\r\n\r\n    let parsedObj = {\r\n      0: parsedString,\r\n      1: eventHandlers,\r\n      _type: 'parsedString',\r\n    };\r\n\r\n    Object.defineProperty(parsedObj, '_type', {\r\n      enumerable: false,\r\n    });\r\n\r\n    return parsedObj;\r\n  };\r\n\r\n  return {\r\n    parseString,\r\n    objectToString,\r\n    createFromObject,\r\n    createFromString,\r\n  };\r\n})();\r\n\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Component);\r\n\n\n//# sourceURL=webpack://todo/./src/component.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _component_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./component.js */ \"./src/component.js\");\n\r\n\r\n\r\nconst root = document.getElementById('root');\r\n\r\nconst App = (() => {\r\n  const render = () => {\r\n    return _component_js__WEBPACK_IMPORTED_MODULE_0__.default.createFromString(\r\n      Array.from(\r\n        ..._component_js__WEBPACK_IMPORTED_MODULE_0__.default.parseString`\r\n      <header>\r\n        <h1>ToDo</h1>\r\n        <input type=\"text\" name=\"search\" ${{\r\n          onKeydown: 'searchTasks',\r\n        }} />\r\n      </header>\r\n      \r\n      <main>\r\n        <div class=\"container\">\r\n          <div id=\"taskbar\">\r\n            <button ${{ onClick: 'addTask' }}>Add Task</button>\r\n          </div>\r\n          <div id=\"tasks-list\">\r\n            <div id=\"current-tasks\"></div>\r\n            <div id=\"completed-tasks\"></div>\r\n          </div>\r\n        </div>\r\n      </main>\r\n\r\n      <aside>\r\n        <div id=\"projects\">\r\n          <button ${{ onClick: 'addProject' }}>Add Project</button>\r\n          <div id=\"def-proj\">\r\n            <ul>\r\n              <li>\r\n              <button ${{\r\n                onClick: 'getAll',\r\n              }}>All Tasks</button>All</li>\r\n              <li><button ${{\r\n                onClick: 'getDueToday',\r\n              }}>Today/<button>All</li>\r\n              <li><button ${{\r\n                onClick: 'getDueThisWeek',\r\n              }}>This Week</button>All</li>\r\n              <li><button ${{\r\n                onClick: 'getUpcoming',\r\n              }}>Upcoming</button>All</li>\r\n            </ul>\r\n          </div>\r\n          <div id=\"user-proj\">\r\n            <ul></ul>\r\n          </div>\r\n        </div>\r\n      </aside>\r\n\r\n      <div id=\"modal\"></div>\r\n\r\n      <footer>\r\n        <p>Created by Shin Andrei Riego</p>\r\n      </footer>\r\n      `\r\n      )\r\n    );\r\n  };\r\n\r\n  return {\r\n    render,\r\n  };\r\n})();\r\n\n\n//# sourceURL=webpack://todo/./src/index.js?");

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