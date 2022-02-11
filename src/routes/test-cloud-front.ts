import { Request, Response, NextFunction } from "express";

import { asyncWrapper } from "../middlewares";
import cloudFront_signer from "../utils/cloudFront-signer";

export const testCloudFront = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    /**********   test signed url    **********/
    // const fiveMin = 1000 * 60 * 5;
    //   const signedUrl = signer.getSignedUrl({
    //     url: `${process.env.CLOUD_FRONT_URL}/testing/cat1.jpg`,
    //     // the "expires", is the exact expiration date, NOT a expiration timer
    //     expires: Math.floor((Date.now() + fiveMin) / 1000),
    //   });

    const folder_1 = `${process.env.CLOUD_FRONT_URL}/testing-1/abc/*`;
    const folder_2 = `${process.env.CLOUD_FRONT_URL}/testing-2/abc/*`;

    const policy_1 = JSON.stringify({
      Statement: [
        {
          Resource: folder_1,
          Condition: {
            DateLessThan: {
              "AWS:EpochTime":
                Math.floor(new Date().getTime() / 1000) + 60 * 60 * 5,
              // Current Time in UTC + time in seconds, (60 * 60 * 24 = 24 hours)
            },
          },
        },
      ],
    });
    const policy_2 = JSON.stringify({
      Statement: [
        {
          Resource: folder_2,
          Condition: {
            DateLessThan: {
              "AWS:EpochTime":
                Math.floor(new Date().getTime() / 1000) + 60 * 60 * 5,
              // Current Time in UTC + time in seconds, (60 * 60 * 24 = 24 hours)
            },
          },
        },
      ],
    });

    const cookie_test1 = cloudFront_signer.getSignedCookie({
      policy: policy_1,
    });
    const cookie_test2 = cloudFront_signer.getSignedCookie({
      policy: policy_2,
    });

    // only set the "CloudFront-Key-Pair-Id" once since, it is the same for the all cookies
    res.cookie(
      "CloudFront-Key-Pair-Id",
      cookie_test1["CloudFront-Key-Pair-Id"],
      {
        domain: "node-next-shop-rw.store",
        httpOnly: true,
        // the root path of the CLOUD_FRONT_UR
        path: "/",
      }
    );

    // set Policy and Signature for the 2 differnt folders
    res.cookie("CloudFront-Policy", cookie_test1["CloudFront-Policy"], {
      domain: "node-next-shop-rw.store",
      httpOnly: true,
      path: "/testing-1",
    });
    // the corresponding path of which the img source in the client contains
    res.cookie("CloudFront-Signature", cookie_test1["CloudFront-Signature"], {
      domain: "node-next-shop-rw.store",
      httpOnly: true,
      path: "/testing-1",
    });
    res.cookie("CloudFront-Policy", cookie_test2["CloudFront-Policy"], {
      domain: "node-next-shop-rw.store",
      httpOnly: true,
      path: "/testing-2",
    });
    res.cookie("CloudFront-Signature", cookie_test2["CloudFront-Signature"], {
      domain: "node-next-shop-rw.store",
      httpOnly: true,
      path: "/testing-2",
    });

    res.status(200).send("OK");
  }
);

// NOTE //
/* 
 (1) the folder_1 = `${process.env.CLOUD_FRONT_URL}/testing-1/abc/*
     is the path where the user can access with signed cookie
     all the content inside the /testing-1/abc folder are accessible

 (2) path in the res.cookie
  
    - in "CloudFront-Key-Pair-Id", the path should be set to the root path "/"
      of the cloudFront. Only one "CloudFront-Key-Pair-Id" cookie should be set
      
    - 2 different folders
      we need to set "CloudFront-Signature" and "CloudFront-Policy" cookies for
      the 2 different folders
      the cookies to access these 2 folder should have DIFFERENT PATH
      
      - for example, an image in the client requires the source from CLOUD_FRONT_URL/testing-2/abc/2.jpg
        and folder /testing-2 can only be accessible with the cookie containing the 
        test2 "CloudFront-Signature", and the path in side this cookie has to be set
        as "/testing-2". If the path does match the image required source path /testing-2/abc/2.jpg,
        the cookie won't be set by the browser!
      
      - Even though the cooike path is set the /testing-2, user will not be able to
        access all the sub-folder in the /testing-2, since the policy only signs the
        sub-folder /testing-2/abc, only this sub-folder /abc will be accessible!

*/
