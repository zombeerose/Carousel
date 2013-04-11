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
        'navNextEl',
        'navPrevEl',
        'crumbWrapEl',
        'timerEl',
        'hoverEl',
        { name: 'crumbs', select: '.dvp-carousel-crumb' },
        { name: 'slides', select: '.dvp-carousel-slide' },
        { name: 'texts', select: '.dvp-carousel-text' }
    ],
    
    /**
     * @cfg {String} crumbActiveCls
     */
    crumbActiveCls: 'dvp-carousel-crumb-active',
    /**
     * @cfg {Number} crumbHoverOffsetX
     * The number of pixels to offset the X position of the div that displays the crumb thumbnail when hovering.
     */
    crumbHoverOffsetX: 0,
    /**
     * @cfg {Number} crumbHoverOffsetY
     * The number of pixels to offset the Y position of the div that displays the crumb thumbnail when hovering.
     */
    crumbHoverOffsetY: -70,
    /**
     * @cfg {String} crumbOverCls
     */
    crumbOverCls: 'dvp-carousel-crumb-over',
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
     */
    pauseOnHover: true,
    
    renderTpl: [
        '{%this.renderContainer(out,values)%}',
        '<div class="dvp-carousel-slide-wrapper" style="height: {height}px;">',
            '<tpl for="slides">',
            '<div class="dvp-carousel-slide">',
                '<tpl if="text">',
                '<div class="dvp-carousel-text dvp-carousel-text-{text_position}" style="{text_style}">{text}</div>',
                '<div class="dvp-carousel-text-bg dvp-carousel-text-{text_position}">{text}</div>',
                '</tpl>',
                '<img src="{image_src}" alt="{image_alt}" title="{image_title}">',
            '</div>',
            '</tpl>',
        '</div>',
        
        '<tpl if="showTimer">',
            '<div id="{id}-timerEl" class="dvp-carousel-timer"></div>', //uses Ext.draw.Component
        '</tpl>',
        
        '<tpl if="showBreadCrumb">',
            '<div id="{id}-crumbWrapEl" class="dvp-carousel-crumb-wrapper">', 
                '<span class="dvp-carousel-crumb-buttons ',
                    '<tpl if="Ext.supports.CSS3LinearGradient">dvp-carousel-crumb-buttons-pretty</tpl>',
                '">',
                //TODO: start/pause button
                '<tpl for="slides">',
                    '<a href="#" class="dvp-carousel-crumb"></a>',
                '</tpl>',
                '</span>',
                '<div id="{id}-hoverEl" class="dvp-carousel-crumb-hover">',
                    '<div class="dvp-carousel-crumb-hover-inner">',
                        '<div class="dvp-carousel-crumb-hover-bg"></div>',
                        '<img src="">',
                    '</div>',
                '</div>',
            '</div>',
        '</tpl>',
        
        '<tpl if="showNavigation">',
            '<a id="{id}-navPrevEl" class="dvp-carousel-nav dvp-carousel-nav-prev-{[ values.isHorizontalNav ? "hor" : "vert" ]}" href="#"></a>',
            '<a id="{id}-navNextEl" class="dvp-carousel-nav dvp-carousel-nav-next-{[ values.isHorizontalNav ? "hor" : "vert" ]}" href="#"></a>',
        '</tpl>'
    ],
    
    /**
     * @cfg {Boolean} showBreadCrumb
     * Indicates if the bread crumb element that contains a small indicator for each slide is available.
     */
    showBreadCrumb: true,
    /**
     * @cfg {Boolean} showNavigation
     * Indicates if the arrows are available for manually switching to the next slide.
     */
    showNavigation: true,
    /**
     * @cfg {Boolean} showPlay
     * Indicates if a play/pause element is available.
     */
    showPlay: false,
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
     */
    
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
    
    /**
     * @cfg {Object} transitionOptions
     * Additional config options that are applied to the element animation when transitioning between slides.
     */
    
    /**
     * @cfg {String} transitionType
     * Supported values include: 'animate','fade','slide'
     */
    transitionType: 'fade',
    
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
        
        //<debug>
        if (!me.store){
            Ext.Error.raise('A store or sourceEl is required for the carousel');
        }
        //</debug>
    },
    
    // @inheritdoc
    initComponent: function(){
        var me = this;
        
        me.callParent(arguments);
        
        if (me.showNavigation){
            me.on({
                element: 'navNextEl',
                click: me.onNavNext,
                mouseenter: me.onNavMouseOverOut,
                mouseleave: me.onNavMouseOverOut,
                scope: me
            });
            
            me.on({
                element: 'navPrevEl',
                click: me.onNavPrevious,
                mouseenter: me.onNavMouseOverOut,
                mouseleave: me.onNavMouseOverOut,
                scope: me
            });
        }
        
        me.on({
            element: 'el',
            mouseenter: me.onContainerMouseOver,
            mouseleave: me.onContainerMouseOut,
            scope: me
        })
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
//        DV.log('path '+path+'; value: '+value+'; total: '+total+'; alpha '+alpha+'; a '+a+'; x '+x+'; y '+y);
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
            showBreadCrumb: me.showBreadCrumb,
            showNavigation: me.showNavigation,
            showTimer: me.showTimer,
            slides: me.collectData(me.store.getRange())
        });
    },
    
    /**
     * @private
     * Used for populating the store based on the sourceEl.
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
        function eachImg(child){
            var data = {
                id: id++,
                image_src: child.getAttribute('src'),
                image_title: child.getAttribute('title'),
                image_alt: child.getAttribute('alt')
//                text_*: ?
            };
            store.add(data);
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
    
    onContainerMouseOut: function(e, t){
        var me = this;
        
        //do NOT start running the task if it wasn't running when the mouse entered
        if (me._wasRunning){
            me.start();
            delete me._wasRunning;
        }
        
        if (me.showBreadCrumb){
            me.crumbWrapEl.fadeOut();
        }
        
        if (me.showNavigation){
            me.navPrevEl.fadeOut();
            me.navNextEl.fadeOut();
        }
    },
    
    onContainerMouseOver: function(e, t){
        var me = this;
        
        if (me.pauseOnHover && me.running){
            //set a temp flag so the mouseout will know if it should resume
            me._wasRunning = me.running;
            me.pause();
        }
        
        if (me.showBreadCrumb){
            me.crumbWrapEl.fadeIn();
        }
        
        if (me.showNavigation){
            me.navPrevEl.fadeIn();
            me.navNextEl.fadeIn();
        }
    },

    onCrumbClick: function(e, t){
        var newIndex = this.crumbs.indexOf(t);
        this.setSlide(newIndex);
    },
    
    onCrumbMouseOut: function(e, t){
        Ext.fly(t).removeCls(this.crumbOverCls);
        
        this._abortThumb = true;
        this.hoverEl.hide(); //do not animate b/c delay may interfere with next show
    },
    
    onCrumbMouseOver: function(e, t){
        var me = this,
            img = me.hoverEl.down('img'),
            crumb = Ext.get(t),
            index,
            record,
            xy,
            src;
            
        if (crumb.hasCls(me.crumbActiveCls)){ return; }
        
        crumb.addCls(me.crumbOverCls);
        
        if (img){
            index = me.crumbs.indexOf(crumb);
            record = me.store.getAt(index);
            src = record.get('image_src');
            xy = crumb.getXY();
            xy[0] = xy[0] + me.crumbHoverOffsetX;
            xy[1] = xy[1] + me.crumbHoverOffsetY;
            //defer showing, otherwise the last image will be visible
            img.on('load',function(){
                //check if the user stopped hovering before we loaded
                if (this._abortThumb){ return; }
                
                this.hoverEl.show(true); //display than show ... important for 1st time
                this.hoverEl.setXY(xy);
            },me,{single:true});
            
            delete me._abortThumb;
            img.set({src:src});
        }
    },
    
    onDestroy: function(){
        Ext.destroyMembers(this,'draw','timerTask');
        this.callParent(arguments);
    },
    
    onNavMouseOverOut: function(e, t){
        var classes = Ext.fly(t).getAttribute('className').split(' '), //just 'class' is not valid in IE
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
            Ext.fly(t).toggleCls(overCls);
        }
    },
    
    onNavNext: function(){
        this.next();
    },
    
    onNavPrevious: function(){
        this.previous();
    },
    
    // @inheritdoc
    onRender: function(){
        var me = this;
        
        me.callParent(arguments);
        
        if (me.showBreadCrumb){
            //delegating from the crumbCt doesn't reliably detect/fire events; me.crumbCtEl.on({ delegate: '.dvp-carousel-crumb',...
            me.crumbs.each(function(crumb){
                crumb.on({
                    buffer: 10,
                    click: me.onCrumbClick,
                    mouseenter: me.onCrumbMouseOver,
                    mouseleave: me.onCrumbMouseOut,
                    scope: me
                });
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
        
        if (me.showBreadCrumb){
            me.crumbWrapEl.hide();
        }
        if (me.showNavigation){
            me.navPrevEl.hide();
            me.navNextEl.hide();
        }
        me.slides.hide();
        me.texts.hide();
        
        me.setSlide(me.startSlide, true); //initial
        if (me.autoStart){
            me.start();
        }
    },
    
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
            crumbs = me.crumbs, //CompositeElement
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
            if (me.showBreadCrumb){
                crumbs.removeCls(me.crumbActiveCls);
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

        if (me.showBreadCrumb){
            crumbs.item(newIndex).addCls(me.crumbActiveCls);
        }
        
        me.slideIndex = newIndex;
        me.timerCnt = 0;
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