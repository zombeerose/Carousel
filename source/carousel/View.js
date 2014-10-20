/**
 * 
 * @example
       Ext.create('Ext.ux.carousel.View',{
           width: 600,
           height: 400,
           renderTo: Ext.getBody(),
           model: Ext.create('Ext.ux.carousel.Model')
       });
 */
Ext.define('Ext.ux.carousel.View',{
    extend: 'Ext.container.Container',
    alias: 'widget.dvp_carousel',
    requires: [
        'Ext.ux.carousel.Model',
        'Ext.ux.carousel.slide.Model'
    ],
    
    /**
     * @cfg {Boolean} autoStart
     */
    autoStart: false,
    
    cls: 'dvp-carousel',
    
    childEls: [
        'navEl',
        'navNextSlideEl',
        'navPrevSlideEl',
        'navNextThumbEl',
        'navPrevThumbEl',
        'footerEl', //'crumbWrapEl',
        'timerEl',
        'hoverEl',
        { name: 'slides', select: '.dvp-carousel-slide' },
        { name: 'thumbs', select: '.dvp-carousel-thumb' }
    ],
    
    /**
     * @cfg {Object} fieldNames
     * An object containing properties which correspond to the field name used by the models. 
     * If you rename the model fields, you can specify the custom field names here that are used for the renderTpl. 
     * By default, this object takes the following form:
     * <pre><code>
    {
        id: 'id',
        delay: 'delay',
        slide_id: 'id',
        slide_carousel_id: 'carousel_id',
        slide_img_url: 'image_url',
        slide_img_title: 'image_title',
        slide_img_alt: 'image_alt',
        slide_img_animate: 'image_animation',
        slide_text: 'txt',
        slide_text_pos: 'txt_position',
        slide_text_style: 'txt_style',
        slide_text_thumb: 'txt_thumb',
        slide_link_url: 'link_url'
        slide_order: 'slide_num'
    }
     * </code></pre>
     * 
     */
    
    /**
     * @cfg {Number} hoverOffsetX
     * The number of pixels to offset the X position of the div that displays the thumbnail when hovering over the small footer navigation.
     */
    hoverOffsetX: 0,
    /**
     * @cfg {Number} hoverOffsetY
     * The number of pixels to offset the Y position of the div that displays the thumbnail when hovering over the small footer navigation.
     */
    hoverOffsetY: -70,
    
    /**
     * @cfg {Ext.ux.carousel.Model} model
     * Either the #sourceEl or #model is required.
     */
    
    /**
     * @cfg {String} navigationOrientation
     * Supported values include: 'h' for horizonatal/left-right, or 'v' for vertical/top-bottom
     */
    navigationOrientation: 'h',
    /**
     * @cfg {String} navigationOverCls
     */
    navigationOverCls: 'dvp-carousel-nav-over',
    /**
     * @cfg {Boolean} pauseOnHover
     * The default of true will pause the current timer/rotation on the current slide if the carousel is running.
     */
    pauseOnHover: true,
    /**
     * @cfg {Boolean} showFooter
     * Indicates if the footer is visible that displays the navigation links for the other slides.
     */
    showFooter: true,
    /**
     * @cfg {Boolean} showFooterAlways
     * Requires that {@link #showFooter} be true.
     * Indicates if the footer is always visible.  
     * Default is false, which will only show the footer when the user hovers over the container.
     */
    showFooterAlways: false,
    /**
     * @cfg {Boolean} showNavigation
     * Indicates if the arrows are available for manually switching to the next slide.
     */
    showNavigation: true,
    /**
     * @cfg {Boolean} showNavigationAlways
     * Requires that {@link #showNavigation} be true.
     * Indicates if the navigation buttons are always visible.  
     * Default is false, which will only show the buttons when the user hovers over the container.
     */
    showNavigationAlways: false,
    //TODO:
//    /**
//     * @cfg {Boolean} showPlay
//     * Indicates if a play/pause element is available.
//     */
//    showPlay: false,
    /**
     * @cfg {Boolean} showThumbnails
     * {@link #showFooter} must be enabled.
     * When set to true, each slide will have a corresponding thumbnail displayed in the footer. 
     * Default is false, which will display a bullet in the footer. The corresponding thumbnail is displayed when hovering over the bullet.
     */
    showThumbnails: false,
    /**
     * @cfg {Boolean} showThumbnailsAsText
     * When true, this setting implies that {@link #showThumbnails} is enabled and that 
     * the thumbnail will display text but no image.
     */
    showThumbnailsAsText: false,
    /**
     * @cfg {Boolean} showTimer
     * Indicates if a timer is displayed that provides feedback about the remaining time before the slide auto-transitions.
     */
    showTimer: true,
    /**
     * @cfg {Number} slideInterval
     * The default amount of time in seconds that each slide will be visible. 
     * If a {@link #model} is specified, this value is ignored, and the value of the 'delay' field is used instead. 
     */
    slideInterval: 10,
    
    /**
     * @cfg {String/HTMLElement/Ext.Element} sourceEl
     * Either the #sourceEl or #model is required.
     * The innerHTML of the sourceEl must conform to the following syntax:
     * 
     * <br>
     * &lt;div class="..."&gt;<br>
     *   &lt;img 
     *      alt="optional" 
     *      title="optional" 
     *      src="image for slide" 
     *      slideText="text to display for this slide" 
     *      slideTextPosition="enum for positioning text" 
     *      slideUrl="url to load when slide is clicked" 
     *      thumbText="optional text of thumbnail" 
     *   &gt; 
     * <br>
     *   ...next img in order of appearance
     * <br>
     * &lt;/div&gt;
     */
    
    /**
     * @cfg {Number} startIndex
     * Specify the index of a different slide to initially display. 
     * Defaults to 0 if not specified.
     */
    
    /**
     * @cfg {String} thumbActiveCls
     */
    thumbActiveCls: 'dvp-carousel-thumb-active',
    /**
     * @cfg {String} thumbOverCls
     */
    thumbOverCls: 'dvp-carousel-thumb-over',
    /**
     * @cfg {Number} timerInterval
     * The amount of time in milliseconds for running the timer update task.
     */
    timerInterval: Ext.isIE8m ? 1000 : 250,
    /**
     * @cfg {String} timerStrokeColor
     * The stroke color of the svg path. (@see Ext.draw.Sprite#stroke)
     */
    timerStrokeColor: '#98E4FF', //DVUSD: #F3892E
    /**
     * @cfg {Number} timerStrokeWidth
     * The stroke width of the svg path. (@see Ext.draw.Sprite#stroke-width)
     */
    timerStrokeWidth: 2,
    /**
     * @cfg {Number} timerSize
     * The width & height of the timer draw component.
     */
    timerSize: 20,
    
//    /**
//     * @cfg {Object} transitionOptions
//     * Additional config options that are applied to the element animation when transitioning between slides.
//     */
//    
//    /**
//     * @cfg {String} transitionType
//     * Supported values include: 'animate','fade','slide'
//     */
//    transitionType: 'fade',
    
    /**
     * @private
     * @param {Object} config
     */
    constructor: function(config){
        var me = this;
        
        //apply immediately
        Ext.apply(me,config||{});
        
        if (me.showThumbnailsAsText){
            me.showThumbnails = true;
        }
        
        me.fieldNames = Ext.applyIf(me.fieldNames || {}, {
            id: 'id',
            delay: 'delay',
            slide_id: 'id',
            slide_carousel_id: 'carousel_id',
            slide_img_url: 'image_url',
            slide_img_title: 'image_title',
            slide_img_alt: 'image_alt',
            slide_img_animate: 'image_animation',
            slide_text: 'txt',
            slide_text_pos: 'txt_position',
            slide_text_style: 'txt_style',
            slide_text_thumb: 'txt_thumb',
            slide_link_url: 'link_url',
            slide_order: 'slide_num'
        });
        
        me.buildRenderTpl();
        
        /**
         * @property timerTask
         * @type Ext.util.TaskRunner.Task
         */
        me.timerTask = Ext.TaskManager.newTask({
            interval: me.timerInterval,
            run: me.onTaskRun,
            scope: me
        });
        
        /**
         * @property timerCnt
         * @type Number
         */
        me.timerCnt = 0;
        
        /**
         * @property running
         * @type Boolean
         */
        me.running = false;
        
        /**
         * @property slideIndex
         * @type Number
         */
        me.slideIndex = 0;
        
        /**
         * @property page
         * @type Number
         */
        me.page = 0;
        
        me.callParent(); //config is already applied - do NOT pass arguments
        
        me.addEvents(
            /**
             * @event openurl
             * Fires when a user clicks a carousel slide that has a url defined.
             * @param {Ext.ux.carousel.View} this
             * @param {String} url The url that is linked to the current slide.
             */
            'openurl'
        );
        
        //<debug>
        if (!me.model && !me.sourceEl){
            Ext.Error.raise('A model or sourceEl is required for the carousel');
        }
        //</debug>
    },
    
    /**
     * @private
     */
    buildRenderTpl: function(){
        var fields = this.fieldNames;
        
        this.renderTpl = [
            '{%this.renderContainer(out,values)%}',
            '<div class="dvp-carousel-slide-wrapper">',
                '<tpl for="slides">',
                '<div class="dvp-carousel-slide">',
                    '<tpl if="', fields.slide_text, '">',
                    '<div class="dvp-carousel-text dvp-carousel-text-{', fields.slide_text_pos, '}" style="{', fields.slide_text_style, '}">{', fields.slide_text, '}</div>',
                    '<div class="dvp-carousel-text-bg dvp-carousel-text-{', fields.slide_text_pos, '}">{', fields.slide_text, '}</div>',
                    '</tpl>',
                    '<tpl if="', fields.slide_img_url, '">',
                    '<img src="{', fields.slide_img_url, '}" alt="{', fields.slide_img_alt, '}" title="{', fields.slide_img_title, '}">',
                    '</tpl>',
                '</div>',
                '</tpl>',
            '</div>',
            
            '<tpl if="showTimer">',
                '<div id="{id}-timerEl" class="dvp-carousel-timer"></div>', //uses Ext.draw.Component
            '</tpl>',
            
            '<tpl if="showFooter">',
                '<div id="{id}-footerEl" class="dvp-carousel-footer footer-<tpl if="showThumbnails">large<tpl else>small</tpl> <tpl if="showThumbnailsAsText">text-only</tpl>">',
                    '<div class="dvp-carousel-thumb-ct',
                        '<tpl if="Ext.supports.CSS3LinearGradient"> dvp-carousel-thumb-ct-pretty</tpl>',
                    '">',
                    '<div id="{id}-navPrevThumbEl" class="dvp-carousel-thumb-nav-prev"></div>',
                    '<tpl for="slides">',
                        '<div class="dvp-carousel-thumb {[xindex === 1 ? "thumb-first" : ""]}{[xindex === xcount ? "thumb-last" : ""]}">',
                            '<div class="dvp-carousel-thumb-inner">',
                                '<div class="dvp-carousel-thumb-bg"></div>',
                                '<tpl if="parent.showThumbnails">',
                                    '<img class="dvp-carousel-thumb-fg" src="{', fields.slide_img_url, '}" alt="{', fields.slide_img_alt, '}" title="{', fields.slide_img_title, '}">',
                                    '<tpl if="', fields.slide_text_thumb, '">',
                                        '<div class="dvp-carousel-thumb-text">{', fields.slide_text_thumb, '}</div>',
                                    '</tpl>',
                                '<tpl else>',
                                    '<div class="dvp-carousel-thumb-fg"></div>',
                                '</tpl>',
                            '</div>',
                        '</div>',
                    '</tpl>',
                    '<div id="{id}-navNextThumbEl" class="dvp-carousel-thumb-nav-next"></div>',
                    '</div>',
                    
                    '<div id="{id}-hoverEl" class="dvp-carousel-hover">',
                        '<div class="dvp-carousel-hover-inner">',
                            '<div class="dvp-carousel-hover-bg"></div>',
                            '<img class="dvp-carousel-hover-fg" src="">',
                        '</div>',
                    '</div>',
                    
    //                //TODO: start/pause button
                    
                '</div>',
            '</tpl>',
            
            '<tpl if="showNavigation">',
                '<div id="{id}-navEl" class="dvp-carousel-nav-ct">',
                    '<div id="{id}-navPrevSlideEl" class="dvp-carousel-nav dvp-carousel-nav-prev"></div>',
                    '<div class="dvp-carousel-nav-bg dvp-carousel-nav-prev"></div>',
                    '<div id="{id}-navNextSlideEl" class="dvp-carousel-nav dvp-carousel-nav-next"></div>',
                    '<div class="dvp-carousel-nav-bg dvp-carousel-nav-next"></div>',
                '</div>',
            '</tpl>'
        ];
    },
    
    // @inheritdoc
    initComponent: function(){
        var me = this;
        
        me.callParent(arguments);
        
        if (me.sourceEl){
            me.render(me.sourceEl);
        }
    },
    
    /**
     * @private
     * @param {Ext.data.Model[]} records
     * @return {Object[]} An array of data objects
     */
    collectData : function(records){
        var data = [],
            i = 0,
            len = records.length,
            record;

        for (i = 0; i < len; i++) {
            record = records[i];
            data[i] = record.data;
        }
        return data;
    },
    
    
    /**
     * @private
     * @return {Number}
     */
    getThumbsPerPage: function(){
        var me = this,
            thumb, ctWidth, thumbWidth, max;
        
        //check for the cache first
        if (Ext.isDefined(me._thumbsPerPage)){
            return me._thumbsPerPage;
        }
        
        thumb = me.thumbs.first();
        max = 0;
        if (thumb){
            thumbWidth = thumb.getComputedWidth() + thumb.getMargin('lr');
            ctWidth = thumb.up('.dvp-carousel-thumb-ct').getWidth() - me.navPrevThumbEl.getWidth() - me.navNextThumbEl.getWidth();
            if (ctWidth <= 0){
                ctWidth = me.getWidth(true) - 32;
            }
            max = Math.floor(ctWidth / thumbWidth);
        }
        //cache for performance; invalidate the cache if we resize
        me._thumbsPerPage = max;

        return max;
    },
    
    /**
     * @private
     * Calculates the path for drawing an SVG arc.
     * http://stackoverflow.com/questions/5230148/create-svg-progress-circle
     * @param {Number} value The current increment value
     * @param {Number} total The maximum value
     * @param {Number} R The radius of the circle
     * @param {Number[]} center The center XY coordinates
     * @return {String}
     */
    getTimerPath: function(value, total, R, center) {
//    getTimerPath = function(value, total, R, center){
        var alpha,
            D = R * 2,
            centerX = center[0], 
            centerY = center[1],
            a,
            x,
            y,
            path,
            isLargeArc;
            
        if (total === value) {
            value = value - .01;
        }
        alpha = 360 / total * value;
//        if (total === value) {
//            //path = [["M", 300, 300 - R], ["A", R, R, 0, 1, 1, 299.99, 300 - R]];
//            path = "M"+centerX+","+(centerY-R)+" A"+R+","+R+",0,1,0,"+R+","+D+" A"+R+","+R+",0,1,0,"+R+","+0;
//        } else {
            isLargeArc = (alpha > 180) ? 1 : 0;
            a = (90 - alpha) * Math.PI / 180;
            //x = 300 + R * Math.cos(a);
            x = centerX + (R * Math.cos(a));
            //y = 300 - R * Math.sin(a);
            y = centerY - (R * Math.sin(a));
            //path = [["M", 300, 300 - R], ["A", R, R, 0, +(alpha > 180), 1, x, y]];
            //path = "M"+R+","+0+" A"+R+","+R+",0,"+isLargeArc+",1,"+x+","+y;
            path = "M"+centerX+","+(centerY-R)+" A"+R+","+R+",0,"+isLargeArc+",1,"+x+","+y;
//        }
//        log('path '+path+'; value: '+value+'; total: '+total+'; alpha '+alpha+'; a '+a+'; x '+x+'; y '+y);
        return path;
    },
    
    // @inheritdoc
    initRenderData: function() {
        var me = this,
            slideStore;

        if (me.model){
            me.slideInterval = me.model.get(me.fieldNames.delay);
        }
        if (me.sourceEl){
            me.loadElement();
        }
        
        slideStore = me.model.slides();
        slideStore.sort(me.fieldNames.slide_order,'ASC');
        
        return Ext.applyIf(me.callParent(arguments), {
            height: me.height,
            isHorizontalNav: (me.navigationOrientation === 'h'),
            showFooter: me.showFooter,
            showNavigation: me.showNavigation,
            showThumbnails: me.showThumbnails,
            showTimer: me.showTimer,
            slides: me.collectData(slideStore.getRange()),
            showThumbnailsAsText: me.showThumbnailsAsText
        });
    },
    
    /**
     * @private
     * Used for populating the model based on the {@link #sourceEl}.
     */
    loadElement: function(){
        var me = this,
            fields = me.fieldNames,
            el = Ext.get(me.sourceEl),
            model = Ext.create('Ext.ux.carousel.Model'),
            models = [],
            carouselId = 1, //the carousel.id is irrelevant when loaded from markup
            slideId,
            images;
            
        if (!el){
            //<debug>
            Ext.Error.raise('The specified sourceEl was not found!');
            //</debug>
            return;
        }
        
        model.set('id',carouselId); 
        slideId = 1;
        function eachImg(img){
            var text = img.getAttribute('slideText') || '', 
                data = {},
                value,
                model;
            
            data[fields.slide_id] = slideId++;
            data[fields.slide_carousel_id] = carouselId;
            data[fields.slide_img_url] = img.getAttribute('src');
            data[fields.slide_img_alt] = img.getAttribute('alt') || text;
            data[fields.slide_text] = text;
            
            //optional assignments if value is set
            if (value = img.getAttribute('title')){
                data[fields.slide_img_title] = value;
            }
            if (value = img.getAttribute('slideTextPosition')){
                data[fields.slide_text_pos] = value;
            }
            if (value = img.getAttribute('slideTextStyle')){
                data[fields.slide_text_style] = value;
            }
            if (value = img.getAttribute('slideUrl')){
                data[fields.slide_link_url] = value;
            }
            if (value = img.getAttribute('thumbText')){
                data[fields.slide_text_thumb] = value;
            }
            if (value = img.getAttribute('slideOrder')){
                data[fields.slide_order] = value;
            }
            
            model = Ext.create('Ext.ux.carousel.slide.Model',data);
            models.push(model);
            img.destroy();
        }
        
        images = el.select('img');
        images.each(eachImg,me);
        model.slides().add(models);
        
        me.model = model;
    },
    
    /**
     * Displays the next slide in the sequence.  If already at the last slide, then the first slide will be shown.
     */
    next: function(){
        this.setSlide(this.slideIndex+1);
    },
    
    nextPage: function(){
        this.setPage(this.page+1);
    },
    
    onContainerClick: function(e, t){
        var me = this,
            target,
            index,
            record,
            url;
            
        if (target = e.getTarget('.dvp-carousel-thumb')){
            index = me.thumbs.indexOf(target);
            me.setSlide(index);
        } else if (e.getTarget('.dvp-carousel-nav')){
            if (e.within(me.navNextSlideEl)){
                me.next();
            } else {
                me.previous();
            }
        } else if (e.getTarget('.dvp-carousel-thumb-nav-prev')){
            me.previousPage();
        } else if (e.getTarget('.dvp-carousel-thumb-nav-next')){
            me.nextPage();
        } else {
            //assumes any other clicks were on the actual slide
            index = me.slideIndex;
            record = me.model.slides().getAt(index);
            if (!record){ return; }
            
            url = record.get(me.fieldNames.slide_link_url);
            if (!url){ return; }
            
            me.fireEvent('openurl',me,url);
        }
    },
    
    onContainerMouseOut: function(e, t){
        var me = this;
        
        //do NOT start running the task if it wasn't running when the mouse entered
        if (me._wasRunning){
            me.start();
            delete me._wasRunning;
        }
        
        if (me.showFooter && !me.showFooterAlways){
            me.footerEl.fadeOut();
        }
        
        if (me.showNavigation && !me.showNavigationAlways){
            me.navEl.fadeOut();
        }
    },
    
    onContainerMouseOver: function(e, t){
        var me = this;
        
        if (me.pauseOnHover && me.running){
            //set a temp flag so the mouseout will know if it should resume
            me._wasRunning = me.running;
            me.pause();
        }
        
        //less than 2 slides do not require navigation or the footer
        if (me.model.slides().getCount() < 2){ return; }
        
        if (me.showFooter && !me.showFooterAlways){
            me.footerEl.fadeIn();
        }
        
        if (me.showNavigation && !me.showNavigationAlways){
            me.navEl.fadeIn();
        }
    },

    onCrumbMouseOut: function(e, t){
        var me = this,
            thumb;
        
        thumb = e.getTarget('.dvp-carousel-thumb',10,true);
        thumb.removeCls(me.thumbOverCls);
        
        me._abortHover = true;
        if (!me.showThumbnails){
            me.hoverEl.hide(); //do not animate b/c delay may interfere with next show
        }
    },
    
    onCrumbMouseOver: function(e, t){
        var me = this,
            thumb = e.getTarget('.dvp-carousel-thumb',10,true), //Ext.get(t),
            img,
            index,
            record,
            xy,
            src;
            
        thumb.addCls(me.thumbOverCls);
        
        if (thumb.hasCls(me.thumbActiveCls)){ return; }
        
        if (!me.showThumbnails){
            img = me.hoverEl.down('img');
            if (img){
                index = me.thumbs.indexOf(thumb);
                record = me.model.slides().getAt(index);
                src = record.get(me.fieldNames.slide_img_url);
                xy = thumb.getXY();
                xy[0] = xy[0] + me.hoverOffsetX;
                xy[1] = xy[1] + me.hoverOffsetY;
                //defer showing, otherwise the last image will be visible
                img.on('load',function(){
                    //check if the user stopped hovering before we loaded
                    if (this._abortHover){ return; }
                    
                    this.hoverEl.show(true); //display than show ... important for 1st time
                    this.hoverEl.setXY(xy);
                },me,{single:true});
                
                delete me._abortHover;
                img.set({src:src});
            }
        }
    },
    
    onDestroy: function(){
        var me = this;
        
        //pending animations (delayed tasks) may cause runtime errors if they fire after we destroy
        me.navEl && me.navEl.stopAnimation();
        me.footerEl && me.footerEl.stopAnimation();
        me.slides && me.slides.stopAnimation();
        me.thumbs && me.thumbs.stopAnimation();
        
        if (me.timerTask){
            me.timerTask.stop();
        }
        
        Ext.destroyMembers(me,'draw','timerTask');
        me.callParent(arguments);
    },
    
    /**
     * @private
     * @param {Ext.EventObject} e
     * @param {HTMLElement} t
     */
    onNavMouseOverOut: function(e, t){
        var target = e.getTarget('div',5,true), //e.getTarget('.dvp-carousel-nav',10,true),
            classes = target.getAttribute('className').split(' '), //just 'class' is not valid in IE
            i, l, cls, overCls;
            
        l = classes.length;
        for (i = 0; i < l; i++){
            cls = classes[i];
            if (cls.indexOf('-nav-') !== -1){
                overCls = cls + '-over';
                break;
            }
        }
        
        if (overCls){
            target.toggleCls(overCls);
        }
    },
    
    // @inheritdoc
    onRender: function(){ //onRender
        var me = this,
            startIndex;
        
        me.callParent(arguments);
        
        if (me.showFooter){
            //delegating from the thumbnail Ct doesn't reliably detect/fire events; me.thumbCtEl.on({ delegate: '.dvp-carousel-thumb',...
            me.thumbs.each(function(thumb,c,index){
                thumb.on({
                    buffer: 10, //slight buffer b/c of multiple mouse events when moving from one to another
                    mouseenter: me.onCrumbMouseOver,
                    mouseleave: me.onCrumbMouseOut,
                    scope: me
                });
                
//                if (index <= max){
//                    thumb.setDisplayed(true);
//                }
            });
        }
        
        if (me.showTimer){
            me.draw = Ext.create('Ext.draw.Component',{
//                viewBox: false,
                width: me.timerSize,
                height: me.timerSize,
                renderTo: me.timerEl
            });
        }
        
        //visibility and mouse effects...
        me.on({
            element: 'el',
            click: me.onContainerClick,
            mouseenter: me.onContainerMouseOver,
            mouseleave: me.onContainerMouseOut,
            scope: me
        });
        
        if (me.showNavigation){
            if (!me.showNavigationAlways){
                me.navEl.hide();
            }
            
            me.on({
                element: 'navNextSlideEl',
                mouseenter: me.onNavMouseOverOut,
                mouseleave: me.onNavMouseOverOut,
                scope: me
            });
            
            me.on({
                element: 'navPrevSlideEl',
                mouseenter: me.onNavMouseOverOut,
                mouseleave: me.onNavMouseOverOut,
                scope: me
            });
        }
        
        if (me.showFooter){
            if (!me.showFooterAlways){
                me.footerEl.hide();
            }
            
            me.on({
                element: 'navNextThumbEl',
                mouseenter: me.onNavMouseOverOut,
                mouseleave: me.onNavMouseOverOut,
                scope: me
            });
            
            me.on({
                element: 'navPrevThumbEl',
                mouseenter: me.onNavMouseOverOut,
                mouseleave: me.onNavMouseOverOut,
                scope: me
            });
        
            me.thumbs.setVisibilityMode(Ext.Element.DISPLAY);
            me.setPage(me.page, true); //initial
        }
        
        me.slides.hide();
        
        //set the initial slide
        total = me.slides.getCount();
        startIndex = me.startIndex;
        //bounds checking
        if (Ext.isDefined(startIndex) && (startIndex >= 0) && (startIndex < me.slides.getCount())){
            me.slideIndex = startIndex;
        }
        me.setSlide(me.slideIndex, true); //initial
        
        if (me.autoStart){
            me.start();
        }
    }, //eof onRender

    
    /**
     * @private
     * @param {Number} cnt
     */
    onTaskRun: function(cnt){
        var me = this,
            total = (me.slideInterval * 1000) / me.timerInterval,
            remainder = ++me.timerCnt % total, //NOTE the counter is incremented
            surface,
            sprite,
            half,
            radius,
            strokeWidth = me.timerStrokeWidth;
        
        if (me.showTimer){
            surface = me.draw.surface; //Ext.draw.Surface
        
            if (remainder !== 0){
                half = me.timerSize / 2;
                radius = half - strokeWidth; //reduce the radius by the stroke to prevent cropping
                
                Ext.suspendLayouts();
                
                surface.removeAll(true);
                sprite = surface.add({
                    type: 'path',
                    path: me.getTimerPath(remainder+1,total,radius,[half,half]),
                    stroke: me.timerStrokeColor,
                    "stroke-width": me.timerStrokeWidth
                });
                sprite.show(true);
                
                Ext.resumeLayouts(true);
            }
        }
        
        if (remainder === 0){
            me.next();
        }
    },
    
    /**
     * Stops the current task but does not reset the current iteration counter.
     */
    pause: function(){
        this.timerTask.stop();
        this.running = false;
    },
    
    /**
     * Display the previous slide.  If already at the first slide, then the last slide will be shown.
     */
    previous: function(){
        this.setSlide(this.slideIndex-1);
    },
    
    previousPage: function(){
        this.setPage(this.page-1);
    },
    
//    resume: function(){
//        this.timerTask.start();
//        this.running = true;
//    },
    
    
    /**
     * @private
     * @param {Number} newIndex Zero-based
     * @param {Boolean} initial
     */
    setPage: function(newIndex, initial){
        var me = this,
            thumbs = me.thumbs, //CompositeElement;
            oldIndex = me.page,
            totalThumbs, perPage, startAt, thumb, i, l;
            
        //no change
        if (newIndex === oldIndex && !initial){ return; }
        
        perPage = me.getThumbsPerPage();
        totalThumbs = thumbs.getCount();
        //all thumbs fit on one page ...
        if (perPage < totalThumbs){
            //hide all existing thumbs
            thumbs.hide();
            
            //show only the thumbs for the visible page
            startAt = newIndex * perPage;
            l = startAt + perPage;
            for (i = startAt; i < l; i++){
                thumb = thumbs.item(i);
                if (!thumb){ break; }
                thumb.show();
            }
            
            me.page = newIndex;
        }
        //at first page, nothing previous
        me.navPrevThumbEl.setVisible(newIndex !== 0);
        //at last page, nothing following
        me.navNextThumbEl.setVisible(l < totalThumbs);
    },

    /**
     * @private
     * @param {Number} newIndex Zero-based
     * @param {Boolean} initial
     */
    setSlide: function(newIndex, initial){
        var me = this,
            fields = me.fieldNames,
            thumbs = me.thumbs, //CompositeElement
            slides = me.slides, //CompositeElement
            oldIndex = me.slideIndex,
            record, lastIndex, item, perPage, newPage;
            
        if (newIndex === oldIndex && !initial){ return; }
        
        lastIndex = slides.getCount() - 1;
        //check for out of bounds
        if (lastIndex < 0){ return; }
        
        if (newIndex < 0){
            newIndex = lastIndex;
        }
        if (newIndex > lastIndex){
            newIndex = 0;
        }
        
        if (!initial){
            //hide the current slide
            slides.item(oldIndex).setVisible(false);
            if (me.showFooter){
                thumbs.removeCls(me.thumbActiveCls);
            }
            if (me.showTimer){
                me.draw.surface.removeAll(true);
            }
        }

        record = me.model.slides().getAt(newIndex);
        //show the next one
        slides.item(newIndex).setVisible(true,record.get(fields.slide_img_animate));

        if (me.showFooter){
            item = thumbs.item(newIndex);
            if (item){
                item.addCls(me.thumbActiveCls);
            }
            //determine if the current page changed
            perPage = me.getThumbsPerPage();
            newPage = Math.ceil((newIndex + 1)/ perPage) - 1;
            me.setPage(newPage);
        }
        
        me.slideIndex = newIndex;
        me.timerCnt = 0;
    }, //eof setSlide

    
    /**
     * Starts running the task.
     */
    start: function(){
        if (!this.model || !this.model.slides().getCount()){
            //<debug>
            this.update('Carousel model is empty!');
            //</debug>
            return;
        }
        
        this.timerTask.start();
        this.running = true;
    },
    
    /**
     * Terminates the current task and resets the iteration counter.
     */
    stop: function(){
        this.pause();
        this.timerCnt = 0;
    }
});