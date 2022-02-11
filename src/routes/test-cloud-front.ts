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

    const folder_1 = `${process.env.CLOUD_FRONT_URL}/testing/test-1/*`;
    const folder_2 = `${process.env.CLOUD_FRONT_URL}/testing/test-2/*`;

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
        // the path is the parent folder of the folder_1 and folder_2
        path: "/test-page",
      }
    );

    // set Policy and Signature for 2 differnt folders
    res.cookie("CloudFront-Policy", cookie_test1["CloudFront-Policy"], {
      domain: "node-next-shop-rw.store",
      httpOnly: true,
      // the corresponding path which the cookie let the user access
      path: "/test-page/test-1",
    });
    res.cookie("CloudFront-Signature", cookie_test1["CloudFront-Signature"], {
      domain: "node-next-shop-rw.store",
      httpOnly: true,
      path: "/test-page/test-1",
    });
    res.cookie("CloudFront-Policy", cookie_test2["CloudFront-Policy"], {
      domain: "node-next-shop-rw.store",
      httpOnly: true,
      path: "/test-page/test-2",
    });
    res.cookie("CloudFront-Signature", cookie_test2["CloudFront-Signature"], {
      domain: "node-next-shop-rw.store",
      httpOnly: true,
      path: "/test-page/test-2",
    });

    res.status(200).send("OK");
  }
);
