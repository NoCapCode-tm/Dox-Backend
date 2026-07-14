import {Router} from "express"

import {  acknowledgment, employeelogin,logout, getuser, onboardingdetails } from "../controller/Employee.controller.js"
import { verifyjwt } from "../middleware/auth.middleware.js"
import { upload } from "../middleware/multer.middleware.js"

const employeerouter = Router()

employeerouter.route("/login").post(employeelogin) //post api

employeerouter.route("/getuser").get(verifyjwt,getuser) //get api


// FIXED: Changed from .get to .post so it can receive req.body
employeerouter.route("/acknowledge").post(verifyjwt, acknowledgment)

//patch api
employeerouter.route("/onboarding/:step").patch(  
  verifyjwt,
  upload.fields([
    { name: "govid1image", maxCount: 1 },
    { name: "govid2image", maxCount: 1 },
    { name: "passportimage", maxCount: 1 },
    { name: "collegeid", maxCount: 1 }
  ]),
  onboardingdetails
);
employeerouter.route("/logout").get(logout)



export {employeerouter}