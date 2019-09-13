import {NodeModules} from 'find-node-module'
import * as fs from 'fs'
import * as path from 'path'

/**
 * Supported wix-ui-tpa-connected component library name
 */
export const COMPONENT_MODULE_NAME = 'wix-ui-tpa-connected'

const NO_MEDIA_QUERY = 'NO_MEDIA'

/**
 * Style builder class for dynamic classes
 */
export class StyleBuilder {
  private rulesPath: string
  private outputPath: string
  private componentModulePath: string

  constructor(projectRoot: string, rulesPath: string, outputPath: string) {
    this.rulesPath = path.resolve(rulesPath)
    this.outputPath = path.resolve(outputPath)
    this.componentModulePath = new NodeModules(path.resolve(projectRoot)).find(COMPONENT_MODULE_NAME)
  }

  public build() {
    const structure = this.getStructure()
    const rules = this.getSettingsPanelRules()
    const style = this.generateStyle(structure, rules)
    this.outputStyle(style)
  }

  private generateStyle(structure: IProjectVariableStructure, rules: ISettingsPanelRules): string {
    let style = ''
    const map: ICssMap = {}

    Object.entries(rules).forEach(([componentName, componentRules]) => {
      style += this.getComponentStyle(componentName) + '\n'

      Object.entries(componentRules).forEach(([ruleName, variables]) => {
        const namespace = `v${componentName}-${ruleName}`

        Object.entries(variables).forEach(([variableName, rule]) => {
          if (structure[componentName] && structure[componentName][variableName]) {
            structure[componentName][variableName].forEach(({mediaQuery, selector, declaration}) => {
              selector = `.${namespace} ${selector}`
              mediaQuery = mediaQuery || NO_MEDIA_QUERY
              map[mediaQuery] = map[mediaQuery] || {}
              map[mediaQuery][selector] = map[mediaQuery][selector] || []
              map[mediaQuery][selector].push(`${declaration}: ${rule}`)
            })
          }
        })
      })
    })

    Object.entries(map).forEach(([media, selectors]) => {
      style += media === NO_MEDIA_QUERY ? '' : `${media} {`

      Object.entries(selectors).forEach(([selector, styles]) => {
        style += `${selector} {`
        style += styles.join(';')
        style += '}'
      })

      style += media === NO_MEDIA_QUERY ? '' : '}'
    })

    return style
  }

  private getComponentStyle(componentName: string): string {
    const expectedPath = path.resolve(this.componentModulePath, `${componentName}.bundle.css`)
    return fs.existsSync(expectedPath) ? fs.readFileSync(expectedPath, {encoding: 'utf8'}) : ''
  }

  private getSettingsPanelRules(): ISettingsPanelRules {
    return JSON.parse(fs.readFileSync(this.rulesPath, {encoding: 'utf8'}))
  }

  private getStructure(): IProjectVariableStructure {
    const structurePath = path.resolve(this.componentModulePath, 'structure.json')
    return JSON.parse(fs.readFileSync(structurePath, {encoding: 'utf8'}))
  }

  private outputStyle(style: string) {
    const output = fs.existsSync(this.outputPath) ? fs.appendFileSync : fs.writeFileSync
    output(this.outputPath, style, {encoding: 'utf8'})
  }
}

/**
 * Information about how variables of all project components are applied
 */
export interface IProjectVariableStructure {
  /**
   * Information about component variables
   */
  [componentName: string]: IComponentVariableStructure
}

/**
 * Information about how component variables are applied
 */
export interface IComponentVariableStructure {
  /**
   * Information about particular component variable
   */
  [variableName: string]: IVariableStructure[]
}

/**
 * Information where variable is applied in styles
 */
export interface IVariableStructure {
  /**
   * Media query selector if it is needed
   */
  mediaQuery?: string

  /**
   * Full CSS selector used to apply variable value
   */
  selector: string

  /**
   * CSS rule which is used to apply variable value to.
   * For example - color.
   */
  declaration: string
}

/**
 * CSS rule structure
 */
export interface ICssMap {
  [mediaQuery: string]: ISelectorRules
}

/**
 * CSS rule structure for a particular media query
 */
export interface ISelectorRules {
  [selector: string]: string[]
}

/**
 * Rules for connecting project TPA components to settings panel
 */
export interface ISettingsPanelRules {
  [componentName: string]: IComponentRules
}

/**
 * Rules to connect particular TPA component to settings panel
 */
export interface IComponentRules {
  [ruleName: string]: IVariableRules
}

/**
 * Rules to connect particular TPA component variable to settings panel
 */
export interface IVariableRules {
  [variableName: string]: string
}
