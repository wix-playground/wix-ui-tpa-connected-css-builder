# WIX UI TPA Connected CSS Builder

This is part of _Wix UI TPA Connected_ project.

This library generates CSS for integrated _wix-ui-tpa-connected_ components and allows connection to site settings at build time without using _Stylable_.

## CLI usage

Prints out help:

```
wutc-css-builder
```

Default usage using suggested paths and file names:

```
wutc-css-builder build
```

Using custom configuration:

```
wutc-css-builder -c ./connection.json -o ./output.css -r ~/my-project build
```

**Supported arguments:**

- **-c** - path to JSON file containing settings panel connection rules
- **-o** - path to either existent or new target CSS files to put rules to
- **-r** - target project root address (where package.json is located)

## Syntax of Connection Rules

Syntax rules should be defined as a JSON file with following structure:

```typescript
/**
 * Rules for connecting project TPA components to settings panel
 */
export interface ISettingsPanelRules {
  [componentName: string]: IComponentRules
}

/**
 * Rules to connect particular TPA component to settings panel
 */
export interface IComponentRules {
  [ruleName: string]: IVariableRules
}

/**
 * Rules to connect particular TPA component variable to settings panel
 */
export interface IVariableRules {
  [variableName: string]: string
}
```

Example:

```json
{
  "Text": {
    "firstRule": {
      "MainTextColor": "red",
      "MainTextFont": "\"font({theme: 'Body-M', size: '50px'})\""
    },
    "secondRule": {
      "MainTextColor": "green",
      "MainTextFont": "\"font({theme: 'Body-M', size: '10px'})\""
    }
  }
}
```

## Documentation

More detailed documentation is available under _./dist/docs_.

## Extending CSS Builder

Currently all connections need to be specified in a single JSON file. It might be more convenient to generate this JSON file dynamically in some way to allow splitting configuration into multiple files, using helper functions, possibly defining connection in code and extracting rules using static analysis. Such improvements should not be part of this package but could be implemented in additional NPM modules so that developers could choose particular usage solution based on their preference.
