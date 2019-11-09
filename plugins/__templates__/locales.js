export const localesTemplate = options => `
module.exports = {
    "${options.name}": {
        "PluginName": "${options.displayName}",
        ${options.category === "evaluation" ? (
        `"content_box_name": "Content ",
        "Statement": "This is a ${options.displayName} question with a single correct answer. You can write here the question statement",
        "Question": "Question",
        "Feedback": "Feedback",
        "FeedbackMsg": "Here you can provide some feedback about the answer. In order to disable this feature, turn it off in the toolbar.",
        "ShowFeedback": "Show feedback msg.",
        "Number": "Number  of answers",
        "QuizColor": "Quiz color",
        "ShowLettersInsteadOfNumbers": "Show letters instead of numbers",
        "ShowLetters": "Letters",
        "ShowNumbers": "Numbers",
        "backgroundColor": "Background color",
        "border_color": "Border color",
        "border_size": "Border Size",
        "border_style": "Border Style",
        "box_style": "Box style",
        "opacity": "Opacity",
        "padding": "Padding",
        "pos": "Position",
        "radius": "Radius",
        "source": "Fuente",
        "Answer": "Answer",
        "correctAnswerFeedback": "Correct answer",
        `) : (``)}
    },
};
`;
