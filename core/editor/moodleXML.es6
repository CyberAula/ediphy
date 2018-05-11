import { isDataURL, dataURItoBlob } from '../../common/utils';
import xml2json from 'basic-xml2json';
export default function parseMoodleXML(file, callback) {
    console.log(file);
    let parser = new DOMParser();
    let xmlDoc = "";
    if (isDataURL(file)) {
        let fileReader = new FileReader();
        fileReader.onload = (e)=> {
            try {
                xml2jsonParser(e.srcElement.result, callback);
                callback(true);
            } catch (e) {
                callback(false);
            }
        };
        fileReader.readAsBinaryString(dataURItoBlob(file), callback);
    } else {
        fetch(file).then(res => {
            return res.text();
        }).then(xml => {
            xml2jsonParser(xml);
            callback(true);
        }).catch(e=>{
            callback(false);
        });
    }

}

function xml2jsonParser(xmlDoc, callback) {
    try {
        let xmljson = xml2json.parse(xmlDoc);
        console.log(xmljson);
        let question = {};
        if (xmljson && xmljson.root && xmljson.root.name === "question") {
            let children = xmljson.root.children;
            switch(xmljson.root.attributes.type) {
            case "multichoice":
                // Check if single
                let answers = children.filter(child => child.name === 'answer');
                let answerTexts = answers.map(ans => ans.children.filter(el=>el.name === 'text')[0].content);
                let scores = answers.map(ans => parseInt(ans.attributes.fraction, 0));
                let correctAnswer;

                let single = children.some(child => child.name === 'single');
                if (single) {
                    correctAnswer = scores.indexOf(100);
                } else {
                    correctAnswer = [];
                    scores.map((s, i) => {if (s === 100) {correctAnswer.push(i);}});
                }

                let useNumbers = false;
                let answernumberingobj = children.filter(child => child.name === 'answernumbering');
                if (answernumberingobj && answernumberingobj.length > 0) {
                    useNumbers = answernumberingobj[0].content === '123';
                }
                question = {
                    name: single ? 'MultipleChoice' : 'MultipleAnswer',
                    correctAnswer,
                    answers: answerTexts,
                    useNumbers,
                };
                console.log(question);
                return;
            case "truefalse":
                return;
            case "essay":
                return; // FreeResponse
            case "shortanswer":
            case "numerical":
                return; // InputText
            case "matching":
            case "cloze":
            case "description":
                alert('Not yet supported');
            }

        }

    } catch (e) {
        callback(false);
        alert('No es correcto el JSON');
    }
}

