import { Request, Response } from "express";

/* send (1) product id 
        (2) all image Url for each color
        (3) colors array, sizes array
        (4) price, stock, description
*/

export const getProductDetail = async (req: Request, res: Response) => {
  res.status(200).send({ message: "OK" });
};
