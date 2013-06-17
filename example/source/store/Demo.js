Ext.define('Ext.ux.carousel.example.store.Demo',{
    extend: 'Ext.data.Store',
    
    data: [{
        key: 'default',
        title: 'Default configuration',
        config: {
        }
    },{
        key: 'auto',
        title: 'Autostart',
        config: {
            autoStart: true
        }
    },{
        key: 'nav',
        title: 'Navigation On',
        config: {
            autoStart: true,
            showNavigationAlways: true
        }
    },{
        key: 'thumb',
        title: 'Thumbnails',
        config: {
            autoStart: true,
            showThumbnails: true
        }
    },{
        key: 'timer',
        title: 'Timer Hidden',
        config: {
            autoStart: true,
            showTimer: false
        }
    },{
        key: 'txt',
        title: 'Thumbnails as Text',
        config: {
            autoStart: true,
            showThumbnails: true,
            showThumbnailsAsText: true
        }
    },{
        key: 'startat',
        title: 'Start Index',
        config: {
            autoStart: true,
            startIndex: 2
        }
    },{
        key: 'footer',
        title: 'Footer On',
        config: {
            autoStart: true,
            showFooterAlways: true
        }
    },{
        key: 'footerthumb',
        title: 'Footer On / Thumbnails',
        config: {
            autoStart: true,
            showFooterAlways: true,
            showThumbnails: true
        }
    },{
        key: 'footertxt',
        title: 'Footer On / Thumbnails as Text',
        config: {
            autoStart: true,
            showFooterAlways: true,
            showThumbnails: true,
            showThumbnailsAsText: true
        }
    },{
        key: 'footernav',
        title: 'Footer On / Nav On',
        config: {
            autoStart: true,
            showFooterAlways: true,
            showNavigationAlways: true
        }
    },{
        key: 'footernavthumb',
        title: 'Footer On / Nav On / Thumbnails',
        config: {
            autoStart: true,
            showFooterAlways: true,
            showNavigationAlways: true,
            showThumbnails: true
        }
    },{
        key: 'footernavtxt',
        title: 'Footer On / Nav On / Thumbnails as Text',
        config: {
            autoStart: true,
            showFooterAlways: true,
            showNavigationAlways: true,
            showThumbnails: true,
            showThumbnailsAsText: true
        }
    },{
        key: 'interval',
        title: 'Slide Interval',
        config: {
            autoStart: true,
            slideInterval: 30
        }
    }],
    
    fields: [
        { name: 'key',          type: 'string' },
        { name: 'title',        type: 'string' },
        { name: 'description',  type: 'string' },
        { name: 'config',       type: 'auto',   defaultValue:{} }
    ],

    proxy: { type:'memory' },
    
    sorters: [{
        property: 'title',
        direction: 'ASC'
    }]
});