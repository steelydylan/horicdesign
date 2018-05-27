ACMS.Dispatch = function (context) {
    var Config = ACMS.Config;
    var Dispatch = arguments.callee;

    new ACMS.Dispatch.ModuleDialog('index');

    //---------
    // utility
    Dispatch.Utility(context);
    if ( window != parent ) {
        setTimeout(function () {
            Dispatch.Utility(context);
        }, 1000);
    }

    //---------------
    // before unload
    Dispatch.unloadAlert(context);

    //-------------
    // layout-edit
    if (ACMS.Config.layout && !ACMS.Dispatch.Layout.load) {
        ACMS.Dispatch.Layout();
    }

    //-----------
    // swfobject
    $(Config.swfoMark, context).each(function () {
        Dispatch.swfobject(this);
    });

    //-----------
    // revision
    if (ACMS.Config.eid) {
        Dispatch.revisionIndex();
        Dispatch._revision();
    }

    //--------
    // resize
    $(ACMS.Config.resizeImageTargetMarkCF, context).each(function () {
        ACMS.Dispatch._imgresize(this);
    });
    ACMS.Dispatch.imageUnitAjaxUpload();

    //------------
    // updatetime
    $('a.updateTime', context).each(function () {
        Dispatch.updatetime(this);
    });

    //------------
    // updatedate
    $('a.updateDate', context).each(function () {
        Dispatch.updatedate(this);
    });

    //------------
    // admin box
    $('#js-admin_action_box', context).each(function () {
        $('#adminBox', this).removeClass('js-dragAdminBox');
    });
    $(':not(#js-admin_action_box) .js-dragAdminBox', context).each(function () {
        var $status = $.cookie('acms_config_admin_box_display_status');
        var $box = $('.js-dragAdminBox.normalBox');
        var $minBox = $('.js-dragAdminBox.minBox');

        $(this).draggable({
            'cursor': 'move',
            'axis': 'x',
            'containment': 'document',
            'handle': '.dragBoxHandle',
            'opacity': 0.7,
            'drag': function (event, pr) {
                var $disp = 'show';
                if ($minBox.css('display') == 'block') $disp = 'hide';
                $.cookie('acms_config_admin_box_display_status', $disp + ':' + pr.position.left, {path: '/'});
            }
        });
        if ($status) {
            $status = $status.split(':');
            var $display = $status[0];
            var $itemLeft = $status[1];
            if ($display == 'hide') {
                $minBox.css('left', parseInt($itemLeft));
                $box.hide();
                $minBox.show();
            } else {
                $box.css('left', parseInt($itemLeft));
                $minBox.hide();
                $box.show();
            }
        } else {
            $minBox.hide();
            $box.show();
        }
    });
    $(':not(#js-admin_action_box) .js-dragAdminBox .dragBoxToggle', context).each(function () {
        $(this).click(function (event) {
            var $box = $('.js-dragAdminBox.normalBox');
            var $minBox = $('.js-dragAdminBox.minBox');
            var $status = 'show:10';
            if ($box.css('display') == 'block') {
                var $itemLeft = $box.position().left + $box.width() - $minBox.width();
                if ($itemLeft < 0) $itemLeft = 0;
                $minBox.css('left', $itemLeft);
                $box.slideUp(200, function () {
                    $minBox.slideDown(200);
                });
                $status = 'hide:' + $itemLeft;
            } else {
                var $itemLeft = $minBox.position().left - ( $box.width() - $minBox.width() );
                if ($itemLeft < 0) $itemLeft = 0;
                $box.css('left', $itemLeft);
                $minBox.slideUp(200, function () {
                    $box.slideDown(200);
                });
                $status = 'show:' + $itemLeft;
            }
            $.cookie('acms_config_admin_box_display_status', $status, {path: '/'});
        });
    });

    //-------
    // modal
    $('.acms-admin-modal-show', context).each(function () {
        var target = $(this).data('target');
        var $target = $(context).find(target);
        if (!!$target.length) {
            $target.addClass('out');
            $(this).click(function () {
                Dispatch.modal($target);

                return true;
            });
        }
    });

    //----------------
    // splash loading
    $('.js-loading_splash').bind('click', function() {
        var message = $(this).data('msg');
        ACMS.Dispatch.splash(message);

        return true;
    });
    $('.acms-admin-btn-admin-save').bind('click', function() {
        ACMS.Dispatch.splash(ACMS.i18n('splash.save'));

        return true;
    });

    //-------------
    // prettyPhoto
    var $images = $(Config.ppMark, context),
        $caption;
    if ($images.size()
        && $(window).width() > Config.ppMinWindowSize
        && ( !Config.ppDisableMobile || !ACMS.Dispatch.Utility.browser().mobile )
        && ( !Config.ppDisableTablet || !ACMS.Dispatch.Utility.browser().tablet )
    ) {
        if (Config.ppCaption2Title) {
            $images.each(function () {
                $caption = $(this).parent().find('p.caption');
                if ($caption.size()) {
                    $(this).attr('title', $caption.text());
                }
            });
        }
        $images.prettyPhoto(Config.ppConfig);
    } else if (Config.ppWindowTarget) {
        $images.attr('target', Config.ppWindowTarget);
    }

    //-------------
    // modalVideo
    var $modalvideos = $(Config.modalVideoMark, context);
    if($modalvideos.size()) {
        $modalvideos.modalVideo(Config.modalVideoConfig);
    }

    //----------------------
    // google code prettify
    // if ($('pre').size() && typeof ACMS.Library.googleCodePrettify === 'function') {
    //     ACMS.Library.googleCodePrettify();
    // }

    //-----------------------
    // adaptive image sizing
    var $aImg = $(Config.adaptiveImageMark);
    if ($aImg.size()) {
        var resolved = false,
            $window = $(window);
        $aImg = $aImg.filter(function () {

            var $self = $(this),
                nowWidth = ~~$self.attr('width'),
                baseWidth = ~~$self.attr('data-width'),
                src = $self.attr('src');
            return !(nowWidth >= baseWidth) && src.indexOf('tiny-') !== -1;
        });

        $window.resize(function () {
            if (!resolved && $window.width() > Config.adaptiveImageSize) {
                resolved = true;
                $aImg.each(function (i) {
                    var $self = $(this),
                        width = ~~$self.attr('data-width'),
                        height = ~~$self.attr('data-height'),
                        src = $self.attr('src'),
                        $div = $self.closest('div');

                    if ($div.get(0).className.indexOf('column-image-') !== -1) {
                        $div.css('width', width);
                    }
                    $self.attr({
                        width: width,
                        height: height,
                        src: src.replace('tiny-', '')
                    });
                });
            }
        }).resize();
    }

    //-----------------------------
    // module setting popup window
    $(Config.popupSettingMark, context).each(function () {
        $(this).parent('.acms-admin-module-edit').show().parent().addClass('acms-admin-module-edit-wrapper');
        var $conf = Config.popupSettingConf;
        $(this).bind('click', function () {
            window.open(this.href, 'popup_setting', 'width=' + $conf.width + ', height=' + $conf.height + ', status=no, scrollbars=yes');
            return false;
        });
    });

    $(Config.moduleManagementMark, context).each(function () {
        $(this).parent('.acms-admin-module-edit').parent().addClass('acms-admin-module-edit-wrapper');

        $(this).bind('click', function () {
            var mid = $(this).data('mid'),
                bid = $(this).data('bid'),
                edit = isFinite(mid) ? 'update' : 'insert';

            var Dialog = new ACMS.Dispatch.ModuleDialog(edit);
            Dialog.show(mid, '', bid);

            return false;
        });
    });

    $(Config.dialogBtnMark, context).each(function () {
        ACMS.Dispatch.Dialog(this);
    });

    //---------------
    // Module Update
    var $moduleForm = $('#js-module_form');
    $('.js-module_form_trigger').unbind().bind('click', function () {
        $moduleForm.submit();
        return false;
    });

    $moduleForm.bind('submit', function () {
        var $form = $(this),
            $modalBody = $form.closest('.acms-admin-modal-body'),
            $modal = $modalBody.closest('#js-module_management'),
            $iframe = $('iframe[name="js-ajaxPostData"]');

        $iframe.unbind().bind('load', function () {
            var res = $iframe.contents(),
                $res = $('.acms-admin-modal-body', res);

            $modalBody.html($res.html());
            Dispatch($modal);
            $form[0].reset();

            if (
                !$('.acms-admin-alert.acms-admin-alert-danger').length && !Config.layout
            ) {
                if (confirm(Config.moduleManagementReloadMsg)) {
                    window.location.reload();
                }
            }
        });
    });

    //---------
    // tooltip
    $('.js-acms-tooltip', context).click(function () {
        Dispatch._tooltip(this);
        return false;
    });

    $('.js-acms-tooltip-hover', context).hover(function () {
            Dispatch._tooltip(this, true);
            return false;
        },
        function () {
            Dispatch._tooltip(this, false);
            return false;
        });

    //-----------
    // highslide
    $.each(Config.hsArray.concat({
        'mark': Config.hsMark,
        'config': Config.hsConfig
    }), function () {
        Config.hsConfig = this.config;
        $(this.mark, context).each(function () {
            Dispatch.highslide(this);
        });
    });

    //----------
    // ckeditor
    $(Config.ckeMark, context).each(function () {
        Dispatch.ckeditor(this);
    });

    //------------
    // biggerlink
    $.each(Config.biggerlinkArray.concat({
        'mark': Config.biggerlinkMark,
        'conf': Config.biggerlinkConf
    }), function () {
        Config.biggerlinkConf = this.conf;
        $(this.mark, context).each(function () {
            Dispatch.biggerlink(this);
        });
    });

    //------------
    // bxslider
    $.each(Config.bxsliderArray.concat({
        'mark': Config.bxsliderMark,
        'conf': Config.bxsliderConf
    }), function () {
        Config.bxsliderConf = this.conf;
        $(this.mark, context).each(function () {
            Dispatch.bxslider(this);
        });
    });

    //------------
    // autoheight
    $(window).load(function() {
        $.each(Config.autoHeightConfArray.concat({
            'mark': Config.autoHeightMark
        }), function () {
            $(this.mark, context).each(function () {
                Dispatch.autoheight();
            });
        });
    });

    //--------------
    // autoheight-r
    $(window).load(function() {
        $.each(Config.autoHeightRArray.concat({
            'mark': Config.autoHeightRMark,
            'config': Config.autoHeightRConf
        }), function () {
            this.config.mark = this.mark;
            Config.autoHeightRConf = this.config;
            Dispatch.autoheightR();
        });
    });

    //------------
    // datepicker
    $.each(Config.dpicArray.concat({
        'mark': Config.dpicMark,
        'config': Config.dpicConfig
    }), function () {
        Config.dpicConfig = this.config;
        $(this.mark, context).each(function () {
            Dispatch.datepicker(this);
        });
    });

    //--------------------
    // fieldgroupSortable
    $(Config.fieldgroupSortableMark, context).each(function () {
        Dispatch.fieldgroupSortable(this);
    });

    //----------
    // emoditor
    $.each(Config.emoArray.concat({
        'mark': Config.emoMark,
        'toolbar': Config.emoToolbar,
        'config': Config.emoConfig
    }), function () {
        Config.emoToolbar = this.toolbar;
        Config.emoConfig = this.config;
        $(this.mark, context).each(function () {
            Dispatch.emoditor(this);
        });
    });

    //----------------
    // static2dynamic
    var $s2dReady = $(ACMS.Config.s2dReadyMark, context);
    if ($s2dReady.size()) {
        var region = '';
        if (ACMS.Config.s2dRegion) {
            region = '&region=' + ACMS.Config.s2dRegion;
        }

        ACMS.Library.googleLoadProxy('maps', '3', {
            'callback': function () {
                $s2dReady.each(function () {
                    Dispatch._static2dynamic(this);
                });
            }
        });
    }
    $(Config.s2dMark, context).each(function () {
        Dispatch.static2dynamic(this);
    });

    //---------------------
    // static2dynamic yolp
    var $s2dYolpReady = $(ACMS.Config.s2dYolpReadyMark, context);
    if ($s2dYolpReady.size()) {
        ACMS.Library.yahooLoadProxy({
            'callback': function () {
                $s2dYolpReady.each(function () {
                    Dispatch._static2dynamic_yolp(this);
                });
            }
        });
    }
    $(Config.s2dYolpMark, context).each(function () {
        Dispatch.static2dynamic_yolp(this);
    });

    //-----------
    // accordion
    $.each(Config.accordionArray.concat({
        'mark': Config.accordionMark,
        'config': Config.accordionConfig
    }), function () {
        Config.accordionConfig = this.config;
        $(this.mark, context).each(function () {
            Dispatch.accordion(this);
        });
    });

    //------
    // tabs
    $.each(Config.tabsArray.concat({
        'mark': Config.tabsMark,
        'config': Config.tabsConfig
    }), function () {
        Config.tabsConfig = this.config;
        $(this.mark, context).each(function () {
            Dispatch.tabs(this);
        });
    });

    //-----------
    // acms tabs
    $.each(Config.acmsTabsArray.concat({
        'mark': Config.acmsTabsMark,
        'config': Config.acmsTabsConfig
    }), function () {
        Config.acmsTabsConfig = this.config;
        $(this.mark, context).each(function () {
            Dispatch.acmsTabs(this);
        });
    });

    //------------------
    // acms alert close
    $(Config.acmsAlertCloseMark, context).each(function () {
        Dispatch.acmsAlertClose(this);
    });

    $.each(Config.acmsAlertCloseArray.concat({
        'mark': Config.acmsAlertCloseMark,
        'config': Config.acmsAlertCloseConfig
    }), function () {
        Config.acmsAlertCloseConfig = this.config;
        $(this.mark, context).each(function () {
            Dispatch.acmsAlertClose(this);
        });
    });

    //-------
    // fader
    $.each(Config.faderArray.concat({
        'mark': Config.faderMark,
        'config': Config.faderConfig
    }), function () {
        Config.faderConfig = this.config;
        $(this.mark, context).each(function () {
            Dispatch.fader(this);
        });
    });

    //-------
    // toggle
    $.each(Config.toggleArray.concat({
        'mark': Config.toggleMark,
        'config': Config.toggleConfig
    }), function () {
        Config.toggleConfig = this.config;
        $(this.mark, context).each(function () {
            Dispatch.toggle(this);
        });
    });

    //------------------------------------
    // delete entry data for localstorage
    if (1
        && ACMS.Config.webStorage === 'on'
        && typeof localStorage !== 'undefined'
    ) {
        var key = ACMS.Config.delStorage;
        if (key) {
            if (ACMS.Config.webStorageCapacity === 'limitless') {
                if (ACMS.Config.webStorageType === 'session') {
                    sessionStorage.removeItem(key);
                } else if (ACMS.Config.webStorageType === 'local') {
                    localStorage.removeItem(key);
                } else {
                    sessionStorage.clear();
                    localStorage.clear();
                }
            }
        }
    }

    //-------------
    // postinclude
    Dispatch.Postinclude(context);

    //-------------------
    // linkmatchlocation
    Dispatch.Linkmatchlocation(context);

    //-----------
    // validator
    $(Config.validatorFormMark, context).each(function () {
        Dispatch.validator(this);
    });

    //----------
    // rollover
    $(Config.rolloverImgMark, context).each(function () {
        Dispatch.rollover(this);
    });

    //----------
    // scrollto
    $(Config.scrollToMark, context).each(function () {
        Dispatch.scrollto(this);
    });

    //-------------
    // select2text
    $(Config.select2textMark, context).each(function () {
        Dispatch.select2text(this);
    });

    //-------
    // zebra
    $(Config.zebraMark, context).each(function () {
        Dispatch.zebra(this);
    });

    //-------------
    // placeholder
    $(Config.placeholderMark, context).each(function () {
        Dispatch.placeholder(this);
    });

    if (!('placeholder' in document.createElement('input'))) {
        $('[placeholder]', context).each(function () {
            Dispatch.crossBrowserPlaceholder(this);
        });
    }

    //--------------------
    // incremental search
    $(Config.incrementalSearchMark, context).each(function () {
        Dispatch.incrementalSearch(this);
    });

    //-------
    // hover
    $(Config.hoverMark, context).each(function () {
        Dispatch.hover(this);
    });

    //-----------
    // selection
    $(Config.clickSelectionInputTextMark, context).each(function () {
        Dispatch.selection(this);
    });

    //-------
    // input count up
    $(Config.countupMark, context).each(function () {
        Dispatch.countup(this);
    });

    //----------------------
    // external form button
    $(Config.externalFormButtonMark, context).each(function () {
        Dispatch.ExternalSubmit(this);
    });

    //---------
    // viewing
    var $viewing = $('a[href=\'' + encodeURI(document.location.href) + '\']', context);
    if ($viewing.size()) {
        $viewing.filter(Config.viewingMark).each(function () {
            if ($(this).attr('id')) {
                return true
            }
            if ($(this).parent().attr('id')) {
                return true
            }
            $(this).parent().attr('id', Config.viewingId);
            $(this).parent().addClass(Config.viewingClass);
        });

        //-------
        // erase
        $viewing.filter(Config.viewingEraseMark).each(function () {
            var display = $(this).css('display');
            if (Config.viewingNonTarget.some(function (v) {
                    return v === display
                })) {
                return true;
            }
            var html = $(this).html();
            var replacement = Config.viewingReplacement
            var attrs = {};
            var removeAttrs = Config.viewingRemoveAttr;
            if (replacement) {
                $.each($(this)[0].attributes, function(idx, attr) {
                    for(var i = 0, length = removeAttrs.length; i < length; i++){
                        if(attr.nodeName === removeAttrs[i]) {
                            return;
                        }
                    }
                    attrs[attr.nodeName] = attr.nodeValue;
                });
                $(this).replaceWith(function() {
                    return $("<" + replacement + "/>", attrs).append(html);
                });
            } else {
                $(this).after(html);
            }
            $(this).remove();
        });
    }

    //--------------------
    // link outside blank
    var innerlinkPtn = new RegExp('(' + Config.domains.replace(/,/g, '|') + ')(:\\d+)*');
    $(Config.linkOutsideBlankMark, context).each(function () {
        if (innerlinkPtn.exec(ACMS.Library.punycodeEncode(this.href))) {
            return true;
        }
        $(this).attr('target', '_blank');
    });

    //------------------------------
    // link https disabler, enabler
    if ( 1
        && 'https:' == document.location.protocol
        && Config.fulltimeSSL != '1'
        && !location.href.match(/admin\/(.*)$/)
    ) {
        $(Config.linkHttpsDisablerMark, context).not(Config.linkHttpsNoRewriteMark).each(function () {
            var href = $(this).attr('href');
            if ( !!href && !href.match(/https?:\/\//) && !$(this).attr('href').match(/^#/) ) {
                this.href = this.href.replace(/https:\/\//, 'http://');
            }
        });
    } else {
        $(Config.linkHttpsEnablerMark, context).not(Config.linkHttpsNoRewriteMark).each(function () {
            var href = $(this).attr('href');
            if ( !!href && !href.match(/https?:\/\//) && !href.match(/^#(.*)$/) ) {
                this.href = this.href.replace(/http:\/\//, 'https://');
            }
        });
    }

    //-------------
    // select link
    $('.selectLink', context).change(function () {
        var url = $(':selected', this).val(), admin;
        if (url !== '' && url.indexOf('http') === 0) {
            if (location.href.match(/admin\/(.*)$/)) {
                admin = RegExp.$1;
                if (admin.match(/^[a-z]+_edit\//)) {
                    admin = admin.replace(/^([a-z]+)_(edit\/.*)$/, '$1_index');
                }
                url = url.replace(/admin\/.*$/, 'admin/' + admin);
            }
            location.href = url;
        }
    }).show();

    //---------
    // session
    if (Config.sid && $.cookie(Config.session)) {
        $('a[href*="/' + Config.session + '/' + Config.sid + '"]', context).click(function () {
            this.href = this.href.replace(
                '/' + Config.session + '/' + Config.sid
                , '/' + Config.session + '/' + $.cookie(Config.session));
        });
        // $('a', context).click(function ( )
        // {
        //     var domain  = this.href.match(/^[httpsfile]+:\/{2,3}([0-9a-z\.\-:]+?):?[0-9]*?\//i)[1];
        //     if ( domain != Config.domains ) {
        //         var sl = '/';
        //         if ( this.href.slice(-1) == '/' ) sl = '';
        //         this.href   = this.href + sl + Config.session + '/' + $.cookie(Config.session);
        //     }
        // });
    }

    //-------------------
    // obserbe file size
    if (ACMS.Config.resizeImage !== 'on') {
        $(Config.observeFileSizeMark, context).each(function () {
            Dispatch._observefilesize(this);
        });
    }

    //-------
    // admin
    if (Config.admin || $('#js-module_management').length) {
        //------
        // edit
        if ($(':input[name^="ACMS_POST_Entry_Insert"], :input[name^="ACMS_POST_Entry_Update"], :input[name^="ACMS_POST_Form2_Update"], :input[name^="ACMS_POST_Entry_Add"]', context).size()) {
            Dispatch.Edit(context);
            if (Config.admin === 'entry_editor') Dispatch.Admin(context);
        } else {
            Dispatch.Admin(context);
        }
    }

    //---------
    // inplace
    if ($('.js-edit_inplace', context).length) {
        ACMS.Load.Dispatch.Edit._inplace(function () {
            Dispatch.Edit(context);
        });
    }

    //---------
    // direct
    if ($('.js-direct-unit', context).length) {
        $('.js-direct-unit', context).unbind('click');
        $('.js-direct-unit', context).click(function () {
            ACMS.Dispatch.Edit(context);
            ACMS.Dispatch.Edit._direct(this);
            return false;
        });
    }
    //-----------------------------
    // offcanvas
    if ($(Config.offcanvas.offcanvasMark).length > 0) {
        Dispatch.offcanvas(context);
    }

    //-----------------------------
    // a-table
    $(Config.aTableFieldMark, context).each(function () {
        Dispatch.fieldAtable(this);
    });

    ACMS.dispatchEvent("acmsDispatch");
};

//--------------
// unloadAlert
ACMS.Dispatch.unloadAlert = function (context) {
    ACMS.Dispatch.Utility.unloadAlert(context, ACMS.Config.unloadAlertMark);
};

//-------------------
// Linkmatchlocation
ACMS.Dispatch.Linkmatchlocation = function (context) {
    var Config = ACMS.Config;
    var Linkmatchlocation = arguments.callee;

    $.each(Config.linkMatchLocationArray.concat({
        'mark': Config.linkMatchLocationMark,
        'type': 'part',
        'className': Config.linkMatchLocationClass
    }, {
        'mark': Config.linkMatchLocationFullMark,
        'type': 'full',
        'className': Config.linkMatchLocationFullClass
    }, {
        'mark': Config.linkMatchLocationContainMark,
        'type': 'contain',
        'className': Config.linkMatchLocationContainClass
    }, {
        'mark': Config.linkMatchLocationBlogMark,
        'type': 'blog',
        'className': Config.linkMatchLocationBlogClass
    }, {
        'mark': Config.linkMatchLocationCategoryMark,
        'type': 'category',
        'className': Config.linkMatchLocationCategoryClass
    }, {
        'mark': Config.linkMatchLocationEntryMark,
        'type': 'entry',
        'className': Config.linkMatchLocationEntryClass
    }), function () {
        var mark = this.mark;
        var type = this.type;
        Config.linkMatchLocationClass = this.className;
        $(mark, context).each(function () {
            Linkmatchlocation[type](this);
        });
    });
};

//-------------
// Postinclude
ACMS.Dispatch.Postinclude = function (context) {
    var Config = ACMS.Config;
    var Postinclude = arguments.callee;

    $.each(Config.postIncludeArray.concat({
        'mark': Config.postIncludeOnsubmitMark,
        'type': 'submit',
        'method': Config.postIncludeMethod,
        'effect': Config.postIncludeEffect,
        'effectSpeed': Config.postIncludeEffectSpeed
    }, {
        'mark': Config.postIncludeOnreadyMark,
        'type': 'ready',
        'method': Config.postIncludeMethod,
        'effect': Config.postIncludeEffect,
        'effectSpeed': Config.postIncludeEffectSpeed,
        'delay': Config.postIncludeReadyDelay
    }, {
        'mark': Config.postIncludeOnBottomMark,
        'type': 'bottom',
        'method': Config.postIncludeMethod,
        'effect': Config.postIncludeEffect,
        'effectSpeed': Config.postIncludeEffectSpeed,
        'offset': Config.postIncludeOffset
    }, {
        'mark': Config.postIncludeOnIntervalMark,
        'type': 'interval',
        'method': Config.postIncludeMethod,
        'effect': Config.postIncludeEffect,
        'effectSpeed': Config.postIncludeEffectSpeed,
        'interval': Config.postIncludeIntervalTime
    }), function () {
        var type = this.type;
        Config.postIncludeMethod = this.method;
        Config.postIncludeEffect = this.effect;
        Config.postIncludeEffectSpeed = this.effectSpeed;
        if (type === 'bottom') Config.postIncludeOffset = this.offset;
        if (type === 'interval') Config.postIncludeIntervalTime = this.interval;
        if (type === 'ready') Config.postIncludeReadyDelay = this.delay;
        $(this.mark, context).each(function () {
            Postinclude[type](this);
        });
    });
};

//----------------------
// external form button
ACMS.Dispatch.ExternalSubmit = function (elm) {
    var form = elm;
    if ('undefined' != typeof(form.returnValue)) {
        if (!form.returnValue) {
            return false;
        }
    }

    var target = form;
    if (form.target) {
        var $target = $(form.target);
        if (!$target.size()) {
            return false;
        }
        target = $target[0];
    }

    if ($(target).size()) {
        form.target = '_self';
        $(target).click(function () {
            form.submit();
        });
    } else {
        return false;
    }
};

//----------
// scrollto
ACMS.Dispatch.scrollto = function (elm) {
    $(elm).click(function () {
        var hash = elm.hash.slice(1), $target;
        var offset = $(elm).data('offset');
        var $setting = {};
        if (!(typeof(offset) != 'number' && typeof(offset) != 'string')) {
            $setting = {'offset': offset};
        }
        if (!!hash) {
            $target = $('[name="' + hash + '"]' + ', ' + '#' + hash);
            ACMS.Library.scrollToElm($target, $setting);
        } else {
            ACMS.Library.scrollToElm(null, $setting);
        }

        return false;
    });
};

//----------------
// splash loading
ACMS.Dispatch.splash = function(message)
{
    if ( $('#js-loading_splash').length  ) {
        return false;
    }
    if ( !message ) {
        message = ACMS.i18n('splash.default');
    }

    var $body = $('body'),
        $img  =  $img  = $($.parseHTML('<div class="js-acms_loader_img js-acms_loader" style="display:none;"></div>')),
        $prog = $($.parseHTML('<div id="js-loading_splash"></div>')),
        $progOuter = $($.parseHTML('<div class="js-loading_splash_frame"><p>'+message+'</p></div>'));

    $prog.append($progOuter);

    // IE6,7.8,9
    if ( ACMS.Dispatch.Utility.browser().ltIE9 ) {
        $img  = $($.parseHTML('<img class="js-acms_loader_img" src="'+ACMS.Config.root+'themes/system/images/ajax-loader.gif" style="display:none;"/>'));
    }

    $prog.css({
        "top": document.body.scrollTop  || document.documentElement.scrollTop,
        "left": document.body.scrollLeft || document.documentElement.scrollLeft,
        "height": window.innerHeight,
        "z-index": 2147483647
    });

    // imgのloadを待たないと，ローダー画像がうまく表示されないことがある
    $img.appendTo($progOuter).show();
    $body.append($prog);
    $prog.fadeIn(100);
};

ACMS.Dispatch.removeSplash = function ()
{
    $('#js-loading_splash').fadeOut(500).queue(function() {
        $(this).remove();
    });
};

//------------
// biggerlink
ACMS.Dispatch.biggerlink = function (elm) {
    (function (conf) {
        $(elm).biggerlink(conf);
    })(ACMS.Config.biggerlinkConf);
};

//------------
// bxslider
ACMS.Dispatch.bxslider = function (elm) {
    (function (conf) {
        $(elm).bxSlider(conf);
        $(elm).show();
    })(ACMS.Config.bxsliderConf);
};

//------------
// autoheight
ACMS.Dispatch.autoheight = function () {
    $(ACMS.Config.autoHeightConfArray).each(function () {
        for (var i in this) {
            $(ACMS.Config.autoHeightMark + ' ' + i).autoheight({column: this[i], clear: 1});
        }
    });
};

//--------------
// autoheightR
ACMS.Dispatch.autoheightR = function () {
    (function (conf) {
        var timer = false,
            offset = conf.offset,
            style = conf.style === 'height' ? 'height' : 'min-height',
            parent = conf.parent,
            element = conf.element,
            list = conf.list,
            mark = conf.mark;

        $(window).resize(function () {
            if (timer !== false) {
                clearTimeout(timer);
            }
            timer = setTimeout(function () {
                var $boxAry = $(mark),
                    currentWidth = 0,
                    maxHeight = 0,
                    rowAry = [];

                if (element.length > 0) {
                    $(element).css(style, 'auto');
                } else {
                    $boxAry.css(style, 'auto');
                }

                _.each($boxAry, function (v) {
                    var $box = $(v),
                        $next = $box.next(),
                        boxWidth = $box.outerWidth(true),
                        tmpHeight = $box.outerHeight(),
                        containerWidth = ( parent === 'parent' ) ? $box.parent().width() : $box.closest(parent).width();

                    if (!!list) {
                        $next = $box.parent(list).next().find(mark);
                    }

                    if (1
                        && rowAry.length > 0
                        && (containerWidth - (currentWidth + boxWidth) < -5)
                    ) {
                        _.each(rowAry, function (box) {
                            if (element.length > 0) {
                                $(element, box).css(style, maxHeight + offset);
                            } else {
                                $(box).css(style, maxHeight + offset);
                            }
                        });

                        currentWidth = 0;
                        maxHeight = 0;
                        rowAry = [];
                    }
                    rowAry.push($box);
                    currentWidth += boxWidth;
                    if (tmpHeight > maxHeight) {
                        maxHeight = tmpHeight;
                    }
                    if (!$next.hasClass(mark.substring(1))) {
                        _.each(rowAry, function (box) {
                            if (element.length > 0) {
                                $(element, box).css(style, maxHeight + offset);
                            } else {
                                $(box).css(style, maxHeight + offset);
                            }
                        });
                        currentWidth = 0;
                        maxHeight = 0;
                        rowAry = [];
                    }
                });
            }, 200);
        }).trigger('resize');
    })(ACMS.Config.autoHeightRConf);
};

//------------
// datepicker
ACMS.Dispatch.datepicker = function (elm) {
    (function (config) {
        $(elm).datepicker(config);
    })(ACMS.Config.dpicConfig);
};

//------------
// accordion
ACMS.Dispatch.accordion = function (elm) {
    (function (config) {
        $(elm).accordion(config);
    })(ACMS.Config.accordionConfig);
};

//------
// tabs
ACMS.Dispatch.tabs = function (elm) {
    (function (config) {
        $(elm).tabs(config);
    })(ACMS.Config.tabsConfig);
};

//-----------
// acms tabs
ACMS.Dispatch.acmsTabs = function (elm) {
    (function (config) {
        var $tabs = $();
        var $panels = $();
        var $expr = $('a[href^=\'#\']', elm);

        $expr.each(function () {
            var panel = $(this).attr('href');
            $tabs = $tabs.add(this);
            $panels = $panels.add($(panel));
            $(this).addClass(config.tabClass);
            $(this).click(function () {
                $tabs.removeClass(config.activeClass);
                $(this).addClass(config.activeClass);
                $panels.hide();
                $(panel).show();
                return false;
            });
        });
        $panels.hide();
        $expr.filter(':first').click();

        if (config.readyMark != '' && 'undefined' != typeof(config.readyMark)) {
            if(config.readyMark.substr(0,1) === '#'){
                $expr.filter('a[href=\'' + config.readyMark + '\']').click();
            }
            $expr.filter(config.readyMark).click();
        }
    })(ACMS.Config.acmsTabsConfig);
};

//------------------
// acms alert close
ACMS.Dispatch.acmsAlertClose = function (elm) {
    (function (config) {
        $(elm).click(function () {
            var $alert = $(this).parent(config.target);
            $alert.remove();
        });
    })(ACMS.Config.acmsAlertCloseConfig);
};

//-------
// fader
ACMS.Dispatch.fader = function (elm) {
    (function (config) {
        var $head = $(elm);
        var $body = $(elm.href.replace(/^[^#]+/, ''));

        if ('hide' == config.initial) {
            $body.not(config.readyMark).hide();
            if ('none' != $body.css('display')) {
                $head.addClass(config.activeClass);
            }
        } else if ('show' == config.initial) {
            $body.show();
        }

        $head.click(function (event) {
            if ('slide' == config.effect) {
                if ('none' == $body.css('display')) {
                    $head.addClass(config.activeClass);
                    $body.slideDown(config.speed);
                } else {
                    $head.removeClass(config.activeClass);
                    $body.slideUp(config.speed);
                }
            }
            else if ('fade' == config.effect) {
                if ('none' == $body.css('display')) {
                    $body.fadeIn(config.speed);
                    $head.addClass(config.activeClass);
                } else {
                    $body.fadeOut(config.speed);
                    $head.removeClass(config.activeClass);
                }
            }
            event.preventDefault();
        });

    })(ACMS.Config.faderConfig);
};

//---------
// toggle
ACMS.Dispatch.toggle = function (elm) {
    (function (config) {
        var $head = $(elm).find(config.toggleHead);
        var $ready = $(elm).find(config.readyMark);
        var $hide = $(elm).find(config.hideMark);

        $ready.show();
        $hide.hide();

        $head.click(function () {
            if ($ready.css('display') == 'none') {
                $hide.fadeOut(config.speed, function () {
                    $ready.fadeIn(config.speed);
                });
            } else {
                $ready.fadeOut(config.speed, function () {
                    $hide.fadeIn(config.speed);
                });
            }
            return false;
        });
    })(ACMS.Config.toggleConfig);
};

//-----------
// swfobject
ACMS.Dispatch.swfobject = function (elm) {
    if (!$('dl.flashvars, dl.params, dl.attributes, dl.embed', elm).size()) return true;
    var flashvars = ACMS.Library.dl2object($('dl.flashvars', elm));
    var params = ACMS.Library.dl2object($('dl.params', elm));
    var attributes = ACMS.Library.dl2object($('dl.attributes', elm));
    var embed = ACMS.Library.dl2object($('dl.embed', elm));

    swfobject.embedSWF(
        embed.swfUrlStr, $(elm).attr('id'), embed.widthStr, embed.heightStr,
        embed.swfVersionStr, ACMS.Config.jsRoot + 'swfobject/expressInstall.swf',
        flashvars, params, attributes
    );
};


//-------------
// revision
ACMS.Dispatch.revisionIndex = function (context) {
    // 詳細ポップアップ
    $('.js-get_revisions').unbind().bind('click', function () {
        var $revisionBox = $('#js-revision_index');
        var $backdrop = $('.acms-admin-modal-backdrop');
        var eid = ACMS.Config.eid;

        ACMS.Dispatch.splash();

        if (!$backdrop.length) {
            $backdrop = $($.parseHTML('<div class="acms-admin-modal-backdrop"></div>')).hide().appendTo('body');
        }

        var code = '\
            <div id="js-edit_inplace-detail" class="acms-admin-modal out">\
                <div class="acms-admin-modal-dialog large">\
                    <div class="acms-admin-modal-content">\
                        <div class="acms-admin-modal-header">\
                            <i class="acms-admin-modal-hide acms-admin-icon-delete"></i>\
                            <h3>バージョン一覧</h3>\
                        </div>\
                        <div class="acms-admin-modal-body">\
                            <div class="acms-admin-padding-small"></div>\
                        </div>\
                    </div>\
                </div>\
            </div>';

        if (!$revisionBox.length) {
            $revisionBox = $($.parseHTML(code)).appendTo('body');
        } else {
            $revisionBox.empty().remove();
            $revisionBox = $($.parseHTML(code)).appendTo('body');
        }

        var query = {hash: Math.random().toString()};
        if ( !!ACMS.Config.aid ) {
            query.aid = ACMS.Config.aid;
        }

        $.ajax({
            type: 'GET',
            url: ACMS.Library.acmsLink({
                eid: eid,
                tpl: 'ajax/revision-index.html',
                Query: query
            }, true),
            dataType: 'html',
            success: function (res) {
                ACMS.Dispatch.removeSplash();

                $raw = $($.parseHTML(res));

                // 表示
                if ($revisionBox.length) {
                    $('body').css('overflow', 'hidden');
                    $revisionBox.find('.acms-admin-modal-body > .acms-admin-padding-small').append($raw);
                    $revisionBox.show();
                    $backdrop.show();
                    setTimeout(function () {
                        $revisionBox.removeClass('out').delay(200).queue(function () {
                            $(this).addClass('in').delay(500).queue(function () {
                                $(this).addClass('display').removeClass('in');
                            }).dequeue();
                        });
                    }, 1);
                }

                // Dispatch適用
                ACMS.Config.postIncludeEffect = 'fade';
                ACMS.Dispatch($revisionBox);

                var closeFn = function () {
                    $('body').css('overflow', '');

                    $backdrop.fadeOut();
                    $revisionBox.removeClass('display').addClass('out');
                    setTimeout(function () {
                        $revisionBox.hide();
                    }, 500);

                    return false;
                };

                $('.acms-admin-modal-hide').bind('click', closeFn);

                $revisionBox.click(function (event) {
                    var click = event.target;
                    if ($(click).hasClass('acms-admin-modal')) {
                        closeFn();
                    }
                });
            }
        });
    });
};

//-------
// modal
ACMS.Dispatch.modal = function ($modal) {
    var $backdrop = $('.acms-admin-modal-backdrop');
    var $hideBtn = $('.acms-admin-modal-hide');

    if (!$backdrop.length) {
        $backdrop = $($.parseHTML('<div class="acms-admin-modal-backdrop"></div>')).hide().appendTo('body');
    }

    $('body').css('overflow', 'hidden');
    $modal.show();
    $backdrop.show();
    setTimeout(function () {
        $modal.removeClass('out').delay(200).queue(function () {
            $(this).addClass('in').delay(500).queue(function () {
                $(this).addClass('display').removeClass('in');
            }).dequeue();
        });
    }, 1);

    var closeFn = function () {
        $('body').css('overflow', '');
        $modal.removeClass('display').addClass('out');
        $backdrop.fadeOut();
        setTimeout(function () {
            $modal.hide();
        }, 500);
    };

    $hideBtn.click(closeFn);
    $modal.click(function (event) {
        var click = event.target;
        if ($(click).hasClass('acms-admin-modal')) {
            closeFn();
        }
    });
};

//----------------
// module dialog
ACMS.Dispatch.showModuleDialog = function (type, mid, $indexTpl, callback) {
    var query = {edit: type, mid: mid},
        tpl;

    // 新規
    if (type == 'insert') {
        tpl = 'ajax/module/edit.html';
        // 一覧
    } else if (type === 'index') {
        tpl = 'ajax/module/index.html';
        query = {edit: type, mid: mid, tpl: $indexTpl};
        // 更新
    } else if (type === 'update') {
        tpl = 'ajax/module/edit.html';
    }

    //-----
    // 表示
    $.ajax({
        type: 'GET',
        url: ACMS.Library.acmsLink({
            tpl: tpl,
            Query: query
        }, true),
        dataType: 'html',
        success: function (res) {
            var $modalBox = $($.parseHTML(res)).appendTo('body'),
                $backdrop = $($.parseHTML('<div class="acms-admin-modal-backdrop"></div>')).hide().appendTo('body');

            //------
            // show
            if ($modalBox.length) {
                $('body').css('overflow', 'hidden');
                setTimeout(function () {
                    $backdrop.show();
                    $modalBox.show();
                    $modalBox.removeClass('out').addClass('in');
                }, 200);

                var zIndex = $('.acms-admin-modal-backdrop').length * 100000;

                $backdrop.css('z-index', zIndex);
                $modalBox.css('z-index', zIndex + 1);

                ACMS.Dispatch($modalBox);
            }

            //------
            // hide
            $('.acms-admin-modal-hide').bind('click', function () {
                closeFn($modalBox, $backdrop);
            });
            $modalBox.click(function (event) {
                var click = event.target;
                if ($(click).hasClass('acms-admin-modal')) {
                    closeFn($modalBox, $backdrop);
                }
            });

            //---------
            // action
            $('.js-layout_select_module_id').bind('click', {
                modal: $modalBox,
                backdrop: $backdrop
            }, selectModule);
            $('.js-acms_layout_edit_module, .js-acms_layout_create_module').unbind('click').bind('click', {
                modal: $modalBox
            }, editModule);
        }
    });

    //---------------
    // select module
    var selectModule = function (event) {
        var mid = $(this).data('mid');
        var tpl = $(this).closest('tr').find('[name^=template]').val();

        $.ajax({
            type: 'GET',
            url: ACMS.Library.acmsLink({
                tpl: 'ajax/module/view.html',
                Query: {
                    mid: mid,
                    tpl: tpl,
                    layout: 'edit'
                }
            }, true),
            dataType: 'html',
            success: function (res) {
                callback(res, mid, tpl);
            },
            complete: function () {
                if (event.data) {
                    closeFn(event.data.modal, event.data.backdrop);
                } else {
                    closeFn($indexTpl, $('.acms-admin-modal-backdrop'));
                }
            }
        });
    };

    //--------------
    // create, edit
    var editModule = function (event) {
        var mid = $(this).data('mid'),
            edit = isFinite(mid) ? 'update' : 'insert';
        ACMS.Dispatch.showModuleDialog(edit, mid, event.data.modal, callback);
    };

    //------
    // hide
    var closeFn = function ($modalBox, $backdrop) {
        var getMid = isFinite($('.getMid').val()) ? $('.getMid').val() : mid;
        var query = {mid: getMid};

        // 再読み込み
        if ($indexTpl) {
            $.ajax({
                type: 'GET',
                url: ACMS.Library.acmsLink({
                    tpl: 'ajax/module/index.html',
                    Query: query
                }, true),
                dataType: 'html',
                success: function (res) {
                    var $table = $indexTpl.find('.js-module_index_table'),
                        $res = $(res).find('.js-module_index_table');

                    $table.html($res.html());
                    ACMS.Dispatch($indexTpl);

                    $('.js-layout_select_module_id').bind('click', selectModule);
                    $('.js-acms_layout_edit_module, .js-acms_layout_create_module').unbind('click').bind('click', {modal: $indexTpl}, editModule);
                }
            });
        }

        $('body').css('overflow', '');

        window.location.hash = '';
        $backdrop.fadeOut(150, function () {
            $backdrop.remove();
        });
        $modalBox.removeClass('in').addClass('out');
        setTimeout(function () {
            $modalBox.remove();
        }, 500);
        return false;
    };
};

//------------
// updatedate
ACMS.Dispatch.updatedate = function (elm) {
    $(elm).click(function () {
        $('#' + $(elm).attr('rel')).val(date());
        return false;
    });

    function date() {
        var D = new Date();
        var Y = D.getFullYear().toString();
        var m = (D.getMonth() + 1).toString();
        var d = D.getDate().toString();

        if (1 >= m.length) m = '0' + m;
        if (1 >= d.length) d = '0' + d;

        return Y + '-' + m + '-' + d;
    }
};

//------------
// updatetime
ACMS.Dispatch.updatetime = function (elm) {
    $(elm).click(function () {
        $('#' + $(elm).attr('rel')).val(time());
        return false;
    });

    function time() {
        var d = new Date();
        var h = d.getHours().toString();
        var m = d.getMinutes().toString();
        var s = d.getSeconds().toString();

        if (1 >= h.length) h = '0' + h;
        if (1 >= m.length) m = '0' + m;
        if (1 >= s.length) s = '0' + s;

        return h + ':' + m + ':' + s;
    }
};

//----------
// rollover
ACMS.Dispatch.rollover = function (elm) {
    $(elm).each(function () {
        var s = elm.src;
        var i = s.lastIndexOf('.');
        if (0 > i) i = s.length;
        var o = s.substring(0, i) + ACMS.Config.rolloverImgSuffix + s.substring(i);

        (new Image()).src = o;

        elm.s = s;
        elm.o = o;

        $(elm).hover(function () {
            this.src = this.o;
        }, function () {
            this.src = this.s;
        });
    });
};

//----------------
// static2dynamic
ACMS.Dispatch.static2dynamic = function (elm) {
    function s2dMap() {
        var region = '';
        if (ACMS.Config.s2dRegion) {
            region = '&region=' + ACMS.Config.s2dRegion;
        }

        ACMS.Library.googleLoadProxy('maps', '3', {
            'callback': function () {
                ACMS.Dispatch._static2dynamic(elm);
            }
        });
    }

    $(elm).click(function () {
        s2dMap();
    });

    window.setTimeout(function () {
        if (elm.getAttribute('width') > ACMS.Config.s2dMaxSize) {
            s2dMap();
        }
    }, 300);
};

//---------------------
// static2dynamic yolp
ACMS.Dispatch.static2dynamic_yolp = function (elm) {
    $(elm).click(function () {
        ACMS.Library.yahooLoadProxy({
            'callback': function () {
                ACMS.Dispatch._static2dynamic_yolp(elm);
            }
        });
    });
};

//-----------
// validator
ACMS.Dispatch.validator = function (elm) {
    ACMS.Library.Validator.isFunction(false);
    ACMS.Dispatch._validate(elm);

    $(elm).submit(function ( event ) {
        if ( !ACMS.Dispatch._validate.all(elm) ) {
            ACMS.Dispatch.Utility.unloadAlert(window.document, ACMS.Config.unloadAlertMark, true);
            event.preventDefault();
        }
    });
};

//-------------
// select2text
ACMS.Dispatch.select2text = function (elm) {
    var self = elm;
    var aryValue = [];

    $elm = $(':selected', self);
    if (!$elm.size()) {
        $elm = $('option:first-child', self);
    }
    $elm.each(function () {
        aryValue.push($(this).text());
    });

    $(self).replaceWith(aryValue.join(','));
};

//-------
// zebra
ACMS.Dispatch.zebra = function (elm) {
    var tag = elm.tagName.toLowerCase();
    switch (tag) {
        case 'table':
            $('tr:nth-child(odd)', elm).addClass(ACMS.Config.zebraOddClass);
            $('tr:nth-child(even)', elm).addClass(ACMS.Config.zebraEvenClass);
            break;
        case 'ul'   :
        case 'ol'   :
            $('li:nth-child(odd)', elm).addClass(ACMS.Config.zebraOddClass);
            $('li:nth-child(even)', elm).addClass(ACMS.Config.zebraEvenClass);
            break;
        case 'dl'   :
            $('dt:nth-child(odd)', elm).addClass(ACMS.Config.zebraOddClass);
            $('dt:nth-child(even)', elm).addClass(ACMS.Config.zebraEvenClass);
            $('dd:nth-child(odd)', elm).addClass(ACMS.Config.zebraOddClass);
            $('dd:nth-child(even)', elm).addClass(ACMS.Config.zebraEvenClass);
            break;
    }
};

//-------------
// placeholder
ACMS.Dispatch.placeholder = function (elm) {
    var $self = $(elm);
    $.data(elm, 'placeholder-string', $self.attr('title'));
    $.data(elm, 'placeholder-color', $self.css('color'));

    switch ($self.val()) {
        case '' :
            $self.val($.data(elm, 'placeholder-string'));
        case $.data(elm, 'placeholder-string') :
            $self.css('color', ACMS.Config.placeholderColor);
            break;
    }

    $self.focus(function () {
        if ($(this).val() == $.data(this, 'placeholder-string')) {
            $(this).val('');
            $(this).css('color', $.data(this, 'placeholder-color'));
        }
    });
    $self.blur(function () {
        if ($(this).val() == '') {
            $(this).val($.data(this, 'placeholder-string'));
            $(this).css('color', ACMS.Config.placeholderColor);
        }
    });
    $self.parents().filter('form').submit(function () {
        if ($self.val() == $.data(elm, 'placeholder-string')) {
            $self.val('');
        }
        return true;
    });
};

//--------------------
// incremental search
ACMS.Dispatch.incrementalSearch = function (elm) {
    var $input = $(ACMS.Config.incrementalSearchBoxMark);
    var $item = $(ACMS.Config.incrementalSearchElementMark, elm);
    var placeholder = $input.attr('placeholder');

    $input.keyup(function () {
        var search = this.value.split(' ');
        if ( 0
            || ( search.length === 1 && search[0] === placeholder )
            || ( search.length === 2 && search[0]+' '+search[1] === placeholder )
        ) {
            return false;
        }
        for (var i = 0; i < $item.length; i++) {
            var itemName = $($item[i]).text();
            if (itemName.match(new RegExp(search[0], 'i'))) {
                $($item[i]).show();
                if (search.length > 1) {
                    for (var j = 1; j < search.length; j++) {
                        if (!itemName.match(new RegExp(search[j], 'i'))) {
                            $($item[i]).hide();
                        }
                    }
                }
            } else {
                $($item[i]).hide();
            }
        }
        return false;
    });
    if ($input.val().length) {
        $input.keyup();
    }
};

//-------------------------
// crossBrowserPlaceholder
ACMS.Dispatch.crossBrowserPlaceholder = function (elm) {
    var $self = $(elm),
        placeholderText = $self.attr('placeholder'),
        placeholderColor = '#999',
        defaultColor = $self.css('color');

    $self.focus(function () {
            if ($self.val() === placeholderText) {
                $self.val('').css('color', defaultColor);
            }
        })
        .blur(function () {
            if ($self.attr('type') !== 'password' && $self.val().replace(/[\s\t\n\r]/g, '') === '') {
                $self.val(placeholderText).css('color', placeholderColor);
            } else if ($self.val() === placeholderText) {
                $self.css('color', placeholderColor);
            }
        })
        .blur()
        .parents('form')
        .submit(function () {
            if ($self.val() === placeholderText) {
                $self.val('');
            }
        });
};

//-------
// hover
ACMS.Dispatch.hover = function (elm) {
    (function (className) {
        $(elm).hover(function () {
            $(this).addClass(className);
        }, function () {
            $(this).removeClass(className);
        });

    })(ACMS.Config.hoverClass);
};

//-----------
// selection
ACMS.Dispatch.selection = function (elm) {
    $(elm).click(function () {
        $(this).select();
        return false;
    });
};

//----------
// count up
ACMS.Dispatch.countup = function (elm) {
    $(elm).bind('keydown change', function () {
        var $self = $(this),
            length = $self.val().length,
            max = $self.data('max'),
            target = $self.data('label-target');
        $target = $(target),
            active = ACMS.Config.countupMarkOver;

        $target.html(length);

        if (length > max) {
            $target.addClass(active);
            $self.addClass(active);
        } else {
            $target.removeClass(active);
            $self.removeClass(active);
        }
    }).trigger('change');
};

//--------------------
// fieldgroupSortable
ACMS.addListener('acmsAddUnit', function(event){
  $(ACMS.Config.fieldgroupSortableMark, event.obj.item).each(function () {
    ACMS.Dispatch.fieldgroupSortable(this);
  });
});
ACMS.addListener('acmsAddCustomFieldGroup', function(event){
  $(event.obj.item).find(':radio[checked]').prop('checked', true);
});

ACMS.Dispatch.fieldgroupSortable = function (elm) {
    var Config = ACMS.Config;
    var $sortable = $(elm);
    var $insert = $sortable.find(Config.fieldgroupSortableItemInsertMark);
    var $anchor = $sortable.find(Config.fieldgroupSortableItemTemplateMark);
    var $maxSize = $sortable.find(Config.fieldgroupSortableItemMaxMark).val();
    if ($sortable.hasClass('editing')) {
        return;
    }

    $sortable.addClass('editing');

    if ($insert.size() && $anchor.size()) {
        var $template = $anchor.clone();
        $anchor.find(':input').attr('disabled', 'disabled');
        $anchor.hide();
        number($sortable);
        $insert.click(function () {
            if ($maxSize == parseInt($maxSize)) {
                var count = $sortable.find(Config.fieldgroupSortableItemMark).size();
                if (count > $maxSize) {
                    alert(Config.fieldgroupSortableItemOverflowMessage1 + $maxSize + Config.fieldgroupSortableItemOverflowMessage2);
                    return false;
                }
            }
            var $clone = $template.clone();

            var $map = $('.js-map-editable', $clone);
            if ($map.size()) {
                var region = '';
                if (ACMS.Config.s2dRegion) {
                    region = '&region=' + ACMS.Config.s2dRegion;
                }

                ACMS.Library.googleLoadProxy('maps', '3', {
                    'callback': function () {
                        $map.each(function () {
                            ACMS.Dispatch.Edit.map(this);
                        });
                    }
                });
            }

            var $yolp = $('.js-yolp-editable', $clone);
            if ($yolp.size()) {
                ACMS.Library.yahooLoadProxy({
                    'callback': function () {
                        $map.each(function () {
                            ACMS.Dispatch.Edit.yolp(this);
                        });
                    }
                });
            }

            var $addFormUnitTypeLabel = $('#formUnitType option:selected').text();
            var $addFormUnitTypeValue = $('#formUnitType option:selected').val();

            if ($addFormUnitTypeValue && $addFormUnitTypeLabel && $clone.find('.form-label')) {
                $clone.find('.form-label').text($addFormUnitTypeLabel);
                $clone.find('input[name*="formbuild_type"]').val($addFormUnitTypeValue);
                switch ($addFormUnitTypeValue) {
                    case 'text':
                    case 'textarea':
                        $clone.find('.select-value-box').hide();
                        break;
                    case 'radio':
                    case 'select':
                    case 'multiSelect':
                    case 'checkbox':
                        $block.find('.textTypeOnly').hide();
                        break;
                    default:
                        $clone.find('.inputFormBody').hide();
                        break;
                }
            }

            $clone.removeClass(Config.fieldgroupSortableItemTemplateMark.substr(1));
            $clone.show();
            $clone.find(Config.fieldgroupSortableItemDeleteMark).click(function () {
                var msg = Config.fieldgroupSortableItemDeleteMessage;
                if (!msg.length || confirm(msg)) {
                    detouch($sortable);
                    $(this).parents(Config.fieldgroupSortableItemMark).remove();
                    number($sortable);
                    touch($sortable);
                }
                return false;
            });
            $anchor.before($clone);
            number($sortable);
            $clone.find(Config.fieldgroupSortableItemHandleMark).css('cursor', 'pointer');
            $datepicker = $clone.find(Config.dpicMark);
            if ( $datepicker ) {
                $datepicker.removeClass('hasDatepicker');
                $datepicker.attr('id','');
            }
            ACMS.Dispatch($clone);
            ACMS.dispatchEvent("acmsAddCustomFieldGroup", {
                item: $clone.get(0)
            }, elm);

            return false;
        });

        var n = 0;
        $sortable.find(Config.fieldgroupSortableItemMark).each(function () {
            if ('none' == $(this).css('display')) {
                return true;
            }
            n++;

            ACMS.dispatchEvent("acmsAddCustomFieldGroup", {
                item: this
            }, elm);
        });
        if (!n) {
            for (var i = 0; i < 1; i++) {
                var $clone = $template.clone();
                $datepicker = $clone.find(Config.dpicMark);
                if ( $datepicker ) {
                    $datepicker.removeClass('hasDatepicker');
                    $datepicker.attr('id','');
                }
                $clone.removeClass(Config.fieldgroupSortableItemTemplateMark.substr(1));
                $(':input[name$="]"]', $clone).each(function () {
                    this.name = this.name.replace(/\[\d*\]/, '[0]');
                });
                ACMS.Dispatch($clone);
                $anchor.before($clone);
            }
        }

        $sortable.find(Config.fieldgroupSortableItemDeleteMark).click(function () {
            var msg = Config.fieldgroupSortableItemDeleteMessage;
            if (!msg.length || confirm(msg)) {
                detouch($sortable);
                $(this).parents(Config.fieldgroupSortableItemMark).remove();
                number($sortable);
                touch($sortable);
            }
            return false;
        });
    }

    $sortable.find(Config.fieldgroupSortableItemHandleMark).css('cursor', 'pointer');

    $sortable.sortable({
        items: Config.fieldgroupSortableItemMark,
        handle: Config.fieldgroupSortableItemHandleMark,
        axis: 'y',
        start: function (event, ui) {
            detouch($sortable);
        },
        stop: function (event, ui) {
            number($sortable);
            touch($sortable);

            ACMS.Dispatch($sortable);
        }
    });

    function touch(context) {
        //----------
        // emoditor
        $.each(Config.emoArray.concat({
            'mark': Config.emoMark,
            'toolbar': Config.emoToolbar,
            'config': Config.emoConfig
        }), function () {
            Config.emoToolbar = this.toolbar;
            Config.emoConfig = this.config;
            $(this.mark, context).each(function () {
                ACMS.Dispatch.emoditor(this);
            });
        });
    }

    function detouch(context) {
        $('textarea', context).each(function () {
            var editor = $(this).data('emoditor');
            if (editor) {
                editor.destroy();
            }
            $(this).removeData('emoditor');
        });

        return context;
    }

    function number($sortable) {
        var $rows = $sortable.find(Config.fieldgroupSortableItemMark).not(Config.fieldgroupSortableItemTemplateMark);

        // type=radioの瞬間的な名前衝突を避けるために、
        // {行番号}-name に一時的にリネームしてから [] 内の番号を割り当てる
        var n = 0;
        $rows.each(function () {
            $(':input[name$="]"]', this).each(function () {
                this.name = n + '-' + this.name;
                if (this.id && !(/\[\d*\]/).exec(this.id)) {
                    this.id += '[]';
                }
            });
            $('label', this).each(function () {
                var labelFor = $(this).attr('for');
                if (labelFor && !(/\[\d*\]/).exec(labelFor)) {
                    $(this).attr('for', labelFor + '[]');
                }
            });
            n++;
        });

        n = 0;
        $rows.each(function ( ) {
            $(':input[name$="]"]', this).each(function () {
                this.name   = this.name.replace(/\[\d*\]/, '[' + n + ']');
                if (this.id) {
                    this.id = this.id.replace(/\[\d*\]/, '[' + n + ']');
                    if ($(this).data('datepicker')) {
                        $(this).datepicker('destroy');
                        ACMS.Dispatch.datepicker(this);
                    }
                }
            });
            $('label', this).each(function () {
                var attrFor = $(this).attr('for');
                if (attrFor) {
                    $(this).attr('for', attrFor.replace(/\[\d*\]/, '[' + n + ']'));
                }
            });
            n++;
        });

        n = 0;
        $rows.each(function () {
            var regex = new RegExp('^' + n + '-');
            $(':input[name$="]"]', this).each(function () {
                this.name = this.name.replace(regex, '');
            });
            n++;
        });
    }
};

//----------------
// acms admin tabs
ACMS.Dispatch.acmsAdminTabs = function (elm) {
    var $self = $(elm),
        $tabs = $(),
        $panels = $(),
        $expr = $('a[href^=\'#\']', elm);

    if ($self.hasClass('js-acms_admin_tabs_already')) {
        return false;
    }
    $self.addClass('js-acms_admin_tabs_already');

    $('a', elm).each(function () {
        var href = $(this).attr("href");
        href = href.replace(/https:.*\//, "");
        $(this).attr("href", href);
    });

    function buildTab(panel) {
        var $panel = $(panel);
        var hash = panel.replace(/^#/, '');

        $panels.hide();
        $panel.show();
        $('#js-tooltip').remove();

        if (location.hash != panel && !_.contains(['entry-edit', 'entry_editor'], ACMS.Config.admin)) {
            $panel.attr('id', '');
            location.hash = panel;
            $panel.attr('id', hash);
        }

        $panel.find('textarea[name^="text_text_"]').trigger('focus');
        $('textarea[name^="text_text_"]').trigger('keyup');

        return false;
    }

    $expr.each(function () {
        var panel = $(this).attr('href');
        $tabs = $tabs.add(this);
        $panels = $panels.add($(panel));
        $(this).addClass('js-acms_tab');

        $(this).click(function () {
            $tabs.removeClass('js-acms_tab-active');
            $(this).addClass('js-acms_tab-active');

            buildTab(panel);
            return false;
        });
    });
    $panels.hide();

    var panel = $expr.filter(':first').addClass('js-acms_tab-active').attr('href');

    if ( !location.hash || (!!location.hash && $(location.hash).length === 0) ) {
        $(panel).show();
        $expr.filter('a[href=\'js-ready-acms_tabs\']').click();
        $expr.filter('.js-ready-acms_tabs').click();
    } else {
        buildTab(location.hash);
        $tabs.removeClass('js-acms_tab-active');
        $expr.filter('a[href=\'' + location.hash + '\']').addClass('js-acms_tab-active').show();
        $(window).scrollTop(0);
    }
};
//----------------
// acms offcanvas
ACMS.Dispatch.offcanvas = function (context) {
    var opt = ACMS.Config.offcanvas;
    var $this = $(opt.offcanvasMark, context);
    var $body = $('body');
    var winPos = {x: window.scrollX, y: window.scrollY};
    var focusableElements = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]';
    if ($this.hasClass('js-acms-offcanvas-sidebar')) {
        return;
    }
    $this.addClass('js-acms-offcanvas-sidebar');
    $this.wrap('<div class="js-acms-offcanvas" />');
    var $parent = $this.parent('.js-acms-offcanvas');
    $parent.attr('aria-hidden', 'true')
    $body.addClass('js-acms-offcanvas-body');
    if (opt.openBtnMark) {
        $(opt.openBtnMark)
            .addClass('js-acms-offcanvas-btn')
            .attr('aria-expanded', false)
            .attr('aria-label', 'Menu')
            .attr('aria-controls', $this.attr('id'))
    }
    if (opt.fixedHeaderMark) {
        $(opt.fixedHeaderMark).addClass('js-acms-header-fixed');
    }
    $(window).resize(_.throttle(function () {
        if ($('.js-acms-offcanvas').hasClass('js-acms-offcanvas-open')) {
            return;
        }
        if (opt.breakpoint == 'all' || opt.breakpoint >= window.innerWidth) {
            $('.js-acms-offcanvas').addClass('js-acms-offcanvas-active');
            $('.js-acms-offcanvas').attr('aria-hidden', true);
        } else {
            $('.js-acms-offcanvas').removeClass('js-acms-offcanvas-active');
            $('.js-acms-offcanvas').attr('aria-hidden', false);
        }
    }, opt.throttleTime)).resize();
    $('.js-acms-offcanvas-btn').click(function (e) {
        var $this = $(this);
        var id = $(this).attr('href') || $(this).data('target');
        var $nav = $('.js-acms-offcanvas-sidebar' + id);
        var $target = $nav.parent('.js-acms-offcanvas');
        var $first = $target.find(focusableElements).first();
        var $last = $target.find(focusableElements).last();
        $this.attr('aria-expanded',true);
        $first.off('keydown.acms-offcanvas').on('keydown.acms-offcanvas', function(e) {
            if ((e.which === 9 && e.shiftKey)) {
                e.preventDefault();
                $last.focus();
            }
        });
        $last.off('keydown.acms-offcanvas').on('keydown.acms-offcanvas', function(e) {
            if ((e.which === 9 && !e.shiftKey)) {
                e.preventDefault();
                $first.focus();
            }
        });
        $last.off('click.acms-offcanvas').on('click.acms-offcanvas', function() {
            $target.click();
            $this.focus();
        });
        if ($this.is(opt.openBtnRMark)) {
            $nav.addClass('js-acms-offcanvas-sidebar-right');
        } else if ($this.is(opt.openBtnLMark)) {
            $nav.addClass('js-acms-offcanvas-sidebar-left');
        }
        winPos.x = window.scrollX;
        winPos.y = window.scrollY;
        var $body = $('body').css({'width': window.innerWidth, 'height': $(window).height()});
        $target
            .addClass('js-acms-offcanvas-open')
            .attr('aria-hidden', false);
        setTimeout(function () {
            $('html').css('marginTop', -1 * window.scrollY);
            if ($nav.hasClass('js-acms-offcanvas-sidebar-right')) {
                $body.addClass('js-acms-offcanvas-body-right');
            } else {
                $body.addClass('js-acms-offcanvas-body-left');
            }
            $nav.addClass('active');
            $first.focus();
        }, 1);
        e.preventDefault();
    });
    var closeOffcanvas = function () {
        $('.js-acms-offcanvas-body').addClass('js-acms-offcanvas-body-moving');
        $('.js-acms-offcanvas-body').removeClass('js-acms-offcanvas-body-right');
        $('.js-acms-offcanvas-body').removeClass('js-acms-offcanvas-body-left');
        $('.js-acms-offcanvas-sidebar').removeClass('active');
        setTimeout(function () {
            $('.js-acms-offcanvas')
                .removeClass('js-acms-offcanvas-open')
                .attr('aria-hidden', true);
            $('.js-acms-offcanvas-body')
                .removeClass('js-acms-offcanvas-body-moving');
            $('.js-acms-offcanvas-btn').attr('aria-expanded',false);
            $('html').css('marginTop', '');
            $('body').css({width: '', height: ''});
            window.scrollTo(winPos.x, winPos.y);
        }, 300);
    }
    $(opt.closeBtnMark).bind('click touchstart', function (e) {
        closeOffcanvas();
    });
    $('.js-acms-offcanvas').bind('click touchstart', function (e) {
        if ($(e.target).hasClass('js-acms-offcanvas')) {
            e.preventDefault();
            closeOffcanvas();
        }
    });
};

ACMS.Dispatch.fieldAtable = function (context) {
    ACMS.Library.aTableEdit(context);
};

ACMS.Dispatch.imageUnitAjaxUpload = function()
{
    if ( !window.FormData ) {
        return;
    }
    var $ajaxUploadImage = $('.js-ajax_upload_image');

    $ajaxUploadImage.unbind('submit.ajax_upload_image');
    $ajaxUploadImage.bind('submit.ajax_upload_image', function (e) {
        e.preventDefault();

        var $form = $(this);
        var $data = $form.clone(false);
        var formData;

        // セレクトボックスの入力値の登録(cloneのbug対応)
        $form.find("select").each(function(i) {
            $data.find('select').eq(i).val($(this).val());
        });

        $data.find('[name^=ACMS_POST_]').remove();
        $data.find('.js-ajax_upload_image_unit :input').each(function(){
            var $input = $(this);
            if ( $input.hasClass('js-img_resize_data') ) {
                $input.remove();
            }
            if ($input.attr('type') === 'file') {
                $input.remove();
            }
        });

        formData = new FormData($data.get(0));
        formData.append('ACMS_POST_Image_AjaxUpload', true);

        // base64画像をblobに変換してFormDataに追加
        $form.find('.js-ajax_upload_image_box').each(function () {
            var type = $(this).find("[name=type\\[\\]]").val();
            if ( /^image/.test(type) ) {
                var $resizeData = $(this).find('.js-img_resize_data');
                if ( $resizeData.size() < 1 ) {
                    return;
                }
                $resizeData.each(function() {
                    var $base64Image = $(this);
                    var dataUrl = $base64Image.val();
                    var name = $base64Image.attr('name');
                    var blob = ACMS.Dispatch.Utility.dataUrlToBlob(dataUrl);
                    if ( blob ) {
                        formData.append(name, blob);
                    }
                });
            }
        });

        $.ajax({
            async: true,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            dataType: 'text'
        }).done(function (data) {
            var json = JSON.parse(data);
            if (!(json && json instanceof Array)) {
                return;
            }
            if ( json.length < 1 ) {
                return;
            }

            $.each(json, function(i, item) {
                var id = item.id;
                var path = item.path;
                var search = '[value=' + id + ']';

                if ( !/^image/.test(item.type) ) {
                    return; // 画像以外は処理しない
                }

                if ( $form.find(search).length > 0 ) {
                    // id がある場合はパスで置き換え
                    var $unit = $form.find(search).closest('.js-ajax_upload_image_box');
                    $unit.find('[name^=image_old_]').val(path);
                } else {
                    // id がない場合は全てのフィールドを挿入
                    $form.append($('<input/>', {type: 'hidden', name: 'id[]', value: id}));
                    $form.append($('<input/>', {type: 'hidden', name: 'type[]', value: item.type}));
                    $form.append($('<input/>', {type: 'hidden', name: 'clid[]', value: item.clid}));
                    $form.append($('<input/>', {type: 'hidden', name: 'sort[]', value: item.sort}));
                    $form.append($('<input/>', {type: 'hidden', name: 'align[]', value: item.align}));
                    $form.append($('<input/>', {type: 'hidden', name: 'group[]', value: item.group}));
                    $form.append($('<input/>', {type: 'hidden', name: 'attr[]', value: item.attr}));

                    $form.append($('<input/>', {type: 'hidden', name: 'image_old_' + id, value: path}));
                    $form.append($('<input/>', {type: 'hidden', name: 'image_link_' + id, value: item.link}));
                    $form.append($('<input/>', {type: 'hidden', name: 'image_size_' + id, value: item.size}));
                    $form.append($('<input/>', {type: 'hidden', name: 'image_edit_' + id, value: item.edit}));
                    $form.append($('<input/>', {type: 'hidden', name: 'image_caption_' + id, value: item.caption}));
                    $form.append($('<input/>', {type: 'hidden', name: 'image_alt_' + id, value: item.alt}));
                }
            });

            // base64データは削除
            $form.find('.js-ajax_upload_image_box').each(function () {
                var type = $(this).find("[name=type\\[\\]]").val();
                if ( /^image/.test(type) ) {
                    $(this).find('.js-img_resize_data').remove();
                }
            });
        }).fail(function(jqXHR, textStatus, errorThrown){
            console.log(jqXHR.status);
            console.log(textStatus);
            console.log(errorThrown);
        }).always(function() {
            $form.unbind('submit.ajax_upload_image');
            $form.find('[type="submit"][name^="ACMS_POST_Entry"]').click();
        });
    });
};
