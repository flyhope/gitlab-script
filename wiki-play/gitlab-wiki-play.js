// ==UserScript==
// @name              Gitlab Wiki Player
// @name:zh-cn        Gitlab WIKI 播放器
// @namespace         http://chengxuan.li
// @version           12.9.0
// @description       Play Gitlab wiki like PPT!
// @description:zh-cn 像PPT一样播放Gitlab WIKI
// @author            Leelmes <i@chengxuan.li>
// @match             http*://*/*/wikis/*
// @match             http*://*/*/merge_requests/*
// @match             http*://*/*/snippets/*
// @contributionURL   https://www.paypal.me/flyhope
// @grant             none
// @supportURL        https://github.com/flyhope/gitlab-script/issues
// @license           GNU General Public License v3.0 or later
// ==/UserScript==
(function() {
    'use strict';

    // WIKI每页数据
    let wikis = [];

    // WIKI DOM对象
    let $wiki = $(".md[data-qa-selector=wiki_page_content]")

    // 当前看的是第几页（从0开始计算）
    let current = -1;

    // 检测是否可以执行
    if (typeof jQuery !== "undefined" && $("header.navbar-gitlab").length) {
        main();
    }

    // 主入口
    function main() {
        // 插入播放按钮
        $(".nav-controls").prepend('<a id="wiki-ppt-play" class="btn" href="javascript:void(0)"><span class="fa fa-play"></span></a>');
        $(".issue-btn-group,.detail-page-header-actions > .hidden-xs").prepend('<a id="wiki-ppt-play" class="btn pull-left" href="javascript:void(0)"><span class="fa fa-play"></span></a>');

        // 绑定PPT按钮播放事件
        $("#wiki-ppt-play").click(function() {
            play();
        });

        // 绑定H1/H2标题播放按钮
        $wiki.on("click", "[data-node=wiki-ppt-play-page]", function() {
            $(this).remove();
            play($(this).data("index"));
        }).find("h1,h2").each(function(k, v) {
            let obj = $(v)
            obj.hover(function(){
                obj.append(' <a data-node="wiki-ppt-play-page" data-index="' + k + '" href="javascript:void(0)"><span class="fa fa-play"></span></a>');
            }, function() {
                obj.find("[data-node=wiki-ppt-play-page]").remove();
            })
        });
    }

    // 执行播放操作
    function play(show_index = 0) {
        // 删除WIKI除主体外全部元素
        $("#feedly-mini,aside,header,.nav-sidebar,.wiki-page-header,.alert-wrapper").remove();
        $(".content-wrapper").removeClass("content-wrapper");
        $(".layout-page").removeClass("page-with-contextual-sidebar right-sidebar-expanded").css("padding-left", 0);

        // 删除mergeRequest除主体外全部元素
        $(".alert-wrapper,.detail-page-header,.detail-page-description,.mr-state-widget,.content-block,.merge-request-tabs-holder,.mr-version-controls").remove();

        if ($wiki.length) {
            // 整理数据，并清空现有WIKI数据结构
            if (!wikis.length) {
                $wiki.children().each(function(k, v){
                    let index = wikis.length - 1;
                    let newIndex = false;
                    if (index < 0) {
                        index = 0;
                        newIndex = true;
                    }
                    if (v.tagName === "H2") {
                        if (typeof wikis[index] !== "undefined") {
                            index++;
                        }
                        newIndex = true;
                    }

                    if (newIndex) {
                        wikis[index] = [];
                    }

                    wikis[index].push(v)
                })
            }

            // 开始播放
            $wiki.empty();
            $("body").css("zoom", "2");
            show(show_index)
        }

        // 绑定按键
        $("body").keydown(function(e){
            switch (e.which) {
                case 37 :
                    prev();
                    break;
                case 39 :
                    next();
                    break;
            }
        });

    }

    // 下一页
    function next() {
        if (wikis.length >= current + 2) {
            show(current + 1);
        }
    }

    // 上一页
    function prev() {
        if (current > 0) {
            show(current - 1);
        }
    }

    // 展示内容
    function show(index) {
        current = index;
        $wiki.html("").hide().css({"padding-top":"30px"}).append(wikis[index]).fadeIn();
        $("body,html").scrollTop(0);
        $("h1,h2").css({
            "position":"fixed",
            "z-index":9999,
            "top":0,
            "left":0,
            "width":"100%",
            "padding":"6px 15px 8px 15px",
            "background-color":"black",
            "color":"white"
        });
    }

})()
