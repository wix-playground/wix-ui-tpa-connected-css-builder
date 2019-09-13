import {Cli, ECliArgument} from './cli'
import {StyleBuilder} from './style-builder'

/**
 * Launches CSS build based on CLI arguments
 */
export class Launcher extends Cli {
  /**
   * Constructor - launches generation based on CLI
   */
  constructor() {
    super()

    const builder = new StyleBuilder(
      this.getArgument(ECliArgument.projectRoot),
      this.getArgument(ECliArgument.connectionRulesPath),
      this.getArgument(ECliArgument.outputCssPath),
    )

    builder.build()
  }
}
