/**
 * 
 * @example
       Ext.create('Ext.ux.carousel.View',{
           width: 600,
           height: 400,
           renderTo: Ext.getBody(),
           store: Ext.create('Ext.ux.carousel.Store')
       });
 */
Ext.define('Ext.ux.carousel.View',{
    extend: 'Ext.container.Container',
    alias: 'widget.dvp_carousel',
    requires: [
        'Ext.ux.carousel.Store'
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
        { name: 'texts', select: '.dvp-carousel-text' },
        { name: 'thumbs', select: '.dvp-carousel-thumb' }
    ],
    
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
    
    renderTpl: [
        '{%this.renderContainer(out,values)%}',
        '<div class="dvp-carousel-slide-wrapper">',
            '<tpl for="slides">',
            '<div class="dvp-carousel-slide">',
                '<tpl if="text">',
                '<div class="dvp-carousel-text dvp-carousel-text-{text_position}" style="{text_style}">{text}</div>',
                '<div class="dvp-carousel-text-bg dvp-carousel-text-{text_position}">{text}</div>',
                '</tpl>',
                '<tpl if="image_src">',
                '<img src="{image_src}" alt="{image_alt}" title="{image_title}">',
                '</tpl>',
            '</div>',
            '</tpl>',
        '</div>',
        
        '<tpl if="showTimer">',
            '<div id="{id}-timerEl" class="dvp-carousel-timer"></div>', //uses Ext.draw.Component
        '</tpl>',
        
        '<tpl if="showFooter">',
            '<div id="{id}-footerEl" class="dvp-carousel-footer footer-<tpl if="showThumbnails">large<tpl else>small</tpl> <tpl if="thumbTextOnly">text-only</tpl>">',
                '<div class="dvp-carousel-thumb-ct',
                    '<tpl if="Ext.supports.CSS3LinearGradient"> dvp-carousel-thumb-ct-pretty</tpl>',
                '">',
                '<a id="{id}-navPrevThumbEl" class="dvp-carousel-thumb-nav-prev" href="#"></a>',
                '<tpl for="slides">',
                    '<div class="dvp-carousel-thumb {[xindex === 1 ? "thumb-first" : ""]}{[xindex === xcount ? "thumb-last" : ""]}">',
                        '<div class="dvp-carousel-thumb-inner">',
                            '<div class="dvp-carousel-thumb-bg"></div>',
                            '<tpl if="parent.showThumbnails">',
                                '<img class="dvp-carousel-thumb-fg" src="{image_src}" alt="{image_alt}" title="{image_title}">',
                                '<tpl if="thumb_text">',
                                    '<div class="dvp-carousel-thumb-text">{thumb_text}</div>',
                                '</tpl>',
                            '<tpl else>',
                                '<a href="#" class="dvp-carousel-thumb-fg"></a>',
                            '</tpl>',
                        '</div>',
                    '</div>',
                '</tpl>',
                '<a id="{id}-navNextThumbEl" class="dvp-carousel-thumb-nav-next" href="#"></a>',
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
                '<a id="{id}-navPrevSlideEl" class="dvp-carousel-nav dvp-carousel-nav-prev" href="#"></a>',
                '<div class="dvp-carousel-nav-bg dvp-carousel-nav-prev"></div>',
                '<a id="{id}-navNextSlideEl" class="dvp-carousel-nav dvp-carousel-nav-next" href="#"></a>',
                '<div class="dvp-carousel-nav-bg dvp-carousel-nav-next"></div>',
            '</div>',
        '</tpl>'
    ],
    
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
    showFooterAlways: true, //TODO: false
    /**
     * @cfg {Boolean} showThumbnails
     * {@link #showFooter} must be enabled.
     * When set to true, each slide will have a corresponding thumbnail displayed in the footer. 
     * Default is false, which will display a bullet in the footer. The corresponding thumbnail is displayed when hovering over the bullet.
     */
    showThumbnails: true, //TODO: false
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
     * @cfg {Boolean} showTimer
     * Indicates if a timer is displayed that provides feedback about the remaining time before the slide auto-transitions.
     */
    showTimer: true,
    /**
     * @cfg {Number} slideInterval
     * The amount of time in milliseconds that each slide will be visible.
     */
    slideInterval: 10000,
    /**
     * @cfg {String} startSlide
     * The index of the slide to start displaying.  Zero-based.
     */
    startSlide: 0,
    
    /**
     * @cfg {Ext.data.Store} store
     * Either the #sourceEl or #store is required.
     */
    
    /**
     * @cfg {String/HTMLElement/Ext.Element} sourceEl
     * Either the #sourceEl or #store is required.
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
     *   &gt; 
     * <br>
     *   ...next img in order of appearance
     * <br>
     * &lt;/div&gt;
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
     * @cfg {Boolean} thumbTextOnly
     * Requires that {@link #showThumbnails} be enabled.
     * When set to true, the thumbnail will display text but no image.
     */
    thumbTextOnly: false, //TODO: false
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
         * @property slideIndex
         * @type Number
         */
        me.slideIndex = me.startSlide;
        
        /**
         * @property thumbPage
         * @type Number
         */
        me.thumbPage = 0;
        
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
        
        me.callParent(arguments);
        
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
        if (!me.store && !me.sourceEl){
            Ext.Error.raise('A store or sourceEl is required for the carousel');
        }
        //</debug>
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
        var thumb = this.thumbs.first(),
            ctWidth,
            thumbWidth,
            max = 0;
            
        if (thumb){
            thumbWidth = thumb.getComputedWidth() + thumb.getMargin('lr');
            ctWidth = thumb.up('.dvp-carousel-thumb-ct').getWidth();
            max = Math.floor(ctWidth / thumbWidth);
        }
        
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
        var me = this;

        if (me.sourceEl){
            me.loadStore();
        }
        
        return Ext.applyIf(me.callParent(arguments), {
            height: me.height,
            isHorizontalNav: (me.navigationOrientation === 'h'),
            showFooter: me.showFooter,
            showNavigation: me.showNavigation,
            showThumbnails: me.showThumbnails,
            showTimer: me.showTimer,
            slides: me.collectData(me.store.getRange()),
            thumbTextOnly: me.thumbTextOnly
        });
    },
    
    /**
     * @private
     * Used for populating the store based on the {@link #sourceEl}.
     */
    loadStore: function(){
        var me = this,
            store = Ext.create('Ext.ux.carousel.Store'),
            el = Ext.get(me.sourceEl),
            images, id;
            
        if (!el){
            //<debug>
            Ext.Error.raise('The specified sourceEl was not found!');
            //</debug>
            return;
        }
        
        id = 1;
        function eachImg(img){
            var text = img.getAttribute('slideText'), data;
            
            data = {
                id: id++,
                image_src: img.getAttribute('src'),
                image_alt: img.getAttribute('alt') || text,
                image_title: img.getAttribute('title'),
                text: text,
                text_position: img.getAttribute('slideTextPosition') || 'tl',
                text_style: img.getAttribute('slideTextStyle'),
                url: img.getAttribute('slideUrl')
            };
            
            store.add(data);
            img.destroy();
        }
        
        images = el.select('img');
        images.each(eachImg,me);
        
        me.store = store;
    },
    
    /**
     * Displays the next slide in the sequence.  If already at the last slide, then the first slide will be shown.
     */
    next: function(){
        this.setSlide(this.slideIndex+1);
    },
    
    nextThumbPage: function(){
        this.setThumbPage(this.thumbPage+1);
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
            me.previousThumbPage();
        } else if (e.getTarget('.dvp-carousel-thumb-nav-next')){
            me.nextThumbPage();
        } else {
            //assumes any other clicks were on the actual slide
            index = me.slideIndex;
            record = me.store.getAt(index);
            url = record.get('url');
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
                record = me.store.getAt(index);
                src = record.get('image_src');
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
DV.log('Carousel destroy');//TODO
        Ext.destroyMembers(this,'draw','timerTask');
        this.callParent(arguments);
    },
    
    /**
     * @private
     * @param {Ext.EventObject} e
     * @param {HTMLElement} t
     */
    onNavMouseOverOut: function(e, t){
        var target = e.getTarget('a',5,true), //e.getTarget('.dvp-carousel-nav',10,true),
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
            pageSize;
        
        me.callParent(arguments);
        
        if (me.showFooter){
//TODO: remove            pageSize = me.getThumbsPerPage() - 1; //zero-based
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
            
            me.thumbs.setVisibilityMode(Ext.Element.DISPLAY).hide();
            me.setThumbPage(me.thumbPage, true); //initial
        }
        
        me.slides.hide();
        me.texts.hide();
        
        //set the initial slide
        me.setSlide(me.startSlide, true); //initial
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
            total = me.slideInterval / me.timerInterval,
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
    
    previousThumbPage: function(){
        this.setThumbPage(this.thumbPage-1);
    },
    
//    resume: function(){
//        this.timerTask.start();
//        this.running = true;
//    },
    
    /**
     * @private
     * @param {Number} newIndex Zero-based.
     * @param {Boolean} initial
     */
    setSlide: function(newIndex, initial){
        var me = this,
            thumbs = me.thumbs, //CompositeElement
            slides = me.slides, //CompositeElement
            texts = me.texts, //CompositeElement
            oldIndex = me.slideIndex,
            record,
            lastIndex,
            item;
            
        if (newIndex === oldIndex && !initial){ return; }
        
        record = me.store.getAt(oldIndex);
        lastIndex = slides.getCount() - 1;
        if (newIndex < 0){
            newIndex = lastIndex;
        }
        if (newIndex > lastIndex){
            newIndex = 0;
        }
        
        if (!initial){
            //hide the current slide
            slides.item(oldIndex).setVisible(false);
            item = texts.item(oldIndex);
            if (item){
                item.setVisible(false);
            }
            if (me.showFooter){
                thumbs.removeCls(me.thumbActiveCls);
            }
            if (me.showTimer){
                me.draw.surface.removeAll(true);
            }
        }
        
        //show the next one
        slides.item(newIndex).setVisible(true,record.get('image_animation'));
        item = texts.item(newIndex);
        if (item){
            item.setVisible(true,record.get('text_animation'));
        }

        if (me.showFooter){
            item = thumbs.item(newIndex);
            if (item){
                item.addCls(me.thumbActiveCls);
            }
        }
        
        me.slideIndex = newIndex;
        me.timerCnt = 0;
    }, //eof setSlide
    
    /**
     * @private
     * @param {Number} newIndex Zero-based
     * @param {Boolean} initial
     */
    setThumbPage: function(newIndex, initial){
        var me = this,
            thumbs = me.thumbs, //CompositeElement;
            oldIndex = me.thumbPage,
            totalThumbs, perPage, startAt, thumb, i, l;
            
        //no change
        if (newIndex === oldIndex && !initial){ return; }
        
        perPage = me.getThumbsPerPage();
        totalThumbs = thumbs.getCount();
        //all thumbs fit on one page ...
        if (perPage >= totalThumbs){ return; }
        
        if (!initial){
            //hide existing thumbs
            startAt = oldIndex * perPage;
            l = startAt + perPage;
            for (i = startAt; i < l; i++){
                thumb = thumbs.item(i);
                if (!thumb){ break; }
                thumb.hide();
            }
        }
        
        startAt = newIndex * perPage;
        l = startAt + perPage;
        for (i = startAt; i < l; i++){
            thumb = thumbs.item(i);
            if (!thumb){ break; }
            thumb.show();
        }
        
        //at first page, nothing previous
        me.navPrevThumbEl.setVisible(newIndex !== 0);
        //at last page, nothing following
        me.navNextThumbEl.setVisible(l < totalThumbs);
        
        me.thumbPage = newIndex;
    },
    
    /**
     * Starts running the task.
     */
    start: function(){
        if (!this.store.getCount()){
            //<debug>
            Ext.Error.raise('Carousel store is empty!');
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