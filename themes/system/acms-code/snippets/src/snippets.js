window['jQuery'] && jQuery(function($) {
    $('textarea').focus(function() {
        $(this).select();
    }).focus();
});