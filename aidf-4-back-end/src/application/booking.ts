import { clerkClient } from '@clerk/express';
import { createBookingDTO } from '../domain/dtos/booking';
import Booking from '../infrastructure/schemas/Booking';
import { Request, Response, NextFunction } from 'express';
import Hotel from '../infrastructure/schemas/Hotel';
import { AuthRequest } from '../types/auth-request';
import NotFoundError from '../domain/errors/not-found-errors';



export const createBooking = async (req: AuthRequest, res: Response, next: NextFunction) => {

  try {
    const booking = createBookingDTO.safeParse(req.body);
    console.log(booking);

    // validate the request data also we dont get user id like this we get it from clerk session
    if (!booking.success) {
      throw new Error(booking.error.message);
    }

    console.log(req.auth);
    const userId = req.auth?.userId;//to get user id from clerk session

    //add the booking
    await Booking.create({
      hotelId: booking.data.hotelId,
      userId: userId,
      checkIn: booking.data.checkIn,
      checkOut: booking.data.checkOut,
      roomNumber: await (async () => {
        let roomNumber;
        let isRoomAvailable = false;
      
        while (!isRoomAvailable) {
          roomNumber = Math.floor(Math.random() * 1000) + 1;
      
          const existingBooking = await Booking.findOne({
            hotelId: booking.data.hotelId,
            roomNumber,
            $or: [
              {
                checkIn: { $lte: booking.data.checkOut },
                checkOut: { $gte: booking.data.checkIn },
              },
            ],
          });
      
          isRoomAvailable = !existingBooking;
        }
      
        return roomNumber;
      })(),
    });
    //return the response

    res.status(201).send();
    return;
  } catch (error) {
    next(error);
  }

};

export const getAllBookingsForHotel = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const hotelId = req.params.hotelId;
    const bookings = await Booking.find({ hotelId: hotelId })//.populate("userId"); we cannot add this one because we dont have user db we get user information from clerk session so we need to send user information with the booking deatail in the response
    //while we getting a promise here we cannit go through network boundry by promise bcs of that we need to use promise all to get user information for each booking and send it with the booking deatail in the response
    const bookingsWithUser = await Promise.all(bookings.map(async (el) => {
      const user = await clerkClient.users.getUser(el.userId);
      return { _id: el._id, hotelId: el.hotelId, checkIn: el.checkIn, checkOut: el.checkOut, roomNumber: el.roomNumber, user: { id: user.id, firstName: user.firstName, lastName: user.lastName, } };
    }))

    res.status(200).json(bookingsWithUser);
    return;
  } catch (error) {
    next(error);
  }

};
//here we implement a part to send user information with the booking deatail we cannot do populate beacuse we dont get user db but we get user information from clerk session so we need to send user information with the booking deatail in the response
export const getAllBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
    return;
  } catch (error) {
    next(error);

  }
};

  export const getBookingById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const bookingId = req.params.bookingId;
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        throw new NotFoundError("Booking not found");
      }
      res.status(200).json(booking);
      return;
    } catch (error) {
      next(error);
    }

};