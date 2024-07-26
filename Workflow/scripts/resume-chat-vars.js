ObjC.import('stdlib');
ObjC.import('Foundation');

function run(argv) {
    var theDir = $.getenv('kiki_data');
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

    const scriptFilterItem = {
        alfredworkflow: {
            arg: "actionResumeLast",
            variables: {
                theContext: context,
                chatModel: lastModel,
            }
        }
    };

    return JSON.stringify(scriptFilterItem);
}