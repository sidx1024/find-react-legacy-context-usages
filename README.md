# Find React Legacy Context Usages

The title says it. See sample reports in [here](/tests/expected/class-component-report.json) and [here](/tests/expected/functional-component-report.json).

## Usage

```shell
npx find-react-legacy-context-usages \
    "./src/**/*.{js,jsx}" \
    --report-file="./legacy-context-usages-report.json"
```

Important: Don't forget the double-quotes in path glob.

## What's supported?

```js
// ClassProperty
class SampleComponent extends React.Component {
  static contextTypes = {
    darkMode: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
  };

  static childContextTypes = {
    darkMode: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
  };
}

// AssignmentExpression
function SampleFunctionalComponent() {}

SampleFunctionalComponent.contextTypes = {
  darkMode: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
};

SampleFunctionalComponent.childContextTypes = {
  darkMode: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
};
```

## What's not supported?

```js
class SampleComponent extends React.Component {
  static contextTypes = someStupidVariableContainingTheContextTypes;
  static childContextTypes = someStupidVariableContainingTheChildContextTypes;
}
```
