const forms = require("forms");
const fields = forms.fields;
const validators = forms.validators;
const widgets = forms.widgets;

var bootstrapField = function (name, object) {
    if (!Array.isArray(object.widget.classes)) { object.widget.classes = []; }

    if (object.widget.type == 'multipleCheckbox' || object.widget.type == 'multipleRadio') {
        object.widget.classes.push('form-check-input');
        object.widget.classes.push('format-checkbox');
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
            validators: [validators.minlength(5)]
        }),
        description: fields.string({
            required: true,
            errorAfterField: true,
            widget: widgets.textarea()
        }),
        cost: fields.number({
            required: true,
            errorAfterField: true,
            validators: [validators.min(0)]
        }),
        height: fields.number({
            required: true,
            errorAfterField: true,
            validators: [validators.integer(), validators.min(0)],
            label: ['Height(mm)']
        }),
        launch_status: fields.string({
            required: true,
            errorAfterField: true,
            choices: [
                [0, 'no'], [1, 'yes']
            ],
            widget: widgets.select(),
        }),
        blind_box: fields.string({
            required: true,
            errorAfterField: true,
            choices: [
                [0, 'no'], [1, 'yes']
            ],
            widget: widgets.select()
        }),
        release_date: fields.date({
            required: true,
            errorAfterField: true,
            widget: widgets.date(),
            validators: [validators.date()]
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
            label: 'Media mediums for series: ',
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label', 'form-check-inline']
            },
            widget: widgets.multipleCheckbox({
                labelClasses: ['format-checkbox', 'form-check-label'],
            }),
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
    }, { validatePastFirstError: true })
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
    }, { validatePastFirstError: true })
};

const createSearchForm = (figureTypes, series, collections, manufacturers) => {
    return forms.create({
        name: fields.string({
            required: false,
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
            choices: figureTypes,
            label: ['Figure type']
        }),
        series_id: fields.string({
            required: false,
            widget: widgets.select(),
            choices: series,
            label: ['Series']
        }),
        collection_id: fields.string({
            required: false,
            widget: widgets.select(),
            choices: collections,
            label: ['Collection']
        }),
        release_date: fields.date({
            required: false,
            widget: widgets.date()
        }),
        manufacturer_id: fields.string({
            required: false,
            widget: widgets.select(),
            choices: manufacturers,
            label: ['Manufacturer']
        }),
        launch_status: fields.string({
            required: false,
            choices: [
                [-1, '---select launch status---'], [0, 'no'], [1, 'yes']
            ],
            widget: widgets.select(),
        }),
        blind_box: fields.string({
            required: false,
            choices: [
                [-1, '---select blindbox---'], [0, 'no'], [1, 'yes']
            ],
            widget: widgets.select()
        }),
        stock_status: fields.string({
            required: false,
            choices: [
                [-1, '---select stock status---'], [0, 'sold out'], [1, 'in stock']
            ],
            widget: widgets.select()
        })

    }, { validatePastFirstError: true })
};

const createOrderStatusForm = (status) => {
    return forms.create({
        order_status_id: fields.string({
            required: true,
            widget: widgets.select(),
            choices: status,
            cssClasses: {
                label: ['d-none']
            }
        })
    }, { validatePastFirstError: true })
};

const createNewUserForm = () => {
    return forms.create({
        username: fields.string({
            required: true,
            errorAfterField: true,
            validators: [validators.minlength(5)]
        }),
        email: fields.email({
            required: true,
            errorAfterField: true,
            widget: widgets.email(),
            validators: [validators.email()]
        }),
        password: fields.password({
            required: true,
            errorAfterField: true,
            widget: widgets.password()
        }),
        confirm_password: fields.password({
            required: true,
            errorAfterField: true,
            widget: widgets.password(),
            validators: [validators.matchField('password')]
        }),
        first_name: fields.string({
            required: true,
            errorAfterField: true,
            validators: [validators.minlength(3)]
        }),
        last_name: fields.string({
            required: true,
            errorAfterField: true,
            validators: [validators.minlength(3)]
        }),
        contact_number: fields.string({
            required: true,
            errorAfterField: true,
            validators: [validators.minlength(8)]
        }),
        street: fields.string({
            required: true,
            errorAfterField: true,
        }),
        unit: fields.string({
            required: true,
            errorAfterField: true
        }),
        postal: fields.string({
            required: true,
            errorAfterField: true,
            validators: [validators.digits(), validators.minlength(6), validators.maxlength(6)]
        })
    }, { validatePastFirstError: true })
};

const changeAdminPassword = () => {
    return forms.create({
        password: fields.password({
            required: true,
            errorAfterField: true,
            widget: widgets.password()
        }),
        confirm_password: fields.password({
            required: true,
            errorAfterField: true,
            widget: widgets.password(),
            validators: [validators.matchField('password')]
        }),
    }, { validatePastFirstError: true })
};

const createSearchOrdersForm = (orderStatus) => {
    return forms.create({
        order_id: fields.number({
            required: false,
        }),
        email: fields.string({
            required: false
        }),
        order_status_id: fields.string({
            required: false,
            widget: widgets.select(),
            choices: orderStatus,
            label: ['Order status']
        }),
        ordered_date: fields.date({
            required: false,
            widget: widgets.date()
        }),
        payment_reference: fields.string({
            required: false
        })
    })
};

const updateCollectionForm = (manufacturers) => {
    return forms.create({
        collection_name: fields.string({
            required: true,
            errorAfterField: true,
            validators: [validators.minlength(3)]
        }),
        manufacturer_id: fields.string({
            required: true,
            errorAfterField: true,
            widget: widgets.select(),
            choices: manufacturers
        })
    }, { validatePastFirstError: true })
};

const updateManufacturerForm = () => {
    return forms.create({
        manufacturer_name: fields.string({
            required: true,
            errorAfterField: true,
            validators: [validators.minlength(3)]
        })
    }, { validatePastFirstError: true })
};

const CreateNewAdminForm = () => {
    return forms.create({
        first_name: fields.string({
            required: true,
            errorAfterField: true,
            validators: [validators.minlength(3)]
        }),
        last_name: fields.string({
            required: true,
            errorAfterField: true,
            validators: [validators.minlength(3)]
        }),
        username: fields.string({
            required: true,
            errorAfterField: true,
            validators: [validators.minlength(5)]
        }),
        email: fields.email({
            required: true,
            errorAfterField: true,
            widget: widgets.email(),
            validators: [validators.email()]
        }),
        password: fields.password({
            required: true,
            errorAfterField: true,
            widget: widgets.password()
        }),
        confirm_password: fields.password({
            required: true,
            errorAfterField: true,
            widget: widgets.password(),
            validators: [validators.matchField('password')]
        })
    }, { validatePastFirstError: true })

};

module.exports = {
    createFigureForm, bootstrapField, createLoginForm, createSearchForm,
    createOrderStatusForm, createNewUserForm, changeAdminPassword,
    createSearchOrdersForm, updateCollectionForm,
    updateManufacturerForm, CreateNewAdminForm
}