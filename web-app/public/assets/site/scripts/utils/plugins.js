(function() {
    'use strict';
    $.fn.bzAccordion = function(autoCollapse, expandFirstItem) {
        var $accord = this.find('.item');
        if (expandFirstItem) {
            $accord.first().find('.question').addClass('expanded');
            $accord.first().find('.answer').show();
        }
        $accord.find('.question').click(function() {
            if ($(this).hasClass('expanded')) {
                $(this).removeClass('expanded');
                $(this).parent().find('.answer').slideUp(200);
            } else {
                if (autoCollapse) {
                    $.each($accord.find('.question'), function(i, o) {
                        $(o).removeClass('expanded');
                        $(o).parent().find('.answer').slideUp(200);
                    });
                }
                $(this).addClass('expanded');
                $(this).parent().find('.answer').slideDown(200);
            }
        });
    };
})();