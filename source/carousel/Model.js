/**
 * 
 * 
 * @author $Author: pscrawford $
 * @revision $Rev: 13458 $
 * @date $Date: 2013-02-20 14:04:38 -0700 (Wed, 20 Feb 2013) $
 */
Ext.define('Ext.ux.carousel.Model', {
    extend: 'Ext.data.Model',

    hasMany: {
        model: 'Ext.ux.carousel.slide.Model',
        name: 'slides'
    },
    
    fields: [
        {name: 'id', defaultValue: null, type: 'int', allowNull:true},
        {name: 'delay', type: 'int', defaultValue: 10},
        {name: 'name', type: 'string', defaultValue: null}
    ],
    
    validators: [{
        delay: 'presence',
        name: {type: 'length', min: 1, max: 255}
    }]
}); //eo class