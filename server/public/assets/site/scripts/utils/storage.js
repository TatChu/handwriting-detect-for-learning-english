var Storage = (function() {
	'use strict';
	return {
		get: get,
		set: set,
		remove: remove,
		clear: clear
	};

	function get(name) {
		var date = new Date(),
		current = Math.round(+date / 1000),
		storedData = JSON.parse(localStorage.getItem(settingJs.appPrefix + '.' + name)) || {},
		storedTime = storedData.storageExpireTime || 0;

		if (storedTime && storedTime < current) {
			remove(settingJs.appPrefix + '.' + name);
			return undefined;
		} else {
			return storedData.store;
		}
	}

	function set(name, value, seconds) {
		var date = new Date(),
		schedule = Math.round((date.setSeconds(date.getSeconds() + seconds)) / 1000),
		data = JSON.stringify({storageExpireTime: schedule, store: value});
		try {
			localStorage.setItem(settingJs.appPrefix + '.' + name, data);
		} catch (e) {
			if (e == QUOTA_EXCEEDED_ERR) {
				alert('Quota exceeded!');
			}
		}

		return data;
	}

	function remove(name) {
		localStorage.removeItem(settingJs.appPrefix + '.' + name);
	}

	function clear() {
		localStorage.clear();
	}
})();