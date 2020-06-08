import React, { Component } from 'react';
import './EventItem.css';
import Backdrop from '../../Backdrop/Backdrop';
import Modal from '../../Modal/Modal';
import EventDetails from '../EventDetails/EventDetails';
import AuthContext from '../../../context/auth-context';


class EventItem extends Component {
    state = {
        showDetails : false
    }

    static contextType = AuthContext;

    showModalHandler = () => {
        this.setState({showDetails: true});
    }

    modalCancelHandler = () => {
        this.setState({showDetails: false});
    }

    bookEventhandler = () => {

        if(!this.context.token){
            return;
        }

        const requestBody = {
            query : `
                mutation {
                    bookEvent(eventId: "${this.props.event._id}"){
                        _id                        
                        updatedAt
                        createdAt
                      }
                }
            `
        }

        const token =  this.context.token;
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
            console.log(resData.data);
        })
        .catch(err => {
            console.log(err);
        })

        
    }
    
    render(){
        return (
            <React.Fragment>
                { this.state.showDetails ?
                    <React.Fragment>
                        <Backdrop click={this.modalCancelHandler}/>
                        <Modal 
                            canCancel 
                            canConfirm 
                            title="Event Details"  
                            cancel={this.modalCancelHandler}
                            confirm={this.bookEventhandler}
                            >
                            <EventDetails event={this.props.event}/>        
                        </Modal>                            
                    </React.Fragment>
                    : null
                }
                <li className="events__list-item">
                    <div><h1>{this.props.event.title}</h1>
                    <h2>${this.props.event.price} - {new Date(this.props.event.date).toLocaleDateString('en-us')}</h2>
                    </div>
                    <div >
                        { this.props.userId === this.props.event.creator._id ? <p>You are the owner of this event</p> :
                            <button className="btn" onClick={this.showModalHandler}>View Details</button>
                        }
                    </div>

                </li>
            </React.Fragment>
    )
    }
}

export default EventItem;