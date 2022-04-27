# Find React Legacy Context Usages

The title says it. See sample reports in [here](/tests/expected/class-component-report.json) and [here](/tests/expected/functional-component-report.json).

### What's supported?

```
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
}

SampleFunctionalComponent.childContextTypes = {
    darkMode: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
}
```

### What's not supported?

```
class SampleComponent extends React.Component {
    static contextTypes = someStupidVariableContainingTheContextTypes;
    static childContextTypes = someStupidVariableContainingTheChildContextTypes;
}
```
