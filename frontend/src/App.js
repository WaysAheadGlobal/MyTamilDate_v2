

import { CssBaseline, ThemeProvider } from "@mui/material";
import { useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Approval from "./scenes/Approval";
import ApprovalUserDetails from "./scenes/Approval/Approvaldetails";
import AdminSignIn from "./scenes/adminLogin/adminlogin";
import Bar from "./scenes/bar";
import Calendar from "./scenes/calendar/calendar";
import Contacts from "./scenes/contacts";
import Dashboard from "./scenes/dashboard";
import FAQ from "./scenes/faq";
import Form from "./scenes/form";
import Geography from "./scenes/geography";
import Sidebaradmin from "./scenes/global/Sidebar";
import Topbar from "./scenes/global/Topbar";
import Invoices from "./scenes/invoices";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import AddPromotioncode from "./scenes/promotionalCodes/AddPromotionalcode";
import PromotionalCodes from "./scenes/promotionalCodes/CodesList";
import Details from "./scenes/promotionalCodes/Details";
import ShowphoneAndEmail from "./scenes/showPhoneandEmail/showPhoneandEmail";
import Team from "./scenes/team";
import UserDetails from "./scenes/userDetails";
import { ColorModeContext, useMode } from "./theme";

import { AbtYourself } from './components/abt-yourself';
import { BasicDetails } from './components/basic-details';
import { Education } from './components/education';
import { EmailVerify } from './components/email-verify';
import { Entercode } from './components/entercode';
import { GetStarted } from './components/get-started';
import { JobTitle } from './components/job-title';
import { Located } from './components/located';
import { Religion } from './components/religion';
import { SignupPhone } from './components/signup-verifyphone';
import { Selfie } from './components/take-selfie1';

import { LP } from './components/LP';
import { FaqPage } from './components/faq-pg';
import { PrivacyPolicy } from './components/privacy-policy';
import { Tnc } from './components/tnc';

import { GetInTouch } from './components/get-in-touch';
import { SuccessPage } from "./components/success-stories-pg";

import { SignIn } from "./components/sign-in/signin";
import { SignInEmail } from "./components/sign-in/signin-email";
import { SignInEmailOTP } from "./components/sign-in/signin-email-otp";
import { SignInEmailSuccessful } from "./components/sign-in/signin-email-successful";
import { SignInPhoneOTP } from "./components/sign-in/signin-phone-otp";
import { SignInPhoneSuccessful } from "./components/sign-in/signin-phone-successful";

import ProtectedRoute from "./components/ProtectedRoute";
import Protected from "../src/components/PrivateRoute/privateroute";
import { AboutUsPage } from "./components/aboutus-pg";
import TotalCount from "./components/totalcount";
import { Video2 } from "./components/video2";
import ImageGallery from "./scenes/Approval/Imageget";
import EditDetails from "./scenes/promotionalCodes/Editpromotionalcode";


import { AccountSetting } from "./components/Account-Settings/accountSetting";
import { PrivacyPolicySetting } from "./components/Account-Settings/privacyPolicy";
import { TermsConditions } from "./components/Account-Settings/termandconditons";
import UnsubscribeComponent from "./components/Account-Settings/unsubscribeEmail";
import AccountApproved from "./components/AccountApproved";
import AccountNotApproved from "./components/AccountNotApproved";
import AccountPending from "./components/AccountPending";
import AlmostThere from "./components/AlmostThere";
import ApproveEmail from "./components/ApproveEmail";
import Height from "./components/Height";
import KidsAndFamily from "./components/KidsAndFamily";
import Personality from "./components/Personality";
import ProfileAnswers from "./components/ProfileAnswers";
import SmokeAndFamily from "./components/SmokeAndDrink";
import { SignInOptions } from "./components/sign-in/sign-in-options";

import PaymentMethod from '../src/components/Account-Settings/payment/paymentMethod';
import Fillpaymentdetails from "./components/Account-Settings/payment/SelectPlan/FIllDetailForPayment/fillpaymentdetails";
import Selectplan from './components/Account-Settings/payment/SelectPlan/selectplan';
import AddPaymentMethod from "./components/Account-Settings/payment/addpaymentmethod";
import BillingHistory from './components/Account-Settings/payment/billinghistory';
import Analytics from "./components/Analytics";
import UpdateAnswers from "./components/UpdateProfile/screens/EditAnswerAndQuestion/editanswer";
import EditPicture from "./components/UpdateProfile/screens/PictureEdit/pictureedit";
import Preview from "./components/UpdateProfile/screens/Preview/Preview";
import UpdateProfile from "./components/UpdateProfile/screens/Profile";
import Drinkupdate from "./components/UpdateProfile/screens/UserDetailsUpdateScreen/Drink/drink";
import { GenderUpdate } from "./components/UpdateProfile/screens/UserDetailsUpdateScreen/Gender/Gender";
import HeightUpdate from "./components/UpdateProfile/screens/UserDetailsUpdateScreen/Height/height";
import { JobTitleUpdate } from "./components/UpdateProfile/screens/UserDetailsUpdateScreen/Job/job";
import PersonalityProfile from "./components/UpdateProfile/screens/UserDetailsUpdateScreen/Personality/personality";
import { ReligionUpdate } from "./components/UpdateProfile/screens/UserDetailsUpdateScreen/Religion/religion";
import KidsAndFamilyUpdate from "./components/UpdateProfile/screens/UserDetailsUpdateScreen/Whatsaboutfamily/familyplan";
import { BasicDetailsUpdate } from "./components/UpdateProfile/screens/UserDetailsUpdateScreen/age/age";
import { EducationUpdate } from "./components/UpdateProfile/screens/UserDetailsUpdateScreen/educations/educations";
import KidsUpdate from "./components/UpdateProfile/screens/UserDetailsUpdateScreen/havekids/havekids";
import { LanguageUpdate } from "./components/UpdateProfile/screens/UserDetailsUpdateScreen/languages/languages";
import { LocatedUpdate } from "./components/UpdateProfile/screens/UserDetailsUpdateScreen/locations/locations";
import Smokeupdate from "./components/UpdateProfile/screens/UserDetailsUpdateScreen/smoke/smoke";
import HelpSupport from "./components/UpdateProfile/screens/help&support/helpandsupport";
import Home from "./components/userflow/screens/Home";
import Chat from "./components/userflow/screens/chat/Chat";
import ChatWith from "./components/userflow/screens/chat/ChatWith";
import PauseMyAccount from "./components/userflow/screens/pause/pause";
import Preferences from "./components/userflow/screens/preferences/Preferences";
import ProfileDetails from "./components/userflow/screens/profile-details/ProfileDetails";
import Recommendations from "./components/userflow/screens/recommendations/Recommendations";
import { useCookies } from "./hooks/useCookies";
import { WantGenderUpdate } from "./components/UpdateProfile/screens/UserDetailsUpdateScreen/wantgender/wantgender";
import Verify from "./components/verify";
import RejectedList from "./scenes/Rejected/rejected";
import RejectDetails from "./scenes/Rejected/userDetails";
import ReportList from "./scenes/Reports/reports";
import ReportDetails from "./scenes/Reports/reportsdetails";
import Paymentfinal from "./components/Account-Settings/payment/newpayment/payment";
import MobileCheck from "./components/PrivateRoute/paymentplanroute";
import CropImage from "./components/cropimage/cropimage";
import CardandPayment from "./components/Account-Settings/payment/CardAndCoupon";


function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  // const { isAdmin } = useAppContext();
  const { getCookie, setCookie } = useCookies();
  const location = useLocation();
  const admintoken = getCookie('Admintoken')

  const protectedRoutes = [
    "/dashboard",
    "/team",
    "/contacts",
    "/approval",
    "/promotionalcodedetails/:id",
    "/userdetails/:id",
    "/showPhoneandEmail",
    "/approvaluserdetails/:id",
    "/promotionalcodes",
    "/invoices",
    "/count",
    "/form",
    "/bar",
    "/pie",
    "/line",
    "/faq",
    "/calendar",
    "/geography",
    "/addpromotionalcode",
    "/editpromotionalcode/:id",
    "/rejected",
    "/rejected/:id",
    "/reports",
    "/reporteduserdetails/:id"
  ];


  const isProtectedRoute = protectedRoutes.some((route) =>
    location.pathname.startsWith(route.split(":")[0])
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app" style={{
          maxWidth: "1636px",
          margin: "0 auto",
        }}>
          {admintoken && isProtectedRoute && <Sidebaradmin isSidebar={isSidebar} />}
          <main className="content">
            {admintoken && isProtectedRoute && <Topbar setIsSidebar={setIsSidebar} />}
            <Routes>
              <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/team" element={<ProtectedRoute><Team /></ProtectedRoute>} />
              <Route path="/contacts" element={<ProtectedRoute><Contacts /></ProtectedRoute>} />
              <Route path="/approval" element={<ProtectedRoute><Approval /></ProtectedRoute>} />
              <Route path="/rejected" element={<ProtectedRoute><RejectedList /></ProtectedRoute>} />
              <Route path="/rejected/:id" element={<ProtectedRoute> <RejectDetails /> </ProtectedRoute>} />
              <Route path="/reports" element={<ProtectedRoute><ReportList /></ProtectedRoute>}></Route>
              <Route path="/reporteduserdetails/:id" element={<ProtectedRoute><ReportDetails /></ProtectedRoute>}></Route>

              <Route path="/promotionalcodedetails/:id" element={<ProtectedRoute><Details /></ProtectedRoute>} />
              <Route path="/editpromotionalcode/:id" element={<ProtectedRoute>< EditDetails /></ProtectedRoute>} />
              <Route path="/userdetails/:id" element={<ProtectedRoute><ApprovalUserDetails /></ProtectedRoute>} />
              <Route path="/showPhoneandEmail" element={<ProtectedRoute><ShowphoneAndEmail /></ProtectedRoute>} />
              <Route path="/approvaluserdetails/:id" element={<ProtectedRoute><ApprovalUserDetails /></ProtectedRoute>} />
              <Route path="/promotionalcodes" element={<ProtectedRoute><PromotionalCodes /></ProtectedRoute>} />
              <Route path="/invoices" element={<ProtectedRoute><Invoices /></ProtectedRoute>} />
              <Route path="/count" element={<ProtectedRoute><TotalCount /></ProtectedRoute>} />
              <Route path="/form" element={<ProtectedRoute><Form /></ProtectedRoute>} />
              <Route path="/bar" element={<ProtectedRoute><Bar /></ProtectedRoute>} />
              <Route path="/pie" element={<ProtectedRoute><Pie /></ProtectedRoute>} />
              <Route path="/line" element={<ProtectedRoute><Line /></ProtectedRoute>} />
              <Route path="/faq" element={<ProtectedRoute><FAQ /></ProtectedRoute>} />
              <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
              <Route path="/geography" element={<ProtectedRoute><Geography /></ProtectedRoute>} />
              <Route path="/adminlogin" element={<AdminSignIn />} />
              <Route path="/addpromotionalcode" element={<ProtectedRoute><AddPromotioncode /></ProtectedRoute>} />
              <Route path="/img" element={<ImageGallery />}></Route>
              <Route path="/" element={<LP />} /> 
              <Route path="/SuccessPage" element={<SuccessPage />} />
              <Route path="/FaqPage" element={<FaqPage />} />
              <Route path="/GetInTouch" element={<GetInTouch />} />
              <Route path="/aboutus" element={<AboutUsPage />} />
              <Route path="/Tnc" element={<Tnc />} />
              <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
              <Route path="/video2" element={<Video2 />} />

              <Route path="/signup" element={<SignupPhone />} />
              <Route path="/signinoptions" element={<SignInOptions />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signinphoneotp" element={<SignInPhoneOTP />} />
              <Route path="/signinphonesuccessful" element={<SignInPhoneSuccessful />} />
              <Route path="/signinemailsuccessful" element={<SignInEmailSuccessful />} />

              <Route path="/signinemail" element={<SignInEmail />} />
              <Route path="/signinemailotp" element={<SignInEmailOTP />} />
              <Route path="/entercode" element={<Entercode />} />
              <Route path="/emailverify" element={<Protected><EmailVerify /></Protected>}></Route>
              <Route path="/getstarted" element={<Protected><GetStarted /></Protected>}></Route>
              <Route path="/basicdetails" element={<Protected><BasicDetails /></Protected>}></Route>
              <Route path="/abtyourself" element={<Protected><AbtYourself /></Protected>}></Route>
              <Route path="/selfie" element={<Protected><Selfie /></Protected>}></Route>
              <Route path="/imagecrop" element={<CropImage/>}>  </Route>
              <Route path="/located" element={<Protected><Located /></Protected>}></Route>
              <Route path="/religion" element={<Protected><Religion /></Protected>}></Route>
              <Route path="/edu" element={<Protected><Education /></Protected>}></Route>
              <Route path="/jobtitle" element={<Protected><JobTitle /></Protected>}></Route>
              <Route path="/height" element={<Protected><Height /></Protected>}></Route>
              <Route path="/personality" element={<Protected><Personality /></Protected>}></Route>
              <Route path="/profile-answers" element={<Protected><ProfileAnswers /></Protected>}></Route>
              <Route path="/kids-family" element={<Protected><KidsAndFamily /></Protected>}></Route>
              <Route path="/smoke-drink" element={<Protected><SmokeAndFamily /></Protected>}></Route>
              <Route path="/approve" element={<Protected><ApproveEmail /></Protected>}></Route>
              <Route path="/almost-there" element={<Protected><AlmostThere /></Protected>}></Route>
              <Route path="/pending" element={<Protected><AccountPending /></Protected>}></Route>
              <Route path="/not-approved" element={<Protected><AccountNotApproved /></Protected>}></Route>
              <Route path="/approved" element={<Protected><AccountApproved /></Protected>}></Route>
              <Route path="/user/verify/:token" element={<Protected><Verify /></Protected>}></Route>
              <Route path="/accoutsetting" element={<Protected><AccountSetting /></Protected>}></Route>
              <Route path="/unsubscribe" element={<Protected><UnsubscribeComponent /></Protected>}></Route>
              <Route path="/PrivacyPolicyDetails" element={<Protected><PrivacyPolicySetting /></Protected>}></Route>
              <Route path="/termandconditions" element={<Protected><TermsConditions /></Protected>}></Route>
              <Route path="/paymentmethod" element={<Protected><PaymentMethod /></Protected>}></Route>
              <Route path="/billinghistory" element={<Protected><BillingHistory /></Protected>}></Route>
              
              <Route path="/selectplan" element={<Protected>
                <MobileCheck>
                  <Selectplan />
                </MobileCheck>
              </Protected>}></Route>

              <Route path="/cardandpayment" element = {<Protected><CardandPayment/> </Protected>}>
                                       
              </Route>
              <Route path="/addpaymentmethod" element={<Protected><AddPaymentMethod /></Protected>}></Route>
              <Route path="/paymentdetails" element={<Protected><Fillpaymentdetails /></Protected>}></Route>
              <Route path="/paymentplan" element={<MobileCheck> <Paymentfinal /></MobileCheck> }></Route>
              <Route path="/updateprofile" element={<Protected><UpdateProfile /></Protected>}></Route>
              <Route path="/preview" element={<Protected><Preview /></Protected>}></Route>
              <Route path="/editpicture" element={<Protected><EditPicture /></Protected>}></Route>
              <Route path="/updateanswer" element={<Protected><UpdateAnswers /></Protected>}></Route>
              <Route path="/personalityupdate" element={<Protected><PersonalityProfile /></Protected>}></Route>
              <Route path="/updategender" element={<Protected><GenderUpdate /></Protected>}></Route>
              <Route path="/updatelocations" element={<Protected><LocatedUpdate /></Protected>}></Route>
              <Route path="/updatereligion" element={<Protected><ReligionUpdate /></Protected>}></Route>
              <Route path="/updateheight" element={<Protected><HeightUpdate /></Protected>}></Route>
              <Route path="/updatejob" element={<Protected><JobTitleUpdate /></Protected>}></Route>
              <Route path="/updatesmoke" element={<Protected><Smokeupdate /></Protected>}></Route>
              <Route path="/updatedrink" element={<Protected><Drinkupdate /></Protected>}></Route>
              <Route path="/updatefamilyplan" element={<Protected><KidsAndFamilyUpdate /></Protected>}></Route>
              <Route path="/updatekids" element={<Protected><KidsUpdate /></Protected>}></Route>
              <Route path="/updatelanguage" element={<Protected><LanguageUpdate /></Protected>}></Route>
              <Route path="/updateeducations" element={<Protected><EducationUpdate /></Protected>}></Route>
              <Route path="/updateage" element={<Protected><BasicDetailsUpdate /></Protected>}></Route>
              <Route path="/helpsupport" element={<Protected><HelpSupport /></Protected>}></Route>
              <Route path="/wantgender" element={<Protected><WantGenderUpdate /></Protected>}></Route>

              <Route path="/user/home" element={<Protected><Home /></Protected>}></Route>
              <Route path="/user/recommendations" element={<Protected><Recommendations /></Protected>}></Route>
              <Route path="/user/preferences" element={<Protected><Preferences /></Protected>}></Route>
              <Route path="/user/:name/:id" element={<Protected><ProfileDetails /></Protected>}></Route>
              <Route path="/user/chat/with/:name" element={<Protected><ChatWith /></Protected>}></Route>
              <Route path="/user/chat/*" element={<Protected><Chat /></Protected>}></Route>
              <Route path="/user/pause" element={<Protected><PauseMyAccount /></Protected>}></Route>

            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider >
  );
}

export default App;
