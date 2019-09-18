import { configScore, setCorrectAnswer } from "../../common/actions";

export default (self) => ({
    onScoreConfig: (id, button, value, page) => {
        console.log(value);
        self.props.dispatch(configScore(id, button, value, page));
    },

    setCorrectAnswer: (id, correctAnswer, page) => self.props.dispatch(setCorrectAnswer(id, correctAnswer, page)),
});
