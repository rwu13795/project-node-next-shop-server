import { Request, Response } from "express";

/* send (1) product id 
        (2) preview image Url for each color
        (3) an array contains all colors
*/

export const getProducts = async (req: Request, res: Response) => {
  const param = req.params;

  console.log(param);

  res.status(200).send({ message: "OK" });
};
