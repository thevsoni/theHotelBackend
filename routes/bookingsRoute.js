const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const Room = require('../models/room');
const moment = require('moment');
const stripe = require('stripe')('sk_test_51MoVrqSJh1BoeGIOXsBgVlXqKA66WKcAF6gG3ATUCtwmi7SLdhm1yBGwFj7tFqgBoqJcOU0OQOCmlzXRr45Qspui00hEP22L8K')
//for payment

const { v4: uuidv4 } = require('uuid'); //to generate unique transaction id every time


//with payment mode
/*
router.post('/bookroom', async (req, res) => {

    const {
        room,
        userid,
        fromdate,
        todate,
        totalamount,
        totaldays,
        token
    } = req.body;


    //for payment code
    try {

        const customer = await stripe.customers.create({
            email: token.email,
            source: token.id
        })
        const payment = await stripe.charges.create({
            amount: totalamount * 100,
            customer: customer.id,
            currency: 'inr',
            receipt_email: token.email
        }, {
            idempotencyKey: uuidv4()
        })


        //if payment success then i will do further procceds else no 
        if (payment) {

            //i am not giving any payment integration option then 
            // only this below part, i have to write

            // try {
            const newbooking = new Booking({

                room: room.name,
                roomid: room._id,
                userid,
                fromdate,
                todate,
                //if in database ,our date will not store in dd-mm-yyyy form then 
                //install moment in backend also 
                // fromdate: moment(fromdate).format('MM-DD-YYYY'),
                // todate: moment(todate).format('MM-DD-YYYY'),
                totalamount,
                totaldays,
                transactionid: "12345",

            })
            const booking = await newbooking.save()

            //updating currentbooking field in room model
            const roomtemp = await Room.findOne({ _id: room._id })

            roomtemp.currentbookings.push({ bookingid: booking._id, fromdate, todate, userid, status: booking.status })
            // roomtemp.currentbookings.push({ bookingid: booking._id, fromdate: fromdate, todate: todate, userid: userid, status: booking.status })
            //both things works

            // console.log(roomtemp.currentbookings);
            // await roomtemp.save(); //updating this roomtemp but this is not working and giving error

            //so lets use something else
            await Room.findByIdAndUpdate({ _id: room._id }, { $set: roomtemp }, { new: true });

          


            return res.status(200).send("success on bookingRoute")


        }
        res.send("Payment Successful, Your room is booked")

    } catch (error) {
        return res.status(400).json({ error });
    }


})
*/

//without payment
router.post('/bookroom', async (req, res) => {

    const {
        room,
        userid,
        fromdate,
        todate,
        totalamount,
        totaldays,
    } = req.body;



    try {
        const newbooking = new Booking({

            room: room.name,
            roomid: room._id,
            userid,
            fromdate,
            todate,
            //if in database ,our date will not store in dd-mm-yyyy form then 
            //install moment in backend also 
            // fromdate: moment(fromdate).format('MM-DD-YYYY'),
            // todate: moment(todate).format('MM-DD-YYYY'),
            totalamount,
            totaldays,
            transactionid: "12345",

        })
        const booking = await newbooking.save()

        //updating currentbooking field in room model
        const roomtemp = await Room.findOne({ _id: room._id })

        roomtemp.currentbookings.push({ bookingid: booking._id, fromdate, todate, userid, status: booking.status })
        // roomtemp.currentbookings.push({ bookingid: booking._id, fromdate: fromdate, todate: todate, userid: userid, status: booking.status })
        //both things works

        // console.log(roomtemp.currentbookings);
        // await roomtemp.save(); //updating this roomtemp but this is not working and giving error
        //so lets use something else
        await Room.findByIdAndUpdate({ _id: room._id }, { $set: roomtemp }, { new: true });

        /*
        await Room.findByIdAndUpdate({ _id: room._id }, {
            $set: {
                currentbookings: currentbookings.push({ bookingid: booking._id, fromdate, todate, userid, status: booking.status })
            }
        }, { new: true });
 
        //it is not working ,i have to check why it is not working bcs isse 2 bar search krna pad raha hai
        */



        return res.status(200).send("success on bookingRoute")
    } catch (error) {
        return res.status(400).json({ where: "failed on bookingRoute", message: error })
    }


})

//get bookings by user id
router.post('/getbookingsbyuserid', async (req, res) => {
    const userid = req.body.userid;

    try {
        const bookings = await Booking.find({ userid: userid })

        return res.send(bookings);
        // const bookings = Booking.find({userid}) //it  will also work
    } catch (error) {
        return res.status(400).json({ error, message: "error in /bookings/getbookingsbyuserid" });
    }
})


//cancel booking
router.post('/cancelbooking', async (req, res) => {

    const { bookingid, roomid } = req.body

    try {
        const booking = await Booking.findOne({ _id: bookingid })
        booking.status = 'cancelled'
        await booking.save()

        const room = await Room.findOne({ _id: roomid });
        const bookings = room.currentbookings
        const temp = bookings.filter(booking => booking.bookingid.toString() !== bookingid)
        room.currentbookings = temp;
        // await room.save(); //i have a doubt why it is not working

        //alternate ,i can findByIdAndUpdate
        await Room.findByIdAndUpdate({ _id: roomid }, { $set: room }, { new: true })

        res.send("your booking cancelled succeessfully")
    } catch (error) {

        return res.status(400).json({ message: "error in cancel booking backend", error });
    }
})


//admin:getallbookings
router.get('/getallbookings', async (req, res) => {

    try {
        const bookings = await Booking.find()
        res.send(bookings);
        // res.json(bookings);
        // res.json({ bookings });
    } catch (error) {
        return res.status(400).json({ error });
    }
})


module.exports = router; 