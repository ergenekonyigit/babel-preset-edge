import classPropertiesPlugin from "@babel/plugin-proposal-class-properties"
import objectRestSpreadPlugin from "@babel/plugin-proposal-object-rest-spread"
import decoratorsPlugin from "@babel/plugin-proposal-decorators"
import catchBindPlugin from "@babel/plugin-proposal-optional-catch-binding"
import optionalChainingPlugin from "@babel/plugin-proposal-optional-chaining"

export default function proposals(presets, plugins, options) {
  // Support for @decorators to wrap other functions/classes
  // Must be placed before class properties plugin.
  plugins.push([ decoratorsPlugin, { legacy: true }])

  // Support for ES7 Class Properties (currently stage-2)
  // class { handleClick = () => { } }
  plugins.push([ classPropertiesPlugin, { loose: options.looseMode }])

  // Support for Object Rest Spread `...` operator in objects.
  // { ...todo, completed: true }
  plugins.push([ objectRestSpreadPlugin, { useBuiltIns: true, loose: options.looseMode }])

  // Enables the catch block to execute whether or not an argument
  // is passed to the catch statement
  plugins.push(catchBindPlugin)

  // Support Swift inspired deep object access like `const baz = obj?.foo`
  plugins.push([ optionalChainingPlugin, { loose: options.looseMode }])
}
