;(function(){
	'use strict';

	Application.registerRouter({
		state: 'editVocabulary',
		config: {
			url: '/vocabularys/edit/{id}',
			data: {
				title: 'Edit Vocabulary',
				menuType: 'vocabulary'
			},
			params: {
				// page: '1',
				// sort: '-created',
				// limit: '10'
			},
			templateUrl: 'modules/admin-vocabulary/view/client/edit/edit-vocabulary.html',
			controller: 'vocabularyEditCtrl',
			controllerAs: 'vmEditVocabularys',
			// resolve: vocabularysCtrl.resolve
		}
	});
})();
