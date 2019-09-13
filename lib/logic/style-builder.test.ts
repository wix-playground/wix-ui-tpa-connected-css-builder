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
      '.vText-firstRule .usktwiduek0i0cicr.s188[data-text185136048-mobile][data-text185136048-typography=smallTitle]',
      '.vText-firstRule .usktwiduek0i0cicr.s188[data-text185136048-mobile][data-text185136048-typography=runningText]',
      '.vText-secondRule .usktwiduek0i0cicr.s188[data-text185136048-mobile][data-text185136048-typography=listText]',
      '.vText-secondRule .usktwiduek0i0cicr.s188[data-text185136048-mobile][data-text185136048-typography=largeTitle]',
    ]

    selectors.forEach(selector => {
      expect(style.includes(selector)).toBeTruthy()
    })
  })

  it('includes original component styles', () => {
    expect(getOutput().includes('--overridable')).toBeTruthy()
  })
})