import express from 'express';
import{ getAllHotels, createHotel, updateHotel, deleteHotel, getHotelById, generateResponse } from './../application/hotel';  
import { isAuthenticated } from './middlewares/authentication-middleware';
import { isAdmin } from './middlewares/authorization-middleware';
import { createEmbeddings } from '../application/embedding';
import { retrieve } from '../application/retrieve';

//here we create the hotel router to create maps between req and response 
const hotelsRouter =express.Router();

hotelsRouter.get('/', getAllHotels);
hotelsRouter.route("/llm").post(generateResponse)
// POST /embeddings/create: Generate embeddings for hotel data
hotelsRouter.route("/embeddings/create").post(createEmbeddings)
// GET /search/retrieve: Perform semantic search on hotels
hotelsRouter.route("/search/retrieve").get(retrieve)
hotelsRouter.get('/:id', getHotelById);
hotelsRouter.post('/', isAuthenticated,isAdmin, createHotel);    
hotelsRouter.put('/:id', updateHotel);
hotelsRouter.delete('/:id', deleteHotel);

//another way to write the above code
/*hotelsRouter.route("/").get(getAllHotels).post(createHotel);
hotelsRouter.route("/:id")
        .get(getHotelById)
        .put(udpdateHotel0
        .delete(deleteHotel);*/ 

export default hotelsRouter;
