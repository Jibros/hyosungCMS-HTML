$(function() {
    // Preloader
    var preloader = {
        show : function() {
            $('.spinner').fadeIn();
        },
        hide : function() {
            $('.spinner').fadeOut(100);
        }
    };

    preloader.show();

    // Load Contents
    var loadContents = (code) => {
        // Code To URL
        currentIndex = searchData.items.findIndex((element) => element.code === code);
        var contentsURL = searchData.items?.[currentIndex]?.url;

        // Validate
        if(!contentsURL) {
            return false;
        }

        // Side Menu
        const phone_mq = 768;
        if($(window).width() < phone_mq) {
            $('.btn_close').trigger('click');
        }

        // Navigation
        $('.count').html(`<span>${currentIndex + 1}</span><span>${totalCount}</span>`);

        // Reset Search History
        $('input[name=keyword]').val('');
        $('.tx_keyword').empty();
        $('.result_list').empty();
        $('#search_result').hide();

        // Initialize
        $('#contents').empty();
        if(contentsURL) {
            $('#contents').load(contentsURL, () => {
                preloader.hide();

                $('#contents').show();
            });
        }
    };

    // Load Search JSON
    var searchData, currentIndex, totalCount;
    $.getJSON('./search_data.json', (data) => {
        // Set Search Data
        searchData = data;

        // Set Total Count
        totalCount = searchData.items.length;

        // Load Navigation
        $('#aside').load('./contents-navigation.html');

        // URL Querystring
        // https://stackoverflow.com/a/47566165
        var URL = new URLSearchParams(location.search);

        // Load Contents
        loadContents((URL.get('c') ?? 'index'));

        // Search
        $('input[name=keyword]').on('keyup', (e) => {
            $('.tx_keyword').empty();
            $('.result_list').empty();

            if($(e.target).val()) {
                // https://stackoverflow.com/questions/54768297/search-json-data-and-display-in-html
                var keywordPattern = new RegExp($(e.target).val(), 'i');
                var result = searchData.items.filter(element => element.summary.match(keywordPattern) && $(e.target).val() != '')
                                        .map(element => `<li><a href="#" class="tx_tit" data-code="${element.code}" data-url="${element.url}">${element.title}</a><p class="tx_sub">${element.summary}</p></li>`);

                $.each(result, (index, item) => $('.result_list').append(item));

                $('.tx_keyword').html(`<em>${$(e.target).val()}</em>에 대한 검색 결과`);

                $('#search_result').show();
                $('#contents').hide();
            } else {
                $('#search_result').hide();
                $('#contents').show();
            }
        });
    });

    // Prev/Next buttons
    $('.btn-prev, .btn-next').on('click', (e) => {
        if($(e.target).hasClass('btn-prev')) {
            loadContents(searchData.items?.[(totalCount + currentIndex - 1) % totalCount]?.code);
        } else if($(e.target).hasClass('btn-next')) {
            loadContents(searchData.items?.[(currentIndex + 1) % totalCount]?.code);
        }

        return false;
    });

    // Navigation Click
    $(document).on('click', '.result_list a, .sidebar a, .link a, .m-cont a, .tip_box a', (e) => {
        if(typeof $(e.currentTarget).data('code') !== 'undefined') {
            if(!$(e.currentTarget).data('code')) {
                alert('준비중 입니다.');
            } else {
                loadContents($(e.currentTarget).data('code'));
            }

            return false;
        }
    });
});