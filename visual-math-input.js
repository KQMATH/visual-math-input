define(['jquery', './mathquill'], function ($, MathQuill) {

    // When a control button is clicked, the input blurs.
    // This lets the control button know which input to act on.
    let lastFocusedInput = null;

    class Input {

        constructor(input, parent) {
            this.$input = $(input);
            this.$parent = $(parent);
            let wrapper = document.createElement('div');
            $(wrapper).addClass('visual-math-input-field');
            let MQ = MathQuill.getInterface(2);
            this.field = MQ.MathField(wrapper, {
                spaceBehavesLikeTab: true,
                handlers: {
                    edit: field => {
                        this.onEdit($(input), field);
                    }
                }
            });
            this.$parent.append(wrapper);
            this.onEdit = ($input, field) => $input.val('\\[ ' + field.latex() + ' \\]');
            this.$textarea.on('blur', () => lastFocusedInput = this);
        }

        get $textarea() {
            return $(this.field.el()).find('textarea');
        }

        enable() {
            this.$textarea.prop('disabled', false);
        }

        disable() {
            this.$textarea.prop('disabled', true);
        }

    }

    class Control {

        constructor(name, text, onClick) {
            this.name = name;
            this.text = text;
            this.onClick = onClick;
            this.$element = null;
        }

        enable() {
            if (this.$element !== null) {
                return;
            }
            let element = document.createElement('button');
            this.$element = $(element);
            this.$element.html(this.text);
            this.$element.addClass('visual-math-input-control btn btn-primary');
            this.$element.on('click', event => {
                event.preventDefault();
                if (lastFocusedInput !== null) {
                    this.onClick(lastFocusedInput.field);
                    lastFocusedInput.field.focus();
                }
            });
        }

    }

    class ControlList {

        constructor(wrapper) {
            this.controls = [];
            this.$wrapper = $(wrapper);
            this.$wrapper.addClass('visual-math-input-wrapper');
            this.defineDefault();
        }

        define(name, text, onClick) {
            this.controls[name] = new Control(name, text, onClick);
        }

        enable(names) {
            for (let name of names) {
                let control = this.controls[name];
                control.enable();
                this.$wrapper.append(control.$element);
            }
        }

        enableAll() {
            for (let name in this.controls) {
                let control = this.controls[name];
                control.enable();
                this.$wrapper.append(control.$element);
            }
        }

        defineDefault() {
            // It is also possible to render \\[ \\binom{n}{k} \\] with MathJax.
            // Using MathQuill's HTML output is slightly less clean, but we avoid using YUI and MathJax.
            let nchoosek = '<div class="mq-math-mode" style="cursor:pointer;font-size:100%;">';
            nchoosek += '<span class="mq-root-block">';
            nchoosek += '<span class="mq-non-leaf">';
            nchoosek += '<span class="mq-paren mq-scaled" style="transform: scale(0.8, 1.5);">(</span>';
            nchoosek += '<span class="mq-non-leaf" style="margin-top:0;">';
            nchoosek += '<span class="mq-array mq-non-leaf">';
            nchoosek += '<span style="font-size: 14px;"><var>n</var></span>';
            nchoosek += '<span style="font-size: 14px;"><var>k</var></span>';
            nchoosek += '</span></span>';
            nchoosek += '<span class="mq-paren mq-scaled" style="transform: scale(0.8, 1.5);">)</span></span>';
            nchoosek += '</span></div>';
            this.define('sqrt', '&radic;', field => field.cmd('\\sqrt'));
            this.define('int', '&int;', field => field.cmd('\\int'));
            this.define('dint', '&int;<sub>0</sub><sup>1</sup>', field => {
                field.cmd('\\int');
                field.typedText('_0').moveToRightEnd();
                field.typedText('^1').moveToRightEnd();
            });
            this.define('sum', '&sum;', field => field.cmd('\\sum'));
            this.define('lim', 'lim', field => {
                field.cmd('\\lim').typedText('_').write('x').cmd('\\to').write('0').moveToRightEnd();
            });
            this.define('nchoosek', nchoosek, field => field.cmd('\\choose'));
            this.define('divide', '/', field => field.cmd('\\frac'));
            this.define('plusminus', '&plusmn;', field => field.cmd('\\pm'));
            this.define('theta', '&theta;', field => field.cmd('\\theta'));
            this.define('pi', '&pi;', field => field.cmd('\\pi'));
            this.define('infinity', '&infin;', field => field.cmd('\\infinity'));
        }

    }

    return {
        Input: Input,
        Control: Control,
        ControlList: ControlList
    };

});
