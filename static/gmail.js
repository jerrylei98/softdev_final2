// Your Client ID can be retrieved from your project in the Google
// Developer Console, https://console.developers.google.com

var CLIENT_ID;

function initClientId(client_id){
    CLIENT_ID = client_id;
};

//'https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/plus.me', 
var SCOPES = ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'];

/**
 * Check if current user has authorized this application.
 */
function checkAuth() {
    gapi.auth.authorize(
        {
            'client_id': CLIENT_ID,
            'scope': SCOPES.join(' '),
            'immediate': true
        }, handleAuthResult);
};

/**
 * Handle response from authorization server.
 *
 * @param {Object} authResult Authorization result.
 */
function handleAuthResult(authResult) {
    if (authResult && !authResult.error) {
	console.log(authResult);
	gapi.client.load('plus', 'v1').then(function() {
	    var request = gapi.client.plus.people.get({
		'userId': 'me'
	    })
	    request.then(function(resp) {
		console.log(resp);
		$.getJSON("/addUser", {
		    'username': resp.result.displayName,
		    'email': resp.result.emails[0].value,
		    'auth': auth,
		    success: function(data){
			//Should reload. Doesn't work right."
			//setTimeout(window.location.reload(true), 1);
			//window.location.reload(true);
			window.location = "/addUser";
		    }
		})
	    }, function(reason) {
		console.log('Error: ' + reason.result.error.message);
	    });
	});
    }
};

/**
 * Initiate auth flow in response to user clicking authorize button.
 *
 * @param {Event} event Button click event.
 */
function handleAuthClick(event) {
    auth = event.target.id
    gapi.auth.authorize(
        {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
        handleAuthResult);
    return false;
};

/**
 * Sign a user out
 */
function signOut(){
    var winning = window.open("","","width=500,height=500");
    winning.location = "https://accounts.google.com/logout";
    //setTimeout(function(){winning.close();},3000);
    //window.location = "logout";
    setInterval(function(){
      try{
        winning.location.href;
      }
      catch(err){
        winning.close();
        window.location = "logout";
      }
    }, 100);
}
    //winning.addEventListener('load', function(){
    //  winning.close();
    //}, false);

    //window.location = "logout";

    //win.close();
    //setTimeout(function(){not_winning.close();},1000);
    //setTimeout(function(){window.open("google.com","_parent");}, 1000);



document.getElementById('teacher').addEventListener("click", handleAuthClick);
document.getElementById('student').addEventListener("click", handleAuthClick);
