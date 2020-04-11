/******/ (function(modules) { // webpackBootstrap
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var chunk = require("./" + ".hot/" + chunkId + "." + hotCurrentHash + ".hot-update.js");
/******/ 		hotAddUpdateChunk(chunk.id, chunk.modules);
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest() {
/******/ 		try {
/******/ 			var update = require("./" + ".hot/" + hotCurrentHash + ".hot-update.json");
/******/ 		} catch (e) {
/******/ 			return Promise.resolve();
/******/ 		}
/******/ 		return Promise.resolve(update);
/******/ 	}
/******/
/******/ 	//eslint-disable-next-line no-unused-vars
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentHash = "2f44deba6b45519e033b";
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParents = [];
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = [];
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1) {
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					}
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) {
/******/ 					me.children.push(request);
/******/ 				}
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e" &&
/******/ 				name !== "t"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		fn.t = function(value, mode) {
/******/ 			if (mode & 1) value = fn(value);
/******/ 			return __webpack_require__.t(value, mode & ~1);
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (dep === undefined) hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (dep === undefined) hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle") {
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		}
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = "main";
/******/ 			// eslint-disable-next-line no-lone-blocks
/******/ 			{
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (!module || module.hot._selfAccepted) continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				/** @type {TODO} */
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				/** @type {Error|false} */
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted &&
/******/ 				// removed self-accepted modules should not be required
/******/ 				appliedUpdate[moduleId] !== warnUnexpectedRequire
/******/ 			) {
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/css-loader/dist/cjs.js!./src/App.css":
/*!***********************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/App.css ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// Imports\nvar ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ \"./node_modules/css-loader/dist/runtime/api.js\");\nexports = ___CSS_LOADER_API_IMPORT___(false);\n// Module\nexports.push([module.i, \".App {\\n    position: relative;\\n    height: 100%;\\n    display: grid;\\n    grid-template-areas:\\n    \\\"header\\\"\\n    \\\"body\\\";\\n    grid-template-rows: 60px 1fr;\\n    grid-template-columns: 100%;\\n    /*background: url(\\\"/img/cover_talkinghead.gif\\\") 0% 0% / cover;*/\\n    background: var(--color-bg-main) 0% 0% / cover;\\n    transition: background 0.25s ease;\\n}\\n\\n.App-header {\\n    grid-area: header;\\n    z-index: 3;\\n}\\n\\n.App-body {\\n    z-index: 2;\\n    grid-area: body;\\n    overflow: hidden;\\n}\\n\\n.App-video {\\n    position: absolute;\\n    top: 0;\\n    left: 0;\\n    object-fit: cover;\\n    width: 100%;\\n    height: 100%;\\n    pointer-events:none;\\n    z-index: 1;\\n    opacity: 0;\\n    transition: opacity 0.5s ease-in-out;\\n}\\n\", \"\"]);\n// Exports\nmodule.exports = exports;\n\n\n//# sourceURL=webpack:///./src/App.css?./node_modules/css-loader/dist/cjs.js");

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/components/About.css":
/*!************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/components/About.css ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// Imports\nvar ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ \"./node_modules/css-loader/dist/runtime/api.js\");\nexports = ___CSS_LOADER_API_IMPORT___(false);\n// Module\nexports.push([module.i, \".About {\\n    display: flex;\\n    padding-left: 20px;\\n    padding-right: 20px;\\n    font-size: large;\\n    max-height: 100%;\\n    overflow-y: scroll;\\n}\\n\\n.About p {\\n    white-space: pre-line;\\n}\\n\", \"\"]);\n// Exports\nmodule.exports = exports;\n\n\n//# sourceURL=webpack:///./src/components/About.css?./node_modules/css-loader/dist/cjs.js");

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/components/Contact.css":
/*!**************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/components/Contact.css ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// Imports\nvar ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ \"./node_modules/css-loader/dist/runtime/api.js\");\nexports = ___CSS_LOADER_API_IMPORT___(false);\n// Module\nexports.push([module.i, \".Contact {\\n    height: 100%;\\n    padding-left: 20px;\\n    padding-right: 20px;\\n    grid-gap:10px;\\n    display: grid;\\n    grid-template-areas:\\n    \\\"message form .\\\";\\n    grid-template-columns: 1fr 2fr 1fr;\\n    font-size: large;\\n}\\n\\n@media screen and (max-width: 500px) {\\n    .Contact {\\n        grid-template-areas:\\n                \\\"message form\\\";\\n        grid-template-columns: 1fr 2fr;\\n    }\\n}\\n\\n.Contact-message {\\n    grid-area: message;\\n}\\n\\n.Contact-form {\\n    grid-area: form;\\n    align-self: center;\\n}\\n\\n.Contact input{\\n    height: 30px;\\n    border: none;\\n    font-size: large;\\n    border-radius: 1px;\\n    background-color: var(--color-text-secondary);\\n    color: var(--color-accent);\\n    width: 100%;\\n}\\n\\n.Contact textarea {\\n    width: 100%;\\n    height: 150px;\\n    border: none;\\n    font-size: large;\\n    border-radius: 1px;\\n    background-color: var(--color-text-secondary);\\n    color: var(--color-accent);\\n}\\n\\n.Contact-success {\\n    width: 100%;\\n    height: 100%;\\n    display: flex;\\n    text-align: center;\\n    align-items: center;\\n    justify-content: center;\\n}\\n\\n.Contact-error {\\n    display: none;\\n}\\n\\n.Contact-error mark {\\n    background-color: red;\\n    color: yellow;\\n    font-weight: bold;\\n}\\n\\n.Contact button {\\n    border: none;\\n    background-color: var(--color-accent);\\n    color: var(--color-text-secondary);\\n    cursor: pointer;\\n    font-weight: bold;\\n    font-size: large;\\n    float: right;\\n    height: 48px;\\n    width: 100px;\\n}\\n\", \"\"]);\n// Exports\nmodule.exports = exports;\n\n\n//# sourceURL=webpack:///./src/components/Contact.css?./node_modules/css-loader/dist/cjs.js");

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/components/IntroPanel.css":
/*!*****************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/components/IntroPanel.css ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// Imports\nvar ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ \"./node_modules/css-loader/dist/runtime/api.js\");\nexports = ___CSS_LOADER_API_IMPORT___(false);\n// Module\nexports.push([module.i, \".IntroPanel {\\n    align-self: center;\\n    display: flex;\\n    align-items: center;\\n    flex-direction: column;\\n    font-size: x-large;\\n    margin-left: 20px;\\n    margin-right: 20px;\\n}\\n\\n.IntroPanel h1 {\\n    color: var(--color-text-secondary);\\n    /*background-color: var(--color-accent);*/\\n    font-weight: bold;\\n}\\n\\n.IntroPanel span {\\n    width: 80%;\\n    text-align: right;\\n    animation: 1s ease-in-out 1s infinite alternate bob;\\n}\\n\\n@keyframes bob {\\n    from { margin-left: 0; }\\n    to   { margin-left: 24px; }\\n}\\n\", \"\"]);\n// Exports\nmodule.exports = exports;\n\n\n//# sourceURL=webpack:///./src/components/IntroPanel.css?./node_modules/css-loader/dist/cjs.js");

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/components/NavBar.css":
/*!*************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/components/NavBar.css ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// Imports\nvar ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ \"./node_modules/css-loader/dist/runtime/api.js\");\nexports = ___CSS_LOADER_API_IMPORT___(false);\n// Module\nexports.push([module.i, \".NavBar {\\n    display: grid;\\n    align-items: center;\\n    height: 100%;\\n    grid-template-columns: 4fr 1fr;\\n    padding-right: 20px;\\n    overflow: visible;\\n}\\n\\n.NavBar-dropdown {\\n    display: block;\\n    position: fixed;\\n    background-color: var(--color-accent);\\n    padding: 10px 16px;\\n    visibility: hidden;\\n    z-index: 5;\\n    overflow: hidden;\\n    pointer-events: auto;\\n}\\n\\n.NavBar-dropdown a{\\n    margin-left: 0 !important;\\n}\\n\\n.NavBar a{\\n    text-decoration: none;\\n    font-weight: 800;\\n    margin-left: 16px;\\n    font-size: large;\\n    color: var(--color-text-secondary);\\n    background-color: var(--color-accent);\\n}\\n\\n.NavBar a:hover {\\n    color: var(--color-accent);\\n    background-color: var(--color-text-secondary);\\n    /*text-decoration: underline;*/\\n}\\n\\n.NavBar-active {\\n    color: var(--color-accent) !important;\\n    background-color: var(--color-text-secondary) !important;\\n    /*text-decoration: underline;*/\\n}\\n\", \"\"]);\n// Exports\nmodule.exports = exports;\n\n\n//# sourceURL=webpack:///./src/components/NavBar.css?./node_modules/css-loader/dist/cjs.js");

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/components/ProjectDetails.css":
/*!*********************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/components/ProjectDetails.css ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// Imports\nvar ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ \"./node_modules/css-loader/dist/runtime/api.js\");\nexports = ___CSS_LOADER_API_IMPORT___(false);\n// Module\nexports.push([module.i, \".ProjectDetails {\\n    height: 100%;\\n    overflow-y: scroll;\\n    padding-left: 20px;\\n    padding-right: 20px;\\n}\\n\\n.ProjectDetails video {\\n    width: 100%;\\n    /*max-height: 480px;*/\\n    /*max-width: 720px;*/\\n}\\n\\n/* This element defines the size the iframe will take.\\n   In this example we want to have a ratio of 25:14 */\\n.ProjectDetails-aspect-ratio {\\n    position: relative;\\n    width: 100%;\\n    height: 0;\\n    padding-bottom: 56.25%; /* The height of the item will now be 56.25% of the width. */\\n}\\n\\n.ProjectDetails-aspect-ratio iframe {\\n    position: absolute;\\n    width: 100%;\\n    height: 100%;\\n    left: 0;\\n    top: 0;\\n}\\n\\n.ProjectDetails h1 {\\n    font-size: xx-large;\\n}\\n\\n.ProjectDetails h2 {\\n    font-size: small;\\n}\\n\\n.ProjectDetails-section {\\n    font-size: x-large;\\n    width: 100%;\\n    display: grid;\\n    grid-gap: 20px;\\n    grid-template-columns: 1fr 1fr 1fr;\\n    grid-template-rows: 60px 70px 1fr 1fr 1fr 1fr 1.1fr;\\n    grid-template-areas:\\n            \\\"title . .\\\"\\n            \\\"subtitle . .\\\"\\n            \\\"a1 b1 c1\\\"\\n            \\\"d1 e1 f1\\\"\\n            \\\"g1 h1 i1\\\"\\n            \\\"a2 b2 c2\\\"\\n            \\\"d2 e2 f2\\\";\\n}\\n\\n.ProjectDetails-title {\\n    grid-area: title;\\n}\\n\\n.projectDetails-subtitle {\\n    grid-area: subtitle;\\n}\\n\\n.ProjectDetails-video1 {\\n    grid-area: a1-start / a1-start / e1-end / e1-end;\\n}\\n\\n.ProjectDetails-description1 {\\n    grid-area: c1-start / c1-start /i1-end / i1-end;\\n}\\n\\n.ProjectDetails-background1 {\\n    background-color: var(--color-text-secondary);\\n    grid-area: e1-start / e1-start / i1-end / i1-end;\\n}\\n\\n.ProjectDetails-video2 {\\n    grid-area: b2-start / b2-start / f2-end / f2-end;\\n}\\n\\n.ProjectDetails-description2 {\\n    grid-area: g1-start / g1-start /d2-end / d2-start;\\n}\\n\\n.ProjectDetails-background2 {\\n    background-color: var(--color-text-secondary);\\n    grid-area: d2-start / d2-start / e2-end / e2-end;\\n}\\n\\n@media screen and (min-width: 1131px) {\\n\\n    .ProjectDetails-section {\\n        grid-template-rows: 60px 70px 1fr 0.1fr 1fr 1fr 1.1fr;\\n        font-size: xx-large;\\n    }\\n\\n    .ProjectDetails-video1 {\\n        grid-area: a1-start / a1-start / h1-end / h1-end;\\n    }\\n\\n    .ProjectDetails-description1 {\\n        grid-area: c1-start / c1-start /i1-end / i1-end;\\n    }\\n\\n    .ProjectDetails-background1 {\\n        background-color: var(--color-text-secondary);\\n        grid-area: e1-start / e1-start / i1-end / i1-end;\\n    }\\n\\n    .ProjectDetails-video2 {\\n        grid-area: b2-start / b2-start / f2-end / f2-end;\\n    }\\n\\n    .ProjectDetails-description2 {\\n        grid-area: a2-start / a2-start /d2-end / d2-start;\\n    }\\n\\n    .ProjectDetails-background2 {\\n        background-color: var(--color-text-secondary);\\n        grid-area: d2-start / d2-start / e2-end / e2-end;\\n    }\\n}\\n\\n@media screen and (max-width: 719px) {\\n    .ProjectDetails-section {\\n        grid-template-columns: 0 1fr 0;\\n        grid-gap: 0;\\n        grid-template-rows: 60px 0.1fr 0.5fr 0.5fr 0.1fr 1fr 0.3fr;\\n    }\\n    .ProjectDetails-video1 {\\n        grid-area: b1;\\n    }\\n\\n    .ProjectDetails-description1 {\\n        grid-area: e1;\\n    }\\n\\n    .ProjectDetails-video2 {\\n        grid-area: h1;\\n    }\\n\\n    .ProjectDetails-description2 {\\n        grid-area: b2;\\n    }\\n\\n}\\n\", \"\"]);\n// Exports\nmodule.exports = exports;\n\n\n//# sourceURL=webpack:///./src/components/ProjectDetails.css?./node_modules/css-loader/dist/cjs.js");

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/components/ProjectPanel.css":
/*!*******************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/components/ProjectPanel.css ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// Imports\nvar ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ \"./node_modules/css-loader/dist/runtime/api.js\");\nexports = ___CSS_LOADER_API_IMPORT___(false);\n// Module\nexports.push([module.i, \".ProjectPanel {\\n    position: relative;\\n    width: 100%;\\n    height: 100%;\\n    display: flex;\\n    justify-content: flex-end;\\n    align-items: center;\\n}\\n\\n.ProjectPanel h1 {\\n    color: var(--color-text-secondary);\\n    background-color: var(--color-accent);\\n}\\n\\n.ProjectPanel-overlay {\\n    position: absolute;\\n    top: 0;\\n    left: 0;\\n    width: 100%;\\n    height: 100%;\\n    background-color: var(--color-overlay);\\n    opacity: 0.0;\\n}\\n\\n.ProjectPanel-overlay-active {\\n    opacity: 0.7;\\n}\\n\", \"\"]);\n// Exports\nmodule.exports = exports;\n\n\n//# sourceURL=webpack:///./src/components/ProjectPanel.css?./node_modules/css-loader/dist/cjs.js");

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/components/WorksOverview.css":
/*!********************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/components/WorksOverview.css ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// Imports\nvar ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ \"./node_modules/css-loader/dist/runtime/api.js\");\nexports = ___CSS_LOADER_API_IMPORT___(false);\n// Module\nexports.push([module.i, \".WorksOverview {\\n    height: 100%;\\n    display: grid;\\n    grid-template-rows: 100%;\\n    overflow-x: scroll;\\n}\\n\\n\", \"\"]);\n// Exports\nmodule.exports = exports;\n\n\n//# sourceURL=webpack:///./src/components/WorksOverview.css?./node_modules/css-loader/dist/cjs.js");

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n/*\n  MIT License http://www.opensource.org/licenses/mit-license.php\n  Author Tobias Koppers @sokra\n*/\n// css base code, injected by the css-loader\n// eslint-disable-next-line func-names\n\nmodule.exports = function (useSourceMap) {\n  var list = []; // return the list of modules as css string\n\n  list.toString = function toString() {\n    return this.map(function (item) {\n      var content = cssWithMappingToString(item, useSourceMap);\n\n      if (item[2]) {\n        return \"@media \".concat(item[2], \" {\").concat(content, \"}\");\n      }\n\n      return content;\n    }).join('');\n  }; // import a list of modules into the list\n  // eslint-disable-next-line func-names\n\n\n  list.i = function (modules, mediaQuery, dedupe) {\n    if (typeof modules === 'string') {\n      // eslint-disable-next-line no-param-reassign\n      modules = [[null, modules, '']];\n    }\n\n    var alreadyImportedModules = {};\n\n    if (dedupe) {\n      for (var i = 0; i < this.length; i++) {\n        // eslint-disable-next-line prefer-destructuring\n        var id = this[i][0];\n\n        if (id != null) {\n          alreadyImportedModules[id] = true;\n        }\n      }\n    }\n\n    for (var _i = 0; _i < modules.length; _i++) {\n      var item = [].concat(modules[_i]);\n\n      if (dedupe && alreadyImportedModules[item[0]]) {\n        // eslint-disable-next-line no-continue\n        continue;\n      }\n\n      if (mediaQuery) {\n        if (!item[2]) {\n          item[2] = mediaQuery;\n        } else {\n          item[2] = \"\".concat(mediaQuery, \" and \").concat(item[2]);\n        }\n      }\n\n      list.push(item);\n    }\n  };\n\n  return list;\n};\n\nfunction cssWithMappingToString(item, useSourceMap) {\n  var content = item[1] || ''; // eslint-disable-next-line prefer-destructuring\n\n  var cssMapping = item[3];\n\n  if (!cssMapping) {\n    return content;\n  }\n\n  if (useSourceMap && typeof btoa === 'function') {\n    var sourceMapping = toComment(cssMapping);\n    var sourceURLs = cssMapping.sources.map(function (source) {\n      return \"/*# sourceURL=\".concat(cssMapping.sourceRoot || '').concat(source, \" */\");\n    });\n    return [content].concat(sourceURLs).concat([sourceMapping]).join('\\n');\n  }\n\n  return [content].join('\\n');\n} // Adapted from convert-source-map (MIT)\n\n\nfunction toComment(sourceMap) {\n  // eslint-disable-next-line no-undef\n  var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));\n  var data = \"sourceMappingURL=data:application/json;charset=utf-8;base64,\".concat(base64);\n  return \"/*# \".concat(data, \" */\");\n}\n\n//# sourceURL=webpack:///./node_modules/css-loader/dist/runtime/api.js?");

/***/ }),

/***/ "./node_modules/isomorphic-style-loader/insertCss.js":
/*!***********************************************************!*\
  !*** ./node_modules/isomorphic-style-loader/insertCss.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/*! Isomorphic Style Loader | MIT License | https://github.com/kriasoft/isomorphic-style-loader */\n\n\n\nvar inserted = {};\n\nfunction b64EncodeUnicode(str) {\n  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {\n    return String.fromCharCode(\"0x\" + p1);\n  }));\n}\n\nfunction removeCss(ids) {\n  ids.forEach(function (id) {\n    if (--inserted[id] <= 0) {\n      var elem = document.getElementById(id);\n\n      if (elem) {\n        elem.parentNode.removeChild(elem);\n      }\n    }\n  });\n}\n\nfunction insertCss(styles, _temp) {\n  var _ref = _temp === void 0 ? {} : _temp,\n      _ref$replace = _ref.replace,\n      replace = _ref$replace === void 0 ? false : _ref$replace,\n      _ref$prepend = _ref.prepend,\n      prepend = _ref$prepend === void 0 ? false : _ref$prepend,\n      _ref$prefix = _ref.prefix,\n      prefix = _ref$prefix === void 0 ? 's' : _ref$prefix;\n\n  var ids = [];\n\n  for (var i = 0; i < styles.length; i++) {\n    var _styles$i = styles[i],\n        moduleId = _styles$i[0],\n        css = _styles$i[1],\n        media = _styles$i[2],\n        sourceMap = _styles$i[3];\n    var id = \"\" + prefix + moduleId + \"-\" + i;\n    ids.push(id);\n\n    if (inserted[id]) {\n      if (!replace) {\n        inserted[id]++;\n        continue;\n      }\n    }\n\n    inserted[id] = 1;\n    var elem = document.getElementById(id);\n    var create = false;\n\n    if (!elem) {\n      create = true;\n      elem = document.createElement('style');\n      elem.setAttribute('type', 'text/css');\n      elem.id = id;\n\n      if (media) {\n        elem.setAttribute('media', media);\n      }\n    }\n\n    var cssText = css;\n\n    if (sourceMap && typeof btoa === 'function') {\n      cssText += \"\\n/*# sourceMappingURL=data:application/json;base64,\" + b64EncodeUnicode(JSON.stringify(sourceMap)) + \"*/\";\n      cssText += \"\\n/*# sourceURL=\" + sourceMap.file + \"?\" + id + \"*/\";\n    }\n\n    if ('textContent' in elem) {\n      elem.textContent = cssText;\n    } else {\n      elem.styleSheet.cssText = cssText;\n    }\n\n    if (create) {\n      if (prepend) {\n        document.head.insertBefore(elem, document.head.childNodes[0]);\n      } else {\n        document.head.appendChild(elem);\n      }\n    }\n  }\n\n  return removeCss.bind(null, ids);\n}\n\nmodule.exports = insertCss;\n//# sourceMappingURL=insertCss.js.map\n\n\n//# sourceURL=webpack:///./node_modules/isomorphic-style-loader/insertCss.js?");

/***/ }),

/***/ "./node_modules/start-server-webpack-plugin/dist/monitor-loader.js!./node_modules/start-server-webpack-plugin/dist/monitor-loader.js":
/*!*******************************************************************************************************************************************!*\
  !*** ./node_modules/start-server-webpack-plugin/dist/monitor-loader.js!./node_modules/start-server-webpack-plugin/dist/monitor-loader.js ***!
  \*******************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("(() => {\n  // Handle hot updates, copied with slight adjustments from webpack/hot/signal.js\n  if (true) {\n    const log = (type, msg) => console[type](`sswp> ${msg}`);\n    // TODO don't show this when sending signal instead of message\n    log('log', 'Handling Hot Module Reloading');\n    var checkForUpdate = function checkForUpdate(fromUpdate) {\n      module.hot.check().then(function (updatedModules) {\n        if (!updatedModules) {\n          if (fromUpdate) log('log', 'Update applied.');else log('warn', 'Cannot find update.');\n          return;\n        }\n\n        return module.hot.apply({\n          ignoreUnaccepted: true,\n          // TODO probably restart\n          onUnaccepted: function onUnaccepted(data) {\n            log('warn', '\\u0007Ignored an update to unaccepted module ' + data.chain.join(' -> '));\n          }\n        }).then(function (renewedModules) {\n          __webpack_require__(/*! webpack/hot/log-apply-result */ \"webpack/hot/log-apply-result\")(updatedModules, renewedModules);\n\n          checkForUpdate(true);\n        });\n      }).catch(function (err) {\n        var status = module.hot.status();\n        if (['abort', 'fail'].indexOf(status) >= 0) {\n          if (process.send) {\n            process.send('SSWP_HMR_FAIL');\n          }\n          log('warn', 'Cannot apply update.');\n          log('warn', '' + err.stack || err.message);\n          log('error', 'Quitting process - will reload on next file change\\u0007\\n\\u0007\\n\\u0007');\n          process.exit(222);\n        } else {\n          log('warn', 'Update failed: ' + err.stack || false);\n        }\n      });\n    };\n\n    process.on('message', function (message) {\n      if (message !== 'SSWP_HMR') return;\n\n      if (module.hot.status() !== 'idle') {\n        log('warn', 'Got signal but currently in ' + module.hot.status() + ' state.');\n        log('warn', 'Need to be in idle state to start hot update.');\n        return;\n      }\n\n      checkForUpdate();\n    });\n  }\n\n  // Tell our plugin we loaded all the code without initially crashing\n  if (process.send) {\n    process.send('SSWP_LOADED');\n  }\n})()\n\n//# sourceURL=webpack:///./node_modules/start-server-webpack-plugin/dist/monitor-loader.js?./node_modules/start-server-webpack-plugin/dist/monitor-loader.js");

/***/ }),

/***/ "./server/app.js":
/*!***********************!*\
  !*** ./server/app.js ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-router-dom */ \"react-router-dom\");\n/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_router_dom__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _cra_express_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @cra-express/core */ \"@cra-express/core\");\n/* harmony import */ var _cra_express_core__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_cra_express_core__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var react_dom_server__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-dom/server */ \"react-dom/server\");\n/* harmony import */ var react_dom_server__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_dom_server__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _src_App__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../src/App */ \"./src/App.js\");\nvar _jsxFileName = \"/Users/allanpichardo/Documents/Dev/allanpichardo2020/server/app.js\";\n\n\n\n\n\nconst path = __webpack_require__(/*! path */ \"path\");\n\nconst React = __webpack_require__(/*! react */ \"react\");\n\nconst clientBuildPath = path.resolve(__dirname, '../client');\n\nfunction handleUniversalRender(req, res) {\n  const context = {};\n  const el = /*#__PURE__*/React.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_0__[\"StaticRouter\"], {\n    location: req.url,\n    context: context,\n    __source: {\n      fileName: _jsxFileName,\n      lineNumber: 15\n    }\n  }, /*#__PURE__*/React.createElement(_src_App__WEBPACK_IMPORTED_MODULE_3__[\"default\"], {\n    __source: {\n      fileName: _jsxFileName,\n      lineNumber: 16\n    }\n  }));\n\n  if (context.url) {\n    res.redirect(301, context.url);\n    return;\n  }\n\n  return el;\n}\n\nconst app = Object(_cra_express_core__WEBPACK_IMPORTED_MODULE_1__[\"createReactAppExpress\"])({\n  clientBuildPath,\n  universalRender: handleUniversalRender\n});\n\nif (true) {\n  module.hot.accept(/*! ../src/App */ \"./src/App.js\", function(__WEBPACK_OUTDATED_DEPENDENCIES__) { /* harmony import */ _src_App__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../src/App */ \"./src/App.js\");\n(() => {\n    App = __webpack_require__(/*! ../src/App */ \"./src/App.js\").default;\n    console.log('✅ Server hot reloaded App');\n  })(__WEBPACK_OUTDATED_DEPENDENCIES__); }.bind(this));\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (app);\n\n//# sourceURL=webpack:///./server/app.js?");

/***/ }),

/***/ "./server/index.js":
/*!*************************!*\
  !*** ./server/index.js ***!
  \*************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var dotenv__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! dotenv */ \"dotenv\");\n/* harmony import */ var dotenv__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(dotenv__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var nodemailer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! nodemailer */ \"nodemailer\");\n/* harmony import */ var nodemailer__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(nodemailer__WEBPACK_IMPORTED_MODULE_1__);\n\n\n\nconst app = __webpack_require__(/*! ./app */ \"./server/app.js\").default;\n\nconst PORT = process.env.PORT || 3001;\n\nconst express = __webpack_require__(/*! express */ \"express\");\n\nconst emailApp = express();\nemailApp.use(express.urlencoded({\n  extended: true\n}));\nemailApp.use(function (req, res, next) {\n  res.header(\"Access-Control-Allow-Origin\", \"*\"); // update to match the domain you will make the request from\n\n  res.header(\"Access-Control-Allow-Headers\", \"Origin, X-Requested-With, Content-Type, Accept\");\n  next();\n});\nconst EMAIL_PORT = 3002;\ndotenv__WEBPACK_IMPORTED_MODULE_0___default.a.config();\nemailApp.post('/email', (req, res) => {\n  let response = {\n    success: false,\n    message: ''\n  };\n  dotenv__WEBPACK_IMPORTED_MODULE_0___default.a.config();\n\n  if (!req.body.from || !req.body.subject || !req.body.message) {\n    response.message = \"Missing fields\";\n    res.json(response);\n    return;\n  }\n\n  let from = req.body.from;\n  let subject = req.body.subject;\n  let message = req.body.message;\n  let transporter = nodemailer__WEBPACK_IMPORTED_MODULE_1__[\"createTransport\"]({\n    pool: true,\n    host: \"email-smtp.us-east-1.amazonaws.com\",\n    port: 587,\n    secure: false,\n    // use TLS,\n    auth: {\n      user: process.env.SMTP_USERNAME,\n      pass: process.env.SMTP_PASSWORD\n    },\n    tls: {\n      secureProtocol: \"TLSv1_method\",\n      rejectUnauthorized: false\n    }\n  });\n  transporter.sendMail({\n    from: \"webform@allanpichardo.com\",\n    // sender address\n    to: \"webform@allanpichardo.com\",\n    // list of receivers\n    subject: \"\".concat(from, \": \").concat(subject),\n    // Subject line\n    text: message\n  }).then(info => {\n    response.success = true;\n    response.message = \"Sent!\";\n    response.info = info;\n    res.json(response);\n  }).catch(e => {\n    response.message = e.message;\n    res.json(response);\n  });\n});\napp.listen(PORT, () => {\n  console.log(\"CRA Server listening on port \".concat(PORT, \"!\"));\n  emailApp.listen(EMAIL_PORT, () => {\n    console.log(\"EMAIL Server listening on port \".concat(EMAIL_PORT, \"!\"));\n  });\n});\n\n//# sourceURL=webpack:///./server/index.js?");

/***/ }),

/***/ "./src/App.css":
/*!*********************!*\
  !*** ./src/App.css ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("\n    var refs = 0;\n    var css = __webpack_require__(/*! !../node_modules/css-loader/dist/cjs.js!./App.css */ \"./node_modules/css-loader/dist/cjs.js!./src/App.css\");\n    var insertCss = __webpack_require__(/*! ../node_modules/isomorphic-style-loader/insertCss.js */ \"./node_modules/isomorphic-style-loader/insertCss.js\");\n    var content = typeof css === 'string' ? [[module.i, css, '']] : css;\n\n    exports = module.exports = css.locals || {};\n    exports._getContent = function() { return content; };\n    exports._getCss = function() { return '' + css; };\n    exports._insertCss = function(options) { return insertCss(content, options) };\n\n    // Hot Module Replacement\n    // https://webpack.github.io/docs/hot-module-replacement\n    // Only activated in browser context\n    if ( true && typeof window !== 'undefined' && window.document) {\n      var removeCss = function() {};\n      module.hot.accept(/*! !../node_modules/css-loader/dist/cjs.js!./App.css */ \"./node_modules/css-loader/dist/cjs.js!./src/App.css\", function() {\n        css = __webpack_require__(/*! !../node_modules/css-loader/dist/cjs.js!./App.css */ \"./node_modules/css-loader/dist/cjs.js!./src/App.css\");\n        content = typeof css === 'string' ? [[module.i, css, '']] : css;\n        removeCss = insertCss(content, { replace: true });\n      });\n      module.hot.dispose(function() { removeCss(); });\n    }\n  \n\n//# sourceURL=webpack:///./src/App.css?");

/***/ }),

/***/ "./src/App.js":
/*!********************!*\
  !*** ./src/App.js ***!
  \********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return App; });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _App_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./App.css */ \"./src/App.css\");\n/* harmony import */ var _App_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_App_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-router-dom */ \"react-router-dom\");\n/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_router_dom__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _components_NavBar__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/NavBar */ \"./src/components/NavBar.jsx\");\n/* harmony import */ var _components_WorksOverview__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/WorksOverview */ \"./src/components/WorksOverview.jsx\");\n/* harmony import */ var _components_ProjectDetails__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/ProjectDetails */ \"./src/components/ProjectDetails.jsx\");\n/* harmony import */ var _components_About__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/About */ \"./src/components/About.jsx\");\n/* harmony import */ var _components_Contact__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/Contact */ \"./src/components/Contact.jsx\");\nvar _jsxFileName = \"/Users/allanpichardo/Documents/Dev/allanpichardo2020/src/App.js\";\n\nfunction _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }\n\n\n\n\n\n\n\n\n\nclass App extends react__WEBPACK_IMPORTED_MODULE_0___default.a.Component {\n  constructor(props) {\n    super(props);\n    this.backgroundVideo = react__WEBPACK_IMPORTED_MODULE_0___default.a.createRef();\n    this.handlePanelInView = this.handlePanelInView.bind(this);\n    this.handleProjectSelected = this.handleProjectSelected.bind(this);\n  }\n\n  handlePanelInView(video) {\n    console.log(video);\n    let player = this.backgroundVideo.current;\n\n    if (video) {\n      if (player.style.opacity > 0.0) {\n        player.style.opacity = 0.0;\n\n        player.ontransitionend = () => {\n          player.style.opacity = 1.0;\n          player.src = video;\n          player.type = \"video/mp4\";\n\n          player.ontransitionend = () => {};\n        };\n      } else {\n        player.src = video;\n        player.type = \"video/mp4\";\n        player.style.opacity = 1.0;\n      }\n    } else {\n      player.style.opacity = 0.0;\n      player.src = '';\n    }\n  }\n\n  handleProjectSelected() {}\n\n  render() {\n    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n      className: \"App\",\n      id: \"mainView\",\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 52\n      }\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"video\", {\n      className: \"App-video\",\n      muted: true,\n      loop: true,\n      autoPlay: true,\n      ref: this.backgroundVideo,\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 53\n      }\n    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n      className: \"App-header\",\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 54\n      }\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_NavBar__WEBPACK_IMPORTED_MODULE_3__[\"default\"], {\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 55\n      }\n    })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n      className: \"App-body\",\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 57\n      }\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__[\"Switch\"], {\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 58\n      }\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__[\"Route\"], {\n      exact: true,\n      path: \"/\",\n      render: props => {\n        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_WorksOverview__WEBPACK_IMPORTED_MODULE_4__[\"default\"], _extends({\n          onPanelInView: this.handlePanelInView\n        }, props, {\n          __source: {\n            fileName: _jsxFileName,\n            lineNumber: 60\n          }\n        }));\n      },\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 59\n      }\n    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__[\"Route\"], {\n      exact: true,\n      path: \"/about\",\n      render: props => {\n        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_About__WEBPACK_IMPORTED_MODULE_6__[\"default\"], _extends({\n          onBackgroundLoaded: this.handlePanelInView\n        }, props, {\n          __source: {\n            fileName: _jsxFileName,\n            lineNumber: 63\n          }\n        }));\n      },\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 62\n      }\n    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__[\"Route\"], {\n      exact: true,\n      path: \"/contact\",\n      render: props => {\n        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_Contact__WEBPACK_IMPORTED_MODULE_7__[\"default\"], _extends({}, props, {\n          __source: {\n            fileName: _jsxFileName,\n            lineNumber: 66\n          }\n        }));\n      },\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 65\n      }\n    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__[\"Route\"], {\n      exact: true,\n      path: \"/projects/:name\",\n      render: props => {\n        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_ProjectDetails__WEBPACK_IMPORTED_MODULE_5__[\"default\"], _extends({}, props, {\n          __source: {\n            fileName: _jsxFileName,\n            lineNumber: 69\n          }\n        }));\n      },\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 68\n      }\n    }))));\n  }\n\n}\n\n//# sourceURL=webpack:///./src/App.js?");

/***/ }),

/***/ "./src/components/About.css":
/*!**********************************!*\
  !*** ./src/components/About.css ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("\n    var refs = 0;\n    var css = __webpack_require__(/*! !../../node_modules/css-loader/dist/cjs.js!./About.css */ \"./node_modules/css-loader/dist/cjs.js!./src/components/About.css\");\n    var insertCss = __webpack_require__(/*! ../../node_modules/isomorphic-style-loader/insertCss.js */ \"./node_modules/isomorphic-style-loader/insertCss.js\");\n    var content = typeof css === 'string' ? [[module.i, css, '']] : css;\n\n    exports = module.exports = css.locals || {};\n    exports._getContent = function() { return content; };\n    exports._getCss = function() { return '' + css; };\n    exports._insertCss = function(options) { return insertCss(content, options) };\n\n    // Hot Module Replacement\n    // https://webpack.github.io/docs/hot-module-replacement\n    // Only activated in browser context\n    if ( true && typeof window !== 'undefined' && window.document) {\n      var removeCss = function() {};\n      module.hot.accept(/*! !../../node_modules/css-loader/dist/cjs.js!./About.css */ \"./node_modules/css-loader/dist/cjs.js!./src/components/About.css\", function() {\n        css = __webpack_require__(/*! !../../node_modules/css-loader/dist/cjs.js!./About.css */ \"./node_modules/css-loader/dist/cjs.js!./src/components/About.css\");\n        content = typeof css === 'string' ? [[module.i, css, '']] : css;\n        removeCss = insertCss(content, { replace: true });\n      });\n      module.hot.dispose(function() { removeCss(); });\n    }\n  \n\n//# sourceURL=webpack:///./src/components/About.css?");

/***/ }),

/***/ "./src/components/About.jsx":
/*!**********************************!*\
  !*** ./src/components/About.jsx ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return About; });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _About_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./About.css */ \"./src/components/About.css\");\n/* harmony import */ var _About_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_About_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/utils */ \"./src/utils/utils.js\");\nvar _jsxFileName = \"/Users/allanpichardo/Documents/Dev/allanpichardo2020/src/components/About.jsx\";\n\n\n\nclass About extends react__WEBPACK_IMPORTED_MODULE_0___default.a.Component {\n  constructor(props) {\n    super(props);\n    this.state = {\n      about: '',\n      video: ''\n    };\n  }\n\n  componentDidMount() {\n    let _this = this;\n\n    _utils_utils__WEBPACK_IMPORTED_MODULE_2__[\"default\"].fetchInfo((err, info) => {\n      if (err) {\n        console.log(err);\n      } else {\n        _this.setState({\n          about: info.about,\n          video: _utils_utils__WEBPACK_IMPORTED_MODULE_2__[\"default\"].getResourcePath(info.about_media_dir, info.about_bg),\n          resume_path: info.resume_path\n        }, () => {\n          if (_this.props.onBackgroundLoaded) {\n            _this.props.onBackgroundLoaded(this.state.video);\n          }\n        });\n      }\n    });\n  }\n\n  render() {\n    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n      className: \"About\",\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 37\n      }\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 38\n      }\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"h1\", {\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 39\n      }\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"mark\", {\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 39\n      }\n    }, \"Allan Pichardo\")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"mark\", {\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 40\n      }\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"a\", {\n      href: this.state.resume_path,\n      target: \"_blank\",\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 40\n      }\n    }, \"\\uD83D\\uDCBE Resume\"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"p\", {\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 42\n      }\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"mark\", {\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 42\n      }\n    }, this.state.about)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"p\", {\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 43\n      }\n    }));\n  }\n\n}\n\n//# sourceURL=webpack:///./src/components/About.jsx?");

/***/ }),

/***/ "./src/components/Contact.css":
/*!************************************!*\
  !*** ./src/components/Contact.css ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("\n    var refs = 0;\n    var css = __webpack_require__(/*! !../../node_modules/css-loader/dist/cjs.js!./Contact.css */ \"./node_modules/css-loader/dist/cjs.js!./src/components/Contact.css\");\n    var insertCss = __webpack_require__(/*! ../../node_modules/isomorphic-style-loader/insertCss.js */ \"./node_modules/isomorphic-style-loader/insertCss.js\");\n    var content = typeof css === 'string' ? [[module.i, css, '']] : css;\n\n    exports = module.exports = css.locals || {};\n    exports._getContent = function() { return content; };\n    exports._getCss = function() { return '' + css; };\n    exports._insertCss = function(options) { return insertCss(content, options) };\n\n    // Hot Module Replacement\n    // https://webpack.github.io/docs/hot-module-replacement\n    // Only activated in browser context\n    if ( true && typeof window !== 'undefined' && window.document) {\n      var removeCss = function() {};\n      module.hot.accept(/*! !../../node_modules/css-loader/dist/cjs.js!./Contact.css */ \"./node_modules/css-loader/dist/cjs.js!./src/components/Contact.css\", function() {\n        css = __webpack_require__(/*! !../../node_modules/css-loader/dist/cjs.js!./Contact.css */ \"./node_modules/css-loader/dist/cjs.js!./src/components/Contact.css\");\n        content = typeof css === 'string' ? [[module.i, css, '']] : css;\n        removeCss = insertCss(content, { replace: true });\n      });\n      module.hot.dispose(function() { removeCss(); });\n    }\n  \n\n//# sourceURL=webpack:///./src/components/Contact.css?");

/***/ }),

/***/ "./src/components/Contact.jsx":
/*!************************************!*\
  !*** ./src/components/Contact.jsx ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Contact; });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _Contact_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Contact.css */ \"./src/components/Contact.css\");\n/* harmony import */ var _Contact_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_Contact_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/utils */ \"./src/utils/utils.js\");\nvar _jsxFileName = \"/Users/allanpichardo/Documents/Dev/allanpichardo2020/src/components/Contact.jsx\";\n\n\n\nclass Contact extends react__WEBPACK_IMPORTED_MODULE_0___default.a.Component {\n  constructor(props) {\n    super(props);\n    this.state = {\n      email: '',\n      subject: '',\n      body: '',\n      isSent: false,\n      error: ''\n    };\n    this.contactError = react__WEBPACK_IMPORTED_MODULE_0___default.a.createRef();\n    this.handleEmailChange = this.handleEmailChange.bind(this);\n    this.handleSubjectChange = this.handleSubjectChange.bind(this);\n    this.handleBodyChange = this.handleBodyChange.bind(this);\n    this.handleSendClicked = this.handleSendClicked.bind(this);\n  }\n\n  handleEmailChange(e) {\n    this.setState({\n      email: e.target.value\n    });\n  }\n\n  handleSubjectChange(e) {\n    this.setState({\n      subject: e.target.value\n    });\n  }\n\n  handleBodyChange(e) {\n    this.setState({\n      body: e.target.value\n    });\n  }\n\n  handleSendClicked(e) {\n    e.preventDefault();\n    this.contactError.current.style.display = 'none';\n\n    let _this = this;\n\n    _utils_utils__WEBPACK_IMPORTED_MODULE_2__[\"default\"].sendEmail(this.state.email, this.state.subject, this.state.body, (err, info) => {\n      if (err) {\n        _this.setState({\n          isSent: false,\n          error: err.message\n        }, () => {\n          _this.contactError.current.style.display = 'block';\n          _this.contactError.current.style.visibility = 'visible';\n        });\n      } else {\n        _this.setState({\n          isSent: info.success,\n          error: info.message\n        }, () => {\n          if (!info.success) {\n            _this.contactError.current.style.display = 'block';\n            _this.contactError.current.style.visibility = 'visible';\n          }\n        });\n      }\n    });\n  }\n\n  isValid() {}\n\n  render() {\n    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n      className: \"Contact\",\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 83\n      }\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n      className: \"Contact-message\",\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 84\n      }\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"h1\", {\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 85\n      }\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"mark\", {\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 85\n      }\n    }, \"Let's get in touch\"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n      className: \"Contact-form\",\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 87\n      }\n    }, !this.state.isSent ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"form\", {\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 88\n      }\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"label\", {\n      htmlFor: \"sender\",\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 89\n      }\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"mark\", {\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 89\n      }\n    }, \"From\")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"br\", {\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 90\n      }\n    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"input\", {\n      type: \"email\",\n      onChange: this.handleEmailChange,\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 91\n      }\n    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"br\", {\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 92\n      }\n    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"br\", {\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 92\n      }\n    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"label\", {\n      htmlFor: \"sender\",\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 93\n      }\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"mark\", {\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 93\n      }\n    }, \"Subject\")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"br\", {\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 94\n      }\n    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"input\", {\n      type: \"text\",\n      onChange: this.handleSubjectChange,\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 95\n      }\n    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"br\", {\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 96\n      }\n    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"br\", {\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 96\n      }\n    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"label\", {\n      htmlFor: \"subject\",\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 97\n      }\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"mark\", {\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 97\n      }\n    }, \"Message\")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"br\", {\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 98\n      }\n    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"textarea\", {\n      onChange: this.handleBodyChange,\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 99\n      }\n    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"br\", {\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 100\n      }\n    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n      className: \"Contact-error\",\n      ref: this.contactError,\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 101\n      }\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"p\", {\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 102\n      }\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"mark\", {\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 102\n      }\n    }, \"\\xA0\", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"span\", {\n      className: \"material-icons\",\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 102\n      }\n    }, \"error_outline\"), \"\\xA0Something went wrong:\\xA0\", this.state.error))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"br\", {\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 104\n      }\n    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"button\", {\n      onClick: this.handleSendClicked,\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 105\n      }\n    }, \"\\xA0Send!\\xA0\")) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n      className: \"Contact-success\",\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 107\n      }\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"h3\", {\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 108\n      }\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"mark\", {\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 109\n      }\n    }, \"Message Sent!\")))));\n  }\n\n}\n\n//# sourceURL=webpack:///./src/components/Contact.jsx?");

/***/ }),

/***/ "./src/components/IntroPanel.css":
/*!***************************************!*\
  !*** ./src/components/IntroPanel.css ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("\n    var refs = 0;\n    var css = __webpack_require__(/*! !../../node_modules/css-loader/dist/cjs.js!./IntroPanel.css */ \"./node_modules/css-loader/dist/cjs.js!./src/components/IntroPanel.css\");\n    var insertCss = __webpack_require__(/*! ../../node_modules/isomorphic-style-loader/insertCss.js */ \"./node_modules/isomorphic-style-loader/insertCss.js\");\n    var content = typeof css === 'string' ? [[module.i, css, '']] : css;\n\n    exports = module.exports = css.locals || {};\n    exports._getContent = function() { return content; };\n    exports._getCss = function() { return '' + css; };\n    exports._insertCss = function(options) { return insertCss(content, options) };\n\n    // Hot Module Replacement\n    // https://webpack.github.io/docs/hot-module-replacement\n    // Only activated in browser context\n    if ( true && typeof window !== 'undefined' && window.document) {\n      var removeCss = function() {};\n      module.hot.accept(/*! !../../node_modules/css-loader/dist/cjs.js!./IntroPanel.css */ \"./node_modules/css-loader/dist/cjs.js!./src/components/IntroPanel.css\", function() {\n        css = __webpack_require__(/*! !../../node_modules/css-loader/dist/cjs.js!./IntroPanel.css */ \"./node_modules/css-loader/dist/cjs.js!./src/components/IntroPanel.css\");\n        content = typeof css === 'string' ? [[module.i, css, '']] : css;\n        removeCss = insertCss(content, { replace: true });\n      });\n      module.hot.dispose(function() { removeCss(); });\n    }\n  \n\n//# sourceURL=webpack:///./src/components/IntroPanel.css?");

/***/ }),

/***/ "./src/components/IntroPanel.jsx":
/*!***************************************!*\
  !*** ./src/components/IntroPanel.jsx ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return IntroPanel; });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _IntroPanel_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./IntroPanel.css */ \"./src/components/IntroPanel.css\");\n/* harmony import */ var _IntroPanel_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_IntroPanel_css__WEBPACK_IMPORTED_MODULE_1__);\nvar _jsxFileName = \"/Users/allanpichardo/Documents/Dev/allanpichardo2020/src/components/IntroPanel.jsx\";\n\n\nclass IntroPanel extends react__WEBPACK_IMPORTED_MODULE_0___default.a.Component {\n  constructor(props) {\n    super(props);\n    this.state = {\n      shouldUpdateBackground: true\n    };\n    this.isActiveInView = this.isActiveInView.bind(this);\n  }\n\n  isActiveInView() {\n    return Math.floor(this.props.scrollPosition) === 0;\n  }\n\n  componentDidUpdate(prevProps, prevState, snapshot) {\n    if (this.isActiveInView() && this.state.shouldUpdateBackground) {\n      let _this = this;\n\n      this.setState({\n        shouldUpdateBackground: false\n      }, () => {\n        if (_this.props.onPanelInView) {\n          _this.props.onPanelInView(null);\n        }\n      });\n    } else if (!this.isActiveInView() && !this.state.shouldUpdateBackground) {\n      this.setState({\n        shouldUpdateBackground: true\n      });\n    }\n  }\n\n  render() {\n    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n      className: \"IntroPanel\",\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 39\n      }\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"h1\", {\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 40\n      }\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"mark\", {\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 40\n      }\n    }, \"Hi, I'm Allan \", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"br\", {\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 40\n      }\n    }), \"and I'm a creative \", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"br\", {\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 40\n      }\n    }), \"technologist.\")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"span\", {\n      className: \"material-icons\",\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 41\n      }\n    }, \"arrow_forward\"));\n  }\n\n}\n\n//# sourceURL=webpack:///./src/components/IntroPanel.jsx?");

/***/ }),

/***/ "./src/components/NavBar.css":
/*!***********************************!*\
  !*** ./src/components/NavBar.css ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("\n    var refs = 0;\n    var css = __webpack_require__(/*! !../../node_modules/css-loader/dist/cjs.js!./NavBar.css */ \"./node_modules/css-loader/dist/cjs.js!./src/components/NavBar.css\");\n    var insertCss = __webpack_require__(/*! ../../node_modules/isomorphic-style-loader/insertCss.js */ \"./node_modules/isomorphic-style-loader/insertCss.js\");\n    var content = typeof css === 'string' ? [[module.i, css, '']] : css;\n\n    exports = module.exports = css.locals || {};\n    exports._getContent = function() { return content; };\n    exports._getCss = function() { return '' + css; };\n    exports._insertCss = function(options) { return insertCss(content, options) };\n\n    // Hot Module Replacement\n    // https://webpack.github.io/docs/hot-module-replacement\n    // Only activated in browser context\n    if ( true && typeof window !== 'undefined' && window.document) {\n      var removeCss = function() {};\n      module.hot.accept(/*! !../../node_modules/css-loader/dist/cjs.js!./NavBar.css */ \"./node_modules/css-loader/dist/cjs.js!./src/components/NavBar.css\", function() {\n        css = __webpack_require__(/*! !../../node_modules/css-loader/dist/cjs.js!./NavBar.css */ \"./node_modules/css-loader/dist/cjs.js!./src/components/NavBar.css\");\n        content = typeof css === 'string' ? [[module.i, css, '']] : css;\n        removeCss = insertCss(content, { replace: true });\n      });\n      module.hot.dispose(function() { removeCss(); });\n    }\n  \n\n//# sourceURL=webpack:///./src/components/NavBar.css?");

/***/ }),

/***/ "./src/components/NavBar.jsx":
/*!***********************************!*\
  !*** ./src/components/NavBar.jsx ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _NavBar_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./NavBar.css */ \"./src/components/NavBar.css\");\n/* harmony import */ var _NavBar_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_NavBar_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-router-dom */ \"react-router-dom\");\n/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_router_dom__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/utils */ \"./src/utils/utils.js\");\n/* harmony import */ var slugify__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! slugify */ \"slugify\");\n/* harmony import */ var slugify__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(slugify__WEBPACK_IMPORTED_MODULE_4__);\nvar _jsxFileName = \"/Users/allanpichardo/Documents/Dev/allanpichardo2020/src/components/NavBar.jsx\";\n\n\n\n\n\n\nclass NavBar extends react__WEBPACK_IMPORTED_MODULE_0___default.a.Component {\n  constructor(props) {\n    super(props);\n    this.state = {\n      isWorkDropdownShowing: false,\n      projects: []\n    };\n    this.workLink = react__WEBPACK_IMPORTED_MODULE_0___default.a.createRef();\n    this.generateWorkDropdown = this.generateWorkDropdown.bind(this);\n    this.getDropdownOptions = this.getDropdownOptions.bind(this);\n    this.calculateDropdownPlacement = this.calculateDropdownPlacement.bind(this);\n  }\n\n  calculateDropdownPlacement() {\n    let div = document.querySelector('.NavBar-dropdown');\n    div.style.left = \"\".concat(this.workLink.current.offsetLeft, \"px\");\n    div.style.top = \"\".concat(this.workLink.current.offsetTop + this.workLink.current.offsetHeight, \"px\");\n  }\n\n  generateWorkDropdown() {\n    this.calculateDropdownPlacement();\n\n    let _this = this;\n\n    _utils_utils__WEBPACK_IMPORTED_MODULE_3__[\"default\"].fetchProjects((err, projects) => {\n      if (err) {\n        console.log(err);\n      } else {\n        _this.setState({\n          projects: projects\n        });\n      }\n    });\n  }\n\n  getDropdownOptions() {\n    return this.state.projects.map(project => {\n      let slug = slugify__WEBPACK_IMPORTED_MODULE_4___default()(project.name);\n      let path = \"/projects/\".concat(slug);\n      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n        key: slug,\n        __source: {\n          fileName: _jsxFileName,\n          lineNumber: 50\n        }\n      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__[\"NavLink\"], {\n        exact: true,\n        to: path,\n        activeClassName: \"NavBar-active\",\n        isActive: (match, location) => {\n          return location.pathname.includes(slug);\n        },\n        __source: {\n          fileName: _jsxFileName,\n          lineNumber: 51\n        }\n      }, project.name), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"br\", {\n        __source: {\n          fileName: _jsxFileName,\n          lineNumber: 56\n        }\n      }));\n    });\n  }\n\n  componentDidMount() {\n    this.generateWorkDropdown();\n    window.onresize = this.calculateDropdownPlacement;\n  }\n\n  render() {\n    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n      className: \"NavBar\",\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 69\n      }\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 70\n      }\n    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 71\n      }\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__[\"NavLink\"], {\n      ref: this.workLink,\n      exact: true,\n      to: \"/\",\n      activeClassName: \"NavBar-active\",\n      isActive: (match, location) => {\n        return location.pathname === '/' || location.pathname.includes('projects');\n      },\n      onMouseEnter: () => {\n        if (!this.state.isWorkDropdownShowing) {\n          this.setState({\n            isWorkDropdownShowing: true\n          }, () => {\n            let div = document.querySelector('.NavBar-dropdown');\n            div.style.visibility = 'visible';\n          });\n        }\n      },\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 72\n      }\n    }, \"\\xA0Work\\xA0\"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__[\"NavLink\"], {\n      exact: true,\n      to: \"/about\",\n      activeClassName: \"NavBar-active\",\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 84\n      }\n    }, \"\\xA0About\\xA0\"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__[\"NavLink\"], {\n      exact: true,\n      to: \"/contact\",\n      activeClassName: \"NavBar-active\",\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 85\n      }\n    }, \"\\xA0Contact\\xA0\")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n      ref: this.dropdown,\n      className: \"NavBar-dropdown\",\n      onPointerLeave: e => {\n        let div = document.querySelector('.NavBar-dropdown');\n\n        if (this.state.isWorkDropdownShowing && e.target === div) {\n          this.setState({\n            isWorkDropdownShowing: false\n          }, () => {\n            div.style.visibility = 'hidden';\n          });\n        }\n      },\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 87\n      }\n    }, this.getDropdownOptions()));\n  }\n\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Object(react_router_dom__WEBPACK_IMPORTED_MODULE_2__[\"withRouter\"])(NavBar));\n\n//# sourceURL=webpack:///./src/components/NavBar.jsx?");

/***/ }),

/***/ "./src/components/ProjectDetails.css":
/*!*******************************************!*\
  !*** ./src/components/ProjectDetails.css ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("\n    var refs = 0;\n    var css = __webpack_require__(/*! !../../node_modules/css-loader/dist/cjs.js!./ProjectDetails.css */ \"./node_modules/css-loader/dist/cjs.js!./src/components/ProjectDetails.css\");\n    var insertCss = __webpack_require__(/*! ../../node_modules/isomorphic-style-loader/insertCss.js */ \"./node_modules/isomorphic-style-loader/insertCss.js\");\n    var content = typeof css === 'string' ? [[module.i, css, '']] : css;\n\n    exports = module.exports = css.locals || {};\n    exports._getContent = function() { return content; };\n    exports._getCss = function() { return '' + css; };\n    exports._insertCss = function(options) { return insertCss(content, options) };\n\n    // Hot Module Replacement\n    // https://webpack.github.io/docs/hot-module-replacement\n    // Only activated in browser context\n    if ( true && typeof window !== 'undefined' && window.document) {\n      var removeCss = function() {};\n      module.hot.accept(/*! !../../node_modules/css-loader/dist/cjs.js!./ProjectDetails.css */ \"./node_modules/css-loader/dist/cjs.js!./src/components/ProjectDetails.css\", function() {\n        css = __webpack_require__(/*! !../../node_modules/css-loader/dist/cjs.js!./ProjectDetails.css */ \"./node_modules/css-loader/dist/cjs.js!./src/components/ProjectDetails.css\");\n        content = typeof css === 'string' ? [[module.i, css, '']] : css;\n        removeCss = insertCss(content, { replace: true });\n      });\n      module.hot.dispose(function() { removeCss(); });\n    }\n  \n\n//# sourceURL=webpack:///./src/components/ProjectDetails.css?");

/***/ }),

/***/ "./src/components/ProjectDetails.jsx":
/*!*******************************************!*\
  !*** ./src/components/ProjectDetails.jsx ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return ProjectDetails; });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _ProjectDetails_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ProjectDetails.css */ \"./src/components/ProjectDetails.css\");\n/* harmony import */ var _ProjectDetails_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_ProjectDetails_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var slugify__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! slugify */ \"slugify\");\n/* harmony import */ var slugify__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(slugify__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/utils */ \"./src/utils/utils.js\");\n/* harmony import */ var react_helmet__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-helmet */ \"react-helmet\");\n/* harmony import */ var react_helmet__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_helmet__WEBPACK_IMPORTED_MODULE_4__);\nvar _jsxFileName = \"/Users/allanpichardo/Documents/Dev/allanpichardo2020/src/components/ProjectDetails.jsx\";\n\n\n\n\n\nclass ProjectDetails extends react__WEBPACK_IMPORTED_MODULE_0___default.a.Component {\n  constructor(props) {\n    super(props);\n    this.state = {\n      projects: null\n    };\n  }\n\n  componentDidMount() {\n    let slug = slugify__WEBPACK_IMPORTED_MODULE_2___default()(this.props.match.params.name);\n    _utils_utils__WEBPACK_IMPORTED_MODULE_3__[\"default\"].fetchProjectBySlug(slug, (err, project) => {\n      if (err) {\n        console.log(err);\n      } else {\n        this.setState({\n          project: project,\n          slug: slug\n        });\n      }\n    });\n  }\n\n  render() {\n    if (this.state.project) {\n      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n        className: \"ProjectDetails\",\n        __source: {\n          fileName: _jsxFileName,\n          lineNumber: 35\n        }\n      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_helmet__WEBPACK_IMPORTED_MODULE_4__[\"Helmet\"], {\n        __source: {\n          fileName: _jsxFileName,\n          lineNumber: 36\n        }\n      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"title\", {\n        __source: {\n          fileName: _jsxFileName,\n          lineNumber: 37\n        }\n      }, \"\".concat(this.state.project.name, \" - Allan Pichardo\")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"meta\", {\n        name: \"twitter:card\",\n        content: \"summary\",\n        __source: {\n          fileName: _jsxFileName,\n          lineNumber: 38\n        }\n      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"meta\", {\n        name: \"twitter:site\",\n        content: \"@allanpichardo\",\n        __source: {\n          fileName: _jsxFileName,\n          lineNumber: 39\n        }\n      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"meta\", {\n        name: \"twitter:creator\",\n        content: \"@allanpichardo\",\n        __source: {\n          fileName: _jsxFileName,\n          lineNumber: 40\n        }\n      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"meta\", {\n        property: \"og:title\",\n        content: \"\".concat(this.state.project.name),\n        __source: {\n          fileName: _jsxFileName,\n          lineNumber: 41\n        }\n      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"meta\", {\n        property: \"og:type\",\n        content: \"article\",\n        __source: {\n          fileName: _jsxFileName,\n          lineNumber: 42\n        }\n      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"meta\", {\n        property: \"og:url\",\n        content: \"https://www.allanpichardo.com/projects/\".concat(this.state.slug),\n        __source: {\n          fileName: _jsxFileName,\n          lineNumber: 43\n        }\n      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"meta\", {\n        property: \"og:description\",\n        content: this.state.project.notes,\n        __source: {\n          fileName: _jsxFileName,\n          lineNumber: 44\n        }\n      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"meta\", {\n        property: \"og:image\",\n        content: \"https://www.allanpichardo.com\".concat(this.state.project.cover_image),\n        __source: {\n          fileName: _jsxFileName,\n          lineNumber: 45\n        }\n      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n        className: \"ProjectDetails-section\",\n        __source: {\n          fileName: _jsxFileName,\n          lineNumber: 47\n        }\n      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n        className: \"ProjectDetails-title\",\n        __source: {\n          fileName: _jsxFileName,\n          lineNumber: 48\n        }\n      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"h1\", {\n        __source: {\n          fileName: _jsxFileName,\n          lineNumber: 49\n        }\n      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"mark\", {\n        __source: {\n          fileName: _jsxFileName,\n          lineNumber: 49\n        }\n      }, this.state.project.name))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n        className: \"projectDetails-subtitle\",\n        __source: {\n          fileName: _jsxFileName,\n          lineNumber: 51\n        }\n      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"h2\", {\n        __source: {\n          fileName: _jsxFileName,\n          lineNumber: 52\n        }\n      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"mark\", {\n        __source: {\n          fileName: _jsxFileName,\n          lineNumber: 52\n        }\n      }, this.state.project.subtitle)), this.state.project.link ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"h2\", {\n        __source: {\n          fileName: _jsxFileName,\n          lineNumber: 55\n        }\n      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"mark\", {\n        __source: {\n          fileName: _jsxFileName,\n          lineNumber: 55\n        }\n      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"a\", {\n        rel: \"noopener noreferrer\",\n        target: \"_blank\",\n        href: this.state.project.link,\n        __source: {\n          fileName: _jsxFileName,\n          lineNumber: 55\n        }\n      }, this.state.project.link))) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"span\", {\n        __source: {\n          fileName: _jsxFileName,\n          lineNumber: 56\n        }\n      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n        className: \"ProjectDetails-background1\",\n        __source: {\n          fileName: _jsxFileName,\n          lineNumber: 59\n        }\n      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n        className: \"ProjectDetails-video1\",\n        __source: {\n          fileName: _jsxFileName,\n          lineNumber: 60\n        }\n      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n        className: \"ProjectDetails-aspect-ratio\",\n        __source: {\n          fileName: _jsxFileName,\n          lineNumber: 61\n        }\n      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"iframe\", {\n        src: \"https://www.youtube.com/embed/\".concat(this.state.project.youtube_video_id),\n        frameBorder: \"0\",\n        allow: \"accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture\",\n        allowFullScreen: true,\n        __source: {\n          fileName: _jsxFileName,\n          lineNumber: 62\n        }\n      }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n        className: \"ProjectDetails-description1\",\n        __source: {\n          fileName: _jsxFileName,\n          lineNumber: 69\n        }\n      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"p\", {\n        __source: {\n          fileName: _jsxFileName,\n          lineNumber: 70\n        }\n      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"mark\", {\n        __source: {\n          fileName: _jsxFileName,\n          lineNumber: 70\n        }\n      }, this.state.project.description_1))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n        className: \"ProjectDetails-background2\",\n        __source: {\n          fileName: _jsxFileName,\n          lineNumber: 72\n        }\n      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n        className: \"ProjectDetails-video2\",\n        __source: {\n          fileName: _jsxFileName,\n          lineNumber: 73\n        }\n      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"video\", {\n        muted: true,\n        autoPlay: true,\n        loop: true,\n        src: _utils_utils__WEBPACK_IMPORTED_MODULE_3__[\"default\"].getResourcePath(this.state.project.media_dir, this.state.project.video2),\n        __source: {\n          fileName: _jsxFileName,\n          lineNumber: 74\n        }\n      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n        className: \"ProjectDetails-description2\",\n        __source: {\n          fileName: _jsxFileName,\n          lineNumber: 76\n        }\n      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"p\", {\n        __source: {\n          fileName: _jsxFileName,\n          lineNumber: 77\n        }\n      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"mark\", {\n        __source: {\n          fileName: _jsxFileName,\n          lineNumber: 77\n        }\n      }, this.state.project.description_2)))));\n    } else {\n      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n        __source: {\n          fileName: _jsxFileName,\n          lineNumber: 83\n        }\n      });\n    }\n  }\n\n}\n\n//# sourceURL=webpack:///./src/components/ProjectDetails.jsx?");

/***/ }),

/***/ "./src/components/ProjectPanel.css":
/*!*****************************************!*\
  !*** ./src/components/ProjectPanel.css ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("\n    var refs = 0;\n    var css = __webpack_require__(/*! !../../node_modules/css-loader/dist/cjs.js!./ProjectPanel.css */ \"./node_modules/css-loader/dist/cjs.js!./src/components/ProjectPanel.css\");\n    var insertCss = __webpack_require__(/*! ../../node_modules/isomorphic-style-loader/insertCss.js */ \"./node_modules/isomorphic-style-loader/insertCss.js\");\n    var content = typeof css === 'string' ? [[module.i, css, '']] : css;\n\n    exports = module.exports = css.locals || {};\n    exports._getContent = function() { return content; };\n    exports._getCss = function() { return '' + css; };\n    exports._insertCss = function(options) { return insertCss(content, options) };\n\n    // Hot Module Replacement\n    // https://webpack.github.io/docs/hot-module-replacement\n    // Only activated in browser context\n    if ( true && typeof window !== 'undefined' && window.document) {\n      var removeCss = function() {};\n      module.hot.accept(/*! !../../node_modules/css-loader/dist/cjs.js!./ProjectPanel.css */ \"./node_modules/css-loader/dist/cjs.js!./src/components/ProjectPanel.css\", function() {\n        css = __webpack_require__(/*! !../../node_modules/css-loader/dist/cjs.js!./ProjectPanel.css */ \"./node_modules/css-loader/dist/cjs.js!./src/components/ProjectPanel.css\");\n        content = typeof css === 'string' ? [[module.i, css, '']] : css;\n        removeCss = insertCss(content, { replace: true });\n      });\n      module.hot.dispose(function() { removeCss(); });\n    }\n  \n\n//# sourceURL=webpack:///./src/components/ProjectPanel.css?");

/***/ }),

/***/ "./src/components/ProjectPanel.jsx":
/*!*****************************************!*\
  !*** ./src/components/ProjectPanel.jsx ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return ProjectPanel; });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _ProjectPanel_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ProjectPanel.css */ \"./src/components/ProjectPanel.css\");\n/* harmony import */ var _ProjectPanel_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_ProjectPanel_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-router-dom */ \"react-router-dom\");\n/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_router_dom__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var slugify__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! slugify */ \"slugify\");\n/* harmony import */ var slugify__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(slugify__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/utils */ \"./src/utils/utils.js\");\nvar _jsxFileName = \"/Users/allanpichardo/Documents/Dev/allanpichardo2020/src/components/ProjectPanel.jsx\";\n\n\n\n\n\nclass ProjectPanel extends react__WEBPACK_IMPORTED_MODULE_0___default.a.Component {\n  constructor(props) {\n    super(props);\n    this.state = {\n      shouldUpdateBackground: true\n    };\n    this.isActiveInView = this.isActiveInView.bind(this);\n    this.renderLink = this.renderLink.bind(this);\n  }\n\n  isActiveInView() {\n    return Math.floor(this.props.scrollPosition / this.props.index) === 1;\n  }\n\n  componentDidUpdate(prevProps, prevState, snapshot) {\n    if (this.isActiveInView() && this.state.shouldUpdateBackground) {\n      let _this = this;\n\n      this.setState({\n        shouldUpdateBackground: false\n      }, () => {\n        if (_this.props.onPanelInView) {\n          _this.props.onPanelInView(_utils_utils__WEBPACK_IMPORTED_MODULE_4__[\"default\"].getResourcePath(_this.props.project.media_dir, _this.props.project.cover_video));\n        }\n      });\n    } else if (!this.isActiveInView() && !this.state.shouldUpdateBackground) {\n      this.setState({\n        shouldUpdateBackground: true\n      });\n    }\n  }\n\n  renderLink() {\n    let slug = slugify__WEBPACK_IMPORTED_MODULE_3___default()(this.props.project.name);\n    return this.isActiveInView() ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__[\"Link\"], {\n      to: \"/projects/\".concat(slug),\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 44\n      }\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"h1\", {\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 44\n      }\n    }, this.props.project.name)) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"span\", {\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 45\n      }\n    });\n  }\n\n  render() {\n    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n      className: \"ProjectPanel\",\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 50\n      }\n    }, this.renderLink());\n  }\n\n}\n\n//# sourceURL=webpack:///./src/components/ProjectPanel.jsx?");

/***/ }),

/***/ "./src/components/WorksOverview.css":
/*!******************************************!*\
  !*** ./src/components/WorksOverview.css ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("\n    var refs = 0;\n    var css = __webpack_require__(/*! !../../node_modules/css-loader/dist/cjs.js!./WorksOverview.css */ \"./node_modules/css-loader/dist/cjs.js!./src/components/WorksOverview.css\");\n    var insertCss = __webpack_require__(/*! ../../node_modules/isomorphic-style-loader/insertCss.js */ \"./node_modules/isomorphic-style-loader/insertCss.js\");\n    var content = typeof css === 'string' ? [[module.i, css, '']] : css;\n\n    exports = module.exports = css.locals || {};\n    exports._getContent = function() { return content; };\n    exports._getCss = function() { return '' + css; };\n    exports._insertCss = function(options) { return insertCss(content, options) };\n\n    // Hot Module Replacement\n    // https://webpack.github.io/docs/hot-module-replacement\n    // Only activated in browser context\n    if ( true && typeof window !== 'undefined' && window.document) {\n      var removeCss = function() {};\n      module.hot.accept(/*! !../../node_modules/css-loader/dist/cjs.js!./WorksOverview.css */ \"./node_modules/css-loader/dist/cjs.js!./src/components/WorksOverview.css\", function() {\n        css = __webpack_require__(/*! !../../node_modules/css-loader/dist/cjs.js!./WorksOverview.css */ \"./node_modules/css-loader/dist/cjs.js!./src/components/WorksOverview.css\");\n        content = typeof css === 'string' ? [[module.i, css, '']] : css;\n        removeCss = insertCss(content, { replace: true });\n      });\n      module.hot.dispose(function() { removeCss(); });\n    }\n  \n\n//# sourceURL=webpack:///./src/components/WorksOverview.css?");

/***/ }),

/***/ "./src/components/WorksOverview.jsx":
/*!******************************************!*\
  !*** ./src/components/WorksOverview.jsx ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return WorksOverview; });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _WorksOverview_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./WorksOverview.css */ \"./src/components/WorksOverview.css\");\n/* harmony import */ var _WorksOverview_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_WorksOverview_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _IntroPanel__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./IntroPanel */ \"./src/components/IntroPanel.jsx\");\n/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/utils */ \"./src/utils/utils.js\");\n/* harmony import */ var _ProjectPanel__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ProjectPanel */ \"./src/components/ProjectPanel.jsx\");\nvar _jsxFileName = \"/Users/allanpichardo/Documents/Dev/allanpichardo2020/src/components/WorksOverview.jsx\";\n\n\n\n\n\nclass WorksOverview extends react__WEBPACK_IMPORTED_MODULE_0___default.a.Component {\n  constructor(props) {\n    super(props);\n    this.state = {\n      projects: null,\n      scrollPosition: 0\n    };\n    this.mainDiv = react__WEBPACK_IMPORTED_MODULE_0___default.a.createRef();\n    this.getPanelStyles = this.getPanelStyles.bind(this);\n    this.renderProjects = this.renderProjects.bind(this);\n    this.handleScroll = this.handleScroll.bind(this);\n    this.handleWheel = this.handleWheel.bind(this);\n    this.handlePanelInView = this.handlePanelInView.bind(this);\n  }\n\n  handlePanelInView(coverImage) {\n    if (this.props.onPanelInView) {\n      this.props.onPanelInView(coverImage);\n    }\n  }\n\n  getScreenWidth() {\n    return window.innerWidth;\n  }\n\n  getNumberPanels() {\n    return this.state.projects ? this.state.projects.length : 1;\n  }\n\n  handleScroll(e) {\n    let scrollX = e.target.scrollLeft + 40;\n    this.setState({\n      scrollPosition: scrollX / this.getScreenWidth()\n    });\n  }\n\n  handleWheel(event) {\n    this.mainDiv.current.scrollBy(event.deltaY, 0);\n  }\n\n  componentDidMount() {\n    _utils_utils__WEBPACK_IMPORTED_MODULE_3__[\"default\"].fetchProjects((err, projects) => {\n      if (err) {\n        console.log(err);\n      } else {\n        this.setState({\n          projects: projects\n        });\n      }\n    });\n  }\n\n  getPanelStyles() {\n    let columns = '100vw';\n\n    if (this.state.projects) {\n      this.state.projects.forEach(project => {\n        columns = \"\".concat(columns, \" 100vw\");\n      });\n    }\n\n    columns = \"\".concat(columns, \" 37.5vw\");\n    return {\n      gridTemplateColumns: columns\n    };\n  }\n\n  renderProjects() {\n    let projects = this.state.projects ? this.state.projects : [];\n    return projects.map((project, key) => {\n      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n        className: \"WorksOverview-panel\",\n        key: key,\n        __source: {\n          fileName: _jsxFileName,\n          lineNumber: 83\n        }\n      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_ProjectPanel__WEBPACK_IMPORTED_MODULE_4__[\"default\"], {\n        onPanelInView: this.handlePanelInView,\n        scrollPosition: this.state.scrollPosition,\n        index: key + 1,\n        project: project,\n        __source: {\n          fileName: _jsxFileName,\n          lineNumber: 84\n        }\n      }));\n    });\n  }\n\n  render() {\n    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n      ref: this.mainDiv,\n      onWheel: this.handleWheel,\n      onScroll: this.handleScroll,\n      className: \"WorksOverview\",\n      style: this.getPanelStyles(),\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 92\n      }\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_IntroPanel__WEBPACK_IMPORTED_MODULE_2__[\"default\"], {\n      onPanelInView: this.handlePanelInView,\n      scrollPosition: this.state.scrollPosition,\n      index: 0,\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 93\n      }\n    }), this.renderProjects(), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n      __source: {\n        fileName: _jsxFileName,\n        lineNumber: 95\n      }\n    }));\n  }\n\n}\n\n//# sourceURL=webpack:///./src/components/WorksOverview.jsx?");

/***/ }),

/***/ "./src/utils/utils.js":
/*!****************************!*\
  !*** ./src/utils/utils.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Utils; });\n/* harmony import */ var slugify__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! slugify */ \"slugify\");\n/* harmony import */ var slugify__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(slugify__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! path */ \"path\");\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_1__);\n\n\nclass Utils {\n  static sendEmail(from, subject, message, callback) {\n    fetch('http://localhost:3002/email', {\n      method: 'POST',\n      mode: 'cors',\n      headers: {\n        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'\n      },\n      body: new URLSearchParams({\n        'from': from,\n        'subject': subject,\n        'message': message\n      })\n    }).then(r => {\n      return r.json();\n    }).then(r => {\n      callback(null, r);\n    }).catch(e => {\n      callback(e);\n    });\n  }\n\n  static fetchInfo(callback) {\n    fetch('/data/info.json').then(response => {\n      return response.json();\n    }).then(projects => {\n      if (callback) {\n        callback(null, projects);\n      }\n    }).catch(e => {\n      if (callback) {\n        callback(e);\n      }\n    });\n  }\n\n  static fetchProjects(callback) {\n    fetch('/data/projects.json').then(response => {\n      return response.json();\n    }).then(projects => {\n      if (callback) {\n        callback(null, projects);\n      }\n    }).catch(e => {\n      if (callback) {\n        callback(e);\n      }\n    });\n  }\n\n  static fetchProjectBySlug(slug, callback) {\n    this.fetchProjects((err, projects) => {\n      if (err) {\n        if (callback) {\n          callback(err);\n        }\n      } else {\n        let found = null;\n\n        for (let i = 0; i < projects.length; i++) {\n          if (slugify__WEBPACK_IMPORTED_MODULE_0___default()(projects[i].name) === slug) {\n            found = projects[i];\n            break;\n          }\n        }\n\n        if (callback) {\n          callback(null, found);\n        }\n      }\n    });\n  }\n\n  static getResourcePath(mediaDir, file) {\n    let width = window.innerWidth;\n    let def = width <= 960 ? 'lo' : 'hi';\n    let p = path__WEBPACK_IMPORTED_MODULE_1___default.a.join(mediaDir, def, file);\n    return p;\n  }\n\n}\n\n//# sourceURL=webpack:///./src/utils/utils.js?");

/***/ }),

/***/ 0:
/*!********************************************************************************************************************************************************************!*\
  !*** multi ./server/index.js !./node_modules/start-server-webpack-plugin/dist/monitor-loader.js!./node_modules/start-server-webpack-plugin/dist/monitor-loader.js ***!
  \********************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("__webpack_require__(/*! ./server/index.js */\"./server/index.js\");\nmodule.exports = __webpack_require__(/*! !!/Users/allanpichardo/Documents/Dev/allanpichardo2020/node_modules/start-server-webpack-plugin/dist/monitor-loader.js!/Users/allanpichardo/Documents/Dev/allanpichardo2020/node_modules/start-server-webpack-plugin/dist/monitor-loader.js */\"./node_modules/start-server-webpack-plugin/dist/monitor-loader.js!./node_modules/start-server-webpack-plugin/dist/monitor-loader.js\");\n\n\n//# sourceURL=webpack:///./node_modules/start-server-webpack-plugin/dist/monitor-loader.js?multi_./server/index.js_!./node_modules/start-server-webpack-plugin/dist/monitor-loader.js");

/***/ }),

/***/ "@cra-express/core":
/*!************************************!*\
  !*** external "@cra-express/core" ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@cra-express/core\");\n\n//# sourceURL=webpack:///external_%22@cra-express/core%22?");

/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"dotenv\");\n\n//# sourceURL=webpack:///external_%22dotenv%22?");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"express\");\n\n//# sourceURL=webpack:///external_%22express%22?");

/***/ }),

/***/ "nodemailer":
/*!*****************************!*\
  !*** external "nodemailer" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"nodemailer\");\n\n//# sourceURL=webpack:///external_%22nodemailer%22?");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"path\");\n\n//# sourceURL=webpack:///external_%22path%22?");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"react\");\n\n//# sourceURL=webpack:///external_%22react%22?");

/***/ }),

/***/ "react-dom/server":
/*!***********************************!*\
  !*** external "react-dom/server" ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"react-dom/server\");\n\n//# sourceURL=webpack:///external_%22react-dom/server%22?");

/***/ }),

/***/ "react-helmet":
/*!*******************************!*\
  !*** external "react-helmet" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"react-helmet\");\n\n//# sourceURL=webpack:///external_%22react-helmet%22?");

/***/ }),

/***/ "react-router-dom":
/*!***********************************!*\
  !*** external "react-router-dom" ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"react-router-dom\");\n\n//# sourceURL=webpack:///external_%22react-router-dom%22?");

/***/ }),

/***/ "slugify":
/*!**************************!*\
  !*** external "slugify" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"slugify\");\n\n//# sourceURL=webpack:///external_%22slugify%22?");

/***/ }),

/***/ "webpack/hot/log-apply-result":
/*!***********************************************!*\
  !*** external "webpack/hot/log-apply-result" ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"webpack/hot/log-apply-result\");\n\n//# sourceURL=webpack:///external_%22webpack/hot/log-apply-result%22?");

/***/ })

/******/ });