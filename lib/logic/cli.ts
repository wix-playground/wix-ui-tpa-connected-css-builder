import * as args from 'args'
import * as path from 'path'

/**
 * CLI argument names
 */
export enum ECliArgument {
  // TODO: Not finished
}

/**
 * Format for storing passed argument values
 */
export interface IGeneratorArgs {
  /**
   * Iterator
   */
  [argName: string]: string

  // TODO: Not finished
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
    // TODO: Not finished
  }

  /**
   * Automatically reads CLI arguments and performs actions based on them
   */
  public constructor() {
    args
      .command('build', 'Start scanning sources and building CSS', (name, sub, options) => {
        this.launched = true
        this.storeArguments(options)
      })
      .example('wutc-css-builder build', 'Generates CSS for project in CWD.')

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
