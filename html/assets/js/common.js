// 페이지 로더
function loader(){
    html = `
        <div class="spinner">
            <div class="bounce1"></div>
            <div class="bounce2"></div>
            <div class="bounce3"></div>
        </div>
    `
    $("body").append(html);

    loaderHide();
}
function loaderHide(){
    setTimeout(function(){
        $(".spinner").fadeOut()
    },1000)
}

$(function() {
    // Init
    loader();

    // 변수
    var phone_mq = 768, // media querie
        $body = $('body'),
        menuBtn = '[data-toggle="aside"]', // 버튼 : 메뉴
        searchBtn = '[data-toggle="search"]' // 버튼 : 메뉴

    // GNB 토글
    $(document).on('click', menuBtn, function (e){
        e.preventDefault();
        var toggledClass = 'aside-toggled';

        if ($(window).width() < phone_mq && $body.hasClass(toggledClass)) return;

        // 모바일 토글
        if ($(window).width() < phone_mq){
            var dimmed = "<div class='gnb_dimmed'></div>"
            $body.append(dimmed);
            $(".gnb_dimmed").addClass("on");

            $(".sidebar .inner").animate({scrollTop: 0}, 0);

            $(document).on("click", ".btn_close, .gnb_dimmed", function(){
                $body.removeClass(toggledClass);
                $(".gnb_dimmed").fadeOut();
                $(".gnb_dimmed").detach();
            })
        }

        if(!$body.hasClass(toggledClass)){
            $body.addClass(toggledClass);
        }else{
            $body.removeClass(toggledClass);
        }
    })

    // 검색 클릭
    $(document).on("click", searchBtn, function(e){
        e.preventDefault();
        var target= "#"+$(this).data("toggle"),
            targetInput = $(target).find("input[type=text]");

        $(target).addClass("open");
        targetInput.focus();

        // SUBMIT
        $(".btn-submit").on("click",function(){
            // if(targetInput.val() != ""){
            //     // 폼 submit
            //     console.log(targetInput.val())
            // }else{
                $(target).removeClass("open");
            // }
        });

        // 외부클릭 검색바 닫기
        $("html").on('click', function(e){
            var $t = $(e.target);
            var $carea = $t.closest('.search_form, .dimmed'); // 클릭 영역
            if( !$carea.length ){
                $(target).removeClass("open");
            }
        });

        $(target).find(".dimmed").on("click", function(){
            $(target).removeClass("open")
        })
    })

    $(window).resize(function*(){
        console.log($(this).width());
    })
});
