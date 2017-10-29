import React from 'react';
import ReactDOM from 'react-dom';
import {Icon} from 'react-fa';
import 'react-fa';
import 'bootstrap-css-modules/css/row.css';
import 'bootstrap-css-modules/css/columns.css';
import 'bootstrap-css-modules/css/container.css';
import 'bootstrap-css-modules/css/card.css';
import './index.css';
import _ from 'lodash';

const Stars = (props) => {
    var stars = [];
    for (var i=0; i<props.num; i++){
        stars.push(<Icon  key= {i} name="star" className = "star"/>)
    }
    return (
        <div className= "col4">
            {stars}
        </div>
    );
};

const Answer = (props) => {
    return (<div className= "col5">
        {props.selectedNumbers.map((number, i)=>{
                return <span key = {i} onClick = {()=>{
                    props.unSelectNumber(number)
                }}>{number} </span>
            }
        )}
    </div>);
};

const Numbers = (props) => {
    const arrOfNums = _.range(1,10);
    const numberClass= (num)=>{

        if(props.selectedNumbers.indexOf(num) >=0)
            return 'selected';
        if(props.usedNumbers.indexOf(num) >= 0)
            return 'used';

        return '';
    }
    return (<div className="card text-center">
        <div>
            {arrOfNums.map((number, i)=>{
                return <span key = {i} className={numberClass(number)}
                             onClick = {()=>{
                                            if(props.selectedNumbers.indexOf(number) >= 0 || props.usedNumbers.indexOf(number) >= 0){
                                                return;
                                            }
                                            props.selectNumber(number)}}>{number}</span>
                                        })}
            </div>
    </div>);
};

const Button = (props) => {
    var button;
    if(props.isCorrect){
        button = <button>
            <i className="fa fa-check" onClick={props.acceptAnswer()}></i>
        </button>
    }
    else if (props.isCorrect === false){
        button = <button>
            <i className="fa fa-times"></i>
        </button>
    }
    else{
        button =  <button disabled={!props.selectedNumbersLength} onClick={()=>{
            props.checkAnswer()
        }}>=</button>
    }
    return (
        <div className= "col1">
            {button}
            <br/>
            <br/>
            <button disabled={props.redraws === 0}>
                <i className="fa fa-refresh" onClick={()=>{props.redraw()}} >{props.redraws}</i>
            </button>
        </div>);
};

const DoneFrame = (props) => {
    return (<div className="card text-center">
        <h3>{props.doneStatus}</h3>
    </div>);
};

class Game extends  React.Component {
    state = {
        selectedNumbers : [],
        usedNumbers : [],
        number : 1 + Math.floor(Math.random() * 9),
        isCorrect: null,
        redraws: 5,
        doneStatus: null
    };

    selectNumber  = (number)=>{
        this.setState(
            (prevState)=>{
                return {
                    selectedNumbers: prevState.selectedNumbers.concat(number),
                    isCorrect: null
                }
            }
        );
    }

    unSelectNumber = (number) => {
        this.setState(
            (prevState)=>{
                var idx = prevState.selectedNumbers.indexOf(number);
                prevState.selectedNumbers.splice(idx, 1);
                return {
                    selectedNumbers: prevState.selectedNumbers,
                    isCorrect: null
                }
            }
        );
    }

    acceptAnswer = ()=>{
        this.setState(
            (prevState)=>{
                return {
                    usedNumbers : prevState.usedNumbers.concat(prevState.selectedNumbers),
                    selectedNumbers : [],
                    isCorrect: null,
                    number: 1 + Math.floor(Math.random() * 9)
                }
            }, this.updateDoneStatus
        );
    }

    checkAnswer = () => {
        this.setState (
            (prevState)=>{
                return {
                    isCorrect: prevState.number === prevState.selectedNumbers.reduce((accumulator, currentValue)=>{
                        return (accumulator + currentValue) || 0;
                    })
                }
            }
        )

    }

    redraw = () => {
        if(this.state.redraws === 0) return;
        this.setState (
            (prevState)=>{
                return {
                    isCorrect:null,
                    selectedNumbers:[],
                    redraws: prevState.redraws - 1,
                    number : 1 + Math.floor(Math.random() * 9)
                }
            }
        )
    }

    updateDoneStatus = () => {

        const haveCombinations = (arr, sum, i) => {
            if(!sum){
                return true;
            }
            if(sum < 0 || i >= arr.length){
                return false;
            }

            return haveCombinations (arr, sum - arr[i], i+1) || haveCombinations (arr, sum, i+1);
        }
        const havePossibleSolutions = (arr, sum) => {

            let arrOfNums = _.range(1,10);

            arrOfNums = arrOfNums.filter((num, i)=>{
                return !arr.includes(num);
            });

            return haveCombinations(arrOfNums, sum, 0);
        }

        this.setState (
            (prevState) => {

                if(prevState.usedNumbers.length === 9){
                    return {
                        doneStatus: "Game Over! You rock"
                    }
                }
                else if(!prevState.redraws && !havePossibleSolutions(prevState.usedNumbers, prevState.number)){
                    return {
                        doneStatus: "Game Over! You Suck"
                    }
                }
            }
        )



    }

    render() {
        return (
        <div className="container">
        <h3> Play Nine</h3>
            <hr/>
        <div className = "row">
            <Stars num = {this.state.number}/>
            <Button selectedNumbersLength = {this.state.selectedNumbers.length}
                checkAnswer = {this.checkAnswer}
                isCorrect = {this.state.isCorrect}
                acceptAnswer = {this.acceptAnswer}
                redraws = {this.state.redraws}
                redraw = {this.redraw}/>
            <Answer selectedNumbers = {this.state.selectedNumbers}
                unSelectNumber = {this.unSelectNumber}/>
        </div>
            {this.state.doneStatus?
                <DoneFrame doneStatus = {this.state.doneStatus}/>:
                <Numbers selectedNumbers = {this.state.selectedNumbers}
                         usedNumbers = {this.state.usedNumbers}
                    selectNumber = {this.selectNumber}/>
            }

        </div>

        );
    }
}
const App  = (props)=> {
    return (
        <Game/>
    );
}

ReactDOM.render(<App/>,
    document.getElementById('root'));


