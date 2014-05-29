var PVAjax = function() {

	function send(data) {

		data = _applyDefaults(data);

		data.xhr = _getRequestObject();

		data = _applyCallbacks(data);

		data.data = _formatObject(data.data, data.format, null);

		_sendRequest(data);

	}

	function _applyDefaults(data) {

		if (data.type == undefined) {

			data.type = '';

		}

		if (data.data == undefined) {

			data.data = {};

		}

		if (data.method == undefined) {

			data.method = 'ajax';

		}

		if (data.async == undefined) {

			data.async = true;

		}

		if (data.url == undefined) {

			data.method = null;

		}

		if (data.format == undefined) {

			data.format = 'serial';

		}

		if (data.response == undefined) {

			data.response = 'string';

		}

		if (data.success == undefined) {

			data.success = function(response) {

			};

		}

		if (data.error == undefined) {

			data.error = function(response) {

			};

		}

		return data;

	}

	function _applyCallbacks(data) {

		data.xhr.onreadystatechange = function() {

			if (data.xhr.readyState == 4 && data.xhr.status == 200) {

				var response = '';

				if (data.response == 'json') {

					response = JSON.parse(data.xhr.responseText);

				} else {

					response = data.xhr.responseText;

				}

				data.success(response);

			} else if (data.xhr.readyState == 4 && data.xhr.status == 200) {

				data.error(data.xhr.responseText);

			}

		};

		return data;

	}

	function _getRequestObject() {

		xhr = null;
		
		if (window.XDomainRequest) {
			xhr = new XDomainRequest();
			
		} else if ( typeof XMLHttpRequest !== 'undefined') {

			xhr = new XMLHttpRequest();

		} else {

			var versions = ["MSXML2.XMLHTTP.6.0","MSXML2.XMLHTTP.5.0", "MSXML2.XMLHTTP.4.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XmlHttp.2.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"];

			for (var i = 0, len = versions.length; i < len; i++) {

				try {

					xhr = new ActiveXObject(versions[i]);

					break;

				} catch(e) {

				}

			} // end for

		}//end if

		return xhr;

	}

	function _formatObject(obj, format, prefix) {

		if (format == 'json') {

			return JSON.stringify(obj);

		} else {

			var str = [];

			for (var p in obj) {

				var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];

				str.push( typeof v == "object" ? _formatObject(v, format, k) : encodeURIComponent(k) + "=" + encodeURIComponent(v));

			}

			return str.join("&");

		}

	}

	function _sendRequest(data) {

		if (data.type.toLowerCase() == 'get') {

			data.xhr.open(data.type, data.url + '?' + data.data, data.async);

			data.xhr.withCredentials = true;

			data.xhr.send();

		} else {

			data.xhr.open(data.type, data.url, data.async);

			data.xhr.withCredentials = true;

			data.xhr.send(data.data);

		}

	}

	return {

		send : send

	};

}();
