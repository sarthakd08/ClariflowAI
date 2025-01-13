const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
  };
  
    export const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {text: "{\n   \"time\": 1550476186479,\n   \"blocks\": [\n      {\n         \"id\": \"oUq2g_tl8y\",\n         \"type\": \"header\",\n         \"data\": {\n            \"text\": \"Editor.js\",\n            \"level\": 2\n         }\n      },\n      {\n         \"id\": \"zbGZFPM-iI\",\n         \"type\": \"paragraph\",\n         \"data\": {\n            \"text\": \"Hey. Meet the new Editor. On this page you can see it in action — try to edit this text. Source code of the page contains the example of connection and configuration.\"\n         }\n      },\n      {\n         \"id\": \"qYIGsjS5rt\",\n         \"type\": \"header\",\n         \"data\": {\n            \"text\": \"Key features\",\n            \"level\": 3\n         }\n      },\n      {\n         \"id\": \"XV87kJS_H1\",\n         \"type\": \"list\",\n         \"data\": {\n            \"style\": \"unordered\",\n            \"items\": [\n               \"It is a block-styled editor\",\n               \"It returns clean data output in JSON\",\n               \"Designed to be extendable and pluggable with a simple API\"\n            ]\n         }\n      },\n      {\n         \"id\": \"AOulAjL8XM\",\n         \"type\": \"header\",\n         \"data\": {\n            \"text\": \"What does it mean «block-styled editor»\",\n            \"level\": 3\n         }\n      },\n      {\n         \"id\": \"cyZjplMOZ0\",\n         \"type\": \"paragraph\",\n         \"data\": {\n            \"text\": \"Workspace in classic editors is made of a single contenteditable element, used to create different HTML markups. Editor.js <mark class=\\\"cdx-marker\\\">workspace consists of separate Blocks: paragraphs, headings, images, lists, quotes, etc</mark>. Each of them is an independent contenteditable element (or more complex structure) provided by Plugin and united by Editor's Core.\"\n         }\n      }\n   ],\n   \"version\": \"2.8.1\"\n}\n\n"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "```json\n{\n  \"time\": 1550476186479,\n  \"blocks\": [\n    {"},
          ],
        },
        {
          role: "user",
          parts: [
            {text: "{\n\"time\": 1550476186479,\n\"blocks\": [\n{\n\"id\": \"oUq2g_tl8y\",\n\"type\": \"header\",\n\"data\": {\n\"text\": \"Editor.js\",\n\"level\": 2\n}\n},\n{\n\"id\": \"zbGZFPM-iI\",\n\"type\": \"paragraph\",\n\"data\": {\n\"text\": \"Hey. Meet the new Editor. On this page you can see it in action — try to edit this text. Source code of the page contains the example of connection and configuration.\"\n}\n},\n{\n\"id\": \"qYIGsjS5rt\",\n\"type\": \"header\",\n\"data\": {\n\"text\": \"Key features\",\n\"level\": 3\n}\n},\n{\n\"id\": \"XV87kJS_H1\",\n\"type\": \"list\",\n\"data\": {\n\"style\": \"unordered\",\n\"items\": [\n\"It is a block-styled editor\",\n\"It returns clean data output in JSON\",\n\"Designed to be extendable and pluggable with a simple API\"\n]\n}\n},\n{\n\"id\": \"AOulAjL8XM\",\n\"type\": \"header\",\n\"data\": {\n\"text\": \"What does it mean «block-styled editor»\",\n\"level\": 3\n}\n},\n{\n\"id\": \"cyZjplMOZ0\",\n\"type\": \"paragraph\",\n\"data\": {\n\"text\": \"Workspace in classic editors is made of a single contenteditable element, used to create different HTML markups. Editor.js <mark class=\"cdx-marker\">workspace consists of separate Blocks: paragraphs, headings, images, lists, quotes, etc</mark>. Each of them is an independent contenteditable element (or more complex structure) provided by Plugin and united by Editor's Core.\"\n}\n}\n],\n\"version\": \"2.8.1\"\n}\n\nGenerate template for editor.js using above template as out in JSON format for a todo list template for tv shopping\n"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "```json\n{\n  \"time\": 1678886400000,\n  \"blocks\": [\n    {\n      \"id\": \"todo_header\",\n      \"type\": \"header\",\n      \"data\": {\n        \"text\": \"TV Shopping To-Do List\",\n        \"level\": 2\n      }\n    },\n    {\n      \"id\": \"intro_paragraph\",\n      \"type\": \"paragraph\",\n      \"data\": {\n        \"text\": \"Welcome to your TV Shopping To-Do list! Use this space to keep track of items you want to purchase, shows you want to watch, or anything else related to your TV shopping experience.\"\n      }\n    },\n    {\n      \"id\": \"shows_header\",\n      \"type\": \"header\",\n      \"data\": {\n        \"text\": \"Shows to Watch\",\n        \"level\": 3\n      }\n    },\n     {\n      \"id\": \"shows_list\",\n      \"type\": \"list\",\n      \"data\": {\n        \"style\": \"unordered\",\n        \"items\": [\n          \"Example Show 1\",\n          \"Example Show 2\",\n          \"Example Show 3\"\n        ]\n      }\n    },\n     {\n      \"id\": \"items_header\",\n      \"type\": \"header\",\n      \"data\": {\n        \"text\": \"Items to Buy\",\n        \"level\": 3\n      }\n    },\n    {\n      \"id\": \"items_list\",\n      \"type\": \"list\",\n      \"data\": {\n        \"style\": \"unordered\",\n        \"items\": [\n          \"Example Item 1\",\n          \"Example Item 2\",\n          \"Example Item 3\"\n        ]\n      }\n    },\n    {\n      \"id\": \"notes_header\",\n      \"type\": \"header\",\n      \"data\": {\n        \"text\": \"Notes\",\n        \"level\": 3\n      }\n    },\n    {\n      \"id\": \"notes_paragraph\",\n      \"type\": \"paragraph\",\n      \"data\": {\n        \"text\": \"Add any extra notes or reminders here.\"\n      }\n    }\n  ],\n  \"version\": \"2.8.1\"\n}\n```\n"},
          ],
        },
      ],
    });
  
//   run();