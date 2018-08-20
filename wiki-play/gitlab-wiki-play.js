// ==UserScript==
// @name         Gitlab Wiki Player
// @namespace    http://chengxuan.li
// @version      0.1
// @description  Play Gitlab wiki like PPT!
// @author       Leelmes <i@chengxuan.li>
// @match        http*://*/*/wikis/*
// @grant        none
// ==/UserScript==
(function() {
    'use strict';

    // WIKI每页数据
    let wikis = [];

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

        // 绑定PPT按钮播放事件
        $("#wiki-ppt-play").click(play);
    }

    // 执行播放操作
    function play() {
        // 删除除主体外全部元素
        $("#feedly-mini,aside,header,.nav-sidebar,.wiki-page-header,.alert-wrapper").remove();
        $(".content-wrapper").removeClass("content-wrapper");
        $(".layout-page").removeClass("page-with-contextual-sidebar right-sidebar-expanded");

        // 整理数据，并清空现有WIKI数据结构
        if (!wikis.length) {
            $(".wiki").children().each(function(k, v){
                let index = wikis.length - 1;
                let newIndex = false;
                if (index < 0) {
                    index = 0;
                    newIndex = true;
                }
                if (v.tagName === "H2") {
                    index++;
                    newIndex = true;
                }

                if (newIndex) {
                    wikis[index] = [];
                }

                wikis[index].push(v)
            })
        }

        // 开始播放
        current = -1;
        $(".wiki").html("");
        next();
        $("body").css("zoom", "2.5")

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
            current++;
            show(current);
        }
    }

    // 上一页
    function prev() {
        if (current > 0) {
            current--;
            show(current);
        }
    }

    // 展示内容
    function show(index) {
        $(".wiki").html("").hide().append(wikis[index]).fadeIn();
        $("body,html").scrollTop(0);
    }

})()
