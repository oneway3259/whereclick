$(document).ready(function() {
	$('body').append("<div id='showclickarea'></div>");
    var clickarea = $('#showclickarea');  // 点击区域元素
    var href = window.location.href;  // 当前页面链接
    var element = $(document);  // 文档元素

    element.click(function(event) {
        href = window.location.href;  // 更新当前页面链接
        var x = event.pageX;  // 获取鼠标点击的横坐标
        var y = event.pageY;  // 获取鼠标点击的纵坐标
        var key = 'click_' + href;  // 定义存储点击数据的键
        var time = Date.parse(new Date()) / 1000;  // 获取当前时间戳

        var json = localStorage.getItem(key);  // 从本地存储获取点击数据
        if (!json) {
            json = '[]';
        }
        var isnew = false;  // 判断是否是新点击
        json = JSON.parse(json);  // 将字符串转换为JSON对象
        $(json).each(function(i) {
            if (json[i][0] == x && json[i][1] == y) {
                json[i][2] = time;  // 更新点击时间
                json[i][3] = json[i][3] + 1;  // 点击次数加1
                isnew = true;  // 更新为已存在点击
            }
        });
        if (!isnew) {
            json.push([x, y, time, 1]);  // 添加新点击数据
        }
        localStorage.setItem(key, JSON.stringify(json));  // 存储点击数据到本地存储
    });

    var showstatus = 2;  // 显示状态，默认为2
    setTimeout(function() {
        var showstatuskey = 'show_status_' + href;  // 显示状态键
        var showstatus = localStorage.getItem(showstatuskey);  // 从本地存储获取显示状态
        if (showstatus == 1) {
            showPoint();  // 调用显示点击点函数
			localStorage.setItem(showstatuskey, 2);
            showstatus = 2;  // 重置显示状态
        }
    }, 2000);

    element.dblclick(function(event) {
        var showstatuskey = 'show_status_' + href;  // 显示状态键
        if (showstatus == 1) {
            showPoint();  // 调用显示点击点函数
            showstatus = 2;  // 重置显示状态
            localStorage.setItem(showstatuskey, 1);  // 存储显示状态到本地存储
        } else {
            showstatus = 1;  // 显示状态设置为1
            localStorage.setItem(showstatuskey, 2);  // 存储显示状态到本地存储
            clickarea.empty();  // 清空点击点显示区域
        }
    });

    var max_width = 20;  // 最大宽度
    function showPoint() {
        href = window.location.href;  // 更新当前页面链接
        var key = 'click_' + href;  // 定义存储点击数据的键
        var json = localStorage.getItem(key);  // 从本地存储获取点击数据
        json = JSON.parse(json);  // 将字符串转换为JSON对象
        clickarea.empty();  // 清空点击点显示区域
        var max = 1;

        $(json).each(function(i) {
            if (json[i][3] > max) {
                max = json[i][3];
            }
        });
        if (max < 50) {
            max = 50;
        }
        $(json).each(function(i) {
            var w = max_width * (json[i][3] / max);  // 计算点击点的宽度
            var offset = Math.floor(w / 2);  // 计算偏移量

            clickarea.append("<i style='left:" + (json[i][0] - offset) + "px;top:" + (json[i][1] - offset) + "px;width:" + w + "px;height:" + w + "px'></i>");  // 添加点击点显示到区域
        });
    }
});
