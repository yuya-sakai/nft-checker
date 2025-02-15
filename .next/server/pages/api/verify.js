"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/api/verify";
exports.ids = ["pages/api/verify"];
exports.modules = {

/***/ "ethers":
/*!*************************!*\
  !*** external "ethers" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("ethers");

/***/ }),

/***/ "(api)/./config.js":
/*!*******************!*\
  !*** ./config.js ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n// config.js\nconst config = {\n    networkName: \"Base Mainnet\",\n    rpcEndpoint: \"https://mainnet.base.org\",\n    chainId: 8453,\n    contractAddress: \"0x1D6b183bD47F914F9f1d3208EDCF8BefD7F84E63\"\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (config);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9jb25maWcuanMuanMiLCJtYXBwaW5ncyI6Ijs7OztBQUFBLFlBQVk7QUFDWixNQUFNQSxNQUFNLEdBQUc7SUFDYkMsV0FBVyxFQUFFLGNBQWM7SUFDM0JDLFdBQVcsRUFBRSwwQkFBMEI7SUFDdkNDLE9BQU8sRUFBRSxJQUFJO0lBQ2JDLGVBQWUsRUFBRSw0Q0FBNEM7Q0FDOUQ7QUFFRCxpRUFBZUosTUFBTSxFQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbmZ0LWNoZWNrZXIvLi9jb25maWcuanM/YzJiMyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBjb25maWcuanNcbmNvbnN0IGNvbmZpZyA9IHtcbiAgbmV0d29ya05hbWU6IFwiQmFzZSBNYWlubmV0XCIsXG4gIHJwY0VuZHBvaW50OiBcImh0dHBzOi8vbWFpbm5ldC5iYXNlLm9yZ1wiLFxuICBjaGFpbklkOiA4NDUzLFxuICBjb250cmFjdEFkZHJlc3M6IFwiMHgxRDZiMTgzYkQ0N0Y5MTRGOWYxZDMyMDhFRENGOEJlZkQ3Rjg0RTYzXCJcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNvbmZpZztcbiJdLCJuYW1lcyI6WyJjb25maWciLCJuZXR3b3JrTmFtZSIsInJwY0VuZHBvaW50IiwiY2hhaW5JZCIsImNvbnRyYWN0QWRkcmVzcyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(api)/./config.js\n");

/***/ }),

/***/ "(api)/./pages/api/verify.js":
/*!*****************************!*\
  !*** ./pages/api/verify.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var ethers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ethers */ \"ethers\");\n/* harmony import */ var ethers__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(ethers__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../config */ \"(api)/./config.js\");\n// pages/api/verify.js\n\n\nasync function handler(req, res) {\n    if (req.method !== \"POST\") {\n        return res.status(405).json({\n            error: \"Method not allowed\"\n        });\n    }\n    const { walletAddress  } = req.body;\n    if (!walletAddress) {\n        return res.status(400).json({\n            error: \"ウォレットアドレスが必要です\"\n        });\n    }\n    try {\n        // プロバイダーを設定\n        const provider = new ethers__WEBPACK_IMPORTED_MODULE_0__.ethers.providers.JsonRpcProvider(_config__WEBPACK_IMPORTED_MODULE_1__[\"default\"].rpcEndpoint, _config__WEBPACK_IMPORTED_MODULE_1__[\"default\"].chainId);\n        // ERC-1155 の balanceOfBatch 関数を利用するための最小限の ABI\n        const erc1155Abi = [\n            \"function balanceOfBatch(address[] accounts, uint256[] ids) view returns (uint256[])\"\n        ];\n        const contract = new ethers__WEBPACK_IMPORTED_MODULE_0__.ethers.Contract(_config__WEBPACK_IMPORTED_MODULE_1__[\"default\"].contractAddress, erc1155Abi, provider);\n        // 例として token ID 0～100 をチェックする\n        const maxTokenId = 100; // 必要に応じて変更してください\n        const tokenIds = Array.from({\n            length: maxTokenId + 1\n        }, (_, i)=>i);\n        const accounts = Array(tokenIds.length).fill(walletAddress);\n        // バッチで各 token ID の残高を取得\n        const balances = await contract.balanceOfBatch(accounts, tokenIds);\n        // 残高が1以上のトークンがあれば、NFT 保有と判断する\n        const ownsNFT = balances.some((balance)=>balance.gt(0));\n        res.status(200).json({\n            ownsNFT\n        });\n    } catch (err) {\n        console.error(err);\n        res.status(500).json({\n            error: err.toString()\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9wYWdlcy9hcGkvdmVyaWZ5LmpzLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQSxzQkFBc0I7QUFDVTtBQUNFO0FBRW5CLGVBQWVFLE9BQU8sQ0FBQ0MsR0FBRyxFQUFFQyxHQUFHLEVBQUU7SUFDOUMsSUFBSUQsR0FBRyxDQUFDRSxNQUFNLEtBQUssTUFBTSxFQUFFO1FBQ3pCLE9BQU9ELEdBQUcsQ0FBQ0UsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDQyxJQUFJLENBQUM7WUFBRUMsS0FBSyxFQUFFLG9CQUFvQjtTQUFFLENBQUMsQ0FBQztJQUMvRCxDQUFDO0lBRUQsTUFBTSxFQUFFQyxhQUFhLEdBQUUsR0FBR04sR0FBRyxDQUFDTyxJQUFJO0lBQ2xDLElBQUksQ0FBQ0QsYUFBYSxFQUFFO1FBQ2xCLE9BQU9MLEdBQUcsQ0FBQ0UsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDQyxJQUFJLENBQUM7WUFBRUMsS0FBSyxFQUFFLGdCQUFnQjtTQUFFLENBQUMsQ0FBQztJQUMzRCxDQUFDO0lBRUQsSUFBSTtRQUNGLFlBQVk7UUFDWixNQUFNRyxRQUFRLEdBQUcsSUFBSVgsb0VBQWdDLENBQ25EQywyREFBa0IsRUFDbEJBLHVEQUFjLENBQ2Y7UUFFRCwrQ0FBK0M7UUFDL0MsTUFBTWUsVUFBVSxHQUFHO1lBQ2pCLHFGQUFxRjtTQUN0RjtRQUVELE1BQU1DLFFBQVEsR0FBRyxJQUFJakIsbURBQWUsQ0FBQ0MsK0RBQXNCLEVBQUVlLFVBQVUsRUFBRUwsUUFBUSxDQUFDO1FBRWxGLDhCQUE4QjtRQUM5QixNQUFNUyxVQUFVLEdBQUcsR0FBRyxFQUFHLGlCQUFpQjtRQUMxQyxNQUFNQyxRQUFRLEdBQUdDLEtBQUssQ0FBQ0MsSUFBSSxDQUFDO1lBQUVDLE1BQU0sRUFBRUosVUFBVSxHQUFHLENBQUM7U0FBRSxFQUFFLENBQUNLLENBQUMsRUFBRUMsQ0FBQyxHQUFLQSxDQUFDLENBQUM7UUFDcEUsTUFBTUMsUUFBUSxHQUFHTCxLQUFLLENBQUNELFFBQVEsQ0FBQ0csTUFBTSxDQUFDLENBQUNJLElBQUksQ0FBQ25CLGFBQWEsQ0FBQztRQUUzRCx3QkFBd0I7UUFDeEIsTUFBTW9CLFFBQVEsR0FBRyxNQUFNWixRQUFRLENBQUNhLGNBQWMsQ0FBQ0gsUUFBUSxFQUFFTixRQUFRLENBQUM7UUFFbEUsOEJBQThCO1FBQzlCLE1BQU1VLE9BQU8sR0FBR0YsUUFBUSxDQUFDRyxJQUFJLENBQUNDLENBQUFBLE9BQU8sR0FBSUEsT0FBTyxDQUFDQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFdkQ5QixHQUFHLENBQUNFLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQ0MsSUFBSSxDQUFDO1lBQUV3QixPQUFPO1NBQUUsQ0FBQyxDQUFDO0lBQ3BDLEVBQUUsT0FBT0ksR0FBRyxFQUFFO1FBQ1pDLE9BQU8sQ0FBQzVCLEtBQUssQ0FBQzJCLEdBQUcsQ0FBQyxDQUFDO1FBQ25CL0IsR0FBRyxDQUFDRSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUNDLElBQUksQ0FBQztZQUFFQyxLQUFLLEVBQUUyQixHQUFHLENBQUNFLFFBQVEsRUFBRTtTQUFFLENBQUMsQ0FBQztJQUNsRCxDQUFDO0FBQ0gsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL25mdC1jaGVja2VyLy4vcGFnZXMvYXBpL3ZlcmlmeS5qcz9mYjEzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIHBhZ2VzL2FwaS92ZXJpZnkuanNcbmltcG9ydCB7IGV0aGVycyB9IGZyb20gJ2V0aGVycyc7XG5pbXBvcnQgY29uZmlnIGZyb20gJy4uLy4uL2NvbmZpZyc7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgaWYgKHJlcS5tZXRob2QgIT09ICdQT1NUJykge1xuICAgIHJldHVybiByZXMuc3RhdHVzKDQwNSkuanNvbih7IGVycm9yOiAnTWV0aG9kIG5vdCBhbGxvd2VkJyB9KTtcbiAgfVxuXG4gIGNvbnN0IHsgd2FsbGV0QWRkcmVzcyB9ID0gcmVxLmJvZHk7XG4gIGlmICghd2FsbGV0QWRkcmVzcykge1xuICAgIHJldHVybiByZXMuc3RhdHVzKDQwMCkuanNvbih7IGVycm9yOiAn44Km44Kp44Os44OD44OI44Ki44OJ44Os44K544GM5b+F6KaB44Gn44GZJyB9KTtcbiAgfVxuXG4gIHRyeSB7XG4gICAgLy8g44OX44Ot44OQ44Kk44OA44O844KS6Kit5a6aXG4gICAgY29uc3QgcHJvdmlkZXIgPSBuZXcgZXRoZXJzLnByb3ZpZGVycy5Kc29uUnBjUHJvdmlkZXIoXG4gICAgICBjb25maWcucnBjRW5kcG9pbnQsXG4gICAgICBjb25maWcuY2hhaW5JZFxuICAgICk7XG5cbiAgICAvLyBFUkMtMTE1NSDjga4gYmFsYW5jZU9mQmF0Y2gg6Zai5pWw44KS5Yip55So44GZ44KL44Gf44KB44Gu5pyA5bCP6ZmQ44GuIEFCSVxuICAgIGNvbnN0IGVyYzExNTVBYmkgPSBbXG4gICAgICBcImZ1bmN0aW9uIGJhbGFuY2VPZkJhdGNoKGFkZHJlc3NbXSBhY2NvdW50cywgdWludDI1NltdIGlkcykgdmlldyByZXR1cm5zICh1aW50MjU2W10pXCJcbiAgICBdO1xuXG4gICAgY29uc3QgY29udHJhY3QgPSBuZXcgZXRoZXJzLkNvbnRyYWN0KGNvbmZpZy5jb250cmFjdEFkZHJlc3MsIGVyYzExNTVBYmksIHByb3ZpZGVyKTtcblxuICAgIC8vIOS+i+OBqOOBl+OBpiB0b2tlbiBJRCAw772eMTAwIOOCkuODgeOCp+ODg+OCr+OBmeOCi1xuICAgIGNvbnN0IG1heFRva2VuSWQgPSAxMDA7ICAvLyDlv4XopoHjgavlv5zjgZjjgablpInmm7TjgZfjgabjgY/jgaDjgZXjgYRcbiAgICBjb25zdCB0b2tlbklkcyA9IEFycmF5LmZyb20oeyBsZW5ndGg6IG1heFRva2VuSWQgKyAxIH0sIChfLCBpKSA9PiBpKTtcbiAgICBjb25zdCBhY2NvdW50cyA9IEFycmF5KHRva2VuSWRzLmxlbmd0aCkuZmlsbCh3YWxsZXRBZGRyZXNzKTtcblxuICAgIC8vIOODkOODg+ODgeOBp+WQhCB0b2tlbiBJRCDjga7mrovpq5jjgpLlj5blvpdcbiAgICBjb25zdCBiYWxhbmNlcyA9IGF3YWl0IGNvbnRyYWN0LmJhbGFuY2VPZkJhdGNoKGFjY291bnRzLCB0b2tlbklkcyk7XG5cbiAgICAvLyDmrovpq5jjgYwx5Lul5LiK44Gu44OI44O844Kv44Oz44GM44GC44KM44Gw44CBTkZUIOS/neacieOBqOWIpOaWreOBmeOCi1xuICAgIGNvbnN0IG93bnNORlQgPSBiYWxhbmNlcy5zb21lKGJhbGFuY2UgPT4gYmFsYW5jZS5ndCgwKSk7XG5cbiAgICByZXMuc3RhdHVzKDIwMCkuanNvbih7IG93bnNORlQgfSk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7IGVycm9yOiBlcnIudG9TdHJpbmcoKSB9KTtcbiAgfVxufVxuIl0sIm5hbWVzIjpbImV0aGVycyIsImNvbmZpZyIsImhhbmRsZXIiLCJyZXEiLCJyZXMiLCJtZXRob2QiLCJzdGF0dXMiLCJqc29uIiwiZXJyb3IiLCJ3YWxsZXRBZGRyZXNzIiwiYm9keSIsInByb3ZpZGVyIiwicHJvdmlkZXJzIiwiSnNvblJwY1Byb3ZpZGVyIiwicnBjRW5kcG9pbnQiLCJjaGFpbklkIiwiZXJjMTE1NUFiaSIsImNvbnRyYWN0IiwiQ29udHJhY3QiLCJjb250cmFjdEFkZHJlc3MiLCJtYXhUb2tlbklkIiwidG9rZW5JZHMiLCJBcnJheSIsImZyb20iLCJsZW5ndGgiLCJfIiwiaSIsImFjY291bnRzIiwiZmlsbCIsImJhbGFuY2VzIiwiYmFsYW5jZU9mQmF0Y2giLCJvd25zTkZUIiwic29tZSIsImJhbGFuY2UiLCJndCIsImVyciIsImNvbnNvbGUiLCJ0b1N0cmluZyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(api)/./pages/api/verify.js\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./pages/api/verify.js"));
module.exports = __webpack_exports__;

})();