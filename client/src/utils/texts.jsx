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
            text: "You are now at the core of the application (Chat). Here you can ask questions about the game you have selected. You can ask questions in both English and German. The system will answer your questions in the language you have selected in the settings. For this trial, the procedure is largely predetermined. Therefore, please follow the instructions and do not deviate from them, as much as possible.",
            subItems: [
                {
                    name: "chat-1",
                    text: "To get an understanding of how the system works, please ask the following question: 'How can you help me?'"
                },
                {
                    name: "chat-2",
                    text: "TBD 2"
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
            <div>
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