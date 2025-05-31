// src/index.ts
import Client from "ssh2-sftp-client";
import chalk from "chalk";
var autoUpload = (options) => {
  return {
    name: "vite-plugin-auto-upload",
    apply: "build",
    closeBundle: {
      async handler() {
        console.log(chalk.yellow(`Connect Starting`));
        var client = new Client();
        await client.connect(options).then(() => {
          console.log(chalk.blue(`Connect Successful\uFF01\uFF01\uFF01`));
        }).catch((error) => {
          console.log(chalk.red(`Connect Failed: ${error}`));
        });
        console.log(chalk.bgYellow(`Upload Starting...`));
        await client.uploadDir(options.localPath, options.remotePath).then((resolve) => {
          console.log(chalk.bgBlue(`Upload Successful\uFF01\uFF01\uFF01`));
        }).catch((error) => {
          console.log(chalk.bgRed(`Upload Failed: ${error}`));
        });
        await client.end();
        await Decompression(client, options);
        console.log(chalk.bgGreen("Connect Closed"));
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
export {
  index_default as default
};
