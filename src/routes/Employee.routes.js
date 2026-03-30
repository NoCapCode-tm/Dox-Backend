import {Router} from "express"
import {  employeelogin, getuser, onboardingdetails } from "../controller/Employee.controller.js"
import { verifyjwt } from "../middleware/auth.middleware.js"
import { upload } from "../middleware/multer.middleware.js"

const employeerouter = Router()
//post api
employeerouter.route("/login").post(employeelogin)
//get api
employeerouter.route("/getuser").get(verifyjwt,getuser)
//patch api
employeerouter.route("/onboarding/:step").patch(
  verifyjwt,
  upload.fields([
    { name: "aadharimage", maxCount: 1 },
    { name: "panimage", maxCount: 1 },
    { name: "passportimage", maxCount: 1 },
    { name: "collegeid", maxCount: 1 }
  ]),
  onboardingdetails
);



export {employeerouter}