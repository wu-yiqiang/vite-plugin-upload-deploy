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
        await Decompression(client)
        console.log(chalk.bgGreen("Connect Closed"))
      }
    },
  }
}


const Decompression = (conn: any, options: Options) => {
    conn.shell((err: Error,stream: any)=>{
        stream.end(
            `
             cd ${options.remotePath}
             mv ../www/wwwroot/vuedist bak/vuedist.$(date "+%Y%m%d%H%M%")
             tar zxvf dist.tar.gz
             mv dist ../www/wwwroot/vuedist
             rm -rf dist.tar.gz
             exit
            `
        ).on('data',(data: any) =>{
            console.log(data.toString())
        }).on('close',()=>{
            conn.end()
        })
    })
}


export default autoUpload;