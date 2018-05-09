import envPreset from "@babel/preset-env"
import transformRuntimePlugin from "@babel/plugin-transform-runtime"

import getEnvTargets from "../getEnvTargets"

export default function env(presets, plugins, options) {
  const exclude = []

  exclude.push("transform-regenerator", "transform-async-to-generator")

  // Exclude all es2015 features which are supported by the default es2015 babel preset.
  // This targets all es2015-capable browsers and engines.
  if (options.transpile === "es2015") {
    exclude.push(
      "transform-template-literals",
      "transform-literals",
      "transform-function-name",
      "transform-arrow-functions",
      "transform-block-scoped-functions",
      "transform-classes",
      "transform-object-super",
      "transform-shorthand-properties",
      "transform-duplicate-keys",
      "transform-computed-properties",
      "transform-for-of",
      "transform-sticky-regex",
      "transform-unicode-regex",
      "transform-spread",
      "transform-parameters",
      "transform-destructuring",
      "transform-block-scoping",
      "transform-typeof-symbol"

      // These are not really features to transpile down
      // "transform-modules-commonjs",
      // "transform-modules-systemjs",
      // "transform-modules-amd",
      // "transform-modules-umd"

      // This is already excluded by default
      // "transform-regenerator"
    )
  }

  presets.push([
    envPreset,
    {
      // Setting this to false will not transform modules.
      modules: options.modules,

      // Prefer built-ins which also prefers global polyfills which is the right thing to do
      // for most scenarios like SPAs and NodeJS environments.
      useBuiltIns: "usage",

      // Options to tweak the details of the implementation. If both are `false` the environment
      // preset is executed in default mode.
      loose: options.looseMode,
      spec: options.specMode,

      // Debug output of features, plugins and presets which are enabled.
      debug: false,

      // We prefer the transpilation of the "fast-async" plugin over the
      // slower and more complex Babel internal implementation.
      exclude,

      // Differ between development and production for our scope.
      // NodeJS is generally fine in development to match the runtime version which is currently installed.
      targets: getEnvTargets(options)
    }
  ])

  // Use helpers, but not polyfills, in a way that omits duplication.
  // For polyfills better use polyfill.io or another more sophisticated solution.
  plugins.push([
    transformRuntimePlugin,
    {
      helpers: true,
      regenerator: false,
      polyfill: false,
      useBuiltIns: true,
      useESModules: options.modules === false
    }
  ])

  if (options.debug) {
    /* eslint-disable no-nested-ternary */
    console.log("- Module Settings:", options.modules === false ? "ESM" : options.modules)
    console.log(
      "- Transpilation Compliance:",
      options.specMode ? "SPEC" : options.looseMode ? "LOOSE" : "DEFAULT"
    )
  }
}