/**
 * Export / import tools
 *
 * @param {String} storageKey localforage key name.
 * @param {Function} onAfterImport [optional] function to run after data is imported to storage.
 *		This function can read data from the first argument.
 */
function ExportTools(storageKey, onAfterImport) {
	this.toolsContainer = null;
	this.storageKey = storageKey;
	this.onAfterImport = typeof onAfterImport === 'function' ? onAfterImport : function(){};
}

/**
 * @private
 */
ExportTools.prototype.prepareToolsContainer = function() {
	this.toolsContainer = document.createElement('div');
	this.toolsContainer.className = 'tools-container';
	var body = document.querySelector('body');
	body.insertBefore(this.toolsContainer, body.firstChild);
};

/**
 * @private
 */
ExportTools.prototype.show = function() {
	this.helperInput.style.display = '';
	this.closeButton.style.display = '';
	this.saveButton.style.display = '';
};
/**
 * @private
 */
ExportTools.prototype.hide = function() {
	this.helperInput.style.display = 'none';
	this.closeButton.style.display = 'none';
	this.saveButton.style.display = 'none';
};

/**
 * @private
 */
ExportTools.prototype.exportData = function() {
	var _self = this;
	localforage.getItem(this.storageKey).then(function(value) {
		var json = '';
		if (value === null) {
			console.log('No data stored yet');
		} else {
			json = JSON.stringify(value);
		}
		_self.helperInput.value = json;
	}).catch(function(err) {
		console.error('Problem reading from storage!', err);
	});
};
/**
 * @private
 */
ExportTools.prototype.importData = function(onSuccess) {
	if (!confirm('Are you sure you want to overwrite your current data?')) {
		return;
	}
	var _self = this;
	var json = this.helperInput.value;
	var value = JSON.parse(json);
	localforage.setItem(this.storageKey, value).then(function() {
		console.log('Data import finished');
		onSuccess();
		_self.onAfterImport(value);
	}).catch(function(err) {
		console.error('Problem saving data to storage!', err);
	});
};

/**
 * Init export tools GUI.
 */
ExportTools.prototype.init = function() {
	var _self = this;

	this.prepareToolsContainer();

	// export
	var exportButton = document.createElement('button');
	exportButton.innerHTML = 'Export';
	exportButton.onclick = function () {
		_self.hide();
		helperInput.style.display = '';
		closeButton.style.display = '';
		_self.exportData();
	};
	this.toolsContainer.appendChild(exportButton);

	// init import
	var importButton = document.createElement('button');
	importButton.innerHTML = 'Import';
	importButton.onclick = function () {
		_self.show();
	};
	this.toolsContainer.appendChild(importButton);

	// input
	var helperInput = document.createElement('textarea');
	helperInput.style.display = 'none';
	this.toolsContainer.appendChild(helperInput);

	// save (import)
	var saveButton = document.createElement('button');
	saveButton.innerHTML = 'Save';
	saveButton.onclick = function () {
		_self.importData(function(){
			_self.hide();
		});
	};
	saveButton.style.display = 'none';
	this.toolsContainer.appendChild(saveButton);

	// close
	var closeButton = document.createElement('button');
	closeButton.innerHTML = 'Close';
	closeButton.onclick = function () {
		_self.hide();
	};
	closeButton.style.display = 'none';
	this.toolsContainer.appendChild(closeButton);

	this.helperInput = helperInput;
	this.closeButton = closeButton;
	this.saveButton = saveButton;
};
