# Visual math input
Replace an existing input with a visual math editor using MathQuill.

# Where to place the files
* font => the root of the Moodle plugin directory.
* mathquill.css => either copy the contents to styles.css, or include the file from a renderer
* mathquill.js => place in amd/src of plugin (MathQuill is wrapped as an AMD module)
* visual-math-input.js => place in amd/src of plugin - see file for usage (remember to encode args as json string)

# How to include in your Moodle plugin
You need to create a new AMD module to configure the editor.
```javascript
define(['plugin_name/visual-math-input'], function (VisualMath) {
    return {
        initialize: () => {
            let input = new VisualMath.Input('.mathexp .answer input');
            let controls = new VisualMath.ControlList('#controls');
            controls.addInput(input);
        }
    };
});
```

Then call it in the page you want the editor:
```php
$PAGE->requires->js_call_amd('plugin_name/input', 'initialize');
```

The editor also needs to add the two CSS files to the page. This can be done by either copying and pasting the contents into your plugin's "styles.css" file, or by adding the files like so:
```php
$PAGE->requires->css('/path/to/plugin/mathquill.css');
$PAGE->requires->css('/path/to/plugin/visual-math-input.css');
```
Note that the paths are from the Moodle root. Example: /question/type/mathexp/mathquill.css

Keep in mind the css() functions must be called before the head tag is completed. For question types, this should be done in the "head_code(question_attempt)" method of the question type renderer. For modules, it should be done before you output the header.
