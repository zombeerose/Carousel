Ext.onReady(function(){
    var query = window.location.search,
        obj = Ext.Object.fromQueryString(query),
        key = obj['x'] || null,
        slideCount = obj['s'] || 2,
        demoStore = Ext.create('Ext.ux.carousel.example.store.Demo'),
        slideStore = Ext.create('Ext.ux.carousel.example.store.Slide'),
        config, demoRecord, slideRecord, spec, images, i, index, total, html;
    
    function reloadPage(){
        var key = Ext.ComponentQuery.query('combo[name=example]')[0].getValue(),
            slides = Ext.ComponentQuery.query('numberfield[name=slides]')[0].getValue(),
            path = String(window.location.href).replace(window.location.search,''), // get the current page but without any params
            query = Ext.Object.toQueryString({ x:key, s:slides });
        
        window.location = Ext.String.urlAppend(path,query);
    }
    
    Ext.create('Ext.form.field.ComboBox',{
        displayField: 'title',
        fieldLabel: 'Current Example',
        listeners: {
            'select': reloadPage,
            buffer: 200
        },
        name: 'example',
        renderTo: 'example-cbo',
        store: demoStore,
        value: key,
        valueField: 'key',
        width: 400
    });
    
    Ext.create('Ext.form.field.Number',{
        fieldLabel: 'Total Slides',
        listeners: {
            'change': reloadPage,
            buffer: 200
        },
        minValue: 0,
        name: 'slides',
        renderTo: 'slide-nbr',
        value: slideCount,
        width: 400
    });
    
    if (key){
        demoRecord = demoStore.findRecord('key',key,0,false,false,true); //exact match
        if (!demoRecord){ return; }

        //some generic example data
        images = [];
        total = slideStore.getCount();
        index = 0;
        for (i = 0; i < slideCount; i++){
            //if we run out of available slides, then start repeating
            if (index > (total - 1)){ index = 0; }
            slideRecord = slideStore.getAt(index);
            index++;
            images.push({
                slideText: slideRecord.get('slide_text'),
                src: slideRecord.get('src'),
                tag: 'img',
                thumbText: slideRecord.get('thumb_text')
            });
        }
        
        spec = {
            children: images,
            cls:'carousel-ct',
            tag: 'div'
        };
        Ext.fly('x-container').update(Ext.DomHelper.markup(spec));
        Ext.fly('x-title').update(demoRecord.get('title'));
        html = Ext.encode(demoRecord.get('config')).replace(/[{]/g,'{<br>&nbsp;').replace(/[}]/g,'<br>}').replace(/,/g,',<br>&nbsp;');
        Ext.fly('x-config').update(html);
        if (demoRecord.get('description')){
            Ext.fly('x-desc').update(demoRecord.get('description'));
        }
        
        config = Ext.apply({
            height: 250,
            sourceEl: 'x-container',
            slides: 10,
            width: 400
        }, demoRecord.get('config') || {});
        
        Ext.create('Ext.ux.carousel.View',config);
    } else {
        Ext.fly('main').hide();
    }
    
//    var model = new Ext.ux.carousel.Model();
//    model.set({ id:1, delay: 20 });
//    model
//      .slides()
//      .add([
//            { id: 1, carousel_id: 1, image_url: 'images/castle.jpg', txt: 'The fortress of Sir Carousel' },
//            { id: 2, carousel_id: 1, image_url: 'images/mountain.jpg', txt: 'The greenest mountain' },
//            { id: 3, carousel_id: 1, image_url: 'images/winter.jpg', txt: 'The winter clearing' },
//            { id: 4, carousel_id: 1, image_url: 'images/yosemite.jpg', txt: 'The famous national park' }
//      ]);
//    Ext.create('Ext.ux.carousel.View',{
//        autoStart: true,
//        height: 250,
//        model: model,
//        renderTo: 'model',
//        width: 400
//    });
//
//<!--
//<div class="cbox">
//<h2>Model</h2>
//<div id="model" class="carousel-ct">
//</div>
//<pre>
//model: new Ext.ux.carousel.Model(...)
//</pre>
//</div>
//-->
});
