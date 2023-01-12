var markdown = "";
var elements = document.querySelectorAll("[class*='min-h-[20px]']");
var timestamp = new Date(
		new Date(new Date(new Date()).toISOString()).getTime() -
		new Date().getTimezoneOffset() * 60000
	)
	.toISOString()
	.slice(0, 19)
	.replace("T", " ");
markdown += `\`${timestamp}\`\n\n`;

for (var i = 0; i < elements.length; i++) {
	var ele = elements[i];

	var firstChild = ele.firstChild;
	if (!firstChild) continue;

	if (firstChild.nodeType === Node.ELEMENT_NODE) {
		var childNodes = firstChild.childNodes;

		if (firstChild.className.includes("request-")) {
			markdown += `_ChatGPT_:\n`;
		}

		for (var n = 0; n < childNodes.length; n++) {
			const childNode = childNodes[n];

			if (childNode.nodeType === Node.ELEMENT_NODE) {
				var tag = childNode.tagName;
				var text = childNode.textContent;
				if (tag === "P") {
					markdown += `${text}\n`;
				}

				if (tag === "OL") {
					childNode.childNodes.forEach((listItemNode, index) => {
						if (
							listItemNode.nodeType === Node.ELEMENT_NODE &&
							listItemNode.tagName === "LI"
						) {
							markdown += `${index + 1}. ${listItemNode.textContent}\n`;
						}
					});
				}
				if (tag === "UL") {
					childNode.childNodes.forEach((listItemNode, index) => {
						if (
							listItemNode.nodeType === Node.ELEMENT_NODE &&
							listItemNode.tagName === "LI"
						) {
							markdown += `- ${listItemNode.textContent}\n`;
						}
					});
				}

				if (tag === "PRE") {
					markdown += `\`\`\`\n${text}\`\`\`\n`;
				}

				markdown += "\n";
			}
		}
	}

	if (firstChild.nodeType === Node.TEXT_NODE) {
		markdown += 
		`--- \n _Prompt_: \n`;
		markdown += `${firstChild.textContent}\n\n`;
	}
}

chrome.runtime.sendMessage({text: markdown});
