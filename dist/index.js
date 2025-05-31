"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  default: () => index_default
});
module.exports = __toCommonJS(index_exports);
var import_ssh2_sftp_client = __toESM(require("ssh2-sftp-client"));
var import_chalk = __toESM(require("chalk"));
var autoUpload = (options) => {
  return {
    name: "vite-plugin-auto-upload",
    apply: "build",
    closeBundle: {
      async handler() {
        console.log(import_chalk.default.yellow(`Connect Starting`));
        var client = new import_ssh2_sftp_client.default();
        await client.connect(options).then(() => {
          console.log(import_chalk.default.blue(`Connect Successful\uFF01\uFF01\uFF01`));
        }).catch((error) => {
          console.log(import_chalk.default.red(`Connect Failed: ${error}`));
        });
        console.log(import_chalk.default.bgYellow(`Upload Starting...`));
        await client.uploadDir(options.localPath, options.remotePath).then((resolve) => {
          console.log(import_chalk.default.bgBlue(`Upload Successful\uFF01\uFF01\uFF01`));
        }).catch((error) => {
          console.log(import_chalk.default.bgRed(`Upload Failed: ${error}`));
        });
        await client.end();
        await Decompression(client, options);
        console.log(import_chalk.default.bgGreen("Connect Closed"));
      }
    }
  };
};
var Decompression = (conn, options) => {
  conn.shell((err, stream) => {
    stream.end(
      `
             cd ${options.remotePath}
             tar zxvf ${options.uploadFileName}
             exit
            `
    ).on("data", (data) => {
      console.log(data.toString());
    }).on("close", () => {
      conn.end();
    });
  });
};
var index_default = autoUpload;
