require("source-map-support").install();
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _config = __webpack_require__(1);
	
	var _config2 = _interopRequireDefault(_config);
	
	var _appLogger = __webpack_require__(2);
	
	var _appLogger2 = _interopRequireDefault(_appLogger);
	
	var _appRoutes = __webpack_require__(3);
	
	var _appRoutes2 = _interopRequireDefault(_appRoutes);
	
	var _express = __webpack_require__(10);
	
	var _express2 = _interopRequireDefault(_express);
	
	var _bodyParser = __webpack_require__(11);
	
	var _bodyParser2 = _interopRequireDefault(_bodyParser);
	
	var app = (0, _express2['default'])();
	app.use(_bodyParser2['default'].json());
	app.use(_bodyParser2['default'].urlencoded({ extended: true }));
	
	_appRoutes2['default'].configure(app);
	
	var port = process.env.PORT || _config2['default'].port;
	app.listen(port);
	
	(0, _appLogger2['default'])('Listening on port ' + port);

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	exports['default'] = {
	    port: 1666,
	    storageFilename: 'ladders.json'
	};
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	exports['default'] = function (message) {
	    console.log(message);
	};
	
	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _logger = __webpack_require__(2);
	
	var _logger2 = _interopRequireDefault(_logger);
	
	var _commandBus = __webpack_require__(4);
	
	var _commandBus2 = _interopRequireDefault(_commandBus);
	
	var configure = function configure(app) {
	
	    app.get('/', function (req, res) {
	        res.end('hello from Klesk');
	    });
	
	    app.post('/', function (req, res) {
	        _commandBus2['default'].dispatch(req.body, function (error, response) {
	            (0, _logger2['default'])(req.body);
	            res.end(JSON.stringify(response));
	        });
	    });
	};
	
	exports['default'] = {
	    configure: configure
	};
	module.exports = exports['default'];

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _lodash = __webpack_require__(5);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	var _commandHandlersFactory = __webpack_require__(6);
	
	var _commandHandlersFactory2 = _interopRequireDefault(_commandHandlersFactory);
	
	exports['default'] = {
	    dispatch: function dispatch(command, callback) {
	        var parsedCommandArguments = _lodash2['default'].words(command.text);
	        var commandType = parsedCommandArguments[0];
	
	        var parsedCommand = {
	            playerName: command.user_name,
	            arguments: parsedCommandArguments
	        };
	
	        var commandHandler = _commandHandlersFactory2['default'].getCommandHandler(commandType);
	        var result = commandHandler.makeItSo(parsedCommand, callback);
	
	        return result;
	    }
	};
	module.exports = exports['default'];

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("lodash");

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _JsonPersistence = __webpack_require__(7);
	
	var _JsonPersistence2 = _interopRequireDefault(_JsonPersistence);
	
	var _handlersNewLadderHandler = __webpack_require__(8);
	
	var _handlersNewLadderHandler2 = _interopRequireDefault(_handlersNewLadderHandler);
	
	var _handlersJoinLadderHandler = __webpack_require__(12);
	
	var _handlersJoinLadderHandler2 = _interopRequireDefault(_handlersJoinLadderHandler);
	
	var _handlersNullHandler = __webpack_require__(9);
	
	var _handlersNullHandler2 = _interopRequireDefault(_handlersNullHandler);
	
	var _config = __webpack_require__(1);
	
	var _config2 = _interopRequireDefault(_config);
	
	var _logger = __webpack_require__(2);
	
	var _logger2 = _interopRequireDefault(_logger);
	
	var jsonPersistence = new _JsonPersistence2['default'](_config2['default'].storageFilename);
	jsonPersistence.init(function (error) {
	    (0, _logger2['default'])(error);
	});
	
	var commandTypes = {
	    NEWLADDER: 'newladder',
	    JOINLADDER: 'joinladder'
	};
	
	var getCommandHandler = function getCommandHandler(commandType) {
	    switch (commandType) {
	        case commandTypes.NEWLADDER:
	            return (0, _handlersNewLadderHandler2['default'])(jsonPersistence);
	
	        case commandTypes.JOINLADDER:
	            return (0, _handlersJoinLadderHandler2['default'])(jsonPersistence);
	
	        default:
	            return (0, _handlersNullHandler2['default'])();
	    }
	};
	
	exports['default'] = {
	    getCommandHandler: getCommandHandler
	};
	module.exports = exports['default'];

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = require("JsonPersistence");

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	function Ladder(name) {
	    return {
	        name: name,
	        matches: []
	    };
	}
	
	var newLadderHandler = function newLadderHandler(persistence) {
	    return {
	        makeItSo: function makeItSo(parsedCommand, callback) {
	            var ladderName = parsedCommand.arguments[1];
	
	            persistence.add(Ladder(ladderName), function (error) {
	                if (error) {
	                    callback(error.message, null);
	                }
	
	                callback(null, 'Created new ladder: ' + ladderName);
	            });
	        }
	    };
	};
	
	exports['default'] = newLadderHandler;
	module.exports = exports['default'];

/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	var thisIsNotTheCommandYouAreLookingFor = function thisIsNotTheCommandYouAreLookingFor() {
	    return {
	        makeItSo: function makeItSo(parsedCommand, callback) {
	            callback(null, 'This is not the command you are looking for.');
	        }
	    };
	};
	
	exports['default'] = thisIsNotTheCommandYouAreLookingFor;
	module.exports = exports['default'];

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = require("express");

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = require("body-parser");

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _lodash = __webpack_require__(5);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	var _logger = __webpack_require__(2);
	
	var _logger2 = _interopRequireDefault(_logger);
	
	var RESULT_MESSAGE = 'Added: ';
	
	var newLadderHandler = function newLadderHandler(persistence) {
	    function _thereAreNoOtherPlayers(matches) {
	        return matches.length === 0;
	    }
	
	    function _thereIsOnlyOnePlayer(matches) {
	        return matches.length === 1 && (matches[0].player1 === '' || matches[0].player2 === '');
	    }
	
	    function _addNewPlayerToMatch(match, player) {
	        if (match.player1 === '') {
	            match.player1 = player;
	            return;
	        }
	
	        match.player2 = player;
	    }
	
	    return {
	        makeItSo: function makeItSo(parsedCommand, callback) {
	            var ladderName = parsedCommand.arguments[1];
	            var playerName = parsedCommand.playerName;
	
	            var queryLadder = function queryLadder(ladder) {
	                return ladder.name === ladderName;
	            };
	
	            var updateCallback = function updateCallback(ladder) {
	                if (_thereAreNoOtherPlayers(ladder.matches)) {
	                    ladder.matches.push({ player1: playerName, player2: '', winner: '' });
	
	                    callback(RESULT_MESSAGE + playerName);
	                    return;
	                }
	
	                if (_thereIsOnlyOnePlayer(ladder.matches)) {
	                    _addNewPlayerToMatch(ladder.matches[0], playerName);
	
	                    callback(RESULT_MESSAGE + playerName);
	                    return;
	                }
	
	                var allPlayersInLadder = (0, _lodash2['default'])(ladder.matches).map(function (match) {
	                    return [match.player1, match.player2];
	                }).flatten().uniq().value();
	
	                var newMatchesToPlay = _lodash2['default'].map(allPlayersInLadder, function (player) {
	                    return { player1: playerName, player2: player, winner: '' };
	                });
	
	                var allMatches = ladder.matches;
	
	                var matches = allMatches.concat(newMatchesToPlay);
	
	                ladder.matches = matches;
	            };
	
	            persistence.update(queryLadder, updateCallback, function (error) {
	                if (error) {
	                    (0, _logger2['default'])(error);
	                }
	                (0, _logger2['default'])('updejtuje');
	                callback(null, RESULT_MESSAGE + playerName);
	            });
	        }
	    };
	};
	
	exports['default'] = newLadderHandler;
	module.exports = exports['default'];

/***/ }
/******/ ]);
//# sourceMappingURL=server.js.map