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
//    sorters: [{ property: 'order', direction: 'DESC' }]
    
    //<debug>
    ,
    data: [{
        id: 1,
        exec_path: '/cms/browser/article/secure/115',
        image_src: '/cms/browser/file/secure/6792',
        image_title: 'Browser',
        image_alt: 'Alt 1',
        text: '1-Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        text_position: 'tl'
    },{
        id: 2,
        exec_path: '/cms/article',
        image_src: '/cms/browser/file/secure/379',
        image_title: 'Article App',
        image_alt: 'Alt 2',
        text: '2-Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        text_position: 'tr'
    },{
        id: 3,
        exec_path: '/portal/feedback',
        image_src: '/cms/browser/file/secure/21217',
        image_title: 'Feedback App',
        image_alt: 'Alt 3',
        text: '3-Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        text_position: 'bl'
    },{
        id: 4,
        exec_path: '/cms/browser/article/secure/1323',
        image_src: '/cms/browser/file/secure/1199',
        image_title: 'Browser',
        image_alt: 'Alt 1',
        text: '4-Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        text_position: 'br'
    },{
        id: 5,
        exec_path: '/cms/article',
        image_src: '/cms/browser/file/secure/417',
        image_title: 'Article App',
        image_alt: 'Alt 2',
        text: '5-Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        text_position: 'c'
    },{
        id: 6,
        exec_path: '/portal/feedback',
        image_src: '/cms/browser/file/secure/24929',
        image_title: 'Feedback App',
        image_alt: 'Alt 3',
        text: '6-Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        //default text_position
    }]
    //</debug>
});