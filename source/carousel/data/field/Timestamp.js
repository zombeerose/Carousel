/**
 * This data type means that the raw data is converted into a Date before it is placed into a Record.
 */
Ext.define('Ext.ux.carousel.data.field.Timestamp',{
    extend: 'Ext.data.field.Field',
    alias: 'data.field.timestamp',
    requires: [
        'Ext.data.SortTypes'
    ],

    /**
     * A timestamp format.
     * Defaults to 'Y-m-d H:i:s'
     * @constant
     * @type String
     */
    TIMESTAMP: 'Y-m-d H:i:s',

    convert: function (v) {
        if(!v){
            return null;
        }
        if (Ext.isDate(v)) {
            return v;
        }
        return Ext.Date.parse(v, this.TIMESTAMP);
    },

    getType: function () {
        return 'timestamp';
    },

    sortType: Ext.data.SortTypes.asDate
});
