import {cac} from 'cac'
import chalk from 'chalk'
import minimist from 'minimist'
import path from 'path'
import { resolveConfig } from './config'
import { createServer } from './server/index' 

const start = Date.now()
const argv = minimist(process.argv.slice(2))
const cli = cac('mini-vite')

// global option
cli
  .option('--config <file>, -c <file>', `[string]  use specified config file`)
  .option('--debug [feat]', `[string | boolean]  show debug logs`)
  .option(
    '--mode <mode>, -m <mode>',
    `[string]  specify env mode (default: 'development' for dev, 'production' for build)`
  )
  .option(
    '--jsx <preset>',
    `['vue' | 'preact' | 'react']  choose jsx preset (default: 'vue')`
  )
  .option('--jsx-factory <string>', `[string]  (default: React.createElement)`)
  .option('--jsx-fragment <string>', `[string]  (default: React.Fragment)`)

// serve
cli
  .command('[root]') // default command
  .alias('serve')
  .option('--port <port>', `[number]  port to listen to`)
  .option(
    '--force',
    `[boolean]  force the optimizer to ignore the cache and re-bundle`
  )
  .option('--https', `[boolean]  start the server with TLS and HTTP/2 enabled`)
  .option('--open', `[boolean]  open browser on server start`)
  .action(async (root, argv) => {
    if (root) {
      argv.root = root
    }
    console.log(argv)
    const options = await resolveOptions({ argv, defaultMode: 'development' })
    return runServe(options)
  })

cli.help()
cli.version(import('../../package.json').version)
cli.parse()

async function resolveOptions(argv, defaultMode) {

    Object.keys(argv).forEach((key) => {
        if (argv[key] === 'false') {
          argv[key] = false
        }
        if (argv[key] === 'true') {
          argv[key] = true
        }
    })
    
    if (argv.root) {
    argv.root = path.isAbsolute(argv.root) ? argv.root : path.resolve(argv.root)
    }

    const userConfig = await resolveConfig(
        argv.mode || defaultMode,
        argv.config || argv.c
    )

    return { ...userConfig, ...argv }
}

function runServe(options) {
    const server = createServer(options)

    
}