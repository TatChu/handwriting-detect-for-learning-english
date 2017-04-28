;(function(){
	'use strict';

	Application.registerRouter({
		state: 'createVocabulary',
		config: {
			url: '/vocabularys/add',
			data: {
				title: 'Create new Vocabulary',
				menuType: 'add-vocabulary'
			},
			params: {
				// page: '1',
				// sort: '-created',
				// limit: '10'
			},
			templateUrl: 'modules/admin-vocabulary/view/client/add/add-vocabulary.html',
			controller: 'vocabularyAddCtrl',
			controllerAs: 'vmAddVocabularys',
			// resolve: vocabularysCtrl.resolve
		}
	});
})();
