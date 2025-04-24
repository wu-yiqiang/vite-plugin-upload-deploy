import Client from 'ssh2-sftp-client'
import chalk from 'chalk';
interface Options {
  host: string,
  port: number,
  username: string,
  password: string,
  localPath: string,
  remotePath: string,
}
const autoUpload = (options: Options) => {
  return {
    name: 'vite-plugin-auto-upload',
    apply: "build",
    closeBundle: {
      async handler() {
        console.log(chalk.yellow(`Connect Starting`))
        var client = new Client();
        await client.connect(options).then(() => {
          console.log(chalk.blue(`Connect Successful！！！`))
        }).catch(() => {
          console.log(chalk.red(`Connect Failed`))
        })
        console.log(chalk.bgYellow(`Upload Starting...`))
        await client.uploadDir(options.localPath, options.remotePath).then((resolve: any) => {
          console.log(chalk.bgBlue(`Upload Successful！！！`))
        }).catch((error: Error) => {
          console.log(chalk.bgRed(`Upload Failed: ${error}`))
        })
        await client.end();
        console.log(chalk.bgGreen("Connect Closed"))
      }
    },
  }
}


export default autoUpload;