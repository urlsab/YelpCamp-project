const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');
// "start": "node app.js"
const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension);
const shortcutEscape = Joi.string().required().escapeHTML();
const shortcutNumber = Joi.number().required();

module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: shortcutEscape,
        price: shortcutNumber.min(0),
        location: shortcutEscape,
        description: shortcutEscape
    }).required(),
    deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: shortcutNumber.min(1).max(5),
        body: shortcutEscape
    }).required()
});