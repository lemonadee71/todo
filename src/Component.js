class Component {
  // add a private field or static variable for template
  // this is for rerender

  constructor(cls = '', type = 'div') {
    this.element = document.createElement(type);
    this.element.className = cls;
    this.elements = {};
  }

  show() {
    this.element.style.display = 'block';
  }

  hide() {
    this.element.style.display = 'none';
  }

  reset() {
    [...this.element.children].map((el) => el.remove());
  }

  destroy() {
    this.element.remove();
  }

  on(event, callback) {
    if (typeof event === 'object') {
      event.forEach((type) => {
        this.element.addEventListener(type, callback);
      });
    } else {
      this.element.addEventListener(event, callback);
    }
  }

  addListener(name, type, callback) {
    this.elements[name].addEventListener(type, callback);
  }

  create(template) {
    for (let el in template) {
      this.addElement(template[el], el);
    }

    return this.element;
  }

  insertElement(element, position, target) {
    if (position === 'before') {
      this.elements[target].before(element);
    } else if (position === 'after') {
      this.elements[target].after(element);
    } else if (position === 'inside') {
      this.elements[target].appendChild(element);
    }
  }

  addElement(template, name) {
    let createdElement = this.makeElement(template);
    if (name) {
      this.elements[name] = createdElement;
    }

    if (template.before) {
      this.insertElement(createdElement, 'before', template.before);
    } else if (template.after) {
      this.insertElement(createdElement, 'after', template.after);
    } else if (template.inside) {
      this.insertElement(createdElement, 'inside', template.inside);
    } else {
      this.element.appendChild(createdElement);
    }
  }

  // make this static
  makeElement(template) {
    try {
      let element, type, text;

      if (template.type) {
        type = template.type;
        text = template.text || '';
      } else if (template.paragraph) {
        type = 'p';
        text = template.paragraph;
      } else if (template.span) {
        type = 'span';
        text = template.span;
      } else if (template.link) {
        type = 'a';
        text = template.link;
      }

      element = document.createElement(type);

      // Add class
      if (template.className) {
        let classes = template.className.split(' ');
        element.classList.add(...classes);
      }

      // Add id
      if (template.id) {
        element.id = template.id;
      }

      // Add text
      if (text) {
        let textNode = document.createTextNode(text);
        element.appendChild(textNode);
      }

      // Add attributes
      if (template.attr) {
        let attributes = template.attr;
        for (let attr in attributes) {
          if (attributes[attr]) {
            element.setAttribute(attr, attributes[attr]);
          }
        }
      }

      // Add style
      if (template.style) {
        for (let st in template.style) {
          let s = !st.includes('-')
            ? st
            : st.split('-').reduce((prev, current, i) => {
                if (i > 0) {
                  return (
                    prev +
                    current.charAt(0).toUpperCase() +
                    current.slice(1)
                  );
                }
                return current;
              }, '');
          element.style[s] = template.style[st];
        }
      }

      // Add properties
      if (template.prop) {
        for (let pr in template.prop) {
          element[pr] = template.prop[pr];
        }
      }

      // Add listeners
      if (template.callback) {
        let callbacks = template.callback;
        for (let type in callbacks) {
          element.addEventListener(type, callbacks[type]);
        }
      }

      // Add children
      if (template.children) {
        template.children.forEach((child) => {
          element.appendChild(this.makeElement(child));
        });
      }

      // Store
      if (template.name) {
        this.elements[template.name] = element;
      }

      return element;
    } catch (error) {
      throw error;
    }
  }

  static render(root, ...children) {
    children.forEach((child) => {
      let childEl;
      if (
        child.type instanceof Component &&
        child.type.hasOwnProperty('render')
      ) {
        childEl = child.props
          ? child.type.render(child.props)
          : child.type.render();
      }
      root.appendChild(childEl);
    });
  }
}

export default Component;
