import * as args from 'args'
import * as path from 'path'

/**
 * CLI argument names
 */
export enum ECliArgument {
  /**
   * Path to either existent or new target CSS files to put rules to.
   */
  outputCss = 'outputCss',

  /**
   * Path to JSON file containing settings panel connection rules.
   */
  connectionRules = 'connectionRules',

  /**
   * Target project root address (where package.json is located).
   */
  projectRoot = 'projectRoot',
}

/**
 * Format for storing passed argument values
 */
export interface IGeneratorArgs {
  /**
   * Iterator
   */
  [argName: string]: string

  /**
   * Path to either existent or new target CSS files to put rules to.
   */
  outputCss: string

  /**
   * Path to JSON file containing settings panel connection rules.
   */
  connectionRules: string

  /**
   * Target project root address (where package.json is located).
   */
  projectRoot: string
}

/**
 * CLI usage logic
 */
export class Cli {
  /**
   * Stores whether module was successfully launched
   */
  protected launched = false

  /**
   * Stores current CLI argument values
   */
  private args: IGeneratorArgs = {
    outputCss: path.resolve(process.cwd(), 'dist', 'settings.css'),
    connectionRules: path.resolve(process.cwd(), 'settings-panel.json'),
    projectRoot: path.resolve(process.cwd()),
  }

  /**
   * Automatically reads CLI arguments and performs actions based on them
   */
  public constructor() {
    args
      .option(
        ['o', 'outputCss'],
        'Path to either existent or new target CSS files to put rules to.',
        this.args.outputCss,
      )
      .option(
        ['c', 'connectionRules'],
        'Path to JSON file containing settings panel connection rules.',
        this.args.connectionRules,
      )
      .option(
        ['r', 'projectRoot'],
        'Target project root address (where package.json is located).',
        this.args.projectRoot,
      )
      .command('build', 'Read settings connection config and patch CSS.', (name, sub, options) => {
        this.launched = true
        this.storeArguments(options)
      })

      .example('wutc-css-builder build', 'Updates CSS with settings-specific rules.')

    args.parse(process.argv, {
      name: 'wutc-css-builder',
      mri: {},
      mainColor: 'yellow',
      subColor: 'dim',
    })

    if (!this.launched) {
      args.showHelp()
    }
  }

  /**
   * Gathers current value of a particular CLI argument
   * @param arg argument name
   */
  protected getArgument(arg: ECliArgument) {
    return this.args[arg]
  }

  /**
   * Stores entered CLI arguments
   * @param passedArguments arguments entered to CLI
   */
  private storeArguments(passedArguments: any = this.args) {
    for (const argName of Object.keys(this.args)) {
      this.args[argName] = Object.is(passedArguments[argName], undefined)
        ? this.args[argName]
        : passedArguments[argName]
    }
  }
}
