import buildPreset from "../src"
import { fixtures, titles, check } from "./core"

describe("Browserslist", () => {
  const options = buildPreset(null, {
    target: "browser",
    sourceMaps: false,
    env: "development"
  })

  fixtures.forEach((fileName, index) => {
    test(titles[index], () => check(fileName, options))
  })
})