class Component {
  // add a private field or static variable for template
  // this is for rerender

  constructor(className = '', type = 'div', props = {}) {
    this.element = document.createElement(type);
    this.element.className = className;
    this.elements = {};
    this.blueprint = {};
    this.props = props;
  }

  create(blueprint, store = true) {
    this.blueprint = blueprint;
    for (let element in blueprint) {
      this.addElement(blueprint[element], element, store);
    }

    return this.element;
  }

  show() {
    this.element.style.display = 'block';
  }

  hide() {
    this.element.style.display = 'none';
  }

  clear() {
    [...this.element.children].map((el) => el.remove());
  }

  reset(newBlueprint = null) {
    this.clear();
    this.create(newBlueprint || this.blueprint);
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

  insertElement(element, position, target) {
    if (position === 'before') {
      this.elements[target].before(element);
    } else if (position === 'after') {
      this.elements[target].after(element);
    } else if (position === 'inside') {
      this.elements[target].appendChild(element);
    }
  }

  addElement(template, name = '', store = false) {
    let element = Component.createElement(
      template,
      store ? this.elements : null
    );
    if (store && name) {
      this.elements[name] = element;
    }

    let target = template.before || template.after || template.inside;
    if (template.before) {
      this.insertElement(element, 'before', target);
    } else if (template.after) {
      this.insertElement(element, 'after', target);
    } else if (template.inside) {
      this.insertElement(element, 'inside', target);
    } else {
      this.element.appendChild(element);
    }
  }

  // make this static
  static createElement(template, reference = null) {
    let element, type, text;

    /*
      Special properties paragraph, span, link
      Example: 
        {
          paragraph: 'Text',
        } 
        or
        {
          type: 'p',
          text: 'Text',
        }
        creates <p>Text</p>
      */
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

    // Create element
    element = document.createElement(type);

    // Add classes
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
      for (let name in attributes) {
        let value = attributes[name];
        if (value) {
          element.setAttribute(name, value);
        }
      }
    }

    // Add style
    if (template.style) {
      let { style } = template;
      for (let property in style) {
        element.style[property] = style[property];
      }
    }

    // Add properties
    if (template.prop) {
      for (let property in template.prop) {
        element[property] = template.prop[property];
      }
    }

    // Add event listeners
    if (template.listeners) {
      let { listeners } = template;
      for (let type in listeners) {
        element.addEventListener(type, listeners[type]);
      }
    }

    // Add children
    if (template.children) {
      template.children.forEach((child) => {
        element.appendChild(
          Component.createElement(child, reference)
        );
      });
    }

    // Store elements in the object passed to our function
    if (reference && template.name) {
      reference[template.name] = element;
    }

    return element;
  }

  static render(root, ...children) {
    children.forEach((child) => {
      if (child instanceof Component || typeof child === 'object') {
        let template =
          child instanceof Component ? child.render() : child;

        for (let element in template) {
          let createdElement = Component.createElement(
            template[element]
          );
          root.appendChild(createdElement);
        }
      }
    });
  }

  static repeat(item, times) {
    let arr;
    for (let i = 0; i < times; i++) {
      arr.push(item);
    }
    return arr;
  }
}

export default Component;
