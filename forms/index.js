const forms = require("forms");
const fields = forms.fields;
const validators = forms.validators;
const widgets = forms.widgets;

var bootstrapField = function (name, object) {
    if (!Array.isArray(object.widget.classes)) { object.widget.classes = []; }

    if (object.widget.classes.indexOf('form-control') === -1) {
        object.widget.classes.push('form-control');
    }

    var validationclass = object.value && !object.error ? 'is-valid' : '';
    validationclass = object.error ? 'is-invalid' : validationclass;
    if (validationclass) {
        object.widget.classes.push(validationclass);
    }

    var label = object.labelHTML(name);
    var error = object.error ? '<div class="invalid-feedback">' + object.error + '</div>' : '';

    var widget = object.widget.toHTML(name, object);
    return '<div class="form-group">' + label + widget + error + '</div>';
};

const createFigureForm = () => {
    return forms.create({
        name: fields.string({
            required: true,
            errorAfterField: true,
            validators: [validators.minlength(10)]
        }),
        cost: fields.number({
            required: true,
            errorAfterField: true,
            validators: [validators.integer()]
        }),
        height: fields.number({
            required: true,
            errorAfterField: true,
            validators: [validators.integer()]
        }),
        launch_status: fields.boolean({
            required: true,
            errorAfterField: true,
            choices: {
                yes: true,
                no: false
            },
            widget: widgets.select()
        }),
        release_date: fields.date({
            required: true,
            errorAfterField: true,
            validators: [validators.date()]
        }),
        quantity: fields.number({
            required: true,
            errorAfterField: true,
            validators: [validators.integer()]
        })
    })
}

module.exports = { createFigureForm, bootstrapField }