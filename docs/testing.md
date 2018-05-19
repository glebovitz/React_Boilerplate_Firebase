# setting up testing

## Reducer and Action Testing

* install jest
* use jest test method
* create test data
* run call to action or reducer
* return results
* use expect methods to compare results to test data

## Component testing

Component testing requires a framework for comparing rendered components to expected results.
One important of comparing results is to use a snapshot of a correctly rendered components
in response to test input data. Snapshots are created using a test renderer framework that
also provides methods for comparing shapshot the results of running test on modified code.
There are many testing frameworks, but two used in the course are react-test-renderer
and Enzyme. Enzyme provides more capabilities than react-test-render. Renderer renders code using
plain old javascript.

### react-test-renderer

In the project folder (directory) install react-test renderer using the yarn command
in a terminal window.

```bash
$ yarn add react-test-renderer
```
start the test suite using yarn test

#### Shallow rendering

Shallow rendering compares rendered high level components against the snapshot.
You can use react-test-renderer to perform shallow rendering by importing the shallow
renderer in react-test-renderer/shallow using the following javascript code.

```javascript
import ReactShallowRenderer from 'react-test-renderer/shallow';
```

An example of a test file for testing a component called _Header_ would be named header.test.js and contain the following imports, tests, and expect code:
```javascript
import React from 'react';
import ReactShallowRenderer from 'react-test-renderer/shallow';
import Header from 'components/Header';

test('test Header renderer for correctness'), () => {
  const renderer = new ReactShallowRenderer();
  renderer.render(<Header />);
  expect(renderer.getRenderedOutput()).toMatchSnapshot();
}
```

The first time you run the toMatchSnapshot code, expect will create a snapshot file containing the
rendered code. As the snapshot doesn't already exist, the first run of the test code will result
in a failed test. Subsequent tests will pass as long as the test renders the same output.

If the test renders output different than the snapshot, jest will output an error and a diff
between the snapshot and the test output.

If the test fails due to code improvements, then a new snapshot can be saved by typing u (for update) in
the terminal running jest.

The snapshots are rendered into the _snapshots_ folder containing the test code. The snapshot file name is the test
file name with the added extension .snap. For example the snapshot for our header.test.js will be rendered in
the _snapshots_ folder as header.test.js.snap.

### Enzyme

In this document we will use Enzyme version 3. Enzyme provides a more complete set of tools for testing
renderered code. For example, react-test-renderer only renders snapshots. Unlike Enzyme, it provides no tools for testing interactive components such as buttons or inputs.

Enzyme was created by AirBnB.

#### Setting up Enzyme version 3 with plugins

To set up Enzyme version 3 we must install plugins for React version 16 in addition to Enzyme. We must also
set up a jest config jest.config.json to load the plugins. jest.config.json will reference a file setupTests.js
that will contain code to set up Enzyme. In addition to the Enzyme plugins, we will need to install the polyfill library for request animation frame that is usually provided in the browser.

Configuration of Enzyme 3 with examples can be found in the Enzyme documentation at [the AirBnB Enzyme](http://airbnb.io/enzyme) site.

Steps to install and configure Enzyme 3:

1. Install Enzyme 3, the react-16 adapter, and raf polyfill run the command
```bash
$ yarn add enzyme@^3.0.0 enzyme-adapter-react-16@^1.0.0 raf@^3.3.2
```
2. Create the setupTests.js file under the project's tests folder and enter the required imports and call to
set up the adapter.
```javascript
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({
  adapter: new Adapter();
});
```

3. Create the jest.config.json file and add the reference to raf/polyfill and our setupTests.js file we created above:
```json
{
  "setupFiles": [
    "raf/polyfill",
    "<RootDir>/src/tests/setupTests.js"
  ]
}
```

Details for setting up jest.config.js can be found at the [Facebook Jest Documentation](https://facebook.github.io/jest/en/docs/configuration.html) site.

3. In package.json, add a command to the test script entry to reference the jest jest.config.json configuration file. In the "test" entry for "jest" and the option "--config=jest.config.json".
```json
  //---- snippet -----
  "scripts": {
    "serve": "live-server public/",
    "build": "webpack",
    "dev-server": "webpack-dev-server",
    "test": "jest --config=jest.config.json"
  },
  //---- snippet ------
  ```

#### Using Enzyme Shallow Rendering

1. In the jest test file for the component, import shallow from enzyme. In our example test file for the Header component we would add:
```javascript
import { shallow } from 'enzyme';
```

2. Add the enzyme shallow test to the test file:
```javascript
import React from 'react';
import { shallow } from 'enzyme';
import Header from 'components/Header';

test('test Header renderer for correctness'), () => {
  const wrapper = shallow(<Header />);
  expect(wrapper).toMatchSnapshot();
}
```
The snapshot for the Enzyme shallow wrapper will contain a lot of internal state that will change with each run of the test and will generate errors. To eliminate this internal state, we will use the enzyme-to-json package to eliminate the internal state, leaving just the rendered components. To install this package run the command:

```bash
$ yarn add enzyme-to-json@^3.0.1
```

3.  Set up enzyme-to-json to work automatically on our shallow wrapper, we will add additional configuration to our jest.config.json file. In addition to the "setupFiles" json entry, we will add an entry for "snaphotSerializer" as follows:

```json
{
  "setupFiles": [
    "raf/polyfill",
    "<rootDir>/src/tests/setupTests.js"
  ],
  // ---- add serializer here
  "snapshotSerializers": [
    "enzyme-to-json/serializer"
  ]
}
```
