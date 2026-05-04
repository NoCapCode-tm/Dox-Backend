
import { User } from "../models/Employee.models.js";
import { uploadToCloudinary } from "../utils/cloudinary.utils.js";
import { Apierror } from "../utils/Apierror.utils.js";
import { Apiresponse } from "../utils/Apiresponse.utils.js";
import { asynchandler } from "../utils/Asynchandler.utils.js";



const employeelogin = asynchandler(async(req,res)=>{
    const{userid,password} = req.body

  if(!userid || !password){
    throw new Apierror(400,"Please fill all the required Details")
  }

  const user = await User.findOne({empid:userid})

  if(!user){
    throw new Apierror(404,"User not found")
  }

  const passwordcorrect = await user.isPasswordCorrect(password)
  if(!passwordcorrect){
    throw new Apierror(400,"Incorrect Password")
  }

  const token = await user.Token()
  if(!token){
    throw new Apierror(400,"No Token Generated")
  }

  const options = {
    httpOnly:true,
    secure:true,
    sameSite:"None",
    maxAge:9*60*60*1000
  }

  res.status(200)
  .cookie("token",token,options)
  .json(new Apiresponse(201,"Login Successfull",user))
  
})

const getuser = asynchandler(async(req,res)=>{
  const user = req.user

  if(!user){
    throw new Apierror(404,"Unauthorized User")
  }

  const employee = await User.findById(user._id)

  if(!employee){
    throw new Apierror(400,"Employee Not Found")
  }

  res.status(200)
  .json(new Apiresponse(201,"User Fetched Successfully",employee))
})

const onboardingdetails = async (req, res) => {
  const userId = req.user._id;
  const step = Number(req.params.step);

  const user = await User.findById(userId);
  if (!user){
    throw new Apierror(404, "User not found");
  }

  if (!user.onboarding.startedAt) {
    user.onboarding.startedAt = new Date();
    user.onboarding.status = "In Progress";
  }

  switch (step) {
    case 1: {
      const {
        phone, dob, gender,
        permanentaddress, communicationaddress,
        alternatephone,country,state,city
      } = req.body;

      user.phone.permanent = phone;
      user.phone.alternate = alternatephone;
      user.dob = dob;
      user.gender = gender;
      user.address.permanent = permanentaddress;
      user.address.communication = communicationaddress;
      user.address.city = city;
      user.address.country= country;
      user.address.state=state;
      break;
    }
     case 2: {
      const {
        emergencyname,emergencycontact,emergencyemail,relation,emergencycountry
      } = req.body;

      user.emergency.contactname = emergencyname;
      user.emergency.contactnumber =emergencycontact ;
      user.emergency.contactemail =emergencyemail ;
      user.emergency.contactrelation =relation ;
      user.emergency.contactcountry =emergencycountry ;
      break;
    }
    case 3: {
      const { govid1 , govid2  } = req.body;

      if (req.files?.govid1image) {
        const upload = await uploadToCloudinary(
          req.files.govid1image[0].buffer,
          "onboarding/govid1image",
          `${userId}-govid1image`
        );
        user.documents.govid1.image = upload.secure_url;
      }

      if (req.files?.govid2image) {
        const upload = await uploadToCloudinary(
          req.files.govid2image[0].buffer,
          "onboarding/govid2image",
          `${userId}-govid2image`
        );
        user.documents.govid2.image = upload.secure_url;
      }

      if (req.files?.passportimage) {
        const upload = await uploadToCloudinary(
          req.files.passportimage[0].buffer,
          "onboarding/passport",
          `${userId}-passport`
        );
        user.documents.passportimage = upload.secure_url;
      }

      user.documents.govid1.number = govid1;
      user.documents.govid2.number = govid2;
      break;
    }
    case 4: {
      const {
        highestqualification,
        collegename,
        coursename,
        year,
        expectedgraduation
      } = req.body;

      user.Qualificationdetails.highestqualification = highestqualification;
      user.Qualificationdetails.collegename = collegename;
      user.Qualificationdetails.coursename = coursename;
      user.Qualificationdetails.year = year;
      user.Qualificationdetails.expectedgraduation = expectedgraduation;
      break;
    }
    case 5: {
      const { github, portfolio, linkedin,expertise,technical,previousexperience} = req.body;
      user.professionaldetails.Previousexperience = previousexperience;
      user.professionaldetails.technical = technical;
      user.professionaldetails.expertise = expertise;
      user.professionaldetails.github = github;
      user.professionaldetails.portfolio = portfolio;
      user.professionaldetails.Linkedin = linkedin;
      break;
    }
    case 6: {
      const {
        acholdername,
        accountno,
        ifsc,
        bankname,
        branchname,
        upi,
        personnel,
        paymentplatform
      } = req.body;
      
      if(personnel == "Indian"){
        user.bankdetails.Indian = {
        acholdername,
        accountno,
        ifsc,
        bankname,
        branchname,
        upi
      }
    }else{
        user.bankdetails.International = {
        acholdername,
        accountno,
        swift:ifsc,
        bankname,
        platform:paymentplatform
      }
    }
      
      break;
    }
    case 7: {
      const { devicetype,operatingsystem,laptopavailaibility, internet,timezone,weeklyavailaibility } = req.body;

      user.systemdetails.devicetype = devicetype;
      user.systemdetails.os=operatingsystem
      user.systemdetails.weeklyavailaibility = weeklyavailaibility;
      user.systemdetails.timezone = timezone;
      user.systemdetails.internet = internet;
      user.systemdetails.laptopavailaibility = laptopavailaibility;
      break;
    }
    case 8: {
      const {
       signature ,date
      } = req.body;
      user.onboarding.status = "Completed";
      user.onboarding.completedAt = date;
      user.signature = signature ;
      break;
    }

    default:
      throw new Apierror(400, "Invalid onboarding step");
  }

  await user.save({ validateBeforeSave: false });

  return res.status(200)
  .json(new Apiresponse(200,
      {
        step,
        onboardingStatus: user.onboarding.status
      },
      `Onboarding step ${step} saved`
    )
  );
};



export {onboardingdetails,employeelogin,getuser}