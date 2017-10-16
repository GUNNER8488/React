import React from 'react';
import ReactDOM from 'react-dom';
import Axios from 'axios';

const Card = (props) => {
    return (
        <div>
            <img width = "75" src = {props.avatar_url}></img>
            <div style = {{display: 'inline-block', marginLeft : '2em'}}>
                <div style = {{fontWeight: 'bold'}}>{props.login}</div>
                <div>{props.organizations_url} </div>
            </div>
        </div>);
}

class Form extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            userInput: ""
        }
    }

    handleClickEvent = (event) => {
        event.preventDefault();

        Axios.get(`https://api.github.com/users/${this.state.userInput}`)
            .then(resp => {
                this.props.onSubmit(resp.data)
                this.setState({
                        userInput: ""
                    })
            })
    }

    render() {
        return (
            <form onSubmit={this.handleClickEvent}>
                <input type = "text"
                       onChange={(event)=>{
                           this.setState({
                               userInput: event.target.value
                           })
                       }}
                       value = {this.state.userInput}
                       //ref = {(input) => {this.userInput = input}}
                       placeholder="Github User" required></input>
                <button type = "submit"> Submit </button>
            </form>
        );
    }
}

const CardList = (props) => {
    return (
        <div>
            {props.cards.map(card => <Card key = {card.id} login = {card.login}  avatar_url = {card.avatar_url} organizations_url = {card.organizations_url}/>)}
        </div>
    );
}

class App extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            cards: [

            ]
        }

    }

    addNewCard = (cardInfo) => {

        this.setState(prevState => ({
            cards: prevState.cards.concat(cardInfo)
        }))
    }
    render(){
        return (
            <div>
                <Form onSubmit= {this.addNewCard }/>
                <CardList cards = {this.state.cards}/>
            </div>
        );
    }

}
ReactDOM.render(<App/>, document.getElementById("root"));