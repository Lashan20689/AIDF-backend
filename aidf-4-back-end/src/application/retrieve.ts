import { Request, Response, NextFunction } from 'express';
import Hotel from '../infrastructure/schemas/Hotel';
import mongoose from 'mongoose';
import { OpenAIEmbeddings } from '@langchain/openai';
import { MongoDBAtlasVectorSearch } from '@langchain/mongodb';



export const retrieve =async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const {query}=req.query;


        //if no query was provide return all hotels

        if(!query || query === ""){
            const hotels = (await Hotel.find()).map((hotel) => ({
                hotel:hotel,
                confidence:1,
            }));



            res.status(200).json(hotels);
            return;
            
        }

        //initialize the sane embedding model used to creating vector 

        const embeddingModel = new OpenAIEmbeddings({
            model:"text-embedding-ada-002",
            apiKey:process.env.OPENAI_API_KEY,
        });

        //connect to vectore database with specified collection and index name

        const vectorIndex = new MongoDBAtlasVectorSearch(embeddingModel, {
            collection: mongoose.connection.collection("hotelVectors") as any,
            indexName: "vector_index",
        });

        //perform similarity search with the user query and get the top  4 most relevant hotels
        //this converts query into vector and search in vector database and return the most relevant hotels with confidence score

        const results = await vectorIndex.similaritySearchWithScore(query as string);
        console.log(results);

        //map vectoe search result back to actual hotel object with confidence score and document

        const matchHotels = await Promise.all(results.map(async(result) => {
            const hotel = await Hotel.findById(result[0].metadata._id); 
            return{
                hotel:hotel,
                confidence:result[1],
            };
            } )
        );
        //retueb top 4 results or all if less than 4 results found
        
        res.status(200).json(matchHotels.length > 4 ? matchHotels.slice(0,4) : matchHotels);
        return;
    }catch(error){
        next(error);

    }
return;


};