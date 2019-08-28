import { configScore, setCorrectAnswer } from "../../common/actions";

export default function(self) {
    return {
        onScoreConfig: (id, button, value, page) => self.props.dispatch(configScore(id, button, value, page)),

        setCorrectAnswer: (id, correctAnswer, page) => self.props.dispatch(setCorrectAnswer(id, correctAnswer, page)),
    };
}
