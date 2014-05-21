$(function(){
    // Click event
    $('[data-tab-container] [data-target]').click(function(){
        var $this = $(this);
        var $container = $('[data-container-name="' + $this.parent().data('tab-container') + '"]');
        var $target = $container.children('[data-tab="' + $this.data('target') + '"]');

        $container.children('[data-tab]').removeClass('active');
        $this.parent().children('[data-target]').removeClass('active');

        $this.addClass('active');
        $target.addClass('active');
        handleTooMuchTabs();
    });

    // Set default tab
    $('[data-tab-container]').each(function(){
        var $this = $(this);

        if($this.children('.active[data-target]').length == 0)
            $this.children('[data-target]').first().click();
    });

    // Handdle too much tabs
    function handleTooMuchTabs(){
        $('.menu .tab-content .tabs').each(function(){
            var $this = $(this);

            if($this.height() > 16){
                var $btnMore = $('<li><i class="fa fa-ellipsis-h"></i></li>');
                var $menuMore = $('<div></div>');

                $btnMore.addClass('more-tabs');
                $menuMore.addClass('more-tabs-content');

                $this.append($btnMore);
                $btnMore.append($menuMore);

                var $lastTab = $this.find('[data-target]').last();

                var minimize = function(){
                    while($this.height() > 16){
                        var $item = $('<div>' + $lastTab.text() + '</div>');
                        $item.data('target', $lastTab.data('target'));
                        $menuMore.append($item);

                        $item.click(function(){
                            var $tab = $this.children('[data-target=' + $(this).data('target') + ']');
                            $(this).remove();

                            $tab.click();
                            $this.prepend($tab);
                            $tab.show();

                            minimize();
                        });

                        $lastTab.hide();
                        $lastTab = $lastTab.prev();
                    }
                };

                minimize();
            }
        })
    }

    handleTooMuchTabs();
});