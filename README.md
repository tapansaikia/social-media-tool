# social-media-tool
* To remember the steps
- hit /api/v1/x/login to generate the auth link
- authorize the login attempt 
- on clicking authorize, would redirect to the callback url with query params
- copy the params, hit the /api/v1/x/callback in Postman with the generated query params
- lastly, hit the /api/v1/x/tweet POST call with request body having the token and tweet