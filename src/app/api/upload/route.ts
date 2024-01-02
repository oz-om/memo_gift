import { retry } from "@/utils/retryOperation";
import saveFile from "@/utils/saveFile";
import { existsSync, unlinkSync } from "fs";
import { join } from "path";

let sessionID: string | null = null;
let deletedOperationHappened: boolean = false;
// generate new session for new connection
export async function GET(req: Request) {
  sessionID = crypto.randomUUID();
  deletedOperationHappened = false;
  return new Response(
    JSON.stringify({
      init: true,
      sessionID,
    }),
    {
      status: 200,
    },
  );
}

let unconfirmedUploadImages: string[] = [];
let startUploadTime: string | Date | number = 0;
let timeIntervalId: NodeJS.Timeout | null = null;
let uploadSession: string | null = null;

// upload request
export async function POST(request: Request, response: Response) {
  let uploadReq = await request.formData();
  let image = uploadReq.get("image") as File;
  let imageId = uploadReq.get("id") as string;
  let clientUploadSession = uploadReq.get("sessionId") as string;

  // for first upload, check if uploadSession is null than update it with the new session that client have
  if (uploadSession == null) {
    uploadSession = clientUploadSession;
  } else {
    // if client come with new session than we know that client is not the previous one that we store before
    if (uploadSession !== clientUploadSession) {
      // so we need to delete  unconfirmed images that previous client left them! if left something
      if (unconfirmedUploadImages.length) {
        unconfirmedUploadImages.forEach(async (image) => {
          const deleteOperation = () => {
            unlinkSync(join(process.cwd(), "public", "images", image));
          };
          // if delete operation fails for any reason retry operation again
          await retry(deleteOperation, 3, 3000);
        });
      }
      // to begin with the new upload session with new uploaded images
      unconfirmedUploadImages = [];
      uploadSession = clientUploadSession;
    }
  }

  if (!image) {
    return new Response(
      JSON.stringify({
        upload: false,
        error: "there is no image selected",
      }),
      {
        status: 400,
      },
    );
  }

  let name = image.name;
  try {
    await saveFile(name, imageId, image);
    unconfirmedUploadImages.push(`upat_${imageId}_${name}`);
    // set new start upload time
    startUploadTime = new Date();
  } catch (error) {
    console.log(error);
    // if there any problem with upload operation
    return new Response(
      JSON.stringify({
        upload: false,
        id: imageId,
        error: "something went wrong? upload failed, please try again!",
      }),
      {
        status: 400,
      },
    );
  }

  // if there is already timer running than clear it
  if (timeIntervalId) {
    console.log("clear the previous timer");
    clearInterval(timeIntervalId);
    timeIntervalId = null;
  }

  console.log("start new waiting timer");
  // start new timer
  timeIntervalId = setInterval(async () => {
    console.log("waiting time was ended, start checking");

    // get the time that passed from start upload time to now
    let currentTime = new Date();
    let timeDifferenceInMilliseconds = currentTime.getTime() - new Date(startUploadTime.toString()).getTime();
    let timeDifferenceInMinutes = timeDifferenceInMilliseconds / 1000 / 60;
    // if passed time more than 1 min
    if (timeDifferenceInMinutes > 1.5) {
      console.log("remove files its long time without confirmation");
      // start delete for unconfirmedImages that client doesn't confirm them to make storage clean
      unconfirmedUploadImages.forEach(async (image) => {
        const deleteOperation = () => {
          unlinkSync(join(process.cwd(), "public", "images", image));
          console.log(join(process.cwd(), "public", "images", image), "was removed");
        };
        // if delete operation fails for any reason retry operation again
        await retry(deleteOperation, 3, 3000);
      });

      // Empty the unconfirmedUploadedImages array
      unconfirmedUploadImages = [];
      // when the delete operation complete clear the timer
      if (timeIntervalId) {
        console.log("i think all deleted, clear timer");
        clearInterval(timeIntervalId);
        timeIntervalId = null;
        deletedOperationHappened = true;
      }
    }
  }, 90000); // 1.5min

  // if upload complete without nay problem
  return new Response(
    JSON.stringify({
      upload: true,
      id: imageId,
      msg: "upload success",
    }),
    {
      status: 200,
    },
  );
}

// confirmation request
export async function PATCH(req: Request, res: Response) {
  let clientImages = await req.json();
  let newClientImages: string[] = clientImages.map((image: { id: string; name: string }) => image.name);
  let confirmedImages: string[] = [];

  // if there is timer running with unconfirmed uploads
  if (timeIntervalId && unconfirmedUploadImages.length && !deletedOperationHappened) {
    // make a comparison between uploaded images that server save and the images that client have
    // (my be client remove some of theme after uploading was completed)
    unconfirmedUploadImages.map(async (image) => {
      // check if the image that in server is not in client images than remove it
      if (!newClientImages.includes(image)) {
        const deleteOperation = () => {
          unlinkSync(join(process.cwd(), "public", "images", image));
          console.log(join(process.cwd(), "public", "images", image), "was removed");
        };
        await retry(deleteOperation, 3, 3000);
      } else {
        // create new array that compatible with what client have
        confirmedImages.push(image);
      }
    });
    // clear the unconfirmed uploads
    unconfirmedUploadImages = [];
    // clear the running timer, To prevent them from being erased
    clearInterval(timeIntervalId);
    timeIntervalId = null;
    console.log("confirm upload, kill timer");

    // make response as we confirmed uploads
    return new Response(
      JSON.stringify({
        msg: "ok we will confirm you uploads.",
        confirmation: true,
        uploads: confirmedImages,
      }),
      {
        status: 200,
      },
    );
  }

  // if there is no running timer that mean we already delete uploads so we make response to upload images again
  return new Response(
    JSON.stringify({
      error: "your images was deleted :(, because you take more than 5 hours to publish, so we think you didn't want to complete item creation, you need to delete this item and reload the page and try again",
      confirmation: false,
    }),
  );
}

function checkFiles(images: string[]): {
  existing: string[];
  deleted: string[];
} {
  let existing: string[] = [];
  let deleted: string[] = [];
  for (const image of images) {
    let path = join(process.cwd(), "public", "images", image);
    if (existsSync(path)) {
      existing.push(image);
    } else {
      deleted.push(image);
    }
  }
  return {
    existing,
    deleted,
  };
}
