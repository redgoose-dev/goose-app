const propMap = {
  class: "className",
  contenteditable: "contentEditable",
  for: "htmlFor",
  readonly: "readOnly",
  maxlength: "maxLength",
  tabindex: "tabIndex",
  colspan: "colSpan",
  rowspan: "rowSpan",
  usemap: "useMap"
};
function attempt(fn2, arg) {
  try {
    return fn2(arg);
  } catch (_a) {
    return arg;
  }
}
const doc = document, win = window, docEle = doc.documentElement, createElement = doc.createElement.bind(doc), div = createElement("div"), table = createElement("table"), tbody = createElement("tbody"), tr = createElement("tr"), { isArray, prototype: ArrayPrototype } = Array, { concat, filter, indexOf, map, push, slice, some, splice } = ArrayPrototype;
const idRe = /^#(?:[\w-]|\\.|[^\x00-\xa0])*$/, classRe = /^\.(?:[\w-]|\\.|[^\x00-\xa0])*$/, htmlRe = /<.+>/, tagRe = /^\w+$/;
function find(selector, context) {
  const isFragment = isDocumentFragment(context);
  return !selector || !isFragment && !isDocument(context) && !isElement(context) ? [] : !isFragment && classRe.test(selector) ? context.getElementsByClassName(selector.slice(1)) : !isFragment && tagRe.test(selector) ? context.getElementsByTagName(selector) : context.querySelectorAll(selector);
}
class Cash {
  constructor(selector, context) {
    if (!selector)
      return;
    if (isCash(selector))
      return selector;
    let eles = selector;
    if (isString(selector)) {
      const ctx = (isCash(context) ? context[0] : context) || doc;
      eles = idRe.test(selector) && "getElementById" in ctx ? ctx.getElementById(selector.slice(1)) : htmlRe.test(selector) ? parseHTML(selector) : find(selector, ctx);
      if (!eles)
        return;
    } else if (isFunction(selector)) {
      return this.ready(selector);
    }
    if (eles.nodeType || eles === win)
      eles = [eles];
    this.length = eles.length;
    for (let i = 0, l = this.length; i < l; i++) {
      this[i] = eles[i];
    }
  }
  init(selector, context) {
    return new Cash(selector, context);
  }
}
const fn = Cash.prototype, cash = fn.init;
cash.fn = cash.prototype = fn;
fn.length = 0;
fn.splice = splice;
if (typeof Symbol === "function") {
  fn[Symbol["iterator"]] = ArrayPrototype[Symbol["iterator"]];
}
fn.map = function(callback) {
  return cash(concat.apply([], map.call(this, (ele, i) => callback.call(ele, i, ele))));
};
fn.slice = function(start, end) {
  return cash(slice.call(this, start, end));
};
const dashAlphaRe = /-([a-z])/g;
function camelCase(str) {
  return str.replace(dashAlphaRe, (match, letter) => letter.toUpperCase());
}
cash.guid = 1;
function matches(ele, selector) {
  const matches2 = ele && (ele["matches"] || ele["webkitMatchesSelector"] || ele["msMatchesSelector"]);
  return !!matches2 && !!selector && matches2.call(ele, selector);
}
function isCash(x) {
  return x instanceof Cash;
}
function isWindow(x) {
  return !!x && x === x.window;
}
function isDocument(x) {
  return !!x && x.nodeType === 9;
}
function isDocumentFragment(x) {
  return !!x && x.nodeType === 11;
}
function isElement(x) {
  return !!x && x.nodeType === 1;
}
function isBoolean(x) {
  return typeof x === "boolean";
}
function isFunction(x) {
  return typeof x === "function";
}
function isString(x) {
  return typeof x === "string";
}
function isUndefined(x) {
  return x === void 0;
}
function isNull(x) {
  return x === null;
}
function isNumeric(x) {
  return !isNaN(parseFloat(x)) && isFinite(x);
}
function isPlainObject(x) {
  if (typeof x !== "object" || x === null)
    return false;
  const proto = Object.getPrototypeOf(x);
  return proto === null || proto === Object.prototype;
}
cash.isWindow = isWindow;
cash.isFunction = isFunction;
cash.isArray = isArray;
cash.isNumeric = isNumeric;
cash.isPlainObject = isPlainObject;
fn.get = function(index) {
  if (isUndefined(index))
    return slice.call(this);
  index = Number(index);
  return this[index < 0 ? index + this.length : index];
};
fn.eq = function(index) {
  return cash(this.get(index));
};
fn.first = function() {
  return this.eq(0);
};
fn.last = function() {
  return this.eq(-1);
};
function each(arr, callback, _reverse) {
  if (_reverse) {
    let i = arr.length;
    while (i--) {
      if (callback.call(arr[i], i, arr[i]) === false)
        return arr;
    }
  } else if (isPlainObject(arr)) {
    const keys = Object.keys(arr);
    for (let i = 0, l = keys.length; i < l; i++) {
      const key = keys[i];
      if (callback.call(arr[key], key, arr[key]) === false)
        return arr;
    }
  } else {
    for (let i = 0, l = arr.length; i < l; i++) {
      if (callback.call(arr[i], i, arr[i]) === false)
        return arr;
    }
  }
  return arr;
}
cash.each = each;
fn.each = function(callback) {
  return each(this, callback);
};
fn.prop = function(prop, value) {
  if (!prop)
    return;
  if (isString(prop)) {
    prop = propMap[prop] || prop;
    if (arguments.length < 2)
      return this[0] && this[0][prop];
    return this.each((i, ele) => {
      ele[prop] = value;
    });
  }
  for (const key in prop) {
    this.prop(key, prop[key]);
  }
  return this;
};
fn.removeProp = function(prop) {
  return this.each((i, ele) => {
    delete ele[propMap[prop] || prop];
  });
};
function extend(...sources) {
  const deep = isBoolean(sources[0]) ? sources.shift() : false, target = sources.shift(), length = sources.length;
  if (!target)
    return {};
  if (!length)
    return extend(deep, cash, target);
  for (let i = 0; i < length; i++) {
    const source = sources[i];
    for (const key in source) {
      if (deep && (isArray(source[key]) || isPlainObject(source[key]))) {
        if (!target[key] || target[key].constructor !== source[key].constructor)
          target[key] = new source[key].constructor();
        extend(deep, target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
  }
  return target;
}
cash.extend = extend;
fn.extend = function(plugins) {
  return extend(fn, plugins);
};
function getCompareFunction(comparator) {
  return isString(comparator) ? (i, ele) => matches(ele, comparator) : isFunction(comparator) ? comparator : isCash(comparator) ? (i, ele) => comparator.is(ele) : !comparator ? () => false : (i, ele) => ele === comparator;
}
fn.filter = function(comparator) {
  const compare = getCompareFunction(comparator);
  return cash(filter.call(this, (ele, i) => compare.call(ele, i, ele)));
};
function filtered(collection, comparator) {
  return !comparator ? collection : collection.filter(comparator);
}
const splitValuesRe = /\S+/g;
function getSplitValues(str) {
  return isString(str) ? str.match(splitValuesRe) || [] : [];
}
fn.hasClass = function(cls) {
  return !!cls && some.call(this, (ele) => isElement(ele) && ele.classList.contains(cls));
};
fn.removeAttr = function(attr2) {
  const attrs = getSplitValues(attr2);
  return this.each((i, ele) => {
    if (!isElement(ele))
      return;
    each(attrs, (i2, a) => {
      ele.removeAttribute(a);
    });
  });
};
function attr(attr2, value) {
  if (!attr2)
    return;
  if (isString(attr2)) {
    if (arguments.length < 2) {
      if (!this[0] || !isElement(this[0]))
        return;
      const value2 = this[0].getAttribute(attr2);
      return isNull(value2) ? void 0 : value2;
    }
    if (isUndefined(value))
      return this;
    if (isNull(value))
      return this.removeAttr(attr2);
    return this.each((i, ele) => {
      if (!isElement(ele))
        return;
      ele.setAttribute(attr2, value);
    });
  }
  for (const key in attr2) {
    this.attr(key, attr2[key]);
  }
  return this;
}
fn.attr = attr;
fn.toggleClass = function(cls, force) {
  const classes = getSplitValues(cls), isForce = !isUndefined(force);
  return this.each((i, ele) => {
    if (!isElement(ele))
      return;
    each(classes, (i2, c) => {
      if (isForce) {
        force ? ele.classList.add(c) : ele.classList.remove(c);
      } else {
        ele.classList.toggle(c);
      }
    });
  });
};
fn.addClass = function(cls) {
  return this.toggleClass(cls, true);
};
fn.removeClass = function(cls) {
  if (arguments.length)
    return this.toggleClass(cls, false);
  return this.attr("class", "");
};
function pluck(arr, prop, deep, until) {
  const plucked = [], isCallback = isFunction(prop), compare = until && getCompareFunction(until);
  for (let i = 0, l = arr.length; i < l; i++) {
    if (isCallback) {
      const val2 = prop(arr[i]);
      if (val2.length)
        push.apply(plucked, val2);
    } else {
      let val2 = arr[i][prop];
      while (val2 != null) {
        if (until && compare(-1, val2))
          break;
        plucked.push(val2);
        val2 = deep ? val2[prop] : null;
      }
    }
  }
  return plucked;
}
function unique(arr) {
  return arr.length > 1 ? filter.call(arr, (item, index, self) => indexOf.call(self, item) === index) : arr;
}
cash.unique = unique;
fn.add = function(selector, context) {
  return cash(unique(this.get().concat(cash(selector, context).get())));
};
function computeStyle(ele, prop, isVariable) {
  if (!isElement(ele))
    return;
  const style2 = win.getComputedStyle(ele, null);
  return isVariable ? style2.getPropertyValue(prop) || void 0 : style2[prop] || ele.style[prop];
}
function computeStyleInt(ele, prop) {
  return parseInt(computeStyle(ele, prop), 10) || 0;
}
const cssVariableRe = /^--/;
function isCSSVariable(prop) {
  return cssVariableRe.test(prop);
}
const prefixedProps = {}, { style } = div, vendorsPrefixes = ["webkit", "moz", "ms"];
function getPrefixedProp(prop, isVariable = isCSSVariable(prop)) {
  if (isVariable)
    return prop;
  if (!prefixedProps[prop]) {
    const propCC = camelCase(prop), propUC = `${propCC[0].toUpperCase()}${propCC.slice(1)}`, props = `${propCC} ${vendorsPrefixes.join(`${propUC} `)}${propUC}`.split(" ");
    each(props, (i, p) => {
      if (p in style) {
        prefixedProps[prop] = p;
        return false;
      }
    });
  }
  return prefixedProps[prop];
}
const numericProps = {
  animationIterationCount: true,
  columnCount: true,
  flexGrow: true,
  flexShrink: true,
  fontWeight: true,
  gridArea: true,
  gridColumn: true,
  gridColumnEnd: true,
  gridColumnStart: true,
  gridRow: true,
  gridRowEnd: true,
  gridRowStart: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  widows: true,
  zIndex: true
};
function getSuffixedValue(prop, value, isVariable = isCSSVariable(prop)) {
  return !isVariable && !numericProps[prop] && isNumeric(value) ? `${value}px` : value;
}
function css(prop, value) {
  if (isString(prop)) {
    const isVariable = isCSSVariable(prop);
    prop = getPrefixedProp(prop, isVariable);
    if (arguments.length < 2)
      return this[0] && computeStyle(this[0], prop, isVariable);
    if (!prop)
      return this;
    value = getSuffixedValue(prop, value, isVariable);
    return this.each((i, ele) => {
      if (!isElement(ele))
        return;
      if (isVariable) {
        ele.style.setProperty(prop, value);
      } else {
        ele.style[prop] = value;
      }
    });
  }
  for (const key in prop) {
    this.css(key, prop[key]);
  }
  return this;
}
fn.css = css;
const JSONStringRe = /^\s+|\s+$/;
function getData(ele, key) {
  const value = ele.dataset[key] || ele.dataset[camelCase(key)];
  if (JSONStringRe.test(value))
    return value;
  return attempt(JSON.parse, value);
}
function setData(ele, key, value) {
  value = attempt(JSON.stringify, value);
  ele.dataset[camelCase(key)] = value;
}
function data(name, value) {
  if (!name) {
    if (!this[0])
      return;
    const datas = {};
    for (const key in this[0].dataset) {
      datas[key] = getData(this[0], key);
    }
    return datas;
  }
  if (isString(name)) {
    if (arguments.length < 2)
      return this[0] && getData(this[0], name);
    if (isUndefined(value))
      return this;
    return this.each((i, ele) => {
      setData(ele, name, value);
    });
  }
  for (const key in name) {
    this.data(key, name[key]);
  }
  return this;
}
fn.data = data;
function getDocumentDimension(doc2, dimension) {
  const docEle2 = doc2.documentElement;
  return Math.max(doc2.body[`scroll${dimension}`], docEle2[`scroll${dimension}`], doc2.body[`offset${dimension}`], docEle2[`offset${dimension}`], docEle2[`client${dimension}`]);
}
function getExtraSpace(ele, xAxis) {
  return computeStyleInt(ele, `border${xAxis ? "Left" : "Top"}Width`) + computeStyleInt(ele, `padding${xAxis ? "Left" : "Top"}`) + computeStyleInt(ele, `padding${xAxis ? "Right" : "Bottom"}`) + computeStyleInt(ele, `border${xAxis ? "Right" : "Bottom"}Width`);
}
each([true, false], (i, outer) => {
  each(["Width", "Height"], (i2, prop) => {
    const name = `${outer ? "outer" : "inner"}${prop}`;
    fn[name] = function(includeMargins) {
      if (!this[0])
        return;
      if (isWindow(this[0]))
        return outer ? this[0][`inner${prop}`] : this[0].document.documentElement[`client${prop}`];
      if (isDocument(this[0]))
        return getDocumentDimension(this[0], prop);
      return this[0][`${outer ? "offset" : "client"}${prop}`] + (includeMargins && outer ? computeStyleInt(this[0], `margin${i2 ? "Top" : "Left"}`) + computeStyleInt(this[0], `margin${i2 ? "Bottom" : "Right"}`) : 0);
    };
  });
});
each(["Width", "Height"], (index, prop) => {
  const propLC = prop.toLowerCase();
  fn[propLC] = function(value) {
    if (!this[0])
      return isUndefined(value) ? void 0 : this;
    if (!arguments.length) {
      if (isWindow(this[0]))
        return this[0].document.documentElement[`client${prop}`];
      if (isDocument(this[0]))
        return getDocumentDimension(this[0], prop);
      return this[0].getBoundingClientRect()[propLC] - getExtraSpace(this[0], !index);
    }
    const valueNumber = parseInt(value, 10);
    return this.each((i, ele) => {
      if (!isElement(ele))
        return;
      const boxSizing = computeStyle(ele, "boxSizing");
      ele.style[propLC] = getSuffixedValue(propLC, valueNumber + (boxSizing === "border-box" ? getExtraSpace(ele, !index) : 0));
    });
  };
});
const defaultDisplay = {};
function getDefaultDisplay(tagName) {
  if (defaultDisplay[tagName])
    return defaultDisplay[tagName];
  const ele = createElement(tagName);
  doc.body.insertBefore(ele, null);
  const display = computeStyle(ele, "display");
  doc.body.removeChild(ele);
  return defaultDisplay[tagName] = display !== "none" ? display : "block";
}
function isHidden(ele) {
  return computeStyle(ele, "display") === "none";
}
const displayProperty = "___cd";
fn.toggle = function(force) {
  return this.each((i, ele) => {
    if (!isElement(ele))
      return;
    const show = isUndefined(force) ? isHidden(ele) : force;
    if (show) {
      ele.style.display = ele[displayProperty] || "";
      if (isHidden(ele)) {
        ele.style.display = getDefaultDisplay(ele.tagName);
      }
    } else {
      ele[displayProperty] = computeStyle(ele, "display");
      ele.style.display = "none";
    }
  });
};
fn.hide = function() {
  return this.toggle(false);
};
fn.show = function() {
  return this.toggle(true);
};
function hasNamespaces(ns1, ns2) {
  return !ns2 || !some.call(ns2, (ns) => ns1.indexOf(ns) < 0);
}
const eventsNamespace = "___ce", eventsNamespacesSeparator = ".", eventsFocus = { focus: "focusin", blur: "focusout" }, eventsHover = { mouseenter: "mouseover", mouseleave: "mouseout" }, eventsMouseRe = /^(mouse|pointer|contextmenu|drag|drop|click|dblclick)/i;
function getEventNameBubbling(name) {
  return eventsHover[name] || eventsFocus[name] || name;
}
function getEventsCache(ele) {
  return ele[eventsNamespace] = ele[eventsNamespace] || {};
}
function addEvent(ele, name, namespaces, selector, callback) {
  const eventCache = getEventsCache(ele);
  eventCache[name] = eventCache[name] || [];
  eventCache[name].push([namespaces, selector, callback]);
  ele.addEventListener(name, callback);
}
function parseEventName(eventName) {
  const parts = eventName.split(eventsNamespacesSeparator);
  return [parts[0], parts.slice(1).sort()];
}
function removeEvent(ele, name, namespaces, selector, callback) {
  const cache = getEventsCache(ele);
  if (!name) {
    for (name in cache) {
      removeEvent(ele, name, namespaces, selector, callback);
    }
  } else if (cache[name]) {
    cache[name] = cache[name].filter(([ns, sel, cb]) => {
      if (callback && cb.guid !== callback.guid || !hasNamespaces(ns, namespaces) || selector && selector !== sel)
        return true;
      ele.removeEventListener(name, cb);
    });
  }
}
fn.off = function(eventFullName, selector, callback) {
  if (isUndefined(eventFullName)) {
    this.each((i, ele) => {
      if (!isElement(ele) && !isDocument(ele) && !isWindow(ele))
        return;
      removeEvent(ele);
    });
  } else if (!isString(eventFullName)) {
    for (const key in eventFullName) {
      this.off(key, eventFullName[key]);
    }
  } else {
    if (isFunction(selector)) {
      callback = selector;
      selector = "";
    }
    each(getSplitValues(eventFullName), (i, eventFullName2) => {
      const [nameOriginal, namespaces] = parseEventName(eventFullName2), name = getEventNameBubbling(nameOriginal);
      this.each((i2, ele) => {
        if (!isElement(ele) && !isDocument(ele) && !isWindow(ele))
          return;
        removeEvent(ele, name, namespaces, selector, callback);
      });
    });
  }
  return this;
};
function on(eventFullName, selector, data2, callback, _one) {
  if (!isString(eventFullName)) {
    for (const key in eventFullName) {
      this.on(key, selector, data2, eventFullName[key], _one);
    }
    return this;
  }
  if (!isString(selector)) {
    if (isUndefined(selector) || isNull(selector)) {
      selector = "";
    } else if (isUndefined(data2)) {
      data2 = selector;
      selector = "";
    } else {
      callback = data2;
      data2 = selector;
      selector = "";
    }
  }
  if (!isFunction(callback)) {
    callback = data2;
    data2 = void 0;
  }
  if (!callback)
    return this;
  each(getSplitValues(eventFullName), (i, eventFullName2) => {
    const [nameOriginal, namespaces] = parseEventName(eventFullName2), name = getEventNameBubbling(nameOriginal), isEventHover = nameOriginal in eventsHover, isEventFocus = nameOriginal in eventsFocus;
    if (!name)
      return;
    this.each((i2, ele) => {
      if (!isElement(ele) && !isDocument(ele) && !isWindow(ele))
        return;
      const finalCallback = function(event) {
        if (event.target[`___i${event.type}`])
          return event.stopImmediatePropagation();
        if (event.namespace && !hasNamespaces(namespaces, event.namespace.split(eventsNamespacesSeparator)))
          return;
        if (!selector && (isEventFocus && (event.target !== ele || event.___ot === name) || isEventHover && event.relatedTarget && ele.contains(event.relatedTarget)))
          return;
        let thisArg = ele;
        if (selector) {
          let target = event.target;
          while (!matches(target, selector)) {
            if (target === ele)
              return;
            target = target.parentNode;
            if (!target)
              return;
          }
          thisArg = target;
        }
        Object.defineProperty(event, "currentTarget", {
          configurable: true,
          get() {
            return thisArg;
          }
        });
        Object.defineProperty(event, "delegateTarget", {
          configurable: true,
          get() {
            return ele;
          }
        });
        Object.defineProperty(event, "data", {
          configurable: true,
          get() {
            return data2;
          }
        });
        const returnValue = callback.call(thisArg, event, event.___td);
        if (_one) {
          removeEvent(ele, name, namespaces, selector, finalCallback);
        }
        if (returnValue === false) {
          event.preventDefault();
          event.stopPropagation();
        }
      };
      finalCallback.guid = callback.guid = callback.guid || cash.guid++;
      addEvent(ele, name, namespaces, selector, finalCallback);
    });
  });
  return this;
}
fn.on = on;
function one(eventFullName, selector, data2, callback) {
  return this.on(eventFullName, selector, data2, callback, true);
}
fn.one = one;
fn.ready = function(callback) {
  const cb = () => setTimeout(callback, 0, cash);
  if (doc.readyState !== "loading") {
    cb();
  } else {
    doc.addEventListener("DOMContentLoaded", cb);
  }
  return this;
};
fn.trigger = function(event, data2) {
  if (isString(event)) {
    const [nameOriginal, namespaces] = parseEventName(event), name = getEventNameBubbling(nameOriginal);
    if (!name)
      return this;
    const type = eventsMouseRe.test(name) ? "MouseEvents" : "HTMLEvents";
    event = doc.createEvent(type);
    event.initEvent(name, true, true);
    event.namespace = namespaces.join(eventsNamespacesSeparator);
    event.___ot = nameOriginal;
  }
  event.___td = data2;
  const isEventFocus = event.___ot in eventsFocus;
  return this.each((i, ele) => {
    if (isEventFocus && isFunction(ele[event.___ot])) {
      ele[`___i${event.type}`] = true;
      ele[event.___ot]();
      ele[`___i${event.type}`] = false;
    }
    ele.dispatchEvent(event);
  });
};
function getValue(ele) {
  if (ele.multiple && ele.options)
    return pluck(filter.call(ele.options, (option) => option.selected && !option.disabled && !option.parentNode.disabled), "value");
  return ele.value || "";
}
const queryEncodeSpaceRe = /%20/g, queryEncodeCRLFRe = /\r?\n/g;
function queryEncode(prop, value) {
  return `&${encodeURIComponent(prop)}=${encodeURIComponent(value.replace(queryEncodeCRLFRe, "\r\n")).replace(queryEncodeSpaceRe, "+")}`;
}
const skippableRe = /file|reset|submit|button|image/i, checkableRe = /radio|checkbox/i;
fn.serialize = function() {
  let query = "";
  this.each((i, ele) => {
    each(ele.elements || [ele], (i2, ele2) => {
      if (ele2.disabled || !ele2.name || ele2.tagName === "FIELDSET" || skippableRe.test(ele2.type) || checkableRe.test(ele2.type) && !ele2.checked)
        return;
      const value = getValue(ele2);
      if (!isUndefined(value)) {
        const values = isArray(value) ? value : [value];
        each(values, (i3, value2) => {
          query += queryEncode(ele2.name, value2);
        });
      }
    });
  });
  return query.slice(1);
};
function val(value) {
  if (!arguments.length)
    return this[0] && getValue(this[0]);
  return this.each((i, ele) => {
    const isSelect = ele.multiple && ele.options;
    if (isSelect || checkableRe.test(ele.type)) {
      const eleValue = isArray(value) ? map.call(value, String) : isNull(value) ? [] : [String(value)];
      if (isSelect) {
        each(ele.options, (i2, option) => {
          option.selected = eleValue.indexOf(option.value) >= 0;
        }, true);
      } else {
        ele.checked = eleValue.indexOf(ele.value) >= 0;
      }
    } else {
      ele.value = isUndefined(value) || isNull(value) ? "" : value;
    }
  });
}
fn.val = val;
fn.clone = function() {
  return this.map((i, ele) => ele.cloneNode(true));
};
fn.detach = function(comparator) {
  filtered(this, comparator).each((i, ele) => {
    if (ele.parentNode) {
      ele.parentNode.removeChild(ele);
    }
  });
  return this;
};
const fragmentRe = /^\s*<(\w+)[^>]*>/, singleTagRe = /^<(\w+)\s*\/?>(?:<\/\1>)?$/;
const containers = {
  "*": div,
  tr: tbody,
  td: tr,
  th: tr,
  thead: table,
  tbody: table,
  tfoot: table
};
function parseHTML(html2) {
  if (!isString(html2))
    return [];
  if (singleTagRe.test(html2))
    return [createElement(RegExp.$1)];
  const fragment = fragmentRe.test(html2) && RegExp.$1, container = containers[fragment] || containers["*"];
  container.innerHTML = html2;
  return cash(container.childNodes).detach().get();
}
cash.parseHTML = parseHTML;
fn.empty = function() {
  return this.each((i, ele) => {
    while (ele.firstChild) {
      ele.removeChild(ele.firstChild);
    }
  });
};
function html(html2) {
  if (!arguments.length)
    return this[0] && this[0].innerHTML;
  if (isUndefined(html2))
    return this;
  return this.each((i, ele) => {
    if (!isElement(ele))
      return;
    ele.innerHTML = html2;
  });
}
fn.html = html;
fn.remove = function(comparator) {
  filtered(this, comparator).detach().off();
  return this;
};
function text(text2) {
  if (isUndefined(text2))
    return this[0] ? this[0].textContent : "";
  return this.each((i, ele) => {
    if (!isElement(ele))
      return;
    ele.textContent = text2;
  });
}
fn.text = text;
fn.unwrap = function() {
  this.parent().each((i, ele) => {
    if (ele.tagName === "BODY")
      return;
    const $ele = cash(ele);
    $ele.replaceWith($ele.children());
  });
  return this;
};
fn.offset = function() {
  const ele = this[0];
  if (!ele)
    return;
  const rect = ele.getBoundingClientRect();
  return {
    top: rect.top + win.pageYOffset,
    left: rect.left + win.pageXOffset
  };
};
fn.offsetParent = function() {
  return this.map((i, ele) => {
    let offsetParent = ele.offsetParent;
    while (offsetParent && computeStyle(offsetParent, "position") === "static") {
      offsetParent = offsetParent.offsetParent;
    }
    return offsetParent || docEle;
  });
};
fn.position = function() {
  const ele = this[0];
  if (!ele)
    return;
  const isFixed = computeStyle(ele, "position") === "fixed", offset = isFixed ? ele.getBoundingClientRect() : this.offset();
  if (!isFixed) {
    const doc2 = ele.ownerDocument;
    let offsetParent = ele.offsetParent || doc2.documentElement;
    while ((offsetParent === doc2.body || offsetParent === doc2.documentElement) && computeStyle(offsetParent, "position") === "static") {
      offsetParent = offsetParent.parentNode;
    }
    if (offsetParent !== ele && isElement(offsetParent)) {
      const parentOffset = cash(offsetParent).offset();
      offset.top -= parentOffset.top + computeStyleInt(offsetParent, "borderTopWidth");
      offset.left -= parentOffset.left + computeStyleInt(offsetParent, "borderLeftWidth");
    }
  }
  return {
    top: offset.top - computeStyleInt(ele, "marginTop"),
    left: offset.left - computeStyleInt(ele, "marginLeft")
  };
};
fn.children = function(comparator) {
  return filtered(cash(unique(pluck(this, (ele) => ele.children))), comparator);
};
fn.contents = function() {
  return cash(unique(pluck(this, (ele) => ele.tagName === "IFRAME" ? [ele.contentDocument] : ele.tagName === "TEMPLATE" ? ele.content.childNodes : ele.childNodes)));
};
fn.find = function(selector) {
  return cash(unique(pluck(this, (ele) => find(selector, ele))));
};
const HTMLCDATARe = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g, scriptTypeRe = /^$|^module$|\/(java|ecma)script/i, scriptAttributes = ["type", "src", "nonce", "noModule"];
function evalScripts(node, doc2) {
  const collection = cash(node);
  collection.filter("script").add(collection.find("script")).each((i, ele) => {
    if (scriptTypeRe.test(ele.type) && docEle.contains(ele)) {
      const script = createElement("script");
      script.text = ele.textContent.replace(HTMLCDATARe, "");
      each(scriptAttributes, (i2, attr2) => {
        if (ele[attr2])
          script[attr2] = ele[attr2];
      });
      doc2.head.insertBefore(script, null);
      doc2.head.removeChild(script);
    }
  });
}
function insertElement(anchor, target, left, inside, evaluate) {
  if (inside) {
    anchor.insertBefore(target, left ? anchor.firstChild : null);
  } else {
    if (anchor.nodeName === "HTML") {
      anchor.parentNode.replaceChild(target, anchor);
    } else {
      anchor.parentNode.insertBefore(target, left ? anchor : anchor.nextSibling);
    }
  }
  if (evaluate) {
    evalScripts(target, anchor.ownerDocument);
  }
}
function insertSelectors(selectors, anchors, inverse, left, inside, reverseLoop1, reverseLoop2, reverseLoop3) {
  each(selectors, (si, selector) => {
    each(cash(selector), (ti, target) => {
      each(cash(anchors), (ai, anchor) => {
        const anchorFinal = inverse ? target : anchor, targetFinal = inverse ? anchor : target, indexFinal = inverse ? ti : ai;
        insertElement(anchorFinal, !indexFinal ? targetFinal : targetFinal.cloneNode(true), left, inside, !indexFinal);
      }, reverseLoop3);
    }, reverseLoop2);
  }, reverseLoop1);
  return anchors;
}
fn.after = function() {
  return insertSelectors(arguments, this, false, false, false, true, true);
};
fn.append = function() {
  return insertSelectors(arguments, this, false, false, true);
};
fn.appendTo = function(selector) {
  return insertSelectors(arguments, this, true, false, true);
};
fn.before = function() {
  return insertSelectors(arguments, this, false, true);
};
fn.insertAfter = function(selector) {
  return insertSelectors(arguments, this, true, false, false, false, false, true);
};
fn.insertBefore = function(selector) {
  return insertSelectors(arguments, this, true, true);
};
fn.prepend = function() {
  return insertSelectors(arguments, this, false, true, true, true, true);
};
fn.prependTo = function(selector) {
  return insertSelectors(arguments, this, true, true, true, false, false, true);
};
fn.replaceWith = function(selector) {
  return this.before(selector).remove();
};
fn.replaceAll = function(selector) {
  cash(selector).replaceWith(this);
  return this;
};
fn.wrapAll = function(selector) {
  let structure = cash(selector), wrapper = structure[0];
  while (wrapper.children.length)
    wrapper = wrapper.firstElementChild;
  this.first().before(structure);
  return this.appendTo(wrapper);
};
fn.wrap = function(selector) {
  return this.each((i, ele) => {
    const wrapper = cash(selector)[0];
    cash(ele).wrapAll(!i ? wrapper : wrapper.cloneNode(true));
  });
};
fn.wrapInner = function(selector) {
  return this.each((i, ele) => {
    const $ele = cash(ele), contents = $ele.contents();
    contents.length ? contents.wrapAll(selector) : $ele.append(selector);
  });
};
fn.has = function(selector) {
  const comparator = isString(selector) ? (i, ele) => find(selector, ele).length : (i, ele) => ele.contains(selector);
  return this.filter(comparator);
};
fn.is = function(comparator) {
  const compare = getCompareFunction(comparator);
  return some.call(this, (ele, i) => compare.call(ele, i, ele));
};
fn.next = function(comparator, _all, _until) {
  return filtered(cash(unique(pluck(this, "nextElementSibling", _all, _until))), comparator);
};
fn.nextAll = function(comparator) {
  return this.next(comparator, true);
};
fn.nextUntil = function(until, comparator) {
  return this.next(comparator, true, until);
};
fn.not = function(comparator) {
  const compare = getCompareFunction(comparator);
  return this.filter((i, ele) => (!isString(comparator) || isElement(ele)) && !compare.call(ele, i, ele));
};
fn.parent = function(comparator) {
  return filtered(cash(unique(pluck(this, "parentNode"))), comparator);
};
fn.index = function(selector) {
  const child = selector ? cash(selector)[0] : this[0], collection = selector ? this : cash(child).parent().children();
  return indexOf.call(collection, child);
};
fn.closest = function(comparator) {
  const filtered2 = this.filter(comparator);
  if (filtered2.length)
    return filtered2;
  const $parent = this.parent();
  if (!$parent.length)
    return filtered2;
  return $parent.closest(comparator);
};
fn.parents = function(comparator, _until) {
  return filtered(cash(unique(pluck(this, "parentElement", true, _until))), comparator);
};
fn.parentsUntil = function(until, comparator) {
  return this.parents(comparator, until);
};
fn.prev = function(comparator, _all, _until) {
  return filtered(cash(unique(pluck(this, "previousElementSibling", _all, _until))), comparator);
};
fn.prevAll = function(comparator) {
  return this.prev(comparator, true);
};
fn.prevUntil = function(until, comparator) {
  return this.prev(comparator, true, until);
};
fn.siblings = function(comparator) {
  return filtered(cash(unique(pluck(this, (ele) => cash(ele).parent().children().not(ele)))), comparator);
};
function isTouchDevice() {
  try {
    document.createEvent("TouchEvent");
    return true;
  } catch (e) {
    return false;
  }
}
function ajax(url = "", method = "get") {
  return new Promise(function(resolve, reject) {
    if (!XMLHttpRequest)
      reject(`Not support browser`);
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("load", function() {
      if (this.status === 200 || this.status === 201) {
        resolve(this.responseText);
      } else {
        reject(this.responseText);
      }
    });
    xhr.addEventListener("error", function() {
      reject("error request");
    });
    xhr.open(method, url);
    xhr.send();
  });
}
function setCookie(key, value = "1", day = 7, path = "/") {
  let date = new Date();
  date.setTime(date.getTime() + day * 24 * 60 * 60 * 1e3);
  document.cookie = `${key}=${value};expires=${date.toUTCString()};path=${path}`;
}
const $html = cash("html");
const $header = cash(".layout-header");
function initToggleButtonsInHeader() {
  const $wraps = $header.find(".layout-header__search, .layout-header__navigation");
  const $buttons = $wraps.children("button");
  $wraps.on("click", (e) => e.stopPropagation());
  $buttons.on("click", function(e) {
    const $parent = cash(this).parent();
    const active = $parent.hasClass("active");
    $wraps.removeClass("active");
    $html.off("click.headerButtons");
    if (active) {
      $parent.removeClass("active");
    } else {
      $parent.addClass("active");
      if ($parent.hasClass("layout-header__search")) {
        $parent.find("input[type=text]").get(0).focus();
      }
      $html.on("click.headerButtons", () => {
        $wraps.removeClass("active");
      });
    }
  });
}
function initNavigation() {
  const $depth1Links = cash(".header-navigation > ul > li > a");
  $depth1Links.on("click", function(e) {
    if (!cash(this).attr("href") || cash(this).attr("href") === "#")
      return false;
    if (cash(window).width() < 768)
      return true;
    return !(isTouchDevice() && cash(this).next().length);
  });
}
function initSearchForm() {
  const $wrap = $header.find(".header-search");
  const $input = $wrap.find("input[type=text]");
  const $button = $wrap.find("button[type=button]");
  $input.on("keyup", function(e) {
    $button.prop("disabled", !this.value);
  });
  $button.on("click", function() {
    $input.val("");
    $input.get(0).focus();
    $button.prop("disabled", true);
  });
}
function layout() {
  initToggleButtonsInHeader();
  initNavigation();
  initSearchForm();
}
function initLikeButton() {
  const $button = cash("#button_like");
  $button.on("click", function() {
    $button.prop("disabled", true);
    ajax(`/like/${window.app.srl}/`, "post").then(function(res) {
      try {
        res = JSON.parse(res);
        if (!res.success)
          throw "error";
        $button.find("em").text(res.data.star);
        setCookie(`goose-star-${window.app.srl}`, "1", 7, window.app.url);
      } catch (e) {
        $button.prop("disabled", false);
        alert("Error update like");
      }
    }).catch(function(error) {
      $button.prop("disabled", false);
      alert("Error update like");
    });
    console.log("on click");
  });
}
function article() {
  initLikeButton();
}
var app = "";
layout();
if (window.app.mode === "article")
  article();
