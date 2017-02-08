//ajax不能跨越，jsonp可以跨越
function ajax(params){
	var params=params||{};
	params.data = params.data || {};
	var resJson = params.jsonp ? jsonp(params) : json(params);
	function json(opts){
		params.type = (params.type || 'GET').toUpperCase();
		params.data = formatParams(params.data);
		var xhr = null;
		// 实例化XMLHttpRequest对象
		if(window.XMLHttpRequest) {
			xhr = new XMLHttpRequest();
		} else {
			// IE
			xhr = new ActiveXObjcet('Microsoft.XMLHTTP');
		};
		// 监听事件
		xhr.onreadystatechange = function() {
			if(xhr.readyState == 4) {
				var status = xhr.status;
				if(status >= 200 && status < 300) {
					var response = '';
					var type = xhr.getResponseHeader('Content-type');
					if(type.indexOf('xml') !== -1 && xhr.responseXML) {
						response = xhr.responseXML; //Document对象响应
					} else if(type === 'application/json') {
						response = JSON.parse(xhr.responseText); //JSON响应
					} else {
						response = xhr.responseText; //字符串响应
					};
					params.success && params.success(response);
				} else {
					params.error && params.error(status);
				}
			}
		};
		// 连接和传输数据
		if(params.type == 'GET') {
			xhr.open(params.type, params.url + '?' + params.data, true);
			xhr.send(null);
		} else {
			xhr.open(params.type, params.url, true);
			//设置提交时的内容类型
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
			xhr.send(params.data);
		}

	}
	// jsonp请求
	function jsonp(params) {
		//创建script标签并加入到页面中
		var callbackName = params.jsonp;
		var time = params.time||2000;
		var head = document.getElementsByTagName('head')[0];
		// 设置传递给后台的回调参数名
		params.data['callback'] = callbackName;
		var data = formatParams(params.data);
		var script = document.createElement('script');
		head.appendChild(script);
		//创建jsonp回调函数
		window[callbackName] = function(json) {
			head.removeChild(script);
			clearTimeout(script.timer);
			window[callbackName] = null;
			params.success && params.success(json);
		};
		//发送请求
		script.src = params.url + '?' + data;

		//超时处理
		
		script.timer = setTimeout(function() {
			window[callbackName] = null;
			head.removeChild(script);
			params.error && params.error({
				message: '超时'
			});
		}, time);
		
	}

	//格式化参数
	function formatParams(data) {
		var arr = [];
		for(var name in data) {
			arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
		};
		// 添加一个随机数，防止缓存
		arr.push('v=' + random());
		return arr.join('&');
	}
	// 获取随机数
	function random() {
		return Math.floor(Math.random() * 10000 + 500);
	}
}
//测试
//html中的调用：
<script>
		ajax({
				url: 'get.php',
				type: 'GET',
				data: {'intro': 'get请求'},
				success:function(res){
					res = JSON.parse(res);
					document.getElementById('a').innerHTML = res.intro;
					console.log(res);
				}
			});
		ajax({
				url: 'post.php',
				type: 'POST',
				data: {'intro': 'post请求'},
				success:function(res){
					res = JSON.parse(res);
					document.getElementById('b').innerHTML = res.intro;
					console.log(res);
				}
			});
		ajax({
				url: 'jsonp.php',
				jsonp: 'jsonpCallback',
				data: {'intro': 'jsonp请求'},
				success:function(res){
					document.getElementById('c').innerHTML = res.intro;
					console.log(res);
				}
			});
	</script>
//get.php
<?php
	$data = isset($_GET['intro']) ? trim($_GET['intro']) : '';
	$data = array('intro' => $data);
	echo json_encode($data);
?>
//post.php
<?php
	$data = isset($_POST['intro']) ? trim($_POST['intro']) : '';
	$data = array('intro' => $data);
	echo json_encode($data);
?>

//jsonp.php
<?php
	$data = isset($_GET['intro']) ? trim($_GET['intro']) : '';
	$data = array('intro' => $data);
	$callback = isset($_GET['callback']) ? trim($_GET['callback']) : '';
	echo $callback.'('.json_encode($data).')';
?>















