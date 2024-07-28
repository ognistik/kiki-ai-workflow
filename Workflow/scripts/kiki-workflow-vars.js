ObjC.import('stdlib');
ObjC.import('Foundation');

function run(argv) {
    var query = argv[0];
    var theDir = $.getenv('kiki_data');
    var chatModelB = $.getenv('chatModelB');
    const wfDir = $.NSFileManager.defaultManager.currentDirectoryPath.js;
    let dataDir = theDir;
    let lastModel = "";
    let context = "";
    let fileManager = $.NSFileManager.defaultManager;

    var app = Application.currentApplication();
	app.includeStandardAdditions = true;
	let modelFilePath = $(dataDir + '/lastModel.txt').stringByExpandingTildeInPath;
	let shellCommandToReadFile = `cat '${modelFilePath.js}'`; // Ensure the path is properly quoted
	try {
		// Using doShellScript to read the file content
		lastModel = app.doShellScript(shellCommandToReadFile);
	} catch (error) {
		lastModel = "";
	}

    let contextFilePath = $(dataDir + '/context.json').stringByExpandingTildeInPath;
	if (fileManager.fileExistsAtPath(contextFilePath)) {
		context = contextFilePath.js;
	}

    const scriptFilterItem = {};
    if (query === 'actionResumeLast') {
      scriptFilterItem.alfredworkflow = { arg: "actionResumeLast", variables: { theContext: context, chatModel: lastModel } };
    } else if (query === 'resumeLastAlt') {
        scriptFilterItem.alfredworkflow = { arg: "actionResumeLast", variables: { theContext: context, chatModel: chatModelB } };
    } else if (query === 'resumeLastList') {
        scriptFilterItem.alfredworkflow = { arg: "actionResumeLast", variables: { theContext: context, chatAlt: 'List' } };
    }else if (query === 'wfData') {
        scriptFilterItem.alfredworkflow = { arg: "filesRevealPath", variables: {} };
    } else if (query === 'wfEdit') {
        scriptFilterItem.alfredworkflow = { arg: "filesRevealWorkflow", variables: {} };
    } else if (query === 'wfCopyLastRep') {
        scriptFilterItem.alfredworkflow = { arg: "filesCopyResponse", variables: {} };
    } else if (query === 'wfCopyLastTran') {
        scriptFilterItem.alfredworkflow = { arg: "filesCopyTranscription", variables: {} };
    } else if (query === 'wfCopyContext') {
        scriptFilterItem.alfredworkflow = { arg: "filesCopyContext", variables: {} };
    } else if (query === 'wfResetLogs') {
        scriptFilterItem.alfredworkflow = { arg: "filesResetLogs", variables: {} };
    } else if (query === 'wfOpenContext') {
        scriptFilterItem.alfredworkflow = { arg: "filesOpenContext", variables: {} };
    } else if (query === 'wfDir') {
        scriptFilterItem.alfredworkflow = { arg: "filesOpenWFDir", variables: {} };
    } else if (query === 'actionPresets') {
      scriptFilterItem.alfredworkflow = { arg: "actionPresets", variables: {} };
    } else if (query === 'actionChat') {
      scriptFilterItem.alfredworkflow = { arg: "actionChat", variables: {} };
    } else if (query === 'actionWhisper') {
        scriptFilterItem.alfredworkflow = { arg: "actionWhisper", variables: { kikiSplit2: 'whisper' } };
    } else if (query === 'whChatPrompt') {
        scriptFilterItem.alfredworkflow = { arg: "actionWhisper", variables: { kikiSplit1: 'direct', kikiSplit2: 'whisper', kikiSplit3: '1', kikiSplit4: 'useAsPrompt' } };
    } else if (query === 'whPaste') {
        scriptFilterItem.alfredworkflow = { arg: "actionWhisper", variables: { kikiSplit1: 'paste', kikiSplit2: 'whisper' } };
    } else if (query === 'whPresets') {
        scriptFilterItem.alfredworkflow = { arg: "actionWhisper", variables: { kikiSplit1: 'menu', kikiSplit2: 'whisper', kikiSplit3: '1' } };
    }

    return JSON.stringify(scriptFilterItem);
}