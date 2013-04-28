(function () {
define('modules/document',[], function () {

    // Exports
    return window.document;
});

define('modules/idiom',['modules/document'], function (document) {

    /*
        Language module, for any idiom required in the UI
    */

    // Languages
    var languages = {

        // English
        'en': {
            hello: 'hello'
        }
    };

    // Idiom returns language hash using HTML lang attribute
    var idiom = (function () {
        var lang_attr = document.getElementsByTagName('head')[0].getAttribute('lang');
        return languages[lang_attr] || languages.en;
    })();

    // Exports
    return idiom;
});

define('modules/request_store',[], function () {

    /*
        Current requests store
    */

    var counter = 0,
        hash_table = {};

    function make_key() {
        ++counter;
        return counter.toString();
    }

    var get = function (key) {
        return hash_table[key.toString()];
    };

    var register = function (value) {
        var key = make_key();
        hash_table[key] = value;
        return key;
    };

    var unregister = function (key) {
        delete hash_table[key.toString()];
    };

    // Exports
    return {
        get: get,
        register: register,
        unregister: unregister
    };
});

define('zepto',[], function () {
    
    var Zepto = (function() {
      var undefined, key, $, classList, emptyArray = [], slice = emptyArray.slice, filter = emptyArray.filter,
        document = window.document,
        elementDisplay = {}, classCache = {},
        getComputedStyle = document.defaultView.getComputedStyle,
        cssNumber = { 'column-count': 1, 'columns': 1, 'font-weight': 1, 'line-height': 1,'opacity': 1, 'z-index': 1, 'zoom': 1 },
        fragmentRE = /^\s*<(\w+|!)[^>]*>/,
        tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
        rootNodeRE = /^(?:body|html)$/i,

        // special attributes that should be get/set via method calls
        methodAttributes = ['val', 'css', 'html', 'text', 'data', 'width', 'height', 'offset'],

        adjacencyOperators = [ 'after', 'prepend', 'before', 'append' ],
        table = document.createElement('table'),
        tableRow = document.createElement('tr'),
        containers = {
          'tr': document.createElement('tbody'),
          'tbody': table, 'thead': table, 'tfoot': table,
          'td': tableRow, 'th': tableRow,
          '*': document.createElement('div')
        },
        readyRE = /complete|loaded|interactive/,
        classSelectorRE = /^\.([\w-]+)$/,
        idSelectorRE = /^#([\w-]*)$/,
        tagSelectorRE = /^[\w-]+$/,
        class2type = {},
        toString = class2type.toString,
        zepto = {},
        camelize, uniq,
        tempParent = document.createElement('div')

      zepto.matches = function(element, selector) {
        if (!element || element.nodeType !== 1) return false
        var matchesSelector = element.webkitMatchesSelector || element.mozMatchesSelector ||
                              element.oMatchesSelector || element.matchesSelector
        if (matchesSelector) return matchesSelector.call(element, selector)
        // fall back to performing a selector:
        var match, parent = element.parentNode, temp = !parent
        if (temp) (parent = tempParent).appendChild(element)
        match = ~zepto.qsa(parent, selector).indexOf(element)
        temp && tempParent.removeChild(element)
        return match
      }

      function type(obj) {
        return obj == null ? String(obj) :
          class2type[toString.call(obj)] || "object"
      }

      function isFunction(value) { return type(value) == "function" }
      function isWindow(obj)     { return obj != null && obj == obj.window }
      function isDocument(obj)   { return obj != null && obj.nodeType == obj.DOCUMENT_NODE }
      function isObject(obj)     { return type(obj) == "object" }
      function isPlainObject(obj) {
        return isObject(obj) && !isWindow(obj) && obj.__proto__ == Object.prototype
      }
      function isArray(value) { return value instanceof Array }
      function likeArray(obj) { return typeof obj.length == 'number' }

      function compact(array) { return filter.call(array, function(item){ return item != null }) }
      function flatten(array) { return array.length > 0 ? $.fn.concat.apply([], array) : array }
      camelize = function(str){ return str.replace(/-+(.)?/g, function(match, chr){ return chr ? chr.toUpperCase() : '' }) }
      function dasherize(str) {
        return str.replace(/::/g, '/')
               .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
               .replace(/([a-z\d])([A-Z])/g, '$1_$2')
               .replace(/_/g, '-')
               .toLowerCase()
      }
      uniq = function(array){ return filter.call(array, function(item, idx){ return array.indexOf(item) == idx }) }

      function classRE(name) {
        return name in classCache ?
          classCache[name] : (classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)'))
      }

      function maybeAddPx(name, value) {
        return (typeof value == "number" && !cssNumber[dasherize(name)]) ? value + "px" : value
      }

      function defaultDisplay(nodeName) {
        var element, display
        if (!elementDisplay[nodeName]) {
          element = document.createElement(nodeName)
          document.body.appendChild(element)
          display = getComputedStyle(element, '').getPropertyValue("display")
          element.parentNode.removeChild(element)
          display == "none" && (display = "block")
          elementDisplay[nodeName] = display
        }
        return elementDisplay[nodeName]
      }

      function children(element) {
        return 'children' in element ?
          slice.call(element.children) :
          $.map(element.childNodes, function(node){ if (node.nodeType == 1) return node })
      }

      // `$.zepto.fragment` takes a html string and an optional tag name
      // to generate DOM nodes nodes from the given html string.
      // The generated DOM nodes are returned as an array.
      // This function can be overriden in plugins for example to make
      // it compatible with browsers that don't support the DOM fully.
      zepto.fragment = function(html, name, properties) {
        if (html.replace) html = html.replace(tagExpanderRE, "<$1></$2>")
        if (name === undefined) name = fragmentRE.test(html) && RegExp.$1
        if (!(name in containers)) name = '*'

        var nodes, dom, container = containers[name]
        container.innerHTML = '' + html
        dom = $.each(slice.call(container.childNodes), function(){
          container.removeChild(this)
        })
        if (isPlainObject(properties)) {
          nodes = $(dom)
          $.each(properties, function(key, value) {
            if (methodAttributes.indexOf(key) > -1) nodes[key](value)
            else nodes.attr(key, value)
          })
        }
        return dom
      }

      // `$.zepto.Z` swaps out the prototype of the given `dom` array
      // of nodes with `$.fn` and thus supplying all the Zepto functions
      // to the array. Note that `__proto__` is not supported on Internet
      // Explorer. This method can be overriden in plugins.
      zepto.Z = function(dom, selector) {
        dom = dom || []
        dom.__proto__ = $.fn
        dom.selector = selector || ''
        return dom
      }

      // `$.zepto.isZ` should return `true` if the given object is a Zepto
      // collection. This method can be overriden in plugins.
      zepto.isZ = function(object) {
        return object instanceof zepto.Z
      }

      // `$.zepto.init` is Zepto's counterpart to jQuery's `$.fn.init` and
      // takes a CSS selector and an optional context (and handles various
      // special cases).
      // This method can be overriden in plugins.
      zepto.init = function(selector, context) {
        // If nothing given, return an empty Zepto collection
        if (!selector) return zepto.Z()
        // If a function is given, call it when the DOM is ready
        else if (isFunction(selector)) return $(document).ready(selector)
        // If a Zepto collection is given, juts return it
        else if (zepto.isZ(selector)) return selector
        else {
          var dom
          // normalize array if an array of nodes is given
          if (isArray(selector)) dom = compact(selector)
          // Wrap DOM nodes. If a plain object is given, duplicate it.
          else if (isObject(selector))
            dom = [isPlainObject(selector) ? $.extend({}, selector) : selector], selector = null
          // If it's a html fragment, create nodes from it
          else if (fragmentRE.test(selector))
            dom = zepto.fragment(selector.trim(), RegExp.$1, context), selector = null
          // If there's a context, create a collection on that context first, and select
          // nodes from there
          else if (context !== undefined) return $(context).find(selector)
          // And last but no least, if it's a CSS selector, use it to select nodes.
          else dom = zepto.qsa(document, selector)
          // create a new Zepto collection from the nodes found
          return zepto.Z(dom, selector)
        }
      }

      // `$` will be the base `Zepto` object. When calling this
      // function just call `$.zepto.init, which makes the implementation
      // details of selecting nodes and creating Zepto collections
      // patchable in plugins.
      $ = function(selector, context){
        return zepto.init(selector, context)
      }

      function extend(target, source, deep) {
        for (key in source)
          if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
            if (isPlainObject(source[key]) && !isPlainObject(target[key]))
              target[key] = {}
            if (isArray(source[key]) && !isArray(target[key]))
              target[key] = []
            extend(target[key], source[key], deep)
          }
          else if (source[key] !== undefined) target[key] = source[key]
      }

      // Copy all but undefined properties from one or more
      // objects to the `target` object.
      $.extend = function(target){
        var deep, args = slice.call(arguments, 1)
        if (typeof target == 'boolean') {
          deep = target
          target = args.shift()
        }
        args.forEach(function(arg){ extend(target, arg, deep) })
        return target
      }

      // `$.zepto.qsa` is Zepto's CSS selector implementation which
      // uses `document.querySelectorAll` and optimizes for some special cases, like `#id`.
      // This method can be overriden in plugins.
      zepto.qsa = function(element, selector){
        var found
        return (isDocument(element) && idSelectorRE.test(selector)) ?
          ( (found = element.getElementById(RegExp.$1)) ? [found] : [] ) :
          (element.nodeType !== 1 && element.nodeType !== 9) ? [] :
          slice.call(
            classSelectorRE.test(selector) ? element.getElementsByClassName(RegExp.$1) :
            tagSelectorRE.test(selector) ? element.getElementsByTagName(selector) :
            element.querySelectorAll(selector)
          )
      }

      function filtered(nodes, selector) {
        return selector === undefined ? $(nodes) : $(nodes).filter(selector)
      }

      $.contains = function(parent, node) {
        return parent !== node && parent.contains(node)
      }

      function funcArg(context, arg, idx, payload) {
        return isFunction(arg) ? arg.call(context, idx, payload) : arg
      }

      function setAttribute(node, name, value) {
        value == null ? node.removeAttribute(name) : node.setAttribute(name, value)
      }

      // access className property while respecting SVGAnimatedString
      function className(node, value){
        var klass = node.className,
            svg   = klass && klass.baseVal !== undefined

        if (value === undefined) return svg ? klass.baseVal : klass
        svg ? (klass.baseVal = value) : (node.className = value)
      }

      // "true"  => true
      // "false" => false
      // "null"  => null
      // "42"    => 42
      // "42.5"  => 42.5
      // JSON    => parse if valid
      // String  => self
      function deserializeValue(value) {
        var num
        try {
          return value ?
            value == "true" ||
            ( value == "false" ? false :
              value == "null" ? null :
              !isNaN(num = Number(value)) ? num :
              /^[\[\{]/.test(value) ? $.parseJSON(value) :
              value )
            : value
        } catch(e) {
          return value
        }
      }

      $.type = type
      $.isFunction = isFunction
      $.isWindow = isWindow
      $.isArray = isArray
      $.isPlainObject = isPlainObject

      $.isEmptyObject = function(obj) {
        var name
        for (name in obj) return false
        return true
      }

      $.inArray = function(elem, array, i){
        return emptyArray.indexOf.call(array, elem, i)
      }

      $.camelCase = camelize
      $.trim = function(str) { return str.trim() }

      // plugin compatibility
      $.uuid = 0
      $.support = { }
      $.expr = { }

      $.map = function(elements, callback){
        var value, values = [], i, key
        if (likeArray(elements))
          for (i = 0; i < elements.length; i++) {
            value = callback(elements[i], i)
            if (value != null) values.push(value)
          }
        else
          for (key in elements) {
            value = callback(elements[key], key)
            if (value != null) values.push(value)
          }
        return flatten(values)
      }

      $.each = function(elements, callback){
        var i, key
        if (likeArray(elements)) {
          for (i = 0; i < elements.length; i++)
            if (callback.call(elements[i], i, elements[i]) === false) return elements
        } else {
          for (key in elements)
            if (callback.call(elements[key], key, elements[key]) === false) return elements
        }

        return elements
      }

      $.grep = function(elements, callback){
        return filter.call(elements, callback)
      }

      if (window.JSON) $.parseJSON = JSON.parse

      // Populate the class2type map
      $.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
        class2type[ "[object " + name + "]" ] = name.toLowerCase()
      })

      // Define methods that will be available on all
      // Zepto collections
      $.fn = {
        // Because a collection acts like an array
        // copy over these useful array functions.
        forEach: emptyArray.forEach,
        reduce: emptyArray.reduce,
        push: emptyArray.push,
        sort: emptyArray.sort,
        indexOf: emptyArray.indexOf,
        concat: emptyArray.concat,

        // `map` and `slice` in the jQuery API work differently
        // from their array counterparts
        map: function(fn){
          return $($.map(this, function(el, i){ return fn.call(el, i, el) }))
        },
        slice: function(){
          return $(slice.apply(this, arguments))
        },

        ready: function(callback){
          if (readyRE.test(document.readyState)) callback($)
          else document.addEventListener('DOMContentLoaded', function(){ callback($) }, false)
          return this
        },
        get: function(idx){
          return idx === undefined ? slice.call(this) : this[idx >= 0 ? idx : idx + this.length]
        },
        toArray: function(){ return this.get() },
        size: function(){
          return this.length
        },
        remove: function(){
          return this.each(function(){
            if (this.parentNode != null)
              this.parentNode.removeChild(this)
          })
        },
        each: function(callback){
          emptyArray.every.call(this, function(el, idx){
            return callback.call(el, idx, el) !== false
          })
          return this
        },
        filter: function(selector){
          if (isFunction(selector)) return this.not(this.not(selector))
          return $(filter.call(this, function(element){
            return zepto.matches(element, selector)
          }))
        },
        add: function(selector,context){
          return $(uniq(this.concat($(selector,context))))
        },
        is: function(selector){
          return this.length > 0 && zepto.matches(this[0], selector)
        },
        not: function(selector){
          var nodes=[]
          if (isFunction(selector) && selector.call !== undefined)
            this.each(function(idx){
              if (!selector.call(this,idx)) nodes.push(this)
            })
          else {
            var excludes = typeof selector == 'string' ? this.filter(selector) :
              (likeArray(selector) && isFunction(selector.item)) ? slice.call(selector) : $(selector)
            this.forEach(function(el){
              if (excludes.indexOf(el) < 0) nodes.push(el)
            })
          }
          return $(nodes)
        },
        has: function(selector){
          return this.filter(function(){
            return isObject(selector) ?
              $.contains(this, selector) :
              $(this).find(selector).size()
          })
        },
        eq: function(idx){
          return idx === -1 ? this.slice(idx) : this.slice(idx, + idx + 1)
        },
        first: function(){
          var el = this[0]
          return el && !isObject(el) ? el : $(el)
        },
        last: function(){
          var el = this[this.length - 1]
          return el && !isObject(el) ? el : $(el)
        },
        find: function(selector){
          var result, $this = this
          if (typeof selector == 'object')
            result = $(selector).filter(function(){
              var node = this
              return emptyArray.some.call($this, function(parent){
                return $.contains(parent, node)
              })
            })
          else if (this.length == 1) result = $(zepto.qsa(this[0], selector))
          else result = this.map(function(){ return zepto.qsa(this, selector) })
          return result
        },
        closest: function(selector, context){
          var node = this[0], collection = false
          if (typeof selector == 'object') collection = $(selector)
          while (node && !(collection ? collection.indexOf(node) >= 0 : zepto.matches(node, selector)))
            node = node !== context && !isDocument(node) && node.parentNode
          return $(node)
        },
        parents: function(selector){
          var ancestors = [], nodes = this
          while (nodes.length > 0)
            nodes = $.map(nodes, function(node){
              if ((node = node.parentNode) && !isDocument(node) && ancestors.indexOf(node) < 0) {
                ancestors.push(node)
                return node
              }
            })
          return filtered(ancestors, selector)
        },
        parent: function(selector){
          return filtered(uniq(this.pluck('parentNode')), selector)
        },
        children: function(selector){
          return filtered(this.map(function(){ return children(this) }), selector)
        },
        contents: function() {
          return this.map(function() { return slice.call(this.childNodes) })
        },
        siblings: function(selector){
          return filtered(this.map(function(i, el){
            return filter.call(children(el.parentNode), function(child){ return child!==el })
          }), selector)
        },
        empty: function(){
          return this.each(function(){ this.innerHTML = '' })
        },
        // `pluck` is borrowed from Prototype.js
        pluck: function(property){
          return $.map(this, function(el){ return el[property] })
        },
        show: function(){
          return this.each(function(){
            this.style.display == "none" && (this.style.display = null)
            if (getComputedStyle(this, '').getPropertyValue("display") == "none")
              this.style.display = defaultDisplay(this.nodeName)
          })
        },
        replaceWith: function(newContent){
          return this.before(newContent).remove()
        },
        wrap: function(structure){
          var func = isFunction(structure)
          if (this[0] && !func)
            var dom   = $(structure).get(0),
                clone = dom.parentNode || this.length > 1

          return this.each(function(index){
            $(this).wrapAll(
              func ? structure.call(this, index) :
                clone ? dom.cloneNode(true) : dom
            )
          })
        },
        wrapAll: function(structure){
          if (this[0]) {
            $(this[0]).before(structure = $(structure))
            var children
            // drill down to the inmost element
            while ((children = structure.children()).length) structure = children.first()
            $(structure).append(this)
          }
          return this
        },
        wrapInner: function(structure){
          var func = isFunction(structure)
          return this.each(function(index){
            var self = $(this), contents = self.contents(),
                dom  = func ? structure.call(this, index) : structure
            contents.length ? contents.wrapAll(dom) : self.append(dom)
          })
        },
        unwrap: function(){
          this.parent().each(function(){
            $(this).replaceWith($(this).children())
          })
          return this
        },
        clone: function(){
          return this.map(function(){ return this.cloneNode(true) })
        },
        hide: function(){
          return this.css("display", "none")
        },
        toggle: function(setting){
          return this.each(function(){
            var el = $(this)
            ;(setting === undefined ? el.css("display") == "none" : setting) ? el.show() : el.hide()
          })
        },
        prev: function(selector){ return $(this.pluck('previousElementSibling')).filter(selector || '*') },
        next: function(selector){ return $(this.pluck('nextElementSibling')).filter(selector || '*') },
        html: function(html){
          return html === undefined ?
            (this.length > 0 ? this[0].innerHTML : null) :
            this.each(function(idx){
              var originHtml = this.innerHTML
              $(this).empty().append( funcArg(this, html, idx, originHtml) )
            })
        },
        text: function(text){
          return text === undefined ?
            (this.length > 0 ? this[0].textContent : null) :
            this.each(function(){ this.textContent = text })
        },
        attr: function(name, value){
          var result
          return (typeof name == 'string' && value === undefined) ?
            (this.length == 0 || this[0].nodeType !== 1 ? undefined :
              (name == 'value' && this[0].nodeName == 'INPUT') ? this.val() :
              (!(result = this[0].getAttribute(name)) && name in this[0]) ? this[0][name] : result
            ) :
            this.each(function(idx){
              if (this.nodeType !== 1) return
              if (isObject(name)) for (key in name) setAttribute(this, key, name[key])
              else setAttribute(this, name, funcArg(this, value, idx, this.getAttribute(name)))
            })
        },
        removeAttr: function(name){
          return this.each(function(){ this.nodeType === 1 && setAttribute(this, name) })
        },
        prop: function(name, value){
          return (value === undefined) ?
            (this[0] && this[0][name]) :
            this.each(function(idx){
              this[name] = funcArg(this, value, idx, this[name])
            })
        },
        data: function(name, value){
          var data = this.attr('data-' + dasherize(name), value)
          return data !== null ? deserializeValue(data) : undefined
        },
        val: function(value){
          return (value === undefined) ?
            (this[0] && (this[0].multiple ?
               $(this[0]).find('option').filter(function(o){ return this.selected }).pluck('value') :
               this[0].value)
            ) :
            this.each(function(idx){
              this.value = funcArg(this, value, idx, this.value)
            })
        },
        offset: function(coordinates){
          if (coordinates) return this.each(function(index){
            var $this = $(this),
                coords = funcArg(this, coordinates, index, $this.offset()),
                parentOffset = $this.offsetParent().offset(),
                props = {
                  top:  coords.top  - parentOffset.top,
                  left: coords.left - parentOffset.left
                }

            if ($this.css('position') == 'static') props['position'] = 'relative'
            $this.css(props)
          })
          if (this.length==0) return null
          var obj = this[0].getBoundingClientRect()
          return {
            left: obj.left + window.pageXOffset,
            top: obj.top + window.pageYOffset,
            width: Math.round(obj.width),
            height: Math.round(obj.height)
          }
        },
        css: function(property, value){
          if (arguments.length < 2 && typeof property == 'string')
            return this[0] && (this[0].style[camelize(property)] || getComputedStyle(this[0], '').getPropertyValue(property))

          var css = ''
          if (type(property) == 'string') {
            if (!value && value !== 0)
              this.each(function(){ this.style.removeProperty(dasherize(property)) })
            else
              css = dasherize(property) + ":" + maybeAddPx(property, value)
          } else {
            for (key in property)
              if (!property[key] && property[key] !== 0)
                this.each(function(){ this.style.removeProperty(dasherize(key)) })
              else
                css += dasherize(key) + ':' + maybeAddPx(key, property[key]) + ';'
          }

          return this.each(function(){ this.style.cssText += ';' + css })
        },
        index: function(element){
          return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0])
        },
        hasClass: function(name){
          return emptyArray.some.call(this, function(el){
            return this.test(className(el))
          }, classRE(name))
        },
        addClass: function(name){
          return this.each(function(idx){
            classList = []
            var cls = className(this), newName = funcArg(this, name, idx, cls)
            newName.split(/\s+/g).forEach(function(klass){
              if (!$(this).hasClass(klass)) classList.push(klass)
            }, this)
            classList.length && className(this, cls + (cls ? " " : "") + classList.join(" "))
          })
        },
        removeClass: function(name){
          return this.each(function(idx){
            if (name === undefined) return className(this, '')
            classList = className(this)
            funcArg(this, name, idx, classList).split(/\s+/g).forEach(function(klass){
              classList = classList.replace(classRE(klass), " ")
            })
            className(this, classList.trim())
          })
        },
        toggleClass: function(name, when){
          return this.each(function(idx){
            var $this = $(this), names = funcArg(this, name, idx, className(this))
            names.split(/\s+/g).forEach(function(klass){
              (when === undefined ? !$this.hasClass(klass) : when) ?
                $this.addClass(klass) : $this.removeClass(klass)
            })
          })
        },
        scrollTop: function(){
          if (!this.length) return
          return ('scrollTop' in this[0]) ? this[0].scrollTop : this[0].scrollY
        },
        position: function() {
          if (!this.length) return

          var elem = this[0],
            // Get *real* offsetParent
            offsetParent = this.offsetParent(),
            // Get correct offsets
            offset       = this.offset(),
            parentOffset = rootNodeRE.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset()

          // Subtract element margins
          // note: when an element has margin: auto the offsetLeft and marginLeft
          // are the same in Safari causing offset.left to incorrectly be 0
          offset.top  -= parseFloat( $(elem).css('margin-top') ) || 0
          offset.left -= parseFloat( $(elem).css('margin-left') ) || 0

          // Add offsetParent borders
          parentOffset.top  += parseFloat( $(offsetParent[0]).css('border-top-width') ) || 0
          parentOffset.left += parseFloat( $(offsetParent[0]).css('border-left-width') ) || 0

          // Subtract the two offsets
          return {
            top:  offset.top  - parentOffset.top,
            left: offset.left - parentOffset.left
          }
        },
        offsetParent: function() {
          return this.map(function(){
            var parent = this.offsetParent || document.body
            while (parent && !rootNodeRE.test(parent.nodeName) && $(parent).css("position") == "static")
              parent = parent.offsetParent
            return parent
          })
        }
      }

      // for now
      $.fn.detach = $.fn.remove

      // Generate the `width` and `height` functions
      ;['width', 'height'].forEach(function(dimension){
        $.fn[dimension] = function(value){
          var offset, el = this[0],
            Dimension = dimension.replace(/./, function(m){ return m[0].toUpperCase() })
          if (value === undefined) return isWindow(el) ? el['inner' + Dimension] :
            isDocument(el) ? el.documentElement['offset' + Dimension] :
            (offset = this.offset()) && offset[dimension]
          else return this.each(function(idx){
            el = $(this)
            el.css(dimension, funcArg(this, value, idx, el[dimension]()))
          })
        }
      })

      function traverseNode(node, fun) {
        fun(node)
        for (var key in node.childNodes) traverseNode(node.childNodes[key], fun)
      }

      // Generate the `after`, `prepend`, `before`, `append`,
      // `insertAfter`, `insertBefore`, `appendTo`, and `prependTo` methods.
      adjacencyOperators.forEach(function(operator, operatorIndex) {
        var inside = operatorIndex % 2 //=> prepend, append

        $.fn[operator] = function(){
          // arguments can be nodes, arrays of nodes, Zepto objects and HTML strings
          var argType, nodes = $.map(arguments, function(arg) {
                argType = type(arg)
                return argType == "object" || argType == "array" || arg == null ?
                  arg : zepto.fragment(arg)
              }),
              parent, copyByClone = this.length > 1
          if (nodes.length < 1) return this

          return this.each(function(_, target){
            parent = inside ? target : target.parentNode

            // convert all methods to a "before" operation
            target = operatorIndex == 0 ? target.nextSibling :
                     operatorIndex == 1 ? target.firstChild :
                     operatorIndex == 2 ? target :
                     null

            nodes.forEach(function(node){
              if (copyByClone) node = node.cloneNode(true)
              else if (!parent) return $(node).remove()

              traverseNode(parent.insertBefore(node, target), function(el){
                if (el.nodeName != null && el.nodeName.toUpperCase() === 'SCRIPT' &&
                   (!el.type || el.type === 'text/javascript') && !el.src)
                  window['eval'].call(window, el.innerHTML)
              })
            })
          })
        }

        // after    => insertAfter
        // prepend  => prependTo
        // before   => insertBefore
        // append   => appendTo
        $.fn[inside ? operator+'To' : 'insert'+(operatorIndex ? 'Before' : 'After')] = function(html){
          $(html)[operator](this)
          return this
        }
      })

      zepto.Z.prototype = $.fn

      // Export internal API functions in the `$.zepto` namespace
      zepto.uniq = uniq
      zepto.deserializeValue = deserializeValue
      $.zepto = zepto

      return $
    })()

    window.Zepto = Zepto
    '$' in window || (window.$ = Zepto)

    ;(function($){
      function detect(ua){
        var os = this.os = {}, browser = this.browser = {},
          webkit = ua.match(/WebKit\/([\d.]+)/),
          android = ua.match(/(Android)\s+([\d.]+)/),
          ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
          iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
          webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
          touchpad = webos && ua.match(/TouchPad/),
          kindle = ua.match(/Kindle\/([\d.]+)/),
          silk = ua.match(/Silk\/([\d._]+)/),
          blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/),
          bb10 = ua.match(/(BB10).*Version\/([\d.]+)/),
          rimtabletos = ua.match(/(RIM\sTablet\sOS)\s([\d.]+)/),
          playbook = ua.match(/PlayBook/),
          chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/),
          firefox = ua.match(/Firefox\/([\d.]+)/)

        // Todo: clean this up with a better OS/browser seperation:
        // - discern (more) between multiple browsers on android
        // - decide if kindle fire in silk mode is android or not
        // - Firefox on Android doesn't specify the Android version
        // - possibly devide in os, device and browser hashes

        if (browser.webkit = !!webkit) browser.version = webkit[1]

        if (android) os.android = true, os.version = android[2]
        if (iphone) os.ios = os.iphone = true, os.version = iphone[2].replace(/_/g, '.')
        if (ipad) os.ios = os.ipad = true, os.version = ipad[2].replace(/_/g, '.')
        if (webos) os.webos = true, os.version = webos[2]
        if (touchpad) os.touchpad = true
        if (blackberry) os.blackberry = true, os.version = blackberry[2]
        if (bb10) os.bb10 = true, os.version = bb10[2]
        if (rimtabletos) os.rimtabletos = true, os.version = rimtabletos[2]
        if (playbook) browser.playbook = true
        if (kindle) os.kindle = true, os.version = kindle[1]
        if (silk) browser.silk = true, browser.version = silk[1]
        if (!silk && os.android && ua.match(/Kindle Fire/)) browser.silk = true
        if (chrome) browser.chrome = true, browser.version = chrome[1]
        if (firefox) browser.firefox = true, browser.version = firefox[1]

        os.tablet = !!(ipad || playbook || (android && !ua.match(/Mobile/)) || (firefox && ua.match(/Tablet/)))
        os.phone  = !!(!os.tablet && (android || iphone || webos || blackberry || bb10 ||
          (chrome && ua.match(/Android/)) || (chrome && ua.match(/CriOS\/([\d.]+)/)) || (firefox && ua.match(/Mobile/))))
      }

      detect.call($, navigator.userAgent)
      // make available to unit tests
      $.__detect = detect

    })(Zepto)

    ;(function($){
      var $$ = $.zepto.qsa, handlers = {}, _zid = 1, specialEvents={},
          hover = { mouseenter: 'mouseover', mouseleave: 'mouseout' }

      specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents'

      function zid(element) {
        return element._zid || (element._zid = _zid++)
      }
      function findHandlers(element, event, fn, selector) {
        event = parse(event)
        if (event.ns) var matcher = matcherFor(event.ns)
        return (handlers[zid(element)] || []).filter(function(handler) {
          return handler
            && (!event.e  || handler.e == event.e)
            && (!event.ns || matcher.test(handler.ns))
            && (!fn       || zid(handler.fn) === zid(fn))
            && (!selector || handler.sel == selector)
        })
      }
      function parse(event) {
        var parts = ('' + event).split('.')
        return {e: parts[0], ns: parts.slice(1).sort().join(' ')}
      }
      function matcherFor(ns) {
        return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)')
      }

      function eachEvent(events, fn, iterator){
        if ($.type(events) != "string") $.each(events, iterator)
        else events.split(/\s/).forEach(function(type){ iterator(type, fn) })
      }

      function eventCapture(handler, captureSetting) {
        return handler.del &&
          (handler.e == 'focus' || handler.e == 'blur') ||
          !!captureSetting
      }

      function realEvent(type) {
        return hover[type] || type
      }

      function add(element, events, fn, selector, getDelegate, capture){
        var id = zid(element), set = (handlers[id] || (handlers[id] = []))
        eachEvent(events, fn, function(event, fn){
          var handler   = parse(event)
          handler.fn    = fn
          handler.sel   = selector
          // emulate mouseenter, mouseleave
          if (handler.e in hover) fn = function(e){
            var related = e.relatedTarget
            if (!related || (related !== this && !$.contains(this, related)))
              return handler.fn.apply(this, arguments)
          }
          handler.del   = getDelegate && getDelegate(fn, event)
          var callback  = handler.del || fn
          handler.proxy = function (e) {
            var result = callback.apply(element, [e].concat(e.data))
            if (result === false) e.preventDefault(), e.stopPropagation()
            return result
          }
          handler.i = set.length
          set.push(handler)
          element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
        })
      }
      function remove(element, events, fn, selector, capture){
        var id = zid(element)
        eachEvent(events || '', fn, function(event, fn){
          findHandlers(element, event, fn, selector).forEach(function(handler){
            delete handlers[id][handler.i]
            element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
          })
        })
      }

      $.event = { add: add, remove: remove }

      $.proxy = function(fn, context) {
        if ($.isFunction(fn)) {
          var proxyFn = function(){ return fn.apply(context, arguments) }
          proxyFn._zid = zid(fn)
          return proxyFn
        } else if (typeof context == 'string') {
          return $.proxy(fn[context], fn)
        } else {
          throw new TypeError("expected function")
        }
      }

      $.fn.bind = function(event, callback){
        return this.each(function(){
          add(this, event, callback)
        })
      }
      $.fn.unbind = function(event, callback){
        return this.each(function(){
          remove(this, event, callback)
        })
      }
      $.fn.one = function(event, callback){
        return this.each(function(i, element){
          add(this, event, callback, null, function(fn, type){
            return function(){
              var result = fn.apply(element, arguments)
              remove(element, type, fn)
              return result
            }
          })
        })
      }

      var returnTrue = function(){return true},
          returnFalse = function(){return false},
          ignoreProperties = /^([A-Z]|layer[XY]$)/,
          eventMethods = {
            preventDefault: 'isDefaultPrevented',
            stopImmediatePropagation: 'isImmediatePropagationStopped',
            stopPropagation: 'isPropagationStopped'
          }
      function createProxy(event) {
        var key, proxy = { originalEvent: event }
        for (key in event)
          if (!ignoreProperties.test(key) && event[key] !== undefined) proxy[key] = event[key]

        $.each(eventMethods, function(name, predicate) {
          proxy[name] = function(){
            this[predicate] = returnTrue
            return event[name].apply(event, arguments)
          }
          proxy[predicate] = returnFalse
        })
        return proxy
      }

      // emulates the 'defaultPrevented' property for browsers that have none
      function fix(event) {
        if (!('defaultPrevented' in event)) {
          event.defaultPrevented = false
          var prevent = event.preventDefault
          event.preventDefault = function() {
            this.defaultPrevented = true
            prevent.call(this)
          }
        }
      }

      $.fn.delegate = function(selector, event, callback){
        return this.each(function(i, element){
          add(element, event, callback, selector, function(fn){
            return function(e){
              var evt, match = $(e.target).closest(selector, element).get(0)
              if (match) {
                evt = $.extend(createProxy(e), {currentTarget: match, liveFired: element})
                return fn.apply(match, [evt].concat([].slice.call(arguments, 1)))
              }
            }
          })
        })
      }
      $.fn.undelegate = function(selector, event, callback){
        return this.each(function(){
          remove(this, event, callback, selector)
        })
      }

      $.fn.live = function(event, callback){
        $(document.body).delegate(this.selector, event, callback)
        return this
      }
      $.fn.die = function(event, callback){
        $(document.body).undelegate(this.selector, event, callback)
        return this
      }

      $.fn.on = function(event, selector, callback){
        return !selector || $.isFunction(selector) ?
          this.bind(event, selector || callback) : this.delegate(selector, event, callback)
      }
      $.fn.off = function(event, selector, callback){
        return !selector || $.isFunction(selector) ?
          this.unbind(event, selector || callback) : this.undelegate(selector, event, callback)
      }

      $.fn.trigger = function(event, data){
        if (typeof event == 'string' || $.isPlainObject(event)) event = $.Event(event)
        fix(event)
        event.data = data
        return this.each(function(){
          // items in the collection might not be DOM elements
          // (todo: possibly support events on plain old objects)
          if('dispatchEvent' in this) this.dispatchEvent(event)
        })
      }

      // triggers event handlers on current element just as if an event occurred,
      // doesn't trigger an actual event, doesn't bubble
      $.fn.triggerHandler = function(event, data){
        var e, result
        this.each(function(i, element){
          e = createProxy(typeof event == 'string' ? $.Event(event) : event)
          e.data = data
          e.target = element
          $.each(findHandlers(element, event.type || event), function(i, handler){
            result = handler.proxy(e)
            if (e.isImmediatePropagationStopped()) return false
          })
        })
        return result
      }

      // shortcut methods for `.bind(event, fn)` for each event type
      ;('focusin focusout load resize scroll unload click dblclick '+
      'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave '+
      'change select keydown keypress keyup error').split(' ').forEach(function(event) {
        $.fn[event] = function(callback) {
          return callback ?
            this.bind(event, callback) :
            this.trigger(event)
        }
      })

      ;['focus', 'blur'].forEach(function(name) {
        $.fn[name] = function(callback) {
          if (callback) this.bind(name, callback)
          else this.each(function(){
            try { this[name]() }
            catch(e) {}
          })
          return this
        }
      })

      $.Event = function(type, props) {
        if (typeof type != 'string') props = type, type = props.type
        var event = document.createEvent(specialEvents[type] || 'Events'), bubbles = true
        if (props) for (var name in props) (name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name])
        event.initEvent(type, bubbles, true, null, null, null, null, null, null, null, null, null, null, null, null)
        event.isDefaultPrevented = function(){ return this.defaultPrevented }
        return event
      }

    })(Zepto)

    ;(function($){
      var jsonpID = 0,
          document = window.document,
          key,
          name,
          rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
          scriptTypeRE = /^(?:text|application)\/javascript/i,
          xmlTypeRE = /^(?:text|application)\/xml/i,
          jsonType = 'application/json',
          htmlType = 'text/html',
          blankRE = /^\s*$/

      // trigger a custom event and return false if it was cancelled
      function triggerAndReturn(context, eventName, data) {
        var event = $.Event(eventName)
        $(context).trigger(event, data)
        return !event.defaultPrevented
      }

      // trigger an Ajax "global" event
      function triggerGlobal(settings, context, eventName, data) {
        if (settings.global) return triggerAndReturn(context || document, eventName, data)
      }

      // Number of active Ajax requests
      $.active = 0

      function ajaxStart(settings) {
        if (settings.global && $.active++ === 0) triggerGlobal(settings, null, 'ajaxStart')
      }
      function ajaxStop(settings) {
        if (settings.global && !(--$.active)) triggerGlobal(settings, null, 'ajaxStop')
      }

      // triggers an extra global event "ajaxBeforeSend" that's like "ajaxSend" but cancelable
      function ajaxBeforeSend(xhr, settings) {
        var context = settings.context
        if (settings.beforeSend.call(context, xhr, settings) === false ||
            triggerGlobal(settings, context, 'ajaxBeforeSend', [xhr, settings]) === false)
          return false

        triggerGlobal(settings, context, 'ajaxSend', [xhr, settings])
      }
      function ajaxSuccess(data, xhr, settings) {
        var context = settings.context, status = 'success'
        settings.success.call(context, data, status, xhr)
        triggerGlobal(settings, context, 'ajaxSuccess', [xhr, settings, data])
        ajaxComplete(status, xhr, settings)
      }
      // type: "timeout", "error", "abort", "parsererror"
      function ajaxError(error, type, xhr, settings) {
        var context = settings.context
        settings.error.call(context, xhr, type, error)
        triggerGlobal(settings, context, 'ajaxError', [xhr, settings, error])
        ajaxComplete(type, xhr, settings)
      }
      // status: "success", "notmodified", "error", "timeout", "abort", "parsererror"
      function ajaxComplete(status, xhr, settings) {
        var context = settings.context
        settings.complete.call(context, xhr, status)
        triggerGlobal(settings, context, 'ajaxComplete', [xhr, settings])
        ajaxStop(settings)
      }

      // Empty function, used as default callback
      function empty() {}

      $.ajaxJSONP = function(options){
        if (!('type' in options)) return $.ajax(options)

        var callbackName = 'jsonp' + (++jsonpID),
          script = document.createElement('script'),
          cleanup = function() {
            clearTimeout(abortTimeout)
            $(script).remove()
            delete window[callbackName]
          },
          abort = function(type){
            cleanup()
            // In case of manual abort or timeout, keep an empty function as callback
            // so that the SCRIPT tag that eventually loads won't result in an error.
            if (!type || type == 'timeout') window[callbackName] = empty
            ajaxError(null, type || 'abort', xhr, options)
          },
          xhr = { abort: abort }, abortTimeout

        if (ajaxBeforeSend(xhr, options) === false) {
          abort('abort')
          return false
        }

        window[callbackName] = function(data){
          cleanup()
          ajaxSuccess(data, xhr, options)
        }

        script.onerror = function() { abort('error') }

        script.src = options.url.replace(/=\?/, '=' + callbackName)
        $('head').append(script)

        if (options.timeout > 0) abortTimeout = setTimeout(function(){
          abort('timeout')
        }, options.timeout)

        return xhr
      }

      $.ajaxSettings = {
        // Default type of request
        type: 'GET',
        // Callback that is executed before request
        beforeSend: empty,
        // Callback that is executed if the request succeeds
        success: empty,
        // Callback that is executed the the server drops error
        error: empty,
        // Callback that is executed on request complete (both: error and success)
        complete: empty,
        // The context for the callbacks
        context: null,
        // Whether to trigger "global" Ajax events
        global: true,
        // Transport
        xhr: function () {
          return new window.XMLHttpRequest()
        },
        // MIME types mapping
        accepts: {
          script: 'text/javascript, application/javascript',
          json:   jsonType,
          xml:    'application/xml, text/xml',
          html:   htmlType,
          text:   'text/plain'
        },
        // Whether the request is to another domain
        crossDomain: false,
        // Default timeout
        timeout: 0,
        // Whether data should be serialized to string
        processData: true,
        // Whether the browser should be allowed to cache GET responses
        cache: true,
      }

      function mimeToDataType(mime) {
        if (mime) mime = mime.split(';', 2)[0]
        return mime && ( mime == htmlType ? 'html' :
          mime == jsonType ? 'json' :
          scriptTypeRE.test(mime) ? 'script' :
          xmlTypeRE.test(mime) && 'xml' ) || 'text'
      }

      function appendQuery(url, query) {
        return (url + '&' + query).replace(/[&?]{1,2}/, '?')
      }

      // serialize payload and append it to the URL for GET requests
      function serializeData(options) {
        if (options.processData && options.data && $.type(options.data) != "string")
          options.data = $.param(options.data, options.traditional)
        if (options.data && (!options.type || options.type.toUpperCase() == 'GET'))
          options.url = appendQuery(options.url, options.data)
      }

      $.ajax = function(options){
        var settings = $.extend({}, options || {})
        for (key in $.ajaxSettings) if (settings[key] === undefined) settings[key] = $.ajaxSettings[key]

        ajaxStart(settings)

        if (!settings.crossDomain) settings.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(settings.url) &&
          RegExp.$2 != window.location.host

        if (!settings.url) settings.url = window.location.toString()
        serializeData(settings)
        if (settings.cache === false) settings.url = appendQuery(settings.url, '_=' + Date.now())

        var dataType = settings.dataType, hasPlaceholder = /=\?/.test(settings.url)
        if (dataType == 'jsonp' || hasPlaceholder) {
          if (!hasPlaceholder) settings.url = appendQuery(settings.url, 'callback=?')
          return $.ajaxJSONP(settings)
        }

        var mime = settings.accepts[dataType],
            baseHeaders = { },
            protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol,
            xhr = settings.xhr(), abortTimeout

        if (!settings.crossDomain) baseHeaders['X-Requested-With'] = 'XMLHttpRequest'
        if (mime) {
          baseHeaders['Accept'] = mime
          if (mime.indexOf(',') > -1) mime = mime.split(',', 2)[0]
          xhr.overrideMimeType && xhr.overrideMimeType(mime)
        }
        if (settings.contentType || (settings.contentType !== false && settings.data && settings.type.toUpperCase() != 'GET'))
          baseHeaders['Content-Type'] = (settings.contentType || 'application/x-www-form-urlencoded')
        settings.headers = $.extend(baseHeaders, settings.headers || {})

        xhr.onreadystatechange = function(){
          if (xhr.readyState == 4) {
            xhr.onreadystatechange = empty;
            clearTimeout(abortTimeout)
            var result, error = false
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && protocol == 'file:')) {
              dataType = dataType || mimeToDataType(xhr.getResponseHeader('content-type'))
              result = xhr.responseText

              try {
                // http://perfectionkills.com/global-eval-what-are-the-options/
                if (dataType == 'script')    (1,eval)(result)
                else if (dataType == 'xml')  result = xhr.responseXML
                else if (dataType == 'json') result = blankRE.test(result) ? null : $.parseJSON(result)
              } catch (e) { error = e }

              if (error) ajaxError(error, 'parsererror', xhr, settings)
              else ajaxSuccess(result, xhr, settings)
            } else {
              ajaxError(null, xhr.status ? 'error' : 'abort', xhr, settings)
            }
          }
        }

        var async = 'async' in settings ? settings.async : true
        xhr.open(settings.type, settings.url, async)

        for (name in settings.headers) xhr.setRequestHeader(name, settings.headers[name])

        if (ajaxBeforeSend(xhr, settings) === false) {
          xhr.abort()
          return false
        }

        if (settings.timeout > 0) abortTimeout = setTimeout(function(){
            xhr.onreadystatechange = empty
            xhr.abort()
            ajaxError(null, 'timeout', xhr, settings)
          }, settings.timeout)

        // avoid sending empty string (#319)
        xhr.send(settings.data ? settings.data : null)
        return xhr
      }

      // handle optional data/success arguments
      function parseArguments(url, data, success, dataType) {
        var hasData = !$.isFunction(data)
        return {
          url:      url,
          data:     hasData  ? data : undefined,
          success:  !hasData ? data : $.isFunction(success) ? success : undefined,
          dataType: hasData  ? dataType || success : success
        }
      }

      $.get = function(url, data, success, dataType){
        return $.ajax(parseArguments.apply(null, arguments))
      }

      $.post = function(url, data, success, dataType){
        var options = parseArguments.apply(null, arguments)
        options.type = 'POST'
        return $.ajax(options)
      }

      $.getJSON = function(url, data, success){
        var options = parseArguments.apply(null, arguments)
        options.dataType = 'json'
        return $.ajax(options)
      }

      $.fn.load = function(url, data, success){
        if (!this.length) return this
        var self = this, parts = url.split(/\s/), selector,
            options = parseArguments(url, data, success),
            callback = options.success
        if (parts.length > 1) options.url = parts[0], selector = parts[1]
        options.success = function(response){
          self.html(selector ?
            $('<div>').html(response.replace(rscript, "")).find(selector)
            : response)
          callback && callback.apply(self, arguments)
        }
        $.ajax(options)
        return this
      }

      var escape = encodeURIComponent

      function serialize(params, obj, traditional, scope){
        var type, array = $.isArray(obj)
        $.each(obj, function(key, value) {
          type = $.type(value)
          if (scope) key = traditional ? scope : scope + '[' + (array ? '' : key) + ']'
          // handle data in serializeArray() format
          if (!scope && array) params.add(value.name, value.value)
          // recurse into nested objects
          else if (type == "array" || (!traditional && type == "object"))
            serialize(params, value, traditional, key)
          else params.add(key, value)
        })
      }

      $.param = function(obj, traditional){
        var params = []
        params.add = function(k, v){ this.push(escape(k) + '=' + escape(v)) }
        serialize(params, obj, traditional)
        return params.join('&').replace(/%20/g, '+')
      }
    })(Zepto)

    ;(function ($) {
      $.fn.serializeArray = function () {
        var result = [], el
        $( Array.prototype.slice.call(this.get(0).elements) ).each(function () {
          el = $(this)
          var type = el.attr('type')
          if (this.nodeName.toLowerCase() != 'fieldset' &&
            !this.disabled && type != 'submit' && type != 'reset' && type != 'button' &&
            ((type != 'radio' && type != 'checkbox') || this.checked))
            result.push({
              name: el.attr('name'),
              value: el.val()
            })
        })
        return result
      }

      $.fn.serialize = function () {
        var result = []
        this.serializeArray().forEach(function (elm) {
          result.push( encodeURIComponent(elm.name) + '=' + encodeURIComponent(elm.value) )
        })
        return result.join('&')
      }

      $.fn.submit = function (callback) {
        if (callback) this.bind('submit', callback)
        else if (this.length) {
          var event = $.Event('submit')
          this.eq(0).trigger(event)
          if (!event.defaultPrevented) this.get(0).submit()
        }
        return this
      }

    })(Zepto)

    ;(function($, undefined){
      var prefix = '', eventPrefix, endEventName, endAnimationName,
        vendors = { Webkit: 'webkit', Moz: '', O: 'o', ms: 'MS' },
        document = window.document, testEl = document.createElement('div'),
        supportedTransforms = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i,
        transform,
        transitionProperty, transitionDuration, transitionTiming,
        animationName, animationDuration, animationTiming,
        cssReset = {}

      function dasherize(str) { return downcase(str.replace(/([a-z])([A-Z])/, '$1-$2')) }
      function downcase(str) { return str.toLowerCase() }
      function normalizeEvent(name) { return eventPrefix ? eventPrefix + name : downcase(name) }

      $.each(vendors, function(vendor, event){
        if (testEl.style[vendor + 'TransitionProperty'] !== undefined) {
          prefix = '-' + downcase(vendor) + '-'
          eventPrefix = event
          return false
        }
      })

      transform = prefix + 'transform'
      cssReset[transitionProperty = prefix + 'transition-property'] =
      cssReset[transitionDuration = prefix + 'transition-duration'] =
      cssReset[transitionTiming   = prefix + 'transition-timing-function'] =
      cssReset[animationName      = prefix + 'animation-name'] =
      cssReset[animationDuration  = prefix + 'animation-duration'] =
      cssReset[animationTiming    = prefix + 'animation-timing-function'] = ''

      $.fx = {
        off: (eventPrefix === undefined && testEl.style.transitionProperty === undefined),
        speeds: { _default: 400, fast: 200, slow: 600 },
        cssPrefix: prefix,
        transitionEnd: normalizeEvent('TransitionEnd'),
        animationEnd: normalizeEvent('AnimationEnd')
      }

      $.fn.animate = function(properties, duration, ease, callback){
        if ($.isPlainObject(duration))
          ease = duration.easing, callback = duration.complete, duration = duration.duration
        if (duration) duration = (typeof duration == 'number' ? duration :
                        ($.fx.speeds[duration] || $.fx.speeds._default)) / 1000
        return this.anim(properties, duration, ease, callback)
      }

      $.fn.anim = function(properties, duration, ease, callback){
        var key, cssValues = {}, cssProperties, transforms = '',
            that = this, wrappedCallback, endEvent = $.fx.transitionEnd

        if (duration === undefined) duration = 0.4
        if ($.fx.off) duration = 0

        if (typeof properties == 'string') {
          // keyframe animation
          cssValues[animationName] = properties
          cssValues[animationDuration] = duration + 's'
          cssValues[animationTiming] = (ease || 'linear')
          endEvent = $.fx.animationEnd
        } else {
          cssProperties = []
          // CSS transitions
          for (key in properties)
            if (supportedTransforms.test(key)) transforms += key + '(' + properties[key] + ') '
            else cssValues[key] = properties[key], cssProperties.push(dasherize(key))

          if (transforms) cssValues[transform] = transforms, cssProperties.push(transform)
          if (duration > 0 && typeof properties === 'object') {
            cssValues[transitionProperty] = cssProperties.join(', ')
            cssValues[transitionDuration] = duration + 's'
            cssValues[transitionTiming] = (ease || 'linear')
          }
        }

        wrappedCallback = function(event){
          if (typeof event !== 'undefined') {
            if (event.target !== event.currentTarget) return // makes sure the event didn't bubble from "below"
            $(event.target).unbind(endEvent, wrappedCallback)
          }
          $(this).css(cssReset)
          callback && callback.call(this)
        }
        if (duration > 0) this.bind(endEvent, wrappedCallback)

        // trigger page reflow so new elements can animate
        this.size() && this.get(0).clientLeft

        this.css(cssValues)

        if (duration <= 0) setTimeout(function() {
          that.each(function(){ wrappedCallback.call(this) })
        }, 0)

        return this
      }

      testEl = null
    })(Zepto)

    return Zepto;
});
define('modules/ajax',['zepto'], function ($) {

    /*
        Ajax module, via Zepto
    */

    var request = function (request_obj) {

        var ajax_obj = $.ajax({

            data: request_obj.data,
            type: request_obj.type,
            url: request_obj.url,
            dataType: request_obj.dataType,

            beforeSend: function (xhr, settings) {
                request_obj.beforeSend(xhr, settings);
            },

            complete: function () {
                request_obj.always();
            },

            success: function (data) {
                request_obj.done(data);
            },

            error: function (xhr, errorType, error) {
                request_obj.fail(xhr, errorType, error);
            }
        });

        return ajax_obj;
    };

    // Exports
    return {
        request: request
    };
});
define('modules/comm',['modules/request_store', 'modules/ajax', 'zepto'], function (request_store, comm_interface, $) {

    /*
        Comm façade
    */

    // Returns request key, to allow for the option to abort the request
    var request = function (request_params) {

        var request_object,
            request_key;

        if (request_params.hasOwnProperty('url'))
        {
            request_object = comm_interface.request($.extend({
                data: {},
                type: 'GET',
                dataType: 'json',
                beforeSend: function () {},
                always: function () {},
                done: function () {},
                fail: function () {}
            }, request_params));

            request_key = request_store.register(request_object);

            return request_key;
        }
        else
        {
            console.log('Comm: Request requires URL');
            return false;
        }
    };

    // Abort a given request key, unregister it from the store
    var abort = function (request_key) {

        request_store.get(request_key).abort();
        request_store.unregister(request_key);
    };

    // Exports
    return {
        request: request,
        abort: abort
    };
});

define('handlebars',[], function() {

  // lib/handlebars/base.js

  /*jshint eqnull:true*/
  var Handlebars = {};

    Handlebars.VERSION = "1.0.rc.1";

    Handlebars.helpers = {};
    Handlebars.partials = {};

    Handlebars.registerHelper = function(name, fn, inverse) {
      if (inverse) {
        fn.not = inverse;
      }
      this.helpers[name] = fn;
    };

    Handlebars.registerPartial = function(name, str) {
      this.partials[name] = str;
    };

    Handlebars.registerHelper('helperMissing', function(arg) {
      if (arguments.length === 2) {
        return undefined;
      } else {
        throw new Error("Could not find property '" + arg + "'");
      }
    });

    var toString = Object.prototype.toString,
      functionType = "[object Function]";

    Handlebars.registerHelper('blockHelperMissing', function(context, options) {
      var inverse = options.inverse || function() {}, fn = options.fn;


      var ret = "";
      var type = toString.call(context);

      if (type === functionType) {
        context = context.call(this);
      }

      if (context === true) {
        return fn(this);
      } else if (context === false || context == null) {
        return inverse(this);
      } else if (type === "[object Array]") {
        if (context.length > 0) {
          return Handlebars.helpers.each(context, options);
        } else {
          return inverse(this);
        }
      } else {
        return fn(context);
      }
    });

    Handlebars.K = function() {};

    Handlebars.createFrame = Object.create || function(object) {
      Handlebars.K.prototype = object;
      var obj = new Handlebars.K();
      Handlebars.K.prototype = null;
      return obj;
    };

    Handlebars.registerHelper('each', function(context, options) {
      var fn = options.fn,
        inverse = options.inverse;
      var ret = "",
        data;

      if (options.data) {
        data = Handlebars.createFrame(options.data);
      }

      if (context && context.length > 0) {
        for (var i = 0, j = context.length; i < j; i++) {
          if (data) {
            data.index = i;
          }
          ret = ret + fn(context[i], {
            data: data
          });
        }
      } else {
        ret = inverse(this);
      }
      return ret;
    });

    Handlebars.registerHelper('if', function(context, options) {
      var type = toString.call(context);
      if (type === functionType) {
        context = context.call(this);
      }

      if (!context || Handlebars.Utils.isEmpty(context)) {
        return options.inverse(this);
      } else {
        return options.fn(this);
      }
    });

    Handlebars.registerHelper('unless', function(context, options) {
      var fn = options.fn,
        inverse = options.inverse;
      options.fn = inverse;
      options.inverse = fn;

      return Handlebars.helpers['if'].call(this, context, options);
    });

    Handlebars.registerHelper('with', function(context, options) {
      return options.fn(context);
    });

    Handlebars.registerHelper('log', function(context) {
      Handlebars.log(context);
    });

  // lib/handlebars/utils.js
  Handlebars.Exception = function(message) {
    var tmp = Error.prototype.constructor.apply(this, arguments);

    for (var p in tmp) {
      if (tmp.hasOwnProperty(p)) {
        this[p] = tmp[p];
      }
    }

    this.message = tmp.message;
  };
  Handlebars.Exception.prototype = new Error();

  // Build out our basic SafeString type
  Handlebars.SafeString = function(string) {
    this.string = string;
  };
  Handlebars.SafeString.prototype.toString = function() {
    return this.string.toString();
  };

  (function() {
    var escape = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#x27;",
      "`": "&#x60;"
    };

    var badChars = /[&<>"'`]/g;
    var possible = /[&<>"'`]/;

    var escapeChar = function(chr) {
      return escape[chr] || "&amp;";
    };

    Handlebars.Utils = {
      escapeExpression: function(string) {
        // don't escape SafeStrings, since they're already safe
        if (string instanceof Handlebars.SafeString) {
          return string.toString();
        } else if (string == null || string === false) {
          return "";
        }

        if (!possible.test(string)) {
          return string;
        }
        return string.replace(badChars, escapeChar);
      },

      isEmpty: function(value) {
        if (typeof value === "undefined") {
          return true;
        } else if (value === null) {
          return true;
        } else if (value === false) {
          return true;
        } else if (Object.prototype.toString.call(value) === "[object Array]" && value.length === 0) {
          return true;
        } else {
          return false;
        }
      }
    };
  })();;
  // lib/handlebars/runtime.js
  Handlebars.VM = {
    template: function(templateSpec) {
      // Just add water
      var container = {
        escapeExpression: Handlebars.Utils.escapeExpression,
        invokePartial: Handlebars.VM.invokePartial,
        programs: [],
        program: function(i, fn, data) {
          var programWrapper = this.programs[i];
          if (data) {
            return Handlebars.VM.program(fn, data);
          } else if (programWrapper) {
            return programWrapper;
          } else {
            programWrapper = this.programs[i] = Handlebars.VM.program(fn);
            return programWrapper;
          }
        },
        programWithDepth: Handlebars.VM.programWithDepth,
        noop: Handlebars.VM.noop
      };

      return function(context, options) {
        options = options || {};
        return templateSpec.call(container, Handlebars, context, options.helpers, options.partials, options.data);
      };
    },

    programWithDepth: function(fn, data, $depth) {
      var args = Array.prototype.slice.call(arguments, 2);

      return function(context, options) {
        options = options || {};

        return fn.apply(this, [context, options.data || data].concat(args));
      };
    },
    program: function(fn, data) {
      return function(context, options) {
        options = options || {};

        return fn(context, options.data || data);
      };
    },
    noop: function() {
      return "";
    },
    invokePartial: function(partial, name, context, helpers, partials, data) {
      var options = {
        helpers: helpers,
        partials: partials,
        data: data
      };

      if (partial === undefined) {
        throw new Handlebars.Exception("The partial " + name + " could not be found");
      } else if (partial instanceof Function) {
        return partial(context, options);
      } else if (!Handlebars.compile) {
        throw new Handlebars.Exception("The partial " + name + " could not be compiled when running in runtime-only mode");
      } else {
        partials[name] = Handlebars.compile(partial, {
          data: data !== undefined
        });
        return partials[name](context, options);
      }
    }
  };

  Handlebars.template = Handlebars.VM.template;;

  return Handlebars;
});
define('modules/templates',['handlebars'], function(Handlebars) {

this["Handlebars"] = this["Handlebars"] || {};
this["Handlebars"]["templates"] = this["Handlebars"]["templates"] || {};

this["Handlebars"]["templates"]["member_profile"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n<div class=\"description\">\n    <div class=\"description__rule\" ";
  stack1 = helpers['if'].call(depth0, depth0.hexColor, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "></div>\n    <p>";
  if (stack1 = helpers.description) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.description; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</p>\n</div>\n";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "style=\"background-color: ";
  if (stack1 = helpers.hexColor) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.hexColor; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"";
  return buffer;
  }

function program4(depth0,data) {
  
  var stack1;
  if (stack1 = helpers.favSweet) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.favSweet; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  return escapeExpression(stack1);
  }

function program6(depth0,data) {
  
  
  return "—";
  }

function program8(depth0,data) {
  
  var stack1;
  if (stack1 = helpers.favSeason) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.favSeason; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  return escapeExpression(stack1);
  }

  stack1 = helpers['if'].call(depth0, depth0.description, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n<div class=\"media-object\">\n\n    <div class=\"media-object__media\">\n\n        <div class=\"ribotar\" ";
  stack1 = helpers['if'].call(depth0, depth0.hexColor, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += ">\n\n            <div class=\"image\" data-src=\"";
  if (stack1 = helpers.ribotarURL) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.ribotarURL; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n                <div class=\"image__img is-ready\" style=\"background-image: url(";
  if (stack1 = helpers.ribotarURL) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.ribotarURL; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + ");\"></div>\n            </div>\n\n        </div>\n\n    </div>\n\n    <div class=\"media-object__body\">\n\n        <dl class=\"data\">\n            <div class=\"data__item\">\n                <dt class=\"data__label\"><b>Sweet</b> of choice</dt>\n                <dd class=\"data__value\">";
  stack1 = helpers['if'].call(depth0, depth0.favSweet, {hash:{},inverse:self.program(6, program6, data),fn:self.program(4, program4, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</dd>\n            </div>\n            <div class=\"data__item\">\n                <dt class=\"data__label\"><b>Season</b> of choice</dt>\n                <dd class=\"data__value\">";
  stack1 = helpers['if'].call(depth0, depth0.favSeason, {hash:{},inverse:self.program(6, program6, data),fn:self.program(8, program8, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</dd>\n            </div>\n        </dl>\n\n    </div>\n\n</div>";
  return buffer;
  });

this["Handlebars"]["templates"]["team"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <section class=\"section\" data-id=\"";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" data-url=\"";
  if (stack1 = helpers.url) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.url; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n        <header class=\"header\">\n            <h1><b>";
  if (stack1 = helpers.firstName) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.firstName; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</b> ";
  if (stack1 = helpers.lastName) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.lastName; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</h1>\n            <h2 ";
  stack1 = helpers['if'].call(depth0, depth0.hexColor, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += ">";
  stack1 = helpers['if'].call(depth0, depth0.role, {hash:{},inverse:self.program(6, program6, data),fn:self.program(4, program4, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</h2>\n        </header>\n        <div class=\"section__body\"></div>\n    </section>\n    ";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "style=\"background-color: ";
  if (stack1 = helpers.hexColor) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.hexColor; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + ";\"";
  return buffer;
  }

function program4(depth0,data) {
  
  var stack1;
  if (stack1 = helpers.role) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.role; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  return escapeExpression(stack1);
  }

function program6(depth0,data) {
  
  
  return "—";
  }

  buffer += "<div class=\"section-list\">\n    ";
  stack1 = helpers.each.call(depth0, depth0, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</div>";
  return buffer;
  });

return this["Handlebars"]["templates"];

});
define('libs/fastclick',[], function () {
/**
 * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
 *
 * @version 0.6.5
 * @codingstandard ftlabs-jsv2
 * @copyright The Financial Times Limited [All Rights Reserved]
 * @license MIT License (see LICENSE.txt)
 */

/*jslint browser:true, node:true*/
/*global define, Event, Node*/


/**
 * Instantiate fast-clicking listeners on the specificed layer.
 *
 * @constructor
 * @param {Element} layer The layer to listen on
 */
function FastClick(layer) {
    
    var oldOnClick, self = this;


    /**
     * Whether a click is currently being tracked.
     *
     * @type boolean
     */
    this.trackingClick = false;


    /**
     * Timestamp for when when click tracking started.
     *
     * @type number
     */
    this.trackingClickStart = 0;


    /**
     * The element being tracked for a click.
     *
     * @type EventTarget
     */
    this.targetElement = null;


    /**
     * X-coordinate of touch start event.
     *
     * @type number
     */
    this.touchStartX = 0;


    /**
     * Y-coordinate of touch start event.
     *
     * @type number
     */
    this.touchStartY = 0;


    /**
     * ID of the last touch, retrieved from Touch.identifier.
     *
     * @type number
     */
    this.lastTouchIdentifier = 0;


    /**
     * The FastClick layer.
     *
     * @type Element
     */
    this.layer = layer;

    if (!layer || !layer.nodeType) {
        throw new TypeError('Layer must be a document node');
    }

    /** @type function() */
    this.onClick = function() { return FastClick.prototype.onClick.apply(self, arguments); };

    /** @type function() */
    this.onMouse = function() { return FastClick.prototype.onMouse.apply(self, arguments); };

    /** @type function() */
    this.onTouchStart = function() { return FastClick.prototype.onTouchStart.apply(self, arguments); };

    /** @type function() */
    this.onTouchEnd = function() { return FastClick.prototype.onTouchEnd.apply(self, arguments); };

    /** @type function() */
    this.onTouchCancel = function() { return FastClick.prototype.onTouchCancel.apply(self, arguments); };

    if (FastClick.notNeeded()) {
        return;
    }

    // Set up event handlers as required
    if (this.deviceIsAndroid) {
        layer.addEventListener('mouseover', this.onMouse, true);
        layer.addEventListener('mousedown', this.onMouse, true);
        layer.addEventListener('mouseup', this.onMouse, true);
    }

    layer.addEventListener('click', this.onClick, true);
    layer.addEventListener('touchstart', this.onTouchStart, false);
    layer.addEventListener('touchend', this.onTouchEnd, false);
    layer.addEventListener('touchcancel', this.onTouchCancel, false);

    // Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
    // which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
    // layer when they are cancelled.
    if (!Event.prototype.stopImmediatePropagation) {
        layer.removeEventListener = function(type, callback, capture) {
            var rmv = Node.prototype.removeEventListener;
            if (type === 'click') {
                rmv.call(layer, type, callback.hijacked || callback, capture);
            } else {
                rmv.call(layer, type, callback, capture);
            }
        };

        layer.addEventListener = function(type, callback, capture) {
            var adv = Node.prototype.addEventListener;
            if (type === 'click') {
                adv.call(layer, type, callback.hijacked || (callback.hijacked = function(event) {
                    if (!event.propagationStopped) {
                        callback(event);
                    }
                }), capture);
            } else {
                adv.call(layer, type, callback, capture);
            }
        };
    }

    // If a handler is already declared in the element's onclick attribute, it will be fired before
    // FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
    // adding it as listener.
    if (typeof layer.onclick === 'function') {

        // Android browser on at least 3.2 requires a new reference to the function in layer.onclick
        // - the old one won't work if passed to addEventListener directly.
        oldOnClick = layer.onclick;
        layer.addEventListener('click', function(event) {
            oldOnClick(event);
        }, false);
        layer.onclick = null;
    }
}


/**
 * Android requires exceptions.
 *
 * @type boolean
 */
FastClick.prototype.deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0;


/**
 * iOS requires exceptions.
 *
 * @type boolean
 */
FastClick.prototype.deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent);


/**
 * iOS 4 requires an exception for select elements.
 *
 * @type boolean
 */
FastClick.prototype.deviceIsIOS4 = FastClick.prototype.deviceIsIOS && (/OS 4_\d(_\d)?/).test(navigator.userAgent);


/**
 * iOS 6.0(+?) requires the target element to be manually derived
 *
 * @type boolean
 */
FastClick.prototype.deviceIsIOSWithBadTarget = FastClick.prototype.deviceIsIOS && (/OS ([6-9]|\d{2})_\d/).test(navigator.userAgent);


/**
 * Determine whether a given element requires a native click.
 *
 * @param {EventTarget|Element} target Target DOM element
 * @returns {boolean} Returns true if the element needs a native click
 */
FastClick.prototype.needsClick = function(target) {
    
    switch (target.nodeName.toLowerCase()) {

    // Don't send a synthetic click to disabled inputs (issue #62)
    case 'button':
    case 'select':
    case 'textarea':
        if (target.disabled) {
            return true;
        }

        break;
    case 'input':

        // File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
        if ((this.deviceIsIOS && target.type === 'file') || target.disabled) {
            return true;
        }

        break;
    case 'label':
    case 'video':
        return true;
    }

    return (/\bneedsclick\b/).test(target.className);
};


/**
 * Determine whether a given element requires a call to focus to simulate click into element.
 *
 * @param {EventTarget|Element} target Target DOM element
 * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.
 */
FastClick.prototype.needsFocus = function(target) {
    
    switch (target.nodeName.toLowerCase()) {
    case 'textarea':
    case 'select':
        return true;
    case 'input':
        switch (target.type) {
        case 'button':
        case 'checkbox':
        case 'file':
        case 'image':
        case 'radio':
        case 'submit':
            return false;
        }

        // No point in attempting to focus disabled inputs
        return !target.disabled && !target.readOnly;
    default:
        return (/\bneedsfocus\b/).test(target.className);
    }
};


/**
 * Send a click event to the specified element.
 *
 * @param {EventTarget|Element} targetElement
 * @param {Event} event
 */
FastClick.prototype.sendClick = function(targetElement, event) {
    
    var clickEvent, touch;

    // On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
    if (document.activeElement && document.activeElement !== targetElement) {
        document.activeElement.blur();
    }

    touch = event.changedTouches[0];

    // Synthesise a click event, with an extra attribute so it can be tracked
    clickEvent = document.createEvent('MouseEvents');
    clickEvent.initMouseEvent('click', true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
    clickEvent.forwardedTouchEvent = true;
    targetElement.dispatchEvent(clickEvent);
};


/**
 * @param {EventTarget|Element} targetElement
 */
FastClick.prototype.focus = function(targetElement) {
    
    var length;

    if (this.deviceIsIOS && targetElement.setSelectionRange) {
        length = targetElement.value.length;
        targetElement.setSelectionRange(length, length);
    } else {
        targetElement.focus();
    }
};


/**
 * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
 *
 * @param {EventTarget|Element} targetElement
 */
FastClick.prototype.updateScrollParent = function(targetElement) {
    
    var scrollParent, parentElement;

    scrollParent = targetElement.fastClickScrollParent;

    // Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
    // target element was moved to another parent.
    if (!scrollParent || !scrollParent.contains(targetElement)) {
        parentElement = targetElement;
        do {
            if (parentElement.scrollHeight > parentElement.offsetHeight) {
                scrollParent = parentElement;
                targetElement.fastClickScrollParent = parentElement;
                break;
            }

            parentElement = parentElement.parentElement;
        } while (parentElement);
    }

    // Always update the scroll top tracker if possible.
    if (scrollParent) {
        scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
    }
};


/**
 * @param {EventTarget} targetElement
 * @returns {Element|EventTarget}
 */
FastClick.prototype.getTargetElementFromEventTarget = function(eventTarget) {
    

    // On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
    if (eventTarget.nodeType === Node.TEXT_NODE) {
        return eventTarget.parentNode;
    }

    return eventTarget;
};


/**
 * On touch start, record the position and scroll offset.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onTouchStart = function(event) {
    
    var targetElement, touch, selection;

    targetElement = this.getTargetElementFromEventTarget(event.target);
    touch = event.targetTouches[0];

    if (this.deviceIsIOS) {

        // Only trusted events will deselect text on iOS (issue #49)
        selection = window.getSelection();
        if (selection.rangeCount && !selection.isCollapsed) {
            return true;
        }

        if (!this.deviceIsIOS4) {

            // Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
            // when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
            // with the same identifier as the touch event that previously triggered the click that triggered the alert.
            // Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
            // immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
            if (touch.identifier === this.lastTouchIdentifier) {
                event.preventDefault();
                return false;
            }

            this.lastTouchIdentifier = touch.identifier;

            // If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
            // 1) the user does a fling scroll on the scrollable layer
            // 2) the user stops the fling scroll with another tap
            // then the event.target of the last 'touchend' event will be the element that was under the user's finger
            // when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
            // is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
            this.updateScrollParent(targetElement);
        }
    }

    this.trackingClick = true;
    this.trackingClickStart = event.timeStamp;
    this.targetElement = targetElement;

    this.touchStartX = touch.pageX;
    this.touchStartY = touch.pageY;

    // Prevent phantom clicks on fast double-tap (issue #36)
    if ((event.timeStamp - this.lastClickTime) < 200) {
        event.preventDefault();
    }

    return true;
};


/**
 * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.touchHasMoved = function(event) {
    
    var touch = event.changedTouches[0];

    if (Math.abs(touch.pageX - this.touchStartX) > 10 || Math.abs(touch.pageY - this.touchStartY) > 10) {
        return true;
    }

    return false;
};


/**
 * Attempt to find the labelled control for the given label element.
 *
 * @param {EventTarget|HTMLLabelElement} labelElement
 * @returns {Element|null}
 */
FastClick.prototype.findControl = function(labelElement) {
    

    // Fast path for newer browsers supporting the HTML5 control attribute
    if (labelElement.control !== undefined) {
        return labelElement.control;
    }

    // All browsers under test that support touch events also support the HTML5 htmlFor attribute
    if (labelElement.htmlFor) {
        return document.getElementById(labelElement.htmlFor);
    }

    // If no for attribute exists, attempt to retrieve the first labellable descendant element
    // the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label
    return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
};


/**
 * On touch end, determine whether to send a click event at once.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onTouchEnd = function(event) {
    
    var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;

    // If the touch has moved, cancel the click tracking
    if (this.touchHasMoved(event)) {
        this.trackingClick = false;
        this.targetElement = null;
    }

    if (!this.trackingClick) {
        return true;
    }

    // Prevent phantom clicks on fast double-tap (issue #36)
    if ((event.timeStamp - this.lastClickTime) < 200) {
        this.cancelNextClick = true;
        return true;
    }

    this.lastClickTime = event.timeStamp;

    trackingClickStart = this.trackingClickStart;
    this.trackingClick = false;
    this.trackingClickStart = 0;

    // On some iOS devices, the targetElement supplied with the event is invalid if the layer
    // is performing a transition or scroll, and has to be re-detected manually. Note that
    // for this to function correctly, it must be called *after* the event target is checked!
    // See issue #57; also filed as rdar://13048589 .
    if (this.deviceIsIOSWithBadTarget) {
        touch = event.changedTouches[0];
        targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset);
    }

    targetTagName = targetElement.tagName.toLowerCase();
    if (targetTagName === 'label') {
        forElement = this.findControl(targetElement);
        if (forElement) {
            this.focus(targetElement);
            if (this.deviceIsAndroid) {
                return false;
            }

            targetElement = forElement;
        }
    } else if (this.needsFocus(targetElement)) {

        // Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.
        // Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).
        if ((event.timeStamp - trackingClickStart) > 100 || (this.deviceIsIOS && window.top !== window && targetTagName === 'input')) {
            this.targetElement = null;
            return false;
        }

        this.focus(targetElement);

        // Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
        if (!this.deviceIsIOS4 || targetTagName !== 'select') {
            this.targetElement = null;
            event.preventDefault();
        }

        return false;
    }

    if (this.deviceIsIOS && !this.deviceIsIOS4) {

        // Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled
        // and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).
        scrollParent = targetElement.fastClickScrollParent;
        if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
            return true;
        }
    }

    // Prevent the actual click from going though - unless the target node is marked as requiring
    // real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.
    if (!this.needsClick(targetElement)) {
        event.preventDefault();
        this.sendClick(targetElement, event);
    }

    return false;
};


/**
 * On touch cancel, stop tracking the click.
 *
 * @returns {void}
 */
FastClick.prototype.onTouchCancel = function() {
    
    this.trackingClick = false;
    this.targetElement = null;
};


/**
 * Determine mouse events which should be permitted.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onMouse = function(event) {
    

    // If a target element was never set (because a touch event was never fired) allow the event
    if (!this.targetElement) {
        return true;
    }

    if (event.forwardedTouchEvent) {
        return true;
    }

    // Programmatically generated events targeting a specific element should be permitted
    if (!event.cancelable) {
        return true;
    }

    // Derive and check the target element to see whether the mouse event needs to be permitted;
    // unless explicitly enabled, prevent non-touch click events from triggering actions,
    // to prevent ghost/doubleclicks.
    if (!this.needsClick(this.targetElement) || this.cancelNextClick) {

        // Prevent any user-added listeners declared on FastClick element from being fired.
        if (event.stopImmediatePropagation) {
            event.stopImmediatePropagation();
        } else {

            // Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
            event.propagationStopped = true;
        }

        // Cancel the event
        event.stopPropagation();
        event.preventDefault();

        return false;
    }

    // If the mouse event is permitted, return true for the action to go through.
    return true;
};


/**
 * On actual clicks, determine whether this is a touch-generated click, a click action occurring
 * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
 * an actual click which should be permitted.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onClick = function(event) {
    
    var permitted;

    // It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.
    if (this.trackingClick) {
        this.targetElement = null;
        this.trackingClick = false;
        return true;
    }

    // Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.
    if (event.target.type === 'submit' && event.detail === 0) {
        return true;
    }

    permitted = this.onMouse(event);

    // Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.
    if (!permitted) {
        this.targetElement = null;
    }

    // If clicks are permitted, return true for the action to go through.
    return permitted;
};


/**
 * Remove all FastClick's event listeners.
 *
 * @returns {void}
 */
FastClick.prototype.destroy = function() {
    
    var layer = this.layer;

    if (this.deviceIsAndroid) {
        layer.removeEventListener('mouseover', this.onMouse, true);
        layer.removeEventListener('mousedown', this.onMouse, true);
        layer.removeEventListener('mouseup', this.onMouse, true);
    }

    layer.removeEventListener('click', this.onClick, true);
    layer.removeEventListener('touchstart', this.onTouchStart, false);
    layer.removeEventListener('touchend', this.onTouchEnd, false);
    layer.removeEventListener('touchcancel', this.onTouchCancel, false);
};


FastClick.notNeeded = function() {
    
    var metaViewport;

    // Devices that don't support touch don't need FastClick
    if (typeof window.ontouchstart === 'undefined') {
        return true;
    }

    if ((/Chrome\/[0-9]+/).test(navigator.userAgent)) {

        // Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
        if (FastClick.prototype.deviceIsAndroid) {
            metaViewport = document.querySelector('meta[name=viewport]');
            if (metaViewport && metaViewport.content.indexOf('user-scalable=no') !== -1) {
                return true;
            }

        // Chrome desktop doesn't need FastClick (issue #15)
        } else {
            return true;
        }
    }

    return false;
};


/**
 * Factory method for creating a FastClick object
 *
 * @param {Element} layer The layer to listen on
 */
FastClick.attach = function(layer) {
    
    return new FastClick(layer);
};


return FastClick;
});
define('main',['modules/idiom', 'modules/comm', 'modules/templates', 'libs/fastclick', 'zepto'], function (idiom, comm, templates, FastClick, $) {

    //var riAPI_url = 'http://theribots.nodejitsu.com/api/';
    var riAPI_url = '//' + window.location.hostname + ':25708/api/';

    new FastClick(document.body);

    var team_request = comm.request({
        url: riAPI_url + 'team/',
        done: function (data) {

            var html = templates['team'](data),
                $menu = null;

            $('.bounds').append(html);

            $menu = $('.section-list');

            $menu.on('click', '.section', function (e) {

                var el = e.currentTarget,
                    url = el.dataset.url,
                    member_request;

                member_request = comm.request({
                    url: url,
                    done: function (data) {
                        data.ribotarURL = url + '/ribotar/';
                        var html = templates['member_profile'](data);
                        $(el).find('.section__body').append(html);
                        setTimeout(function () {
                            $(el).addClass('is-ready');
                        }, 1);
                        //$menu.off('click');
                    }
                });
            });
        }
    });

    console.log('App initialised');
});

require(["main"]);
}());