'use strict';

/**
 * Created by Administrator on 2017/7/31.
 */

(function (global) {
    var tool = {
        init: function init(elem, option, funName) {
            for (var key in option) {
                var target = elem[funName];
                if (typeof target === 'function') {
                    var param = [key, option[key]];
                    for (var i = 0, l = target.length - 2; i < l; i++) {
                        param.unshift(null);
                    }
                    target.apply(elem, param);
                } else {
                    target[key] = option[key];
                }
            }
        },
        attr: function attr(elem, option) {
            this.init(elem, option, 'setAttribute');
        },
        attrNS: function attrNS(elem, option) {
            this.init(elem, option, 'setAttributeNS');
        },
        css: function css(elem, option) {
            this.init(elem, option, 'style');
        }
    };

    // svg生成函数
    function ProgressCreate(options) {
        var defaults = {
            type: 'circle',
            percent: 0
        };
        options = options || {};
        for (var key in defaults) {
            if (typeof options[key] == 'undefined') {
                options[key] = defaults[key];
            }
        }
        var percent = options.percent > 100 ? 100 : options.percent;
        var type = options.type;
        var svgns = "http://www.w3.org/2000/svg";

        var viewBox = 100; // 可视区
        var center = viewBox / 2; // 中心位置（圆心位置）
        var strokeWidth = 6; // 线宽
        var Rr = center - strokeWidth / 2; // 圆真实的半径
        var c = (2 * Math.PI * Rr).toFixed(2); // 圆周长

        // svg容器
        var svgBox = document.createElement('div');
        tool.attr(svgBox, { class: 'progress-inner' });
        tool.css(svgBox, { width: '132px', height: '132px', 'font-size': '20px' });

        // svg
        var svg = document.createElementNS(svgns, 'svg');
        tool.attrNS(svg, { viewBox: '0 0 ' + viewBox + ' ' + viewBox });

        // baseAttr & baseStyle
        var startY = -Rr,
            circleStartY = 2 * Rr,
            circleEndY = -2 * Rr,
            dasharray = c + 'px 1000px',
            dashoffset = 0,
            fullPercent = c;
        if (type === 'dashboard') {
            startY = Rr, circleStartY = -2 * Rr, circleEndY = 2 * Rr, dasharray = c / 4 * 3 + 'px 1000px', dashoffset = '-' + c / 4 / 2 + 'px', fullPercent = c / 4 * 3;
        }
        var basePathAttr = { d: 'M ' + center + ',' + center + ' m 0,' + startY + ' a ' + Rr + ',' + Rr + ' 0 1 1 0,' + circleStartY + ' a ' + Rr + ',' + Rr + ' 0 1 1 0,' + circleEndY, 'stroke-width': strokeWidth, 'fill-opacity': '0', 'stroke-linecap': "round" };
        var baseStyle = { 'stroke-dasharray': dasharray, 'stroke-dashoffset': dashoffset, transition: 'stroke-dashoffset 0.3s ease 0s, stroke-dasharray 0.3s ease 0s, stroke 0.3s' };

        // pathTrail
        var pathTrail = document.createElementNS(svgns, 'path');
        tool.attr(pathTrail, { class: 'progress-circle-trail' });
        tool.attrNS(pathTrail, basePathAttr);
        tool.css(pathTrail, baseStyle);

        // pathCircle
        var pathCircle = document.createElementNS(svgns, 'path');
        if (percent > 0) {
            baseStyle['stroke-dasharray'] = percent / 100 * fullPercent + 'px 1000px'; // 计算百分比所占的长度
            tool.attr(pathCircle, { class: 'progress-circle-path' });
            tool.attrNS(pathCircle, basePathAttr);
            tool.css(pathCircle, baseStyle);
        }

        // percentText
        var percentText = document.createElement('span');
        tool.attr(percentText, { class: 'progress-text' });
        percentText.innerHTML = options.percentText || percent + '%';

        // render
        svg.appendChild(pathTrail);
        svg.appendChild(pathCircle);
        svgBox.append(svg);
        svgBox.append(percentText);

        return svgBox;
    }

    // 对外暴露函数
    var Progress = {};
    Progress.circle = function (percent, percentText) {
        return ProgressCreate({ type: 'circle', percent: percent, percentText: percentText });
    };
    Progress.dashboard = function (percent, percentText) {
        return ProgressCreate({ type: 'dashboard', percent: percent, percentText: percentText });
    };
    global.Progress = Progress;
})(window);