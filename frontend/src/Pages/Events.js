import React, {Component} from 'react';
import './Events.css';
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import AuthContext from '../context/auth-context';
import EventsList from '../components/Events/EventsList/EventsList';
import Spinner from '../components/Spinner/Spinner';


class EventsPage extends Component {
    constructor(props){
        super(props)
        this.titleEl = React.createRef();
        this.descriptionEl = React.createRef();
        this.priceEl = React.createRef();
        this.dateEl = React.createRef();
    }

    static contextType = AuthContext;

    state = {
        creating : false,
        events: [],
        isLoading: false,
        
    }

    isActive = true;

    componentDidMount(){
        console.log("in mount")
        this.fetchEvents();
    }

    startCreateEventHandler = () => {
        this.setState({creating: true});
    }

    modalCancelHandler = () => {
        this.setState({creating: false});
    }

    modalConfirmHandler = () => {
        const title = this.titleEl.current.value;
        const description = this.descriptionEl.current.value;
        const price = +this.priceEl.current.value;
        const date = this.dateEl.current.value;

        if(
            title.trim().length === 0 ||
            description.trim().length === 0 ||
            price <= 0 ||
            date.trim().length === 0 
        ){
            return;
        }

        const event = {title, description, price, date};
        console.log(event);
        const requestBody = {
            query : `
                mutation CreateEvent ($title: String!, $description: String!, $price: Float!, $date: String!    ) {
                    createEvent(eventInput : {
                        title: $title, 
                        description: $description,
                        price: $price,
                        date: $date
                    }){
                        _id
                        title
                        description                        
                        price
                        date
                    }
                }
            `, 
            variables:{
                title: title,
                description: description,
                price: price,
                date: date
            }
        }

        const token =  this.context.token;
        console.log(token);
        fetch("http://localhost:3000/graphql", {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type' : 'application/json',
                'Authorization': "Bearer " + token
            }
        })
        .then(res => {
            if(res.status !== 200 && res.status === 201){
                throw new Error("Failed!");
            }
            return res.json();
        })
        .then(resData => {
            this.setState(prevState => {
                const updatedEvents = [...prevState.events];
                updatedEvents.push({
                    _id: resData.data.createEvent._id,
                    title: resData.data.createEvent.title,
                    description: resData.data.createEvent.description,
                    date: resData.data.createEvent.date,
                    price: resData.data.createEvent.price,
                    creator : {
                        _id: this.context.userId
                    }
                });
                return {events: updatedEvents};
            })
        })
        .catch(err => {
            console.log(err);
        })

        this.setState({creating: false});
    }
    
    fetchEvents =()=>{
        this.setState({isLoading:true});
        console.log("in fetch events")
        const requestBody = {
            query : `
                query {
                    events {
                        _id
                        title
                        description
                        price
                        date
                        creator {
                            _id
                        }
                    }
                }
            `
        }

        fetch("http://localhost:3000/graphql", {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type' : 'application/json'                
            }
        })
        .then(res => {
            if(res.status !== 200 && res.status === 201){
                throw new Error("Failed!");
            }
            return res.json();
        })
        .then(resData => {            
            const events = resData.data.events;
            if(this.isActive){
             this.setState({events: events, isLoading: false})
            }
            //)
        })
        .catch(err => {
            console.log(err);
            this.setState({isLoading: false})
        })
    }

    componentWillUnmount(){
        this.isActive = false;
    }

    render(){
        
        return(
            <React.Fragment>
                {this.state.creating && 
                    <React.Fragment>
                        <Backdrop/>
                        <Modal 
                            canCancel 
                            canConfirm 
                            title="Add Event" 
                            cancel={this.modalCancelHandler}
                            confirm={this.modalConfirmHandler}
                            >
                            <form>
                                <div className="form-control">
                                    <label htmlFor="title">Title</label>
                                    <input ref={this.titleEl} type="text" id="title"></input>
                                </div>
                                <div className="form-control">
                                    <label htmlFor="description">Description</label>
                                    <input ref={this.descriptionEl} type="textarea" id="description"></input>
                                </div>
                                <div className="form-control">
                                    <label htmlFor="price">Price</label>
                                    <input type="text" id="price" ref={this.priceEl}></input>
                                </div>
                                <div className="form-control">
                                    <label htmlFor="date">Date</label>
                                    <input type="datetime-local" id="date" ref={this.dateEl}></input>
                                </div>
                            </form>
                        </Modal> 
                    </React.Fragment>
                }
                {this.context.token &&
                <div className="events-control">
                    <p>Share your events!</p>
                    <button className="btn" onClick={this.startCreateEventHandler}>Create Event</button>
                </div>
                }
                {this.isLoading ? <Spinner/> :
                <EventsList events={this.state.events} userId={this.context.userId}/>                
            }

            </React.Fragment>
        )
    }
}

export default EventsPage;