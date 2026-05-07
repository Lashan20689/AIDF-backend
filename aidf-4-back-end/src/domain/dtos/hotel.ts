//DTO => domain transfer object here is to check the validate data in the shape of hotel object and then pass it to the application layer to create a hotel

import {z} from "zod";

 export const createHotelDTO = z.object({
    name:z.string(),
    location:z.string(),
    image:z.string(),
    price:z.string(),
    description:z.string(),

});

