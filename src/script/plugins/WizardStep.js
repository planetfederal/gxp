/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the BSD license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/*
 * @require plugins/Tool.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = WizardStep
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: WizardStep(config)
 *
 *    Base class for application plugins that are part of a wizard interface.
 *    To use this in an application, the outputTarget of each wizard step needs
 *    to go into the same container, with no other items in it. Also, the
 *    container needs to be configured with the
 *    :class:`gxp.plugins.WizardContainer` plugin.
 */   
gxp.plugins.WizardStep = Ext.extend(gxp.plugins.Tool, {
    
    autoActivate: false,
    
    /** private: property[index]
     *  ``Number`` index of this tool in the wizard container. Used for
     *  enabling and disabling step panels in sequence when another step
     *  changes its valid state. Implementations need to call the ``setValid``
     *  method to change the valid state of the wizard step.
     */
    index: null,
    
    /** private: property[valid]
     *  ``Boolean`` Is the wizard step's form currently valid?
     */
    valid: false,
    
    /** private: method[addOutput]
     *  :arg config: ``Object
     */
    addOutput: function(config) {
        var output = Ext.ComponentMgr.create(Ext.apply(config, this.outputConfig));
        output.on("added",function(cmp, ct) {
            this.index = ct.ownerCt.items.indexOf(ct);
            ct.setDisabled(this.index != 0);
            ct.on({
                "wizardstepvalid": function(plugin) {
                    if (this.previousStepsCompleted(this)) {
                        ct.enable();
                    }
                },
                "wizardstepinvalid": function(plugin) {
                    if (!this.previousStepsCompleted(this)) {
                        ct.disable();
                    }
                },
                scope: this
            });
            ct.on({
                "expand": this.activate,
                "collapse": this.deactivate,
                scope: this
            });
        }, this);
        return gxp.plugins.WizardStep.superclass.addOutput.call(this, output);
    },
    
    /** api: method[setValid]
     *  :arg valid: ``Boolean`` is the step's state valid?
     *  :arg data: ``Object`` data gathered by this step. Only required if
     *      ``valid`` is true.
     *
     *  Implementations should call this method to change their valid state
     */
    setValid: function(valid, data) {
        this.valid = valid;
        if (valid) {
            this.output.ownerCt.fireEvent("valid", this, data);
        } else {
            this.output.ownerCt.fireEvent("invalid", this);
        }
    },

    /** private: method[previousStepsCompleted]
     *  :returns: ``Boolean`` true when all previous steps are completed
     */
    previousStepsCompleted: function(plugin) {
        var index = plugin.index, completed = true;
        if (index > 0) {
            var tool;
            for (var i in this.target.tools) {
                tool = this.target.tools[i];
                if (tool instanceof gxp.plugins.WizardStep && tool.index < index) {
                    completed = completed && tool.valid;
                }
            }            
        }
        return completed;
    }

});