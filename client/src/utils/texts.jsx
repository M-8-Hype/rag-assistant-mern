export const INSTRUCTION = {
    introduction: "Please read the following instructions carefully:",
    steps: [
        {
            name: "settings-username",
            text: "On the next page (Settings), first select your username. If it is not in the dropdown list, click on the button to create a new user for yourself. If you have chosen a username, do not change it and keep it until the end of the trial."
        },
        {
            name: "settings-language",
            text: "Then select your desired language for the output of the answers. Please note: You can write your question to the system in both English and German, regardless of the language selected."
        },
        {
            name: "settings-game",
            text: "At the end of the settings selection, select the game for which you would like questions answered. Then press the corresponding button to go to the next page."
        },
        {
            name: "chat",
            text: "You are now at the core of the application (Chat). Here you can ask questions about the game you have selected. You can ask questions in both English and German. The system will answer your questions in the language you have selected in the settings. For this trial, the procedure is largely predetermined. Therefore, please follow the instructions and do not deviate from them, as much as possible. After each question, you will need to rate the answer you were given. The rating requirements are an average of the following criteria: (1) correctness, (2) relevance, (3) content amount, (4) system plausibility. If you don't know straightaway if the answer is correct, please click the provided link to look up the answer or search for it yourself on the internet.",
            subItems: [
                {
                    name: "chat-1",
                    text: "You want to first familiarize yourself with the assistant and want to know how it can help you."
                },
                {
                    name: "chat-2",
                    text: "You want to first request some general information about the game."
                },
                {
                    name: "chat-3",
                    text: "You want further general information. To do this, select the last answer as enrichment. Ask the assistant to elaborate on the information in more detail."
                },
                {
                    name: "chat-4",
                    text: "You want information on the system requirements for the PC."
                },
                {
                    name: "chat-5",
                    text: "You are starting the game for the first time and are a beginner. You want to know what you should do on the first day."
                },
                {
                    name: "chat-6",
                    text: "You want to know how to best manage your inventory."
                },
                {
                    name: "chat-7",
                    text: "There are animals in the game. You want to know how and for what purpose you can interact with the animals."
                },
                {
                    name: "chat-8",
                    text: "You want to know how you can get more inventory slots."
                },
                {
                    name: "chat-9",
                    text: "Now set the language to English in the settings. Repeat your last question exactly, this time in German. Compare the answer with the last one."
                },
                {
                    name: "chat-10",
                    text: "Ask any question related to \"resources\"."
                },
                {
                    name: "chat-11",
                    text: "You want to know how the scanner can help you find resources."
                },
                {
                    name: "chat-12",
                    text: "You want a list of organic elements."
                },
                {
                    name: "chat-13",
                    text: "You want to know which elements can be mined from asteroids."
                },
                {
                    name: "chat-14",
                    text: "You want information about the element \"Oxygen\"."
                },
                {
                    name: "chat-15",
                    text: "You want information about the element \"Strawberry Cake\"."
                },
                {
                    name: "chat-16",
                    text: "Now select all previous messages and ask the assistant what other topics in the game you could ask about."
                },
                {
                    name: "chat-17",
                    text: "Ask about a topic that the assistant suggested in its last answer."
                },
                {
                    name: "chat-18",
                    text: "Ask any question about the game."
                }
            ],
            conclusion: "Once you have completed each step, click on the corresponding button to go to the next page."
        },
        {
            name: "report",
            text: "On this page (Report) you now have the option of saving the chat you have had with the system as a text file. Please be sure to complete this step, otherwise the results and evaluation will not be possible. As soon as you press this button, the chat history will be saved in the folder structure of the application, but you also have the option of saving it in a location of your choice. To be on the safe side, please check the contents of the saved text file."
        },
        {
            name: "finish",
            text: "You can now close this application according to the readme file. Thank you for your cooperation!"
        }
    ],
    conclusion: "If you have fully understood the instructions, please click on the button below."
}

export const getInstructionStepsAsJsx = () => {
    return INSTRUCTION.steps.map((step, index) => {
        return (
            <li key={index}>
                <p>{step.text}</p>
                {step.subItems && <ol>
                    {step.subItems.map((subItem, subIndex) => {
                        return (
                            <li key={subIndex}>
                                <p>{subItem.text}</p>
                            </li>
                        )
                    })}
                </ol>}
                {step.conclusion && <p>{step.conclusion}</p>}
            </li>
        )
    })
}

export const getChatInstructionsAsJsx = () => {
    const chatInstructions = INSTRUCTION.steps.find(step => step.name === "chat")
    if (chatInstructions) {
        return (
            <div id="chatInstructions">
                <p>{chatInstructions.text}</p>
                {chatInstructions.subItems && <ol>
                    {chatInstructions.subItems.map((subItem, subIndex) => {
                        return (
                            <li key={subIndex}>
                                <p>{subItem.text}</p>
                            </li>
                        )
                    })}
                </ol>}
                <p>{chatInstructions.conclusion}</p>
            </div>
        )
    }
}