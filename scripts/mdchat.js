ObjC.import('stdlib');
ObjC.import('Foundation');

const allTheText = $.getenv('theText');
const outputText = extractTextAfterLastMarkdown(allTheText);

$.NSFileHandle.fileHandleWithStandardOutput.writeData($.NSString.alloc.initWithUTF8String(outputText).dataUsingEncoding($.NSUTF8StringEncoding));

function extractTextAfterLastMarkdown(text) {
    const userPattern = /---\n### USER\n/;
    const doubleLinePattern = /---\n---\n/;
	const headerID = $.getenv('headerID');
    const headerPattern = new RegExp(`---\n${headerID}.*\n---\n`);
	const kiki_data = $.getenv('kiki_data');
	const modelsPath = `${kiki_data}/presets/models.json`;
	const systemsPath = `${kiki_data}/presets/systems.json`;
    let paste = 'no';
    let theRequest;
    let pasteThis;
    let chatModel = $.getenv('chatModel');
    let chatContext = $.getenv('chatContext');
    let chatSystem = $.getenv('chatSystem');
	// More options to be set on the header... rarely used, though.
	let temperature = $.getenv('temperature');
	let maxTokens = $.getenv('maxTokens');
	let frePenalty = $.getenv('frePenalty');
	let prePenalty = $.getenv('prePenalty');
	let topP = $.getenv('topP');

	// Extract AI model, chat context, and AI role from the markdown header
	const markdownHeaderMatch = text.match(headerPattern);
	if (markdownHeaderMatch) {
		const headerLine = markdownHeaderMatch[0].match(new RegExp(`${headerID}.*\n`))[0].trim();
		const modelMatch = headerLine.match(/(?<=\s)(M_[^\s]+)(?=\s|$)/);
		if (modelMatch) {
			// Adapted function to read JSON and find the model
			const modelData = readJsonAndFindModel(modelsPath, modelMatch[1]);
			if (modelData) {
				chatModel = modelData.theModel || chatModel;
			}
		}
		const contextMatch = headerLine.match(/(?<=\sC_)(\d+)(?=\s|$)/);
		if (contextMatch) {
			chatContext = contextMatch[1];
		}
		const systemMatch = headerLine.match(/(?<=\s)(S_[^\s]+)(?=\s|$)/);
		if (systemMatch) {
			// Adapted function to read JSON and find the system
			const systemData = readJsonAndFindSystem(systemsPath, systemMatch[1]);
			if (systemData) {
				chatSystem = systemData.theSystem || chatSystem;
			}
		}
		const tokensMatch = headerLine.match(/(?<=\sX_)(\d+)(?=\s|$)/);
		if (tokensMatch) {
			maxTokens = tokensMatch[1];
		}
		// Now let's allow decimal points or not for the options that follow
		const tempMatch = headerLine.match(/(?<=\sT_)(0?\.\d+|\d+(\.\d+)?)(?=\s|$)/);
		if (tempMatch) {
			temperature = tempMatch[1];
		}
		const preMatch = headerLine.match(/(?<=\sP_)(0?\.\d+|\d+(\.\d+)?)(?=\s|$)/);
		if (preMatch) {
			prePenalty = preMatch[1];
		}
		const freMatch = headerLine.match(/(?<=\sF_)(0?\.\d+|\d+(\.\d+)?)(?=\s|$)/);
		if (freMatch) {
			frePenalty = freMatch[1];
		}
		const topMatch = headerLine.match(/(?<=\sO_)(0?\.\d+|\d+(\.\d+)?)(?=\s|$)/);
		if (topMatch) {
			topP = topMatch[1];
		}
	}

	// Function to read JSON and find the model information
	function readJsonAndFindModel(filePath, modelId) {
		const fileManager = $.NSFileManager.defaultManager;
		if (fileManager.fileExistsAtPath(filePath)) {
			const content = $.NSString.stringWithContentsOfFileEncodingError(filePath, $.NSUTF8StringEncoding, null);
			const models = JSON.parse(content.js); // Parse the JSON content

			// Find the model by id
			return models.find(model => model.id === modelId);
		}
		return null; // Return null if file doesn't exist or model not found
	}

	// Function to read JSON and find the system information
	function readJsonAndFindSystem(filePath, systemId) {
		const fileManager = $.NSFileManager.defaultManager;
		if (fileManager.fileExistsAtPath(filePath)) {
			const content = $.NSString.stringWithContentsOfFileEncodingError(filePath, $.NSUTF8StringEncoding, null);
			const systems = JSON.parse(content.js); // Parse the JSON content

			// Find the system by id
			return systems.find(system => system.id === systemId);
		}
		return null; // Return null if file doesn't exist or system not found
	}

	if (userPattern.test(text)) {
        // Split by '---\n### USER\n'
        const sections = text.split(userPattern);
        theRequest = sections.pop().trim();
    } else {
		// Split by the last double markdown line '---\n---\n' if it exists
		const sectionsByMarkdownLine = text.split(doubleLinePattern);
		if (sectionsByMarkdownLine.length > 1) {
			theRequest = sectionsByMarkdownLine.pop().trim();
		} else if (markdownHeaderMatch) {
            const indexAfterPattern = markdownHeaderMatch.index + markdownHeaderMatch[0].length;
            theRequest = text.substring(indexAfterPattern).trim();
            pasteThis = text.substring(0, indexAfterPattern) + `### USER\n${theRequest}\n`;
            paste = 'yes';
        } else {
			// No markdown line found, the whole text is the request
			theRequest = text.trim();
		}
	}

    const output = {
        alfredworkflow: {
            arg: "",
            variables: {
                paste: paste,
                theRequest: theRequest,
                chatModel: chatModel,
                chatContext: chatContext,
                chatSystem: chatSystem,
				temperature: temperature,
				maxTokens: maxTokens,
				frePenalty: frePenalty,
				prePenalty: prePenalty,
				topP: topP
            }
        }
    };

    if (paste === 'yes') {
        output.alfredworkflow.variables.pasteThis = pasteThis;
    }

    return JSON.stringify(output);
}