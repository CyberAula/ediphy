import React from 'react';
import VisorPluginPlaceholder from '../../_visor/components/canvas/VisorPluginPlaceholder';
import i18n from 'i18next';
// eslint-disable-next-line no-unused-vars
import sortable from 'jquery-ui/ui/widgets/sortable';
import { generateCustomColors } from "../../common/themes/themeLoader";
import { checkFeedback } from "../../common/utils";
import { AnswerLetter, AnswerPlaceholder, AnswerRow, AnswerText, Orderable, OrderingPlugin } from "./Styles";
import {
    ExerciseScore,
    Feedback,
    FeedbackRow,
    QuestionRow,
} from "../../sass/exercises";

/* eslint-disable react/prop-types */
export default class OrderVisor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            positions: this.generateRandomPositions(this.props.state.nBoxes),
        };
    }
    render() {
        let { state, props } = this.props;
        let content = [];
        let attempted = props.exercises?.attempted;
        let score = props.exercises.score || 0;
        score = Math.round(score * 100) / 100;
        score = (props.exercises.weight === 0) ? i18n.t("Ordering.notCount") : ((score) + "/" + (props.exercises.weight));
        let showFeedback = attempted && state.showFeedback;

        let quizColor = state.quizColor.color || 'rgba(0, 173, 156, 1)';
        let customStyle = state.quizColor.custom ? generateCustomColors(quizColor, 1, true) : null;

        let positions = attempted ? props.exercises.currentAnswer : this.state.positions;
        for (let j in positions) {
            let i = positions[j];
            // eslint-disable-next-line
            let correct = attempted && i == j;
            // eslint-disable-next-line
            let incorrect = attempted && (j != i);

            content.push(
                <AnswerRow key={j + 1} data-id={i} className={"row answerRow " + (correct ? "correct " : " ") + (incorrect ? "incorrect " : " ")}>
                    <AnswerPlaceholder>
                        <AnswerLetter>{parseInt(j, 10) + 1}</AnswerLetter>
                    </AnswerPlaceholder>
                    <AnswerText className={"col-xs-10 answerCol"} >
                        <Orderable data-id={i}>
                            <i className="material-icons order-drag-handle btnDrag">swap_vert</i>
                            <VisorPluginPlaceholder {...props} key={i + 1} pluginContainer={"Answer" + i} /></Orderable>
                    </AnswerText>
                    {(correct) ? <i className={ "material-icons correct"}>done</i> : null}
                    {(incorrect) ? <i className={ "material-icons incorrect"}>clear</i> : null}
                </AnswerRow>);

        }

        const checkEmptyFeedback = checkFeedback('Ordering', props);

        let exClassName = "exercisePlugin orderingPlugin" + (attempted ? " attempted " : " ") + (props.exercises.showFeedback ? "showFeedback" : "");
        return (
            <OrderingPlugin className={ exClassName } style={ customStyle }>
                <QuestionRow key={0} >
                    <VisorPluginPlaceholder {...props} key="0" pluginContainer={"Question"}/>
                </QuestionRow>
                <div id={props.id + "-" + "sortable"}>
                    {content}
                </div>
                <FeedbackRow show={showFeedback && !checkEmptyFeedback} key={-2}>
                    <Feedback>
                        <VisorPluginPlaceholder {...props} key="0"
                            pluginContainer={"Feedback"}/>
                    </Feedback>
                </FeedbackRow>
                <ExerciseScore attempted={attempted}>{score}</ExerciseScore>
            </OrderingPlugin>);

    }
    shuffle(array) {
        let tmp, current, top = array.length;
        if(top) {while(--top) {
            current = Math.floor(Math.random() * (top + 1));
            tmp = array[current];
            array[current] = array[top];
            array[top] = tmp;
        }}
        return array;
    }
    generateRandomPositions(N) {
        let a = [];
        for (let i = 0; i < N; ++i) {a[i] = i;}
        return this.shuffle(a);
    }
    componentDidUpdate(nextProps) {
        let id = this.props.props.id + "-" + "sortable";
        let list = $("#" + id);
        // list.sortable("refresh");
        let prevAttempted = nextProps.props.exercises?.attempted;
        let attempted = this.props.props.exercises?.attempted;
        if (!prevAttempted && attempted && list && list.sortable("instance")) {
            list.sortable("destroy");
        }
    }
    componentDidMount() {

        let attempted = this.props.props.exercises?.attempted;

        if (!attempted) {
            let id = this.props.props.id + "-" + "sortable";
            let list = $("#" + id);
            setTimeout(()=>{
                list.sortable({
                    handle: '.order-drag-handle',
                    items: '.answerRow',
                    // revert: true,
                    over: function() {
                        $(this).addClass('hoveringOrder');
                    },
                    out: function() {
                        $(this).removeClass('hoveringOrder');
                    },
                    stop: () => {
                        let indexes = [];
                        let children = list.find(".answerRow");
                        for (let i = 0; i < children.length; i++) {
                            let index = parseInt(children[i].getAttribute("data-id"), 10);
                            indexes.push(index);
                        }
                        if (indexes.length !== 0) {
                            this.setState({ positions: indexes });
                            this.props.props.setAnswer(this.state.positions);
                        }
                        list.sortable('cancel');
                        let ev = document.createEvent('Event');
                        ev.initEvent('resize', true, true);
                        window.dispatchEvent(ev);
                    },
                });
                this.props.props.setAnswer(this.state.positions);
            }, 50);

        }

    }
    componentWillUnmount() {
        let id = this.props.props.id + "-" + "sortable";
        let list = $("#" + id);
        let attempted = this.props.props.exercises?.attempted;
        if (!attempted && list && list.sortable("instance")) {
            this.setState({ initializedSortable: false });

        }
    }
}

/* eslint-enable react/prop-types */
