(function(){
	var Promise = this.Promise || require('promise');
	var request = require('superagent');
	var jsonp = require('superagent-jsonp');
	var fetchDataFromUrl = function(url){
		return new Promise(function(resolve, reject){
	        request(url).end(function(err, res){
	            if (res.statusCode === 200){
	                resolve(res.text);
	            }else{
	                reject(err);
	            }
	        });
	    });
	}
	var getItemsFromXml = function(xml){
		return new Promise(function(resolve, reject){
			resolve(xml.match(/<item>(([\n\r\t]|.)*?)<\/item>/g));
		});
	}
	var getObjsFromItems = function(items){
		return new Promise(function(resolve, reject){
			var arr = [];
			items.forEach(function(item){
				var title = item.match(/<title>(.*?)<\/title>/)[1];
				var url = item.match(/<link>(.*?)<\/link>/)[1];
				// console.log({title:title,link:link,item:item});
				arr.push({title:title,url:url});
			});
			resolve(arr);
		});
	}
	var getObjsFromJson = function(text){
		return new Promise(function(resolve, reject){
			resolve(JSON.parse(text));
		});
	}
	var getFbCountsFromObjs = function(items){
	  var arr = [];
	  items.forEach(function(item){
	      var url = item.url;
	      var promise = new Promise(function(resolve,reject){
	        request("http://graph.facebook.com/?id=" + url)
            .end(function(err, reply){
            	item.count_fb = 0
            	if (reply && reply.statusCode === 200){
            		var text = JSON.parse(reply.text);
            		if(text && text.shares){
            			item.count_fb = text.shares;
            		}           
	            }
	            resolve();
            });
	      });
	      arr.push(promise);
	  });
	  return Promise.all(arr).then(function(){
	  	return new Promise(function(resolve, reject){
	  		resolve(items);
	  	});
	  });
	}
	var getHatenaCountsFromObjs = function(items){
		var arr = [];
		items.forEach(function(item){
	      var url = item.url;
	      var promise = new Promise(function(resolve,reject){
	        request.get("http://api.b.st-hatena.com/entry.count?url="+url)
	        .use(jsonp)     
            .end(function(err, reply){
            	item.count_hatebu = 0;
            	if (reply && reply.body){
            		item.count_hatebu = reply.body;
	            }
	            resolve();
            });
	      });
	      arr.push(promise);
	  });
	  return Promise.all(arr).then(function(){
	  	return new Promise(function(resolve, reject){
	  		resolve(items);
	  	});
	  });
	}
	var fetchShareButton = function(url,obj){
		if(obj.from == "xml"){
			return fetchDataFromUrl(url)
			.then(getItemsFromXml)
			.then(getObjsFromItems)
			.then(getFbCountsFromObjs)
			.then(getHatenaCountsFromObjs);
		}else if(obj.from == "json"){
			return fetchDataFromUrl(url)
			.then(getObjsFromJson)
			.then(getFbCountsFromObjs)
			.then(getHatenaCountsFromObjs);
		}else if(obj.from == "array"){
			return getFbCountsFromObjs(url)
			.then(getHatenaCountsFromObjs)
		}
	}
	//for browserify
	if (typeof window == 'undefined' && typeof module !== 'undefined' && module.exports) {
        module.fetchShareButton = fetchShareButton;
    }else{
        window.fetchShareButton = fetchShareButton;
    }
})();