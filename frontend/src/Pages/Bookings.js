import React, {Component} from 'react';
import AuthContext from '../context/auth-context';
import BookingList from '../components/Bookings/BookingList/BookingList';
import BookingsChart from '../components/Bookings/BookingChart/BookingsChart';
import BookingControl from '../components/Bookings/BookingsControl/BookingsControl';

class BookingsPage extends Component {

    state = {
        isLoading: false,
        bookings: [],
        outputType: 'list'
    }

    isActive = true;

    static contextType = AuthContext;

    componentDidMount(){
        this.fetchBookings();
    }

    componentWillUnmount(){
        this.Active = false;
    }

    cancelBookingHandler = (bookingId) => {
        
        const requestBody = {
            query : `
                mutation CancelBooking($id: ID!){
                    cancelBooking(bookingId: $id){
                        _id
                        title                        
                    }
                }
            `,
            variables: {
                id: bookingId
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
            console.log(resData.data);
            let updatedBookings = [...this.state.bookings];
            const index = updatedBookings.findIndex(booking => booking._id === bookingId)
            updatedBookings.splice(index, 1);
            this.setState({bookings: updatedBookings});
        })
        .catch(err => {
            console.log(err);
        })

    }


    fetchBookings =()=>{
        this.setState({isLoading:true});
        const requestBody = {
            query : `
                query {
                    bookings {
                        _id
                        createdAt
                        event {
                            _id
                            title
                            price
                            description
                            date
                        }
                    }
                }
            `
        }

        fetch("http://localhost:3000/graphql", {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : "Bearer " + this.context.token
            }
        })
        .then(res => {
            if(res.status !== 200 && res.status === 201){
                throw new Error("Failed!");
            }
            return res.json();
        })
        .then(resData => {            
            const bookings = resData.data.bookings;            
            this.setState({bookings: bookings, isLoading: false})                        
        })
        .catch(err => {
            console.log(err);
            this.setState({isLoading: false})
        })
    }

    changeOutputTypeHandler = (outputType) => {
        if(outputType === 'list'){
            this.setState({outputType: 'list'})
        }else{
            this.setState({outputType: 'chart'})
        }
    }

    render(){
      

        return(
            <React.Fragment>
                    <BookingControl onChange={this.changeOutputTypeHandler} activeOutputType={this.state.outputType}/>
                    <div>
                        {this.state.outputType === 'list' ?
                            <BookingList bookings={this.state.bookings} cancelBooking={this.cancelBookingHandler}/> :
                            <BookingsChart bookings={this.state.bookings}/>
                        }
                    </div>
                </React.Fragment>
        )
    }
}

export default BookingsPage;