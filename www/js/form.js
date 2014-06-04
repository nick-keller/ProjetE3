$(function(){

    $(document).click(function(e){
        $('.select').removeClass('active');
    });

    $('.select .option').click(function(){
        var $this = $(this);
        var $select = $this.closest('.select');

        $select.find('input').val($this.data('value')).change();
        $select.find('.val').text($this.text());
    });

    $('.select').click(function(e){
        var $this = $(this);

        $('.select').not($this).removeClass('active');
        $this.toggleClass('active');
        e.stopPropagation();
    })
    .each(function(){
        var $this = $(this);

        if($this.find('.val').text() == ""){
            var $opt = $this.find('.option').first();

            $this.find('input').val($opt.data('value'));
            $this.find('.val').text($opt.text());
        }

        if($this.data('width') == 'min'){
            var max = 0;
            var $val = $this.find('.val');
            var currentText = $val.text();

            $this.css('display', 'inline-block');

            $this.find('.option').each(function(){
                $val.text($(this).text());
                max = Math.max(max, $val.width());
            });

            $val.text(currentText);
            $this.css('width', max+'px');
        }
    });
});