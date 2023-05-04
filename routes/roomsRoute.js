const express = require('express');
const router = express.Router();
const Room = require('../models/room');

//get all rooms details
router.get('/getallrooms', async (req, res) => {
    try {
        const rooms = await Room.find({});
        return res.send(rooms); // if do res.json(rooms({rooms})) then ye array answer ko ek object ke ander daal kr dega
    } catch (error) {
        return res.status(400).json({ message: error });
    }
})

//get room
router.post('/getroombyid', async (req, res) => {
    // const { roomid } = req.body;
    const roomid = req.body.roomid;
    try {
        const room = await Room.findOne({ _id: roomid });
        // const room = await Room.findById(roomid);
        return res.send(room); // if do res.json(rooms({rooms})) then ye array answer ko ek object ke ander daal kr dega
    } catch (error) {
        // return res.status(400).json({ message: error });
        console.log(error)
    }
})


//admin : add room
router.post('/addroom', async (req, res) => {

    try {
        const newroom = new Room(req.body);
        await newroom.save();
        res.send('new room added successfully')
    } catch (error) {
        return res.status(400).json({ message: "error in backend in user route in add room ", error })
    }
})

module.exports = router;