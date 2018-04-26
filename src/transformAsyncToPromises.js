// As this is not yet released under Babel v7 we include it manually.
// https://github.com/MatAtBread/babel/blob/e37cdfd138898548ced8edc0b6782aee2de7076c/packages/babel-plugin-transform-async-to-promises/src/index.js
/* Babel 7 transform */

const babylon = require("babylon");
const generate = require("@babel/generator").default;

function printNode(ast) {
  return generate(ast, {}).code;
}

function parse(code) {
  return babylon.parse(code, {
    allowImportExportEverywhere: true,
    allowReturnOutsideFunction: true,
    allowSuperOutsideMethod: true,
  }).program;
}

const transform = require("nodent-transform").transform;

function transformAsyncToPromises(api, options) {
  let requiresTranspilation;
  const runtime = options.runtime
    ? typeof options.runtime === "string" ? options.runtime : "$nodent_runtime"
    : null;
  const opts = {
    // Code generation options
    es6target: false,
    babelTree: true,
    engine: false,
    generators: false,
    promises: true,
    lazyThenables: false,
    wrapAwait: true,
    noRuntime: !runtime,
    $runtime: runtime,
    generatedSymbolPrefix: "$",
    $return: "$return",
    $error: "$error",
    $arguments: "$args",
    $Promise: "Promise",
    $asyncspawn: "$asyncspawn",
    $asyncbind: "$asyncbind",
    $makeThenable: "$makeThenable",
  };

  if (options.codeGenerationOptions) {
    const keys = Object.keys(options.codeGenerationOptions);
    for (let i = 0; i < keys.length; i++) {
      if (keys[i] in opts) {
        opts[keys[i]] = options.codeGenerationOptions[keys[i]];
      }
    }
  }

  return {
    visitor: {
      Program: {
        enter: function() {
          requiresTranspilation = false;
        },
        exit: function(path, state) {
          // Check if there was an async or await keyword before bothering to process the AST
          if (!requiresTranspilation) return;

          const newAst = transform(
            {
              // Input: the ast and filename
              filename: state.filename,
              ast: path.node,
            },
            opts,
            {
              // Helpers for the transformer:
              // Parse a JS fragment into an AST
              parse: parse,
              // Print a node as JS source
              printNode: printNode,
              // Log a warning, eg: console.log.bind(console)
              logger: (msg) => {
                console.warn("Nodent:", msg)
              },
            },
          ).ast;

          if (runtime) {
            newAst.body.splice(0, 0, {
              type: "ImportDeclaration",
              specifiers: [
                {
                  type: "ImportDefaultSpecifier",
                  local: {
                    type: "Identifier",
                    name: runtime,
                  },
                },
              ],
              importKind: "value",
              source: {
                type: "StringLiteral",
                value: "nodent-runtime/promise",
              },
            });
          }
        },
      },

      AwaitExpression: function Function() {
        requiresTranspilation = true;
      },

      Function: function Function(path) {
        if (path.node.async) {
          requiresTranspilation = true;
        }
      },
    },
  };
}

module.exports = transformAsyncToPromises;
