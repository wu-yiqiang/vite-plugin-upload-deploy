import Client from 'ssh2-sftp-client'
import chalk from 'chalk';
import fs from 'fs'
interface Options {
  host: string,
  port: number,
  username: string,
  password: string,
  localPath: string,
  remotePath: string,
  uploadFileName: string,
  isNeedUzip: boolean
}

const checkZipFile = (path: string): boolean => {
  if (path.includes('.zip')) return  true
  return  false
}
const autoUpload = (options: Options) => {
  let isFile = false
  const stats = fs.statSync(options?.localPath);
  if (stats.isFile()) isFile = true
  const isZipFile = checkZipFile(options?.localPath)
  const isNeedUzip = isZipFile && options.isNeedUzip
  return {
    name: 'vite-plugin-auto-upload',
    apply: "build",
    closeBundle: {
      async handler() {
        console.log(chalk.yellow(`Connect Starting`))
        var client = new Client();
        await client.connect(options).then(() => {
          console.log(chalk.blue(`Connect Successful！！！`))
        }).catch((error: Error) => {
          console.log(chalk.red(`Connect Failed: ${error}`))
        })
        console.log(chalk.bgYellow(`Upload Starting...`))
        if (isFile) {
          // 上传文件
          
        } else {
          await client.uploadDir(options.localPath, options.remotePath).then((resolve: any) => {
            console.log(chalk.bgBlue(`Upload Successful！！！`))
          }).catch((error: Error) => {
            console.log(chalk.bgRed(`Upload Failed: ${error}`))
          })
        }

        if (isNeedUzip) {
          // await Decompression(client, options)
          console.log(chalk.bgGreen("Decompress successful"))
        }
        await client.end();
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
             tar zxvf ${options.uploadFileName}
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