// Generated by CoffeeScript 1.9.2
/* eslint-disable */
var bind1 = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

(function(WIN, DOC) {
  "use strict";
  var CLICK, DANGER, Debug, ERROR, LOG, NULL, SUCCESS, UNDEFINED, WARN, _log, bind, dom, entry, errListener, exports, getBody, isArray, isNull, isObejct, isTouch, noop, toString, unbind;
  UNDEFINED = void 0;
  NULL = null;
  LOG = "log";
  DANGER = "danger";
  WARN = "warn";
  SUCCESS = "success";
  ERROR = "error";
  CLICK = "click";
  isTouch = "ontouchend" in WIN;
  noop = function() {};
  dom = DOC.querySelectorAll;
  toString = {}.toString;
  bind = function(el, evt, callback) {
    return el.addEventListener(evt, callback, false);
  };
  unbind = function(el, evt, fn) {
    return el.removeEventListener(evt, fn, false);
  };
  isNull = function(val) {
    return val === NULL;
  };
  isArray = Array.isArray || function(val) {
    return val && "[object Array]" === toString.call(val);
  };
  isObejct = function(val) {
    return typeof val === "object" && !isArray(val) && !isNull(val);
  };
  getBody = function() {
    var ref, ref1;
    return DOC["body"] || ((ref = dom("body")) != null ? ref[0] : void 0) || ((ref1 = dom("html")) != null ? ref1[0] : void 0);
  };
  Debug = (function() {
    var childCss, debugMap, fn, joinCss, parentBottom, parentCss, publicCss, render, translate;

    debugMap = {
      log: "0074cc",
      danger: "da4f49",
      warn: "faa732",
      success: "5bb75b",
      error: "bd362f"
    };

    render = function(msg) {
      var arr, i, item, len, text;
      text = "";
      arr = [];
      if (isArray(msg)) {
        for (i = 0, len = msg.length; i < len; i++) {
          item = msg[i];
          if (typeof item === "object") {
            arr.push(render(item));
            text = "[" + arr.join(',') + "]";
          } else {
            arr.push("" + item);
            text = "[" + arr.join(',') + "]";
          }
        }
      } else if (isObejct(msg)) {
        for (item in msg) {
          if (typeof msg[item] === "object") {
            arr.push((item + ": ") + render(msg[item]));
            text = "{" + arr.join(',') + "}";
          } else {
            arr.push(item + ": " + msg[item]);
            text = "{" + arr.join(',') + "}";
          }
        }
      } else {
        text = String(msg);
      }
      return text;
    };

    translate = function(el, y) {
      el.style.webkitTransform = "translate3d(0," + y + ",0)";
      return el.style.transform = "translate3d(0," + y + ",0)";
    };

    joinCss = function(css) {
      return css.join(";");
    };

    parentBottom = 6;

    publicCss = ["-webkit-transition: all .3s ease", "transition: all .3s ease"];

    childCss = ["margin-top:-1px", "padding:10px", "border-top:1px solid rgba(255,255,255,.1)", "margin:0", "max-width:" + (WIN.outerWidth - 20) + "px"].concat(publicCss);

    parentCss = ["-webkit-overflow-scrolling:touch", "overflow:auto", "line-height:1.5", "z-index:5000", "position:fixed", "left:0", "top:0", "font-size:11px", "background:rgba(0,0,0,.8)", "color:#fff", "width:100%", "padding-bottom:" + parentBottom + "px", "max-height:100%"].concat(publicCss);

    function Debug() {
      this.toggle = bind1(this.toggle, this);
      this.isInit = this.isHide = false;
      this.msg = this.fn = this.color = "";
      this.el = NULL;
    }

    Debug.prototype.init = function() {
      var body, el;
      el = this.el = DOC.createElement("div");
      el.setAttribute("style", joinCss(parentCss));
      body = getBody();
      body.appendChild(el);
      translate(el, 0);
      bind(el, CLICK, (function(_this) {
        return function() {
          return _this.toggle();
        };
      })(this));
      this.isInit = true;
      return this;
    };

    Debug.prototype.print = function() {
      var child, css;
      if (!this.isInit) {
        this.init();
      }
      css = childCss.concat(["color:#" + this.color]);
      child = DOC.createElement("p");
      child.setAttribute("style", joinCss(css));
      child.innerHTML = this.msg;
      this.el.appendChild(child);
      return this;
    };

    Debug.prototype.toggle = function(event) {
      return (this.isHide ? this.show : this.hide).call(this, event);
    };

    Debug.prototype.show = function(event) {
      translate(this.el, 0);
      this.isHide = false;
      return this;
    };

    Debug.prototype.hide = function(event) {
      translate(this.el, "-" + (this.el.offsetHeight - parentBottom) + "px");
      this.isHide = true;
      return this;
    };

    for (fn in debugMap) {
      Debug.prototype[fn] = (function(fn) {
        return function(msg) {
          this.fn = fn;
          this.msg = render(msg);
          this.color = debugMap[fn];
          return this.print();
        };
      })(fn);
    }

    return Debug;

  })();
  entry = new Debug();
  errListener = function(error) {
    var msg;
    msg = ["Error:", "filename: " + error.filename, "lineno: " + error.lineno, "message: " + error.message, "type: " + error.type];
    return entry.error(msg.join("<br/>"));
  };
  bind(WIN, ERROR, errListener);
  entry.silence = function() {
    return unbind(WIN, ERROR, errListener);
  };
  if (isTouch) {
    _log = window.console.log;
    console.log = function() {
      entry.log(arguments[0]);
      return _log.apply(window.console, arguments);
    };
  }
  if (typeof exports !== "undefined" && module.exports) {
    return module.exports = exports = entry;
  } else if (typeof define === "function") {
    return define("debug", function(require, exports, module) {
      return module.exports = exports = entry;
    });
  } else if (typeof angular === "object") {
    return angular.module("binnng/debug", []).factory("$debug", function() {
      return entry;
    });
  } else {
    return WIN["debug"] = entry;
  }
})(window, document);
