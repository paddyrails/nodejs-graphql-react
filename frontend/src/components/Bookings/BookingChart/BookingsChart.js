import React from 'react';
import { BarChart} from 'react-chartjs';

const BOOKINGS_BUCKET = {
    Cheap : {
        min: 0,
        max: 100
    },
    Normal : {
        min : 100,
        max : 200
    },
    Expensive: {
        min : 200,
        max : 1000
    }
}

const bookingsChart = props => {
    const chartData = [];
    for(const bucket in BOOKINGS_BUCKET){
        const filteredBookingsCount = props.bookings.reduce((prev, current) => {
            if(current.event.price < BOOKINGS_BUCKET[bucket].max &&
                current.event.price > BOOKINGS_BUCKET[bucket].min){
                return prev + 1;
            }else {
                return prev;
            }
        }, 0)
        chartData[bucket] = filteredBookingsCount
        console.log(output);
    }
    return(
        <BarChart 
        )
}

export default bookingsChart;