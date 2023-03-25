var markdown = "";
var questions = 0;
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

	// Get first child
	var firstChild = ele.firstChild;
	if (!firstChild) continue;

	// Element child
	if (firstChild.nodeType === Node.ELEMENT_NODE) {
		var childNodes = firstChild.childNodes;

		// Prefix ChatGPT reponse label
		if (firstChild.className.includes("request-")) {
			markdown += `_ChatGPT_:\n`;
		}

		// Parse child elements
		for (var n = 0; n < childNodes.length; n++) {
			const childNode = childNodes[n];

			if (childNode.nodeType === Node.ELEMENT_NODE) {
				var tag = childNode.tagName;
				var text = childNode.textContent;
				// Paragraphs
				if (tag === "P") {
					markdown += `${text}\n`;
				}

				// Get list items
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

				// Code blocks
				if (tag === "PRE") {
					markdown += `\`\`\`\n${text}\`\`\`\n`;
				}

				// Paragraph break after each element
				markdown += "\n";
			}
		}
	}

	// Text child
	if (firstChild.nodeType === Node.TEXT_NODE) {
		// Prefix User prompt label
		markdown += 
		`--- \n _Prompt_: \n`;
		markdown += `${firstChild.textContent}\n\n`;
		questions+=1;
		// End of prompt paragraphs breaks
		// markdown += "\n";
	}
}

console.log(`Questions: ${questions} \nTime: ${timestamp} \nChat Length: ${markdown.length}`);
chrome.runtime.sendMessage({text: markdown});
