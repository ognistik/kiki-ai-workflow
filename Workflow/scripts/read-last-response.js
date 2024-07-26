function run(argv) {
    ObjC.import('stdlib');
    
    function readJSONFile(filePath) {
      const fileManager = $.NSFileManager.defaultManager;
      const contents = fileManager.contentsAtPath(filePath);
      const jsonString = $.NSString.alloc.initWithDataEncoding(contents, $.NSUTF8StringEncoding).js;
      return JSON.parse(jsonString);
    }
  
    const jsonFilePath = $.getenv('theContext');
    const jsonData = readJSONFile(jsonFilePath);
    const assistantMessages = jsonData.filter(msg => msg.role === 'assistant');
    const lastAssistantContent = assistantMessages[assistantMessages.length - 1].content;
  
    return lastAssistantContent;
  }