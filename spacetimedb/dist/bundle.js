import * as _syscalls2_0 from "spacetime:sys@2.0";
import { moduleHooks } from "spacetime:sys@2.0";

//#region node_modules/headers-polyfill/lib/index.mjs
var __create$1 = Object.create;
var __defProp$1 = Object.defineProperty;
var __getOwnPropDesc$1 = Object.getOwnPropertyDescriptor;
var __getOwnPropNames$1 = Object.getOwnPropertyNames;
var __getProtoOf$1 = Object.getPrototypeOf;
var __hasOwnProp$1 = Object.prototype.hasOwnProperty;
var __commonJS$1 = (cb, mod) => function __require() {
	return mod || (0, cb[__getOwnPropNames$1(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps$1 = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") {
		for (let key of __getOwnPropNames$1(from)) if (!__hasOwnProp$1.call(to, key) && key !== except) __defProp$1(to, key, {
			get: () => from[key],
			enumerable: !(desc = __getOwnPropDesc$1(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM$1 = (mod, isNodeMode, target) => (target = mod != null ? __create$1(__getProtoOf$1(mod)) : {}, __copyProps$1(isNodeMode || !mod || !mod.__esModule ? __defProp$1(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
var import_set_cookie_parser = __toESM$1(__commonJS$1({ "node_modules/set-cookie-parser/lib/set-cookie.js"(exports, module) {
	"use strict";
	var defaultParseOptions = {
		decodeValues: true,
		map: false,
		silent: false
	};
	function isNonEmptyString(str) {
		return typeof str === "string" && !!str.trim();
	}
	function parseString(setCookieValue, options) {
		var parts = setCookieValue.split(";").filter(isNonEmptyString);
		var parsed = parseNameValuePair(parts.shift());
		var name = parsed.name;
		var value = parsed.value;
		options = options ? Object.assign({}, defaultParseOptions, options) : defaultParseOptions;
		try {
			value = options.decodeValues ? decodeURIComponent(value) : value;
		} catch (e) {
			console.error("set-cookie-parser encountered an error while decoding a cookie with value '" + value + "'. Set options.decodeValues to false to disable this feature.", e);
		}
		var cookie = {
			name,
			value
		};
		parts.forEach(function(part) {
			var sides = part.split("=");
			var key = sides.shift().trimLeft().toLowerCase();
			var value2 = sides.join("=");
			if (key === "expires") cookie.expires = new Date(value2);
			else if (key === "max-age") cookie.maxAge = parseInt(value2, 10);
			else if (key === "secure") cookie.secure = true;
			else if (key === "httponly") cookie.httpOnly = true;
			else if (key === "samesite") cookie.sameSite = value2;
			else cookie[key] = value2;
		});
		return cookie;
	}
	function parseNameValuePair(nameValuePairStr) {
		var name = "";
		var value = "";
		var nameValueArr = nameValuePairStr.split("=");
		if (nameValueArr.length > 1) {
			name = nameValueArr.shift();
			value = nameValueArr.join("=");
		} else value = nameValuePairStr;
		return {
			name,
			value
		};
	}
	function parse(input, options) {
		options = options ? Object.assign({}, defaultParseOptions, options) : defaultParseOptions;
		if (!input) if (!options.map) return [];
		else return {};
		if (input.headers) if (typeof input.headers.getSetCookie === "function") input = input.headers.getSetCookie();
		else if (input.headers["set-cookie"]) input = input.headers["set-cookie"];
		else {
			var sch = input.headers[Object.keys(input.headers).find(function(key) {
				return key.toLowerCase() === "set-cookie";
			})];
			if (!sch && input.headers.cookie && !options.silent) console.warn("Warning: set-cookie-parser appears to have been called on a request object. It is designed to parse Set-Cookie headers from responses, not Cookie headers from requests. Set the option {silent: true} to suppress this warning.");
			input = sch;
		}
		if (!Array.isArray(input)) input = [input];
		options = options ? Object.assign({}, defaultParseOptions, options) : defaultParseOptions;
		if (!options.map) return input.filter(isNonEmptyString).map(function(str) {
			return parseString(str, options);
		});
		else return input.filter(isNonEmptyString).reduce(function(cookies2, str) {
			var cookie = parseString(str, options);
			cookies2[cookie.name] = cookie;
			return cookies2;
		}, {});
	}
	function splitCookiesString2(cookiesString) {
		if (Array.isArray(cookiesString)) return cookiesString;
		if (typeof cookiesString !== "string") return [];
		var cookiesStrings = [];
		var pos = 0;
		var start;
		var ch;
		var lastComma;
		var nextStart;
		var cookiesSeparatorFound;
		function skipWhitespace() {
			while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) pos += 1;
			return pos < cookiesString.length;
		}
		function notSpecialChar() {
			ch = cookiesString.charAt(pos);
			return ch !== "=" && ch !== ";" && ch !== ",";
		}
		while (pos < cookiesString.length) {
			start = pos;
			cookiesSeparatorFound = false;
			while (skipWhitespace()) {
				ch = cookiesString.charAt(pos);
				if (ch === ",") {
					lastComma = pos;
					pos += 1;
					skipWhitespace();
					nextStart = pos;
					while (pos < cookiesString.length && notSpecialChar()) pos += 1;
					if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
						cookiesSeparatorFound = true;
						pos = nextStart;
						cookiesStrings.push(cookiesString.substring(start, lastComma));
						start = pos;
					} else pos = lastComma + 1;
				} else pos += 1;
			}
			if (!cookiesSeparatorFound || pos >= cookiesString.length) cookiesStrings.push(cookiesString.substring(start, cookiesString.length));
		}
		return cookiesStrings;
	}
	module.exports = parse;
	module.exports.parse = parse;
	module.exports.parseString = parseString;
	module.exports.splitCookiesString = splitCookiesString2;
} })());
var HEADERS_INVALID_CHARACTERS = /[^a-z0-9\-#$%&'*+.^_`|~]/i;
function normalizeHeaderName(name) {
	if (HEADERS_INVALID_CHARACTERS.test(name) || name.trim() === "") throw new TypeError("Invalid character in header field name");
	return name.trim().toLowerCase();
}
var charCodesToRemove = [
	String.fromCharCode(10),
	String.fromCharCode(13),
	String.fromCharCode(9),
	String.fromCharCode(32)
];
var HEADER_VALUE_REMOVE_REGEXP = new RegExp(`(^[${charCodesToRemove.join("")}]|$[${charCodesToRemove.join("")}])`, "g");
function normalizeHeaderValue(value) {
	return value.replace(HEADER_VALUE_REMOVE_REGEXP, "");
}
function isValidHeaderName(value) {
	if (typeof value !== "string") return false;
	if (value.length === 0) return false;
	for (let i = 0; i < value.length; i++) {
		const character = value.charCodeAt(i);
		if (character > 127 || !isToken(character)) return false;
	}
	return true;
}
function isToken(value) {
	return ![
		127,
		32,
		"(",
		")",
		"<",
		">",
		"@",
		",",
		";",
		":",
		"\\",
		"\"",
		"/",
		"[",
		"]",
		"?",
		"=",
		"{",
		"}"
	].includes(value);
}
function isValidHeaderValue(value) {
	if (typeof value !== "string") return false;
	if (value.trim() !== value) return false;
	for (let i = 0; i < value.length; i++) {
		const character = value.charCodeAt(i);
		if (character === 0 || character === 10 || character === 13) return false;
	}
	return true;
}
var NORMALIZED_HEADERS = Symbol("normalizedHeaders");
var RAW_HEADER_NAMES = Symbol("rawHeaderNames");
var HEADER_VALUE_DELIMITER = ", ";
var _a, _b, _c;
var Headers = class _Headers {
	constructor(init) {
		this[_a] = {};
		this[_b] = /* @__PURE__ */ new Map();
		this[_c] = "Headers";
		if (["Headers", "HeadersPolyfill"].includes(init?.constructor.name) || init instanceof _Headers || typeof globalThis.Headers !== "undefined" && init instanceof globalThis.Headers) init.forEach((value, name) => {
			this.append(name, value);
		}, this);
		else if (Array.isArray(init)) init.forEach(([name, value]) => {
			this.append(name, Array.isArray(value) ? value.join(HEADER_VALUE_DELIMITER) : value);
		});
		else if (init) Object.getOwnPropertyNames(init).forEach((name) => {
			const value = init[name];
			this.append(name, Array.isArray(value) ? value.join(HEADER_VALUE_DELIMITER) : value);
		});
	}
	[(_a = NORMALIZED_HEADERS, _b = RAW_HEADER_NAMES, _c = Symbol.toStringTag, Symbol.iterator)]() {
		return this.entries();
	}
	*keys() {
		for (const [name] of this.entries()) yield name;
	}
	*values() {
		for (const [, value] of this.entries()) yield value;
	}
	*entries() {
		let sortedKeys = Object.keys(this[NORMALIZED_HEADERS]).sort((a, b) => a.localeCompare(b));
		for (const name of sortedKeys) if (name === "set-cookie") for (const value of this.getSetCookie()) yield [name, value];
		else yield [name, this.get(name)];
	}
	/**
	* Returns a boolean stating whether a `Headers` object contains a certain header.
	*/
	has(name) {
		if (!isValidHeaderName(name)) throw new TypeError(`Invalid header name "${name}"`);
		return this[NORMALIZED_HEADERS].hasOwnProperty(normalizeHeaderName(name));
	}
	/**
	* Returns a `ByteString` sequence of all the values of a header with a given name.
	*/
	get(name) {
		if (!isValidHeaderName(name)) throw TypeError(`Invalid header name "${name}"`);
		return this[NORMALIZED_HEADERS][normalizeHeaderName(name)] ?? null;
	}
	/**
	* Sets a new value for an existing header inside a `Headers` object, or adds the header if it does not already exist.
	*/
	set(name, value) {
		if (!isValidHeaderName(name) || !isValidHeaderValue(value)) return;
		const normalizedName = normalizeHeaderName(name);
		const normalizedValue = normalizeHeaderValue(value);
		this[NORMALIZED_HEADERS][normalizedName] = normalizeHeaderValue(normalizedValue);
		this[RAW_HEADER_NAMES].set(normalizedName, name);
	}
	/**
	* Appends a new value onto an existing header inside a `Headers` object, or adds the header if it does not already exist.
	*/
	append(name, value) {
		if (!isValidHeaderName(name) || !isValidHeaderValue(value)) return;
		const normalizedName = normalizeHeaderName(name);
		const normalizedValue = normalizeHeaderValue(value);
		let resolvedValue = this.has(normalizedName) ? `${this.get(normalizedName)}, ${normalizedValue}` : normalizedValue;
		this.set(name, resolvedValue);
	}
	/**
	* Deletes a header from the `Headers` object.
	*/
	delete(name) {
		if (!isValidHeaderName(name)) return;
		if (!this.has(name)) return;
		const normalizedName = normalizeHeaderName(name);
		delete this[NORMALIZED_HEADERS][normalizedName];
		this[RAW_HEADER_NAMES].delete(normalizedName);
	}
	/**
	* Traverses the `Headers` object,
	* calling the given callback for each header.
	*/
	forEach(callback, thisArg) {
		for (const [name, value] of this.entries()) callback.call(thisArg, value, name, this);
	}
	/**
	* Returns an array containing the values
	* of all Set-Cookie headers associated
	* with a response
	*/
	getSetCookie() {
		const setCookieHeader = this.get("set-cookie");
		if (setCookieHeader === null) return [];
		if (setCookieHeader === "") return [""];
		return (0, import_set_cookie_parser.splitCookiesString)(setCookieHeader);
	}
};
function headersToList(headers) {
	const headersList = [];
	headers.forEach((value, name) => {
		const resolvedValue = value.includes(",") ? value.split(",").map((value2) => value2.trim()) : value;
		headersList.push([name, resolvedValue]);
	});
	return headersList;
}

//#endregion
//#region node_modules/spacetimedb/dist/server/index.mjs
typeof globalThis !== "undefined" && (globalThis.global = globalThis.global || globalThis, globalThis.window = globalThis.window || globalThis);
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
	return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
	return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
};
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") {
		for (let key of __getOwnPropNames(from)) if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: () => from[key],
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(__defProp(target, "default", {
	value: mod,
	enumerable: true
}), mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var require_base64_js = __commonJS({ "../../node_modules/.pnpm/base64-js@1.5.1/node_modules/base64-js/index.js"(exports) {
	exports.byteLength = byteLength;
	exports.toByteArray = toByteArray;
	exports.fromByteArray = fromByteArray2;
	var lookup = [];
	var revLookup = [];
	var Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
	var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	for (i = 0, len = code.length; i < len; ++i) {
		lookup[i] = code[i];
		revLookup[code.charCodeAt(i)] = i;
	}
	var i;
	var len;
	revLookup["-".charCodeAt(0)] = 62;
	revLookup["_".charCodeAt(0)] = 63;
	function getLens(b64) {
		var len2 = b64.length;
		if (len2 % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
		var validLen = b64.indexOf("=");
		if (validLen === -1) validLen = len2;
		var placeHoldersLen = validLen === len2 ? 0 : 4 - validLen % 4;
		return [validLen, placeHoldersLen];
	}
	function byteLength(b64) {
		var lens = getLens(b64);
		var validLen = lens[0];
		var placeHoldersLen = lens[1];
		return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
	}
	function _byteLength(b64, validLen, placeHoldersLen) {
		return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
	}
	function toByteArray(b64) {
		var tmp;
		var lens = getLens(b64);
		var validLen = lens[0];
		var placeHoldersLen = lens[1];
		var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
		var curByte = 0;
		var len2 = placeHoldersLen > 0 ? validLen - 4 : validLen;
		var i2;
		for (i2 = 0; i2 < len2; i2 += 4) {
			tmp = revLookup[b64.charCodeAt(i2)] << 18 | revLookup[b64.charCodeAt(i2 + 1)] << 12 | revLookup[b64.charCodeAt(i2 + 2)] << 6 | revLookup[b64.charCodeAt(i2 + 3)];
			arr[curByte++] = tmp >> 16 & 255;
			arr[curByte++] = tmp >> 8 & 255;
			arr[curByte++] = tmp & 255;
		}
		if (placeHoldersLen === 2) {
			tmp = revLookup[b64.charCodeAt(i2)] << 2 | revLookup[b64.charCodeAt(i2 + 1)] >> 4;
			arr[curByte++] = tmp & 255;
		}
		if (placeHoldersLen === 1) {
			tmp = revLookup[b64.charCodeAt(i2)] << 10 | revLookup[b64.charCodeAt(i2 + 1)] << 4 | revLookup[b64.charCodeAt(i2 + 2)] >> 2;
			arr[curByte++] = tmp >> 8 & 255;
			arr[curByte++] = tmp & 255;
		}
		return arr;
	}
	function tripletToBase64(num) {
		return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[num & 63];
	}
	function encodeChunk(uint8, start, end) {
		var tmp;
		var output = [];
		for (var i2 = start; i2 < end; i2 += 3) {
			tmp = (uint8[i2] << 16 & 16711680) + (uint8[i2 + 1] << 8 & 65280) + (uint8[i2 + 2] & 255);
			output.push(tripletToBase64(tmp));
		}
		return output.join("");
	}
	function fromByteArray2(uint8) {
		var tmp;
		var len2 = uint8.length;
		var extraBytes = len2 % 3;
		var parts = [];
		var maxChunkLength = 16383;
		for (var i2 = 0, len22 = len2 - extraBytes; i2 < len22; i2 += maxChunkLength) parts.push(encodeChunk(uint8, i2, i2 + maxChunkLength > len22 ? len22 : i2 + maxChunkLength));
		if (extraBytes === 1) {
			tmp = uint8[len2 - 1];
			parts.push(lookup[tmp >> 2] + lookup[tmp << 4 & 63] + "==");
		} else if (extraBytes === 2) {
			tmp = (uint8[len2 - 2] << 8) + uint8[len2 - 1];
			parts.push(lookup[tmp >> 10] + lookup[tmp >> 4 & 63] + lookup[tmp << 2 & 63] + "=");
		}
		return parts.join("");
	}
} });
var require_codes = __commonJS({ "../../node_modules/.pnpm/statuses@2.0.2/node_modules/statuses/codes.json"(exports, module) {
	module.exports = {
		"100": "Continue",
		"101": "Switching Protocols",
		"102": "Processing",
		"103": "Early Hints",
		"200": "OK",
		"201": "Created",
		"202": "Accepted",
		"203": "Non-Authoritative Information",
		"204": "No Content",
		"205": "Reset Content",
		"206": "Partial Content",
		"207": "Multi-Status",
		"208": "Already Reported",
		"226": "IM Used",
		"300": "Multiple Choices",
		"301": "Moved Permanently",
		"302": "Found",
		"303": "See Other",
		"304": "Not Modified",
		"305": "Use Proxy",
		"307": "Temporary Redirect",
		"308": "Permanent Redirect",
		"400": "Bad Request",
		"401": "Unauthorized",
		"402": "Payment Required",
		"403": "Forbidden",
		"404": "Not Found",
		"405": "Method Not Allowed",
		"406": "Not Acceptable",
		"407": "Proxy Authentication Required",
		"408": "Request Timeout",
		"409": "Conflict",
		"410": "Gone",
		"411": "Length Required",
		"412": "Precondition Failed",
		"413": "Payload Too Large",
		"414": "URI Too Long",
		"415": "Unsupported Media Type",
		"416": "Range Not Satisfiable",
		"417": "Expectation Failed",
		"418": "I'm a Teapot",
		"421": "Misdirected Request",
		"422": "Unprocessable Entity",
		"423": "Locked",
		"424": "Failed Dependency",
		"425": "Too Early",
		"426": "Upgrade Required",
		"428": "Precondition Required",
		"429": "Too Many Requests",
		"431": "Request Header Fields Too Large",
		"451": "Unavailable For Legal Reasons",
		"500": "Internal Server Error",
		"501": "Not Implemented",
		"502": "Bad Gateway",
		"503": "Service Unavailable",
		"504": "Gateway Timeout",
		"505": "HTTP Version Not Supported",
		"506": "Variant Also Negotiates",
		"507": "Insufficient Storage",
		"508": "Loop Detected",
		"509": "Bandwidth Limit Exceeded",
		"510": "Not Extended",
		"511": "Network Authentication Required"
	};
} });
var require_statuses = __commonJS({ "../../node_modules/.pnpm/statuses@2.0.2/node_modules/statuses/index.js"(exports, module) {
	var codes = require_codes();
	module.exports = status2;
	status2.message = codes;
	status2.code = createMessageToStatusCodeMap(codes);
	status2.codes = createStatusCodeList(codes);
	status2.redirect = {
		300: true,
		301: true,
		302: true,
		303: true,
		305: true,
		307: true,
		308: true
	};
	status2.empty = {
		204: true,
		205: true,
		304: true
	};
	status2.retry = {
		502: true,
		503: true,
		504: true
	};
	function createMessageToStatusCodeMap(codes2) {
		var map = {};
		Object.keys(codes2).forEach(function forEachCode(code) {
			var message = codes2[code];
			var status3 = Number(code);
			map[message.toLowerCase()] = status3;
		});
		return map;
	}
	function createStatusCodeList(codes2) {
		return Object.keys(codes2).map(function mapCode(code) {
			return Number(code);
		});
	}
	function getStatusCode(message) {
		var msg = message.toLowerCase();
		if (!Object.prototype.hasOwnProperty.call(status2.code, msg)) throw new Error("invalid status message: \"" + message + "\"");
		return status2.code[msg];
	}
	function getStatusMessage(code) {
		if (!Object.prototype.hasOwnProperty.call(status2.message, code)) throw new Error("invalid status code: " + code);
		return status2.message[code];
	}
	function status2(code) {
		if (typeof code === "number") return getStatusMessage(code);
		if (typeof code !== "string") throw new TypeError("code must be a number or string");
		var n = parseInt(code, 10);
		if (!isNaN(n)) return getStatusMessage(n);
		return getStatusCode(code);
	}
} });
var util_stub_exports = {};
__export(util_stub_exports, { inspect: () => inspect });
var inspect;
var init_util_stub = __esm({ "src/util-stub.ts"() {
	inspect = {};
} });
var require_util_inspect = __commonJS({ "../../node_modules/.pnpm/object-inspect@1.13.4/node_modules/object-inspect/util.inspect.js"(exports, module) {
	module.exports = (init_util_stub(), __toCommonJS(util_stub_exports)).inspect;
} });
var require_object_inspect = __commonJS({ "../../node_modules/.pnpm/object-inspect@1.13.4/node_modules/object-inspect/index.js"(exports, module) {
	var hasMap = typeof Map === "function" && Map.prototype;
	var mapSizeDescriptor = Object.getOwnPropertyDescriptor && hasMap ? Object.getOwnPropertyDescriptor(Map.prototype, "size") : null;
	var mapSize = hasMap && mapSizeDescriptor && typeof mapSizeDescriptor.get === "function" ? mapSizeDescriptor.get : null;
	var mapForEach = hasMap && Map.prototype.forEach;
	var hasSet = typeof Set === "function" && Set.prototype;
	var setSizeDescriptor = Object.getOwnPropertyDescriptor && hasSet ? Object.getOwnPropertyDescriptor(Set.prototype, "size") : null;
	var setSize = hasSet && setSizeDescriptor && typeof setSizeDescriptor.get === "function" ? setSizeDescriptor.get : null;
	var setForEach = hasSet && Set.prototype.forEach;
	var weakMapHas = typeof WeakMap === "function" && WeakMap.prototype ? WeakMap.prototype.has : null;
	var weakSetHas = typeof WeakSet === "function" && WeakSet.prototype ? WeakSet.prototype.has : null;
	var weakRefDeref = typeof WeakRef === "function" && WeakRef.prototype ? WeakRef.prototype.deref : null;
	var booleanValueOf = Boolean.prototype.valueOf;
	var objectToString = Object.prototype.toString;
	var functionToString = Function.prototype.toString;
	var $match = String.prototype.match;
	var $slice = String.prototype.slice;
	var $replace = String.prototype.replace;
	var $toUpperCase = String.prototype.toUpperCase;
	var $toLowerCase = String.prototype.toLowerCase;
	var $test = RegExp.prototype.test;
	var $concat = Array.prototype.concat;
	var $join = Array.prototype.join;
	var $arrSlice = Array.prototype.slice;
	var $floor = Math.floor;
	var bigIntValueOf = typeof BigInt === "function" ? BigInt.prototype.valueOf : null;
	var gOPS = Object.getOwnPropertySymbols;
	var symToString = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? Symbol.prototype.toString : null;
	var hasShammedSymbols = typeof Symbol === "function" && typeof Symbol.iterator === "object";
	var toStringTag = typeof Symbol === "function" && Symbol.toStringTag && (typeof Symbol.toStringTag === hasShammedSymbols ? "object" : "symbol") ? Symbol.toStringTag : null;
	var isEnumerable = Object.prototype.propertyIsEnumerable;
	var gPO = (typeof Reflect === "function" ? Reflect.getPrototypeOf : Object.getPrototypeOf) || ([].__proto__ === Array.prototype ? function(O) {
		return O.__proto__;
	} : null);
	function addNumericSeparator(num, str) {
		if (num === Infinity || num === -Infinity || num !== num || num && num > -1e3 && num < 1e3 || $test.call(/e/, str)) return str;
		var sepRegex = /[0-9](?=(?:[0-9]{3})+(?![0-9]))/g;
		if (typeof num === "number") {
			var int = num < 0 ? -$floor(-num) : $floor(num);
			if (int !== num) {
				var intStr = String(int);
				var dec = $slice.call(str, intStr.length + 1);
				return $replace.call(intStr, sepRegex, "$&_") + "." + $replace.call($replace.call(dec, /([0-9]{3})/g, "$&_"), /_$/, "");
			}
		}
		return $replace.call(str, sepRegex, "$&_");
	}
	var utilInspect = require_util_inspect();
	var inspectCustom = utilInspect.custom;
	var inspectSymbol = isSymbol(inspectCustom) ? inspectCustom : null;
	var quotes = {
		__proto__: null,
		"double": "\"",
		single: "'"
	};
	var quoteREs = {
		__proto__: null,
		"double": /(["\\])/g,
		single: /(['\\])/g
	};
	module.exports = function inspect_(obj, options, depth, seen) {
		var opts = options || {};
		if (has(opts, "quoteStyle") && !has(quotes, opts.quoteStyle)) throw new TypeError("option \"quoteStyle\" must be \"single\" or \"double\"");
		if (has(opts, "maxStringLength") && (typeof opts.maxStringLength === "number" ? opts.maxStringLength < 0 && opts.maxStringLength !== Infinity : opts.maxStringLength !== null)) throw new TypeError("option \"maxStringLength\", if provided, must be a positive integer, Infinity, or `null`");
		var customInspect = has(opts, "customInspect") ? opts.customInspect : true;
		if (typeof customInspect !== "boolean" && customInspect !== "symbol") throw new TypeError("option \"customInspect\", if provided, must be `true`, `false`, or `'symbol'`");
		if (has(opts, "indent") && opts.indent !== null && opts.indent !== "	" && !(parseInt(opts.indent, 10) === opts.indent && opts.indent > 0)) throw new TypeError("option \"indent\" must be \"\\t\", an integer > 0, or `null`");
		if (has(opts, "numericSeparator") && typeof opts.numericSeparator !== "boolean") throw new TypeError("option \"numericSeparator\", if provided, must be `true` or `false`");
		var numericSeparator = opts.numericSeparator;
		if (typeof obj === "undefined") return "undefined";
		if (obj === null) return "null";
		if (typeof obj === "boolean") return obj ? "true" : "false";
		if (typeof obj === "string") return inspectString(obj, opts);
		if (typeof obj === "number") {
			if (obj === 0) return Infinity / obj > 0 ? "0" : "-0";
			var str = String(obj);
			return numericSeparator ? addNumericSeparator(obj, str) : str;
		}
		if (typeof obj === "bigint") {
			var bigIntStr = String(obj) + "n";
			return numericSeparator ? addNumericSeparator(obj, bigIntStr) : bigIntStr;
		}
		var maxDepth = typeof opts.depth === "undefined" ? 5 : opts.depth;
		if (typeof depth === "undefined") depth = 0;
		if (depth >= maxDepth && maxDepth > 0 && typeof obj === "object") return isArray(obj) ? "[Array]" : "[Object]";
		var indent = getIndent(opts, depth);
		if (typeof seen === "undefined") seen = [];
		else if (indexOf(seen, obj) >= 0) return "[Circular]";
		function inspect3(value, from, noIndent) {
			if (from) {
				seen = $arrSlice.call(seen);
				seen.push(from);
			}
			if (noIndent) {
				var newOpts = { depth: opts.depth };
				if (has(opts, "quoteStyle")) newOpts.quoteStyle = opts.quoteStyle;
				return inspect_(value, newOpts, depth + 1, seen);
			}
			return inspect_(value, opts, depth + 1, seen);
		}
		if (typeof obj === "function" && !isRegExp(obj)) {
			var name = nameOf(obj);
			var keys = arrObjKeys(obj, inspect3);
			return "[Function" + (name ? ": " + name : " (anonymous)") + "]" + (keys.length > 0 ? " { " + $join.call(keys, ", ") + " }" : "");
		}
		if (isSymbol(obj)) {
			var symString = hasShammedSymbols ? $replace.call(String(obj), /^(Symbol\(.*\))_[^)]*$/, "$1") : symToString.call(obj);
			return typeof obj === "object" && !hasShammedSymbols ? markBoxed(symString) : symString;
		}
		if (isElement(obj)) {
			var s = "<" + $toLowerCase.call(String(obj.nodeName));
			var attrs = obj.attributes || [];
			for (var i = 0; i < attrs.length; i++) s += " " + attrs[i].name + "=" + wrapQuotes(quote(attrs[i].value), "double", opts);
			s += ">";
			if (obj.childNodes && obj.childNodes.length) s += "...";
			s += "</" + $toLowerCase.call(String(obj.nodeName)) + ">";
			return s;
		}
		if (isArray(obj)) {
			if (obj.length === 0) return "[]";
			var xs = arrObjKeys(obj, inspect3);
			if (indent && !singleLineValues(xs)) return "[" + indentedJoin(xs, indent) + "]";
			return "[ " + $join.call(xs, ", ") + " ]";
		}
		if (isError(obj)) {
			var parts = arrObjKeys(obj, inspect3);
			if (!("cause" in Error.prototype) && "cause" in obj && !isEnumerable.call(obj, "cause")) return "{ [" + String(obj) + "] " + $join.call($concat.call("[cause]: " + inspect3(obj.cause), parts), ", ") + " }";
			if (parts.length === 0) return "[" + String(obj) + "]";
			return "{ [" + String(obj) + "] " + $join.call(parts, ", ") + " }";
		}
		if (typeof obj === "object" && customInspect) {
			if (inspectSymbol && typeof obj[inspectSymbol] === "function" && utilInspect) return utilInspect(obj, { depth: maxDepth - depth });
			else if (customInspect !== "symbol" && typeof obj.inspect === "function") return obj.inspect();
		}
		if (isMap(obj)) {
			var mapParts = [];
			if (mapForEach) mapForEach.call(obj, function(value, key) {
				mapParts.push(inspect3(key, obj, true) + " => " + inspect3(value, obj));
			});
			return collectionOf("Map", mapSize.call(obj), mapParts, indent);
		}
		if (isSet(obj)) {
			var setParts = [];
			if (setForEach) setForEach.call(obj, function(value) {
				setParts.push(inspect3(value, obj));
			});
			return collectionOf("Set", setSize.call(obj), setParts, indent);
		}
		if (isWeakMap(obj)) return weakCollectionOf("WeakMap");
		if (isWeakSet(obj)) return weakCollectionOf("WeakSet");
		if (isWeakRef(obj)) return weakCollectionOf("WeakRef");
		if (isNumber(obj)) return markBoxed(inspect3(Number(obj)));
		if (isBigInt(obj)) return markBoxed(inspect3(bigIntValueOf.call(obj)));
		if (isBoolean(obj)) return markBoxed(booleanValueOf.call(obj));
		if (isString(obj)) return markBoxed(inspect3(String(obj)));
		if (typeof window !== "undefined" && obj === window) return "{ [object Window] }";
		if (typeof globalThis !== "undefined" && obj === globalThis || typeof global !== "undefined" && obj === global) return "{ [object globalThis] }";
		if (!isDate(obj) && !isRegExp(obj)) {
			var ys = arrObjKeys(obj, inspect3);
			var isPlainObject = gPO ? gPO(obj) === Object.prototype : obj instanceof Object || obj.constructor === Object;
			var protoTag = obj instanceof Object ? "" : "null prototype";
			var stringTag = !isPlainObject && toStringTag && Object(obj) === obj && toStringTag in obj ? $slice.call(toStr(obj), 8, -1) : protoTag ? "Object" : "";
			var tag = (isPlainObject || typeof obj.constructor !== "function" ? "" : obj.constructor.name ? obj.constructor.name + " " : "") + (stringTag || protoTag ? "[" + $join.call($concat.call([], stringTag || [], protoTag || []), ": ") + "] " : "");
			if (ys.length === 0) return tag + "{}";
			if (indent) return tag + "{" + indentedJoin(ys, indent) + "}";
			return tag + "{ " + $join.call(ys, ", ") + " }";
		}
		return String(obj);
	};
	function wrapQuotes(s, defaultStyle, opts) {
		var quoteChar = quotes[opts.quoteStyle || defaultStyle];
		return quoteChar + s + quoteChar;
	}
	function quote(s) {
		return $replace.call(String(s), /"/g, "&quot;");
	}
	function canTrustToString(obj) {
		return !toStringTag || !(typeof obj === "object" && (toStringTag in obj || typeof obj[toStringTag] !== "undefined"));
	}
	function isArray(obj) {
		return toStr(obj) === "[object Array]" && canTrustToString(obj);
	}
	function isDate(obj) {
		return toStr(obj) === "[object Date]" && canTrustToString(obj);
	}
	function isRegExp(obj) {
		return toStr(obj) === "[object RegExp]" && canTrustToString(obj);
	}
	function isError(obj) {
		return toStr(obj) === "[object Error]" && canTrustToString(obj);
	}
	function isString(obj) {
		return toStr(obj) === "[object String]" && canTrustToString(obj);
	}
	function isNumber(obj) {
		return toStr(obj) === "[object Number]" && canTrustToString(obj);
	}
	function isBoolean(obj) {
		return toStr(obj) === "[object Boolean]" && canTrustToString(obj);
	}
	function isSymbol(obj) {
		if (hasShammedSymbols) return obj && typeof obj === "object" && obj instanceof Symbol;
		if (typeof obj === "symbol") return true;
		if (!obj || typeof obj !== "object" || !symToString) return false;
		try {
			symToString.call(obj);
			return true;
		} catch (e) {}
		return false;
	}
	function isBigInt(obj) {
		if (!obj || typeof obj !== "object" || !bigIntValueOf) return false;
		try {
			bigIntValueOf.call(obj);
			return true;
		} catch (e) {}
		return false;
	}
	var hasOwn2 = Object.prototype.hasOwnProperty || function(key) {
		return key in this;
	};
	function has(obj, key) {
		return hasOwn2.call(obj, key);
	}
	function toStr(obj) {
		return objectToString.call(obj);
	}
	function nameOf(f) {
		if (f.name) return f.name;
		var m = $match.call(functionToString.call(f), /^function\s*([\w$]+)/);
		if (m) return m[1];
		return null;
	}
	function indexOf(xs, x) {
		if (xs.indexOf) return xs.indexOf(x);
		for (var i = 0, l = xs.length; i < l; i++) if (xs[i] === x) return i;
		return -1;
	}
	function isMap(x) {
		if (!mapSize || !x || typeof x !== "object") return false;
		try {
			mapSize.call(x);
			try {
				setSize.call(x);
			} catch (s) {
				return true;
			}
			return x instanceof Map;
		} catch (e) {}
		return false;
	}
	function isWeakMap(x) {
		if (!weakMapHas || !x || typeof x !== "object") return false;
		try {
			weakMapHas.call(x, weakMapHas);
			try {
				weakSetHas.call(x, weakSetHas);
			} catch (s) {
				return true;
			}
			return x instanceof WeakMap;
		} catch (e) {}
		return false;
	}
	function isWeakRef(x) {
		if (!weakRefDeref || !x || typeof x !== "object") return false;
		try {
			weakRefDeref.call(x);
			return true;
		} catch (e) {}
		return false;
	}
	function isSet(x) {
		if (!setSize || !x || typeof x !== "object") return false;
		try {
			setSize.call(x);
			try {
				mapSize.call(x);
			} catch (m) {
				return true;
			}
			return x instanceof Set;
		} catch (e) {}
		return false;
	}
	function isWeakSet(x) {
		if (!weakSetHas || !x || typeof x !== "object") return false;
		try {
			weakSetHas.call(x, weakSetHas);
			try {
				weakMapHas.call(x, weakMapHas);
			} catch (s) {
				return true;
			}
			return x instanceof WeakSet;
		} catch (e) {}
		return false;
	}
	function isElement(x) {
		if (!x || typeof x !== "object") return false;
		if (typeof HTMLElement !== "undefined" && x instanceof HTMLElement) return true;
		return typeof x.nodeName === "string" && typeof x.getAttribute === "function";
	}
	function inspectString(str, opts) {
		if (str.length > opts.maxStringLength) {
			var remaining = str.length - opts.maxStringLength;
			var trailer = "... " + remaining + " more character" + (remaining > 1 ? "s" : "");
			return inspectString($slice.call(str, 0, opts.maxStringLength), opts) + trailer;
		}
		var quoteRE = quoteREs[opts.quoteStyle || "single"];
		quoteRE.lastIndex = 0;
		return wrapQuotes($replace.call($replace.call(str, quoteRE, "\\$1"), /[\x00-\x1f]/g, lowbyte), "single", opts);
	}
	function lowbyte(c) {
		var n = c.charCodeAt(0);
		var x = {
			8: "b",
			9: "t",
			10: "n",
			12: "f",
			13: "r"
		}[n];
		if (x) return "\\" + x;
		return "\\x" + (n < 16 ? "0" : "") + $toUpperCase.call(n.toString(16));
	}
	function markBoxed(str) {
		return "Object(" + str + ")";
	}
	function weakCollectionOf(type) {
		return type + " { ? }";
	}
	function collectionOf(type, size, entries, indent) {
		var joinedEntries = indent ? indentedJoin(entries, indent) : $join.call(entries, ", ");
		return type + " (" + size + ") {" + joinedEntries + "}";
	}
	function singleLineValues(xs) {
		for (var i = 0; i < xs.length; i++) if (indexOf(xs[i], "\n") >= 0) return false;
		return true;
	}
	function getIndent(opts, depth) {
		var baseIndent;
		if (opts.indent === "	") baseIndent = "	";
		else if (typeof opts.indent === "number" && opts.indent > 0) baseIndent = $join.call(Array(opts.indent + 1), " ");
		else return null;
		return {
			base: baseIndent,
			prev: $join.call(Array(depth + 1), baseIndent)
		};
	}
	function indentedJoin(xs, indent) {
		if (xs.length === 0) return "";
		var lineJoiner = "\n" + indent.prev + indent.base;
		return lineJoiner + $join.call(xs, "," + lineJoiner) + "\n" + indent.prev;
	}
	function arrObjKeys(obj, inspect3) {
		var isArr = isArray(obj);
		var xs = [];
		if (isArr) {
			xs.length = obj.length;
			for (var i = 0; i < obj.length; i++) xs[i] = has(obj, i) ? inspect3(obj[i], obj) : "";
		}
		var syms = typeof gOPS === "function" ? gOPS(obj) : [];
		var symMap;
		if (hasShammedSymbols) {
			symMap = {};
			for (var k = 0; k < syms.length; k++) symMap["$" + syms[k]] = syms[k];
		}
		for (var key in obj) {
			if (!has(obj, key)) continue;
			if (isArr && String(Number(key)) === key && key < obj.length) continue;
			if (hasShammedSymbols && symMap["$" + key] instanceof Symbol) continue;
			else if ($test.call(/[^\w$]/, key)) xs.push(inspect3(key, obj) + ": " + inspect3(obj[key], obj));
			else xs.push(key + ": " + inspect3(obj[key], obj));
		}
		if (typeof gOPS === "function") {
			for (var j = 0; j < syms.length; j++) if (isEnumerable.call(obj, syms[j])) xs.push("[" + inspect3(syms[j]) + "]: " + inspect3(obj[syms[j]], obj));
		}
		return xs;
	}
} });
var TimeDuration = class _TimeDuration {
	__time_duration_micros__;
	static MICROS_PER_MILLIS = 1000n;
	/**
	* Get the algebraic type representation of the {@link TimeDuration} type.
	* @returns The algebraic type representation of the type.
	*/
	static getAlgebraicType() {
		return AlgebraicType.Product({ elements: [{
			name: "__time_duration_micros__",
			algebraicType: AlgebraicType.I64
		}] });
	}
	static isTimeDuration(algebraicType) {
		if (algebraicType.tag !== "Product") return false;
		const elements = algebraicType.value.elements;
		if (elements.length !== 1) return false;
		const microsElement = elements[0];
		return microsElement.name === "__time_duration_micros__" && microsElement.algebraicType.tag === "I64";
	}
	get micros() {
		return this.__time_duration_micros__;
	}
	get millis() {
		return Number(this.micros / _TimeDuration.MICROS_PER_MILLIS);
	}
	constructor(micros) {
		this.__time_duration_micros__ = micros;
	}
	static fromMillis(millis) {
		return new _TimeDuration(BigInt(millis) * _TimeDuration.MICROS_PER_MILLIS);
	}
	/** This outputs the same string format that we use in the host and in Rust modules */
	toString() {
		const micros = this.micros;
		const sign = micros < 0 ? "-" : "+";
		const pos = micros < 0 ? -micros : micros;
		const secs = pos / 1000000n;
		const micros_remaining = pos % 1000000n;
		return `${sign}${secs}.${String(micros_remaining).padStart(6, "0")}`;
	}
};
var Timestamp = class _Timestamp {
	__timestamp_micros_since_unix_epoch__;
	static MICROS_PER_MILLIS = 1000n;
	get microsSinceUnixEpoch() {
		return this.__timestamp_micros_since_unix_epoch__;
	}
	constructor(micros) {
		this.__timestamp_micros_since_unix_epoch__ = micros;
	}
	/**
	* Get the algebraic type representation of the {@link Timestamp} type.
	* @returns The algebraic type representation of the type.
	*/
	static getAlgebraicType() {
		return AlgebraicType.Product({ elements: [{
			name: "__timestamp_micros_since_unix_epoch__",
			algebraicType: AlgebraicType.I64
		}] });
	}
	static isTimestamp(algebraicType) {
		if (algebraicType.tag !== "Product") return false;
		const elements = algebraicType.value.elements;
		if (elements.length !== 1) return false;
		const microsElement = elements[0];
		return microsElement.name === "__timestamp_micros_since_unix_epoch__" && microsElement.algebraicType.tag === "I64";
	}
	/**
	* The Unix epoch, the midnight at the beginning of January 1, 1970, UTC.
	*/
	static UNIX_EPOCH = new _Timestamp(0n);
	/**
	* Get a `Timestamp` representing the execution environment's belief of the current moment in time.
	*/
	static now() {
		return _Timestamp.fromDate(/* @__PURE__ */ new Date());
	}
	/** Convert to milliseconds since Unix epoch. */
	toMillis() {
		return this.microsSinceUnixEpoch / 1000n;
	}
	/**
	* Get a `Timestamp` representing the same point in time as `date`.
	*/
	static fromDate(date) {
		const millis = date.getTime();
		return new _Timestamp(BigInt(millis) * _Timestamp.MICROS_PER_MILLIS);
	}
	/**
	* Get a `Date` representing approximately the same point in time as `this`.
	*
	* This method truncates to millisecond precision,
	* and throws `RangeError` if the `Timestamp` is outside the range representable as a `Date`.
	*/
	toDate() {
		const millis = this.__timestamp_micros_since_unix_epoch__ / _Timestamp.MICROS_PER_MILLIS;
		if (millis > BigInt(Number.MAX_SAFE_INTEGER) || millis < BigInt(Number.MIN_SAFE_INTEGER)) throw new RangeError("Timestamp is outside of the representable range of JS's Date");
		return new Date(Number(millis));
	}
	/**
	* Get an ISO 8601 / RFC 3339 formatted string representation of this timestamp with microsecond precision.
	*
	* This method preserves the full microsecond precision of the timestamp,
	* and throws `RangeError` if the `Timestamp` is outside the range representable in ISO format.
	*
	* @returns ISO 8601 formatted string with microsecond precision (e.g., '2025-02-17T10:30:45.123456Z')
	*/
	toISOString() {
		const micros = this.__timestamp_micros_since_unix_epoch__;
		const millis = micros / _Timestamp.MICROS_PER_MILLIS;
		if (millis > BigInt(Number.MAX_SAFE_INTEGER) || millis < BigInt(Number.MIN_SAFE_INTEGER)) throw new RangeError("Timestamp is outside of the representable range for ISO string formatting");
		const isoBase = new Date(Number(millis)).toISOString();
		const microsRemainder = Math.abs(Number(micros % 1000000n));
		const fractionalPart = String(microsRemainder).padStart(6, "0");
		return isoBase.replace(/\.\d{3}Z$/, `.${fractionalPart}Z`);
	}
	since(other) {
		return new TimeDuration(this.__timestamp_micros_since_unix_epoch__ - other.__timestamp_micros_since_unix_epoch__);
	}
};
var Uuid = class _Uuid {
	__uuid__;
	/**
	* The nil UUID (all zeros).
	*
	* @example
	* ```ts
	* const uuid = Uuid.NIL;
	* console.assert(
	*   uuid.toString() === "00000000-0000-0000-0000-000000000000"
	* );
	* ```
	*/
	static NIL = new _Uuid(0n);
	static MAX_UUID_BIGINT = 340282366920938463463374607431768211455n;
	/**
	* The max UUID (all ones).
	*
	* @example
	* ```ts
	* const uuid = Uuid.MAX;
	* console.assert(
	*   uuid.toString() === "ffffffff-ffff-ffff-ffff-ffffffffffff"
	* );
	* ```
	*/
	static MAX = new _Uuid(_Uuid.MAX_UUID_BIGINT);
	/**
	* Create a UUID from a raw 128-bit value.
	*
	* @param u - Unsigned 128-bit integer
	* @throws {Error} If the value is outside the valid UUID range
	*/
	constructor(u) {
		if (u < 0n || u > _Uuid.MAX_UUID_BIGINT) throw new Error("Invalid UUID: must be between 0 and `MAX_UUID_BIGINT`");
		this.__uuid__ = u;
	}
	/**
	* Create a UUID `v4` from explicit random bytes.
	*
	* This method assumes the bytes are already sufficiently random.
	* It only sets the appropriate bits for the UUID version and variant.
	*
	* @param bytes - Exactly 16 random bytes
	* @returns A UUID `v4`
	* @throws {Error} If `bytes.length !== 16`
	*
	* @example
	* ```ts
	* const randomBytes = new Uint8Array(16);
	* const uuid = Uuid.fromRandomBytesV4(randomBytes);
	*
	* console.assert(
	*   uuid.toString() === "00000000-0000-4000-8000-000000000000"
	* );
	* ```
	*/
	static fromRandomBytesV4(bytes) {
		if (bytes.length !== 16) throw new Error("UUID v4 requires 16 bytes");
		const arr = new Uint8Array(bytes);
		arr[6] = arr[6] & 15 | 64;
		arr[8] = arr[8] & 63 | 128;
		return new _Uuid(_Uuid.bytesToBigInt(arr));
	}
	/**
	* Generate a UUID `v7` using a monotonic counter from `0` to `2^31 - 1`,
	* a timestamp, and 4 random bytes.
	*
	* The counter wraps around on overflow.
	*
	* The UUID `v7` is structured as follows:
	*
	* ```ascii
	* ┌───────────────────────────────────────────────┬───────────────────┐
	* | B0  | B1  | B2  | B3  | B4  | B5              |         B6        |
	* ├───────────────────────────────────────────────┼───────────────────┤
	* |                 unix_ts_ms                    |      version 7    |
	* └───────────────────────────────────────────────┴───────────────────┘
	* ┌──────────────┬─────────┬──────────────────┬───────────────────────┐
	* | B7           | B8      | B9  | B10 | B11  | B12 | B13 | B14 | B15 |
	* ├──────────────┼─────────┼──────────────────┼───────────────────────┤
	* | counter_high | variant |    counter_low   |        random         |
	* └──────────────┴─────────┴──────────────────┴───────────────────────┘
	* ```
	*
	* @param counter - Mutable monotonic counter (31-bit)
	* @param now - Timestamp since the Unix epoch
	* @param randomBytes - Exactly 4 random bytes
	* @returns A UUID `v7`
	*
	* @throws {Error} If the `counter` is negative
	* @throws {Error} If the `timestamp` is before the Unix epoch
	* @throws {Error} If `randomBytes.length !== 4`
	*
	* @example
	* ```ts
	* const now = Timestamp.fromMillis(1_686_000_000_000n);
	* const counter = { value: 1 };
	* const randomBytes = new Uint8Array(4);
	*
	* const uuid = Uuid.fromCounterV7(counter, now, randomBytes);
	*
	* console.assert(
	*   uuid.toString() === "0000647e-5180-7000-8000-000200000000"
	* );
	* ```
	*/
	static fromCounterV7(counter, now, randomBytes) {
		if (randomBytes.length !== 4) throw new Error("`fromCounterV7` requires `randomBytes.length == 4`");
		if (counter.value < 0) throw new Error("`fromCounterV7` uuid `counter` must be non-negative");
		if (now.__timestamp_micros_since_unix_epoch__ < 0) throw new Error("`fromCounterV7` `timestamp` before unix epoch");
		const counterVal = counter.value;
		counter.value = counterVal + 1 & 2147483647;
		const tsMs = now.toMillis() & 281474976710655n;
		const bytes = new Uint8Array(16);
		bytes[0] = Number(tsMs >> 40n & 255n);
		bytes[1] = Number(tsMs >> 32n & 255n);
		bytes[2] = Number(tsMs >> 24n & 255n);
		bytes[3] = Number(tsMs >> 16n & 255n);
		bytes[4] = Number(tsMs >> 8n & 255n);
		bytes[5] = Number(tsMs & 255n);
		bytes[7] = counterVal >>> 23 & 255;
		bytes[9] = counterVal >>> 15 & 255;
		bytes[10] = counterVal >>> 7 & 255;
		bytes[11] = (counterVal & 127) << 1 & 255;
		bytes[12] |= randomBytes[0] & 127;
		bytes[13] = randomBytes[1];
		bytes[14] = randomBytes[2];
		bytes[15] = randomBytes[3];
		bytes[6] = bytes[6] & 15 | 112;
		bytes[8] = bytes[8] & 63 | 128;
		return new _Uuid(_Uuid.bytesToBigInt(bytes));
	}
	/**
	* Parse a UUID from a string representation.
	*
	* @param s - UUID string
	* @returns Parsed UUID
	* @throws {Error} If the string is not a valid UUID
	*
	* @example
	* ```ts
	* const s = "01888d6e-5c00-7000-8000-000000000000";
	* const uuid = Uuid.parse(s);
	*
	* console.assert(uuid.toString() === s);
	* ```
	*/
	static parse(s) {
		const hex = s.replace(/-/g, "");
		if (hex.length !== 32) throw new Error("Invalid hex UUID");
		let v = 0n;
		for (let i = 0; i < 32; i += 2) v = v << 8n | BigInt(parseInt(hex.slice(i, i + 2), 16));
		return new _Uuid(v);
	}
	/** Convert to string (hyphenated form). */
	toString() {
		const hex = [..._Uuid.bigIntToBytes(this.__uuid__)].map((b) => b.toString(16).padStart(2, "0")).join("");
		return hex.slice(0, 8) + "-" + hex.slice(8, 12) + "-" + hex.slice(12, 16) + "-" + hex.slice(16, 20) + "-" + hex.slice(20);
	}
	/** Convert to bigint (u128). */
	asBigInt() {
		return this.__uuid__;
	}
	/** Return a `Uint8Array` of 16 bytes. */
	toBytes() {
		return _Uuid.bigIntToBytes(this.__uuid__);
	}
	static bytesToBigInt(bytes) {
		let result = 0n;
		for (const b of bytes) result = result << 8n | BigInt(b);
		return result;
	}
	static bigIntToBytes(value) {
		const bytes = new Uint8Array(16);
		for (let i = 15; i >= 0; i--) {
			bytes[i] = Number(value & 255n);
			value >>= 8n;
		}
		return bytes;
	}
	/**
	* Returns the version of this UUID.
	*
	* This represents the algorithm used to generate the value.
	*
	* @returns A `UuidVersion`
	* @throws {Error} If the version field is not recognized
	*/
	getVersion() {
		const version = this.toBytes()[6] >> 4 & 15;
		switch (version) {
			case 4: return "V4";
			case 7: return "V7";
			default:
				if (this == _Uuid.NIL) return "Nil";
				if (this == _Uuid.MAX) return "Max";
				throw new Error(`Unsupported UUID version: ${version}`);
		}
	}
	/**
	* Extract the monotonic counter from a UUIDv7.
	*
	* Intended for testing and diagnostics.
	* Behavior is undefined if called on a non-V7 UUID.
	*
	* @returns 31-bit counter value
	*/
	getCounter() {
		const bytes = this.toBytes();
		const high = bytes[7];
		const mid1 = bytes[9];
		const mid2 = bytes[10];
		const low = bytes[11] >>> 1;
		return high << 23 | mid1 << 15 | mid2 << 7 | low | 0;
	}
	compareTo(other) {
		if (this.__uuid__ < other.__uuid__) return -1;
		if (this.__uuid__ > other.__uuid__) return 1;
		return 0;
	}
	static getAlgebraicType() {
		return AlgebraicType.Product({ elements: [{
			name: "__uuid__",
			algebraicType: AlgebraicType.U128
		}] });
	}
};
var BinaryReader = class {
	/**
	* The DataView used to read values from the binary data.
	*
	* Note: The DataView's `byteOffset` is relative to the beginning of the
	* underlying ArrayBuffer, not the start of the provided Uint8Array input.
	* This `BinaryReader`'s `#offset` field is used to track the current read position
	* relative to the start of the provided Uint8Array input.
	*/
	view;
	/**
	* Represents the offset (in bytes) relative to the start of the DataView
	* and provided Uint8Array input.
	*
	* Note: This is *not* the absolute byte offset within the underlying ArrayBuffer.
	*/
	offset = 0;
	constructor(input) {
		this.view = input instanceof DataView ? input : new DataView(input.buffer, input.byteOffset, input.byteLength);
		this.offset = 0;
	}
	reset(view) {
		this.view = view;
		this.offset = 0;
	}
	get remaining() {
		return this.view.byteLength - this.offset;
	}
	/** Ensure we have at least `n` bytes left to read */
	#ensure(n) {
		if (this.offset + n > this.view.byteLength) throw new RangeError(`Tried to read ${n} byte(s) at relative offset ${this.offset}, but only ${this.remaining} byte(s) remain`);
	}
	readUInt8Array() {
		const length = this.readU32();
		this.#ensure(length);
		return this.readBytes(length);
	}
	readBool() {
		const value = this.view.getUint8(this.offset);
		this.offset += 1;
		return value !== 0;
	}
	readByte() {
		const value = this.view.getUint8(this.offset);
		this.offset += 1;
		return value;
	}
	readBytes(length) {
		const array = new Uint8Array(this.view.buffer, this.view.byteOffset + this.offset, length);
		this.offset += length;
		return array;
	}
	readI8() {
		const value = this.view.getInt8(this.offset);
		this.offset += 1;
		return value;
	}
	readU8() {
		return this.readByte();
	}
	readI16() {
		const value = this.view.getInt16(this.offset, true);
		this.offset += 2;
		return value;
	}
	readU16() {
		const value = this.view.getUint16(this.offset, true);
		this.offset += 2;
		return value;
	}
	readI32() {
		const value = this.view.getInt32(this.offset, true);
		this.offset += 4;
		return value;
	}
	readU32() {
		const value = this.view.getUint32(this.offset, true);
		this.offset += 4;
		return value;
	}
	readI64() {
		const value = this.view.getBigInt64(this.offset, true);
		this.offset += 8;
		return value;
	}
	readU64() {
		const value = this.view.getBigUint64(this.offset, true);
		this.offset += 8;
		return value;
	}
	readU128() {
		const lowerPart = this.view.getBigUint64(this.offset, true);
		const upperPart = this.view.getBigUint64(this.offset + 8, true);
		this.offset += 16;
		return (upperPart << BigInt(64)) + lowerPart;
	}
	readI128() {
		const lowerPart = this.view.getBigUint64(this.offset, true);
		const upperPart = this.view.getBigInt64(this.offset + 8, true);
		this.offset += 16;
		return (upperPart << BigInt(64)) + lowerPart;
	}
	readU256() {
		const p0 = this.view.getBigUint64(this.offset, true);
		const p1 = this.view.getBigUint64(this.offset + 8, true);
		const p2 = this.view.getBigUint64(this.offset + 16, true);
		const p3 = this.view.getBigUint64(this.offset + 24, true);
		this.offset += 32;
		return (p3 << BigInt(192)) + (p2 << BigInt(128)) + (p1 << BigInt(64)) + p0;
	}
	readI256() {
		const p0 = this.view.getBigUint64(this.offset, true);
		const p1 = this.view.getBigUint64(this.offset + 8, true);
		const p2 = this.view.getBigUint64(this.offset + 16, true);
		const p3 = this.view.getBigInt64(this.offset + 24, true);
		this.offset += 32;
		return (p3 << BigInt(192)) + (p2 << BigInt(128)) + (p1 << BigInt(64)) + p0;
	}
	readF32() {
		const value = this.view.getFloat32(this.offset, true);
		this.offset += 4;
		return value;
	}
	readF64() {
		const value = this.view.getFloat64(this.offset, true);
		this.offset += 8;
		return value;
	}
	readString() {
		const uint8Array = this.readUInt8Array();
		return new TextDecoder("utf-8").decode(uint8Array);
	}
};
var import_base64_js = __toESM(require_base64_js());
var ArrayBufferPrototypeTransfer = ArrayBuffer.prototype.transfer ?? function(newByteLength) {
	if (newByteLength === void 0) return this.slice();
	else if (newByteLength <= this.byteLength) return this.slice(0, newByteLength);
	else {
		const copy = new Uint8Array(newByteLength);
		copy.set(new Uint8Array(this));
		return copy.buffer;
	}
};
var ResizableBuffer = class {
	buffer;
	view;
	constructor(init) {
		this.buffer = typeof init === "number" ? new ArrayBuffer(init) : init;
		this.view = new DataView(this.buffer);
	}
	get capacity() {
		return this.buffer.byteLength;
	}
	grow(newSize) {
		if (newSize <= this.buffer.byteLength) return;
		this.buffer = ArrayBufferPrototypeTransfer.call(this.buffer, newSize);
		this.view = new DataView(this.buffer);
	}
};
var BinaryWriter = class {
	buffer;
	offset = 0;
	constructor(init) {
		this.buffer = typeof init === "number" ? new ResizableBuffer(init) : init;
	}
	reset(buffer) {
		this.buffer = buffer;
		this.offset = 0;
	}
	expandBuffer(additionalCapacity) {
		const minCapacity = this.offset + additionalCapacity + 1;
		if (minCapacity <= this.buffer.capacity) return;
		let newCapacity = this.buffer.capacity * 2;
		if (newCapacity < minCapacity) newCapacity = minCapacity;
		this.buffer.grow(newCapacity);
	}
	toBase64() {
		return (0, import_base64_js.fromByteArray)(this.getBuffer());
	}
	getBuffer() {
		return new Uint8Array(this.buffer.buffer, 0, this.offset);
	}
	get view() {
		return this.buffer.view;
	}
	writeUInt8Array(value) {
		const length = value.length;
		this.expandBuffer(4 + length);
		this.writeU32(length);
		new Uint8Array(this.buffer.buffer, this.offset).set(value);
		this.offset += length;
	}
	writeBool(value) {
		this.expandBuffer(1);
		this.view.setUint8(this.offset, value ? 1 : 0);
		this.offset += 1;
	}
	writeByte(value) {
		this.expandBuffer(1);
		this.view.setUint8(this.offset, value);
		this.offset += 1;
	}
	writeI8(value) {
		this.expandBuffer(1);
		this.view.setInt8(this.offset, value);
		this.offset += 1;
	}
	writeU8(value) {
		this.expandBuffer(1);
		this.view.setUint8(this.offset, value);
		this.offset += 1;
	}
	writeI16(value) {
		this.expandBuffer(2);
		this.view.setInt16(this.offset, value, true);
		this.offset += 2;
	}
	writeU16(value) {
		this.expandBuffer(2);
		this.view.setUint16(this.offset, value, true);
		this.offset += 2;
	}
	writeI32(value) {
		this.expandBuffer(4);
		this.view.setInt32(this.offset, value, true);
		this.offset += 4;
	}
	writeU32(value) {
		this.expandBuffer(4);
		this.view.setUint32(this.offset, value, true);
		this.offset += 4;
	}
	writeI64(value) {
		this.expandBuffer(8);
		this.view.setBigInt64(this.offset, value, true);
		this.offset += 8;
	}
	writeU64(value) {
		this.expandBuffer(8);
		this.view.setBigUint64(this.offset, value, true);
		this.offset += 8;
	}
	writeU128(value) {
		this.expandBuffer(16);
		const lowerPart = value & BigInt("0xFFFFFFFFFFFFFFFF");
		const upperPart = value >> BigInt(64);
		this.view.setBigUint64(this.offset, lowerPart, true);
		this.view.setBigUint64(this.offset + 8, upperPart, true);
		this.offset += 16;
	}
	writeI128(value) {
		this.expandBuffer(16);
		const lowerPart = value & BigInt("0xFFFFFFFFFFFFFFFF");
		const upperPart = value >> BigInt(64);
		this.view.setBigInt64(this.offset, lowerPart, true);
		this.view.setBigInt64(this.offset + 8, upperPart, true);
		this.offset += 16;
	}
	writeU256(value) {
		this.expandBuffer(32);
		const low_64_mask = BigInt("0xFFFFFFFFFFFFFFFF");
		const p0 = value & low_64_mask;
		const p1 = value >> BigInt(64) & low_64_mask;
		const p2 = value >> BigInt(128) & low_64_mask;
		const p3 = value >> BigInt(192);
		this.view.setBigUint64(this.offset + 0, p0, true);
		this.view.setBigUint64(this.offset + 8, p1, true);
		this.view.setBigUint64(this.offset + 16, p2, true);
		this.view.setBigUint64(this.offset + 24, p3, true);
		this.offset += 32;
	}
	writeI256(value) {
		this.expandBuffer(32);
		const low_64_mask = BigInt("0xFFFFFFFFFFFFFFFF");
		const p0 = value & low_64_mask;
		const p1 = value >> BigInt(64) & low_64_mask;
		const p2 = value >> BigInt(128) & low_64_mask;
		const p3 = value >> BigInt(192);
		this.view.setBigUint64(this.offset + 0, p0, true);
		this.view.setBigUint64(this.offset + 8, p1, true);
		this.view.setBigUint64(this.offset + 16, p2, true);
		this.view.setBigInt64(this.offset + 24, p3, true);
		this.offset += 32;
	}
	writeF32(value) {
		this.expandBuffer(4);
		this.view.setFloat32(this.offset, value, true);
		this.offset += 4;
	}
	writeF64(value) {
		this.expandBuffer(8);
		this.view.setFloat64(this.offset, value, true);
		this.offset += 8;
	}
	writeString(value) {
		const encodedString = new TextEncoder().encode(value);
		this.writeUInt8Array(encodedString);
	}
};
function toPascalCase(s) {
	const str = s.replace(/([-_][a-z])/gi, ($1) => {
		return $1.toUpperCase().replace("-", "").replace("_", "");
	});
	return str.charAt(0).toUpperCase() + str.slice(1);
}
function uint8ArrayToHexString(array) {
	return Array.prototype.map.call(array.reverse(), (x) => ("00" + x.toString(16)).slice(-2)).join("");
}
function uint8ArrayToU128(array) {
	if (array.length != 16) throw new Error(`Uint8Array is not 16 bytes long: ${array}`);
	return new BinaryReader(array).readU128();
}
function uint8ArrayToU256(array) {
	if (array.length != 32) throw new Error(`Uint8Array is not 32 bytes long: [${array}]`);
	return new BinaryReader(array).readU256();
}
function hexStringToUint8Array(str) {
	if (str.startsWith("0x")) str = str.slice(2);
	const matches = str.match(/.{1,2}/g) || [];
	return Uint8Array.from(matches.map((byte) => parseInt(byte, 16))).reverse();
}
function hexStringToU128(str) {
	return uint8ArrayToU128(hexStringToUint8Array(str));
}
function hexStringToU256(str) {
	return uint8ArrayToU256(hexStringToUint8Array(str));
}
function u128ToUint8Array(data) {
	const writer = new BinaryWriter(16);
	writer.writeU128(data);
	return writer.getBuffer();
}
function u128ToHexString(data) {
	return uint8ArrayToHexString(u128ToUint8Array(data));
}
function u256ToUint8Array(data) {
	const writer = new BinaryWriter(32);
	writer.writeU256(data);
	return writer.getBuffer();
}
function u256ToHexString(data) {
	return uint8ArrayToHexString(u256ToUint8Array(data));
}
function bsatnBaseSize(typespace, ty) {
	const assumedArrayLength = 4;
	while (ty.tag === "Ref") ty = typespace.types[ty.value];
	if (ty.tag === "Product") {
		let sum = 0;
		for (const { algebraicType: elem } of ty.value.elements) sum += bsatnBaseSize(typespace, elem);
		return sum;
	} else if (ty.tag === "Sum") {
		let min = Infinity;
		for (const { algebraicType: vari } of ty.value.variants) {
			const vSize = bsatnBaseSize(typespace, vari);
			if (vSize < min) min = vSize;
		}
		if (min === Infinity) min = 0;
		return 4 + min;
	} else if (ty.tag == "Array") return 4 + assumedArrayLength * bsatnBaseSize(typespace, ty.value);
	return {
		String: 4 + assumedArrayLength,
		Sum: 1,
		Bool: 1,
		I8: 1,
		U8: 1,
		I16: 2,
		U16: 2,
		I32: 4,
		U32: 4,
		F32: 4,
		I64: 8,
		U64: 8,
		F64: 8,
		I128: 16,
		U128: 16,
		I256: 32,
		U256: 32
	}[ty.tag];
}
var hasOwn = Object.hasOwn;
var ConnectionId = class _ConnectionId {
	__connection_id__;
	/**
	* Creates a new `ConnectionId`.
	*/
	constructor(data) {
		this.__connection_id__ = data;
	}
	/**
	* Get the algebraic type representation of the {@link ConnectionId} type.
	* @returns The algebraic type representation of the type.
	*/
	static getAlgebraicType() {
		return AlgebraicType.Product({ elements: [{
			name: "__connection_id__",
			algebraicType: AlgebraicType.U128
		}] });
	}
	isZero() {
		return this.__connection_id__ === BigInt(0);
	}
	static nullIfZero(addr) {
		if (addr.isZero()) return null;
		else return addr;
	}
	static random() {
		function randomU8() {
			return Math.floor(Math.random() * 255);
		}
		let result = BigInt(0);
		for (let i = 0; i < 16; i++) result = result << BigInt(8) | BigInt(randomU8());
		return new _ConnectionId(result);
	}
	/**
	* Compare two connection IDs for equality.
	*/
	isEqual(other) {
		return this.__connection_id__ == other.__connection_id__;
	}
	/**
	* Check if two connection IDs are equal.
	*/
	equals(other) {
		return this.isEqual(other);
	}
	/**
	* Print the connection ID as a hexadecimal string.
	*/
	toHexString() {
		return u128ToHexString(this.__connection_id__);
	}
	/**
	* Convert the connection ID to a Uint8Array.
	*/
	toUint8Array() {
		return u128ToUint8Array(this.__connection_id__);
	}
	/**
	* Parse a connection ID from a hexadecimal string.
	*/
	static fromString(str) {
		return new _ConnectionId(hexStringToU128(str));
	}
	static fromStringOrNull(str) {
		const addr = _ConnectionId.fromString(str);
		if (addr.isZero()) return null;
		else return addr;
	}
};
var Identity = class _Identity {
	__identity__;
	/**
	* Creates a new `Identity`.
	*
	* `data` can be a hexadecimal string or a `bigint`.
	*/
	constructor(data) {
		this.__identity__ = typeof data === "string" ? hexStringToU256(data) : data;
	}
	/**
	* Get the algebraic type representation of the {@link Identity} type.
	* @returns The algebraic type representation of the type.
	*/
	static getAlgebraicType() {
		return AlgebraicType.Product({ elements: [{
			name: "__identity__",
			algebraicType: AlgebraicType.U256
		}] });
	}
	/**
	* Check if two identities are equal.
	*/
	isEqual(other) {
		return this.toHexString() === other.toHexString();
	}
	/**
	* Check if two identities are equal.
	*/
	equals(other) {
		return this.isEqual(other);
	}
	/**
	* Print the identity as a hexadecimal string.
	*/
	toHexString() {
		return u256ToHexString(this.__identity__);
	}
	/**
	* Convert the address to a Uint8Array.
	*/
	toUint8Array() {
		return u256ToUint8Array(this.__identity__);
	}
	/**
	* Parse an Identity from a hexadecimal string.
	*/
	static fromString(str) {
		return new _Identity(str);
	}
	/**
	* Zero identity (0x0000000000000000000000000000000000000000000000000000000000000000)
	*/
	static zero() {
		return new _Identity(0n);
	}
	toString() {
		return this.toHexString();
	}
};
var SERIALIZERS = /* @__PURE__ */ new Map();
var DESERIALIZERS = /* @__PURE__ */ new Map();
var AlgebraicType = {
	Ref: (value) => ({
		tag: "Ref",
		value
	}),
	Sum: (value) => ({
		tag: "Sum",
		value
	}),
	Product: (value) => ({
		tag: "Product",
		value
	}),
	Array: (value) => ({
		tag: "Array",
		value
	}),
	String: { tag: "String" },
	Bool: { tag: "Bool" },
	I8: { tag: "I8" },
	U8: { tag: "U8" },
	I16: { tag: "I16" },
	U16: { tag: "U16" },
	I32: { tag: "I32" },
	U32: { tag: "U32" },
	I64: { tag: "I64" },
	U64: { tag: "U64" },
	I128: { tag: "I128" },
	U128: { tag: "U128" },
	I256: { tag: "I256" },
	U256: { tag: "U256" },
	F32: { tag: "F32" },
	F64: { tag: "F64" },
	makeSerializer(ty, typespace) {
		if (ty.tag === "Ref") {
			if (!typespace) throw new Error("cannot serialize refs without a typespace");
			while (ty.tag === "Ref") ty = typespace.types[ty.value];
		}
		switch (ty.tag) {
			case "Product": return ProductType.makeSerializer(ty.value, typespace);
			case "Sum": return SumType.makeSerializer(ty.value, typespace);
			case "Array": if (ty.value.tag === "U8") return serializeUint8Array;
			else {
				const serialize = AlgebraicType.makeSerializer(ty.value, typespace);
				return (writer, value) => {
					writer.writeU32(value.length);
					for (const elem of value) serialize(writer, elem);
				};
			}
			default: return primitiveSerializers[ty.tag];
		}
	},
	serializeValue(writer, ty, value, typespace) {
		AlgebraicType.makeSerializer(ty, typespace)(writer, value);
	},
	makeDeserializer(ty, typespace) {
		if (ty.tag === "Ref") {
			if (!typespace) throw new Error("cannot deserialize refs without a typespace");
			while (ty.tag === "Ref") ty = typespace.types[ty.value];
		}
		switch (ty.tag) {
			case "Product": return ProductType.makeDeserializer(ty.value, typespace);
			case "Sum": return SumType.makeDeserializer(ty.value, typespace);
			case "Array": if (ty.value.tag === "U8") return deserializeUint8Array;
			else {
				const deserialize = AlgebraicType.makeDeserializer(ty.value, typespace);
				return (reader) => {
					const length = reader.readU32();
					const result = Array(length);
					for (let i = 0; i < length; i++) result[i] = deserialize(reader);
					return result;
				};
			}
			default: return primitiveDeserializers[ty.tag];
		}
	},
	deserializeValue(reader, ty, typespace) {
		return AlgebraicType.makeDeserializer(ty, typespace)(reader);
	},
	intoMapKey: function(ty, value) {
		switch (ty.tag) {
			case "U8":
			case "U16":
			case "U32":
			case "U64":
			case "U128":
			case "U256":
			case "I8":
			case "I16":
			case "I32":
			case "I64":
			case "I128":
			case "I256":
			case "F32":
			case "F64":
			case "String":
			case "Bool": return value;
			case "Product": return ProductType.intoMapKey(ty.value, value);
			default: {
				const writer = new BinaryWriter(10);
				AlgebraicType.serializeValue(writer, ty, value);
				return writer.toBase64();
			}
		}
	}
};
function bindCall(f) {
	return Function.prototype.call.bind(f);
}
var primitiveSerializers = {
	Bool: bindCall(BinaryWriter.prototype.writeBool),
	I8: bindCall(BinaryWriter.prototype.writeI8),
	U8: bindCall(BinaryWriter.prototype.writeU8),
	I16: bindCall(BinaryWriter.prototype.writeI16),
	U16: bindCall(BinaryWriter.prototype.writeU16),
	I32: bindCall(BinaryWriter.prototype.writeI32),
	U32: bindCall(BinaryWriter.prototype.writeU32),
	I64: bindCall(BinaryWriter.prototype.writeI64),
	U64: bindCall(BinaryWriter.prototype.writeU64),
	I128: bindCall(BinaryWriter.prototype.writeI128),
	U128: bindCall(BinaryWriter.prototype.writeU128),
	I256: bindCall(BinaryWriter.prototype.writeI256),
	U256: bindCall(BinaryWriter.prototype.writeU256),
	F32: bindCall(BinaryWriter.prototype.writeF32),
	F64: bindCall(BinaryWriter.prototype.writeF64),
	String: bindCall(BinaryWriter.prototype.writeString)
};
Object.freeze(primitiveSerializers);
var serializeUint8Array = bindCall(BinaryWriter.prototype.writeUInt8Array);
var primitiveDeserializers = {
	Bool: bindCall(BinaryReader.prototype.readBool),
	I8: bindCall(BinaryReader.prototype.readI8),
	U8: bindCall(BinaryReader.prototype.readU8),
	I16: bindCall(BinaryReader.prototype.readI16),
	U16: bindCall(BinaryReader.prototype.readU16),
	I32: bindCall(BinaryReader.prototype.readI32),
	U32: bindCall(BinaryReader.prototype.readU32),
	I64: bindCall(BinaryReader.prototype.readI64),
	U64: bindCall(BinaryReader.prototype.readU64),
	I128: bindCall(BinaryReader.prototype.readI128),
	U128: bindCall(BinaryReader.prototype.readU128),
	I256: bindCall(BinaryReader.prototype.readI256),
	U256: bindCall(BinaryReader.prototype.readU256),
	F32: bindCall(BinaryReader.prototype.readF32),
	F64: bindCall(BinaryReader.prototype.readF64),
	String: bindCall(BinaryReader.prototype.readString)
};
Object.freeze(primitiveDeserializers);
var deserializeUint8Array = bindCall(BinaryReader.prototype.readUInt8Array);
var primitiveSizes = {
	Bool: 1,
	I8: 1,
	U8: 1,
	I16: 2,
	U16: 2,
	I32: 4,
	U32: 4,
	I64: 8,
	U64: 8,
	I128: 16,
	U128: 16,
	I256: 32,
	U256: 32,
	F32: 4,
	F64: 8
};
var fixedSizePrimitives = new Set(Object.keys(primitiveSizes));
var isFixedSizeProduct = (ty) => ty.elements.every(({ algebraicType }) => fixedSizePrimitives.has(algebraicType.tag));
var productSize = (ty) => ty.elements.reduce((acc, { algebraicType }) => acc + primitiveSizes[algebraicType.tag], 0);
var primitiveJSName = {
	Bool: "Uint8",
	I8: "Int8",
	U8: "Uint8",
	I16: "Int16",
	U16: "Uint16",
	I32: "Int32",
	U32: "Uint32",
	I64: "BigInt64",
	U64: "BigUint64",
	F32: "Float32",
	F64: "Float64"
};
var specialProductDeserializers = {
	__time_duration_micros__: (reader) => new TimeDuration(reader.readI64()),
	__timestamp_micros_since_unix_epoch__: (reader) => new Timestamp(reader.readI64()),
	__identity__: (reader) => new Identity(reader.readU256()),
	__connection_id__: (reader) => new ConnectionId(reader.readU128()),
	__uuid__: (reader) => new Uuid(reader.readU128())
};
Object.freeze(specialProductDeserializers);
var unitDeserializer = () => ({});
var getElementInitializer = (element) => {
	let init;
	switch (element.algebraicType.tag) {
		case "String":
			init = "''";
			break;
		case "Bool":
			init = "false";
			break;
		case "I8":
		case "U8":
		case "I16":
		case "U16":
		case "I32":
		case "U32":
			init = "0";
			break;
		case "I64":
		case "U64":
		case "I128":
		case "U128":
		case "I256":
		case "U256":
			init = "0n";
			break;
		case "F32":
		case "F64":
			init = "0.0";
			break;
		default: init = "undefined";
	}
	return `${element.name}: ${init}`;
};
var ProductType = {
	makeSerializer(ty, typespace) {
		let serializer = SERIALIZERS.get(ty);
		if (serializer != null) return serializer;
		if (isFixedSizeProduct(ty)) {
			const body2 = `"use strict";
writer.expandBuffer(${productSize(ty)});
const view = writer.view;
${ty.elements.map(({ name, algebraicType: { tag } }) => tag in primitiveJSName ? `view.set${primitiveJSName[tag]}(writer.offset, value.${name}, ${primitiveSizes[tag] > 1 ? "true" : ""});
writer.offset += ${primitiveSizes[tag]};` : `writer.write${tag}(value.${name});`).join("\n")}`;
			serializer = Function("writer", "value", body2);
			SERIALIZERS.set(ty, serializer);
			return serializer;
		}
		const serializers = {};
		const body = "\"use strict\";\n" + ty.elements.map((element) => `this.${element.name}(writer, value.${element.name});`).join("\n");
		serializer = Function("writer", "value", body).bind(serializers);
		SERIALIZERS.set(ty, serializer);
		for (const { name, algebraicType } of ty.elements) serializers[name] = AlgebraicType.makeSerializer(algebraicType, typespace);
		Object.freeze(serializers);
		return serializer;
	},
	serializeValue(writer, ty, value, typespace) {
		ProductType.makeSerializer(ty, typespace)(writer, value);
	},
	makeDeserializer(ty, typespace) {
		switch (ty.elements.length) {
			case 0: return unitDeserializer;
			case 1: {
				const fieldName = ty.elements[0].name;
				if (hasOwn(specialProductDeserializers, fieldName)) return specialProductDeserializers[fieldName];
			}
		}
		let deserializer = DESERIALIZERS.get(ty);
		if (deserializer != null) return deserializer;
		if (isFixedSizeProduct(ty)) {
			const body = `"use strict";
const result = { ${ty.elements.map(getElementInitializer).join(", ")} };
const view = reader.view;
${ty.elements.map(({ name, algebraicType: { tag } }) => tag in primitiveJSName ? `result.${name} = view.get${primitiveJSName[tag]}(reader.offset, ${primitiveSizes[tag] > 1 ? "true" : ""});
reader.offset += ${primitiveSizes[tag]};` : `result.${name} = reader.read${tag}();`).join("\n")}
return result;`;
			deserializer = Function("reader", body);
			DESERIALIZERS.set(ty, deserializer);
			return deserializer;
		}
		const deserializers = {};
		deserializer = Function("reader", `"use strict";
const result = { ${ty.elements.map(getElementInitializer).join(", ")} };
${ty.elements.map(({ name }) => `result.${name} = this.${name}(reader);`).join("\n")}
return result;`).bind(deserializers);
		DESERIALIZERS.set(ty, deserializer);
		for (const { name, algebraicType } of ty.elements) deserializers[name] = AlgebraicType.makeDeserializer(algebraicType, typespace);
		Object.freeze(deserializers);
		return deserializer;
	},
	deserializeValue(reader, ty, typespace) {
		return ProductType.makeDeserializer(ty, typespace)(reader);
	},
	intoMapKey(ty, value) {
		if (ty.elements.length === 1) {
			const fieldName = ty.elements[0].name;
			if (hasOwn(specialProductDeserializers, fieldName)) return value[fieldName];
		}
		const writer = new BinaryWriter(10);
		AlgebraicType.serializeValue(writer, AlgebraicType.Product(ty), value);
		return writer.toBase64();
	}
};
var SumType = {
	makeSerializer(ty, typespace) {
		if (ty.variants.length == 2 && ty.variants[0].name === "some" && ty.variants[1].name === "none") {
			const serialize = AlgebraicType.makeSerializer(ty.variants[0].algebraicType, typespace);
			return (writer, value) => {
				if (value !== null && value !== void 0) {
					writer.writeByte(0);
					serialize(writer, value);
				} else writer.writeByte(1);
			};
		} else if (ty.variants.length == 2 && ty.variants[0].name === "ok" && ty.variants[1].name === "err") {
			const serializeOk = AlgebraicType.makeSerializer(ty.variants[0].algebraicType, typespace);
			const serializeErr = AlgebraicType.makeSerializer(ty.variants[0].algebraicType, typespace);
			return (writer, value) => {
				if ("ok" in value) {
					writer.writeU8(0);
					serializeOk(writer, value.ok);
				} else if ("err" in value) {
					writer.writeU8(1);
					serializeErr(writer, value.err);
				} else throw new TypeError("could not serialize result: object had neither a `ok` nor an `err` field");
			};
		} else {
			let serializer = SERIALIZERS.get(ty);
			if (serializer != null) return serializer;
			const serializers = {};
			const body = `switch (value.tag) {
${ty.variants.map(({ name }, i) => `  case ${JSON.stringify(name)}:
    writer.writeByte(${i});
    return this.${name}(writer, value.value);`).join("\n")}
  default:
    throw new TypeError(
      \`Could not serialize sum type; unknown tag \${value.tag}\`
    )
}
`;
			serializer = Function("writer", "value", body).bind(serializers);
			SERIALIZERS.set(ty, serializer);
			for (const { name, algebraicType } of ty.variants) serializers[name] = AlgebraicType.makeSerializer(algebraicType, typespace);
			Object.freeze(serializers);
			return serializer;
		}
	},
	serializeValue(writer, ty, value, typespace) {
		SumType.makeSerializer(ty, typespace)(writer, value);
	},
	makeDeserializer(ty, typespace) {
		if (ty.variants.length == 2 && ty.variants[0].name === "some" && ty.variants[1].name === "none") {
			const deserialize = AlgebraicType.makeDeserializer(ty.variants[0].algebraicType, typespace);
			return (reader) => {
				const tag = reader.readU8();
				if (tag === 0) return deserialize(reader);
				else if (tag === 1) return;
				else throw `Can't deserialize an option type, couldn't find ${tag} tag`;
			};
		} else if (ty.variants.length == 2 && ty.variants[0].name === "ok" && ty.variants[1].name === "err") {
			const deserializeOk = AlgebraicType.makeDeserializer(ty.variants[0].algebraicType, typespace);
			const deserializeErr = AlgebraicType.makeDeserializer(ty.variants[1].algebraicType, typespace);
			return (reader) => {
				const tag = reader.readByte();
				if (tag === 0) return { ok: deserializeOk(reader) };
				else if (tag === 1) return { err: deserializeErr(reader) };
				else throw `Can't deserialize a result type, couldn't find ${tag} tag`;
			};
		} else {
			let deserializer = DESERIALIZERS.get(ty);
			if (deserializer != null) return deserializer;
			const deserializers = {};
			deserializer = Function("reader", `switch (reader.readU8()) {
${ty.variants.map(({ name }, i) => `case ${i}: return { tag: ${JSON.stringify(name)}, value: this.${name}(reader) };`).join("\n")} }`).bind(deserializers);
			DESERIALIZERS.set(ty, deserializer);
			for (const { name, algebraicType } of ty.variants) deserializers[name] = AlgebraicType.makeDeserializer(algebraicType, typespace);
			Object.freeze(deserializers);
			return deserializer;
		}
	},
	deserializeValue(reader, ty, typespace) {
		return SumType.makeDeserializer(ty, typespace)(reader);
	}
};
var Option = { getAlgebraicType(innerType) {
	return AlgebraicType.Sum({ variants: [{
		name: "some",
		algebraicType: innerType
	}, {
		name: "none",
		algebraicType: AlgebraicType.Product({ elements: [] })
	}] });
} };
var Result = { getAlgebraicType(okType, errType) {
	return AlgebraicType.Sum({ variants: [{
		name: "ok",
		algebraicType: okType
	}, {
		name: "err",
		algebraicType: errType
	}] });
} };
var ScheduleAt = {
	interval(value) {
		return Interval(value);
	},
	time(value) {
		return Time(value);
	},
	getAlgebraicType() {
		return AlgebraicType.Sum({ variants: [{
			name: "Interval",
			algebraicType: TimeDuration.getAlgebraicType()
		}, {
			name: "Time",
			algebraicType: Timestamp.getAlgebraicType()
		}] });
	},
	isScheduleAt(algebraicType) {
		if (algebraicType.tag !== "Sum") return false;
		const variants = algebraicType.value.variants;
		if (variants.length !== 2) return false;
		const intervalVariant = variants.find((v) => v.name === "Interval");
		const timeVariant = variants.find((v) => v.name === "Time");
		if (!intervalVariant || !timeVariant) return false;
		return TimeDuration.isTimeDuration(intervalVariant.algebraicType) && Timestamp.isTimestamp(timeVariant.algebraicType);
	}
};
var Interval = (micros) => ({
	tag: "Interval",
	value: new TimeDuration(micros)
});
var Time = (microsSinceUnixEpoch) => ({
	tag: "Time",
	value: new Timestamp(microsSinceUnixEpoch)
});
var schedule_at_default = ScheduleAt;
function set(x, t2) {
	return {
		...x,
		...t2
	};
}
var TypeBuilder = class {
	/**
	* The TypeScript phantom type. This is not stored at runtime,
	* but is visible to the compiler
	*/
	type;
	/**
	* The SpacetimeDB algebraic type (run‑time value). In addition to storing
	* the runtime representation of the `AlgebraicType`, it also captures
	* the TypeScript type information of the `AlgebraicType`. That is to say
	* the value is not merely an `AlgebraicType`, but is constructed to be
	* the corresponding concrete `AlgebraicType` for the TypeScript type `Type`.
	*
	* e.g. `string` corresponds to `AlgebraicType.String`
	*/
	algebraicType;
	constructor(algebraicType) {
		this.algebraicType = algebraicType;
	}
	optional() {
		return new OptionBuilder(this);
	}
	serialize(writer, value) {
		(this.serialize = AlgebraicType.makeSerializer(this.algebraicType))(writer, value);
	}
	deserialize(reader) {
		return (this.deserialize = AlgebraicType.makeDeserializer(this.algebraicType))(reader);
	}
};
var U8Builder = class extends TypeBuilder {
	constructor() {
		super(AlgebraicType.U8);
	}
	index(algorithm = "btree") {
		return new U8ColumnBuilder(this, set(defaultMetadata, { indexType: algorithm }));
	}
	unique() {
		return new U8ColumnBuilder(this, set(defaultMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new U8ColumnBuilder(this, set(defaultMetadata, { isPrimaryKey: true }));
	}
	autoInc() {
		return new U8ColumnBuilder(this, set(defaultMetadata, { isAutoIncrement: true }));
	}
	default(value) {
		return new U8ColumnBuilder(this, set(defaultMetadata, { defaultValue: value }));
	}
	name(name) {
		return new U8ColumnBuilder(this, set(defaultMetadata, { name }));
	}
};
var U16Builder = class extends TypeBuilder {
	constructor() {
		super(AlgebraicType.U16);
	}
	index(algorithm = "btree") {
		return new U16ColumnBuilder(this, set(defaultMetadata, { indexType: algorithm }));
	}
	unique() {
		return new U16ColumnBuilder(this, set(defaultMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new U16ColumnBuilder(this, set(defaultMetadata, { isPrimaryKey: true }));
	}
	autoInc() {
		return new U16ColumnBuilder(this, set(defaultMetadata, { isAutoIncrement: true }));
	}
	default(value) {
		return new U16ColumnBuilder(this, set(defaultMetadata, { defaultValue: value }));
	}
	name(name) {
		return new U16ColumnBuilder(this, set(defaultMetadata, { name }));
	}
};
var U32Builder = class extends TypeBuilder {
	constructor() {
		super(AlgebraicType.U32);
	}
	index(algorithm = "btree") {
		return new U32ColumnBuilder(this, set(defaultMetadata, { indexType: algorithm }));
	}
	unique() {
		return new U32ColumnBuilder(this, set(defaultMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new U32ColumnBuilder(this, set(defaultMetadata, { isPrimaryKey: true }));
	}
	autoInc() {
		return new U32ColumnBuilder(this, set(defaultMetadata, { isAutoIncrement: true }));
	}
	default(value) {
		return new U32ColumnBuilder(this, set(defaultMetadata, { defaultValue: value }));
	}
	name(name) {
		return new U32ColumnBuilder(this, set(defaultMetadata, { name }));
	}
};
var U64Builder = class extends TypeBuilder {
	constructor() {
		super(AlgebraicType.U64);
	}
	index(algorithm = "btree") {
		return new U64ColumnBuilder(this, set(defaultMetadata, { indexType: algorithm }));
	}
	unique() {
		return new U64ColumnBuilder(this, set(defaultMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new U64ColumnBuilder(this, set(defaultMetadata, { isPrimaryKey: true }));
	}
	autoInc() {
		return new U64ColumnBuilder(this, set(defaultMetadata, { isAutoIncrement: true }));
	}
	default(value) {
		return new U64ColumnBuilder(this, set(defaultMetadata, { defaultValue: value }));
	}
	name(name) {
		return new U64ColumnBuilder(this, set(defaultMetadata, { name }));
	}
};
var U128Builder = class extends TypeBuilder {
	constructor() {
		super(AlgebraicType.U128);
	}
	index(algorithm = "btree") {
		return new U128ColumnBuilder(this, set(defaultMetadata, { indexType: algorithm }));
	}
	unique() {
		return new U128ColumnBuilder(this, set(defaultMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new U128ColumnBuilder(this, set(defaultMetadata, { isPrimaryKey: true }));
	}
	autoInc() {
		return new U128ColumnBuilder(this, set(defaultMetadata, { isAutoIncrement: true }));
	}
	default(value) {
		return new U128ColumnBuilder(this, set(defaultMetadata, { defaultValue: value }));
	}
	name(name) {
		return new U128ColumnBuilder(this, set(defaultMetadata, { name }));
	}
};
var U256Builder = class extends TypeBuilder {
	constructor() {
		super(AlgebraicType.U256);
	}
	index(algorithm = "btree") {
		return new U256ColumnBuilder(this, set(defaultMetadata, { indexType: algorithm }));
	}
	unique() {
		return new U256ColumnBuilder(this, set(defaultMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new U256ColumnBuilder(this, set(defaultMetadata, { isPrimaryKey: true }));
	}
	autoInc() {
		return new U256ColumnBuilder(this, set(defaultMetadata, { isAutoIncrement: true }));
	}
	default(value) {
		return new U256ColumnBuilder(this, set(defaultMetadata, { defaultValue: value }));
	}
	name(name) {
		return new U256ColumnBuilder(this, set(defaultMetadata, { name }));
	}
};
var I8Builder = class extends TypeBuilder {
	constructor() {
		super(AlgebraicType.I8);
	}
	index(algorithm = "btree") {
		return new I8ColumnBuilder(this, set(defaultMetadata, { indexType: algorithm }));
	}
	unique() {
		return new I8ColumnBuilder(this, set(defaultMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new I8ColumnBuilder(this, set(defaultMetadata, { isPrimaryKey: true }));
	}
	autoInc() {
		return new I8ColumnBuilder(this, set(defaultMetadata, { isAutoIncrement: true }));
	}
	default(value) {
		return new I8ColumnBuilder(this, set(defaultMetadata, { defaultValue: value }));
	}
	name(name) {
		return new I8ColumnBuilder(this, set(defaultMetadata, { name }));
	}
};
var I16Builder = class extends TypeBuilder {
	constructor() {
		super(AlgebraicType.I16);
	}
	index(algorithm = "btree") {
		return new I16ColumnBuilder(this, set(defaultMetadata, { indexType: algorithm }));
	}
	unique() {
		return new I16ColumnBuilder(this, set(defaultMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new I16ColumnBuilder(this, set(defaultMetadata, { isPrimaryKey: true }));
	}
	autoInc() {
		return new I16ColumnBuilder(this, set(defaultMetadata, { isAutoIncrement: true }));
	}
	default(value) {
		return new I16ColumnBuilder(this, set(defaultMetadata, { defaultValue: value }));
	}
	name(name) {
		return new I16ColumnBuilder(this, set(defaultMetadata, { name }));
	}
};
var I32Builder = class extends TypeBuilder {
	constructor() {
		super(AlgebraicType.I32);
	}
	index(algorithm = "btree") {
		return new I32ColumnBuilder(this, set(defaultMetadata, { indexType: algorithm }));
	}
	unique() {
		return new I32ColumnBuilder(this, set(defaultMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new I32ColumnBuilder(this, set(defaultMetadata, { isPrimaryKey: true }));
	}
	autoInc() {
		return new I32ColumnBuilder(this, set(defaultMetadata, { isAutoIncrement: true }));
	}
	default(value) {
		return new I32ColumnBuilder(this, set(defaultMetadata, { defaultValue: value }));
	}
	name(name) {
		return new I32ColumnBuilder(this, set(defaultMetadata, { name }));
	}
};
var I64Builder = class extends TypeBuilder {
	constructor() {
		super(AlgebraicType.I64);
	}
	index(algorithm = "btree") {
		return new I64ColumnBuilder(this, set(defaultMetadata, { indexType: algorithm }));
	}
	unique() {
		return new I64ColumnBuilder(this, set(defaultMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new I64ColumnBuilder(this, set(defaultMetadata, { isPrimaryKey: true }));
	}
	autoInc() {
		return new I64ColumnBuilder(this, set(defaultMetadata, { isAutoIncrement: true }));
	}
	default(value) {
		return new I64ColumnBuilder(this, set(defaultMetadata, { defaultValue: value }));
	}
	name(name) {
		return new I64ColumnBuilder(this, set(defaultMetadata, { name }));
	}
};
var I128Builder = class extends TypeBuilder {
	constructor() {
		super(AlgebraicType.I128);
	}
	index(algorithm = "btree") {
		return new I128ColumnBuilder(this, set(defaultMetadata, { indexType: algorithm }));
	}
	unique() {
		return new I128ColumnBuilder(this, set(defaultMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new I128ColumnBuilder(this, set(defaultMetadata, { isPrimaryKey: true }));
	}
	autoInc() {
		return new I128ColumnBuilder(this, set(defaultMetadata, { isAutoIncrement: true }));
	}
	default(value) {
		return new I128ColumnBuilder(this, set(defaultMetadata, { defaultValue: value }));
	}
	name(name) {
		return new I128ColumnBuilder(this, set(defaultMetadata, { name }));
	}
};
var I256Builder = class extends TypeBuilder {
	constructor() {
		super(AlgebraicType.I256);
	}
	index(algorithm = "btree") {
		return new I256ColumnBuilder(this, set(defaultMetadata, { indexType: algorithm }));
	}
	unique() {
		return new I256ColumnBuilder(this, set(defaultMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new I256ColumnBuilder(this, set(defaultMetadata, { isPrimaryKey: true }));
	}
	autoInc() {
		return new I256ColumnBuilder(this, set(defaultMetadata, { isAutoIncrement: true }));
	}
	default(value) {
		return new I256ColumnBuilder(this, set(defaultMetadata, { defaultValue: value }));
	}
	name(name) {
		return new I256ColumnBuilder(this, set(defaultMetadata, { name }));
	}
};
var F32Builder = class extends TypeBuilder {
	constructor() {
		super(AlgebraicType.F32);
	}
	default(value) {
		return new F32ColumnBuilder(this, set(defaultMetadata, { defaultValue: value }));
	}
	name(name) {
		return new F32ColumnBuilder(this, set(defaultMetadata, { name }));
	}
};
var F64Builder = class extends TypeBuilder {
	constructor() {
		super(AlgebraicType.F64);
	}
	default(value) {
		return new F64ColumnBuilder(this, set(defaultMetadata, { defaultValue: value }));
	}
	name(name) {
		return new F64ColumnBuilder(this, set(defaultMetadata, { name }));
	}
};
var BoolBuilder = class extends TypeBuilder {
	constructor() {
		super(AlgebraicType.Bool);
	}
	index(algorithm = "btree") {
		return new BoolColumnBuilder(this, set(defaultMetadata, { indexType: algorithm }));
	}
	unique() {
		return new BoolColumnBuilder(this, set(defaultMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new BoolColumnBuilder(this, set(defaultMetadata, { isPrimaryKey: true }));
	}
	default(value) {
		return new BoolColumnBuilder(this, set(defaultMetadata, { defaultValue: value }));
	}
	name(name) {
		return new BoolColumnBuilder(this, set(defaultMetadata, { name }));
	}
};
var StringBuilder = class extends TypeBuilder {
	constructor() {
		super(AlgebraicType.String);
	}
	index(algorithm = "btree") {
		return new StringColumnBuilder(this, set(defaultMetadata, { indexType: algorithm }));
	}
	unique() {
		return new StringColumnBuilder(this, set(defaultMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new StringColumnBuilder(this, set(defaultMetadata, { isPrimaryKey: true }));
	}
	default(value) {
		return new StringColumnBuilder(this, set(defaultMetadata, { defaultValue: value }));
	}
	name(name) {
		return new StringColumnBuilder(this, set(defaultMetadata, { name }));
	}
};
var ArrayBuilder = class extends TypeBuilder {
	element;
	constructor(element) {
		super(AlgebraicType.Array(element.algebraicType));
		this.element = element;
	}
	default(value) {
		return new ArrayColumnBuilder(this, set(defaultMetadata, { defaultValue: value }));
	}
	name(name) {
		return new ArrayColumnBuilder(this, set(defaultMetadata, { name }));
	}
};
var ByteArrayBuilder = class extends TypeBuilder {
	constructor() {
		super(AlgebraicType.Array(AlgebraicType.U8));
	}
	default(value) {
		return new ByteArrayColumnBuilder(set(defaultMetadata, { defaultValue: value }));
	}
	name(name) {
		return new ByteArrayColumnBuilder(set(defaultMetadata, { name }));
	}
};
var OptionBuilder = class extends TypeBuilder {
	value;
	constructor(value) {
		super(Option.getAlgebraicType(value.algebraicType));
		this.value = value;
	}
	default(value) {
		return new OptionColumnBuilder(this, set(defaultMetadata, { defaultValue: value }));
	}
	name(name) {
		return new OptionColumnBuilder(this, set(defaultMetadata, { name }));
	}
};
var ProductBuilder = class extends TypeBuilder {
	typeName;
	elements;
	constructor(elements, name) {
		function elementsArrayFromElementsObj(obj) {
			return Object.keys(obj).map((key) => ({
				name: key,
				get algebraicType() {
					return obj[key].algebraicType;
				}
			}));
		}
		super(AlgebraicType.Product({ elements: elementsArrayFromElementsObj(elements) }));
		this.typeName = name;
		this.elements = elements;
	}
	default(value) {
		return new ProductColumnBuilder(this, set(defaultMetadata, { defaultValue: value }));
	}
	name(name) {
		return new ProductColumnBuilder(this, set(defaultMetadata, { name }));
	}
};
var ResultBuilder = class extends TypeBuilder {
	ok;
	err;
	constructor(ok, err) {
		super(Result.getAlgebraicType(ok.algebraicType, err.algebraicType));
		this.ok = ok;
		this.err = err;
	}
	default(value) {
		return new ResultColumnBuilder(this, set(defaultMetadata, { defaultValue: value }));
	}
};
var UnitBuilder = class extends TypeBuilder {
	constructor() {
		super({
			tag: "Product",
			value: { elements: [] }
		});
	}
};
var RowBuilder = class extends TypeBuilder {
	row;
	typeName;
	constructor(row, name) {
		const mappedRow = Object.fromEntries(Object.entries(row).map(([colName, builder]) => [colName, builder instanceof ColumnBuilder ? builder : new ColumnBuilder(builder, {})]));
		const elements = Object.keys(mappedRow).map((name2) => ({
			name: name2,
			get algebraicType() {
				return mappedRow[name2].typeBuilder.algebraicType;
			}
		}));
		super(AlgebraicType.Product({ elements }));
		this.row = mappedRow;
		this.typeName = name;
	}
};
var SumBuilderImpl = class extends TypeBuilder {
	variants;
	typeName;
	constructor(variants, name) {
		function variantsArrayFromVariantsObj(variants2) {
			return Object.keys(variants2).map((key) => ({
				name: key,
				get algebraicType() {
					return variants2[key].algebraicType;
				}
			}));
		}
		super(AlgebraicType.Sum({ variants: variantsArrayFromVariantsObj(variants) }));
		this.variants = variants;
		this.typeName = name;
		for (const key of Object.keys(variants)) {
			const desc = Object.getOwnPropertyDescriptor(variants, key);
			const isAccessor = !!desc && (typeof desc.get === "function" || typeof desc.set === "function");
			let isUnit2 = false;
			if (!isAccessor) isUnit2 = variants[key] instanceof UnitBuilder;
			if (isUnit2) {
				const constant = this.create(key);
				Object.defineProperty(this, key, {
					value: constant,
					writable: false,
					enumerable: true,
					configurable: false
				});
			} else {
				const fn = ((value) => this.create(key, value));
				Object.defineProperty(this, key, {
					value: fn,
					writable: false,
					enumerable: true,
					configurable: false
				});
			}
		}
	}
	create(tag, value) {
		return value === void 0 ? { tag } : {
			tag,
			value
		};
	}
	default(value) {
		return new SumColumnBuilder(this, set(defaultMetadata, { defaultValue: value }));
	}
	name(name) {
		return new SumColumnBuilder(this, set(defaultMetadata, { name }));
	}
};
var SumBuilder = SumBuilderImpl;
var SimpleSumBuilderImpl = class extends SumBuilderImpl {
	index(algorithm = "btree") {
		return new SimpleSumColumnBuilder(this, set(defaultMetadata, { indexType: algorithm }));
	}
	primaryKey() {
		return new SimpleSumColumnBuilder(this, set(defaultMetadata, { isPrimaryKey: true }));
	}
};
var ScheduleAtBuilder = class extends TypeBuilder {
	constructor() {
		super(schedule_at_default.getAlgebraicType());
	}
	default(value) {
		return new ScheduleAtColumnBuilder(this, set(defaultMetadata, { defaultValue: value }));
	}
	name(name) {
		return new ScheduleAtColumnBuilder(this, set(defaultMetadata, { name }));
	}
};
var IdentityBuilder = class extends TypeBuilder {
	constructor() {
		super(Identity.getAlgebraicType());
	}
	index(algorithm = "btree") {
		return new IdentityColumnBuilder(this, set(defaultMetadata, { indexType: algorithm }));
	}
	unique() {
		return new IdentityColumnBuilder(this, set(defaultMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new IdentityColumnBuilder(this, set(defaultMetadata, { isPrimaryKey: true }));
	}
	autoInc() {
		return new IdentityColumnBuilder(this, set(defaultMetadata, { isAutoIncrement: true }));
	}
	default(value) {
		return new IdentityColumnBuilder(this, set(defaultMetadata, { defaultValue: value }));
	}
	name(name) {
		return new IdentityColumnBuilder(this, set(defaultMetadata, { name }));
	}
};
var ConnectionIdBuilder = class extends TypeBuilder {
	constructor() {
		super(ConnectionId.getAlgebraicType());
	}
	index(algorithm = "btree") {
		return new ConnectionIdColumnBuilder(this, set(defaultMetadata, { indexType: algorithm }));
	}
	unique() {
		return new ConnectionIdColumnBuilder(this, set(defaultMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new ConnectionIdColumnBuilder(this, set(defaultMetadata, { isPrimaryKey: true }));
	}
	autoInc() {
		return new ConnectionIdColumnBuilder(this, set(defaultMetadata, { isAutoIncrement: true }));
	}
	default(value) {
		return new ConnectionIdColumnBuilder(this, set(defaultMetadata, { defaultValue: value }));
	}
	name(name) {
		return new ConnectionIdColumnBuilder(this, set(defaultMetadata, { name }));
	}
};
var TimestampBuilder = class extends TypeBuilder {
	constructor() {
		super(Timestamp.getAlgebraicType());
	}
	index(algorithm = "btree") {
		return new TimestampColumnBuilder(this, set(defaultMetadata, { indexType: algorithm }));
	}
	unique() {
		return new TimestampColumnBuilder(this, set(defaultMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new TimestampColumnBuilder(this, set(defaultMetadata, { isPrimaryKey: true }));
	}
	autoInc() {
		return new TimestampColumnBuilder(this, set(defaultMetadata, { isAutoIncrement: true }));
	}
	default(value) {
		return new TimestampColumnBuilder(this, set(defaultMetadata, { defaultValue: value }));
	}
	name(name) {
		return new TimestampColumnBuilder(this, set(defaultMetadata, { name }));
	}
};
var TimeDurationBuilder = class extends TypeBuilder {
	constructor() {
		super(TimeDuration.getAlgebraicType());
	}
	index(algorithm = "btree") {
		return new TimeDurationColumnBuilder(this, set(defaultMetadata, { indexType: algorithm }));
	}
	unique() {
		return new TimeDurationColumnBuilder(this, set(defaultMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new TimeDurationColumnBuilder(this, set(defaultMetadata, { isPrimaryKey: true }));
	}
	autoInc() {
		return new TimeDurationColumnBuilder(this, set(defaultMetadata, { isAutoIncrement: true }));
	}
	default(value) {
		return new TimeDurationColumnBuilder(this, set(defaultMetadata, { defaultValue: value }));
	}
	name(name) {
		return new TimeDurationColumnBuilder(this, set(defaultMetadata, { name }));
	}
};
var UuidBuilder = class extends TypeBuilder {
	constructor() {
		super(Uuid.getAlgebraicType());
	}
	index(algorithm = "btree") {
		return new UuidColumnBuilder(this, set(defaultMetadata, { indexType: algorithm }));
	}
	unique() {
		return new UuidColumnBuilder(this, set(defaultMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new UuidColumnBuilder(this, set(defaultMetadata, { isPrimaryKey: true }));
	}
	autoInc() {
		return new UuidColumnBuilder(this, set(defaultMetadata, { isAutoIncrement: true }));
	}
	default(value) {
		return new UuidColumnBuilder(this, set(defaultMetadata, { defaultValue: value }));
	}
	name(name) {
		return new UuidColumnBuilder(this, set(defaultMetadata, { name }));
	}
};
var defaultMetadata = {};
var ColumnBuilder = class {
	typeBuilder;
	columnMetadata;
	constructor(typeBuilder, metadata) {
		this.typeBuilder = typeBuilder;
		this.columnMetadata = metadata;
	}
	serialize(writer, value) {
		this.typeBuilder.serialize(writer, value);
	}
	deserialize(reader) {
		return this.typeBuilder.deserialize(reader);
	}
};
var U8ColumnBuilder = class _U8ColumnBuilder extends ColumnBuilder {
	index(algorithm = "btree") {
		return new _U8ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { indexType: algorithm }));
	}
	unique() {
		return new _U8ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new _U8ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isPrimaryKey: true }));
	}
	autoInc() {
		return new _U8ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isAutoIncrement: true }));
	}
	default(value) {
		return new _U8ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { defaultValue: value }));
	}
	name(name) {
		return new _U8ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { name }));
	}
};
var U16ColumnBuilder = class _U16ColumnBuilder extends ColumnBuilder {
	index(algorithm = "btree") {
		return new _U16ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { indexType: algorithm }));
	}
	unique() {
		return new _U16ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new _U16ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isPrimaryKey: true }));
	}
	autoInc() {
		return new _U16ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isAutoIncrement: true }));
	}
	default(value) {
		return new _U16ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { defaultValue: value }));
	}
	name(name) {
		return new _U16ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { name }));
	}
};
var U32ColumnBuilder = class _U32ColumnBuilder extends ColumnBuilder {
	index(algorithm = "btree") {
		return new _U32ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { indexType: algorithm }));
	}
	unique() {
		return new _U32ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new _U32ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isPrimaryKey: true }));
	}
	autoInc() {
		return new _U32ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isAutoIncrement: true }));
	}
	default(value) {
		return new _U32ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { defaultValue: value }));
	}
	name(name) {
		return new _U32ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { name }));
	}
};
var U64ColumnBuilder = class _U64ColumnBuilder extends ColumnBuilder {
	index(algorithm = "btree") {
		return new _U64ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { indexType: algorithm }));
	}
	unique() {
		return new _U64ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new _U64ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isPrimaryKey: true }));
	}
	autoInc() {
		return new _U64ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isAutoIncrement: true }));
	}
	default(value) {
		return new _U64ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { defaultValue: value }));
	}
	name(name) {
		return new _U64ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { name }));
	}
};
var U128ColumnBuilder = class _U128ColumnBuilder extends ColumnBuilder {
	index(algorithm = "btree") {
		return new _U128ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { indexType: algorithm }));
	}
	unique() {
		return new _U128ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new _U128ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isPrimaryKey: true }));
	}
	autoInc() {
		return new _U128ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isAutoIncrement: true }));
	}
	default(value) {
		return new _U128ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { defaultValue: value }));
	}
	name(name) {
		return new _U128ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { name }));
	}
};
var U256ColumnBuilder = class _U256ColumnBuilder extends ColumnBuilder {
	index(algorithm = "btree") {
		return new _U256ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { indexType: algorithm }));
	}
	unique() {
		return new _U256ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new _U256ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isPrimaryKey: true }));
	}
	autoInc() {
		return new _U256ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isAutoIncrement: true }));
	}
	default(value) {
		return new _U256ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { defaultValue: value }));
	}
	name(name) {
		return new _U256ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { name }));
	}
};
var I8ColumnBuilder = class _I8ColumnBuilder extends ColumnBuilder {
	index(algorithm = "btree") {
		return new _I8ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { indexType: algorithm }));
	}
	unique() {
		return new _I8ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new _I8ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isPrimaryKey: true }));
	}
	autoInc() {
		return new _I8ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isAutoIncrement: true }));
	}
	default(value) {
		return new _I8ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { defaultValue: value }));
	}
	name(name) {
		return new _I8ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { name }));
	}
};
var I16ColumnBuilder = class _I16ColumnBuilder extends ColumnBuilder {
	index(algorithm = "btree") {
		return new _I16ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { indexType: algorithm }));
	}
	unique() {
		return new _I16ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new _I16ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isPrimaryKey: true }));
	}
	autoInc() {
		return new _I16ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isAutoIncrement: true }));
	}
	default(value) {
		return new _I16ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { defaultValue: value }));
	}
	name(name) {
		return new _I16ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { name }));
	}
};
var I32ColumnBuilder = class _I32ColumnBuilder extends ColumnBuilder {
	index(algorithm = "btree") {
		return new _I32ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { indexType: algorithm }));
	}
	unique() {
		return new _I32ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new _I32ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isPrimaryKey: true }));
	}
	autoInc() {
		return new _I32ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isAutoIncrement: true }));
	}
	default(value) {
		return new _I32ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { defaultValue: value }));
	}
	name(name) {
		return new _I32ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { name }));
	}
};
var I64ColumnBuilder = class _I64ColumnBuilder extends ColumnBuilder {
	index(algorithm = "btree") {
		return new _I64ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { indexType: algorithm }));
	}
	unique() {
		return new _I64ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new _I64ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isPrimaryKey: true }));
	}
	autoInc() {
		return new _I64ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isAutoIncrement: true }));
	}
	default(value) {
		return new _I64ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { defaultValue: value }));
	}
	name(name) {
		return new _I64ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { name }));
	}
};
var I128ColumnBuilder = class _I128ColumnBuilder extends ColumnBuilder {
	index(algorithm = "btree") {
		return new _I128ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { indexType: algorithm }));
	}
	unique() {
		return new _I128ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new _I128ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isPrimaryKey: true }));
	}
	autoInc() {
		return new _I128ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isAutoIncrement: true }));
	}
	default(value) {
		return new _I128ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { defaultValue: value }));
	}
	name(name) {
		return new _I128ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { name }));
	}
};
var I256ColumnBuilder = class _I256ColumnBuilder extends ColumnBuilder {
	index(algorithm = "btree") {
		return new _I256ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { indexType: algorithm }));
	}
	unique() {
		return new _I256ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new _I256ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isPrimaryKey: true }));
	}
	autoInc() {
		return new _I256ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isAutoIncrement: true }));
	}
	default(value) {
		return new _I256ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { defaultValue: value }));
	}
	name(name) {
		return new _I256ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { name }));
	}
};
var F32ColumnBuilder = class _F32ColumnBuilder extends ColumnBuilder {
	default(value) {
		return new _F32ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { defaultValue: value }));
	}
	name(name) {
		return new _F32ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { name }));
	}
};
var F64ColumnBuilder = class _F64ColumnBuilder extends ColumnBuilder {
	default(value) {
		return new _F64ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { defaultValue: value }));
	}
	name(name) {
		return new _F64ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { name }));
	}
};
var BoolColumnBuilder = class _BoolColumnBuilder extends ColumnBuilder {
	index(algorithm = "btree") {
		return new _BoolColumnBuilder(this.typeBuilder, set(this.columnMetadata, { indexType: algorithm }));
	}
	unique() {
		return new _BoolColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new _BoolColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isPrimaryKey: true }));
	}
	default(value) {
		return new _BoolColumnBuilder(this.typeBuilder, set(this.columnMetadata, { defaultValue: value }));
	}
	name(name) {
		return new _BoolColumnBuilder(this.typeBuilder, set(this.columnMetadata, { name }));
	}
};
var StringColumnBuilder = class _StringColumnBuilder extends ColumnBuilder {
	index(algorithm = "btree") {
		return new _StringColumnBuilder(this.typeBuilder, set(this.columnMetadata, { indexType: algorithm }));
	}
	unique() {
		return new _StringColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new _StringColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isPrimaryKey: true }));
	}
	default(value) {
		return new _StringColumnBuilder(this.typeBuilder, set(this.columnMetadata, { defaultValue: value }));
	}
	name(name) {
		return new _StringColumnBuilder(this.typeBuilder, set(this.columnMetadata, { name }));
	}
};
var ArrayColumnBuilder = class _ArrayColumnBuilder extends ColumnBuilder {
	default(value) {
		return new _ArrayColumnBuilder(this.typeBuilder, set(this.columnMetadata, { defaultValue: value }));
	}
	name(name) {
		return new _ArrayColumnBuilder(this.typeBuilder, set(this.columnMetadata, { name }));
	}
};
var ByteArrayColumnBuilder = class _ByteArrayColumnBuilder extends ColumnBuilder {
	constructor(metadata) {
		super(new TypeBuilder(AlgebraicType.Array(AlgebraicType.U8)), metadata);
	}
	default(value) {
		return new _ByteArrayColumnBuilder(set(this.columnMetadata, { defaultValue: value }));
	}
	name(name) {
		return new _ByteArrayColumnBuilder(set(this.columnMetadata, { name }));
	}
};
var OptionColumnBuilder = class _OptionColumnBuilder extends ColumnBuilder {
	default(value) {
		return new _OptionColumnBuilder(this.typeBuilder, set(this.columnMetadata, { defaultValue: value }));
	}
	name(name) {
		return new _OptionColumnBuilder(this.typeBuilder, set(this.columnMetadata, { name }));
	}
};
var ResultColumnBuilder = class _ResultColumnBuilder extends ColumnBuilder {
	constructor(typeBuilder, metadata) {
		super(typeBuilder, metadata);
	}
	default(value) {
		return new _ResultColumnBuilder(this.typeBuilder, set(this.columnMetadata, { defaultValue: value }));
	}
};
var ProductColumnBuilder = class _ProductColumnBuilder extends ColumnBuilder {
	default(value) {
		return new _ProductColumnBuilder(this.typeBuilder, set(this.columnMetadata, { defaultValue: value }));
	}
	name(name) {
		return new _ProductColumnBuilder(this.typeBuilder, set(this.columnMetadata, { name }));
	}
};
var SumColumnBuilder = class _SumColumnBuilder extends ColumnBuilder {
	default(value) {
		return new _SumColumnBuilder(this.typeBuilder, set(this.columnMetadata, { defaultValue: value }));
	}
	name(name) {
		return new _SumColumnBuilder(this.typeBuilder, set(this.columnMetadata, { name }));
	}
};
var SimpleSumColumnBuilder = class _SimpleSumColumnBuilder extends SumColumnBuilder {
	index(algorithm = "btree") {
		return new _SimpleSumColumnBuilder(this.typeBuilder, set(this.columnMetadata, { indexType: algorithm }));
	}
	primaryKey() {
		return new _SimpleSumColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isPrimaryKey: true }));
	}
};
var ScheduleAtColumnBuilder = class _ScheduleAtColumnBuilder extends ColumnBuilder {
	default(value) {
		return new _ScheduleAtColumnBuilder(this.typeBuilder, set(this.columnMetadata, { defaultValue: value }));
	}
	name(name) {
		return new _ScheduleAtColumnBuilder(this.typeBuilder, set(this.columnMetadata, { name }));
	}
};
var IdentityColumnBuilder = class _IdentityColumnBuilder extends ColumnBuilder {
	index(algorithm = "btree") {
		return new _IdentityColumnBuilder(this.typeBuilder, set(this.columnMetadata, { indexType: algorithm }));
	}
	unique() {
		return new _IdentityColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new _IdentityColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isPrimaryKey: true }));
	}
	default(value) {
		return new _IdentityColumnBuilder(this.typeBuilder, set(this.columnMetadata, { defaultValue: value }));
	}
	name(name) {
		return new _IdentityColumnBuilder(this.typeBuilder, set(this.columnMetadata, { name }));
	}
};
var ConnectionIdColumnBuilder = class _ConnectionIdColumnBuilder extends ColumnBuilder {
	index(algorithm = "btree") {
		return new _ConnectionIdColumnBuilder(this.typeBuilder, set(this.columnMetadata, { indexType: algorithm }));
	}
	unique() {
		return new _ConnectionIdColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new _ConnectionIdColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isPrimaryKey: true }));
	}
	default(value) {
		return new _ConnectionIdColumnBuilder(this.typeBuilder, set(this.columnMetadata, { defaultValue: value }));
	}
	name(name) {
		return new _ConnectionIdColumnBuilder(this.typeBuilder, set(this.columnMetadata, { name }));
	}
};
var TimestampColumnBuilder = class _TimestampColumnBuilder extends ColumnBuilder {
	index(algorithm = "btree") {
		return new _TimestampColumnBuilder(this.typeBuilder, set(this.columnMetadata, { indexType: algorithm }));
	}
	unique() {
		return new _TimestampColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new _TimestampColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isPrimaryKey: true }));
	}
	default(value) {
		return new _TimestampColumnBuilder(this.typeBuilder, set(this.columnMetadata, { defaultValue: value }));
	}
	name(name) {
		return new _TimestampColumnBuilder(this.typeBuilder, set(this.columnMetadata, { name }));
	}
};
var TimeDurationColumnBuilder = class _TimeDurationColumnBuilder extends ColumnBuilder {
	index(algorithm = "btree") {
		return new _TimeDurationColumnBuilder(this.typeBuilder, set(this.columnMetadata, { indexType: algorithm }));
	}
	unique() {
		return new _TimeDurationColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new _TimeDurationColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isPrimaryKey: true }));
	}
	default(value) {
		return new _TimeDurationColumnBuilder(this.typeBuilder, set(this.columnMetadata, { defaultValue: value }));
	}
	name(name) {
		return new _TimeDurationColumnBuilder(this.typeBuilder, set(this.columnMetadata, { name }));
	}
};
var UuidColumnBuilder = class _UuidColumnBuilder extends ColumnBuilder {
	index(algorithm = "btree") {
		return new _UuidColumnBuilder(this.typeBuilder, set(this.columnMetadata, { indexType: algorithm }));
	}
	unique() {
		return new _UuidColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new _UuidColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isPrimaryKey: true }));
	}
	default(value) {
		return new _UuidColumnBuilder(this.typeBuilder, set(this.columnMetadata, { defaultValue: value }));
	}
	name(name) {
		return new _UuidColumnBuilder(this.typeBuilder, set(this.columnMetadata, { name }));
	}
};
var RefBuilder = class extends TypeBuilder {
	ref;
	/** The phantom type of the pointee of this ref. */
	__spacetimeType;
	constructor(ref) {
		super(AlgebraicType.Ref(ref));
		this.ref = ref;
	}
};
var enumImpl = ((nameOrObj, maybeObj) => {
	let obj = nameOrObj;
	let name = void 0;
	if (typeof nameOrObj === "string") {
		if (!maybeObj) throw new TypeError("When providing a name, you must also provide the variants object or array.");
		obj = maybeObj;
		name = nameOrObj;
	}
	if (Array.isArray(obj)) {
		const simpleVariantsObj = {};
		for (const variant of obj) simpleVariantsObj[variant] = new UnitBuilder();
		return new SimpleSumBuilderImpl(simpleVariantsObj, name);
	}
	return new SumBuilder(obj, name);
});
var t = {
	bool: () => new BoolBuilder(),
	string: () => new StringBuilder(),
	number: () => new F64Builder(),
	i8: () => new I8Builder(),
	u8: () => new U8Builder(),
	i16: () => new I16Builder(),
	u16: () => new U16Builder(),
	i32: () => new I32Builder(),
	u32: () => new U32Builder(),
	i64: () => new I64Builder(),
	u64: () => new U64Builder(),
	i128: () => new I128Builder(),
	u128: () => new U128Builder(),
	i256: () => new I256Builder(),
	u256: () => new U256Builder(),
	f32: () => new F32Builder(),
	f64: () => new F64Builder(),
	object: ((nameOrObj, maybeObj) => {
		if (typeof nameOrObj === "string") {
			if (!maybeObj) throw new TypeError("When providing a name, you must also provide the object.");
			return new ProductBuilder(maybeObj, nameOrObj);
		}
		return new ProductBuilder(nameOrObj, void 0);
	}),
	row: ((nameOrObj, maybeObj) => {
		const [obj, name] = typeof nameOrObj === "string" ? [maybeObj, nameOrObj] : [nameOrObj, void 0];
		return new RowBuilder(obj, name);
	}),
	array(e) {
		return new ArrayBuilder(e);
	},
	enum: enumImpl,
	unit() {
		return new UnitBuilder();
	},
	lazy(thunk) {
		let cached = null;
		const get = () => cached ??= thunk();
		return new Proxy({}, {
			get(_t, prop, recv) {
				const target = get();
				const val = Reflect.get(target, prop, recv);
				return typeof val === "function" ? val.bind(target) : val;
			},
			set(_t, prop, value, recv) {
				return Reflect.set(get(), prop, value, recv);
			},
			has(_t, prop) {
				return prop in get();
			},
			ownKeys() {
				return Reflect.ownKeys(get());
			},
			getOwnPropertyDescriptor(_t, prop) {
				return Object.getOwnPropertyDescriptor(get(), prop);
			},
			getPrototypeOf() {
				return Object.getPrototypeOf(get());
			}
		});
	},
	scheduleAt: () => {
		return new ScheduleAtBuilder();
	},
	option(value) {
		return new OptionBuilder(value);
	},
	result(ok, err) {
		return new ResultBuilder(ok, err);
	},
	identity: () => {
		return new IdentityBuilder();
	},
	connectionId: () => {
		return new ConnectionIdBuilder();
	},
	timestamp: () => {
		return new TimestampBuilder();
	},
	timeDuration: () => {
		return new TimeDurationBuilder();
	},
	uuid: () => {
		return new UuidBuilder();
	},
	byteArray: () => {
		return new ByteArrayBuilder();
	}
};
var AlgebraicType2 = t.enum("AlgebraicType", {
	Ref: t.u32(),
	get Sum() {
		return SumType2;
	},
	get Product() {
		return ProductType2;
	},
	get Array() {
		return AlgebraicType2;
	},
	String: t.unit(),
	Bool: t.unit(),
	I8: t.unit(),
	U8: t.unit(),
	I16: t.unit(),
	U16: t.unit(),
	I32: t.unit(),
	U32: t.unit(),
	I64: t.unit(),
	U64: t.unit(),
	I128: t.unit(),
	U128: t.unit(),
	I256: t.unit(),
	U256: t.unit(),
	F32: t.unit(),
	F64: t.unit()
});
var CaseConversionPolicy = t.enum("CaseConversionPolicy", {
	None: t.unit(),
	SnakeCase: t.unit()
});
var ExplicitNameEntry = t.enum("ExplicitNameEntry", {
	get Table() {
		return NameMapping;
	},
	get Function() {
		return NameMapping;
	},
	get Index() {
		return NameMapping;
	}
});
var ExplicitNames = t.object("ExplicitNames", { get entries() {
	return t.array(ExplicitNameEntry);
} });
var FunctionVisibility = t.enum("FunctionVisibility", {
	Private: t.unit(),
	ClientCallable: t.unit()
});
var HttpHeaderPair = t.object("HttpHeaderPair", {
	name: t.string(),
	value: t.byteArray()
});
var HttpHeaders = t.object("HttpHeaders", { get entries() {
	return t.array(HttpHeaderPair);
} });
var HttpMethod = t.enum("HttpMethod", {
	Get: t.unit(),
	Head: t.unit(),
	Post: t.unit(),
	Put: t.unit(),
	Delete: t.unit(),
	Connect: t.unit(),
	Options: t.unit(),
	Trace: t.unit(),
	Patch: t.unit(),
	Extension: t.string()
});
var HttpRequest = t.object("HttpRequest", {
	get method() {
		return HttpMethod;
	},
	get headers() {
		return HttpHeaders;
	},
	timeout: t.option(t.timeDuration()),
	uri: t.string(),
	get version() {
		return HttpVersion;
	}
});
var HttpResponse = t.object("HttpResponse", {
	get headers() {
		return HttpHeaders;
	},
	get version() {
		return HttpVersion;
	},
	code: t.u16()
});
var HttpVersion = t.enum("HttpVersion", {
	Http09: t.unit(),
	Http10: t.unit(),
	Http11: t.unit(),
	Http2: t.unit(),
	Http3: t.unit()
});
var IndexType = t.enum("IndexType", {
	BTree: t.unit(),
	Hash: t.unit()
});
var Lifecycle = t.enum("Lifecycle", {
	Init: t.unit(),
	OnConnect: t.unit(),
	OnDisconnect: t.unit()
});
var MiscModuleExport = t.enum("MiscModuleExport", { get TypeAlias() {
	return TypeAlias;
} });
var NameMapping = t.object("NameMapping", {
	sourceName: t.string(),
	canonicalName: t.string()
});
var ProductType2 = t.object("ProductType", { get elements() {
	return t.array(ProductTypeElement);
} });
var ProductTypeElement = t.object("ProductTypeElement", {
	name: t.option(t.string()),
	get algebraicType() {
		return AlgebraicType2;
	}
});
var RawColumnDefV8 = t.object("RawColumnDefV8", {
	colName: t.string(),
	get colType() {
		return AlgebraicType2;
	}
});
var RawColumnDefaultValueV10 = t.object("RawColumnDefaultValueV10", {
	colId: t.u16(),
	value: t.byteArray()
});
var RawColumnDefaultValueV9 = t.object("RawColumnDefaultValueV9", {
	table: t.string(),
	colId: t.u16(),
	value: t.byteArray()
});
var RawConstraintDataV9 = t.enum("RawConstraintDataV9", { get Unique() {
	return RawUniqueConstraintDataV9;
} });
var RawConstraintDefV10 = t.object("RawConstraintDefV10", {
	sourceName: t.option(t.string()),
	get data() {
		return RawConstraintDataV9;
	}
});
var RawConstraintDefV8 = t.object("RawConstraintDefV8", {
	constraintName: t.string(),
	constraints: t.u8(),
	columns: t.array(t.u16())
});
var RawConstraintDefV9 = t.object("RawConstraintDefV9", {
	name: t.option(t.string()),
	get data() {
		return RawConstraintDataV9;
	}
});
var RawIndexAlgorithm = t.enum("RawIndexAlgorithm", {
	BTree: t.array(t.u16()),
	Hash: t.array(t.u16()),
	Direct: t.u16()
});
var RawIndexDefV10 = t.object("RawIndexDefV10", {
	sourceName: t.option(t.string()),
	accessorName: t.option(t.string()),
	get algorithm() {
		return RawIndexAlgorithm;
	}
});
var RawIndexDefV8 = t.object("RawIndexDefV8", {
	indexName: t.string(),
	isUnique: t.bool(),
	get indexType() {
		return IndexType;
	},
	columns: t.array(t.u16())
});
var RawIndexDefV9 = t.object("RawIndexDefV9", {
	name: t.option(t.string()),
	accessorName: t.option(t.string()),
	get algorithm() {
		return RawIndexAlgorithm;
	}
});
var RawLifeCycleReducerDefV10 = t.object("RawLifeCycleReducerDefV10", {
	get lifecycleSpec() {
		return Lifecycle;
	},
	functionName: t.string()
});
var RawMiscModuleExportV9 = t.enum("RawMiscModuleExportV9", {
	get ColumnDefaultValue() {
		return RawColumnDefaultValueV9;
	},
	get Procedure() {
		return RawProcedureDefV9;
	},
	get View() {
		return RawViewDefV9;
	}
});
var RawModuleDef = t.enum("RawModuleDef", {
	get V8BackCompat() {
		return RawModuleDefV8;
	},
	get V9() {
		return RawModuleDefV9;
	},
	get V10() {
		return RawModuleDefV10;
	}
});
var RawModuleDefV10 = t.object("RawModuleDefV10", { get sections() {
	return t.array(RawModuleDefV10Section);
} });
var RawModuleDefV10Section = t.enum("RawModuleDefV10Section", {
	get Typespace() {
		return Typespace;
	},
	get Types() {
		return t.array(RawTypeDefV10);
	},
	get Tables() {
		return t.array(RawTableDefV10);
	},
	get Reducers() {
		return t.array(RawReducerDefV10);
	},
	get Procedures() {
		return t.array(RawProcedureDefV10);
	},
	get Views() {
		return t.array(RawViewDefV10);
	},
	get Schedules() {
		return t.array(RawScheduleDefV10);
	},
	get LifeCycleReducers() {
		return t.array(RawLifeCycleReducerDefV10);
	},
	get RowLevelSecurity() {
		return t.array(RawRowLevelSecurityDefV9);
	},
	get CaseConversionPolicy() {
		return CaseConversionPolicy;
	},
	get ExplicitNames() {
		return ExplicitNames;
	}
});
var RawModuleDefV8 = t.object("RawModuleDefV8", {
	get typespace() {
		return Typespace;
	},
	get tables() {
		return t.array(TableDesc);
	},
	get reducers() {
		return t.array(ReducerDef);
	},
	get miscExports() {
		return t.array(MiscModuleExport);
	}
});
var RawModuleDefV9 = t.object("RawModuleDefV9", {
	get typespace() {
		return Typespace;
	},
	get tables() {
		return t.array(RawTableDefV9);
	},
	get reducers() {
		return t.array(RawReducerDefV9);
	},
	get types() {
		return t.array(RawTypeDefV9);
	},
	get miscExports() {
		return t.array(RawMiscModuleExportV9);
	},
	get rowLevelSecurity() {
		return t.array(RawRowLevelSecurityDefV9);
	}
});
var RawProcedureDefV10 = t.object("RawProcedureDefV10", {
	sourceName: t.string(),
	get params() {
		return ProductType2;
	},
	get returnType() {
		return AlgebraicType2;
	},
	get visibility() {
		return FunctionVisibility;
	}
});
var RawProcedureDefV9 = t.object("RawProcedureDefV9", {
	name: t.string(),
	get params() {
		return ProductType2;
	},
	get returnType() {
		return AlgebraicType2;
	}
});
var RawReducerDefV10 = t.object("RawReducerDefV10", {
	sourceName: t.string(),
	get params() {
		return ProductType2;
	},
	get visibility() {
		return FunctionVisibility;
	},
	get okReturnType() {
		return AlgebraicType2;
	},
	get errReturnType() {
		return AlgebraicType2;
	}
});
var RawReducerDefV9 = t.object("RawReducerDefV9", {
	name: t.string(),
	get params() {
		return ProductType2;
	},
	get lifecycle() {
		return t.option(Lifecycle);
	}
});
var RawRowLevelSecurityDefV9 = t.object("RawRowLevelSecurityDefV9", { sql: t.string() });
var RawScheduleDefV10 = t.object("RawScheduleDefV10", {
	sourceName: t.option(t.string()),
	tableName: t.string(),
	scheduleAtCol: t.u16(),
	functionName: t.string()
});
var RawScheduleDefV9 = t.object("RawScheduleDefV9", {
	name: t.option(t.string()),
	reducerName: t.string(),
	scheduledAtColumn: t.u16()
});
var RawScopedTypeNameV10 = t.object("RawScopedTypeNameV10", {
	scope: t.array(t.string()),
	sourceName: t.string()
});
var RawScopedTypeNameV9 = t.object("RawScopedTypeNameV9", {
	scope: t.array(t.string()),
	name: t.string()
});
var RawSequenceDefV10 = t.object("RawSequenceDefV10", {
	sourceName: t.option(t.string()),
	column: t.u16(),
	start: t.option(t.i128()),
	minValue: t.option(t.i128()),
	maxValue: t.option(t.i128()),
	increment: t.i128()
});
var RawSequenceDefV8 = t.object("RawSequenceDefV8", {
	sequenceName: t.string(),
	colPos: t.u16(),
	increment: t.i128(),
	start: t.option(t.i128()),
	minValue: t.option(t.i128()),
	maxValue: t.option(t.i128()),
	allocated: t.i128()
});
var RawSequenceDefV9 = t.object("RawSequenceDefV9", {
	name: t.option(t.string()),
	column: t.u16(),
	start: t.option(t.i128()),
	minValue: t.option(t.i128()),
	maxValue: t.option(t.i128()),
	increment: t.i128()
});
var RawTableDefV10 = t.object("RawTableDefV10", {
	sourceName: t.string(),
	productTypeRef: t.u32(),
	primaryKey: t.array(t.u16()),
	get indexes() {
		return t.array(RawIndexDefV10);
	},
	get constraints() {
		return t.array(RawConstraintDefV10);
	},
	get sequences() {
		return t.array(RawSequenceDefV10);
	},
	get tableType() {
		return TableType;
	},
	get tableAccess() {
		return TableAccess;
	},
	get defaultValues() {
		return t.array(RawColumnDefaultValueV10);
	},
	isEvent: t.bool()
});
var RawTableDefV8 = t.object("RawTableDefV8", {
	tableName: t.string(),
	get columns() {
		return t.array(RawColumnDefV8);
	},
	get indexes() {
		return t.array(RawIndexDefV8);
	},
	get constraints() {
		return t.array(RawConstraintDefV8);
	},
	get sequences() {
		return t.array(RawSequenceDefV8);
	},
	tableType: t.string(),
	tableAccess: t.string(),
	scheduled: t.option(t.string())
});
var RawTableDefV9 = t.object("RawTableDefV9", {
	name: t.string(),
	productTypeRef: t.u32(),
	primaryKey: t.array(t.u16()),
	get indexes() {
		return t.array(RawIndexDefV9);
	},
	get constraints() {
		return t.array(RawConstraintDefV9);
	},
	get sequences() {
		return t.array(RawSequenceDefV9);
	},
	get schedule() {
		return t.option(RawScheduleDefV9);
	},
	get tableType() {
		return TableType;
	},
	get tableAccess() {
		return TableAccess;
	}
});
var RawTypeDefV10 = t.object("RawTypeDefV10", {
	get sourceName() {
		return RawScopedTypeNameV10;
	},
	ty: t.u32(),
	customOrdering: t.bool()
});
var RawTypeDefV9 = t.object("RawTypeDefV9", {
	get name() {
		return RawScopedTypeNameV9;
	},
	ty: t.u32(),
	customOrdering: t.bool()
});
var RawUniqueConstraintDataV9 = t.object("RawUniqueConstraintDataV9", { columns: t.array(t.u16()) });
var RawViewDefV10 = t.object("RawViewDefV10", {
	sourceName: t.string(),
	index: t.u32(),
	isPublic: t.bool(),
	isAnonymous: t.bool(),
	get params() {
		return ProductType2;
	},
	get returnType() {
		return AlgebraicType2;
	}
});
var RawViewDefV9 = t.object("RawViewDefV9", {
	name: t.string(),
	index: t.u32(),
	isPublic: t.bool(),
	isAnonymous: t.bool(),
	get params() {
		return ProductType2;
	},
	get returnType() {
		return AlgebraicType2;
	}
});
var ReducerDef = t.object("ReducerDef", {
	name: t.string(),
	get args() {
		return t.array(ProductTypeElement);
	}
});
var SumType2 = t.object("SumType", { get variants() {
	return t.array(SumTypeVariant);
} });
var SumTypeVariant = t.object("SumTypeVariant", {
	name: t.option(t.string()),
	get algebraicType() {
		return AlgebraicType2;
	}
});
var TableAccess = t.enum("TableAccess", {
	Public: t.unit(),
	Private: t.unit()
});
var TableDesc = t.object("TableDesc", {
	get schema() {
		return RawTableDefV8;
	},
	data: t.u32()
});
var TableType = t.enum("TableType", {
	System: t.unit(),
	User: t.unit()
});
var TypeAlias = t.object("TypeAlias", {
	name: t.string(),
	ty: t.u32()
});
var Typespace = t.object("Typespace", { get types() {
	return t.array(AlgebraicType2);
} });
var ViewResultHeader = t.enum("ViewResultHeader", {
	RowData: t.unit(),
	RawSql: t.string()
});
function tableToSchema(accName, schema2, tableDef) {
	const getColName = (i) => schema2.rowType.algebraicType.value.elements[i].name;
	return {
		sourceName: schema2.tableName || accName,
		accessorName: accName,
		columns: schema2.rowType.row,
		rowType: schema2.rowSpacetimeType,
		constraints: tableDef.constraints.map((c) => ({
			name: c.sourceName,
			constraint: "unique",
			columns: c.data.value.columns.map(getColName)
		})),
		indexes: tableDef.indexes.map((idx) => {
			const columnIds = idx.algorithm.tag === "Direct" ? [idx.algorithm.value] : idx.algorithm.value;
			return {
				name: idx.accessorName,
				unique: tableDef.constraints.some((c) => c.data.value.columns.every((col) => columnIds.includes(col))),
				algorithm: idx.algorithm.tag.toLowerCase(),
				columns: columnIds.map(getColName)
			};
		}),
		tableDef,
		...tableDef.isEvent ? { isEvent: true } : {}
	};
}
var ModuleContext = class {
	#compoundTypes = /* @__PURE__ */ new Map();
	/**
	* The global module definition that gets populated by calls to `reducer()` and lifecycle hooks.
	*/
	#moduleDef = {
		typespace: { types: [] },
		tables: [],
		reducers: [],
		types: [],
		rowLevelSecurity: [],
		schedules: [],
		procedures: [],
		views: [],
		lifeCycleReducers: [],
		caseConversionPolicy: { tag: "SnakeCase" },
		explicitNames: { entries: [] }
	};
	get moduleDef() {
		return this.#moduleDef;
	}
	rawModuleDefV10() {
		const sections = [];
		const push = (s) => {
			if (s) sections.push(s);
		};
		const module = this.#moduleDef;
		push(module.typespace && {
			tag: "Typespace",
			value: module.typespace
		});
		push(module.types && {
			tag: "Types",
			value: module.types
		});
		push(module.tables && {
			tag: "Tables",
			value: module.tables
		});
		push(module.reducers && {
			tag: "Reducers",
			value: module.reducers
		});
		push(module.procedures && {
			tag: "Procedures",
			value: module.procedures
		});
		push(module.views && {
			tag: "Views",
			value: module.views
		});
		push(module.schedules && {
			tag: "Schedules",
			value: module.schedules
		});
		push(module.lifeCycleReducers && {
			tag: "LifeCycleReducers",
			value: module.lifeCycleReducers
		});
		push(module.rowLevelSecurity && {
			tag: "RowLevelSecurity",
			value: module.rowLevelSecurity
		});
		push(module.explicitNames && {
			tag: "ExplicitNames",
			value: module.explicitNames
		});
		push(module.caseConversionPolicy && {
			tag: "CaseConversionPolicy",
			value: module.caseConversionPolicy
		});
		return { sections };
	}
	/**
	* Set the case conversion policy for this module.
	* Called by the settings mechanism.
	*/
	setCaseConversionPolicy(policy) {
		this.#moduleDef.caseConversionPolicy = policy;
	}
	get typespace() {
		return this.#moduleDef.typespace;
	}
	/**
	* Resolves the actual type of a TypeBuilder by following its references until it reaches a non-ref type.
	* @param typespace The typespace to resolve types against.
	* @param typeBuilder The TypeBuilder to resolve.
	* @returns The resolved algebraic type.
	*/
	resolveType(typeBuilder) {
		let ty = typeBuilder.algebraicType;
		while (ty.tag === "Ref") ty = this.typespace.types[ty.value];
		return ty;
	}
	/**
	* Adds a type to the module definition's typespace as a `Ref` if it is a named compound type (Product or Sum).
	* Otherwise, returns the type as is.
	* @param name
	* @param ty
	* @returns
	*/
	registerTypesRecursively(typeBuilder) {
		if (typeBuilder instanceof ProductBuilder && !isUnit(typeBuilder) || typeBuilder instanceof SumBuilder || typeBuilder instanceof RowBuilder) return this.#registerCompoundTypeRecursively(typeBuilder);
		else if (typeBuilder instanceof OptionBuilder) return new OptionBuilder(this.registerTypesRecursively(typeBuilder.value));
		else if (typeBuilder instanceof ResultBuilder) return new ResultBuilder(this.registerTypesRecursively(typeBuilder.ok), this.registerTypesRecursively(typeBuilder.err));
		else if (typeBuilder instanceof ArrayBuilder) return new ArrayBuilder(this.registerTypesRecursively(typeBuilder.element));
		else return typeBuilder;
	}
	#registerCompoundTypeRecursively(typeBuilder) {
		const ty = typeBuilder.algebraicType;
		const name = typeBuilder.typeName;
		if (name === void 0) throw new Error(`Missing type name for ${typeBuilder.constructor.name ?? "TypeBuilder"} ${JSON.stringify(typeBuilder)}`);
		let r = this.#compoundTypes.get(ty);
		if (r != null) return r;
		const newTy = typeBuilder instanceof RowBuilder || typeBuilder instanceof ProductBuilder ? {
			tag: "Product",
			value: { elements: [] }
		} : {
			tag: "Sum",
			value: { variants: [] }
		};
		r = new RefBuilder(this.#moduleDef.typespace.types.length);
		this.#moduleDef.typespace.types.push(newTy);
		this.#compoundTypes.set(ty, r);
		if (typeBuilder instanceof RowBuilder) for (const [name2, elem] of Object.entries(typeBuilder.row)) newTy.value.elements.push({
			name: name2,
			algebraicType: this.registerTypesRecursively(elem.typeBuilder).algebraicType
		});
		else if (typeBuilder instanceof ProductBuilder) for (const [name2, elem] of Object.entries(typeBuilder.elements)) newTy.value.elements.push({
			name: name2,
			algebraicType: this.registerTypesRecursively(elem).algebraicType
		});
		else if (typeBuilder instanceof SumBuilder) for (const [name2, variant] of Object.entries(typeBuilder.variants)) newTy.value.variants.push({
			name: name2,
			algebraicType: this.registerTypesRecursively(variant).algebraicType
		});
		this.#moduleDef.types.push({
			sourceName: splitName(name),
			ty: r.ref,
			customOrdering: true
		});
		return r;
	}
};
function isUnit(typeBuilder) {
	return typeBuilder.typeName == null && typeBuilder.algebraicType.value.elements.length === 0;
}
function splitName(name) {
	const scope = name.split(".");
	return {
		sourceName: scope.pop(),
		scope
	};
}
var import_statuses = __toESM(require_statuses());
var Range = class {
	#from;
	#to;
	constructor(from, to) {
		this.#from = from ?? { tag: "unbounded" };
		this.#to = to ?? { tag: "unbounded" };
	}
	get from() {
		return this.#from;
	}
	get to() {
		return this.#to;
	}
};
function table(opts, row, ..._) {
	const { name, public: isPublic = false, indexes: userIndexes = [], scheduled, event: isEvent = false } = opts;
	const colIds = /* @__PURE__ */ new Map();
	const colNameList = [];
	if (!(row instanceof RowBuilder)) row = new RowBuilder(row);
	row.algebraicType.value.elements.forEach((elem, i) => {
		colIds.set(elem.name, i);
		colNameList.push(elem.name);
	});
	const pk = [];
	const indexes = [];
	const constraints = [];
	const sequences = [];
	let scheduleAtCol;
	const defaultValues = [];
	for (const [name2, builder] of Object.entries(row.row)) {
		const meta = builder.columnMetadata;
		if (meta.isPrimaryKey) pk.push(colIds.get(name2));
		const isUnique = meta.isUnique || meta.isPrimaryKey;
		if (meta.indexType || isUnique) {
			const algo = meta.indexType ?? "btree";
			const id = colIds.get(name2);
			let algorithm;
			switch (algo) {
				case "btree":
					algorithm = RawIndexAlgorithm.BTree([id]);
					break;
				case "hash":
					algorithm = RawIndexAlgorithm.Hash([id]);
					break;
				case "direct":
					algorithm = RawIndexAlgorithm.Direct(id);
					break;
			}
			indexes.push({
				sourceName: void 0,
				accessorName: name2,
				algorithm
			});
		}
		if (isUnique) constraints.push({
			sourceName: void 0,
			data: {
				tag: "Unique",
				value: { columns: [colIds.get(name2)] }
			}
		});
		if (meta.isAutoIncrement) sequences.push({
			sourceName: void 0,
			start: void 0,
			minValue: void 0,
			maxValue: void 0,
			column: colIds.get(name2),
			increment: 1n
		});
		if (meta.defaultValue) {
			const writer = new BinaryWriter(16);
			builder.serialize(writer, meta.defaultValue);
			defaultValues.push({
				colId: colIds.get(name2),
				value: writer.getBuffer()
			});
		}
		if (scheduled) {
			const algebraicType = builder.typeBuilder.algebraicType;
			if (schedule_at_default.isScheduleAt(algebraicType)) scheduleAtCol = colIds.get(name2);
		}
	}
	for (const indexOpts of userIndexes ?? []) {
		let algorithm;
		switch (indexOpts.algorithm) {
			case "btree":
				algorithm = {
					tag: "BTree",
					value: indexOpts.columns.map((c) => colIds.get(c))
				};
				break;
			case "hash":
				algorithm = {
					tag: "Hash",
					value: indexOpts.columns.map((c) => colIds.get(c))
				};
				break;
			case "direct":
				algorithm = {
					tag: "Direct",
					value: colIds.get(indexOpts.column)
				};
				break;
		}
		indexes.push({
			sourceName: void 0,
			accessorName: indexOpts.accessor,
			algorithm,
			canonicalName: indexOpts.name
		});
	}
	for (const constraintOpts of opts.constraints ?? []) if (constraintOpts.constraint === "unique") {
		const data = {
			tag: "Unique",
			value: { columns: constraintOpts.columns.map((c) => colIds.get(c)) }
		};
		constraints.push({
			sourceName: constraintOpts.name,
			data
		});
		continue;
	}
	const productType = row.algebraicType.value;
	return {
		rowType: row,
		tableName: name,
		rowSpacetimeType: productType,
		tableDef: (ctx, accName) => {
			const tableName = name ?? accName;
			if (row.typeName === void 0) row.typeName = toPascalCase(tableName);
			for (const index of indexes) {
				const sourceName = index.sourceName = `${accName}_${(index.algorithm.tag === "Direct" ? [index.algorithm.value] : index.algorithm.value).map((i) => colNameList[i]).join("_")}_idx_${index.algorithm.tag.toLowerCase()}`;
				const { canonicalName } = index;
				if (canonicalName !== void 0) ctx.moduleDef.explicitNames.entries.push(ExplicitNameEntry.Index({
					sourceName,
					canonicalName
				}));
			}
			return {
				sourceName: accName,
				productTypeRef: ctx.registerTypesRecursively(row).ref,
				primaryKey: pk,
				indexes,
				constraints,
				sequences,
				tableType: { tag: "User" },
				tableAccess: { tag: isPublic ? "Public" : "Private" },
				defaultValues,
				isEvent
			};
		},
		idxs: {},
		constraints,
		schedule: scheduled && scheduleAtCol !== void 0 ? {
			scheduleAtCol,
			reducer: scheduled
		} : void 0
	};
}
var QueryBrand = Symbol("QueryBrand");
var isRowTypedQuery = (val) => !!val && typeof val === "object" && QueryBrand in val;
function toSql(q) {
	return q.toSql();
}
var SemijoinImpl = class _SemijoinImpl {
	constructor(sourceQuery, filterQuery, joinCondition) {
		this.sourceQuery = sourceQuery;
		this.filterQuery = filterQuery;
		this.joinCondition = joinCondition;
		if (sourceQuery.table.sourceName === filterQuery.table.sourceName) throw new Error("Cannot semijoin a table to itself");
	}
	[QueryBrand] = true;
	type = "semijoin";
	build() {
		return this;
	}
	where(predicate) {
		return new _SemijoinImpl(this.sourceQuery.where(predicate), this.filterQuery, this.joinCondition);
	}
	toSql() {
		const left = this.filterQuery;
		const right = this.sourceQuery;
		const leftTable = quoteIdentifier(left.table.sourceName);
		const rightTable = quoteIdentifier(right.table.sourceName);
		let sql = `SELECT ${rightTable}.* FROM ${leftTable} JOIN ${rightTable} ON ${booleanExprToSql(this.joinCondition)}`;
		const clauses = [];
		if (left.whereClause) clauses.push(booleanExprToSql(left.whereClause));
		if (right.whereClause) clauses.push(booleanExprToSql(right.whereClause));
		if (clauses.length > 0) {
			const whereSql = clauses.length === 1 ? clauses[0] : clauses.map(wrapInParens).join(" AND ");
			sql += ` WHERE ${whereSql}`;
		}
		return sql;
	}
};
var FromBuilder = class _FromBuilder {
	constructor(table2, whereClause) {
		this.table = table2;
		this.whereClause = whereClause;
	}
	[QueryBrand] = true;
	where(predicate) {
		const newCondition = predicate(this.table.cols);
		const nextWhere = this.whereClause ? this.whereClause.and(newCondition) : newCondition;
		return new _FromBuilder(this.table, nextWhere);
	}
	rightSemijoin(right, on) {
		const sourceQuery = new _FromBuilder(right);
		const joinCondition = on(this.table.indexedCols, right.indexedCols);
		return new SemijoinImpl(sourceQuery, this, joinCondition);
	}
	leftSemijoin(right, on) {
		const filterQuery = new _FromBuilder(right);
		const joinCondition = on(this.table.indexedCols, right.indexedCols);
		return new SemijoinImpl(this, filterQuery, joinCondition);
	}
	toSql() {
		return renderSelectSqlWithJoins(this.table, this.whereClause);
	}
	build() {
		return this;
	}
};
var TableRefImpl = class {
	[QueryBrand] = true;
	type = "table";
	sourceName;
	accessorName;
	cols;
	indexedCols;
	tableDef;
	get columns() {
		return this.tableDef.columns;
	}
	get indexes() {
		return this.tableDef.indexes;
	}
	get rowType() {
		return this.tableDef.rowType;
	}
	get constraints() {
		return this.tableDef.constraints;
	}
	constructor(tableDef) {
		this.sourceName = tableDef.sourceName;
		this.accessorName = tableDef.accessorName;
		this.cols = createRowExpr(tableDef);
		this.indexedCols = this.cols;
		this.tableDef = tableDef;
		Object.freeze(this);
	}
	asFrom() {
		return new FromBuilder(this);
	}
	rightSemijoin(other, on) {
		return this.asFrom().rightSemijoin(other, on);
	}
	leftSemijoin(other, on) {
		return this.asFrom().leftSemijoin(other, on);
	}
	build() {
		return this.asFrom().build();
	}
	toSql() {
		return this.asFrom().toSql();
	}
	where(predicate) {
		return this.asFrom().where(predicate);
	}
};
function createTableRefFromDef(tableDef) {
	return new TableRefImpl(tableDef);
}
function makeQueryBuilder(schema2) {
	const qb = /* @__PURE__ */ Object.create(null);
	for (const table2 of Object.values(schema2.tables)) {
		const ref = createTableRefFromDef(table2);
		qb[table2.accessorName] = ref;
	}
	return Object.freeze(qb);
}
function createRowExpr(tableDef) {
	const row = {};
	for (const columnName of Object.keys(tableDef.columns)) {
		const columnBuilder = tableDef.columns[columnName];
		const column = new ColumnExpression(tableDef.sourceName, columnName, columnBuilder.typeBuilder.algebraicType);
		row[columnName] = Object.freeze(column);
	}
	return Object.freeze(row);
}
function renderSelectSqlWithJoins(table2, where, extraClauses = []) {
	const sql = `SELECT * FROM ${quoteIdentifier(table2.sourceName)}`;
	const clauses = [];
	if (where) clauses.push(booleanExprToSql(where));
	clauses.push(...extraClauses);
	if (clauses.length === 0) return sql;
	return `${sql} WHERE ${clauses.length === 1 ? clauses[0] : clauses.map(wrapInParens).join(" AND ")}`;
}
var ColumnExpression = class {
	type = "column";
	column;
	table;
	tsValueType;
	spacetimeType;
	constructor(table2, column, spacetimeType) {
		this.table = table2;
		this.column = column;
		this.spacetimeType = spacetimeType;
	}
	eq(x) {
		return new BooleanExpr({
			type: "eq",
			left: this,
			right: normalizeValue(x)
		});
	}
	ne(x) {
		return new BooleanExpr({
			type: "ne",
			left: this,
			right: normalizeValue(x)
		});
	}
	lt(x) {
		return new BooleanExpr({
			type: "lt",
			left: this,
			right: normalizeValue(x)
		});
	}
	lte(x) {
		return new BooleanExpr({
			type: "lte",
			left: this,
			right: normalizeValue(x)
		});
	}
	gt(x) {
		return new BooleanExpr({
			type: "gt",
			left: this,
			right: normalizeValue(x)
		});
	}
	gte(x) {
		return new BooleanExpr({
			type: "gte",
			left: this,
			right: normalizeValue(x)
		});
	}
};
function literal(value) {
	return {
		type: "literal",
		value
	};
}
function normalizeValue(val) {
	if (val.type === "literal") return val;
	if (typeof val === "object" && val != null && "type" in val && val.type === "column") return val;
	return literal(val);
}
var BooleanExpr = class _BooleanExpr {
	constructor(data) {
		this.data = data;
	}
	and(other) {
		return new _BooleanExpr({
			type: "and",
			clauses: [this.data, other.data]
		});
	}
	or(other) {
		return new _BooleanExpr({
			type: "or",
			clauses: [this.data, other.data]
		});
	}
	not() {
		return new _BooleanExpr({
			type: "not",
			clause: this.data
		});
	}
};
function booleanExprToSql(expr, tableAlias) {
	const data = expr instanceof BooleanExpr ? expr.data : expr;
	switch (data.type) {
		case "eq": return `${valueExprToSql(data.left)} = ${valueExprToSql(data.right)}`;
		case "ne": return `${valueExprToSql(data.left)} <> ${valueExprToSql(data.right)}`;
		case "gt": return `${valueExprToSql(data.left)} > ${valueExprToSql(data.right)}`;
		case "gte": return `${valueExprToSql(data.left)} >= ${valueExprToSql(data.right)}`;
		case "lt": return `${valueExprToSql(data.left)} < ${valueExprToSql(data.right)}`;
		case "lte": return `${valueExprToSql(data.left)} <= ${valueExprToSql(data.right)}`;
		case "and": return data.clauses.map((c) => booleanExprToSql(c)).map(wrapInParens).join(" AND ");
		case "or": return data.clauses.map((c) => booleanExprToSql(c)).map(wrapInParens).join(" OR ");
		case "not": return `NOT ${wrapInParens(booleanExprToSql(data.clause))}`;
	}
}
function wrapInParens(sql) {
	return `(${sql})`;
}
function valueExprToSql(expr, tableAlias) {
	if (isLiteralExpr(expr)) return literalValueToSql(expr.value);
	const table2 = expr.table;
	return `${quoteIdentifier(table2)}.${quoteIdentifier(expr.column)}`;
}
function literalValueToSql(value) {
	if (value === null || value === void 0) return "NULL";
	if (value instanceof Identity || value instanceof ConnectionId) return `0x${value.toHexString()}`;
	if (value instanceof Timestamp) return `'${value.toISOString()}'`;
	switch (typeof value) {
		case "number":
		case "bigint": return String(value);
		case "boolean": return value ? "TRUE" : "FALSE";
		case "string": return `'${value.replace(/'/g, "''")}'`;
		default: return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
	}
}
function quoteIdentifier(name) {
	return `"${name.replace(/"/g, "\"\"")}"`;
}
function isLiteralExpr(expr) {
	return expr.type === "literal";
}
function makeViewExport(ctx, opts, params, ret, fn) {
	const viewExport = fn.bind();
	viewExport[exportContext] = ctx;
	viewExport[registerExport] = (ctx2, exportName) => {
		registerView(ctx2, opts, exportName, false, params, ret, fn);
	};
	return viewExport;
}
function makeAnonViewExport(ctx, opts, params, ret, fn) {
	const viewExport = fn.bind();
	viewExport[exportContext] = ctx;
	viewExport[registerExport] = (ctx2, exportName) => {
		registerView(ctx2, opts, exportName, true, params, ret, fn);
	};
	return viewExport;
}
function registerView(ctx, opts, exportName, anon, params, ret, fn) {
	const paramsBuilder = new RowBuilder(params, toPascalCase(exportName));
	let returnType = ctx.registerTypesRecursively(ret).algebraicType;
	const { typespace } = ctx;
	const { value: paramType } = ctx.resolveType(ctx.registerTypesRecursively(paramsBuilder));
	ctx.moduleDef.views.push({
		sourceName: exportName,
		index: (anon ? ctx.anonViews : ctx.views).length,
		isPublic: opts.public,
		isAnonymous: anon,
		params: paramType,
		returnType
	});
	if (opts.name != null) ctx.moduleDef.explicitNames.entries.push({
		tag: "Function",
		value: {
			sourceName: exportName,
			canonicalName: opts.name
		}
	});
	if (returnType.tag == "Sum") {
		const originalFn = fn;
		fn = ((ctx2, args) => {
			const ret2 = originalFn(ctx2, args);
			return ret2 == null ? [] : [ret2];
		});
		returnType = AlgebraicType.Array(returnType.value.variants[0].algebraicType);
	}
	(anon ? ctx.anonViews : ctx.views).push({
		fn,
		deserializeParams: ProductType.makeDeserializer(paramType, typespace),
		serializeReturn: AlgebraicType.makeSerializer(returnType, typespace),
		returnTypeBaseSize: bsatnBaseSize(typespace, returnType)
	});
}
var SenderError = class extends Error {
	constructor(message) {
		super(message);
	}
	get name() {
		return "SenderError";
	}
};
var SpacetimeHostError = class extends Error {
	constructor(message) {
		super(message);
	}
	get name() {
		return "SpacetimeHostError";
	}
};
var errorData = {
	HostCallFailure: 1,
	NotInTransaction: 2,
	BsatnDecodeError: 3,
	NoSuchTable: 4,
	NoSuchIndex: 5,
	NoSuchIter: 6,
	NoSuchConsoleTimer: 7,
	NoSuchBytes: 8,
	NoSpace: 9,
	BufferTooSmall: 11,
	UniqueAlreadyExists: 12,
	ScheduleAtDelayTooLong: 13,
	IndexNotUnique: 14,
	NoSuchRow: 15,
	AutoIncOverflow: 16,
	WouldBlockTransaction: 17,
	TransactionNotAnonymous: 18,
	TransactionIsReadOnly: 19,
	TransactionIsMut: 20,
	HttpError: 21
};
function mapEntries(x, f) {
	return Object.fromEntries(Object.entries(x).map(([k, v]) => [k, f(k, v)]));
}
var errnoToClass = /* @__PURE__ */ new Map();
var errors = Object.freeze(mapEntries(errorData, (name, code) => {
	const cls = Object.defineProperty(class extends SpacetimeHostError {
		get name() {
			return name;
		}
	}, "name", {
		value: name,
		writable: false
	});
	errnoToClass.set(code, cls);
	return cls;
}));
function getErrorConstructor(code) {
	return errnoToClass.get(code) ?? SpacetimeHostError;
}
var SBigInt = typeof BigInt !== "undefined" ? BigInt : void 0;
var One = typeof BigInt !== "undefined" ? BigInt(1) : void 0;
var ThirtyTwo = typeof BigInt !== "undefined" ? BigInt(32) : void 0;
var NumValues = typeof BigInt !== "undefined" ? BigInt(4294967296) : void 0;
function unsafeUniformBigIntDistribution(from, to, rng) {
	var diff = to - from + One;
	var FinalNumValues = NumValues;
	var NumIterations = 1;
	while (FinalNumValues < diff) {
		FinalNumValues <<= ThirtyTwo;
		++NumIterations;
	}
	var value = generateNext(NumIterations, rng);
	if (value < diff) return value + from;
	if (value + diff < FinalNumValues) return value % diff + from;
	var MaxAcceptedRandom = FinalNumValues - FinalNumValues % diff;
	while (value >= MaxAcceptedRandom) value = generateNext(NumIterations, rng);
	return value % diff + from;
}
function generateNext(NumIterations, rng) {
	var value = SBigInt(rng.unsafeNext() + 2147483648);
	for (var num = 1; num < NumIterations; ++num) {
		var out = rng.unsafeNext();
		value = (value << ThirtyTwo) + SBigInt(out + 2147483648);
	}
	return value;
}
function unsafeUniformIntDistributionInternal(rangeSize, rng) {
	var MaxAllowed = rangeSize > 2 ? ~~(4294967296 / rangeSize) * rangeSize : 4294967296;
	var deltaV = rng.unsafeNext() + 2147483648;
	while (deltaV >= MaxAllowed) deltaV = rng.unsafeNext() + 2147483648;
	return deltaV % rangeSize;
}
function fromNumberToArrayInt64(out, n) {
	if (n < 0) {
		var posN = -n;
		out.sign = -1;
		out.data[0] = ~~(posN / 4294967296);
		out.data[1] = posN >>> 0;
	} else {
		out.sign = 1;
		out.data[0] = ~~(n / 4294967296);
		out.data[1] = n >>> 0;
	}
	return out;
}
function substractArrayInt64(out, arrayIntA, arrayIntB) {
	var lowA = arrayIntA.data[1];
	var highA = arrayIntA.data[0];
	var signA = arrayIntA.sign;
	var lowB = arrayIntB.data[1];
	var highB = arrayIntB.data[0];
	var signB = arrayIntB.sign;
	out.sign = 1;
	if (signA === 1 && signB === -1) {
		var low_1 = lowA + lowB;
		var high = highA + highB + (low_1 > 4294967295 ? 1 : 0);
		out.data[0] = high >>> 0;
		out.data[1] = low_1 >>> 0;
		return out;
	}
	var lowFirst = lowA;
	var highFirst = highA;
	var lowSecond = lowB;
	var highSecond = highB;
	if (signA === -1) {
		lowFirst = lowB;
		highFirst = highB;
		lowSecond = lowA;
		highSecond = highA;
	}
	var reminderLow = 0;
	var low = lowFirst - lowSecond;
	if (low < 0) {
		reminderLow = 1;
		low = low >>> 0;
	}
	out.data[0] = highFirst - highSecond - reminderLow;
	out.data[1] = low;
	return out;
}
function unsafeUniformArrayIntDistributionInternal(out, rangeSize, rng) {
	var rangeLength = rangeSize.length;
	while (true) {
		for (var index = 0; index !== rangeLength; ++index) out[index] = unsafeUniformIntDistributionInternal(index === 0 ? rangeSize[0] + 1 : 4294967296, rng);
		for (var index = 0; index !== rangeLength; ++index) {
			var current = out[index];
			var currentInRange = rangeSize[index];
			if (current < currentInRange) return out;
			else if (current > currentInRange) break;
		}
	}
}
var safeNumberMaxSafeInteger = Number.MAX_SAFE_INTEGER;
var sharedA = {
	sign: 1,
	data: [0, 0]
};
var sharedB = {
	sign: 1,
	data: [0, 0]
};
var sharedC = {
	sign: 1,
	data: [0, 0]
};
var sharedData = [0, 0];
function uniformLargeIntInternal(from, to, rangeSize, rng) {
	var rangeSizeArrayIntValue = rangeSize <= safeNumberMaxSafeInteger ? fromNumberToArrayInt64(sharedC, rangeSize) : substractArrayInt64(sharedC, fromNumberToArrayInt64(sharedA, to), fromNumberToArrayInt64(sharedB, from));
	if (rangeSizeArrayIntValue.data[1] === 4294967295) {
		rangeSizeArrayIntValue.data[0] += 1;
		rangeSizeArrayIntValue.data[1] = 0;
	} else rangeSizeArrayIntValue.data[1] += 1;
	unsafeUniformArrayIntDistributionInternal(sharedData, rangeSizeArrayIntValue.data, rng);
	return sharedData[0] * 4294967296 + sharedData[1] + from;
}
function unsafeUniformIntDistribution(from, to, rng) {
	var rangeSize = to - from;
	if (rangeSize <= 4294967295) return unsafeUniformIntDistributionInternal(rangeSize + 1, rng) + from;
	return uniformLargeIntInternal(from, to, rangeSize, rng);
}
var XoroShiro128Plus = (function() {
	function XoroShiro128Plus2(s01, s00, s11, s10) {
		this.s01 = s01;
		this.s00 = s00;
		this.s11 = s11;
		this.s10 = s10;
	}
	XoroShiro128Plus2.prototype.clone = function() {
		return new XoroShiro128Plus2(this.s01, this.s00, this.s11, this.s10);
	};
	XoroShiro128Plus2.prototype.next = function() {
		var nextRng = new XoroShiro128Plus2(this.s01, this.s00, this.s11, this.s10);
		return [nextRng.unsafeNext(), nextRng];
	};
	XoroShiro128Plus2.prototype.unsafeNext = function() {
		var out = this.s00 + this.s10 | 0;
		var a0 = this.s10 ^ this.s00;
		var a1 = this.s11 ^ this.s01;
		var s00 = this.s00;
		var s01 = this.s01;
		this.s00 = s00 << 24 ^ s01 >>> 8 ^ a0 ^ a0 << 16;
		this.s01 = s01 << 24 ^ s00 >>> 8 ^ a1 ^ (a1 << 16 | a0 >>> 16);
		this.s10 = a1 << 5 ^ a0 >>> 27;
		this.s11 = a0 << 5 ^ a1 >>> 27;
		return out;
	};
	XoroShiro128Plus2.prototype.jump = function() {
		var nextRng = new XoroShiro128Plus2(this.s01, this.s00, this.s11, this.s10);
		nextRng.unsafeJump();
		return nextRng;
	};
	XoroShiro128Plus2.prototype.unsafeJump = function() {
		var ns01 = 0;
		var ns00 = 0;
		var ns11 = 0;
		var ns10 = 0;
		var jump = [
			3639956645,
			3750757012,
			1261568508,
			386426335
		];
		for (var i = 0; i !== 4; ++i) for (var mask = 1; mask; mask <<= 1) {
			if (jump[i] & mask) {
				ns01 ^= this.s01;
				ns00 ^= this.s00;
				ns11 ^= this.s11;
				ns10 ^= this.s10;
			}
			this.unsafeNext();
		}
		this.s01 = ns01;
		this.s00 = ns00;
		this.s11 = ns11;
		this.s10 = ns10;
	};
	XoroShiro128Plus2.prototype.getState = function() {
		return [
			this.s01,
			this.s00,
			this.s11,
			this.s10
		];
	};
	return XoroShiro128Plus2;
})();
function fromState(state) {
	if (!(state.length === 4)) throw new Error("The state must have been produced by a xoroshiro128plus RandomGenerator");
	return new XoroShiro128Plus(state[0], state[1], state[2], state[3]);
}
var xoroshiro128plus = Object.assign(function(seed) {
	return new XoroShiro128Plus(-1, ~seed, seed | 0, 0);
}, { fromState });
var { asUintN } = BigInt;
function pcg32(state) {
	state = asUintN(64, state * 6364136223846793005n + 11634580027462260723n);
	const xorshifted = Number(asUintN(32, (state >> 18n ^ state) >> 27n));
	const rot = Number(asUintN(32, state >> 59n));
	return xorshifted >> rot | xorshifted << 32 - rot;
}
function generateFloat64(rng) {
	const g1 = unsafeUniformIntDistribution(0, (1 << 26) - 1, rng);
	const g2 = unsafeUniformIntDistribution(0, (1 << 27) - 1, rng);
	return (g1 * Math.pow(2, 27) + g2) * Math.pow(2, -53);
}
function makeRandom(seed) {
	const rng = xoroshiro128plus(pcg32(seed.microsSinceUnixEpoch));
	const random = () => generateFloat64(rng);
	random.fill = (array) => {
		const elem = array.at(0);
		if (typeof elem === "bigint") {
			const upper = (1n << BigInt(array.BYTES_PER_ELEMENT * 8)) - 1n;
			for (let i = 0; i < array.length; i++) array[i] = unsafeUniformBigIntDistribution(0n, upper, rng);
		} else if (typeof elem === "number") {
			const upper = (1 << array.BYTES_PER_ELEMENT * 8) - 1;
			for (let i = 0; i < array.length; i++) array[i] = unsafeUniformIntDistribution(0, upper, rng);
		}
		return array;
	};
	random.uint32 = () => rng.unsafeNext();
	random.integerInRange = (min, max) => unsafeUniformIntDistribution(min, max, rng);
	random.bigintInRange = (min, max) => unsafeUniformBigIntDistribution(min, max, rng);
	return random;
}
var { freeze } = Object;
var sys = _syscalls2_0;
function parseJsonObject(json) {
	let value;
	try {
		value = JSON.parse(json);
	} catch {
		throw new Error("Invalid JSON: failed to parse string");
	}
	if (value === null || typeof value !== "object" || Array.isArray(value)) throw new Error("Expected a JSON object at the top level");
	return value;
}
var JwtClaimsImpl = class {
	/**
	* Creates a new JwtClaims instance.
	* @param rawPayload The JWT payload as a raw JSON string.
	* @param identity The identity for this JWT. We are only taking this because we don't have a blake3 implementation (which we need to compute it).
	*/
	constructor(rawPayload, identity) {
		this.rawPayload = rawPayload;
		this.fullPayload = parseJsonObject(rawPayload);
		this._identity = identity;
	}
	fullPayload;
	_identity;
	get identity() {
		return this._identity;
	}
	get subject() {
		return this.fullPayload["sub"];
	}
	get issuer() {
		return this.fullPayload["iss"];
	}
	get audience() {
		const aud = this.fullPayload["aud"];
		if (aud == null) return [];
		return typeof aud === "string" ? [aud] : aud;
	}
};
var AuthCtxImpl = class _AuthCtxImpl {
	isInternal;
	_jwtSource;
	_initializedJWT = false;
	_jwtClaims;
	_senderIdentity;
	constructor(opts) {
		this.isInternal = opts.isInternal;
		this._jwtSource = opts.jwtSource;
		this._senderIdentity = opts.senderIdentity;
	}
	_initializeJWT() {
		if (this._initializedJWT) return;
		this._initializedJWT = true;
		const token = this._jwtSource();
		if (!token) this._jwtClaims = null;
		else this._jwtClaims = new JwtClaimsImpl(token, this._senderIdentity);
		Object.freeze(this);
	}
	/** Lazily compute whether a JWT exists and is parseable. */
	get hasJWT() {
		this._initializeJWT();
		return this._jwtClaims !== null;
	}
	/** Lazily parse the JwtClaims only when accessed. */
	get jwt() {
		this._initializeJWT();
		return this._jwtClaims;
	}
	/** Create a context representing internal (non-user) requests. */
	static internal() {
		return new _AuthCtxImpl({
			isInternal: true,
			jwtSource: () => null,
			senderIdentity: Identity.zero()
		});
	}
	/** If there is a connection id, look up the JWT payload from the system tables. */
	static fromSystemTables(connectionId, sender) {
		if (connectionId === null) return new _AuthCtxImpl({
			isInternal: false,
			jwtSource: () => null,
			senderIdentity: sender
		});
		return new _AuthCtxImpl({
			isInternal: false,
			jwtSource: () => {
				const payloadBuf = sys.get_jwt_payload(connectionId.__connection_id__);
				if (payloadBuf.length === 0) return null;
				return new TextDecoder().decode(payloadBuf);
			},
			senderIdentity: sender
		});
	}
};
var ReducerCtxImpl = class ReducerCtx {
	#identity;
	#senderAuth;
	#uuidCounter;
	#random;
	sender;
	timestamp;
	connectionId;
	db;
	constructor(sender, timestamp, connectionId, dbView) {
		Object.seal(this);
		this.sender = sender;
		this.timestamp = timestamp;
		this.connectionId = connectionId;
		this.db = dbView;
	}
	/** Reset the `ReducerCtx` to be used for a new transaction */
	static reset(me, sender, timestamp, connectionId) {
		me.sender = sender;
		me.timestamp = timestamp;
		me.connectionId = connectionId;
		me.#uuidCounter = void 0;
		me.#senderAuth = void 0;
	}
	get identity() {
		return this.#identity ??= new Identity(sys.identity());
	}
	get senderAuth() {
		return this.#senderAuth ??= AuthCtxImpl.fromSystemTables(this.connectionId, this.sender);
	}
	get random() {
		return this.#random ??= makeRandom(this.timestamp);
	}
	/**
	* Create a new random {@link Uuid} `v4` using this `ReducerCtx`'s RNG.
	*/
	newUuidV4() {
		const bytes = this.random.fill(new Uint8Array(16));
		return Uuid.fromRandomBytesV4(bytes);
	}
	/**
	* Create a new sortable {@link Uuid} `v7` using this `ReducerCtx`'s RNG, counter,
	* and timestamp.
	*/
	newUuidV7() {
		const bytes = this.random.fill(new Uint8Array(4));
		const counter = this.#uuidCounter ??= { value: 0 };
		return Uuid.fromCounterV7(counter, this.timestamp, bytes);
	}
};
var callUserFunction = function __spacetimedb_end_short_backtrace(fn, ...args) {
	return fn(...args);
};
var makeHooks = (schema2) => new ModuleHooksImpl(schema2);
var ModuleHooksImpl = class {
	#schema;
	#dbView_;
	#reducerArgsDeserializers;
	/** Cache the `ReducerCtx` object to avoid allocating anew for ever reducer call. */
	#reducerCtx_;
	constructor(schema2) {
		this.#schema = schema2;
		this.#reducerArgsDeserializers = schema2.moduleDef.reducers.map(({ params }) => ProductType.makeDeserializer(params, schema2.typespace));
	}
	get #dbView() {
		return this.#dbView_ ??= freeze(Object.fromEntries(Object.values(this.#schema.schemaType.tables).map((table2) => [table2.accessorName, makeTableView(this.#schema.typespace, table2.tableDef)])));
	}
	get #reducerCtx() {
		return this.#reducerCtx_ ??= new ReducerCtxImpl(Identity.zero(), Timestamp.UNIX_EPOCH, null, this.#dbView);
	}
	__describe_module__() {
		const writer = new BinaryWriter(128);
		RawModuleDef.serialize(writer, RawModuleDef.V10(this.#schema.rawModuleDefV10()));
		return writer.getBuffer();
	}
	__get_error_constructor__(code) {
		return getErrorConstructor(code);
	}
	get __sender_error_class__() {
		return SenderError;
	}
	__call_reducer__(reducerId, sender, connId, timestamp, argsBuf) {
		const moduleCtx = this.#schema;
		const deserializeArgs = this.#reducerArgsDeserializers[reducerId];
		BINARY_READER.reset(argsBuf);
		const args = deserializeArgs(BINARY_READER);
		const senderIdentity = new Identity(sender);
		const ctx = this.#reducerCtx;
		ReducerCtxImpl.reset(ctx, senderIdentity, new Timestamp(timestamp), ConnectionId.nullIfZero(new ConnectionId(connId)));
		callUserFunction(moduleCtx.reducers[reducerId], ctx, args);
	}
	__call_view__(id, sender, argsBuf) {
		const moduleCtx = this.#schema;
		const { fn, deserializeParams, serializeReturn, returnTypeBaseSize } = moduleCtx.views[id];
		const ret = callUserFunction(fn, freeze({
			sender: new Identity(sender),
			db: this.#dbView,
			from: makeQueryBuilder(moduleCtx.schemaType)
		}), deserializeParams(new BinaryReader(argsBuf)));
		const retBuf = new BinaryWriter(returnTypeBaseSize);
		if (isRowTypedQuery(ret)) {
			const query = toSql(ret);
			ViewResultHeader.serialize(retBuf, ViewResultHeader.RawSql(query));
		} else {
			ViewResultHeader.serialize(retBuf, ViewResultHeader.RowData);
			serializeReturn(retBuf, ret);
		}
		return { data: retBuf.getBuffer() };
	}
	__call_view_anon__(id, argsBuf) {
		const moduleCtx = this.#schema;
		const { fn, deserializeParams, serializeReturn, returnTypeBaseSize } = moduleCtx.anonViews[id];
		const ret = callUserFunction(fn, freeze({
			db: this.#dbView,
			from: makeQueryBuilder(moduleCtx.schemaType)
		}), deserializeParams(new BinaryReader(argsBuf)));
		const retBuf = new BinaryWriter(returnTypeBaseSize);
		if (isRowTypedQuery(ret)) {
			const query = toSql(ret);
			ViewResultHeader.serialize(retBuf, ViewResultHeader.RawSql(query));
		} else {
			ViewResultHeader.serialize(retBuf, ViewResultHeader.RowData);
			serializeReturn(retBuf, ret);
		}
		return { data: retBuf.getBuffer() };
	}
	__call_procedure__(id, sender, connection_id, timestamp, args) {
		return callProcedure(this.#schema, id, new Identity(sender), ConnectionId.nullIfZero(new ConnectionId(connection_id)), new Timestamp(timestamp), args, () => this.#dbView);
	}
};
var BINARY_WRITER = new BinaryWriter(0);
var BINARY_READER = new BinaryReader(new Uint8Array());
function makeTableView(typespace, table2) {
	const table_id = sys.table_id_from_name(table2.sourceName);
	const rowType = typespace.types[table2.productTypeRef];
	if (rowType.tag !== "Product") throw "impossible";
	const serializeRow = AlgebraicType.makeSerializer(rowType, typespace);
	const deserializeRow = AlgebraicType.makeDeserializer(rowType, typespace);
	const sequences = table2.sequences.map((seq) => {
		const col = rowType.value.elements[seq.column];
		const colType = col.algebraicType;
		let sequenceTrigger;
		switch (colType.tag) {
			case "U8":
			case "I8":
			case "U16":
			case "I16":
			case "U32":
			case "I32":
				sequenceTrigger = 0;
				break;
			case "U64":
			case "I64":
			case "U128":
			case "I128":
			case "U256":
			case "I256":
				sequenceTrigger = 0n;
				break;
			default: throw new TypeError("invalid sequence type");
		}
		return {
			colName: col.name,
			sequenceTrigger,
			deserialize: AlgebraicType.makeDeserializer(colType, typespace)
		};
	});
	const hasAutoIncrement = sequences.length > 0;
	const iter = () => tableIterator(sys.datastore_table_scan_bsatn(table_id), deserializeRow);
	const integrateGeneratedColumns = hasAutoIncrement ? (row, ret_buf) => {
		BINARY_READER.reset(ret_buf);
		for (const { colName, deserialize, sequenceTrigger } of sequences) if (row[colName] === sequenceTrigger) row[colName] = deserialize(BINARY_READER);
	} : null;
	const tableMethods = {
		count: () => sys.datastore_table_row_count(table_id),
		iter,
		[Symbol.iterator]: () => iter(),
		insert: (row) => {
			const buf = LEAF_BUF;
			BINARY_WRITER.reset(buf);
			serializeRow(BINARY_WRITER, row);
			sys.datastore_insert_bsatn(table_id, buf.buffer, BINARY_WRITER.offset);
			const ret = { ...row };
			integrateGeneratedColumns?.(ret, buf.view);
			return ret;
		},
		delete: (row) => {
			const buf = LEAF_BUF;
			BINARY_WRITER.reset(buf);
			BINARY_WRITER.writeU32(1);
			serializeRow(BINARY_WRITER, row);
			return sys.datastore_delete_all_by_eq_bsatn(table_id, buf.buffer, BINARY_WRITER.offset) > 0;
		}
	};
	const tableView = Object.assign(/* @__PURE__ */ Object.create(null), tableMethods);
	for (const indexDef of table2.indexes) {
		const index_id = sys.index_id_from_name(indexDef.sourceName);
		let column_ids;
		let isHashIndex = false;
		switch (indexDef.algorithm.tag) {
			case "Hash":
				isHashIndex = true;
				column_ids = indexDef.algorithm.value;
				break;
			case "BTree":
				column_ids = indexDef.algorithm.value;
				break;
			case "Direct":
				column_ids = [indexDef.algorithm.value];
				break;
		}
		const numColumns = column_ids.length;
		const columnSet = new Set(column_ids);
		const isUnique = table2.constraints.filter((x) => x.data.tag === "Unique").some((x) => columnSet.isSubsetOf(new Set(x.data.value.columns)));
		const isPrimaryKey = isUnique && column_ids.length === table2.primaryKey.length && column_ids.every((id, i) => table2.primaryKey[i] === id);
		const indexSerializers = column_ids.map((id) => AlgebraicType.makeSerializer(rowType.value.elements[id].algebraicType, typespace));
		const serializePoint = (buffer, colVal) => {
			BINARY_WRITER.reset(buffer);
			for (let i = 0; i < numColumns; i++) indexSerializers[i](BINARY_WRITER, colVal[i]);
			return BINARY_WRITER.offset;
		};
		const serializeSingleElement = numColumns === 1 ? indexSerializers[0] : null;
		const serializeSinglePoint = serializeSingleElement && ((buffer, colVal) => {
			BINARY_WRITER.reset(buffer);
			serializeSingleElement(BINARY_WRITER, colVal);
			return BINARY_WRITER.offset;
		});
		let index;
		if (isUnique && serializeSinglePoint) {
			const base = {
				find: (colVal) => {
					const buf = LEAF_BUF;
					const point_len = serializeSinglePoint(buf, colVal);
					return tableIterateOne(sys.datastore_index_scan_point_bsatn(index_id, buf.buffer, point_len), deserializeRow);
				},
				delete: (colVal) => {
					const buf = LEAF_BUF;
					const point_len = serializeSinglePoint(buf, colVal);
					return sys.datastore_delete_by_index_scan_point_bsatn(index_id, buf.buffer, point_len) > 0;
				}
			};
			if (isPrimaryKey) base.update = (row) => {
				const buf = LEAF_BUF;
				BINARY_WRITER.reset(buf);
				serializeRow(BINARY_WRITER, row);
				sys.datastore_update_bsatn(table_id, index_id, buf.buffer, BINARY_WRITER.offset);
				integrateGeneratedColumns?.(row, buf.view);
				return row;
			};
			index = base;
		} else if (isUnique) {
			const base = {
				find: (colVal) => {
					if (colVal.length !== numColumns) throw new TypeError("wrong number of elements");
					const buf = LEAF_BUF;
					const point_len = serializePoint(buf, colVal);
					return tableIterateOne(sys.datastore_index_scan_point_bsatn(index_id, buf.buffer, point_len), deserializeRow);
				},
				delete: (colVal) => {
					if (colVal.length !== numColumns) throw new TypeError("wrong number of elements");
					const buf = LEAF_BUF;
					const point_len = serializePoint(buf, colVal);
					return sys.datastore_delete_by_index_scan_point_bsatn(index_id, buf.buffer, point_len) > 0;
				}
			};
			if (isPrimaryKey) base.update = (row) => {
				const buf = LEAF_BUF;
				BINARY_WRITER.reset(buf);
				serializeRow(BINARY_WRITER, row);
				sys.datastore_update_bsatn(table_id, index_id, buf.buffer, BINARY_WRITER.offset);
				integrateGeneratedColumns?.(row, buf.view);
				return row;
			};
			index = base;
		} else if (serializeSinglePoint) {
			const rawIndex = {
				filter: (range) => {
					const buf = LEAF_BUF;
					const point_len = serializeSinglePoint(buf, range);
					return tableIterator(sys.datastore_index_scan_point_bsatn(index_id, buf.buffer, point_len), deserializeRow);
				},
				delete: (range) => {
					const buf = LEAF_BUF;
					const point_len = serializeSinglePoint(buf, range);
					return sys.datastore_delete_by_index_scan_point_bsatn(index_id, buf.buffer, point_len);
				}
			};
			if (isHashIndex) index = rawIndex;
			else index = rawIndex;
		} else if (isHashIndex) index = {
			filter: (range) => {
				const buf = LEAF_BUF;
				const point_len = serializePoint(buf, range);
				return tableIterator(sys.datastore_index_scan_point_bsatn(index_id, buf.buffer, point_len), deserializeRow);
			},
			delete: (range) => {
				const buf = LEAF_BUF;
				const point_len = serializePoint(buf, range);
				return sys.datastore_delete_by_index_scan_point_bsatn(index_id, buf.buffer, point_len);
			}
		};
		else {
			const serializeRange = (buffer, range) => {
				if (range.length > numColumns) throw new TypeError("too many elements");
				BINARY_WRITER.reset(buffer);
				const writer = BINARY_WRITER;
				const prefix_elems = range.length - 1;
				for (let i = 0; i < prefix_elems; i++) indexSerializers[i](writer, range[i]);
				const rstartOffset = writer.offset;
				const term = range[range.length - 1];
				const serializeTerm = indexSerializers[range.length - 1];
				if (term instanceof Range) {
					const writeBound = (bound) => {
						writer.writeU8({
							included: 0,
							excluded: 1,
							unbounded: 2
						}[bound.tag]);
						if (bound.tag !== "unbounded") serializeTerm(writer, bound.value);
					};
					writeBound(term.from);
					const rstartLen = writer.offset - rstartOffset;
					writeBound(term.to);
					return [
						rstartOffset,
						prefix_elems,
						rstartLen,
						writer.offset - rstartLen
					];
				} else {
					writer.writeU8(0);
					serializeTerm(writer, term);
					return [
						rstartOffset,
						prefix_elems,
						writer.offset,
						0
					];
				}
			};
			index = {
				filter: (range) => {
					if (range.length === numColumns) {
						const buf = LEAF_BUF;
						const point_len = serializePoint(buf, range);
						return tableIterator(sys.datastore_index_scan_point_bsatn(index_id, buf.buffer, point_len), deserializeRow);
					} else {
						const buf = LEAF_BUF;
						const args = serializeRange(buf, range);
						return tableIterator(sys.datastore_index_scan_range_bsatn(index_id, buf.buffer, ...args), deserializeRow);
					}
				},
				delete: (range) => {
					if (range.length === numColumns) {
						const buf = LEAF_BUF;
						const point_len = serializePoint(buf, range);
						return sys.datastore_delete_by_index_scan_point_bsatn(index_id, buf.buffer, point_len);
					} else {
						const buf = LEAF_BUF;
						const args = serializeRange(buf, range);
						return sys.datastore_delete_by_index_scan_range_bsatn(index_id, buf.buffer, ...args);
					}
				}
			};
		}
		if (Object.hasOwn(tableView, indexDef.accessorName)) freeze(Object.assign(tableView[indexDef.accessorName], index));
		else tableView[indexDef.accessorName] = freeze(index);
	}
	return freeze(tableView);
}
function* tableIterator(id, deserialize) {
	using iter = new IteratorHandle(id);
	const iterBuf = takeBuf();
	try {
		let amt;
		while (amt = iter.advance(iterBuf)) {
			const reader = new BinaryReader(iterBuf.view);
			while (reader.offset < amt) yield deserialize(reader);
		}
	} finally {
		returnBuf(iterBuf);
	}
}
function tableIterateOne(id, deserialize) {
	const buf = LEAF_BUF;
	if (advanceIterRaw(id, buf) !== 0) {
		BINARY_READER.reset(buf.view);
		return deserialize(BINARY_READER);
	}
	return null;
}
function advanceIterRaw(id, buf) {
	while (true) try {
		return 0 | sys.row_iter_bsatn_advance(id, buf.buffer);
	} catch (e) {
		if (e && typeof e === "object" && hasOwn(e, "__buffer_too_small__")) {
			buf.grow(e.__buffer_too_small__);
			continue;
		}
		throw e;
	}
}
var DEFAULT_BUFFER_CAPACITY = 32 * 1024 * 2;
var ITER_BUFS = [new ResizableBuffer(DEFAULT_BUFFER_CAPACITY)];
var ITER_BUF_COUNT = 1;
function takeBuf() {
	return ITER_BUF_COUNT ? ITER_BUFS[--ITER_BUF_COUNT] : new ResizableBuffer(DEFAULT_BUFFER_CAPACITY);
}
function returnBuf(buf) {
	ITER_BUFS[ITER_BUF_COUNT++] = buf;
}
var LEAF_BUF = new ResizableBuffer(DEFAULT_BUFFER_CAPACITY);
var IteratorHandle = class _IteratorHandle {
	#id;
	static #finalizationRegistry = new FinalizationRegistry(sys.row_iter_bsatn_close);
	constructor(id) {
		this.#id = id;
		_IteratorHandle.#finalizationRegistry.register(this, id, this);
	}
	/** Unregister this object with the finalization registry and return the id */
	#detach() {
		const id = this.#id;
		this.#id = -1;
		_IteratorHandle.#finalizationRegistry.unregister(this);
		return id;
	}
	/** Call `row_iter_bsatn_advance`, returning 0 if this iterator has been exhausted. */
	advance(buf) {
		if (this.#id === -1) return 0;
		const ret = advanceIterRaw(this.#id, buf);
		if (ret <= 0) this.#detach();
		return ret < 0 ? -ret : ret;
	}
	[Symbol.dispose]() {
		if (this.#id >= 0) {
			const id = this.#detach();
			sys.row_iter_bsatn_close(id);
		}
	}
};
var { freeze: freeze2 } = Object;
var textEncoder = new TextEncoder();
var textDecoder = new TextDecoder("utf-8");
var makeResponse = Symbol("makeResponse");
var SyncResponse = class _SyncResponse {
	#body;
	#inner;
	constructor(body, init) {
		if (body == null) this.#body = null;
		else if (typeof body === "string") this.#body = body;
		else this.#body = new Uint8Array(body).buffer;
		this.#inner = {
			headers: new Headers(init?.headers),
			status: init?.status ?? 200,
			statusText: init?.statusText ?? "",
			type: "default",
			url: null,
			aborted: false
		};
	}
	static [makeResponse](body, inner) {
		const me = new _SyncResponse(body);
		me.#inner = inner;
		return me;
	}
	get headers() {
		return this.#inner.headers;
	}
	get status() {
		return this.#inner.status;
	}
	get statusText() {
		return this.#inner.statusText;
	}
	get ok() {
		return 200 <= this.#inner.status && this.#inner.status <= 299;
	}
	get url() {
		return this.#inner.url ?? "";
	}
	get type() {
		return this.#inner.type;
	}
	arrayBuffer() {
		return this.bytes().buffer;
	}
	bytes() {
		if (this.#body == null) return new Uint8Array();
		else if (typeof this.#body === "string") return textEncoder.encode(this.#body);
		else return new Uint8Array(this.#body);
	}
	json() {
		return JSON.parse(this.text());
	}
	text() {
		if (this.#body == null) return "";
		else if (typeof this.#body === "string") return this.#body;
		else return textDecoder.decode(this.#body);
	}
};
var requestBaseSize = bsatnBaseSize({ types: [] }, HttpRequest.algebraicType);
var methods = /* @__PURE__ */ new Map([
	["GET", { tag: "Get" }],
	["HEAD", { tag: "Head" }],
	["POST", { tag: "Post" }],
	["PUT", { tag: "Put" }],
	["DELETE", { tag: "Delete" }],
	["CONNECT", { tag: "Connect" }],
	["OPTIONS", { tag: "Options" }],
	["TRACE", { tag: "Trace" }],
	["PATCH", { tag: "Patch" }]
]);
function fetch(url, init = {}) {
	const method = methods.get(init.method?.toUpperCase() ?? "GET") ?? {
		tag: "Extension",
		value: init.method
	};
	const headers = { entries: headersToList(new Headers(init.headers)).flatMap(([k, v]) => Array.isArray(v) ? v.map((v2) => [k, v2]) : [[k, v]]).map(([name, value]) => ({
		name,
		value: textEncoder.encode(value)
	})) };
	const uri = "" + url;
	const request = freeze2({
		method,
		headers,
		timeout: init.timeout,
		uri,
		version: { tag: "Http11" }
	});
	const requestBuf = new BinaryWriter(requestBaseSize);
	HttpRequest.serialize(requestBuf, request);
	const body = init.body == null ? new Uint8Array() : typeof init.body === "string" ? init.body : new Uint8Array(init.body);
	const [responseBuf, responseBody] = sys.procedure_http_request(requestBuf.getBuffer(), body);
	const response = HttpResponse.deserialize(new BinaryReader(responseBuf));
	return SyncResponse[makeResponse](responseBody, {
		type: "basic",
		url: uri,
		status: response.code,
		statusText: (0, import_statuses.default)(response.code),
		headers: new Headers(),
		aborted: false
	});
}
freeze2(fetch);
var httpClient = freeze2({ fetch });
function makeProcedureExport(ctx, opts, params, ret, fn) {
	const name = opts?.name;
	const procedureExport = (...args) => fn(...args);
	procedureExport[exportContext] = ctx;
	procedureExport[registerExport] = (ctx2, exportName) => {
		registerProcedure(ctx2, name ?? exportName, params, ret, fn);
		ctx2.functionExports.set(procedureExport, name ?? exportName);
	};
	return procedureExport;
}
var TransactionCtxImpl = class TransactionCtx extends ReducerCtxImpl {};
function registerProcedure(ctx, exportName, params, ret, fn, opts) {
	ctx.defineFunction(exportName);
	const paramsType = { elements: Object.entries(params).map(([n, c]) => ({
		name: n,
		algebraicType: ctx.registerTypesRecursively("typeBuilder" in c ? c.typeBuilder : c).algebraicType
	})) };
	const returnType = ctx.registerTypesRecursively(ret).algebraicType;
	ctx.moduleDef.procedures.push({
		sourceName: exportName,
		params: paramsType,
		returnType,
		visibility: FunctionVisibility.ClientCallable
	});
	const { typespace } = ctx;
	ctx.procedures.push({
		fn,
		deserializeArgs: ProductType.makeDeserializer(paramsType, typespace),
		serializeReturn: AlgebraicType.makeSerializer(returnType, typespace),
		returnTypeBaseSize: bsatnBaseSize(typespace, returnType)
	});
}
function callProcedure(moduleCtx, id, sender, connectionId, timestamp, argsBuf, dbView) {
	const { fn, deserializeArgs, serializeReturn, returnTypeBaseSize } = moduleCtx.procedures[id];
	const args = deserializeArgs(new BinaryReader(argsBuf));
	const ret = callUserFunction(fn, new ProcedureCtxImpl(sender, timestamp, connectionId, dbView), args);
	const retBuf = new BinaryWriter(returnTypeBaseSize);
	serializeReturn(retBuf, ret);
	return retBuf.getBuffer();
}
var ProcedureCtxImpl = class ProcedureCtx {
	constructor(sender, timestamp, connectionId, dbView) {
		this.sender = sender;
		this.timestamp = timestamp;
		this.connectionId = connectionId;
		this.#dbView = dbView;
	}
	#identity;
	#uuidCounter;
	#random;
	#dbView;
	get identity() {
		return this.#identity ??= new Identity(sys.identity());
	}
	get random() {
		return this.#random ??= makeRandom(this.timestamp);
	}
	get http() {
		return httpClient;
	}
	withTx(body) {
		const run = () => {
			const timestamp = sys.procedure_start_mut_tx();
			try {
				return body(new TransactionCtxImpl(this.sender, new Timestamp(timestamp), this.connectionId, this.#dbView()));
			} catch (e) {
				sys.procedure_abort_mut_tx();
				throw e;
			}
		};
		let res = run();
		try {
			sys.procedure_commit_mut_tx();
			return res;
		} catch {}
		console.warn("committing anonymous transaction failed");
		res = run();
		try {
			sys.procedure_commit_mut_tx();
			return res;
		} catch (e) {
			throw new Error("transaction retry failed again", { cause: e });
		}
	}
	newUuidV4() {
		const bytes = this.random.fill(new Uint8Array(16));
		return Uuid.fromRandomBytesV4(bytes);
	}
	newUuidV7() {
		const bytes = this.random.fill(new Uint8Array(4));
		const counter = this.#uuidCounter ??= { value: 0 };
		return Uuid.fromCounterV7(counter, this.timestamp, bytes);
	}
};
function makeReducerExport(ctx, opts, params, fn, lifecycle) {
	const reducerExport = (...args) => fn(...args);
	reducerExport[exportContext] = ctx;
	reducerExport[registerExport] = (ctx2, exportName) => {
		registerReducer(ctx2, exportName, params, fn, opts, lifecycle);
		ctx2.functionExports.set(reducerExport, exportName);
	};
	return reducerExport;
}
function registerReducer(ctx, exportName, params, fn, opts, lifecycle) {
	ctx.defineFunction(exportName);
	if (!(params instanceof RowBuilder)) params = new RowBuilder(params);
	if (params.typeName === void 0) params.typeName = toPascalCase(exportName);
	const ref = ctx.registerTypesRecursively(params);
	const paramsType = ctx.resolveType(ref).value;
	const isLifecycle = lifecycle != null;
	ctx.moduleDef.reducers.push({
		sourceName: exportName,
		params: paramsType,
		visibility: FunctionVisibility.ClientCallable,
		okReturnType: AlgebraicType.Product({ elements: [] }),
		errReturnType: AlgebraicType.String
	});
	if (opts?.name != null) ctx.moduleDef.explicitNames.entries.push({
		tag: "Function",
		value: {
			sourceName: exportName,
			canonicalName: opts.name
		}
	});
	if (isLifecycle) ctx.moduleDef.lifeCycleReducers.push({
		lifecycleSpec: lifecycle,
		functionName: exportName
	});
	if (!fn.name) Object.defineProperty(fn, "name", {
		value: exportName,
		writable: false
	});
	ctx.reducers.push(fn);
}
var SchemaInner = class extends ModuleContext {
	schemaType;
	existingFunctions = /* @__PURE__ */ new Set();
	reducers = [];
	procedures = [];
	views = [];
	anonViews = [];
	/**
	* Maps ReducerExport objects to the name of the reducer.
	* Used for resolving the reducers of scheduled tables.
	*/
	functionExports = /* @__PURE__ */ new Map();
	pendingSchedules = [];
	constructor(getSchemaType) {
		super();
		this.schemaType = getSchemaType(this);
	}
	defineFunction(name) {
		if (this.existingFunctions.has(name)) throw new TypeError(`There is already a reducer or procedure with the name '${name}'`);
		this.existingFunctions.add(name);
	}
	resolveSchedules() {
		for (const { reducer, scheduleAtCol, tableName } of this.pendingSchedules) {
			const functionName = this.functionExports.get(reducer());
			if (functionName === void 0) {
				const msg = `Table ${tableName} defines a schedule, but it seems like the associated function was not exported.`;
				throw new TypeError(msg);
			}
			this.moduleDef.schedules.push({
				sourceName: void 0,
				tableName,
				scheduleAtCol,
				functionName
			});
		}
	}
};
var Schema = class {
	#ctx;
	constructor(ctx) {
		this.#ctx = ctx;
	}
	[moduleHooks](exports) {
		const registeredSchema = this.#ctx;
		for (const [name, moduleExport] of Object.entries(exports)) {
			if (name === "default") continue;
			if (!isModuleExport(moduleExport)) throw new TypeError("exporting something that is not a spacetime export");
			checkExportContext(moduleExport, registeredSchema);
			moduleExport[registerExport](registeredSchema, name);
		}
		registeredSchema.resolveSchedules();
		return makeHooks(registeredSchema);
	}
	get schemaType() {
		return this.#ctx.schemaType;
	}
	get moduleDef() {
		return this.#ctx.moduleDef;
	}
	get typespace() {
		return this.#ctx.typespace;
	}
	reducer(...args) {
		let opts, params = {}, fn;
		switch (args.length) {
			case 1:
				[fn] = args;
				break;
			case 2: {
				let arg1;
				[arg1, fn] = args;
				if (typeof arg1.name === "string") opts = arg1;
				else params = arg1;
				break;
			}
			case 3:
				[opts, params, fn] = args;
				break;
		}
		return makeReducerExport(this.#ctx, opts, params, fn);
	}
	init(...args) {
		let opts, fn;
		switch (args.length) {
			case 1:
				[fn] = args;
				break;
			case 2:
				[opts, fn] = args;
				break;
		}
		return makeReducerExport(this.#ctx, opts, {}, fn, Lifecycle.Init);
	}
	clientConnected(...args) {
		let opts, fn;
		switch (args.length) {
			case 1:
				[fn] = args;
				break;
			case 2:
				[opts, fn] = args;
				break;
		}
		return makeReducerExport(this.#ctx, opts, {}, fn, Lifecycle.OnConnect);
	}
	clientDisconnected(...args) {
		let opts, fn;
		switch (args.length) {
			case 1:
				[fn] = args;
				break;
			case 2:
				[opts, fn] = args;
				break;
		}
		return makeReducerExport(this.#ctx, opts, {}, fn, Lifecycle.OnDisconnect);
	}
	view(opts, ret, fn) {
		return makeViewExport(this.#ctx, opts, {}, ret, fn);
	}
	anonymousView(opts, ret, fn) {
		return makeAnonViewExport(this.#ctx, opts, {}, ret, fn);
	}
	procedure(...args) {
		let opts, params = {}, ret, fn;
		switch (args.length) {
			case 2:
				[ret, fn] = args;
				break;
			case 3: {
				let arg1;
				[arg1, ret, fn] = args;
				if (typeof arg1.name === "string") opts = arg1;
				else params = arg1;
				break;
			}
			case 4:
				[opts, params, ret, fn] = args;
				break;
		}
		return makeProcedureExport(this.#ctx, opts, params, ret, fn);
	}
	/**
	* Bundle multiple reducers, procedures, etc into one value to export.
	* The name they will be exported with is their corresponding key in the `exports` argument.
	*/
	exportGroup(exports) {
		return {
			[exportContext]: this.#ctx,
			[registerExport](ctx, _exportName) {
				for (const [exportName, moduleExport] of Object.entries(exports)) {
					checkExportContext(moduleExport, ctx);
					moduleExport[registerExport](ctx, exportName);
				}
			}
		};
	}
	clientVisibilityFilter = { sql: (filter) => ({
		[exportContext]: this.#ctx,
		[registerExport](ctx, _exportName) {
			ctx.moduleDef.rowLevelSecurity.push({ sql: filter });
		}
	}) };
};
var registerExport = Symbol("SpacetimeDB.registerExport");
var exportContext = Symbol("SpacetimeDB.exportContext");
function isModuleExport(x) {
	return (typeof x === "function" || typeof x === "object") && x !== null && registerExport in x;
}
function checkExportContext(exp, schema2) {
	if (exp[exportContext] != null && exp[exportContext] !== schema2) throw new TypeError("multiple schemas are not supported");
}
function schema(tables, moduleSettings) {
	return new Schema(new SchemaInner((ctx2) => {
		if (moduleSettings?.CASE_CONVERSION_POLICY != null) ctx2.setCaseConversionPolicy(moduleSettings.CASE_CONVERSION_POLICY);
		const tableSchemas = {};
		for (const [accName, table2] of Object.entries(tables)) {
			const tableDef = table2.tableDef(ctx2, accName);
			tableSchemas[accName] = tableToSchema(accName, table2, tableDef);
			ctx2.moduleDef.tables.push(tableDef);
			if (table2.schedule) ctx2.pendingSchedules.push({
				...table2.schedule,
				tableName: tableDef.sourceName
			});
			if (table2.tableName) ctx2.moduleDef.explicitNames.entries.push({
				tag: "Table",
				value: {
					sourceName: accName,
					canonicalName: table2.tableName
				}
			});
		}
		return { tables: tableSchemas };
	}));
}
var import_object_inspect = __toESM(require_object_inspect());
var fmtLog = (...data) => data.map((x) => typeof x === "string" ? x : (0, import_object_inspect.default)(x)).join(" ");
var console_level_error = 0;
var console_level_warn = 1;
var console_level_info = 2;
var console_level_debug = 3;
var console_level_trace = 4;
var timerMap = /* @__PURE__ */ new Map();
var console2 = {
	__proto__: {},
	[Symbol.toStringTag]: "console",
	assert: (condition = false, ...data) => {
		if (!condition) sys.console_log(console_level_error, fmtLog(...data));
	},
	clear: () => {},
	debug: (...data) => {
		sys.console_log(console_level_debug, fmtLog(...data));
	},
	error: (...data) => {
		sys.console_log(console_level_error, fmtLog(...data));
	},
	info: (...data) => {
		sys.console_log(console_level_info, fmtLog(...data));
	},
	log: (...data) => {
		sys.console_log(console_level_info, fmtLog(...data));
	},
	table: (tabularData, _properties) => {
		sys.console_log(console_level_info, fmtLog(tabularData));
	},
	trace: (...data) => {
		sys.console_log(console_level_trace, fmtLog(...data));
	},
	warn: (...data) => {
		sys.console_log(console_level_warn, fmtLog(...data));
	},
	dir: (_item, _options) => {},
	dirxml: (..._data) => {},
	count: (_label = "default") => {},
	countReset: (_label = "default") => {},
	group: (..._data) => {},
	groupCollapsed: (..._data) => {},
	groupEnd: () => {},
	time: (label = "default") => {
		if (timerMap.has(label)) {
			sys.console_log(console_level_warn, `Timer '${label}' already exists.`);
			return;
		}
		timerMap.set(label, sys.console_timer_start(label));
	},
	timeLog: (label = "default", ...data) => {
		sys.console_log(console_level_info, fmtLog(label, ...data));
	},
	timeEnd: (label = "default") => {
		const spanId = timerMap.get(label);
		if (spanId === void 0) {
			sys.console_log(console_level_warn, `Timer '${label}' does not exist.`);
			return;
		}
		sys.console_timer_end(spanId);
		timerMap.delete(label);
	},
	timeStamp: () => {},
	profile: () => {},
	profileEnd: () => {}
};
globalThis.console = console2;

//#endregion
//#region src/schema.ts
const spacetimedb = schema({
	project: table({
		name: "project",
		public: true
	}, {
		id: t.u64().primaryKey().autoInc(),
		git_remote_url: t.string().unique(),
		name: t.string(),
		description: t.string(),
		core_value: t.string(),
		constraints: t.string(),
		context: t.string(),
		key_decisions: t.string(),
		created_at: t.timestamp(),
		updated_at: t.timestamp()
	}),
	phase: table({
		name: "phase",
		public: true,
		indexes: [{
			name: "phase_project_id",
			accessor: "phase_project_id",
			algorithm: "btree",
			columns: ["project_id"]
		}]
	}, {
		id: t.u64().primaryKey().autoInc(),
		project_id: t.u64(),
		number: t.string(),
		name: t.string(),
		slug: t.string(),
		goal: t.string(),
		status: t.string(),
		depends_on: t.string(),
		success_criteria: t.string(),
		created_at: t.timestamp(),
		updated_at: t.timestamp()
	}),
	plan: table({
		name: "plan",
		public: true,
		indexes: [{
			name: "plan_phase_id",
			accessor: "plan_phase_id",
			algorithm: "btree",
			columns: ["phase_id"]
		}]
	}, {
		id: t.u64().primaryKey().autoInc(),
		phase_id: t.u64(),
		plan_number: t.u64(),
		type: t.string(),
		wave: t.u64(),
		depends_on: t.string(),
		objective: t.string(),
		autonomous: t.bool(),
		requirements: t.string(),
		status: t.string(),
		content: t.string(),
		created_at: t.timestamp(),
		updated_at: t.timestamp()
	}),
	planTask: table({
		name: "plan_task",
		public: true,
		indexes: [{
			name: "plan_task_plan_id",
			accessor: "plan_task_plan_id",
			algorithm: "btree",
			columns: ["plan_id"]
		}]
	}, {
		id: t.u64().primaryKey().autoInc(),
		plan_id: t.u64(),
		task_number: t.u64(),
		type: t.string(),
		description: t.string(),
		status: t.string(),
		commit_hash: t.string().optional(),
		created_at: t.timestamp(),
		updated_at: t.timestamp()
	}),
	requirement: table({
		name: "requirement",
		public: true,
		indexes: [{
			name: "requirement_project_id",
			accessor: "requirement_project_id",
			algorithm: "btree",
			columns: ["project_id"]
		}]
	}, {
		id: t.u64().primaryKey().autoInc(),
		project_id: t.u64(),
		category: t.string(),
		number: t.string(),
		description: t.string(),
		status: t.string(),
		phase_number: t.string(),
		milestone_version: t.string().optional(),
		created_at: t.timestamp(),
		updated_at: t.timestamp()
	}),
	projectState: table({
		name: "project_state",
		public: true,
		indexes: [{
			name: "project_state_project_id",
			accessor: "project_state_project_id",
			algorithm: "btree",
			columns: ["project_id"]
		}]
	}, {
		id: t.u64().primaryKey().autoInc(),
		project_id: t.u64(),
		current_phase: t.string(),
		current_plan: t.u64(),
		current_task: t.u64(),
		last_activity: t.timestamp(),
		last_activity_description: t.string(),
		velocity_data: t.string(),
		session_last: t.string(),
		session_stopped_at: t.string(),
		session_resume_file: t.string().optional(),
		updated_at: t.timestamp()
	}),
	continueHere: table({
		name: "continue_here",
		public: true,
		indexes: [{
			name: "continue_here_project_id",
			accessor: "continue_here_project_id",
			algorithm: "btree",
			columns: ["project_id"]
		}]
	}, {
		id: t.u64().primaryKey().autoInc(),
		project_id: t.u64(),
		phase_id: t.u64(),
		task_number: t.u64(),
		current_state: t.string(),
		next_action: t.string(),
		context: t.string(),
		created_at: t.timestamp(),
		updated_at: t.timestamp()
	}),
	planSummary: table({
		name: "plan_summary",
		public: true,
		indexes: [{
			name: "plan_summary_plan_id",
			accessor: "plan_summary_plan_id",
			algorithm: "btree",
			columns: ["plan_id"]
		}]
	}, {
		id: t.u64().primaryKey().autoInc(),
		plan_id: t.u64(),
		subsystem: t.string(),
		tags: t.string(),
		headline: t.string(),
		accomplishments: t.string(),
		deviations: t.string(),
		files: t.string(),
		decisions: t.string(),
		dependency_graph: t.string(),
		created_at: t.timestamp(),
		updated_at: t.timestamp()
	}),
	verification: table({
		name: "verification",
		public: true,
		indexes: [{
			name: "verification_phase_id",
			accessor: "verification_phase_id",
			algorithm: "btree",
			columns: ["phase_id"]
		}]
	}, {
		id: t.u64().primaryKey().autoInc(),
		phase_id: t.u64(),
		status: t.string(),
		score: t.u64(),
		content: t.string(),
		recommended_fixes: t.string(),
		created_at: t.timestamp(),
		updated_at: t.timestamp()
	}),
	research: table({
		name: "research",
		public: true,
		indexes: [{
			name: "research_phase_id",
			accessor: "research_phase_id",
			algorithm: "btree",
			columns: ["phase_id"]
		}]
	}, {
		id: t.u64().primaryKey().autoInc(),
		phase_id: t.u64(),
		domain: t.string(),
		confidence: t.string(),
		content: t.string(),
		created_at: t.timestamp(),
		updated_at: t.timestamp()
	}),
	phaseContext: table({
		name: "phase_context",
		public: true,
		indexes: [{
			name: "phase_context_phase_id",
			accessor: "phase_context_phase_id",
			algorithm: "btree",
			columns: ["phase_id"]
		}]
	}, {
		id: t.u64().primaryKey().autoInc(),
		phase_id: t.u64(),
		content: t.string(),
		created_at: t.timestamp(),
		updated_at: t.timestamp()
	}),
	config: table({
		name: "config",
		public: true,
		indexes: [{
			name: "config_project_id",
			accessor: "config_project_id",
			algorithm: "btree",
			columns: ["project_id"]
		}]
	}, {
		id: t.u64().primaryKey().autoInc(),
		project_id: t.u64(),
		config: t.string(),
		created_at: t.timestamp(),
		updated_at: t.timestamp()
	}),
	mustHave: table({
		name: "must_have",
		public: true,
		indexes: [{
			name: "must_have_plan_id",
			accessor: "must_have_plan_id",
			algorithm: "btree",
			columns: ["plan_id"]
		}]
	}, {
		id: t.u64().primaryKey().autoInc(),
		plan_id: t.u64(),
		truths: t.string(),
		artifacts: t.string(),
		key_links: t.string(),
		created_at: t.timestamp(),
		updated_at: t.timestamp()
	})
});

//#endregion
//#region src/index.ts
var src_default = spacetimedb;
const init = spacetimedb.init((_ctx) => {});
const onConnect = spacetimedb.clientConnected((_ctx) => {});
const onDisconnect = spacetimedb.clientDisconnected((_ctx) => {});
const insert_project = spacetimedb.reducer({
	git_remote_url: t.string(),
	name: t.string(),
	description: t.string(),
	core_value: t.string(),
	constraints: t.string(),
	context: t.string(),
	key_decisions: t.string()
}, (ctx, args) => {
	ctx.db.project.insert({
		id: 0n,
		...args,
		created_at: ctx.timestamp,
		updated_at: ctx.timestamp
	});
});
const update_project = spacetimedb.reducer({
	project_id: t.u64(),
	name: t.string(),
	description: t.string(),
	core_value: t.string(),
	constraints: t.string(),
	context: t.string(),
	key_decisions: t.string()
}, (ctx, { project_id, ...fields }) => {
	const existing = ctx.db.project.id.find(project_id);
	if (!existing) throw new SenderError(`Project ${project_id} not found`);
	ctx.db.project.id.update({
		...existing,
		...fields,
		updated_at: ctx.timestamp
	});
});
const delete_project = spacetimedb.reducer({ project_id: t.u64() }, (ctx, { project_id }) => {
	if (!ctx.db.project.id.find(project_id)) throw new SenderError(`Project ${project_id} not found`);
	ctx.db.project.id.delete(project_id);
});
const insert_phase = spacetimedb.reducer({
	project_id: t.u64(),
	number: t.string(),
	name: t.string(),
	slug: t.string(),
	goal: t.string(),
	status: t.string(),
	depends_on: t.string(),
	success_criteria: t.string()
}, (ctx, { project_id, ...fields }) => {
	if (!ctx.db.project.id.find(project_id)) throw new SenderError(`Project ${project_id} not found`);
	ctx.db.phase.insert({
		id: 0n,
		project_id,
		...fields,
		created_at: ctx.timestamp,
		updated_at: ctx.timestamp
	});
});
const update_phase = spacetimedb.reducer({
	phase_id: t.u64(),
	number: t.string(),
	name: t.string(),
	slug: t.string(),
	goal: t.string(),
	status: t.string(),
	depends_on: t.string(),
	success_criteria: t.string()
}, (ctx, { phase_id, ...fields }) => {
	const existing = ctx.db.phase.id.find(phase_id);
	if (!existing) throw new SenderError(`Phase ${phase_id} not found`);
	ctx.db.phase.id.update({
		...existing,
		...fields,
		updated_at: ctx.timestamp
	});
});
const delete_phase = spacetimedb.reducer({ phase_id: t.u64() }, (ctx, { phase_id }) => {
	const phase = ctx.db.phase.id.find(phase_id);
	if (!phase) throw new SenderError(`Phase ${phase_id} not found`);
	const plans = [...ctx.db.plan.plan_phase_id.filter(phase_id)];
	for (const plan of plans) {
		const tasks = [...ctx.db.planTask.plan_task_plan_id.filter(plan.id)];
		for (const task of tasks) ctx.db.planTask.id.delete(task.id);
		const summaries = [...ctx.db.planSummary.plan_summary_plan_id.filter(plan.id)];
		for (const summary of summaries) ctx.db.planSummary.id.delete(summary.id);
		const mustHaves = [...ctx.db.mustHave.must_have_plan_id.filter(plan.id)];
		for (const mustHave of mustHaves) ctx.db.mustHave.id.delete(mustHave.id);
		ctx.db.plan.id.delete(plan.id);
	}
	const verifications = [...ctx.db.verification.verification_phase_id.filter(phase_id)];
	for (const v of verifications) ctx.db.verification.id.delete(v.id);
	const researchRecords = [...ctx.db.research.research_phase_id.filter(phase_id)];
	for (const r of researchRecords) ctx.db.research.id.delete(r.id);
	const phaseContexts = [...ctx.db.phaseContext.phase_context_phase_id.filter(phase_id)];
	for (const pc of phaseContexts) ctx.db.phaseContext.id.delete(pc.id);
	const requirements = [...ctx.db.requirement.requirement_project_id.filter(phase.project_id)];
	for (const req of requirements) if (req.phase_number === phase.number) ctx.db.requirement.id.delete(req.id);
	ctx.db.phase.id.delete(phase_id);
});
const insert_plan = spacetimedb.reducer({
	phase_id: t.u64(),
	plan_number: t.u64(),
	type: t.string(),
	wave: t.u64(),
	depends_on: t.string(),
	objective: t.string(),
	autonomous: t.bool(),
	requirements: t.string(),
	status: t.string(),
	content: t.string()
}, (ctx, { phase_id, ...fields }) => {
	if (!ctx.db.phase.id.find(phase_id)) throw new SenderError(`Phase ${phase_id} not found`);
	ctx.db.plan.insert({
		id: 0n,
		phase_id,
		...fields,
		created_at: ctx.timestamp,
		updated_at: ctx.timestamp
	});
});
const update_plan = spacetimedb.reducer({
	plan_id: t.u64(),
	plan_number: t.u64(),
	type: t.string(),
	wave: t.u64(),
	depends_on: t.string(),
	objective: t.string(),
	autonomous: t.bool(),
	requirements: t.string(),
	status: t.string(),
	content: t.string()
}, (ctx, { plan_id, ...fields }) => {
	const existing = ctx.db.plan.id.find(plan_id);
	if (!existing) throw new SenderError(`Plan ${plan_id} not found`);
	ctx.db.plan.id.update({
		...existing,
		...fields,
		updated_at: ctx.timestamp
	});
});
const delete_plan = spacetimedb.reducer({ plan_id: t.u64() }, (ctx, { plan_id }) => {
	if (!ctx.db.plan.id.find(plan_id)) throw new SenderError(`Plan ${plan_id} not found`);
	const tasks = [...ctx.db.planTask.plan_task_plan_id.filter(plan_id)];
	for (const task of tasks) ctx.db.planTask.id.delete(task.id);
	const summaries = [...ctx.db.planSummary.plan_summary_plan_id.filter(plan_id)];
	for (const summary of summaries) ctx.db.planSummary.id.delete(summary.id);
	const mustHaves = [...ctx.db.mustHave.must_have_plan_id.filter(plan_id)];
	for (const mustHave of mustHaves) ctx.db.mustHave.id.delete(mustHave.id);
	ctx.db.plan.id.delete(plan_id);
});
const insert_plan_task = spacetimedb.reducer({
	plan_id: t.u64(),
	task_number: t.u64(),
	type: t.string(),
	description: t.string(),
	status: t.string(),
	commit_hash: t.string()
}, (ctx, { plan_id, commit_hash, ...fields }) => {
	if (!ctx.db.plan.id.find(plan_id)) throw new SenderError(`Plan ${plan_id} not found`);
	ctx.db.planTask.insert({
		id: 0n,
		plan_id,
		...fields,
		commit_hash: commit_hash || void 0,
		created_at: ctx.timestamp,
		updated_at: ctx.timestamp
	});
});
const update_plan_task = spacetimedb.reducer({
	task_id: t.u64(),
	task_number: t.u64(),
	type: t.string(),
	description: t.string(),
	status: t.string(),
	commit_hash: t.string()
}, (ctx, { task_id, commit_hash, ...fields }) => {
	const existing = ctx.db.planTask.id.find(task_id);
	if (!existing) throw new SenderError(`PlanTask ${task_id} not found`);
	ctx.db.planTask.id.update({
		...existing,
		...fields,
		commit_hash: commit_hash || void 0,
		updated_at: ctx.timestamp
	});
});
const delete_plan_task = spacetimedb.reducer({ task_id: t.u64() }, (ctx, { task_id }) => {
	if (!ctx.db.planTask.id.find(task_id)) throw new SenderError(`PlanTask ${task_id} not found`);
	ctx.db.planTask.id.delete(task_id);
});
const insert_requirement = spacetimedb.reducer({
	project_id: t.u64(),
	category: t.string(),
	number: t.string(),
	description: t.string(),
	status: t.string(),
	phase_number: t.string(),
	milestone_version: t.string()
}, (ctx, { project_id, milestone_version, ...fields }) => {
	if (!ctx.db.project.id.find(project_id)) throw new SenderError(`Project ${project_id} not found`);
	ctx.db.requirement.insert({
		id: 0n,
		project_id,
		...fields,
		milestone_version: milestone_version || void 0,
		created_at: ctx.timestamp,
		updated_at: ctx.timestamp
	});
});
const update_requirement = spacetimedb.reducer({
	requirement_id: t.u64(),
	category: t.string(),
	number: t.string(),
	description: t.string(),
	status: t.string(),
	phase_number: t.string(),
	milestone_version: t.string()
}, (ctx, { requirement_id, milestone_version, ...fields }) => {
	const existing = ctx.db.requirement.id.find(requirement_id);
	if (!existing) throw new SenderError(`Requirement ${requirement_id} not found`);
	ctx.db.requirement.id.update({
		...existing,
		...fields,
		milestone_version: milestone_version || void 0,
		updated_at: ctx.timestamp
	});
});
const delete_requirement = spacetimedb.reducer({ requirement_id: t.u64() }, (ctx, { requirement_id }) => {
	if (!ctx.db.requirement.id.find(requirement_id)) throw new SenderError(`Requirement ${requirement_id} not found`);
	ctx.db.requirement.id.delete(requirement_id);
});
const upsert_project_state = spacetimedb.reducer({
	project_id: t.u64(),
	current_phase: t.string(),
	current_plan: t.u64(),
	current_task: t.u64(),
	last_activity_description: t.string(),
	velocity_data: t.string(),
	session_last: t.string(),
	session_stopped_at: t.string(),
	session_resume_file: t.string()
}, (ctx, { project_id, session_resume_file, ...fields }) => {
	if (!ctx.db.project.id.find(project_id)) throw new SenderError(`Project ${project_id} not found`);
	const existing = [...ctx.db.projectState.project_state_project_id.filter(project_id)][0];
	if (existing) ctx.db.projectState.id.update({
		...existing,
		...fields,
		session_resume_file: session_resume_file || void 0,
		last_activity: ctx.timestamp,
		updated_at: ctx.timestamp
	});
	else ctx.db.projectState.insert({
		id: 0n,
		project_id,
		...fields,
		session_resume_file: session_resume_file || void 0,
		last_activity: ctx.timestamp,
		updated_at: ctx.timestamp
	});
});
const delete_project_state = spacetimedb.reducer({ state_id: t.u64() }, (ctx, { state_id }) => {
	if (!ctx.db.projectState.id.find(state_id)) throw new SenderError(`ProjectState ${state_id} not found`);
	ctx.db.projectState.id.delete(state_id);
});
const upsert_continue_here = spacetimedb.reducer({
	project_id: t.u64(),
	phase_id: t.u64(),
	task_number: t.u64(),
	current_state: t.string(),
	next_action: t.string(),
	context: t.string()
}, (ctx, { project_id, ...fields }) => {
	if (!ctx.db.project.id.find(project_id)) throw new SenderError(`Project ${project_id} not found`);
	if (!ctx.db.phase.id.find(fields.phase_id)) throw new SenderError(`Phase ${fields.phase_id} not found`);
	const existing = [...ctx.db.continueHere.continue_here_project_id.filter(project_id)][0];
	if (existing) ctx.db.continueHere.id.update({
		...existing,
		...fields,
		updated_at: ctx.timestamp
	});
	else ctx.db.continueHere.insert({
		id: 0n,
		project_id,
		...fields,
		created_at: ctx.timestamp,
		updated_at: ctx.timestamp
	});
});
const delete_continue_here = spacetimedb.reducer({ continue_here_id: t.u64() }, (ctx, { continue_here_id }) => {
	if (!ctx.db.continueHere.id.find(continue_here_id)) throw new SenderError(`ContinueHere ${continue_here_id} not found`);
	ctx.db.continueHere.id.delete(continue_here_id);
});
const insert_plan_summary = spacetimedb.reducer({
	plan_id: t.u64(),
	subsystem: t.string(),
	tags: t.string(),
	headline: t.string(),
	accomplishments: t.string(),
	deviations: t.string(),
	files: t.string(),
	decisions: t.string(),
	dependency_graph: t.string()
}, (ctx, { plan_id, ...fields }) => {
	if (!ctx.db.plan.id.find(plan_id)) throw new SenderError(`Plan ${plan_id} not found`);
	ctx.db.planSummary.insert({
		id: 0n,
		plan_id,
		...fields,
		created_at: ctx.timestamp,
		updated_at: ctx.timestamp
	});
});
const update_plan_summary = spacetimedb.reducer({
	summary_id: t.u64(),
	subsystem: t.string(),
	tags: t.string(),
	headline: t.string(),
	accomplishments: t.string(),
	deviations: t.string(),
	files: t.string(),
	decisions: t.string(),
	dependency_graph: t.string()
}, (ctx, { summary_id, ...fields }) => {
	const existing = ctx.db.planSummary.id.find(summary_id);
	if (!existing) throw new SenderError(`PlanSummary ${summary_id} not found`);
	ctx.db.planSummary.id.update({
		...existing,
		...fields,
		updated_at: ctx.timestamp
	});
});
const delete_plan_summary = spacetimedb.reducer({ summary_id: t.u64() }, (ctx, { summary_id }) => {
	if (!ctx.db.planSummary.id.find(summary_id)) throw new SenderError(`PlanSummary ${summary_id} not found`);
	ctx.db.planSummary.id.delete(summary_id);
});
const insert_verification = spacetimedb.reducer({
	phase_id: t.u64(),
	status: t.string(),
	score: t.u64(),
	content: t.string(),
	recommended_fixes: t.string()
}, (ctx, { phase_id, ...fields }) => {
	if (!ctx.db.phase.id.find(phase_id)) throw new SenderError(`Phase ${phase_id} not found`);
	ctx.db.verification.insert({
		id: 0n,
		phase_id,
		...fields,
		created_at: ctx.timestamp,
		updated_at: ctx.timestamp
	});
});
const update_verification = spacetimedb.reducer({
	verification_id: t.u64(),
	status: t.string(),
	score: t.u64(),
	content: t.string(),
	recommended_fixes: t.string()
}, (ctx, { verification_id, ...fields }) => {
	const existing = ctx.db.verification.id.find(verification_id);
	if (!existing) throw new SenderError(`Verification ${verification_id} not found`);
	ctx.db.verification.id.update({
		...existing,
		...fields,
		updated_at: ctx.timestamp
	});
});
const delete_verification = spacetimedb.reducer({ verification_id: t.u64() }, (ctx, { verification_id }) => {
	if (!ctx.db.verification.id.find(verification_id)) throw new SenderError(`Verification ${verification_id} not found`);
	ctx.db.verification.id.delete(verification_id);
});
const insert_research = spacetimedb.reducer({
	phase_id: t.u64(),
	domain: t.string(),
	confidence: t.string(),
	content: t.string()
}, (ctx, { phase_id, ...fields }) => {
	if (!ctx.db.phase.id.find(phase_id)) throw new SenderError(`Phase ${phase_id} not found`);
	ctx.db.research.insert({
		id: 0n,
		phase_id,
		...fields,
		created_at: ctx.timestamp,
		updated_at: ctx.timestamp
	});
});
const update_research = spacetimedb.reducer({
	research_id: t.u64(),
	domain: t.string(),
	confidence: t.string(),
	content: t.string()
}, (ctx, { research_id, ...fields }) => {
	const existing = ctx.db.research.id.find(research_id);
	if (!existing) throw new SenderError(`Research ${research_id} not found`);
	ctx.db.research.id.update({
		...existing,
		...fields,
		updated_at: ctx.timestamp
	});
});
const delete_research = spacetimedb.reducer({ research_id: t.u64() }, (ctx, { research_id }) => {
	if (!ctx.db.research.id.find(research_id)) throw new SenderError(`Research ${research_id} not found`);
	ctx.db.research.id.delete(research_id);
});
const insert_phase_context = spacetimedb.reducer({
	phase_id: t.u64(),
	content: t.string()
}, (ctx, { phase_id, ...fields }) => {
	if (!ctx.db.phase.id.find(phase_id)) throw new SenderError(`Phase ${phase_id} not found`);
	ctx.db.phaseContext.insert({
		id: 0n,
		phase_id,
		...fields,
		created_at: ctx.timestamp,
		updated_at: ctx.timestamp
	});
});
const update_phase_context = spacetimedb.reducer({
	phase_context_id: t.u64(),
	content: t.string()
}, (ctx, { phase_context_id, ...fields }) => {
	const existing = ctx.db.phaseContext.id.find(phase_context_id);
	if (!existing) throw new SenderError(`PhaseContext ${phase_context_id} not found`);
	ctx.db.phaseContext.id.update({
		...existing,
		...fields,
		updated_at: ctx.timestamp
	});
});
const delete_phase_context = spacetimedb.reducer({ phase_context_id: t.u64() }, (ctx, { phase_context_id }) => {
	if (!ctx.db.phaseContext.id.find(phase_context_id)) throw new SenderError(`PhaseContext ${phase_context_id} not found`);
	ctx.db.phaseContext.id.delete(phase_context_id);
});
const upsert_config = spacetimedb.reducer({
	project_id: t.u64(),
	config: t.string()
}, (ctx, { project_id, config }) => {
	if (!ctx.db.project.id.find(project_id)) throw new SenderError(`Project ${project_id} not found`);
	const existing = [...ctx.db.config.config_project_id.filter(project_id)][0];
	if (existing) ctx.db.config.id.update({
		...existing,
		config,
		updated_at: ctx.timestamp
	});
	else ctx.db.config.insert({
		id: 0n,
		project_id,
		config,
		created_at: ctx.timestamp,
		updated_at: ctx.timestamp
	});
});
const delete_config = spacetimedb.reducer({ config_id: t.u64() }, (ctx, { config_id }) => {
	if (!ctx.db.config.id.find(config_id)) throw new SenderError(`Config ${config_id} not found`);
	ctx.db.config.id.delete(config_id);
});
const insert_must_have = spacetimedb.reducer({
	plan_id: t.u64(),
	truths: t.string(),
	artifacts: t.string(),
	key_links: t.string()
}, (ctx, { plan_id, ...fields }) => {
	if (!ctx.db.plan.id.find(plan_id)) throw new SenderError(`Plan ${plan_id} not found`);
	ctx.db.mustHave.insert({
		id: 0n,
		plan_id,
		...fields,
		created_at: ctx.timestamp,
		updated_at: ctx.timestamp
	});
});
const update_must_have = spacetimedb.reducer({
	must_have_id: t.u64(),
	truths: t.string(),
	artifacts: t.string(),
	key_links: t.string()
}, (ctx, { must_have_id, ...fields }) => {
	const existing = ctx.db.mustHave.id.find(must_have_id);
	if (!existing) throw new SenderError(`MustHave ${must_have_id} not found`);
	ctx.db.mustHave.id.update({
		...existing,
		...fields,
		updated_at: ctx.timestamp
	});
});
const delete_must_have = spacetimedb.reducer({ must_have_id: t.u64() }, (ctx, { must_have_id }) => {
	if (!ctx.db.mustHave.id.find(must_have_id)) throw new SenderError(`MustHave ${must_have_id} not found`);
	ctx.db.mustHave.id.delete(must_have_id);
});
const seed_project = spacetimedb.reducer({
	git_remote_url: t.string(),
	name: t.string(),
	description: t.string(),
	core_value: t.string(),
	constraints: t.string(),
	context: t.string(),
	key_decisions: t.string(),
	phases_json: t.string(),
	requirements_json: t.string()
}, (ctx, args) => {
	const proj = ctx.db.project.insert({
		id: 0n,
		git_remote_url: args.git_remote_url,
		name: args.name,
		description: args.description,
		core_value: args.core_value,
		constraints: args.constraints,
		context: args.context,
		key_decisions: args.key_decisions,
		created_at: ctx.timestamp,
		updated_at: ctx.timestamp
	});
	let phases;
	try {
		phases = JSON.parse(args.phases_json);
	} catch {
		throw new SenderError(`Invalid phases_json: failed to parse JSON`);
	}
	let firstPhaseNumber = "";
	for (let i = 0; i < phases.length; i++) {
		const p = phases[i];
		if (i === 0) firstPhaseNumber = p.number;
		ctx.db.phase.insert({
			id: 0n,
			project_id: proj.id,
			number: p.number,
			name: p.name,
			slug: p.slug,
			goal: p.goal,
			status: p.status,
			depends_on: p.depends_on,
			success_criteria: p.success_criteria,
			created_at: ctx.timestamp,
			updated_at: ctx.timestamp
		});
	}
	let requirements;
	try {
		requirements = JSON.parse(args.requirements_json);
	} catch {
		throw new SenderError(`Invalid requirements_json: failed to parse JSON`);
	}
	for (const req of requirements) ctx.db.requirement.insert({
		id: 0n,
		project_id: proj.id,
		category: req.category,
		number: req.number,
		description: req.description,
		status: req.status,
		phase_number: req.phase_number,
		milestone_version: req.milestone_version || void 0,
		created_at: ctx.timestamp,
		updated_at: ctx.timestamp
	});
	ctx.db.projectState.insert({
		id: 0n,
		project_id: proj.id,
		current_phase: firstPhaseNumber,
		current_plan: 0n,
		current_task: 0n,
		last_activity: ctx.timestamp,
		last_activity_description: "Project initialized via seed_project",
		velocity_data: "",
		session_last: "",
		session_stopped_at: "",
		session_resume_file: void 0,
		updated_at: ctx.timestamp
	});
});

//#endregion
export { src_default as default, delete_config, delete_continue_here, delete_must_have, delete_phase, delete_phase_context, delete_plan, delete_plan_summary, delete_plan_task, delete_project, delete_project_state, delete_requirement, delete_research, delete_verification, init, insert_must_have, insert_phase, insert_phase_context, insert_plan, insert_plan_summary, insert_plan_task, insert_project, insert_requirement, insert_research, insert_verification, onConnect, onDisconnect, seed_project, update_must_have, update_phase, update_phase_context, update_plan, update_plan_summary, update_plan_task, update_project, update_requirement, update_research, update_verification, upsert_config, upsert_continue_here, upsert_project_state };
//# debugId=aef4358a-2271-470a-aaf3-d02fe7b0ec1d
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwibmFtZXMiOlsiX19jcmVhdGUiLCJfX2RlZlByb3AiLCJfX2dldE93blByb3BEZXNjIiwiX19nZXRPd25Qcm9wTmFtZXMiLCJfX2dldFByb3RvT2YiLCJfX2hhc093blByb3AiLCJfX2NvbW1vbkpTIiwiX19jb3B5UHJvcHMiLCJfX3RvRVNNIiwiI2Vuc3VyZSIsIiNtb2R1bGVEZWYiLCIjcmVnaXN0ZXJDb21wb3VuZFR5cGVSZWN1cnNpdmVseSIsIiNjb21wb3VuZFR5cGVzIiwiI2Zyb20iLCIjdG8iLCIjdXVpZENvdW50ZXIiLCIjc2VuZGVyQXV0aCIsIiNpZGVudGl0eSIsIiNyYW5kb20iLCIjc2NoZW1hIiwiI3JlZHVjZXJBcmdzRGVzZXJpYWxpemVycyIsIiNkYlZpZXciLCIjZGJWaWV3XyIsIiNyZWR1Y2VyQ3R4IiwiI3JlZHVjZXJDdHhfIiwiI2ZpbmFsaXphdGlvblJlZ2lzdHJ5IiwiI2lkIiwiI2RldGFjaCIsIiNib2R5IiwiI2lubmVyIiwiI2N0eCJdLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9oZWFkZXJzLXBvbHlmaWxsL2xpYi9pbmRleC5tanMiLCJub2RlX21vZHVsZXMvc3BhY2V0aW1lZGIvZGlzdC9zZXJ2ZXIvaW5kZXgubWpzIiwic3JjL3NjaGVtYS50cyIsInNyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgX19jcmVhdGUgPSBPYmplY3QuY3JlYXRlO1xudmFyIF9fZGVmUHJvcCA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eTtcbnZhciBfX2dldE93blByb3BEZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcbnZhciBfX2dldE93blByb3BOYW1lcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzO1xudmFyIF9fZ2V0UHJvdG9PZiA9IE9iamVjdC5nZXRQcm90b3R5cGVPZjtcbnZhciBfX2hhc093blByb3AgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIF9fY29tbW9uSlMgPSAoY2IsIG1vZCkgPT4gZnVuY3Rpb24gX19yZXF1aXJlKCkge1xuICByZXR1cm4gbW9kIHx8ICgwLCBjYltfX2dldE93blByb3BOYW1lcyhjYilbMF1dKSgobW9kID0geyBleHBvcnRzOiB7fSB9KS5leHBvcnRzLCBtb2QpLCBtb2QuZXhwb3J0cztcbn07XG52YXIgX19jb3B5UHJvcHMgPSAodG8sIGZyb20sIGV4Y2VwdCwgZGVzYykgPT4ge1xuICBpZiAoZnJvbSAmJiB0eXBlb2YgZnJvbSA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgZnJvbSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgZm9yIChsZXQga2V5IG9mIF9fZ2V0T3duUHJvcE5hbWVzKGZyb20pKVxuICAgICAgaWYgKCFfX2hhc093blByb3AuY2FsbCh0bywga2V5KSAmJiBrZXkgIT09IGV4Y2VwdClcbiAgICAgICAgX19kZWZQcm9wKHRvLCBrZXksIHsgZ2V0OiAoKSA9PiBmcm9tW2tleV0sIGVudW1lcmFibGU6ICEoZGVzYyA9IF9fZ2V0T3duUHJvcERlc2MoZnJvbSwga2V5KSkgfHwgZGVzYy5lbnVtZXJhYmxlIH0pO1xuICB9XG4gIHJldHVybiB0bztcbn07XG52YXIgX190b0VTTSA9IChtb2QsIGlzTm9kZU1vZGUsIHRhcmdldCkgPT4gKHRhcmdldCA9IG1vZCAhPSBudWxsID8gX19jcmVhdGUoX19nZXRQcm90b09mKG1vZCkpIDoge30sIF9fY29weVByb3BzKFxuICAvLyBJZiB0aGUgaW1wb3J0ZXIgaXMgaW4gbm9kZSBjb21wYXRpYmlsaXR5IG1vZGUgb3IgdGhpcyBpcyBub3QgYW4gRVNNXG4gIC8vIGZpbGUgdGhhdCBoYXMgYmVlbiBjb252ZXJ0ZWQgdG8gYSBDb21tb25KUyBmaWxlIHVzaW5nIGEgQmFiZWwtXG4gIC8vIGNvbXBhdGlibGUgdHJhbnNmb3JtIChpLmUuIFwiX19lc01vZHVsZVwiIGhhcyBub3QgYmVlbiBzZXQpLCB0aGVuIHNldFxuICAvLyBcImRlZmF1bHRcIiB0byB0aGUgQ29tbW9uSlMgXCJtb2R1bGUuZXhwb3J0c1wiIGZvciBub2RlIGNvbXBhdGliaWxpdHkuXG4gIGlzTm9kZU1vZGUgfHwgIW1vZCB8fCAhbW9kLl9fZXNNb2R1bGUgPyBfX2RlZlByb3AodGFyZ2V0LCBcImRlZmF1bHRcIiwgeyB2YWx1ZTogbW9kLCBlbnVtZXJhYmxlOiB0cnVlIH0pIDogdGFyZ2V0LFxuICBtb2RcbikpO1xuXG4vLyBub2RlX21vZHVsZXMvc2V0LWNvb2tpZS1wYXJzZXIvbGliL3NldC1jb29raWUuanNcbnZhciByZXF1aXJlX3NldF9jb29raWUgPSBfX2NvbW1vbkpTKHtcbiAgXCJub2RlX21vZHVsZXMvc2V0LWNvb2tpZS1wYXJzZXIvbGliL3NldC1jb29raWUuanNcIihleHBvcnRzLCBtb2R1bGUpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB2YXIgZGVmYXVsdFBhcnNlT3B0aW9ucyA9IHtcbiAgICAgIGRlY29kZVZhbHVlczogdHJ1ZSxcbiAgICAgIG1hcDogZmFsc2UsXG4gICAgICBzaWxlbnQ6IGZhbHNlXG4gICAgfTtcbiAgICBmdW5jdGlvbiBpc05vbkVtcHR5U3RyaW5nKHN0cikge1xuICAgICAgcmV0dXJuIHR5cGVvZiBzdHIgPT09IFwic3RyaW5nXCIgJiYgISFzdHIudHJpbSgpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBwYXJzZVN0cmluZyhzZXRDb29raWVWYWx1ZSwgb3B0aW9ucykge1xuICAgICAgdmFyIHBhcnRzID0gc2V0Q29va2llVmFsdWUuc3BsaXQoXCI7XCIpLmZpbHRlcihpc05vbkVtcHR5U3RyaW5nKTtcbiAgICAgIHZhciBuYW1lVmFsdWVQYWlyU3RyID0gcGFydHMuc2hpZnQoKTtcbiAgICAgIHZhciBwYXJzZWQgPSBwYXJzZU5hbWVWYWx1ZVBhaXIobmFtZVZhbHVlUGFpclN0cik7XG4gICAgICB2YXIgbmFtZSA9IHBhcnNlZC5uYW1lO1xuICAgICAgdmFyIHZhbHVlID0gcGFyc2VkLnZhbHVlO1xuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgPyBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0UGFyc2VPcHRpb25zLCBvcHRpb25zKSA6IGRlZmF1bHRQYXJzZU9wdGlvbnM7XG4gICAgICB0cnkge1xuICAgICAgICB2YWx1ZSA9IG9wdGlvbnMuZGVjb2RlVmFsdWVzID8gZGVjb2RlVVJJQ29tcG9uZW50KHZhbHVlKSA6IHZhbHVlO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjb25zb2xlLmVycm9yKFxuICAgICAgICAgIFwic2V0LWNvb2tpZS1wYXJzZXIgZW5jb3VudGVyZWQgYW4gZXJyb3Igd2hpbGUgZGVjb2RpbmcgYSBjb29raWUgd2l0aCB2YWx1ZSAnXCIgKyB2YWx1ZSArIFwiJy4gU2V0IG9wdGlvbnMuZGVjb2RlVmFsdWVzIHRvIGZhbHNlIHRvIGRpc2FibGUgdGhpcyBmZWF0dXJlLlwiLFxuICAgICAgICAgIGVcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIHZhciBjb29raWUgPSB7XG4gICAgICAgIG5hbWUsXG4gICAgICAgIHZhbHVlXG4gICAgICB9O1xuICAgICAgcGFydHMuZm9yRWFjaChmdW5jdGlvbihwYXJ0KSB7XG4gICAgICAgIHZhciBzaWRlcyA9IHBhcnQuc3BsaXQoXCI9XCIpO1xuICAgICAgICB2YXIga2V5ID0gc2lkZXMuc2hpZnQoKS50cmltTGVmdCgpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIHZhciB2YWx1ZTIgPSBzaWRlcy5qb2luKFwiPVwiKTtcbiAgICAgICAgaWYgKGtleSA9PT0gXCJleHBpcmVzXCIpIHtcbiAgICAgICAgICBjb29raWUuZXhwaXJlcyA9IG5ldyBEYXRlKHZhbHVlMik7XG4gICAgICAgIH0gZWxzZSBpZiAoa2V5ID09PSBcIm1heC1hZ2VcIikge1xuICAgICAgICAgIGNvb2tpZS5tYXhBZ2UgPSBwYXJzZUludCh2YWx1ZTIsIDEwKTtcbiAgICAgICAgfSBlbHNlIGlmIChrZXkgPT09IFwic2VjdXJlXCIpIHtcbiAgICAgICAgICBjb29raWUuc2VjdXJlID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmIChrZXkgPT09IFwiaHR0cG9ubHlcIikge1xuICAgICAgICAgIGNvb2tpZS5odHRwT25seSA9IHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAoa2V5ID09PSBcInNhbWVzaXRlXCIpIHtcbiAgICAgICAgICBjb29raWUuc2FtZVNpdGUgPSB2YWx1ZTI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29va2llW2tleV0gPSB2YWx1ZTI7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGNvb2tpZTtcbiAgICB9XG4gICAgZnVuY3Rpb24gcGFyc2VOYW1lVmFsdWVQYWlyKG5hbWVWYWx1ZVBhaXJTdHIpIHtcbiAgICAgIHZhciBuYW1lID0gXCJcIjtcbiAgICAgIHZhciB2YWx1ZSA9IFwiXCI7XG4gICAgICB2YXIgbmFtZVZhbHVlQXJyID0gbmFtZVZhbHVlUGFpclN0ci5zcGxpdChcIj1cIik7XG4gICAgICBpZiAobmFtZVZhbHVlQXJyLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgbmFtZSA9IG5hbWVWYWx1ZUFyci5zaGlmdCgpO1xuICAgICAgICB2YWx1ZSA9IG5hbWVWYWx1ZUFyci5qb2luKFwiPVwiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbHVlID0gbmFtZVZhbHVlUGFpclN0cjtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7IG5hbWUsIHZhbHVlIH07XG4gICAgfVxuICAgIGZ1bmN0aW9uIHBhcnNlKGlucHV0LCBvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gb3B0aW9ucyA/IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRQYXJzZU9wdGlvbnMsIG9wdGlvbnMpIDogZGVmYXVsdFBhcnNlT3B0aW9ucztcbiAgICAgIGlmICghaW5wdXQpIHtcbiAgICAgICAgaWYgKCFvcHRpb25zLm1hcCkge1xuICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4ge307XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChpbnB1dC5oZWFkZXJzKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaW5wdXQuaGVhZGVycy5nZXRTZXRDb29raWUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIGlucHV0ID0gaW5wdXQuaGVhZGVycy5nZXRTZXRDb29raWUoKTtcbiAgICAgICAgfSBlbHNlIGlmIChpbnB1dC5oZWFkZXJzW1wic2V0LWNvb2tpZVwiXSkge1xuICAgICAgICAgIGlucHV0ID0gaW5wdXQuaGVhZGVyc1tcInNldC1jb29raWVcIl07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIHNjaCA9IGlucHV0LmhlYWRlcnNbT2JqZWN0LmtleXMoaW5wdXQuaGVhZGVycykuZmluZChmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICAgIHJldHVybiBrZXkudG9Mb3dlckNhc2UoKSA9PT0gXCJzZXQtY29va2llXCI7XG4gICAgICAgICAgfSldO1xuICAgICAgICAgIGlmICghc2NoICYmIGlucHV0LmhlYWRlcnMuY29va2llICYmICFvcHRpb25zLnNpbGVudCkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgICAgICBcIldhcm5pbmc6IHNldC1jb29raWUtcGFyc2VyIGFwcGVhcnMgdG8gaGF2ZSBiZWVuIGNhbGxlZCBvbiBhIHJlcXVlc3Qgb2JqZWN0LiBJdCBpcyBkZXNpZ25lZCB0byBwYXJzZSBTZXQtQ29va2llIGhlYWRlcnMgZnJvbSByZXNwb25zZXMsIG5vdCBDb29raWUgaGVhZGVycyBmcm9tIHJlcXVlc3RzLiBTZXQgdGhlIG9wdGlvbiB7c2lsZW50OiB0cnVlfSB0byBzdXBwcmVzcyB0aGlzIHdhcm5pbmcuXCJcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlucHV0ID0gc2NoO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoIUFycmF5LmlzQXJyYXkoaW5wdXQpKSB7XG4gICAgICAgIGlucHV0ID0gW2lucHV0XTtcbiAgICAgIH1cbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zID8gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdFBhcnNlT3B0aW9ucywgb3B0aW9ucykgOiBkZWZhdWx0UGFyc2VPcHRpb25zO1xuICAgICAgaWYgKCFvcHRpb25zLm1hcCkge1xuICAgICAgICByZXR1cm4gaW5wdXQuZmlsdGVyKGlzTm9uRW1wdHlTdHJpbmcpLm1hcChmdW5jdGlvbihzdHIpIHtcbiAgICAgICAgICByZXR1cm4gcGFyc2VTdHJpbmcoc3RyLCBvcHRpb25zKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgY29va2llcyA9IHt9O1xuICAgICAgICByZXR1cm4gaW5wdXQuZmlsdGVyKGlzTm9uRW1wdHlTdHJpbmcpLnJlZHVjZShmdW5jdGlvbihjb29raWVzMiwgc3RyKSB7XG4gICAgICAgICAgdmFyIGNvb2tpZSA9IHBhcnNlU3RyaW5nKHN0ciwgb3B0aW9ucyk7XG4gICAgICAgICAgY29va2llczJbY29va2llLm5hbWVdID0gY29va2llO1xuICAgICAgICAgIHJldHVybiBjb29raWVzMjtcbiAgICAgICAgfSwgY29va2llcyk7XG4gICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIHNwbGl0Q29va2llc1N0cmluZzIoY29va2llc1N0cmluZykge1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoY29va2llc1N0cmluZykpIHtcbiAgICAgICAgcmV0dXJuIGNvb2tpZXNTdHJpbmc7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGNvb2tpZXNTdHJpbmcgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgfVxuICAgICAgdmFyIGNvb2tpZXNTdHJpbmdzID0gW107XG4gICAgICB2YXIgcG9zID0gMDtcbiAgICAgIHZhciBzdGFydDtcbiAgICAgIHZhciBjaDtcbiAgICAgIHZhciBsYXN0Q29tbWE7XG4gICAgICB2YXIgbmV4dFN0YXJ0O1xuICAgICAgdmFyIGNvb2tpZXNTZXBhcmF0b3JGb3VuZDtcbiAgICAgIGZ1bmN0aW9uIHNraXBXaGl0ZXNwYWNlKCkge1xuICAgICAgICB3aGlsZSAocG9zIDwgY29va2llc1N0cmluZy5sZW5ndGggJiYgL1xccy8udGVzdChjb29raWVzU3RyaW5nLmNoYXJBdChwb3MpKSkge1xuICAgICAgICAgIHBvcyArPSAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwb3MgPCBjb29raWVzU3RyaW5nLmxlbmd0aDtcbiAgICAgIH1cbiAgICAgIGZ1bmN0aW9uIG5vdFNwZWNpYWxDaGFyKCkge1xuICAgICAgICBjaCA9IGNvb2tpZXNTdHJpbmcuY2hhckF0KHBvcyk7XG4gICAgICAgIHJldHVybiBjaCAhPT0gXCI9XCIgJiYgY2ggIT09IFwiO1wiICYmIGNoICE9PSBcIixcIjtcbiAgICAgIH1cbiAgICAgIHdoaWxlIChwb3MgPCBjb29raWVzU3RyaW5nLmxlbmd0aCkge1xuICAgICAgICBzdGFydCA9IHBvcztcbiAgICAgICAgY29va2llc1NlcGFyYXRvckZvdW5kID0gZmFsc2U7XG4gICAgICAgIHdoaWxlIChza2lwV2hpdGVzcGFjZSgpKSB7XG4gICAgICAgICAgY2ggPSBjb29raWVzU3RyaW5nLmNoYXJBdChwb3MpO1xuICAgICAgICAgIGlmIChjaCA9PT0gXCIsXCIpIHtcbiAgICAgICAgICAgIGxhc3RDb21tYSA9IHBvcztcbiAgICAgICAgICAgIHBvcyArPSAxO1xuICAgICAgICAgICAgc2tpcFdoaXRlc3BhY2UoKTtcbiAgICAgICAgICAgIG5leHRTdGFydCA9IHBvcztcbiAgICAgICAgICAgIHdoaWxlIChwb3MgPCBjb29raWVzU3RyaW5nLmxlbmd0aCAmJiBub3RTcGVjaWFsQ2hhcigpKSB7XG4gICAgICAgICAgICAgIHBvcyArPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBvcyA8IGNvb2tpZXNTdHJpbmcubGVuZ3RoICYmIGNvb2tpZXNTdHJpbmcuY2hhckF0KHBvcykgPT09IFwiPVwiKSB7XG4gICAgICAgICAgICAgIGNvb2tpZXNTZXBhcmF0b3JGb3VuZCA9IHRydWU7XG4gICAgICAgICAgICAgIHBvcyA9IG5leHRTdGFydDtcbiAgICAgICAgICAgICAgY29va2llc1N0cmluZ3MucHVzaChjb29raWVzU3RyaW5nLnN1YnN0cmluZyhzdGFydCwgbGFzdENvbW1hKSk7XG4gICAgICAgICAgICAgIHN0YXJ0ID0gcG9zO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcG9zID0gbGFzdENvbW1hICsgMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcG9zICs9IDE7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICghY29va2llc1NlcGFyYXRvckZvdW5kIHx8IHBvcyA+PSBjb29raWVzU3RyaW5nLmxlbmd0aCkge1xuICAgICAgICAgIGNvb2tpZXNTdHJpbmdzLnB1c2goY29va2llc1N0cmluZy5zdWJzdHJpbmcoc3RhcnQsIGNvb2tpZXNTdHJpbmcubGVuZ3RoKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBjb29raWVzU3RyaW5ncztcbiAgICB9XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBwYXJzZTtcbiAgICBtb2R1bGUuZXhwb3J0cy5wYXJzZSA9IHBhcnNlO1xuICAgIG1vZHVsZS5leHBvcnRzLnBhcnNlU3RyaW5nID0gcGFyc2VTdHJpbmc7XG4gICAgbW9kdWxlLmV4cG9ydHMuc3BsaXRDb29raWVzU3RyaW5nID0gc3BsaXRDb29raWVzU3RyaW5nMjtcbiAgfVxufSk7XG5cbi8vIHNyYy9IZWFkZXJzLnRzXG52YXIgaW1wb3J0X3NldF9jb29raWVfcGFyc2VyID0gX190b0VTTShyZXF1aXJlX3NldF9jb29raWUoKSk7XG5cbi8vIHNyYy91dGlscy9ub3JtYWxpemVIZWFkZXJOYW1lLnRzXG52YXIgSEVBREVSU19JTlZBTElEX0NIQVJBQ1RFUlMgPSAvW15hLXowLTlcXC0jJCUmJyorLl5fYHx+XS9pO1xuZnVuY3Rpb24gbm9ybWFsaXplSGVhZGVyTmFtZShuYW1lKSB7XG4gIGlmIChIRUFERVJTX0lOVkFMSURfQ0hBUkFDVEVSUy50ZXN0KG5hbWUpIHx8IG5hbWUudHJpbSgpID09PSBcIlwiKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgY2hhcmFjdGVyIGluIGhlYWRlciBmaWVsZCBuYW1lXCIpO1xuICB9XG4gIHJldHVybiBuYW1lLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xufVxuXG4vLyBzcmMvdXRpbHMvbm9ybWFsaXplSGVhZGVyVmFsdWUudHNcbnZhciBjaGFyQ29kZXNUb1JlbW92ZSA9IFtcbiAgU3RyaW5nLmZyb21DaGFyQ29kZSgxMCksXG4gIFN0cmluZy5mcm9tQ2hhckNvZGUoMTMpLFxuICBTdHJpbmcuZnJvbUNoYXJDb2RlKDkpLFxuICBTdHJpbmcuZnJvbUNoYXJDb2RlKDMyKVxuXTtcbnZhciBIRUFERVJfVkFMVUVfUkVNT1ZFX1JFR0VYUCA9IG5ldyBSZWdFeHAoXG4gIGAoXlske2NoYXJDb2Rlc1RvUmVtb3ZlLmpvaW4oXCJcIil9XXwkWyR7Y2hhckNvZGVzVG9SZW1vdmUuam9pbihcIlwiKX1dKWAsXG4gIFwiZ1wiXG4pO1xuZnVuY3Rpb24gbm9ybWFsaXplSGVhZGVyVmFsdWUodmFsdWUpIHtcbiAgY29uc3QgbmV4dFZhbHVlID0gdmFsdWUucmVwbGFjZShIRUFERVJfVkFMVUVfUkVNT1ZFX1JFR0VYUCwgXCJcIik7XG4gIHJldHVybiBuZXh0VmFsdWU7XG59XG5cbi8vIHNyYy91dGlscy9pc1ZhbGlkSGVhZGVyTmFtZS50c1xuZnVuY3Rpb24gaXNWYWxpZEhlYWRlck5hbWUodmFsdWUpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gXCJzdHJpbmdcIikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAodmFsdWUubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdmFsdWUubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBjaGFyYWN0ZXIgPSB2YWx1ZS5jaGFyQ29kZUF0KGkpO1xuICAgIGlmIChjaGFyYWN0ZXIgPiAxMjcgfHwgIWlzVG9rZW4oY2hhcmFjdGVyKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cbmZ1bmN0aW9uIGlzVG9rZW4odmFsdWUpIHtcbiAgcmV0dXJuICFbXG4gICAgMTI3LFxuICAgIDMyLFxuICAgIFwiKFwiLFxuICAgIFwiKVwiLFxuICAgIFwiPFwiLFxuICAgIFwiPlwiLFxuICAgIFwiQFwiLFxuICAgIFwiLFwiLFxuICAgIFwiO1wiLFxuICAgIFwiOlwiLFxuICAgIFwiXFxcXFwiLFxuICAgICdcIicsXG4gICAgXCIvXCIsXG4gICAgXCJbXCIsXG4gICAgXCJdXCIsXG4gICAgXCI/XCIsXG4gICAgXCI9XCIsXG4gICAgXCJ7XCIsXG4gICAgXCJ9XCJcbiAgXS5pbmNsdWRlcyh2YWx1ZSk7XG59XG5cbi8vIHNyYy91dGlscy9pc1ZhbGlkSGVhZGVyVmFsdWUudHNcbmZ1bmN0aW9uIGlzVmFsaWRIZWFkZXJWYWx1ZSh2YWx1ZSkge1xuICBpZiAodHlwZW9mIHZhbHVlICE9PSBcInN0cmluZ1wiKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmICh2YWx1ZS50cmltKCkgIT09IHZhbHVlKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdmFsdWUubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBjaGFyYWN0ZXIgPSB2YWx1ZS5jaGFyQ29kZUF0KGkpO1xuICAgIGlmIChcbiAgICAgIC8vIE5VTC5cbiAgICAgIGNoYXJhY3RlciA9PT0gMCB8fCAvLyBIVFRQIG5ld2xpbmUgYnl0ZXMuXG4gICAgICBjaGFyYWN0ZXIgPT09IDEwIHx8IGNoYXJhY3RlciA9PT0gMTNcbiAgICApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8vIHNyYy9IZWFkZXJzLnRzXG52YXIgTk9STUFMSVpFRF9IRUFERVJTID0gU3ltYm9sKFwibm9ybWFsaXplZEhlYWRlcnNcIik7XG52YXIgUkFXX0hFQURFUl9OQU1FUyA9IFN5bWJvbChcInJhd0hlYWRlck5hbWVzXCIpO1xudmFyIEhFQURFUl9WQUxVRV9ERUxJTUlURVIgPSBcIiwgXCI7XG52YXIgX2EsIF9iLCBfYztcbnZhciBIZWFkZXJzID0gY2xhc3MgX0hlYWRlcnMge1xuICBjb25zdHJ1Y3Rvcihpbml0KSB7XG4gICAgLy8gTm9ybWFsaXplZCBoZWFkZXIge1wibmFtZVwiOlwiYSwgYlwifSBzdG9yYWdlLlxuICAgIHRoaXNbX2FdID0ge307XG4gICAgLy8gS2VlcHMgdGhlIG1hcHBpbmcgYmV0d2VlbiB0aGUgcmF3IGhlYWRlciBuYW1lXG4gICAgLy8gYW5kIHRoZSBub3JtYWxpemVkIGhlYWRlciBuYW1lIHRvIGVhc2UgdGhlIGxvb2t1cC5cbiAgICB0aGlzW19iXSA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG4gICAgdGhpc1tfY10gPSBcIkhlYWRlcnNcIjtcbiAgICBpZiAoW1wiSGVhZGVyc1wiLCBcIkhlYWRlcnNQb2x5ZmlsbFwiXS5pbmNsdWRlcyhpbml0Py5jb25zdHJ1Y3Rvci5uYW1lKSB8fCBpbml0IGluc3RhbmNlb2YgX0hlYWRlcnMgfHwgdHlwZW9mIGdsb2JhbFRoaXMuSGVhZGVycyAhPT0gXCJ1bmRlZmluZWRcIiAmJiBpbml0IGluc3RhbmNlb2YgZ2xvYmFsVGhpcy5IZWFkZXJzKSB7XG4gICAgICBjb25zdCBpbml0aWFsSGVhZGVycyA9IGluaXQ7XG4gICAgICBpbml0aWFsSGVhZGVycy5mb3JFYWNoKCh2YWx1ZSwgbmFtZSkgPT4ge1xuICAgICAgICB0aGlzLmFwcGVuZChuYW1lLCB2YWx1ZSk7XG4gICAgICB9LCB0aGlzKTtcbiAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoaW5pdCkpIHtcbiAgICAgIGluaXQuZm9yRWFjaCgoW25hbWUsIHZhbHVlXSkgPT4ge1xuICAgICAgICB0aGlzLmFwcGVuZChcbiAgICAgICAgICBuYW1lLFxuICAgICAgICAgIEFycmF5LmlzQXJyYXkodmFsdWUpID8gdmFsdWUuam9pbihIRUFERVJfVkFMVUVfREVMSU1JVEVSKSA6IHZhbHVlXG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKGluaXQpIHtcbiAgICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGluaXQpLmZvckVhY2goKG5hbWUpID0+IHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBpbml0W25hbWVdO1xuICAgICAgICB0aGlzLmFwcGVuZChcbiAgICAgICAgICBuYW1lLFxuICAgICAgICAgIEFycmF5LmlzQXJyYXkodmFsdWUpID8gdmFsdWUuam9pbihIRUFERVJfVkFMVUVfREVMSU1JVEVSKSA6IHZhbHVlXG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgWyhfYSA9IE5PUk1BTElaRURfSEVBREVSUywgX2IgPSBSQVdfSEVBREVSX05BTUVTLCBfYyA9IFN5bWJvbC50b1N0cmluZ1RhZywgU3ltYm9sLml0ZXJhdG9yKV0oKSB7XG4gICAgcmV0dXJuIHRoaXMuZW50cmllcygpO1xuICB9XG4gICprZXlzKCkge1xuICAgIGZvciAoY29uc3QgW25hbWVdIG9mIHRoaXMuZW50cmllcygpKSB7XG4gICAgICB5aWVsZCBuYW1lO1xuICAgIH1cbiAgfVxuICAqdmFsdWVzKCkge1xuICAgIGZvciAoY29uc3QgWywgdmFsdWVdIG9mIHRoaXMuZW50cmllcygpKSB7XG4gICAgICB5aWVsZCB2YWx1ZTtcbiAgICB9XG4gIH1cbiAgKmVudHJpZXMoKSB7XG4gICAgbGV0IHNvcnRlZEtleXMgPSBPYmplY3Qua2V5cyh0aGlzW05PUk1BTElaRURfSEVBREVSU10pLnNvcnQoXG4gICAgICAoYSwgYikgPT4gYS5sb2NhbGVDb21wYXJlKGIpXG4gICAgKTtcbiAgICBmb3IgKGNvbnN0IG5hbWUgb2Ygc29ydGVkS2V5cykge1xuICAgICAgaWYgKG5hbWUgPT09IFwic2V0LWNvb2tpZVwiKSB7XG4gICAgICAgIGZvciAoY29uc3QgdmFsdWUgb2YgdGhpcy5nZXRTZXRDb29raWUoKSkge1xuICAgICAgICAgIHlpZWxkIFtuYW1lLCB2YWx1ZV07XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHlpZWxkIFtuYW1lLCB0aGlzLmdldChuYW1lKV07XG4gICAgICB9XG4gICAgfVxuICB9XG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgYm9vbGVhbiBzdGF0aW5nIHdoZXRoZXIgYSBgSGVhZGVyc2Agb2JqZWN0IGNvbnRhaW5zIGEgY2VydGFpbiBoZWFkZXIuXG4gICAqL1xuICBoYXMobmFtZSkge1xuICAgIGlmICghaXNWYWxpZEhlYWRlck5hbWUobmFtZSkpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYEludmFsaWQgaGVhZGVyIG5hbWUgXCIke25hbWV9XCJgKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNbTk9STUFMSVpFRF9IRUFERVJTXS5oYXNPd25Qcm9wZXJ0eShub3JtYWxpemVIZWFkZXJOYW1lKG5hbWUpKTtcbiAgfVxuICAvKipcbiAgICogUmV0dXJucyBhIGBCeXRlU3RyaW5nYCBzZXF1ZW5jZSBvZiBhbGwgdGhlIHZhbHVlcyBvZiBhIGhlYWRlciB3aXRoIGEgZ2l2ZW4gbmFtZS5cbiAgICovXG4gIGdldChuYW1lKSB7XG4gICAgaWYgKCFpc1ZhbGlkSGVhZGVyTmFtZShuYW1lKSkge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKGBJbnZhbGlkIGhlYWRlciBuYW1lIFwiJHtuYW1lfVwiYCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzW05PUk1BTElaRURfSEVBREVSU11bbm9ybWFsaXplSGVhZGVyTmFtZShuYW1lKV0gPz8gbnVsbDtcbiAgfVxuICAvKipcbiAgICogU2V0cyBhIG5ldyB2YWx1ZSBmb3IgYW4gZXhpc3RpbmcgaGVhZGVyIGluc2lkZSBhIGBIZWFkZXJzYCBvYmplY3QsIG9yIGFkZHMgdGhlIGhlYWRlciBpZiBpdCBkb2VzIG5vdCBhbHJlYWR5IGV4aXN0LlxuICAgKi9cbiAgc2V0KG5hbWUsIHZhbHVlKSB7XG4gICAgaWYgKCFpc1ZhbGlkSGVhZGVyTmFtZShuYW1lKSB8fCAhaXNWYWxpZEhlYWRlclZhbHVlKHZhbHVlKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBub3JtYWxpemVkTmFtZSA9IG5vcm1hbGl6ZUhlYWRlck5hbWUobmFtZSk7XG4gICAgY29uc3Qgbm9ybWFsaXplZFZhbHVlID0gbm9ybWFsaXplSGVhZGVyVmFsdWUodmFsdWUpO1xuICAgIHRoaXNbTk9STUFMSVpFRF9IRUFERVJTXVtub3JtYWxpemVkTmFtZV0gPSBub3JtYWxpemVIZWFkZXJWYWx1ZShub3JtYWxpemVkVmFsdWUpO1xuICAgIHRoaXNbUkFXX0hFQURFUl9OQU1FU10uc2V0KG5vcm1hbGl6ZWROYW1lLCBuYW1lKTtcbiAgfVxuICAvKipcbiAgICogQXBwZW5kcyBhIG5ldyB2YWx1ZSBvbnRvIGFuIGV4aXN0aW5nIGhlYWRlciBpbnNpZGUgYSBgSGVhZGVyc2Agb2JqZWN0LCBvciBhZGRzIHRoZSBoZWFkZXIgaWYgaXQgZG9lcyBub3QgYWxyZWFkeSBleGlzdC5cbiAgICovXG4gIGFwcGVuZChuYW1lLCB2YWx1ZSkge1xuICAgIGlmICghaXNWYWxpZEhlYWRlck5hbWUobmFtZSkgfHwgIWlzVmFsaWRIZWFkZXJWYWx1ZSh2YWx1ZSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3Qgbm9ybWFsaXplZE5hbWUgPSBub3JtYWxpemVIZWFkZXJOYW1lKG5hbWUpO1xuICAgIGNvbnN0IG5vcm1hbGl6ZWRWYWx1ZSA9IG5vcm1hbGl6ZUhlYWRlclZhbHVlKHZhbHVlKTtcbiAgICBsZXQgcmVzb2x2ZWRWYWx1ZSA9IHRoaXMuaGFzKG5vcm1hbGl6ZWROYW1lKSA/IGAke3RoaXMuZ2V0KG5vcm1hbGl6ZWROYW1lKX0sICR7bm9ybWFsaXplZFZhbHVlfWAgOiBub3JtYWxpemVkVmFsdWU7XG4gICAgdGhpcy5zZXQobmFtZSwgcmVzb2x2ZWRWYWx1ZSk7XG4gIH1cbiAgLyoqXG4gICAqIERlbGV0ZXMgYSBoZWFkZXIgZnJvbSB0aGUgYEhlYWRlcnNgIG9iamVjdC5cbiAgICovXG4gIGRlbGV0ZShuYW1lKSB7XG4gICAgaWYgKCFpc1ZhbGlkSGVhZGVyTmFtZShuYW1lKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuaGFzKG5hbWUpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG5vcm1hbGl6ZWROYW1lID0gbm9ybWFsaXplSGVhZGVyTmFtZShuYW1lKTtcbiAgICBkZWxldGUgdGhpc1tOT1JNQUxJWkVEX0hFQURFUlNdW25vcm1hbGl6ZWROYW1lXTtcbiAgICB0aGlzW1JBV19IRUFERVJfTkFNRVNdLmRlbGV0ZShub3JtYWxpemVkTmFtZSk7XG4gIH1cbiAgLyoqXG4gICAqIFRyYXZlcnNlcyB0aGUgYEhlYWRlcnNgIG9iamVjdCxcbiAgICogY2FsbGluZyB0aGUgZ2l2ZW4gY2FsbGJhY2sgZm9yIGVhY2ggaGVhZGVyLlxuICAgKi9cbiAgZm9yRWFjaChjYWxsYmFjaywgdGhpc0FyZykge1xuICAgIGZvciAoY29uc3QgW25hbWUsIHZhbHVlXSBvZiB0aGlzLmVudHJpZXMoKSkge1xuICAgICAgY2FsbGJhY2suY2FsbCh0aGlzQXJnLCB2YWx1ZSwgbmFtZSwgdGhpcyk7XG4gICAgfVxuICB9XG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIGFycmF5IGNvbnRhaW5pbmcgdGhlIHZhbHVlc1xuICAgKiBvZiBhbGwgU2V0LUNvb2tpZSBoZWFkZXJzIGFzc29jaWF0ZWRcbiAgICogd2l0aCBhIHJlc3BvbnNlXG4gICAqL1xuICBnZXRTZXRDb29raWUoKSB7XG4gICAgY29uc3Qgc2V0Q29va2llSGVhZGVyID0gdGhpcy5nZXQoXCJzZXQtY29va2llXCIpO1xuICAgIGlmIChzZXRDb29raWVIZWFkZXIgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgaWYgKHNldENvb2tpZUhlYWRlciA9PT0gXCJcIikge1xuICAgICAgcmV0dXJuIFtcIlwiXTtcbiAgICB9XG4gICAgcmV0dXJuICgwLCBpbXBvcnRfc2V0X2Nvb2tpZV9wYXJzZXIuc3BsaXRDb29raWVzU3RyaW5nKShzZXRDb29raWVIZWFkZXIpO1xuICB9XG59O1xuXG4vLyBzcmMvZ2V0UmF3SGVhZGVycy50c1xuZnVuY3Rpb24gZ2V0UmF3SGVhZGVycyhoZWFkZXJzKSB7XG4gIGNvbnN0IHJhd0hlYWRlcnMgPSB7fTtcbiAgZm9yIChjb25zdCBbbmFtZSwgdmFsdWVdIG9mIGhlYWRlcnMuZW50cmllcygpKSB7XG4gICAgcmF3SGVhZGVyc1toZWFkZXJzW1JBV19IRUFERVJfTkFNRVNdLmdldChuYW1lKV0gPSB2YWx1ZTtcbiAgfVxuICByZXR1cm4gcmF3SGVhZGVycztcbn1cblxuLy8gc3JjL3RyYW5zZm9ybWVycy9oZWFkZXJzVG9MaXN0LnRzXG5mdW5jdGlvbiBoZWFkZXJzVG9MaXN0KGhlYWRlcnMpIHtcbiAgY29uc3QgaGVhZGVyc0xpc3QgPSBbXTtcbiAgaGVhZGVycy5mb3JFYWNoKCh2YWx1ZSwgbmFtZSkgPT4ge1xuICAgIGNvbnN0IHJlc29sdmVkVmFsdWUgPSB2YWx1ZS5pbmNsdWRlcyhcIixcIikgPyB2YWx1ZS5zcGxpdChcIixcIikubWFwKCh2YWx1ZTIpID0+IHZhbHVlMi50cmltKCkpIDogdmFsdWU7XG4gICAgaGVhZGVyc0xpc3QucHVzaChbbmFtZSwgcmVzb2x2ZWRWYWx1ZV0pO1xuICB9KTtcbiAgcmV0dXJuIGhlYWRlcnNMaXN0O1xufVxuXG4vLyBzcmMvdHJhbnNmb3JtZXJzL2hlYWRlcnNUb1N0cmluZy50c1xuZnVuY3Rpb24gaGVhZGVyc1RvU3RyaW5nKGhlYWRlcnMpIHtcbiAgY29uc3QgbGlzdCA9IGhlYWRlcnNUb0xpc3QoaGVhZGVycyk7XG4gIGNvbnN0IGxpbmVzID0gbGlzdC5tYXAoKFtuYW1lLCB2YWx1ZV0pID0+IHtcbiAgICBjb25zdCB2YWx1ZXMgPSBbXS5jb25jYXQodmFsdWUpO1xuICAgIHJldHVybiBgJHtuYW1lfTogJHt2YWx1ZXMuam9pbihcIiwgXCIpfWA7XG4gIH0pO1xuICByZXR1cm4gbGluZXMuam9pbihcIlxcclxcblwiKTtcbn1cblxuLy8gc3JjL3RyYW5zZm9ybWVycy9oZWFkZXJzVG9PYmplY3QudHNcbnZhciBzaW5nbGVWYWx1ZUhlYWRlcnMgPSBbXCJ1c2VyLWFnZW50XCJdO1xuZnVuY3Rpb24gaGVhZGVyc1RvT2JqZWN0KGhlYWRlcnMpIHtcbiAgY29uc3QgaGVhZGVyc09iamVjdCA9IHt9O1xuICBoZWFkZXJzLmZvckVhY2goKHZhbHVlLCBuYW1lKSA9PiB7XG4gICAgY29uc3QgaXNNdWx0aVZhbHVlID0gIXNpbmdsZVZhbHVlSGVhZGVycy5pbmNsdWRlcyhuYW1lLnRvTG93ZXJDYXNlKCkpICYmIHZhbHVlLmluY2x1ZGVzKFwiLFwiKTtcbiAgICBoZWFkZXJzT2JqZWN0W25hbWVdID0gaXNNdWx0aVZhbHVlID8gdmFsdWUuc3BsaXQoXCIsXCIpLm1hcCgocykgPT4gcy50cmltKCkpIDogdmFsdWU7XG4gIH0pO1xuICByZXR1cm4gaGVhZGVyc09iamVjdDtcbn1cblxuLy8gc3JjL3RyYW5zZm9ybWVycy9zdHJpbmdUb0hlYWRlcnMudHNcbmZ1bmN0aW9uIHN0cmluZ1RvSGVhZGVycyhzdHIpIHtcbiAgY29uc3QgbGluZXMgPSBzdHIudHJpbSgpLnNwbGl0KC9bXFxyXFxuXSsvKTtcbiAgcmV0dXJuIGxpbmVzLnJlZHVjZSgoaGVhZGVycywgbGluZSkgPT4ge1xuICAgIGlmIChsaW5lLnRyaW0oKSA9PT0gXCJcIikge1xuICAgICAgcmV0dXJuIGhlYWRlcnM7XG4gICAgfVxuICAgIGNvbnN0IHBhcnRzID0gbGluZS5zcGxpdChcIjogXCIpO1xuICAgIGNvbnN0IG5hbWUgPSBwYXJ0cy5zaGlmdCgpO1xuICAgIGNvbnN0IHZhbHVlID0gcGFydHMuam9pbihcIjogXCIpO1xuICAgIGhlYWRlcnMuYXBwZW5kKG5hbWUsIHZhbHVlKTtcbiAgICByZXR1cm4gaGVhZGVycztcbiAgfSwgbmV3IEhlYWRlcnMoKSk7XG59XG5cbi8vIHNyYy90cmFuc2Zvcm1lcnMvbGlzdFRvSGVhZGVycy50c1xuZnVuY3Rpb24gbGlzdFRvSGVhZGVycyhsaXN0KSB7XG4gIGNvbnN0IGhlYWRlcnMgPSBuZXcgSGVhZGVycygpO1xuICBsaXN0LmZvckVhY2goKFtuYW1lLCB2YWx1ZV0pID0+IHtcbiAgICBjb25zdCB2YWx1ZXMgPSBbXS5jb25jYXQodmFsdWUpO1xuICAgIHZhbHVlcy5mb3JFYWNoKCh2YWx1ZTIpID0+IHtcbiAgICAgIGhlYWRlcnMuYXBwZW5kKG5hbWUsIHZhbHVlMik7XG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4gaGVhZGVycztcbn1cblxuLy8gc3JjL3RyYW5zZm9ybWVycy9yZWR1Y2VIZWFkZXJzT2JqZWN0LnRzXG5mdW5jdGlvbiByZWR1Y2VIZWFkZXJzT2JqZWN0KGhlYWRlcnMsIHJlZHVjZXIsIGluaXRpYWxTdGF0ZSkge1xuICByZXR1cm4gT2JqZWN0LmtleXMoaGVhZGVycykucmVkdWNlKChuZXh0SGVhZGVycywgbmFtZSkgPT4ge1xuICAgIHJldHVybiByZWR1Y2VyKG5leHRIZWFkZXJzLCBuYW1lLCBoZWFkZXJzW25hbWVdKTtcbiAgfSwgaW5pdGlhbFN0YXRlKTtcbn1cblxuLy8gc3JjL3RyYW5zZm9ybWVycy9vYmplY3RUb0hlYWRlcnMudHNcbmZ1bmN0aW9uIG9iamVjdFRvSGVhZGVycyhoZWFkZXJzT2JqZWN0KSB7XG4gIHJldHVybiByZWR1Y2VIZWFkZXJzT2JqZWN0KFxuICAgIGhlYWRlcnNPYmplY3QsXG4gICAgKGhlYWRlcnMsIG5hbWUsIHZhbHVlKSA9PiB7XG4gICAgICBjb25zdCB2YWx1ZXMgPSBbXS5jb25jYXQodmFsdWUpLmZpbHRlcihCb29sZWFuKTtcbiAgICAgIHZhbHVlcy5mb3JFYWNoKCh2YWx1ZTIpID0+IHtcbiAgICAgICAgaGVhZGVycy5hcHBlbmQobmFtZSwgdmFsdWUyKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGhlYWRlcnM7XG4gICAgfSxcbiAgICBuZXcgSGVhZGVycygpXG4gICk7XG59XG5cbi8vIHNyYy90cmFuc2Zvcm1lcnMvZmxhdHRlbkhlYWRlcnNMaXN0LnRzXG5mdW5jdGlvbiBmbGF0dGVuSGVhZGVyc0xpc3QobGlzdCkge1xuICByZXR1cm4gbGlzdC5tYXAoKFtuYW1lLCB2YWx1ZXNdKSA9PiB7XG4gICAgcmV0dXJuIFtuYW1lLCBbXS5jb25jYXQodmFsdWVzKS5qb2luKFwiLCBcIildO1xuICB9KTtcbn1cblxuLy8gc3JjL3RyYW5zZm9ybWVycy9mbGF0dGVuSGVhZGVyc09iamVjdC50c1xuZnVuY3Rpb24gZmxhdHRlbkhlYWRlcnNPYmplY3QoaGVhZGVyc09iamVjdCkge1xuICByZXR1cm4gcmVkdWNlSGVhZGVyc09iamVjdChcbiAgICBoZWFkZXJzT2JqZWN0LFxuICAgIChoZWFkZXJzLCBuYW1lLCB2YWx1ZSkgPT4ge1xuICAgICAgaGVhZGVyc1tuYW1lXSA9IFtdLmNvbmNhdCh2YWx1ZSkuam9pbihcIiwgXCIpO1xuICAgICAgcmV0dXJuIGhlYWRlcnM7XG4gICAgfSxcbiAgICB7fVxuICApO1xufVxuZXhwb3J0IHtcbiAgSGVhZGVycyxcbiAgZmxhdHRlbkhlYWRlcnNMaXN0LFxuICBmbGF0dGVuSGVhZGVyc09iamVjdCxcbiAgZ2V0UmF3SGVhZGVycyxcbiAgaGVhZGVyc1RvTGlzdCxcbiAgaGVhZGVyc1RvT2JqZWN0LFxuICBoZWFkZXJzVG9TdHJpbmcsXG4gIGxpc3RUb0hlYWRlcnMsXG4gIG9iamVjdFRvSGVhZGVycyxcbiAgcmVkdWNlSGVhZGVyc09iamVjdCxcbiAgc3RyaW5nVG9IZWFkZXJzXG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXgubWpzLm1hcCIsImltcG9ydCAqIGFzIF9zeXNjYWxsczJfMCBmcm9tICdzcGFjZXRpbWU6c3lzQDIuMCc7XG5pbXBvcnQgeyBtb2R1bGVIb29rcyB9IGZyb20gJ3NwYWNldGltZTpzeXNAMi4wJztcbmltcG9ydCB7IGhlYWRlcnNUb0xpc3QsIEhlYWRlcnMgfSBmcm9tICdoZWFkZXJzLXBvbHlmaWxsJztcblxudHlwZW9mIGdsb2JhbFRoaXMhPT1cInVuZGVmaW5lZFwiJiYoKGdsb2JhbFRoaXMuZ2xvYmFsPWdsb2JhbFRoaXMuZ2xvYmFsfHxnbG9iYWxUaGlzKSwoZ2xvYmFsVGhpcy53aW5kb3c9Z2xvYmFsVGhpcy53aW5kb3d8fGdsb2JhbFRoaXMpKTtcbnZhciBfX2NyZWF0ZSA9IE9iamVjdC5jcmVhdGU7XG52YXIgX19kZWZQcm9wID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xudmFyIF9fZ2V0T3duUHJvcERlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xudmFyIF9fZ2V0T3duUHJvcE5hbWVzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXM7XG52YXIgX19nZXRQcm90b09mID0gT2JqZWN0LmdldFByb3RvdHlwZU9mO1xudmFyIF9faGFzT3duUHJvcCA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgX19lc20gPSAoZm4sIHJlcykgPT4gZnVuY3Rpb24gX19pbml0KCkge1xuICByZXR1cm4gZm4gJiYgKHJlcyA9ICgwLCBmbltfX2dldE93blByb3BOYW1lcyhmbilbMF1dKShmbiA9IDApKSwgcmVzO1xufTtcbnZhciBfX2NvbW1vbkpTID0gKGNiLCBtb2QpID0+IGZ1bmN0aW9uIF9fcmVxdWlyZSgpIHtcbiAgcmV0dXJuIG1vZCB8fCAoMCwgY2JbX19nZXRPd25Qcm9wTmFtZXMoY2IpWzBdXSkoKG1vZCA9IHsgZXhwb3J0czoge30gfSkuZXhwb3J0cywgbW9kKSwgbW9kLmV4cG9ydHM7XG59O1xudmFyIF9fZXhwb3J0ID0gKHRhcmdldCwgYWxsKSA9PiB7XG4gIGZvciAodmFyIG5hbWUgaW4gYWxsKVxuICAgIF9fZGVmUHJvcCh0YXJnZXQsIG5hbWUsIHsgZ2V0OiBhbGxbbmFtZV0sIGVudW1lcmFibGU6IHRydWUgfSk7XG59O1xudmFyIF9fY29weVByb3BzID0gKHRvLCBmcm9tLCBleGNlcHQsIGRlc2MpID0+IHtcbiAgaWYgKGZyb20gJiYgdHlwZW9mIGZyb20gPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGZyb20gPT09IFwiZnVuY3Rpb25cIikge1xuICAgIGZvciAobGV0IGtleSBvZiBfX2dldE93blByb3BOYW1lcyhmcm9tKSlcbiAgICAgIGlmICghX19oYXNPd25Qcm9wLmNhbGwodG8sIGtleSkgJiYga2V5ICE9PSBleGNlcHQpXG4gICAgICAgIF9fZGVmUHJvcCh0bywga2V5LCB7IGdldDogKCkgPT4gZnJvbVtrZXldLCBlbnVtZXJhYmxlOiAhKGRlc2MgPSBfX2dldE93blByb3BEZXNjKGZyb20sIGtleSkpIHx8IGRlc2MuZW51bWVyYWJsZSB9KTtcbiAgfVxuICByZXR1cm4gdG87XG59O1xudmFyIF9fdG9FU00gPSAobW9kLCBpc05vZGVNb2RlLCB0YXJnZXQpID0+ICh0YXJnZXQgPSBtb2QgIT0gbnVsbCA/IF9fY3JlYXRlKF9fZ2V0UHJvdG9PZihtb2QpKSA6IHt9LCBfX2NvcHlQcm9wcyhcbiAgLy8gSWYgdGhlIGltcG9ydGVyIGlzIGluIG5vZGUgY29tcGF0aWJpbGl0eSBtb2RlIG9yIHRoaXMgaXMgbm90IGFuIEVTTVxuICAvLyBmaWxlIHRoYXQgaGFzIGJlZW4gY29udmVydGVkIHRvIGEgQ29tbW9uSlMgZmlsZSB1c2luZyBhIEJhYmVsLVxuICAvLyBjb21wYXRpYmxlIHRyYW5zZm9ybSAoaS5lLiBcIl9fZXNNb2R1bGVcIiBoYXMgbm90IGJlZW4gc2V0KSwgdGhlbiBzZXRcbiAgLy8gXCJkZWZhdWx0XCIgdG8gdGhlIENvbW1vbkpTIFwibW9kdWxlLmV4cG9ydHNcIiBmb3Igbm9kZSBjb21wYXRpYmlsaXR5LlxuICBfX2RlZlByb3AodGFyZ2V0LCBcImRlZmF1bHRcIiwgeyB2YWx1ZTogbW9kLCBlbnVtZXJhYmxlOiB0cnVlIH0pICxcbiAgbW9kXG4pKTtcbnZhciBfX3RvQ29tbW9uSlMgPSAobW9kKSA9PiBfX2NvcHlQcm9wcyhfX2RlZlByb3Aoe30sIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pLCBtb2QpO1xuXG4vLyAuLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vYmFzZTY0LWpzQDEuNS4xL25vZGVfbW9kdWxlcy9iYXNlNjQtanMvaW5kZXguanNcbnZhciByZXF1aXJlX2Jhc2U2NF9qcyA9IF9fY29tbW9uSlMoe1xuICBcIi4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9iYXNlNjQtanNAMS41LjEvbm9kZV9tb2R1bGVzL2Jhc2U2NC1qcy9pbmRleC5qc1wiKGV4cG9ydHMpIHtcbiAgICBleHBvcnRzLmJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoO1xuICAgIGV4cG9ydHMudG9CeXRlQXJyYXkgPSB0b0J5dGVBcnJheTtcbiAgICBleHBvcnRzLmZyb21CeXRlQXJyYXkgPSBmcm9tQnl0ZUFycmF5MjtcbiAgICB2YXIgbG9va3VwID0gW107XG4gICAgdmFyIHJldkxvb2t1cCA9IFtdO1xuICAgIHZhciBBcnIgPSB0eXBlb2YgVWludDhBcnJheSAhPT0gXCJ1bmRlZmluZWRcIiA/IFVpbnQ4QXJyYXkgOiBBcnJheTtcbiAgICB2YXIgY29kZSA9IFwiQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrL1wiO1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IGNvZGUubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgIGxvb2t1cFtpXSA9IGNvZGVbaV07XG4gICAgICByZXZMb29rdXBbY29kZS5jaGFyQ29kZUF0KGkpXSA9IGk7XG4gICAgfVxuICAgIHZhciBpO1xuICAgIHZhciBsZW47XG4gICAgcmV2TG9va3VwW1wiLVwiLmNoYXJDb2RlQXQoMCldID0gNjI7XG4gICAgcmV2TG9va3VwW1wiX1wiLmNoYXJDb2RlQXQoMCldID0gNjM7XG4gICAgZnVuY3Rpb24gZ2V0TGVucyhiNjQpIHtcbiAgICAgIHZhciBsZW4yID0gYjY0Lmxlbmd0aDtcbiAgICAgIGlmIChsZW4yICUgNCA+IDApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBzdHJpbmcuIExlbmd0aCBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgNFwiKTtcbiAgICAgIH1cbiAgICAgIHZhciB2YWxpZExlbiA9IGI2NC5pbmRleE9mKFwiPVwiKTtcbiAgICAgIGlmICh2YWxpZExlbiA9PT0gLTEpIHZhbGlkTGVuID0gbGVuMjtcbiAgICAgIHZhciBwbGFjZUhvbGRlcnNMZW4gPSB2YWxpZExlbiA9PT0gbGVuMiA/IDAgOiA0IC0gdmFsaWRMZW4gJSA0O1xuICAgICAgcmV0dXJuIFt2YWxpZExlbiwgcGxhY2VIb2xkZXJzTGVuXTtcbiAgICB9XG4gICAgZnVuY3Rpb24gYnl0ZUxlbmd0aChiNjQpIHtcbiAgICAgIHZhciBsZW5zID0gZ2V0TGVucyhiNjQpO1xuICAgICAgdmFyIHZhbGlkTGVuID0gbGVuc1swXTtcbiAgICAgIHZhciBwbGFjZUhvbGRlcnNMZW4gPSBsZW5zWzFdO1xuICAgICAgcmV0dXJuICh2YWxpZExlbiArIHBsYWNlSG9sZGVyc0xlbikgKiAzIC8gNCAtIHBsYWNlSG9sZGVyc0xlbjtcbiAgICB9XG4gICAgZnVuY3Rpb24gX2J5dGVMZW5ndGgoYjY0LCB2YWxpZExlbiwgcGxhY2VIb2xkZXJzTGVuKSB7XG4gICAgICByZXR1cm4gKHZhbGlkTGVuICsgcGxhY2VIb2xkZXJzTGVuKSAqIDMgLyA0IC0gcGxhY2VIb2xkZXJzTGVuO1xuICAgIH1cbiAgICBmdW5jdGlvbiB0b0J5dGVBcnJheShiNjQpIHtcbiAgICAgIHZhciB0bXA7XG4gICAgICB2YXIgbGVucyA9IGdldExlbnMoYjY0KTtcbiAgICAgIHZhciB2YWxpZExlbiA9IGxlbnNbMF07XG4gICAgICB2YXIgcGxhY2VIb2xkZXJzTGVuID0gbGVuc1sxXTtcbiAgICAgIHZhciBhcnIgPSBuZXcgQXJyKF9ieXRlTGVuZ3RoKGI2NCwgdmFsaWRMZW4sIHBsYWNlSG9sZGVyc0xlbikpO1xuICAgICAgdmFyIGN1ckJ5dGUgPSAwO1xuICAgICAgdmFyIGxlbjIgPSBwbGFjZUhvbGRlcnNMZW4gPiAwID8gdmFsaWRMZW4gLSA0IDogdmFsaWRMZW47XG4gICAgICB2YXIgaTI7XG4gICAgICBmb3IgKGkyID0gMDsgaTIgPCBsZW4yOyBpMiArPSA0KSB7XG4gICAgICAgIHRtcCA9IHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpMildIDw8IDE4IHwgcmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkyICsgMSldIDw8IDEyIHwgcmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkyICsgMildIDw8IDYgfCByZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaTIgKyAzKV07XG4gICAgICAgIGFycltjdXJCeXRlKytdID0gdG1wID4+IDE2ICYgMjU1O1xuICAgICAgICBhcnJbY3VyQnl0ZSsrXSA9IHRtcCA+PiA4ICYgMjU1O1xuICAgICAgICBhcnJbY3VyQnl0ZSsrXSA9IHRtcCAmIDI1NTtcbiAgICAgIH1cbiAgICAgIGlmIChwbGFjZUhvbGRlcnNMZW4gPT09IDIpIHtcbiAgICAgICAgdG1wID0gcmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkyKV0gPDwgMiB8IHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpMiArIDEpXSA+PiA0O1xuICAgICAgICBhcnJbY3VyQnl0ZSsrXSA9IHRtcCAmIDI1NTtcbiAgICAgIH1cbiAgICAgIGlmIChwbGFjZUhvbGRlcnNMZW4gPT09IDEpIHtcbiAgICAgICAgdG1wID0gcmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkyKV0gPDwgMTAgfCByZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaTIgKyAxKV0gPDwgNCB8IHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpMiArIDIpXSA+PiAyO1xuICAgICAgICBhcnJbY3VyQnl0ZSsrXSA9IHRtcCA+PiA4ICYgMjU1O1xuICAgICAgICBhcnJbY3VyQnl0ZSsrXSA9IHRtcCAmIDI1NTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBhcnI7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHRyaXBsZXRUb0Jhc2U2NChudW0pIHtcbiAgICAgIHJldHVybiBsb29rdXBbbnVtID4+IDE4ICYgNjNdICsgbG9va3VwW251bSA+PiAxMiAmIDYzXSArIGxvb2t1cFtudW0gPj4gNiAmIDYzXSArIGxvb2t1cFtudW0gJiA2M107XG4gICAgfVxuICAgIGZ1bmN0aW9uIGVuY29kZUNodW5rKHVpbnQ4LCBzdGFydCwgZW5kKSB7XG4gICAgICB2YXIgdG1wO1xuICAgICAgdmFyIG91dHB1dCA9IFtdO1xuICAgICAgZm9yICh2YXIgaTIgPSBzdGFydDsgaTIgPCBlbmQ7IGkyICs9IDMpIHtcbiAgICAgICAgdG1wID0gKHVpbnQ4W2kyXSA8PCAxNiAmIDE2NzExNjgwKSArICh1aW50OFtpMiArIDFdIDw8IDggJiA2NTI4MCkgKyAodWludDhbaTIgKyAyXSAmIDI1NSk7XG4gICAgICAgIG91dHB1dC5wdXNoKHRyaXBsZXRUb0Jhc2U2NCh0bXApKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBvdXRwdXQuam9pbihcIlwiKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZnJvbUJ5dGVBcnJheTIodWludDgpIHtcbiAgICAgIHZhciB0bXA7XG4gICAgICB2YXIgbGVuMiA9IHVpbnQ4Lmxlbmd0aDtcbiAgICAgIHZhciBleHRyYUJ5dGVzID0gbGVuMiAlIDM7XG4gICAgICB2YXIgcGFydHMgPSBbXTtcbiAgICAgIHZhciBtYXhDaHVua0xlbmd0aCA9IDE2MzgzO1xuICAgICAgZm9yICh2YXIgaTIgPSAwLCBsZW4yMiA9IGxlbjIgLSBleHRyYUJ5dGVzOyBpMiA8IGxlbjIyOyBpMiArPSBtYXhDaHVua0xlbmd0aCkge1xuICAgICAgICBwYXJ0cy5wdXNoKGVuY29kZUNodW5rKHVpbnQ4LCBpMiwgaTIgKyBtYXhDaHVua0xlbmd0aCA+IGxlbjIyID8gbGVuMjIgOiBpMiArIG1heENodW5rTGVuZ3RoKSk7XG4gICAgICB9XG4gICAgICBpZiAoZXh0cmFCeXRlcyA9PT0gMSkge1xuICAgICAgICB0bXAgPSB1aW50OFtsZW4yIC0gMV07XG4gICAgICAgIHBhcnRzLnB1c2goXG4gICAgICAgICAgbG9va3VwW3RtcCA+PiAyXSArIGxvb2t1cFt0bXAgPDwgNCAmIDYzXSArIFwiPT1cIlxuICAgICAgICApO1xuICAgICAgfSBlbHNlIGlmIChleHRyYUJ5dGVzID09PSAyKSB7XG4gICAgICAgIHRtcCA9ICh1aW50OFtsZW4yIC0gMl0gPDwgOCkgKyB1aW50OFtsZW4yIC0gMV07XG4gICAgICAgIHBhcnRzLnB1c2goXG4gICAgICAgICAgbG9va3VwW3RtcCA+PiAxMF0gKyBsb29rdXBbdG1wID4+IDQgJiA2M10gKyBsb29rdXBbdG1wIDw8IDIgJiA2M10gKyBcIj1cIlxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHBhcnRzLmpvaW4oXCJcIik7XG4gICAgfVxuICB9XG59KTtcblxuLy8gLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3N0YXR1c2VzQDIuMC4yL25vZGVfbW9kdWxlcy9zdGF0dXNlcy9jb2Rlcy5qc29uXG52YXIgcmVxdWlyZV9jb2RlcyA9IF9fY29tbW9uSlMoe1xuICBcIi4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9zdGF0dXNlc0AyLjAuMi9ub2RlX21vZHVsZXMvc3RhdHVzZXMvY29kZXMuanNvblwiKGV4cG9ydHMsIG1vZHVsZSkge1xuICAgIG1vZHVsZS5leHBvcnRzID0ge1xuICAgICAgXCIxMDBcIjogXCJDb250aW51ZVwiLFxuICAgICAgXCIxMDFcIjogXCJTd2l0Y2hpbmcgUHJvdG9jb2xzXCIsXG4gICAgICBcIjEwMlwiOiBcIlByb2Nlc3NpbmdcIixcbiAgICAgIFwiMTAzXCI6IFwiRWFybHkgSGludHNcIixcbiAgICAgIFwiMjAwXCI6IFwiT0tcIixcbiAgICAgIFwiMjAxXCI6IFwiQ3JlYXRlZFwiLFxuICAgICAgXCIyMDJcIjogXCJBY2NlcHRlZFwiLFxuICAgICAgXCIyMDNcIjogXCJOb24tQXV0aG9yaXRhdGl2ZSBJbmZvcm1hdGlvblwiLFxuICAgICAgXCIyMDRcIjogXCJObyBDb250ZW50XCIsXG4gICAgICBcIjIwNVwiOiBcIlJlc2V0IENvbnRlbnRcIixcbiAgICAgIFwiMjA2XCI6IFwiUGFydGlhbCBDb250ZW50XCIsXG4gICAgICBcIjIwN1wiOiBcIk11bHRpLVN0YXR1c1wiLFxuICAgICAgXCIyMDhcIjogXCJBbHJlYWR5IFJlcG9ydGVkXCIsXG4gICAgICBcIjIyNlwiOiBcIklNIFVzZWRcIixcbiAgICAgIFwiMzAwXCI6IFwiTXVsdGlwbGUgQ2hvaWNlc1wiLFxuICAgICAgXCIzMDFcIjogXCJNb3ZlZCBQZXJtYW5lbnRseVwiLFxuICAgICAgXCIzMDJcIjogXCJGb3VuZFwiLFxuICAgICAgXCIzMDNcIjogXCJTZWUgT3RoZXJcIixcbiAgICAgIFwiMzA0XCI6IFwiTm90IE1vZGlmaWVkXCIsXG4gICAgICBcIjMwNVwiOiBcIlVzZSBQcm94eVwiLFxuICAgICAgXCIzMDdcIjogXCJUZW1wb3JhcnkgUmVkaXJlY3RcIixcbiAgICAgIFwiMzA4XCI6IFwiUGVybWFuZW50IFJlZGlyZWN0XCIsXG4gICAgICBcIjQwMFwiOiBcIkJhZCBSZXF1ZXN0XCIsXG4gICAgICBcIjQwMVwiOiBcIlVuYXV0aG9yaXplZFwiLFxuICAgICAgXCI0MDJcIjogXCJQYXltZW50IFJlcXVpcmVkXCIsXG4gICAgICBcIjQwM1wiOiBcIkZvcmJpZGRlblwiLFxuICAgICAgXCI0MDRcIjogXCJOb3QgRm91bmRcIixcbiAgICAgIFwiNDA1XCI6IFwiTWV0aG9kIE5vdCBBbGxvd2VkXCIsXG4gICAgICBcIjQwNlwiOiBcIk5vdCBBY2NlcHRhYmxlXCIsXG4gICAgICBcIjQwN1wiOiBcIlByb3h5IEF1dGhlbnRpY2F0aW9uIFJlcXVpcmVkXCIsXG4gICAgICBcIjQwOFwiOiBcIlJlcXVlc3QgVGltZW91dFwiLFxuICAgICAgXCI0MDlcIjogXCJDb25mbGljdFwiLFxuICAgICAgXCI0MTBcIjogXCJHb25lXCIsXG4gICAgICBcIjQxMVwiOiBcIkxlbmd0aCBSZXF1aXJlZFwiLFxuICAgICAgXCI0MTJcIjogXCJQcmVjb25kaXRpb24gRmFpbGVkXCIsXG4gICAgICBcIjQxM1wiOiBcIlBheWxvYWQgVG9vIExhcmdlXCIsXG4gICAgICBcIjQxNFwiOiBcIlVSSSBUb28gTG9uZ1wiLFxuICAgICAgXCI0MTVcIjogXCJVbnN1cHBvcnRlZCBNZWRpYSBUeXBlXCIsXG4gICAgICBcIjQxNlwiOiBcIlJhbmdlIE5vdCBTYXRpc2ZpYWJsZVwiLFxuICAgICAgXCI0MTdcIjogXCJFeHBlY3RhdGlvbiBGYWlsZWRcIixcbiAgICAgIFwiNDE4XCI6IFwiSSdtIGEgVGVhcG90XCIsXG4gICAgICBcIjQyMVwiOiBcIk1pc2RpcmVjdGVkIFJlcXVlc3RcIixcbiAgICAgIFwiNDIyXCI6IFwiVW5wcm9jZXNzYWJsZSBFbnRpdHlcIixcbiAgICAgIFwiNDIzXCI6IFwiTG9ja2VkXCIsXG4gICAgICBcIjQyNFwiOiBcIkZhaWxlZCBEZXBlbmRlbmN5XCIsXG4gICAgICBcIjQyNVwiOiBcIlRvbyBFYXJseVwiLFxuICAgICAgXCI0MjZcIjogXCJVcGdyYWRlIFJlcXVpcmVkXCIsXG4gICAgICBcIjQyOFwiOiBcIlByZWNvbmRpdGlvbiBSZXF1aXJlZFwiLFxuICAgICAgXCI0MjlcIjogXCJUb28gTWFueSBSZXF1ZXN0c1wiLFxuICAgICAgXCI0MzFcIjogXCJSZXF1ZXN0IEhlYWRlciBGaWVsZHMgVG9vIExhcmdlXCIsXG4gICAgICBcIjQ1MVwiOiBcIlVuYXZhaWxhYmxlIEZvciBMZWdhbCBSZWFzb25zXCIsXG4gICAgICBcIjUwMFwiOiBcIkludGVybmFsIFNlcnZlciBFcnJvclwiLFxuICAgICAgXCI1MDFcIjogXCJOb3QgSW1wbGVtZW50ZWRcIixcbiAgICAgIFwiNTAyXCI6IFwiQmFkIEdhdGV3YXlcIixcbiAgICAgIFwiNTAzXCI6IFwiU2VydmljZSBVbmF2YWlsYWJsZVwiLFxuICAgICAgXCI1MDRcIjogXCJHYXRld2F5IFRpbWVvdXRcIixcbiAgICAgIFwiNTA1XCI6IFwiSFRUUCBWZXJzaW9uIE5vdCBTdXBwb3J0ZWRcIixcbiAgICAgIFwiNTA2XCI6IFwiVmFyaWFudCBBbHNvIE5lZ290aWF0ZXNcIixcbiAgICAgIFwiNTA3XCI6IFwiSW5zdWZmaWNpZW50IFN0b3JhZ2VcIixcbiAgICAgIFwiNTA4XCI6IFwiTG9vcCBEZXRlY3RlZFwiLFxuICAgICAgXCI1MDlcIjogXCJCYW5kd2lkdGggTGltaXQgRXhjZWVkZWRcIixcbiAgICAgIFwiNTEwXCI6IFwiTm90IEV4dGVuZGVkXCIsXG4gICAgICBcIjUxMVwiOiBcIk5ldHdvcmsgQXV0aGVudGljYXRpb24gUmVxdWlyZWRcIlxuICAgIH07XG4gIH1cbn0pO1xuXG4vLyAuLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vc3RhdHVzZXNAMi4wLjIvbm9kZV9tb2R1bGVzL3N0YXR1c2VzL2luZGV4LmpzXG52YXIgcmVxdWlyZV9zdGF0dXNlcyA9IF9fY29tbW9uSlMoe1xuICBcIi4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9zdGF0dXNlc0AyLjAuMi9ub2RlX21vZHVsZXMvc3RhdHVzZXMvaW5kZXguanNcIihleHBvcnRzLCBtb2R1bGUpIHtcbiAgICB2YXIgY29kZXMgPSByZXF1aXJlX2NvZGVzKCk7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBzdGF0dXMyO1xuICAgIHN0YXR1czIubWVzc2FnZSA9IGNvZGVzO1xuICAgIHN0YXR1czIuY29kZSA9IGNyZWF0ZU1lc3NhZ2VUb1N0YXR1c0NvZGVNYXAoY29kZXMpO1xuICAgIHN0YXR1czIuY29kZXMgPSBjcmVhdGVTdGF0dXNDb2RlTGlzdChjb2Rlcyk7XG4gICAgc3RhdHVzMi5yZWRpcmVjdCA9IHtcbiAgICAgIDMwMDogdHJ1ZSxcbiAgICAgIDMwMTogdHJ1ZSxcbiAgICAgIDMwMjogdHJ1ZSxcbiAgICAgIDMwMzogdHJ1ZSxcbiAgICAgIDMwNTogdHJ1ZSxcbiAgICAgIDMwNzogdHJ1ZSxcbiAgICAgIDMwODogdHJ1ZVxuICAgIH07XG4gICAgc3RhdHVzMi5lbXB0eSA9IHtcbiAgICAgIDIwNDogdHJ1ZSxcbiAgICAgIDIwNTogdHJ1ZSxcbiAgICAgIDMwNDogdHJ1ZVxuICAgIH07XG4gICAgc3RhdHVzMi5yZXRyeSA9IHtcbiAgICAgIDUwMjogdHJ1ZSxcbiAgICAgIDUwMzogdHJ1ZSxcbiAgICAgIDUwNDogdHJ1ZVxuICAgIH07XG4gICAgZnVuY3Rpb24gY3JlYXRlTWVzc2FnZVRvU3RhdHVzQ29kZU1hcChjb2RlczIpIHtcbiAgICAgIHZhciBtYXAgPSB7fTtcbiAgICAgIE9iamVjdC5rZXlzKGNvZGVzMikuZm9yRWFjaChmdW5jdGlvbiBmb3JFYWNoQ29kZShjb2RlKSB7XG4gICAgICAgIHZhciBtZXNzYWdlID0gY29kZXMyW2NvZGVdO1xuICAgICAgICB2YXIgc3RhdHVzMyA9IE51bWJlcihjb2RlKTtcbiAgICAgICAgbWFwW21lc3NhZ2UudG9Mb3dlckNhc2UoKV0gPSBzdGF0dXMzO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gbWFwO1xuICAgIH1cbiAgICBmdW5jdGlvbiBjcmVhdGVTdGF0dXNDb2RlTGlzdChjb2RlczIpIHtcbiAgICAgIHJldHVybiBPYmplY3Qua2V5cyhjb2RlczIpLm1hcChmdW5jdGlvbiBtYXBDb2RlKGNvZGUpIHtcbiAgICAgICAgcmV0dXJuIE51bWJlcihjb2RlKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBmdW5jdGlvbiBnZXRTdGF0dXNDb2RlKG1lc3NhZ2UpIHtcbiAgICAgIHZhciBtc2cgPSBtZXNzYWdlLnRvTG93ZXJDYXNlKCk7XG4gICAgICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzdGF0dXMyLmNvZGUsIG1zZykpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIHN0YXR1cyBtZXNzYWdlOiBcIicgKyBtZXNzYWdlICsgJ1wiJyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gc3RhdHVzMi5jb2RlW21zZ107XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdldFN0YXR1c01lc3NhZ2UoY29kZSkge1xuICAgICAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc3RhdHVzMi5tZXNzYWdlLCBjb2RlKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJpbnZhbGlkIHN0YXR1cyBjb2RlOiBcIiArIGNvZGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHN0YXR1czIubWVzc2FnZVtjb2RlXTtcbiAgICB9XG4gICAgZnVuY3Rpb24gc3RhdHVzMihjb2RlKSB7XG4gICAgICBpZiAodHlwZW9mIGNvZGUgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgcmV0dXJuIGdldFN0YXR1c01lc3NhZ2UoY29kZSk7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGNvZGUgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImNvZGUgbXVzdCBiZSBhIG51bWJlciBvciBzdHJpbmdcIik7XG4gICAgICB9XG4gICAgICB2YXIgbiA9IHBhcnNlSW50KGNvZGUsIDEwKTtcbiAgICAgIGlmICghaXNOYU4obikpIHtcbiAgICAgICAgcmV0dXJuIGdldFN0YXR1c01lc3NhZ2Uobik7XG4gICAgICB9XG4gICAgICByZXR1cm4gZ2V0U3RhdHVzQ29kZShjb2RlKTtcbiAgICB9XG4gIH1cbn0pO1xuXG4vLyBzcmMvdXRpbC1zdHViLnRzXG52YXIgdXRpbF9zdHViX2V4cG9ydHMgPSB7fTtcbl9fZXhwb3J0KHV0aWxfc3R1Yl9leHBvcnRzLCB7XG4gIGluc3BlY3Q6ICgpID0+IGluc3BlY3Rcbn0pO1xudmFyIGluc3BlY3Q7XG52YXIgaW5pdF91dGlsX3N0dWIgPSBfX2VzbSh7XG4gIFwic3JjL3V0aWwtc3R1Yi50c1wiKCkge1xuICAgIGluc3BlY3QgPSB7fTtcbiAgfVxufSk7XG5cbi8vIC4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9vYmplY3QtaW5zcGVjdEAxLjEzLjQvbm9kZV9tb2R1bGVzL29iamVjdC1pbnNwZWN0L3V0aWwuaW5zcGVjdC5qc1xudmFyIHJlcXVpcmVfdXRpbF9pbnNwZWN0ID0gX19jb21tb25KUyh7XG4gIFwiLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL29iamVjdC1pbnNwZWN0QDEuMTMuNC9ub2RlX21vZHVsZXMvb2JqZWN0LWluc3BlY3QvdXRpbC5pbnNwZWN0LmpzXCIoZXhwb3J0cywgbW9kdWxlKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSAoaW5pdF91dGlsX3N0dWIoKSwgX190b0NvbW1vbkpTKHV0aWxfc3R1Yl9leHBvcnRzKSkuaW5zcGVjdDtcbiAgfVxufSk7XG5cbi8vIC4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9vYmplY3QtaW5zcGVjdEAxLjEzLjQvbm9kZV9tb2R1bGVzL29iamVjdC1pbnNwZWN0L2luZGV4LmpzXG52YXIgcmVxdWlyZV9vYmplY3RfaW5zcGVjdCA9IF9fY29tbW9uSlMoe1xuICBcIi4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9vYmplY3QtaW5zcGVjdEAxLjEzLjQvbm9kZV9tb2R1bGVzL29iamVjdC1pbnNwZWN0L2luZGV4LmpzXCIoZXhwb3J0cywgbW9kdWxlKSB7XG4gICAgdmFyIGhhc01hcCA9IHR5cGVvZiBNYXAgPT09IFwiZnVuY3Rpb25cIiAmJiBNYXAucHJvdG90eXBlO1xuICAgIHZhciBtYXBTaXplRGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgJiYgaGFzTWFwID8gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihNYXAucHJvdG90eXBlLCBcInNpemVcIikgOiBudWxsO1xuICAgIHZhciBtYXBTaXplID0gaGFzTWFwICYmIG1hcFNpemVEZXNjcmlwdG9yICYmIHR5cGVvZiBtYXBTaXplRGVzY3JpcHRvci5nZXQgPT09IFwiZnVuY3Rpb25cIiA/IG1hcFNpemVEZXNjcmlwdG9yLmdldCA6IG51bGw7XG4gICAgdmFyIG1hcEZvckVhY2ggPSBoYXNNYXAgJiYgTWFwLnByb3RvdHlwZS5mb3JFYWNoO1xuICAgIHZhciBoYXNTZXQgPSB0eXBlb2YgU2V0ID09PSBcImZ1bmN0aW9uXCIgJiYgU2V0LnByb3RvdHlwZTtcbiAgICB2YXIgc2V0U2l6ZURlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yICYmIGhhc1NldCA/IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoU2V0LnByb3RvdHlwZSwgXCJzaXplXCIpIDogbnVsbDtcbiAgICB2YXIgc2V0U2l6ZSA9IGhhc1NldCAmJiBzZXRTaXplRGVzY3JpcHRvciAmJiB0eXBlb2Ygc2V0U2l6ZURlc2NyaXB0b3IuZ2V0ID09PSBcImZ1bmN0aW9uXCIgPyBzZXRTaXplRGVzY3JpcHRvci5nZXQgOiBudWxsO1xuICAgIHZhciBzZXRGb3JFYWNoID0gaGFzU2V0ICYmIFNldC5wcm90b3R5cGUuZm9yRWFjaDtcbiAgICB2YXIgaGFzV2Vha01hcCA9IHR5cGVvZiBXZWFrTWFwID09PSBcImZ1bmN0aW9uXCIgJiYgV2Vha01hcC5wcm90b3R5cGU7XG4gICAgdmFyIHdlYWtNYXBIYXMgPSBoYXNXZWFrTWFwID8gV2Vha01hcC5wcm90b3R5cGUuaGFzIDogbnVsbDtcbiAgICB2YXIgaGFzV2Vha1NldCA9IHR5cGVvZiBXZWFrU2V0ID09PSBcImZ1bmN0aW9uXCIgJiYgV2Vha1NldC5wcm90b3R5cGU7XG4gICAgdmFyIHdlYWtTZXRIYXMgPSBoYXNXZWFrU2V0ID8gV2Vha1NldC5wcm90b3R5cGUuaGFzIDogbnVsbDtcbiAgICB2YXIgaGFzV2Vha1JlZiA9IHR5cGVvZiBXZWFrUmVmID09PSBcImZ1bmN0aW9uXCIgJiYgV2Vha1JlZi5wcm90b3R5cGU7XG4gICAgdmFyIHdlYWtSZWZEZXJlZiA9IGhhc1dlYWtSZWYgPyBXZWFrUmVmLnByb3RvdHlwZS5kZXJlZiA6IG51bGw7XG4gICAgdmFyIGJvb2xlYW5WYWx1ZU9mID0gQm9vbGVhbi5wcm90b3R5cGUudmFsdWVPZjtcbiAgICB2YXIgb2JqZWN0VG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuICAgIHZhciBmdW5jdGlvblRvU3RyaW5nID0gRnVuY3Rpb24ucHJvdG90eXBlLnRvU3RyaW5nO1xuICAgIHZhciAkbWF0Y2ggPSBTdHJpbmcucHJvdG90eXBlLm1hdGNoO1xuICAgIHZhciAkc2xpY2UgPSBTdHJpbmcucHJvdG90eXBlLnNsaWNlO1xuICAgIHZhciAkcmVwbGFjZSA9IFN0cmluZy5wcm90b3R5cGUucmVwbGFjZTtcbiAgICB2YXIgJHRvVXBwZXJDYXNlID0gU3RyaW5nLnByb3RvdHlwZS50b1VwcGVyQ2FzZTtcbiAgICB2YXIgJHRvTG93ZXJDYXNlID0gU3RyaW5nLnByb3RvdHlwZS50b0xvd2VyQ2FzZTtcbiAgICB2YXIgJHRlc3QgPSBSZWdFeHAucHJvdG90eXBlLnRlc3Q7XG4gICAgdmFyICRjb25jYXQgPSBBcnJheS5wcm90b3R5cGUuY29uY2F0O1xuICAgIHZhciAkam9pbiA9IEFycmF5LnByb3RvdHlwZS5qb2luO1xuICAgIHZhciAkYXJyU2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG4gICAgdmFyICRmbG9vciA9IE1hdGguZmxvb3I7XG4gICAgdmFyIGJpZ0ludFZhbHVlT2YgPSB0eXBlb2YgQmlnSW50ID09PSBcImZ1bmN0aW9uXCIgPyBCaWdJbnQucHJvdG90eXBlLnZhbHVlT2YgOiBudWxsO1xuICAgIHZhciBnT1BTID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scztcbiAgICB2YXIgc3ltVG9TdHJpbmcgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIiA/IFN5bWJvbC5wcm90b3R5cGUudG9TdHJpbmcgOiBudWxsO1xuICAgIHZhciBoYXNTaGFtbWVkU3ltYm9scyA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcIm9iamVjdFwiO1xuICAgIHZhciB0b1N0cmluZ1RhZyA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBTeW1ib2wudG9TdHJpbmdUYWcgJiYgKHR5cGVvZiBTeW1ib2wudG9TdHJpbmdUYWcgPT09IGhhc1NoYW1tZWRTeW1ib2xzID8gXCJvYmplY3RcIiA6IFwic3ltYm9sXCIpID8gU3ltYm9sLnRvU3RyaW5nVGFnIDogbnVsbDtcbiAgICB2YXIgaXNFbnVtZXJhYmxlID0gT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcbiAgICB2YXIgZ1BPID0gKHR5cGVvZiBSZWZsZWN0ID09PSBcImZ1bmN0aW9uXCIgPyBSZWZsZWN0LmdldFByb3RvdHlwZU9mIDogT2JqZWN0LmdldFByb3RvdHlwZU9mKSB8fCAoW10uX19wcm90b19fID09PSBBcnJheS5wcm90b3R5cGUgPyBmdW5jdGlvbihPKSB7XG4gICAgICByZXR1cm4gTy5fX3Byb3RvX187XG4gICAgfSA6IG51bGwpO1xuICAgIGZ1bmN0aW9uIGFkZE51bWVyaWNTZXBhcmF0b3IobnVtLCBzdHIpIHtcbiAgICAgIGlmIChudW0gPT09IEluZmluaXR5IHx8IG51bSA9PT0gLUluZmluaXR5IHx8IG51bSAhPT0gbnVtIHx8IG51bSAmJiBudW0gPiAtMWUzICYmIG51bSA8IDFlMyB8fCAkdGVzdC5jYWxsKC9lLywgc3RyKSkge1xuICAgICAgICByZXR1cm4gc3RyO1xuICAgICAgfVxuICAgICAgdmFyIHNlcFJlZ2V4ID0gL1swLTldKD89KD86WzAtOV17M30pKyg/IVswLTldKSkvZztcbiAgICAgIGlmICh0eXBlb2YgbnVtID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgIHZhciBpbnQgPSBudW0gPCAwID8gLSRmbG9vcigtbnVtKSA6ICRmbG9vcihudW0pO1xuICAgICAgICBpZiAoaW50ICE9PSBudW0pIHtcbiAgICAgICAgICB2YXIgaW50U3RyID0gU3RyaW5nKGludCk7XG4gICAgICAgICAgdmFyIGRlYyA9ICRzbGljZS5jYWxsKHN0ciwgaW50U3RyLmxlbmd0aCArIDEpO1xuICAgICAgICAgIHJldHVybiAkcmVwbGFjZS5jYWxsKGludFN0ciwgc2VwUmVnZXgsIFwiJCZfXCIpICsgXCIuXCIgKyAkcmVwbGFjZS5jYWxsKCRyZXBsYWNlLmNhbGwoZGVjLCAvKFswLTldezN9KS9nLCBcIiQmX1wiKSwgL18kLywgXCJcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiAkcmVwbGFjZS5jYWxsKHN0ciwgc2VwUmVnZXgsIFwiJCZfXCIpO1xuICAgIH1cbiAgICB2YXIgdXRpbEluc3BlY3QgPSByZXF1aXJlX3V0aWxfaW5zcGVjdCgpO1xuICAgIHZhciBpbnNwZWN0Q3VzdG9tID0gdXRpbEluc3BlY3QuY3VzdG9tO1xuICAgIHZhciBpbnNwZWN0U3ltYm9sID0gaXNTeW1ib2woaW5zcGVjdEN1c3RvbSkgPyBpbnNwZWN0Q3VzdG9tIDogbnVsbDtcbiAgICB2YXIgcXVvdGVzID0ge1xuICAgICAgX19wcm90b19fOiBudWxsLFxuICAgICAgXCJkb3VibGVcIjogJ1wiJyxcbiAgICAgIHNpbmdsZTogXCInXCJcbiAgICB9O1xuICAgIHZhciBxdW90ZVJFcyA9IHtcbiAgICAgIF9fcHJvdG9fXzogbnVsbCxcbiAgICAgIFwiZG91YmxlXCI6IC8oW1wiXFxcXF0pL2csXG4gICAgICBzaW5nbGU6IC8oWydcXFxcXSkvZ1xuICAgIH07XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbnNwZWN0XyhvYmosIG9wdGlvbnMsIGRlcHRoLCBzZWVuKSB7XG4gICAgICB2YXIgb3B0cyA9IG9wdGlvbnMgfHwge307XG4gICAgICBpZiAoaGFzKG9wdHMsIFwicXVvdGVTdHlsZVwiKSAmJiAhaGFzKHF1b3Rlcywgb3B0cy5xdW90ZVN0eWxlKSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdvcHRpb24gXCJxdW90ZVN0eWxlXCIgbXVzdCBiZSBcInNpbmdsZVwiIG9yIFwiZG91YmxlXCInKTtcbiAgICAgIH1cbiAgICAgIGlmIChoYXMob3B0cywgXCJtYXhTdHJpbmdMZW5ndGhcIikgJiYgKHR5cGVvZiBvcHRzLm1heFN0cmluZ0xlbmd0aCA9PT0gXCJudW1iZXJcIiA/IG9wdHMubWF4U3RyaW5nTGVuZ3RoIDwgMCAmJiBvcHRzLm1heFN0cmluZ0xlbmd0aCAhPT0gSW5maW5pdHkgOiBvcHRzLm1heFN0cmluZ0xlbmd0aCAhPT0gbnVsbCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignb3B0aW9uIFwibWF4U3RyaW5nTGVuZ3RoXCIsIGlmIHByb3ZpZGVkLCBtdXN0IGJlIGEgcG9zaXRpdmUgaW50ZWdlciwgSW5maW5pdHksIG9yIGBudWxsYCcpO1xuICAgICAgfVxuICAgICAgdmFyIGN1c3RvbUluc3BlY3QgPSBoYXMob3B0cywgXCJjdXN0b21JbnNwZWN0XCIpID8gb3B0cy5jdXN0b21JbnNwZWN0IDogdHJ1ZTtcbiAgICAgIGlmICh0eXBlb2YgY3VzdG9tSW5zcGVjdCAhPT0gXCJib29sZWFuXCIgJiYgY3VzdG9tSW5zcGVjdCAhPT0gXCJzeW1ib2xcIikge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwib3B0aW9uIFxcXCJjdXN0b21JbnNwZWN0XFxcIiwgaWYgcHJvdmlkZWQsIG11c3QgYmUgYHRydWVgLCBgZmFsc2VgLCBvciBgJ3N5bWJvbCdgXCIpO1xuICAgICAgfVxuICAgICAgaWYgKGhhcyhvcHRzLCBcImluZGVudFwiKSAmJiBvcHRzLmluZGVudCAhPT0gbnVsbCAmJiBvcHRzLmluZGVudCAhPT0gXCJcdFwiICYmICEocGFyc2VJbnQob3B0cy5pbmRlbnQsIDEwKSA9PT0gb3B0cy5pbmRlbnQgJiYgb3B0cy5pbmRlbnQgPiAwKSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdvcHRpb24gXCJpbmRlbnRcIiBtdXN0IGJlIFwiXFxcXHRcIiwgYW4gaW50ZWdlciA+IDAsIG9yIGBudWxsYCcpO1xuICAgICAgfVxuICAgICAgaWYgKGhhcyhvcHRzLCBcIm51bWVyaWNTZXBhcmF0b3JcIikgJiYgdHlwZW9mIG9wdHMubnVtZXJpY1NlcGFyYXRvciAhPT0gXCJib29sZWFuXCIpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignb3B0aW9uIFwibnVtZXJpY1NlcGFyYXRvclwiLCBpZiBwcm92aWRlZCwgbXVzdCBiZSBgdHJ1ZWAgb3IgYGZhbHNlYCcpO1xuICAgICAgfVxuICAgICAgdmFyIG51bWVyaWNTZXBhcmF0b3IgPSBvcHRzLm51bWVyaWNTZXBhcmF0b3I7XG4gICAgICBpZiAodHlwZW9mIG9iaiA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICByZXR1cm4gXCJ1bmRlZmluZWRcIjtcbiAgICAgIH1cbiAgICAgIGlmIChvYmogPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIFwibnVsbFwiO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBvYmogPT09IFwiYm9vbGVhblwiKSB7XG4gICAgICAgIHJldHVybiBvYmogPyBcInRydWVcIiA6IFwiZmFsc2VcIjtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2Ygb2JqID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIHJldHVybiBpbnNwZWN0U3RyaW5nKG9iaiwgb3B0cyk7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIG9iaiA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICBpZiAob2JqID09PSAwKSB7XG4gICAgICAgICAgcmV0dXJuIEluZmluaXR5IC8gb2JqID4gMCA/IFwiMFwiIDogXCItMFwiO1xuICAgICAgICB9XG4gICAgICAgIHZhciBzdHIgPSBTdHJpbmcob2JqKTtcbiAgICAgICAgcmV0dXJuIG51bWVyaWNTZXBhcmF0b3IgPyBhZGROdW1lcmljU2VwYXJhdG9yKG9iaiwgc3RyKSA6IHN0cjtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2Ygb2JqID09PSBcImJpZ2ludFwiKSB7XG4gICAgICAgIHZhciBiaWdJbnRTdHIgPSBTdHJpbmcob2JqKSArIFwiblwiO1xuICAgICAgICByZXR1cm4gbnVtZXJpY1NlcGFyYXRvciA/IGFkZE51bWVyaWNTZXBhcmF0b3Iob2JqLCBiaWdJbnRTdHIpIDogYmlnSW50U3RyO1xuICAgICAgfVxuICAgICAgdmFyIG1heERlcHRoID0gdHlwZW9mIG9wdHMuZGVwdGggPT09IFwidW5kZWZpbmVkXCIgPyA1IDogb3B0cy5kZXB0aDtcbiAgICAgIGlmICh0eXBlb2YgZGVwdGggPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgZGVwdGggPSAwO1xuICAgICAgfVxuICAgICAgaWYgKGRlcHRoID49IG1heERlcHRoICYmIG1heERlcHRoID4gMCAmJiB0eXBlb2Ygb2JqID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIHJldHVybiBpc0FycmF5KG9iaikgPyBcIltBcnJheV1cIiA6IFwiW09iamVjdF1cIjtcbiAgICAgIH1cbiAgICAgIHZhciBpbmRlbnQgPSBnZXRJbmRlbnQob3B0cywgZGVwdGgpO1xuICAgICAgaWYgKHR5cGVvZiBzZWVuID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIHNlZW4gPSBbXTtcbiAgICAgIH0gZWxzZSBpZiAoaW5kZXhPZihzZWVuLCBvYmopID49IDApIHtcbiAgICAgICAgcmV0dXJuIFwiW0NpcmN1bGFyXVwiO1xuICAgICAgfVxuICAgICAgZnVuY3Rpb24gaW5zcGVjdDModmFsdWUsIGZyb20sIG5vSW5kZW50KSB7XG4gICAgICAgIGlmIChmcm9tKSB7XG4gICAgICAgICAgc2VlbiA9ICRhcnJTbGljZS5jYWxsKHNlZW4pO1xuICAgICAgICAgIHNlZW4ucHVzaChmcm9tKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobm9JbmRlbnQpIHtcbiAgICAgICAgICB2YXIgbmV3T3B0cyA9IHtcbiAgICAgICAgICAgIGRlcHRoOiBvcHRzLmRlcHRoXG4gICAgICAgICAgfTtcbiAgICAgICAgICBpZiAoaGFzKG9wdHMsIFwicXVvdGVTdHlsZVwiKSkge1xuICAgICAgICAgICAgbmV3T3B0cy5xdW90ZVN0eWxlID0gb3B0cy5xdW90ZVN0eWxlO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gaW5zcGVjdF8odmFsdWUsIG5ld09wdHMsIGRlcHRoICsgMSwgc2Vlbik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGluc3BlY3RfKHZhbHVlLCBvcHRzLCBkZXB0aCArIDEsIHNlZW4pO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBvYmogPT09IFwiZnVuY3Rpb25cIiAmJiAhaXNSZWdFeHAob2JqKSkge1xuICAgICAgICB2YXIgbmFtZSA9IG5hbWVPZihvYmopO1xuICAgICAgICB2YXIga2V5cyA9IGFyck9iaktleXMob2JqLCBpbnNwZWN0Myk7XG4gICAgICAgIHJldHVybiBcIltGdW5jdGlvblwiICsgKG5hbWUgPyBcIjogXCIgKyBuYW1lIDogXCIgKGFub255bW91cylcIikgKyBcIl1cIiArIChrZXlzLmxlbmd0aCA+IDAgPyBcIiB7IFwiICsgJGpvaW4uY2FsbChrZXlzLCBcIiwgXCIpICsgXCIgfVwiIDogXCJcIik7XG4gICAgICB9XG4gICAgICBpZiAoaXNTeW1ib2wob2JqKSkge1xuICAgICAgICB2YXIgc3ltU3RyaW5nID0gaGFzU2hhbW1lZFN5bWJvbHMgPyAkcmVwbGFjZS5jYWxsKFN0cmluZyhvYmopLCAvXihTeW1ib2xcXCguKlxcKSlfW14pXSokLywgXCIkMVwiKSA6IHN5bVRvU3RyaW5nLmNhbGwob2JqKTtcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBvYmogPT09IFwib2JqZWN0XCIgJiYgIWhhc1NoYW1tZWRTeW1ib2xzID8gbWFya0JveGVkKHN5bVN0cmluZykgOiBzeW1TdHJpbmc7XG4gICAgICB9XG4gICAgICBpZiAoaXNFbGVtZW50KG9iaikpIHtcbiAgICAgICAgdmFyIHMgPSBcIjxcIiArICR0b0xvd2VyQ2FzZS5jYWxsKFN0cmluZyhvYmoubm9kZU5hbWUpKTtcbiAgICAgICAgdmFyIGF0dHJzID0gb2JqLmF0dHJpYnV0ZXMgfHwgW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXR0cnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBzICs9IFwiIFwiICsgYXR0cnNbaV0ubmFtZSArIFwiPVwiICsgd3JhcFF1b3RlcyhxdW90ZShhdHRyc1tpXS52YWx1ZSksIFwiZG91YmxlXCIsIG9wdHMpO1xuICAgICAgICB9XG4gICAgICAgIHMgKz0gXCI+XCI7XG4gICAgICAgIGlmIChvYmouY2hpbGROb2RlcyAmJiBvYmouY2hpbGROb2Rlcy5sZW5ndGgpIHtcbiAgICAgICAgICBzICs9IFwiLi4uXCI7XG4gICAgICAgIH1cbiAgICAgICAgcyArPSBcIjwvXCIgKyAkdG9Mb3dlckNhc2UuY2FsbChTdHJpbmcob2JqLm5vZGVOYW1lKSkgKyBcIj5cIjtcbiAgICAgICAgcmV0dXJuIHM7XG4gICAgICB9XG4gICAgICBpZiAoaXNBcnJheShvYmopKSB7XG4gICAgICAgIGlmIChvYmoubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgcmV0dXJuIFwiW11cIjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgeHMgPSBhcnJPYmpLZXlzKG9iaiwgaW5zcGVjdDMpO1xuICAgICAgICBpZiAoaW5kZW50ICYmICFzaW5nbGVMaW5lVmFsdWVzKHhzKSkge1xuICAgICAgICAgIHJldHVybiBcIltcIiArIGluZGVudGVkSm9pbih4cywgaW5kZW50KSArIFwiXVwiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBcIlsgXCIgKyAkam9pbi5jYWxsKHhzLCBcIiwgXCIpICsgXCIgXVwiO1xuICAgICAgfVxuICAgICAgaWYgKGlzRXJyb3Iob2JqKSkge1xuICAgICAgICB2YXIgcGFydHMgPSBhcnJPYmpLZXlzKG9iaiwgaW5zcGVjdDMpO1xuICAgICAgICBpZiAoIShcImNhdXNlXCIgaW4gRXJyb3IucHJvdG90eXBlKSAmJiBcImNhdXNlXCIgaW4gb2JqICYmICFpc0VudW1lcmFibGUuY2FsbChvYmosIFwiY2F1c2VcIikpIHtcbiAgICAgICAgICByZXR1cm4gXCJ7IFtcIiArIFN0cmluZyhvYmopICsgXCJdIFwiICsgJGpvaW4uY2FsbCgkY29uY2F0LmNhbGwoXCJbY2F1c2VdOiBcIiArIGluc3BlY3QzKG9iai5jYXVzZSksIHBhcnRzKSwgXCIsIFwiKSArIFwiIH1cIjtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGFydHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgcmV0dXJuIFwiW1wiICsgU3RyaW5nKG9iaikgKyBcIl1cIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gXCJ7IFtcIiArIFN0cmluZyhvYmopICsgXCJdIFwiICsgJGpvaW4uY2FsbChwYXJ0cywgXCIsIFwiKSArIFwiIH1cIjtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2Ygb2JqID09PSBcIm9iamVjdFwiICYmIGN1c3RvbUluc3BlY3QpIHtcbiAgICAgICAgaWYgKGluc3BlY3RTeW1ib2wgJiYgdHlwZW9mIG9ialtpbnNwZWN0U3ltYm9sXSA9PT0gXCJmdW5jdGlvblwiICYmIHV0aWxJbnNwZWN0KSB7XG4gICAgICAgICAgcmV0dXJuIHV0aWxJbnNwZWN0KG9iaiwgeyBkZXB0aDogbWF4RGVwdGggLSBkZXB0aCB9KTtcbiAgICAgICAgfSBlbHNlIGlmIChjdXN0b21JbnNwZWN0ICE9PSBcInN5bWJvbFwiICYmIHR5cGVvZiBvYmouaW5zcGVjdCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgcmV0dXJuIG9iai5pbnNwZWN0KCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChpc01hcChvYmopKSB7XG4gICAgICAgIHZhciBtYXBQYXJ0cyA9IFtdO1xuICAgICAgICBpZiAobWFwRm9yRWFjaCkge1xuICAgICAgICAgIG1hcEZvckVhY2guY2FsbChvYmosIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgICAgIG1hcFBhcnRzLnB1c2goaW5zcGVjdDMoa2V5LCBvYmosIHRydWUpICsgXCIgPT4gXCIgKyBpbnNwZWN0Myh2YWx1ZSwgb2JqKSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvbGxlY3Rpb25PZihcIk1hcFwiLCBtYXBTaXplLmNhbGwob2JqKSwgbWFwUGFydHMsIGluZGVudCk7XG4gICAgICB9XG4gICAgICBpZiAoaXNTZXQob2JqKSkge1xuICAgICAgICB2YXIgc2V0UGFydHMgPSBbXTtcbiAgICAgICAgaWYgKHNldEZvckVhY2gpIHtcbiAgICAgICAgICBzZXRGb3JFYWNoLmNhbGwob2JqLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgc2V0UGFydHMucHVzaChpbnNwZWN0Myh2YWx1ZSwgb2JqKSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvbGxlY3Rpb25PZihcIlNldFwiLCBzZXRTaXplLmNhbGwob2JqKSwgc2V0UGFydHMsIGluZGVudCk7XG4gICAgICB9XG4gICAgICBpZiAoaXNXZWFrTWFwKG9iaikpIHtcbiAgICAgICAgcmV0dXJuIHdlYWtDb2xsZWN0aW9uT2YoXCJXZWFrTWFwXCIpO1xuICAgICAgfVxuICAgICAgaWYgKGlzV2Vha1NldChvYmopKSB7XG4gICAgICAgIHJldHVybiB3ZWFrQ29sbGVjdGlvbk9mKFwiV2Vha1NldFwiKTtcbiAgICAgIH1cbiAgICAgIGlmIChpc1dlYWtSZWYob2JqKSkge1xuICAgICAgICByZXR1cm4gd2Vha0NvbGxlY3Rpb25PZihcIldlYWtSZWZcIik7XG4gICAgICB9XG4gICAgICBpZiAoaXNOdW1iZXIob2JqKSkge1xuICAgICAgICByZXR1cm4gbWFya0JveGVkKGluc3BlY3QzKE51bWJlcihvYmopKSk7XG4gICAgICB9XG4gICAgICBpZiAoaXNCaWdJbnQob2JqKSkge1xuICAgICAgICByZXR1cm4gbWFya0JveGVkKGluc3BlY3QzKGJpZ0ludFZhbHVlT2YuY2FsbChvYmopKSk7XG4gICAgICB9XG4gICAgICBpZiAoaXNCb29sZWFuKG9iaikpIHtcbiAgICAgICAgcmV0dXJuIG1hcmtCb3hlZChib29sZWFuVmFsdWVPZi5jYWxsKG9iaikpO1xuICAgICAgfVxuICAgICAgaWYgKGlzU3RyaW5nKG9iaikpIHtcbiAgICAgICAgcmV0dXJuIG1hcmtCb3hlZChpbnNwZWN0MyhTdHJpbmcob2JqKSkpO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgJiYgb2JqID09PSB3aW5kb3cpIHtcbiAgICAgICAgcmV0dXJuIFwieyBbb2JqZWN0IFdpbmRvd10gfVwiO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBnbG9iYWxUaGlzICE9PSBcInVuZGVmaW5lZFwiICYmIG9iaiA9PT0gZ2xvYmFsVGhpcyB8fCB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiICYmIG9iaiA9PT0gZ2xvYmFsKSB7XG4gICAgICAgIHJldHVybiBcInsgW29iamVjdCBnbG9iYWxUaGlzXSB9XCI7XG4gICAgICB9XG4gICAgICBpZiAoIWlzRGF0ZShvYmopICYmICFpc1JlZ0V4cChvYmopKSB7XG4gICAgICAgIHZhciB5cyA9IGFyck9iaktleXMob2JqLCBpbnNwZWN0Myk7XG4gICAgICAgIHZhciBpc1BsYWluT2JqZWN0ID0gZ1BPID8gZ1BPKG9iaikgPT09IE9iamVjdC5wcm90b3R5cGUgOiBvYmogaW5zdGFuY2VvZiBPYmplY3QgfHwgb2JqLmNvbnN0cnVjdG9yID09PSBPYmplY3Q7XG4gICAgICAgIHZhciBwcm90b1RhZyA9IG9iaiBpbnN0YW5jZW9mIE9iamVjdCA/IFwiXCIgOiBcIm51bGwgcHJvdG90eXBlXCI7XG4gICAgICAgIHZhciBzdHJpbmdUYWcgPSAhaXNQbGFpbk9iamVjdCAmJiB0b1N0cmluZ1RhZyAmJiBPYmplY3Qob2JqKSA9PT0gb2JqICYmIHRvU3RyaW5nVGFnIGluIG9iaiA/ICRzbGljZS5jYWxsKHRvU3RyKG9iaiksIDgsIC0xKSA6IHByb3RvVGFnID8gXCJPYmplY3RcIiA6IFwiXCI7XG4gICAgICAgIHZhciBjb25zdHJ1Y3RvclRhZyA9IGlzUGxhaW5PYmplY3QgfHwgdHlwZW9mIG9iai5jb25zdHJ1Y3RvciAhPT0gXCJmdW5jdGlvblwiID8gXCJcIiA6IG9iai5jb25zdHJ1Y3Rvci5uYW1lID8gb2JqLmNvbnN0cnVjdG9yLm5hbWUgKyBcIiBcIiA6IFwiXCI7XG4gICAgICAgIHZhciB0YWcgPSBjb25zdHJ1Y3RvclRhZyArIChzdHJpbmdUYWcgfHwgcHJvdG9UYWcgPyBcIltcIiArICRqb2luLmNhbGwoJGNvbmNhdC5jYWxsKFtdLCBzdHJpbmdUYWcgfHwgW10sIHByb3RvVGFnIHx8IFtdKSwgXCI6IFwiKSArIFwiXSBcIiA6IFwiXCIpO1xuICAgICAgICBpZiAoeXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgcmV0dXJuIHRhZyArIFwie31cIjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW5kZW50KSB7XG4gICAgICAgICAgcmV0dXJuIHRhZyArIFwie1wiICsgaW5kZW50ZWRKb2luKHlzLCBpbmRlbnQpICsgXCJ9XCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRhZyArIFwieyBcIiArICRqb2luLmNhbGwoeXMsIFwiLCBcIikgKyBcIiB9XCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gU3RyaW5nKG9iaik7XG4gICAgfTtcbiAgICBmdW5jdGlvbiB3cmFwUXVvdGVzKHMsIGRlZmF1bHRTdHlsZSwgb3B0cykge1xuICAgICAgdmFyIHN0eWxlID0gb3B0cy5xdW90ZVN0eWxlIHx8IGRlZmF1bHRTdHlsZTtcbiAgICAgIHZhciBxdW90ZUNoYXIgPSBxdW90ZXNbc3R5bGVdO1xuICAgICAgcmV0dXJuIHF1b3RlQ2hhciArIHMgKyBxdW90ZUNoYXI7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHF1b3RlKHMpIHtcbiAgICAgIHJldHVybiAkcmVwbGFjZS5jYWxsKFN0cmluZyhzKSwgL1wiL2csIFwiJnF1b3Q7XCIpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBjYW5UcnVzdFRvU3RyaW5nKG9iaikge1xuICAgICAgcmV0dXJuICF0b1N0cmluZ1RhZyB8fCAhKHR5cGVvZiBvYmogPT09IFwib2JqZWN0XCIgJiYgKHRvU3RyaW5nVGFnIGluIG9iaiB8fCB0eXBlb2Ygb2JqW3RvU3RyaW5nVGFnXSAhPT0gXCJ1bmRlZmluZWRcIikpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBpc0FycmF5KG9iaikge1xuICAgICAgcmV0dXJuIHRvU3RyKG9iaikgPT09IFwiW29iamVjdCBBcnJheV1cIiAmJiBjYW5UcnVzdFRvU3RyaW5nKG9iaik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGlzRGF0ZShvYmopIHtcbiAgICAgIHJldHVybiB0b1N0cihvYmopID09PSBcIltvYmplY3QgRGF0ZV1cIiAmJiBjYW5UcnVzdFRvU3RyaW5nKG9iaik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGlzUmVnRXhwKG9iaikge1xuICAgICAgcmV0dXJuIHRvU3RyKG9iaikgPT09IFwiW29iamVjdCBSZWdFeHBdXCIgJiYgY2FuVHJ1c3RUb1N0cmluZyhvYmopO1xuICAgIH1cbiAgICBmdW5jdGlvbiBpc0Vycm9yKG9iaikge1xuICAgICAgcmV0dXJuIHRvU3RyKG9iaikgPT09IFwiW29iamVjdCBFcnJvcl1cIiAmJiBjYW5UcnVzdFRvU3RyaW5nKG9iaik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGlzU3RyaW5nKG9iaikge1xuICAgICAgcmV0dXJuIHRvU3RyKG9iaikgPT09IFwiW29iamVjdCBTdHJpbmddXCIgJiYgY2FuVHJ1c3RUb1N0cmluZyhvYmopO1xuICAgIH1cbiAgICBmdW5jdGlvbiBpc051bWJlcihvYmopIHtcbiAgICAgIHJldHVybiB0b1N0cihvYmopID09PSBcIltvYmplY3QgTnVtYmVyXVwiICYmIGNhblRydXN0VG9TdHJpbmcob2JqKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gaXNCb29sZWFuKG9iaikge1xuICAgICAgcmV0dXJuIHRvU3RyKG9iaikgPT09IFwiW29iamVjdCBCb29sZWFuXVwiICYmIGNhblRydXN0VG9TdHJpbmcob2JqKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gaXNTeW1ib2wob2JqKSB7XG4gICAgICBpZiAoaGFzU2hhbW1lZFN5bWJvbHMpIHtcbiAgICAgICAgcmV0dXJuIG9iaiAmJiB0eXBlb2Ygb2JqID09PSBcIm9iamVjdFwiICYmIG9iaiBpbnN0YW5jZW9mIFN5bWJvbDtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2Ygb2JqID09PSBcInN5bWJvbFwiKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgaWYgKCFvYmogfHwgdHlwZW9mIG9iaiAhPT0gXCJvYmplY3RcIiB8fCAhc3ltVG9TdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgdHJ5IHtcbiAgICAgICAgc3ltVG9TdHJpbmcuY2FsbChvYmopO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgZnVuY3Rpb24gaXNCaWdJbnQob2JqKSB7XG4gICAgICBpZiAoIW9iaiB8fCB0eXBlb2Ygb2JqICE9PSBcIm9iamVjdFwiIHx8ICFiaWdJbnRWYWx1ZU9mKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHRyeSB7XG4gICAgICAgIGJpZ0ludFZhbHVlT2YuY2FsbChvYmopO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdmFyIGhhc093bjIgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5IHx8IGZ1bmN0aW9uKGtleSkge1xuICAgICAgcmV0dXJuIGtleSBpbiB0aGlzO1xuICAgIH07XG4gICAgZnVuY3Rpb24gaGFzKG9iaiwga2V5KSB7XG4gICAgICByZXR1cm4gaGFzT3duMi5jYWxsKG9iaiwga2V5KTtcbiAgICB9XG4gICAgZnVuY3Rpb24gdG9TdHIob2JqKSB7XG4gICAgICByZXR1cm4gb2JqZWN0VG9TdHJpbmcuY2FsbChvYmopO1xuICAgIH1cbiAgICBmdW5jdGlvbiBuYW1lT2YoZikge1xuICAgICAgaWYgKGYubmFtZSkge1xuICAgICAgICByZXR1cm4gZi5uYW1lO1xuICAgICAgfVxuICAgICAgdmFyIG0gPSAkbWF0Y2guY2FsbChmdW5jdGlvblRvU3RyaW5nLmNhbGwoZiksIC9eZnVuY3Rpb25cXHMqKFtcXHckXSspLyk7XG4gICAgICBpZiAobSkge1xuICAgICAgICByZXR1cm4gbVsxXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBmdW5jdGlvbiBpbmRleE9mKHhzLCB4KSB7XG4gICAgICBpZiAoeHMuaW5kZXhPZikge1xuICAgICAgICByZXR1cm4geHMuaW5kZXhPZih4KTtcbiAgICAgIH1cbiAgICAgIGZvciAodmFyIGkgPSAwLCBsID0geHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGlmICh4c1tpXSA9PT0geCkge1xuICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gLTE7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGlzTWFwKHgpIHtcbiAgICAgIGlmICghbWFwU2l6ZSB8fCAheCB8fCB0eXBlb2YgeCAhPT0gXCJvYmplY3RcIikge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICB0cnkge1xuICAgICAgICBtYXBTaXplLmNhbGwoeCk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgc2V0U2l6ZS5jYWxsKHgpO1xuICAgICAgICB9IGNhdGNoIChzKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHggaW5zdGFuY2VvZiBNYXA7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGlzV2Vha01hcCh4KSB7XG4gICAgICBpZiAoIXdlYWtNYXBIYXMgfHwgIXggfHwgdHlwZW9mIHggIT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgdHJ5IHtcbiAgICAgICAgd2Vha01hcEhhcy5jYWxsKHgsIHdlYWtNYXBIYXMpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHdlYWtTZXRIYXMuY2FsbCh4LCB3ZWFrU2V0SGFzKTtcbiAgICAgICAgfSBjYXRjaCAocykge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB4IGluc3RhbmNlb2YgV2Vha01hcDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgZnVuY3Rpb24gaXNXZWFrUmVmKHgpIHtcbiAgICAgIGlmICghd2Vha1JlZkRlcmVmIHx8ICF4IHx8IHR5cGVvZiB4ICE9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHRyeSB7XG4gICAgICAgIHdlYWtSZWZEZXJlZi5jYWxsKHgpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgZnVuY3Rpb24gaXNTZXQoeCkge1xuICAgICAgaWYgKCFzZXRTaXplIHx8ICF4IHx8IHR5cGVvZiB4ICE9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHRyeSB7XG4gICAgICAgIHNldFNpemUuY2FsbCh4KTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBtYXBTaXplLmNhbGwoeCk7XG4gICAgICAgIH0gY2F0Y2ggKG0pIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geCBpbnN0YW5jZW9mIFNldDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgZnVuY3Rpb24gaXNXZWFrU2V0KHgpIHtcbiAgICAgIGlmICghd2Vha1NldEhhcyB8fCAheCB8fCB0eXBlb2YgeCAhPT0gXCJvYmplY3RcIikge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICB0cnkge1xuICAgICAgICB3ZWFrU2V0SGFzLmNhbGwoeCwgd2Vha1NldEhhcyk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgd2Vha01hcEhhcy5jYWxsKHgsIHdlYWtNYXBIYXMpO1xuICAgICAgICB9IGNhdGNoIChzKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHggaW5zdGFuY2VvZiBXZWFrU2V0O1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBmdW5jdGlvbiBpc0VsZW1lbnQoeCkge1xuICAgICAgaWYgKCF4IHx8IHR5cGVvZiB4ICE9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgSFRNTEVsZW1lbnQgIT09IFwidW5kZWZpbmVkXCIgJiYgeCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHR5cGVvZiB4Lm5vZGVOYW1lID09PSBcInN0cmluZ1wiICYmIHR5cGVvZiB4LmdldEF0dHJpYnV0ZSA9PT0gXCJmdW5jdGlvblwiO1xuICAgIH1cbiAgICBmdW5jdGlvbiBpbnNwZWN0U3RyaW5nKHN0ciwgb3B0cykge1xuICAgICAgaWYgKHN0ci5sZW5ndGggPiBvcHRzLm1heFN0cmluZ0xlbmd0aCkge1xuICAgICAgICB2YXIgcmVtYWluaW5nID0gc3RyLmxlbmd0aCAtIG9wdHMubWF4U3RyaW5nTGVuZ3RoO1xuICAgICAgICB2YXIgdHJhaWxlciA9IFwiLi4uIFwiICsgcmVtYWluaW5nICsgXCIgbW9yZSBjaGFyYWN0ZXJcIiArIChyZW1haW5pbmcgPiAxID8gXCJzXCIgOiBcIlwiKTtcbiAgICAgICAgcmV0dXJuIGluc3BlY3RTdHJpbmcoJHNsaWNlLmNhbGwoc3RyLCAwLCBvcHRzLm1heFN0cmluZ0xlbmd0aCksIG9wdHMpICsgdHJhaWxlcjtcbiAgICAgIH1cbiAgICAgIHZhciBxdW90ZVJFID0gcXVvdGVSRXNbb3B0cy5xdW90ZVN0eWxlIHx8IFwic2luZ2xlXCJdO1xuICAgICAgcXVvdGVSRS5sYXN0SW5kZXggPSAwO1xuICAgICAgdmFyIHMgPSAkcmVwbGFjZS5jYWxsKCRyZXBsYWNlLmNhbGwoc3RyLCBxdW90ZVJFLCBcIlxcXFwkMVwiKSwgL1tcXHgwMC1cXHgxZl0vZywgbG93Ynl0ZSk7XG4gICAgICByZXR1cm4gd3JhcFF1b3RlcyhzLCBcInNpbmdsZVwiLCBvcHRzKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gbG93Ynl0ZShjKSB7XG4gICAgICB2YXIgbiA9IGMuY2hhckNvZGVBdCgwKTtcbiAgICAgIHZhciB4ID0ge1xuICAgICAgICA4OiBcImJcIixcbiAgICAgICAgOTogXCJ0XCIsXG4gICAgICAgIDEwOiBcIm5cIixcbiAgICAgICAgMTI6IFwiZlwiLFxuICAgICAgICAxMzogXCJyXCJcbiAgICAgIH1bbl07XG4gICAgICBpZiAoeCkge1xuICAgICAgICByZXR1cm4gXCJcXFxcXCIgKyB4O1xuICAgICAgfVxuICAgICAgcmV0dXJuIFwiXFxcXHhcIiArIChuIDwgMTYgPyBcIjBcIiA6IFwiXCIpICsgJHRvVXBwZXJDYXNlLmNhbGwobi50b1N0cmluZygxNikpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBtYXJrQm94ZWQoc3RyKSB7XG4gICAgICByZXR1cm4gXCJPYmplY3QoXCIgKyBzdHIgKyBcIilcIjtcbiAgICB9XG4gICAgZnVuY3Rpb24gd2Vha0NvbGxlY3Rpb25PZih0eXBlKSB7XG4gICAgICByZXR1cm4gdHlwZSArIFwiIHsgPyB9XCI7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGNvbGxlY3Rpb25PZih0eXBlLCBzaXplLCBlbnRyaWVzLCBpbmRlbnQpIHtcbiAgICAgIHZhciBqb2luZWRFbnRyaWVzID0gaW5kZW50ID8gaW5kZW50ZWRKb2luKGVudHJpZXMsIGluZGVudCkgOiAkam9pbi5jYWxsKGVudHJpZXMsIFwiLCBcIik7XG4gICAgICByZXR1cm4gdHlwZSArIFwiIChcIiArIHNpemUgKyBcIikge1wiICsgam9pbmVkRW50cmllcyArIFwifVwiO1xuICAgIH1cbiAgICBmdW5jdGlvbiBzaW5nbGVMaW5lVmFsdWVzKHhzKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHhzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChpbmRleE9mKHhzW2ldLCBcIlxcblwiKSA+PSAwKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZ2V0SW5kZW50KG9wdHMsIGRlcHRoKSB7XG4gICAgICB2YXIgYmFzZUluZGVudDtcbiAgICAgIGlmIChvcHRzLmluZGVudCA9PT0gXCJcdFwiKSB7XG4gICAgICAgIGJhc2VJbmRlbnQgPSBcIlx0XCI7XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBvcHRzLmluZGVudCA9PT0gXCJudW1iZXJcIiAmJiBvcHRzLmluZGVudCA+IDApIHtcbiAgICAgICAgYmFzZUluZGVudCA9ICRqb2luLmNhbGwoQXJyYXkob3B0cy5pbmRlbnQgKyAxKSwgXCIgXCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgICByZXR1cm4ge1xuICAgICAgICBiYXNlOiBiYXNlSW5kZW50LFxuICAgICAgICBwcmV2OiAkam9pbi5jYWxsKEFycmF5KGRlcHRoICsgMSksIGJhc2VJbmRlbnQpXG4gICAgICB9O1xuICAgIH1cbiAgICBmdW5jdGlvbiBpbmRlbnRlZEpvaW4oeHMsIGluZGVudCkge1xuICAgICAgaWYgKHhzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgIH1cbiAgICAgIHZhciBsaW5lSm9pbmVyID0gXCJcXG5cIiArIGluZGVudC5wcmV2ICsgaW5kZW50LmJhc2U7XG4gICAgICByZXR1cm4gbGluZUpvaW5lciArICRqb2luLmNhbGwoeHMsIFwiLFwiICsgbGluZUpvaW5lcikgKyBcIlxcblwiICsgaW5kZW50LnByZXY7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGFyck9iaktleXMob2JqLCBpbnNwZWN0Mykge1xuICAgICAgdmFyIGlzQXJyID0gaXNBcnJheShvYmopO1xuICAgICAgdmFyIHhzID0gW107XG4gICAgICBpZiAoaXNBcnIpIHtcbiAgICAgICAgeHMubGVuZ3RoID0gb2JqLmxlbmd0aDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvYmoubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB4c1tpXSA9IGhhcyhvYmosIGkpID8gaW5zcGVjdDMob2JqW2ldLCBvYmopIDogXCJcIjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdmFyIHN5bXMgPSB0eXBlb2YgZ09QUyA9PT0gXCJmdW5jdGlvblwiID8gZ09QUyhvYmopIDogW107XG4gICAgICB2YXIgc3ltTWFwO1xuICAgICAgaWYgKGhhc1NoYW1tZWRTeW1ib2xzKSB7XG4gICAgICAgIHN5bU1hcCA9IHt9O1xuICAgICAgICBmb3IgKHZhciBrID0gMDsgayA8IHN5bXMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICBzeW1NYXBbXCIkXCIgKyBzeW1zW2tdXSA9IHN5bXNba107XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICAgICAgaWYgKCFoYXMob2JqLCBrZXkpKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzQXJyICYmIFN0cmluZyhOdW1iZXIoa2V5KSkgPT09IGtleSAmJiBrZXkgPCBvYmoubGVuZ3RoKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGhhc1NoYW1tZWRTeW1ib2xzICYmIHN5bU1hcFtcIiRcIiArIGtleV0gaW5zdGFuY2VvZiBTeW1ib2wpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfSBlbHNlIGlmICgkdGVzdC5jYWxsKC9bXlxcdyRdLywga2V5KSkge1xuICAgICAgICAgIHhzLnB1c2goaW5zcGVjdDMoa2V5LCBvYmopICsgXCI6IFwiICsgaW5zcGVjdDMob2JqW2tleV0sIG9iaikpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHhzLnB1c2goa2V5ICsgXCI6IFwiICsgaW5zcGVjdDMob2JqW2tleV0sIG9iaikpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGdPUFMgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHN5bXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICBpZiAoaXNFbnVtZXJhYmxlLmNhbGwob2JqLCBzeW1zW2pdKSkge1xuICAgICAgICAgICAgeHMucHVzaChcIltcIiArIGluc3BlY3QzKHN5bXNbal0pICsgXCJdOiBcIiArIGluc3BlY3QzKG9ialtzeW1zW2pdXSwgb2JqKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4geHM7XG4gICAgfVxuICB9XG59KTtcblxuLy8gc3JjL2xpYi90aW1lX2R1cmF0aW9uLnRzXG52YXIgVGltZUR1cmF0aW9uID0gY2xhc3MgX1RpbWVEdXJhdGlvbiB7XG4gIF9fdGltZV9kdXJhdGlvbl9taWNyb3NfXztcbiAgc3RhdGljIE1JQ1JPU19QRVJfTUlMTElTID0gMTAwMG47XG4gIC8qKlxuICAgKiBHZXQgdGhlIGFsZ2VicmFpYyB0eXBlIHJlcHJlc2VudGF0aW9uIG9mIHRoZSB7QGxpbmsgVGltZUR1cmF0aW9ufSB0eXBlLlxuICAgKiBAcmV0dXJucyBUaGUgYWxnZWJyYWljIHR5cGUgcmVwcmVzZW50YXRpb24gb2YgdGhlIHR5cGUuXG4gICAqL1xuICBzdGF0aWMgZ2V0QWxnZWJyYWljVHlwZSgpIHtcbiAgICByZXR1cm4gQWxnZWJyYWljVHlwZS5Qcm9kdWN0KHtcbiAgICAgIGVsZW1lbnRzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lOiBcIl9fdGltZV9kdXJhdGlvbl9taWNyb3NfX1wiLFxuICAgICAgICAgIGFsZ2VicmFpY1R5cGU6IEFsZ2VicmFpY1R5cGUuSTY0XG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9KTtcbiAgfVxuICBzdGF0aWMgaXNUaW1lRHVyYXRpb24oYWxnZWJyYWljVHlwZSkge1xuICAgIGlmIChhbGdlYnJhaWNUeXBlLnRhZyAhPT0gXCJQcm9kdWN0XCIpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY29uc3QgZWxlbWVudHMgPSBhbGdlYnJhaWNUeXBlLnZhbHVlLmVsZW1lbnRzO1xuICAgIGlmIChlbGVtZW50cy5sZW5ndGggIT09IDEpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY29uc3QgbWljcm9zRWxlbWVudCA9IGVsZW1lbnRzWzBdO1xuICAgIHJldHVybiBtaWNyb3NFbGVtZW50Lm5hbWUgPT09IFwiX190aW1lX2R1cmF0aW9uX21pY3Jvc19fXCIgJiYgbWljcm9zRWxlbWVudC5hbGdlYnJhaWNUeXBlLnRhZyA9PT0gXCJJNjRcIjtcbiAgfVxuICBnZXQgbWljcm9zKCkge1xuICAgIHJldHVybiB0aGlzLl9fdGltZV9kdXJhdGlvbl9taWNyb3NfXztcbiAgfVxuICBnZXQgbWlsbGlzKCkge1xuICAgIHJldHVybiBOdW1iZXIodGhpcy5taWNyb3MgLyBfVGltZUR1cmF0aW9uLk1JQ1JPU19QRVJfTUlMTElTKTtcbiAgfVxuICBjb25zdHJ1Y3RvcihtaWNyb3MpIHtcbiAgICB0aGlzLl9fdGltZV9kdXJhdGlvbl9taWNyb3NfXyA9IG1pY3JvcztcbiAgfVxuICBzdGF0aWMgZnJvbU1pbGxpcyhtaWxsaXMpIHtcbiAgICByZXR1cm4gbmV3IF9UaW1lRHVyYXRpb24oQmlnSW50KG1pbGxpcykgKiBfVGltZUR1cmF0aW9uLk1JQ1JPU19QRVJfTUlMTElTKTtcbiAgfVxuICAvKiogVGhpcyBvdXRwdXRzIHRoZSBzYW1lIHN0cmluZyBmb3JtYXQgdGhhdCB3ZSB1c2UgaW4gdGhlIGhvc3QgYW5kIGluIFJ1c3QgbW9kdWxlcyAqL1xuICB0b1N0cmluZygpIHtcbiAgICBjb25zdCBtaWNyb3MgPSB0aGlzLm1pY3JvcztcbiAgICBjb25zdCBzaWduID0gbWljcm9zIDwgMCA/IFwiLVwiIDogXCIrXCI7XG4gICAgY29uc3QgcG9zID0gbWljcm9zIDwgMCA/IC1taWNyb3MgOiBtaWNyb3M7XG4gICAgY29uc3Qgc2VjcyA9IHBvcyAvIDEwMDAwMDBuO1xuICAgIGNvbnN0IG1pY3Jvc19yZW1haW5pbmcgPSBwb3MgJSAxMDAwMDAwbjtcbiAgICByZXR1cm4gYCR7c2lnbn0ke3NlY3N9LiR7U3RyaW5nKG1pY3Jvc19yZW1haW5pbmcpLnBhZFN0YXJ0KDYsIFwiMFwiKX1gO1xuICB9XG59O1xuXG4vLyBzcmMvbGliL3RpbWVzdGFtcC50c1xudmFyIFRpbWVzdGFtcCA9IGNsYXNzIF9UaW1lc3RhbXAge1xuICBfX3RpbWVzdGFtcF9taWNyb3Nfc2luY2VfdW5peF9lcG9jaF9fO1xuICBzdGF0aWMgTUlDUk9TX1BFUl9NSUxMSVMgPSAxMDAwbjtcbiAgZ2V0IG1pY3Jvc1NpbmNlVW5peEVwb2NoKCkge1xuICAgIHJldHVybiB0aGlzLl9fdGltZXN0YW1wX21pY3Jvc19zaW5jZV91bml4X2Vwb2NoX187XG4gIH1cbiAgY29uc3RydWN0b3IobWljcm9zKSB7XG4gICAgdGhpcy5fX3RpbWVzdGFtcF9taWNyb3Nfc2luY2VfdW5peF9lcG9jaF9fID0gbWljcm9zO1xuICB9XG4gIC8qKlxuICAgKiBHZXQgdGhlIGFsZ2VicmFpYyB0eXBlIHJlcHJlc2VudGF0aW9uIG9mIHRoZSB7QGxpbmsgVGltZXN0YW1wfSB0eXBlLlxuICAgKiBAcmV0dXJucyBUaGUgYWxnZWJyYWljIHR5cGUgcmVwcmVzZW50YXRpb24gb2YgdGhlIHR5cGUuXG4gICAqL1xuICBzdGF0aWMgZ2V0QWxnZWJyYWljVHlwZSgpIHtcbiAgICByZXR1cm4gQWxnZWJyYWljVHlwZS5Qcm9kdWN0KHtcbiAgICAgIGVsZW1lbnRzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lOiBcIl9fdGltZXN0YW1wX21pY3Jvc19zaW5jZV91bml4X2Vwb2NoX19cIixcbiAgICAgICAgICBhbGdlYnJhaWNUeXBlOiBBbGdlYnJhaWNUeXBlLkk2NFxuICAgICAgICB9XG4gICAgICBdXG4gICAgfSk7XG4gIH1cbiAgc3RhdGljIGlzVGltZXN0YW1wKGFsZ2VicmFpY1R5cGUpIHtcbiAgICBpZiAoYWxnZWJyYWljVHlwZS50YWcgIT09IFwiUHJvZHVjdFwiKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGNvbnN0IGVsZW1lbnRzID0gYWxnZWJyYWljVHlwZS52YWx1ZS5lbGVtZW50cztcbiAgICBpZiAoZWxlbWVudHMubGVuZ3RoICE9PSAxKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGNvbnN0IG1pY3Jvc0VsZW1lbnQgPSBlbGVtZW50c1swXTtcbiAgICByZXR1cm4gbWljcm9zRWxlbWVudC5uYW1lID09PSBcIl9fdGltZXN0YW1wX21pY3Jvc19zaW5jZV91bml4X2Vwb2NoX19cIiAmJiBtaWNyb3NFbGVtZW50LmFsZ2VicmFpY1R5cGUudGFnID09PSBcIkk2NFwiO1xuICB9XG4gIC8qKlxuICAgKiBUaGUgVW5peCBlcG9jaCwgdGhlIG1pZG5pZ2h0IGF0IHRoZSBiZWdpbm5pbmcgb2YgSmFudWFyeSAxLCAxOTcwLCBVVEMuXG4gICAqL1xuICBzdGF0aWMgVU5JWF9FUE9DSCA9IG5ldyBfVGltZXN0YW1wKDBuKTtcbiAgLyoqXG4gICAqIEdldCBhIGBUaW1lc3RhbXBgIHJlcHJlc2VudGluZyB0aGUgZXhlY3V0aW9uIGVudmlyb25tZW50J3MgYmVsaWVmIG9mIHRoZSBjdXJyZW50IG1vbWVudCBpbiB0aW1lLlxuICAgKi9cbiAgc3RhdGljIG5vdygpIHtcbiAgICByZXR1cm4gX1RpbWVzdGFtcC5mcm9tRGF0ZSgvKiBAX19QVVJFX18gKi8gbmV3IERhdGUoKSk7XG4gIH1cbiAgLyoqIENvbnZlcnQgdG8gbWlsbGlzZWNvbmRzIHNpbmNlIFVuaXggZXBvY2guICovXG4gIHRvTWlsbGlzKCkge1xuICAgIHJldHVybiB0aGlzLm1pY3Jvc1NpbmNlVW5peEVwb2NoIC8gMTAwMG47XG4gIH1cbiAgLyoqXG4gICAqIEdldCBhIGBUaW1lc3RhbXBgIHJlcHJlc2VudGluZyB0aGUgc2FtZSBwb2ludCBpbiB0aW1lIGFzIGBkYXRlYC5cbiAgICovXG4gIHN0YXRpYyBmcm9tRGF0ZShkYXRlKSB7XG4gICAgY29uc3QgbWlsbGlzID0gZGF0ZS5nZXRUaW1lKCk7XG4gICAgY29uc3QgbWljcm9zID0gQmlnSW50KG1pbGxpcykgKiBfVGltZXN0YW1wLk1JQ1JPU19QRVJfTUlMTElTO1xuICAgIHJldHVybiBuZXcgX1RpbWVzdGFtcChtaWNyb3MpO1xuICB9XG4gIC8qKlxuICAgKiBHZXQgYSBgRGF0ZWAgcmVwcmVzZW50aW5nIGFwcHJveGltYXRlbHkgdGhlIHNhbWUgcG9pbnQgaW4gdGltZSBhcyBgdGhpc2AuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIHRydW5jYXRlcyB0byBtaWxsaXNlY29uZCBwcmVjaXNpb24sXG4gICAqIGFuZCB0aHJvd3MgYFJhbmdlRXJyb3JgIGlmIHRoZSBgVGltZXN0YW1wYCBpcyBvdXRzaWRlIHRoZSByYW5nZSByZXByZXNlbnRhYmxlIGFzIGEgYERhdGVgLlxuICAgKi9cbiAgdG9EYXRlKCkge1xuICAgIGNvbnN0IG1pY3JvcyA9IHRoaXMuX190aW1lc3RhbXBfbWljcm9zX3NpbmNlX3VuaXhfZXBvY2hfXztcbiAgICBjb25zdCBtaWxsaXMgPSBtaWNyb3MgLyBfVGltZXN0YW1wLk1JQ1JPU19QRVJfTUlMTElTO1xuICAgIGlmIChtaWxsaXMgPiBCaWdJbnQoTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVIpIHx8IG1pbGxpcyA8IEJpZ0ludChOdW1iZXIuTUlOX1NBRkVfSU5URUdFUikpIHtcbiAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKFxuICAgICAgICBcIlRpbWVzdGFtcCBpcyBvdXRzaWRlIG9mIHRoZSByZXByZXNlbnRhYmxlIHJhbmdlIG9mIEpTJ3MgRGF0ZVwiXG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IERhdGUoTnVtYmVyKG1pbGxpcykpO1xuICB9XG4gIC8qKlxuICAgKiBHZXQgYW4gSVNPIDg2MDEgLyBSRkMgMzMzOSBmb3JtYXR0ZWQgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoaXMgdGltZXN0YW1wIHdpdGggbWljcm9zZWNvbmQgcHJlY2lzaW9uLlxuICAgKlxuICAgKiBUaGlzIG1ldGhvZCBwcmVzZXJ2ZXMgdGhlIGZ1bGwgbWljcm9zZWNvbmQgcHJlY2lzaW9uIG9mIHRoZSB0aW1lc3RhbXAsXG4gICAqIGFuZCB0aHJvd3MgYFJhbmdlRXJyb3JgIGlmIHRoZSBgVGltZXN0YW1wYCBpcyBvdXRzaWRlIHRoZSByYW5nZSByZXByZXNlbnRhYmxlIGluIElTTyBmb3JtYXQuXG4gICAqXG4gICAqIEByZXR1cm5zIElTTyA4NjAxIGZvcm1hdHRlZCBzdHJpbmcgd2l0aCBtaWNyb3NlY29uZCBwcmVjaXNpb24gKGUuZy4sICcyMDI1LTAyLTE3VDEwOjMwOjQ1LjEyMzQ1NlonKVxuICAgKi9cbiAgdG9JU09TdHJpbmcoKSB7XG4gICAgY29uc3QgbWljcm9zID0gdGhpcy5fX3RpbWVzdGFtcF9taWNyb3Nfc2luY2VfdW5peF9lcG9jaF9fO1xuICAgIGNvbnN0IG1pbGxpcyA9IG1pY3JvcyAvIF9UaW1lc3RhbXAuTUlDUk9TX1BFUl9NSUxMSVM7XG4gICAgaWYgKG1pbGxpcyA+IEJpZ0ludChOdW1iZXIuTUFYX1NBRkVfSU5URUdFUikgfHwgbWlsbGlzIDwgQmlnSW50KE51bWJlci5NSU5fU0FGRV9JTlRFR0VSKSkge1xuICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoXG4gICAgICAgIFwiVGltZXN0YW1wIGlzIG91dHNpZGUgb2YgdGhlIHJlcHJlc2VudGFibGUgcmFuZ2UgZm9yIElTTyBzdHJpbmcgZm9ybWF0dGluZ1wiXG4gICAgICApO1xuICAgIH1cbiAgICBjb25zdCBkYXRlID0gbmV3IERhdGUoTnVtYmVyKG1pbGxpcykpO1xuICAgIGNvbnN0IGlzb0Jhc2UgPSBkYXRlLnRvSVNPU3RyaW5nKCk7XG4gICAgY29uc3QgbWljcm9zUmVtYWluZGVyID0gTWF0aC5hYnMoTnVtYmVyKG1pY3JvcyAlIDEwMDAwMDBuKSk7XG4gICAgY29uc3QgZnJhY3Rpb25hbFBhcnQgPSBTdHJpbmcobWljcm9zUmVtYWluZGVyKS5wYWRTdGFydCg2LCBcIjBcIik7XG4gICAgcmV0dXJuIGlzb0Jhc2UucmVwbGFjZSgvXFwuXFxkezN9WiQvLCBgLiR7ZnJhY3Rpb25hbFBhcnR9WmApO1xuICB9XG4gIHNpbmNlKG90aGVyKSB7XG4gICAgcmV0dXJuIG5ldyBUaW1lRHVyYXRpb24oXG4gICAgICB0aGlzLl9fdGltZXN0YW1wX21pY3Jvc19zaW5jZV91bml4X2Vwb2NoX18gLSBvdGhlci5fX3RpbWVzdGFtcF9taWNyb3Nfc2luY2VfdW5peF9lcG9jaF9fXG4gICAgKTtcbiAgfVxufTtcblxuLy8gc3JjL2xpYi91dWlkLnRzXG52YXIgVXVpZCA9IGNsYXNzIF9VdWlkIHtcbiAgX191dWlkX187XG4gIC8qKlxuICAgKiBUaGUgbmlsIFVVSUQgKGFsbCB6ZXJvcykuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIGBgYHRzXG4gICAqIGNvbnN0IHV1aWQgPSBVdWlkLk5JTDtcbiAgICogY29uc29sZS5hc3NlcnQoXG4gICAqICAgdXVpZC50b1N0cmluZygpID09PSBcIjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMFwiXG4gICAqICk7XG4gICAqIGBgYFxuICAgKi9cbiAgc3RhdGljIE5JTCA9IG5ldyBfVXVpZCgwbik7XG4gIHN0YXRpYyBNQVhfVVVJRF9CSUdJTlQgPSAweGZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmbjtcbiAgLyoqXG4gICAqIFRoZSBtYXggVVVJRCAoYWxsIG9uZXMpLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBgYGB0c1xuICAgKiBjb25zdCB1dWlkID0gVXVpZC5NQVg7XG4gICAqIGNvbnNvbGUuYXNzZXJ0KFxuICAgKiAgIHV1aWQudG9TdHJpbmcoKSA9PT0gXCJmZmZmZmZmZi1mZmZmLWZmZmYtZmZmZi1mZmZmZmZmZmZmZmZcIlxuICAgKiApO1xuICAgKiBgYGBcbiAgICovXG4gIHN0YXRpYyBNQVggPSBuZXcgX1V1aWQoX1V1aWQuTUFYX1VVSURfQklHSU5UKTtcbiAgLyoqXG4gICAqIENyZWF0ZSBhIFVVSUQgZnJvbSBhIHJhdyAxMjgtYml0IHZhbHVlLlxuICAgKlxuICAgKiBAcGFyYW0gdSAtIFVuc2lnbmVkIDEyOC1iaXQgaW50ZWdlclxuICAgKiBAdGhyb3dzIHtFcnJvcn0gSWYgdGhlIHZhbHVlIGlzIG91dHNpZGUgdGhlIHZhbGlkIFVVSUQgcmFuZ2VcbiAgICovXG4gIGNvbnN0cnVjdG9yKHUpIHtcbiAgICBpZiAodSA8IDBuIHx8IHUgPiBfVXVpZC5NQVhfVVVJRF9CSUdJTlQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgVVVJRDogbXVzdCBiZSBiZXR3ZWVuIDAgYW5kIGBNQVhfVVVJRF9CSUdJTlRgXCIpO1xuICAgIH1cbiAgICB0aGlzLl9fdXVpZF9fID0gdTtcbiAgfVxuICAvKipcbiAgICogQ3JlYXRlIGEgVVVJRCBgdjRgIGZyb20gZXhwbGljaXQgcmFuZG9tIGJ5dGVzLlxuICAgKlxuICAgKiBUaGlzIG1ldGhvZCBhc3N1bWVzIHRoZSBieXRlcyBhcmUgYWxyZWFkeSBzdWZmaWNpZW50bHkgcmFuZG9tLlxuICAgKiBJdCBvbmx5IHNldHMgdGhlIGFwcHJvcHJpYXRlIGJpdHMgZm9yIHRoZSBVVUlEIHZlcnNpb24gYW5kIHZhcmlhbnQuXG4gICAqXG4gICAqIEBwYXJhbSBieXRlcyAtIEV4YWN0bHkgMTYgcmFuZG9tIGJ5dGVzXG4gICAqIEByZXR1cm5zIEEgVVVJRCBgdjRgXG4gICAqIEB0aHJvd3Mge0Vycm9yfSBJZiBgYnl0ZXMubGVuZ3RoICE9PSAxNmBcbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogYGBgdHNcbiAgICogY29uc3QgcmFuZG9tQnl0ZXMgPSBuZXcgVWludDhBcnJheSgxNik7XG4gICAqIGNvbnN0IHV1aWQgPSBVdWlkLmZyb21SYW5kb21CeXRlc1Y0KHJhbmRvbUJ5dGVzKTtcbiAgICpcbiAgICogY29uc29sZS5hc3NlcnQoXG4gICAqICAgdXVpZC50b1N0cmluZygpID09PSBcIjAwMDAwMDAwLTAwMDAtNDAwMC04MDAwLTAwMDAwMDAwMDAwMFwiXG4gICAqICk7XG4gICAqIGBgYFxuICAgKi9cbiAgc3RhdGljIGZyb21SYW5kb21CeXRlc1Y0KGJ5dGVzKSB7XG4gICAgaWYgKGJ5dGVzLmxlbmd0aCAhPT0gMTYpIHRocm93IG5ldyBFcnJvcihcIlVVSUQgdjQgcmVxdWlyZXMgMTYgYnl0ZXNcIik7XG4gICAgY29uc3QgYXJyID0gbmV3IFVpbnQ4QXJyYXkoYnl0ZXMpO1xuICAgIGFycls2XSA9IGFycls2XSAmIDE1IHwgNjQ7XG4gICAgYXJyWzhdID0gYXJyWzhdICYgNjMgfCAxMjg7XG4gICAgcmV0dXJuIG5ldyBfVXVpZChfVXVpZC5ieXRlc1RvQmlnSW50KGFycikpO1xuICB9XG4gIC8qKlxuICAgKiBHZW5lcmF0ZSBhIFVVSUQgYHY3YCB1c2luZyBhIG1vbm90b25pYyBjb3VudGVyIGZyb20gYDBgIHRvIGAyXjMxIC0gMWAsXG4gICAqIGEgdGltZXN0YW1wLCBhbmQgNCByYW5kb20gYnl0ZXMuXG4gICAqXG4gICAqIFRoZSBjb3VudGVyIHdyYXBzIGFyb3VuZCBvbiBvdmVyZmxvdy5cbiAgICpcbiAgICogVGhlIFVVSUQgYHY3YCBpcyBzdHJ1Y3R1cmVkIGFzIGZvbGxvd3M6XG4gICAqXG4gICAqIGBgYGFzY2lpXG4gICAqIOKUjOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUrOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUkFxuICAgKiB8IEIwICB8IEIxICB8IEIyICB8IEIzICB8IEI0ICB8IEI1ICAgICAgICAgICAgICB8ICAgICAgICAgQjYgICAgICAgIHxcbiAgICog4pSc4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pS84pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSkXG4gICAqIHwgICAgICAgICAgICAgICAgIHVuaXhfdHNfbXMgICAgICAgICAgICAgICAgICAgIHwgICAgICB2ZXJzaW9uIDcgICAgfFxuICAgKiDilJTilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilLTilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilJhcbiAgICog4pSM4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSs4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSs4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSs4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSQXG4gICAqIHwgQjcgICAgICAgICAgIHwgQjggICAgICB8IEI5ICB8IEIxMCB8IEIxMSAgfCBCMTIgfCBCMTMgfCBCMTQgfCBCMTUgfFxuICAgKiDilJzilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilLzilIDilIDilIDilIDilIDilIDilIDilIDilIDilLzilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilLzilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilKRcbiAgICogfCBjb3VudGVyX2hpZ2ggfCB2YXJpYW50IHwgICAgY291bnRlcl9sb3cgICB8ICAgICAgICByYW5kb20gICAgICAgICB8XG4gICAqIOKUlOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUtOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUtOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUtOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUmFxuICAgKiBgYGBcbiAgICpcbiAgICogQHBhcmFtIGNvdW50ZXIgLSBNdXRhYmxlIG1vbm90b25pYyBjb3VudGVyICgzMS1iaXQpXG4gICAqIEBwYXJhbSBub3cgLSBUaW1lc3RhbXAgc2luY2UgdGhlIFVuaXggZXBvY2hcbiAgICogQHBhcmFtIHJhbmRvbUJ5dGVzIC0gRXhhY3RseSA0IHJhbmRvbSBieXRlc1xuICAgKiBAcmV0dXJucyBBIFVVSUQgYHY3YFxuICAgKlxuICAgKiBAdGhyb3dzIHtFcnJvcn0gSWYgdGhlIGBjb3VudGVyYCBpcyBuZWdhdGl2ZVxuICAgKiBAdGhyb3dzIHtFcnJvcn0gSWYgdGhlIGB0aW1lc3RhbXBgIGlzIGJlZm9yZSB0aGUgVW5peCBlcG9jaFxuICAgKiBAdGhyb3dzIHtFcnJvcn0gSWYgYHJhbmRvbUJ5dGVzLmxlbmd0aCAhPT0gNGBcbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogYGBgdHNcbiAgICogY29uc3Qgbm93ID0gVGltZXN0YW1wLmZyb21NaWxsaXMoMV82ODZfMDAwXzAwMF8wMDBuKTtcbiAgICogY29uc3QgY291bnRlciA9IHsgdmFsdWU6IDEgfTtcbiAgICogY29uc3QgcmFuZG9tQnl0ZXMgPSBuZXcgVWludDhBcnJheSg0KTtcbiAgICpcbiAgICogY29uc3QgdXVpZCA9IFV1aWQuZnJvbUNvdW50ZXJWNyhjb3VudGVyLCBub3csIHJhbmRvbUJ5dGVzKTtcbiAgICpcbiAgICogY29uc29sZS5hc3NlcnQoXG4gICAqICAgdXVpZC50b1N0cmluZygpID09PSBcIjAwMDA2NDdlLTUxODAtNzAwMC04MDAwLTAwMDIwMDAwMDAwMFwiXG4gICAqICk7XG4gICAqIGBgYFxuICAgKi9cbiAgc3RhdGljIGZyb21Db3VudGVyVjcoY291bnRlciwgbm93LCByYW5kb21CeXRlcykge1xuICAgIGlmIChyYW5kb21CeXRlcy5sZW5ndGggIT09IDQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcImBmcm9tQ291bnRlclY3YCByZXF1aXJlcyBgcmFuZG9tQnl0ZXMubGVuZ3RoID09IDRgXCIpO1xuICAgIH1cbiAgICBpZiAoY291bnRlci52YWx1ZSA8IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcImBmcm9tQ291bnRlclY3YCB1dWlkIGBjb3VudGVyYCBtdXN0IGJlIG5vbi1uZWdhdGl2ZVwiKTtcbiAgICB9XG4gICAgaWYgKG5vdy5fX3RpbWVzdGFtcF9taWNyb3Nfc2luY2VfdW5peF9lcG9jaF9fIDwgMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiYGZyb21Db3VudGVyVjdgIGB0aW1lc3RhbXBgIGJlZm9yZSB1bml4IGVwb2NoXCIpO1xuICAgIH1cbiAgICBjb25zdCBjb3VudGVyVmFsID0gY291bnRlci52YWx1ZTtcbiAgICBjb3VudGVyLnZhbHVlID0gY291bnRlclZhbCArIDEgJiAyMTQ3NDgzNjQ3O1xuICAgIGNvbnN0IHRzTXMgPSBub3cudG9NaWxsaXMoKSAmIDB4ZmZmZmZmZmZmZmZmbjtcbiAgICBjb25zdCBieXRlcyA9IG5ldyBVaW50OEFycmF5KDE2KTtcbiAgICBieXRlc1swXSA9IE51bWJlcih0c01zID4+IDQwbiAmIDB4ZmZuKTtcbiAgICBieXRlc1sxXSA9IE51bWJlcih0c01zID4+IDMybiAmIDB4ZmZuKTtcbiAgICBieXRlc1syXSA9IE51bWJlcih0c01zID4+IDI0biAmIDB4ZmZuKTtcbiAgICBieXRlc1szXSA9IE51bWJlcih0c01zID4+IDE2biAmIDB4ZmZuKTtcbiAgICBieXRlc1s0XSA9IE51bWJlcih0c01zID4+IDhuICYgMHhmZm4pO1xuICAgIGJ5dGVzWzVdID0gTnVtYmVyKHRzTXMgJiAweGZmbik7XG4gICAgYnl0ZXNbN10gPSBjb3VudGVyVmFsID4+PiAyMyAmIDI1NTtcbiAgICBieXRlc1s5XSA9IGNvdW50ZXJWYWwgPj4+IDE1ICYgMjU1O1xuICAgIGJ5dGVzWzEwXSA9IGNvdW50ZXJWYWwgPj4+IDcgJiAyNTU7XG4gICAgYnl0ZXNbMTFdID0gKGNvdW50ZXJWYWwgJiAxMjcpIDw8IDEgJiAyNTU7XG4gICAgYnl0ZXNbMTJdIHw9IHJhbmRvbUJ5dGVzWzBdICYgMTI3O1xuICAgIGJ5dGVzWzEzXSA9IHJhbmRvbUJ5dGVzWzFdO1xuICAgIGJ5dGVzWzE0XSA9IHJhbmRvbUJ5dGVzWzJdO1xuICAgIGJ5dGVzWzE1XSA9IHJhbmRvbUJ5dGVzWzNdO1xuICAgIGJ5dGVzWzZdID0gYnl0ZXNbNl0gJiAxNSB8IDExMjtcbiAgICBieXRlc1s4XSA9IGJ5dGVzWzhdICYgNjMgfCAxMjg7XG4gICAgcmV0dXJuIG5ldyBfVXVpZChfVXVpZC5ieXRlc1RvQmlnSW50KGJ5dGVzKSk7XG4gIH1cbiAgLyoqXG4gICAqIFBhcnNlIGEgVVVJRCBmcm9tIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0gcyAtIFVVSUQgc3RyaW5nXG4gICAqIEByZXR1cm5zIFBhcnNlZCBVVUlEXG4gICAqIEB0aHJvd3Mge0Vycm9yfSBJZiB0aGUgc3RyaW5nIGlzIG5vdCBhIHZhbGlkIFVVSURcbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogYGBgdHNcbiAgICogY29uc3QgcyA9IFwiMDE4ODhkNmUtNWMwMC03MDAwLTgwMDAtMDAwMDAwMDAwMDAwXCI7XG4gICAqIGNvbnN0IHV1aWQgPSBVdWlkLnBhcnNlKHMpO1xuICAgKlxuICAgKiBjb25zb2xlLmFzc2VydCh1dWlkLnRvU3RyaW5nKCkgPT09IHMpO1xuICAgKiBgYGBcbiAgICovXG4gIHN0YXRpYyBwYXJzZShzKSB7XG4gICAgY29uc3QgaGV4ID0gcy5yZXBsYWNlKC8tL2csIFwiXCIpO1xuICAgIGlmIChoZXgubGVuZ3RoICE9PSAzMikgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBoZXggVVVJRFwiKTtcbiAgICBsZXQgdiA9IDBuO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzI7IGkgKz0gMikge1xuICAgICAgdiA9IHYgPDwgOG4gfCBCaWdJbnQocGFyc2VJbnQoaGV4LnNsaWNlKGksIGkgKyAyKSwgMTYpKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBfVXVpZCh2KTtcbiAgfVxuICAvKiogQ29udmVydCB0byBzdHJpbmcgKGh5cGhlbmF0ZWQgZm9ybSkuICovXG4gIHRvU3RyaW5nKCkge1xuICAgIGNvbnN0IGJ5dGVzID0gX1V1aWQuYmlnSW50VG9CeXRlcyh0aGlzLl9fdXVpZF9fKTtcbiAgICBjb25zdCBoZXggPSBbLi4uYnl0ZXNdLm1hcCgoYikgPT4gYi50b1N0cmluZygxNikucGFkU3RhcnQoMiwgXCIwXCIpKS5qb2luKFwiXCIpO1xuICAgIHJldHVybiBoZXguc2xpY2UoMCwgOCkgKyBcIi1cIiArIGhleC5zbGljZSg4LCAxMikgKyBcIi1cIiArIGhleC5zbGljZSgxMiwgMTYpICsgXCItXCIgKyBoZXguc2xpY2UoMTYsIDIwKSArIFwiLVwiICsgaGV4LnNsaWNlKDIwKTtcbiAgfVxuICAvKiogQ29udmVydCB0byBiaWdpbnQgKHUxMjgpLiAqL1xuICBhc0JpZ0ludCgpIHtcbiAgICByZXR1cm4gdGhpcy5fX3V1aWRfXztcbiAgfVxuICAvKiogUmV0dXJuIGEgYFVpbnQ4QXJyYXlgIG9mIDE2IGJ5dGVzLiAqL1xuICB0b0J5dGVzKCkge1xuICAgIHJldHVybiBfVXVpZC5iaWdJbnRUb0J5dGVzKHRoaXMuX191dWlkX18pO1xuICB9XG4gIHN0YXRpYyBieXRlc1RvQmlnSW50KGJ5dGVzKSB7XG4gICAgbGV0IHJlc3VsdCA9IDBuO1xuICAgIGZvciAoY29uc3QgYiBvZiBieXRlcykgcmVzdWx0ID0gcmVzdWx0IDw8IDhuIHwgQmlnSW50KGIpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgc3RhdGljIGJpZ0ludFRvQnl0ZXModmFsdWUpIHtcbiAgICBjb25zdCBieXRlcyA9IG5ldyBVaW50OEFycmF5KDE2KTtcbiAgICBmb3IgKGxldCBpID0gMTU7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBieXRlc1tpXSA9IE51bWJlcih2YWx1ZSAmIDB4ZmZuKTtcbiAgICAgIHZhbHVlID4+PSA4bjtcbiAgICB9XG4gICAgcmV0dXJuIGJ5dGVzO1xuICB9XG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB2ZXJzaW9uIG9mIHRoaXMgVVVJRC5cbiAgICpcbiAgICogVGhpcyByZXByZXNlbnRzIHRoZSBhbGdvcml0aG0gdXNlZCB0byBnZW5lcmF0ZSB0aGUgdmFsdWUuXG4gICAqXG4gICAqIEByZXR1cm5zIEEgYFV1aWRWZXJzaW9uYFxuICAgKiBAdGhyb3dzIHtFcnJvcn0gSWYgdGhlIHZlcnNpb24gZmllbGQgaXMgbm90IHJlY29nbml6ZWRcbiAgICovXG4gIGdldFZlcnNpb24oKSB7XG4gICAgY29uc3QgdmVyc2lvbiA9IHRoaXMudG9CeXRlcygpWzZdID4+IDQgJiAxNTtcbiAgICBzd2l0Y2ggKHZlcnNpb24pIHtcbiAgICAgIGNhc2UgNDpcbiAgICAgICAgcmV0dXJuIFwiVjRcIjtcbiAgICAgIGNhc2UgNzpcbiAgICAgICAgcmV0dXJuIFwiVjdcIjtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmICh0aGlzID09IF9VdWlkLk5JTCkge1xuICAgICAgICAgIHJldHVybiBcIk5pbFwiO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzID09IF9VdWlkLk1BWCkge1xuICAgICAgICAgIHJldHVybiBcIk1heFwiO1xuICAgICAgICB9XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgVVVJRCB2ZXJzaW9uOiAke3ZlcnNpb259YCk7XG4gICAgfVxuICB9XG4gIC8qKlxuICAgKiBFeHRyYWN0IHRoZSBtb25vdG9uaWMgY291bnRlciBmcm9tIGEgVVVJRHY3LlxuICAgKlxuICAgKiBJbnRlbmRlZCBmb3IgdGVzdGluZyBhbmQgZGlhZ25vc3RpY3MuXG4gICAqIEJlaGF2aW9yIGlzIHVuZGVmaW5lZCBpZiBjYWxsZWQgb24gYSBub24tVjcgVVVJRC5cbiAgICpcbiAgICogQHJldHVybnMgMzEtYml0IGNvdW50ZXIgdmFsdWVcbiAgICovXG4gIGdldENvdW50ZXIoKSB7XG4gICAgY29uc3QgYnl0ZXMgPSB0aGlzLnRvQnl0ZXMoKTtcbiAgICBjb25zdCBoaWdoID0gYnl0ZXNbN107XG4gICAgY29uc3QgbWlkMSA9IGJ5dGVzWzldO1xuICAgIGNvbnN0IG1pZDIgPSBieXRlc1sxMF07XG4gICAgY29uc3QgbG93ID0gYnl0ZXNbMTFdID4+PiAxO1xuICAgIHJldHVybiBoaWdoIDw8IDIzIHwgbWlkMSA8PCAxNSB8IG1pZDIgPDwgNyB8IGxvdyB8IDA7XG4gIH1cbiAgY29tcGFyZVRvKG90aGVyKSB7XG4gICAgaWYgKHRoaXMuX191dWlkX18gPCBvdGhlci5fX3V1aWRfXykgcmV0dXJuIC0xO1xuICAgIGlmICh0aGlzLl9fdXVpZF9fID4gb3RoZXIuX191dWlkX18pIHJldHVybiAxO1xuICAgIHJldHVybiAwO1xuICB9XG4gIHN0YXRpYyBnZXRBbGdlYnJhaWNUeXBlKCkge1xuICAgIHJldHVybiBBbGdlYnJhaWNUeXBlLlByb2R1Y3Qoe1xuICAgICAgZWxlbWVudHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6IFwiX191dWlkX19cIixcbiAgICAgICAgICBhbGdlYnJhaWNUeXBlOiBBbGdlYnJhaWNUeXBlLlUxMjhcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0pO1xuICB9XG59O1xuXG4vLyBzcmMvbGliL2JpbmFyeV9yZWFkZXIudHNcbnZhciBCaW5hcnlSZWFkZXIgPSBjbGFzcyB7XG4gIC8qKlxuICAgKiBUaGUgRGF0YVZpZXcgdXNlZCB0byByZWFkIHZhbHVlcyBmcm9tIHRoZSBiaW5hcnkgZGF0YS5cbiAgICpcbiAgICogTm90ZTogVGhlIERhdGFWaWV3J3MgYGJ5dGVPZmZzZXRgIGlzIHJlbGF0aXZlIHRvIHRoZSBiZWdpbm5pbmcgb2YgdGhlXG4gICAqIHVuZGVybHlpbmcgQXJyYXlCdWZmZXIsIG5vdCB0aGUgc3RhcnQgb2YgdGhlIHByb3ZpZGVkIFVpbnQ4QXJyYXkgaW5wdXQuXG4gICAqIFRoaXMgYEJpbmFyeVJlYWRlcmAncyBgI29mZnNldGAgZmllbGQgaXMgdXNlZCB0byB0cmFjayB0aGUgY3VycmVudCByZWFkIHBvc2l0aW9uXG4gICAqIHJlbGF0aXZlIHRvIHRoZSBzdGFydCBvZiB0aGUgcHJvdmlkZWQgVWludDhBcnJheSBpbnB1dC5cbiAgICovXG4gIHZpZXc7XG4gIC8qKlxuICAgKiBSZXByZXNlbnRzIHRoZSBvZmZzZXQgKGluIGJ5dGVzKSByZWxhdGl2ZSB0byB0aGUgc3RhcnQgb2YgdGhlIERhdGFWaWV3XG4gICAqIGFuZCBwcm92aWRlZCBVaW50OEFycmF5IGlucHV0LlxuICAgKlxuICAgKiBOb3RlOiBUaGlzIGlzICpub3QqIHRoZSBhYnNvbHV0ZSBieXRlIG9mZnNldCB3aXRoaW4gdGhlIHVuZGVybHlpbmcgQXJyYXlCdWZmZXIuXG4gICAqL1xuICBvZmZzZXQgPSAwO1xuICBjb25zdHJ1Y3RvcihpbnB1dCkge1xuICAgIHRoaXMudmlldyA9IGlucHV0IGluc3RhbmNlb2YgRGF0YVZpZXcgPyBpbnB1dCA6IG5ldyBEYXRhVmlldyhpbnB1dC5idWZmZXIsIGlucHV0LmJ5dGVPZmZzZXQsIGlucHV0LmJ5dGVMZW5ndGgpO1xuICAgIHRoaXMub2Zmc2V0ID0gMDtcbiAgfVxuICByZXNldCh2aWV3KSB7XG4gICAgdGhpcy52aWV3ID0gdmlldztcbiAgICB0aGlzLm9mZnNldCA9IDA7XG4gIH1cbiAgZ2V0IHJlbWFpbmluZygpIHtcbiAgICByZXR1cm4gdGhpcy52aWV3LmJ5dGVMZW5ndGggLSB0aGlzLm9mZnNldDtcbiAgfVxuICAvKiogRW5zdXJlIHdlIGhhdmUgYXQgbGVhc3QgYG5gIGJ5dGVzIGxlZnQgdG8gcmVhZCAqL1xuICAjZW5zdXJlKG4pIHtcbiAgICBpZiAodGhpcy5vZmZzZXQgKyBuID4gdGhpcy52aWV3LmJ5dGVMZW5ndGgpIHtcbiAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKFxuICAgICAgICBgVHJpZWQgdG8gcmVhZCAke259IGJ5dGUocykgYXQgcmVsYXRpdmUgb2Zmc2V0ICR7dGhpcy5vZmZzZXR9LCBidXQgb25seSAke3RoaXMucmVtYWluaW5nfSBieXRlKHMpIHJlbWFpbmBcbiAgICAgICk7XG4gICAgfVxuICB9XG4gIHJlYWRVSW50OEFycmF5KCkge1xuICAgIGNvbnN0IGxlbmd0aCA9IHRoaXMucmVhZFUzMigpO1xuICAgIHRoaXMuI2Vuc3VyZShsZW5ndGgpO1xuICAgIHJldHVybiB0aGlzLnJlYWRCeXRlcyhsZW5ndGgpO1xuICB9XG4gIHJlYWRCb29sKCkge1xuICAgIGNvbnN0IHZhbHVlID0gdGhpcy52aWV3LmdldFVpbnQ4KHRoaXMub2Zmc2V0KTtcbiAgICB0aGlzLm9mZnNldCArPSAxO1xuICAgIHJldHVybiB2YWx1ZSAhPT0gMDtcbiAgfVxuICByZWFkQnl0ZSgpIHtcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMudmlldy5nZXRVaW50OCh0aGlzLm9mZnNldCk7XG4gICAgdGhpcy5vZmZzZXQgKz0gMTtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgcmVhZEJ5dGVzKGxlbmd0aCkge1xuICAgIGNvbnN0IGFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoXG4gICAgICB0aGlzLnZpZXcuYnVmZmVyLFxuICAgICAgdGhpcy52aWV3LmJ5dGVPZmZzZXQgKyB0aGlzLm9mZnNldCxcbiAgICAgIGxlbmd0aFxuICAgICk7XG4gICAgdGhpcy5vZmZzZXQgKz0gbGVuZ3RoO1xuICAgIHJldHVybiBhcnJheTtcbiAgfVxuICByZWFkSTgoKSB7XG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLnZpZXcuZ2V0SW50OCh0aGlzLm9mZnNldCk7XG4gICAgdGhpcy5vZmZzZXQgKz0gMTtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgcmVhZFU4KCkge1xuICAgIHJldHVybiB0aGlzLnJlYWRCeXRlKCk7XG4gIH1cbiAgcmVhZEkxNigpIHtcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMudmlldy5nZXRJbnQxNih0aGlzLm9mZnNldCwgdHJ1ZSk7XG4gICAgdGhpcy5vZmZzZXQgKz0gMjtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgcmVhZFUxNigpIHtcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMudmlldy5nZXRVaW50MTYodGhpcy5vZmZzZXQsIHRydWUpO1xuICAgIHRoaXMub2Zmc2V0ICs9IDI7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIHJlYWRJMzIoKSB7XG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLnZpZXcuZ2V0SW50MzIodGhpcy5vZmZzZXQsIHRydWUpO1xuICAgIHRoaXMub2Zmc2V0ICs9IDQ7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIHJlYWRVMzIoKSB7XG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLnZpZXcuZ2V0VWludDMyKHRoaXMub2Zmc2V0LCB0cnVlKTtcbiAgICB0aGlzLm9mZnNldCArPSA0O1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICByZWFkSTY0KCkge1xuICAgIGNvbnN0IHZhbHVlID0gdGhpcy52aWV3LmdldEJpZ0ludDY0KHRoaXMub2Zmc2V0LCB0cnVlKTtcbiAgICB0aGlzLm9mZnNldCArPSA4O1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICByZWFkVTY0KCkge1xuICAgIGNvbnN0IHZhbHVlID0gdGhpcy52aWV3LmdldEJpZ1VpbnQ2NCh0aGlzLm9mZnNldCwgdHJ1ZSk7XG4gICAgdGhpcy5vZmZzZXQgKz0gODtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgcmVhZFUxMjgoKSB7XG4gICAgY29uc3QgbG93ZXJQYXJ0ID0gdGhpcy52aWV3LmdldEJpZ1VpbnQ2NCh0aGlzLm9mZnNldCwgdHJ1ZSk7XG4gICAgY29uc3QgdXBwZXJQYXJ0ID0gdGhpcy52aWV3LmdldEJpZ1VpbnQ2NCh0aGlzLm9mZnNldCArIDgsIHRydWUpO1xuICAgIHRoaXMub2Zmc2V0ICs9IDE2O1xuICAgIHJldHVybiAodXBwZXJQYXJ0IDw8IEJpZ0ludCg2NCkpICsgbG93ZXJQYXJ0O1xuICB9XG4gIHJlYWRJMTI4KCkge1xuICAgIGNvbnN0IGxvd2VyUGFydCA9IHRoaXMudmlldy5nZXRCaWdVaW50NjQodGhpcy5vZmZzZXQsIHRydWUpO1xuICAgIGNvbnN0IHVwcGVyUGFydCA9IHRoaXMudmlldy5nZXRCaWdJbnQ2NCh0aGlzLm9mZnNldCArIDgsIHRydWUpO1xuICAgIHRoaXMub2Zmc2V0ICs9IDE2O1xuICAgIHJldHVybiAodXBwZXJQYXJ0IDw8IEJpZ0ludCg2NCkpICsgbG93ZXJQYXJ0O1xuICB9XG4gIHJlYWRVMjU2KCkge1xuICAgIGNvbnN0IHAwID0gdGhpcy52aWV3LmdldEJpZ1VpbnQ2NCh0aGlzLm9mZnNldCwgdHJ1ZSk7XG4gICAgY29uc3QgcDEgPSB0aGlzLnZpZXcuZ2V0QmlnVWludDY0KHRoaXMub2Zmc2V0ICsgOCwgdHJ1ZSk7XG4gICAgY29uc3QgcDIgPSB0aGlzLnZpZXcuZ2V0QmlnVWludDY0KHRoaXMub2Zmc2V0ICsgMTYsIHRydWUpO1xuICAgIGNvbnN0IHAzID0gdGhpcy52aWV3LmdldEJpZ1VpbnQ2NCh0aGlzLm9mZnNldCArIDI0LCB0cnVlKTtcbiAgICB0aGlzLm9mZnNldCArPSAzMjtcbiAgICByZXR1cm4gKHAzIDw8IEJpZ0ludCgzICogNjQpKSArIChwMiA8PCBCaWdJbnQoMiAqIDY0KSkgKyAocDEgPDwgQmlnSW50KDEgKiA2NCkpICsgcDA7XG4gIH1cbiAgcmVhZEkyNTYoKSB7XG4gICAgY29uc3QgcDAgPSB0aGlzLnZpZXcuZ2V0QmlnVWludDY0KHRoaXMub2Zmc2V0LCB0cnVlKTtcbiAgICBjb25zdCBwMSA9IHRoaXMudmlldy5nZXRCaWdVaW50NjQodGhpcy5vZmZzZXQgKyA4LCB0cnVlKTtcbiAgICBjb25zdCBwMiA9IHRoaXMudmlldy5nZXRCaWdVaW50NjQodGhpcy5vZmZzZXQgKyAxNiwgdHJ1ZSk7XG4gICAgY29uc3QgcDMgPSB0aGlzLnZpZXcuZ2V0QmlnSW50NjQodGhpcy5vZmZzZXQgKyAyNCwgdHJ1ZSk7XG4gICAgdGhpcy5vZmZzZXQgKz0gMzI7XG4gICAgcmV0dXJuIChwMyA8PCBCaWdJbnQoMyAqIDY0KSkgKyAocDIgPDwgQmlnSW50KDIgKiA2NCkpICsgKHAxIDw8IEJpZ0ludCgxICogNjQpKSArIHAwO1xuICB9XG4gIHJlYWRGMzIoKSB7XG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLnZpZXcuZ2V0RmxvYXQzMih0aGlzLm9mZnNldCwgdHJ1ZSk7XG4gICAgdGhpcy5vZmZzZXQgKz0gNDtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgcmVhZEY2NCgpIHtcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMudmlldy5nZXRGbG9hdDY0KHRoaXMub2Zmc2V0LCB0cnVlKTtcbiAgICB0aGlzLm9mZnNldCArPSA4O1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICByZWFkU3RyaW5nKCkge1xuICAgIGNvbnN0IHVpbnQ4QXJyYXkgPSB0aGlzLnJlYWRVSW50OEFycmF5KCk7XG4gICAgcmV0dXJuIG5ldyBUZXh0RGVjb2RlcihcInV0Zi04XCIpLmRlY29kZSh1aW50OEFycmF5KTtcbiAgfVxufTtcblxuLy8gc3JjL2xpYi9iaW5hcnlfd3JpdGVyLnRzXG52YXIgaW1wb3J0X2Jhc2U2NF9qcyA9IF9fdG9FU00ocmVxdWlyZV9iYXNlNjRfanMoKSk7XG52YXIgQXJyYXlCdWZmZXJQcm90b3R5cGVUcmFuc2ZlciA9IEFycmF5QnVmZmVyLnByb3RvdHlwZS50cmFuc2ZlciA/PyBmdW5jdGlvbihuZXdCeXRlTGVuZ3RoKSB7XG4gIGlmIChuZXdCeXRlTGVuZ3RoID09PSB2b2lkIDApIHtcbiAgICByZXR1cm4gdGhpcy5zbGljZSgpO1xuICB9IGVsc2UgaWYgKG5ld0J5dGVMZW5ndGggPD0gdGhpcy5ieXRlTGVuZ3RoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2xpY2UoMCwgbmV3Qnl0ZUxlbmd0aCk7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgY29weSA9IG5ldyBVaW50OEFycmF5KG5ld0J5dGVMZW5ndGgpO1xuICAgIGNvcHkuc2V0KG5ldyBVaW50OEFycmF5KHRoaXMpKTtcbiAgICByZXR1cm4gY29weS5idWZmZXI7XG4gIH1cbn07XG52YXIgUmVzaXphYmxlQnVmZmVyID0gY2xhc3Mge1xuICBidWZmZXI7XG4gIHZpZXc7XG4gIGNvbnN0cnVjdG9yKGluaXQpIHtcbiAgICB0aGlzLmJ1ZmZlciA9IHR5cGVvZiBpbml0ID09PSBcIm51bWJlclwiID8gbmV3IEFycmF5QnVmZmVyKGluaXQpIDogaW5pdDtcbiAgICB0aGlzLnZpZXcgPSBuZXcgRGF0YVZpZXcodGhpcy5idWZmZXIpO1xuICB9XG4gIGdldCBjYXBhY2l0eSgpIHtcbiAgICByZXR1cm4gdGhpcy5idWZmZXIuYnl0ZUxlbmd0aDtcbiAgfVxuICBncm93KG5ld1NpemUpIHtcbiAgICBpZiAobmV3U2l6ZSA8PSB0aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoKSByZXR1cm47XG4gICAgdGhpcy5idWZmZXIgPSBBcnJheUJ1ZmZlclByb3RvdHlwZVRyYW5zZmVyLmNhbGwodGhpcy5idWZmZXIsIG5ld1NpemUpO1xuICAgIHRoaXMudmlldyA9IG5ldyBEYXRhVmlldyh0aGlzLmJ1ZmZlcik7XG4gIH1cbn07XG52YXIgQmluYXJ5V3JpdGVyID0gY2xhc3Mge1xuICBidWZmZXI7XG4gIG9mZnNldCA9IDA7XG4gIGNvbnN0cnVjdG9yKGluaXQpIHtcbiAgICB0aGlzLmJ1ZmZlciA9IHR5cGVvZiBpbml0ID09PSBcIm51bWJlclwiID8gbmV3IFJlc2l6YWJsZUJ1ZmZlcihpbml0KSA6IGluaXQ7XG4gIH1cbiAgcmVzZXQoYnVmZmVyKSB7XG4gICAgdGhpcy5idWZmZXIgPSBidWZmZXI7XG4gICAgdGhpcy5vZmZzZXQgPSAwO1xuICB9XG4gIGV4cGFuZEJ1ZmZlcihhZGRpdGlvbmFsQ2FwYWNpdHkpIHtcbiAgICBjb25zdCBtaW5DYXBhY2l0eSA9IHRoaXMub2Zmc2V0ICsgYWRkaXRpb25hbENhcGFjaXR5ICsgMTtcbiAgICBpZiAobWluQ2FwYWNpdHkgPD0gdGhpcy5idWZmZXIuY2FwYWNpdHkpIHJldHVybjtcbiAgICBsZXQgbmV3Q2FwYWNpdHkgPSB0aGlzLmJ1ZmZlci5jYXBhY2l0eSAqIDI7XG4gICAgaWYgKG5ld0NhcGFjaXR5IDwgbWluQ2FwYWNpdHkpIG5ld0NhcGFjaXR5ID0gbWluQ2FwYWNpdHk7XG4gICAgdGhpcy5idWZmZXIuZ3JvdyhuZXdDYXBhY2l0eSk7XG4gIH1cbiAgdG9CYXNlNjQoKSB7XG4gICAgcmV0dXJuICgwLCBpbXBvcnRfYmFzZTY0X2pzLmZyb21CeXRlQXJyYXkpKHRoaXMuZ2V0QnVmZmVyKCkpO1xuICB9XG4gIGdldEJ1ZmZlcigpIHtcbiAgICByZXR1cm4gbmV3IFVpbnQ4QXJyYXkodGhpcy5idWZmZXIuYnVmZmVyLCAwLCB0aGlzLm9mZnNldCk7XG4gIH1cbiAgZ2V0IHZpZXcoKSB7XG4gICAgcmV0dXJuIHRoaXMuYnVmZmVyLnZpZXc7XG4gIH1cbiAgd3JpdGVVSW50OEFycmF5KHZhbHVlKSB7XG4gICAgY29uc3QgbGVuZ3RoID0gdmFsdWUubGVuZ3RoO1xuICAgIHRoaXMuZXhwYW5kQnVmZmVyKDQgKyBsZW5ndGgpO1xuICAgIHRoaXMud3JpdGVVMzIobGVuZ3RoKTtcbiAgICBuZXcgVWludDhBcnJheSh0aGlzLmJ1ZmZlci5idWZmZXIsIHRoaXMub2Zmc2V0KS5zZXQodmFsdWUpO1xuICAgIHRoaXMub2Zmc2V0ICs9IGxlbmd0aDtcbiAgfVxuICB3cml0ZUJvb2wodmFsdWUpIHtcbiAgICB0aGlzLmV4cGFuZEJ1ZmZlcigxKTtcbiAgICB0aGlzLnZpZXcuc2V0VWludDgodGhpcy5vZmZzZXQsIHZhbHVlID8gMSA6IDApO1xuICAgIHRoaXMub2Zmc2V0ICs9IDE7XG4gIH1cbiAgd3JpdGVCeXRlKHZhbHVlKSB7XG4gICAgdGhpcy5leHBhbmRCdWZmZXIoMSk7XG4gICAgdGhpcy52aWV3LnNldFVpbnQ4KHRoaXMub2Zmc2V0LCB2YWx1ZSk7XG4gICAgdGhpcy5vZmZzZXQgKz0gMTtcbiAgfVxuICB3cml0ZUk4KHZhbHVlKSB7XG4gICAgdGhpcy5leHBhbmRCdWZmZXIoMSk7XG4gICAgdGhpcy52aWV3LnNldEludDgodGhpcy5vZmZzZXQsIHZhbHVlKTtcbiAgICB0aGlzLm9mZnNldCArPSAxO1xuICB9XG4gIHdyaXRlVTgodmFsdWUpIHtcbiAgICB0aGlzLmV4cGFuZEJ1ZmZlcigxKTtcbiAgICB0aGlzLnZpZXcuc2V0VWludDgodGhpcy5vZmZzZXQsIHZhbHVlKTtcbiAgICB0aGlzLm9mZnNldCArPSAxO1xuICB9XG4gIHdyaXRlSTE2KHZhbHVlKSB7XG4gICAgdGhpcy5leHBhbmRCdWZmZXIoMik7XG4gICAgdGhpcy52aWV3LnNldEludDE2KHRoaXMub2Zmc2V0LCB2YWx1ZSwgdHJ1ZSk7XG4gICAgdGhpcy5vZmZzZXQgKz0gMjtcbiAgfVxuICB3cml0ZVUxNih2YWx1ZSkge1xuICAgIHRoaXMuZXhwYW5kQnVmZmVyKDIpO1xuICAgIHRoaXMudmlldy5zZXRVaW50MTYodGhpcy5vZmZzZXQsIHZhbHVlLCB0cnVlKTtcbiAgICB0aGlzLm9mZnNldCArPSAyO1xuICB9XG4gIHdyaXRlSTMyKHZhbHVlKSB7XG4gICAgdGhpcy5leHBhbmRCdWZmZXIoNCk7XG4gICAgdGhpcy52aWV3LnNldEludDMyKHRoaXMub2Zmc2V0LCB2YWx1ZSwgdHJ1ZSk7XG4gICAgdGhpcy5vZmZzZXQgKz0gNDtcbiAgfVxuICB3cml0ZVUzMih2YWx1ZSkge1xuICAgIHRoaXMuZXhwYW5kQnVmZmVyKDQpO1xuICAgIHRoaXMudmlldy5zZXRVaW50MzIodGhpcy5vZmZzZXQsIHZhbHVlLCB0cnVlKTtcbiAgICB0aGlzLm9mZnNldCArPSA0O1xuICB9XG4gIHdyaXRlSTY0KHZhbHVlKSB7XG4gICAgdGhpcy5leHBhbmRCdWZmZXIoOCk7XG4gICAgdGhpcy52aWV3LnNldEJpZ0ludDY0KHRoaXMub2Zmc2V0LCB2YWx1ZSwgdHJ1ZSk7XG4gICAgdGhpcy5vZmZzZXQgKz0gODtcbiAgfVxuICB3cml0ZVU2NCh2YWx1ZSkge1xuICAgIHRoaXMuZXhwYW5kQnVmZmVyKDgpO1xuICAgIHRoaXMudmlldy5zZXRCaWdVaW50NjQodGhpcy5vZmZzZXQsIHZhbHVlLCB0cnVlKTtcbiAgICB0aGlzLm9mZnNldCArPSA4O1xuICB9XG4gIHdyaXRlVTEyOCh2YWx1ZSkge1xuICAgIHRoaXMuZXhwYW5kQnVmZmVyKDE2KTtcbiAgICBjb25zdCBsb3dlclBhcnQgPSB2YWx1ZSAmIEJpZ0ludChcIjB4RkZGRkZGRkZGRkZGRkZGRlwiKTtcbiAgICBjb25zdCB1cHBlclBhcnQgPSB2YWx1ZSA+PiBCaWdJbnQoNjQpO1xuICAgIHRoaXMudmlldy5zZXRCaWdVaW50NjQodGhpcy5vZmZzZXQsIGxvd2VyUGFydCwgdHJ1ZSk7XG4gICAgdGhpcy52aWV3LnNldEJpZ1VpbnQ2NCh0aGlzLm9mZnNldCArIDgsIHVwcGVyUGFydCwgdHJ1ZSk7XG4gICAgdGhpcy5vZmZzZXQgKz0gMTY7XG4gIH1cbiAgd3JpdGVJMTI4KHZhbHVlKSB7XG4gICAgdGhpcy5leHBhbmRCdWZmZXIoMTYpO1xuICAgIGNvbnN0IGxvd2VyUGFydCA9IHZhbHVlICYgQmlnSW50KFwiMHhGRkZGRkZGRkZGRkZGRkZGXCIpO1xuICAgIGNvbnN0IHVwcGVyUGFydCA9IHZhbHVlID4+IEJpZ0ludCg2NCk7XG4gICAgdGhpcy52aWV3LnNldEJpZ0ludDY0KHRoaXMub2Zmc2V0LCBsb3dlclBhcnQsIHRydWUpO1xuICAgIHRoaXMudmlldy5zZXRCaWdJbnQ2NCh0aGlzLm9mZnNldCArIDgsIHVwcGVyUGFydCwgdHJ1ZSk7XG4gICAgdGhpcy5vZmZzZXQgKz0gMTY7XG4gIH1cbiAgd3JpdGVVMjU2KHZhbHVlKSB7XG4gICAgdGhpcy5leHBhbmRCdWZmZXIoMzIpO1xuICAgIGNvbnN0IGxvd182NF9tYXNrID0gQmlnSW50KFwiMHhGRkZGRkZGRkZGRkZGRkZGXCIpO1xuICAgIGNvbnN0IHAwID0gdmFsdWUgJiBsb3dfNjRfbWFzaztcbiAgICBjb25zdCBwMSA9IHZhbHVlID4+IEJpZ0ludCg2NCAqIDEpICYgbG93XzY0X21hc2s7XG4gICAgY29uc3QgcDIgPSB2YWx1ZSA+PiBCaWdJbnQoNjQgKiAyKSAmIGxvd182NF9tYXNrO1xuICAgIGNvbnN0IHAzID0gdmFsdWUgPj4gQmlnSW50KDY0ICogMyk7XG4gICAgdGhpcy52aWV3LnNldEJpZ1VpbnQ2NCh0aGlzLm9mZnNldCArIDggKiAwLCBwMCwgdHJ1ZSk7XG4gICAgdGhpcy52aWV3LnNldEJpZ1VpbnQ2NCh0aGlzLm9mZnNldCArIDggKiAxLCBwMSwgdHJ1ZSk7XG4gICAgdGhpcy52aWV3LnNldEJpZ1VpbnQ2NCh0aGlzLm9mZnNldCArIDggKiAyLCBwMiwgdHJ1ZSk7XG4gICAgdGhpcy52aWV3LnNldEJpZ1VpbnQ2NCh0aGlzLm9mZnNldCArIDggKiAzLCBwMywgdHJ1ZSk7XG4gICAgdGhpcy5vZmZzZXQgKz0gMzI7XG4gIH1cbiAgd3JpdGVJMjU2KHZhbHVlKSB7XG4gICAgdGhpcy5leHBhbmRCdWZmZXIoMzIpO1xuICAgIGNvbnN0IGxvd182NF9tYXNrID0gQmlnSW50KFwiMHhGRkZGRkZGRkZGRkZGRkZGXCIpO1xuICAgIGNvbnN0IHAwID0gdmFsdWUgJiBsb3dfNjRfbWFzaztcbiAgICBjb25zdCBwMSA9IHZhbHVlID4+IEJpZ0ludCg2NCAqIDEpICYgbG93XzY0X21hc2s7XG4gICAgY29uc3QgcDIgPSB2YWx1ZSA+PiBCaWdJbnQoNjQgKiAyKSAmIGxvd182NF9tYXNrO1xuICAgIGNvbnN0IHAzID0gdmFsdWUgPj4gQmlnSW50KDY0ICogMyk7XG4gICAgdGhpcy52aWV3LnNldEJpZ1VpbnQ2NCh0aGlzLm9mZnNldCArIDggKiAwLCBwMCwgdHJ1ZSk7XG4gICAgdGhpcy52aWV3LnNldEJpZ1VpbnQ2NCh0aGlzLm9mZnNldCArIDggKiAxLCBwMSwgdHJ1ZSk7XG4gICAgdGhpcy52aWV3LnNldEJpZ1VpbnQ2NCh0aGlzLm9mZnNldCArIDggKiAyLCBwMiwgdHJ1ZSk7XG4gICAgdGhpcy52aWV3LnNldEJpZ0ludDY0KHRoaXMub2Zmc2V0ICsgOCAqIDMsIHAzLCB0cnVlKTtcbiAgICB0aGlzLm9mZnNldCArPSAzMjtcbiAgfVxuICB3cml0ZUYzMih2YWx1ZSkge1xuICAgIHRoaXMuZXhwYW5kQnVmZmVyKDQpO1xuICAgIHRoaXMudmlldy5zZXRGbG9hdDMyKHRoaXMub2Zmc2V0LCB2YWx1ZSwgdHJ1ZSk7XG4gICAgdGhpcy5vZmZzZXQgKz0gNDtcbiAgfVxuICB3cml0ZUY2NCh2YWx1ZSkge1xuICAgIHRoaXMuZXhwYW5kQnVmZmVyKDgpO1xuICAgIHRoaXMudmlldy5zZXRGbG9hdDY0KHRoaXMub2Zmc2V0LCB2YWx1ZSwgdHJ1ZSk7XG4gICAgdGhpcy5vZmZzZXQgKz0gODtcbiAgfVxuICB3cml0ZVN0cmluZyh2YWx1ZSkge1xuICAgIGNvbnN0IGVuY29kZXIgPSBuZXcgVGV4dEVuY29kZXIoKTtcbiAgICBjb25zdCBlbmNvZGVkU3RyaW5nID0gZW5jb2Rlci5lbmNvZGUodmFsdWUpO1xuICAgIHRoaXMud3JpdGVVSW50OEFycmF5KGVuY29kZWRTdHJpbmcpO1xuICB9XG59O1xuXG4vLyBzcmMvbGliL3V0aWwudHNcbmZ1bmN0aW9uIHRvUGFzY2FsQ2FzZShzKSB7XG4gIGNvbnN0IHN0ciA9IHMucmVwbGFjZSgvKFstX11bYS16XSkvZ2ksICgkMSkgPT4ge1xuICAgIHJldHVybiAkMS50b1VwcGVyQ2FzZSgpLnJlcGxhY2UoXCItXCIsIFwiXCIpLnJlcGxhY2UoXCJfXCIsIFwiXCIpO1xuICB9KTtcbiAgcmV0dXJuIHN0ci5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0ci5zbGljZSgxKTtcbn1cbmZ1bmN0aW9uIHVpbnQ4QXJyYXlUb0hleFN0cmluZyhhcnJheSkge1xuICByZXR1cm4gQXJyYXkucHJvdG90eXBlLm1hcC5jYWxsKGFycmF5LnJldmVyc2UoKSwgKHgpID0+IChcIjAwXCIgKyB4LnRvU3RyaW5nKDE2KSkuc2xpY2UoLTIpKS5qb2luKFwiXCIpO1xufVxuZnVuY3Rpb24gdWludDhBcnJheVRvVTEyOChhcnJheSkge1xuICBpZiAoYXJyYXkubGVuZ3RoICE9IDE2KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBVaW50OEFycmF5IGlzIG5vdCAxNiBieXRlcyBsb25nOiAke2FycmF5fWApO1xuICB9XG4gIHJldHVybiBuZXcgQmluYXJ5UmVhZGVyKGFycmF5KS5yZWFkVTEyOCgpO1xufVxuZnVuY3Rpb24gdWludDhBcnJheVRvVTI1NihhcnJheSkge1xuICBpZiAoYXJyYXkubGVuZ3RoICE9IDMyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBVaW50OEFycmF5IGlzIG5vdCAzMiBieXRlcyBsb25nOiBbJHthcnJheX1dYCk7XG4gIH1cbiAgcmV0dXJuIG5ldyBCaW5hcnlSZWFkZXIoYXJyYXkpLnJlYWRVMjU2KCk7XG59XG5mdW5jdGlvbiBoZXhTdHJpbmdUb1VpbnQ4QXJyYXkoc3RyKSB7XG4gIGlmIChzdHIuc3RhcnRzV2l0aChcIjB4XCIpKSB7XG4gICAgc3RyID0gc3RyLnNsaWNlKDIpO1xuICB9XG4gIGNvbnN0IG1hdGNoZXMgPSBzdHIubWF0Y2goLy57MSwyfS9nKSB8fCBbXTtcbiAgY29uc3QgZGF0YSA9IFVpbnQ4QXJyYXkuZnJvbShcbiAgICBtYXRjaGVzLm1hcCgoYnl0ZSkgPT4gcGFyc2VJbnQoYnl0ZSwgMTYpKVxuICApO1xuICByZXR1cm4gZGF0YS5yZXZlcnNlKCk7XG59XG5mdW5jdGlvbiBoZXhTdHJpbmdUb1UxMjgoc3RyKSB7XG4gIHJldHVybiB1aW50OEFycmF5VG9VMTI4KGhleFN0cmluZ1RvVWludDhBcnJheShzdHIpKTtcbn1cbmZ1bmN0aW9uIGhleFN0cmluZ1RvVTI1NihzdHIpIHtcbiAgcmV0dXJuIHVpbnQ4QXJyYXlUb1UyNTYoaGV4U3RyaW5nVG9VaW50OEFycmF5KHN0cikpO1xufVxuZnVuY3Rpb24gdTEyOFRvVWludDhBcnJheShkYXRhKSB7XG4gIGNvbnN0IHdyaXRlciA9IG5ldyBCaW5hcnlXcml0ZXIoMTYpO1xuICB3cml0ZXIud3JpdGVVMTI4KGRhdGEpO1xuICByZXR1cm4gd3JpdGVyLmdldEJ1ZmZlcigpO1xufVxuZnVuY3Rpb24gdTEyOFRvSGV4U3RyaW5nKGRhdGEpIHtcbiAgcmV0dXJuIHVpbnQ4QXJyYXlUb0hleFN0cmluZyh1MTI4VG9VaW50OEFycmF5KGRhdGEpKTtcbn1cbmZ1bmN0aW9uIHUyNTZUb1VpbnQ4QXJyYXkoZGF0YSkge1xuICBjb25zdCB3cml0ZXIgPSBuZXcgQmluYXJ5V3JpdGVyKDMyKTtcbiAgd3JpdGVyLndyaXRlVTI1NihkYXRhKTtcbiAgcmV0dXJuIHdyaXRlci5nZXRCdWZmZXIoKTtcbn1cbmZ1bmN0aW9uIHUyNTZUb0hleFN0cmluZyhkYXRhKSB7XG4gIHJldHVybiB1aW50OEFycmF5VG9IZXhTdHJpbmcodTI1NlRvVWludDhBcnJheShkYXRhKSk7XG59XG5mdW5jdGlvbiB0b0NhbWVsQ2FzZShzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9bLV9dKy9nLCBcIl9cIikucmVwbGFjZSgvXyhbYS16QS1aMC05XSkvZywgKF8sIGMpID0+IGMudG9VcHBlckNhc2UoKSk7XG59XG5mdW5jdGlvbiBic2F0bkJhc2VTaXplKHR5cGVzcGFjZSwgdHkpIHtcbiAgY29uc3QgYXNzdW1lZEFycmF5TGVuZ3RoID0gNDtcbiAgd2hpbGUgKHR5LnRhZyA9PT0gXCJSZWZcIikgdHkgPSB0eXBlc3BhY2UudHlwZXNbdHkudmFsdWVdO1xuICBpZiAodHkudGFnID09PSBcIlByb2R1Y3RcIikge1xuICAgIGxldCBzdW0gPSAwO1xuICAgIGZvciAoY29uc3QgeyBhbGdlYnJhaWNUeXBlOiBlbGVtIH0gb2YgdHkudmFsdWUuZWxlbWVudHMpIHtcbiAgICAgIHN1bSArPSBic2F0bkJhc2VTaXplKHR5cGVzcGFjZSwgZWxlbSk7XG4gICAgfVxuICAgIHJldHVybiBzdW07XG4gIH0gZWxzZSBpZiAodHkudGFnID09PSBcIlN1bVwiKSB7XG4gICAgbGV0IG1pbiA9IEluZmluaXR5O1xuICAgIGZvciAoY29uc3QgeyBhbGdlYnJhaWNUeXBlOiB2YXJpIH0gb2YgdHkudmFsdWUudmFyaWFudHMpIHtcbiAgICAgIGNvbnN0IHZTaXplID0gYnNhdG5CYXNlU2l6ZSh0eXBlc3BhY2UsIHZhcmkpO1xuICAgICAgaWYgKHZTaXplIDwgbWluKSBtaW4gPSB2U2l6ZTtcbiAgICB9XG4gICAgaWYgKG1pbiA9PT0gSW5maW5pdHkpIG1pbiA9IDA7XG4gICAgcmV0dXJuIDQgKyBtaW47XG4gIH0gZWxzZSBpZiAodHkudGFnID09IFwiQXJyYXlcIikge1xuICAgIHJldHVybiA0ICsgYXNzdW1lZEFycmF5TGVuZ3RoICogYnNhdG5CYXNlU2l6ZSh0eXBlc3BhY2UsIHR5LnZhbHVlKTtcbiAgfVxuICByZXR1cm4ge1xuICAgIFN0cmluZzogNCArIGFzc3VtZWRBcnJheUxlbmd0aCxcbiAgICBTdW06IDEsXG4gICAgQm9vbDogMSxcbiAgICBJODogMSxcbiAgICBVODogMSxcbiAgICBJMTY6IDIsXG4gICAgVTE2OiAyLFxuICAgIEkzMjogNCxcbiAgICBVMzI6IDQsXG4gICAgRjMyOiA0LFxuICAgIEk2NDogOCxcbiAgICBVNjQ6IDgsXG4gICAgRjY0OiA4LFxuICAgIEkxMjg6IDE2LFxuICAgIFUxMjg6IDE2LFxuICAgIEkyNTY6IDMyLFxuICAgIFUyNTY6IDMyXG4gIH1bdHkudGFnXTtcbn1cbnZhciBoYXNPd24gPSBPYmplY3QuaGFzT3duO1xuXG4vLyBzcmMvbGliL2Nvbm5lY3Rpb25faWQudHNcbnZhciBDb25uZWN0aW9uSWQgPSBjbGFzcyBfQ29ubmVjdGlvbklkIHtcbiAgX19jb25uZWN0aW9uX2lkX187XG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IGBDb25uZWN0aW9uSWRgLlxuICAgKi9cbiAgY29uc3RydWN0b3IoZGF0YSkge1xuICAgIHRoaXMuX19jb25uZWN0aW9uX2lkX18gPSBkYXRhO1xuICB9XG4gIC8qKlxuICAgKiBHZXQgdGhlIGFsZ2VicmFpYyB0eXBlIHJlcHJlc2VudGF0aW9uIG9mIHRoZSB7QGxpbmsgQ29ubmVjdGlvbklkfSB0eXBlLlxuICAgKiBAcmV0dXJucyBUaGUgYWxnZWJyYWljIHR5cGUgcmVwcmVzZW50YXRpb24gb2YgdGhlIHR5cGUuXG4gICAqL1xuICBzdGF0aWMgZ2V0QWxnZWJyYWljVHlwZSgpIHtcbiAgICByZXR1cm4gQWxnZWJyYWljVHlwZS5Qcm9kdWN0KHtcbiAgICAgIGVsZW1lbnRzOiBbXG4gICAgICAgIHsgbmFtZTogXCJfX2Nvbm5lY3Rpb25faWRfX1wiLCBhbGdlYnJhaWNUeXBlOiBBbGdlYnJhaWNUeXBlLlUxMjggfVxuICAgICAgXVxuICAgIH0pO1xuICB9XG4gIGlzWmVybygpIHtcbiAgICByZXR1cm4gdGhpcy5fX2Nvbm5lY3Rpb25faWRfXyA9PT0gQmlnSW50KDApO1xuICB9XG4gIHN0YXRpYyBudWxsSWZaZXJvKGFkZHIpIHtcbiAgICBpZiAoYWRkci5pc1plcm8oKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBhZGRyO1xuICAgIH1cbiAgfVxuICBzdGF0aWMgcmFuZG9tKCkge1xuICAgIGZ1bmN0aW9uIHJhbmRvbVU4KCkge1xuICAgICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDI1NSk7XG4gICAgfVxuICAgIGxldCByZXN1bHQgPSBCaWdJbnQoMCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxNjsgaSsrKSB7XG4gICAgICByZXN1bHQgPSByZXN1bHQgPDwgQmlnSW50KDgpIHwgQmlnSW50KHJhbmRvbVU4KCkpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IF9Db25uZWN0aW9uSWQocmVzdWx0KTtcbiAgfVxuICAvKipcbiAgICogQ29tcGFyZSB0d28gY29ubmVjdGlvbiBJRHMgZm9yIGVxdWFsaXR5LlxuICAgKi9cbiAgaXNFcXVhbChvdGhlcikge1xuICAgIHJldHVybiB0aGlzLl9fY29ubmVjdGlvbl9pZF9fID09IG90aGVyLl9fY29ubmVjdGlvbl9pZF9fO1xuICB9XG4gIC8qKlxuICAgKiBDaGVjayBpZiB0d28gY29ubmVjdGlvbiBJRHMgYXJlIGVxdWFsLlxuICAgKi9cbiAgZXF1YWxzKG90aGVyKSB7XG4gICAgcmV0dXJuIHRoaXMuaXNFcXVhbChvdGhlcik7XG4gIH1cbiAgLyoqXG4gICAqIFByaW50IHRoZSBjb25uZWN0aW9uIElEIGFzIGEgaGV4YWRlY2ltYWwgc3RyaW5nLlxuICAgKi9cbiAgdG9IZXhTdHJpbmcoKSB7XG4gICAgcmV0dXJuIHUxMjhUb0hleFN0cmluZyh0aGlzLl9fY29ubmVjdGlvbl9pZF9fKTtcbiAgfVxuICAvKipcbiAgICogQ29udmVydCB0aGUgY29ubmVjdGlvbiBJRCB0byBhIFVpbnQ4QXJyYXkuXG4gICAqL1xuICB0b1VpbnQ4QXJyYXkoKSB7XG4gICAgcmV0dXJuIHUxMjhUb1VpbnQ4QXJyYXkodGhpcy5fX2Nvbm5lY3Rpb25faWRfXyk7XG4gIH1cbiAgLyoqXG4gICAqIFBhcnNlIGEgY29ubmVjdGlvbiBJRCBmcm9tIGEgaGV4YWRlY2ltYWwgc3RyaW5nLlxuICAgKi9cbiAgc3RhdGljIGZyb21TdHJpbmcoc3RyKSB7XG4gICAgcmV0dXJuIG5ldyBfQ29ubmVjdGlvbklkKGhleFN0cmluZ1RvVTEyOChzdHIpKTtcbiAgfVxuICBzdGF0aWMgZnJvbVN0cmluZ09yTnVsbChzdHIpIHtcbiAgICBjb25zdCBhZGRyID0gX0Nvbm5lY3Rpb25JZC5mcm9tU3RyaW5nKHN0cik7XG4gICAgaWYgKGFkZHIuaXNaZXJvKCkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gYWRkcjtcbiAgICB9XG4gIH1cbn07XG5cbi8vIHNyYy9saWIvaWRlbnRpdHkudHNcbnZhciBJZGVudGl0eSA9IGNsYXNzIF9JZGVudGl0eSB7XG4gIF9faWRlbnRpdHlfXztcbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgYElkZW50aXR5YC5cbiAgICpcbiAgICogYGRhdGFgIGNhbiBiZSBhIGhleGFkZWNpbWFsIHN0cmluZyBvciBhIGBiaWdpbnRgLlxuICAgKi9cbiAgY29uc3RydWN0b3IoZGF0YSkge1xuICAgIHRoaXMuX19pZGVudGl0eV9fID0gdHlwZW9mIGRhdGEgPT09IFwic3RyaW5nXCIgPyBoZXhTdHJpbmdUb1UyNTYoZGF0YSkgOiBkYXRhO1xuICB9XG4gIC8qKlxuICAgKiBHZXQgdGhlIGFsZ2VicmFpYyB0eXBlIHJlcHJlc2VudGF0aW9uIG9mIHRoZSB7QGxpbmsgSWRlbnRpdHl9IHR5cGUuXG4gICAqIEByZXR1cm5zIFRoZSBhbGdlYnJhaWMgdHlwZSByZXByZXNlbnRhdGlvbiBvZiB0aGUgdHlwZS5cbiAgICovXG4gIHN0YXRpYyBnZXRBbGdlYnJhaWNUeXBlKCkge1xuICAgIHJldHVybiBBbGdlYnJhaWNUeXBlLlByb2R1Y3Qoe1xuICAgICAgZWxlbWVudHM6IFt7IG5hbWU6IFwiX19pZGVudGl0eV9fXCIsIGFsZ2VicmFpY1R5cGU6IEFsZ2VicmFpY1R5cGUuVTI1NiB9XVxuICAgIH0pO1xuICB9XG4gIC8qKlxuICAgKiBDaGVjayBpZiB0d28gaWRlbnRpdGllcyBhcmUgZXF1YWwuXG4gICAqL1xuICBpc0VxdWFsKG90aGVyKSB7XG4gICAgcmV0dXJuIHRoaXMudG9IZXhTdHJpbmcoKSA9PT0gb3RoZXIudG9IZXhTdHJpbmcoKTtcbiAgfVxuICAvKipcbiAgICogQ2hlY2sgaWYgdHdvIGlkZW50aXRpZXMgYXJlIGVxdWFsLlxuICAgKi9cbiAgZXF1YWxzKG90aGVyKSB7XG4gICAgcmV0dXJuIHRoaXMuaXNFcXVhbChvdGhlcik7XG4gIH1cbiAgLyoqXG4gICAqIFByaW50IHRoZSBpZGVudGl0eSBhcyBhIGhleGFkZWNpbWFsIHN0cmluZy5cbiAgICovXG4gIHRvSGV4U3RyaW5nKCkge1xuICAgIHJldHVybiB1MjU2VG9IZXhTdHJpbmcodGhpcy5fX2lkZW50aXR5X18pO1xuICB9XG4gIC8qKlxuICAgKiBDb252ZXJ0IHRoZSBhZGRyZXNzIHRvIGEgVWludDhBcnJheS5cbiAgICovXG4gIHRvVWludDhBcnJheSgpIHtcbiAgICByZXR1cm4gdTI1NlRvVWludDhBcnJheSh0aGlzLl9faWRlbnRpdHlfXyk7XG4gIH1cbiAgLyoqXG4gICAqIFBhcnNlIGFuIElkZW50aXR5IGZyb20gYSBoZXhhZGVjaW1hbCBzdHJpbmcuXG4gICAqL1xuICBzdGF0aWMgZnJvbVN0cmluZyhzdHIpIHtcbiAgICByZXR1cm4gbmV3IF9JZGVudGl0eShzdHIpO1xuICB9XG4gIC8qKlxuICAgKiBaZXJvIGlkZW50aXR5ICgweDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDApXG4gICAqL1xuICBzdGF0aWMgemVybygpIHtcbiAgICByZXR1cm4gbmV3IF9JZGVudGl0eSgwbik7XG4gIH1cbiAgdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMudG9IZXhTdHJpbmcoKTtcbiAgfVxufTtcblxuLy8gc3JjL2xpYi9hbGdlYnJhaWNfdHlwZS50c1xudmFyIFNFUklBTElaRVJTID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcbnZhciBERVNFUklBTElaRVJTID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcbnZhciBBbGdlYnJhaWNUeXBlID0ge1xuICBSZWY6ICh2YWx1ZSkgPT4gKHsgdGFnOiBcIlJlZlwiLCB2YWx1ZSB9KSxcbiAgU3VtOiAodmFsdWUpID0+ICh7XG4gICAgdGFnOiBcIlN1bVwiLFxuICAgIHZhbHVlXG4gIH0pLFxuICBQcm9kdWN0OiAodmFsdWUpID0+ICh7XG4gICAgdGFnOiBcIlByb2R1Y3RcIixcbiAgICB2YWx1ZVxuICB9KSxcbiAgQXJyYXk6ICh2YWx1ZSkgPT4gKHtcbiAgICB0YWc6IFwiQXJyYXlcIixcbiAgICB2YWx1ZVxuICB9KSxcbiAgU3RyaW5nOiB7IHRhZzogXCJTdHJpbmdcIiB9LFxuICBCb29sOiB7IHRhZzogXCJCb29sXCIgfSxcbiAgSTg6IHsgdGFnOiBcIkk4XCIgfSxcbiAgVTg6IHsgdGFnOiBcIlU4XCIgfSxcbiAgSTE2OiB7IHRhZzogXCJJMTZcIiB9LFxuICBVMTY6IHsgdGFnOiBcIlUxNlwiIH0sXG4gIEkzMjogeyB0YWc6IFwiSTMyXCIgfSxcbiAgVTMyOiB7IHRhZzogXCJVMzJcIiB9LFxuICBJNjQ6IHsgdGFnOiBcIkk2NFwiIH0sXG4gIFU2NDogeyB0YWc6IFwiVTY0XCIgfSxcbiAgSTEyODogeyB0YWc6IFwiSTEyOFwiIH0sXG4gIFUxMjg6IHsgdGFnOiBcIlUxMjhcIiB9LFxuICBJMjU2OiB7IHRhZzogXCJJMjU2XCIgfSxcbiAgVTI1NjogeyB0YWc6IFwiVTI1NlwiIH0sXG4gIEYzMjogeyB0YWc6IFwiRjMyXCIgfSxcbiAgRjY0OiB7IHRhZzogXCJGNjRcIiB9LFxuICBtYWtlU2VyaWFsaXplcih0eSwgdHlwZXNwYWNlKSB7XG4gICAgaWYgKHR5LnRhZyA9PT0gXCJSZWZcIikge1xuICAgICAgaWYgKCF0eXBlc3BhY2UpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcImNhbm5vdCBzZXJpYWxpemUgcmVmcyB3aXRob3V0IGEgdHlwZXNwYWNlXCIpO1xuICAgICAgd2hpbGUgKHR5LnRhZyA9PT0gXCJSZWZcIikgdHkgPSB0eXBlc3BhY2UudHlwZXNbdHkudmFsdWVdO1xuICAgIH1cbiAgICBzd2l0Y2ggKHR5LnRhZykge1xuICAgICAgY2FzZSBcIlByb2R1Y3RcIjpcbiAgICAgICAgcmV0dXJuIFByb2R1Y3RUeXBlLm1ha2VTZXJpYWxpemVyKHR5LnZhbHVlLCB0eXBlc3BhY2UpO1xuICAgICAgY2FzZSBcIlN1bVwiOlxuICAgICAgICByZXR1cm4gU3VtVHlwZS5tYWtlU2VyaWFsaXplcih0eS52YWx1ZSwgdHlwZXNwYWNlKTtcbiAgICAgIGNhc2UgXCJBcnJheVwiOlxuICAgICAgICBpZiAodHkudmFsdWUudGFnID09PSBcIlU4XCIpIHtcbiAgICAgICAgICByZXR1cm4gc2VyaWFsaXplVWludDhBcnJheTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCBzZXJpYWxpemUgPSBBbGdlYnJhaWNUeXBlLm1ha2VTZXJpYWxpemVyKHR5LnZhbHVlLCB0eXBlc3BhY2UpO1xuICAgICAgICAgIHJldHVybiAod3JpdGVyLCB2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgd3JpdGVyLndyaXRlVTMyKHZhbHVlLmxlbmd0aCk7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGVsZW0gb2YgdmFsdWUpIHtcbiAgICAgICAgICAgICAgc2VyaWFsaXplKHdyaXRlciwgZWxlbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHByaW1pdGl2ZVNlcmlhbGl6ZXJzW3R5LnRhZ107XG4gICAgfVxuICB9LFxuICAvKiogQGRlcHJlY2F0ZWQgVXNlIGBtYWtlU2VyaWFsaXplcmAgaW5zdGVhZC4gKi9cbiAgc2VyaWFsaXplVmFsdWUod3JpdGVyLCB0eSwgdmFsdWUsIHR5cGVzcGFjZSkge1xuICAgIEFsZ2VicmFpY1R5cGUubWFrZVNlcmlhbGl6ZXIodHksIHR5cGVzcGFjZSkod3JpdGVyLCB2YWx1ZSk7XG4gIH0sXG4gIG1ha2VEZXNlcmlhbGl6ZXIodHksIHR5cGVzcGFjZSkge1xuICAgIGlmICh0eS50YWcgPT09IFwiUmVmXCIpIHtcbiAgICAgIGlmICghdHlwZXNwYWNlKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJjYW5ub3QgZGVzZXJpYWxpemUgcmVmcyB3aXRob3V0IGEgdHlwZXNwYWNlXCIpO1xuICAgICAgd2hpbGUgKHR5LnRhZyA9PT0gXCJSZWZcIikgdHkgPSB0eXBlc3BhY2UudHlwZXNbdHkudmFsdWVdO1xuICAgIH1cbiAgICBzd2l0Y2ggKHR5LnRhZykge1xuICAgICAgY2FzZSBcIlByb2R1Y3RcIjpcbiAgICAgICAgcmV0dXJuIFByb2R1Y3RUeXBlLm1ha2VEZXNlcmlhbGl6ZXIodHkudmFsdWUsIHR5cGVzcGFjZSk7XG4gICAgICBjYXNlIFwiU3VtXCI6XG4gICAgICAgIHJldHVybiBTdW1UeXBlLm1ha2VEZXNlcmlhbGl6ZXIodHkudmFsdWUsIHR5cGVzcGFjZSk7XG4gICAgICBjYXNlIFwiQXJyYXlcIjpcbiAgICAgICAgaWYgKHR5LnZhbHVlLnRhZyA9PT0gXCJVOFwiKSB7XG4gICAgICAgICAgcmV0dXJuIGRlc2VyaWFsaXplVWludDhBcnJheTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCBkZXNlcmlhbGl6ZSA9IEFsZ2VicmFpY1R5cGUubWFrZURlc2VyaWFsaXplcihcbiAgICAgICAgICAgIHR5LnZhbHVlLFxuICAgICAgICAgICAgdHlwZXNwYWNlXG4gICAgICAgICAgKTtcbiAgICAgICAgICByZXR1cm4gKHJlYWRlcikgPT4ge1xuICAgICAgICAgICAgY29uc3QgbGVuZ3RoID0gcmVhZGVyLnJlYWRVMzIoKTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IEFycmF5KGxlbmd0aCk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgIHJlc3VsdFtpXSA9IGRlc2VyaWFsaXplKHJlYWRlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBwcmltaXRpdmVEZXNlcmlhbGl6ZXJzW3R5LnRhZ107XG4gICAgfVxuICB9LFxuICAvKiogQGRlcHJlY2F0ZWQgVXNlIGBtYWtlRGVzZXJpYWxpemVyYCBpbnN0ZWFkLiAqL1xuICBkZXNlcmlhbGl6ZVZhbHVlKHJlYWRlciwgdHksIHR5cGVzcGFjZSkge1xuICAgIHJldHVybiBBbGdlYnJhaWNUeXBlLm1ha2VEZXNlcmlhbGl6ZXIodHksIHR5cGVzcGFjZSkocmVhZGVyKTtcbiAgfSxcbiAgLyoqXG4gICAqIENvbnZlcnQgYSB2YWx1ZSBvZiB0aGUgYWxnZWJyYWljIHR5cGUgaW50byBzb21ldGhpbmcgdGhhdCBjYW4gYmUgdXNlZCBhcyBhIGtleSBpbiBhIG1hcC5cbiAgICogVGhlcmUgYXJlIG5vIGd1YXJhbnRlZXMgYWJvdXQgYmVpbmcgYWJsZSB0byBvcmRlciBpdC5cbiAgICogVGhpcyBpcyBvbmx5IGd1YXJhbnRlZWQgdG8gYmUgY29tcGFyYWJsZSB0byBvdGhlciB2YWx1ZXMgb2YgdGhlIHNhbWUgdHlwZS5cbiAgICogQHBhcmFtIHZhbHVlIEEgdmFsdWUgb2YgdGhlIGFsZ2VicmFpYyB0eXBlXG4gICAqIEByZXR1cm5zIFNvbWV0aGluZyB0aGF0IGNhbiBiZSB1c2VkIGFzIGEga2V5IGluIGEgbWFwLlxuICAgKi9cbiAgaW50b01hcEtleTogZnVuY3Rpb24odHksIHZhbHVlKSB7XG4gICAgc3dpdGNoICh0eS50YWcpIHtcbiAgICAgIGNhc2UgXCJVOFwiOlxuICAgICAgY2FzZSBcIlUxNlwiOlxuICAgICAgY2FzZSBcIlUzMlwiOlxuICAgICAgY2FzZSBcIlU2NFwiOlxuICAgICAgY2FzZSBcIlUxMjhcIjpcbiAgICAgIGNhc2UgXCJVMjU2XCI6XG4gICAgICBjYXNlIFwiSThcIjpcbiAgICAgIGNhc2UgXCJJMTZcIjpcbiAgICAgIGNhc2UgXCJJMzJcIjpcbiAgICAgIGNhc2UgXCJJNjRcIjpcbiAgICAgIGNhc2UgXCJJMTI4XCI6XG4gICAgICBjYXNlIFwiSTI1NlwiOlxuICAgICAgY2FzZSBcIkYzMlwiOlxuICAgICAgY2FzZSBcIkY2NFwiOlxuICAgICAgY2FzZSBcIlN0cmluZ1wiOlxuICAgICAgY2FzZSBcIkJvb2xcIjpcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgY2FzZSBcIlByb2R1Y3RcIjpcbiAgICAgICAgcmV0dXJuIFByb2R1Y3RUeXBlLmludG9NYXBLZXkodHkudmFsdWUsIHZhbHVlKTtcbiAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgY29uc3Qgd3JpdGVyID0gbmV3IEJpbmFyeVdyaXRlcigxMCk7XG4gICAgICAgIEFsZ2VicmFpY1R5cGUuc2VyaWFsaXplVmFsdWUod3JpdGVyLCB0eSwgdmFsdWUpO1xuICAgICAgICByZXR1cm4gd3JpdGVyLnRvQmFzZTY0KCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuZnVuY3Rpb24gYmluZENhbGwoZikge1xuICByZXR1cm4gRnVuY3Rpb24ucHJvdG90eXBlLmNhbGwuYmluZChmKTtcbn1cbnZhciBwcmltaXRpdmVTZXJpYWxpemVycyA9IHtcbiAgQm9vbDogYmluZENhbGwoQmluYXJ5V3JpdGVyLnByb3RvdHlwZS53cml0ZUJvb2wpLFxuICBJODogYmluZENhbGwoQmluYXJ5V3JpdGVyLnByb3RvdHlwZS53cml0ZUk4KSxcbiAgVTg6IGJpbmRDYWxsKEJpbmFyeVdyaXRlci5wcm90b3R5cGUud3JpdGVVOCksXG4gIEkxNjogYmluZENhbGwoQmluYXJ5V3JpdGVyLnByb3RvdHlwZS53cml0ZUkxNiksXG4gIFUxNjogYmluZENhbGwoQmluYXJ5V3JpdGVyLnByb3RvdHlwZS53cml0ZVUxNiksXG4gIEkzMjogYmluZENhbGwoQmluYXJ5V3JpdGVyLnByb3RvdHlwZS53cml0ZUkzMiksXG4gIFUzMjogYmluZENhbGwoQmluYXJ5V3JpdGVyLnByb3RvdHlwZS53cml0ZVUzMiksXG4gIEk2NDogYmluZENhbGwoQmluYXJ5V3JpdGVyLnByb3RvdHlwZS53cml0ZUk2NCksXG4gIFU2NDogYmluZENhbGwoQmluYXJ5V3JpdGVyLnByb3RvdHlwZS53cml0ZVU2NCksXG4gIEkxMjg6IGJpbmRDYWxsKEJpbmFyeVdyaXRlci5wcm90b3R5cGUud3JpdGVJMTI4KSxcbiAgVTEyODogYmluZENhbGwoQmluYXJ5V3JpdGVyLnByb3RvdHlwZS53cml0ZVUxMjgpLFxuICBJMjU2OiBiaW5kQ2FsbChCaW5hcnlXcml0ZXIucHJvdG90eXBlLndyaXRlSTI1NiksXG4gIFUyNTY6IGJpbmRDYWxsKEJpbmFyeVdyaXRlci5wcm90b3R5cGUud3JpdGVVMjU2KSxcbiAgRjMyOiBiaW5kQ2FsbChCaW5hcnlXcml0ZXIucHJvdG90eXBlLndyaXRlRjMyKSxcbiAgRjY0OiBiaW5kQ2FsbChCaW5hcnlXcml0ZXIucHJvdG90eXBlLndyaXRlRjY0KSxcbiAgU3RyaW5nOiBiaW5kQ2FsbChCaW5hcnlXcml0ZXIucHJvdG90eXBlLndyaXRlU3RyaW5nKVxufTtcbk9iamVjdC5mcmVlemUocHJpbWl0aXZlU2VyaWFsaXplcnMpO1xudmFyIHNlcmlhbGl6ZVVpbnQ4QXJyYXkgPSBiaW5kQ2FsbChCaW5hcnlXcml0ZXIucHJvdG90eXBlLndyaXRlVUludDhBcnJheSk7XG52YXIgcHJpbWl0aXZlRGVzZXJpYWxpemVycyA9IHtcbiAgQm9vbDogYmluZENhbGwoQmluYXJ5UmVhZGVyLnByb3RvdHlwZS5yZWFkQm9vbCksXG4gIEk4OiBiaW5kQ2FsbChCaW5hcnlSZWFkZXIucHJvdG90eXBlLnJlYWRJOCksXG4gIFU4OiBiaW5kQ2FsbChCaW5hcnlSZWFkZXIucHJvdG90eXBlLnJlYWRVOCksXG4gIEkxNjogYmluZENhbGwoQmluYXJ5UmVhZGVyLnByb3RvdHlwZS5yZWFkSTE2KSxcbiAgVTE2OiBiaW5kQ2FsbChCaW5hcnlSZWFkZXIucHJvdG90eXBlLnJlYWRVMTYpLFxuICBJMzI6IGJpbmRDYWxsKEJpbmFyeVJlYWRlci5wcm90b3R5cGUucmVhZEkzMiksXG4gIFUzMjogYmluZENhbGwoQmluYXJ5UmVhZGVyLnByb3RvdHlwZS5yZWFkVTMyKSxcbiAgSTY0OiBiaW5kQ2FsbChCaW5hcnlSZWFkZXIucHJvdG90eXBlLnJlYWRJNjQpLFxuICBVNjQ6IGJpbmRDYWxsKEJpbmFyeVJlYWRlci5wcm90b3R5cGUucmVhZFU2NCksXG4gIEkxMjg6IGJpbmRDYWxsKEJpbmFyeVJlYWRlci5wcm90b3R5cGUucmVhZEkxMjgpLFxuICBVMTI4OiBiaW5kQ2FsbChCaW5hcnlSZWFkZXIucHJvdG90eXBlLnJlYWRVMTI4KSxcbiAgSTI1NjogYmluZENhbGwoQmluYXJ5UmVhZGVyLnByb3RvdHlwZS5yZWFkSTI1NiksXG4gIFUyNTY6IGJpbmRDYWxsKEJpbmFyeVJlYWRlci5wcm90b3R5cGUucmVhZFUyNTYpLFxuICBGMzI6IGJpbmRDYWxsKEJpbmFyeVJlYWRlci5wcm90b3R5cGUucmVhZEYzMiksXG4gIEY2NDogYmluZENhbGwoQmluYXJ5UmVhZGVyLnByb3RvdHlwZS5yZWFkRjY0KSxcbiAgU3RyaW5nOiBiaW5kQ2FsbChCaW5hcnlSZWFkZXIucHJvdG90eXBlLnJlYWRTdHJpbmcpXG59O1xuT2JqZWN0LmZyZWV6ZShwcmltaXRpdmVEZXNlcmlhbGl6ZXJzKTtcbnZhciBkZXNlcmlhbGl6ZVVpbnQ4QXJyYXkgPSBiaW5kQ2FsbChCaW5hcnlSZWFkZXIucHJvdG90eXBlLnJlYWRVSW50OEFycmF5KTtcbnZhciBwcmltaXRpdmVTaXplcyA9IHtcbiAgQm9vbDogMSxcbiAgSTg6IDEsXG4gIFU4OiAxLFxuICBJMTY6IDIsXG4gIFUxNjogMixcbiAgSTMyOiA0LFxuICBVMzI6IDQsXG4gIEk2NDogOCxcbiAgVTY0OiA4LFxuICBJMTI4OiAxNixcbiAgVTEyODogMTYsXG4gIEkyNTY6IDMyLFxuICBVMjU2OiAzMixcbiAgRjMyOiA0LFxuICBGNjQ6IDhcbn07XG52YXIgZml4ZWRTaXplUHJpbWl0aXZlcyA9IG5ldyBTZXQoT2JqZWN0LmtleXMocHJpbWl0aXZlU2l6ZXMpKTtcbnZhciBpc0ZpeGVkU2l6ZVByb2R1Y3QgPSAodHkpID0+IHR5LmVsZW1lbnRzLmV2ZXJ5KFxuICAoeyBhbGdlYnJhaWNUeXBlIH0pID0+IGZpeGVkU2l6ZVByaW1pdGl2ZXMuaGFzKGFsZ2VicmFpY1R5cGUudGFnKVxuKTtcbnZhciBwcm9kdWN0U2l6ZSA9ICh0eSkgPT4gdHkuZWxlbWVudHMucmVkdWNlKFxuICAoYWNjLCB7IGFsZ2VicmFpY1R5cGUgfSkgPT4gYWNjICsgcHJpbWl0aXZlU2l6ZXNbYWxnZWJyYWljVHlwZS50YWddLFxuICAwXG4pO1xudmFyIHByaW1pdGl2ZUpTTmFtZSA9IHtcbiAgQm9vbDogXCJVaW50OFwiLFxuICBJODogXCJJbnQ4XCIsXG4gIFU4OiBcIlVpbnQ4XCIsXG4gIEkxNjogXCJJbnQxNlwiLFxuICBVMTY6IFwiVWludDE2XCIsXG4gIEkzMjogXCJJbnQzMlwiLFxuICBVMzI6IFwiVWludDMyXCIsXG4gIEk2NDogXCJCaWdJbnQ2NFwiLFxuICBVNjQ6IFwiQmlnVWludDY0XCIsXG4gIEYzMjogXCJGbG9hdDMyXCIsXG4gIEY2NDogXCJGbG9hdDY0XCJcbn07XG52YXIgc3BlY2lhbFByb2R1Y3REZXNlcmlhbGl6ZXJzID0ge1xuICBfX3RpbWVfZHVyYXRpb25fbWljcm9zX186IChyZWFkZXIpID0+IG5ldyBUaW1lRHVyYXRpb24ocmVhZGVyLnJlYWRJNjQoKSksXG4gIF9fdGltZXN0YW1wX21pY3Jvc19zaW5jZV91bml4X2Vwb2NoX186IChyZWFkZXIpID0+IG5ldyBUaW1lc3RhbXAocmVhZGVyLnJlYWRJNjQoKSksXG4gIF9faWRlbnRpdHlfXzogKHJlYWRlcikgPT4gbmV3IElkZW50aXR5KHJlYWRlci5yZWFkVTI1NigpKSxcbiAgX19jb25uZWN0aW9uX2lkX186IChyZWFkZXIpID0+IG5ldyBDb25uZWN0aW9uSWQocmVhZGVyLnJlYWRVMTI4KCkpLFxuICBfX3V1aWRfXzogKHJlYWRlcikgPT4gbmV3IFV1aWQocmVhZGVyLnJlYWRVMTI4KCkpXG59O1xuT2JqZWN0LmZyZWV6ZShzcGVjaWFsUHJvZHVjdERlc2VyaWFsaXplcnMpO1xudmFyIHVuaXREZXNlcmlhbGl6ZXIgPSAoKSA9PiAoe30pO1xudmFyIGdldEVsZW1lbnRJbml0aWFsaXplciA9IChlbGVtZW50KSA9PiB7XG4gIGxldCBpbml0O1xuICBzd2l0Y2ggKGVsZW1lbnQuYWxnZWJyYWljVHlwZS50YWcpIHtcbiAgICBjYXNlIFwiU3RyaW5nXCI6XG4gICAgICBpbml0ID0gXCInJ1wiO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIkJvb2xcIjpcbiAgICAgIGluaXQgPSBcImZhbHNlXCI7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiSThcIjpcbiAgICBjYXNlIFwiVThcIjpcbiAgICBjYXNlIFwiSTE2XCI6XG4gICAgY2FzZSBcIlUxNlwiOlxuICAgIGNhc2UgXCJJMzJcIjpcbiAgICBjYXNlIFwiVTMyXCI6XG4gICAgICBpbml0ID0gXCIwXCI7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiSTY0XCI6XG4gICAgY2FzZSBcIlU2NFwiOlxuICAgIGNhc2UgXCJJMTI4XCI6XG4gICAgY2FzZSBcIlUxMjhcIjpcbiAgICBjYXNlIFwiSTI1NlwiOlxuICAgIGNhc2UgXCJVMjU2XCI6XG4gICAgICBpbml0ID0gXCIwblwiO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIkYzMlwiOlxuICAgIGNhc2UgXCJGNjRcIjpcbiAgICAgIGluaXQgPSBcIjAuMFwiO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIGluaXQgPSBcInVuZGVmaW5lZFwiO1xuICB9XG4gIHJldHVybiBgJHtlbGVtZW50Lm5hbWV9OiAke2luaXR9YDtcbn07XG52YXIgUHJvZHVjdFR5cGUgPSB7XG4gIG1ha2VTZXJpYWxpemVyKHR5LCB0eXBlc3BhY2UpIHtcbiAgICBsZXQgc2VyaWFsaXplciA9IFNFUklBTElaRVJTLmdldCh0eSk7XG4gICAgaWYgKHNlcmlhbGl6ZXIgIT0gbnVsbCkgcmV0dXJuIHNlcmlhbGl6ZXI7XG4gICAgaWYgKGlzRml4ZWRTaXplUHJvZHVjdCh0eSkpIHtcbiAgICAgIGNvbnN0IHNpemUgPSBwcm9kdWN0U2l6ZSh0eSk7XG4gICAgICBjb25zdCBib2R5MiA9IGBcInVzZSBzdHJpY3RcIjtcbndyaXRlci5leHBhbmRCdWZmZXIoJHtzaXplfSk7XG5jb25zdCB2aWV3ID0gd3JpdGVyLnZpZXc7XG4ke3R5LmVsZW1lbnRzLm1hcChcbiAgICAgICAgKHsgbmFtZSwgYWxnZWJyYWljVHlwZTogeyB0YWcgfSB9KSA9PiB0YWcgaW4gcHJpbWl0aXZlSlNOYW1lID8gYHZpZXcuc2V0JHtwcmltaXRpdmVKU05hbWVbdGFnXX0od3JpdGVyLm9mZnNldCwgdmFsdWUuJHtuYW1lfSwgJHtwcmltaXRpdmVTaXplc1t0YWddID4gMSA/IFwidHJ1ZVwiIDogXCJcIn0pO1xud3JpdGVyLm9mZnNldCArPSAke3ByaW1pdGl2ZVNpemVzW3RhZ119O2AgOiBgd3JpdGVyLndyaXRlJHt0YWd9KHZhbHVlLiR7bmFtZX0pO2BcbiAgICAgICkuam9pbihcIlxcblwiKX1gO1xuICAgICAgc2VyaWFsaXplciA9IEZ1bmN0aW9uKFwid3JpdGVyXCIsIFwidmFsdWVcIiwgYm9keTIpO1xuICAgICAgU0VSSUFMSVpFUlMuc2V0KHR5LCBzZXJpYWxpemVyKTtcbiAgICAgIHJldHVybiBzZXJpYWxpemVyO1xuICAgIH1cbiAgICBjb25zdCBzZXJpYWxpemVycyA9IHt9O1xuICAgIGNvbnN0IGJvZHkgPSAnXCJ1c2Ugc3RyaWN0XCI7XFxuJyArIHR5LmVsZW1lbnRzLm1hcChcbiAgICAgIChlbGVtZW50KSA9PiBgdGhpcy4ke2VsZW1lbnQubmFtZX0od3JpdGVyLCB2YWx1ZS4ke2VsZW1lbnQubmFtZX0pO2BcbiAgICApLmpvaW4oXCJcXG5cIik7XG4gICAgc2VyaWFsaXplciA9IEZ1bmN0aW9uKFwid3JpdGVyXCIsIFwidmFsdWVcIiwgYm9keSkuYmluZChcbiAgICAgIHNlcmlhbGl6ZXJzXG4gICAgKTtcbiAgICBTRVJJQUxJWkVSUy5zZXQodHksIHNlcmlhbGl6ZXIpO1xuICAgIGZvciAoY29uc3QgeyBuYW1lLCBhbGdlYnJhaWNUeXBlIH0gb2YgdHkuZWxlbWVudHMpIHtcbiAgICAgIHNlcmlhbGl6ZXJzW25hbWVdID0gQWxnZWJyYWljVHlwZS5tYWtlU2VyaWFsaXplcihcbiAgICAgICAgYWxnZWJyYWljVHlwZSxcbiAgICAgICAgdHlwZXNwYWNlXG4gICAgICApO1xuICAgIH1cbiAgICBPYmplY3QuZnJlZXplKHNlcmlhbGl6ZXJzKTtcbiAgICByZXR1cm4gc2VyaWFsaXplcjtcbiAgfSxcbiAgLyoqIEBkZXByZWNhdGVkIFVzZSBgbWFrZVNlcmlhbGl6ZXJgIGluc3RlYWQuICovXG4gIHNlcmlhbGl6ZVZhbHVlKHdyaXRlciwgdHksIHZhbHVlLCB0eXBlc3BhY2UpIHtcbiAgICBQcm9kdWN0VHlwZS5tYWtlU2VyaWFsaXplcih0eSwgdHlwZXNwYWNlKSh3cml0ZXIsIHZhbHVlKTtcbiAgfSxcbiAgbWFrZURlc2VyaWFsaXplcih0eSwgdHlwZXNwYWNlKSB7XG4gICAgc3dpdGNoICh0eS5lbGVtZW50cy5sZW5ndGgpIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgcmV0dXJuIHVuaXREZXNlcmlhbGl6ZXI7XG4gICAgICBjYXNlIDE6IHtcbiAgICAgICAgY29uc3QgZmllbGROYW1lID0gdHkuZWxlbWVudHNbMF0ubmFtZTtcbiAgICAgICAgaWYgKGhhc093bihzcGVjaWFsUHJvZHVjdERlc2VyaWFsaXplcnMsIGZpZWxkTmFtZSkpXG4gICAgICAgICAgcmV0dXJuIHNwZWNpYWxQcm9kdWN0RGVzZXJpYWxpemVyc1tmaWVsZE5hbWVdO1xuICAgICAgfVxuICAgIH1cbiAgICBsZXQgZGVzZXJpYWxpemVyID0gREVTRVJJQUxJWkVSUy5nZXQodHkpO1xuICAgIGlmIChkZXNlcmlhbGl6ZXIgIT0gbnVsbCkgcmV0dXJuIGRlc2VyaWFsaXplcjtcbiAgICBpZiAoaXNGaXhlZFNpemVQcm9kdWN0KHR5KSkge1xuICAgICAgY29uc3QgYm9keSA9IGBcInVzZSBzdHJpY3RcIjtcbmNvbnN0IHJlc3VsdCA9IHsgJHt0eS5lbGVtZW50cy5tYXAoZ2V0RWxlbWVudEluaXRpYWxpemVyKS5qb2luKFwiLCBcIil9IH07XG5jb25zdCB2aWV3ID0gcmVhZGVyLnZpZXc7XG4ke3R5LmVsZW1lbnRzLm1hcChcbiAgICAgICAgKHsgbmFtZSwgYWxnZWJyYWljVHlwZTogeyB0YWcgfSB9KSA9PiB0YWcgaW4gcHJpbWl0aXZlSlNOYW1lID8gYHJlc3VsdC4ke25hbWV9ID0gdmlldy5nZXQke3ByaW1pdGl2ZUpTTmFtZVt0YWddfShyZWFkZXIub2Zmc2V0LCAke3ByaW1pdGl2ZVNpemVzW3RhZ10gPiAxID8gXCJ0cnVlXCIgOiBcIlwifSk7XG5yZWFkZXIub2Zmc2V0ICs9ICR7cHJpbWl0aXZlU2l6ZXNbdGFnXX07YCA6IGByZXN1bHQuJHtuYW1lfSA9IHJlYWRlci5yZWFkJHt0YWd9KCk7YFxuICAgICAgKS5qb2luKFwiXFxuXCIpfVxucmV0dXJuIHJlc3VsdDtgO1xuICAgICAgZGVzZXJpYWxpemVyID0gRnVuY3Rpb24oXCJyZWFkZXJcIiwgYm9keSk7XG4gICAgICBERVNFUklBTElaRVJTLnNldCh0eSwgZGVzZXJpYWxpemVyKTtcbiAgICAgIHJldHVybiBkZXNlcmlhbGl6ZXI7XG4gICAgfVxuICAgIGNvbnN0IGRlc2VyaWFsaXplcnMgPSB7fTtcbiAgICBkZXNlcmlhbGl6ZXIgPSBGdW5jdGlvbihcbiAgICAgIFwicmVhZGVyXCIsXG4gICAgICBgXCJ1c2Ugc3RyaWN0XCI7XG5jb25zdCByZXN1bHQgPSB7ICR7dHkuZWxlbWVudHMubWFwKGdldEVsZW1lbnRJbml0aWFsaXplcikuam9pbihcIiwgXCIpfSB9O1xuJHt0eS5lbGVtZW50cy5tYXAoKHsgbmFtZSB9KSA9PiBgcmVzdWx0LiR7bmFtZX0gPSB0aGlzLiR7bmFtZX0ocmVhZGVyKTtgKS5qb2luKFwiXFxuXCIpfVxucmV0dXJuIHJlc3VsdDtgXG4gICAgKS5iaW5kKGRlc2VyaWFsaXplcnMpO1xuICAgIERFU0VSSUFMSVpFUlMuc2V0KHR5LCBkZXNlcmlhbGl6ZXIpO1xuICAgIGZvciAoY29uc3QgeyBuYW1lLCBhbGdlYnJhaWNUeXBlIH0gb2YgdHkuZWxlbWVudHMpIHtcbiAgICAgIGRlc2VyaWFsaXplcnNbbmFtZV0gPSBBbGdlYnJhaWNUeXBlLm1ha2VEZXNlcmlhbGl6ZXIoXG4gICAgICAgIGFsZ2VicmFpY1R5cGUsXG4gICAgICAgIHR5cGVzcGFjZVxuICAgICAgKTtcbiAgICB9XG4gICAgT2JqZWN0LmZyZWV6ZShkZXNlcmlhbGl6ZXJzKTtcbiAgICByZXR1cm4gZGVzZXJpYWxpemVyO1xuICB9LFxuICAvKiogQGRlcHJlY2F0ZWQgVXNlIGBtYWtlRGVzZXJpYWxpemVyYCBpbnN0ZWFkLiAqL1xuICBkZXNlcmlhbGl6ZVZhbHVlKHJlYWRlciwgdHksIHR5cGVzcGFjZSkge1xuICAgIHJldHVybiBQcm9kdWN0VHlwZS5tYWtlRGVzZXJpYWxpemVyKHR5LCB0eXBlc3BhY2UpKHJlYWRlcik7XG4gIH0sXG4gIGludG9NYXBLZXkodHksIHZhbHVlKSB7XG4gICAgaWYgKHR5LmVsZW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgY29uc3QgZmllbGROYW1lID0gdHkuZWxlbWVudHNbMF0ubmFtZTtcbiAgICAgIGlmIChoYXNPd24oc3BlY2lhbFByb2R1Y3REZXNlcmlhbGl6ZXJzLCBmaWVsZE5hbWUpKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZVtmaWVsZE5hbWVdO1xuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCB3cml0ZXIgPSBuZXcgQmluYXJ5V3JpdGVyKDEwKTtcbiAgICBBbGdlYnJhaWNUeXBlLnNlcmlhbGl6ZVZhbHVlKHdyaXRlciwgQWxnZWJyYWljVHlwZS5Qcm9kdWN0KHR5KSwgdmFsdWUpO1xuICAgIHJldHVybiB3cml0ZXIudG9CYXNlNjQoKTtcbiAgfVxufTtcbnZhciBTdW1UeXBlID0ge1xuICBtYWtlU2VyaWFsaXplcih0eSwgdHlwZXNwYWNlKSB7XG4gICAgaWYgKHR5LnZhcmlhbnRzLmxlbmd0aCA9PSAyICYmIHR5LnZhcmlhbnRzWzBdLm5hbWUgPT09IFwic29tZVwiICYmIHR5LnZhcmlhbnRzWzFdLm5hbWUgPT09IFwibm9uZVwiKSB7XG4gICAgICBjb25zdCBzZXJpYWxpemUgPSBBbGdlYnJhaWNUeXBlLm1ha2VTZXJpYWxpemVyKFxuICAgICAgICB0eS52YXJpYW50c1swXS5hbGdlYnJhaWNUeXBlLFxuICAgICAgICB0eXBlc3BhY2VcbiAgICAgICk7XG4gICAgICByZXR1cm4gKHdyaXRlciwgdmFsdWUpID0+IHtcbiAgICAgICAgaWYgKHZhbHVlICE9PSBudWxsICYmIHZhbHVlICE9PSB2b2lkIDApIHtcbiAgICAgICAgICB3cml0ZXIud3JpdGVCeXRlKDApO1xuICAgICAgICAgIHNlcmlhbGl6ZSh3cml0ZXIsIHZhbHVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB3cml0ZXIud3JpdGVCeXRlKDEpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAodHkudmFyaWFudHMubGVuZ3RoID09IDIgJiYgdHkudmFyaWFudHNbMF0ubmFtZSA9PT0gXCJva1wiICYmIHR5LnZhcmlhbnRzWzFdLm5hbWUgPT09IFwiZXJyXCIpIHtcbiAgICAgIGNvbnN0IHNlcmlhbGl6ZU9rID0gQWxnZWJyYWljVHlwZS5tYWtlU2VyaWFsaXplcihcbiAgICAgICAgdHkudmFyaWFudHNbMF0uYWxnZWJyYWljVHlwZSxcbiAgICAgICAgdHlwZXNwYWNlXG4gICAgICApO1xuICAgICAgY29uc3Qgc2VyaWFsaXplRXJyID0gQWxnZWJyYWljVHlwZS5tYWtlU2VyaWFsaXplcihcbiAgICAgICAgdHkudmFyaWFudHNbMF0uYWxnZWJyYWljVHlwZSxcbiAgICAgICAgdHlwZXNwYWNlXG4gICAgICApO1xuICAgICAgcmV0dXJuICh3cml0ZXIsIHZhbHVlKSA9PiB7XG4gICAgICAgIGlmIChcIm9rXCIgaW4gdmFsdWUpIHtcbiAgICAgICAgICB3cml0ZXIud3JpdGVVOCgwKTtcbiAgICAgICAgICBzZXJpYWxpemVPayh3cml0ZXIsIHZhbHVlLm9rKTtcbiAgICAgICAgfSBlbHNlIGlmIChcImVyclwiIGluIHZhbHVlKSB7XG4gICAgICAgICAgd3JpdGVyLndyaXRlVTgoMSk7XG4gICAgICAgICAgc2VyaWFsaXplRXJyKHdyaXRlciwgdmFsdWUuZXJyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgICAgICAgXCJjb3VsZCBub3Qgc2VyaWFsaXplIHJlc3VsdDogb2JqZWN0IGhhZCBuZWl0aGVyIGEgYG9rYCBub3IgYW4gYGVycmAgZmllbGRcIlxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBzZXJpYWxpemVyID0gU0VSSUFMSVpFUlMuZ2V0KHR5KTtcbiAgICAgIGlmIChzZXJpYWxpemVyICE9IG51bGwpIHJldHVybiBzZXJpYWxpemVyO1xuICAgICAgY29uc3Qgc2VyaWFsaXplcnMgPSB7fTtcbiAgICAgIGNvbnN0IGJvZHkgPSBgc3dpdGNoICh2YWx1ZS50YWcpIHtcbiR7dHkudmFyaWFudHMubWFwKFxuICAgICAgICAoeyBuYW1lIH0sIGkpID0+IGAgIGNhc2UgJHtKU09OLnN0cmluZ2lmeShuYW1lKX06XG4gICAgd3JpdGVyLndyaXRlQnl0ZSgke2l9KTtcbiAgICByZXR1cm4gdGhpcy4ke25hbWV9KHdyaXRlciwgdmFsdWUudmFsdWUpO2BcbiAgICAgICkuam9pbihcIlxcblwiKX1cbiAgZGVmYXVsdDpcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgXFxgQ291bGQgbm90IHNlcmlhbGl6ZSBzdW0gdHlwZTsgdW5rbm93biB0YWcgXFwke3ZhbHVlLnRhZ31cXGBcbiAgICApXG59XG5gO1xuICAgICAgc2VyaWFsaXplciA9IEZ1bmN0aW9uKFwid3JpdGVyXCIsIFwidmFsdWVcIiwgYm9keSkuYmluZChcbiAgICAgICAgc2VyaWFsaXplcnNcbiAgICAgICk7XG4gICAgICBTRVJJQUxJWkVSUy5zZXQodHksIHNlcmlhbGl6ZXIpO1xuICAgICAgZm9yIChjb25zdCB7IG5hbWUsIGFsZ2VicmFpY1R5cGUgfSBvZiB0eS52YXJpYW50cykge1xuICAgICAgICBzZXJpYWxpemVyc1tuYW1lXSA9IEFsZ2VicmFpY1R5cGUubWFrZVNlcmlhbGl6ZXIoXG4gICAgICAgICAgYWxnZWJyYWljVHlwZSxcbiAgICAgICAgICB0eXBlc3BhY2VcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIE9iamVjdC5mcmVlemUoc2VyaWFsaXplcnMpO1xuICAgICAgcmV0dXJuIHNlcmlhbGl6ZXI7XG4gICAgfVxuICB9LFxuICAvKiogQGRlcHJlY2F0ZWQgVXNlIGBtYWtlU2VyaWFsaXplcmAgaW5zdGVhZC4gKi9cbiAgc2VyaWFsaXplVmFsdWUod3JpdGVyLCB0eSwgdmFsdWUsIHR5cGVzcGFjZSkge1xuICAgIFN1bVR5cGUubWFrZVNlcmlhbGl6ZXIodHksIHR5cGVzcGFjZSkod3JpdGVyLCB2YWx1ZSk7XG4gIH0sXG4gIG1ha2VEZXNlcmlhbGl6ZXIodHksIHR5cGVzcGFjZSkge1xuICAgIGlmICh0eS52YXJpYW50cy5sZW5ndGggPT0gMiAmJiB0eS52YXJpYW50c1swXS5uYW1lID09PSBcInNvbWVcIiAmJiB0eS52YXJpYW50c1sxXS5uYW1lID09PSBcIm5vbmVcIikge1xuICAgICAgY29uc3QgZGVzZXJpYWxpemUgPSBBbGdlYnJhaWNUeXBlLm1ha2VEZXNlcmlhbGl6ZXIoXG4gICAgICAgIHR5LnZhcmlhbnRzWzBdLmFsZ2VicmFpY1R5cGUsXG4gICAgICAgIHR5cGVzcGFjZVxuICAgICAgKTtcbiAgICAgIHJldHVybiAocmVhZGVyKSA9PiB7XG4gICAgICAgIGNvbnN0IHRhZyA9IHJlYWRlci5yZWFkVTgoKTtcbiAgICAgICAgaWYgKHRhZyA9PT0gMCkge1xuICAgICAgICAgIHJldHVybiBkZXNlcmlhbGl6ZShyZWFkZXIpO1xuICAgICAgICB9IGVsc2UgaWYgKHRhZyA9PT0gMSkge1xuICAgICAgICAgIHJldHVybiB2b2lkIDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgYENhbid0IGRlc2VyaWFsaXplIGFuIG9wdGlvbiB0eXBlLCBjb3VsZG4ndCBmaW5kICR7dGFnfSB0YWdgO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAodHkudmFyaWFudHMubGVuZ3RoID09IDIgJiYgdHkudmFyaWFudHNbMF0ubmFtZSA9PT0gXCJva1wiICYmIHR5LnZhcmlhbnRzWzFdLm5hbWUgPT09IFwiZXJyXCIpIHtcbiAgICAgIGNvbnN0IGRlc2VyaWFsaXplT2sgPSBBbGdlYnJhaWNUeXBlLm1ha2VEZXNlcmlhbGl6ZXIoXG4gICAgICAgIHR5LnZhcmlhbnRzWzBdLmFsZ2VicmFpY1R5cGUsXG4gICAgICAgIHR5cGVzcGFjZVxuICAgICAgKTtcbiAgICAgIGNvbnN0IGRlc2VyaWFsaXplRXJyID0gQWxnZWJyYWljVHlwZS5tYWtlRGVzZXJpYWxpemVyKFxuICAgICAgICB0eS52YXJpYW50c1sxXS5hbGdlYnJhaWNUeXBlLFxuICAgICAgICB0eXBlc3BhY2VcbiAgICAgICk7XG4gICAgICByZXR1cm4gKHJlYWRlcikgPT4ge1xuICAgICAgICBjb25zdCB0YWcgPSByZWFkZXIucmVhZEJ5dGUoKTtcbiAgICAgICAgaWYgKHRhZyA9PT0gMCkge1xuICAgICAgICAgIHJldHVybiB7IG9rOiBkZXNlcmlhbGl6ZU9rKHJlYWRlcikgfTtcbiAgICAgICAgfSBlbHNlIGlmICh0YWcgPT09IDEpIHtcbiAgICAgICAgICByZXR1cm4geyBlcnI6IGRlc2VyaWFsaXplRXJyKHJlYWRlcikgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyBgQ2FuJ3QgZGVzZXJpYWxpemUgYSByZXN1bHQgdHlwZSwgY291bGRuJ3QgZmluZCAke3RhZ30gdGFnYDtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IGRlc2VyaWFsaXplciA9IERFU0VSSUFMSVpFUlMuZ2V0KHR5KTtcbiAgICAgIGlmIChkZXNlcmlhbGl6ZXIgIT0gbnVsbCkgcmV0dXJuIGRlc2VyaWFsaXplcjtcbiAgICAgIGNvbnN0IGRlc2VyaWFsaXplcnMgPSB7fTtcbiAgICAgIGRlc2VyaWFsaXplciA9IEZ1bmN0aW9uKFxuICAgICAgICBcInJlYWRlclwiLFxuICAgICAgICBgc3dpdGNoIChyZWFkZXIucmVhZFU4KCkpIHtcbiR7dHkudmFyaWFudHMubWFwKFxuICAgICAgICAgICh7IG5hbWUgfSwgaSkgPT4gYGNhc2UgJHtpfTogcmV0dXJuIHsgdGFnOiAke0pTT04uc3RyaW5naWZ5KG5hbWUpfSwgdmFsdWU6IHRoaXMuJHtuYW1lfShyZWFkZXIpIH07YFxuICAgICAgICApLmpvaW4oXCJcXG5cIil9IH1gXG4gICAgICApLmJpbmQoZGVzZXJpYWxpemVycyk7XG4gICAgICBERVNFUklBTElaRVJTLnNldCh0eSwgZGVzZXJpYWxpemVyKTtcbiAgICAgIGZvciAoY29uc3QgeyBuYW1lLCBhbGdlYnJhaWNUeXBlIH0gb2YgdHkudmFyaWFudHMpIHtcbiAgICAgICAgZGVzZXJpYWxpemVyc1tuYW1lXSA9IEFsZ2VicmFpY1R5cGUubWFrZURlc2VyaWFsaXplcihcbiAgICAgICAgICBhbGdlYnJhaWNUeXBlLFxuICAgICAgICAgIHR5cGVzcGFjZVxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgT2JqZWN0LmZyZWV6ZShkZXNlcmlhbGl6ZXJzKTtcbiAgICAgIHJldHVybiBkZXNlcmlhbGl6ZXI7XG4gICAgfVxuICB9LFxuICAvKiogQGRlcHJlY2F0ZWQgVXNlIGBtYWtlRGVzZXJpYWxpemVyYCBpbnN0ZWFkLiAqL1xuICBkZXNlcmlhbGl6ZVZhbHVlKHJlYWRlciwgdHksIHR5cGVzcGFjZSkge1xuICAgIHJldHVybiBTdW1UeXBlLm1ha2VEZXNlcmlhbGl6ZXIodHksIHR5cGVzcGFjZSkocmVhZGVyKTtcbiAgfVxufTtcblxuLy8gc3JjL2xpYi9vcHRpb24udHNcbnZhciBPcHRpb24gPSB7XG4gIGdldEFsZ2VicmFpY1R5cGUoaW5uZXJUeXBlKSB7XG4gICAgcmV0dXJuIEFsZ2VicmFpY1R5cGUuU3VtKHtcbiAgICAgIHZhcmlhbnRzOiBbXG4gICAgICAgIHsgbmFtZTogXCJzb21lXCIsIGFsZ2VicmFpY1R5cGU6IGlubmVyVHlwZSB9LFxuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogXCJub25lXCIsXG4gICAgICAgICAgYWxnZWJyYWljVHlwZTogQWxnZWJyYWljVHlwZS5Qcm9kdWN0KHsgZWxlbWVudHM6IFtdIH0pXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9KTtcbiAgfVxufTtcblxuLy8gc3JjL2xpYi9yZXN1bHQudHNcbnZhciBSZXN1bHQgPSB7XG4gIGdldEFsZ2VicmFpY1R5cGUob2tUeXBlLCBlcnJUeXBlKSB7XG4gICAgcmV0dXJuIEFsZ2VicmFpY1R5cGUuU3VtKHtcbiAgICAgIHZhcmlhbnRzOiBbXG4gICAgICAgIHsgbmFtZTogXCJva1wiLCBhbGdlYnJhaWNUeXBlOiBva1R5cGUgfSxcbiAgICAgICAgeyBuYW1lOiBcImVyclwiLCBhbGdlYnJhaWNUeXBlOiBlcnJUeXBlIH1cbiAgICAgIF1cbiAgICB9KTtcbiAgfVxufTtcblxuLy8gc3JjL2xpYi9zY2hlZHVsZV9hdC50c1xudmFyIFNjaGVkdWxlQXQgPSB7XG4gIGludGVydmFsKHZhbHVlKSB7XG4gICAgcmV0dXJuIEludGVydmFsKHZhbHVlKTtcbiAgfSxcbiAgdGltZSh2YWx1ZSkge1xuICAgIHJldHVybiBUaW1lKHZhbHVlKTtcbiAgfSxcbiAgZ2V0QWxnZWJyYWljVHlwZSgpIHtcbiAgICByZXR1cm4gQWxnZWJyYWljVHlwZS5TdW0oe1xuICAgICAgdmFyaWFudHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6IFwiSW50ZXJ2YWxcIixcbiAgICAgICAgICBhbGdlYnJhaWNUeXBlOiBUaW1lRHVyYXRpb24uZ2V0QWxnZWJyYWljVHlwZSgpXG4gICAgICAgIH0sXG4gICAgICAgIHsgbmFtZTogXCJUaW1lXCIsIGFsZ2VicmFpY1R5cGU6IFRpbWVzdGFtcC5nZXRBbGdlYnJhaWNUeXBlKCkgfVxuICAgICAgXVxuICAgIH0pO1xuICB9LFxuICBpc1NjaGVkdWxlQXQoYWxnZWJyYWljVHlwZSkge1xuICAgIGlmIChhbGdlYnJhaWNUeXBlLnRhZyAhPT0gXCJTdW1cIikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjb25zdCB2YXJpYW50cyA9IGFsZ2VicmFpY1R5cGUudmFsdWUudmFyaWFudHM7XG4gICAgaWYgKHZhcmlhbnRzLmxlbmd0aCAhPT0gMikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjb25zdCBpbnRlcnZhbFZhcmlhbnQgPSB2YXJpYW50cy5maW5kKCh2KSA9PiB2Lm5hbWUgPT09IFwiSW50ZXJ2YWxcIik7XG4gICAgY29uc3QgdGltZVZhcmlhbnQgPSB2YXJpYW50cy5maW5kKCh2KSA9PiB2Lm5hbWUgPT09IFwiVGltZVwiKTtcbiAgICBpZiAoIWludGVydmFsVmFyaWFudCB8fCAhdGltZVZhcmlhbnQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIFRpbWVEdXJhdGlvbi5pc1RpbWVEdXJhdGlvbihpbnRlcnZhbFZhcmlhbnQuYWxnZWJyYWljVHlwZSkgJiYgVGltZXN0YW1wLmlzVGltZXN0YW1wKHRpbWVWYXJpYW50LmFsZ2VicmFpY1R5cGUpO1xuICB9XG59O1xudmFyIEludGVydmFsID0gKG1pY3JvcykgPT4gKHtcbiAgdGFnOiBcIkludGVydmFsXCIsXG4gIHZhbHVlOiBuZXcgVGltZUR1cmF0aW9uKG1pY3Jvcylcbn0pO1xudmFyIFRpbWUgPSAobWljcm9zU2luY2VVbml4RXBvY2gpID0+ICh7XG4gIHRhZzogXCJUaW1lXCIsXG4gIHZhbHVlOiBuZXcgVGltZXN0YW1wKG1pY3Jvc1NpbmNlVW5peEVwb2NoKVxufSk7XG52YXIgc2NoZWR1bGVfYXRfZGVmYXVsdCA9IFNjaGVkdWxlQXQ7XG5cbi8vIHNyYy9saWIvdHlwZV91dGlsLnRzXG5mdW5jdGlvbiBzZXQoeCwgdDIpIHtcbiAgcmV0dXJuIHsgLi4ueCwgLi4udDIgfTtcbn1cblxuLy8gc3JjL2xpYi90eXBlX2J1aWxkZXJzLnRzXG52YXIgVHlwZUJ1aWxkZXIgPSBjbGFzcyB7XG4gIC8qKlxuICAgKiBUaGUgVHlwZVNjcmlwdCBwaGFudG9tIHR5cGUuIFRoaXMgaXMgbm90IHN0b3JlZCBhdCBydW50aW1lLFxuICAgKiBidXQgaXMgdmlzaWJsZSB0byB0aGUgY29tcGlsZXJcbiAgICovXG4gIHR5cGU7XG4gIC8qKlxuICAgKiBUaGUgU3BhY2V0aW1lREIgYWxnZWJyYWljIHR5cGUgKHJ1buKAkXRpbWUgdmFsdWUpLiBJbiBhZGRpdGlvbiB0byBzdG9yaW5nXG4gICAqIHRoZSBydW50aW1lIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBgQWxnZWJyYWljVHlwZWAsIGl0IGFsc28gY2FwdHVyZXNcbiAgICogdGhlIFR5cGVTY3JpcHQgdHlwZSBpbmZvcm1hdGlvbiBvZiB0aGUgYEFsZ2VicmFpY1R5cGVgLiBUaGF0IGlzIHRvIHNheVxuICAgKiB0aGUgdmFsdWUgaXMgbm90IG1lcmVseSBhbiBgQWxnZWJyYWljVHlwZWAsIGJ1dCBpcyBjb25zdHJ1Y3RlZCB0byBiZVxuICAgKiB0aGUgY29ycmVzcG9uZGluZyBjb25jcmV0ZSBgQWxnZWJyYWljVHlwZWAgZm9yIHRoZSBUeXBlU2NyaXB0IHR5cGUgYFR5cGVgLlxuICAgKlxuICAgKiBlLmcuIGBzdHJpbmdgIGNvcnJlc3BvbmRzIHRvIGBBbGdlYnJhaWNUeXBlLlN0cmluZ2BcbiAgICovXG4gIGFsZ2VicmFpY1R5cGU7XG4gIGNvbnN0cnVjdG9yKGFsZ2VicmFpY1R5cGUpIHtcbiAgICB0aGlzLmFsZ2VicmFpY1R5cGUgPSBhbGdlYnJhaWNUeXBlO1xuICB9XG4gIG9wdGlvbmFsKCkge1xuICAgIHJldHVybiBuZXcgT3B0aW9uQnVpbGRlcih0aGlzKTtcbiAgfVxuICBzZXJpYWxpemUod3JpdGVyLCB2YWx1ZSkge1xuICAgIGNvbnN0IHNlcmlhbGl6ZSA9IHRoaXMuc2VyaWFsaXplID0gQWxnZWJyYWljVHlwZS5tYWtlU2VyaWFsaXplcihcbiAgICAgIHRoaXMuYWxnZWJyYWljVHlwZVxuICAgICk7XG4gICAgc2VyaWFsaXplKHdyaXRlciwgdmFsdWUpO1xuICB9XG4gIGRlc2VyaWFsaXplKHJlYWRlcikge1xuICAgIGNvbnN0IGRlc2VyaWFsaXplID0gdGhpcy5kZXNlcmlhbGl6ZSA9IEFsZ2VicmFpY1R5cGUubWFrZURlc2VyaWFsaXplcihcbiAgICAgIHRoaXMuYWxnZWJyYWljVHlwZVxuICAgICk7XG4gICAgcmV0dXJuIGRlc2VyaWFsaXplKHJlYWRlcik7XG4gIH1cbn07XG52YXIgVThCdWlsZGVyID0gY2xhc3MgZXh0ZW5kcyBUeXBlQnVpbGRlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKEFsZ2VicmFpY1R5cGUuVTgpO1xuICB9XG4gIGluZGV4KGFsZ29yaXRobSA9IFwiYnRyZWVcIikge1xuICAgIHJldHVybiBuZXcgVThDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaW5kZXhUeXBlOiBhbGdvcml0aG0gfSlcbiAgICApO1xuICB9XG4gIHVuaXF1ZSgpIHtcbiAgICByZXR1cm4gbmV3IFU4Q29sdW1uQnVpbGRlcih0aGlzLCBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IGlzVW5pcXVlOiB0cnVlIH0pKTtcbiAgfVxuICBwcmltYXJ5S2V5KCkge1xuICAgIHJldHVybiBuZXcgVThDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaXNQcmltYXJ5S2V5OiB0cnVlIH0pXG4gICAgKTtcbiAgfVxuICBhdXRvSW5jKCkge1xuICAgIHJldHVybiBuZXcgVThDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaXNBdXRvSW5jcmVtZW50OiB0cnVlIH0pXG4gICAgKTtcbiAgfVxuICBkZWZhdWx0KHZhbHVlKSB7XG4gICAgcmV0dXJuIG5ldyBVOENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLFxuICAgICAgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBkZWZhdWx0VmFsdWU6IHZhbHVlIH0pXG4gICAgKTtcbiAgfVxuICBuYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gbmV3IFU4Q29sdW1uQnVpbGRlcih0aGlzLCBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IG5hbWUgfSkpO1xuICB9XG59O1xudmFyIFUxNkJ1aWxkZXIgPSBjbGFzcyBleHRlbmRzIFR5cGVCdWlsZGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoQWxnZWJyYWljVHlwZS5VMTYpO1xuICB9XG4gIGluZGV4KGFsZ29yaXRobSA9IFwiYnRyZWVcIikge1xuICAgIHJldHVybiBuZXcgVTE2Q29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMsXG4gICAgICBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IGluZGV4VHlwZTogYWxnb3JpdGhtIH0pXG4gICAgKTtcbiAgfVxuICB1bmlxdWUoKSB7XG4gICAgcmV0dXJuIG5ldyBVMTZDb2x1bW5CdWlsZGVyKHRoaXMsIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaXNVbmlxdWU6IHRydWUgfSkpO1xuICB9XG4gIHByaW1hcnlLZXkoKSB7XG4gICAgcmV0dXJuIG5ldyBVMTZDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaXNQcmltYXJ5S2V5OiB0cnVlIH0pXG4gICAgKTtcbiAgfVxuICBhdXRvSW5jKCkge1xuICAgIHJldHVybiBuZXcgVTE2Q29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMsXG4gICAgICBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IGlzQXV0b0luY3JlbWVudDogdHJ1ZSB9KVxuICAgICk7XG4gIH1cbiAgZGVmYXVsdCh2YWx1ZSkge1xuICAgIHJldHVybiBuZXcgVTE2Q29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMsXG4gICAgICBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IGRlZmF1bHRWYWx1ZTogdmFsdWUgfSlcbiAgICApO1xuICB9XG4gIG5hbWUobmFtZSkge1xuICAgIHJldHVybiBuZXcgVTE2Q29sdW1uQnVpbGRlcih0aGlzLCBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IG5hbWUgfSkpO1xuICB9XG59O1xudmFyIFUzMkJ1aWxkZXIgPSBjbGFzcyBleHRlbmRzIFR5cGVCdWlsZGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoQWxnZWJyYWljVHlwZS5VMzIpO1xuICB9XG4gIGluZGV4KGFsZ29yaXRobSA9IFwiYnRyZWVcIikge1xuICAgIHJldHVybiBuZXcgVTMyQ29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMsXG4gICAgICBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IGluZGV4VHlwZTogYWxnb3JpdGhtIH0pXG4gICAgKTtcbiAgfVxuICB1bmlxdWUoKSB7XG4gICAgcmV0dXJuIG5ldyBVMzJDb2x1bW5CdWlsZGVyKHRoaXMsIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaXNVbmlxdWU6IHRydWUgfSkpO1xuICB9XG4gIHByaW1hcnlLZXkoKSB7XG4gICAgcmV0dXJuIG5ldyBVMzJDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaXNQcmltYXJ5S2V5OiB0cnVlIH0pXG4gICAgKTtcbiAgfVxuICBhdXRvSW5jKCkge1xuICAgIHJldHVybiBuZXcgVTMyQ29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMsXG4gICAgICBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IGlzQXV0b0luY3JlbWVudDogdHJ1ZSB9KVxuICAgICk7XG4gIH1cbiAgZGVmYXVsdCh2YWx1ZSkge1xuICAgIHJldHVybiBuZXcgVTMyQ29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMsXG4gICAgICBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IGRlZmF1bHRWYWx1ZTogdmFsdWUgfSlcbiAgICApO1xuICB9XG4gIG5hbWUobmFtZSkge1xuICAgIHJldHVybiBuZXcgVTMyQ29sdW1uQnVpbGRlcih0aGlzLCBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IG5hbWUgfSkpO1xuICB9XG59O1xudmFyIFU2NEJ1aWxkZXIgPSBjbGFzcyBleHRlbmRzIFR5cGVCdWlsZGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoQWxnZWJyYWljVHlwZS5VNjQpO1xuICB9XG4gIGluZGV4KGFsZ29yaXRobSA9IFwiYnRyZWVcIikge1xuICAgIHJldHVybiBuZXcgVTY0Q29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMsXG4gICAgICBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IGluZGV4VHlwZTogYWxnb3JpdGhtIH0pXG4gICAgKTtcbiAgfVxuICB1bmlxdWUoKSB7XG4gICAgcmV0dXJuIG5ldyBVNjRDb2x1bW5CdWlsZGVyKHRoaXMsIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaXNVbmlxdWU6IHRydWUgfSkpO1xuICB9XG4gIHByaW1hcnlLZXkoKSB7XG4gICAgcmV0dXJuIG5ldyBVNjRDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaXNQcmltYXJ5S2V5OiB0cnVlIH0pXG4gICAgKTtcbiAgfVxuICBhdXRvSW5jKCkge1xuICAgIHJldHVybiBuZXcgVTY0Q29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMsXG4gICAgICBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IGlzQXV0b0luY3JlbWVudDogdHJ1ZSB9KVxuICAgICk7XG4gIH1cbiAgZGVmYXVsdCh2YWx1ZSkge1xuICAgIHJldHVybiBuZXcgVTY0Q29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMsXG4gICAgICBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IGRlZmF1bHRWYWx1ZTogdmFsdWUgfSlcbiAgICApO1xuICB9XG4gIG5hbWUobmFtZSkge1xuICAgIHJldHVybiBuZXcgVTY0Q29sdW1uQnVpbGRlcih0aGlzLCBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IG5hbWUgfSkpO1xuICB9XG59O1xudmFyIFUxMjhCdWlsZGVyID0gY2xhc3MgZXh0ZW5kcyBUeXBlQnVpbGRlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKEFsZ2VicmFpY1R5cGUuVTEyOCk7XG4gIH1cbiAgaW5kZXgoYWxnb3JpdGhtID0gXCJidHJlZVwiKSB7XG4gICAgcmV0dXJuIG5ldyBVMTI4Q29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMsXG4gICAgICBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IGluZGV4VHlwZTogYWxnb3JpdGhtIH0pXG4gICAgKTtcbiAgfVxuICB1bmlxdWUoKSB7XG4gICAgcmV0dXJuIG5ldyBVMTI4Q29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMsXG4gICAgICBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IGlzVW5pcXVlOiB0cnVlIH0pXG4gICAgKTtcbiAgfVxuICBwcmltYXJ5S2V5KCkge1xuICAgIHJldHVybiBuZXcgVTEyOENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLFxuICAgICAgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBpc1ByaW1hcnlLZXk6IHRydWUgfSlcbiAgICApO1xuICB9XG4gIGF1dG9JbmMoKSB7XG4gICAgcmV0dXJuIG5ldyBVMTI4Q29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMsXG4gICAgICBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IGlzQXV0b0luY3JlbWVudDogdHJ1ZSB9KVxuICAgICk7XG4gIH1cbiAgZGVmYXVsdCh2YWx1ZSkge1xuICAgIHJldHVybiBuZXcgVTEyOENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLFxuICAgICAgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBkZWZhdWx0VmFsdWU6IHZhbHVlIH0pXG4gICAgKTtcbiAgfVxuICBuYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gbmV3IFUxMjhDb2x1bW5CdWlsZGVyKHRoaXMsIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgbmFtZSB9KSk7XG4gIH1cbn07XG52YXIgVTI1NkJ1aWxkZXIgPSBjbGFzcyBleHRlbmRzIFR5cGVCdWlsZGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoQWxnZWJyYWljVHlwZS5VMjU2KTtcbiAgfVxuICBpbmRleChhbGdvcml0aG0gPSBcImJ0cmVlXCIpIHtcbiAgICByZXR1cm4gbmV3IFUyNTZDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaW5kZXhUeXBlOiBhbGdvcml0aG0gfSlcbiAgICApO1xuICB9XG4gIHVuaXF1ZSgpIHtcbiAgICByZXR1cm4gbmV3IFUyNTZDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaXNVbmlxdWU6IHRydWUgfSlcbiAgICApO1xuICB9XG4gIHByaW1hcnlLZXkoKSB7XG4gICAgcmV0dXJuIG5ldyBVMjU2Q29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMsXG4gICAgICBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IGlzUHJpbWFyeUtleTogdHJ1ZSB9KVxuICAgICk7XG4gIH1cbiAgYXV0b0luYygpIHtcbiAgICByZXR1cm4gbmV3IFUyNTZDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaXNBdXRvSW5jcmVtZW50OiB0cnVlIH0pXG4gICAgKTtcbiAgfVxuICBkZWZhdWx0KHZhbHVlKSB7XG4gICAgcmV0dXJuIG5ldyBVMjU2Q29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMsXG4gICAgICBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IGRlZmF1bHRWYWx1ZTogdmFsdWUgfSlcbiAgICApO1xuICB9XG4gIG5hbWUobmFtZSkge1xuICAgIHJldHVybiBuZXcgVTI1NkNvbHVtbkJ1aWxkZXIodGhpcywgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBuYW1lIH0pKTtcbiAgfVxufTtcbnZhciBJOEJ1aWxkZXIgPSBjbGFzcyBleHRlbmRzIFR5cGVCdWlsZGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoQWxnZWJyYWljVHlwZS5JOCk7XG4gIH1cbiAgaW5kZXgoYWxnb3JpdGhtID0gXCJidHJlZVwiKSB7XG4gICAgcmV0dXJuIG5ldyBJOENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLFxuICAgICAgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBpbmRleFR5cGU6IGFsZ29yaXRobSB9KVxuICAgICk7XG4gIH1cbiAgdW5pcXVlKCkge1xuICAgIHJldHVybiBuZXcgSThDb2x1bW5CdWlsZGVyKHRoaXMsIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaXNVbmlxdWU6IHRydWUgfSkpO1xuICB9XG4gIHByaW1hcnlLZXkoKSB7XG4gICAgcmV0dXJuIG5ldyBJOENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLFxuICAgICAgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBpc1ByaW1hcnlLZXk6IHRydWUgfSlcbiAgICApO1xuICB9XG4gIGF1dG9JbmMoKSB7XG4gICAgcmV0dXJuIG5ldyBJOENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLFxuICAgICAgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBpc0F1dG9JbmNyZW1lbnQ6IHRydWUgfSlcbiAgICApO1xuICB9XG4gIGRlZmF1bHQodmFsdWUpIHtcbiAgICByZXR1cm4gbmV3IEk4Q29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMsXG4gICAgICBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IGRlZmF1bHRWYWx1ZTogdmFsdWUgfSlcbiAgICApO1xuICB9XG4gIG5hbWUobmFtZSkge1xuICAgIHJldHVybiBuZXcgSThDb2x1bW5CdWlsZGVyKHRoaXMsIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgbmFtZSB9KSk7XG4gIH1cbn07XG52YXIgSTE2QnVpbGRlciA9IGNsYXNzIGV4dGVuZHMgVHlwZUJ1aWxkZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihBbGdlYnJhaWNUeXBlLkkxNik7XG4gIH1cbiAgaW5kZXgoYWxnb3JpdGhtID0gXCJidHJlZVwiKSB7XG4gICAgcmV0dXJuIG5ldyBJMTZDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaW5kZXhUeXBlOiBhbGdvcml0aG0gfSlcbiAgICApO1xuICB9XG4gIHVuaXF1ZSgpIHtcbiAgICByZXR1cm4gbmV3IEkxNkNvbHVtbkJ1aWxkZXIodGhpcywgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBpc1VuaXF1ZTogdHJ1ZSB9KSk7XG4gIH1cbiAgcHJpbWFyeUtleSgpIHtcbiAgICByZXR1cm4gbmV3IEkxNkNvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLFxuICAgICAgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBpc1ByaW1hcnlLZXk6IHRydWUgfSlcbiAgICApO1xuICB9XG4gIGF1dG9JbmMoKSB7XG4gICAgcmV0dXJuIG5ldyBJMTZDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaXNBdXRvSW5jcmVtZW50OiB0cnVlIH0pXG4gICAgKTtcbiAgfVxuICBkZWZhdWx0KHZhbHVlKSB7XG4gICAgcmV0dXJuIG5ldyBJMTZDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgZGVmYXVsdFZhbHVlOiB2YWx1ZSB9KVxuICAgICk7XG4gIH1cbiAgbmFtZShuYW1lKSB7XG4gICAgcmV0dXJuIG5ldyBJMTZDb2x1bW5CdWlsZGVyKHRoaXMsIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgbmFtZSB9KSk7XG4gIH1cbn07XG52YXIgSTMyQnVpbGRlciA9IGNsYXNzIGV4dGVuZHMgVHlwZUJ1aWxkZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihBbGdlYnJhaWNUeXBlLkkzMik7XG4gIH1cbiAgaW5kZXgoYWxnb3JpdGhtID0gXCJidHJlZVwiKSB7XG4gICAgcmV0dXJuIG5ldyBJMzJDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaW5kZXhUeXBlOiBhbGdvcml0aG0gfSlcbiAgICApO1xuICB9XG4gIHVuaXF1ZSgpIHtcbiAgICByZXR1cm4gbmV3IEkzMkNvbHVtbkJ1aWxkZXIodGhpcywgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBpc1VuaXF1ZTogdHJ1ZSB9KSk7XG4gIH1cbiAgcHJpbWFyeUtleSgpIHtcbiAgICByZXR1cm4gbmV3IEkzMkNvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLFxuICAgICAgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBpc1ByaW1hcnlLZXk6IHRydWUgfSlcbiAgICApO1xuICB9XG4gIGF1dG9JbmMoKSB7XG4gICAgcmV0dXJuIG5ldyBJMzJDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaXNBdXRvSW5jcmVtZW50OiB0cnVlIH0pXG4gICAgKTtcbiAgfVxuICBkZWZhdWx0KHZhbHVlKSB7XG4gICAgcmV0dXJuIG5ldyBJMzJDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgZGVmYXVsdFZhbHVlOiB2YWx1ZSB9KVxuICAgICk7XG4gIH1cbiAgbmFtZShuYW1lKSB7XG4gICAgcmV0dXJuIG5ldyBJMzJDb2x1bW5CdWlsZGVyKHRoaXMsIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgbmFtZSB9KSk7XG4gIH1cbn07XG52YXIgSTY0QnVpbGRlciA9IGNsYXNzIGV4dGVuZHMgVHlwZUJ1aWxkZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihBbGdlYnJhaWNUeXBlLkk2NCk7XG4gIH1cbiAgaW5kZXgoYWxnb3JpdGhtID0gXCJidHJlZVwiKSB7XG4gICAgcmV0dXJuIG5ldyBJNjRDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaW5kZXhUeXBlOiBhbGdvcml0aG0gfSlcbiAgICApO1xuICB9XG4gIHVuaXF1ZSgpIHtcbiAgICByZXR1cm4gbmV3IEk2NENvbHVtbkJ1aWxkZXIodGhpcywgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBpc1VuaXF1ZTogdHJ1ZSB9KSk7XG4gIH1cbiAgcHJpbWFyeUtleSgpIHtcbiAgICByZXR1cm4gbmV3IEk2NENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLFxuICAgICAgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBpc1ByaW1hcnlLZXk6IHRydWUgfSlcbiAgICApO1xuICB9XG4gIGF1dG9JbmMoKSB7XG4gICAgcmV0dXJuIG5ldyBJNjRDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaXNBdXRvSW5jcmVtZW50OiB0cnVlIH0pXG4gICAgKTtcbiAgfVxuICBkZWZhdWx0KHZhbHVlKSB7XG4gICAgcmV0dXJuIG5ldyBJNjRDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgZGVmYXVsdFZhbHVlOiB2YWx1ZSB9KVxuICAgICk7XG4gIH1cbiAgbmFtZShuYW1lKSB7XG4gICAgcmV0dXJuIG5ldyBJNjRDb2x1bW5CdWlsZGVyKHRoaXMsIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgbmFtZSB9KSk7XG4gIH1cbn07XG52YXIgSTEyOEJ1aWxkZXIgPSBjbGFzcyBleHRlbmRzIFR5cGVCdWlsZGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoQWxnZWJyYWljVHlwZS5JMTI4KTtcbiAgfVxuICBpbmRleChhbGdvcml0aG0gPSBcImJ0cmVlXCIpIHtcbiAgICByZXR1cm4gbmV3IEkxMjhDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaW5kZXhUeXBlOiBhbGdvcml0aG0gfSlcbiAgICApO1xuICB9XG4gIHVuaXF1ZSgpIHtcbiAgICByZXR1cm4gbmV3IEkxMjhDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaXNVbmlxdWU6IHRydWUgfSlcbiAgICApO1xuICB9XG4gIHByaW1hcnlLZXkoKSB7XG4gICAgcmV0dXJuIG5ldyBJMTI4Q29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMsXG4gICAgICBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IGlzUHJpbWFyeUtleTogdHJ1ZSB9KVxuICAgICk7XG4gIH1cbiAgYXV0b0luYygpIHtcbiAgICByZXR1cm4gbmV3IEkxMjhDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaXNBdXRvSW5jcmVtZW50OiB0cnVlIH0pXG4gICAgKTtcbiAgfVxuICBkZWZhdWx0KHZhbHVlKSB7XG4gICAgcmV0dXJuIG5ldyBJMTI4Q29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMsXG4gICAgICBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IGRlZmF1bHRWYWx1ZTogdmFsdWUgfSlcbiAgICApO1xuICB9XG4gIG5hbWUobmFtZSkge1xuICAgIHJldHVybiBuZXcgSTEyOENvbHVtbkJ1aWxkZXIodGhpcywgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBuYW1lIH0pKTtcbiAgfVxufTtcbnZhciBJMjU2QnVpbGRlciA9IGNsYXNzIGV4dGVuZHMgVHlwZUJ1aWxkZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihBbGdlYnJhaWNUeXBlLkkyNTYpO1xuICB9XG4gIGluZGV4KGFsZ29yaXRobSA9IFwiYnRyZWVcIikge1xuICAgIHJldHVybiBuZXcgSTI1NkNvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLFxuICAgICAgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBpbmRleFR5cGU6IGFsZ29yaXRobSB9KVxuICAgICk7XG4gIH1cbiAgdW5pcXVlKCkge1xuICAgIHJldHVybiBuZXcgSTI1NkNvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLFxuICAgICAgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBpc1VuaXF1ZTogdHJ1ZSB9KVxuICAgICk7XG4gIH1cbiAgcHJpbWFyeUtleSgpIHtcbiAgICByZXR1cm4gbmV3IEkyNTZDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaXNQcmltYXJ5S2V5OiB0cnVlIH0pXG4gICAgKTtcbiAgfVxuICBhdXRvSW5jKCkge1xuICAgIHJldHVybiBuZXcgSTI1NkNvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLFxuICAgICAgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBpc0F1dG9JbmNyZW1lbnQ6IHRydWUgfSlcbiAgICApO1xuICB9XG4gIGRlZmF1bHQodmFsdWUpIHtcbiAgICByZXR1cm4gbmV3IEkyNTZDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgZGVmYXVsdFZhbHVlOiB2YWx1ZSB9KVxuICAgICk7XG4gIH1cbiAgbmFtZShuYW1lKSB7XG4gICAgcmV0dXJuIG5ldyBJMjU2Q29sdW1uQnVpbGRlcih0aGlzLCBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IG5hbWUgfSkpO1xuICB9XG59O1xudmFyIEYzMkJ1aWxkZXIgPSBjbGFzcyBleHRlbmRzIFR5cGVCdWlsZGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoQWxnZWJyYWljVHlwZS5GMzIpO1xuICB9XG4gIGRlZmF1bHQodmFsdWUpIHtcbiAgICByZXR1cm4gbmV3IEYzMkNvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLFxuICAgICAgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBkZWZhdWx0VmFsdWU6IHZhbHVlIH0pXG4gICAgKTtcbiAgfVxuICBuYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gbmV3IEYzMkNvbHVtbkJ1aWxkZXIodGhpcywgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBuYW1lIH0pKTtcbiAgfVxufTtcbnZhciBGNjRCdWlsZGVyID0gY2xhc3MgZXh0ZW5kcyBUeXBlQnVpbGRlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKEFsZ2VicmFpY1R5cGUuRjY0KTtcbiAgfVxuICBkZWZhdWx0KHZhbHVlKSB7XG4gICAgcmV0dXJuIG5ldyBGNjRDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgZGVmYXVsdFZhbHVlOiB2YWx1ZSB9KVxuICAgICk7XG4gIH1cbiAgbmFtZShuYW1lKSB7XG4gICAgcmV0dXJuIG5ldyBGNjRDb2x1bW5CdWlsZGVyKHRoaXMsIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgbmFtZSB9KSk7XG4gIH1cbn07XG52YXIgQm9vbEJ1aWxkZXIgPSBjbGFzcyBleHRlbmRzIFR5cGVCdWlsZGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoQWxnZWJyYWljVHlwZS5Cb29sKTtcbiAgfVxuICBpbmRleChhbGdvcml0aG0gPSBcImJ0cmVlXCIpIHtcbiAgICByZXR1cm4gbmV3IEJvb2xDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaW5kZXhUeXBlOiBhbGdvcml0aG0gfSlcbiAgICApO1xuICB9XG4gIHVuaXF1ZSgpIHtcbiAgICByZXR1cm4gbmV3IEJvb2xDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaXNVbmlxdWU6IHRydWUgfSlcbiAgICApO1xuICB9XG4gIHByaW1hcnlLZXkoKSB7XG4gICAgcmV0dXJuIG5ldyBCb29sQ29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMsXG4gICAgICBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IGlzUHJpbWFyeUtleTogdHJ1ZSB9KVxuICAgICk7XG4gIH1cbiAgZGVmYXVsdCh2YWx1ZSkge1xuICAgIHJldHVybiBuZXcgQm9vbENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLFxuICAgICAgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBkZWZhdWx0VmFsdWU6IHZhbHVlIH0pXG4gICAgKTtcbiAgfVxuICBuYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gbmV3IEJvb2xDb2x1bW5CdWlsZGVyKHRoaXMsIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgbmFtZSB9KSk7XG4gIH1cbn07XG52YXIgU3RyaW5nQnVpbGRlciA9IGNsYXNzIGV4dGVuZHMgVHlwZUJ1aWxkZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihBbGdlYnJhaWNUeXBlLlN0cmluZyk7XG4gIH1cbiAgaW5kZXgoYWxnb3JpdGhtID0gXCJidHJlZVwiKSB7XG4gICAgcmV0dXJuIG5ldyBTdHJpbmdDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaW5kZXhUeXBlOiBhbGdvcml0aG0gfSlcbiAgICApO1xuICB9XG4gIHVuaXF1ZSgpIHtcbiAgICByZXR1cm4gbmV3IFN0cmluZ0NvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLFxuICAgICAgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBpc1VuaXF1ZTogdHJ1ZSB9KVxuICAgICk7XG4gIH1cbiAgcHJpbWFyeUtleSgpIHtcbiAgICByZXR1cm4gbmV3IFN0cmluZ0NvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLFxuICAgICAgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBpc1ByaW1hcnlLZXk6IHRydWUgfSlcbiAgICApO1xuICB9XG4gIGRlZmF1bHQodmFsdWUpIHtcbiAgICByZXR1cm4gbmV3IFN0cmluZ0NvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLFxuICAgICAgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBkZWZhdWx0VmFsdWU6IHZhbHVlIH0pXG4gICAgKTtcbiAgfVxuICBuYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gbmV3IFN0cmluZ0NvbHVtbkJ1aWxkZXIodGhpcywgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBuYW1lIH0pKTtcbiAgfVxufTtcbnZhciBBcnJheUJ1aWxkZXIgPSBjbGFzcyBleHRlbmRzIFR5cGVCdWlsZGVyIHtcbiAgZWxlbWVudDtcbiAgY29uc3RydWN0b3IoZWxlbWVudCkge1xuICAgIHN1cGVyKEFsZ2VicmFpY1R5cGUuQXJyYXkoZWxlbWVudC5hbGdlYnJhaWNUeXBlKSk7XG4gICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcbiAgfVxuICBkZWZhdWx0KHZhbHVlKSB7XG4gICAgcmV0dXJuIG5ldyBBcnJheUNvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLFxuICAgICAgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBkZWZhdWx0VmFsdWU6IHZhbHVlIH0pXG4gICAgKTtcbiAgfVxuICBuYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gbmV3IEFycmF5Q29sdW1uQnVpbGRlcih0aGlzLCBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IG5hbWUgfSkpO1xuICB9XG59O1xudmFyIEJ5dGVBcnJheUJ1aWxkZXIgPSBjbGFzcyBleHRlbmRzIFR5cGVCdWlsZGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoQWxnZWJyYWljVHlwZS5BcnJheShBbGdlYnJhaWNUeXBlLlU4KSk7XG4gIH1cbiAgZGVmYXVsdCh2YWx1ZSkge1xuICAgIHJldHVybiBuZXcgQnl0ZUFycmF5Q29sdW1uQnVpbGRlcihcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgZGVmYXVsdFZhbHVlOiB2YWx1ZSB9KVxuICAgICk7XG4gIH1cbiAgbmFtZShuYW1lKSB7XG4gICAgcmV0dXJuIG5ldyBCeXRlQXJyYXlDb2x1bW5CdWlsZGVyKHNldChkZWZhdWx0TWV0YWRhdGEsIHsgbmFtZSB9KSk7XG4gIH1cbn07XG52YXIgT3B0aW9uQnVpbGRlciA9IGNsYXNzIGV4dGVuZHMgVHlwZUJ1aWxkZXIge1xuICB2YWx1ZTtcbiAgY29uc3RydWN0b3IodmFsdWUpIHtcbiAgICBzdXBlcihPcHRpb24uZ2V0QWxnZWJyYWljVHlwZSh2YWx1ZS5hbGdlYnJhaWNUeXBlKSk7XG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICB9XG4gIGRlZmF1bHQodmFsdWUpIHtcbiAgICByZXR1cm4gbmV3IE9wdGlvbkNvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLFxuICAgICAgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBkZWZhdWx0VmFsdWU6IHZhbHVlIH0pXG4gICAgKTtcbiAgfVxuICBuYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gbmV3IE9wdGlvbkNvbHVtbkJ1aWxkZXIodGhpcywgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBuYW1lIH0pKTtcbiAgfVxufTtcbnZhciBQcm9kdWN0QnVpbGRlciA9IGNsYXNzIGV4dGVuZHMgVHlwZUJ1aWxkZXIge1xuICB0eXBlTmFtZTtcbiAgZWxlbWVudHM7XG4gIGNvbnN0cnVjdG9yKGVsZW1lbnRzLCBuYW1lKSB7XG4gICAgZnVuY3Rpb24gZWxlbWVudHNBcnJheUZyb21FbGVtZW50c09iaihvYmopIHtcbiAgICAgIHJldHVybiBPYmplY3Qua2V5cyhvYmopLm1hcCgoa2V5KSA9PiAoe1xuICAgICAgICBuYW1lOiBrZXksXG4gICAgICAgIC8vIExhemlseSByZXNvbHZlIHRoZSB1bmRlcmx5aW5nIG9iamVjdCdzIGFsZ2VicmFpY1R5cGUuXG4gICAgICAgIC8vIFRoaXMgd2lsbCBjYWxsIG9ialtrZXldLmFsZ2VicmFpY1R5cGUgb25seSB3aGVuIHNvbWVvbmVcbiAgICAgICAgLy8gYWN0dWFsbHkgcmVhZHMgdGhpcyBwcm9wZXJ0eS5cbiAgICAgICAgZ2V0IGFsZ2VicmFpY1R5cGUoKSB7XG4gICAgICAgICAgcmV0dXJuIG9ialtrZXldLmFsZ2VicmFpY1R5cGU7XG4gICAgICAgIH1cbiAgICAgIH0pKTtcbiAgICB9XG4gICAgc3VwZXIoXG4gICAgICBBbGdlYnJhaWNUeXBlLlByb2R1Y3Qoe1xuICAgICAgICBlbGVtZW50czogZWxlbWVudHNBcnJheUZyb21FbGVtZW50c09iaihlbGVtZW50cylcbiAgICAgIH0pXG4gICAgKTtcbiAgICB0aGlzLnR5cGVOYW1lID0gbmFtZTtcbiAgICB0aGlzLmVsZW1lbnRzID0gZWxlbWVudHM7XG4gIH1cbiAgZGVmYXVsdCh2YWx1ZSkge1xuICAgIHJldHVybiBuZXcgUHJvZHVjdENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLFxuICAgICAgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBkZWZhdWx0VmFsdWU6IHZhbHVlIH0pXG4gICAgKTtcbiAgfVxuICBuYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gbmV3IFByb2R1Y3RDb2x1bW5CdWlsZGVyKHRoaXMsIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgbmFtZSB9KSk7XG4gIH1cbn07XG52YXIgUmVzdWx0QnVpbGRlciA9IGNsYXNzIGV4dGVuZHMgVHlwZUJ1aWxkZXIge1xuICBvaztcbiAgZXJyO1xuICBjb25zdHJ1Y3RvcihvaywgZXJyKSB7XG4gICAgc3VwZXIoUmVzdWx0LmdldEFsZ2VicmFpY1R5cGUob2suYWxnZWJyYWljVHlwZSwgZXJyLmFsZ2VicmFpY1R5cGUpKTtcbiAgICB0aGlzLm9rID0gb2s7XG4gICAgdGhpcy5lcnIgPSBlcnI7XG4gIH1cbiAgZGVmYXVsdCh2YWx1ZSkge1xuICAgIHJldHVybiBuZXcgUmVzdWx0Q29sdW1uQnVpbGRlcih0aGlzLCBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IGRlZmF1bHRWYWx1ZTogdmFsdWUgfSkpO1xuICB9XG59O1xudmFyIFVuaXRCdWlsZGVyID0gY2xhc3MgZXh0ZW5kcyBUeXBlQnVpbGRlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKHsgdGFnOiBcIlByb2R1Y3RcIiwgdmFsdWU6IHsgZWxlbWVudHM6IFtdIH0gfSk7XG4gIH1cbn07XG52YXIgUm93QnVpbGRlciA9IGNsYXNzIGV4dGVuZHMgVHlwZUJ1aWxkZXIge1xuICByb3c7XG4gIHR5cGVOYW1lO1xuICBjb25zdHJ1Y3Rvcihyb3csIG5hbWUpIHtcbiAgICBjb25zdCBtYXBwZWRSb3cgPSBPYmplY3QuZnJvbUVudHJpZXMoXG4gICAgICBPYmplY3QuZW50cmllcyhyb3cpLm1hcCgoW2NvbE5hbWUsIGJ1aWxkZXJdKSA9PiBbXG4gICAgICAgIGNvbE5hbWUsXG4gICAgICAgIGJ1aWxkZXIgaW5zdGFuY2VvZiBDb2x1bW5CdWlsZGVyID8gYnVpbGRlciA6IG5ldyBDb2x1bW5CdWlsZGVyKGJ1aWxkZXIsIHt9KVxuICAgICAgXSlcbiAgICApO1xuICAgIGNvbnN0IGVsZW1lbnRzID0gT2JqZWN0LmtleXMobWFwcGVkUm93KS5tYXAoKG5hbWUyKSA9PiAoe1xuICAgICAgbmFtZTogbmFtZTIsXG4gICAgICBnZXQgYWxnZWJyYWljVHlwZSgpIHtcbiAgICAgICAgcmV0dXJuIG1hcHBlZFJvd1tuYW1lMl0udHlwZUJ1aWxkZXIuYWxnZWJyYWljVHlwZTtcbiAgICAgIH1cbiAgICB9KSk7XG4gICAgc3VwZXIoQWxnZWJyYWljVHlwZS5Qcm9kdWN0KHsgZWxlbWVudHMgfSkpO1xuICAgIHRoaXMucm93ID0gbWFwcGVkUm93O1xuICAgIHRoaXMudHlwZU5hbWUgPSBuYW1lO1xuICB9XG59O1xudmFyIFN1bUJ1aWxkZXJJbXBsID0gY2xhc3MgZXh0ZW5kcyBUeXBlQnVpbGRlciB7XG4gIHZhcmlhbnRzO1xuICB0eXBlTmFtZTtcbiAgY29uc3RydWN0b3IodmFyaWFudHMsIG5hbWUpIHtcbiAgICBmdW5jdGlvbiB2YXJpYW50c0FycmF5RnJvbVZhcmlhbnRzT2JqKHZhcmlhbnRzMikge1xuICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKHZhcmlhbnRzMikubWFwKChrZXkpID0+ICh7XG4gICAgICAgIG5hbWU6IGtleSxcbiAgICAgICAgLy8gTGF6aWx5IHJlc29sdmUgdGhlIHVuZGVybHlpbmcgb2JqZWN0J3MgYWxnZWJyYWljVHlwZS5cbiAgICAgICAgLy8gVGhpcyB3aWxsIGNhbGwgb2JqW2tleV0uYWxnZWJyYWljVHlwZSBvbmx5IHdoZW4gc29tZW9uZVxuICAgICAgICAvLyBhY3R1YWxseSByZWFkcyB0aGlzIHByb3BlcnR5LlxuICAgICAgICBnZXQgYWxnZWJyYWljVHlwZSgpIHtcbiAgICAgICAgICByZXR1cm4gdmFyaWFudHMyW2tleV0uYWxnZWJyYWljVHlwZTtcbiAgICAgICAgfVxuICAgICAgfSkpO1xuICAgIH1cbiAgICBzdXBlcihcbiAgICAgIEFsZ2VicmFpY1R5cGUuU3VtKHtcbiAgICAgICAgdmFyaWFudHM6IHZhcmlhbnRzQXJyYXlGcm9tVmFyaWFudHNPYmoodmFyaWFudHMpXG4gICAgICB9KVxuICAgICk7XG4gICAgdGhpcy52YXJpYW50cyA9IHZhcmlhbnRzO1xuICAgIHRoaXMudHlwZU5hbWUgPSBuYW1lO1xuICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKHZhcmlhbnRzKSkge1xuICAgICAgY29uc3QgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodmFyaWFudHMsIGtleSk7XG4gICAgICBjb25zdCBpc0FjY2Vzc29yID0gISFkZXNjICYmICh0eXBlb2YgZGVzYy5nZXQgPT09IFwiZnVuY3Rpb25cIiB8fCB0eXBlb2YgZGVzYy5zZXQgPT09IFwiZnVuY3Rpb25cIik7XG4gICAgICBsZXQgaXNVbml0MiA9IGZhbHNlO1xuICAgICAgaWYgKCFpc0FjY2Vzc29yKSB7XG4gICAgICAgIGNvbnN0IHZhcmlhbnQgPSB2YXJpYW50c1trZXldO1xuICAgICAgICBpc1VuaXQyID0gdmFyaWFudCBpbnN0YW5jZW9mIFVuaXRCdWlsZGVyO1xuICAgICAgfVxuICAgICAgaWYgKGlzVW5pdDIpIHtcbiAgICAgICAgY29uc3QgY29uc3RhbnQgPSB0aGlzLmNyZWF0ZShrZXkpO1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywga2V5LCB7XG4gICAgICAgICAgdmFsdWU6IGNvbnN0YW50LFxuICAgICAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2VcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBmbiA9ICgodmFsdWUpID0+IHRoaXMuY3JlYXRlKGtleSwgdmFsdWUpKTtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIGtleSwge1xuICAgICAgICAgIHZhbHVlOiBmbixcbiAgICAgICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBjcmVhdGUodGFnLCB2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gdm9pZCAwID8geyB0YWcgfSA6IHsgdGFnLCB2YWx1ZSB9O1xuICB9XG4gIGRlZmF1bHQodmFsdWUpIHtcbiAgICByZXR1cm4gbmV3IFN1bUNvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLFxuICAgICAgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBkZWZhdWx0VmFsdWU6IHZhbHVlIH0pXG4gICAgKTtcbiAgfVxuICBuYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gbmV3IFN1bUNvbHVtbkJ1aWxkZXIodGhpcywgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBuYW1lIH0pKTtcbiAgfVxufTtcbnZhciBTdW1CdWlsZGVyID0gU3VtQnVpbGRlckltcGw7XG52YXIgU2ltcGxlU3VtQnVpbGRlckltcGwgPSBjbGFzcyBleHRlbmRzIFN1bUJ1aWxkZXJJbXBsIHtcbiAgaW5kZXgoYWxnb3JpdGhtID0gXCJidHJlZVwiKSB7XG4gICAgcmV0dXJuIG5ldyBTaW1wbGVTdW1Db2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaW5kZXhUeXBlOiBhbGdvcml0aG0gfSlcbiAgICApO1xuICB9XG4gIHByaW1hcnlLZXkoKSB7XG4gICAgcmV0dXJuIG5ldyBTaW1wbGVTdW1Db2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaXNQcmltYXJ5S2V5OiB0cnVlIH0pXG4gICAgKTtcbiAgfVxufTtcbnZhciBTaW1wbGVTdW1CdWlsZGVyID0gU2ltcGxlU3VtQnVpbGRlckltcGw7XG52YXIgU2NoZWR1bGVBdEJ1aWxkZXIgPSBjbGFzcyBleHRlbmRzIFR5cGVCdWlsZGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoc2NoZWR1bGVfYXRfZGVmYXVsdC5nZXRBbGdlYnJhaWNUeXBlKCkpO1xuICB9XG4gIGRlZmF1bHQodmFsdWUpIHtcbiAgICByZXR1cm4gbmV3IFNjaGVkdWxlQXRDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgZGVmYXVsdFZhbHVlOiB2YWx1ZSB9KVxuICAgICk7XG4gIH1cbiAgbmFtZShuYW1lKSB7XG4gICAgcmV0dXJuIG5ldyBTY2hlZHVsZUF0Q29sdW1uQnVpbGRlcih0aGlzLCBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IG5hbWUgfSkpO1xuICB9XG59O1xudmFyIElkZW50aXR5QnVpbGRlciA9IGNsYXNzIGV4dGVuZHMgVHlwZUJ1aWxkZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihJZGVudGl0eS5nZXRBbGdlYnJhaWNUeXBlKCkpO1xuICB9XG4gIGluZGV4KGFsZ29yaXRobSA9IFwiYnRyZWVcIikge1xuICAgIHJldHVybiBuZXcgSWRlbnRpdHlDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaW5kZXhUeXBlOiBhbGdvcml0aG0gfSlcbiAgICApO1xuICB9XG4gIHVuaXF1ZSgpIHtcbiAgICByZXR1cm4gbmV3IElkZW50aXR5Q29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMsXG4gICAgICBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IGlzVW5pcXVlOiB0cnVlIH0pXG4gICAgKTtcbiAgfVxuICBwcmltYXJ5S2V5KCkge1xuICAgIHJldHVybiBuZXcgSWRlbnRpdHlDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaXNQcmltYXJ5S2V5OiB0cnVlIH0pXG4gICAgKTtcbiAgfVxuICBhdXRvSW5jKCkge1xuICAgIHJldHVybiBuZXcgSWRlbnRpdHlDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaXNBdXRvSW5jcmVtZW50OiB0cnVlIH0pXG4gICAgKTtcbiAgfVxuICBkZWZhdWx0KHZhbHVlKSB7XG4gICAgcmV0dXJuIG5ldyBJZGVudGl0eUNvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLFxuICAgICAgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBkZWZhdWx0VmFsdWU6IHZhbHVlIH0pXG4gICAgKTtcbiAgfVxuICBuYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gbmV3IElkZW50aXR5Q29sdW1uQnVpbGRlcih0aGlzLCBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IG5hbWUgfSkpO1xuICB9XG59O1xudmFyIENvbm5lY3Rpb25JZEJ1aWxkZXIgPSBjbGFzcyBleHRlbmRzIFR5cGVCdWlsZGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoQ29ubmVjdGlvbklkLmdldEFsZ2VicmFpY1R5cGUoKSk7XG4gIH1cbiAgaW5kZXgoYWxnb3JpdGhtID0gXCJidHJlZVwiKSB7XG4gICAgcmV0dXJuIG5ldyBDb25uZWN0aW9uSWRDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaW5kZXhUeXBlOiBhbGdvcml0aG0gfSlcbiAgICApO1xuICB9XG4gIHVuaXF1ZSgpIHtcbiAgICByZXR1cm4gbmV3IENvbm5lY3Rpb25JZENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLFxuICAgICAgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBpc1VuaXF1ZTogdHJ1ZSB9KVxuICAgICk7XG4gIH1cbiAgcHJpbWFyeUtleSgpIHtcbiAgICByZXR1cm4gbmV3IENvbm5lY3Rpb25JZENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLFxuICAgICAgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBpc1ByaW1hcnlLZXk6IHRydWUgfSlcbiAgICApO1xuICB9XG4gIGF1dG9JbmMoKSB7XG4gICAgcmV0dXJuIG5ldyBDb25uZWN0aW9uSWRDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaXNBdXRvSW5jcmVtZW50OiB0cnVlIH0pXG4gICAgKTtcbiAgfVxuICBkZWZhdWx0KHZhbHVlKSB7XG4gICAgcmV0dXJuIG5ldyBDb25uZWN0aW9uSWRDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgZGVmYXVsdFZhbHVlOiB2YWx1ZSB9KVxuICAgICk7XG4gIH1cbiAgbmFtZShuYW1lKSB7XG4gICAgcmV0dXJuIG5ldyBDb25uZWN0aW9uSWRDb2x1bW5CdWlsZGVyKHRoaXMsIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgbmFtZSB9KSk7XG4gIH1cbn07XG52YXIgVGltZXN0YW1wQnVpbGRlciA9IGNsYXNzIGV4dGVuZHMgVHlwZUJ1aWxkZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihUaW1lc3RhbXAuZ2V0QWxnZWJyYWljVHlwZSgpKTtcbiAgfVxuICBpbmRleChhbGdvcml0aG0gPSBcImJ0cmVlXCIpIHtcbiAgICByZXR1cm4gbmV3IFRpbWVzdGFtcENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLFxuICAgICAgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBpbmRleFR5cGU6IGFsZ29yaXRobSB9KVxuICAgICk7XG4gIH1cbiAgdW5pcXVlKCkge1xuICAgIHJldHVybiBuZXcgVGltZXN0YW1wQ29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMsXG4gICAgICBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IGlzVW5pcXVlOiB0cnVlIH0pXG4gICAgKTtcbiAgfVxuICBwcmltYXJ5S2V5KCkge1xuICAgIHJldHVybiBuZXcgVGltZXN0YW1wQ29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMsXG4gICAgICBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IGlzUHJpbWFyeUtleTogdHJ1ZSB9KVxuICAgICk7XG4gIH1cbiAgYXV0b0luYygpIHtcbiAgICByZXR1cm4gbmV3IFRpbWVzdGFtcENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLFxuICAgICAgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBpc0F1dG9JbmNyZW1lbnQ6IHRydWUgfSlcbiAgICApO1xuICB9XG4gIGRlZmF1bHQodmFsdWUpIHtcbiAgICByZXR1cm4gbmV3IFRpbWVzdGFtcENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLFxuICAgICAgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBkZWZhdWx0VmFsdWU6IHZhbHVlIH0pXG4gICAgKTtcbiAgfVxuICBuYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gbmV3IFRpbWVzdGFtcENvbHVtbkJ1aWxkZXIodGhpcywgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBuYW1lIH0pKTtcbiAgfVxufTtcbnZhciBUaW1lRHVyYXRpb25CdWlsZGVyID0gY2xhc3MgZXh0ZW5kcyBUeXBlQnVpbGRlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFRpbWVEdXJhdGlvbi5nZXRBbGdlYnJhaWNUeXBlKCkpO1xuICB9XG4gIGluZGV4KGFsZ29yaXRobSA9IFwiYnRyZWVcIikge1xuICAgIHJldHVybiBuZXcgVGltZUR1cmF0aW9uQ29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMsXG4gICAgICBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IGluZGV4VHlwZTogYWxnb3JpdGhtIH0pXG4gICAgKTtcbiAgfVxuICB1bmlxdWUoKSB7XG4gICAgcmV0dXJuIG5ldyBUaW1lRHVyYXRpb25Db2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaXNVbmlxdWU6IHRydWUgfSlcbiAgICApO1xuICB9XG4gIHByaW1hcnlLZXkoKSB7XG4gICAgcmV0dXJuIG5ldyBUaW1lRHVyYXRpb25Db2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaXNQcmltYXJ5S2V5OiB0cnVlIH0pXG4gICAgKTtcbiAgfVxuICBhdXRvSW5jKCkge1xuICAgIHJldHVybiBuZXcgVGltZUR1cmF0aW9uQ29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMsXG4gICAgICBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IGlzQXV0b0luY3JlbWVudDogdHJ1ZSB9KVxuICAgICk7XG4gIH1cbiAgZGVmYXVsdCh2YWx1ZSkge1xuICAgIHJldHVybiBuZXcgVGltZUR1cmF0aW9uQ29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMsXG4gICAgICBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IGRlZmF1bHRWYWx1ZTogdmFsdWUgfSlcbiAgICApO1xuICB9XG4gIG5hbWUobmFtZSkge1xuICAgIHJldHVybiBuZXcgVGltZUR1cmF0aW9uQ29sdW1uQnVpbGRlcih0aGlzLCBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IG5hbWUgfSkpO1xuICB9XG59O1xudmFyIFV1aWRCdWlsZGVyID0gY2xhc3MgZXh0ZW5kcyBUeXBlQnVpbGRlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFV1aWQuZ2V0QWxnZWJyYWljVHlwZSgpKTtcbiAgfVxuICBpbmRleChhbGdvcml0aG0gPSBcImJ0cmVlXCIpIHtcbiAgICByZXR1cm4gbmV3IFV1aWRDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaW5kZXhUeXBlOiBhbGdvcml0aG0gfSlcbiAgICApO1xuICB9XG4gIHVuaXF1ZSgpIHtcbiAgICByZXR1cm4gbmV3IFV1aWRDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaXNVbmlxdWU6IHRydWUgfSlcbiAgICApO1xuICB9XG4gIHByaW1hcnlLZXkoKSB7XG4gICAgcmV0dXJuIG5ldyBVdWlkQ29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMsXG4gICAgICBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IGlzUHJpbWFyeUtleTogdHJ1ZSB9KVxuICAgICk7XG4gIH1cbiAgYXV0b0luYygpIHtcbiAgICByZXR1cm4gbmV3IFV1aWRDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaXNBdXRvSW5jcmVtZW50OiB0cnVlIH0pXG4gICAgKTtcbiAgfVxuICBkZWZhdWx0KHZhbHVlKSB7XG4gICAgcmV0dXJuIG5ldyBVdWlkQ29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMsXG4gICAgICBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IGRlZmF1bHRWYWx1ZTogdmFsdWUgfSlcbiAgICApO1xuICB9XG4gIG5hbWUobmFtZSkge1xuICAgIHJldHVybiBuZXcgVXVpZENvbHVtbkJ1aWxkZXIodGhpcywgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBuYW1lIH0pKTtcbiAgfVxufTtcbnZhciBkZWZhdWx0TWV0YWRhdGEgPSB7fTtcbnZhciBDb2x1bW5CdWlsZGVyID0gY2xhc3Mge1xuICB0eXBlQnVpbGRlcjtcbiAgY29sdW1uTWV0YWRhdGE7XG4gIGNvbnN0cnVjdG9yKHR5cGVCdWlsZGVyLCBtZXRhZGF0YSkge1xuICAgIHRoaXMudHlwZUJ1aWxkZXIgPSB0eXBlQnVpbGRlcjtcbiAgICB0aGlzLmNvbHVtbk1ldGFkYXRhID0gbWV0YWRhdGE7XG4gIH1cbiAgc2VyaWFsaXplKHdyaXRlciwgdmFsdWUpIHtcbiAgICB0aGlzLnR5cGVCdWlsZGVyLnNlcmlhbGl6ZSh3cml0ZXIsIHZhbHVlKTtcbiAgfVxuICBkZXNlcmlhbGl6ZShyZWFkZXIpIHtcbiAgICByZXR1cm4gdGhpcy50eXBlQnVpbGRlci5kZXNlcmlhbGl6ZShyZWFkZXIpO1xuICB9XG59O1xudmFyIFU4Q29sdW1uQnVpbGRlciA9IGNsYXNzIF9VOENvbHVtbkJ1aWxkZXIgZXh0ZW5kcyBDb2x1bW5CdWlsZGVyIHtcbiAgaW5kZXgoYWxnb3JpdGhtID0gXCJidHJlZVwiKSB7XG4gICAgcmV0dXJuIG5ldyBfVThDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IGluZGV4VHlwZTogYWxnb3JpdGhtIH0pXG4gICAgKTtcbiAgfVxuICB1bmlxdWUoKSB7XG4gICAgcmV0dXJuIG5ldyBfVThDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IGlzVW5pcXVlOiB0cnVlIH0pXG4gICAgKTtcbiAgfVxuICBwcmltYXJ5S2V5KCkge1xuICAgIHJldHVybiBuZXcgX1U4Q29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwgeyBpc1ByaW1hcnlLZXk6IHRydWUgfSlcbiAgICApO1xuICB9XG4gIGF1dG9JbmMoKSB7XG4gICAgcmV0dXJuIG5ldyBfVThDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IGlzQXV0b0luY3JlbWVudDogdHJ1ZSB9KVxuICAgICk7XG4gIH1cbiAgZGVmYXVsdCh2YWx1ZSkge1xuICAgIHJldHVybiBuZXcgX1U4Q29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwge1xuICAgICAgICBkZWZhdWx0VmFsdWU6IHZhbHVlXG4gICAgICB9KVxuICAgICk7XG4gIH1cbiAgbmFtZShuYW1lKSB7XG4gICAgcmV0dXJuIG5ldyBfVThDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IG5hbWUgfSlcbiAgICApO1xuICB9XG59O1xudmFyIFUxNkNvbHVtbkJ1aWxkZXIgPSBjbGFzcyBfVTE2Q29sdW1uQnVpbGRlciBleHRlbmRzIENvbHVtbkJ1aWxkZXIge1xuICBpbmRleChhbGdvcml0aG0gPSBcImJ0cmVlXCIpIHtcbiAgICByZXR1cm4gbmV3IF9VMTZDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IGluZGV4VHlwZTogYWxnb3JpdGhtIH0pXG4gICAgKTtcbiAgfVxuICB1bmlxdWUoKSB7XG4gICAgcmV0dXJuIG5ldyBfVTE2Q29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwgeyBpc1VuaXF1ZTogdHJ1ZSB9KVxuICAgICk7XG4gIH1cbiAgcHJpbWFyeUtleSgpIHtcbiAgICByZXR1cm4gbmV3IF9VMTZDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IGlzUHJpbWFyeUtleTogdHJ1ZSB9KVxuICAgICk7XG4gIH1cbiAgYXV0b0luYygpIHtcbiAgICByZXR1cm4gbmV3IF9VMTZDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IGlzQXV0b0luY3JlbWVudDogdHJ1ZSB9KVxuICAgICk7XG4gIH1cbiAgZGVmYXVsdCh2YWx1ZSkge1xuICAgIHJldHVybiBuZXcgX1UxNkNvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHtcbiAgICAgICAgZGVmYXVsdFZhbHVlOiB2YWx1ZVxuICAgICAgfSlcbiAgICApO1xuICB9XG4gIG5hbWUobmFtZSkge1xuICAgIHJldHVybiBuZXcgX1UxNkNvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgbmFtZSB9KVxuICAgICk7XG4gIH1cbn07XG52YXIgVTMyQ29sdW1uQnVpbGRlciA9IGNsYXNzIF9VMzJDb2x1bW5CdWlsZGVyIGV4dGVuZHMgQ29sdW1uQnVpbGRlciB7XG4gIGluZGV4KGFsZ29yaXRobSA9IFwiYnRyZWVcIikge1xuICAgIHJldHVybiBuZXcgX1UzMkNvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgaW5kZXhUeXBlOiBhbGdvcml0aG0gfSlcbiAgICApO1xuICB9XG4gIHVuaXF1ZSgpIHtcbiAgICByZXR1cm4gbmV3IF9VMzJDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IGlzVW5pcXVlOiB0cnVlIH0pXG4gICAgKTtcbiAgfVxuICBwcmltYXJ5S2V5KCkge1xuICAgIHJldHVybiBuZXcgX1UzMkNvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgaXNQcmltYXJ5S2V5OiB0cnVlIH0pXG4gICAgKTtcbiAgfVxuICBhdXRvSW5jKCkge1xuICAgIHJldHVybiBuZXcgX1UzMkNvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgaXNBdXRvSW5jcmVtZW50OiB0cnVlIH0pXG4gICAgKTtcbiAgfVxuICBkZWZhdWx0KHZhbHVlKSB7XG4gICAgcmV0dXJuIG5ldyBfVTMyQ29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwge1xuICAgICAgICBkZWZhdWx0VmFsdWU6IHZhbHVlXG4gICAgICB9KVxuICAgICk7XG4gIH1cbiAgbmFtZShuYW1lKSB7XG4gICAgcmV0dXJuIG5ldyBfVTMyQ29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwgeyBuYW1lIH0pXG4gICAgKTtcbiAgfVxufTtcbnZhciBVNjRDb2x1bW5CdWlsZGVyID0gY2xhc3MgX1U2NENvbHVtbkJ1aWxkZXIgZXh0ZW5kcyBDb2x1bW5CdWlsZGVyIHtcbiAgaW5kZXgoYWxnb3JpdGhtID0gXCJidHJlZVwiKSB7XG4gICAgcmV0dXJuIG5ldyBfVTY0Q29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwgeyBpbmRleFR5cGU6IGFsZ29yaXRobSB9KVxuICAgICk7XG4gIH1cbiAgdW5pcXVlKCkge1xuICAgIHJldHVybiBuZXcgX1U2NENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgaXNVbmlxdWU6IHRydWUgfSlcbiAgICApO1xuICB9XG4gIHByaW1hcnlLZXkoKSB7XG4gICAgcmV0dXJuIG5ldyBfVTY0Q29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwgeyBpc1ByaW1hcnlLZXk6IHRydWUgfSlcbiAgICApO1xuICB9XG4gIGF1dG9JbmMoKSB7XG4gICAgcmV0dXJuIG5ldyBfVTY0Q29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwgeyBpc0F1dG9JbmNyZW1lbnQ6IHRydWUgfSlcbiAgICApO1xuICB9XG4gIGRlZmF1bHQodmFsdWUpIHtcbiAgICByZXR1cm4gbmV3IF9VNjRDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7XG4gICAgICAgIGRlZmF1bHRWYWx1ZTogdmFsdWVcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuICBuYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gbmV3IF9VNjRDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IG5hbWUgfSlcbiAgICApO1xuICB9XG59O1xudmFyIFUxMjhDb2x1bW5CdWlsZGVyID0gY2xhc3MgX1UxMjhDb2x1bW5CdWlsZGVyIGV4dGVuZHMgQ29sdW1uQnVpbGRlciB7XG4gIGluZGV4KGFsZ29yaXRobSA9IFwiYnRyZWVcIikge1xuICAgIHJldHVybiBuZXcgX1UxMjhDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IGluZGV4VHlwZTogYWxnb3JpdGhtIH0pXG4gICAgKTtcbiAgfVxuICB1bmlxdWUoKSB7XG4gICAgcmV0dXJuIG5ldyBfVTEyOENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgaXNVbmlxdWU6IHRydWUgfSlcbiAgICApO1xuICB9XG4gIHByaW1hcnlLZXkoKSB7XG4gICAgcmV0dXJuIG5ldyBfVTEyOENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgaXNQcmltYXJ5S2V5OiB0cnVlIH0pXG4gICAgKTtcbiAgfVxuICBhdXRvSW5jKCkge1xuICAgIHJldHVybiBuZXcgX1UxMjhDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IGlzQXV0b0luY3JlbWVudDogdHJ1ZSB9KVxuICAgICk7XG4gIH1cbiAgZGVmYXVsdCh2YWx1ZSkge1xuICAgIHJldHVybiBuZXcgX1UxMjhDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7XG4gICAgICAgIGRlZmF1bHRWYWx1ZTogdmFsdWVcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuICBuYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gbmV3IF9VMTI4Q29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwgeyBuYW1lIH0pXG4gICAgKTtcbiAgfVxufTtcbnZhciBVMjU2Q29sdW1uQnVpbGRlciA9IGNsYXNzIF9VMjU2Q29sdW1uQnVpbGRlciBleHRlbmRzIENvbHVtbkJ1aWxkZXIge1xuICBpbmRleChhbGdvcml0aG0gPSBcImJ0cmVlXCIpIHtcbiAgICByZXR1cm4gbmV3IF9VMjU2Q29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwgeyBpbmRleFR5cGU6IGFsZ29yaXRobSB9KVxuICAgICk7XG4gIH1cbiAgdW5pcXVlKCkge1xuICAgIHJldHVybiBuZXcgX1UyNTZDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IGlzVW5pcXVlOiB0cnVlIH0pXG4gICAgKTtcbiAgfVxuICBwcmltYXJ5S2V5KCkge1xuICAgIHJldHVybiBuZXcgX1UyNTZDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IGlzUHJpbWFyeUtleTogdHJ1ZSB9KVxuICAgICk7XG4gIH1cbiAgYXV0b0luYygpIHtcbiAgICByZXR1cm4gbmV3IF9VMjU2Q29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwgeyBpc0F1dG9JbmNyZW1lbnQ6IHRydWUgfSlcbiAgICApO1xuICB9XG4gIGRlZmF1bHQodmFsdWUpIHtcbiAgICByZXR1cm4gbmV3IF9VMjU2Q29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwge1xuICAgICAgICBkZWZhdWx0VmFsdWU6IHZhbHVlXG4gICAgICB9KVxuICAgICk7XG4gIH1cbiAgbmFtZShuYW1lKSB7XG4gICAgcmV0dXJuIG5ldyBfVTI1NkNvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgbmFtZSB9KVxuICAgICk7XG4gIH1cbn07XG52YXIgSThDb2x1bW5CdWlsZGVyID0gY2xhc3MgX0k4Q29sdW1uQnVpbGRlciBleHRlbmRzIENvbHVtbkJ1aWxkZXIge1xuICBpbmRleChhbGdvcml0aG0gPSBcImJ0cmVlXCIpIHtcbiAgICByZXR1cm4gbmV3IF9JOENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgaW5kZXhUeXBlOiBhbGdvcml0aG0gfSlcbiAgICApO1xuICB9XG4gIHVuaXF1ZSgpIHtcbiAgICByZXR1cm4gbmV3IF9JOENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgaXNVbmlxdWU6IHRydWUgfSlcbiAgICApO1xuICB9XG4gIHByaW1hcnlLZXkoKSB7XG4gICAgcmV0dXJuIG5ldyBfSThDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IGlzUHJpbWFyeUtleTogdHJ1ZSB9KVxuICAgICk7XG4gIH1cbiAgYXV0b0luYygpIHtcbiAgICByZXR1cm4gbmV3IF9JOENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgaXNBdXRvSW5jcmVtZW50OiB0cnVlIH0pXG4gICAgKTtcbiAgfVxuICBkZWZhdWx0KHZhbHVlKSB7XG4gICAgcmV0dXJuIG5ldyBfSThDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7XG4gICAgICAgIGRlZmF1bHRWYWx1ZTogdmFsdWVcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuICBuYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gbmV3IF9JOENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgbmFtZSB9KVxuICAgICk7XG4gIH1cbn07XG52YXIgSTE2Q29sdW1uQnVpbGRlciA9IGNsYXNzIF9JMTZDb2x1bW5CdWlsZGVyIGV4dGVuZHMgQ29sdW1uQnVpbGRlciB7XG4gIGluZGV4KGFsZ29yaXRobSA9IFwiYnRyZWVcIikge1xuICAgIHJldHVybiBuZXcgX0kxNkNvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgaW5kZXhUeXBlOiBhbGdvcml0aG0gfSlcbiAgICApO1xuICB9XG4gIHVuaXF1ZSgpIHtcbiAgICByZXR1cm4gbmV3IF9JMTZDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IGlzVW5pcXVlOiB0cnVlIH0pXG4gICAgKTtcbiAgfVxuICBwcmltYXJ5S2V5KCkge1xuICAgIHJldHVybiBuZXcgX0kxNkNvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgaXNQcmltYXJ5S2V5OiB0cnVlIH0pXG4gICAgKTtcbiAgfVxuICBhdXRvSW5jKCkge1xuICAgIHJldHVybiBuZXcgX0kxNkNvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgaXNBdXRvSW5jcmVtZW50OiB0cnVlIH0pXG4gICAgKTtcbiAgfVxuICBkZWZhdWx0KHZhbHVlKSB7XG4gICAgcmV0dXJuIG5ldyBfSTE2Q29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwge1xuICAgICAgICBkZWZhdWx0VmFsdWU6IHZhbHVlXG4gICAgICB9KVxuICAgICk7XG4gIH1cbiAgbmFtZShuYW1lKSB7XG4gICAgcmV0dXJuIG5ldyBfSTE2Q29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwgeyBuYW1lIH0pXG4gICAgKTtcbiAgfVxufTtcbnZhciBJMzJDb2x1bW5CdWlsZGVyID0gY2xhc3MgX0kzMkNvbHVtbkJ1aWxkZXIgZXh0ZW5kcyBDb2x1bW5CdWlsZGVyIHtcbiAgaW5kZXgoYWxnb3JpdGhtID0gXCJidHJlZVwiKSB7XG4gICAgcmV0dXJuIG5ldyBfSTMyQ29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwgeyBpbmRleFR5cGU6IGFsZ29yaXRobSB9KVxuICAgICk7XG4gIH1cbiAgdW5pcXVlKCkge1xuICAgIHJldHVybiBuZXcgX0kzMkNvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgaXNVbmlxdWU6IHRydWUgfSlcbiAgICApO1xuICB9XG4gIHByaW1hcnlLZXkoKSB7XG4gICAgcmV0dXJuIG5ldyBfSTMyQ29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwgeyBpc1ByaW1hcnlLZXk6IHRydWUgfSlcbiAgICApO1xuICB9XG4gIGF1dG9JbmMoKSB7XG4gICAgcmV0dXJuIG5ldyBfSTMyQ29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwgeyBpc0F1dG9JbmNyZW1lbnQ6IHRydWUgfSlcbiAgICApO1xuICB9XG4gIGRlZmF1bHQodmFsdWUpIHtcbiAgICByZXR1cm4gbmV3IF9JMzJDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7XG4gICAgICAgIGRlZmF1bHRWYWx1ZTogdmFsdWVcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuICBuYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gbmV3IF9JMzJDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IG5hbWUgfSlcbiAgICApO1xuICB9XG59O1xudmFyIEk2NENvbHVtbkJ1aWxkZXIgPSBjbGFzcyBfSTY0Q29sdW1uQnVpbGRlciBleHRlbmRzIENvbHVtbkJ1aWxkZXIge1xuICBpbmRleChhbGdvcml0aG0gPSBcImJ0cmVlXCIpIHtcbiAgICByZXR1cm4gbmV3IF9JNjRDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IGluZGV4VHlwZTogYWxnb3JpdGhtIH0pXG4gICAgKTtcbiAgfVxuICB1bmlxdWUoKSB7XG4gICAgcmV0dXJuIG5ldyBfSTY0Q29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwgeyBpc1VuaXF1ZTogdHJ1ZSB9KVxuICAgICk7XG4gIH1cbiAgcHJpbWFyeUtleSgpIHtcbiAgICByZXR1cm4gbmV3IF9JNjRDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IGlzUHJpbWFyeUtleTogdHJ1ZSB9KVxuICAgICk7XG4gIH1cbiAgYXV0b0luYygpIHtcbiAgICByZXR1cm4gbmV3IF9JNjRDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IGlzQXV0b0luY3JlbWVudDogdHJ1ZSB9KVxuICAgICk7XG4gIH1cbiAgZGVmYXVsdCh2YWx1ZSkge1xuICAgIHJldHVybiBuZXcgX0k2NENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHtcbiAgICAgICAgZGVmYXVsdFZhbHVlOiB2YWx1ZVxuICAgICAgfSlcbiAgICApO1xuICB9XG4gIG5hbWUobmFtZSkge1xuICAgIHJldHVybiBuZXcgX0k2NENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgbmFtZSB9KVxuICAgICk7XG4gIH1cbn07XG52YXIgSTEyOENvbHVtbkJ1aWxkZXIgPSBjbGFzcyBfSTEyOENvbHVtbkJ1aWxkZXIgZXh0ZW5kcyBDb2x1bW5CdWlsZGVyIHtcbiAgaW5kZXgoYWxnb3JpdGhtID0gXCJidHJlZVwiKSB7XG4gICAgcmV0dXJuIG5ldyBfSTEyOENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgaW5kZXhUeXBlOiBhbGdvcml0aG0gfSlcbiAgICApO1xuICB9XG4gIHVuaXF1ZSgpIHtcbiAgICByZXR1cm4gbmV3IF9JMTI4Q29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwgeyBpc1VuaXF1ZTogdHJ1ZSB9KVxuICAgICk7XG4gIH1cbiAgcHJpbWFyeUtleSgpIHtcbiAgICByZXR1cm4gbmV3IF9JMTI4Q29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwgeyBpc1ByaW1hcnlLZXk6IHRydWUgfSlcbiAgICApO1xuICB9XG4gIGF1dG9JbmMoKSB7XG4gICAgcmV0dXJuIG5ldyBfSTEyOENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgaXNBdXRvSW5jcmVtZW50OiB0cnVlIH0pXG4gICAgKTtcbiAgfVxuICBkZWZhdWx0KHZhbHVlKSB7XG4gICAgcmV0dXJuIG5ldyBfSTEyOENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHtcbiAgICAgICAgZGVmYXVsdFZhbHVlOiB2YWx1ZVxuICAgICAgfSlcbiAgICApO1xuICB9XG4gIG5hbWUobmFtZSkge1xuICAgIHJldHVybiBuZXcgX0kxMjhDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IG5hbWUgfSlcbiAgICApO1xuICB9XG59O1xudmFyIEkyNTZDb2x1bW5CdWlsZGVyID0gY2xhc3MgX0kyNTZDb2x1bW5CdWlsZGVyIGV4dGVuZHMgQ29sdW1uQnVpbGRlciB7XG4gIGluZGV4KGFsZ29yaXRobSA9IFwiYnRyZWVcIikge1xuICAgIHJldHVybiBuZXcgX0kyNTZDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IGluZGV4VHlwZTogYWxnb3JpdGhtIH0pXG4gICAgKTtcbiAgfVxuICB1bmlxdWUoKSB7XG4gICAgcmV0dXJuIG5ldyBfSTI1NkNvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgaXNVbmlxdWU6IHRydWUgfSlcbiAgICApO1xuICB9XG4gIHByaW1hcnlLZXkoKSB7XG4gICAgcmV0dXJuIG5ldyBfSTI1NkNvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgaXNQcmltYXJ5S2V5OiB0cnVlIH0pXG4gICAgKTtcbiAgfVxuICBhdXRvSW5jKCkge1xuICAgIHJldHVybiBuZXcgX0kyNTZDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IGlzQXV0b0luY3JlbWVudDogdHJ1ZSB9KVxuICAgICk7XG4gIH1cbiAgZGVmYXVsdCh2YWx1ZSkge1xuICAgIHJldHVybiBuZXcgX0kyNTZDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7XG4gICAgICAgIGRlZmF1bHRWYWx1ZTogdmFsdWVcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuICBuYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gbmV3IF9JMjU2Q29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwgeyBuYW1lIH0pXG4gICAgKTtcbiAgfVxufTtcbnZhciBGMzJDb2x1bW5CdWlsZGVyID0gY2xhc3MgX0YzMkNvbHVtbkJ1aWxkZXIgZXh0ZW5kcyBDb2x1bW5CdWlsZGVyIHtcbiAgZGVmYXVsdCh2YWx1ZSkge1xuICAgIHJldHVybiBuZXcgX0YzMkNvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHtcbiAgICAgICAgZGVmYXVsdFZhbHVlOiB2YWx1ZVxuICAgICAgfSlcbiAgICApO1xuICB9XG4gIG5hbWUobmFtZSkge1xuICAgIHJldHVybiBuZXcgX0YzMkNvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgbmFtZSB9KVxuICAgICk7XG4gIH1cbn07XG52YXIgRjY0Q29sdW1uQnVpbGRlciA9IGNsYXNzIF9GNjRDb2x1bW5CdWlsZGVyIGV4dGVuZHMgQ29sdW1uQnVpbGRlciB7XG4gIGRlZmF1bHQodmFsdWUpIHtcbiAgICByZXR1cm4gbmV3IF9GNjRDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7XG4gICAgICAgIGRlZmF1bHRWYWx1ZTogdmFsdWVcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuICBuYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gbmV3IF9GNjRDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IG5hbWUgfSlcbiAgICApO1xuICB9XG59O1xudmFyIEJvb2xDb2x1bW5CdWlsZGVyID0gY2xhc3MgX0Jvb2xDb2x1bW5CdWlsZGVyIGV4dGVuZHMgQ29sdW1uQnVpbGRlciB7XG4gIGluZGV4KGFsZ29yaXRobSA9IFwiYnRyZWVcIikge1xuICAgIHJldHVybiBuZXcgX0Jvb2xDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IGluZGV4VHlwZTogYWxnb3JpdGhtIH0pXG4gICAgKTtcbiAgfVxuICB1bmlxdWUoKSB7XG4gICAgcmV0dXJuIG5ldyBfQm9vbENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgaXNVbmlxdWU6IHRydWUgfSlcbiAgICApO1xuICB9XG4gIHByaW1hcnlLZXkoKSB7XG4gICAgcmV0dXJuIG5ldyBfQm9vbENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgaXNQcmltYXJ5S2V5OiB0cnVlIH0pXG4gICAgKTtcbiAgfVxuICBkZWZhdWx0KHZhbHVlKSB7XG4gICAgcmV0dXJuIG5ldyBfQm9vbENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHtcbiAgICAgICAgZGVmYXVsdFZhbHVlOiB2YWx1ZVxuICAgICAgfSlcbiAgICApO1xuICB9XG4gIG5hbWUobmFtZSkge1xuICAgIHJldHVybiBuZXcgX0Jvb2xDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IG5hbWUgfSlcbiAgICApO1xuICB9XG59O1xudmFyIFN0cmluZ0NvbHVtbkJ1aWxkZXIgPSBjbGFzcyBfU3RyaW5nQ29sdW1uQnVpbGRlciBleHRlbmRzIENvbHVtbkJ1aWxkZXIge1xuICBpbmRleChhbGdvcml0aG0gPSBcImJ0cmVlXCIpIHtcbiAgICByZXR1cm4gbmV3IF9TdHJpbmdDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IGluZGV4VHlwZTogYWxnb3JpdGhtIH0pXG4gICAgKTtcbiAgfVxuICB1bmlxdWUoKSB7XG4gICAgcmV0dXJuIG5ldyBfU3RyaW5nQ29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwgeyBpc1VuaXF1ZTogdHJ1ZSB9KVxuICAgICk7XG4gIH1cbiAgcHJpbWFyeUtleSgpIHtcbiAgICByZXR1cm4gbmV3IF9TdHJpbmdDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IGlzUHJpbWFyeUtleTogdHJ1ZSB9KVxuICAgICk7XG4gIH1cbiAgZGVmYXVsdCh2YWx1ZSkge1xuICAgIHJldHVybiBuZXcgX1N0cmluZ0NvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHtcbiAgICAgICAgZGVmYXVsdFZhbHVlOiB2YWx1ZVxuICAgICAgfSlcbiAgICApO1xuICB9XG4gIG5hbWUobmFtZSkge1xuICAgIHJldHVybiBuZXcgX1N0cmluZ0NvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgbmFtZSB9KVxuICAgICk7XG4gIH1cbn07XG52YXIgQXJyYXlDb2x1bW5CdWlsZGVyID0gY2xhc3MgX0FycmF5Q29sdW1uQnVpbGRlciBleHRlbmRzIENvbHVtbkJ1aWxkZXIge1xuICBkZWZhdWx0KHZhbHVlKSB7XG4gICAgcmV0dXJuIG5ldyBfQXJyYXlDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7XG4gICAgICAgIGRlZmF1bHRWYWx1ZTogdmFsdWVcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuICBuYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gbmV3IF9BcnJheUNvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgbmFtZSB9KVxuICAgICk7XG4gIH1cbn07XG52YXIgQnl0ZUFycmF5Q29sdW1uQnVpbGRlciA9IGNsYXNzIF9CeXRlQXJyYXlDb2x1bW5CdWlsZGVyIGV4dGVuZHMgQ29sdW1uQnVpbGRlciB7XG4gIGNvbnN0cnVjdG9yKG1ldGFkYXRhKSB7XG4gICAgc3VwZXIobmV3IFR5cGVCdWlsZGVyKEFsZ2VicmFpY1R5cGUuQXJyYXkoQWxnZWJyYWljVHlwZS5VOCkpLCBtZXRhZGF0YSk7XG4gIH1cbiAgZGVmYXVsdCh2YWx1ZSkge1xuICAgIHJldHVybiBuZXcgX0J5dGVBcnJheUNvbHVtbkJ1aWxkZXIoXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwgeyBkZWZhdWx0VmFsdWU6IHZhbHVlIH0pXG4gICAgKTtcbiAgfVxuICBuYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gbmV3IF9CeXRlQXJyYXlDb2x1bW5CdWlsZGVyKHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IG5hbWUgfSkpO1xuICB9XG59O1xudmFyIE9wdGlvbkNvbHVtbkJ1aWxkZXIgPSBjbGFzcyBfT3B0aW9uQ29sdW1uQnVpbGRlciBleHRlbmRzIENvbHVtbkJ1aWxkZXIge1xuICBkZWZhdWx0KHZhbHVlKSB7XG4gICAgcmV0dXJuIG5ldyBfT3B0aW9uQ29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwge1xuICAgICAgICBkZWZhdWx0VmFsdWU6IHZhbHVlXG4gICAgICB9KVxuICAgICk7XG4gIH1cbiAgbmFtZShuYW1lKSB7XG4gICAgcmV0dXJuIG5ldyBfT3B0aW9uQ29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwgeyBuYW1lIH0pXG4gICAgKTtcbiAgfVxufTtcbnZhciBSZXN1bHRDb2x1bW5CdWlsZGVyID0gY2xhc3MgX1Jlc3VsdENvbHVtbkJ1aWxkZXIgZXh0ZW5kcyBDb2x1bW5CdWlsZGVyIHtcbiAgY29uc3RydWN0b3IodHlwZUJ1aWxkZXIsIG1ldGFkYXRhKSB7XG4gICAgc3VwZXIodHlwZUJ1aWxkZXIsIG1ldGFkYXRhKTtcbiAgfVxuICBkZWZhdWx0KHZhbHVlKSB7XG4gICAgcmV0dXJuIG5ldyBfUmVzdWx0Q29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwge1xuICAgICAgICBkZWZhdWx0VmFsdWU6IHZhbHVlXG4gICAgICB9KVxuICAgICk7XG4gIH1cbn07XG52YXIgUHJvZHVjdENvbHVtbkJ1aWxkZXIgPSBjbGFzcyBfUHJvZHVjdENvbHVtbkJ1aWxkZXIgZXh0ZW5kcyBDb2x1bW5CdWlsZGVyIHtcbiAgZGVmYXVsdCh2YWx1ZSkge1xuICAgIHJldHVybiBuZXcgX1Byb2R1Y3RDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IGRlZmF1bHRWYWx1ZTogdmFsdWUgfSlcbiAgICApO1xuICB9XG4gIG5hbWUobmFtZSkge1xuICAgIHJldHVybiBuZXcgX1Byb2R1Y3RDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IG5hbWUgfSlcbiAgICApO1xuICB9XG59O1xudmFyIFN1bUNvbHVtbkJ1aWxkZXIgPSBjbGFzcyBfU3VtQ29sdW1uQnVpbGRlciBleHRlbmRzIENvbHVtbkJ1aWxkZXIge1xuICBkZWZhdWx0KHZhbHVlKSB7XG4gICAgcmV0dXJuIG5ldyBfU3VtQ29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwgeyBkZWZhdWx0VmFsdWU6IHZhbHVlIH0pXG4gICAgKTtcbiAgfVxuICBuYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gbmV3IF9TdW1Db2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IG5hbWUgfSlcbiAgICApO1xuICB9XG59O1xudmFyIFNpbXBsZVN1bUNvbHVtbkJ1aWxkZXIgPSBjbGFzcyBfU2ltcGxlU3VtQ29sdW1uQnVpbGRlciBleHRlbmRzIFN1bUNvbHVtbkJ1aWxkZXIge1xuICBpbmRleChhbGdvcml0aG0gPSBcImJ0cmVlXCIpIHtcbiAgICByZXR1cm4gbmV3IF9TaW1wbGVTdW1Db2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IGluZGV4VHlwZTogYWxnb3JpdGhtIH0pXG4gICAgKTtcbiAgfVxuICBwcmltYXJ5S2V5KCkge1xuICAgIHJldHVybiBuZXcgX1NpbXBsZVN1bUNvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgaXNQcmltYXJ5S2V5OiB0cnVlIH0pXG4gICAgKTtcbiAgfVxufTtcbnZhciBTY2hlZHVsZUF0Q29sdW1uQnVpbGRlciA9IGNsYXNzIF9TY2hlZHVsZUF0Q29sdW1uQnVpbGRlciBleHRlbmRzIENvbHVtbkJ1aWxkZXIge1xuICBkZWZhdWx0KHZhbHVlKSB7XG4gICAgcmV0dXJuIG5ldyBfU2NoZWR1bGVBdENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgZGVmYXVsdFZhbHVlOiB2YWx1ZSB9KVxuICAgICk7XG4gIH1cbiAgbmFtZShuYW1lKSB7XG4gICAgcmV0dXJuIG5ldyBfU2NoZWR1bGVBdENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgbmFtZSB9KVxuICAgICk7XG4gIH1cbn07XG52YXIgSWRlbnRpdHlDb2x1bW5CdWlsZGVyID0gY2xhc3MgX0lkZW50aXR5Q29sdW1uQnVpbGRlciBleHRlbmRzIENvbHVtbkJ1aWxkZXIge1xuICBpbmRleChhbGdvcml0aG0gPSBcImJ0cmVlXCIpIHtcbiAgICByZXR1cm4gbmV3IF9JZGVudGl0eUNvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgaW5kZXhUeXBlOiBhbGdvcml0aG0gfSlcbiAgICApO1xuICB9XG4gIHVuaXF1ZSgpIHtcbiAgICByZXR1cm4gbmV3IF9JZGVudGl0eUNvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgaXNVbmlxdWU6IHRydWUgfSlcbiAgICApO1xuICB9XG4gIHByaW1hcnlLZXkoKSB7XG4gICAgcmV0dXJuIG5ldyBfSWRlbnRpdHlDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IGlzUHJpbWFyeUtleTogdHJ1ZSB9KVxuICAgICk7XG4gIH1cbiAgZGVmYXVsdCh2YWx1ZSkge1xuICAgIHJldHVybiBuZXcgX0lkZW50aXR5Q29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwgeyBkZWZhdWx0VmFsdWU6IHZhbHVlIH0pXG4gICAgKTtcbiAgfVxuICBuYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gbmV3IF9JZGVudGl0eUNvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgbmFtZSB9KVxuICAgICk7XG4gIH1cbn07XG52YXIgQ29ubmVjdGlvbklkQ29sdW1uQnVpbGRlciA9IGNsYXNzIF9Db25uZWN0aW9uSWRDb2x1bW5CdWlsZGVyIGV4dGVuZHMgQ29sdW1uQnVpbGRlciB7XG4gIGluZGV4KGFsZ29yaXRobSA9IFwiYnRyZWVcIikge1xuICAgIHJldHVybiBuZXcgX0Nvbm5lY3Rpb25JZENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgaW5kZXhUeXBlOiBhbGdvcml0aG0gfSlcbiAgICApO1xuICB9XG4gIHVuaXF1ZSgpIHtcbiAgICByZXR1cm4gbmV3IF9Db25uZWN0aW9uSWRDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IGlzVW5pcXVlOiB0cnVlIH0pXG4gICAgKTtcbiAgfVxuICBwcmltYXJ5S2V5KCkge1xuICAgIHJldHVybiBuZXcgX0Nvbm5lY3Rpb25JZENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgaXNQcmltYXJ5S2V5OiB0cnVlIH0pXG4gICAgKTtcbiAgfVxuICBkZWZhdWx0KHZhbHVlKSB7XG4gICAgcmV0dXJuIG5ldyBfQ29ubmVjdGlvbklkQ29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwgeyBkZWZhdWx0VmFsdWU6IHZhbHVlIH0pXG4gICAgKTtcbiAgfVxuICBuYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gbmV3IF9Db25uZWN0aW9uSWRDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IG5hbWUgfSlcbiAgICApO1xuICB9XG59O1xudmFyIFRpbWVzdGFtcENvbHVtbkJ1aWxkZXIgPSBjbGFzcyBfVGltZXN0YW1wQ29sdW1uQnVpbGRlciBleHRlbmRzIENvbHVtbkJ1aWxkZXIge1xuICBpbmRleChhbGdvcml0aG0gPSBcImJ0cmVlXCIpIHtcbiAgICByZXR1cm4gbmV3IF9UaW1lc3RhbXBDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IGluZGV4VHlwZTogYWxnb3JpdGhtIH0pXG4gICAgKTtcbiAgfVxuICB1bmlxdWUoKSB7XG4gICAgcmV0dXJuIG5ldyBfVGltZXN0YW1wQ29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwgeyBpc1VuaXF1ZTogdHJ1ZSB9KVxuICAgICk7XG4gIH1cbiAgcHJpbWFyeUtleSgpIHtcbiAgICByZXR1cm4gbmV3IF9UaW1lc3RhbXBDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IGlzUHJpbWFyeUtleTogdHJ1ZSB9KVxuICAgICk7XG4gIH1cbiAgZGVmYXVsdCh2YWx1ZSkge1xuICAgIHJldHVybiBuZXcgX1RpbWVzdGFtcENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgZGVmYXVsdFZhbHVlOiB2YWx1ZSB9KVxuICAgICk7XG4gIH1cbiAgbmFtZShuYW1lKSB7XG4gICAgcmV0dXJuIG5ldyBfVGltZXN0YW1wQ29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwgeyBuYW1lIH0pXG4gICAgKTtcbiAgfVxufTtcbnZhciBUaW1lRHVyYXRpb25Db2x1bW5CdWlsZGVyID0gY2xhc3MgX1RpbWVEdXJhdGlvbkNvbHVtbkJ1aWxkZXIgZXh0ZW5kcyBDb2x1bW5CdWlsZGVyIHtcbiAgaW5kZXgoYWxnb3JpdGhtID0gXCJidHJlZVwiKSB7XG4gICAgcmV0dXJuIG5ldyBfVGltZUR1cmF0aW9uQ29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwgeyBpbmRleFR5cGU6IGFsZ29yaXRobSB9KVxuICAgICk7XG4gIH1cbiAgdW5pcXVlKCkge1xuICAgIHJldHVybiBuZXcgX1RpbWVEdXJhdGlvbkNvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgaXNVbmlxdWU6IHRydWUgfSlcbiAgICApO1xuICB9XG4gIHByaW1hcnlLZXkoKSB7XG4gICAgcmV0dXJuIG5ldyBfVGltZUR1cmF0aW9uQ29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwgeyBpc1ByaW1hcnlLZXk6IHRydWUgfSlcbiAgICApO1xuICB9XG4gIGRlZmF1bHQodmFsdWUpIHtcbiAgICByZXR1cm4gbmV3IF9UaW1lRHVyYXRpb25Db2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IGRlZmF1bHRWYWx1ZTogdmFsdWUgfSlcbiAgICApO1xuICB9XG4gIG5hbWUobmFtZSkge1xuICAgIHJldHVybiBuZXcgX1RpbWVEdXJhdGlvbkNvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgbmFtZSB9KVxuICAgICk7XG4gIH1cbn07XG52YXIgVXVpZENvbHVtbkJ1aWxkZXIgPSBjbGFzcyBfVXVpZENvbHVtbkJ1aWxkZXIgZXh0ZW5kcyBDb2x1bW5CdWlsZGVyIHtcbiAgaW5kZXgoYWxnb3JpdGhtID0gXCJidHJlZVwiKSB7XG4gICAgcmV0dXJuIG5ldyBfVXVpZENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgaW5kZXhUeXBlOiBhbGdvcml0aG0gfSlcbiAgICApO1xuICB9XG4gIHVuaXF1ZSgpIHtcbiAgICByZXR1cm4gbmV3IF9VdWlkQ29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwgeyBpc1VuaXF1ZTogdHJ1ZSB9KVxuICAgICk7XG4gIH1cbiAgcHJpbWFyeUtleSgpIHtcbiAgICByZXR1cm4gbmV3IF9VdWlkQ29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwgeyBpc1ByaW1hcnlLZXk6IHRydWUgfSlcbiAgICApO1xuICB9XG4gIGRlZmF1bHQodmFsdWUpIHtcbiAgICByZXR1cm4gbmV3IF9VdWlkQ29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwgeyBkZWZhdWx0VmFsdWU6IHZhbHVlIH0pXG4gICAgKTtcbiAgfVxuICBuYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gbmV3IF9VdWlkQ29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwgeyBuYW1lIH0pXG4gICAgKTtcbiAgfVxufTtcbnZhciBSZWZCdWlsZGVyID0gY2xhc3MgZXh0ZW5kcyBUeXBlQnVpbGRlciB7XG4gIHJlZjtcbiAgLyoqIFRoZSBwaGFudG9tIHR5cGUgb2YgdGhlIHBvaW50ZWUgb2YgdGhpcyByZWYuICovXG4gIF9fc3BhY2V0aW1lVHlwZTtcbiAgY29uc3RydWN0b3IocmVmKSB7XG4gICAgc3VwZXIoQWxnZWJyYWljVHlwZS5SZWYocmVmKSk7XG4gICAgdGhpcy5yZWYgPSByZWY7XG4gIH1cbn07XG52YXIgZW51bUltcGwgPSAoKG5hbWVPck9iaiwgbWF5YmVPYmopID0+IHtcbiAgbGV0IG9iaiA9IG5hbWVPck9iajtcbiAgbGV0IG5hbWUgPSB2b2lkIDA7XG4gIGlmICh0eXBlb2YgbmFtZU9yT2JqID09PSBcInN0cmluZ1wiKSB7XG4gICAgaWYgKCFtYXliZU9iaikge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICAgXCJXaGVuIHByb3ZpZGluZyBhIG5hbWUsIHlvdSBtdXN0IGFsc28gcHJvdmlkZSB0aGUgdmFyaWFudHMgb2JqZWN0IG9yIGFycmF5LlwiXG4gICAgICApO1xuICAgIH1cbiAgICBvYmogPSBtYXliZU9iajtcbiAgICBuYW1lID0gbmFtZU9yT2JqO1xuICB9XG4gIGlmIChBcnJheS5pc0FycmF5KG9iaikpIHtcbiAgICBjb25zdCBzaW1wbGVWYXJpYW50c09iaiA9IHt9O1xuICAgIGZvciAoY29uc3QgdmFyaWFudCBvZiBvYmopIHtcbiAgICAgIHNpbXBsZVZhcmlhbnRzT2JqW3ZhcmlhbnRdID0gbmV3IFVuaXRCdWlsZGVyKCk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgU2ltcGxlU3VtQnVpbGRlckltcGwoc2ltcGxlVmFyaWFudHNPYmosIG5hbWUpO1xuICB9XG4gIHJldHVybiBuZXcgU3VtQnVpbGRlcihvYmosIG5hbWUpO1xufSk7XG52YXIgdCA9IHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgYEJvb2xgIHtAbGluayBBbGdlYnJhaWNUeXBlfSB0byBiZSB1c2VkIGluIHRhYmxlIGRlZmluaXRpb25zXG4gICAqIFJlcHJlc2VudGVkIGFzIGBib29sZWFuYCBpbiBUeXBlU2NyaXB0LlxuICAgKiBAcmV0dXJucyBBIG5ldyB7QGxpbmsgQm9vbEJ1aWxkZXJ9IGluc3RhbmNlXG4gICAqL1xuICBib29sOiAoKSA9PiBuZXcgQm9vbEJ1aWxkZXIoKSxcbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgYFN0cmluZ2Age0BsaW5rIEFsZ2VicmFpY1R5cGV9IHRvIGJlIHVzZWQgaW4gdGFibGUgZGVmaW5pdGlvbnNcbiAgICogUmVwcmVzZW50ZWQgYXMgYHN0cmluZ2AgaW4gVHlwZVNjcmlwdC5cbiAgICogQHJldHVybnMgQSBuZXcge0BsaW5rIFN0cmluZ0J1aWxkZXJ9IGluc3RhbmNlXG4gICAqL1xuICBzdHJpbmc6ICgpID0+IG5ldyBTdHJpbmdCdWlsZGVyKCksXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IGBGNjRgIHtAbGluayBBbGdlYnJhaWNUeXBlfSB0byBiZSB1c2VkIGluIHRhYmxlIGRlZmluaXRpb25zXG4gICAqIFJlcHJlc2VudGVkIGFzIGBudW1iZXJgIGluIFR5cGVTY3JpcHQuXG4gICAqIEByZXR1cm5zIEEgbmV3IHtAbGluayBGNjRCdWlsZGVyfSBpbnN0YW5jZVxuICAgKi9cbiAgbnVtYmVyOiAoKSA9PiBuZXcgRjY0QnVpbGRlcigpLFxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBgSThgIHtAbGluayBBbGdlYnJhaWNUeXBlfSB0byBiZSB1c2VkIGluIHRhYmxlIGRlZmluaXRpb25zXG4gICAqIFJlcHJlc2VudGVkIGFzIGBudW1iZXJgIGluIFR5cGVTY3JpcHQuXG4gICAqIEByZXR1cm5zIEEgbmV3IHtAbGluayBJOEJ1aWxkZXJ9IGluc3RhbmNlXG4gICAqL1xuICBpODogKCkgPT4gbmV3IEk4QnVpbGRlcigpLFxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBgVThgIHtAbGluayBBbGdlYnJhaWNUeXBlfSB0byBiZSB1c2VkIGluIHRhYmxlIGRlZmluaXRpb25zXG4gICAqIFJlcHJlc2VudGVkIGFzIGBudW1iZXJgIGluIFR5cGVTY3JpcHQuXG4gICAqIEByZXR1cm5zIEEgbmV3IHtAbGluayBVOEJ1aWxkZXJ9IGluc3RhbmNlXG4gICAqL1xuICB1ODogKCkgPT4gbmV3IFU4QnVpbGRlcigpLFxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBgSTE2YCB7QGxpbmsgQWxnZWJyYWljVHlwZX0gdG8gYmUgdXNlZCBpbiB0YWJsZSBkZWZpbml0aW9uc1xuICAgKiBSZXByZXNlbnRlZCBhcyBgbnVtYmVyYCBpbiBUeXBlU2NyaXB0LlxuICAgKiBAcmV0dXJucyBBIG5ldyB7QGxpbmsgSTE2QnVpbGRlcn0gaW5zdGFuY2VcbiAgICovXG4gIGkxNjogKCkgPT4gbmV3IEkxNkJ1aWxkZXIoKSxcbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgYFUxNmAge0BsaW5rIEFsZ2VicmFpY1R5cGV9IHRvIGJlIHVzZWQgaW4gdGFibGUgZGVmaW5pdGlvbnNcbiAgICogUmVwcmVzZW50ZWQgYXMgYG51bWJlcmAgaW4gVHlwZVNjcmlwdC5cbiAgICogQHJldHVybnMgQSBuZXcge0BsaW5rIFUxNkJ1aWxkZXJ9IGluc3RhbmNlXG4gICAqL1xuICB1MTY6ICgpID0+IG5ldyBVMTZCdWlsZGVyKCksXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IGBJMzJgIHtAbGluayBBbGdlYnJhaWNUeXBlfSB0byBiZSB1c2VkIGluIHRhYmxlIGRlZmluaXRpb25zXG4gICAqIFJlcHJlc2VudGVkIGFzIGBudW1iZXJgIGluIFR5cGVTY3JpcHQuXG4gICAqIEByZXR1cm5zIEEgbmV3IHtAbGluayBJMzJCdWlsZGVyfSBpbnN0YW5jZVxuICAgKi9cbiAgaTMyOiAoKSA9PiBuZXcgSTMyQnVpbGRlcigpLFxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBgVTMyYCB7QGxpbmsgQWxnZWJyYWljVHlwZX0gdG8gYmUgdXNlZCBpbiB0YWJsZSBkZWZpbml0aW9uc1xuICAgKiBSZXByZXNlbnRlZCBhcyBgbnVtYmVyYCBpbiBUeXBlU2NyaXB0LlxuICAgKiBAcmV0dXJucyBBIG5ldyB7QGxpbmsgVTMyQnVpbGRlcn0gaW5zdGFuY2VcbiAgICovXG4gIHUzMjogKCkgPT4gbmV3IFUzMkJ1aWxkZXIoKSxcbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgYEk2NGAge0BsaW5rIEFsZ2VicmFpY1R5cGV9IHRvIGJlIHVzZWQgaW4gdGFibGUgZGVmaW5pdGlvbnNcbiAgICogUmVwcmVzZW50ZWQgYXMgYGJpZ2ludGAgaW4gVHlwZVNjcmlwdC5cbiAgICogQHJldHVybnMgQSBuZXcge0BsaW5rIEk2NEJ1aWxkZXJ9IGluc3RhbmNlXG4gICAqL1xuICBpNjQ6ICgpID0+IG5ldyBJNjRCdWlsZGVyKCksXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IGBVNjRgIHtAbGluayBBbGdlYnJhaWNUeXBlfSB0byBiZSB1c2VkIGluIHRhYmxlIGRlZmluaXRpb25zXG4gICAqIFJlcHJlc2VudGVkIGFzIGBiaWdpbnRgIGluIFR5cGVTY3JpcHQuXG4gICAqIEByZXR1cm5zIEEgbmV3IHtAbGluayBVNjRCdWlsZGVyfSBpbnN0YW5jZVxuICAgKi9cbiAgdTY0OiAoKSA9PiBuZXcgVTY0QnVpbGRlcigpLFxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBgSTEyOGAge0BsaW5rIEFsZ2VicmFpY1R5cGV9IHRvIGJlIHVzZWQgaW4gdGFibGUgZGVmaW5pdGlvbnNcbiAgICogUmVwcmVzZW50ZWQgYXMgYGJpZ2ludGAgaW4gVHlwZVNjcmlwdC5cbiAgICogQHJldHVybnMgQSBuZXcge0BsaW5rIEkxMjhCdWlsZGVyfSBpbnN0YW5jZVxuICAgKi9cbiAgaTEyODogKCkgPT4gbmV3IEkxMjhCdWlsZGVyKCksXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IGBVMTI4YCB7QGxpbmsgQWxnZWJyYWljVHlwZX0gdG8gYmUgdXNlZCBpbiB0YWJsZSBkZWZpbml0aW9uc1xuICAgKiBSZXByZXNlbnRlZCBhcyBgYmlnaW50YCBpbiBUeXBlU2NyaXB0LlxuICAgKiBAcmV0dXJucyBBIG5ldyB7QGxpbmsgVTEyOEJ1aWxkZXJ9IGluc3RhbmNlXG4gICAqL1xuICB1MTI4OiAoKSA9PiBuZXcgVTEyOEJ1aWxkZXIoKSxcbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgYEkyNTZgIHtAbGluayBBbGdlYnJhaWNUeXBlfSB0byBiZSB1c2VkIGluIHRhYmxlIGRlZmluaXRpb25zXG4gICAqIFJlcHJlc2VudGVkIGFzIGBiaWdpbnRgIGluIFR5cGVTY3JpcHQuXG4gICAqIEByZXR1cm5zIEEgbmV3IHtAbGluayBJMjU2QnVpbGRlcn0gaW5zdGFuY2VcbiAgICovXG4gIGkyNTY6ICgpID0+IG5ldyBJMjU2QnVpbGRlcigpLFxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBgVTI1NmAge0BsaW5rIEFsZ2VicmFpY1R5cGV9IHRvIGJlIHVzZWQgaW4gdGFibGUgZGVmaW5pdGlvbnNcbiAgICogUmVwcmVzZW50ZWQgYXMgYGJpZ2ludGAgaW4gVHlwZVNjcmlwdC5cbiAgICogQHJldHVybnMgQSBuZXcge0BsaW5rIFUyNTZCdWlsZGVyfSBpbnN0YW5jZVxuICAgKi9cbiAgdTI1NjogKCkgPT4gbmV3IFUyNTZCdWlsZGVyKCksXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IGBGMzJgIHtAbGluayBBbGdlYnJhaWNUeXBlfSB0byBiZSB1c2VkIGluIHRhYmxlIGRlZmluaXRpb25zXG4gICAqIFJlcHJlc2VudGVkIGFzIGBudW1iZXJgIGluIFR5cGVTY3JpcHQuXG4gICAqIEByZXR1cm5zIEEgbmV3IHtAbGluayBGMzJCdWlsZGVyfSBpbnN0YW5jZVxuICAgKi9cbiAgZjMyOiAoKSA9PiBuZXcgRjMyQnVpbGRlcigpLFxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBgRjY0YCB7QGxpbmsgQWxnZWJyYWljVHlwZX0gdG8gYmUgdXNlZCBpbiB0YWJsZSBkZWZpbml0aW9uc1xuICAgKiBSZXByZXNlbnRlZCBhcyBgbnVtYmVyYCBpbiBUeXBlU2NyaXB0LlxuICAgKiBAcmV0dXJucyBBIG5ldyB7QGxpbmsgRjY0QnVpbGRlcn0gaW5zdGFuY2VcbiAgICovXG4gIGY2NDogKCkgPT4gbmV3IEY2NEJ1aWxkZXIoKSxcbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgYFByb2R1Y3RgIHtAbGluayBBbGdlYnJhaWNUeXBlfSB0byBiZSB1c2VkIGluIHRhYmxlIGRlZmluaXRpb25zLiBQcm9kdWN0IHR5cGVzIGluIFNwYWNldGltZURCXG4gICAqIGFyZSBlc3NlbnRpYWxseSB0aGUgc2FtZSBhcyBvYmplY3RzIGluIEphdmFTY3JpcHQvVHlwZVNjcmlwdC5cbiAgICogUHJvcGVydGllcyBvZiB0aGUgb2JqZWN0IG11c3QgYWxzbyBiZSB7QGxpbmsgVHlwZUJ1aWxkZXJ9cy5cbiAgICogUmVwcmVzZW50ZWQgYXMgYW4gb2JqZWN0IHdpdGggc3BlY2lmaWMgcHJvcGVydGllcyBpbiBUeXBlU2NyaXB0LlxuICAgKlxuICAgKiBAcGFyYW0gbmFtZSAob3B0aW9uYWwpIEEgZGlzcGxheSBuYW1lIGZvciB0aGUgcHJvZHVjdCB0eXBlLiBJZiBvbWl0dGVkLCBhbiBhbm9ueW1vdXMgcHJvZHVjdCB0eXBlIGlzIGNyZWF0ZWQuXG4gICAqIEBwYXJhbSBvYmogVGhlIG9iamVjdCBkZWZpbmluZyB0aGUgcHJvcGVydGllcyBvZiB0aGUgdHlwZSwgd2hvc2UgcHJvcGVydHlcbiAgICogdmFsdWVzIG11c3QgYmUge0BsaW5rIFR5cGVCdWlsZGVyfXMuXG4gICAqIEByZXR1cm5zIEEgbmV3IHtAbGluayBQcm9kdWN0QnVpbGRlcn0gaW5zdGFuY2UuXG4gICAqL1xuICBvYmplY3Q6ICgobmFtZU9yT2JqLCBtYXliZU9iaikgPT4ge1xuICAgIGlmICh0eXBlb2YgbmFtZU9yT2JqID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBpZiAoIW1heWJlT2JqKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgICAgICAgXCJXaGVuIHByb3ZpZGluZyBhIG5hbWUsIHlvdSBtdXN0IGFsc28gcHJvdmlkZSB0aGUgb2JqZWN0LlwiXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbmV3IFByb2R1Y3RCdWlsZGVyKG1heWJlT2JqLCBuYW1lT3JPYmopO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFByb2R1Y3RCdWlsZGVyKG5hbWVPck9iaiwgdm9pZCAwKTtcbiAgfSksXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IGBSb3dgIHtAbGluayBBbGdlYnJhaWNUeXBlfSB0byBiZSB1c2VkIGluIHRhYmxlIGRlZmluaXRpb25zLiBSb3cgdHlwZXMgaW4gU3BhY2V0aW1lREJcbiAgICogYXJlIHNpbWlsYXIgdG8gYFByb2R1Y3RgIHR5cGVzLCBidXQgYXJlIHNwZWNpZmljYWxseSB1c2VkIHRvIGRlZmluZSB0aGUgc2NoZW1hIG9mIGEgdGFibGUgcm93LlxuICAgKiBQcm9wZXJ0aWVzIG9mIHRoZSBvYmplY3QgbXVzdCBhbHNvIGJlIHtAbGluayBUeXBlQnVpbGRlcn0gb3Ige0BsaW5rIENvbHVtbkJ1aWxkZXJ9cy5cbiAgICpcbiAgICogWW91IGNhbiByZXByZXNlbnQgYSBgUm93YCBhcyBlaXRoZXIgYSB7QGxpbmsgUm93T2JqfSBvciBhbiB7QGxpbmsgUm93QnVpbGRlcn0gdHlwZSB3aGVuXG4gICAqIGRlZmluaW5nIGEgdGFibGUgc2NoZW1hLlxuICAgKlxuICAgKiBUaGUge0BsaW5rIFJvd0J1aWxkZXJ9IHR5cGUgaXMgdXNlZnVsIHdoZW4geW91IHdhbnQgdG8gY3JlYXRlIGEgdHlwZSB3aGljaCBjYW4gYmUgdXNlZCBhbnl3aGVyZVxuICAgKiBhIHtAbGluayBUeXBlQnVpbGRlcn0gaXMgYWNjZXB0ZWQsIHN1Y2ggYXMgaW4gbmVzdGVkIG9iamVjdHMgb3IgYXJyYXlzLCBvciBhcyB0aGUgYXJndW1lbnRcbiAgICogdG8gYSBzY2hlZHVsZWQgZnVuY3Rpb24uXG4gICAqXG4gICAqIEBwYXJhbSBvYmogVGhlIG9iamVjdCBkZWZpbmluZyB0aGUgcHJvcGVydGllcyBvZiB0aGUgcm93LCB3aG9zZSBwcm9wZXJ0eVxuICAgKiB2YWx1ZXMgbXVzdCBiZSB7QGxpbmsgVHlwZUJ1aWxkZXJ9cyBvciB7QGxpbmsgQ29sdW1uQnVpbGRlcn1zLlxuICAgKiBAcmV0dXJucyBBIG5ldyB7QGxpbmsgUm93QnVpbGRlcn0gaW5zdGFuY2VcbiAgICovXG4gIHJvdzogKChuYW1lT3JPYmosIG1heWJlT2JqKSA9PiB7XG4gICAgY29uc3QgW29iaiwgbmFtZV0gPSB0eXBlb2YgbmFtZU9yT2JqID09PSBcInN0cmluZ1wiID8gW21heWJlT2JqLCBuYW1lT3JPYmpdIDogW25hbWVPck9iaiwgdm9pZCAwXTtcbiAgICByZXR1cm4gbmV3IFJvd0J1aWxkZXIob2JqLCBuYW1lKTtcbiAgfSksXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IGBBcnJheWAge0BsaW5rIEFsZ2VicmFpY1R5cGV9IHRvIGJlIHVzZWQgaW4gdGFibGUgZGVmaW5pdGlvbnMuXG4gICAqIFJlcHJlc2VudGVkIGFzIGFuIGFycmF5IGluIFR5cGVTY3JpcHQuXG4gICAqIEBwYXJhbSBlbGVtZW50IFRoZSBlbGVtZW50IHR5cGUgb2YgdGhlIGFycmF5LCB3aGljaCBtdXN0IGJlIGEgYFR5cGVCdWlsZGVyYC5cbiAgICogQHJldHVybnMgQSBuZXcge0BsaW5rIEFycmF5QnVpbGRlcn0gaW5zdGFuY2VcbiAgICovXG4gIGFycmF5KGUpIHtcbiAgICByZXR1cm4gbmV3IEFycmF5QnVpbGRlcihlKTtcbiAgfSxcbiAgZW51bTogZW51bUltcGwsXG4gIC8qKlxuICAgKiBUaGlzIGlzIGEgc3BlY2lhbCBoZWxwZXIgZnVuY3Rpb24gZm9yIGNvbnZlbmllbnRseSBjcmVhdGluZyBgUHJvZHVjdGAgdHlwZSBjb2x1bW5zIHdpdGggbm8gZmllbGRzLlxuICAgKlxuICAgKiBAcmV0dXJucyBBIG5ldyB7QGxpbmsgUHJvZHVjdEJ1aWxkZXJ9IGluc3RhbmNlIHdpdGggbm8gZmllbGRzLlxuICAgKi9cbiAgdW5pdCgpIHtcbiAgICByZXR1cm4gbmV3IFVuaXRCdWlsZGVyKCk7XG4gIH0sXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbGF6aWx5LWV2YWx1YXRlZCB7QGxpbmsgVHlwZUJ1aWxkZXJ9LiBUaGlzIGlzIHVzZWZ1bCBmb3IgY3JlYXRpbmdcbiAgICogcmVjdXJzaXZlIHR5cGVzLCBzdWNoIGFzIGEgdHJlZSBvciBsaW5rZWQgbGlzdC5cbiAgICogQHBhcmFtIHRodW5rIEEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGEge0BsaW5rIFR5cGVCdWlsZGVyfS5cbiAgICogQHJldHVybnMgQSBwcm94eSB7QGxpbmsgVHlwZUJ1aWxkZXJ9IHRoYXQgZXZhbHVhdGVzIHRoZSB0aHVuayBvbiBmaXJzdCBhY2Nlc3MuXG4gICAqL1xuICBsYXp5KHRodW5rKSB7XG4gICAgbGV0IGNhY2hlZCA9IG51bGw7XG4gICAgY29uc3QgZ2V0ID0gKCkgPT4gY2FjaGVkID8/PSB0aHVuaygpO1xuICAgIGNvbnN0IHByb3h5ID0gbmV3IFByb3h5KHt9LCB7XG4gICAgICBnZXQoX3QsIHByb3AsIHJlY3YpIHtcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gZ2V0KCk7XG4gICAgICAgIGNvbnN0IHZhbCA9IFJlZmxlY3QuZ2V0KHRhcmdldCwgcHJvcCwgcmVjdik7XG4gICAgICAgIHJldHVybiB0eXBlb2YgdmFsID09PSBcImZ1bmN0aW9uXCIgPyB2YWwuYmluZCh0YXJnZXQpIDogdmFsO1xuICAgICAgfSxcbiAgICAgIHNldChfdCwgcHJvcCwgdmFsdWUsIHJlY3YpIHtcbiAgICAgICAgcmV0dXJuIFJlZmxlY3Quc2V0KGdldCgpLCBwcm9wLCB2YWx1ZSwgcmVjdik7XG4gICAgICB9LFxuICAgICAgaGFzKF90LCBwcm9wKSB7XG4gICAgICAgIHJldHVybiBwcm9wIGluIGdldCgpO1xuICAgICAgfSxcbiAgICAgIG93bktleXMoKSB7XG4gICAgICAgIHJldHVybiBSZWZsZWN0Lm93bktleXMoZ2V0KCkpO1xuICAgICAgfSxcbiAgICAgIGdldE93blByb3BlcnR5RGVzY3JpcHRvcihfdCwgcHJvcCkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihnZXQoKSwgcHJvcCk7XG4gICAgICB9LFxuICAgICAgZ2V0UHJvdG90eXBlT2YoKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QuZ2V0UHJvdG90eXBlT2YoZ2V0KCkpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBwcm94eTtcbiAgfSxcbiAgLyoqXG4gICAqIFRoaXMgaXMgYSBzcGVjaWFsIGhlbHBlciBmdW5jdGlvbiBmb3IgY29udmVuaWVudGx5IGNyZWF0aW5nIHtAbGluayBTY2hlZHVsZUF0fSB0eXBlIGNvbHVtbnMuXG4gICAqIEByZXR1cm5zIEEgbmV3IENvbHVtbkJ1aWxkZXIgaW5zdGFuY2Ugd2l0aCB0aGUge0BsaW5rIFNjaGVkdWxlQXR9IHR5cGUuXG4gICAqL1xuICBzY2hlZHVsZUF0OiAoKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBTY2hlZHVsZUF0QnVpbGRlcigpO1xuICB9LFxuICAvKipcbiAgICogVGhpcyBpcyBhIGNvbnZlbmllbmNlIG1ldGhvZCBmb3IgY3JlYXRpbmcgYSBjb2x1bW4gd2l0aCB0aGUge0BsaW5rIE9wdGlvbn0gdHlwZS5cbiAgICogWW91IGNhbiBjcmVhdGUgYSBjb2x1bW4gb2YgdGhlIHNhbWUgdHlwZSBieSBjb25zdHJ1Y3RpbmcgYW4gZW51bSB3aXRoIGEgYHNvbWVgIGFuZCBgbm9uZWAgdmFyaWFudC5cbiAgICogQHBhcmFtIHZhbHVlIFRoZSB0eXBlIG9mIHRoZSB2YWx1ZSBjb250YWluZWQgaW4gdGhlIGBzb21lYCB2YXJpYW50IG9mIHRoZSBgT3B0aW9uYC5cbiAgICogQHJldHVybnMgQSBuZXcge0BsaW5rIE9wdGlvbkJ1aWxkZXJ9IGluc3RhbmNlIHdpdGggdGhlIHtAbGluayBPcHRpb259IHR5cGUuXG4gICAqL1xuICBvcHRpb24odmFsdWUpIHtcbiAgICByZXR1cm4gbmV3IE9wdGlvbkJ1aWxkZXIodmFsdWUpO1xuICB9LFxuICAvKipcbiAgICogVGhpcyBpcyBhIGNvbnZlbmllbmNlIG1ldGhvZCBmb3IgY3JlYXRpbmcgYSBjb2x1bW4gd2l0aCB0aGUge0BsaW5rIFJlc3VsdH0gdHlwZS5cbiAgICogWW91IGNhbiBjcmVhdGUgYSBjb2x1bW4gb2YgdGhlIHNhbWUgdHlwZSBieSBjb25zdHJ1Y3RpbmcgYW4gZW51bSB3aXRoIGFuIGBva2AgYW5kIGBlcnJgIHZhcmlhbnQuXG4gICAqIEBwYXJhbSBvayBUaGUgdHlwZSBvZiB0aGUgdmFsdWUgY29udGFpbmVkIGluIHRoZSBgb2tgIHZhcmlhbnQgb2YgdGhlIGBSZXN1bHRgLlxuICAgKiBAcGFyYW0gZXJyIFRoZSB0eXBlIG9mIHRoZSB2YWx1ZSBjb250YWluZWQgaW4gdGhlIGBlcnJgIHZhcmlhbnQgb2YgdGhlIGBSZXN1bHRgLlxuICAgKiBAcmV0dXJucyBBIG5ldyB7QGxpbmsgUmVzdWx0QnVpbGRlcn0gaW5zdGFuY2Ugd2l0aCB0aGUge0BsaW5rIFJlc3VsdH0gdHlwZS5cbiAgICovXG4gIHJlc3VsdChvaywgZXJyKSB7XG4gICAgcmV0dXJuIG5ldyBSZXN1bHRCdWlsZGVyKG9rLCBlcnIpO1xuICB9LFxuICAvKipcbiAgICogVGhpcyBpcyBhIGNvbnZlbmllbmNlIG1ldGhvZCBmb3IgY3JlYXRpbmcgYSBjb2x1bW4gd2l0aCB0aGUge0BsaW5rIElkZW50aXR5fSB0eXBlLlxuICAgKiBZb3UgY2FuIGNyZWF0ZSBhIGNvbHVtbiBvZiB0aGUgc2FtZSB0eXBlIGJ5IGNvbnN0cnVjdGluZyBhbiBgb2JqZWN0YCB3aXRoIGEgc2luZ2xlIGBfX2lkZW50aXR5X19gIGVsZW1lbnQuXG4gICAqIEByZXR1cm5zIEEgbmV3IHtAbGluayBUeXBlQnVpbGRlcn0gaW5zdGFuY2Ugd2l0aCB0aGUge0BsaW5rIElkZW50aXR5fSB0eXBlLlxuICAgKi9cbiAgaWRlbnRpdHk6ICgpID0+IHtcbiAgICByZXR1cm4gbmV3IElkZW50aXR5QnVpbGRlcigpO1xuICB9LFxuICAvKipcbiAgICogVGhpcyBpcyBhIGNvbnZlbmllbmNlIG1ldGhvZCBmb3IgY3JlYXRpbmcgYSBjb2x1bW4gd2l0aCB0aGUge0BsaW5rIENvbm5lY3Rpb25JZH0gdHlwZS5cbiAgICogWW91IGNhbiBjcmVhdGUgYSBjb2x1bW4gb2YgdGhlIHNhbWUgdHlwZSBieSBjb25zdHJ1Y3RpbmcgYW4gYG9iamVjdGAgd2l0aCBhIHNpbmdsZSBgX19jb25uZWN0aW9uX2lkX19gIGVsZW1lbnQuXG4gICAqIEByZXR1cm5zIEEgbmV3IHtAbGluayBUeXBlQnVpbGRlcn0gaW5zdGFuY2Ugd2l0aCB0aGUge0BsaW5rIENvbm5lY3Rpb25JZH0gdHlwZS5cbiAgICovXG4gIGNvbm5lY3Rpb25JZDogKCkgPT4ge1xuICAgIHJldHVybiBuZXcgQ29ubmVjdGlvbklkQnVpbGRlcigpO1xuICB9LFxuICAvKipcbiAgICogVGhpcyBpcyBhIGNvbnZlbmllbmNlIG1ldGhvZCBmb3IgY3JlYXRpbmcgYSBjb2x1bW4gd2l0aCB0aGUge0BsaW5rIFRpbWVzdGFtcH0gdHlwZS5cbiAgICogWW91IGNhbiBjcmVhdGUgYSBjb2x1bW4gb2YgdGhlIHNhbWUgdHlwZSBieSBjb25zdHJ1Y3RpbmcgYW4gYG9iamVjdGAgd2l0aCBhIHNpbmdsZSBgX190aW1lc3RhbXBfbWljcm9zX3NpbmNlX3VuaXhfZXBvY2hfX2AgZWxlbWVudC5cbiAgICogQHJldHVybnMgQSBuZXcge0BsaW5rIFR5cGVCdWlsZGVyfSBpbnN0YW5jZSB3aXRoIHRoZSB7QGxpbmsgVGltZXN0YW1wfSB0eXBlLlxuICAgKi9cbiAgdGltZXN0YW1wOiAoKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBUaW1lc3RhbXBCdWlsZGVyKCk7XG4gIH0sXG4gIC8qKlxuICAgKiBUaGlzIGlzIGEgY29udmVuaWVuY2UgbWV0aG9kIGZvciBjcmVhdGluZyBhIGNvbHVtbiB3aXRoIHRoZSB7QGxpbmsgVGltZUR1cmF0aW9ufSB0eXBlLlxuICAgKiBZb3UgY2FuIGNyZWF0ZSBhIGNvbHVtbiBvZiB0aGUgc2FtZSB0eXBlIGJ5IGNvbnN0cnVjdGluZyBhbiBgb2JqZWN0YCB3aXRoIGEgc2luZ2xlIGBfX3RpbWVfZHVyYXRpb25fbWljcm9zX19gIGVsZW1lbnQuXG4gICAqIEByZXR1cm5zIEEgbmV3IHtAbGluayBUeXBlQnVpbGRlcn0gaW5zdGFuY2Ugd2l0aCB0aGUge0BsaW5rIFRpbWVEdXJhdGlvbn0gdHlwZS5cbiAgICovXG4gIHRpbWVEdXJhdGlvbjogKCkgPT4ge1xuICAgIHJldHVybiBuZXcgVGltZUR1cmF0aW9uQnVpbGRlcigpO1xuICB9LFxuICAvKipcbiAgICogVGhpcyBpcyBhIGNvbnZlbmllbmNlIG1ldGhvZCBmb3IgY3JlYXRpbmcgYSBjb2x1bW4gd2l0aCB0aGUge0BsaW5rIFV1aWR9IHR5cGUuXG4gICAqIFlvdSBjYW4gY3JlYXRlIGEgY29sdW1uIG9mIHRoZSBzYW1lIHR5cGUgYnkgY29uc3RydWN0aW5nIGFuIGBvYmplY3RgIHdpdGggYSBzaW5nbGUgYF9fdXVpZF9fYCBlbGVtZW50LlxuICAgKiBAcmV0dXJucyBBIG5ldyB7QGxpbmsgVHlwZUJ1aWxkZXJ9IGluc3RhbmNlIHdpdGggdGhlIHtAbGluayBVdWlkfSB0eXBlLlxuICAgKi9cbiAgdXVpZDogKCkgPT4ge1xuICAgIHJldHVybiBuZXcgVXVpZEJ1aWxkZXIoKTtcbiAgfSxcbiAgLyoqXG4gICAqIFRoaXMgaXMgYSBjb252ZW5pZW5jZSBtZXRob2QgZm9yIGNyZWF0aW5nIGEgY29sdW1uIHdpdGggdGhlIGBCeXRlQXJyYXlgIHR5cGUuXG4gICAqIFlvdSBjYW4gY3JlYXRlIGEgY29sdW1uIG9mIHRoZSBzYW1lIHR5cGUgYnkgY29uc3RydWN0aW5nIGFuIGBhcnJheWAgb2YgYHU4YC5cbiAgICogVGhlIFR5cGVTY3JpcHQgcmVwcmVzZW50YXRpb24gaXMge0BsaW5rIFVpbnQ4QXJyYXl9LlxuICAgKiBAcmV0dXJucyBBIG5ldyB7QGxpbmsgQnl0ZUFycmF5QnVpbGRlcn0gaW5zdGFuY2Ugd2l0aCB0aGUgYEJ5dGVBcnJheWAgdHlwZS5cbiAgICovXG4gIGJ5dGVBcnJheTogKCkgPT4ge1xuICAgIHJldHVybiBuZXcgQnl0ZUFycmF5QnVpbGRlcigpO1xuICB9XG59O1xuXG4vLyBzcmMvbGliL2F1dG9nZW4vdHlwZXMudHNcbnZhciBBbGdlYnJhaWNUeXBlMiA9IHQuZW51bShcIkFsZ2VicmFpY1R5cGVcIiwge1xuICBSZWY6IHQudTMyKCksXG4gIGdldCBTdW0oKSB7XG4gICAgcmV0dXJuIFN1bVR5cGUyO1xuICB9LFxuICBnZXQgUHJvZHVjdCgpIHtcbiAgICByZXR1cm4gUHJvZHVjdFR5cGUyO1xuICB9LFxuICBnZXQgQXJyYXkoKSB7XG4gICAgcmV0dXJuIEFsZ2VicmFpY1R5cGUyO1xuICB9LFxuICBTdHJpbmc6IHQudW5pdCgpLFxuICBCb29sOiB0LnVuaXQoKSxcbiAgSTg6IHQudW5pdCgpLFxuICBVODogdC51bml0KCksXG4gIEkxNjogdC51bml0KCksXG4gIFUxNjogdC51bml0KCksXG4gIEkzMjogdC51bml0KCksXG4gIFUzMjogdC51bml0KCksXG4gIEk2NDogdC51bml0KCksXG4gIFU2NDogdC51bml0KCksXG4gIEkxMjg6IHQudW5pdCgpLFxuICBVMTI4OiB0LnVuaXQoKSxcbiAgSTI1NjogdC51bml0KCksXG4gIFUyNTY6IHQudW5pdCgpLFxuICBGMzI6IHQudW5pdCgpLFxuICBGNjQ6IHQudW5pdCgpXG59KTtcbnZhciBDYXNlQ29udmVyc2lvblBvbGljeSA9IHQuZW51bShcIkNhc2VDb252ZXJzaW9uUG9saWN5XCIsIHtcbiAgTm9uZTogdC51bml0KCksXG4gIFNuYWtlQ2FzZTogdC51bml0KClcbn0pO1xudmFyIEV4cGxpY2l0TmFtZUVudHJ5ID0gdC5lbnVtKFwiRXhwbGljaXROYW1lRW50cnlcIiwge1xuICBnZXQgVGFibGUoKSB7XG4gICAgcmV0dXJuIE5hbWVNYXBwaW5nO1xuICB9LFxuICBnZXQgRnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIE5hbWVNYXBwaW5nO1xuICB9LFxuICBnZXQgSW5kZXgoKSB7XG4gICAgcmV0dXJuIE5hbWVNYXBwaW5nO1xuICB9XG59KTtcbnZhciBFeHBsaWNpdE5hbWVzID0gdC5vYmplY3QoXCJFeHBsaWNpdE5hbWVzXCIsIHtcbiAgZ2V0IGVudHJpZXMoKSB7XG4gICAgcmV0dXJuIHQuYXJyYXkoRXhwbGljaXROYW1lRW50cnkpO1xuICB9XG59KTtcbnZhciBGdW5jdGlvblZpc2liaWxpdHkgPSB0LmVudW0oXCJGdW5jdGlvblZpc2liaWxpdHlcIiwge1xuICBQcml2YXRlOiB0LnVuaXQoKSxcbiAgQ2xpZW50Q2FsbGFibGU6IHQudW5pdCgpXG59KTtcbnZhciBIdHRwSGVhZGVyUGFpciA9IHQub2JqZWN0KFwiSHR0cEhlYWRlclBhaXJcIiwge1xuICBuYW1lOiB0LnN0cmluZygpLFxuICB2YWx1ZTogdC5ieXRlQXJyYXkoKVxufSk7XG52YXIgSHR0cEhlYWRlcnMgPSB0Lm9iamVjdChcIkh0dHBIZWFkZXJzXCIsIHtcbiAgZ2V0IGVudHJpZXMoKSB7XG4gICAgcmV0dXJuIHQuYXJyYXkoSHR0cEhlYWRlclBhaXIpO1xuICB9XG59KTtcbnZhciBIdHRwTWV0aG9kID0gdC5lbnVtKFwiSHR0cE1ldGhvZFwiLCB7XG4gIEdldDogdC51bml0KCksXG4gIEhlYWQ6IHQudW5pdCgpLFxuICBQb3N0OiB0LnVuaXQoKSxcbiAgUHV0OiB0LnVuaXQoKSxcbiAgRGVsZXRlOiB0LnVuaXQoKSxcbiAgQ29ubmVjdDogdC51bml0KCksXG4gIE9wdGlvbnM6IHQudW5pdCgpLFxuICBUcmFjZTogdC51bml0KCksXG4gIFBhdGNoOiB0LnVuaXQoKSxcbiAgRXh0ZW5zaW9uOiB0LnN0cmluZygpXG59KTtcbnZhciBIdHRwUmVxdWVzdCA9IHQub2JqZWN0KFwiSHR0cFJlcXVlc3RcIiwge1xuICBnZXQgbWV0aG9kKCkge1xuICAgIHJldHVybiBIdHRwTWV0aG9kO1xuICB9LFxuICBnZXQgaGVhZGVycygpIHtcbiAgICByZXR1cm4gSHR0cEhlYWRlcnM7XG4gIH0sXG4gIHRpbWVvdXQ6IHQub3B0aW9uKHQudGltZUR1cmF0aW9uKCkpLFxuICB1cmk6IHQuc3RyaW5nKCksXG4gIGdldCB2ZXJzaW9uKCkge1xuICAgIHJldHVybiBIdHRwVmVyc2lvbjtcbiAgfVxufSk7XG52YXIgSHR0cFJlc3BvbnNlID0gdC5vYmplY3QoXCJIdHRwUmVzcG9uc2VcIiwge1xuICBnZXQgaGVhZGVycygpIHtcbiAgICByZXR1cm4gSHR0cEhlYWRlcnM7XG4gIH0sXG4gIGdldCB2ZXJzaW9uKCkge1xuICAgIHJldHVybiBIdHRwVmVyc2lvbjtcbiAgfSxcbiAgY29kZTogdC51MTYoKVxufSk7XG52YXIgSHR0cFZlcnNpb24gPSB0LmVudW0oXCJIdHRwVmVyc2lvblwiLCB7XG4gIEh0dHAwOTogdC51bml0KCksXG4gIEh0dHAxMDogdC51bml0KCksXG4gIEh0dHAxMTogdC51bml0KCksXG4gIEh0dHAyOiB0LnVuaXQoKSxcbiAgSHR0cDM6IHQudW5pdCgpXG59KTtcbnZhciBJbmRleFR5cGUgPSB0LmVudW0oXCJJbmRleFR5cGVcIiwge1xuICBCVHJlZTogdC51bml0KCksXG4gIEhhc2g6IHQudW5pdCgpXG59KTtcbnZhciBMaWZlY3ljbGUgPSB0LmVudW0oXCJMaWZlY3ljbGVcIiwge1xuICBJbml0OiB0LnVuaXQoKSxcbiAgT25Db25uZWN0OiB0LnVuaXQoKSxcbiAgT25EaXNjb25uZWN0OiB0LnVuaXQoKVxufSk7XG52YXIgTWlzY01vZHVsZUV4cG9ydCA9IHQuZW51bShcIk1pc2NNb2R1bGVFeHBvcnRcIiwge1xuICBnZXQgVHlwZUFsaWFzKCkge1xuICAgIHJldHVybiBUeXBlQWxpYXM7XG4gIH1cbn0pO1xudmFyIE5hbWVNYXBwaW5nID0gdC5vYmplY3QoXCJOYW1lTWFwcGluZ1wiLCB7XG4gIHNvdXJjZU5hbWU6IHQuc3RyaW5nKCksXG4gIGNhbm9uaWNhbE5hbWU6IHQuc3RyaW5nKClcbn0pO1xudmFyIFByb2R1Y3RUeXBlMiA9IHQub2JqZWN0KFwiUHJvZHVjdFR5cGVcIiwge1xuICBnZXQgZWxlbWVudHMoKSB7XG4gICAgcmV0dXJuIHQuYXJyYXkoUHJvZHVjdFR5cGVFbGVtZW50KTtcbiAgfVxufSk7XG52YXIgUHJvZHVjdFR5cGVFbGVtZW50ID0gdC5vYmplY3QoXCJQcm9kdWN0VHlwZUVsZW1lbnRcIiwge1xuICBuYW1lOiB0Lm9wdGlvbih0LnN0cmluZygpKSxcbiAgZ2V0IGFsZ2VicmFpY1R5cGUoKSB7XG4gICAgcmV0dXJuIEFsZ2VicmFpY1R5cGUyO1xuICB9XG59KTtcbnZhciBSYXdDb2x1bW5EZWZWOCA9IHQub2JqZWN0KFwiUmF3Q29sdW1uRGVmVjhcIiwge1xuICBjb2xOYW1lOiB0LnN0cmluZygpLFxuICBnZXQgY29sVHlwZSgpIHtcbiAgICByZXR1cm4gQWxnZWJyYWljVHlwZTI7XG4gIH1cbn0pO1xudmFyIFJhd0NvbHVtbkRlZmF1bHRWYWx1ZVYxMCA9IHQub2JqZWN0KFwiUmF3Q29sdW1uRGVmYXVsdFZhbHVlVjEwXCIsIHtcbiAgY29sSWQ6IHQudTE2KCksXG4gIHZhbHVlOiB0LmJ5dGVBcnJheSgpXG59KTtcbnZhciBSYXdDb2x1bW5EZWZhdWx0VmFsdWVWOSA9IHQub2JqZWN0KFwiUmF3Q29sdW1uRGVmYXVsdFZhbHVlVjlcIiwge1xuICB0YWJsZTogdC5zdHJpbmcoKSxcbiAgY29sSWQ6IHQudTE2KCksXG4gIHZhbHVlOiB0LmJ5dGVBcnJheSgpXG59KTtcbnZhciBSYXdDb25zdHJhaW50RGF0YVY5ID0gdC5lbnVtKFwiUmF3Q29uc3RyYWludERhdGFWOVwiLCB7XG4gIGdldCBVbmlxdWUoKSB7XG4gICAgcmV0dXJuIFJhd1VuaXF1ZUNvbnN0cmFpbnREYXRhVjk7XG4gIH1cbn0pO1xudmFyIFJhd0NvbnN0cmFpbnREZWZWMTAgPSB0Lm9iamVjdChcIlJhd0NvbnN0cmFpbnREZWZWMTBcIiwge1xuICBzb3VyY2VOYW1lOiB0Lm9wdGlvbih0LnN0cmluZygpKSxcbiAgZ2V0IGRhdGEoKSB7XG4gICAgcmV0dXJuIFJhd0NvbnN0cmFpbnREYXRhVjk7XG4gIH1cbn0pO1xudmFyIFJhd0NvbnN0cmFpbnREZWZWOCA9IHQub2JqZWN0KFwiUmF3Q29uc3RyYWludERlZlY4XCIsIHtcbiAgY29uc3RyYWludE5hbWU6IHQuc3RyaW5nKCksXG4gIGNvbnN0cmFpbnRzOiB0LnU4KCksXG4gIGNvbHVtbnM6IHQuYXJyYXkodC51MTYoKSlcbn0pO1xudmFyIFJhd0NvbnN0cmFpbnREZWZWOSA9IHQub2JqZWN0KFwiUmF3Q29uc3RyYWludERlZlY5XCIsIHtcbiAgbmFtZTogdC5vcHRpb24odC5zdHJpbmcoKSksXG4gIGdldCBkYXRhKCkge1xuICAgIHJldHVybiBSYXdDb25zdHJhaW50RGF0YVY5O1xuICB9XG59KTtcbnZhciBSYXdJbmRleEFsZ29yaXRobSA9IHQuZW51bShcIlJhd0luZGV4QWxnb3JpdGhtXCIsIHtcbiAgQlRyZWU6IHQuYXJyYXkodC51MTYoKSksXG4gIEhhc2g6IHQuYXJyYXkodC51MTYoKSksXG4gIERpcmVjdDogdC51MTYoKVxufSk7XG52YXIgUmF3SW5kZXhEZWZWMTAgPSB0Lm9iamVjdChcIlJhd0luZGV4RGVmVjEwXCIsIHtcbiAgc291cmNlTmFtZTogdC5vcHRpb24odC5zdHJpbmcoKSksXG4gIGFjY2Vzc29yTmFtZTogdC5vcHRpb24odC5zdHJpbmcoKSksXG4gIGdldCBhbGdvcml0aG0oKSB7XG4gICAgcmV0dXJuIFJhd0luZGV4QWxnb3JpdGhtO1xuICB9XG59KTtcbnZhciBSYXdJbmRleERlZlY4ID0gdC5vYmplY3QoXCJSYXdJbmRleERlZlY4XCIsIHtcbiAgaW5kZXhOYW1lOiB0LnN0cmluZygpLFxuICBpc1VuaXF1ZTogdC5ib29sKCksXG4gIGdldCBpbmRleFR5cGUoKSB7XG4gICAgcmV0dXJuIEluZGV4VHlwZTtcbiAgfSxcbiAgY29sdW1uczogdC5hcnJheSh0LnUxNigpKVxufSk7XG52YXIgUmF3SW5kZXhEZWZWOSA9IHQub2JqZWN0KFwiUmF3SW5kZXhEZWZWOVwiLCB7XG4gIG5hbWU6IHQub3B0aW9uKHQuc3RyaW5nKCkpLFxuICBhY2Nlc3Nvck5hbWU6IHQub3B0aW9uKHQuc3RyaW5nKCkpLFxuICBnZXQgYWxnb3JpdGhtKCkge1xuICAgIHJldHVybiBSYXdJbmRleEFsZ29yaXRobTtcbiAgfVxufSk7XG52YXIgUmF3TGlmZUN5Y2xlUmVkdWNlckRlZlYxMCA9IHQub2JqZWN0KFxuICBcIlJhd0xpZmVDeWNsZVJlZHVjZXJEZWZWMTBcIixcbiAge1xuICAgIGdldCBsaWZlY3ljbGVTcGVjKCkge1xuICAgICAgcmV0dXJuIExpZmVjeWNsZTtcbiAgICB9LFxuICAgIGZ1bmN0aW9uTmFtZTogdC5zdHJpbmcoKVxuICB9XG4pO1xudmFyIFJhd01pc2NNb2R1bGVFeHBvcnRWOSA9IHQuZW51bShcIlJhd01pc2NNb2R1bGVFeHBvcnRWOVwiLCB7XG4gIGdldCBDb2x1bW5EZWZhdWx0VmFsdWUoKSB7XG4gICAgcmV0dXJuIFJhd0NvbHVtbkRlZmF1bHRWYWx1ZVY5O1xuICB9LFxuICBnZXQgUHJvY2VkdXJlKCkge1xuICAgIHJldHVybiBSYXdQcm9jZWR1cmVEZWZWOTtcbiAgfSxcbiAgZ2V0IFZpZXcoKSB7XG4gICAgcmV0dXJuIFJhd1ZpZXdEZWZWOTtcbiAgfVxufSk7XG52YXIgUmF3TW9kdWxlRGVmID0gdC5lbnVtKFwiUmF3TW9kdWxlRGVmXCIsIHtcbiAgZ2V0IFY4QmFja0NvbXBhdCgpIHtcbiAgICByZXR1cm4gUmF3TW9kdWxlRGVmVjg7XG4gIH0sXG4gIGdldCBWOSgpIHtcbiAgICByZXR1cm4gUmF3TW9kdWxlRGVmVjk7XG4gIH0sXG4gIGdldCBWMTAoKSB7XG4gICAgcmV0dXJuIFJhd01vZHVsZURlZlYxMDtcbiAgfVxufSk7XG52YXIgUmF3TW9kdWxlRGVmVjEwID0gdC5vYmplY3QoXCJSYXdNb2R1bGVEZWZWMTBcIiwge1xuICBnZXQgc2VjdGlvbnMoKSB7XG4gICAgcmV0dXJuIHQuYXJyYXkoUmF3TW9kdWxlRGVmVjEwU2VjdGlvbik7XG4gIH1cbn0pO1xudmFyIFJhd01vZHVsZURlZlYxMFNlY3Rpb24gPSB0LmVudW0oXCJSYXdNb2R1bGVEZWZWMTBTZWN0aW9uXCIsIHtcbiAgZ2V0IFR5cGVzcGFjZSgpIHtcbiAgICByZXR1cm4gVHlwZXNwYWNlO1xuICB9LFxuICBnZXQgVHlwZXMoKSB7XG4gICAgcmV0dXJuIHQuYXJyYXkoUmF3VHlwZURlZlYxMCk7XG4gIH0sXG4gIGdldCBUYWJsZXMoKSB7XG4gICAgcmV0dXJuIHQuYXJyYXkoUmF3VGFibGVEZWZWMTApO1xuICB9LFxuICBnZXQgUmVkdWNlcnMoKSB7XG4gICAgcmV0dXJuIHQuYXJyYXkoUmF3UmVkdWNlckRlZlYxMCk7XG4gIH0sXG4gIGdldCBQcm9jZWR1cmVzKCkge1xuICAgIHJldHVybiB0LmFycmF5KFJhd1Byb2NlZHVyZURlZlYxMCk7XG4gIH0sXG4gIGdldCBWaWV3cygpIHtcbiAgICByZXR1cm4gdC5hcnJheShSYXdWaWV3RGVmVjEwKTtcbiAgfSxcbiAgZ2V0IFNjaGVkdWxlcygpIHtcbiAgICByZXR1cm4gdC5hcnJheShSYXdTY2hlZHVsZURlZlYxMCk7XG4gIH0sXG4gIGdldCBMaWZlQ3ljbGVSZWR1Y2VycygpIHtcbiAgICByZXR1cm4gdC5hcnJheShSYXdMaWZlQ3ljbGVSZWR1Y2VyRGVmVjEwKTtcbiAgfSxcbiAgZ2V0IFJvd0xldmVsU2VjdXJpdHkoKSB7XG4gICAgcmV0dXJuIHQuYXJyYXkoUmF3Um93TGV2ZWxTZWN1cml0eURlZlY5KTtcbiAgfSxcbiAgZ2V0IENhc2VDb252ZXJzaW9uUG9saWN5KCkge1xuICAgIHJldHVybiBDYXNlQ29udmVyc2lvblBvbGljeTtcbiAgfSxcbiAgZ2V0IEV4cGxpY2l0TmFtZXMoKSB7XG4gICAgcmV0dXJuIEV4cGxpY2l0TmFtZXM7XG4gIH1cbn0pO1xudmFyIFJhd01vZHVsZURlZlY4ID0gdC5vYmplY3QoXCJSYXdNb2R1bGVEZWZWOFwiLCB7XG4gIGdldCB0eXBlc3BhY2UoKSB7XG4gICAgcmV0dXJuIFR5cGVzcGFjZTtcbiAgfSxcbiAgZ2V0IHRhYmxlcygpIHtcbiAgICByZXR1cm4gdC5hcnJheShUYWJsZURlc2MpO1xuICB9LFxuICBnZXQgcmVkdWNlcnMoKSB7XG4gICAgcmV0dXJuIHQuYXJyYXkoUmVkdWNlckRlZik7XG4gIH0sXG4gIGdldCBtaXNjRXhwb3J0cygpIHtcbiAgICByZXR1cm4gdC5hcnJheShNaXNjTW9kdWxlRXhwb3J0KTtcbiAgfVxufSk7XG52YXIgUmF3TW9kdWxlRGVmVjkgPSB0Lm9iamVjdChcIlJhd01vZHVsZURlZlY5XCIsIHtcbiAgZ2V0IHR5cGVzcGFjZSgpIHtcbiAgICByZXR1cm4gVHlwZXNwYWNlO1xuICB9LFxuICBnZXQgdGFibGVzKCkge1xuICAgIHJldHVybiB0LmFycmF5KFJhd1RhYmxlRGVmVjkpO1xuICB9LFxuICBnZXQgcmVkdWNlcnMoKSB7XG4gICAgcmV0dXJuIHQuYXJyYXkoUmF3UmVkdWNlckRlZlY5KTtcbiAgfSxcbiAgZ2V0IHR5cGVzKCkge1xuICAgIHJldHVybiB0LmFycmF5KFJhd1R5cGVEZWZWOSk7XG4gIH0sXG4gIGdldCBtaXNjRXhwb3J0cygpIHtcbiAgICByZXR1cm4gdC5hcnJheShSYXdNaXNjTW9kdWxlRXhwb3J0VjkpO1xuICB9LFxuICBnZXQgcm93TGV2ZWxTZWN1cml0eSgpIHtcbiAgICByZXR1cm4gdC5hcnJheShSYXdSb3dMZXZlbFNlY3VyaXR5RGVmVjkpO1xuICB9XG59KTtcbnZhciBSYXdQcm9jZWR1cmVEZWZWMTAgPSB0Lm9iamVjdChcIlJhd1Byb2NlZHVyZURlZlYxMFwiLCB7XG4gIHNvdXJjZU5hbWU6IHQuc3RyaW5nKCksXG4gIGdldCBwYXJhbXMoKSB7XG4gICAgcmV0dXJuIFByb2R1Y3RUeXBlMjtcbiAgfSxcbiAgZ2V0IHJldHVyblR5cGUoKSB7XG4gICAgcmV0dXJuIEFsZ2VicmFpY1R5cGUyO1xuICB9LFxuICBnZXQgdmlzaWJpbGl0eSgpIHtcbiAgICByZXR1cm4gRnVuY3Rpb25WaXNpYmlsaXR5O1xuICB9XG59KTtcbnZhciBSYXdQcm9jZWR1cmVEZWZWOSA9IHQub2JqZWN0KFwiUmF3UHJvY2VkdXJlRGVmVjlcIiwge1xuICBuYW1lOiB0LnN0cmluZygpLFxuICBnZXQgcGFyYW1zKCkge1xuICAgIHJldHVybiBQcm9kdWN0VHlwZTI7XG4gIH0sXG4gIGdldCByZXR1cm5UeXBlKCkge1xuICAgIHJldHVybiBBbGdlYnJhaWNUeXBlMjtcbiAgfVxufSk7XG52YXIgUmF3UmVkdWNlckRlZlYxMCA9IHQub2JqZWN0KFwiUmF3UmVkdWNlckRlZlYxMFwiLCB7XG4gIHNvdXJjZU5hbWU6IHQuc3RyaW5nKCksXG4gIGdldCBwYXJhbXMoKSB7XG4gICAgcmV0dXJuIFByb2R1Y3RUeXBlMjtcbiAgfSxcbiAgZ2V0IHZpc2liaWxpdHkoKSB7XG4gICAgcmV0dXJuIEZ1bmN0aW9uVmlzaWJpbGl0eTtcbiAgfSxcbiAgZ2V0IG9rUmV0dXJuVHlwZSgpIHtcbiAgICByZXR1cm4gQWxnZWJyYWljVHlwZTI7XG4gIH0sXG4gIGdldCBlcnJSZXR1cm5UeXBlKCkge1xuICAgIHJldHVybiBBbGdlYnJhaWNUeXBlMjtcbiAgfVxufSk7XG52YXIgUmF3UmVkdWNlckRlZlY5ID0gdC5vYmplY3QoXCJSYXdSZWR1Y2VyRGVmVjlcIiwge1xuICBuYW1lOiB0LnN0cmluZygpLFxuICBnZXQgcGFyYW1zKCkge1xuICAgIHJldHVybiBQcm9kdWN0VHlwZTI7XG4gIH0sXG4gIGdldCBsaWZlY3ljbGUoKSB7XG4gICAgcmV0dXJuIHQub3B0aW9uKExpZmVjeWNsZSk7XG4gIH1cbn0pO1xudmFyIFJhd1Jvd0xldmVsU2VjdXJpdHlEZWZWOSA9IHQub2JqZWN0KFwiUmF3Um93TGV2ZWxTZWN1cml0eURlZlY5XCIsIHtcbiAgc3FsOiB0LnN0cmluZygpXG59KTtcbnZhciBSYXdTY2hlZHVsZURlZlYxMCA9IHQub2JqZWN0KFwiUmF3U2NoZWR1bGVEZWZWMTBcIiwge1xuICBzb3VyY2VOYW1lOiB0Lm9wdGlvbih0LnN0cmluZygpKSxcbiAgdGFibGVOYW1lOiB0LnN0cmluZygpLFxuICBzY2hlZHVsZUF0Q29sOiB0LnUxNigpLFxuICBmdW5jdGlvbk5hbWU6IHQuc3RyaW5nKClcbn0pO1xudmFyIFJhd1NjaGVkdWxlRGVmVjkgPSB0Lm9iamVjdChcIlJhd1NjaGVkdWxlRGVmVjlcIiwge1xuICBuYW1lOiB0Lm9wdGlvbih0LnN0cmluZygpKSxcbiAgcmVkdWNlck5hbWU6IHQuc3RyaW5nKCksXG4gIHNjaGVkdWxlZEF0Q29sdW1uOiB0LnUxNigpXG59KTtcbnZhciBSYXdTY29wZWRUeXBlTmFtZVYxMCA9IHQub2JqZWN0KFwiUmF3U2NvcGVkVHlwZU5hbWVWMTBcIiwge1xuICBzY29wZTogdC5hcnJheSh0LnN0cmluZygpKSxcbiAgc291cmNlTmFtZTogdC5zdHJpbmcoKVxufSk7XG52YXIgUmF3U2NvcGVkVHlwZU5hbWVWOSA9IHQub2JqZWN0KFwiUmF3U2NvcGVkVHlwZU5hbWVWOVwiLCB7XG4gIHNjb3BlOiB0LmFycmF5KHQuc3RyaW5nKCkpLFxuICBuYW1lOiB0LnN0cmluZygpXG59KTtcbnZhciBSYXdTZXF1ZW5jZURlZlYxMCA9IHQub2JqZWN0KFwiUmF3U2VxdWVuY2VEZWZWMTBcIiwge1xuICBzb3VyY2VOYW1lOiB0Lm9wdGlvbih0LnN0cmluZygpKSxcbiAgY29sdW1uOiB0LnUxNigpLFxuICBzdGFydDogdC5vcHRpb24odC5pMTI4KCkpLFxuICBtaW5WYWx1ZTogdC5vcHRpb24odC5pMTI4KCkpLFxuICBtYXhWYWx1ZTogdC5vcHRpb24odC5pMTI4KCkpLFxuICBpbmNyZW1lbnQ6IHQuaTEyOCgpXG59KTtcbnZhciBSYXdTZXF1ZW5jZURlZlY4ID0gdC5vYmplY3QoXCJSYXdTZXF1ZW5jZURlZlY4XCIsIHtcbiAgc2VxdWVuY2VOYW1lOiB0LnN0cmluZygpLFxuICBjb2xQb3M6IHQudTE2KCksXG4gIGluY3JlbWVudDogdC5pMTI4KCksXG4gIHN0YXJ0OiB0Lm9wdGlvbih0LmkxMjgoKSksXG4gIG1pblZhbHVlOiB0Lm9wdGlvbih0LmkxMjgoKSksXG4gIG1heFZhbHVlOiB0Lm9wdGlvbih0LmkxMjgoKSksXG4gIGFsbG9jYXRlZDogdC5pMTI4KClcbn0pO1xudmFyIFJhd1NlcXVlbmNlRGVmVjkgPSB0Lm9iamVjdChcIlJhd1NlcXVlbmNlRGVmVjlcIiwge1xuICBuYW1lOiB0Lm9wdGlvbih0LnN0cmluZygpKSxcbiAgY29sdW1uOiB0LnUxNigpLFxuICBzdGFydDogdC5vcHRpb24odC5pMTI4KCkpLFxuICBtaW5WYWx1ZTogdC5vcHRpb24odC5pMTI4KCkpLFxuICBtYXhWYWx1ZTogdC5vcHRpb24odC5pMTI4KCkpLFxuICBpbmNyZW1lbnQ6IHQuaTEyOCgpXG59KTtcbnZhciBSYXdUYWJsZURlZlYxMCA9IHQub2JqZWN0KFwiUmF3VGFibGVEZWZWMTBcIiwge1xuICBzb3VyY2VOYW1lOiB0LnN0cmluZygpLFxuICBwcm9kdWN0VHlwZVJlZjogdC51MzIoKSxcbiAgcHJpbWFyeUtleTogdC5hcnJheSh0LnUxNigpKSxcbiAgZ2V0IGluZGV4ZXMoKSB7XG4gICAgcmV0dXJuIHQuYXJyYXkoUmF3SW5kZXhEZWZWMTApO1xuICB9LFxuICBnZXQgY29uc3RyYWludHMoKSB7XG4gICAgcmV0dXJuIHQuYXJyYXkoUmF3Q29uc3RyYWludERlZlYxMCk7XG4gIH0sXG4gIGdldCBzZXF1ZW5jZXMoKSB7XG4gICAgcmV0dXJuIHQuYXJyYXkoUmF3U2VxdWVuY2VEZWZWMTApO1xuICB9LFxuICBnZXQgdGFibGVUeXBlKCkge1xuICAgIHJldHVybiBUYWJsZVR5cGU7XG4gIH0sXG4gIGdldCB0YWJsZUFjY2VzcygpIHtcbiAgICByZXR1cm4gVGFibGVBY2Nlc3M7XG4gIH0sXG4gIGdldCBkZWZhdWx0VmFsdWVzKCkge1xuICAgIHJldHVybiB0LmFycmF5KFJhd0NvbHVtbkRlZmF1bHRWYWx1ZVYxMCk7XG4gIH0sXG4gIGlzRXZlbnQ6IHQuYm9vbCgpXG59KTtcbnZhciBSYXdUYWJsZURlZlY4ID0gdC5vYmplY3QoXCJSYXdUYWJsZURlZlY4XCIsIHtcbiAgdGFibGVOYW1lOiB0LnN0cmluZygpLFxuICBnZXQgY29sdW1ucygpIHtcbiAgICByZXR1cm4gdC5hcnJheShSYXdDb2x1bW5EZWZWOCk7XG4gIH0sXG4gIGdldCBpbmRleGVzKCkge1xuICAgIHJldHVybiB0LmFycmF5KFJhd0luZGV4RGVmVjgpO1xuICB9LFxuICBnZXQgY29uc3RyYWludHMoKSB7XG4gICAgcmV0dXJuIHQuYXJyYXkoUmF3Q29uc3RyYWludERlZlY4KTtcbiAgfSxcbiAgZ2V0IHNlcXVlbmNlcygpIHtcbiAgICByZXR1cm4gdC5hcnJheShSYXdTZXF1ZW5jZURlZlY4KTtcbiAgfSxcbiAgdGFibGVUeXBlOiB0LnN0cmluZygpLFxuICB0YWJsZUFjY2VzczogdC5zdHJpbmcoKSxcbiAgc2NoZWR1bGVkOiB0Lm9wdGlvbih0LnN0cmluZygpKVxufSk7XG52YXIgUmF3VGFibGVEZWZWOSA9IHQub2JqZWN0KFwiUmF3VGFibGVEZWZWOVwiLCB7XG4gIG5hbWU6IHQuc3RyaW5nKCksXG4gIHByb2R1Y3RUeXBlUmVmOiB0LnUzMigpLFxuICBwcmltYXJ5S2V5OiB0LmFycmF5KHQudTE2KCkpLFxuICBnZXQgaW5kZXhlcygpIHtcbiAgICByZXR1cm4gdC5hcnJheShSYXdJbmRleERlZlY5KTtcbiAgfSxcbiAgZ2V0IGNvbnN0cmFpbnRzKCkge1xuICAgIHJldHVybiB0LmFycmF5KFJhd0NvbnN0cmFpbnREZWZWOSk7XG4gIH0sXG4gIGdldCBzZXF1ZW5jZXMoKSB7XG4gICAgcmV0dXJuIHQuYXJyYXkoUmF3U2VxdWVuY2VEZWZWOSk7XG4gIH0sXG4gIGdldCBzY2hlZHVsZSgpIHtcbiAgICByZXR1cm4gdC5vcHRpb24oUmF3U2NoZWR1bGVEZWZWOSk7XG4gIH0sXG4gIGdldCB0YWJsZVR5cGUoKSB7XG4gICAgcmV0dXJuIFRhYmxlVHlwZTtcbiAgfSxcbiAgZ2V0IHRhYmxlQWNjZXNzKCkge1xuICAgIHJldHVybiBUYWJsZUFjY2VzcztcbiAgfVxufSk7XG52YXIgUmF3VHlwZURlZlYxMCA9IHQub2JqZWN0KFwiUmF3VHlwZURlZlYxMFwiLCB7XG4gIGdldCBzb3VyY2VOYW1lKCkge1xuICAgIHJldHVybiBSYXdTY29wZWRUeXBlTmFtZVYxMDtcbiAgfSxcbiAgdHk6IHQudTMyKCksXG4gIGN1c3RvbU9yZGVyaW5nOiB0LmJvb2woKVxufSk7XG52YXIgUmF3VHlwZURlZlY5ID0gdC5vYmplY3QoXCJSYXdUeXBlRGVmVjlcIiwge1xuICBnZXQgbmFtZSgpIHtcbiAgICByZXR1cm4gUmF3U2NvcGVkVHlwZU5hbWVWOTtcbiAgfSxcbiAgdHk6IHQudTMyKCksXG4gIGN1c3RvbU9yZGVyaW5nOiB0LmJvb2woKVxufSk7XG52YXIgUmF3VW5pcXVlQ29uc3RyYWludERhdGFWOSA9IHQub2JqZWN0KFxuICBcIlJhd1VuaXF1ZUNvbnN0cmFpbnREYXRhVjlcIixcbiAge1xuICAgIGNvbHVtbnM6IHQuYXJyYXkodC51MTYoKSlcbiAgfVxuKTtcbnZhciBSYXdWaWV3RGVmVjEwID0gdC5vYmplY3QoXCJSYXdWaWV3RGVmVjEwXCIsIHtcbiAgc291cmNlTmFtZTogdC5zdHJpbmcoKSxcbiAgaW5kZXg6IHQudTMyKCksXG4gIGlzUHVibGljOiB0LmJvb2woKSxcbiAgaXNBbm9ueW1vdXM6IHQuYm9vbCgpLFxuICBnZXQgcGFyYW1zKCkge1xuICAgIHJldHVybiBQcm9kdWN0VHlwZTI7XG4gIH0sXG4gIGdldCByZXR1cm5UeXBlKCkge1xuICAgIHJldHVybiBBbGdlYnJhaWNUeXBlMjtcbiAgfVxufSk7XG52YXIgUmF3Vmlld0RlZlY5ID0gdC5vYmplY3QoXCJSYXdWaWV3RGVmVjlcIiwge1xuICBuYW1lOiB0LnN0cmluZygpLFxuICBpbmRleDogdC51MzIoKSxcbiAgaXNQdWJsaWM6IHQuYm9vbCgpLFxuICBpc0Fub255bW91czogdC5ib29sKCksXG4gIGdldCBwYXJhbXMoKSB7XG4gICAgcmV0dXJuIFByb2R1Y3RUeXBlMjtcbiAgfSxcbiAgZ2V0IHJldHVyblR5cGUoKSB7XG4gICAgcmV0dXJuIEFsZ2VicmFpY1R5cGUyO1xuICB9XG59KTtcbnZhciBSZWR1Y2VyRGVmID0gdC5vYmplY3QoXCJSZWR1Y2VyRGVmXCIsIHtcbiAgbmFtZTogdC5zdHJpbmcoKSxcbiAgZ2V0IGFyZ3MoKSB7XG4gICAgcmV0dXJuIHQuYXJyYXkoUHJvZHVjdFR5cGVFbGVtZW50KTtcbiAgfVxufSk7XG52YXIgU3VtVHlwZTIgPSB0Lm9iamVjdChcIlN1bVR5cGVcIiwge1xuICBnZXQgdmFyaWFudHMoKSB7XG4gICAgcmV0dXJuIHQuYXJyYXkoU3VtVHlwZVZhcmlhbnQpO1xuICB9XG59KTtcbnZhciBTdW1UeXBlVmFyaWFudCA9IHQub2JqZWN0KFwiU3VtVHlwZVZhcmlhbnRcIiwge1xuICBuYW1lOiB0Lm9wdGlvbih0LnN0cmluZygpKSxcbiAgZ2V0IGFsZ2VicmFpY1R5cGUoKSB7XG4gICAgcmV0dXJuIEFsZ2VicmFpY1R5cGUyO1xuICB9XG59KTtcbnZhciBUYWJsZUFjY2VzcyA9IHQuZW51bShcIlRhYmxlQWNjZXNzXCIsIHtcbiAgUHVibGljOiB0LnVuaXQoKSxcbiAgUHJpdmF0ZTogdC51bml0KClcbn0pO1xudmFyIFRhYmxlRGVzYyA9IHQub2JqZWN0KFwiVGFibGVEZXNjXCIsIHtcbiAgZ2V0IHNjaGVtYSgpIHtcbiAgICByZXR1cm4gUmF3VGFibGVEZWZWODtcbiAgfSxcbiAgZGF0YTogdC51MzIoKVxufSk7XG52YXIgVGFibGVUeXBlID0gdC5lbnVtKFwiVGFibGVUeXBlXCIsIHtcbiAgU3lzdGVtOiB0LnVuaXQoKSxcbiAgVXNlcjogdC51bml0KClcbn0pO1xudmFyIFR5cGVBbGlhcyA9IHQub2JqZWN0KFwiVHlwZUFsaWFzXCIsIHtcbiAgbmFtZTogdC5zdHJpbmcoKSxcbiAgdHk6IHQudTMyKClcbn0pO1xudmFyIFR5cGVzcGFjZSA9IHQub2JqZWN0KFwiVHlwZXNwYWNlXCIsIHtcbiAgZ2V0IHR5cGVzKCkge1xuICAgIHJldHVybiB0LmFycmF5KEFsZ2VicmFpY1R5cGUyKTtcbiAgfVxufSk7XG52YXIgVmlld1Jlc3VsdEhlYWRlciA9IHQuZW51bShcIlZpZXdSZXN1bHRIZWFkZXJcIiwge1xuICBSb3dEYXRhOiB0LnVuaXQoKSxcbiAgUmF3U3FsOiB0LnN0cmluZygpXG59KTtcblxuLy8gc3JjL2xpYi9zY2hlbWEudHNcbmZ1bmN0aW9uIHRhYmxlVG9TY2hlbWEoYWNjTmFtZSwgc2NoZW1hMiwgdGFibGVEZWYpIHtcbiAgY29uc3QgZ2V0Q29sTmFtZSA9IChpKSA9PiBzY2hlbWEyLnJvd1R5cGUuYWxnZWJyYWljVHlwZS52YWx1ZS5lbGVtZW50c1tpXS5uYW1lO1xuICByZXR1cm4ge1xuICAgIC8vIEZvciBjbGllbnQsYHNjaGFtYS50YWJsZU5hbWVgIHdpbGwgYWx3YXlzIGJlIHRoZXJlIGFzIGNhbm9uaWNhbCBuYW1lLlxuICAgIC8vIEZvciBtb2R1bGUsIGlmIGV4cGxpY2l0IG5hbWUgaXMgbm90IHByb3ZpZGVkIHZpYSBgbmFtZWAsIGFjY2Vzc29yIG5hbWUgd2lsbFxuICAgIC8vIGJlIHVzZWQsIGl0IGlzIHN0b3JlZCBhcyBhbGlhcyBpbiBkYXRhYmFzZSwgaGVuY2Ugd29ya3MgaW4gcXVlcnkgYnVpbGRlci5cbiAgICBzb3VyY2VOYW1lOiBzY2hlbWEyLnRhYmxlTmFtZSB8fCBhY2NOYW1lLFxuICAgIGFjY2Vzc29yTmFtZTogYWNjTmFtZSxcbiAgICBjb2x1bW5zOiBzY2hlbWEyLnJvd1R5cGUucm93LFxuICAgIC8vIHR5cGVkIGFzIFRbaV1bJ3Jvd1R5cGUnXVsncm93J10gdW5kZXIgVGFibGVzVG9TY2hlbWE8VD5cbiAgICByb3dUeXBlOiBzY2hlbWEyLnJvd1NwYWNldGltZVR5cGUsXG4gICAgY29uc3RyYWludHM6IHRhYmxlRGVmLmNvbnN0cmFpbnRzLm1hcCgoYykgPT4gKHtcbiAgICAgIG5hbWU6IGMuc291cmNlTmFtZSxcbiAgICAgIGNvbnN0cmFpbnQ6IFwidW5pcXVlXCIsXG4gICAgICBjb2x1bW5zOiBjLmRhdGEudmFsdWUuY29sdW1ucy5tYXAoZ2V0Q29sTmFtZSlcbiAgICB9KSksXG4gICAgLy8gVE9ETzogaG9ycmlibGUgaG9ycmlibGUgaG9ycmlibGUuIHdlIHNtdWdnbGUgdGhpcyBgQXJyYXk8VW50eXBlZEluZGV4PmBcbiAgICAvLyBieSBjYXN0aW5nIGl0IHRvIGFuIGBBcnJheTxJbmRleE9wdHM+YCBhcyBgVGFibGVUb1NjaGVtYWAgZXhwZWN0cy5cbiAgICAvLyBUaGlzIGlzIHRoZW4gdXNlZCBpbiBgVGFibGVDYWNoZUltcGwuY29uc3RydWN0b3JgIGFuZCB3aG8ga25vd3Mgd2hlcmUgZWxzZS5cbiAgICAvLyBXZSBzaG91bGQgc3RvcCBseWluZyBhYm91dCBvdXIgdHlwZXMuXG4gICAgaW5kZXhlczogdGFibGVEZWYuaW5kZXhlcy5tYXAoKGlkeCkgPT4ge1xuICAgICAgY29uc3QgY29sdW1uSWRzID0gaWR4LmFsZ29yaXRobS50YWcgPT09IFwiRGlyZWN0XCIgPyBbaWR4LmFsZ29yaXRobS52YWx1ZV0gOiBpZHguYWxnb3JpdGhtLnZhbHVlO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbmFtZTogaWR4LmFjY2Vzc29yTmFtZSxcbiAgICAgICAgdW5pcXVlOiB0YWJsZURlZi5jb25zdHJhaW50cy5zb21lKFxuICAgICAgICAgIChjKSA9PiBjLmRhdGEudmFsdWUuY29sdW1ucy5ldmVyeSgoY29sKSA9PiBjb2x1bW5JZHMuaW5jbHVkZXMoY29sKSlcbiAgICAgICAgKSxcbiAgICAgICAgYWxnb3JpdGhtOiBpZHguYWxnb3JpdGhtLnRhZy50b0xvd2VyQ2FzZSgpLFxuICAgICAgICBjb2x1bW5zOiBjb2x1bW5JZHMubWFwKGdldENvbE5hbWUpXG4gICAgICB9O1xuICAgIH0pLFxuICAgIHRhYmxlRGVmLFxuICAgIC4uLnRhYmxlRGVmLmlzRXZlbnQgPyB7IGlzRXZlbnQ6IHRydWUgfSA6IHt9XG4gIH07XG59XG52YXIgTW9kdWxlQ29udGV4dCA9IGNsYXNzIHtcbiAgI2NvbXBvdW5kVHlwZXMgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xuICAvKipcbiAgICogVGhlIGdsb2JhbCBtb2R1bGUgZGVmaW5pdGlvbiB0aGF0IGdldHMgcG9wdWxhdGVkIGJ5IGNhbGxzIHRvIGByZWR1Y2VyKClgIGFuZCBsaWZlY3ljbGUgaG9va3MuXG4gICAqL1xuICAjbW9kdWxlRGVmID0ge1xuICAgIHR5cGVzcGFjZTogeyB0eXBlczogW10gfSxcbiAgICB0YWJsZXM6IFtdLFxuICAgIHJlZHVjZXJzOiBbXSxcbiAgICB0eXBlczogW10sXG4gICAgcm93TGV2ZWxTZWN1cml0eTogW10sXG4gICAgc2NoZWR1bGVzOiBbXSxcbiAgICBwcm9jZWR1cmVzOiBbXSxcbiAgICB2aWV3czogW10sXG4gICAgbGlmZUN5Y2xlUmVkdWNlcnM6IFtdLFxuICAgIGNhc2VDb252ZXJzaW9uUG9saWN5OiB7IHRhZzogXCJTbmFrZUNhc2VcIiB9LFxuICAgIGV4cGxpY2l0TmFtZXM6IHtcbiAgICAgIGVudHJpZXM6IFtdXG4gICAgfVxuICB9O1xuICBnZXQgbW9kdWxlRGVmKCkge1xuICAgIHJldHVybiB0aGlzLiNtb2R1bGVEZWY7XG4gIH1cbiAgcmF3TW9kdWxlRGVmVjEwKCkge1xuICAgIGNvbnN0IHNlY3Rpb25zID0gW107XG4gICAgY29uc3QgcHVzaCA9IChzKSA9PiB7XG4gICAgICBpZiAocykgc2VjdGlvbnMucHVzaChzKTtcbiAgICB9O1xuICAgIGNvbnN0IG1vZHVsZSA9IHRoaXMuI21vZHVsZURlZjtcbiAgICBwdXNoKG1vZHVsZS50eXBlc3BhY2UgJiYgeyB0YWc6IFwiVHlwZXNwYWNlXCIsIHZhbHVlOiBtb2R1bGUudHlwZXNwYWNlIH0pO1xuICAgIHB1c2gobW9kdWxlLnR5cGVzICYmIHsgdGFnOiBcIlR5cGVzXCIsIHZhbHVlOiBtb2R1bGUudHlwZXMgfSk7XG4gICAgcHVzaChtb2R1bGUudGFibGVzICYmIHsgdGFnOiBcIlRhYmxlc1wiLCB2YWx1ZTogbW9kdWxlLnRhYmxlcyB9KTtcbiAgICBwdXNoKG1vZHVsZS5yZWR1Y2VycyAmJiB7IHRhZzogXCJSZWR1Y2Vyc1wiLCB2YWx1ZTogbW9kdWxlLnJlZHVjZXJzIH0pO1xuICAgIHB1c2gobW9kdWxlLnByb2NlZHVyZXMgJiYgeyB0YWc6IFwiUHJvY2VkdXJlc1wiLCB2YWx1ZTogbW9kdWxlLnByb2NlZHVyZXMgfSk7XG4gICAgcHVzaChtb2R1bGUudmlld3MgJiYgeyB0YWc6IFwiVmlld3NcIiwgdmFsdWU6IG1vZHVsZS52aWV3cyB9KTtcbiAgICBwdXNoKG1vZHVsZS5zY2hlZHVsZXMgJiYgeyB0YWc6IFwiU2NoZWR1bGVzXCIsIHZhbHVlOiBtb2R1bGUuc2NoZWR1bGVzIH0pO1xuICAgIHB1c2goXG4gICAgICBtb2R1bGUubGlmZUN5Y2xlUmVkdWNlcnMgJiYge1xuICAgICAgICB0YWc6IFwiTGlmZUN5Y2xlUmVkdWNlcnNcIixcbiAgICAgICAgdmFsdWU6IG1vZHVsZS5saWZlQ3ljbGVSZWR1Y2Vyc1xuICAgICAgfVxuICAgICk7XG4gICAgcHVzaChcbiAgICAgIG1vZHVsZS5yb3dMZXZlbFNlY3VyaXR5ICYmIHtcbiAgICAgICAgdGFnOiBcIlJvd0xldmVsU2VjdXJpdHlcIixcbiAgICAgICAgdmFsdWU6IG1vZHVsZS5yb3dMZXZlbFNlY3VyaXR5XG4gICAgICB9XG4gICAgKTtcbiAgICBwdXNoKFxuICAgICAgbW9kdWxlLmV4cGxpY2l0TmFtZXMgJiYge1xuICAgICAgICB0YWc6IFwiRXhwbGljaXROYW1lc1wiLFxuICAgICAgICB2YWx1ZTogbW9kdWxlLmV4cGxpY2l0TmFtZXNcbiAgICAgIH1cbiAgICApO1xuICAgIHB1c2goXG4gICAgICBtb2R1bGUuY2FzZUNvbnZlcnNpb25Qb2xpY3kgJiYge1xuICAgICAgICB0YWc6IFwiQ2FzZUNvbnZlcnNpb25Qb2xpY3lcIixcbiAgICAgICAgdmFsdWU6IG1vZHVsZS5jYXNlQ29udmVyc2lvblBvbGljeVxuICAgICAgfVxuICAgICk7XG4gICAgcmV0dXJuIHsgc2VjdGlvbnMgfTtcbiAgfVxuICAvKipcbiAgICogU2V0IHRoZSBjYXNlIGNvbnZlcnNpb24gcG9saWN5IGZvciB0aGlzIG1vZHVsZS5cbiAgICogQ2FsbGVkIGJ5IHRoZSBzZXR0aW5ncyBtZWNoYW5pc20uXG4gICAqL1xuICBzZXRDYXNlQ29udmVyc2lvblBvbGljeShwb2xpY3kpIHtcbiAgICB0aGlzLiNtb2R1bGVEZWYuY2FzZUNvbnZlcnNpb25Qb2xpY3kgPSBwb2xpY3k7XG4gIH1cbiAgZ2V0IHR5cGVzcGFjZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jbW9kdWxlRGVmLnR5cGVzcGFjZTtcbiAgfVxuICAvKipcbiAgICogUmVzb2x2ZXMgdGhlIGFjdHVhbCB0eXBlIG9mIGEgVHlwZUJ1aWxkZXIgYnkgZm9sbG93aW5nIGl0cyByZWZlcmVuY2VzIHVudGlsIGl0IHJlYWNoZXMgYSBub24tcmVmIHR5cGUuXG4gICAqIEBwYXJhbSB0eXBlc3BhY2UgVGhlIHR5cGVzcGFjZSB0byByZXNvbHZlIHR5cGVzIGFnYWluc3QuXG4gICAqIEBwYXJhbSB0eXBlQnVpbGRlciBUaGUgVHlwZUJ1aWxkZXIgdG8gcmVzb2x2ZS5cbiAgICogQHJldHVybnMgVGhlIHJlc29sdmVkIGFsZ2VicmFpYyB0eXBlLlxuICAgKi9cbiAgcmVzb2x2ZVR5cGUodHlwZUJ1aWxkZXIpIHtcbiAgICBsZXQgdHkgPSB0eXBlQnVpbGRlci5hbGdlYnJhaWNUeXBlO1xuICAgIHdoaWxlICh0eS50YWcgPT09IFwiUmVmXCIpIHtcbiAgICAgIHR5ID0gdGhpcy50eXBlc3BhY2UudHlwZXNbdHkudmFsdWVdO1xuICAgIH1cbiAgICByZXR1cm4gdHk7XG4gIH1cbiAgLyoqXG4gICAqIEFkZHMgYSB0eXBlIHRvIHRoZSBtb2R1bGUgZGVmaW5pdGlvbidzIHR5cGVzcGFjZSBhcyBhIGBSZWZgIGlmIGl0IGlzIGEgbmFtZWQgY29tcG91bmQgdHlwZSAoUHJvZHVjdCBvciBTdW0pLlxuICAgKiBPdGhlcndpc2UsIHJldHVybnMgdGhlIHR5cGUgYXMgaXMuXG4gICAqIEBwYXJhbSBuYW1lXG4gICAqIEBwYXJhbSB0eVxuICAgKiBAcmV0dXJuc1xuICAgKi9cbiAgcmVnaXN0ZXJUeXBlc1JlY3Vyc2l2ZWx5KHR5cGVCdWlsZGVyKSB7XG4gICAgaWYgKHR5cGVCdWlsZGVyIGluc3RhbmNlb2YgUHJvZHVjdEJ1aWxkZXIgJiYgIWlzVW5pdCh0eXBlQnVpbGRlcikgfHwgdHlwZUJ1aWxkZXIgaW5zdGFuY2VvZiBTdW1CdWlsZGVyIHx8IHR5cGVCdWlsZGVyIGluc3RhbmNlb2YgUm93QnVpbGRlcikge1xuICAgICAgcmV0dXJuIHRoaXMuI3JlZ2lzdGVyQ29tcG91bmRUeXBlUmVjdXJzaXZlbHkodHlwZUJ1aWxkZXIpO1xuICAgIH0gZWxzZSBpZiAodHlwZUJ1aWxkZXIgaW5zdGFuY2VvZiBPcHRpb25CdWlsZGVyKSB7XG4gICAgICByZXR1cm4gbmV3IE9wdGlvbkJ1aWxkZXIoXG4gICAgICAgIHRoaXMucmVnaXN0ZXJUeXBlc1JlY3Vyc2l2ZWx5KHR5cGVCdWlsZGVyLnZhbHVlKVxuICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVCdWlsZGVyIGluc3RhbmNlb2YgUmVzdWx0QnVpbGRlcikge1xuICAgICAgcmV0dXJuIG5ldyBSZXN1bHRCdWlsZGVyKFxuICAgICAgICB0aGlzLnJlZ2lzdGVyVHlwZXNSZWN1cnNpdmVseSh0eXBlQnVpbGRlci5vayksXG4gICAgICAgIHRoaXMucmVnaXN0ZXJUeXBlc1JlY3Vyc2l2ZWx5KHR5cGVCdWlsZGVyLmVycilcbiAgICAgICk7XG4gICAgfSBlbHNlIGlmICh0eXBlQnVpbGRlciBpbnN0YW5jZW9mIEFycmF5QnVpbGRlcikge1xuICAgICAgcmV0dXJuIG5ldyBBcnJheUJ1aWxkZXIoXG4gICAgICAgIHRoaXMucmVnaXN0ZXJUeXBlc1JlY3Vyc2l2ZWx5KHR5cGVCdWlsZGVyLmVsZW1lbnQpXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdHlwZUJ1aWxkZXI7XG4gICAgfVxuICB9XG4gICNyZWdpc3RlckNvbXBvdW5kVHlwZVJlY3Vyc2l2ZWx5KHR5cGVCdWlsZGVyKSB7XG4gICAgY29uc3QgdHkgPSB0eXBlQnVpbGRlci5hbGdlYnJhaWNUeXBlO1xuICAgIGNvbnN0IG5hbWUgPSB0eXBlQnVpbGRlci50eXBlTmFtZTtcbiAgICBpZiAobmFtZSA9PT0gdm9pZCAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBNaXNzaW5nIHR5cGUgbmFtZSBmb3IgJHt0eXBlQnVpbGRlci5jb25zdHJ1Y3Rvci5uYW1lID8/IFwiVHlwZUJ1aWxkZXJcIn0gJHtKU09OLnN0cmluZ2lmeSh0eXBlQnVpbGRlcil9YFxuICAgICAgKTtcbiAgICB9XG4gICAgbGV0IHIgPSB0aGlzLiNjb21wb3VuZFR5cGVzLmdldCh0eSk7XG4gICAgaWYgKHIgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHI7XG4gICAgfVxuICAgIGNvbnN0IG5ld1R5ID0gdHlwZUJ1aWxkZXIgaW5zdGFuY2VvZiBSb3dCdWlsZGVyIHx8IHR5cGVCdWlsZGVyIGluc3RhbmNlb2YgUHJvZHVjdEJ1aWxkZXIgPyB7XG4gICAgICB0YWc6IFwiUHJvZHVjdFwiLFxuICAgICAgdmFsdWU6IHsgZWxlbWVudHM6IFtdIH1cbiAgICB9IDoge1xuICAgICAgdGFnOiBcIlN1bVwiLFxuICAgICAgdmFsdWU6IHsgdmFyaWFudHM6IFtdIH1cbiAgICB9O1xuICAgIHIgPSBuZXcgUmVmQnVpbGRlcih0aGlzLiNtb2R1bGVEZWYudHlwZXNwYWNlLnR5cGVzLmxlbmd0aCk7XG4gICAgdGhpcy4jbW9kdWxlRGVmLnR5cGVzcGFjZS50eXBlcy5wdXNoKG5ld1R5KTtcbiAgICB0aGlzLiNjb21wb3VuZFR5cGVzLnNldCh0eSwgcik7XG4gICAgaWYgKHR5cGVCdWlsZGVyIGluc3RhbmNlb2YgUm93QnVpbGRlcikge1xuICAgICAgZm9yIChjb25zdCBbbmFtZTIsIGVsZW1dIG9mIE9iamVjdC5lbnRyaWVzKHR5cGVCdWlsZGVyLnJvdykpIHtcbiAgICAgICAgbmV3VHkudmFsdWUuZWxlbWVudHMucHVzaCh7XG4gICAgICAgICAgbmFtZTogbmFtZTIsXG4gICAgICAgICAgYWxnZWJyYWljVHlwZTogdGhpcy5yZWdpc3RlclR5cGVzUmVjdXJzaXZlbHkoZWxlbS50eXBlQnVpbGRlcikuYWxnZWJyYWljVHlwZVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHR5cGVCdWlsZGVyIGluc3RhbmNlb2YgUHJvZHVjdEJ1aWxkZXIpIHtcbiAgICAgIGZvciAoY29uc3QgW25hbWUyLCBlbGVtXSBvZiBPYmplY3QuZW50cmllcyh0eXBlQnVpbGRlci5lbGVtZW50cykpIHtcbiAgICAgICAgbmV3VHkudmFsdWUuZWxlbWVudHMucHVzaCh7XG4gICAgICAgICAgbmFtZTogbmFtZTIsXG4gICAgICAgICAgYWxnZWJyYWljVHlwZTogdGhpcy5yZWdpc3RlclR5cGVzUmVjdXJzaXZlbHkoZWxlbSkuYWxnZWJyYWljVHlwZVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHR5cGVCdWlsZGVyIGluc3RhbmNlb2YgU3VtQnVpbGRlcikge1xuICAgICAgZm9yIChjb25zdCBbbmFtZTIsIHZhcmlhbnRdIG9mIE9iamVjdC5lbnRyaWVzKHR5cGVCdWlsZGVyLnZhcmlhbnRzKSkge1xuICAgICAgICBuZXdUeS52YWx1ZS52YXJpYW50cy5wdXNoKHtcbiAgICAgICAgICBuYW1lOiBuYW1lMixcbiAgICAgICAgICBhbGdlYnJhaWNUeXBlOiB0aGlzLnJlZ2lzdGVyVHlwZXNSZWN1cnNpdmVseSh2YXJpYW50KS5hbGdlYnJhaWNUeXBlXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLiNtb2R1bGVEZWYudHlwZXMucHVzaCh7XG4gICAgICBzb3VyY2VOYW1lOiBzcGxpdE5hbWUobmFtZSksXG4gICAgICB0eTogci5yZWYsXG4gICAgICBjdXN0b21PcmRlcmluZzogdHJ1ZVxuICAgIH0pO1xuICAgIHJldHVybiByO1xuICB9XG59O1xuZnVuY3Rpb24gaXNVbml0KHR5cGVCdWlsZGVyKSB7XG4gIHJldHVybiB0eXBlQnVpbGRlci50eXBlTmFtZSA9PSBudWxsICYmIHR5cGVCdWlsZGVyLmFsZ2VicmFpY1R5cGUudmFsdWUuZWxlbWVudHMubGVuZ3RoID09PSAwO1xufVxuZnVuY3Rpb24gc3BsaXROYW1lKG5hbWUpIHtcbiAgY29uc3Qgc2NvcGUgPSBuYW1lLnNwbGl0KFwiLlwiKTtcbiAgcmV0dXJuIHsgc291cmNlTmFtZTogc2NvcGUucG9wKCksIHNjb3BlIH07XG59XG5cbi8vIHNyYy9zZXJ2ZXIvaHR0cF9pbnRlcm5hbC50c1xudmFyIGltcG9ydF9zdGF0dXNlcyA9IF9fdG9FU00ocmVxdWlyZV9zdGF0dXNlcygpKTtcblxuLy8gc3JjL3NlcnZlci9yYW5nZS50c1xudmFyIFJhbmdlID0gY2xhc3Mge1xuICAjZnJvbTtcbiAgI3RvO1xuICBjb25zdHJ1Y3Rvcihmcm9tLCB0bykge1xuICAgIHRoaXMuI2Zyb20gPSBmcm9tID8/IHsgdGFnOiBcInVuYm91bmRlZFwiIH07XG4gICAgdGhpcy4jdG8gPSB0byA/PyB7IHRhZzogXCJ1bmJvdW5kZWRcIiB9O1xuICB9XG4gIGdldCBmcm9tKCkge1xuICAgIHJldHVybiB0aGlzLiNmcm9tO1xuICB9XG4gIGdldCB0bygpIHtcbiAgICByZXR1cm4gdGhpcy4jdG87XG4gIH1cbn07XG5cbi8vIHNyYy9saWIvdGFibGUudHNcbmZ1bmN0aW9uIHRhYmxlKG9wdHMsIHJvdywgLi4uXykge1xuICBjb25zdCB7XG4gICAgbmFtZSxcbiAgICBwdWJsaWM6IGlzUHVibGljID0gZmFsc2UsXG4gICAgaW5kZXhlczogdXNlckluZGV4ZXMgPSBbXSxcbiAgICBzY2hlZHVsZWQsXG4gICAgZXZlbnQ6IGlzRXZlbnQgPSBmYWxzZVxuICB9ID0gb3B0cztcbiAgY29uc3QgY29sSWRzID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcbiAgY29uc3QgY29sTmFtZUxpc3QgPSBbXTtcbiAgaWYgKCEocm93IGluc3RhbmNlb2YgUm93QnVpbGRlcikpIHtcbiAgICByb3cgPSBuZXcgUm93QnVpbGRlcihyb3cpO1xuICB9XG4gIHJvdy5hbGdlYnJhaWNUeXBlLnZhbHVlLmVsZW1lbnRzLmZvckVhY2goKGVsZW0sIGkpID0+IHtcbiAgICBjb2xJZHMuc2V0KGVsZW0ubmFtZSwgaSk7XG4gICAgY29sTmFtZUxpc3QucHVzaChlbGVtLm5hbWUpO1xuICB9KTtcbiAgY29uc3QgcGsgPSBbXTtcbiAgY29uc3QgaW5kZXhlcyA9IFtdO1xuICBjb25zdCBjb25zdHJhaW50cyA9IFtdO1xuICBjb25zdCBzZXF1ZW5jZXMgPSBbXTtcbiAgbGV0IHNjaGVkdWxlQXRDb2w7XG4gIGNvbnN0IGRlZmF1bHRWYWx1ZXMgPSBbXTtcbiAgZm9yIChjb25zdCBbbmFtZTIsIGJ1aWxkZXJdIG9mIE9iamVjdC5lbnRyaWVzKHJvdy5yb3cpKSB7XG4gICAgY29uc3QgbWV0YSA9IGJ1aWxkZXIuY29sdW1uTWV0YWRhdGE7XG4gICAgaWYgKG1ldGEuaXNQcmltYXJ5S2V5KSB7XG4gICAgICBway5wdXNoKGNvbElkcy5nZXQobmFtZTIpKTtcbiAgICB9XG4gICAgY29uc3QgaXNVbmlxdWUgPSBtZXRhLmlzVW5pcXVlIHx8IG1ldGEuaXNQcmltYXJ5S2V5O1xuICAgIGlmIChtZXRhLmluZGV4VHlwZSB8fCBpc1VuaXF1ZSkge1xuICAgICAgY29uc3QgYWxnbyA9IG1ldGEuaW5kZXhUeXBlID8/IFwiYnRyZWVcIjtcbiAgICAgIGNvbnN0IGlkID0gY29sSWRzLmdldChuYW1lMik7XG4gICAgICBsZXQgYWxnb3JpdGhtO1xuICAgICAgc3dpdGNoIChhbGdvKSB7XG4gICAgICAgIGNhc2UgXCJidHJlZVwiOlxuICAgICAgICAgIGFsZ29yaXRobSA9IFJhd0luZGV4QWxnb3JpdGhtLkJUcmVlKFtpZF0pO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiaGFzaFwiOlxuICAgICAgICAgIGFsZ29yaXRobSA9IFJhd0luZGV4QWxnb3JpdGhtLkhhc2goW2lkXSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJkaXJlY3RcIjpcbiAgICAgICAgICBhbGdvcml0aG0gPSBSYXdJbmRleEFsZ29yaXRobS5EaXJlY3QoaWQpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgaW5kZXhlcy5wdXNoKHtcbiAgICAgICAgc291cmNlTmFtZTogdm9pZCAwLFxuICAgICAgICAvLyBVbm5hbWVkIGluZGV4ZXMgd2lsbCBiZSBhc3NpZ25lZCBhIGdsb2JhbGx5IHVuaXF1ZSBuYW1lXG4gICAgICAgIGFjY2Vzc29yTmFtZTogbmFtZTIsXG4gICAgICAgIGFsZ29yaXRobVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChpc1VuaXF1ZSkge1xuICAgICAgY29uc3RyYWludHMucHVzaCh7XG4gICAgICAgIHNvdXJjZU5hbWU6IHZvaWQgMCxcbiAgICAgICAgZGF0YTogeyB0YWc6IFwiVW5pcXVlXCIsIHZhbHVlOiB7IGNvbHVtbnM6IFtjb2xJZHMuZ2V0KG5hbWUyKV0gfSB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKG1ldGEuaXNBdXRvSW5jcmVtZW50KSB7XG4gICAgICBzZXF1ZW5jZXMucHVzaCh7XG4gICAgICAgIHNvdXJjZU5hbWU6IHZvaWQgMCxcbiAgICAgICAgc3RhcnQ6IHZvaWQgMCxcbiAgICAgICAgbWluVmFsdWU6IHZvaWQgMCxcbiAgICAgICAgbWF4VmFsdWU6IHZvaWQgMCxcbiAgICAgICAgY29sdW1uOiBjb2xJZHMuZ2V0KG5hbWUyKSxcbiAgICAgICAgaW5jcmVtZW50OiAxblxuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChtZXRhLmRlZmF1bHRWYWx1ZSkge1xuICAgICAgY29uc3Qgd3JpdGVyID0gbmV3IEJpbmFyeVdyaXRlcigxNik7XG4gICAgICBidWlsZGVyLnNlcmlhbGl6ZSh3cml0ZXIsIG1ldGEuZGVmYXVsdFZhbHVlKTtcbiAgICAgIGRlZmF1bHRWYWx1ZXMucHVzaCh7XG4gICAgICAgIGNvbElkOiBjb2xJZHMuZ2V0KG5hbWUyKSxcbiAgICAgICAgdmFsdWU6IHdyaXRlci5nZXRCdWZmZXIoKVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChzY2hlZHVsZWQpIHtcbiAgICAgIGNvbnN0IGFsZ2VicmFpY1R5cGUgPSBidWlsZGVyLnR5cGVCdWlsZGVyLmFsZ2VicmFpY1R5cGU7XG4gICAgICBpZiAoc2NoZWR1bGVfYXRfZGVmYXVsdC5pc1NjaGVkdWxlQXQoYWxnZWJyYWljVHlwZSkpIHtcbiAgICAgICAgc2NoZWR1bGVBdENvbCA9IGNvbElkcy5nZXQobmFtZTIpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBmb3IgKGNvbnN0IGluZGV4T3B0cyBvZiB1c2VySW5kZXhlcyA/PyBbXSkge1xuICAgIGxldCBhbGdvcml0aG07XG4gICAgc3dpdGNoIChpbmRleE9wdHMuYWxnb3JpdGhtKSB7XG4gICAgICBjYXNlIFwiYnRyZWVcIjpcbiAgICAgICAgYWxnb3JpdGhtID0ge1xuICAgICAgICAgIHRhZzogXCJCVHJlZVwiLFxuICAgICAgICAgIHZhbHVlOiBpbmRleE9wdHMuY29sdW1ucy5tYXAoKGMpID0+IGNvbElkcy5nZXQoYykpXG4gICAgICAgIH07XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImhhc2hcIjpcbiAgICAgICAgYWxnb3JpdGhtID0ge1xuICAgICAgICAgIHRhZzogXCJIYXNoXCIsXG4gICAgICAgICAgdmFsdWU6IGluZGV4T3B0cy5jb2x1bW5zLm1hcCgoYykgPT4gY29sSWRzLmdldChjKSlcbiAgICAgICAgfTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiZGlyZWN0XCI6XG4gICAgICAgIGFsZ29yaXRobSA9IHsgdGFnOiBcIkRpcmVjdFwiLCB2YWx1ZTogY29sSWRzLmdldChpbmRleE9wdHMuY29sdW1uKSB9O1xuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgaW5kZXhlcy5wdXNoKHtcbiAgICAgIHNvdXJjZU5hbWU6IHZvaWQgMCxcbiAgICAgIGFjY2Vzc29yTmFtZTogaW5kZXhPcHRzLmFjY2Vzc29yLFxuICAgICAgYWxnb3JpdGhtLFxuICAgICAgY2Fub25pY2FsTmFtZTogaW5kZXhPcHRzLm5hbWVcbiAgICB9KTtcbiAgfVxuICBmb3IgKGNvbnN0IGNvbnN0cmFpbnRPcHRzIG9mIG9wdHMuY29uc3RyYWludHMgPz8gW10pIHtcbiAgICBpZiAoY29uc3RyYWludE9wdHMuY29uc3RyYWludCA9PT0gXCJ1bmlxdWVcIikge1xuICAgICAgY29uc3QgZGF0YSA9IHtcbiAgICAgICAgdGFnOiBcIlVuaXF1ZVwiLFxuICAgICAgICB2YWx1ZTogeyBjb2x1bW5zOiBjb25zdHJhaW50T3B0cy5jb2x1bW5zLm1hcCgoYykgPT4gY29sSWRzLmdldChjKSkgfVxuICAgICAgfTtcbiAgICAgIGNvbnN0cmFpbnRzLnB1c2goeyBzb3VyY2VOYW1lOiBjb25zdHJhaW50T3B0cy5uYW1lLCBkYXRhIH0pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuICB9XG4gIGNvbnN0IHByb2R1Y3RUeXBlID0gcm93LmFsZ2VicmFpY1R5cGUudmFsdWU7XG4gIGNvbnN0IHNjaGVkdWxlID0gc2NoZWR1bGVkICYmIHNjaGVkdWxlQXRDb2wgIT09IHZvaWQgMCA/IHsgc2NoZWR1bGVBdENvbCwgcmVkdWNlcjogc2NoZWR1bGVkIH0gOiB2b2lkIDA7XG4gIHJldHVybiB7XG4gICAgcm93VHlwZTogcm93LFxuICAgIHRhYmxlTmFtZTogbmFtZSxcbiAgICByb3dTcGFjZXRpbWVUeXBlOiBwcm9kdWN0VHlwZSxcbiAgICB0YWJsZURlZjogKGN0eCwgYWNjTmFtZSkgPT4ge1xuICAgICAgY29uc3QgdGFibGVOYW1lID0gbmFtZSA/PyBhY2NOYW1lO1xuICAgICAgaWYgKHJvdy50eXBlTmFtZSA9PT0gdm9pZCAwKSB7XG4gICAgICAgIHJvdy50eXBlTmFtZSA9IHRvUGFzY2FsQ2FzZSh0YWJsZU5hbWUpO1xuICAgICAgfVxuICAgICAgZm9yIChjb25zdCBpbmRleCBvZiBpbmRleGVzKSB7XG4gICAgICAgIGNvbnN0IGNvbHMgPSBpbmRleC5hbGdvcml0aG0udGFnID09PSBcIkRpcmVjdFwiID8gW2luZGV4LmFsZ29yaXRobS52YWx1ZV0gOiBpbmRleC5hbGdvcml0aG0udmFsdWU7XG4gICAgICAgIGNvbnN0IGNvbFMgPSBjb2xzLm1hcCgoaSkgPT4gY29sTmFtZUxpc3RbaV0pLmpvaW4oXCJfXCIpO1xuICAgICAgICBjb25zdCBzb3VyY2VOYW1lID0gaW5kZXguc291cmNlTmFtZSA9IGAke2FjY05hbWV9XyR7Y29sU31faWR4XyR7aW5kZXguYWxnb3JpdGhtLnRhZy50b0xvd2VyQ2FzZSgpfWA7XG4gICAgICAgIGNvbnN0IHsgY2Fub25pY2FsTmFtZSB9ID0gaW5kZXg7XG4gICAgICAgIGlmIChjYW5vbmljYWxOYW1lICE9PSB2b2lkIDApIHtcbiAgICAgICAgICBjdHgubW9kdWxlRGVmLmV4cGxpY2l0TmFtZXMuZW50cmllcy5wdXNoKFxuICAgICAgICAgICAgRXhwbGljaXROYW1lRW50cnkuSW5kZXgoeyBzb3VyY2VOYW1lLCBjYW5vbmljYWxOYW1lIH0pXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc291cmNlTmFtZTogYWNjTmFtZSxcbiAgICAgICAgcHJvZHVjdFR5cGVSZWY6IGN0eC5yZWdpc3RlclR5cGVzUmVjdXJzaXZlbHkocm93KS5yZWYsXG4gICAgICAgIHByaW1hcnlLZXk6IHBrLFxuICAgICAgICBpbmRleGVzLFxuICAgICAgICBjb25zdHJhaW50cyxcbiAgICAgICAgc2VxdWVuY2VzLFxuICAgICAgICB0YWJsZVR5cGU6IHsgdGFnOiBcIlVzZXJcIiB9LFxuICAgICAgICB0YWJsZUFjY2VzczogeyB0YWc6IGlzUHVibGljID8gXCJQdWJsaWNcIiA6IFwiUHJpdmF0ZVwiIH0sXG4gICAgICAgIGRlZmF1bHRWYWx1ZXMsXG4gICAgICAgIGlzRXZlbnRcbiAgICAgIH07XG4gICAgfSxcbiAgICBpZHhzOiB7fSxcbiAgICBjb25zdHJhaW50cyxcbiAgICBzY2hlZHVsZVxuICB9O1xufVxuXG4vLyBzcmMvbGliL3F1ZXJ5LnRzXG52YXIgUXVlcnlCcmFuZCA9IFN5bWJvbChcIlF1ZXJ5QnJhbmRcIik7XG52YXIgaXNSb3dUeXBlZFF1ZXJ5ID0gKHZhbCkgPT4gISF2YWwgJiYgdHlwZW9mIHZhbCA9PT0gXCJvYmplY3RcIiAmJiBRdWVyeUJyYW5kIGluIHZhbDtcbnZhciBpc1R5cGVkUXVlcnkgPSAodmFsKSA9PiAhIXZhbCAmJiB0eXBlb2YgdmFsID09PSBcIm9iamVjdFwiICYmIFF1ZXJ5QnJhbmQgaW4gdmFsO1xuZnVuY3Rpb24gdG9TcWwocSkge1xuICByZXR1cm4gcS50b1NxbCgpO1xufVxudmFyIFNlbWlqb2luSW1wbCA9IGNsYXNzIF9TZW1pam9pbkltcGwge1xuICBjb25zdHJ1Y3Rvcihzb3VyY2VRdWVyeSwgZmlsdGVyUXVlcnksIGpvaW5Db25kaXRpb24pIHtcbiAgICB0aGlzLnNvdXJjZVF1ZXJ5ID0gc291cmNlUXVlcnk7XG4gICAgdGhpcy5maWx0ZXJRdWVyeSA9IGZpbHRlclF1ZXJ5O1xuICAgIHRoaXMuam9pbkNvbmRpdGlvbiA9IGpvaW5Db25kaXRpb247XG4gICAgaWYgKHNvdXJjZVF1ZXJ5LnRhYmxlLnNvdXJjZU5hbWUgPT09IGZpbHRlclF1ZXJ5LnRhYmxlLnNvdXJjZU5hbWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBzZW1pam9pbiBhIHRhYmxlIHRvIGl0c2VsZlwiKTtcbiAgICB9XG4gIH1cbiAgW1F1ZXJ5QnJhbmRdID0gdHJ1ZTtcbiAgdHlwZSA9IFwic2VtaWpvaW5cIjtcbiAgYnVpbGQoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgd2hlcmUocHJlZGljYXRlKSB7XG4gICAgY29uc3QgbmV4dFNvdXJjZVF1ZXJ5ID0gdGhpcy5zb3VyY2VRdWVyeS53aGVyZShwcmVkaWNhdGUpO1xuICAgIHJldHVybiBuZXcgX1NlbWlqb2luSW1wbChcbiAgICAgIG5leHRTb3VyY2VRdWVyeSxcbiAgICAgIHRoaXMuZmlsdGVyUXVlcnksXG4gICAgICB0aGlzLmpvaW5Db25kaXRpb25cbiAgICApO1xuICB9XG4gIHRvU3FsKCkge1xuICAgIGNvbnN0IGxlZnQgPSB0aGlzLmZpbHRlclF1ZXJ5O1xuICAgIGNvbnN0IHJpZ2h0ID0gdGhpcy5zb3VyY2VRdWVyeTtcbiAgICBjb25zdCBsZWZ0VGFibGUgPSBxdW90ZUlkZW50aWZpZXIobGVmdC50YWJsZS5zb3VyY2VOYW1lKTtcbiAgICBjb25zdCByaWdodFRhYmxlID0gcXVvdGVJZGVudGlmaWVyKHJpZ2h0LnRhYmxlLnNvdXJjZU5hbWUpO1xuICAgIGxldCBzcWwgPSBgU0VMRUNUICR7cmlnaHRUYWJsZX0uKiBGUk9NICR7bGVmdFRhYmxlfSBKT0lOICR7cmlnaHRUYWJsZX0gT04gJHtib29sZWFuRXhwclRvU3FsKHRoaXMuam9pbkNvbmRpdGlvbil9YDtcbiAgICBjb25zdCBjbGF1c2VzID0gW107XG4gICAgaWYgKGxlZnQud2hlcmVDbGF1c2UpIHtcbiAgICAgIGNsYXVzZXMucHVzaChib29sZWFuRXhwclRvU3FsKGxlZnQud2hlcmVDbGF1c2UpKTtcbiAgICB9XG4gICAgaWYgKHJpZ2h0LndoZXJlQ2xhdXNlKSB7XG4gICAgICBjbGF1c2VzLnB1c2goYm9vbGVhbkV4cHJUb1NxbChyaWdodC53aGVyZUNsYXVzZSkpO1xuICAgIH1cbiAgICBpZiAoY2xhdXNlcy5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCB3aGVyZVNxbCA9IGNsYXVzZXMubGVuZ3RoID09PSAxID8gY2xhdXNlc1swXSA6IGNsYXVzZXMubWFwKHdyYXBJblBhcmVucykuam9pbihcIiBBTkQgXCIpO1xuICAgICAgc3FsICs9IGAgV0hFUkUgJHt3aGVyZVNxbH1gO1xuICAgIH1cbiAgICByZXR1cm4gc3FsO1xuICB9XG59O1xudmFyIEZyb21CdWlsZGVyID0gY2xhc3MgX0Zyb21CdWlsZGVyIHtcbiAgY29uc3RydWN0b3IodGFibGUyLCB3aGVyZUNsYXVzZSkge1xuICAgIHRoaXMudGFibGUgPSB0YWJsZTI7XG4gICAgdGhpcy53aGVyZUNsYXVzZSA9IHdoZXJlQ2xhdXNlO1xuICB9XG4gIFtRdWVyeUJyYW5kXSA9IHRydWU7XG4gIHdoZXJlKHByZWRpY2F0ZSkge1xuICAgIGNvbnN0IG5ld0NvbmRpdGlvbiA9IHByZWRpY2F0ZSh0aGlzLnRhYmxlLmNvbHMpO1xuICAgIGNvbnN0IG5leHRXaGVyZSA9IHRoaXMud2hlcmVDbGF1c2UgPyB0aGlzLndoZXJlQ2xhdXNlLmFuZChuZXdDb25kaXRpb24pIDogbmV3Q29uZGl0aW9uO1xuICAgIHJldHVybiBuZXcgX0Zyb21CdWlsZGVyKHRoaXMudGFibGUsIG5leHRXaGVyZSk7XG4gIH1cbiAgcmlnaHRTZW1pam9pbihyaWdodCwgb24pIHtcbiAgICBjb25zdCBzb3VyY2VRdWVyeSA9IG5ldyBfRnJvbUJ1aWxkZXIocmlnaHQpO1xuICAgIGNvbnN0IGpvaW5Db25kaXRpb24gPSBvbihcbiAgICAgIHRoaXMudGFibGUuaW5kZXhlZENvbHMsXG4gICAgICByaWdodC5pbmRleGVkQ29sc1xuICAgICk7XG4gICAgcmV0dXJuIG5ldyBTZW1pam9pbkltcGwoc291cmNlUXVlcnksIHRoaXMsIGpvaW5Db25kaXRpb24pO1xuICB9XG4gIGxlZnRTZW1pam9pbihyaWdodCwgb24pIHtcbiAgICBjb25zdCBmaWx0ZXJRdWVyeSA9IG5ldyBfRnJvbUJ1aWxkZXIocmlnaHQpO1xuICAgIGNvbnN0IGpvaW5Db25kaXRpb24gPSBvbihcbiAgICAgIHRoaXMudGFibGUuaW5kZXhlZENvbHMsXG4gICAgICByaWdodC5pbmRleGVkQ29sc1xuICAgICk7XG4gICAgcmV0dXJuIG5ldyBTZW1pam9pbkltcGwodGhpcywgZmlsdGVyUXVlcnksIGpvaW5Db25kaXRpb24pO1xuICB9XG4gIHRvU3FsKCkge1xuICAgIHJldHVybiByZW5kZXJTZWxlY3RTcWxXaXRoSm9pbnModGhpcy50YWJsZSwgdGhpcy53aGVyZUNsYXVzZSk7XG4gIH1cbiAgYnVpbGQoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn07XG52YXIgVGFibGVSZWZJbXBsID0gY2xhc3Mge1xuICBbUXVlcnlCcmFuZF0gPSB0cnVlO1xuICB0eXBlID0gXCJ0YWJsZVwiO1xuICBzb3VyY2VOYW1lO1xuICBhY2Nlc3Nvck5hbWU7XG4gIGNvbHM7XG4gIGluZGV4ZWRDb2xzO1xuICB0YWJsZURlZjtcbiAgLy8gRGVsZWdhdGUgVW50eXBlZFRhYmxlRGVmIHByb3BlcnRpZXMgZnJvbSB0YWJsZURlZiBzbyB0aGlzIGNhbiBiZSB1c2VkIGFzIGEgdGFibGUgZGVmLlxuICBnZXQgY29sdW1ucygpIHtcbiAgICByZXR1cm4gdGhpcy50YWJsZURlZi5jb2x1bW5zO1xuICB9XG4gIGdldCBpbmRleGVzKCkge1xuICAgIHJldHVybiB0aGlzLnRhYmxlRGVmLmluZGV4ZXM7XG4gIH1cbiAgZ2V0IHJvd1R5cGUoKSB7XG4gICAgcmV0dXJuIHRoaXMudGFibGVEZWYucm93VHlwZTtcbiAgfVxuICBnZXQgY29uc3RyYWludHMoKSB7XG4gICAgcmV0dXJuIHRoaXMudGFibGVEZWYuY29uc3RyYWludHM7XG4gIH1cbiAgY29uc3RydWN0b3IodGFibGVEZWYpIHtcbiAgICB0aGlzLnNvdXJjZU5hbWUgPSB0YWJsZURlZi5zb3VyY2VOYW1lO1xuICAgIHRoaXMuYWNjZXNzb3JOYW1lID0gdGFibGVEZWYuYWNjZXNzb3JOYW1lO1xuICAgIHRoaXMuY29scyA9IGNyZWF0ZVJvd0V4cHIodGFibGVEZWYpO1xuICAgIHRoaXMuaW5kZXhlZENvbHMgPSB0aGlzLmNvbHM7XG4gICAgdGhpcy50YWJsZURlZiA9IHRhYmxlRGVmO1xuICAgIE9iamVjdC5mcmVlemUodGhpcyk7XG4gIH1cbiAgYXNGcm9tKCkge1xuICAgIHJldHVybiBuZXcgRnJvbUJ1aWxkZXIodGhpcyk7XG4gIH1cbiAgcmlnaHRTZW1pam9pbihvdGhlciwgb24pIHtcbiAgICByZXR1cm4gdGhpcy5hc0Zyb20oKS5yaWdodFNlbWlqb2luKG90aGVyLCBvbik7XG4gIH1cbiAgbGVmdFNlbWlqb2luKG90aGVyLCBvbikge1xuICAgIHJldHVybiB0aGlzLmFzRnJvbSgpLmxlZnRTZW1pam9pbihvdGhlciwgb24pO1xuICB9XG4gIGJ1aWxkKCkge1xuICAgIHJldHVybiB0aGlzLmFzRnJvbSgpLmJ1aWxkKCk7XG4gIH1cbiAgdG9TcWwoKSB7XG4gICAgcmV0dXJuIHRoaXMuYXNGcm9tKCkudG9TcWwoKTtcbiAgfVxuICB3aGVyZShwcmVkaWNhdGUpIHtcbiAgICByZXR1cm4gdGhpcy5hc0Zyb20oKS53aGVyZShwcmVkaWNhdGUpO1xuICB9XG59O1xuZnVuY3Rpb24gY3JlYXRlVGFibGVSZWZGcm9tRGVmKHRhYmxlRGVmKSB7XG4gIHJldHVybiBuZXcgVGFibGVSZWZJbXBsKHRhYmxlRGVmKTtcbn1cbmZ1bmN0aW9uIG1ha2VRdWVyeUJ1aWxkZXIoc2NoZW1hMikge1xuICBjb25zdCBxYiA9IC8qIEBfX1BVUkVfXyAqLyBPYmplY3QuY3JlYXRlKG51bGwpO1xuICBmb3IgKGNvbnN0IHRhYmxlMiBvZiBPYmplY3QudmFsdWVzKHNjaGVtYTIudGFibGVzKSkge1xuICAgIGNvbnN0IHJlZiA9IGNyZWF0ZVRhYmxlUmVmRnJvbURlZihcbiAgICAgIHRhYmxlMlxuICAgICk7XG4gICAgcWJbdGFibGUyLmFjY2Vzc29yTmFtZV0gPSByZWY7XG4gIH1cbiAgcmV0dXJuIE9iamVjdC5mcmVlemUocWIpO1xufVxuZnVuY3Rpb24gY3JlYXRlUm93RXhwcih0YWJsZURlZikge1xuICBjb25zdCByb3cgPSB7fTtcbiAgZm9yIChjb25zdCBjb2x1bW5OYW1lIG9mIE9iamVjdC5rZXlzKHRhYmxlRGVmLmNvbHVtbnMpKSB7XG4gICAgY29uc3QgY29sdW1uQnVpbGRlciA9IHRhYmxlRGVmLmNvbHVtbnNbY29sdW1uTmFtZV07XG4gICAgY29uc3QgY29sdW1uID0gbmV3IENvbHVtbkV4cHJlc3Npb24oXG4gICAgICB0YWJsZURlZi5zb3VyY2VOYW1lLFxuICAgICAgY29sdW1uTmFtZSxcbiAgICAgIGNvbHVtbkJ1aWxkZXIudHlwZUJ1aWxkZXIuYWxnZWJyYWljVHlwZVxuICAgICk7XG4gICAgcm93W2NvbHVtbk5hbWVdID0gT2JqZWN0LmZyZWV6ZShjb2x1bW4pO1xuICB9XG4gIHJldHVybiBPYmplY3QuZnJlZXplKHJvdyk7XG59XG5mdW5jdGlvbiByZW5kZXJTZWxlY3RTcWxXaXRoSm9pbnModGFibGUyLCB3aGVyZSwgZXh0cmFDbGF1c2VzID0gW10pIHtcbiAgY29uc3QgcXVvdGVkVGFibGUgPSBxdW90ZUlkZW50aWZpZXIodGFibGUyLnNvdXJjZU5hbWUpO1xuICBjb25zdCBzcWwgPSBgU0VMRUNUICogRlJPTSAke3F1b3RlZFRhYmxlfWA7XG4gIGNvbnN0IGNsYXVzZXMgPSBbXTtcbiAgaWYgKHdoZXJlKSBjbGF1c2VzLnB1c2goYm9vbGVhbkV4cHJUb1NxbCh3aGVyZSkpO1xuICBjbGF1c2VzLnB1c2goLi4uZXh0cmFDbGF1c2VzKTtcbiAgaWYgKGNsYXVzZXMubGVuZ3RoID09PSAwKSByZXR1cm4gc3FsO1xuICBjb25zdCB3aGVyZVNxbCA9IGNsYXVzZXMubGVuZ3RoID09PSAxID8gY2xhdXNlc1swXSA6IGNsYXVzZXMubWFwKHdyYXBJblBhcmVucykuam9pbihcIiBBTkQgXCIpO1xuICByZXR1cm4gYCR7c3FsfSBXSEVSRSAke3doZXJlU3FsfWA7XG59XG52YXIgQ29sdW1uRXhwcmVzc2lvbiA9IGNsYXNzIHtcbiAgdHlwZSA9IFwiY29sdW1uXCI7XG4gIGNvbHVtbjtcbiAgdGFibGU7XG4gIC8vIHBoYW50b206IGFjdHVhbCBydW50aW1lIHZhbHVlIGlzIHVuZGVmaW5lZFxuICB0c1ZhbHVlVHlwZTtcbiAgc3BhY2V0aW1lVHlwZTtcbiAgY29uc3RydWN0b3IodGFibGUyLCBjb2x1bW4sIHNwYWNldGltZVR5cGUpIHtcbiAgICB0aGlzLnRhYmxlID0gdGFibGUyO1xuICAgIHRoaXMuY29sdW1uID0gY29sdW1uO1xuICAgIHRoaXMuc3BhY2V0aW1lVHlwZSA9IHNwYWNldGltZVR5cGU7XG4gIH1cbiAgZXEoeCkge1xuICAgIHJldHVybiBuZXcgQm9vbGVhbkV4cHIoe1xuICAgICAgdHlwZTogXCJlcVwiLFxuICAgICAgbGVmdDogdGhpcyxcbiAgICAgIHJpZ2h0OiBub3JtYWxpemVWYWx1ZSh4KVxuICAgIH0pO1xuICB9XG4gIG5lKHgpIHtcbiAgICByZXR1cm4gbmV3IEJvb2xlYW5FeHByKHtcbiAgICAgIHR5cGU6IFwibmVcIixcbiAgICAgIGxlZnQ6IHRoaXMsXG4gICAgICByaWdodDogbm9ybWFsaXplVmFsdWUoeClcbiAgICB9KTtcbiAgfVxuICBsdCh4KSB7XG4gICAgcmV0dXJuIG5ldyBCb29sZWFuRXhwcih7XG4gICAgICB0eXBlOiBcImx0XCIsXG4gICAgICBsZWZ0OiB0aGlzLFxuICAgICAgcmlnaHQ6IG5vcm1hbGl6ZVZhbHVlKHgpXG4gICAgfSk7XG4gIH1cbiAgbHRlKHgpIHtcbiAgICByZXR1cm4gbmV3IEJvb2xlYW5FeHByKHtcbiAgICAgIHR5cGU6IFwibHRlXCIsXG4gICAgICBsZWZ0OiB0aGlzLFxuICAgICAgcmlnaHQ6IG5vcm1hbGl6ZVZhbHVlKHgpXG4gICAgfSk7XG4gIH1cbiAgZ3QoeCkge1xuICAgIHJldHVybiBuZXcgQm9vbGVhbkV4cHIoe1xuICAgICAgdHlwZTogXCJndFwiLFxuICAgICAgbGVmdDogdGhpcyxcbiAgICAgIHJpZ2h0OiBub3JtYWxpemVWYWx1ZSh4KVxuICAgIH0pO1xuICB9XG4gIGd0ZSh4KSB7XG4gICAgcmV0dXJuIG5ldyBCb29sZWFuRXhwcih7XG4gICAgICB0eXBlOiBcImd0ZVwiLFxuICAgICAgbGVmdDogdGhpcyxcbiAgICAgIHJpZ2h0OiBub3JtYWxpemVWYWx1ZSh4KVxuICAgIH0pO1xuICB9XG59O1xuZnVuY3Rpb24gbGl0ZXJhbCh2YWx1ZSkge1xuICByZXR1cm4geyB0eXBlOiBcImxpdGVyYWxcIiwgdmFsdWUgfTtcbn1cbmZ1bmN0aW9uIG5vcm1hbGl6ZVZhbHVlKHZhbCkge1xuICBpZiAodmFsLnR5cGUgPT09IFwibGl0ZXJhbFwiKVxuICAgIHJldHVybiB2YWw7XG4gIGlmICh0eXBlb2YgdmFsID09PSBcIm9iamVjdFwiICYmIHZhbCAhPSBudWxsICYmIFwidHlwZVwiIGluIHZhbCAmJiB2YWwudHlwZSA9PT0gXCJjb2x1bW5cIikge1xuICAgIHJldHVybiB2YWw7XG4gIH1cbiAgcmV0dXJuIGxpdGVyYWwodmFsKTtcbn1cbnZhciBCb29sZWFuRXhwciA9IGNsYXNzIF9Cb29sZWFuRXhwciB7XG4gIGNvbnN0cnVjdG9yKGRhdGEpIHtcbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICB9XG4gIGFuZChvdGhlcikge1xuICAgIHJldHVybiBuZXcgX0Jvb2xlYW5FeHByKHsgdHlwZTogXCJhbmRcIiwgY2xhdXNlczogW3RoaXMuZGF0YSwgb3RoZXIuZGF0YV0gfSk7XG4gIH1cbiAgb3Iob3RoZXIpIHtcbiAgICByZXR1cm4gbmV3IF9Cb29sZWFuRXhwcih7IHR5cGU6IFwib3JcIiwgY2xhdXNlczogW3RoaXMuZGF0YSwgb3RoZXIuZGF0YV0gfSk7XG4gIH1cbiAgbm90KCkge1xuICAgIHJldHVybiBuZXcgX0Jvb2xlYW5FeHByKHsgdHlwZTogXCJub3RcIiwgY2xhdXNlOiB0aGlzLmRhdGEgfSk7XG4gIH1cbn07XG5mdW5jdGlvbiBub3QoY2xhdXNlKSB7XG4gIHJldHVybiBuZXcgQm9vbGVhbkV4cHIoeyB0eXBlOiBcIm5vdFwiLCBjbGF1c2U6IGNsYXVzZS5kYXRhIH0pO1xufVxuZnVuY3Rpb24gYW5kKC4uLmNsYXVzZXMpIHtcbiAgcmV0dXJuIG5ldyBCb29sZWFuRXhwcih7XG4gICAgdHlwZTogXCJhbmRcIixcbiAgICBjbGF1c2VzOiBjbGF1c2VzLm1hcCgoYykgPT4gYy5kYXRhKVxuICB9KTtcbn1cbmZ1bmN0aW9uIG9yKC4uLmNsYXVzZXMpIHtcbiAgcmV0dXJuIG5ldyBCb29sZWFuRXhwcih7XG4gICAgdHlwZTogXCJvclwiLFxuICAgIGNsYXVzZXM6IGNsYXVzZXMubWFwKChjKSA9PiBjLmRhdGEpXG4gIH0pO1xufVxuZnVuY3Rpb24gYm9vbGVhbkV4cHJUb1NxbChleHByLCB0YWJsZUFsaWFzKSB7XG4gIGNvbnN0IGRhdGEgPSBleHByIGluc3RhbmNlb2YgQm9vbGVhbkV4cHIgPyBleHByLmRhdGEgOiBleHByO1xuICBzd2l0Y2ggKGRhdGEudHlwZSkge1xuICAgIGNhc2UgXCJlcVwiOlxuICAgICAgcmV0dXJuIGAke3ZhbHVlRXhwclRvU3FsKGRhdGEubGVmdCl9ID0gJHt2YWx1ZUV4cHJUb1NxbChkYXRhLnJpZ2h0KX1gO1xuICAgIGNhc2UgXCJuZVwiOlxuICAgICAgcmV0dXJuIGAke3ZhbHVlRXhwclRvU3FsKGRhdGEubGVmdCl9IDw+ICR7dmFsdWVFeHByVG9TcWwoZGF0YS5yaWdodCl9YDtcbiAgICBjYXNlIFwiZ3RcIjpcbiAgICAgIHJldHVybiBgJHt2YWx1ZUV4cHJUb1NxbChkYXRhLmxlZnQpfSA+ICR7dmFsdWVFeHByVG9TcWwoZGF0YS5yaWdodCl9YDtcbiAgICBjYXNlIFwiZ3RlXCI6XG4gICAgICByZXR1cm4gYCR7dmFsdWVFeHByVG9TcWwoZGF0YS5sZWZ0KX0gPj0gJHt2YWx1ZUV4cHJUb1NxbChkYXRhLnJpZ2h0KX1gO1xuICAgIGNhc2UgXCJsdFwiOlxuICAgICAgcmV0dXJuIGAke3ZhbHVlRXhwclRvU3FsKGRhdGEubGVmdCl9IDwgJHt2YWx1ZUV4cHJUb1NxbChkYXRhLnJpZ2h0KX1gO1xuICAgIGNhc2UgXCJsdGVcIjpcbiAgICAgIHJldHVybiBgJHt2YWx1ZUV4cHJUb1NxbChkYXRhLmxlZnQpfSA8PSAke3ZhbHVlRXhwclRvU3FsKGRhdGEucmlnaHQpfWA7XG4gICAgY2FzZSBcImFuZFwiOlxuICAgICAgcmV0dXJuIGRhdGEuY2xhdXNlcy5tYXAoKGMpID0+IGJvb2xlYW5FeHByVG9TcWwoYykpLm1hcCh3cmFwSW5QYXJlbnMpLmpvaW4oXCIgQU5EIFwiKTtcbiAgICBjYXNlIFwib3JcIjpcbiAgICAgIHJldHVybiBkYXRhLmNsYXVzZXMubWFwKChjKSA9PiBib29sZWFuRXhwclRvU3FsKGMpKS5tYXAod3JhcEluUGFyZW5zKS5qb2luKFwiIE9SIFwiKTtcbiAgICBjYXNlIFwibm90XCI6XG4gICAgICByZXR1cm4gYE5PVCAke3dyYXBJblBhcmVucyhib29sZWFuRXhwclRvU3FsKGRhdGEuY2xhdXNlKSl9YDtcbiAgfVxufVxuZnVuY3Rpb24gd3JhcEluUGFyZW5zKHNxbCkge1xuICByZXR1cm4gYCgke3NxbH0pYDtcbn1cbmZ1bmN0aW9uIHZhbHVlRXhwclRvU3FsKGV4cHIsIHRhYmxlQWxpYXMpIHtcbiAgaWYgKGlzTGl0ZXJhbEV4cHIoZXhwcikpIHtcbiAgICByZXR1cm4gbGl0ZXJhbFZhbHVlVG9TcWwoZXhwci52YWx1ZSk7XG4gIH1cbiAgY29uc3QgdGFibGUyID0gZXhwci50YWJsZTtcbiAgcmV0dXJuIGAke3F1b3RlSWRlbnRpZmllcih0YWJsZTIpfS4ke3F1b3RlSWRlbnRpZmllcihleHByLmNvbHVtbil9YDtcbn1cbmZ1bmN0aW9uIGxpdGVyYWxWYWx1ZVRvU3FsKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdm9pZCAwKSB7XG4gICAgcmV0dXJuIFwiTlVMTFwiO1xuICB9XG4gIGlmICh2YWx1ZSBpbnN0YW5jZW9mIElkZW50aXR5IHx8IHZhbHVlIGluc3RhbmNlb2YgQ29ubmVjdGlvbklkKSB7XG4gICAgcmV0dXJuIGAweCR7dmFsdWUudG9IZXhTdHJpbmcoKX1gO1xuICB9XG4gIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFRpbWVzdGFtcCkge1xuICAgIHJldHVybiBgJyR7dmFsdWUudG9JU09TdHJpbmcoKX0nYDtcbiAgfVxuICBzd2l0Y2ggKHR5cGVvZiB2YWx1ZSkge1xuICAgIGNhc2UgXCJudW1iZXJcIjpcbiAgICBjYXNlIFwiYmlnaW50XCI6XG4gICAgICByZXR1cm4gU3RyaW5nKHZhbHVlKTtcbiAgICBjYXNlIFwiYm9vbGVhblwiOlxuICAgICAgcmV0dXJuIHZhbHVlID8gXCJUUlVFXCIgOiBcIkZBTFNFXCI7XG4gICAgY2FzZSBcInN0cmluZ1wiOlxuICAgICAgcmV0dXJuIGAnJHt2YWx1ZS5yZXBsYWNlKC8nL2csIFwiJydcIil9J2A7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBgJyR7SlNPTi5zdHJpbmdpZnkodmFsdWUpLnJlcGxhY2UoLycvZywgXCInJ1wiKX0nYDtcbiAgfVxufVxuZnVuY3Rpb24gcXVvdGVJZGVudGlmaWVyKG5hbWUpIHtcbiAgcmV0dXJuIGBcIiR7bmFtZS5yZXBsYWNlKC9cIi9nLCAnXCJcIicpfVwiYDtcbn1cbmZ1bmN0aW9uIGlzTGl0ZXJhbEV4cHIoZXhwcikge1xuICByZXR1cm4gZXhwci50eXBlID09PSBcImxpdGVyYWxcIjtcbn1cbmZ1bmN0aW9uIGV2YWx1YXRlQm9vbGVhbkV4cHIoZXhwciwgcm93KSB7XG4gIHJldHVybiBldmFsdWF0ZURhdGEoZXhwci5kYXRhLCByb3cpO1xufVxuZnVuY3Rpb24gZXZhbHVhdGVEYXRhKGRhdGEsIHJvdykge1xuICBzd2l0Y2ggKGRhdGEudHlwZSkge1xuICAgIGNhc2UgXCJlcVwiOlxuICAgICAgcmV0dXJuIHJlc29sdmVWYWx1ZShkYXRhLmxlZnQsIHJvdykgPT09IHJlc29sdmVWYWx1ZShkYXRhLnJpZ2h0LCByb3cpO1xuICAgIGNhc2UgXCJuZVwiOlxuICAgICAgcmV0dXJuIHJlc29sdmVWYWx1ZShkYXRhLmxlZnQsIHJvdykgIT09IHJlc29sdmVWYWx1ZShkYXRhLnJpZ2h0LCByb3cpO1xuICAgIGNhc2UgXCJndFwiOlxuICAgICAgcmV0dXJuIHJlc29sdmVWYWx1ZShkYXRhLmxlZnQsIHJvdykgPiByZXNvbHZlVmFsdWUoZGF0YS5yaWdodCwgcm93KTtcbiAgICBjYXNlIFwiZ3RlXCI6XG4gICAgICByZXR1cm4gcmVzb2x2ZVZhbHVlKGRhdGEubGVmdCwgcm93KSA+PSByZXNvbHZlVmFsdWUoZGF0YS5yaWdodCwgcm93KTtcbiAgICBjYXNlIFwibHRcIjpcbiAgICAgIHJldHVybiByZXNvbHZlVmFsdWUoZGF0YS5sZWZ0LCByb3cpIDwgcmVzb2x2ZVZhbHVlKGRhdGEucmlnaHQsIHJvdyk7XG4gICAgY2FzZSBcImx0ZVwiOlxuICAgICAgcmV0dXJuIHJlc29sdmVWYWx1ZShkYXRhLmxlZnQsIHJvdykgPD0gcmVzb2x2ZVZhbHVlKGRhdGEucmlnaHQsIHJvdyk7XG4gICAgY2FzZSBcImFuZFwiOlxuICAgICAgcmV0dXJuIGRhdGEuY2xhdXNlcy5ldmVyeSgoYykgPT4gZXZhbHVhdGVEYXRhKGMsIHJvdykpO1xuICAgIGNhc2UgXCJvclwiOlxuICAgICAgcmV0dXJuIGRhdGEuY2xhdXNlcy5zb21lKChjKSA9PiBldmFsdWF0ZURhdGEoYywgcm93KSk7XG4gICAgY2FzZSBcIm5vdFwiOlxuICAgICAgcmV0dXJuICFldmFsdWF0ZURhdGEoZGF0YS5jbGF1c2UsIHJvdyk7XG4gIH1cbn1cbmZ1bmN0aW9uIHJlc29sdmVWYWx1ZShleHByLCByb3cpIHtcbiAgaWYgKGlzTGl0ZXJhbEV4cHIoZXhwcikpIHtcbiAgICByZXR1cm4gdG9Db21wYXJhYmxlVmFsdWUoZXhwci52YWx1ZSk7XG4gIH1cbiAgcmV0dXJuIHRvQ29tcGFyYWJsZVZhbHVlKHJvd1tleHByLmNvbHVtbl0pO1xufVxuZnVuY3Rpb24gaXNIZXhTZXJpYWxpemFibGVMaWtlKHZhbHVlKSB7XG4gIHJldHVybiAhIXZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgdmFsdWUudG9IZXhTdHJpbmcgPT09IFwiZnVuY3Rpb25cIjtcbn1cbmZ1bmN0aW9uIGlzVGltZXN0YW1wTGlrZSh2YWx1ZSkge1xuICBpZiAoIXZhbHVlIHx8IHR5cGVvZiB2YWx1ZSAhPT0gXCJvYmplY3RcIikgcmV0dXJuIGZhbHNlO1xuICBpZiAodmFsdWUgaW5zdGFuY2VvZiBUaW1lc3RhbXApIHJldHVybiB0cnVlO1xuICBjb25zdCBtaWNyb3MgPSB2YWx1ZVtcIl9fdGltZXN0YW1wX21pY3Jvc19zaW5jZV91bml4X2Vwb2NoX19cIl07XG4gIHJldHVybiB0eXBlb2YgbWljcm9zID09PSBcImJpZ2ludFwiO1xufVxuZnVuY3Rpb24gdG9Db21wYXJhYmxlVmFsdWUodmFsdWUpIHtcbiAgaWYgKGlzSGV4U2VyaWFsaXphYmxlTGlrZSh2YWx1ZSkpIHtcbiAgICByZXR1cm4gdmFsdWUudG9IZXhTdHJpbmcoKTtcbiAgfVxuICBpZiAoaXNUaW1lc3RhbXBMaWtlKHZhbHVlKSkge1xuICAgIHJldHVybiB2YWx1ZS5fX3RpbWVzdGFtcF9taWNyb3Nfc2luY2VfdW5peF9lcG9jaF9fO1xuICB9XG4gIHJldHVybiB2YWx1ZTtcbn1cbmZ1bmN0aW9uIGdldFF1ZXJ5VGFibGVOYW1lKHF1ZXJ5KSB7XG4gIGlmIChxdWVyeS50YWJsZSkgcmV0dXJuIHF1ZXJ5LnRhYmxlLm5hbWU7XG4gIGlmIChxdWVyeS5uYW1lKSByZXR1cm4gcXVlcnkubmFtZTtcbiAgaWYgKHF1ZXJ5LnNvdXJjZVF1ZXJ5KSByZXR1cm4gcXVlcnkuc291cmNlUXVlcnkudGFibGUubmFtZTtcbiAgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGV4dHJhY3QgdGFibGUgbmFtZSBmcm9tIHF1ZXJ5XCIpO1xufVxuZnVuY3Rpb24gZ2V0UXVlcnlBY2Nlc3Nvck5hbWUocXVlcnkpIHtcbiAgaWYgKHF1ZXJ5LnRhYmxlKSByZXR1cm4gcXVlcnkudGFibGUuYWNjZXNzb3JOYW1lO1xuICBpZiAocXVlcnkuYWNjZXNzb3JOYW1lKSByZXR1cm4gcXVlcnkuYWNjZXNzb3JOYW1lO1xuICBpZiAocXVlcnkuc291cmNlUXVlcnkpIHJldHVybiBxdWVyeS5zb3VyY2VRdWVyeS50YWJsZS5hY2Nlc3Nvck5hbWU7XG4gIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBleHRyYWN0IGFjY2Vzc29yIG5hbWUgZnJvbSBxdWVyeVwiKTtcbn1cbmZ1bmN0aW9uIGdldFF1ZXJ5V2hlcmVDbGF1c2UocXVlcnkpIHtcbiAgaWYgKHF1ZXJ5LndoZXJlQ2xhdXNlKSByZXR1cm4gcXVlcnkud2hlcmVDbGF1c2U7XG4gIHJldHVybiB2b2lkIDA7XG59XG5cbi8vIHNyYy9zZXJ2ZXIvdmlld3MudHNcbmZ1bmN0aW9uIG1ha2VWaWV3RXhwb3J0KGN0eCwgb3B0cywgcGFyYW1zLCByZXQsIGZuKSB7XG4gIGNvbnN0IHZpZXdFeHBvcnQgPSAoXG4gICAgLy8gQHRzLWV4cGVjdC1lcnJvciB0eXBlc2NyaXB0IGluY29ycmVjdGx5IHNheXMgRnVuY3Rpb24jYmluZCByZXF1aXJlcyBhbiBhcmd1bWVudC5cbiAgICBmbi5iaW5kKClcbiAgKTtcbiAgdmlld0V4cG9ydFtleHBvcnRDb250ZXh0XSA9IGN0eDtcbiAgdmlld0V4cG9ydFtyZWdpc3RlckV4cG9ydF0gPSAoY3R4MiwgZXhwb3J0TmFtZSkgPT4ge1xuICAgIHJlZ2lzdGVyVmlldyhjdHgyLCBvcHRzLCBleHBvcnROYW1lLCBmYWxzZSwgcGFyYW1zLCByZXQsIGZuKTtcbiAgfTtcbiAgcmV0dXJuIHZpZXdFeHBvcnQ7XG59XG5mdW5jdGlvbiBtYWtlQW5vblZpZXdFeHBvcnQoY3R4LCBvcHRzLCBwYXJhbXMsIHJldCwgZm4pIHtcbiAgY29uc3Qgdmlld0V4cG9ydCA9IChcbiAgICAvLyBAdHMtZXhwZWN0LWVycm9yIHR5cGVzY3JpcHQgaW5jb3JyZWN0bHkgc2F5cyBGdW5jdGlvbiNiaW5kIHJlcXVpcmVzIGFuIGFyZ3VtZW50LlxuICAgIGZuLmJpbmQoKVxuICApO1xuICB2aWV3RXhwb3J0W2V4cG9ydENvbnRleHRdID0gY3R4O1xuICB2aWV3RXhwb3J0W3JlZ2lzdGVyRXhwb3J0XSA9IChjdHgyLCBleHBvcnROYW1lKSA9PiB7XG4gICAgcmVnaXN0ZXJWaWV3KGN0eDIsIG9wdHMsIGV4cG9ydE5hbWUsIHRydWUsIHBhcmFtcywgcmV0LCBmbik7XG4gIH07XG4gIHJldHVybiB2aWV3RXhwb3J0O1xufVxuZnVuY3Rpb24gcmVnaXN0ZXJWaWV3KGN0eCwgb3B0cywgZXhwb3J0TmFtZSwgYW5vbiwgcGFyYW1zLCByZXQsIGZuKSB7XG4gIGNvbnN0IHBhcmFtc0J1aWxkZXIgPSBuZXcgUm93QnVpbGRlcihwYXJhbXMsIHRvUGFzY2FsQ2FzZShleHBvcnROYW1lKSk7XG4gIGxldCByZXR1cm5UeXBlID0gY3R4LnJlZ2lzdGVyVHlwZXNSZWN1cnNpdmVseShyZXQpLmFsZ2VicmFpY1R5cGU7XG4gIGNvbnN0IHsgdHlwZXNwYWNlIH0gPSBjdHg7XG4gIGNvbnN0IHsgdmFsdWU6IHBhcmFtVHlwZSB9ID0gY3R4LnJlc29sdmVUeXBlKFxuICAgIGN0eC5yZWdpc3RlclR5cGVzUmVjdXJzaXZlbHkocGFyYW1zQnVpbGRlcilcbiAgKTtcbiAgY3R4Lm1vZHVsZURlZi52aWV3cy5wdXNoKHtcbiAgICBzb3VyY2VOYW1lOiBleHBvcnROYW1lLFxuICAgIGluZGV4OiAoYW5vbiA/IGN0eC5hbm9uVmlld3MgOiBjdHgudmlld3MpLmxlbmd0aCxcbiAgICBpc1B1YmxpYzogb3B0cy5wdWJsaWMsXG4gICAgaXNBbm9ueW1vdXM6IGFub24sXG4gICAgcGFyYW1zOiBwYXJhbVR5cGUsXG4gICAgcmV0dXJuVHlwZVxuICB9KTtcbiAgaWYgKG9wdHMubmFtZSAhPSBudWxsKSB7XG4gICAgY3R4Lm1vZHVsZURlZi5leHBsaWNpdE5hbWVzLmVudHJpZXMucHVzaCh7XG4gICAgICB0YWc6IFwiRnVuY3Rpb25cIixcbiAgICAgIHZhbHVlOiB7XG4gICAgICAgIHNvdXJjZU5hbWU6IGV4cG9ydE5hbWUsXG4gICAgICAgIGNhbm9uaWNhbE5hbWU6IG9wdHMubmFtZVxuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIGlmIChyZXR1cm5UeXBlLnRhZyA9PSBcIlN1bVwiKSB7XG4gICAgY29uc3Qgb3JpZ2luYWxGbiA9IGZuO1xuICAgIGZuID0gKChjdHgyLCBhcmdzKSA9PiB7XG4gICAgICBjb25zdCByZXQyID0gb3JpZ2luYWxGbihjdHgyLCBhcmdzKTtcbiAgICAgIHJldHVybiByZXQyID09IG51bGwgPyBbXSA6IFtyZXQyXTtcbiAgICB9KTtcbiAgICByZXR1cm5UeXBlID0gQWxnZWJyYWljVHlwZS5BcnJheShcbiAgICAgIHJldHVyblR5cGUudmFsdWUudmFyaWFudHNbMF0uYWxnZWJyYWljVHlwZVxuICAgICk7XG4gIH1cbiAgKGFub24gPyBjdHguYW5vblZpZXdzIDogY3R4LnZpZXdzKS5wdXNoKHtcbiAgICBmbixcbiAgICBkZXNlcmlhbGl6ZVBhcmFtczogUHJvZHVjdFR5cGUubWFrZURlc2VyaWFsaXplcihwYXJhbVR5cGUsIHR5cGVzcGFjZSksXG4gICAgc2VyaWFsaXplUmV0dXJuOiBBbGdlYnJhaWNUeXBlLm1ha2VTZXJpYWxpemVyKHJldHVyblR5cGUsIHR5cGVzcGFjZSksXG4gICAgcmV0dXJuVHlwZUJhc2VTaXplOiBic2F0bkJhc2VTaXplKHR5cGVzcGFjZSwgcmV0dXJuVHlwZSlcbiAgfSk7XG59XG5cbi8vIHNyYy9saWIvZXJyb3JzLnRzXG52YXIgU2VuZGVyRXJyb3IgPSBjbGFzcyBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IobWVzc2FnZSkge1xuICAgIHN1cGVyKG1lc3NhZ2UpO1xuICB9XG4gIGdldCBuYW1lKCkge1xuICAgIHJldHVybiBcIlNlbmRlckVycm9yXCI7XG4gIH1cbn07XG5cbi8vIHNyYy9zZXJ2ZXIvZXJyb3JzLnRzXG52YXIgU3BhY2V0aW1lSG9zdEVycm9yID0gY2xhc3MgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKG1lc3NhZ2UpIHtcbiAgICBzdXBlcihtZXNzYWdlKTtcbiAgfVxuICBnZXQgbmFtZSgpIHtcbiAgICByZXR1cm4gXCJTcGFjZXRpbWVIb3N0RXJyb3JcIjtcbiAgfVxufTtcbnZhciBlcnJvckRhdGEgPSB7XG4gIC8qKlxuICAgKiBBIGdlbmVyaWMgZXJyb3IgY2xhc3MgZm9yIHVua25vd24gZXJyb3IgY29kZXMuXG4gICAqL1xuICBIb3N0Q2FsbEZhaWx1cmU6IDEsXG4gIC8qKlxuICAgKiBFcnJvciBpbmRpY2F0aW5nIHRoYXQgYW4gQUJJIGNhbGwgd2FzIG1hZGUgb3V0c2lkZSBvZiBhIHRyYW5zYWN0aW9uLlxuICAgKi9cbiAgTm90SW5UcmFuc2FjdGlvbjogMixcbiAgLyoqXG4gICAqIEVycm9yIGluZGljYXRpbmcgdGhhdCBCU0FUTiBkZWNvZGluZyBmYWlsZWQuXG4gICAqIFRoaXMgdHlwaWNhbGx5IG1lYW5zIHRoYXQgdGhlIGRhdGEgY291bGQgbm90IGJlIGRlY29kZWQgdG8gdGhlIGV4cGVjdGVkIHR5cGUuXG4gICAqL1xuICBCc2F0bkRlY29kZUVycm9yOiAzLFxuICAvKipcbiAgICogRXJyb3IgaW5kaWNhdGluZyB0aGF0IGEgc3BlY2lmaWVkIHRhYmxlIGRvZXMgbm90IGV4aXN0LlxuICAgKi9cbiAgTm9TdWNoVGFibGU6IDQsXG4gIC8qKlxuICAgKiBFcnJvciBpbmRpY2F0aW5nIHRoYXQgYSBzcGVjaWZpZWQgaW5kZXggZG9lcyBub3QgZXhpc3QuXG4gICAqL1xuICBOb1N1Y2hJbmRleDogNSxcbiAgLyoqXG4gICAqIEVycm9yIGluZGljYXRpbmcgdGhhdCBhIHNwZWNpZmllZCByb3cgaXRlcmF0b3IgaXMgbm90IHZhbGlkLlxuICAgKi9cbiAgTm9TdWNoSXRlcjogNixcbiAgLyoqXG4gICAqIEVycm9yIGluZGljYXRpbmcgdGhhdCBhIHNwZWNpZmllZCBjb25zb2xlIHRpbWVyIGRvZXMgbm90IGV4aXN0LlxuICAgKi9cbiAgTm9TdWNoQ29uc29sZVRpbWVyOiA3LFxuICAvKipcbiAgICogRXJyb3IgaW5kaWNhdGluZyB0aGF0IGEgc3BlY2lmaWVkIGJ5dGVzIHNvdXJjZSBvciBzaW5rIGlzIG5vdCB2YWxpZC5cbiAgICovXG4gIE5vU3VjaEJ5dGVzOiA4LFxuICAvKipcbiAgICogRXJyb3IgaW5kaWNhdGluZyB0aGF0IGEgcHJvdmlkZWQgc2luayBoYXMgbm8gbW9yZSBzcGFjZSBsZWZ0LlxuICAgKi9cbiAgTm9TcGFjZTogOSxcbiAgLyoqXG4gICAqIEVycm9yIGluZGljYXRpbmcgdGhhdCB0aGVyZSBpcyBubyBtb3JlIHNwYWNlIGluIHRoZSBkYXRhYmFzZS5cbiAgICovXG4gIEJ1ZmZlclRvb1NtYWxsOiAxMSxcbiAgLyoqXG4gICAqIEVycm9yIGluZGljYXRpbmcgdGhhdCBhIHZhbHVlIHdpdGggYSBnaXZlbiB1bmlxdWUgaWRlbnRpZmllciBhbHJlYWR5IGV4aXN0cy5cbiAgICovXG4gIFVuaXF1ZUFscmVhZHlFeGlzdHM6IDEyLFxuICAvKipcbiAgICogRXJyb3IgaW5kaWNhdGluZyB0aGF0IHRoZSBzcGVjaWZpZWQgZGVsYXkgaW4gc2NoZWR1bGluZyBhIHJvdyB3YXMgdG9vIGxvbmcuXG4gICAqL1xuICBTY2hlZHVsZUF0RGVsYXlUb29Mb25nOiAxMyxcbiAgLyoqXG4gICAqIEVycm9yIGluZGljYXRpbmcgdGhhdCBhbiBpbmRleCB3YXMgbm90IHVuaXF1ZSB3aGVuIGl0IHdhcyBleHBlY3RlZCB0byBiZS5cbiAgICovXG4gIEluZGV4Tm90VW5pcXVlOiAxNCxcbiAgLyoqXG4gICAqIEVycm9yIGluZGljYXRpbmcgdGhhdCBhbiBpbmRleCB3YXMgbm90IHVuaXF1ZSB3aGVuIGl0IHdhcyBleHBlY3RlZCB0byBiZS5cbiAgICovXG4gIE5vU3VjaFJvdzogMTUsXG4gIC8qKlxuICAgKiBFcnJvciBpbmRpY2F0aW5nIHRoYXQgYW4gYXV0by1pbmNyZW1lbnQgc2VxdWVuY2UgaGFzIG92ZXJmbG93ZWQuXG4gICAqL1xuICBBdXRvSW5jT3ZlcmZsb3c6IDE2LFxuICBXb3VsZEJsb2NrVHJhbnNhY3Rpb246IDE3LFxuICBUcmFuc2FjdGlvbk5vdEFub255bW91czogMTgsXG4gIFRyYW5zYWN0aW9uSXNSZWFkT25seTogMTksXG4gIFRyYW5zYWN0aW9uSXNNdXQ6IDIwLFxuICBIdHRwRXJyb3I6IDIxXG59O1xuZnVuY3Rpb24gbWFwRW50cmllcyh4LCBmKSB7XG4gIHJldHVybiBPYmplY3QuZnJvbUVudHJpZXMoXG4gICAgT2JqZWN0LmVudHJpZXMoeCkubWFwKChbaywgdl0pID0+IFtrLCBmKGssIHYpXSlcbiAgKTtcbn1cbnZhciBlcnJub1RvQ2xhc3MgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xudmFyIGVycm9ycyA9IE9iamVjdC5mcmVlemUoXG4gIG1hcEVudHJpZXMoZXJyb3JEYXRhLCAobmFtZSwgY29kZSkgPT4ge1xuICAgIGNvbnN0IGNscyA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShcbiAgICAgIGNsYXNzIGV4dGVuZHMgU3BhY2V0aW1lSG9zdEVycm9yIHtcbiAgICAgICAgZ2V0IG5hbWUoKSB7XG4gICAgICAgICAgcmV0dXJuIG5hbWU7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBcIm5hbWVcIixcbiAgICAgIHsgdmFsdWU6IG5hbWUsIHdyaXRhYmxlOiBmYWxzZSB9XG4gICAgKTtcbiAgICBlcnJub1RvQ2xhc3Muc2V0KGNvZGUsIGNscyk7XG4gICAgcmV0dXJuIGNscztcbiAgfSlcbik7XG5mdW5jdGlvbiBnZXRFcnJvckNvbnN0cnVjdG9yKGNvZGUpIHtcbiAgcmV0dXJuIGVycm5vVG9DbGFzcy5nZXQoY29kZSkgPz8gU3BhY2V0aW1lSG9zdEVycm9yO1xufVxuXG4vLyAuLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vcHVyZS1yYW5kQDcuMC4xL25vZGVfbW9kdWxlcy9wdXJlLXJhbmQvbGliL2VzbS9kaXN0cmlidXRpb24vVW5zYWZlVW5pZm9ybUJpZ0ludERpc3RyaWJ1dGlvbi5qc1xudmFyIFNCaWdJbnQgPSB0eXBlb2YgQmlnSW50ICE9PSBcInVuZGVmaW5lZFwiID8gQmlnSW50IDogdm9pZCAwO1xudmFyIE9uZSA9IHR5cGVvZiBCaWdJbnQgIT09IFwidW5kZWZpbmVkXCIgPyBCaWdJbnQoMSkgOiB2b2lkIDA7XG52YXIgVGhpcnR5VHdvID0gdHlwZW9mIEJpZ0ludCAhPT0gXCJ1bmRlZmluZWRcIiA/IEJpZ0ludCgzMikgOiB2b2lkIDA7XG52YXIgTnVtVmFsdWVzID0gdHlwZW9mIEJpZ0ludCAhPT0gXCJ1bmRlZmluZWRcIiA/IEJpZ0ludCg0Mjk0OTY3Mjk2KSA6IHZvaWQgMDtcbmZ1bmN0aW9uIHVuc2FmZVVuaWZvcm1CaWdJbnREaXN0cmlidXRpb24oZnJvbSwgdG8sIHJuZykge1xuICB2YXIgZGlmZiA9IHRvIC0gZnJvbSArIE9uZTtcbiAgdmFyIEZpbmFsTnVtVmFsdWVzID0gTnVtVmFsdWVzO1xuICB2YXIgTnVtSXRlcmF0aW9ucyA9IDE7XG4gIHdoaWxlIChGaW5hbE51bVZhbHVlcyA8IGRpZmYpIHtcbiAgICBGaW5hbE51bVZhbHVlcyA8PD0gVGhpcnR5VHdvO1xuICAgICsrTnVtSXRlcmF0aW9ucztcbiAgfVxuICB2YXIgdmFsdWUgPSBnZW5lcmF0ZU5leHQoTnVtSXRlcmF0aW9ucywgcm5nKTtcbiAgaWYgKHZhbHVlIDwgZGlmZikge1xuICAgIHJldHVybiB2YWx1ZSArIGZyb207XG4gIH1cbiAgaWYgKHZhbHVlICsgZGlmZiA8IEZpbmFsTnVtVmFsdWVzKSB7XG4gICAgcmV0dXJuIHZhbHVlICUgZGlmZiArIGZyb207XG4gIH1cbiAgdmFyIE1heEFjY2VwdGVkUmFuZG9tID0gRmluYWxOdW1WYWx1ZXMgLSBGaW5hbE51bVZhbHVlcyAlIGRpZmY7XG4gIHdoaWxlICh2YWx1ZSA+PSBNYXhBY2NlcHRlZFJhbmRvbSkge1xuICAgIHZhbHVlID0gZ2VuZXJhdGVOZXh0KE51bUl0ZXJhdGlvbnMsIHJuZyk7XG4gIH1cbiAgcmV0dXJuIHZhbHVlICUgZGlmZiArIGZyb207XG59XG5mdW5jdGlvbiBnZW5lcmF0ZU5leHQoTnVtSXRlcmF0aW9ucywgcm5nKSB7XG4gIHZhciB2YWx1ZSA9IFNCaWdJbnQocm5nLnVuc2FmZU5leHQoKSArIDIxNDc0ODM2NDgpO1xuICBmb3IgKHZhciBudW0gPSAxOyBudW0gPCBOdW1JdGVyYXRpb25zOyArK251bSkge1xuICAgIHZhciBvdXQgPSBybmcudW5zYWZlTmV4dCgpO1xuICAgIHZhbHVlID0gKHZhbHVlIDw8IFRoaXJ0eVR3bykgKyBTQmlnSW50KG91dCArIDIxNDc0ODM2NDgpO1xuICB9XG4gIHJldHVybiB2YWx1ZTtcbn1cblxuLy8gLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3B1cmUtcmFuZEA3LjAuMS9ub2RlX21vZHVsZXMvcHVyZS1yYW5kL2xpYi9lc20vZGlzdHJpYnV0aW9uL2ludGVybmFscy9VbnNhZmVVbmlmb3JtSW50RGlzdHJpYnV0aW9uSW50ZXJuYWwuanNcbmZ1bmN0aW9uIHVuc2FmZVVuaWZvcm1JbnREaXN0cmlidXRpb25JbnRlcm5hbChyYW5nZVNpemUsIHJuZykge1xuICB2YXIgTWF4QWxsb3dlZCA9IHJhbmdlU2l6ZSA+IDIgPyB+fig0Mjk0OTY3Mjk2IC8gcmFuZ2VTaXplKSAqIHJhbmdlU2l6ZSA6IDQyOTQ5NjcyOTY7XG4gIHZhciBkZWx0YVYgPSBybmcudW5zYWZlTmV4dCgpICsgMjE0NzQ4MzY0ODtcbiAgd2hpbGUgKGRlbHRhViA+PSBNYXhBbGxvd2VkKSB7XG4gICAgZGVsdGFWID0gcm5nLnVuc2FmZU5leHQoKSArIDIxNDc0ODM2NDg7XG4gIH1cbiAgcmV0dXJuIGRlbHRhViAlIHJhbmdlU2l6ZTtcbn1cblxuLy8gLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3B1cmUtcmFuZEA3LjAuMS9ub2RlX21vZHVsZXMvcHVyZS1yYW5kL2xpYi9lc20vZGlzdHJpYnV0aW9uL2ludGVybmFscy9BcnJheUludDY0LmpzXG5mdW5jdGlvbiBmcm9tTnVtYmVyVG9BcnJheUludDY0KG91dCwgbikge1xuICBpZiAobiA8IDApIHtcbiAgICB2YXIgcG9zTiA9IC1uO1xuICAgIG91dC5zaWduID0gLTE7XG4gICAgb3V0LmRhdGFbMF0gPSB+fihwb3NOIC8gNDI5NDk2NzI5Nik7XG4gICAgb3V0LmRhdGFbMV0gPSBwb3NOID4+PiAwO1xuICB9IGVsc2Uge1xuICAgIG91dC5zaWduID0gMTtcbiAgICBvdXQuZGF0YVswXSA9IH5+KG4gLyA0Mjk0OTY3Mjk2KTtcbiAgICBvdXQuZGF0YVsxXSA9IG4gPj4+IDA7XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cbmZ1bmN0aW9uIHN1YnN0cmFjdEFycmF5SW50NjQob3V0LCBhcnJheUludEEsIGFycmF5SW50Qikge1xuICB2YXIgbG93QSA9IGFycmF5SW50QS5kYXRhWzFdO1xuICB2YXIgaGlnaEEgPSBhcnJheUludEEuZGF0YVswXTtcbiAgdmFyIHNpZ25BID0gYXJyYXlJbnRBLnNpZ247XG4gIHZhciBsb3dCID0gYXJyYXlJbnRCLmRhdGFbMV07XG4gIHZhciBoaWdoQiA9IGFycmF5SW50Qi5kYXRhWzBdO1xuICB2YXIgc2lnbkIgPSBhcnJheUludEIuc2lnbjtcbiAgb3V0LnNpZ24gPSAxO1xuICBpZiAoc2lnbkEgPT09IDEgJiYgc2lnbkIgPT09IC0xKSB7XG4gICAgdmFyIGxvd18xID0gbG93QSArIGxvd0I7XG4gICAgdmFyIGhpZ2ggPSBoaWdoQSArIGhpZ2hCICsgKGxvd18xID4gNDI5NDk2NzI5NSA/IDEgOiAwKTtcbiAgICBvdXQuZGF0YVswXSA9IGhpZ2ggPj4+IDA7XG4gICAgb3V0LmRhdGFbMV0gPSBsb3dfMSA+Pj4gMDtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIHZhciBsb3dGaXJzdCA9IGxvd0E7XG4gIHZhciBoaWdoRmlyc3QgPSBoaWdoQTtcbiAgdmFyIGxvd1NlY29uZCA9IGxvd0I7XG4gIHZhciBoaWdoU2Vjb25kID0gaGlnaEI7XG4gIGlmIChzaWduQSA9PT0gLTEpIHtcbiAgICBsb3dGaXJzdCA9IGxvd0I7XG4gICAgaGlnaEZpcnN0ID0gaGlnaEI7XG4gICAgbG93U2Vjb25kID0gbG93QTtcbiAgICBoaWdoU2Vjb25kID0gaGlnaEE7XG4gIH1cbiAgdmFyIHJlbWluZGVyTG93ID0gMDtcbiAgdmFyIGxvdyA9IGxvd0ZpcnN0IC0gbG93U2Vjb25kO1xuICBpZiAobG93IDwgMCkge1xuICAgIHJlbWluZGVyTG93ID0gMTtcbiAgICBsb3cgPSBsb3cgPj4+IDA7XG4gIH1cbiAgb3V0LmRhdGFbMF0gPSBoaWdoRmlyc3QgLSBoaWdoU2Vjb25kIC0gcmVtaW5kZXJMb3c7XG4gIG91dC5kYXRhWzFdID0gbG93O1xuICByZXR1cm4gb3V0O1xufVxuXG4vLyAuLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vcHVyZS1yYW5kQDcuMC4xL25vZGVfbW9kdWxlcy9wdXJlLXJhbmQvbGliL2VzbS9kaXN0cmlidXRpb24vaW50ZXJuYWxzL1Vuc2FmZVVuaWZvcm1BcnJheUludERpc3RyaWJ1dGlvbkludGVybmFsLmpzXG5mdW5jdGlvbiB1bnNhZmVVbmlmb3JtQXJyYXlJbnREaXN0cmlidXRpb25JbnRlcm5hbChvdXQsIHJhbmdlU2l6ZSwgcm5nKSB7XG4gIHZhciByYW5nZUxlbmd0aCA9IHJhbmdlU2l6ZS5sZW5ndGg7XG4gIHdoaWxlICh0cnVlKSB7XG4gICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCAhPT0gcmFuZ2VMZW5ndGg7ICsraW5kZXgpIHtcbiAgICAgIHZhciBpbmRleFJhbmdlU2l6ZSA9IGluZGV4ID09PSAwID8gcmFuZ2VTaXplWzBdICsgMSA6IDQyOTQ5NjcyOTY7XG4gICAgICB2YXIgZyA9IHVuc2FmZVVuaWZvcm1JbnREaXN0cmlidXRpb25JbnRlcm5hbChpbmRleFJhbmdlU2l6ZSwgcm5nKTtcbiAgICAgIG91dFtpbmRleF0gPSBnO1xuICAgIH1cbiAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4ICE9PSByYW5nZUxlbmd0aDsgKytpbmRleCkge1xuICAgICAgdmFyIGN1cnJlbnQgPSBvdXRbaW5kZXhdO1xuICAgICAgdmFyIGN1cnJlbnRJblJhbmdlID0gcmFuZ2VTaXplW2luZGV4XTtcbiAgICAgIGlmIChjdXJyZW50IDwgY3VycmVudEluUmFuZ2UpIHtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICAgIH0gZWxzZSBpZiAoY3VycmVudCA+IGN1cnJlbnRJblJhbmdlKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vLyAuLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vcHVyZS1yYW5kQDcuMC4xL25vZGVfbW9kdWxlcy9wdXJlLXJhbmQvbGliL2VzbS9kaXN0cmlidXRpb24vVW5zYWZlVW5pZm9ybUludERpc3RyaWJ1dGlvbi5qc1xudmFyIHNhZmVOdW1iZXJNYXhTYWZlSW50ZWdlciA9IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSO1xudmFyIHNoYXJlZEEgPSB7IHNpZ246IDEsIGRhdGE6IFswLCAwXSB9O1xudmFyIHNoYXJlZEIgPSB7IHNpZ246IDEsIGRhdGE6IFswLCAwXSB9O1xudmFyIHNoYXJlZEMgPSB7IHNpZ246IDEsIGRhdGE6IFswLCAwXSB9O1xudmFyIHNoYXJlZERhdGEgPSBbMCwgMF07XG5mdW5jdGlvbiB1bmlmb3JtTGFyZ2VJbnRJbnRlcm5hbChmcm9tLCB0bywgcmFuZ2VTaXplLCBybmcpIHtcbiAgdmFyIHJhbmdlU2l6ZUFycmF5SW50VmFsdWUgPSByYW5nZVNpemUgPD0gc2FmZU51bWJlck1heFNhZmVJbnRlZ2VyID8gZnJvbU51bWJlclRvQXJyYXlJbnQ2NChzaGFyZWRDLCByYW5nZVNpemUpIDogc3Vic3RyYWN0QXJyYXlJbnQ2NChzaGFyZWRDLCBmcm9tTnVtYmVyVG9BcnJheUludDY0KHNoYXJlZEEsIHRvKSwgZnJvbU51bWJlclRvQXJyYXlJbnQ2NChzaGFyZWRCLCBmcm9tKSk7XG4gIGlmIChyYW5nZVNpemVBcnJheUludFZhbHVlLmRhdGFbMV0gPT09IDQyOTQ5NjcyOTUpIHtcbiAgICByYW5nZVNpemVBcnJheUludFZhbHVlLmRhdGFbMF0gKz0gMTtcbiAgICByYW5nZVNpemVBcnJheUludFZhbHVlLmRhdGFbMV0gPSAwO1xuICB9IGVsc2Uge1xuICAgIHJhbmdlU2l6ZUFycmF5SW50VmFsdWUuZGF0YVsxXSArPSAxO1xuICB9XG4gIHVuc2FmZVVuaWZvcm1BcnJheUludERpc3RyaWJ1dGlvbkludGVybmFsKHNoYXJlZERhdGEsIHJhbmdlU2l6ZUFycmF5SW50VmFsdWUuZGF0YSwgcm5nKTtcbiAgcmV0dXJuIHNoYXJlZERhdGFbMF0gKiA0Mjk0OTY3Mjk2ICsgc2hhcmVkRGF0YVsxXSArIGZyb207XG59XG5mdW5jdGlvbiB1bnNhZmVVbmlmb3JtSW50RGlzdHJpYnV0aW9uKGZyb20sIHRvLCBybmcpIHtcbiAgdmFyIHJhbmdlU2l6ZSA9IHRvIC0gZnJvbTtcbiAgaWYgKHJhbmdlU2l6ZSA8PSA0Mjk0OTY3Mjk1KSB7XG4gICAgdmFyIGcgPSB1bnNhZmVVbmlmb3JtSW50RGlzdHJpYnV0aW9uSW50ZXJuYWwocmFuZ2VTaXplICsgMSwgcm5nKTtcbiAgICByZXR1cm4gZyArIGZyb207XG4gIH1cbiAgcmV0dXJuIHVuaWZvcm1MYXJnZUludEludGVybmFsKGZyb20sIHRvLCByYW5nZVNpemUsIHJuZyk7XG59XG5cbi8vIC4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9wdXJlLXJhbmRANy4wLjEvbm9kZV9tb2R1bGVzL3B1cmUtcmFuZC9saWIvZXNtL2dlbmVyYXRvci9Yb3JvU2hpcm8uanNcbnZhciBYb3JvU2hpcm8xMjhQbHVzID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBYb3JvU2hpcm8xMjhQbHVzMihzMDEsIHMwMCwgczExLCBzMTApIHtcbiAgICB0aGlzLnMwMSA9IHMwMTtcbiAgICB0aGlzLnMwMCA9IHMwMDtcbiAgICB0aGlzLnMxMSA9IHMxMTtcbiAgICB0aGlzLnMxMCA9IHMxMDtcbiAgfVxuICBYb3JvU2hpcm8xMjhQbHVzMi5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbmV3IFhvcm9TaGlybzEyOFBsdXMyKHRoaXMuczAxLCB0aGlzLnMwMCwgdGhpcy5zMTEsIHRoaXMuczEwKTtcbiAgfTtcbiAgWG9yb1NoaXJvMTI4UGx1czIucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgbmV4dFJuZyA9IG5ldyBYb3JvU2hpcm8xMjhQbHVzMih0aGlzLnMwMSwgdGhpcy5zMDAsIHRoaXMuczExLCB0aGlzLnMxMCk7XG4gICAgdmFyIG91dCA9IG5leHRSbmcudW5zYWZlTmV4dCgpO1xuICAgIHJldHVybiBbb3V0LCBuZXh0Um5nXTtcbiAgfTtcbiAgWG9yb1NoaXJvMTI4UGx1czIucHJvdG90eXBlLnVuc2FmZU5leHQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgb3V0ID0gdGhpcy5zMDAgKyB0aGlzLnMxMCB8IDA7XG4gICAgdmFyIGEwID0gdGhpcy5zMTAgXiB0aGlzLnMwMDtcbiAgICB2YXIgYTEgPSB0aGlzLnMxMSBeIHRoaXMuczAxO1xuICAgIHZhciBzMDAgPSB0aGlzLnMwMDtcbiAgICB2YXIgczAxID0gdGhpcy5zMDE7XG4gICAgdGhpcy5zMDAgPSBzMDAgPDwgMjQgXiBzMDEgPj4+IDggXiBhMCBeIGEwIDw8IDE2O1xuICAgIHRoaXMuczAxID0gczAxIDw8IDI0IF4gczAwID4+PiA4IF4gYTEgXiAoYTEgPDwgMTYgfCBhMCA+Pj4gMTYpO1xuICAgIHRoaXMuczEwID0gYTEgPDwgNSBeIGEwID4+PiAyNztcbiAgICB0aGlzLnMxMSA9IGEwIDw8IDUgXiBhMSA+Pj4gMjc7XG4gICAgcmV0dXJuIG91dDtcbiAgfTtcbiAgWG9yb1NoaXJvMTI4UGx1czIucHJvdG90eXBlLmp1bXAgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgbmV4dFJuZyA9IG5ldyBYb3JvU2hpcm8xMjhQbHVzMih0aGlzLnMwMSwgdGhpcy5zMDAsIHRoaXMuczExLCB0aGlzLnMxMCk7XG4gICAgbmV4dFJuZy51bnNhZmVKdW1wKCk7XG4gICAgcmV0dXJuIG5leHRSbmc7XG4gIH07XG4gIFhvcm9TaGlybzEyOFBsdXMyLnByb3RvdHlwZS51bnNhZmVKdW1wID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIG5zMDEgPSAwO1xuICAgIHZhciBuczAwID0gMDtcbiAgICB2YXIgbnMxMSA9IDA7XG4gICAgdmFyIG5zMTAgPSAwO1xuICAgIHZhciBqdW1wID0gWzM2Mzk5NTY2NDUsIDM3NTA3NTcwMTIsIDEyNjE1Njg1MDgsIDM4NjQyNjMzNV07XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgIT09IDQ7ICsraSkge1xuICAgICAgZm9yICh2YXIgbWFzayA9IDE7IG1hc2s7IG1hc2sgPDw9IDEpIHtcbiAgICAgICAgaWYgKGp1bXBbaV0gJiBtYXNrKSB7XG4gICAgICAgICAgbnMwMSBePSB0aGlzLnMwMTtcbiAgICAgICAgICBuczAwIF49IHRoaXMuczAwO1xuICAgICAgICAgIG5zMTEgXj0gdGhpcy5zMTE7XG4gICAgICAgICAgbnMxMCBePSB0aGlzLnMxMDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnVuc2FmZU5leHQoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5zMDEgPSBuczAxO1xuICAgIHRoaXMuczAwID0gbnMwMDtcbiAgICB0aGlzLnMxMSA9IG5zMTE7XG4gICAgdGhpcy5zMTAgPSBuczEwO1xuICB9O1xuICBYb3JvU2hpcm8xMjhQbHVzMi5wcm90b3R5cGUuZ2V0U3RhdGUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gW3RoaXMuczAxLCB0aGlzLnMwMCwgdGhpcy5zMTEsIHRoaXMuczEwXTtcbiAgfTtcbiAgcmV0dXJuIFhvcm9TaGlybzEyOFBsdXMyO1xufSkoKTtcbmZ1bmN0aW9uIGZyb21TdGF0ZShzdGF0ZSkge1xuICB2YXIgdmFsaWQgPSBzdGF0ZS5sZW5ndGggPT09IDQ7XG4gIGlmICghdmFsaWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgc3RhdGUgbXVzdCBoYXZlIGJlZW4gcHJvZHVjZWQgYnkgYSB4b3Jvc2hpcm8xMjhwbHVzIFJhbmRvbUdlbmVyYXRvclwiKTtcbiAgfVxuICByZXR1cm4gbmV3IFhvcm9TaGlybzEyOFBsdXMoc3RhdGVbMF0sIHN0YXRlWzFdLCBzdGF0ZVsyXSwgc3RhdGVbM10pO1xufVxudmFyIHhvcm9zaGlybzEyOHBsdXMgPSBPYmplY3QuYXNzaWduKGZ1bmN0aW9uKHNlZWQpIHtcbiAgcmV0dXJuIG5ldyBYb3JvU2hpcm8xMjhQbHVzKC0xLCB+c2VlZCwgc2VlZCB8IDAsIDApO1xufSwgeyBmcm9tU3RhdGUgfSk7XG5cbi8vIHNyYy9zZXJ2ZXIvcm5nLnRzXG52YXIgeyBhc1VpbnROIH0gPSBCaWdJbnQ7XG5mdW5jdGlvbiBwY2czMihzdGF0ZSkge1xuICBjb25zdCBNVUwgPSA2MzY0MTM2MjIzODQ2NzkzMDA1bjtcbiAgY29uc3QgSU5DID0gMTE2MzQ1ODAwMjc0NjIyNjA3MjNuO1xuICBzdGF0ZSA9IGFzVWludE4oNjQsIHN0YXRlICogTVVMICsgSU5DKTtcbiAgY29uc3QgeG9yc2hpZnRlZCA9IE51bWJlcihhc1VpbnROKDMyLCAoc3RhdGUgPj4gMThuIF4gc3RhdGUpID4+IDI3bikpO1xuICBjb25zdCByb3QgPSBOdW1iZXIoYXNVaW50TigzMiwgc3RhdGUgPj4gNTluKSk7XG4gIHJldHVybiB4b3JzaGlmdGVkID4+IHJvdCB8IHhvcnNoaWZ0ZWQgPDwgMzIgLSByb3Q7XG59XG5mdW5jdGlvbiBnZW5lcmF0ZUZsb2F0NjQocm5nKSB7XG4gIGNvbnN0IGcxID0gdW5zYWZlVW5pZm9ybUludERpc3RyaWJ1dGlvbigwLCAoMSA8PCAyNikgLSAxLCBybmcpO1xuICBjb25zdCBnMiA9IHVuc2FmZVVuaWZvcm1JbnREaXN0cmlidXRpb24oMCwgKDEgPDwgMjcpIC0gMSwgcm5nKTtcbiAgY29uc3QgdmFsdWUgPSAoZzEgKiBNYXRoLnBvdygyLCAyNykgKyBnMikgKiBNYXRoLnBvdygyLCAtNTMpO1xuICByZXR1cm4gdmFsdWU7XG59XG5mdW5jdGlvbiBtYWtlUmFuZG9tKHNlZWQpIHtcbiAgY29uc3Qgcm5nID0geG9yb3NoaXJvMTI4cGx1cyhwY2czMihzZWVkLm1pY3Jvc1NpbmNlVW5peEVwb2NoKSk7XG4gIGNvbnN0IHJhbmRvbSA9ICgpID0+IGdlbmVyYXRlRmxvYXQ2NChybmcpO1xuICByYW5kb20uZmlsbCA9IChhcnJheSkgPT4ge1xuICAgIGNvbnN0IGVsZW0gPSBhcnJheS5hdCgwKTtcbiAgICBpZiAodHlwZW9mIGVsZW0gPT09IFwiYmlnaW50XCIpIHtcbiAgICAgIGNvbnN0IHVwcGVyID0gKDFuIDw8IEJpZ0ludChhcnJheS5CWVRFU19QRVJfRUxFTUVOVCAqIDgpKSAtIDFuO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICBhcnJheVtpXSA9IHVuc2FmZVVuaWZvcm1CaWdJbnREaXN0cmlidXRpb24oMG4sIHVwcGVyLCBybmcpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGVsZW0gPT09IFwibnVtYmVyXCIpIHtcbiAgICAgIGNvbnN0IHVwcGVyID0gKDEgPDwgYXJyYXkuQllURVNfUEVSX0VMRU1FTlQgKiA4KSAtIDE7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGFycmF5W2ldID0gdW5zYWZlVW5pZm9ybUludERpc3RyaWJ1dGlvbigwLCB1cHBlciwgcm5nKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGFycmF5O1xuICB9O1xuICByYW5kb20udWludDMyID0gKCkgPT4gcm5nLnVuc2FmZU5leHQoKTtcbiAgcmFuZG9tLmludGVnZXJJblJhbmdlID0gKG1pbiwgbWF4KSA9PiB1bnNhZmVVbmlmb3JtSW50RGlzdHJpYnV0aW9uKG1pbiwgbWF4LCBybmcpO1xuICByYW5kb20uYmlnaW50SW5SYW5nZSA9IChtaW4sIG1heCkgPT4gdW5zYWZlVW5pZm9ybUJpZ0ludERpc3RyaWJ1dGlvbihtaW4sIG1heCwgcm5nKTtcbiAgcmV0dXJuIHJhbmRvbTtcbn1cblxuLy8gc3JjL3NlcnZlci9ydW50aW1lLnRzXG52YXIgeyBmcmVlemUgfSA9IE9iamVjdDtcbnZhciBzeXMgPSBfc3lzY2FsbHMyXzA7XG5mdW5jdGlvbiBwYXJzZUpzb25PYmplY3QoanNvbikge1xuICBsZXQgdmFsdWU7XG4gIHRyeSB7XG4gICAgdmFsdWUgPSBKU09OLnBhcnNlKGpzb24pO1xuICB9IGNhdGNoIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIEpTT046IGZhaWxlZCB0byBwYXJzZSBzdHJpbmdcIik7XG4gIH1cbiAgaWYgKHZhbHVlID09PSBudWxsIHx8IHR5cGVvZiB2YWx1ZSAhPT0gXCJvYmplY3RcIiB8fCBBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkV4cGVjdGVkIGEgSlNPTiBvYmplY3QgYXQgdGhlIHRvcCBsZXZlbFwiKTtcbiAgfVxuICByZXR1cm4gdmFsdWU7XG59XG52YXIgSnd0Q2xhaW1zSW1wbCA9IGNsYXNzIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgSnd0Q2xhaW1zIGluc3RhbmNlLlxuICAgKiBAcGFyYW0gcmF3UGF5bG9hZCBUaGUgSldUIHBheWxvYWQgYXMgYSByYXcgSlNPTiBzdHJpbmcuXG4gICAqIEBwYXJhbSBpZGVudGl0eSBUaGUgaWRlbnRpdHkgZm9yIHRoaXMgSldULiBXZSBhcmUgb25seSB0YWtpbmcgdGhpcyBiZWNhdXNlIHdlIGRvbid0IGhhdmUgYSBibGFrZTMgaW1wbGVtZW50YXRpb24gKHdoaWNoIHdlIG5lZWQgdG8gY29tcHV0ZSBpdCkuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihyYXdQYXlsb2FkLCBpZGVudGl0eSkge1xuICAgIHRoaXMucmF3UGF5bG9hZCA9IHJhd1BheWxvYWQ7XG4gICAgdGhpcy5mdWxsUGF5bG9hZCA9IHBhcnNlSnNvbk9iamVjdChyYXdQYXlsb2FkKTtcbiAgICB0aGlzLl9pZGVudGl0eSA9IGlkZW50aXR5O1xuICB9XG4gIGZ1bGxQYXlsb2FkO1xuICBfaWRlbnRpdHk7XG4gIGdldCBpZGVudGl0eSgpIHtcbiAgICByZXR1cm4gdGhpcy5faWRlbnRpdHk7XG4gIH1cbiAgZ2V0IHN1YmplY3QoKSB7XG4gICAgcmV0dXJuIHRoaXMuZnVsbFBheWxvYWRbXCJzdWJcIl07XG4gIH1cbiAgZ2V0IGlzc3VlcigpIHtcbiAgICByZXR1cm4gdGhpcy5mdWxsUGF5bG9hZFtcImlzc1wiXTtcbiAgfVxuICBnZXQgYXVkaWVuY2UoKSB7XG4gICAgY29uc3QgYXVkID0gdGhpcy5mdWxsUGF5bG9hZFtcImF1ZFwiXTtcbiAgICBpZiAoYXVkID09IG51bGwpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgcmV0dXJuIHR5cGVvZiBhdWQgPT09IFwic3RyaW5nXCIgPyBbYXVkXSA6IGF1ZDtcbiAgfVxufTtcbnZhciBBdXRoQ3R4SW1wbCA9IGNsYXNzIF9BdXRoQ3R4SW1wbCB7XG4gIGlzSW50ZXJuYWw7XG4gIC8vIFNvdXJjZSBvZiB0aGUgSldUIHBheWxvYWQgc3RyaW5nLCBpZiB0aGVyZSBpcyBvbmUuXG4gIF9qd3RTb3VyY2U7XG4gIC8vIFdoZXRoZXIgd2UgaGF2ZSBpbml0aWFsaXplZCB0aGUgSldUIGNsYWltcy5cbiAgX2luaXRpYWxpemVkSldUID0gZmFsc2U7XG4gIF9qd3RDbGFpbXM7XG4gIF9zZW5kZXJJZGVudGl0eTtcbiAgY29uc3RydWN0b3Iob3B0cykge1xuICAgIHRoaXMuaXNJbnRlcm5hbCA9IG9wdHMuaXNJbnRlcm5hbDtcbiAgICB0aGlzLl9qd3RTb3VyY2UgPSBvcHRzLmp3dFNvdXJjZTtcbiAgICB0aGlzLl9zZW5kZXJJZGVudGl0eSA9IG9wdHMuc2VuZGVySWRlbnRpdHk7XG4gIH1cbiAgX2luaXRpYWxpemVKV1QoKSB7XG4gICAgaWYgKHRoaXMuX2luaXRpYWxpemVkSldUKSByZXR1cm47XG4gICAgdGhpcy5faW5pdGlhbGl6ZWRKV1QgPSB0cnVlO1xuICAgIGNvbnN0IHRva2VuID0gdGhpcy5fand0U291cmNlKCk7XG4gICAgaWYgKCF0b2tlbikge1xuICAgICAgdGhpcy5fand0Q2xhaW1zID0gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fand0Q2xhaW1zID0gbmV3IEp3dENsYWltc0ltcGwodG9rZW4sIHRoaXMuX3NlbmRlcklkZW50aXR5KTtcbiAgICB9XG4gICAgT2JqZWN0LmZyZWV6ZSh0aGlzKTtcbiAgfVxuICAvKiogTGF6aWx5IGNvbXB1dGUgd2hldGhlciBhIEpXVCBleGlzdHMgYW5kIGlzIHBhcnNlYWJsZS4gKi9cbiAgZ2V0IGhhc0pXVCgpIHtcbiAgICB0aGlzLl9pbml0aWFsaXplSldUKCk7XG4gICAgcmV0dXJuIHRoaXMuX2p3dENsYWltcyAhPT0gbnVsbDtcbiAgfVxuICAvKiogTGF6aWx5IHBhcnNlIHRoZSBKd3RDbGFpbXMgb25seSB3aGVuIGFjY2Vzc2VkLiAqL1xuICBnZXQgand0KCkge1xuICAgIHRoaXMuX2luaXRpYWxpemVKV1QoKTtcbiAgICByZXR1cm4gdGhpcy5fand0Q2xhaW1zO1xuICB9XG4gIC8qKiBDcmVhdGUgYSBjb250ZXh0IHJlcHJlc2VudGluZyBpbnRlcm5hbCAobm9uLXVzZXIpIHJlcXVlc3RzLiAqL1xuICBzdGF0aWMgaW50ZXJuYWwoKSB7XG4gICAgcmV0dXJuIG5ldyBfQXV0aEN0eEltcGwoe1xuICAgICAgaXNJbnRlcm5hbDogdHJ1ZSxcbiAgICAgIGp3dFNvdXJjZTogKCkgPT4gbnVsbCxcbiAgICAgIHNlbmRlcklkZW50aXR5OiBJZGVudGl0eS56ZXJvKClcbiAgICB9KTtcbiAgfVxuICAvKiogSWYgdGhlcmUgaXMgYSBjb25uZWN0aW9uIGlkLCBsb29rIHVwIHRoZSBKV1QgcGF5bG9hZCBmcm9tIHRoZSBzeXN0ZW0gdGFibGVzLiAqL1xuICBzdGF0aWMgZnJvbVN5c3RlbVRhYmxlcyhjb25uZWN0aW9uSWQsIHNlbmRlcikge1xuICAgIGlmIChjb25uZWN0aW9uSWQgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBuZXcgX0F1dGhDdHhJbXBsKHtcbiAgICAgICAgaXNJbnRlcm5hbDogZmFsc2UsXG4gICAgICAgIGp3dFNvdXJjZTogKCkgPT4gbnVsbCxcbiAgICAgICAgc2VuZGVySWRlbnRpdHk6IHNlbmRlclxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgX0F1dGhDdHhJbXBsKHtcbiAgICAgIGlzSW50ZXJuYWw6IGZhbHNlLFxuICAgICAgand0U291cmNlOiAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHBheWxvYWRCdWYgPSBzeXMuZ2V0X2p3dF9wYXlsb2FkKGNvbm5lY3Rpb25JZC5fX2Nvbm5lY3Rpb25faWRfXyk7XG4gICAgICAgIGlmIChwYXlsb2FkQnVmLmxlbmd0aCA9PT0gMCkgcmV0dXJuIG51bGw7XG4gICAgICAgIGNvbnN0IHBheWxvYWRTdHIgPSBuZXcgVGV4dERlY29kZXIoKS5kZWNvZGUocGF5bG9hZEJ1Zik7XG4gICAgICAgIHJldHVybiBwYXlsb2FkU3RyO1xuICAgICAgfSxcbiAgICAgIHNlbmRlcklkZW50aXR5OiBzZW5kZXJcbiAgICB9KTtcbiAgfVxufTtcbnZhciBSZWR1Y2VyQ3R4SW1wbCA9IGNsYXNzIFJlZHVjZXJDdHgge1xuICAjaWRlbnRpdHk7XG4gICNzZW5kZXJBdXRoO1xuICAjdXVpZENvdW50ZXI7XG4gICNyYW5kb207XG4gIHNlbmRlcjtcbiAgdGltZXN0YW1wO1xuICBjb25uZWN0aW9uSWQ7XG4gIGRiO1xuICBjb25zdHJ1Y3RvcihzZW5kZXIsIHRpbWVzdGFtcCwgY29ubmVjdGlvbklkLCBkYlZpZXcpIHtcbiAgICBPYmplY3Quc2VhbCh0aGlzKTtcbiAgICB0aGlzLnNlbmRlciA9IHNlbmRlcjtcbiAgICB0aGlzLnRpbWVzdGFtcCA9IHRpbWVzdGFtcDtcbiAgICB0aGlzLmNvbm5lY3Rpb25JZCA9IGNvbm5lY3Rpb25JZDtcbiAgICB0aGlzLmRiID0gZGJWaWV3O1xuICB9XG4gIC8qKiBSZXNldCB0aGUgYFJlZHVjZXJDdHhgIHRvIGJlIHVzZWQgZm9yIGEgbmV3IHRyYW5zYWN0aW9uICovXG4gIHN0YXRpYyByZXNldChtZSwgc2VuZGVyLCB0aW1lc3RhbXAsIGNvbm5lY3Rpb25JZCkge1xuICAgIG1lLnNlbmRlciA9IHNlbmRlcjtcbiAgICBtZS50aW1lc3RhbXAgPSB0aW1lc3RhbXA7XG4gICAgbWUuY29ubmVjdGlvbklkID0gY29ubmVjdGlvbklkO1xuICAgIG1lLiN1dWlkQ291bnRlciA9IHZvaWQgMDtcbiAgICBtZS4jc2VuZGVyQXV0aCA9IHZvaWQgMDtcbiAgfVxuICBnZXQgaWRlbnRpdHkoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2lkZW50aXR5ID8/PSBuZXcgSWRlbnRpdHkoc3lzLmlkZW50aXR5KCkpO1xuICB9XG4gIGdldCBzZW5kZXJBdXRoKCkge1xuICAgIHJldHVybiB0aGlzLiNzZW5kZXJBdXRoID8/PSBBdXRoQ3R4SW1wbC5mcm9tU3lzdGVtVGFibGVzKFxuICAgICAgdGhpcy5jb25uZWN0aW9uSWQsXG4gICAgICB0aGlzLnNlbmRlclxuICAgICk7XG4gIH1cbiAgZ2V0IHJhbmRvbSgpIHtcbiAgICByZXR1cm4gdGhpcy4jcmFuZG9tID8/PSBtYWtlUmFuZG9tKHRoaXMudGltZXN0YW1wKTtcbiAgfVxuICAvKipcbiAgICogQ3JlYXRlIGEgbmV3IHJhbmRvbSB7QGxpbmsgVXVpZH0gYHY0YCB1c2luZyB0aGlzIGBSZWR1Y2VyQ3R4YCdzIFJORy5cbiAgICovXG4gIG5ld1V1aWRWNCgpIHtcbiAgICBjb25zdCBieXRlcyA9IHRoaXMucmFuZG9tLmZpbGwobmV3IFVpbnQ4QXJyYXkoMTYpKTtcbiAgICByZXR1cm4gVXVpZC5mcm9tUmFuZG9tQnl0ZXNWNChieXRlcyk7XG4gIH1cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyBzb3J0YWJsZSB7QGxpbmsgVXVpZH0gYHY3YCB1c2luZyB0aGlzIGBSZWR1Y2VyQ3R4YCdzIFJORywgY291bnRlcixcbiAgICogYW5kIHRpbWVzdGFtcC5cbiAgICovXG4gIG5ld1V1aWRWNygpIHtcbiAgICBjb25zdCBieXRlcyA9IHRoaXMucmFuZG9tLmZpbGwobmV3IFVpbnQ4QXJyYXkoNCkpO1xuICAgIGNvbnN0IGNvdW50ZXIgPSB0aGlzLiN1dWlkQ291bnRlciA/Pz0geyB2YWx1ZTogMCB9O1xuICAgIHJldHVybiBVdWlkLmZyb21Db3VudGVyVjcoY291bnRlciwgdGhpcy50aW1lc3RhbXAsIGJ5dGVzKTtcbiAgfVxufTtcbnZhciBjYWxsVXNlckZ1bmN0aW9uID0gZnVuY3Rpb24gX19zcGFjZXRpbWVkYl9lbmRfc2hvcnRfYmFja3RyYWNlKGZuLCAuLi5hcmdzKSB7XG4gIHJldHVybiBmbiguLi5hcmdzKTtcbn07XG52YXIgbWFrZUhvb2tzID0gKHNjaGVtYTIpID0+IG5ldyBNb2R1bGVIb29rc0ltcGwoc2NoZW1hMik7XG52YXIgTW9kdWxlSG9va3NJbXBsID0gY2xhc3Mge1xuICAjc2NoZW1hO1xuICAjZGJWaWV3XztcbiAgI3JlZHVjZXJBcmdzRGVzZXJpYWxpemVycztcbiAgLyoqIENhY2hlIHRoZSBgUmVkdWNlckN0eGAgb2JqZWN0IHRvIGF2b2lkIGFsbG9jYXRpbmcgYW5ldyBmb3IgZXZlciByZWR1Y2VyIGNhbGwuICovXG4gICNyZWR1Y2VyQ3R4XztcbiAgY29uc3RydWN0b3Ioc2NoZW1hMikge1xuICAgIHRoaXMuI3NjaGVtYSA9IHNjaGVtYTI7XG4gICAgdGhpcy4jcmVkdWNlckFyZ3NEZXNlcmlhbGl6ZXJzID0gc2NoZW1hMi5tb2R1bGVEZWYucmVkdWNlcnMubWFwKFxuICAgICAgKHsgcGFyYW1zIH0pID0+IFByb2R1Y3RUeXBlLm1ha2VEZXNlcmlhbGl6ZXIocGFyYW1zLCBzY2hlbWEyLnR5cGVzcGFjZSlcbiAgICApO1xuICB9XG4gIGdldCAjZGJWaWV3KCkge1xuICAgIHJldHVybiB0aGlzLiNkYlZpZXdfID8/PSBmcmVlemUoXG4gICAgICBPYmplY3QuZnJvbUVudHJpZXMoXG4gICAgICAgIE9iamVjdC52YWx1ZXModGhpcy4jc2NoZW1hLnNjaGVtYVR5cGUudGFibGVzKS5tYXAoKHRhYmxlMikgPT4gW1xuICAgICAgICAgIHRhYmxlMi5hY2Nlc3Nvck5hbWUsXG4gICAgICAgICAgbWFrZVRhYmxlVmlldyh0aGlzLiNzY2hlbWEudHlwZXNwYWNlLCB0YWJsZTIudGFibGVEZWYpXG4gICAgICAgIF0pXG4gICAgICApXG4gICAgKTtcbiAgfVxuICBnZXQgI3JlZHVjZXJDdHgoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3JlZHVjZXJDdHhfID8/PSBuZXcgUmVkdWNlckN0eEltcGwoXG4gICAgICBJZGVudGl0eS56ZXJvKCksXG4gICAgICBUaW1lc3RhbXAuVU5JWF9FUE9DSCxcbiAgICAgIG51bGwsXG4gICAgICB0aGlzLiNkYlZpZXdcbiAgICApO1xuICB9XG4gIF9fZGVzY3JpYmVfbW9kdWxlX18oKSB7XG4gICAgY29uc3Qgd3JpdGVyID0gbmV3IEJpbmFyeVdyaXRlcigxMjgpO1xuICAgIFJhd01vZHVsZURlZi5zZXJpYWxpemUoXG4gICAgICB3cml0ZXIsXG4gICAgICBSYXdNb2R1bGVEZWYuVjEwKHRoaXMuI3NjaGVtYS5yYXdNb2R1bGVEZWZWMTAoKSlcbiAgICApO1xuICAgIHJldHVybiB3cml0ZXIuZ2V0QnVmZmVyKCk7XG4gIH1cbiAgX19nZXRfZXJyb3JfY29uc3RydWN0b3JfXyhjb2RlKSB7XG4gICAgcmV0dXJuIGdldEVycm9yQ29uc3RydWN0b3IoY29kZSk7XG4gIH1cbiAgZ2V0IF9fc2VuZGVyX2Vycm9yX2NsYXNzX18oKSB7XG4gICAgcmV0dXJuIFNlbmRlckVycm9yO1xuICB9XG4gIF9fY2FsbF9yZWR1Y2VyX18ocmVkdWNlcklkLCBzZW5kZXIsIGNvbm5JZCwgdGltZXN0YW1wLCBhcmdzQnVmKSB7XG4gICAgY29uc3QgbW9kdWxlQ3R4ID0gdGhpcy4jc2NoZW1hO1xuICAgIGNvbnN0IGRlc2VyaWFsaXplQXJncyA9IHRoaXMuI3JlZHVjZXJBcmdzRGVzZXJpYWxpemVyc1tyZWR1Y2VySWRdO1xuICAgIEJJTkFSWV9SRUFERVIucmVzZXQoYXJnc0J1Zik7XG4gICAgY29uc3QgYXJncyA9IGRlc2VyaWFsaXplQXJncyhCSU5BUllfUkVBREVSKTtcbiAgICBjb25zdCBzZW5kZXJJZGVudGl0eSA9IG5ldyBJZGVudGl0eShzZW5kZXIpO1xuICAgIGNvbnN0IGN0eCA9IHRoaXMuI3JlZHVjZXJDdHg7XG4gICAgUmVkdWNlckN0eEltcGwucmVzZXQoXG4gICAgICBjdHgsXG4gICAgICBzZW5kZXJJZGVudGl0eSxcbiAgICAgIG5ldyBUaW1lc3RhbXAodGltZXN0YW1wKSxcbiAgICAgIENvbm5lY3Rpb25JZC5udWxsSWZaZXJvKG5ldyBDb25uZWN0aW9uSWQoY29ubklkKSlcbiAgICApO1xuICAgIGNhbGxVc2VyRnVuY3Rpb24obW9kdWxlQ3R4LnJlZHVjZXJzW3JlZHVjZXJJZF0sIGN0eCwgYXJncyk7XG4gIH1cbiAgX19jYWxsX3ZpZXdfXyhpZCwgc2VuZGVyLCBhcmdzQnVmKSB7XG4gICAgY29uc3QgbW9kdWxlQ3R4ID0gdGhpcy4jc2NoZW1hO1xuICAgIGNvbnN0IHsgZm4sIGRlc2VyaWFsaXplUGFyYW1zLCBzZXJpYWxpemVSZXR1cm4sIHJldHVyblR5cGVCYXNlU2l6ZSB9ID0gbW9kdWxlQ3R4LnZpZXdzW2lkXTtcbiAgICBjb25zdCBjdHggPSBmcmVlemUoe1xuICAgICAgc2VuZGVyOiBuZXcgSWRlbnRpdHkoc2VuZGVyKSxcbiAgICAgIC8vIHRoaXMgaXMgdGhlIG5vbi1yZWFkb25seSBEYlZpZXcsIGJ1dCB0aGUgdHlwaW5nIGZvciB0aGUgdXNlciB3aWxsIGJlXG4gICAgICAvLyB0aGUgcmVhZG9ubHkgb25lLCBhbmQgaWYgdGhleSBkbyBjYWxsIG11dGF0aW5nIGZ1bmN0aW9ucyBpdCB3aWxsIGZhaWxcbiAgICAgIC8vIGF0IHJ1bnRpbWVcbiAgICAgIGRiOiB0aGlzLiNkYlZpZXcsXG4gICAgICBmcm9tOiBtYWtlUXVlcnlCdWlsZGVyKG1vZHVsZUN0eC5zY2hlbWFUeXBlKVxuICAgIH0pO1xuICAgIGNvbnN0IGFyZ3MgPSBkZXNlcmlhbGl6ZVBhcmFtcyhuZXcgQmluYXJ5UmVhZGVyKGFyZ3NCdWYpKTtcbiAgICBjb25zdCByZXQgPSBjYWxsVXNlckZ1bmN0aW9uKGZuLCBjdHgsIGFyZ3MpO1xuICAgIGNvbnN0IHJldEJ1ZiA9IG5ldyBCaW5hcnlXcml0ZXIocmV0dXJuVHlwZUJhc2VTaXplKTtcbiAgICBpZiAoaXNSb3dUeXBlZFF1ZXJ5KHJldCkpIHtcbiAgICAgIGNvbnN0IHF1ZXJ5ID0gdG9TcWwocmV0KTtcbiAgICAgIFZpZXdSZXN1bHRIZWFkZXIuc2VyaWFsaXplKHJldEJ1ZiwgVmlld1Jlc3VsdEhlYWRlci5SYXdTcWwocXVlcnkpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgVmlld1Jlc3VsdEhlYWRlci5zZXJpYWxpemUocmV0QnVmLCBWaWV3UmVzdWx0SGVhZGVyLlJvd0RhdGEpO1xuICAgICAgc2VyaWFsaXplUmV0dXJuKHJldEJ1ZiwgcmV0KTtcbiAgICB9XG4gICAgcmV0dXJuIHsgZGF0YTogcmV0QnVmLmdldEJ1ZmZlcigpIH07XG4gIH1cbiAgX19jYWxsX3ZpZXdfYW5vbl9fKGlkLCBhcmdzQnVmKSB7XG4gICAgY29uc3QgbW9kdWxlQ3R4ID0gdGhpcy4jc2NoZW1hO1xuICAgIGNvbnN0IHsgZm4sIGRlc2VyaWFsaXplUGFyYW1zLCBzZXJpYWxpemVSZXR1cm4sIHJldHVyblR5cGVCYXNlU2l6ZSB9ID0gbW9kdWxlQ3R4LmFub25WaWV3c1tpZF07XG4gICAgY29uc3QgY3R4ID0gZnJlZXplKHtcbiAgICAgIC8vIHRoaXMgaXMgdGhlIG5vbi1yZWFkb25seSBEYlZpZXcsIGJ1dCB0aGUgdHlwaW5nIGZvciB0aGUgdXNlciB3aWxsIGJlXG4gICAgICAvLyB0aGUgcmVhZG9ubHkgb25lLCBhbmQgaWYgdGhleSBkbyBjYWxsIG11dGF0aW5nIGZ1bmN0aW9ucyBpdCB3aWxsIGZhaWxcbiAgICAgIC8vIGF0IHJ1bnRpbWVcbiAgICAgIGRiOiB0aGlzLiNkYlZpZXcsXG4gICAgICBmcm9tOiBtYWtlUXVlcnlCdWlsZGVyKG1vZHVsZUN0eC5zY2hlbWFUeXBlKVxuICAgIH0pO1xuICAgIGNvbnN0IGFyZ3MgPSBkZXNlcmlhbGl6ZVBhcmFtcyhuZXcgQmluYXJ5UmVhZGVyKGFyZ3NCdWYpKTtcbiAgICBjb25zdCByZXQgPSBjYWxsVXNlckZ1bmN0aW9uKGZuLCBjdHgsIGFyZ3MpO1xuICAgIGNvbnN0IHJldEJ1ZiA9IG5ldyBCaW5hcnlXcml0ZXIocmV0dXJuVHlwZUJhc2VTaXplKTtcbiAgICBpZiAoaXNSb3dUeXBlZFF1ZXJ5KHJldCkpIHtcbiAgICAgIGNvbnN0IHF1ZXJ5ID0gdG9TcWwocmV0KTtcbiAgICAgIFZpZXdSZXN1bHRIZWFkZXIuc2VyaWFsaXplKHJldEJ1ZiwgVmlld1Jlc3VsdEhlYWRlci5SYXdTcWwocXVlcnkpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgVmlld1Jlc3VsdEhlYWRlci5zZXJpYWxpemUocmV0QnVmLCBWaWV3UmVzdWx0SGVhZGVyLlJvd0RhdGEpO1xuICAgICAgc2VyaWFsaXplUmV0dXJuKHJldEJ1ZiwgcmV0KTtcbiAgICB9XG4gICAgcmV0dXJuIHsgZGF0YTogcmV0QnVmLmdldEJ1ZmZlcigpIH07XG4gIH1cbiAgX19jYWxsX3Byb2NlZHVyZV9fKGlkLCBzZW5kZXIsIGNvbm5lY3Rpb25faWQsIHRpbWVzdGFtcCwgYXJncykge1xuICAgIHJldHVybiBjYWxsUHJvY2VkdXJlKFxuICAgICAgdGhpcy4jc2NoZW1hLFxuICAgICAgaWQsXG4gICAgICBuZXcgSWRlbnRpdHkoc2VuZGVyKSxcbiAgICAgIENvbm5lY3Rpb25JZC5udWxsSWZaZXJvKG5ldyBDb25uZWN0aW9uSWQoY29ubmVjdGlvbl9pZCkpLFxuICAgICAgbmV3IFRpbWVzdGFtcCh0aW1lc3RhbXApLFxuICAgICAgYXJncyxcbiAgICAgICgpID0+IHRoaXMuI2RiVmlld1xuICAgICk7XG4gIH1cbn07XG52YXIgQklOQVJZX1dSSVRFUiA9IG5ldyBCaW5hcnlXcml0ZXIoMCk7XG52YXIgQklOQVJZX1JFQURFUiA9IG5ldyBCaW5hcnlSZWFkZXIobmV3IFVpbnQ4QXJyYXkoKSk7XG5mdW5jdGlvbiBtYWtlVGFibGVWaWV3KHR5cGVzcGFjZSwgdGFibGUyKSB7XG4gIGNvbnN0IHRhYmxlX2lkID0gc3lzLnRhYmxlX2lkX2Zyb21fbmFtZSh0YWJsZTIuc291cmNlTmFtZSk7XG4gIGNvbnN0IHJvd1R5cGUgPSB0eXBlc3BhY2UudHlwZXNbdGFibGUyLnByb2R1Y3RUeXBlUmVmXTtcbiAgaWYgKHJvd1R5cGUudGFnICE9PSBcIlByb2R1Y3RcIikge1xuICAgIHRocm93IFwiaW1wb3NzaWJsZVwiO1xuICB9XG4gIGNvbnN0IHNlcmlhbGl6ZVJvdyA9IEFsZ2VicmFpY1R5cGUubWFrZVNlcmlhbGl6ZXIocm93VHlwZSwgdHlwZXNwYWNlKTtcbiAgY29uc3QgZGVzZXJpYWxpemVSb3cgPSBBbGdlYnJhaWNUeXBlLm1ha2VEZXNlcmlhbGl6ZXIocm93VHlwZSwgdHlwZXNwYWNlKTtcbiAgY29uc3Qgc2VxdWVuY2VzID0gdGFibGUyLnNlcXVlbmNlcy5tYXAoKHNlcSkgPT4ge1xuICAgIGNvbnN0IGNvbCA9IHJvd1R5cGUudmFsdWUuZWxlbWVudHNbc2VxLmNvbHVtbl07XG4gICAgY29uc3QgY29sVHlwZSA9IGNvbC5hbGdlYnJhaWNUeXBlO1xuICAgIGxldCBzZXF1ZW5jZVRyaWdnZXI7XG4gICAgc3dpdGNoIChjb2xUeXBlLnRhZykge1xuICAgICAgY2FzZSBcIlU4XCI6XG4gICAgICBjYXNlIFwiSThcIjpcbiAgICAgIGNhc2UgXCJVMTZcIjpcbiAgICAgIGNhc2UgXCJJMTZcIjpcbiAgICAgIGNhc2UgXCJVMzJcIjpcbiAgICAgIGNhc2UgXCJJMzJcIjpcbiAgICAgICAgc2VxdWVuY2VUcmlnZ2VyID0gMDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiVTY0XCI6XG4gICAgICBjYXNlIFwiSTY0XCI6XG4gICAgICBjYXNlIFwiVTEyOFwiOlxuICAgICAgY2FzZSBcIkkxMjhcIjpcbiAgICAgIGNhc2UgXCJVMjU2XCI6XG4gICAgICBjYXNlIFwiSTI1NlwiOlxuICAgICAgICBzZXF1ZW5jZVRyaWdnZXIgPSAwbjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiaW52YWxpZCBzZXF1ZW5jZSB0eXBlXCIpO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgY29sTmFtZTogY29sLm5hbWUsXG4gICAgICBzZXF1ZW5jZVRyaWdnZXIsXG4gICAgICBkZXNlcmlhbGl6ZTogQWxnZWJyYWljVHlwZS5tYWtlRGVzZXJpYWxpemVyKGNvbFR5cGUsIHR5cGVzcGFjZSlcbiAgICB9O1xuICB9KTtcbiAgY29uc3QgaGFzQXV0b0luY3JlbWVudCA9IHNlcXVlbmNlcy5sZW5ndGggPiAwO1xuICBjb25zdCBpdGVyID0gKCkgPT4gdGFibGVJdGVyYXRvcihzeXMuZGF0YXN0b3JlX3RhYmxlX3NjYW5fYnNhdG4odGFibGVfaWQpLCBkZXNlcmlhbGl6ZVJvdyk7XG4gIGNvbnN0IGludGVncmF0ZUdlbmVyYXRlZENvbHVtbnMgPSBoYXNBdXRvSW5jcmVtZW50ID8gKHJvdywgcmV0X2J1ZikgPT4ge1xuICAgIEJJTkFSWV9SRUFERVIucmVzZXQocmV0X2J1Zik7XG4gICAgZm9yIChjb25zdCB7IGNvbE5hbWUsIGRlc2VyaWFsaXplLCBzZXF1ZW5jZVRyaWdnZXIgfSBvZiBzZXF1ZW5jZXMpIHtcbiAgICAgIGlmIChyb3dbY29sTmFtZV0gPT09IHNlcXVlbmNlVHJpZ2dlcikge1xuICAgICAgICByb3dbY29sTmFtZV0gPSBkZXNlcmlhbGl6ZShCSU5BUllfUkVBREVSKTtcbiAgICAgIH1cbiAgICB9XG4gIH0gOiBudWxsO1xuICBjb25zdCB0YWJsZU1ldGhvZHMgPSB7XG4gICAgY291bnQ6ICgpID0+IHN5cy5kYXRhc3RvcmVfdGFibGVfcm93X2NvdW50KHRhYmxlX2lkKSxcbiAgICBpdGVyLFxuICAgIFtTeW1ib2wuaXRlcmF0b3JdOiAoKSA9PiBpdGVyKCksXG4gICAgaW5zZXJ0OiAocm93KSA9PiB7XG4gICAgICBjb25zdCBidWYgPSBMRUFGX0JVRjtcbiAgICAgIEJJTkFSWV9XUklURVIucmVzZXQoYnVmKTtcbiAgICAgIHNlcmlhbGl6ZVJvdyhCSU5BUllfV1JJVEVSLCByb3cpO1xuICAgICAgc3lzLmRhdGFzdG9yZV9pbnNlcnRfYnNhdG4odGFibGVfaWQsIGJ1Zi5idWZmZXIsIEJJTkFSWV9XUklURVIub2Zmc2V0KTtcbiAgICAgIGNvbnN0IHJldCA9IHsgLi4ucm93IH07XG4gICAgICBpbnRlZ3JhdGVHZW5lcmF0ZWRDb2x1bW5zPy4ocmV0LCBidWYudmlldyk7XG4gICAgICByZXR1cm4gcmV0O1xuICAgIH0sXG4gICAgZGVsZXRlOiAocm93KSA9PiB7XG4gICAgICBjb25zdCBidWYgPSBMRUFGX0JVRjtcbiAgICAgIEJJTkFSWV9XUklURVIucmVzZXQoYnVmKTtcbiAgICAgIEJJTkFSWV9XUklURVIud3JpdGVVMzIoMSk7XG4gICAgICBzZXJpYWxpemVSb3coQklOQVJZX1dSSVRFUiwgcm93KTtcbiAgICAgIGNvbnN0IGNvdW50ID0gc3lzLmRhdGFzdG9yZV9kZWxldGVfYWxsX2J5X2VxX2JzYXRuKFxuICAgICAgICB0YWJsZV9pZCxcbiAgICAgICAgYnVmLmJ1ZmZlcixcbiAgICAgICAgQklOQVJZX1dSSVRFUi5vZmZzZXRcbiAgICAgICk7XG4gICAgICByZXR1cm4gY291bnQgPiAwO1xuICAgIH1cbiAgfTtcbiAgY29uc3QgdGFibGVWaWV3ID0gT2JqZWN0LmFzc2lnbihcbiAgICAvKiBAX19QVVJFX18gKi8gT2JqZWN0LmNyZWF0ZShudWxsKSxcbiAgICB0YWJsZU1ldGhvZHNcbiAgKTtcbiAgZm9yIChjb25zdCBpbmRleERlZiBvZiB0YWJsZTIuaW5kZXhlcykge1xuICAgIGNvbnN0IGluZGV4X2lkID0gc3lzLmluZGV4X2lkX2Zyb21fbmFtZShpbmRleERlZi5zb3VyY2VOYW1lKTtcbiAgICBsZXQgY29sdW1uX2lkcztcbiAgICBsZXQgaXNIYXNoSW5kZXggPSBmYWxzZTtcbiAgICBzd2l0Y2ggKGluZGV4RGVmLmFsZ29yaXRobS50YWcpIHtcbiAgICAgIGNhc2UgXCJIYXNoXCI6XG4gICAgICAgIGlzSGFzaEluZGV4ID0gdHJ1ZTtcbiAgICAgICAgY29sdW1uX2lkcyA9IGluZGV4RGVmLmFsZ29yaXRobS52YWx1ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiQlRyZWVcIjpcbiAgICAgICAgY29sdW1uX2lkcyA9IGluZGV4RGVmLmFsZ29yaXRobS52YWx1ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiRGlyZWN0XCI6XG4gICAgICAgIGNvbHVtbl9pZHMgPSBbaW5kZXhEZWYuYWxnb3JpdGhtLnZhbHVlXTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNvbnN0IG51bUNvbHVtbnMgPSBjb2x1bW5faWRzLmxlbmd0aDtcbiAgICBjb25zdCBjb2x1bW5TZXQgPSBuZXcgU2V0KGNvbHVtbl9pZHMpO1xuICAgIGNvbnN0IGlzVW5pcXVlID0gdGFibGUyLmNvbnN0cmFpbnRzLmZpbHRlcigoeCkgPT4geC5kYXRhLnRhZyA9PT0gXCJVbmlxdWVcIikuc29tZSgoeCkgPT4gY29sdW1uU2V0LmlzU3Vic2V0T2YobmV3IFNldCh4LmRhdGEudmFsdWUuY29sdW1ucykpKTtcbiAgICBjb25zdCBpc1ByaW1hcnlLZXkgPSBpc1VuaXF1ZSAmJiBjb2x1bW5faWRzLmxlbmd0aCA9PT0gdGFibGUyLnByaW1hcnlLZXkubGVuZ3RoICYmIGNvbHVtbl9pZHMuZXZlcnkoKGlkLCBpKSA9PiB0YWJsZTIucHJpbWFyeUtleVtpXSA9PT0gaWQpO1xuICAgIGNvbnN0IGluZGV4U2VyaWFsaXplcnMgPSBjb2x1bW5faWRzLm1hcChcbiAgICAgIChpZCkgPT4gQWxnZWJyYWljVHlwZS5tYWtlU2VyaWFsaXplcihcbiAgICAgICAgcm93VHlwZS52YWx1ZS5lbGVtZW50c1tpZF0uYWxnZWJyYWljVHlwZSxcbiAgICAgICAgdHlwZXNwYWNlXG4gICAgICApXG4gICAgKTtcbiAgICBjb25zdCBzZXJpYWxpemVQb2ludCA9IChidWZmZXIsIGNvbFZhbCkgPT4ge1xuICAgICAgQklOQVJZX1dSSVRFUi5yZXNldChidWZmZXIpO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1Db2x1bW5zOyBpKyspIHtcbiAgICAgICAgaW5kZXhTZXJpYWxpemVyc1tpXShCSU5BUllfV1JJVEVSLCBjb2xWYWxbaV0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIEJJTkFSWV9XUklURVIub2Zmc2V0O1xuICAgIH07XG4gICAgY29uc3Qgc2VyaWFsaXplU2luZ2xlRWxlbWVudCA9IG51bUNvbHVtbnMgPT09IDEgPyBpbmRleFNlcmlhbGl6ZXJzWzBdIDogbnVsbDtcbiAgICBjb25zdCBzZXJpYWxpemVTaW5nbGVQb2ludCA9IHNlcmlhbGl6ZVNpbmdsZUVsZW1lbnQgJiYgKChidWZmZXIsIGNvbFZhbCkgPT4ge1xuICAgICAgQklOQVJZX1dSSVRFUi5yZXNldChidWZmZXIpO1xuICAgICAgc2VyaWFsaXplU2luZ2xlRWxlbWVudChCSU5BUllfV1JJVEVSLCBjb2xWYWwpO1xuICAgICAgcmV0dXJuIEJJTkFSWV9XUklURVIub2Zmc2V0O1xuICAgIH0pO1xuICAgIGxldCBpbmRleDtcbiAgICBpZiAoaXNVbmlxdWUgJiYgc2VyaWFsaXplU2luZ2xlUG9pbnQpIHtcbiAgICAgIGNvbnN0IGJhc2UgPSB7XG4gICAgICAgIGZpbmQ6IChjb2xWYWwpID0+IHtcbiAgICAgICAgICBjb25zdCBidWYgPSBMRUFGX0JVRjtcbiAgICAgICAgICBjb25zdCBwb2ludF9sZW4gPSBzZXJpYWxpemVTaW5nbGVQb2ludChidWYsIGNvbFZhbCk7XG4gICAgICAgICAgY29uc3QgaXRlcl9pZCA9IHN5cy5kYXRhc3RvcmVfaW5kZXhfc2Nhbl9wb2ludF9ic2F0bihcbiAgICAgICAgICAgIGluZGV4X2lkLFxuICAgICAgICAgICAgYnVmLmJ1ZmZlcixcbiAgICAgICAgICAgIHBvaW50X2xlblxuICAgICAgICAgICk7XG4gICAgICAgICAgcmV0dXJuIHRhYmxlSXRlcmF0ZU9uZShpdGVyX2lkLCBkZXNlcmlhbGl6ZVJvdyk7XG4gICAgICAgIH0sXG4gICAgICAgIGRlbGV0ZTogKGNvbFZhbCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGJ1ZiA9IExFQUZfQlVGO1xuICAgICAgICAgIGNvbnN0IHBvaW50X2xlbiA9IHNlcmlhbGl6ZVNpbmdsZVBvaW50KGJ1ZiwgY29sVmFsKTtcbiAgICAgICAgICBjb25zdCBudW0gPSBzeXMuZGF0YXN0b3JlX2RlbGV0ZV9ieV9pbmRleF9zY2FuX3BvaW50X2JzYXRuKFxuICAgICAgICAgICAgaW5kZXhfaWQsXG4gICAgICAgICAgICBidWYuYnVmZmVyLFxuICAgICAgICAgICAgcG9pbnRfbGVuXG4gICAgICAgICAgKTtcbiAgICAgICAgICByZXR1cm4gbnVtID4gMDtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGlmIChpc1ByaW1hcnlLZXkpIHtcbiAgICAgICAgYmFzZS51cGRhdGUgPSAocm93KSA9PiB7XG4gICAgICAgICAgY29uc3QgYnVmID0gTEVBRl9CVUY7XG4gICAgICAgICAgQklOQVJZX1dSSVRFUi5yZXNldChidWYpO1xuICAgICAgICAgIHNlcmlhbGl6ZVJvdyhCSU5BUllfV1JJVEVSLCByb3cpO1xuICAgICAgICAgIHN5cy5kYXRhc3RvcmVfdXBkYXRlX2JzYXRuKFxuICAgICAgICAgICAgdGFibGVfaWQsXG4gICAgICAgICAgICBpbmRleF9pZCxcbiAgICAgICAgICAgIGJ1Zi5idWZmZXIsXG4gICAgICAgICAgICBCSU5BUllfV1JJVEVSLm9mZnNldFxuICAgICAgICAgICk7XG4gICAgICAgICAgaW50ZWdyYXRlR2VuZXJhdGVkQ29sdW1ucz8uKHJvdywgYnVmLnZpZXcpO1xuICAgICAgICAgIHJldHVybiByb3c7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpbmRleCA9IGJhc2U7XG4gICAgfSBlbHNlIGlmIChpc1VuaXF1ZSkge1xuICAgICAgY29uc3QgYmFzZSA9IHtcbiAgICAgICAgZmluZDogKGNvbFZhbCkgPT4ge1xuICAgICAgICAgIGlmIChjb2xWYWwubGVuZ3RoICE9PSBudW1Db2x1bW5zKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwid3JvbmcgbnVtYmVyIG9mIGVsZW1lbnRzXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCBidWYgPSBMRUFGX0JVRjtcbiAgICAgICAgICBjb25zdCBwb2ludF9sZW4gPSBzZXJpYWxpemVQb2ludChidWYsIGNvbFZhbCk7XG4gICAgICAgICAgY29uc3QgaXRlcl9pZCA9IHN5cy5kYXRhc3RvcmVfaW5kZXhfc2Nhbl9wb2ludF9ic2F0bihcbiAgICAgICAgICAgIGluZGV4X2lkLFxuICAgICAgICAgICAgYnVmLmJ1ZmZlcixcbiAgICAgICAgICAgIHBvaW50X2xlblxuICAgICAgICAgICk7XG4gICAgICAgICAgcmV0dXJuIHRhYmxlSXRlcmF0ZU9uZShpdGVyX2lkLCBkZXNlcmlhbGl6ZVJvdyk7XG4gICAgICAgIH0sXG4gICAgICAgIGRlbGV0ZTogKGNvbFZhbCkgPT4ge1xuICAgICAgICAgIGlmIChjb2xWYWwubGVuZ3RoICE9PSBudW1Db2x1bW5zKVxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIndyb25nIG51bWJlciBvZiBlbGVtZW50c1wiKTtcbiAgICAgICAgICBjb25zdCBidWYgPSBMRUFGX0JVRjtcbiAgICAgICAgICBjb25zdCBwb2ludF9sZW4gPSBzZXJpYWxpemVQb2ludChidWYsIGNvbFZhbCk7XG4gICAgICAgICAgY29uc3QgbnVtID0gc3lzLmRhdGFzdG9yZV9kZWxldGVfYnlfaW5kZXhfc2Nhbl9wb2ludF9ic2F0bihcbiAgICAgICAgICAgIGluZGV4X2lkLFxuICAgICAgICAgICAgYnVmLmJ1ZmZlcixcbiAgICAgICAgICAgIHBvaW50X2xlblxuICAgICAgICAgICk7XG4gICAgICAgICAgcmV0dXJuIG51bSA+IDA7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBpZiAoaXNQcmltYXJ5S2V5KSB7XG4gICAgICAgIGJhc2UudXBkYXRlID0gKHJvdykgPT4ge1xuICAgICAgICAgIGNvbnN0IGJ1ZiA9IExFQUZfQlVGO1xuICAgICAgICAgIEJJTkFSWV9XUklURVIucmVzZXQoYnVmKTtcbiAgICAgICAgICBzZXJpYWxpemVSb3coQklOQVJZX1dSSVRFUiwgcm93KTtcbiAgICAgICAgICBzeXMuZGF0YXN0b3JlX3VwZGF0ZV9ic2F0bihcbiAgICAgICAgICAgIHRhYmxlX2lkLFxuICAgICAgICAgICAgaW5kZXhfaWQsXG4gICAgICAgICAgICBidWYuYnVmZmVyLFxuICAgICAgICAgICAgQklOQVJZX1dSSVRFUi5vZmZzZXRcbiAgICAgICAgICApO1xuICAgICAgICAgIGludGVncmF0ZUdlbmVyYXRlZENvbHVtbnM/Lihyb3csIGJ1Zi52aWV3KTtcbiAgICAgICAgICByZXR1cm4gcm93O1xuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgaW5kZXggPSBiYXNlO1xuICAgIH0gZWxzZSBpZiAoc2VyaWFsaXplU2luZ2xlUG9pbnQpIHtcbiAgICAgIGNvbnN0IHJhd0luZGV4ID0ge1xuICAgICAgICBmaWx0ZXI6IChyYW5nZSkgPT4ge1xuICAgICAgICAgIGNvbnN0IGJ1ZiA9IExFQUZfQlVGO1xuICAgICAgICAgIGNvbnN0IHBvaW50X2xlbiA9IHNlcmlhbGl6ZVNpbmdsZVBvaW50KGJ1ZiwgcmFuZ2UpO1xuICAgICAgICAgIGNvbnN0IGl0ZXJfaWQgPSBzeXMuZGF0YXN0b3JlX2luZGV4X3NjYW5fcG9pbnRfYnNhdG4oXG4gICAgICAgICAgICBpbmRleF9pZCxcbiAgICAgICAgICAgIGJ1Zi5idWZmZXIsXG4gICAgICAgICAgICBwb2ludF9sZW5cbiAgICAgICAgICApO1xuICAgICAgICAgIHJldHVybiB0YWJsZUl0ZXJhdG9yKGl0ZXJfaWQsIGRlc2VyaWFsaXplUm93KTtcbiAgICAgICAgfSxcbiAgICAgICAgZGVsZXRlOiAocmFuZ2UpID0+IHtcbiAgICAgICAgICBjb25zdCBidWYgPSBMRUFGX0JVRjtcbiAgICAgICAgICBjb25zdCBwb2ludF9sZW4gPSBzZXJpYWxpemVTaW5nbGVQb2ludChidWYsIHJhbmdlKTtcbiAgICAgICAgICByZXR1cm4gc3lzLmRhdGFzdG9yZV9kZWxldGVfYnlfaW5kZXhfc2Nhbl9wb2ludF9ic2F0bihcbiAgICAgICAgICAgIGluZGV4X2lkLFxuICAgICAgICAgICAgYnVmLmJ1ZmZlcixcbiAgICAgICAgICAgIHBvaW50X2xlblxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBpZiAoaXNIYXNoSW5kZXgpIHtcbiAgICAgICAgaW5kZXggPSByYXdJbmRleDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGluZGV4ID0gcmF3SW5kZXg7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChpc0hhc2hJbmRleCkge1xuICAgICAgaW5kZXggPSB7XG4gICAgICAgIGZpbHRlcjogKHJhbmdlKSA9PiB7XG4gICAgICAgICAgY29uc3QgYnVmID0gTEVBRl9CVUY7XG4gICAgICAgICAgY29uc3QgcG9pbnRfbGVuID0gc2VyaWFsaXplUG9pbnQoYnVmLCByYW5nZSk7XG4gICAgICAgICAgY29uc3QgaXRlcl9pZCA9IHN5cy5kYXRhc3RvcmVfaW5kZXhfc2Nhbl9wb2ludF9ic2F0bihcbiAgICAgICAgICAgIGluZGV4X2lkLFxuICAgICAgICAgICAgYnVmLmJ1ZmZlcixcbiAgICAgICAgICAgIHBvaW50X2xlblxuICAgICAgICAgICk7XG4gICAgICAgICAgcmV0dXJuIHRhYmxlSXRlcmF0b3IoaXRlcl9pZCwgZGVzZXJpYWxpemVSb3cpO1xuICAgICAgICB9LFxuICAgICAgICBkZWxldGU6IChyYW5nZSkgPT4ge1xuICAgICAgICAgIGNvbnN0IGJ1ZiA9IExFQUZfQlVGO1xuICAgICAgICAgIGNvbnN0IHBvaW50X2xlbiA9IHNlcmlhbGl6ZVBvaW50KGJ1ZiwgcmFuZ2UpO1xuICAgICAgICAgIHJldHVybiBzeXMuZGF0YXN0b3JlX2RlbGV0ZV9ieV9pbmRleF9zY2FuX3BvaW50X2JzYXRuKFxuICAgICAgICAgICAgaW5kZXhfaWQsXG4gICAgICAgICAgICBidWYuYnVmZmVyLFxuICAgICAgICAgICAgcG9pbnRfbGVuXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3Qgc2VyaWFsaXplUmFuZ2UgPSAoYnVmZmVyLCByYW5nZSkgPT4ge1xuICAgICAgICBpZiAocmFuZ2UubGVuZ3RoID4gbnVtQ29sdW1ucykgdGhyb3cgbmV3IFR5cGVFcnJvcihcInRvbyBtYW55IGVsZW1lbnRzXCIpO1xuICAgICAgICBCSU5BUllfV1JJVEVSLnJlc2V0KGJ1ZmZlcik7XG4gICAgICAgIGNvbnN0IHdyaXRlciA9IEJJTkFSWV9XUklURVI7XG4gICAgICAgIGNvbnN0IHByZWZpeF9lbGVtcyA9IHJhbmdlLmxlbmd0aCAtIDE7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcHJlZml4X2VsZW1zOyBpKyspIHtcbiAgICAgICAgICBpbmRleFNlcmlhbGl6ZXJzW2ldKHdyaXRlciwgcmFuZ2VbaV0pO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJzdGFydE9mZnNldCA9IHdyaXRlci5vZmZzZXQ7XG4gICAgICAgIGNvbnN0IHRlcm0gPSByYW5nZVtyYW5nZS5sZW5ndGggLSAxXTtcbiAgICAgICAgY29uc3Qgc2VyaWFsaXplVGVybSA9IGluZGV4U2VyaWFsaXplcnNbcmFuZ2UubGVuZ3RoIC0gMV07XG4gICAgICAgIGlmICh0ZXJtIGluc3RhbmNlb2YgUmFuZ2UpIHtcbiAgICAgICAgICBjb25zdCB3cml0ZUJvdW5kID0gKGJvdW5kKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB0YWdzID0geyBpbmNsdWRlZDogMCwgZXhjbHVkZWQ6IDEsIHVuYm91bmRlZDogMiB9O1xuICAgICAgICAgICAgd3JpdGVyLndyaXRlVTgodGFnc1tib3VuZC50YWddKTtcbiAgICAgICAgICAgIGlmIChib3VuZC50YWcgIT09IFwidW5ib3VuZGVkXCIpIHNlcmlhbGl6ZVRlcm0od3JpdGVyLCBib3VuZC52YWx1ZSk7XG4gICAgICAgICAgfTtcbiAgICAgICAgICB3cml0ZUJvdW5kKHRlcm0uZnJvbSk7XG4gICAgICAgICAgY29uc3QgcnN0YXJ0TGVuID0gd3JpdGVyLm9mZnNldCAtIHJzdGFydE9mZnNldDtcbiAgICAgICAgICB3cml0ZUJvdW5kKHRlcm0udG8pO1xuICAgICAgICAgIGNvbnN0IHJlbmRMZW4gPSB3cml0ZXIub2Zmc2V0IC0gcnN0YXJ0TGVuO1xuICAgICAgICAgIHJldHVybiBbcnN0YXJ0T2Zmc2V0LCBwcmVmaXhfZWxlbXMsIHJzdGFydExlbiwgcmVuZExlbl07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgd3JpdGVyLndyaXRlVTgoMCk7XG4gICAgICAgICAgc2VyaWFsaXplVGVybSh3cml0ZXIsIHRlcm0pO1xuICAgICAgICAgIGNvbnN0IHJzdGFydExlbiA9IHdyaXRlci5vZmZzZXQ7XG4gICAgICAgICAgY29uc3QgcmVuZExlbiA9IDA7XG4gICAgICAgICAgcmV0dXJuIFtyc3RhcnRPZmZzZXQsIHByZWZpeF9lbGVtcywgcnN0YXJ0TGVuLCByZW5kTGVuXTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGluZGV4ID0ge1xuICAgICAgICBmaWx0ZXI6IChyYW5nZSkgPT4ge1xuICAgICAgICAgIGlmIChyYW5nZS5sZW5ndGggPT09IG51bUNvbHVtbnMpIHtcbiAgICAgICAgICAgIGNvbnN0IGJ1ZiA9IExFQUZfQlVGO1xuICAgICAgICAgICAgY29uc3QgcG9pbnRfbGVuID0gc2VyaWFsaXplUG9pbnQoYnVmLCByYW5nZSk7XG4gICAgICAgICAgICBjb25zdCBpdGVyX2lkID0gc3lzLmRhdGFzdG9yZV9pbmRleF9zY2FuX3BvaW50X2JzYXRuKFxuICAgICAgICAgICAgICBpbmRleF9pZCxcbiAgICAgICAgICAgICAgYnVmLmJ1ZmZlcixcbiAgICAgICAgICAgICAgcG9pbnRfbGVuXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIHRhYmxlSXRlcmF0b3IoaXRlcl9pZCwgZGVzZXJpYWxpemVSb3cpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBidWYgPSBMRUFGX0JVRjtcbiAgICAgICAgICAgIGNvbnN0IGFyZ3MgPSBzZXJpYWxpemVSYW5nZShidWYsIHJhbmdlKTtcbiAgICAgICAgICAgIGNvbnN0IGl0ZXJfaWQgPSBzeXMuZGF0YXN0b3JlX2luZGV4X3NjYW5fcmFuZ2VfYnNhdG4oXG4gICAgICAgICAgICAgIGluZGV4X2lkLFxuICAgICAgICAgICAgICBidWYuYnVmZmVyLFxuICAgICAgICAgICAgICAuLi5hcmdzXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIHRhYmxlSXRlcmF0b3IoaXRlcl9pZCwgZGVzZXJpYWxpemVSb3cpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZGVsZXRlOiAocmFuZ2UpID0+IHtcbiAgICAgICAgICBpZiAocmFuZ2UubGVuZ3RoID09PSBudW1Db2x1bW5zKSB7XG4gICAgICAgICAgICBjb25zdCBidWYgPSBMRUFGX0JVRjtcbiAgICAgICAgICAgIGNvbnN0IHBvaW50X2xlbiA9IHNlcmlhbGl6ZVBvaW50KGJ1ZiwgcmFuZ2UpO1xuICAgICAgICAgICAgcmV0dXJuIHN5cy5kYXRhc3RvcmVfZGVsZXRlX2J5X2luZGV4X3NjYW5fcG9pbnRfYnNhdG4oXG4gICAgICAgICAgICAgIGluZGV4X2lkLFxuICAgICAgICAgICAgICBidWYuYnVmZmVyLFxuICAgICAgICAgICAgICBwb2ludF9sZW5cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGJ1ZiA9IExFQUZfQlVGO1xuICAgICAgICAgICAgY29uc3QgYXJncyA9IHNlcmlhbGl6ZVJhbmdlKGJ1ZiwgcmFuZ2UpO1xuICAgICAgICAgICAgcmV0dXJuIHN5cy5kYXRhc3RvcmVfZGVsZXRlX2J5X2luZGV4X3NjYW5fcmFuZ2VfYnNhdG4oXG4gICAgICAgICAgICAgIGluZGV4X2lkLFxuICAgICAgICAgICAgICBidWYuYnVmZmVyLFxuICAgICAgICAgICAgICAuLi5hcmdzXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG4gICAgaWYgKE9iamVjdC5oYXNPd24odGFibGVWaWV3LCBpbmRleERlZi5hY2Nlc3Nvck5hbWUpKSB7XG4gICAgICBmcmVlemUoT2JqZWN0LmFzc2lnbih0YWJsZVZpZXdbaW5kZXhEZWYuYWNjZXNzb3JOYW1lXSwgaW5kZXgpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGFibGVWaWV3W2luZGV4RGVmLmFjY2Vzc29yTmFtZV0gPSBmcmVlemUoaW5kZXgpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZnJlZXplKHRhYmxlVmlldyk7XG59XG5mdW5jdGlvbiogdGFibGVJdGVyYXRvcihpZCwgZGVzZXJpYWxpemUpIHtcbiAgdXNpbmcgaXRlciA9IG5ldyBJdGVyYXRvckhhbmRsZShpZCk7XG4gIGNvbnN0IGl0ZXJCdWYgPSB0YWtlQnVmKCk7XG4gIHRyeSB7XG4gICAgbGV0IGFtdDtcbiAgICB3aGlsZSAoYW10ID0gaXRlci5hZHZhbmNlKGl0ZXJCdWYpKSB7XG4gICAgICBjb25zdCByZWFkZXIgPSBuZXcgQmluYXJ5UmVhZGVyKGl0ZXJCdWYudmlldyk7XG4gICAgICB3aGlsZSAocmVhZGVyLm9mZnNldCA8IGFtdCkge1xuICAgICAgICB5aWVsZCBkZXNlcmlhbGl6ZShyZWFkZXIpO1xuICAgICAgfVxuICAgIH1cbiAgfSBmaW5hbGx5IHtcbiAgICByZXR1cm5CdWYoaXRlckJ1Zik7XG4gIH1cbn1cbmZ1bmN0aW9uIHRhYmxlSXRlcmF0ZU9uZShpZCwgZGVzZXJpYWxpemUpIHtcbiAgY29uc3QgYnVmID0gTEVBRl9CVUY7XG4gIGNvbnN0IHJldCA9IGFkdmFuY2VJdGVyUmF3KGlkLCBidWYpO1xuICBpZiAocmV0ICE9PSAwKSB7XG4gICAgQklOQVJZX1JFQURFUi5yZXNldChidWYudmlldyk7XG4gICAgcmV0dXJuIGRlc2VyaWFsaXplKEJJTkFSWV9SRUFERVIpO1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuZnVuY3Rpb24gYWR2YW5jZUl0ZXJSYXcoaWQsIGJ1Zikge1xuICB3aGlsZSAodHJ1ZSkge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gMCB8IHN5cy5yb3dfaXRlcl9ic2F0bl9hZHZhbmNlKGlkLCBidWYuYnVmZmVyKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZiAoZSAmJiB0eXBlb2YgZSA9PT0gXCJvYmplY3RcIiAmJiBoYXNPd24oZSwgXCJfX2J1ZmZlcl90b29fc21hbGxfX1wiKSkge1xuICAgICAgICBidWYuZ3JvdyhlLl9fYnVmZmVyX3Rvb19zbWFsbF9fKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICB0aHJvdyBlO1xuICAgIH1cbiAgfVxufVxudmFyIERFRkFVTFRfQlVGRkVSX0NBUEFDSVRZID0gMzIgKiAxMDI0ICogMjtcbnZhciBJVEVSX0JVRlMgPSBbXG4gIG5ldyBSZXNpemFibGVCdWZmZXIoREVGQVVMVF9CVUZGRVJfQ0FQQUNJVFkpXG5dO1xudmFyIElURVJfQlVGX0NPVU5UID0gMTtcbmZ1bmN0aW9uIHRha2VCdWYoKSB7XG4gIHJldHVybiBJVEVSX0JVRl9DT1VOVCA/IElURVJfQlVGU1stLUlURVJfQlVGX0NPVU5UXSA6IG5ldyBSZXNpemFibGVCdWZmZXIoREVGQVVMVF9CVUZGRVJfQ0FQQUNJVFkpO1xufVxuZnVuY3Rpb24gcmV0dXJuQnVmKGJ1Zikge1xuICBJVEVSX0JVRlNbSVRFUl9CVUZfQ09VTlQrK10gPSBidWY7XG59XG52YXIgTEVBRl9CVUYgPSBuZXcgUmVzaXphYmxlQnVmZmVyKERFRkFVTFRfQlVGRkVSX0NBUEFDSVRZKTtcbnZhciBJdGVyYXRvckhhbmRsZSA9IGNsYXNzIF9JdGVyYXRvckhhbmRsZSB7XG4gICNpZDtcbiAgc3RhdGljICNmaW5hbGl6YXRpb25SZWdpc3RyeSA9IG5ldyBGaW5hbGl6YXRpb25SZWdpc3RyeShcbiAgICBzeXMucm93X2l0ZXJfYnNhdG5fY2xvc2VcbiAgKTtcbiAgY29uc3RydWN0b3IoaWQpIHtcbiAgICB0aGlzLiNpZCA9IGlkO1xuICAgIF9JdGVyYXRvckhhbmRsZS4jZmluYWxpemF0aW9uUmVnaXN0cnkucmVnaXN0ZXIodGhpcywgaWQsIHRoaXMpO1xuICB9XG4gIC8qKiBVbnJlZ2lzdGVyIHRoaXMgb2JqZWN0IHdpdGggdGhlIGZpbmFsaXphdGlvbiByZWdpc3RyeSBhbmQgcmV0dXJuIHRoZSBpZCAqL1xuICAjZGV0YWNoKCkge1xuICAgIGNvbnN0IGlkID0gdGhpcy4jaWQ7XG4gICAgdGhpcy4jaWQgPSAtMTtcbiAgICBfSXRlcmF0b3JIYW5kbGUuI2ZpbmFsaXphdGlvblJlZ2lzdHJ5LnVucmVnaXN0ZXIodGhpcyk7XG4gICAgcmV0dXJuIGlkO1xuICB9XG4gIC8qKiBDYWxsIGByb3dfaXRlcl9ic2F0bl9hZHZhbmNlYCwgcmV0dXJuaW5nIDAgaWYgdGhpcyBpdGVyYXRvciBoYXMgYmVlbiBleGhhdXN0ZWQuICovXG4gIGFkdmFuY2UoYnVmKSB7XG4gICAgaWYgKHRoaXMuI2lkID09PSAtMSkgcmV0dXJuIDA7XG4gICAgY29uc3QgcmV0ID0gYWR2YW5jZUl0ZXJSYXcodGhpcy4jaWQsIGJ1Zik7XG4gICAgaWYgKHJldCA8PSAwKSB0aGlzLiNkZXRhY2goKTtcbiAgICByZXR1cm4gcmV0IDwgMCA/IC1yZXQgOiByZXQ7XG4gIH1cbiAgW1N5bWJvbC5kaXNwb3NlXSgpIHtcbiAgICBpZiAodGhpcy4jaWQgPj0gMCkge1xuICAgICAgY29uc3QgaWQgPSB0aGlzLiNkZXRhY2goKTtcbiAgICAgIHN5cy5yb3dfaXRlcl9ic2F0bl9jbG9zZShpZCk7XG4gICAgfVxuICB9XG59O1xuXG4vLyBzcmMvc2VydmVyL2h0dHBfaW50ZXJuYWwudHNcbnZhciB7IGZyZWV6ZTogZnJlZXplMiB9ID0gT2JqZWN0O1xudmFyIHRleHRFbmNvZGVyID0gbmV3IFRleHRFbmNvZGVyKCk7XG52YXIgdGV4dERlY29kZXIgPSBuZXcgVGV4dERlY29kZXIoXG4gIFwidXRmLThcIlxuICAvKiB7IGZhdGFsOiB0cnVlIH0gKi9cbik7XG52YXIgbWFrZVJlc3BvbnNlID0gU3ltYm9sKFwibWFrZVJlc3BvbnNlXCIpO1xudmFyIFN5bmNSZXNwb25zZSA9IGNsYXNzIF9TeW5jUmVzcG9uc2Uge1xuICAjYm9keTtcbiAgI2lubmVyO1xuICBjb25zdHJ1Y3Rvcihib2R5LCBpbml0KSB7XG4gICAgaWYgKGJvZHkgPT0gbnVsbCkge1xuICAgICAgdGhpcy4jYm9keSA9IG51bGw7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgYm9keSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgdGhpcy4jYm9keSA9IGJvZHk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuI2JvZHkgPSBuZXcgVWludDhBcnJheShib2R5KS5idWZmZXI7XG4gICAgfVxuICAgIHRoaXMuI2lubmVyID0ge1xuICAgICAgaGVhZGVyczogbmV3IEhlYWRlcnMoaW5pdD8uaGVhZGVycyksXG4gICAgICBzdGF0dXM6IGluaXQ/LnN0YXR1cyA/PyAyMDAsXG4gICAgICBzdGF0dXNUZXh0OiBpbml0Py5zdGF0dXNUZXh0ID8/IFwiXCIsXG4gICAgICB0eXBlOiBcImRlZmF1bHRcIixcbiAgICAgIHVybDogbnVsbCxcbiAgICAgIGFib3J0ZWQ6IGZhbHNlXG4gICAgfTtcbiAgfVxuICBzdGF0aWMgW21ha2VSZXNwb25zZV0oYm9keSwgaW5uZXIpIHtcbiAgICBjb25zdCBtZSA9IG5ldyBfU3luY1Jlc3BvbnNlKGJvZHkpO1xuICAgIG1lLiNpbm5lciA9IGlubmVyO1xuICAgIHJldHVybiBtZTtcbiAgfVxuICBnZXQgaGVhZGVycygpIHtcbiAgICByZXR1cm4gdGhpcy4jaW5uZXIuaGVhZGVycztcbiAgfVxuICBnZXQgc3RhdHVzKCkge1xuICAgIHJldHVybiB0aGlzLiNpbm5lci5zdGF0dXM7XG4gIH1cbiAgZ2V0IHN0YXR1c1RleHQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2lubmVyLnN0YXR1c1RleHQ7XG4gIH1cbiAgZ2V0IG9rKCkge1xuICAgIHJldHVybiAyMDAgPD0gdGhpcy4jaW5uZXIuc3RhdHVzICYmIHRoaXMuI2lubmVyLnN0YXR1cyA8PSAyOTk7XG4gIH1cbiAgZ2V0IHVybCgpIHtcbiAgICByZXR1cm4gdGhpcy4jaW5uZXIudXJsID8/IFwiXCI7XG4gIH1cbiAgZ2V0IHR5cGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2lubmVyLnR5cGU7XG4gIH1cbiAgYXJyYXlCdWZmZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuYnl0ZXMoKS5idWZmZXI7XG4gIH1cbiAgYnl0ZXMoKSB7XG4gICAgaWYgKHRoaXMuI2JvZHkgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG5ldyBVaW50OEFycmF5KCk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgdGhpcy4jYm9keSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgcmV0dXJuIHRleHRFbmNvZGVyLmVuY29kZSh0aGlzLiNib2R5KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG5ldyBVaW50OEFycmF5KHRoaXMuI2JvZHkpO1xuICAgIH1cbiAgfVxuICBqc29uKCkge1xuICAgIHJldHVybiBKU09OLnBhcnNlKHRoaXMudGV4dCgpKTtcbiAgfVxuICB0ZXh0KCkge1xuICAgIGlmICh0aGlzLiNib2R5ID09IG51bGwpIHtcbiAgICAgIHJldHVybiBcIlwiO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHRoaXMuI2JvZHkgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIHJldHVybiB0aGlzLiNib2R5O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGV4dERlY29kZXIuZGVjb2RlKHRoaXMuI2JvZHkpO1xuICAgIH1cbiAgfVxufTtcbnZhciByZXF1ZXN0QmFzZVNpemUgPSBic2F0bkJhc2VTaXplKHsgdHlwZXM6IFtdIH0sIEh0dHBSZXF1ZXN0LmFsZ2VicmFpY1R5cGUpO1xudmFyIG1ldGhvZHMgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcChbXG4gIFtcIkdFVFwiLCB7IHRhZzogXCJHZXRcIiB9XSxcbiAgW1wiSEVBRFwiLCB7IHRhZzogXCJIZWFkXCIgfV0sXG4gIFtcIlBPU1RcIiwgeyB0YWc6IFwiUG9zdFwiIH1dLFxuICBbXCJQVVRcIiwgeyB0YWc6IFwiUHV0XCIgfV0sXG4gIFtcIkRFTEVURVwiLCB7IHRhZzogXCJEZWxldGVcIiB9XSxcbiAgW1wiQ09OTkVDVFwiLCB7IHRhZzogXCJDb25uZWN0XCIgfV0sXG4gIFtcIk9QVElPTlNcIiwgeyB0YWc6IFwiT3B0aW9uc1wiIH1dLFxuICBbXCJUUkFDRVwiLCB7IHRhZzogXCJUcmFjZVwiIH1dLFxuICBbXCJQQVRDSFwiLCB7IHRhZzogXCJQYXRjaFwiIH1dXG5dKTtcbmZ1bmN0aW9uIGZldGNoKHVybCwgaW5pdCA9IHt9KSB7XG4gIGNvbnN0IG1ldGhvZCA9IG1ldGhvZHMuZ2V0KGluaXQubWV0aG9kPy50b1VwcGVyQ2FzZSgpID8/IFwiR0VUXCIpID8/IHtcbiAgICB0YWc6IFwiRXh0ZW5zaW9uXCIsXG4gICAgdmFsdWU6IGluaXQubWV0aG9kXG4gIH07XG4gIGNvbnN0IGhlYWRlcnMgPSB7XG4gICAgLy8gYW55cyBiZWNhdXNlIHRoZSB0eXBpbmdzIGFyZSB3b25reSAtIHNlZSBjb21tZW50IGluIFN5bmNSZXNwb25zZS5jb25zdHJ1Y3RvclxuICAgIGVudHJpZXM6IGhlYWRlcnNUb0xpc3QobmV3IEhlYWRlcnMoaW5pdC5oZWFkZXJzKSkuZmxhdE1hcCgoW2ssIHZdKSA9PiBBcnJheS5pc0FycmF5KHYpID8gdi5tYXAoKHYyKSA9PiBbaywgdjJdKSA6IFtbaywgdl1dKS5tYXAoKFtuYW1lLCB2YWx1ZV0pID0+ICh7IG5hbWUsIHZhbHVlOiB0ZXh0RW5jb2Rlci5lbmNvZGUodmFsdWUpIH0pKVxuICB9O1xuICBjb25zdCB1cmkgPSBcIlwiICsgdXJsO1xuICBjb25zdCByZXF1ZXN0ID0gZnJlZXplMih7XG4gICAgbWV0aG9kLFxuICAgIGhlYWRlcnMsXG4gICAgdGltZW91dDogaW5pdC50aW1lb3V0LFxuICAgIHVyaSxcbiAgICB2ZXJzaW9uOiB7IHRhZzogXCJIdHRwMTFcIiB9XG4gIH0pO1xuICBjb25zdCByZXF1ZXN0QnVmID0gbmV3IEJpbmFyeVdyaXRlcihyZXF1ZXN0QmFzZVNpemUpO1xuICBIdHRwUmVxdWVzdC5zZXJpYWxpemUocmVxdWVzdEJ1ZiwgcmVxdWVzdCk7XG4gIGNvbnN0IGJvZHkgPSBpbml0LmJvZHkgPT0gbnVsbCA/IG5ldyBVaW50OEFycmF5KCkgOiB0eXBlb2YgaW5pdC5ib2R5ID09PSBcInN0cmluZ1wiID8gaW5pdC5ib2R5IDogbmV3IFVpbnQ4QXJyYXkoaW5pdC5ib2R5KTtcbiAgY29uc3QgW3Jlc3BvbnNlQnVmLCByZXNwb25zZUJvZHldID0gc3lzLnByb2NlZHVyZV9odHRwX3JlcXVlc3QoXG4gICAgcmVxdWVzdEJ1Zi5nZXRCdWZmZXIoKSxcbiAgICBib2R5XG4gICk7XG4gIGNvbnN0IHJlc3BvbnNlID0gSHR0cFJlc3BvbnNlLmRlc2VyaWFsaXplKG5ldyBCaW5hcnlSZWFkZXIocmVzcG9uc2VCdWYpKTtcbiAgcmV0dXJuIFN5bmNSZXNwb25zZVttYWtlUmVzcG9uc2VdKHJlc3BvbnNlQm9keSwge1xuICAgIHR5cGU6IFwiYmFzaWNcIixcbiAgICB1cmw6IHVyaSxcbiAgICBzdGF0dXM6IHJlc3BvbnNlLmNvZGUsXG4gICAgc3RhdHVzVGV4dDogKDAsIGltcG9ydF9zdGF0dXNlcy5kZWZhdWx0KShyZXNwb25zZS5jb2RlKSxcbiAgICBoZWFkZXJzOiBuZXcgSGVhZGVycygpLFxuICAgIGFib3J0ZWQ6IGZhbHNlXG4gIH0pO1xufVxuZnJlZXplMihmZXRjaCk7XG52YXIgaHR0cENsaWVudCA9IGZyZWV6ZTIoeyBmZXRjaCB9KTtcblxuLy8gc3JjL3NlcnZlci9wcm9jZWR1cmVzLnRzXG5mdW5jdGlvbiBtYWtlUHJvY2VkdXJlRXhwb3J0KGN0eCwgb3B0cywgcGFyYW1zLCByZXQsIGZuKSB7XG4gIGNvbnN0IG5hbWUgPSBvcHRzPy5uYW1lO1xuICBjb25zdCBwcm9jZWR1cmVFeHBvcnQgPSAoLi4uYXJncykgPT4gZm4oLi4uYXJncyk7XG4gIHByb2NlZHVyZUV4cG9ydFtleHBvcnRDb250ZXh0XSA9IGN0eDtcbiAgcHJvY2VkdXJlRXhwb3J0W3JlZ2lzdGVyRXhwb3J0XSA9IChjdHgyLCBleHBvcnROYW1lKSA9PiB7XG4gICAgcmVnaXN0ZXJQcm9jZWR1cmUoY3R4MiwgbmFtZSA/PyBleHBvcnROYW1lLCBwYXJhbXMsIHJldCwgZm4pO1xuICAgIGN0eDIuZnVuY3Rpb25FeHBvcnRzLnNldChcbiAgICAgIHByb2NlZHVyZUV4cG9ydCxcbiAgICAgIG5hbWUgPz8gZXhwb3J0TmFtZVxuICAgICk7XG4gIH07XG4gIHJldHVybiBwcm9jZWR1cmVFeHBvcnQ7XG59XG52YXIgVHJhbnNhY3Rpb25DdHhJbXBsID0gY2xhc3MgVHJhbnNhY3Rpb25DdHggZXh0ZW5kcyBSZWR1Y2VyQ3R4SW1wbCB7XG59O1xuZnVuY3Rpb24gcmVnaXN0ZXJQcm9jZWR1cmUoY3R4LCBleHBvcnROYW1lLCBwYXJhbXMsIHJldCwgZm4sIG9wdHMpIHtcbiAgY3R4LmRlZmluZUZ1bmN0aW9uKGV4cG9ydE5hbWUpO1xuICBjb25zdCBwYXJhbXNUeXBlID0ge1xuICAgIGVsZW1lbnRzOiBPYmplY3QuZW50cmllcyhwYXJhbXMpLm1hcCgoW24sIGNdKSA9PiAoe1xuICAgICAgbmFtZTogbixcbiAgICAgIGFsZ2VicmFpY1R5cGU6IGN0eC5yZWdpc3RlclR5cGVzUmVjdXJzaXZlbHkoXG4gICAgICAgIFwidHlwZUJ1aWxkZXJcIiBpbiBjID8gYy50eXBlQnVpbGRlciA6IGNcbiAgICAgICkuYWxnZWJyYWljVHlwZVxuICAgIH0pKVxuICB9O1xuICBjb25zdCByZXR1cm5UeXBlID0gY3R4LnJlZ2lzdGVyVHlwZXNSZWN1cnNpdmVseShyZXQpLmFsZ2VicmFpY1R5cGU7XG4gIGN0eC5tb2R1bGVEZWYucHJvY2VkdXJlcy5wdXNoKHtcbiAgICBzb3VyY2VOYW1lOiBleHBvcnROYW1lLFxuICAgIHBhcmFtczogcGFyYW1zVHlwZSxcbiAgICByZXR1cm5UeXBlLFxuICAgIHZpc2liaWxpdHk6IEZ1bmN0aW9uVmlzaWJpbGl0eS5DbGllbnRDYWxsYWJsZVxuICB9KTtcbiAgY29uc3QgeyB0eXBlc3BhY2UgfSA9IGN0eDtcbiAgY3R4LnByb2NlZHVyZXMucHVzaCh7XG4gICAgZm4sXG4gICAgZGVzZXJpYWxpemVBcmdzOiBQcm9kdWN0VHlwZS5tYWtlRGVzZXJpYWxpemVyKHBhcmFtc1R5cGUsIHR5cGVzcGFjZSksXG4gICAgc2VyaWFsaXplUmV0dXJuOiBBbGdlYnJhaWNUeXBlLm1ha2VTZXJpYWxpemVyKHJldHVyblR5cGUsIHR5cGVzcGFjZSksXG4gICAgcmV0dXJuVHlwZUJhc2VTaXplOiBic2F0bkJhc2VTaXplKHR5cGVzcGFjZSwgcmV0dXJuVHlwZSlcbiAgfSk7XG59XG5mdW5jdGlvbiBjYWxsUHJvY2VkdXJlKG1vZHVsZUN0eCwgaWQsIHNlbmRlciwgY29ubmVjdGlvbklkLCB0aW1lc3RhbXAsIGFyZ3NCdWYsIGRiVmlldykge1xuICBjb25zdCB7IGZuLCBkZXNlcmlhbGl6ZUFyZ3MsIHNlcmlhbGl6ZVJldHVybiwgcmV0dXJuVHlwZUJhc2VTaXplIH0gPSBtb2R1bGVDdHgucHJvY2VkdXJlc1tpZF07XG4gIGNvbnN0IGFyZ3MgPSBkZXNlcmlhbGl6ZUFyZ3MobmV3IEJpbmFyeVJlYWRlcihhcmdzQnVmKSk7XG4gIGNvbnN0IGN0eCA9IG5ldyBQcm9jZWR1cmVDdHhJbXBsKFxuICAgIHNlbmRlcixcbiAgICB0aW1lc3RhbXAsXG4gICAgY29ubmVjdGlvbklkLFxuICAgIGRiVmlld1xuICApO1xuICBjb25zdCByZXQgPSBjYWxsVXNlckZ1bmN0aW9uKGZuLCBjdHgsIGFyZ3MpO1xuICBjb25zdCByZXRCdWYgPSBuZXcgQmluYXJ5V3JpdGVyKHJldHVyblR5cGVCYXNlU2l6ZSk7XG4gIHNlcmlhbGl6ZVJldHVybihyZXRCdWYsIHJldCk7XG4gIHJldHVybiByZXRCdWYuZ2V0QnVmZmVyKCk7XG59XG52YXIgUHJvY2VkdXJlQ3R4SW1wbCA9IGNsYXNzIFByb2NlZHVyZUN0eCB7XG4gIGNvbnN0cnVjdG9yKHNlbmRlciwgdGltZXN0YW1wLCBjb25uZWN0aW9uSWQsIGRiVmlldykge1xuICAgIHRoaXMuc2VuZGVyID0gc2VuZGVyO1xuICAgIHRoaXMudGltZXN0YW1wID0gdGltZXN0YW1wO1xuICAgIHRoaXMuY29ubmVjdGlvbklkID0gY29ubmVjdGlvbklkO1xuICAgIHRoaXMuI2RiVmlldyA9IGRiVmlldztcbiAgfVxuICAjaWRlbnRpdHk7XG4gICN1dWlkQ291bnRlcjtcbiAgI3JhbmRvbTtcbiAgI2RiVmlldztcbiAgZ2V0IGlkZW50aXR5KCkge1xuICAgIHJldHVybiB0aGlzLiNpZGVudGl0eSA/Pz0gbmV3IElkZW50aXR5KHN5cy5pZGVudGl0eSgpKTtcbiAgfVxuICBnZXQgcmFuZG9tKCkge1xuICAgIHJldHVybiB0aGlzLiNyYW5kb20gPz89IG1ha2VSYW5kb20odGhpcy50aW1lc3RhbXApO1xuICB9XG4gIGdldCBodHRwKCkge1xuICAgIHJldHVybiBodHRwQ2xpZW50O1xuICB9XG4gIHdpdGhUeChib2R5KSB7XG4gICAgY29uc3QgcnVuID0gKCkgPT4ge1xuICAgICAgY29uc3QgdGltZXN0YW1wID0gc3lzLnByb2NlZHVyZV9zdGFydF9tdXRfdHgoKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGN0eCA9IG5ldyBUcmFuc2FjdGlvbkN0eEltcGwoXG4gICAgICAgICAgdGhpcy5zZW5kZXIsXG4gICAgICAgICAgbmV3IFRpbWVzdGFtcCh0aW1lc3RhbXApLFxuICAgICAgICAgIHRoaXMuY29ubmVjdGlvbklkLFxuICAgICAgICAgIHRoaXMuI2RiVmlldygpXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiBib2R5KGN0eCk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHN5cy5wcm9jZWR1cmVfYWJvcnRfbXV0X3R4KCk7XG4gICAgICAgIHRocm93IGU7XG4gICAgICB9XG4gICAgfTtcbiAgICBsZXQgcmVzID0gcnVuKCk7XG4gICAgdHJ5IHtcbiAgICAgIHN5cy5wcm9jZWR1cmVfY29tbWl0X211dF90eCgpO1xuICAgICAgcmV0dXJuIHJlcztcbiAgICB9IGNhdGNoIHtcbiAgICB9XG4gICAgY29uc29sZS53YXJuKFwiY29tbWl0dGluZyBhbm9ueW1vdXMgdHJhbnNhY3Rpb24gZmFpbGVkXCIpO1xuICAgIHJlcyA9IHJ1bigpO1xuICAgIHRyeSB7XG4gICAgICBzeXMucHJvY2VkdXJlX2NvbW1pdF9tdXRfdHgoKTtcbiAgICAgIHJldHVybiByZXM7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwidHJhbnNhY3Rpb24gcmV0cnkgZmFpbGVkIGFnYWluXCIsIHsgY2F1c2U6IGUgfSk7XG4gICAgfVxuICB9XG4gIG5ld1V1aWRWNCgpIHtcbiAgICBjb25zdCBieXRlcyA9IHRoaXMucmFuZG9tLmZpbGwobmV3IFVpbnQ4QXJyYXkoMTYpKTtcbiAgICByZXR1cm4gVXVpZC5mcm9tUmFuZG9tQnl0ZXNWNChieXRlcyk7XG4gIH1cbiAgbmV3VXVpZFY3KCkge1xuICAgIGNvbnN0IGJ5dGVzID0gdGhpcy5yYW5kb20uZmlsbChuZXcgVWludDhBcnJheSg0KSk7XG4gICAgY29uc3QgY291bnRlciA9IHRoaXMuI3V1aWRDb3VudGVyID8/PSB7IHZhbHVlOiAwIH07XG4gICAgcmV0dXJuIFV1aWQuZnJvbUNvdW50ZXJWNyhjb3VudGVyLCB0aGlzLnRpbWVzdGFtcCwgYnl0ZXMpO1xuICB9XG59O1xuXG4vLyBzcmMvc2VydmVyL3JlZHVjZXJzLnRzXG5mdW5jdGlvbiBtYWtlUmVkdWNlckV4cG9ydChjdHgsIG9wdHMsIHBhcmFtcywgZm4sIGxpZmVjeWNsZSkge1xuICBjb25zdCByZWR1Y2VyRXhwb3J0ID0gKC4uLmFyZ3MpID0+IGZuKC4uLmFyZ3MpO1xuICByZWR1Y2VyRXhwb3J0W2V4cG9ydENvbnRleHRdID0gY3R4O1xuICByZWR1Y2VyRXhwb3J0W3JlZ2lzdGVyRXhwb3J0XSA9IChjdHgyLCBleHBvcnROYW1lKSA9PiB7XG4gICAgcmVnaXN0ZXJSZWR1Y2VyKGN0eDIsIGV4cG9ydE5hbWUsIHBhcmFtcywgZm4sIG9wdHMsIGxpZmVjeWNsZSk7XG4gICAgY3R4Mi5mdW5jdGlvbkV4cG9ydHMuc2V0KFxuICAgICAgcmVkdWNlckV4cG9ydCxcbiAgICAgIGV4cG9ydE5hbWVcbiAgICApO1xuICB9O1xuICByZXR1cm4gcmVkdWNlckV4cG9ydDtcbn1cbmZ1bmN0aW9uIHJlZ2lzdGVyUmVkdWNlcihjdHgsIGV4cG9ydE5hbWUsIHBhcmFtcywgZm4sIG9wdHMsIGxpZmVjeWNsZSkge1xuICBjdHguZGVmaW5lRnVuY3Rpb24oZXhwb3J0TmFtZSk7XG4gIGlmICghKHBhcmFtcyBpbnN0YW5jZW9mIFJvd0J1aWxkZXIpKSB7XG4gICAgcGFyYW1zID0gbmV3IFJvd0J1aWxkZXIocGFyYW1zKTtcbiAgfVxuICBpZiAocGFyYW1zLnR5cGVOYW1lID09PSB2b2lkIDApIHtcbiAgICBwYXJhbXMudHlwZU5hbWUgPSB0b1Bhc2NhbENhc2UoZXhwb3J0TmFtZSk7XG4gIH1cbiAgY29uc3QgcmVmID0gY3R4LnJlZ2lzdGVyVHlwZXNSZWN1cnNpdmVseShwYXJhbXMpO1xuICBjb25zdCBwYXJhbXNUeXBlID0gY3R4LnJlc29sdmVUeXBlKHJlZikudmFsdWU7XG4gIGNvbnN0IGlzTGlmZWN5Y2xlID0gbGlmZWN5Y2xlICE9IG51bGw7XG4gIGN0eC5tb2R1bGVEZWYucmVkdWNlcnMucHVzaCh7XG4gICAgc291cmNlTmFtZTogZXhwb3J0TmFtZSxcbiAgICBwYXJhbXM6IHBhcmFtc1R5cGUsXG4gICAgLy9Nb2R1bGVEZWYgdmFsaWRhdGlvbiBjb2RlIGlzIHJlc3BvbnNpYmxlIHRvIG1hcmsgcHJpdmF0ZSByZWR1Y2Vyc1xuICAgIHZpc2liaWxpdHk6IEZ1bmN0aW9uVmlzaWJpbGl0eS5DbGllbnRDYWxsYWJsZSxcbiAgICAvL0hhcmRjb2RlZCBmb3Igbm93IC0gcmVkdWNlcnMgZG8gbm90IHJldHVybiB2YWx1ZXMgeWV0XG4gICAgb2tSZXR1cm5UeXBlOiBBbGdlYnJhaWNUeXBlLlByb2R1Y3QoeyBlbGVtZW50czogW10gfSksXG4gICAgZXJyUmV0dXJuVHlwZTogQWxnZWJyYWljVHlwZS5TdHJpbmdcbiAgfSk7XG4gIGlmIChvcHRzPy5uYW1lICE9IG51bGwpIHtcbiAgICBjdHgubW9kdWxlRGVmLmV4cGxpY2l0TmFtZXMuZW50cmllcy5wdXNoKHtcbiAgICAgIHRhZzogXCJGdW5jdGlvblwiLFxuICAgICAgdmFsdWU6IHtcbiAgICAgICAgc291cmNlTmFtZTogZXhwb3J0TmFtZSxcbiAgICAgICAgY2Fub25pY2FsTmFtZTogb3B0cy5uYW1lXG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgaWYgKGlzTGlmZWN5Y2xlKSB7XG4gICAgY3R4Lm1vZHVsZURlZi5saWZlQ3ljbGVSZWR1Y2Vycy5wdXNoKHtcbiAgICAgIGxpZmVjeWNsZVNwZWM6IGxpZmVjeWNsZSxcbiAgICAgIGZ1bmN0aW9uTmFtZTogZXhwb3J0TmFtZVxuICAgIH0pO1xuICB9XG4gIGlmICghZm4ubmFtZSkge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShmbiwgXCJuYW1lXCIsIHsgdmFsdWU6IGV4cG9ydE5hbWUsIHdyaXRhYmxlOiBmYWxzZSB9KTtcbiAgfVxuICBjdHgucmVkdWNlcnMucHVzaChmbik7XG59XG5cbi8vIHNyYy9zZXJ2ZXIvc2NoZW1hLnRzXG52YXIgU2NoZW1hSW5uZXIgPSBjbGFzcyBleHRlbmRzIE1vZHVsZUNvbnRleHQge1xuICBzY2hlbWFUeXBlO1xuICBleGlzdGluZ0Z1bmN0aW9ucyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCk7XG4gIHJlZHVjZXJzID0gW107XG4gIHByb2NlZHVyZXMgPSBbXTtcbiAgdmlld3MgPSBbXTtcbiAgYW5vblZpZXdzID0gW107XG4gIC8qKlxuICAgKiBNYXBzIFJlZHVjZXJFeHBvcnQgb2JqZWN0cyB0byB0aGUgbmFtZSBvZiB0aGUgcmVkdWNlci5cbiAgICogVXNlZCBmb3IgcmVzb2x2aW5nIHRoZSByZWR1Y2VycyBvZiBzY2hlZHVsZWQgdGFibGVzLlxuICAgKi9cbiAgZnVuY3Rpb25FeHBvcnRzID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcbiAgcGVuZGluZ1NjaGVkdWxlcyA9IFtdO1xuICBjb25zdHJ1Y3RvcihnZXRTY2hlbWFUeXBlKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnNjaGVtYVR5cGUgPSBnZXRTY2hlbWFUeXBlKHRoaXMpO1xuICB9XG4gIGRlZmluZUZ1bmN0aW9uKG5hbWUpIHtcbiAgICBpZiAodGhpcy5leGlzdGluZ0Z1bmN0aW9ucy5oYXMobmFtZSkpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgICAgIGBUaGVyZSBpcyBhbHJlYWR5IGEgcmVkdWNlciBvciBwcm9jZWR1cmUgd2l0aCB0aGUgbmFtZSAnJHtuYW1lfSdgXG4gICAgICApO1xuICAgIH1cbiAgICB0aGlzLmV4aXN0aW5nRnVuY3Rpb25zLmFkZChuYW1lKTtcbiAgfVxuICByZXNvbHZlU2NoZWR1bGVzKCkge1xuICAgIGZvciAoY29uc3QgeyByZWR1Y2VyLCBzY2hlZHVsZUF0Q29sLCB0YWJsZU5hbWUgfSBvZiB0aGlzLnBlbmRpbmdTY2hlZHVsZXMpIHtcbiAgICAgIGNvbnN0IGZ1bmN0aW9uTmFtZSA9IHRoaXMuZnVuY3Rpb25FeHBvcnRzLmdldChyZWR1Y2VyKCkpO1xuICAgICAgaWYgKGZ1bmN0aW9uTmFtZSA9PT0gdm9pZCAwKSB7XG4gICAgICAgIGNvbnN0IG1zZyA9IGBUYWJsZSAke3RhYmxlTmFtZX0gZGVmaW5lcyBhIHNjaGVkdWxlLCBidXQgaXQgc2VlbXMgbGlrZSB0aGUgYXNzb2NpYXRlZCBmdW5jdGlvbiB3YXMgbm90IGV4cG9ydGVkLmA7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IobXNnKTtcbiAgICAgIH1cbiAgICAgIHRoaXMubW9kdWxlRGVmLnNjaGVkdWxlcy5wdXNoKHtcbiAgICAgICAgc291cmNlTmFtZTogdm9pZCAwLFxuICAgICAgICB0YWJsZU5hbWUsXG4gICAgICAgIHNjaGVkdWxlQXRDb2wsXG4gICAgICAgIGZ1bmN0aW9uTmFtZVxuICAgICAgfSk7XG4gICAgfVxuICB9XG59O1xudmFyIFNjaGVtYSA9IGNsYXNzIHtcbiAgI2N0eDtcbiAgY29uc3RydWN0b3IoY3R4KSB7XG4gICAgdGhpcy4jY3R4ID0gY3R4O1xuICB9XG4gIFttb2R1bGVIb29rc10oZXhwb3J0cykge1xuICAgIGNvbnN0IHJlZ2lzdGVyZWRTY2hlbWEgPSB0aGlzLiNjdHg7XG4gICAgZm9yIChjb25zdCBbbmFtZSwgbW9kdWxlRXhwb3J0XSBvZiBPYmplY3QuZW50cmllcyhleHBvcnRzKSkge1xuICAgICAgaWYgKG5hbWUgPT09IFwiZGVmYXVsdFwiKSBjb250aW51ZTtcbiAgICAgIGlmICghaXNNb2R1bGVFeHBvcnQobW9kdWxlRXhwb3J0KSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgICAgIFwiZXhwb3J0aW5nIHNvbWV0aGluZyB0aGF0IGlzIG5vdCBhIHNwYWNldGltZSBleHBvcnRcIlxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgY2hlY2tFeHBvcnRDb250ZXh0KG1vZHVsZUV4cG9ydCwgcmVnaXN0ZXJlZFNjaGVtYSk7XG4gICAgICBtb2R1bGVFeHBvcnRbcmVnaXN0ZXJFeHBvcnRdKHJlZ2lzdGVyZWRTY2hlbWEsIG5hbWUpO1xuICAgIH1cbiAgICByZWdpc3RlcmVkU2NoZW1hLnJlc29sdmVTY2hlZHVsZXMoKTtcbiAgICByZXR1cm4gbWFrZUhvb2tzKHJlZ2lzdGVyZWRTY2hlbWEpO1xuICB9XG4gIGdldCBzY2hlbWFUeXBlKCkge1xuICAgIHJldHVybiB0aGlzLiNjdHguc2NoZW1hVHlwZTtcbiAgfVxuICBnZXQgbW9kdWxlRGVmKCkge1xuICAgIHJldHVybiB0aGlzLiNjdHgubW9kdWxlRGVmO1xuICB9XG4gIGdldCB0eXBlc3BhY2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2N0eC50eXBlc3BhY2U7XG4gIH1cbiAgcmVkdWNlciguLi5hcmdzKSB7XG4gICAgbGV0IG9wdHMsIHBhcmFtcyA9IHt9LCBmbjtcbiAgICBzd2l0Y2ggKGFyZ3MubGVuZ3RoKSB7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIFtmbl0gPSBhcmdzO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjoge1xuICAgICAgICBsZXQgYXJnMTtcbiAgICAgICAgW2FyZzEsIGZuXSA9IGFyZ3M7XG4gICAgICAgIGlmICh0eXBlb2YgYXJnMS5uYW1lID09PSBcInN0cmluZ1wiKSBvcHRzID0gYXJnMTtcbiAgICAgICAgZWxzZSBwYXJhbXMgPSBhcmcxO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgMzpcbiAgICAgICAgW29wdHMsIHBhcmFtcywgZm5dID0gYXJncztcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHJldHVybiBtYWtlUmVkdWNlckV4cG9ydCh0aGlzLiNjdHgsIG9wdHMsIHBhcmFtcywgZm4pO1xuICB9XG4gIGluaXQoLi4uYXJncykge1xuICAgIGxldCBvcHRzLCBmbjtcbiAgICBzd2l0Y2ggKGFyZ3MubGVuZ3RoKSB7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIFtmbl0gPSBhcmdzO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgW29wdHMsIGZuXSA9IGFyZ3M7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByZXR1cm4gbWFrZVJlZHVjZXJFeHBvcnQodGhpcy4jY3R4LCBvcHRzLCB7fSwgZm4sIExpZmVjeWNsZS5Jbml0KTtcbiAgfVxuICBjbGllbnRDb25uZWN0ZWQoLi4uYXJncykge1xuICAgIGxldCBvcHRzLCBmbjtcbiAgICBzd2l0Y2ggKGFyZ3MubGVuZ3RoKSB7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIFtmbl0gPSBhcmdzO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgW29wdHMsIGZuXSA9IGFyZ3M7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByZXR1cm4gbWFrZVJlZHVjZXJFeHBvcnQodGhpcy4jY3R4LCBvcHRzLCB7fSwgZm4sIExpZmVjeWNsZS5PbkNvbm5lY3QpO1xuICB9XG4gIGNsaWVudERpc2Nvbm5lY3RlZCguLi5hcmdzKSB7XG4gICAgbGV0IG9wdHMsIGZuO1xuICAgIHN3aXRjaCAoYXJncy5sZW5ndGgpIHtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgW2ZuXSA9IGFyZ3M7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBbb3B0cywgZm5dID0gYXJncztcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHJldHVybiBtYWtlUmVkdWNlckV4cG9ydCh0aGlzLiNjdHgsIG9wdHMsIHt9LCBmbiwgTGlmZWN5Y2xlLk9uRGlzY29ubmVjdCk7XG4gIH1cbiAgdmlldyhvcHRzLCByZXQsIGZuKSB7XG4gICAgcmV0dXJuIG1ha2VWaWV3RXhwb3J0KHRoaXMuI2N0eCwgb3B0cywge30sIHJldCwgZm4pO1xuICB9XG4gIC8vIFRPRE86IHJlLWVuYWJsZSBvbmNlIHBhcmFtZXRlcml6ZWQgdmlld3MgYXJlIHN1cHBvcnRlZCBpbiBTUUxcbiAgLy8gdmlldzxSZXQgZXh0ZW5kcyBWaWV3UmV0dXJuVHlwZUJ1aWxkZXI+KFxuICAvLyAgIG9wdHM6IFZpZXdPcHRzLFxuICAvLyAgIHJldDogUmV0LFxuICAvLyAgIGZuOiBWaWV3Rm48Uywge30sIFJldD5cbiAgLy8gKTogdm9pZDtcbiAgLy8gdmlldzxQYXJhbXMgZXh0ZW5kcyBQYXJhbXNPYmosIFJldCBleHRlbmRzIFZpZXdSZXR1cm5UeXBlQnVpbGRlcj4oXG4gIC8vICAgb3B0czogVmlld09wdHMsXG4gIC8vICAgcGFyYW1zOiBQYXJhbXMsXG4gIC8vICAgcmV0OiBSZXQsXG4gIC8vICAgZm46IFZpZXdGbjxTLCB7fSwgUmV0PlxuICAvLyApOiB2b2lkO1xuICAvLyB2aWV3PFBhcmFtcyBleHRlbmRzIFBhcmFtc09iaiwgUmV0IGV4dGVuZHMgVmlld1JldHVyblR5cGVCdWlsZGVyPihcbiAgLy8gICBvcHRzOiBWaWV3T3B0cyxcbiAgLy8gICBwYXJhbXNPclJldDogUmV0IHwgUGFyYW1zLFxuICAvLyAgIHJldE9yRm46IFZpZXdGbjxTLCB7fSwgUmV0PiB8IFJldCxcbiAgLy8gICBtYXliZUZuPzogVmlld0ZuPFMsIFBhcmFtcywgUmV0PlxuICAvLyApOiB2b2lkIHtcbiAgLy8gICBpZiAodHlwZW9mIHJldE9yRm4gPT09ICdmdW5jdGlvbicpIHtcbiAgLy8gICAgIGRlZmluZVZpZXcobmFtZSwgZmFsc2UsIHt9LCBwYXJhbXNPclJldCBhcyBSZXQsIHJldE9yRm4pO1xuICAvLyAgIH0gZWxzZSB7XG4gIC8vICAgICBkZWZpbmVWaWV3KG5hbWUsIGZhbHNlLCBwYXJhbXNPclJldCBhcyBQYXJhbXMsIHJldE9yRm4sIG1heWJlRm4hKTtcbiAgLy8gICB9XG4gIC8vIH1cbiAgYW5vbnltb3VzVmlldyhvcHRzLCByZXQsIGZuKSB7XG4gICAgcmV0dXJuIG1ha2VBbm9uVmlld0V4cG9ydCh0aGlzLiNjdHgsIG9wdHMsIHt9LCByZXQsIGZuKTtcbiAgfVxuICBwcm9jZWR1cmUoLi4uYXJncykge1xuICAgIGxldCBvcHRzLCBwYXJhbXMgPSB7fSwgcmV0LCBmbjtcbiAgICBzd2l0Y2ggKGFyZ3MubGVuZ3RoKSB7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIFtyZXQsIGZuXSA9IGFyZ3M7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOiB7XG4gICAgICAgIGxldCBhcmcxO1xuICAgICAgICBbYXJnMSwgcmV0LCBmbl0gPSBhcmdzO1xuICAgICAgICBpZiAodHlwZW9mIGFyZzEubmFtZSA9PT0gXCJzdHJpbmdcIikgb3B0cyA9IGFyZzE7XG4gICAgICAgIGVsc2UgcGFyYW1zID0gYXJnMTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIDQ6XG4gICAgICAgIFtvcHRzLCBwYXJhbXMsIHJldCwgZm5dID0gYXJncztcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHJldHVybiBtYWtlUHJvY2VkdXJlRXhwb3J0KHRoaXMuI2N0eCwgb3B0cywgcGFyYW1zLCByZXQsIGZuKTtcbiAgfVxuICAvKipcbiAgICogQnVuZGxlIG11bHRpcGxlIHJlZHVjZXJzLCBwcm9jZWR1cmVzLCBldGMgaW50byBvbmUgdmFsdWUgdG8gZXhwb3J0LlxuICAgKiBUaGUgbmFtZSB0aGV5IHdpbGwgYmUgZXhwb3J0ZWQgd2l0aCBpcyB0aGVpciBjb3JyZXNwb25kaW5nIGtleSBpbiB0aGUgYGV4cG9ydHNgIGFyZ3VtZW50LlxuICAgKi9cbiAgZXhwb3J0R3JvdXAoZXhwb3J0cykge1xuICAgIHJldHVybiB7XG4gICAgICBbZXhwb3J0Q29udGV4dF06IHRoaXMuI2N0eCxcbiAgICAgIFtyZWdpc3RlckV4cG9ydF0oY3R4LCBfZXhwb3J0TmFtZSkge1xuICAgICAgICBmb3IgKGNvbnN0IFtleHBvcnROYW1lLCBtb2R1bGVFeHBvcnRdIG9mIE9iamVjdC5lbnRyaWVzKGV4cG9ydHMpKSB7XG4gICAgICAgICAgY2hlY2tFeHBvcnRDb250ZXh0KG1vZHVsZUV4cG9ydCwgY3R4KTtcbiAgICAgICAgICBtb2R1bGVFeHBvcnRbcmVnaXN0ZXJFeHBvcnRdKGN0eCwgZXhwb3J0TmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9XG4gIGNsaWVudFZpc2liaWxpdHlGaWx0ZXIgPSB7XG4gICAgc3FsOiAoZmlsdGVyKSA9PiAoe1xuICAgICAgW2V4cG9ydENvbnRleHRdOiB0aGlzLiNjdHgsXG4gICAgICBbcmVnaXN0ZXJFeHBvcnRdKGN0eCwgX2V4cG9ydE5hbWUpIHtcbiAgICAgICAgY3R4Lm1vZHVsZURlZi5yb3dMZXZlbFNlY3VyaXR5LnB1c2goeyBzcWw6IGZpbHRlciB9KTtcbiAgICAgIH1cbiAgICB9KVxuICB9O1xufTtcbnZhciByZWdpc3RlckV4cG9ydCA9IFN5bWJvbChcIlNwYWNldGltZURCLnJlZ2lzdGVyRXhwb3J0XCIpO1xudmFyIGV4cG9ydENvbnRleHQgPSBTeW1ib2woXCJTcGFjZXRpbWVEQi5leHBvcnRDb250ZXh0XCIpO1xuZnVuY3Rpb24gaXNNb2R1bGVFeHBvcnQoeCkge1xuICByZXR1cm4gKHR5cGVvZiB4ID09PSBcImZ1bmN0aW9uXCIgfHwgdHlwZW9mIHggPT09IFwib2JqZWN0XCIpICYmIHggIT09IG51bGwgJiYgcmVnaXN0ZXJFeHBvcnQgaW4geDtcbn1cbmZ1bmN0aW9uIGNoZWNrRXhwb3J0Q29udGV4dChleHAsIHNjaGVtYTIpIHtcbiAgaWYgKGV4cFtleHBvcnRDb250ZXh0XSAhPSBudWxsICYmIGV4cFtleHBvcnRDb250ZXh0XSAhPT0gc2NoZW1hMikge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJtdWx0aXBsZSBzY2hlbWFzIGFyZSBub3Qgc3VwcG9ydGVkXCIpO1xuICB9XG59XG5mdW5jdGlvbiBzY2hlbWEodGFibGVzLCBtb2R1bGVTZXR0aW5ncykge1xuICBjb25zdCBjdHggPSBuZXcgU2NoZW1hSW5uZXIoKGN0eDIpID0+IHtcbiAgICBpZiAobW9kdWxlU2V0dGluZ3M/LkNBU0VfQ09OVkVSU0lPTl9QT0xJQ1kgIT0gbnVsbCkge1xuICAgICAgY3R4Mi5zZXRDYXNlQ29udmVyc2lvblBvbGljeShtb2R1bGVTZXR0aW5ncy5DQVNFX0NPTlZFUlNJT05fUE9MSUNZKTtcbiAgICB9XG4gICAgY29uc3QgdGFibGVTY2hlbWFzID0ge307XG4gICAgZm9yIChjb25zdCBbYWNjTmFtZSwgdGFibGUyXSBvZiBPYmplY3QuZW50cmllcyh0YWJsZXMpKSB7XG4gICAgICBjb25zdCB0YWJsZURlZiA9IHRhYmxlMi50YWJsZURlZihjdHgyLCBhY2NOYW1lKTtcbiAgICAgIHRhYmxlU2NoZW1hc1thY2NOYW1lXSA9IHRhYmxlVG9TY2hlbWEoYWNjTmFtZSwgdGFibGUyLCB0YWJsZURlZik7XG4gICAgICBjdHgyLm1vZHVsZURlZi50YWJsZXMucHVzaCh0YWJsZURlZik7XG4gICAgICBpZiAodGFibGUyLnNjaGVkdWxlKSB7XG4gICAgICAgIGN0eDIucGVuZGluZ1NjaGVkdWxlcy5wdXNoKHtcbiAgICAgICAgICAuLi50YWJsZTIuc2NoZWR1bGUsXG4gICAgICAgICAgdGFibGVOYW1lOiB0YWJsZURlZi5zb3VyY2VOYW1lXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKHRhYmxlMi50YWJsZU5hbWUpIHtcbiAgICAgICAgY3R4Mi5tb2R1bGVEZWYuZXhwbGljaXROYW1lcy5lbnRyaWVzLnB1c2goe1xuICAgICAgICAgIHRhZzogXCJUYWJsZVwiLFxuICAgICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgICBzb3VyY2VOYW1lOiBhY2NOYW1lLFxuICAgICAgICAgICAgY2Fub25pY2FsTmFtZTogdGFibGUyLnRhYmxlTmFtZVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7IHRhYmxlczogdGFibGVTY2hlbWFzIH07XG4gIH0pO1xuICByZXR1cm4gbmV3IFNjaGVtYShjdHgpO1xufVxuXG4vLyBzcmMvc2VydmVyL2NvbnNvbGUudHNcbnZhciBpbXBvcnRfb2JqZWN0X2luc3BlY3QgPSBfX3RvRVNNKHJlcXVpcmVfb2JqZWN0X2luc3BlY3QoKSk7XG52YXIgZm10TG9nID0gKC4uLmRhdGEpID0+IGRhdGEubWFwKCh4KSA9PiB0eXBlb2YgeCA9PT0gXCJzdHJpbmdcIiA/IHggOiAoMCwgaW1wb3J0X29iamVjdF9pbnNwZWN0LmRlZmF1bHQpKHgpKS5qb2luKFwiIFwiKTtcbnZhciBjb25zb2xlX2xldmVsX2Vycm9yID0gMDtcbnZhciBjb25zb2xlX2xldmVsX3dhcm4gPSAxO1xudmFyIGNvbnNvbGVfbGV2ZWxfaW5mbyA9IDI7XG52YXIgY29uc29sZV9sZXZlbF9kZWJ1ZyA9IDM7XG52YXIgY29uc29sZV9sZXZlbF90cmFjZSA9IDQ7XG52YXIgdGltZXJNYXAgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xudmFyIGNvbnNvbGUyID0ge1xuICAvLyBAdHMtZXhwZWN0LWVycm9yIHdlIHdhbnQgYSBibGFuayBwcm90b3R5cGUsIGJ1dCB0eXBlc2NyaXB0IGNvbXBsYWluc1xuICBfX3Byb3RvX186IHt9LFxuICBbU3ltYm9sLnRvU3RyaW5nVGFnXTogXCJjb25zb2xlXCIsXG4gIGFzc2VydDogKGNvbmRpdGlvbiA9IGZhbHNlLCAuLi5kYXRhKSA9PiB7XG4gICAgaWYgKCFjb25kaXRpb24pIHtcbiAgICAgIHN5cy5jb25zb2xlX2xvZyhjb25zb2xlX2xldmVsX2Vycm9yLCBmbXRMb2coLi4uZGF0YSkpO1xuICAgIH1cbiAgfSxcbiAgY2xlYXI6ICgpID0+IHtcbiAgfSxcbiAgZGVidWc6ICguLi5kYXRhKSA9PiB7XG4gICAgc3lzLmNvbnNvbGVfbG9nKGNvbnNvbGVfbGV2ZWxfZGVidWcsIGZtdExvZyguLi5kYXRhKSk7XG4gIH0sXG4gIGVycm9yOiAoLi4uZGF0YSkgPT4ge1xuICAgIHN5cy5jb25zb2xlX2xvZyhjb25zb2xlX2xldmVsX2Vycm9yLCBmbXRMb2coLi4uZGF0YSkpO1xuICB9LFxuICBpbmZvOiAoLi4uZGF0YSkgPT4ge1xuICAgIHN5cy5jb25zb2xlX2xvZyhjb25zb2xlX2xldmVsX2luZm8sIGZtdExvZyguLi5kYXRhKSk7XG4gIH0sXG4gIGxvZzogKC4uLmRhdGEpID0+IHtcbiAgICBzeXMuY29uc29sZV9sb2coY29uc29sZV9sZXZlbF9pbmZvLCBmbXRMb2coLi4uZGF0YSkpO1xuICB9LFxuICB0YWJsZTogKHRhYnVsYXJEYXRhLCBfcHJvcGVydGllcykgPT4ge1xuICAgIHN5cy5jb25zb2xlX2xvZyhjb25zb2xlX2xldmVsX2luZm8sIGZtdExvZyh0YWJ1bGFyRGF0YSkpO1xuICB9LFxuICB0cmFjZTogKC4uLmRhdGEpID0+IHtcbiAgICBzeXMuY29uc29sZV9sb2coY29uc29sZV9sZXZlbF90cmFjZSwgZm10TG9nKC4uLmRhdGEpKTtcbiAgfSxcbiAgd2FybjogKC4uLmRhdGEpID0+IHtcbiAgICBzeXMuY29uc29sZV9sb2coY29uc29sZV9sZXZlbF93YXJuLCBmbXRMb2coLi4uZGF0YSkpO1xuICB9LFxuICBkaXI6IChfaXRlbSwgX29wdGlvbnMpID0+IHtcbiAgfSxcbiAgZGlyeG1sOiAoLi4uX2RhdGEpID0+IHtcbiAgfSxcbiAgLy8gQ291bnRpbmdcbiAgY291bnQ6IChfbGFiZWwgPSBcImRlZmF1bHRcIikgPT4ge1xuICB9LFxuICBjb3VudFJlc2V0OiAoX2xhYmVsID0gXCJkZWZhdWx0XCIpID0+IHtcbiAgfSxcbiAgLy8gR3JvdXBpbmdcbiAgZ3JvdXA6ICguLi5fZGF0YSkgPT4ge1xuICB9LFxuICBncm91cENvbGxhcHNlZDogKC4uLl9kYXRhKSA9PiB7XG4gIH0sXG4gIGdyb3VwRW5kOiAoKSA9PiB7XG4gIH0sXG4gIC8vIFRpbWluZ1xuICB0aW1lOiAobGFiZWwgPSBcImRlZmF1bHRcIikgPT4ge1xuICAgIGlmICh0aW1lck1hcC5oYXMobGFiZWwpKSB7XG4gICAgICBzeXMuY29uc29sZV9sb2coY29uc29sZV9sZXZlbF93YXJuLCBgVGltZXIgJyR7bGFiZWx9JyBhbHJlYWR5IGV4aXN0cy5gKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGltZXJNYXAuc2V0KGxhYmVsLCBzeXMuY29uc29sZV90aW1lcl9zdGFydChsYWJlbCkpO1xuICB9LFxuICB0aW1lTG9nOiAobGFiZWwgPSBcImRlZmF1bHRcIiwgLi4uZGF0YSkgPT4ge1xuICAgIHN5cy5jb25zb2xlX2xvZyhjb25zb2xlX2xldmVsX2luZm8sIGZtdExvZyhsYWJlbCwgLi4uZGF0YSkpO1xuICB9LFxuICB0aW1lRW5kOiAobGFiZWwgPSBcImRlZmF1bHRcIikgPT4ge1xuICAgIGNvbnN0IHNwYW5JZCA9IHRpbWVyTWFwLmdldChsYWJlbCk7XG4gICAgaWYgKHNwYW5JZCA9PT0gdm9pZCAwKSB7XG4gICAgICBzeXMuY29uc29sZV9sb2coY29uc29sZV9sZXZlbF93YXJuLCBgVGltZXIgJyR7bGFiZWx9JyBkb2VzIG5vdCBleGlzdC5gKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgc3lzLmNvbnNvbGVfdGltZXJfZW5kKHNwYW5JZCk7XG4gICAgdGltZXJNYXAuZGVsZXRlKGxhYmVsKTtcbiAgfSxcbiAgLy8gQWRkaXRpb25hbCBjb25zb2xlIG1ldGhvZHMgdG8gc2F0aXNmeSB0aGUgQ29uc29sZSBpbnRlcmZhY2VcbiAgdGltZVN0YW1wOiAoKSA9PiB7XG4gIH0sXG4gIHByb2ZpbGU6ICgpID0+IHtcbiAgfSxcbiAgcHJvZmlsZUVuZDogKCkgPT4ge1xuICB9XG59O1xuXG4vLyBzcmMvc2VydmVyL3BvbHlmaWxscy50c1xuZ2xvYmFsVGhpcy5jb25zb2xlID0gY29uc29sZTI7XG4vKiEgQnVuZGxlZCBsaWNlbnNlIGluZm9ybWF0aW9uOlxuXG5zdGF0dXNlcy9pbmRleC5qczpcbiAgKCohXG4gICAqIHN0YXR1c2VzXG4gICAqIENvcHlyaWdodChjKSAyMDE0IEpvbmF0aGFuIE9uZ1xuICAgKiBDb3B5cmlnaHQoYykgMjAxNiBEb3VnbGFzIENocmlzdG9waGVyIFdpbHNvblxuICAgKiBNSVQgTGljZW5zZWRcbiAgICopXG4qL1xuXG5leHBvcnQgeyBBcnJheUJ1aWxkZXIsIEFycmF5Q29sdW1uQnVpbGRlciwgQm9vbEJ1aWxkZXIsIEJvb2xDb2x1bW5CdWlsZGVyLCBCb29sZWFuRXhwciwgQnl0ZUFycmF5QnVpbGRlciwgQnl0ZUFycmF5Q29sdW1uQnVpbGRlciwgQ2FzZUNvbnZlcnNpb25Qb2xpY3ksIENvbHVtbkJ1aWxkZXIsIENvbHVtbkV4cHJlc3Npb24sIENvbm5lY3Rpb25JZEJ1aWxkZXIsIENvbm5lY3Rpb25JZENvbHVtbkJ1aWxkZXIsIEYzMkJ1aWxkZXIsIEYzMkNvbHVtbkJ1aWxkZXIsIEY2NEJ1aWxkZXIsIEY2NENvbHVtbkJ1aWxkZXIsIEkxMjhCdWlsZGVyLCBJMTI4Q29sdW1uQnVpbGRlciwgSTE2QnVpbGRlciwgSTE2Q29sdW1uQnVpbGRlciwgSTI1NkJ1aWxkZXIsIEkyNTZDb2x1bW5CdWlsZGVyLCBJMzJCdWlsZGVyLCBJMzJDb2x1bW5CdWlsZGVyLCBJNjRCdWlsZGVyLCBJNjRDb2x1bW5CdWlsZGVyLCBJOEJ1aWxkZXIsIEk4Q29sdW1uQnVpbGRlciwgSWRlbnRpdHlCdWlsZGVyLCBJZGVudGl0eUNvbHVtbkJ1aWxkZXIsIE9wdGlvbkJ1aWxkZXIsIE9wdGlvbkNvbHVtbkJ1aWxkZXIsIFByb2R1Y3RCdWlsZGVyLCBQcm9kdWN0Q29sdW1uQnVpbGRlciwgUmVmQnVpbGRlciwgUmVzdWx0QnVpbGRlciwgUmVzdWx0Q29sdW1uQnVpbGRlciwgUm93QnVpbGRlciwgU2NoZWR1bGVBdEJ1aWxkZXIsIFNjaGVkdWxlQXRDb2x1bW5CdWlsZGVyLCBTZW5kZXJFcnJvciwgU2ltcGxlU3VtQnVpbGRlciwgU2ltcGxlU3VtQ29sdW1uQnVpbGRlciwgU3BhY2V0aW1lSG9zdEVycm9yLCBTdHJpbmdCdWlsZGVyLCBTdHJpbmdDb2x1bW5CdWlsZGVyLCBTdW1CdWlsZGVyLCBTdW1Db2x1bW5CdWlsZGVyLCBUaW1lRHVyYXRpb25CdWlsZGVyLCBUaW1lRHVyYXRpb25Db2x1bW5CdWlsZGVyLCBUaW1lc3RhbXBCdWlsZGVyLCBUaW1lc3RhbXBDb2x1bW5CdWlsZGVyLCBUeXBlQnVpbGRlciwgVTEyOEJ1aWxkZXIsIFUxMjhDb2x1bW5CdWlsZGVyLCBVMTZCdWlsZGVyLCBVMTZDb2x1bW5CdWlsZGVyLCBVMjU2QnVpbGRlciwgVTI1NkNvbHVtbkJ1aWxkZXIsIFUzMkJ1aWxkZXIsIFUzMkNvbHVtbkJ1aWxkZXIsIFU2NEJ1aWxkZXIsIFU2NENvbHVtbkJ1aWxkZXIsIFU4QnVpbGRlciwgVThDb2x1bW5CdWlsZGVyLCBVdWlkQnVpbGRlciwgVXVpZENvbHVtbkJ1aWxkZXIsIGFuZCwgY3JlYXRlVGFibGVSZWZGcm9tRGVmLCBlcnJvcnMsIGV2YWx1YXRlQm9vbGVhbkV4cHIsIGdldFF1ZXJ5QWNjZXNzb3JOYW1lLCBnZXRRdWVyeVRhYmxlTmFtZSwgZ2V0UXVlcnlXaGVyZUNsYXVzZSwgaXNSb3dUeXBlZFF1ZXJ5LCBpc1R5cGVkUXVlcnksIGxpdGVyYWwsIG1ha2VRdWVyeUJ1aWxkZXIsIG5vdCwgb3IsIHNjaGVtYSwgdCwgdGFibGUsIHRvQ2FtZWxDYXNlLCB0b0NvbXBhcmFibGVWYWx1ZSwgdG9TcWwgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4Lm1qcy5tYXBcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4Lm1qcy5tYXAiLCJpbXBvcnQgeyBzY2hlbWEsIHRhYmxlLCB0IH0gZnJvbSAnc3BhY2V0aW1lZGIvc2VydmVyJztcblxuLy8gLS0tIENvcmUgRW50aXR5IFRhYmxlcyAtLS1cblxuY29uc3QgcHJvamVjdCA9IHRhYmxlKHtcbiAgbmFtZTogJ3Byb2plY3QnLFxuICBwdWJsaWM6IHRydWUsXG59LCB7XG4gIGlkOiB0LnU2NCgpLnByaW1hcnlLZXkoKS5hdXRvSW5jKCksXG4gIGdpdF9yZW1vdGVfdXJsOiB0LnN0cmluZygpLnVuaXF1ZSgpLFxuICBuYW1lOiB0LnN0cmluZygpLFxuICBkZXNjcmlwdGlvbjogdC5zdHJpbmcoKSxcbiAgY29yZV92YWx1ZTogdC5zdHJpbmcoKSxcbiAgY29uc3RyYWludHM6IHQuc3RyaW5nKCksXG4gIGNvbnRleHQ6IHQuc3RyaW5nKCksXG4gIGtleV9kZWNpc2lvbnM6IHQuc3RyaW5nKCksXG4gIGNyZWF0ZWRfYXQ6IHQudGltZXN0YW1wKCksXG4gIHVwZGF0ZWRfYXQ6IHQudGltZXN0YW1wKCksXG59KTtcblxuY29uc3QgcGhhc2UgPSB0YWJsZSh7XG4gIG5hbWU6ICdwaGFzZScsXG4gIHB1YmxpYzogdHJ1ZSxcbiAgaW5kZXhlczogW1xuICAgIHsgbmFtZTogJ3BoYXNlX3Byb2plY3RfaWQnLCBhY2Nlc3NvcjogJ3BoYXNlX3Byb2plY3RfaWQnLCBhbGdvcml0aG06ICdidHJlZScsIGNvbHVtbnM6IFsncHJvamVjdF9pZCddIH0sXG4gIF0sXG59LCB7XG4gIGlkOiB0LnU2NCgpLnByaW1hcnlLZXkoKS5hdXRvSW5jKCksXG4gIHByb2plY3RfaWQ6IHQudTY0KCksXG4gIG51bWJlcjogdC5zdHJpbmcoKSxcbiAgbmFtZTogdC5zdHJpbmcoKSxcbiAgc2x1ZzogdC5zdHJpbmcoKSxcbiAgZ29hbDogdC5zdHJpbmcoKSxcbiAgc3RhdHVzOiB0LnN0cmluZygpLFxuICBkZXBlbmRzX29uOiB0LnN0cmluZygpLFxuICBzdWNjZXNzX2NyaXRlcmlhOiB0LnN0cmluZygpLFxuICBjcmVhdGVkX2F0OiB0LnRpbWVzdGFtcCgpLFxuICB1cGRhdGVkX2F0OiB0LnRpbWVzdGFtcCgpLFxufSk7XG5cbmNvbnN0IHBsYW4gPSB0YWJsZSh7XG4gIG5hbWU6ICdwbGFuJyxcbiAgcHVibGljOiB0cnVlLFxuICBpbmRleGVzOiBbXG4gICAgeyBuYW1lOiAncGxhbl9waGFzZV9pZCcsIGFjY2Vzc29yOiAncGxhbl9waGFzZV9pZCcsIGFsZ29yaXRobTogJ2J0cmVlJywgY29sdW1uczogWydwaGFzZV9pZCddIH0sXG4gIF0sXG59LCB7XG4gIGlkOiB0LnU2NCgpLnByaW1hcnlLZXkoKS5hdXRvSW5jKCksXG4gIHBoYXNlX2lkOiB0LnU2NCgpLFxuICBwbGFuX251bWJlcjogdC51NjQoKSxcbiAgdHlwZTogdC5zdHJpbmcoKSxcbiAgd2F2ZTogdC51NjQoKSxcbiAgZGVwZW5kc19vbjogdC5zdHJpbmcoKSxcbiAgb2JqZWN0aXZlOiB0LnN0cmluZygpLFxuICBhdXRvbm9tb3VzOiB0LmJvb2woKSxcbiAgcmVxdWlyZW1lbnRzOiB0LnN0cmluZygpLFxuICBzdGF0dXM6IHQuc3RyaW5nKCksXG4gIGNvbnRlbnQ6IHQuc3RyaW5nKCksXG4gIGNyZWF0ZWRfYXQ6IHQudGltZXN0YW1wKCksXG4gIHVwZGF0ZWRfYXQ6IHQudGltZXN0YW1wKCksXG59KTtcblxuY29uc3QgcGxhblRhc2sgPSB0YWJsZSh7XG4gIG5hbWU6ICdwbGFuX3Rhc2snLFxuICBwdWJsaWM6IHRydWUsXG4gIGluZGV4ZXM6IFtcbiAgICB7IG5hbWU6ICdwbGFuX3Rhc2tfcGxhbl9pZCcsIGFjY2Vzc29yOiAncGxhbl90YXNrX3BsYW5faWQnLCBhbGdvcml0aG06ICdidHJlZScsIGNvbHVtbnM6IFsncGxhbl9pZCddIH0sXG4gIF0sXG59LCB7XG4gIGlkOiB0LnU2NCgpLnByaW1hcnlLZXkoKS5hdXRvSW5jKCksXG4gIHBsYW5faWQ6IHQudTY0KCksXG4gIHRhc2tfbnVtYmVyOiB0LnU2NCgpLFxuICB0eXBlOiB0LnN0cmluZygpLFxuICBkZXNjcmlwdGlvbjogdC5zdHJpbmcoKSxcbiAgc3RhdHVzOiB0LnN0cmluZygpLFxuICBjb21taXRfaGFzaDogdC5zdHJpbmcoKS5vcHRpb25hbCgpLFxuICBjcmVhdGVkX2F0OiB0LnRpbWVzdGFtcCgpLFxuICB1cGRhdGVkX2F0OiB0LnRpbWVzdGFtcCgpLFxufSk7XG5cbmNvbnN0IHJlcXVpcmVtZW50ID0gdGFibGUoe1xuICBuYW1lOiAncmVxdWlyZW1lbnQnLFxuICBwdWJsaWM6IHRydWUsXG4gIGluZGV4ZXM6IFtcbiAgICB7IG5hbWU6ICdyZXF1aXJlbWVudF9wcm9qZWN0X2lkJywgYWNjZXNzb3I6ICdyZXF1aXJlbWVudF9wcm9qZWN0X2lkJywgYWxnb3JpdGhtOiAnYnRyZWUnLCBjb2x1bW5zOiBbJ3Byb2plY3RfaWQnXSB9LFxuICBdLFxufSwge1xuICBpZDogdC51NjQoKS5wcmltYXJ5S2V5KCkuYXV0b0luYygpLFxuICBwcm9qZWN0X2lkOiB0LnU2NCgpLFxuICBjYXRlZ29yeTogdC5zdHJpbmcoKSxcbiAgbnVtYmVyOiB0LnN0cmluZygpLFxuICBkZXNjcmlwdGlvbjogdC5zdHJpbmcoKSxcbiAgc3RhdHVzOiB0LnN0cmluZygpLFxuICBwaGFzZV9udW1iZXI6IHQuc3RyaW5nKCksXG4gIG1pbGVzdG9uZV92ZXJzaW9uOiB0LnN0cmluZygpLm9wdGlvbmFsKCksXG4gIGNyZWF0ZWRfYXQ6IHQudGltZXN0YW1wKCksXG4gIHVwZGF0ZWRfYXQ6IHQudGltZXN0YW1wKCksXG59KTtcblxuLy8gLS0tIFN1cHBvcnRpbmcgVGFibGVzIC0tLVxuXG5jb25zdCBwcm9qZWN0U3RhdGUgPSB0YWJsZSh7XG4gIG5hbWU6ICdwcm9qZWN0X3N0YXRlJyxcbiAgcHVibGljOiB0cnVlLFxuICBpbmRleGVzOiBbXG4gICAgeyBuYW1lOiAncHJvamVjdF9zdGF0ZV9wcm9qZWN0X2lkJywgYWNjZXNzb3I6ICdwcm9qZWN0X3N0YXRlX3Byb2plY3RfaWQnLCBhbGdvcml0aG06ICdidHJlZScsIGNvbHVtbnM6IFsncHJvamVjdF9pZCddIH0sXG4gIF0sXG59LCB7XG4gIGlkOiB0LnU2NCgpLnByaW1hcnlLZXkoKS5hdXRvSW5jKCksXG4gIHByb2plY3RfaWQ6IHQudTY0KCksXG4gIGN1cnJlbnRfcGhhc2U6IHQuc3RyaW5nKCksXG4gIGN1cnJlbnRfcGxhbjogdC51NjQoKSxcbiAgY3VycmVudF90YXNrOiB0LnU2NCgpLFxuICBsYXN0X2FjdGl2aXR5OiB0LnRpbWVzdGFtcCgpLFxuICBsYXN0X2FjdGl2aXR5X2Rlc2NyaXB0aW9uOiB0LnN0cmluZygpLFxuICB2ZWxvY2l0eV9kYXRhOiB0LnN0cmluZygpLFxuICBzZXNzaW9uX2xhc3Q6IHQuc3RyaW5nKCksXG4gIHNlc3Npb25fc3RvcHBlZF9hdDogdC5zdHJpbmcoKSxcbiAgc2Vzc2lvbl9yZXN1bWVfZmlsZTogdC5zdHJpbmcoKS5vcHRpb25hbCgpLFxuICB1cGRhdGVkX2F0OiB0LnRpbWVzdGFtcCgpLFxufSk7XG5cbmNvbnN0IGNvbnRpbnVlSGVyZSA9IHRhYmxlKHtcbiAgbmFtZTogJ2NvbnRpbnVlX2hlcmUnLFxuICBwdWJsaWM6IHRydWUsXG4gIGluZGV4ZXM6IFtcbiAgICB7IG5hbWU6ICdjb250aW51ZV9oZXJlX3Byb2plY3RfaWQnLCBhY2Nlc3NvcjogJ2NvbnRpbnVlX2hlcmVfcHJvamVjdF9pZCcsIGFsZ29yaXRobTogJ2J0cmVlJywgY29sdW1uczogWydwcm9qZWN0X2lkJ10gfSxcbiAgXSxcbn0sIHtcbiAgaWQ6IHQudTY0KCkucHJpbWFyeUtleSgpLmF1dG9JbmMoKSxcbiAgcHJvamVjdF9pZDogdC51NjQoKSxcbiAgcGhhc2VfaWQ6IHQudTY0KCksXG4gIHRhc2tfbnVtYmVyOiB0LnU2NCgpLFxuICBjdXJyZW50X3N0YXRlOiB0LnN0cmluZygpLFxuICBuZXh0X2FjdGlvbjogdC5zdHJpbmcoKSxcbiAgY29udGV4dDogdC5zdHJpbmcoKSxcbiAgY3JlYXRlZF9hdDogdC50aW1lc3RhbXAoKSxcbiAgdXBkYXRlZF9hdDogdC50aW1lc3RhbXAoKSxcbn0pO1xuXG5jb25zdCBwbGFuU3VtbWFyeSA9IHRhYmxlKHtcbiAgbmFtZTogJ3BsYW5fc3VtbWFyeScsXG4gIHB1YmxpYzogdHJ1ZSxcbiAgaW5kZXhlczogW1xuICAgIHsgbmFtZTogJ3BsYW5fc3VtbWFyeV9wbGFuX2lkJywgYWNjZXNzb3I6ICdwbGFuX3N1bW1hcnlfcGxhbl9pZCcsIGFsZ29yaXRobTogJ2J0cmVlJywgY29sdW1uczogWydwbGFuX2lkJ10gfSxcbiAgXSxcbn0sIHtcbiAgaWQ6IHQudTY0KCkucHJpbWFyeUtleSgpLmF1dG9JbmMoKSxcbiAgcGxhbl9pZDogdC51NjQoKSxcbiAgc3Vic3lzdGVtOiB0LnN0cmluZygpLFxuICB0YWdzOiB0LnN0cmluZygpLFxuICBoZWFkbGluZTogdC5zdHJpbmcoKSxcbiAgYWNjb21wbGlzaG1lbnRzOiB0LnN0cmluZygpLFxuICBkZXZpYXRpb25zOiB0LnN0cmluZygpLFxuICBmaWxlczogdC5zdHJpbmcoKSxcbiAgZGVjaXNpb25zOiB0LnN0cmluZygpLFxuICBkZXBlbmRlbmN5X2dyYXBoOiB0LnN0cmluZygpLFxuICBjcmVhdGVkX2F0OiB0LnRpbWVzdGFtcCgpLFxuICB1cGRhdGVkX2F0OiB0LnRpbWVzdGFtcCgpLFxufSk7XG5cbmNvbnN0IHZlcmlmaWNhdGlvbiA9IHRhYmxlKHtcbiAgbmFtZTogJ3ZlcmlmaWNhdGlvbicsXG4gIHB1YmxpYzogdHJ1ZSxcbiAgaW5kZXhlczogW1xuICAgIHsgbmFtZTogJ3ZlcmlmaWNhdGlvbl9waGFzZV9pZCcsIGFjY2Vzc29yOiAndmVyaWZpY2F0aW9uX3BoYXNlX2lkJywgYWxnb3JpdGhtOiAnYnRyZWUnLCBjb2x1bW5zOiBbJ3BoYXNlX2lkJ10gfSxcbiAgXSxcbn0sIHtcbiAgaWQ6IHQudTY0KCkucHJpbWFyeUtleSgpLmF1dG9JbmMoKSxcbiAgcGhhc2VfaWQ6IHQudTY0KCksXG4gIHN0YXR1czogdC5zdHJpbmcoKSxcbiAgc2NvcmU6IHQudTY0KCksXG4gIGNvbnRlbnQ6IHQuc3RyaW5nKCksXG4gIHJlY29tbWVuZGVkX2ZpeGVzOiB0LnN0cmluZygpLFxuICBjcmVhdGVkX2F0OiB0LnRpbWVzdGFtcCgpLFxuICB1cGRhdGVkX2F0OiB0LnRpbWVzdGFtcCgpLFxufSk7XG5cbmNvbnN0IHJlc2VhcmNoID0gdGFibGUoe1xuICBuYW1lOiAncmVzZWFyY2gnLFxuICBwdWJsaWM6IHRydWUsXG4gIGluZGV4ZXM6IFtcbiAgICB7IG5hbWU6ICdyZXNlYXJjaF9waGFzZV9pZCcsIGFjY2Vzc29yOiAncmVzZWFyY2hfcGhhc2VfaWQnLCBhbGdvcml0aG06ICdidHJlZScsIGNvbHVtbnM6IFsncGhhc2VfaWQnXSB9LFxuICBdLFxufSwge1xuICBpZDogdC51NjQoKS5wcmltYXJ5S2V5KCkuYXV0b0luYygpLFxuICBwaGFzZV9pZDogdC51NjQoKSxcbiAgZG9tYWluOiB0LnN0cmluZygpLFxuICBjb25maWRlbmNlOiB0LnN0cmluZygpLFxuICBjb250ZW50OiB0LnN0cmluZygpLFxuICBjcmVhdGVkX2F0OiB0LnRpbWVzdGFtcCgpLFxuICB1cGRhdGVkX2F0OiB0LnRpbWVzdGFtcCgpLFxufSk7XG5cbmNvbnN0IHBoYXNlQ29udGV4dCA9IHRhYmxlKHtcbiAgbmFtZTogJ3BoYXNlX2NvbnRleHQnLFxuICBwdWJsaWM6IHRydWUsXG4gIGluZGV4ZXM6IFtcbiAgICB7IG5hbWU6ICdwaGFzZV9jb250ZXh0X3BoYXNlX2lkJywgYWNjZXNzb3I6ICdwaGFzZV9jb250ZXh0X3BoYXNlX2lkJywgYWxnb3JpdGhtOiAnYnRyZWUnLCBjb2x1bW5zOiBbJ3BoYXNlX2lkJ10gfSxcbiAgXSxcbn0sIHtcbiAgaWQ6IHQudTY0KCkucHJpbWFyeUtleSgpLmF1dG9JbmMoKSxcbiAgcGhhc2VfaWQ6IHQudTY0KCksXG4gIGNvbnRlbnQ6IHQuc3RyaW5nKCksXG4gIGNyZWF0ZWRfYXQ6IHQudGltZXN0YW1wKCksXG4gIHVwZGF0ZWRfYXQ6IHQudGltZXN0YW1wKCksXG59KTtcblxuY29uc3QgY29uZmlnID0gdGFibGUoe1xuICBuYW1lOiAnY29uZmlnJyxcbiAgcHVibGljOiB0cnVlLFxuICBpbmRleGVzOiBbXG4gICAgeyBuYW1lOiAnY29uZmlnX3Byb2plY3RfaWQnLCBhY2Nlc3NvcjogJ2NvbmZpZ19wcm9qZWN0X2lkJywgYWxnb3JpdGhtOiAnYnRyZWUnLCBjb2x1bW5zOiBbJ3Byb2plY3RfaWQnXSB9LFxuICBdLFxufSwge1xuICBpZDogdC51NjQoKS5wcmltYXJ5S2V5KCkuYXV0b0luYygpLFxuICBwcm9qZWN0X2lkOiB0LnU2NCgpLFxuICBjb25maWc6IHQuc3RyaW5nKCksXG4gIGNyZWF0ZWRfYXQ6IHQudGltZXN0YW1wKCksXG4gIHVwZGF0ZWRfYXQ6IHQudGltZXN0YW1wKCksXG59KTtcblxuY29uc3QgbXVzdEhhdmUgPSB0YWJsZSh7XG4gIG5hbWU6ICdtdXN0X2hhdmUnLFxuICBwdWJsaWM6IHRydWUsXG4gIGluZGV4ZXM6IFtcbiAgICB7IG5hbWU6ICdtdXN0X2hhdmVfcGxhbl9pZCcsIGFjY2Vzc29yOiAnbXVzdF9oYXZlX3BsYW5faWQnLCBhbGdvcml0aG06ICdidHJlZScsIGNvbHVtbnM6IFsncGxhbl9pZCddIH0sXG4gIF0sXG59LCB7XG4gIGlkOiB0LnU2NCgpLnByaW1hcnlLZXkoKS5hdXRvSW5jKCksXG4gIHBsYW5faWQ6IHQudTY0KCksXG4gIHRydXRoczogdC5zdHJpbmcoKSxcbiAgYXJ0aWZhY3RzOiB0LnN0cmluZygpLFxuICBrZXlfbGlua3M6IHQuc3RyaW5nKCksXG4gIGNyZWF0ZWRfYXQ6IHQudGltZXN0YW1wKCksXG4gIHVwZGF0ZWRfYXQ6IHQudGltZXN0YW1wKCksXG59KTtcblxuLy8gLS0tIFNjaGVtYSBFeHBvcnQgLS0tXG5cbmNvbnN0IHNwYWNldGltZWRiID0gc2NoZW1hKHtcbiAgcHJvamVjdCxcbiAgcGhhc2UsXG4gIHBsYW4sXG4gIHBsYW5UYXNrLFxuICByZXF1aXJlbWVudCxcbiAgcHJvamVjdFN0YXRlLFxuICBjb250aW51ZUhlcmUsXG4gIHBsYW5TdW1tYXJ5LFxuICB2ZXJpZmljYXRpb24sXG4gIHJlc2VhcmNoLFxuICBwaGFzZUNvbnRleHQsXG4gIGNvbmZpZyxcbiAgbXVzdEhhdmUsXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgc3BhY2V0aW1lZGI7XG4iLCJpbXBvcnQgc3BhY2V0aW1lZGIgZnJvbSAnLi9zY2hlbWEnO1xuaW1wb3J0IHsgdCwgU2VuZGVyRXJyb3IgfSBmcm9tICdzcGFjZXRpbWVkYi9zZXJ2ZXInO1xuXG4vLyBSZS1leHBvcnQgc2NoZW1hIGFzIGRlZmF1bHQgc28gdGhlIGJ1bmRsZXIgZmluZHMgaXQgaW4gdGhlIGVudHJ5cG9pbnRcbmV4cG9ydCBkZWZhdWx0IHNwYWNldGltZWRiO1xuXG4vLyAtLS0gTGlmZWN5Y2xlIEhvb2tzIC0tLVxuXG5leHBvcnQgY29uc3QgaW5pdCA9IHNwYWNldGltZWRiLmluaXQoX2N0eCA9PiB7XG4gIC8vIENhbGxlZCB3aGVuIHRoZSBtb2R1bGUgaXMgaW5pdGlhbGx5IHB1Ymxpc2hlZFxufSk7XG5cbmV4cG9ydCBjb25zdCBvbkNvbm5lY3QgPSBzcGFjZXRpbWVkYi5jbGllbnRDb25uZWN0ZWQoX2N0eCA9PiB7XG4gIC8vIENhbGxlZCBldmVyeSB0aW1lIGEgbmV3IGNsaWVudCBjb25uZWN0c1xufSk7XG5cbmV4cG9ydCBjb25zdCBvbkRpc2Nvbm5lY3QgPSBzcGFjZXRpbWVkYi5jbGllbnREaXNjb25uZWN0ZWQoX2N0eCA9PiB7XG4gIC8vIENhbGxlZCBldmVyeSB0aW1lIGEgY2xpZW50IGRpc2Nvbm5lY3RzXG59KTtcblxuLy8gLS0tIFByb2plY3QgUmVkdWNlcnMgKFNDSE0tMDEpIC0tLVxuXG5leHBvcnQgY29uc3QgaW5zZXJ0X3Byb2plY3QgPSBzcGFjZXRpbWVkYi5yZWR1Y2VyKFxuICB7XG4gICAgZ2l0X3JlbW90ZV91cmw6IHQuc3RyaW5nKCksXG4gICAgbmFtZTogdC5zdHJpbmcoKSxcbiAgICBkZXNjcmlwdGlvbjogdC5zdHJpbmcoKSxcbiAgICBjb3JlX3ZhbHVlOiB0LnN0cmluZygpLFxuICAgIGNvbnN0cmFpbnRzOiB0LnN0cmluZygpLFxuICAgIGNvbnRleHQ6IHQuc3RyaW5nKCksXG4gICAga2V5X2RlY2lzaW9uczogdC5zdHJpbmcoKSxcbiAgfSxcbiAgKGN0eCwgYXJncykgPT4ge1xuICAgIGN0eC5kYi5wcm9qZWN0Lmluc2VydCh7XG4gICAgICBpZDogMG4sXG4gICAgICAuLi5hcmdzLFxuICAgICAgY3JlYXRlZF9hdDogY3R4LnRpbWVzdGFtcCxcbiAgICAgIHVwZGF0ZWRfYXQ6IGN0eC50aW1lc3RhbXAsXG4gICAgfSk7XG4gIH1cbik7XG5cbmV4cG9ydCBjb25zdCB1cGRhdGVfcHJvamVjdCA9IHNwYWNldGltZWRiLnJlZHVjZXIoXG4gIHtcbiAgICBwcm9qZWN0X2lkOiB0LnU2NCgpLFxuICAgIG5hbWU6IHQuc3RyaW5nKCksXG4gICAgZGVzY3JpcHRpb246IHQuc3RyaW5nKCksXG4gICAgY29yZV92YWx1ZTogdC5zdHJpbmcoKSxcbiAgICBjb25zdHJhaW50czogdC5zdHJpbmcoKSxcbiAgICBjb250ZXh0OiB0LnN0cmluZygpLFxuICAgIGtleV9kZWNpc2lvbnM6IHQuc3RyaW5nKCksXG4gIH0sXG4gIChjdHgsIHsgcHJvamVjdF9pZCwgLi4uZmllbGRzIH0pID0+IHtcbiAgICBjb25zdCBleGlzdGluZyA9IGN0eC5kYi5wcm9qZWN0LmlkLmZpbmQocHJvamVjdF9pZCk7XG4gICAgaWYgKCFleGlzdGluZykgdGhyb3cgbmV3IFNlbmRlckVycm9yKGBQcm9qZWN0ICR7cHJvamVjdF9pZH0gbm90IGZvdW5kYCk7XG4gICAgY3R4LmRiLnByb2plY3QuaWQudXBkYXRlKHtcbiAgICAgIC4uLmV4aXN0aW5nLFxuICAgICAgLi4uZmllbGRzLFxuICAgICAgdXBkYXRlZF9hdDogY3R4LnRpbWVzdGFtcCxcbiAgICB9KTtcbiAgfVxuKTtcblxuZXhwb3J0IGNvbnN0IGRlbGV0ZV9wcm9qZWN0ID0gc3BhY2V0aW1lZGIucmVkdWNlcihcbiAgeyBwcm9qZWN0X2lkOiB0LnU2NCgpIH0sXG4gIChjdHgsIHsgcHJvamVjdF9pZCB9KSA9PiB7XG4gICAgY29uc3QgZXhpc3RpbmcgPSBjdHguZGIucHJvamVjdC5pZC5maW5kKHByb2plY3RfaWQpO1xuICAgIGlmICghZXhpc3RpbmcpIHRocm93IG5ldyBTZW5kZXJFcnJvcihgUHJvamVjdCAke3Byb2plY3RfaWR9IG5vdCBmb3VuZGApO1xuICAgIGN0eC5kYi5wcm9qZWN0LmlkLmRlbGV0ZShwcm9qZWN0X2lkKTtcbiAgfVxuKTtcblxuLy8gLS0tIFBoYXNlIFJlZHVjZXJzIChTQ0hNLTAyKSAtLS1cblxuZXhwb3J0IGNvbnN0IGluc2VydF9waGFzZSA9IHNwYWNldGltZWRiLnJlZHVjZXIoXG4gIHtcbiAgICBwcm9qZWN0X2lkOiB0LnU2NCgpLFxuICAgIG51bWJlcjogdC5zdHJpbmcoKSxcbiAgICBuYW1lOiB0LnN0cmluZygpLFxuICAgIHNsdWc6IHQuc3RyaW5nKCksXG4gICAgZ29hbDogdC5zdHJpbmcoKSxcbiAgICBzdGF0dXM6IHQuc3RyaW5nKCksXG4gICAgZGVwZW5kc19vbjogdC5zdHJpbmcoKSxcbiAgICBzdWNjZXNzX2NyaXRlcmlhOiB0LnN0cmluZygpLFxuICB9LFxuICAoY3R4LCB7IHByb2plY3RfaWQsIC4uLmZpZWxkcyB9KSA9PiB7XG4gICAgY29uc3QgcHJvamVjdCA9IGN0eC5kYi5wcm9qZWN0LmlkLmZpbmQocHJvamVjdF9pZCk7XG4gICAgaWYgKCFwcm9qZWN0KSB0aHJvdyBuZXcgU2VuZGVyRXJyb3IoYFByb2plY3QgJHtwcm9qZWN0X2lkfSBub3QgZm91bmRgKTtcbiAgICBjdHguZGIucGhhc2UuaW5zZXJ0KHtcbiAgICAgIGlkOiAwbixcbiAgICAgIHByb2plY3RfaWQsXG4gICAgICAuLi5maWVsZHMsXG4gICAgICBjcmVhdGVkX2F0OiBjdHgudGltZXN0YW1wLFxuICAgICAgdXBkYXRlZF9hdDogY3R4LnRpbWVzdGFtcCxcbiAgICB9KTtcbiAgfVxuKTtcblxuZXhwb3J0IGNvbnN0IHVwZGF0ZV9waGFzZSA9IHNwYWNldGltZWRiLnJlZHVjZXIoXG4gIHtcbiAgICBwaGFzZV9pZDogdC51NjQoKSxcbiAgICBudW1iZXI6IHQuc3RyaW5nKCksXG4gICAgbmFtZTogdC5zdHJpbmcoKSxcbiAgICBzbHVnOiB0LnN0cmluZygpLFxuICAgIGdvYWw6IHQuc3RyaW5nKCksXG4gICAgc3RhdHVzOiB0LnN0cmluZygpLFxuICAgIGRlcGVuZHNfb246IHQuc3RyaW5nKCksXG4gICAgc3VjY2Vzc19jcml0ZXJpYTogdC5zdHJpbmcoKSxcbiAgfSxcbiAgKGN0eCwgeyBwaGFzZV9pZCwgLi4uZmllbGRzIH0pID0+IHtcbiAgICBjb25zdCBleGlzdGluZyA9IGN0eC5kYi5waGFzZS5pZC5maW5kKHBoYXNlX2lkKTtcbiAgICBpZiAoIWV4aXN0aW5nKSB0aHJvdyBuZXcgU2VuZGVyRXJyb3IoYFBoYXNlICR7cGhhc2VfaWR9IG5vdCBmb3VuZGApO1xuICAgIGN0eC5kYi5waGFzZS5pZC51cGRhdGUoe1xuICAgICAgLi4uZXhpc3RpbmcsXG4gICAgICAuLi5maWVsZHMsXG4gICAgICB1cGRhdGVkX2F0OiBjdHgudGltZXN0YW1wLFxuICAgIH0pO1xuICB9XG4pO1xuXG5leHBvcnQgY29uc3QgZGVsZXRlX3BoYXNlID0gc3BhY2V0aW1lZGIucmVkdWNlcihcbiAgeyBwaGFzZV9pZDogdC51NjQoKSB9LFxuICAoY3R4LCB7IHBoYXNlX2lkIH0pID0+IHtcbiAgICBjb25zdCBwaGFzZSA9IGN0eC5kYi5waGFzZS5pZC5maW5kKHBoYXNlX2lkKTtcbiAgICBpZiAoIXBoYXNlKSB0aHJvdyBuZXcgU2VuZGVyRXJyb3IoYFBoYXNlICR7cGhhc2VfaWR9IG5vdCBmb3VuZGApO1xuXG4gICAgLy8gQ0FTQ0FERSBERUxFVEU6IGNvbGxlY3QgYWxsIGNoaWxkcmVuIGludG8gYXJyYXlzIGZpcnN0LCB0aGVuIGRlbGV0ZVxuICAgIC8vIChuZXZlciBkZWxldGUgd2hpbGUgaXRlcmF0aW5nKVxuXG4gICAgLy8gMS4gRGVsZXRlIGFsbCBwbGFucyBhbmQgdGhlaXIgY2hpbGRyZW5cbiAgICBjb25zdCBwbGFucyA9IFsuLi5jdHguZGIucGxhbi5wbGFuX3BoYXNlX2lkLmZpbHRlcihwaGFzZV9pZCldO1xuICAgIGZvciAoY29uc3QgcGxhbiBvZiBwbGFucykge1xuICAgICAgY29uc3QgdGFza3MgPSBbLi4uY3R4LmRiLnBsYW5UYXNrLnBsYW5fdGFza19wbGFuX2lkLmZpbHRlcihwbGFuLmlkKV07XG4gICAgICBmb3IgKGNvbnN0IHRhc2sgb2YgdGFza3MpIHtcbiAgICAgICAgY3R4LmRiLnBsYW5UYXNrLmlkLmRlbGV0ZSh0YXNrLmlkKTtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgc3VtbWFyaWVzID0gWy4uLmN0eC5kYi5wbGFuU3VtbWFyeS5wbGFuX3N1bW1hcnlfcGxhbl9pZC5maWx0ZXIocGxhbi5pZCldO1xuICAgICAgZm9yIChjb25zdCBzdW1tYXJ5IG9mIHN1bW1hcmllcykge1xuICAgICAgICBjdHguZGIucGxhblN1bW1hcnkuaWQuZGVsZXRlKHN1bW1hcnkuaWQpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBtdXN0SGF2ZXMgPSBbLi4uY3R4LmRiLm11c3RIYXZlLm11c3RfaGF2ZV9wbGFuX2lkLmZpbHRlcihwbGFuLmlkKV07XG4gICAgICBmb3IgKGNvbnN0IG11c3RIYXZlIG9mIG11c3RIYXZlcykge1xuICAgICAgICBjdHguZGIubXVzdEhhdmUuaWQuZGVsZXRlKG11c3RIYXZlLmlkKTtcbiAgICAgIH1cblxuICAgICAgY3R4LmRiLnBsYW4uaWQuZGVsZXRlKHBsYW4uaWQpO1xuICAgIH1cblxuICAgIC8vIDIuIERlbGV0ZSB2ZXJpZmljYXRpb24gcmVjb3JkcyBmb3IgdGhpcyBwaGFzZVxuICAgIGNvbnN0IHZlcmlmaWNhdGlvbnMgPSBbLi4uY3R4LmRiLnZlcmlmaWNhdGlvbi52ZXJpZmljYXRpb25fcGhhc2VfaWQuZmlsdGVyKHBoYXNlX2lkKV07XG4gICAgZm9yIChjb25zdCB2IG9mIHZlcmlmaWNhdGlvbnMpIHtcbiAgICAgIGN0eC5kYi52ZXJpZmljYXRpb24uaWQuZGVsZXRlKHYuaWQpO1xuICAgIH1cblxuICAgIC8vIDMuIERlbGV0ZSByZXNlYXJjaCByZWNvcmRzIGZvciB0aGlzIHBoYXNlXG4gICAgY29uc3QgcmVzZWFyY2hSZWNvcmRzID0gWy4uLmN0eC5kYi5yZXNlYXJjaC5yZXNlYXJjaF9waGFzZV9pZC5maWx0ZXIocGhhc2VfaWQpXTtcbiAgICBmb3IgKGNvbnN0IHIgb2YgcmVzZWFyY2hSZWNvcmRzKSB7XG4gICAgICBjdHguZGIucmVzZWFyY2guaWQuZGVsZXRlKHIuaWQpO1xuICAgIH1cblxuICAgIC8vIDQuIERlbGV0ZSBwaGFzZSBjb250ZXh0IHJlY29yZHMgZm9yIHRoaXMgcGhhc2VcbiAgICBjb25zdCBwaGFzZUNvbnRleHRzID0gWy4uLmN0eC5kYi5waGFzZUNvbnRleHQucGhhc2VfY29udGV4dF9waGFzZV9pZC5maWx0ZXIocGhhc2VfaWQpXTtcbiAgICBmb3IgKGNvbnN0IHBjIG9mIHBoYXNlQ29udGV4dHMpIHtcbiAgICAgIGN0eC5kYi5waGFzZUNvbnRleHQuaWQuZGVsZXRlKHBjLmlkKTtcbiAgICB9XG5cbiAgICAvLyA1LiBEZWxldGUgcmVxdWlyZW1lbnRzIHRoYXQgYmVsb25nIHRvIHRoaXMgcGhhc2UncyBwcm9qZWN0IGFuZCBtYXRjaCBwaGFzZSBudW1iZXJcbiAgICBjb25zdCByZXF1aXJlbWVudHMgPSBbLi4uY3R4LmRiLnJlcXVpcmVtZW50LnJlcXVpcmVtZW50X3Byb2plY3RfaWQuZmlsdGVyKHBoYXNlLnByb2plY3RfaWQpXTtcbiAgICBmb3IgKGNvbnN0IHJlcSBvZiByZXF1aXJlbWVudHMpIHtcbiAgICAgIGlmIChyZXEucGhhc2VfbnVtYmVyID09PSBwaGFzZS5udW1iZXIpIHtcbiAgICAgICAgY3R4LmRiLnJlcXVpcmVtZW50LmlkLmRlbGV0ZShyZXEuaWQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIDYuIERlbGV0ZSB0aGUgcGhhc2UgaXRzZWxmXG4gICAgY3R4LmRiLnBoYXNlLmlkLmRlbGV0ZShwaGFzZV9pZCk7XG4gIH1cbik7XG5cbi8vIC0tLSBQbGFuIFJlZHVjZXJzIChTQ0hNLTAzKSAtLS1cblxuZXhwb3J0IGNvbnN0IGluc2VydF9wbGFuID0gc3BhY2V0aW1lZGIucmVkdWNlcihcbiAge1xuICAgIHBoYXNlX2lkOiB0LnU2NCgpLFxuICAgIHBsYW5fbnVtYmVyOiB0LnU2NCgpLFxuICAgIHR5cGU6IHQuc3RyaW5nKCksXG4gICAgd2F2ZTogdC51NjQoKSxcbiAgICBkZXBlbmRzX29uOiB0LnN0cmluZygpLFxuICAgIG9iamVjdGl2ZTogdC5zdHJpbmcoKSxcbiAgICBhdXRvbm9tb3VzOiB0LmJvb2woKSxcbiAgICByZXF1aXJlbWVudHM6IHQuc3RyaW5nKCksXG4gICAgc3RhdHVzOiB0LnN0cmluZygpLFxuICAgIGNvbnRlbnQ6IHQuc3RyaW5nKCksXG4gIH0sXG4gIChjdHgsIHsgcGhhc2VfaWQsIC4uLmZpZWxkcyB9KSA9PiB7XG4gICAgY29uc3QgcGhhc2UgPSBjdHguZGIucGhhc2UuaWQuZmluZChwaGFzZV9pZCk7XG4gICAgaWYgKCFwaGFzZSkgdGhyb3cgbmV3IFNlbmRlckVycm9yKGBQaGFzZSAke3BoYXNlX2lkfSBub3QgZm91bmRgKTtcbiAgICBjdHguZGIucGxhbi5pbnNlcnQoe1xuICAgICAgaWQ6IDBuLFxuICAgICAgcGhhc2VfaWQsXG4gICAgICAuLi5maWVsZHMsXG4gICAgICBjcmVhdGVkX2F0OiBjdHgudGltZXN0YW1wLFxuICAgICAgdXBkYXRlZF9hdDogY3R4LnRpbWVzdGFtcCxcbiAgICB9KTtcbiAgfVxuKTtcblxuZXhwb3J0IGNvbnN0IHVwZGF0ZV9wbGFuID0gc3BhY2V0aW1lZGIucmVkdWNlcihcbiAge1xuICAgIHBsYW5faWQ6IHQudTY0KCksXG4gICAgcGxhbl9udW1iZXI6IHQudTY0KCksXG4gICAgdHlwZTogdC5zdHJpbmcoKSxcbiAgICB3YXZlOiB0LnU2NCgpLFxuICAgIGRlcGVuZHNfb246IHQuc3RyaW5nKCksXG4gICAgb2JqZWN0aXZlOiB0LnN0cmluZygpLFxuICAgIGF1dG9ub21vdXM6IHQuYm9vbCgpLFxuICAgIHJlcXVpcmVtZW50czogdC5zdHJpbmcoKSxcbiAgICBzdGF0dXM6IHQuc3RyaW5nKCksXG4gICAgY29udGVudDogdC5zdHJpbmcoKSxcbiAgfSxcbiAgKGN0eCwgeyBwbGFuX2lkLCAuLi5maWVsZHMgfSkgPT4ge1xuICAgIGNvbnN0IGV4aXN0aW5nID0gY3R4LmRiLnBsYW4uaWQuZmluZChwbGFuX2lkKTtcbiAgICBpZiAoIWV4aXN0aW5nKSB0aHJvdyBuZXcgU2VuZGVyRXJyb3IoYFBsYW4gJHtwbGFuX2lkfSBub3QgZm91bmRgKTtcbiAgICBjdHguZGIucGxhbi5pZC51cGRhdGUoe1xuICAgICAgLi4uZXhpc3RpbmcsXG4gICAgICAuLi5maWVsZHMsXG4gICAgICB1cGRhdGVkX2F0OiBjdHgudGltZXN0YW1wLFxuICAgIH0pO1xuICB9XG4pO1xuXG5leHBvcnQgY29uc3QgZGVsZXRlX3BsYW4gPSBzcGFjZXRpbWVkYi5yZWR1Y2VyKFxuICB7IHBsYW5faWQ6IHQudTY0KCkgfSxcbiAgKGN0eCwgeyBwbGFuX2lkIH0pID0+IHtcbiAgICBjb25zdCBleGlzdGluZyA9IGN0eC5kYi5wbGFuLmlkLmZpbmQocGxhbl9pZCk7XG4gICAgaWYgKCFleGlzdGluZykgdGhyb3cgbmV3IFNlbmRlckVycm9yKGBQbGFuICR7cGxhbl9pZH0gbm90IGZvdW5kYCk7XG5cbiAgICAvLyBEZWxldGUgcGxhbidzIGNoaWxkcmVuIGZpcnN0XG4gICAgY29uc3QgdGFza3MgPSBbLi4uY3R4LmRiLnBsYW5UYXNrLnBsYW5fdGFza19wbGFuX2lkLmZpbHRlcihwbGFuX2lkKV07XG4gICAgZm9yIChjb25zdCB0YXNrIG9mIHRhc2tzKSB7XG4gICAgICBjdHguZGIucGxhblRhc2suaWQuZGVsZXRlKHRhc2suaWQpO1xuICAgIH1cblxuICAgIGNvbnN0IHN1bW1hcmllcyA9IFsuLi5jdHguZGIucGxhblN1bW1hcnkucGxhbl9zdW1tYXJ5X3BsYW5faWQuZmlsdGVyKHBsYW5faWQpXTtcbiAgICBmb3IgKGNvbnN0IHN1bW1hcnkgb2Ygc3VtbWFyaWVzKSB7XG4gICAgICBjdHguZGIucGxhblN1bW1hcnkuaWQuZGVsZXRlKHN1bW1hcnkuaWQpO1xuICAgIH1cblxuICAgIGNvbnN0IG11c3RIYXZlcyA9IFsuLi5jdHguZGIubXVzdEhhdmUubXVzdF9oYXZlX3BsYW5faWQuZmlsdGVyKHBsYW5faWQpXTtcbiAgICBmb3IgKGNvbnN0IG11c3RIYXZlIG9mIG11c3RIYXZlcykge1xuICAgICAgY3R4LmRiLm11c3RIYXZlLmlkLmRlbGV0ZShtdXN0SGF2ZS5pZCk7XG4gICAgfVxuXG4gICAgY3R4LmRiLnBsYW4uaWQuZGVsZXRlKHBsYW5faWQpO1xuICB9XG4pO1xuXG4vLyAtLS0gUGxhblRhc2sgUmVkdWNlcnMgKFNDSE0tMDQpIC0tLVxuXG5leHBvcnQgY29uc3QgaW5zZXJ0X3BsYW5fdGFzayA9IHNwYWNldGltZWRiLnJlZHVjZXIoXG4gIHtcbiAgICBwbGFuX2lkOiB0LnU2NCgpLFxuICAgIHRhc2tfbnVtYmVyOiB0LnU2NCgpLFxuICAgIHR5cGU6IHQuc3RyaW5nKCksXG4gICAgZGVzY3JpcHRpb246IHQuc3RyaW5nKCksXG4gICAgc3RhdHVzOiB0LnN0cmluZygpLFxuICAgIGNvbW1pdF9oYXNoOiB0LnN0cmluZygpLFxuICB9LFxuICAoY3R4LCB7IHBsYW5faWQsIGNvbW1pdF9oYXNoLCAuLi5maWVsZHMgfSkgPT4ge1xuICAgIGNvbnN0IHBsYW4gPSBjdHguZGIucGxhbi5pZC5maW5kKHBsYW5faWQpO1xuICAgIGlmICghcGxhbikgdGhyb3cgbmV3IFNlbmRlckVycm9yKGBQbGFuICR7cGxhbl9pZH0gbm90IGZvdW5kYCk7XG4gICAgY3R4LmRiLnBsYW5UYXNrLmluc2VydCh7XG4gICAgICBpZDogMG4sXG4gICAgICBwbGFuX2lkLFxuICAgICAgLi4uZmllbGRzLFxuICAgICAgY29tbWl0X2hhc2g6IGNvbW1pdF9oYXNoIHx8IHVuZGVmaW5lZCxcbiAgICAgIGNyZWF0ZWRfYXQ6IGN0eC50aW1lc3RhbXAsXG4gICAgICB1cGRhdGVkX2F0OiBjdHgudGltZXN0YW1wLFxuICAgIH0pO1xuICB9XG4pO1xuXG5leHBvcnQgY29uc3QgdXBkYXRlX3BsYW5fdGFzayA9IHNwYWNldGltZWRiLnJlZHVjZXIoXG4gIHtcbiAgICB0YXNrX2lkOiB0LnU2NCgpLFxuICAgIHRhc2tfbnVtYmVyOiB0LnU2NCgpLFxuICAgIHR5cGU6IHQuc3RyaW5nKCksXG4gICAgZGVzY3JpcHRpb246IHQuc3RyaW5nKCksXG4gICAgc3RhdHVzOiB0LnN0cmluZygpLFxuICAgIGNvbW1pdF9oYXNoOiB0LnN0cmluZygpLFxuICB9LFxuICAoY3R4LCB7IHRhc2tfaWQsIGNvbW1pdF9oYXNoLCAuLi5maWVsZHMgfSkgPT4ge1xuICAgIGNvbnN0IGV4aXN0aW5nID0gY3R4LmRiLnBsYW5UYXNrLmlkLmZpbmQodGFza19pZCk7XG4gICAgaWYgKCFleGlzdGluZykgdGhyb3cgbmV3IFNlbmRlckVycm9yKGBQbGFuVGFzayAke3Rhc2tfaWR9IG5vdCBmb3VuZGApO1xuICAgIGN0eC5kYi5wbGFuVGFzay5pZC51cGRhdGUoe1xuICAgICAgLi4uZXhpc3RpbmcsXG4gICAgICAuLi5maWVsZHMsXG4gICAgICBjb21taXRfaGFzaDogY29tbWl0X2hhc2ggfHwgdW5kZWZpbmVkLFxuICAgICAgdXBkYXRlZF9hdDogY3R4LnRpbWVzdGFtcCxcbiAgICB9KTtcbiAgfVxuKTtcblxuZXhwb3J0IGNvbnN0IGRlbGV0ZV9wbGFuX3Rhc2sgPSBzcGFjZXRpbWVkYi5yZWR1Y2VyKFxuICB7IHRhc2tfaWQ6IHQudTY0KCkgfSxcbiAgKGN0eCwgeyB0YXNrX2lkIH0pID0+IHtcbiAgICBjb25zdCBleGlzdGluZyA9IGN0eC5kYi5wbGFuVGFzay5pZC5maW5kKHRhc2tfaWQpO1xuICAgIGlmICghZXhpc3RpbmcpIHRocm93IG5ldyBTZW5kZXJFcnJvcihgUGxhblRhc2sgJHt0YXNrX2lkfSBub3QgZm91bmRgKTtcbiAgICBjdHguZGIucGxhblRhc2suaWQuZGVsZXRlKHRhc2tfaWQpO1xuICB9XG4pO1xuXG4vLyAtLS0gUmVxdWlyZW1lbnQgUmVkdWNlcnMgKFNDSE0tMDUpIC0tLVxuXG5leHBvcnQgY29uc3QgaW5zZXJ0X3JlcXVpcmVtZW50ID0gc3BhY2V0aW1lZGIucmVkdWNlcihcbiAge1xuICAgIHByb2plY3RfaWQ6IHQudTY0KCksXG4gICAgY2F0ZWdvcnk6IHQuc3RyaW5nKCksXG4gICAgbnVtYmVyOiB0LnN0cmluZygpLFxuICAgIGRlc2NyaXB0aW9uOiB0LnN0cmluZygpLFxuICAgIHN0YXR1czogdC5zdHJpbmcoKSxcbiAgICBwaGFzZV9udW1iZXI6IHQuc3RyaW5nKCksXG4gICAgbWlsZXN0b25lX3ZlcnNpb246IHQuc3RyaW5nKCksXG4gIH0sXG4gIChjdHgsIHsgcHJvamVjdF9pZCwgbWlsZXN0b25lX3ZlcnNpb24sIC4uLmZpZWxkcyB9KSA9PiB7XG4gICAgY29uc3QgcHJvamVjdCA9IGN0eC5kYi5wcm9qZWN0LmlkLmZpbmQocHJvamVjdF9pZCk7XG4gICAgaWYgKCFwcm9qZWN0KSB0aHJvdyBuZXcgU2VuZGVyRXJyb3IoYFByb2plY3QgJHtwcm9qZWN0X2lkfSBub3QgZm91bmRgKTtcbiAgICBjdHguZGIucmVxdWlyZW1lbnQuaW5zZXJ0KHtcbiAgICAgIGlkOiAwbixcbiAgICAgIHByb2plY3RfaWQsXG4gICAgICAuLi5maWVsZHMsXG4gICAgICBtaWxlc3RvbmVfdmVyc2lvbjogbWlsZXN0b25lX3ZlcnNpb24gfHwgdW5kZWZpbmVkLFxuICAgICAgY3JlYXRlZF9hdDogY3R4LnRpbWVzdGFtcCxcbiAgICAgIHVwZGF0ZWRfYXQ6IGN0eC50aW1lc3RhbXAsXG4gICAgfSk7XG4gIH1cbik7XG5cbmV4cG9ydCBjb25zdCB1cGRhdGVfcmVxdWlyZW1lbnQgPSBzcGFjZXRpbWVkYi5yZWR1Y2VyKFxuICB7XG4gICAgcmVxdWlyZW1lbnRfaWQ6IHQudTY0KCksXG4gICAgY2F0ZWdvcnk6IHQuc3RyaW5nKCksXG4gICAgbnVtYmVyOiB0LnN0cmluZygpLFxuICAgIGRlc2NyaXB0aW9uOiB0LnN0cmluZygpLFxuICAgIHN0YXR1czogdC5zdHJpbmcoKSxcbiAgICBwaGFzZV9udW1iZXI6IHQuc3RyaW5nKCksXG4gICAgbWlsZXN0b25lX3ZlcnNpb246IHQuc3RyaW5nKCksXG4gIH0sXG4gIChjdHgsIHsgcmVxdWlyZW1lbnRfaWQsIG1pbGVzdG9uZV92ZXJzaW9uLCAuLi5maWVsZHMgfSkgPT4ge1xuICAgIGNvbnN0IGV4aXN0aW5nID0gY3R4LmRiLnJlcXVpcmVtZW50LmlkLmZpbmQocmVxdWlyZW1lbnRfaWQpO1xuICAgIGlmICghZXhpc3RpbmcpIHRocm93IG5ldyBTZW5kZXJFcnJvcihgUmVxdWlyZW1lbnQgJHtyZXF1aXJlbWVudF9pZH0gbm90IGZvdW5kYCk7XG4gICAgY3R4LmRiLnJlcXVpcmVtZW50LmlkLnVwZGF0ZSh7XG4gICAgICAuLi5leGlzdGluZyxcbiAgICAgIC4uLmZpZWxkcyxcbiAgICAgIG1pbGVzdG9uZV92ZXJzaW9uOiBtaWxlc3RvbmVfdmVyc2lvbiB8fCB1bmRlZmluZWQsXG4gICAgICB1cGRhdGVkX2F0OiBjdHgudGltZXN0YW1wLFxuICAgIH0pO1xuICB9XG4pO1xuXG5leHBvcnQgY29uc3QgZGVsZXRlX3JlcXVpcmVtZW50ID0gc3BhY2V0aW1lZGIucmVkdWNlcihcbiAgeyByZXF1aXJlbWVudF9pZDogdC51NjQoKSB9LFxuICAoY3R4LCB7IHJlcXVpcmVtZW50X2lkIH0pID0+IHtcbiAgICBjb25zdCBleGlzdGluZyA9IGN0eC5kYi5yZXF1aXJlbWVudC5pZC5maW5kKHJlcXVpcmVtZW50X2lkKTtcbiAgICBpZiAoIWV4aXN0aW5nKSB0aHJvdyBuZXcgU2VuZGVyRXJyb3IoYFJlcXVpcmVtZW50ICR7cmVxdWlyZW1lbnRfaWR9IG5vdCBmb3VuZGApO1xuICAgIGN0eC5kYi5yZXF1aXJlbWVudC5pZC5kZWxldGUocmVxdWlyZW1lbnRfaWQpO1xuICB9XG4pO1xuXG4vLyAtLS0gUHJvamVjdFN0YXRlIFJlZHVjZXJzIChTQ0hNLTA2KSAtLS1cblxuZXhwb3J0IGNvbnN0IHVwc2VydF9wcm9qZWN0X3N0YXRlID0gc3BhY2V0aW1lZGIucmVkdWNlcihcbiAge1xuICAgIHByb2plY3RfaWQ6IHQudTY0KCksXG4gICAgY3VycmVudF9waGFzZTogdC5zdHJpbmcoKSxcbiAgICBjdXJyZW50X3BsYW46IHQudTY0KCksXG4gICAgY3VycmVudF90YXNrOiB0LnU2NCgpLFxuICAgIGxhc3RfYWN0aXZpdHlfZGVzY3JpcHRpb246IHQuc3RyaW5nKCksXG4gICAgdmVsb2NpdHlfZGF0YTogdC5zdHJpbmcoKSxcbiAgICBzZXNzaW9uX2xhc3Q6IHQuc3RyaW5nKCksXG4gICAgc2Vzc2lvbl9zdG9wcGVkX2F0OiB0LnN0cmluZygpLFxuICAgIHNlc3Npb25fcmVzdW1lX2ZpbGU6IHQuc3RyaW5nKCksXG4gIH0sXG4gIChjdHgsIHsgcHJvamVjdF9pZCwgc2Vzc2lvbl9yZXN1bWVfZmlsZSwgLi4uZmllbGRzIH0pID0+IHtcbiAgICBjb25zdCBwcm9qZWN0ID0gY3R4LmRiLnByb2plY3QuaWQuZmluZChwcm9qZWN0X2lkKTtcbiAgICBpZiAoIXByb2plY3QpIHRocm93IG5ldyBTZW5kZXJFcnJvcihgUHJvamVjdCAke3Byb2plY3RfaWR9IG5vdCBmb3VuZGApO1xuXG4gICAgY29uc3QgZXhpc3RpbmcgPSBbLi4uY3R4LmRiLnByb2plY3RTdGF0ZS5wcm9qZWN0X3N0YXRlX3Byb2plY3RfaWQuZmlsdGVyKHByb2plY3RfaWQpXVswXTtcbiAgICBpZiAoZXhpc3RpbmcpIHtcbiAgICAgIGN0eC5kYi5wcm9qZWN0U3RhdGUuaWQudXBkYXRlKHtcbiAgICAgICAgLi4uZXhpc3RpbmcsXG4gICAgICAgIC4uLmZpZWxkcyxcbiAgICAgICAgc2Vzc2lvbl9yZXN1bWVfZmlsZTogc2Vzc2lvbl9yZXN1bWVfZmlsZSB8fCB1bmRlZmluZWQsXG4gICAgICAgIGxhc3RfYWN0aXZpdHk6IGN0eC50aW1lc3RhbXAsXG4gICAgICAgIHVwZGF0ZWRfYXQ6IGN0eC50aW1lc3RhbXAsXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY3R4LmRiLnByb2plY3RTdGF0ZS5pbnNlcnQoe1xuICAgICAgICBpZDogMG4sXG4gICAgICAgIHByb2plY3RfaWQsXG4gICAgICAgIC4uLmZpZWxkcyxcbiAgICAgICAgc2Vzc2lvbl9yZXN1bWVfZmlsZTogc2Vzc2lvbl9yZXN1bWVfZmlsZSB8fCB1bmRlZmluZWQsXG4gICAgICAgIGxhc3RfYWN0aXZpdHk6IGN0eC50aW1lc3RhbXAsXG4gICAgICAgIHVwZGF0ZWRfYXQ6IGN0eC50aW1lc3RhbXAsXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbik7XG5cbmV4cG9ydCBjb25zdCBkZWxldGVfcHJvamVjdF9zdGF0ZSA9IHNwYWNldGltZWRiLnJlZHVjZXIoXG4gIHsgc3RhdGVfaWQ6IHQudTY0KCkgfSxcbiAgKGN0eCwgeyBzdGF0ZV9pZCB9KSA9PiB7XG4gICAgY29uc3QgZXhpc3RpbmcgPSBjdHguZGIucHJvamVjdFN0YXRlLmlkLmZpbmQoc3RhdGVfaWQpO1xuICAgIGlmICghZXhpc3RpbmcpIHRocm93IG5ldyBTZW5kZXJFcnJvcihgUHJvamVjdFN0YXRlICR7c3RhdGVfaWR9IG5vdCBmb3VuZGApO1xuICAgIGN0eC5kYi5wcm9qZWN0U3RhdGUuaWQuZGVsZXRlKHN0YXRlX2lkKTtcbiAgfVxuKTtcblxuLy8gLS0tIENvbnRpbnVlSGVyZSBSZWR1Y2VycyAoU0NITS0wNykgLS0tXG5cbmV4cG9ydCBjb25zdCB1cHNlcnRfY29udGludWVfaGVyZSA9IHNwYWNldGltZWRiLnJlZHVjZXIoXG4gIHtcbiAgICBwcm9qZWN0X2lkOiB0LnU2NCgpLFxuICAgIHBoYXNlX2lkOiB0LnU2NCgpLFxuICAgIHRhc2tfbnVtYmVyOiB0LnU2NCgpLFxuICAgIGN1cnJlbnRfc3RhdGU6IHQuc3RyaW5nKCksXG4gICAgbmV4dF9hY3Rpb246IHQuc3RyaW5nKCksXG4gICAgY29udGV4dDogdC5zdHJpbmcoKSxcbiAgfSxcbiAgKGN0eCwgeyBwcm9qZWN0X2lkLCAuLi5maWVsZHMgfSkgPT4ge1xuICAgIGNvbnN0IHByb2plY3QgPSBjdHguZGIucHJvamVjdC5pZC5maW5kKHByb2plY3RfaWQpO1xuICAgIGlmICghcHJvamVjdCkgdGhyb3cgbmV3IFNlbmRlckVycm9yKGBQcm9qZWN0ICR7cHJvamVjdF9pZH0gbm90IGZvdW5kYCk7XG4gICAgY29uc3QgcGhhc2UgPSBjdHguZGIucGhhc2UuaWQuZmluZChmaWVsZHMucGhhc2VfaWQpO1xuICAgIGlmICghcGhhc2UpIHRocm93IG5ldyBTZW5kZXJFcnJvcihgUGhhc2UgJHtmaWVsZHMucGhhc2VfaWR9IG5vdCBmb3VuZGApO1xuXG4gICAgY29uc3QgZXhpc3RpbmcgPSBbLi4uY3R4LmRiLmNvbnRpbnVlSGVyZS5jb250aW51ZV9oZXJlX3Byb2plY3RfaWQuZmlsdGVyKHByb2plY3RfaWQpXVswXTtcbiAgICBpZiAoZXhpc3RpbmcpIHtcbiAgICAgIGN0eC5kYi5jb250aW51ZUhlcmUuaWQudXBkYXRlKHtcbiAgICAgICAgLi4uZXhpc3RpbmcsXG4gICAgICAgIC4uLmZpZWxkcyxcbiAgICAgICAgdXBkYXRlZF9hdDogY3R4LnRpbWVzdGFtcCxcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjdHguZGIuY29udGludWVIZXJlLmluc2VydCh7XG4gICAgICAgIGlkOiAwbixcbiAgICAgICAgcHJvamVjdF9pZCxcbiAgICAgICAgLi4uZmllbGRzLFxuICAgICAgICBjcmVhdGVkX2F0OiBjdHgudGltZXN0YW1wLFxuICAgICAgICB1cGRhdGVkX2F0OiBjdHgudGltZXN0YW1wLFxuICAgICAgfSk7XG4gICAgfVxuICB9XG4pO1xuXG5leHBvcnQgY29uc3QgZGVsZXRlX2NvbnRpbnVlX2hlcmUgPSBzcGFjZXRpbWVkYi5yZWR1Y2VyKFxuICB7IGNvbnRpbnVlX2hlcmVfaWQ6IHQudTY0KCkgfSxcbiAgKGN0eCwgeyBjb250aW51ZV9oZXJlX2lkIH0pID0+IHtcbiAgICBjb25zdCBleGlzdGluZyA9IGN0eC5kYi5jb250aW51ZUhlcmUuaWQuZmluZChjb250aW51ZV9oZXJlX2lkKTtcbiAgICBpZiAoIWV4aXN0aW5nKSB0aHJvdyBuZXcgU2VuZGVyRXJyb3IoYENvbnRpbnVlSGVyZSAke2NvbnRpbnVlX2hlcmVfaWR9IG5vdCBmb3VuZGApO1xuICAgIGN0eC5kYi5jb250aW51ZUhlcmUuaWQuZGVsZXRlKGNvbnRpbnVlX2hlcmVfaWQpO1xuICB9XG4pO1xuXG4vLyAtLS0gUGxhblN1bW1hcnkgUmVkdWNlcnMgKFNDSE0tMDgpIC0tLVxuXG5leHBvcnQgY29uc3QgaW5zZXJ0X3BsYW5fc3VtbWFyeSA9IHNwYWNldGltZWRiLnJlZHVjZXIoXG4gIHtcbiAgICBwbGFuX2lkOiB0LnU2NCgpLFxuICAgIHN1YnN5c3RlbTogdC5zdHJpbmcoKSxcbiAgICB0YWdzOiB0LnN0cmluZygpLFxuICAgIGhlYWRsaW5lOiB0LnN0cmluZygpLFxuICAgIGFjY29tcGxpc2htZW50czogdC5zdHJpbmcoKSxcbiAgICBkZXZpYXRpb25zOiB0LnN0cmluZygpLFxuICAgIGZpbGVzOiB0LnN0cmluZygpLFxuICAgIGRlY2lzaW9uczogdC5zdHJpbmcoKSxcbiAgICBkZXBlbmRlbmN5X2dyYXBoOiB0LnN0cmluZygpLFxuICB9LFxuICAoY3R4LCB7IHBsYW5faWQsIC4uLmZpZWxkcyB9KSA9PiB7XG4gICAgY29uc3QgcGxhbiA9IGN0eC5kYi5wbGFuLmlkLmZpbmQocGxhbl9pZCk7XG4gICAgaWYgKCFwbGFuKSB0aHJvdyBuZXcgU2VuZGVyRXJyb3IoYFBsYW4gJHtwbGFuX2lkfSBub3QgZm91bmRgKTtcbiAgICBjdHguZGIucGxhblN1bW1hcnkuaW5zZXJ0KHtcbiAgICAgIGlkOiAwbixcbiAgICAgIHBsYW5faWQsXG4gICAgICAuLi5maWVsZHMsXG4gICAgICBjcmVhdGVkX2F0OiBjdHgudGltZXN0YW1wLFxuICAgICAgdXBkYXRlZF9hdDogY3R4LnRpbWVzdGFtcCxcbiAgICB9KTtcbiAgfVxuKTtcblxuZXhwb3J0IGNvbnN0IHVwZGF0ZV9wbGFuX3N1bW1hcnkgPSBzcGFjZXRpbWVkYi5yZWR1Y2VyKFxuICB7XG4gICAgc3VtbWFyeV9pZDogdC51NjQoKSxcbiAgICBzdWJzeXN0ZW06IHQuc3RyaW5nKCksXG4gICAgdGFnczogdC5zdHJpbmcoKSxcbiAgICBoZWFkbGluZTogdC5zdHJpbmcoKSxcbiAgICBhY2NvbXBsaXNobWVudHM6IHQuc3RyaW5nKCksXG4gICAgZGV2aWF0aW9uczogdC5zdHJpbmcoKSxcbiAgICBmaWxlczogdC5zdHJpbmcoKSxcbiAgICBkZWNpc2lvbnM6IHQuc3RyaW5nKCksXG4gICAgZGVwZW5kZW5jeV9ncmFwaDogdC5zdHJpbmcoKSxcbiAgfSxcbiAgKGN0eCwgeyBzdW1tYXJ5X2lkLCAuLi5maWVsZHMgfSkgPT4ge1xuICAgIGNvbnN0IGV4aXN0aW5nID0gY3R4LmRiLnBsYW5TdW1tYXJ5LmlkLmZpbmQoc3VtbWFyeV9pZCk7XG4gICAgaWYgKCFleGlzdGluZykgdGhyb3cgbmV3IFNlbmRlckVycm9yKGBQbGFuU3VtbWFyeSAke3N1bW1hcnlfaWR9IG5vdCBmb3VuZGApO1xuICAgIGN0eC5kYi5wbGFuU3VtbWFyeS5pZC51cGRhdGUoe1xuICAgICAgLi4uZXhpc3RpbmcsXG4gICAgICAuLi5maWVsZHMsXG4gICAgICB1cGRhdGVkX2F0OiBjdHgudGltZXN0YW1wLFxuICAgIH0pO1xuICB9XG4pO1xuXG5leHBvcnQgY29uc3QgZGVsZXRlX3BsYW5fc3VtbWFyeSA9IHNwYWNldGltZWRiLnJlZHVjZXIoXG4gIHsgc3VtbWFyeV9pZDogdC51NjQoKSB9LFxuICAoY3R4LCB7IHN1bW1hcnlfaWQgfSkgPT4ge1xuICAgIGNvbnN0IGV4aXN0aW5nID0gY3R4LmRiLnBsYW5TdW1tYXJ5LmlkLmZpbmQoc3VtbWFyeV9pZCk7XG4gICAgaWYgKCFleGlzdGluZykgdGhyb3cgbmV3IFNlbmRlckVycm9yKGBQbGFuU3VtbWFyeSAke3N1bW1hcnlfaWR9IG5vdCBmb3VuZGApO1xuICAgIGN0eC5kYi5wbGFuU3VtbWFyeS5pZC5kZWxldGUoc3VtbWFyeV9pZCk7XG4gIH1cbik7XG5cbi8vIC0tLSBWZXJpZmljYXRpb24gUmVkdWNlcnMgKFNDSE0tMDkpIC0tLVxuXG5leHBvcnQgY29uc3QgaW5zZXJ0X3ZlcmlmaWNhdGlvbiA9IHNwYWNldGltZWRiLnJlZHVjZXIoXG4gIHtcbiAgICBwaGFzZV9pZDogdC51NjQoKSxcbiAgICBzdGF0dXM6IHQuc3RyaW5nKCksXG4gICAgc2NvcmU6IHQudTY0KCksXG4gICAgY29udGVudDogdC5zdHJpbmcoKSxcbiAgICByZWNvbW1lbmRlZF9maXhlczogdC5zdHJpbmcoKSxcbiAgfSxcbiAgKGN0eCwgeyBwaGFzZV9pZCwgLi4uZmllbGRzIH0pID0+IHtcbiAgICBjb25zdCBwaGFzZSA9IGN0eC5kYi5waGFzZS5pZC5maW5kKHBoYXNlX2lkKTtcbiAgICBpZiAoIXBoYXNlKSB0aHJvdyBuZXcgU2VuZGVyRXJyb3IoYFBoYXNlICR7cGhhc2VfaWR9IG5vdCBmb3VuZGApO1xuICAgIGN0eC5kYi52ZXJpZmljYXRpb24uaW5zZXJ0KHtcbiAgICAgIGlkOiAwbixcbiAgICAgIHBoYXNlX2lkLFxuICAgICAgLi4uZmllbGRzLFxuICAgICAgY3JlYXRlZF9hdDogY3R4LnRpbWVzdGFtcCxcbiAgICAgIHVwZGF0ZWRfYXQ6IGN0eC50aW1lc3RhbXAsXG4gICAgfSk7XG4gIH1cbik7XG5cbmV4cG9ydCBjb25zdCB1cGRhdGVfdmVyaWZpY2F0aW9uID0gc3BhY2V0aW1lZGIucmVkdWNlcihcbiAge1xuICAgIHZlcmlmaWNhdGlvbl9pZDogdC51NjQoKSxcbiAgICBzdGF0dXM6IHQuc3RyaW5nKCksXG4gICAgc2NvcmU6IHQudTY0KCksXG4gICAgY29udGVudDogdC5zdHJpbmcoKSxcbiAgICByZWNvbW1lbmRlZF9maXhlczogdC5zdHJpbmcoKSxcbiAgfSxcbiAgKGN0eCwgeyB2ZXJpZmljYXRpb25faWQsIC4uLmZpZWxkcyB9KSA9PiB7XG4gICAgY29uc3QgZXhpc3RpbmcgPSBjdHguZGIudmVyaWZpY2F0aW9uLmlkLmZpbmQodmVyaWZpY2F0aW9uX2lkKTtcbiAgICBpZiAoIWV4aXN0aW5nKSB0aHJvdyBuZXcgU2VuZGVyRXJyb3IoYFZlcmlmaWNhdGlvbiAke3ZlcmlmaWNhdGlvbl9pZH0gbm90IGZvdW5kYCk7XG4gICAgY3R4LmRiLnZlcmlmaWNhdGlvbi5pZC51cGRhdGUoe1xuICAgICAgLi4uZXhpc3RpbmcsXG4gICAgICAuLi5maWVsZHMsXG4gICAgICB1cGRhdGVkX2F0OiBjdHgudGltZXN0YW1wLFxuICAgIH0pO1xuICB9XG4pO1xuXG5leHBvcnQgY29uc3QgZGVsZXRlX3ZlcmlmaWNhdGlvbiA9IHNwYWNldGltZWRiLnJlZHVjZXIoXG4gIHsgdmVyaWZpY2F0aW9uX2lkOiB0LnU2NCgpIH0sXG4gIChjdHgsIHsgdmVyaWZpY2F0aW9uX2lkIH0pID0+IHtcbiAgICBjb25zdCBleGlzdGluZyA9IGN0eC5kYi52ZXJpZmljYXRpb24uaWQuZmluZCh2ZXJpZmljYXRpb25faWQpO1xuICAgIGlmICghZXhpc3RpbmcpIHRocm93IG5ldyBTZW5kZXJFcnJvcihgVmVyaWZpY2F0aW9uICR7dmVyaWZpY2F0aW9uX2lkfSBub3QgZm91bmRgKTtcbiAgICBjdHguZGIudmVyaWZpY2F0aW9uLmlkLmRlbGV0ZSh2ZXJpZmljYXRpb25faWQpO1xuICB9XG4pO1xuXG4vLyAtLS0gUmVzZWFyY2ggUmVkdWNlcnMgKFNDSE0tMTApIC0tLVxuXG5leHBvcnQgY29uc3QgaW5zZXJ0X3Jlc2VhcmNoID0gc3BhY2V0aW1lZGIucmVkdWNlcihcbiAge1xuICAgIHBoYXNlX2lkOiB0LnU2NCgpLFxuICAgIGRvbWFpbjogdC5zdHJpbmcoKSxcbiAgICBjb25maWRlbmNlOiB0LnN0cmluZygpLFxuICAgIGNvbnRlbnQ6IHQuc3RyaW5nKCksXG4gIH0sXG4gIChjdHgsIHsgcGhhc2VfaWQsIC4uLmZpZWxkcyB9KSA9PiB7XG4gICAgY29uc3QgcGhhc2UgPSBjdHguZGIucGhhc2UuaWQuZmluZChwaGFzZV9pZCk7XG4gICAgaWYgKCFwaGFzZSkgdGhyb3cgbmV3IFNlbmRlckVycm9yKGBQaGFzZSAke3BoYXNlX2lkfSBub3QgZm91bmRgKTtcbiAgICBjdHguZGIucmVzZWFyY2guaW5zZXJ0KHtcbiAgICAgIGlkOiAwbixcbiAgICAgIHBoYXNlX2lkLFxuICAgICAgLi4uZmllbGRzLFxuICAgICAgY3JlYXRlZF9hdDogY3R4LnRpbWVzdGFtcCxcbiAgICAgIHVwZGF0ZWRfYXQ6IGN0eC50aW1lc3RhbXAsXG4gICAgfSk7XG4gIH1cbik7XG5cbmV4cG9ydCBjb25zdCB1cGRhdGVfcmVzZWFyY2ggPSBzcGFjZXRpbWVkYi5yZWR1Y2VyKFxuICB7XG4gICAgcmVzZWFyY2hfaWQ6IHQudTY0KCksXG4gICAgZG9tYWluOiB0LnN0cmluZygpLFxuICAgIGNvbmZpZGVuY2U6IHQuc3RyaW5nKCksXG4gICAgY29udGVudDogdC5zdHJpbmcoKSxcbiAgfSxcbiAgKGN0eCwgeyByZXNlYXJjaF9pZCwgLi4uZmllbGRzIH0pID0+IHtcbiAgICBjb25zdCBleGlzdGluZyA9IGN0eC5kYi5yZXNlYXJjaC5pZC5maW5kKHJlc2VhcmNoX2lkKTtcbiAgICBpZiAoIWV4aXN0aW5nKSB0aHJvdyBuZXcgU2VuZGVyRXJyb3IoYFJlc2VhcmNoICR7cmVzZWFyY2hfaWR9IG5vdCBmb3VuZGApO1xuICAgIGN0eC5kYi5yZXNlYXJjaC5pZC51cGRhdGUoe1xuICAgICAgLi4uZXhpc3RpbmcsXG4gICAgICAuLi5maWVsZHMsXG4gICAgICB1cGRhdGVkX2F0OiBjdHgudGltZXN0YW1wLFxuICAgIH0pO1xuICB9XG4pO1xuXG5leHBvcnQgY29uc3QgZGVsZXRlX3Jlc2VhcmNoID0gc3BhY2V0aW1lZGIucmVkdWNlcihcbiAgeyByZXNlYXJjaF9pZDogdC51NjQoKSB9LFxuICAoY3R4LCB7IHJlc2VhcmNoX2lkIH0pID0+IHtcbiAgICBjb25zdCBleGlzdGluZyA9IGN0eC5kYi5yZXNlYXJjaC5pZC5maW5kKHJlc2VhcmNoX2lkKTtcbiAgICBpZiAoIWV4aXN0aW5nKSB0aHJvdyBuZXcgU2VuZGVyRXJyb3IoYFJlc2VhcmNoICR7cmVzZWFyY2hfaWR9IG5vdCBmb3VuZGApO1xuICAgIGN0eC5kYi5yZXNlYXJjaC5pZC5kZWxldGUocmVzZWFyY2hfaWQpO1xuICB9XG4pO1xuXG4vLyAtLS0gUGhhc2VDb250ZXh0IFJlZHVjZXJzIChTQ0hNLTExKSAtLS1cblxuZXhwb3J0IGNvbnN0IGluc2VydF9waGFzZV9jb250ZXh0ID0gc3BhY2V0aW1lZGIucmVkdWNlcihcbiAge1xuICAgIHBoYXNlX2lkOiB0LnU2NCgpLFxuICAgIGNvbnRlbnQ6IHQuc3RyaW5nKCksXG4gIH0sXG4gIChjdHgsIHsgcGhhc2VfaWQsIC4uLmZpZWxkcyB9KSA9PiB7XG4gICAgY29uc3QgcGhhc2UgPSBjdHguZGIucGhhc2UuaWQuZmluZChwaGFzZV9pZCk7XG4gICAgaWYgKCFwaGFzZSkgdGhyb3cgbmV3IFNlbmRlckVycm9yKGBQaGFzZSAke3BoYXNlX2lkfSBub3QgZm91bmRgKTtcbiAgICBjdHguZGIucGhhc2VDb250ZXh0Lmluc2VydCh7XG4gICAgICBpZDogMG4sXG4gICAgICBwaGFzZV9pZCxcbiAgICAgIC4uLmZpZWxkcyxcbiAgICAgIGNyZWF0ZWRfYXQ6IGN0eC50aW1lc3RhbXAsXG4gICAgICB1cGRhdGVkX2F0OiBjdHgudGltZXN0YW1wLFxuICAgIH0pO1xuICB9XG4pO1xuXG5leHBvcnQgY29uc3QgdXBkYXRlX3BoYXNlX2NvbnRleHQgPSBzcGFjZXRpbWVkYi5yZWR1Y2VyKFxuICB7XG4gICAgcGhhc2VfY29udGV4dF9pZDogdC51NjQoKSxcbiAgICBjb250ZW50OiB0LnN0cmluZygpLFxuICB9LFxuICAoY3R4LCB7IHBoYXNlX2NvbnRleHRfaWQsIC4uLmZpZWxkcyB9KSA9PiB7XG4gICAgY29uc3QgZXhpc3RpbmcgPSBjdHguZGIucGhhc2VDb250ZXh0LmlkLmZpbmQocGhhc2VfY29udGV4dF9pZCk7XG4gICAgaWYgKCFleGlzdGluZykgdGhyb3cgbmV3IFNlbmRlckVycm9yKGBQaGFzZUNvbnRleHQgJHtwaGFzZV9jb250ZXh0X2lkfSBub3QgZm91bmRgKTtcbiAgICBjdHguZGIucGhhc2VDb250ZXh0LmlkLnVwZGF0ZSh7XG4gICAgICAuLi5leGlzdGluZyxcbiAgICAgIC4uLmZpZWxkcyxcbiAgICAgIHVwZGF0ZWRfYXQ6IGN0eC50aW1lc3RhbXAsXG4gICAgfSk7XG4gIH1cbik7XG5cbmV4cG9ydCBjb25zdCBkZWxldGVfcGhhc2VfY29udGV4dCA9IHNwYWNldGltZWRiLnJlZHVjZXIoXG4gIHsgcGhhc2VfY29udGV4dF9pZDogdC51NjQoKSB9LFxuICAoY3R4LCB7IHBoYXNlX2NvbnRleHRfaWQgfSkgPT4ge1xuICAgIGNvbnN0IGV4aXN0aW5nID0gY3R4LmRiLnBoYXNlQ29udGV4dC5pZC5maW5kKHBoYXNlX2NvbnRleHRfaWQpO1xuICAgIGlmICghZXhpc3RpbmcpIHRocm93IG5ldyBTZW5kZXJFcnJvcihgUGhhc2VDb250ZXh0ICR7cGhhc2VfY29udGV4dF9pZH0gbm90IGZvdW5kYCk7XG4gICAgY3R4LmRiLnBoYXNlQ29udGV4dC5pZC5kZWxldGUocGhhc2VfY29udGV4dF9pZCk7XG4gIH1cbik7XG5cbi8vIC0tLSBDb25maWcgUmVkdWNlcnMgKFNDSE0tMTIpIC0tLVxuXG5leHBvcnQgY29uc3QgdXBzZXJ0X2NvbmZpZyA9IHNwYWNldGltZWRiLnJlZHVjZXIoXG4gIHtcbiAgICBwcm9qZWN0X2lkOiB0LnU2NCgpLFxuICAgIGNvbmZpZzogdC5zdHJpbmcoKSxcbiAgfSxcbiAgKGN0eCwgeyBwcm9qZWN0X2lkLCBjb25maWcgfSkgPT4ge1xuICAgIGNvbnN0IHByb2plY3QgPSBjdHguZGIucHJvamVjdC5pZC5maW5kKHByb2plY3RfaWQpO1xuICAgIGlmICghcHJvamVjdCkgdGhyb3cgbmV3IFNlbmRlckVycm9yKGBQcm9qZWN0ICR7cHJvamVjdF9pZH0gbm90IGZvdW5kYCk7XG5cbiAgICBjb25zdCBleGlzdGluZyA9IFsuLi5jdHguZGIuY29uZmlnLmNvbmZpZ19wcm9qZWN0X2lkLmZpbHRlcihwcm9qZWN0X2lkKV1bMF07XG4gICAgaWYgKGV4aXN0aW5nKSB7XG4gICAgICBjdHguZGIuY29uZmlnLmlkLnVwZGF0ZSh7XG4gICAgICAgIC4uLmV4aXN0aW5nLFxuICAgICAgICBjb25maWcsXG4gICAgICAgIHVwZGF0ZWRfYXQ6IGN0eC50aW1lc3RhbXAsXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY3R4LmRiLmNvbmZpZy5pbnNlcnQoe1xuICAgICAgICBpZDogMG4sXG4gICAgICAgIHByb2plY3RfaWQsXG4gICAgICAgIGNvbmZpZyxcbiAgICAgICAgY3JlYXRlZF9hdDogY3R4LnRpbWVzdGFtcCxcbiAgICAgICAgdXBkYXRlZF9hdDogY3R4LnRpbWVzdGFtcCxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuKTtcblxuZXhwb3J0IGNvbnN0IGRlbGV0ZV9jb25maWcgPSBzcGFjZXRpbWVkYi5yZWR1Y2VyKFxuICB7IGNvbmZpZ19pZDogdC51NjQoKSB9LFxuICAoY3R4LCB7IGNvbmZpZ19pZCB9KSA9PiB7XG4gICAgY29uc3QgZXhpc3RpbmcgPSBjdHguZGIuY29uZmlnLmlkLmZpbmQoY29uZmlnX2lkKTtcbiAgICBpZiAoIWV4aXN0aW5nKSB0aHJvdyBuZXcgU2VuZGVyRXJyb3IoYENvbmZpZyAke2NvbmZpZ19pZH0gbm90IGZvdW5kYCk7XG4gICAgY3R4LmRiLmNvbmZpZy5pZC5kZWxldGUoY29uZmlnX2lkKTtcbiAgfVxuKTtcblxuLy8gLS0tIE11c3RIYXZlIFJlZHVjZXJzIChTQ0hNLTEzKSAtLS1cblxuZXhwb3J0IGNvbnN0IGluc2VydF9tdXN0X2hhdmUgPSBzcGFjZXRpbWVkYi5yZWR1Y2VyKFxuICB7XG4gICAgcGxhbl9pZDogdC51NjQoKSxcbiAgICB0cnV0aHM6IHQuc3RyaW5nKCksXG4gICAgYXJ0aWZhY3RzOiB0LnN0cmluZygpLFxuICAgIGtleV9saW5rczogdC5zdHJpbmcoKSxcbiAgfSxcbiAgKGN0eCwgeyBwbGFuX2lkLCAuLi5maWVsZHMgfSkgPT4ge1xuICAgIGNvbnN0IHBsYW4gPSBjdHguZGIucGxhbi5pZC5maW5kKHBsYW5faWQpO1xuICAgIGlmICghcGxhbikgdGhyb3cgbmV3IFNlbmRlckVycm9yKGBQbGFuICR7cGxhbl9pZH0gbm90IGZvdW5kYCk7XG4gICAgY3R4LmRiLm11c3RIYXZlLmluc2VydCh7XG4gICAgICBpZDogMG4sXG4gICAgICBwbGFuX2lkLFxuICAgICAgLi4uZmllbGRzLFxuICAgICAgY3JlYXRlZF9hdDogY3R4LnRpbWVzdGFtcCxcbiAgICAgIHVwZGF0ZWRfYXQ6IGN0eC50aW1lc3RhbXAsXG4gICAgfSk7XG4gIH1cbik7XG5cbmV4cG9ydCBjb25zdCB1cGRhdGVfbXVzdF9oYXZlID0gc3BhY2V0aW1lZGIucmVkdWNlcihcbiAge1xuICAgIG11c3RfaGF2ZV9pZDogdC51NjQoKSxcbiAgICB0cnV0aHM6IHQuc3RyaW5nKCksXG4gICAgYXJ0aWZhY3RzOiB0LnN0cmluZygpLFxuICAgIGtleV9saW5rczogdC5zdHJpbmcoKSxcbiAgfSxcbiAgKGN0eCwgeyBtdXN0X2hhdmVfaWQsIC4uLmZpZWxkcyB9KSA9PiB7XG4gICAgY29uc3QgZXhpc3RpbmcgPSBjdHguZGIubXVzdEhhdmUuaWQuZmluZChtdXN0X2hhdmVfaWQpO1xuICAgIGlmICghZXhpc3RpbmcpIHRocm93IG5ldyBTZW5kZXJFcnJvcihgTXVzdEhhdmUgJHttdXN0X2hhdmVfaWR9IG5vdCBmb3VuZGApO1xuICAgIGN0eC5kYi5tdXN0SGF2ZS5pZC51cGRhdGUoe1xuICAgICAgLi4uZXhpc3RpbmcsXG4gICAgICAuLi5maWVsZHMsXG4gICAgICB1cGRhdGVkX2F0OiBjdHgudGltZXN0YW1wLFxuICAgIH0pO1xuICB9XG4pO1xuXG5leHBvcnQgY29uc3QgZGVsZXRlX211c3RfaGF2ZSA9IHNwYWNldGltZWRiLnJlZHVjZXIoXG4gIHsgbXVzdF9oYXZlX2lkOiB0LnU2NCgpIH0sXG4gIChjdHgsIHsgbXVzdF9oYXZlX2lkIH0pID0+IHtcbiAgICBjb25zdCBleGlzdGluZyA9IGN0eC5kYi5tdXN0SGF2ZS5pZC5maW5kKG11c3RfaGF2ZV9pZCk7XG4gICAgaWYgKCFleGlzdGluZykgdGhyb3cgbmV3IFNlbmRlckVycm9yKGBNdXN0SGF2ZSAke211c3RfaGF2ZV9pZH0gbm90IGZvdW5kYCk7XG4gICAgY3R4LmRiLm11c3RIYXZlLmlkLmRlbGV0ZShtdXN0X2hhdmVfaWQpO1xuICB9XG4pO1xuXG4vLyAtLS0gU2VlZCBQcm9qZWN0IFJlZHVjZXIgKEJ1bGsgSW5pdGlhbGl6YXRpb24pIC0tLVxuXG5leHBvcnQgY29uc3Qgc2VlZF9wcm9qZWN0ID0gc3BhY2V0aW1lZGIucmVkdWNlcihcbiAge1xuICAgIGdpdF9yZW1vdGVfdXJsOiB0LnN0cmluZygpLFxuICAgIG5hbWU6IHQuc3RyaW5nKCksXG4gICAgZGVzY3JpcHRpb246IHQuc3RyaW5nKCksXG4gICAgY29yZV92YWx1ZTogdC5zdHJpbmcoKSxcbiAgICBjb25zdHJhaW50czogdC5zdHJpbmcoKSxcbiAgICBjb250ZXh0OiB0LnN0cmluZygpLFxuICAgIGtleV9kZWNpc2lvbnM6IHQuc3RyaW5nKCksXG4gICAgcGhhc2VzX2pzb246IHQuc3RyaW5nKCksXG4gICAgcmVxdWlyZW1lbnRzX2pzb246IHQuc3RyaW5nKCksXG4gIH0sXG4gIChjdHgsIGFyZ3MpID0+IHtcbiAgICAvLyAxLiBJbnNlcnQgcHJvamVjdFxuICAgIGNvbnN0IHByb2ogPSBjdHguZGIucHJvamVjdC5pbnNlcnQoe1xuICAgICAgaWQ6IDBuLFxuICAgICAgZ2l0X3JlbW90ZV91cmw6IGFyZ3MuZ2l0X3JlbW90ZV91cmwsXG4gICAgICBuYW1lOiBhcmdzLm5hbWUsXG4gICAgICBkZXNjcmlwdGlvbjogYXJncy5kZXNjcmlwdGlvbixcbiAgICAgIGNvcmVfdmFsdWU6IGFyZ3MuY29yZV92YWx1ZSxcbiAgICAgIGNvbnN0cmFpbnRzOiBhcmdzLmNvbnN0cmFpbnRzLFxuICAgICAgY29udGV4dDogYXJncy5jb250ZXh0LFxuICAgICAga2V5X2RlY2lzaW9uczogYXJncy5rZXlfZGVjaXNpb25zLFxuICAgICAgY3JlYXRlZF9hdDogY3R4LnRpbWVzdGFtcCxcbiAgICAgIHVwZGF0ZWRfYXQ6IGN0eC50aW1lc3RhbXAsXG4gICAgfSk7XG5cbiAgICAvLyAyLiBQYXJzZSBhbmQgaW5zZXJ0IHBoYXNlc1xuICAgIGxldCBwaGFzZXM6IEFycmF5PHtcbiAgICAgIG51bWJlcjogc3RyaW5nO1xuICAgICAgbmFtZTogc3RyaW5nO1xuICAgICAgc2x1Zzogc3RyaW5nO1xuICAgICAgZ29hbDogc3RyaW5nO1xuICAgICAgc3RhdHVzOiBzdHJpbmc7XG4gICAgICBkZXBlbmRzX29uOiBzdHJpbmc7XG4gICAgICBzdWNjZXNzX2NyaXRlcmlhOiBzdHJpbmc7XG4gICAgfT47XG4gICAgdHJ5IHtcbiAgICAgIHBoYXNlcyA9IEpTT04ucGFyc2UoYXJncy5waGFzZXNfanNvbik7XG4gICAgfSBjYXRjaCB7XG4gICAgICB0aHJvdyBuZXcgU2VuZGVyRXJyb3IoYEludmFsaWQgcGhhc2VzX2pzb246IGZhaWxlZCB0byBwYXJzZSBKU09OYCk7XG4gICAgfVxuXG4gICAgbGV0IGZpcnN0UGhhc2VOdW1iZXIgPSAnJztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBoYXNlcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgcCA9IHBoYXNlc1tpXTtcbiAgICAgIGlmIChpID09PSAwKSBmaXJzdFBoYXNlTnVtYmVyID0gcC5udW1iZXI7XG4gICAgICBjdHguZGIucGhhc2UuaW5zZXJ0KHtcbiAgICAgICAgaWQ6IDBuLFxuICAgICAgICBwcm9qZWN0X2lkOiBwcm9qLmlkLFxuICAgICAgICBudW1iZXI6IHAubnVtYmVyLFxuICAgICAgICBuYW1lOiBwLm5hbWUsXG4gICAgICAgIHNsdWc6IHAuc2x1ZyxcbiAgICAgICAgZ29hbDogcC5nb2FsLFxuICAgICAgICBzdGF0dXM6IHAuc3RhdHVzLFxuICAgICAgICBkZXBlbmRzX29uOiBwLmRlcGVuZHNfb24sXG4gICAgICAgIHN1Y2Nlc3NfY3JpdGVyaWE6IHAuc3VjY2Vzc19jcml0ZXJpYSxcbiAgICAgICAgY3JlYXRlZF9hdDogY3R4LnRpbWVzdGFtcCxcbiAgICAgICAgdXBkYXRlZF9hdDogY3R4LnRpbWVzdGFtcCxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIDMuIFBhcnNlIGFuZCBpbnNlcnQgcmVxdWlyZW1lbnRzXG4gICAgbGV0IHJlcXVpcmVtZW50czogQXJyYXk8e1xuICAgICAgY2F0ZWdvcnk6IHN0cmluZztcbiAgICAgIG51bWJlcjogc3RyaW5nO1xuICAgICAgZGVzY3JpcHRpb246IHN0cmluZztcbiAgICAgIHN0YXR1czogc3RyaW5nO1xuICAgICAgcGhhc2VfbnVtYmVyOiBzdHJpbmc7XG4gICAgICBtaWxlc3RvbmVfdmVyc2lvbj86IHN0cmluZztcbiAgICB9PjtcbiAgICB0cnkge1xuICAgICAgcmVxdWlyZW1lbnRzID0gSlNPTi5wYXJzZShhcmdzLnJlcXVpcmVtZW50c19qc29uKTtcbiAgICB9IGNhdGNoIHtcbiAgICAgIHRocm93IG5ldyBTZW5kZXJFcnJvcihgSW52YWxpZCByZXF1aXJlbWVudHNfanNvbjogZmFpbGVkIHRvIHBhcnNlIEpTT05gKTtcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IHJlcSBvZiByZXF1aXJlbWVudHMpIHtcbiAgICAgIGN0eC5kYi5yZXF1aXJlbWVudC5pbnNlcnQoe1xuICAgICAgICBpZDogMG4sXG4gICAgICAgIHByb2plY3RfaWQ6IHByb2ouaWQsXG4gICAgICAgIGNhdGVnb3J5OiByZXEuY2F0ZWdvcnksXG4gICAgICAgIG51bWJlcjogcmVxLm51bWJlcixcbiAgICAgICAgZGVzY3JpcHRpb246IHJlcS5kZXNjcmlwdGlvbixcbiAgICAgICAgc3RhdHVzOiByZXEuc3RhdHVzLFxuICAgICAgICBwaGFzZV9udW1iZXI6IHJlcS5waGFzZV9udW1iZXIsXG4gICAgICAgIG1pbGVzdG9uZV92ZXJzaW9uOiByZXEubWlsZXN0b25lX3ZlcnNpb24gfHwgdW5kZWZpbmVkLFxuICAgICAgICBjcmVhdGVkX2F0OiBjdHgudGltZXN0YW1wLFxuICAgICAgICB1cGRhdGVkX2F0OiBjdHgudGltZXN0YW1wLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gNC4gSW5zZXJ0IGluaXRpYWwgcHJvamVjdF9zdGF0ZVxuICAgIGN0eC5kYi5wcm9qZWN0U3RhdGUuaW5zZXJ0KHtcbiAgICAgIGlkOiAwbixcbiAgICAgIHByb2plY3RfaWQ6IHByb2ouaWQsXG4gICAgICBjdXJyZW50X3BoYXNlOiBmaXJzdFBoYXNlTnVtYmVyLFxuICAgICAgY3VycmVudF9wbGFuOiAwbixcbiAgICAgIGN1cnJlbnRfdGFzazogMG4sXG4gICAgICBsYXN0X2FjdGl2aXR5OiBjdHgudGltZXN0YW1wLFxuICAgICAgbGFzdF9hY3Rpdml0eV9kZXNjcmlwdGlvbjogJ1Byb2plY3QgaW5pdGlhbGl6ZWQgdmlhIHNlZWRfcHJvamVjdCcsXG4gICAgICB2ZWxvY2l0eV9kYXRhOiAnJyxcbiAgICAgIHNlc3Npb25fbGFzdDogJycsXG4gICAgICBzZXNzaW9uX3N0b3BwZWRfYXQ6ICcnLFxuICAgICAgc2Vzc2lvbl9yZXN1bWVfZmlsZTogdW5kZWZpbmVkLFxuICAgICAgdXBkYXRlZF9hdDogY3R4LnRpbWVzdGFtcCxcbiAgICB9KTtcbiAgfVxuKTtcbiJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLElBQUlBLGFBQVcsT0FBTztBQUN0QixJQUFJQyxjQUFZLE9BQU87QUFDdkIsSUFBSUMscUJBQW1CLE9BQU87QUFDOUIsSUFBSUMsc0JBQW9CLE9BQU87QUFDL0IsSUFBSUMsaUJBQWUsT0FBTztBQUMxQixJQUFJQyxpQkFBZSxPQUFPLFVBQVU7QUFDcEMsSUFBSUMsZ0JBQWMsSUFBSSxRQUFRLFNBQVMsWUFBWTtBQUNqRCxRQUFPLFFBQVEsR0FBRyxHQUFHSCxvQkFBa0IsR0FBRyxDQUFDLE1BQU0sTUFBTSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUUsU0FBUyxJQUFJLEVBQUUsSUFBSTs7QUFFN0YsSUFBSUksaUJBQWUsSUFBSSxNQUFNLFFBQVEsU0FBUztBQUM1QyxLQUFJLFFBQVEsT0FBTyxTQUFTLFlBQVksT0FBTyxTQUFTLFlBQ3REO09BQUssSUFBSSxPQUFPSixvQkFBa0IsS0FBSyxDQUNyQyxLQUFJLENBQUNFLGVBQWEsS0FBSyxJQUFJLElBQUksSUFBSSxRQUFR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Q04sUUFBTSxJQUFJLFlBQVksa0RBQWtEOztBQUcxRSxNQUFLLE1BQU0sT0FBTyxhQUNoQixLQUFJLEdBQUcsWUFBWSxPQUFPO0VBQ3hCLElBQUk7RUFDSixZQUFZLEtBQUs7RUFDakIsVUFBVSxJQUFJO0VBQ2QsUUFBUSxJQUFJO0VBQ1osYUFBYSxJQUFJO0VBQ2pCLFFBQVEsSUFBSTtFQUNaLGNBQWMsSUFBSTtFQUNsQixtQkFBbUIsSUFBSSxxQkFBcUI7RUFDNUMsWUFBWSxJQUFJO0VBQ2hCLFlBQVksSUFBSTtFQUNqQixDQUFDO0FBSUosS0FBSSxHQUFHLGFBQWEsT0FBTztFQUN6QixJQUFJO0VBQ0osWUFBWSxLQUFLO0VBQ2pCLGVBQWU7RUFDZixjQUFjO0VBQ2QsY0FBYztFQUNkLGVBQWUsSUFBSTtFQUNuQiwyQkFBMkI7RUFDM0IsZUFBZTtFQUNmLGNBQWM7RUFDZCxvQkFBb0I7RUFDcEIscUJBQXFCO0VBQ3JCLFlBQVksSUFBSTtFQUNqQixDQUFDO0VBRUwiLCJkZWJ1Z0lkIjoiYWVmNDM1OGEtMjI3MS00NzBhLWFhZjMtZDAyZmU3YjBlYzFkIn0=