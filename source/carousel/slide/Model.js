/**
 * 
 * 
 * @author $Author: pscrawford $
 * @revision $Rev: 13458 $
 * @date $Date: 2013-02-20 14:04:38 -0700 (Wed, 20 Feb 2013) $
 */
Ext.define('Ext.ux.carousel.slide.Model', {
    extend: 'Ext.data.Model',
    
//    belongsTo: {
//        associatedKey: 'carousel_id', 
//        associatedModel: 'carousel', 
//        foreignKey: 'carousel_id', 
//        model: 'Ext.ux.carousel.Model'
//    },
    
    fields: [
        {name: 'id', defaultValue: null, type: 'int', useNull:true},
        {name: 'carousel_id', defaultValue: null, type: 'int', useNull:true},
        {name: 'image_url', defaultValue: null},
        {name: 'image_title', defaultValue: ''},
        {name: 'image_alt', defaultValue: ''},
        {name: 'image_animation', type: 'bool', defaultValue: true},
        {name: 'txt', defaultValue: ''},
        {name: 'txt_position', defaultValue: 'tc'},
        {name: 'txt_style', defaultValue: null},
        {name: 'txt_animation', type: 'bool', defaultValue: true},
        {name: 'txt_thumb', defaultValue: ''},
        {name: 'link_url', defaultValue: null}
    ]
}); //eo class