import buildPreset from "../src"
import { fixtures, titles, check } from "./core"

const options = buildPreset(null, { modules: false, target: { browsers: "ie 11" }, sourceMaps: false })

// Keep formatting for tests (to keep output/diffs readable)
options.minified = false
options.compact = false

fixtures.forEach((fileName, index) => {
  test(titles[index], () => check(fileName, options))
})