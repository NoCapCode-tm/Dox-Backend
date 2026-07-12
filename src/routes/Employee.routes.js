import {Router} from "express"
import {  acknowledgment, employeelogin, getuser, onboardingdetails } from "../controller/Employee.controller.js"
import { verifyjwt } from "../middleware/auth.middleware.js"
import { upload } from "../middleware/multer.middleware.js"

const employeerouter = Router()
//post api
employeerouter.route("/login").post(employeelogin)
//get api
employeerouter.route("/getuser").get(verifyjwt,getuser)
//patch api
employeerouter.route("/acknowledge").get(verifyjwt,acknowledgment) //post api

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



export {employeerouter}