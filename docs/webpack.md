
# Webpack

[Webpack] is a tool for bundling javascript files into a single file, often named bundle.js. Webpack is often run from build configurations in the node package.json file. Webpack can be run with options that change the way files are bundled. These options are supplied as command line arguments and provide parameters to the webpack configuration. The configuration for webpack is specified in a configuration file that is often named webpack.config.js.

By default webpack will bundle all application information into bundle file. This includes source maps that aid developers by mapping code in the bundle to its original source file. Webpack, along with external plugins, can reduce the size of the of the bundle.js file for production by moving both source maps and css styles into external files.

## Configuration Types

Webpack provides a number of options for exporting the configuration in the webpack.config.js file. Each option representing one of the [Webpack configuration types] is enumerated as follows:

1. exporting a single object
2. exporting a function
3. exporting a promise
4. exporting multiple configurations

In this document, we will discuss two configuration types, exporting a single object and function. A single object is useful for getting started with webpack, but eventually the file must disambiguate between development and production builds. Exporting a function is the way to do this.

### Webpack Configuration as a Single Object

The following example shows single webpack configuration object. Configuratons are static in they can't specify different build environments based on arguments provided to the webpack command.

```javascript
module.exports = {
    entry: './src/App.js',
    ...
}
```

### Webpack Configuration as a Function

In the following example, the webpack configuration is specified as a function. If we export a function we can specify the env parameter using the webpack --env option. The function below will select the type of output source-map based on the value of env.

```javascript
module.exports = (env) => {
  return ({
    ...
    devtool: env === 'production' ? 'source-map' : 'cheap-module-eval-source-map',
  })
};
```

The --env option is specified as a argument to the webpack command. The following example shows webpack running with the env function parameter specified as 'production'.

Below is the webpack command setting the env string to 'production':
```bash
webpack -p --env production
```
## Webpack Configuration

### Entry and Output

The webpack configuration usually contains two important attributes, the entry and the output.

1. entry - the application root file loaded and executed at run time. In the example below, our application executes the App.js file.
2. output - object specifies the output bundle file and its path. In the example below, the output of webpack will go to the bundle.js file located in the public folder, relative to the webpack.config.js location. Note
__dirname is the location of the webpack.config.js file. 

```javascript
module.exports = {
  entry: './src/App.js',
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js'
  },
  //-------------------
```

### Modules and Loaders

Webpack modules are loadable packages used to process input files. Modules exist for processing javascript language extensions, css and scss styles, typescript, and many others. Modules are implemented as loaders which describe to webpack how to process these different types of input files.

Modules specify a set of rules for loading and processing the different types of files the format of the module is a module object containing an array of rules. Each loader will have its own rule. In its basic form a rule contains a test,resources to including and/or excluding files, and a loader.

The test condition specifies which files to process. Include and exclude conditions specify 
files that are explicitly included or excluded from the tests. The loader specifies the plugin that will process files that match the test, include, and exclude conditions.

The example below specifies two module rules and four loaders: babel, style, css, and sass. In the first rule, the loader babel is used to process files matching '*.js'. Files paths matching node_modules will be excluded. The second rule will 'use' loaders style, css, and sass on files matching *.?css (css, scss, etc). The loaders are chained together and applied in the order specified.
  

```javascript
  //-------------------
  module: {
    rules: [{
      loader: 'babel-loader',
      test: /\.js$/,
      exclude: /node_modules/
    },
    {
      test: /\.?css$/,
      use: [
        'style-loader',
        'css-loader',
        'sass-loader'
      ]
    }]
  },
```
### Devtool and Separating Source Maps info External Files

  The attirbute [devtool] choses the style of [source mapping] provided. In the example below, the 'cheap-module-eval-source-map' is an inline source map and will include the source map in the bundle.js file. It does mimimum processing of the source map offering fast performance at the expense of large bundle.js files. The source-map option generates a separate source map file which can be used for debugging, but is not included
  in the bundle.js file. The resulting smaller bundle.js file can be put into production while still giving
  developers  access to the source map should they require it.

  The attribute 'devServer' species options to the web server at runtime. In the example below the devServer will find its contents in the 'public' folder relative to the location specified by __dirname. The full path name is constructed by joining the __dirname variable with the string 'public'. The module 'path' provides the join function.

```javascript
const path = require('path');

module.export {
  ...
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    historyApiFallback: true
  }
};
```
### Separating CSS to an External File

Webpack css out can be directed to separate file using an additional plugin extract-text-webpack-plugin. The plugin provides an object that will extract the css and sccs content and output it to a separate css file. The object takes a constructor value containing the css file output name. Input is specified to the object's extract function that accepts an object containing an array of loaders to process the css and sccs output. Note that the required object does not need to use the styles-loader as it is providing that function.

```javascript
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = (env) => {
  const CSSExtract = new ExtractTextPlugin('styles.css');

  return ({
    ...
    module: {
      rules: [{
        test: /\.?css$/,
        use: CSSExtract.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: true
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true
              }
            }
          ]
        })
      }]
      ...
    },
    ...
  })
};
```

## Example Webpack Configuration File

The final [webpack.config.js] file contains the typical configuration for a multiple build environment exporting both source maps and styles to files separate from the bundle.js file.

[Webpack]: https://webpack.js.org
[extract-text-webpack-plugin]: https://github.com/webpack-contrib/extract-text-webpack-plugin
[Webpack documentation website]: https://webpack.js.org/concepts
[source mapping]: https://survivejs.com/webpack/building/source-maps
[Webpack Configuration Types]: https://webpack.js.org/configuration/configuration-types
[Webpack How to Guides]: https://webpack.js.org/guides
[devtool]: https://webpack.js.org/configuration/devtool
[webpack.config.js]: ../webpack.config.js
