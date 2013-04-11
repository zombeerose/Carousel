/**
 * The store used for loading the carousel.
 * 
 * @author $Author: pscrawford $
 * @revision $Rev: 13458 $
 * @date $Date: 2013-02-20 14:04:38 -0700 (Wed, 20 Feb 2013) $
 */
Ext.define('Ext.ux.carousel.Store',{
    extend: 'Ext.data.Store',
    
    model: 'Ext.ux.carousel.Model',
    
    proxy: {
        type: 'memory'
    }
});