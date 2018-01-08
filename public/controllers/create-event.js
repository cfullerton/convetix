/*
todo:
- get venueID from session
- image upload
- add a ticket type
*/

webApp.controller('CreateController', ['$scope', function($scope){
	var venue = 2; //needs to come from the session
	$scope.event = {
		ticketType:{
			ga:{}
		},
		venueId:venue,
	}
}]);
