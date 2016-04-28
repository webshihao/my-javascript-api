(function(w){
	function SSH(){};
	SSH.prototype = {
		extend: function(tar,source){
			for(var k in source){{
				tar[k] = source[k];
			}}
			return tar;
		}
	}
	var $ = new SSH;
	// 选择模块
	$.extend($,{
		$id: function(id){
			return document.getElementById(id);
		},
		$class: function(className,id){
			// 先获取上下文，然后根据上下文来获取相对应的class元素
			var dom = getContext(id);
			var doms = getElements(dom,className);
			return doms;
			function getContext(id){
				var dom;
				// 判断是否存在第二个参数
				if(id){
					if(typeof id === 'string'){
						dom = $.$(id);
					}else{
						dom = id;
					}
				}else{
					dom = document;
				}
				return dom;
			}
			function getElements(context,className){
				if(document.getElementsByClassName){
					return context.getElementsByClassName(className);
				}else{
					var arr = [];
					//获取上下文中所有节点，然后遍历节点的className与传入的className比较，从而获得需要的className
					var allNodes = context.getElementsByTagName('*');
					for(var i=0;i<allNodes.length;i++){
						if(allNodes[i].className == className){
							arr.push(allNodes[i]);
						}
					}
					return arr;
				}
			}
		},
		$multiplyClass: function(str,parent){
			var oParent = parent ? $.$id(parent) : document;
			if(document.getElementsByClassName){
				oParent.getElementsByClassName(str);
			}else{
				var arr = [];
				var allNodes = oParent.getElementsByTagName('*');
				for(var i=0;i<allNodes.length;i++){
					var allClassName = allNodes[i].className.split(' ');
					// 将每个多class元素放在数组中，并依次遍历与传入的class比较，取的正确的返回
					for(var j=0;j<allClassName.length;j++){
						if(allClassName[j] == str){
							arr.push(allNodes[i]);
						}
					}
				}
				return arr;
			}
		},
		$tag: function(tag,id){
			var dom = getContext(id);
			var doms = getElements(dom,tag);
			return doms;
			function getContext(id){
				var dom;
				if(dom){
					if(typeof id == 'string'){
						dom = $.$id(id);
					}else{
						dom = id;
					}	
				}else{
					dom = document;
				}
				return dom;
			}
			function getElements(context,tag){
				return context.getElementsByTagName(tag);
			}
		},
		$group: function(context){
			// 寻找突破点
			var arr = context.split(',');
			var list = []; // 缓存一下选择器集合
			var doms = []; //最后返回的元素集合
			for(var i=0;i<arr.length;i++){
				// 取出每一个元素，并把他的选择器样式取出
				var item = arr[i];
				var first = item.charAt(0); // . #
				var index = item.indexOf(first); // 0 索引 
				var name = item.slice(first+1); // value
				list = [];
				if(first == '#'){
					return doms.push($.$id(name));
				}else if(first == '.'){
					list = $.$class(name);
					for(var j=0;j<list.length;j++){
						arr.push(list[j]);
					}
				}else{
					list = $.$tag(item);
					for(var j=0;j<list.length;j++){
						arr.push(list[j]);
					}
				}
			}
			return doms;
		},
		$round: function(str){
			// 突破点
			var arr = str.split(' ');
			// 最后输出的元素集合
			var result = [];
			// 上个管道输出的元素的集合
			var context = [];
			// 保存临时中间的结果
			var list = [];
			for(var i=0;i<arr.length;i++){
				var item = arr[i];
				var first = item.charAt(0);
				var index = item.indexOf(first);
				var name = item.slice(index+1);
				if(first == '#'){
					return result.push($.$id(name));
					context = result;
				}else if(first == '.'){
					if(context.length){
						for(var j=0;j<context.length;j++){
							list = $.$class(name,context[j]);
							for(var k=0;k<list.length;k++){
								result.push(list[k]);
							}
						}
					}else{
						list = $.$class(name);
						for(var j=0;j<list.length;j++){
							result.push(list[j]);
						}
					}
					context = result;
				}else{
					if(context.length){
						for(var j=0;j<context.length;j++){
							list = $.$tag(item,context[j]);
							for(var k=0;k<list.length;k++){
								result.push(list[k]);
							}
						}
					}else{
						list = $.$tag(item);
						for(var j=0;j<list.length;j++){
							result.push(list[j]);
						}
					}
					context = result;
				}
			}
			return result;
		},
		$all: function(str,context){
			var dom;
			if(context){
				dom = context;
			}else{
				dom = document;
			}
			return dom.querySelector(str);
		},
		$all2: function(str,context){
			context = context || document;
			return context.querySelectorAll('.'+str[0].className);
		},
		$all3: function(str,context){
			context = context || document;
			return context.querySelectorAll(str);
		},
		$getStyle: function(dom,key){
			if(dom.currentStyle){
				return dom.currentStyle[key];
			}else{
				return window.getComputedStyle(dom,null)[key];
			}
		},
		$setStyle: function(dom,key,value){
			return dom.style[key] = value;
		},
		$css: function(context,key,value){
			// 接收元素参数并判断是否为字符串还是对象
			var doms; 
			if(typeof context == 'string'){
				doms = $.$all3(context);
			}else{
				doms = context;
			}
			//根据参数value来判断到底是设置还是读取
			console.log(doms)
			if(typeof doms == 'object'){
				if(value){
					$.$setStyle(context,key,value);
				}else{
					return $.$getStyle(context,key);
				}
			}else{
				if(value){
					for(var i=0;i<doms.length;i++){
						$.$setStyle(doms[i],key,value);
					}
				}else{
					return $.$getStyle(doms[0],key);
				}
			}
		},
		$show: function(context){
			var doms = $.$all3(context);
			for(var i=0;i<doms.length;i++){
				doms[i].style.display = 'block';
			}
		},
		$hide: function(context){
			var doms = $.$all2(context);
			console.log(doms)
			for(var i=0;i<doms.length;i++){
				doms[i].style.display = 'none';
				console.log(doms[i])
			}
		},
		$html: function(context,value) {
			var doms = $.$all3(context);
			if(value){
				for(var i=0;i<doms.length;i++){
					doms[i].innerHTML = value;
				}
			}else{
				return doms[0].innerHTML;
			} 
		},
		$attr: function(context,key,value){
			var doms = $.$all3(context);
			if(value){
				for(var i=0;i<doms.length;i++){
					setOneDOM(doms[i],key,value)
				}
			}else{
				return getOneDOM(dom,key);
			}
			function setOneDOM(dom,key,value){
				dom.setAttribute(key, value);
			}
			function getOneDOM(dom,key){
				dom.getAttribute(key);
			}
		},
		$removeAttr: function(context,key){
			var doms = $.$all2(context);
			for(var i=0;i<doms.length;i++){
				removeOneDOM(doms[i],key);
			}
			function removeOneDOM(dom,key){
				dom.removeAttribute(key);
			}
		},
		$removeAttrAll: function(){
			// change Arguments to a really Array
			var args = Array.prototype.slice.call(arguments);
			var context = args[0];
			var names = args.slice(1);
			var doms;
			if(typeof context == 'string'){
				doms = $.$all3(context);
			}else if(typeof context == 'object'){
				doms = $.$all2(context);
			}
			// var doms = $.$all2(context);
			// 去除某个元素的属性集合
			for(var i=0;i<doms.length;i++){
				removeOneDOMAttributes(doms[i]);
			}
			// 去除单个元素的所有属性
			function removeOneDOMAttributes(dom){
				for(var j=0;j<names.length;j++){
					dom.removeAttribute(names[j]);
				}
			}
		},
		$addClass: function(context,className){
			var doms = $.$all3(context);
			console.log(doms)
			for(var i=0;i<doms.length;i++){
				doms[i].className += ' ' + className;
			}
		},
		$addClass1: function(context,className){
			var doms = $.$all2(context);
			for(var i=0;i<doms.length;i++){
				addOne(doms[i]);
			}
			function addOne(dom){
				dom.className += ' '+className;
			}
		},
		$removeClass: function(context,className){
			var doms = $.$all2(context);
			for(var i=0;i<doms.length;i++){
				removeOne(doms[i]);
			}
			function removeOne(dom){
				dom.className = dom.className.replace(className,'');
			}
		}
	});
	$.extend($,{
		getEvent: function(event){
			return event ? event : window.event;
		},
		getTarget: function(event){
			var e = getEvent(event);
			return e.target || e.srcElement;
		},
		on: function(id,type,fn){
			var dom = document.getElementById(id);
			if(document.addEventListener){
				dom.addEventListener(type, fn, false);
			}else if(document.attachEvent){
				dom.attachEvent('on'+type,fn);
			}else{
				dom['on'+type] = fn;
			}
		},
		un: function(id,type,fn){
			var dom = document.getElementById(id);
			if(document.removeEventListener){
				dom.removeEventListener(type, fn, false);
			}else if(document.detachEvent){
				dom.detachEvent('on'+type,fn);
			}else{
				dom['on'+type] = null;
			}
		},
		click: function(id,fn){
			this.on(id,'click',fn);
		},
		mouseover: function(id,fn){
			this.on(id,'mouseover',fn);
		}
	});
	w.$ = w.ssh;
})(window);

