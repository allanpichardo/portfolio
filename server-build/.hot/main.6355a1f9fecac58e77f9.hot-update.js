exports.id = "main";
exports.modules = {

/***/ "./server/app.js":
/*!***********************!*\
  !*** ./server/app.js ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-router-dom */ \"react-router-dom\");\n/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_router_dom__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _cra_express_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @cra-express/core */ \"@cra-express/core\");\n/* harmony import */ var _cra_express_core__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_cra_express_core__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var react_helmet_async__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-helmet-async */ \"react-helmet-async\");\n/* harmony import */ var react_helmet_async__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_helmet_async__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _src_App__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../src/App */ \"./src/App.js\");\nvar _jsxFileName = \"/Users/allanpichardo/Documents/Dev/allanpichardo2020/server/app.js\";\n\n\n\n\n\nconst path = __webpack_require__(/*! path */ \"path\");\n\nconst React = __webpack_require__(/*! react */ \"react\");\n\nconst clientBuildPath = path.resolve(__dirname, '../client');\nlet helmetCtx;\nconst app = Object(_cra_express_core__WEBPACK_IMPORTED_MODULE_1__[\"createReactAppExpress\"])({\n  clientBuildPath,\n  universalRender: handleUniversalRender,\n\n  onFinish(req, res, html) {\n    const {\n      helmet\n    } = helmetCtx;\n    const helmetTitle = helmet.title.toString();\n    const helmetMeta = helmet.meta.toString();\n    const newHtml = html.replace('{{HELMET_TITLE}}', helmetTitle).replace('{{HELMET_META}}', helmetMeta);\n    res.send(newHtml);\n  }\n\n});\n\nfunction handleUniversalRender(req, res) {\n  const context = {};\n  helmetCtx = {};\n  const el = /*#__PURE__*/React.createElement(react_helmet_async__WEBPACK_IMPORTED_MODULE_2__[\"HelmetProvider\"], {\n    context: helmetCtx,\n    __source: {\n      fileName: _jsxFileName,\n      lineNumber: 30\n    }\n  }, /*#__PURE__*/React.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_0__[\"StaticRouter\"], {\n    location: req.url,\n    context: context,\n    __source: {\n      fileName: _jsxFileName,\n      lineNumber: 31\n    }\n  }, /*#__PURE__*/React.createElement(_src_App__WEBPACK_IMPORTED_MODULE_3__[\"default\"], {\n    __source: {\n      fileName: _jsxFileName,\n      lineNumber: 32\n    }\n  })));\n\n  if (context.url) {\n    res.redirect(301, context.url);\n    return;\n  }\n\n  return el;\n}\n\nif (true) {\n  module.hot.accept(/*! ../src/App */ \"./src/App.js\", function(__WEBPACK_OUTDATED_DEPENDENCIES__) { /* harmony import */ _src_App__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../src/App */ \"./src/App.js\");\n(() => {\n    App = __webpack_require__(/*! ../src/App */ \"./src/App.js\").default;\n    console.log('✅ Server hot reloaded App');\n  })(__WEBPACK_OUTDATED_DEPENDENCIES__); }.bind(this));\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (app);\n\n//# sourceURL=webpack:///./server/app.js?");

/***/ })

};