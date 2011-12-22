gxp.plugins.FeatureEditorForm = Ext.extend(Ext.util.Observable,{
    ptype: 'gxp_editorform',
    init: function(comp){
        return this
    }
});
Ext.preg(gxp.plugins.FeatureEditorForm.prototype.ptype, gxp.plugins.FeatureEditorForm);