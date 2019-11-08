import * as fs from 'fs'
import * as mkdirp from 'mkdirp'
import * as path from 'path'
import * as rimraf from 'rimraf'
import {StyleBuilder} from './style-builder'

const CACHE_PATH = path.resolve(__dirname, '..', '..', 'cache', 'test')
const OUTPUT_FILE = path.resolve(CACHE_PATH, 'output.css')

const getOutput = () => fs.readFileSync(OUTPUT_FILE, {encoding: 'utf8'})

describe('StyleBuilder', () => {
  const builder = new StyleBuilder(
    path.resolve(__dirname, '..', '..'),
    path.resolve(__dirname, '..', 'test', 'settings-rules.json'),
    OUTPUT_FILE,
  )

  beforeAll(() => {
    rimraf.sync(CACHE_PATH)
    mkdirp.sync(CACHE_PATH)
    builder.build()
  })

  it('generates output file', () => {
    expect(fs.existsSync(OUTPUT_FILE)).toBeTruthy()
  })

  it('generates selectors for all rules', () => {
    const style = getOutput()
    const rules = ['firstRule', 'secondRule']

    rules.forEach(rule => {
      expect(style.includes(rule)).toBeTruthy()
    })
  })

  it('generates multiple selectors per rule', () => {
    const style = getOutput()

    const selectors = [
      /\.vText\-firstRule\.u40599u.{11,11}\.s[0-9]{3,3}\[data\-text396940269\-mobile\]\[data\-text396940269\-typography=smallTitle\]/,
      /\.vText\-firstRule\.u40599u.{11,11}\.s[0-9]{3,3}\[data\-text396940269\-mobile\]\[data\-text396940269\-typography=runningText\]/,
      /\.vText\-secondRule\.u40599u.{11,11}\.s[0-9]{3,3}\[data\-text396940269\-mobile\]\[data\-text396940269\-typography=listText\]/,
      /\.vText\-secondRule\.u40599u.{11,11}\.s[0-9]{3,3}\[data\-text396940269\-mobile\]\[data\-text396940269\-typography=largeTitle\]/,
    ]

    selectors.forEach(selector => {
      expect(style.match(selector)).toBeTruthy()
    })
  })

  it('includes original component styles', () => {
    expect(getOutput().includes('--overridable')).toBeTruthy()
  })
})
