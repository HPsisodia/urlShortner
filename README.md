# urlShortner
url shortner using nodejs and hasura

APIs:

1) POST Request- To shortner URL:

URL: BASE_URL/short/url
Body: { "id":"", "url":""}
('id' is optional, if its not provided, a random generated id is used)


2) GET Request - Get All Data:

URL: BASE_URL/get-all-url


3) Redirect to URL:

URL: BASE_URL/:id
'id' is provided in parameter corresponding to the actual URL