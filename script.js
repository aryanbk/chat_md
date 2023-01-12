function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
    .catch((error) => {
      console.error('Could not copy text: ', error);
    });
}

function save(data, filename) {
	if (!filename) filename = "chat.md";

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



chrome.tabs.executeScript(null, {
	file: "download.js"
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.text) {
		document.getElementById('copyBtn').addEventListener('click', function() {
			copyToClipboard(request.text);
		});
		document.getElementById('dlBtn').addEventListener('click', function() {
			save(request.text, "chat.md");
		});

	}
});
