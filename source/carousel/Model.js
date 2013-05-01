/**
 * 
 * 
 * @author $Author: pscrawford $
 * @revision $Rev: 13458 $
 * @date $Date: 2013-02-20 14:04:38 -0700 (Wed, 20 Feb 2013) $
 */
Ext.define('Ext.ux.carousel.Model', {
    extend: 'Ext.data.Model',
    
    //configurables
    fields: [
        {name: 'id', defaultValue: null, type: 'int', useNull:true},
        {name: 'image_src', defaultValue: null},
        {name: 'image_title', defaultValue: null},
        {name: 'image_alt', defaultValue: null},
        {name: 'image_animation', type: 'bool', defaultValue: true},
        {name: 'text', defaultValue: null},
        {name: 'text_position', defaultValue: 'tl'},
        {name: 'text_style', defaultValue: null},
        {name: 'text_animation', type: 'bool', defaultValue: true},
        {name: 'url', defaultValue: null}
    ]
}); //eo class