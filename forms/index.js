const forms = require("forms");
const fields = forms.fields;
const validators = forms.validators;
const widgets = forms.widgets;

var bootstrapField = function (name, object) {
    if (!Array.isArray(object.widget.classes)) { object.widget.classes = []; }

    if (object.widget.type == 'multipleCheckbox' || object.widget.type == 'multipleRadio'){
        object.widget.classes.push('form-check-input');
    }

    if (object.widget.classes.indexOf('form-control') === -1 && !object.widget.classes.includes('form-check-input')) {
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

const createFigureForm = (figureType, series, collection, groupings) => {
    return forms.create({
        name: fields.string({
            required: true,
            errorAfterField: true,
            validators: [validators.minlength(5)],
            validatePastFirstError: true
        }),
        cost: fields.number({
            required: true,
            errorAfterField: true,
            validators: [validators.integer(), validators.min(0)],
            validatePastFirstError: true
        }),
        height: fields.number({
            required: true,
            errorAfterField: true,
            validators: [validators.integer(), validators.min(0)],
            validatePastFirstError: true
        }),
        launch_status: fields.boolean({
            required: true,
            errorAfterField: true,
            choices: {
                yes: true,
                no: false
            },
            widget: widgets.select(),
        }),
        release_date: fields.date({
            required: true,
            errorAfterField: true,
            validators: [validators.date()],
            validatePastFirstError: true
        }),
        quantity: fields.number({
            required: true,
            errorAfterField: true,
            validators: [validators.integer()],
        }),
        figure_type_id: fields.string({
            label: 'Type of figure',
            required: true,
            errorAfterField: true,
            widget: widgets.select(),
            choices: figureType
        }),
        series_id: fields.string({
            label: 'Series',
            required: true,
            errorAfterField: true,
            widget: widgets.select(),
            choices: series
        }),
        medium_id: fields.string({
            label: 'Media medium',
            required: true,
            errorAfterField: true,
            widget: widgets.multipleCheckbox(),
            choices: groupings,
        }),
        collection_id: fields.string({
            label: 'Collection',
            required: true,
            errorAfterField: true,
            widget: widgets.select(),
            choices: collection
        }),
        image_url: fields.string({
            widget: widgets.hidden()
        })
    })
};

const createLoginForm = () => {
   return forms.create({
     email: fields.string({
        required: true,
        errorAfterField: true,
    }),
    password: fields.password({
        required: true,
        errorAfterField: true
    })
})
};

const createSearchForm = (figureTypes, series, collections) => {
    return forms.create({
        name: fields.string({
            required: false,
            errorAfterField: true
        }),
        min_cost: fields.string({
            required: false,
            errorAfterField: true,
            validators: [validators.integer()]
        }),
        max_cost: fields.string({
            required: false,
            errorAfterField: true,
            validators: [validators.integer()]
        }),
        figure_type_id: fields.string({
            required: false,
            widget: widgets.select(),
            errorAfterField: true,
            choices: figureTypes
        }),
        series_id: fields.string({
            required: false,
            widget: widgets.select(),
            choices: series
        }),
        collection_id: fields.string({
            required: false,
            widget: widgets.select(),
            choices: collections
        }),
        last_updated: fields.date({
            required: false,
            widget: widgets.date()
        })
        
    })
}
module.exports = { createFigureForm, bootstrapField, createLoginForm, createSearchForm }