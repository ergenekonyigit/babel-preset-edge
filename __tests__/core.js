import { transformFileSync } from "babel-core"
import { readdirSync } from "fs"

const FIXTURE_ROOT = "./__tests__/__fixtures__/"

export function check(fixture, options) {
  expect(transformFileSync(`${FIXTURE_ROOT}${fixture}`, options).code).toMatchSnapshot()
}

export const fixtures = readdirSync(FIXTURE_ROOT)

export function getTitle(fileName) {
  return fileName.replace(/\.js$/, "").replace(/_/, ": ").replace(/-/, " ")
}

export const titles = fixtures.map(getTitle)