import Hotel from "../infrastructure/schemas/Hotel";
import {Request, Response, NextFunction} from "express";
import NotFoundError from "../domain/errors/not-found-errors";
import ValidationError from "../domain/errors/validation-error";
import { createHotelDTO } from "../domain/dtos/hotel";
//import stripe from "../infrastructure/stripe";

import OpenAI from "openai";



 
export const getAllHotels = async (req:Request,res:Response, next:NextFunction) => {
   try{ 
    const hotels = await Hotel.find();
    res.status(200).json(hotels);
    return;
   }catch(error){
    next(error);
   }
};

//open ai integration for generate response for the user prompt
export const generateResponse = async(req:Request,res:Response, next:NextFunction) => {

    const { prompt } = req.body;

    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const completion = await openai.chat.completions.create({
    model: "gpt-4o" ,
    messages:[
        {
            role:"user",
            content: prompt,
        },
    ],
    store:true,

    });
    console.log(completion.choices[0].message.content);

    res.status(200).json({
        message:{
            role:"assistant",
            content: completion.choices[0].message.content,
        }, 
    });
    return;




};
export const getHotelById = async(req: Request,res: Response, next:NextFunction) => {
    try{
    const hotelId  = req.params.id;
    const hotel = await Hotel.findById(hotelId);
    if(!hotel){
        throw new NotFoundError("Hotel not found"); 
        return;
    }
    res.status(200).json(hotel);
    return;
}catch(error){
    next(error);
}
};

export const createHotel = async(req:Request,res:Response,next:NextFunction)=> {
try{
    const hotel= createHotelDTO.safeParse(req.body);//safeparse use to validate the data that we get from the request body and check weather it is valid or not and return the result in hotel variable
    //validate the request data that get from DTO hotel.ts to check weather it is valid or not
    if(!hotel.success){
        throw new ValidationError(hotel.error.message);
    }

    /*const stripeProduct = await stripe.products.create({
        name: hotel.data.name,
        description: hotel.data.description,
        default_price_data: {
          unit_amount: Math.round(hotel.data.price * 100),
          currency: "usd",
        },
      });*/

   
    //add the hotel

    await Hotel.create({
        name:hotel.data.name,
        location:hotel.data.location,
        image:hotel.data.image,
        price:parseInt(hotel.data.price),
        description:hotel.data.description,
    });
    //return response
    res.status(201).send();
    return;
}catch(error){
    next(error);
}
};

export const deleteHotel=async(req:Request,res:Response,next:NextFunction)=>{
try{
    const hotelId=req.params.id;
    await Hotel.findByIdAndDelete(hotelId);

    //return response

    res.status(200).send();
    return;
    }catch(error){
        next(error);
    }
}

export const updateHotel= async(req:Request,res:Response, next:NextFunction)=>{
try{
    const hotelId=req.params.hotelId;
    const updateHotel=req.body;

    if(
        !updateHotel.name||
        !updateHotel.location||
        !updateHotel.rating||
        !updateHotel.reviews||
        !updateHotel.image||
        !updateHotel.price||
        !updateHotel.description

    ){
        throw new ValidationError("Invalid hotel data");
    }
    
    await Hotel.findByIdAndUpdate(hotelId,updateHotel);
    res.status(200).send();
    return;
    }catch(error){
        next(error);
    }
};


