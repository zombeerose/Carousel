/**
 * Images obtained from {@link hiren.info}
 * 
 */
Ext.define('Ext.ux.carousel.example.store.Slide',{
    extend: 'Ext.data.Store',
    
    data: [{
        slide_text: 'The fortress of Sir Carousel',
        src: 'resources/images/castle.jpg',
        thumb_text: 'Fortress'
    },{
        slide_text: 'Tall water drop picture',
        src: 'resources/images/tall.jpg',
        thumb_text: 'Tall'
    },{
        slide_text: 'Wide landscape picture',
        src: 'resources/images/wide.jpg',
        thumb_text: 'Wide'
    },{
        slide_text: 'The greenest mountain',
        src: 'resources/images/mountain.jpg',
        tag: 'img',
        thumb_text: 'Mountain'
    },{
        //leave the caption off 1 slide to create a gap
//        slide_text: 'The winter clearing',
        src: 'resources/images/winter.jpg',
        thumb_text: 'Winter'
    },{
        slide_text: 'The famous national park',
        src: 'resources/images/yosemite.jpg',
        thumb_text: 'Yosemite'
    },{
        slide_text: 'Rio De Janeiro in Brazil',
        src: 'resources/images/brazil.jpg',
        thumb_text: 'Brazil'
    },{
        slide_text: 'Lotus Lake in Taiwan',
        src: 'resources/images/taiwan.jpg',
        thumb_text: 'Taiwan'
    },{
        slide_text: 'Uchisar Area in Turkey',
        src: 'resources/images/turkey.jpg',
        thumb_text: 'Turkey'
    }],
    
    fields: ['slide_text','src','thumb_text'],
    
    proxy: 'memory'
})