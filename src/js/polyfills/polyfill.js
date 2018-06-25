/*eslint-disable */
module.exports = function() {

  (function (arr) {
    arr.forEach(function (item) {
      if (item.hasOwnProperty('remove')) {
        return;
      }
      Object.defineProperty(item, 'remove', {
        configurable: true,
        enumerable: true,
        writable: true,
        value: function remove() {
          if (this.parentNode !== null)
            this.parentNode.removeChild(this);
        }
      });
    });
  })([Element.prototype, CharacterData.prototype, DocumentType.prototype]);

  // Object.assign
  if ( typeof Object.assign !== 'function' ) {
    // Must be writable: true, enumerable: false, configurable: true
    Object.defineProperty( Object, 'assign', {
      value: function assign( target, varArgs ) { // .length of function is 2
        'use strict';
        var to;

        if ( target === null ) { // TypeError if undefined or null
          throw new TypeError( 'Cannot convert undefined or null to object' );
        }

        to = Object( target );

        for ( var index = 1; index < arguments.length; index++ ) {
          var nextSource = arguments[ index ];

          if ( nextSource !== null ) { // Skip over if undefined or null
            for ( var nextKey in nextSource ) {
              // Avoid bugs when hasOwnProperty is shadowed
              if ( Object.prototype.hasOwnProperty.call( nextSource, nextKey ) ) {
                to[ nextKey ] = nextSource[ nextKey ];
              }
            }
          }
        }
        return to;
      },
      writable: true,
      configurable: true
    });
  }

  if ( !Element.prototype.matches ) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
  }

  if ( !Element.prototype.closest ) {
    Element.prototype.closest = function( s ) {
      var el = this;

      if ( !document.documentElement.contains( el ) ) {
        return null;
      }
      do {
        if ( el.matches( s ) ) {
          return el;
        }
        el = el.parentElement || el.parentNode;
      } while ( el !== null );
      return null;
    };
  }

// localStorage (from MDN:
// https://developer.mozilla.org/en-US/docs/Web/API/Storage/LocalStorage)
if (!window.localStorage) {
  Object.defineProperty(window, "localStorage", new (function () {
    var aKeys = [], oStorage = {};
    Object.defineProperty(oStorage, "getItem", {
      value: function (sKey) { return sKey ? this[sKey] : null; },
      writable: false,
      configurable: false,
      enumerable: false
    });
    Object.defineProperty(oStorage, "key", {
      value: function (nKeyId) { return aKeys[nKeyId]; },
      writable: false,
      configurable: false,
      enumerable: false
    });
    Object.defineProperty(oStorage, "setItem", {
      value: function (sKey, sValue) {
        if(!sKey) { return; }
        document.cookie = escape(sKey) + "=" + escape(sValue) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
      },
      writable: false,
      configurable: false,
      enumerable: false
    });
    Object.defineProperty(oStorage, "length", {
      get: function () { return aKeys.length; },
      configurable: false,
      enumerable: false
    });
    Object.defineProperty(oStorage, "removeItem", {
      value: function (sKey) {
        if(!sKey) { return; }
        document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
      },
      writable: false,
      configurable: false,
      enumerable: false
    });
    Object.defineProperty(oStorage, "clear", {
      value: function () {
        if(!aKeys.length) { return; }
        for (var sKey in aKeys) {
          document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
        }
      },
      writable: false,
      configurable: false,
      enumerable: false
    });
    this.get = function () {
      var iThisIndx;
      for (var sKey in oStorage) {
        iThisIndx = aKeys.indexOf(sKey);
        if (iThisIndx === -1) { oStorage.setItem(sKey, oStorage[sKey]); }
        else { aKeys.splice(iThisIndx, 1); }
        delete oStorage[sKey];
      }
      for (aKeys; aKeys.length > 0; aKeys.splice(0, 1)) { oStorage.removeItem(aKeys[0]); }
      for (var aCouple, iKey, nIdx = 0, aCouples = document.cookie.split(/\s*;\s*/); nIdx < aCouples.length; nIdx++) {
        aCouple = aCouples[nIdx].split(/\s*=\s*/);
        if (aCouple.length > 1) {
          oStorage[iKey = unescape(aCouple[0])] = unescape(aCouple[1]);
          aKeys.push(iKey);
        }
      }
      return oStorage;
    };
    this.configurable = false;
    this.enumerable = true;
  })());
}};

/*eslint-enable */
