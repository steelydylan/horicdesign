/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

// minimal template polyfill
if (typeof HTMLTemplateElement === 'undefined') {
  (function() {

    var TEMPLATE_TAG = 'template';

    var contentDoc = document.implementation.createHTMLDocument('template');
    var canDecorate = true;

    /**
      Provides a minimal shim for the <template> element.
    */
    HTMLTemplateElement = function() {};
    HTMLTemplateElement.prototype = Object.create(HTMLElement.prototype);

    /**
      The `decorate` method moves element children to the template's `content`.
      NOTE: there is no support for dynamically adding elements to templates.
    */
    HTMLTemplateElement.decorate = function(template) {
      if (!template.content) {
        template.content = contentDoc.createDocumentFragment();
      }
      var child;
      while (child = template.firstChild) {
        template.content.appendChild(child);
      }
      // add innerHTML to template, if possible
      // Note: this throws on Safari 7
      if (canDecorate) {
        try {
          Object.defineProperty(template, 'innerHTML', {
            get: function() {
              var o = '';
              for (var e = this.content.firstChild; e; e = e.nextSibling) {
                o += e.outerHTML || escapeData(e.data);
              }
              return o;
            },
            set: function(text) {
              contentDoc.body.innerHTML = text;
              HTMLTemplateElement.bootstrap(contentDoc);
              while (this.content.firstChild) {
                this.content.removeChild(this.content.firstChild);
              }
              while (contentDoc.body.firstChild) {
                this.content.appendChild(contentDoc.body.firstChild);
              }
            },
            configurable: true
          });
        } catch (err) {
          canDecorate = false;
        }
      }
    };

    /**
      The `bootstrap` method is called automatically and "fixes" all
      <template> elements in the document referenced by the `doc` argument.
    */
    HTMLTemplateElement.bootstrap = function(doc) {
      var templates = doc.querySelectorAll(TEMPLATE_TAG);
      for (var i=0, l=templates.length, t; (i<l) && (t=templates[i]); i++) {
        HTMLTemplateElement.decorate(t);
      }
    };

    // auto-bootstrapping for main document
    window.addEventListener('DOMContentLoaded', function() {
      HTMLTemplateElement.bootstrap(document);
    });

    // Patch document.createElement to ensure newly created templates have content
    var createElement = document.createElement;
    document.createElement = function() {
      'use strict';
      var el = createElement.apply(document, arguments);
      if (el.localName == 'template') {
        HTMLTemplateElement.decorate(el);
      }
      return el;
    };

    var escapeDataRegExp = /[&\u00A0<>]/g;

    function escapeReplace(c) {
      switch (c) {
        case '&':
          return '&amp;';
        case '<':
          return '&lt;';
        case '>':
          return '&gt;';
        case '\u00A0':
          return '&nbsp;';
      }
    }

    function escapeData(s) {
      return s.replace(escapeDataRegExp, escapeReplace);
    }

  })();
}
