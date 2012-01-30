/**
 * @requires widgets/tips/SliderTip.js
 */

Ext.namespace("gxp.slider");

gxp.slider.RangeSliderTip = Ext.extend(gxp.slider.Tip, {

    /** api: config[template]
     *  ``String``
     *  Template for the tip. Can be customized using the following keywords in
     *  curly braces:
     *
     *  * ``startDate`` - the start date of the WFS requests.
     *  * ``endDate`` - the end date of the WFS requests.
     */
    template: '<div>{startDate}/{endDate}</div>',

    /** private: property[compiledTemplate]
     *  ``Ext.Template``
     *  The template compiled from the ``template`` string on init.
     */
    compiledTemplate: null,

    /** private: method[init]
     *  Called to initialize the plugin.
     */
    init: function(slider) {
        this.slider = slider;
        this.compiledTemplate = new Ext.Template(this.template);
        gxp.slider.RangeSliderTip.superclass.init.call(this, slider);
    },

    /** private: method[getText]
     *  :param slider: ``Ext.slider.SingleSlider`` The slider this tip is attached to.
     */
    getText: function(thumb) {
        var data = {
            startDate: this.slider.startDate,
            endDate: this.slider.endDate
        };
        return this.compiledTemplate.apply(data);
    }

});
