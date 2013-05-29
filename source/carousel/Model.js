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
        {name: 'delay', type: 'int', defaultValue: 10}
    ],
    
    hasMany: {
        model: 'Ext.ux.carousel.slide.Model',
        name: 'slides'
    }
}); //eo class