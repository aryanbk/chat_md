// A function to copy text to clipboard
function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
    .catch((error) => {
      console.error('Could not copy text: ', error);
    });
}

function save(data, filename) {
	if (!filename) filename = `${data.slice(1, 11)}.md`;

	var blob = new Blob([data], {
		type: "text/plain"
	});
	var a = document.createElement("a");

	a.download = filename;
	a.href = window.URL.createObjectURL(blob);
	a.dataset.downloadurl = ["text/plain", a.download, a.href].join(
		":"
	);
	var e = new MouseEvent("click", {
		canBubble: true,
		cancelable: false,
		view: window,
		detail: 0,
		screenX: 0,
		screenY: 0,
		clientX: 0,
		clientY: 0,
		ctrlKey: false,
		altKey: false,
		shiftKey: false,
		metaKey: false,
		button: 0,
		relatedTarget: null,
	});

	a.dispatchEvent(e);
};



// Execute the content script
chrome.tabs.executeScript(null, {
	file: "download.js"
});

// Add a listener to receive messages from the content script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.text) {
		// Call the copyToClipboard function inside a user-initiated event
		document.getElementById('copyBtn').addEventListener('click', function() {
			copyToClipboard(request.text);
		});
		document.getElementById('dlBtn').addEventListener('click', function() {
			save(request.text, `${request.text.slice(1, 11)}.md`);
		});

	}
	else{
		console.log("no text found");
	}
});
