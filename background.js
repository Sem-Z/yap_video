function listener(details) {
	if (details.url.includes('/load/')) {
	  console.log("Loading: " + details.url);
	  let filter = browser.webRequest.filterResponseData(details.requestId);
	  let decoder = new TextDecoder("utf-8");
	  let encoder = new TextEncoder();

	  let data = [];
	  filter.ondata = event => {
		data.push(event.data);
	  };

	  filter.onstop = event => {
		let str = "";
		if (data.length == 1) {
		  str = decoder.decode(data[0]);
		}
		else {
		  for (let i = 0; i < data.length; i++) {
			let stream = (i == data.length - 1) ? false : true;
			str += decoder.decode(data[i], {stream});
		  }
		}
		// Just change any instance of Example in the HTTP response
		// to WebExtension Example.
		//str = str.replace(/Example/g, 'WebExtension $&');
		let parsed = JSON.parse(str);
		//console.log(parsed["player"]["hd"]);
		if (parsed["player"]["file_hd"] != null) {
			  parsed["player"]["link"] = parsed["player"]["file_hd"]
			}
			else if (parsed["player"]["file"] != null) {
				  parsed["player"]["link"] = parsed["player"]["file"]
				}
		filter.write(encoder.encode(JSON.stringify(parsed)));
		filter.close();
	  };

	}
}

browser.webRequest.onBeforeRequest.addListener(
  listener,
  {urls: ["*://*.yapfiles.ru/*"]},
  ["blocking"]
);