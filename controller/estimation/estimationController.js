import LeadSourceModel from "../../model/leadSource/leadSourceModel.js";
import StaffModel from "../../model/staff/staffModel.js";
import EstimationModel from "../../model/estimation/estimationModel.js";
import { InvoiceNumber } from "invoice-number";
import SentEstimationModel from "../../model/estimation/sentEstimateModel.js";
import sendEmail from "../../utils/sendEmail.js";
import CustomerLeadModel from "../../model/customer/customerLeadModel.js";
import pdf from "html-pdf";
import fs from "fs";

export const addLead = async (req, res) => {
  const userId = req.query.userId || req.user._id;
  // console.log(req.body)
  const currentUser = await StaffModel.findById(userId);

  if (!currentUser) {
    return res.status(401).json({ error: "User not found" });
  }

  try {
    const getData = await EstimationModel.find().sort({ _id: -1 }).limit(1);

    const preInvoiceNumber = getData[0].leadInvoinceNo;

    var newInvoiceNo = InvoiceNumber.next(`${preInvoiceNumber}`);

    const createLeadData = await EstimationModel.create({
      name: req.body.customerName,
      email: req.body.email,
      contactNo: req.body.contactNo,
      leadSource: req.body.leadSource,
      leadPerson: req.body.leadPerson,
      estimaitonDate: req.body.estimaitonDate,
      estimaitonSentDate: req.body.estimaitonSentDate,
      estimaitonStatus: req.body.estimaitonStatus,
      leadInvoinceNo: newInvoiceNo,
    });

    res.status(200).json({
      message: "Success",
      Data: createLeadData,
    });
  } catch (errors) {
    res.status(500).json({ errors: { error: "Internal Server Error" } });
  }
};

export const UpcomingEstimaitonLead = async (req, res) => {
  let data = [];

  const userId = req.query.userId || req.user._id;
  console.log(userId);
  const currentUser = await StaffModel.findById(userId);

  if (!currentUser) {
    return res.status(401).json({ error: "User not found" });
  }
  try {
    const leadData = await EstimationModel.find({
      leadPerson: { $in: [userId] },
    })
      .sort({ _id: -1 })
      .populate("leadPerson")
      .populate("customerLeadId");

    res.status(200).json({
      DataLength: leadData.length,
      Data: leadData,
    });
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const ChangeStatus = async (req, res) => {
  const userId = req.query.userId || req.user._id;
  console.log(userId);
  const currentUser = await StaffModel.findById(userId);

  if (!currentUser) {
    return res.status(401).json({ error: "User not found" });
  }
  try {
    const checkData = await LeadSourceModel.findById({ _id: req.body.id });
    if (checkData) {
      if (checkData.activeStatus === false) {
        await LeadSourceModel.findByIdAndUpdate(
          { _id: req.body.id },
          {
            $set: { activeStatus: true },
          }
        );
      } else {
        await LeadSourceModel.findByIdAndUpdate(
          { _id: req.body.id },
          {
            $set: { activeStatus: false },
          }
        );
      }
    } else {
    }
    const checkData1 = await LeadSourceModel.findById({ _id: req.body.id });
    res.status(200).json({
      Data: checkData1,
    });
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const CustomerLeadRemove = async (req, res) => {
  const userId = req.query.userId || req.user._id;
  // console.log(userId);
  const currentUser = await StaffModel.findById(userId);

  if (!currentUser) {
    return res.status(401).json({ error: "User not found" });
  }
  try {
    await LeadSourceModel.findByIdAndDelete({ _id: req.body.id });

    const checkData = await LeadSourceModel.find().sort({ _id: -1 });

    res.status(200).json({
      Data: checkData,
    });
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const sentEstimation = async (req, res) => {
  const userId = req.query.userId || req.user._id;
  console.log(req.body);
  const currentUser = await StaffModel.findById(userId);

  if (!currentUser) {
    return res.status(401).json({ error: "User not found" });
  }

  try {
    let sentData = await SentEstimationModel.create({
      estimateId: req.body.estimateId,
      customerLeadId: req.body.customerLeadId,
      emailTemplateId: req.body.emailTemplateId,
      estimaitonScheduleDate: req.body.estimaitonScheduleDate,
    });

    for (let i in req.body.customerLeadId) {
      const custId = req.body.customerLeadId[i];

      let customerData = await CustomerLeadModel.findById({ _id: custId });
      var d = new Date();
      var day = ("0" + d.getDate()).slice(-2);
      var month = ("0" + (d.getMonth() + 1)).slice(-2);
      var year = d.getFullYear();
      var time = d.getHours();
      let dayoftime;
      var minutes = d.getMinutes();
      var seconds = d.getSeconds();

      if (time < 12) {
        dayoftime = "<b> morning</b>";
      }
      if (time > 12) {
        dayoftime = "<b> afternoon</b>";
      }
      if (time == 12) {
        dayoftime = "<b> evening</b>";
      }

      const message = `<html>
      <head>
         <meta http-equiv="Content-Type" content="text/html; charset=euc-jp">
         <meta name="viewport" content="width=device-width">
         <meta http-equiv="X-UA-Compatible" content="IE=edge">
         <meta name="x-apple-disable-message-reformatting">
         <title>One Percent </title>
         <style>html,body{background-color:#fff!important;margin:0 auto !important;padding:0 !important;height:100% !important;width:100% !important;color:#888!important}.email-container{max-width:600px!important;border: 1px solid #B5BECA;
       border-radius: 12px;margin:0 auto!important}*{-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}div[style*="margin: 16px 0"]{margin:0 !important}table,td{mso-table-lspace:0pt !important;mso-table-rspace:0pt !important}table{width:100%;border-spacing:0 !important;border-collapse:collapse !important;table-layout:fixed !important;margin:0 auto !important}img{-ms-interpolation-mode:bicubic}a{text-decoration:none!important}*[x-apple-data-detectors], .unstyle-auto-detected-links *,.aBn{border-bottom:0 !important;cursor:default !important;color:inherit !important;text-decoration:none !important;font-size:inherit !important;font-weight:inherit !important;line-height:inherit !important}@media only screen and (min-device-width: 320px) and (max-device-width: 374px){u ~ div .email-container{min-width:320px !important}}@media only screen and (min-device-width: 375px) and (max-device-width: 413px){u ~ div .email-container{min-width:375px !important}}@media only screen and (min-device-width: 414px){u ~ div .email-container{min-width:414px !important}}</style>
      </head>
      <body>
         <div class="email-container">
            <table style="background-color: #E8F1FD;border-top-right-radius:10px;border-top-left-radius:10px; ">
               <tr>
                  <td style="padding: 30px 15px; border-top-right-radius: 10px"><img src="http://digimonk.net:1630/small-logo.png"/>
                     
                  </td>
                                 
               </tr>
            </table>
            <table style="color: #000;font-size: 20px;">
               <tr>
                  <td style="padding: 10px 14px;"><h3>Still interested?</h3></td>
               </tr>
               <tr>
                  <td style="padding: 10px 14px;">Good ${dayoftime},<b>${customerData.name}</b>,</td>
               </tr>
               <tr>
                  <td style="padding: 10px 14px;">
   
   We are just checking in if you are still wanting to proceed with the landscaping/pool project you reached out to us about?</td>
               </tr>
               
               <tr>
                  <td style="padding: 10px 14px;">You can contact us by clicking the button below.
   </td>
               </tr>
               <tr><td style="padding: 10px 14px;"><a href="" style="background-color: #1A73E8; color: #fff;border-radius: 20px; padding: 5px 20px" >Confirm</a></td></tr>
   
               <tr><td style="padding: 10px 14px;font-size: 16px;">Or you can Click here:<a href="https://theonepercent.com/users/confirmation?confirmation_token=qxWuJ5NiUbsGsG7UiQa5" style="color: deepskyblue;" >https://theonepercent.com/users/confirmation?confirmation_token=qxWuJ5NiUbsGsG7UiQa5 </a></td></tr>
                           <tr>
                  <td style="padding: 10px 14px;">Sincerely
   </td>
               </tr>
                           <tr>
                  <td style="padding: 10px 14px;">The One Percent Software Team
   </td>
               </tr>
            </table>
            <table style=" color: #000; font-size: 20px;">
               <tr>
                  <td style="text-align: center;padding-bottom: 5px;">
                     <ul style="display: inline-block;padding: 0">
                  <li style="display: inline-block;    padding: 10px 15px;"><a href="#"><img src="http://digimonk.net:1630/facebook.png"/></a></li>
                  <li style="display: inline-block;    padding: 10px 15px;"><a href="#"><img src="http://digimonk.net:1630/twitter.png"/></a></li>
                  <li style="display: inline-block;    padding: 10px 15px;"><a href="#"><img src="http://digimonk.net:1630/instagram.png"/></a></li>
                  <li style="display: inline-block;    padding: 10px 15px;"><a href="#"><img src="http://digimonk.net:1630/youtube.png"/></a></li></ul></td>
               </tr>
               
            </table>
            <table style="background-color: #E8F1FD; font-size: 20px;border-bottom-right-radius:10px;border-bottom-left-radius:10px;">
               <tr>
                  <td style=" text-align: center;">You're receiving this email because you are a subscriber of TheOnePercent.com </td>
               </tr>
               <tr>
                  <td style="padding-bottom: 20px; text-align: center;">If you feel you received it by mistake or wish to unsubscribe,<a href="#" style="color: deepskyblue;"><b> click here</b></a></td>
               </tr>
            </table>
         </div>
      </body>
   </html>`;

      const options = {
        format: "A4",
      };
      const pdfName =
        day +
        "" +
        month +
        "" +
        year +
        "" +
        time +
        "" +
        minutes +
        "" +
        seconds +
        "-" +
        customerData.email;
      pdf
        .create(message, options)
        .toFile(`./pdf/${pdfName}.pdf`, (err, res) => {
          if (err) {
            console.log(err);
          }
        });

      await sendEmail({
        email: customerData.email,
        subject: "New Estimate",
        message,
      });
    }

    res.status(200).json({
      message: "Success",
      Data: sentData,
    });
  } catch (errors) {
    // console.log(errors);
    res.status(500).json({ errors: { error: "Internal Server Error" } });
  }
};

export const sentFinalEstimation = async (req, res) => {
  const userId = req.query.userId || req.user._id;
  console.log(req.body);
  const currentUser = await StaffModel.findById(userId);

  if (!currentUser) {
    return res.status(401).json({ error: "User not found" });
  }

  try {
    let sentData = await SentEstimationModel.create({
      // estimateId: req.body.estimateId,
      customerLeadId: req.body.customerLeadId,
      type: "final",
    });

    for (let i in req.body.customerLeadId) {
      const custId = req.body.customerLeadId[i];
      // const estimateId = req.body.estimateId[i];

      // let customerData = await CustomerLeadModel.findById({ _id: estimateId });

      let customerData = await CustomerLeadModel.findById({ _id: custId });
      var d = new Date();
      var day = ("0" + d.getDate()).slice(-2);
      var month = ("0" + (d.getMonth() + 1)).slice(-2);
      var year = d.getFullYear();
      var time = d.getHours();
      let dayoftime;
      var minutes = d.getMinutes();
      var seconds = d.getSeconds();

      if (time < 12) {
        dayoftime = "<b> morning</b>";
      }
      if (time > 12) {
        dayoftime = "<b> afternoon</b>";
      }
      if (time == 12) {
        dayoftime = "<b> evening</b>";
      }

      const finalPreview = `<html>

      <head>
         <meta http-equiv="Content-Type" content="text/html; charset=euc-jp">
         <meta name="viewport" content="width=device-width">
         <meta http-equiv="X-UA-Compatible" content="IE=edge">
         <meta name="x-apple-disable-message-reformatting">
         <title>One Percent </title>
         <style>
            html,body{background-color:#fff!important;margin:0 auto !important;padding:0 !important;height:100% !important;width:100% !important;color:#888!important}.email-container{max-width:600px!important;border: 5px solid black;
                border-radius: 12px;margin:0 auto!important}*{-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}div[style*="margin: 16px 0"]{margin:0 !important}table,td{mso-table-lspace:0pt !important;mso-table-rspace:0pt !important}table{width:100%;border-spacing:0 !important;border-collapse:collapse !important;table-layout:fixed !important;margin:0 auto !important}img{-ms-interpolation-mode:bicubic}a{text-decoration:none!important}*[x-apple-data-detectors], .unstyle-auto-detected-links *,.aBn{border-bottom:0 !important;cursor:default !important;color:inherit !important;text-decoration:none !important;font-size:inherit !important;font-weight:inherit !important;line-height:inherit !important}@media only screen and (min-device-width: 320px) and (max-device-width: 374px){u ~ div .email-container{min-width:320px !important}}@media only screen and (min-device-width: 375px) and (max-device-width: 413px){u ~ div .email-container{min-width:375px !important}}@media only screen and (min-device-width: 414px){u ~ div .email-container{min-width:414px !important}}
         </style>
      </head>
      
      <body>
         <div class="email-container">
            <table style="border-bottom: 2px solid #000;background-color: #222222; ">
               <tr>
                  <td>
                     <img src="http://digimonk.net:1630/static/media/estimate-banner.30261a19.png" style="width:100%;" />
                  </td>
               </tr>
            </table>
            <table style="color: #000;font-size: 20px;">
               <tr>
                  <td style="padding: 10px 14px;">
                     <img src="http://digimonk.net:1630/static/media/mount-sky.24b1aba7.png" />
                  </td>
                  <td>
                     <p style="margin: 0 0 5px 0">Mountain Sky Proposal</p> <span>Sales: ${
                       customerData.leadPerson[0].name
                     } </span>
                     <br> <span>Dates: ${day + "-" + month + "-" + year}</span>
                  </td>
               </tr>
               <tr>
                  <td style="padding: 10px 14px;">
                     <p style="margin: 0 0 5px 0">Prepared For:</p>
                     <h4 style="margin: 0 0 5px 0">${customerData.name}</h4>
                     <span>Located At</span>
                     
                      <h4 style="margin:  0 0 5px 0">${
                        customerData.address +
                        " " +
                        customerData.city +
                        " " +
                        customerData.state +
                        " " +
                        customerData.country +
                        " " +
                        customerData.postalCode
                      }</h6>
                  </td>
                  <td></td>
               </tr>
               <!-- <hr/> -->
            </table>
            <table style="color: #000; font-size: 20px;">
               <tr>
                  <td style="padding: 10px 14px;">We appreciate the oppurtunity to work with you! Please see below for a breakdown of your project.</td>
                  <tr>
                     <td style="padding: 10px 14px;">Did you know? We offer full 2D & 3D design services! Reach out to us to get started.</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #ddd;padding-bottom: 5px">
                     <td style="padding: 10px 14px">We also provide financing for our customers!</td>
                  </tr>
            </table>
            <table style="border-top: 1px solid #000; color: #000; font-size: 20px;">
                     <tr>
               <td style="padding: 10px 14px;">Scope of Work</td>
            </tr>
         </table>
         <table>
            <tr>
               <td style="display: flex;align-items: center;justify-content: space-between;margin: 10px 14px 0;background-color: #3483fa;border-radius: 25px;color:#fff;position: relative;">
                  <span style="display: flex;align-items: center;">
      <img src="http://digimonk.net:1630/static/media/estimate-banner.30261a19.png" style="height: 80px;width:120px;border-radius: 20px;margin-right: 8px" /><h4>Demolition & Prep</h4></span>
             <h5 style="padding-right:5px ">$3600.00</h5>
          </td>
            </tr>
            <tr>
               <td style="background-color: #e8f1fd;margin: 0px 14px;display: block;margin-top: -15px;border-bottom-right-radius: 20px;border-bottom-left-radius: 20px">
                  <ul>
                          <li>Install the following plants and trees</li>
                          <li>
                            <b>(Dynamic Value)</b> F15 Flats
                          </li>
                          <li>
                            <b>(Dynamic Value)</b> 1 gallon plants
                          </li>
                          <li>
                            <b>(Dynamic Value)</b> 5 gallon plants
                          </li>
                          <li>
                            <b>(Dynamic Value)</b> 10 gallon plants
                          </li>
                          <li>
                            {" "}
                            <b>(Dynamic Value)</b> 1.5" caliper tree{" "}
                          </li>
                          <li>
                            <b>(Dynamic Value)</b> Evergreen trees
                          </li>
                          <li>
                            All plants, shrubs and trees will be installed with
                            topsoil
                          </li>
                          <li>
                            Excat plant cost may vary depending on type of plant free
                            selected
                          </li>
                          <li>
                            <img src={planting} />
                          </li>
                        </ul>
               </td>
            </tr>
               
      </table>
            <table>
               <tr>
                  <td></td>
                  <td style="padding: 10px 14px">
                     <ul>
                        <li> <b>Subtotal:</b> #DIV/0!</li>
                        <li> <b>Taxes/Discount:</b> #DIV/0!</li>
                        <li> <b>Contract Total:</b> #DIV/0!</li>
                     </ul>
                  </td>
               </tr>
               <tr>
                  <td colspan="2" style="padding: 10px 14px">
                     <p>Are you ready to move forward? Contact the salesperson you were working with right away to get on our schedule!</p>
                  </td>
               </tr>
               <tr>
                  <td style="padding: 10px 14px">
                  <h3>Payment Terms for Project: </h3>
               </td>
               </tr>
               <tr>
                  <td colspan="2" style="padding: 10px 14px">
                     <ul>
                        <li> <b>Deposit payment at signing of contract:-</b> #DIV/0!</li>
                        <li> <b>Progress payment when project is started: -</b> #DIV/0!</li>
                        <li> <b>Progress payment when project is 50% complete: -</b> #DIV/0!</li>
                        <li> <b>Completion payment: - </b> #DIV/0!</li>
                     </ul> <span>
                          Note: Payment terms will change if change orders are made
                        </span>
                  </td>
               </tr>
               <tr>
                  <td style="padding: 10px">
                     <h3>Meet Our Team!</h3>
                  </td>
               </tr>
                <tr>
               <td colspan="2">
                  <img src="http://digimonk.net:1630/static/media/team.1728b5f1.jpg" style="width: 100%" />
               </td>
            </tr>
            </table>
            <table>
           
      
            <tr>
              <td style="padding: 10px 14px" colspan="2"> <h4>Terms For Project</h4>
               <h4 className="mt-3">General Contract Terms: </h4>
               <ul>
                  <li>1.11 Both parties are entitled to fill out the agreement below, signed by the client and the contractor.</li>
                  <li>1.12 By signing, the client agrees to everything in the contract. By signing, ____________ agrees to everything in the contract. This contract is legally binding.</li>
                  <li>1.13 If not stated in the contract, it is not included.</li>
                  <li>1.14 If _________________ employees have to "Redo" or "Take up" or "Replace" any items after they are installed, the client may be charged an additional cost unless installed not to manufacturer specs by _______________ employees. (Example: Rock type is changed after installed on site and __________________ has to replace it, a fee will be applied)</li>
                  <li>1.16 End date stated is not a guarantee and will depend on weather, productivity, material availability etc</li>
                  <li>1.17 Depending on the size and length of the project, a port-a-potty may be brought on site for the use of _______________ crew.</li>
                  <li>1.18 Cancellation policy is as follows: Client may cancel the project up to 21 (Twenty-one) days before project start date. If the project is cancelled after 21 days prior to the start date, a fee may be charged.</li>
                  <li>1.19 In event of a legal fee, the prevailing party is responsible for legal fees.</li>
                  <li>1.20 Deposit is non refundable unless contract cancelled or delayed by __________________.</li>
                  <li>1.21 Any changes in contract must be in writing and signed. Payment terms and warranties do not apply to change orders</li>
                  <li>1.22 A change order will be made whenever something occurs that is out of scope, extra or not originally foreseen. The change order will become in part and conformance with this contract.</li>
                  <li>1.23 If unforeseen items occur a change order will be made. Change orders may be verbally or written approved by the client.</li>
                  <li>1.24 Permit, city costs or hoa design approval cost is paid for by client. ____________ will handle submitting the permit and inspections, but the cost of admin and permit is not included unless specified in contract.</li>
                  <li>1.25 Concrete shall attain a compressive strength of not less than 4,000 pounds per square inch at the age of 30 days April - October and age of 120 days November - March.</li>
                  <li>1.26 _________________ may charge extra if any other contractor, or person delays, destroys or interferes with workflow or already installed items.</li>
                  <li>1.27 If soils are tested and a soil change is needed, this is out of contract and will be additional.</li>
                  <li>1.29 __________________ is not responsible for blowing out of irrigation system unless otherwise noted</li>
                  <li>1.30 ________________ will not be held liable for engineering failures unless installed incorrectly by ____________________ crew.</li>
                  <li>1.31 Construction work and equipment is dangerous to be around. Please take caution when around any construction materials, equipment, employees or any other construction related items. When in a construction zone, please know this is at your own risk.</li>
                  <li>1.33 Designs are for conceptual vision only. Actual projects may vary slightly from design.</li>
                  <li>1.35 When installing Pavers, travertine or flagstone, the surface is not guaranteed to be the same height from stone to stone, and there may be slight height differences in the pavers in the way they are manufactured</li>
                  <li>1.36 If house is unsquare, there is not guarantee the hardscaping, landscaping or sod around the home will be square to the house or surrounding items</li>
                  <li>1.37 When installing pavers, retaining walls or flatwork, the slope direction and amount will be determined by the ____________ crew based on the plan, existing elevations on site or other items that will affect the grading.</li>
                  <li>1.38 If____________ is hired to do drainage work on your property, our crew will determine how everything will slope, and where water will flow. This plan is determined by the experts on our team and in most circumstances we do not provide this plan to the homeowner.</li>
                  <h5>Materials:</h5>
                  <li>2.1 Materials that are being delivered on site (Such as, mulch, rock, sand, gravel, soil, sod and plants) will be delivered at various times throughout the project. We will do our best to manage and schedule these deliveries out of the way of needed access such as driveways and sidewalks.</li>
                  <li>2.2 If more materials are needed then what's stated in the contract, the section will be re-measured and you may be charged accordingly for the amount extra.</li>
                  <li>2.3 All excess or unused materials are the possession of _________________. When doing projects we are required to order in full pallet quantities although the client is only paying for the amount/ sq ft listed in the contract/charged for.</li>
                  <li>2.4 For all materials returned, that is denied for installation by customer, restocking fees as well as labor, billed at $65 per man hour, to return items will be charged to the homeowner, unless returned by ______________ in the case we have extra after project completion</li>
                  <li>2.5 If additional concrete is needed for a depth more than 4" or what's stated in contract, a fee of $150 per yard will be applied.</li>
                  <h5> Warranties:</h5>
                  <li>3.11 After the installation of a landscape project, it is the homeowner's responsibility to maintain all living items such as trees, shrubs, annuals, perennials, and grass as well as any maintenance on hardscaping.</li>
                  <li>3.12 ________________ will not be held liable for any damages caused by natural forces (Cracked sprinklers, freeze and thaw, erosion, animals or anything beyond our control)</li>
                  <li>3.13 _____________________ is not responsible for any weeds after installation. Weed block is not a guarantee</li>
                  <li>3.14 ______________ is not responsible for any rotting of wood after install</li>
                  <li>3.15________________ offers a limited 3 year warranty after signing of the contract on all paver patios, paver walkways and paver driveways. This warranty covers settling, and cracking of pavers. The following items will not be covered in this warranty: Self inflicted causes or natural causes (Floods, fires, hurricanes, tornadoes etc). Warranty does not cover settling if proper drainage isn't installed. Small chips, polymeric sand and efflorescence is not warrantied. If there is a manufacturer problem, the warranty will go through the manufacturer directly. Pavers may have a height difference from one paver to the other in amounts less then ⅜". This is not considered settling and is not warrantied.</li>
                  <li>3.16______________ offers a 3 year warranty after signing of the contract on retaining wall installation services. This warranty covers settling, cracking and manufacturing defects. The following items will not be covered in this warranty: Self inflicted causes or natural causes (Floods, fires, hurricanes, tornadoes etc). Small chips and Efflorescence is not covered in retaining wall warranty. If there is a manufacturer problem, warranty will go through the manufacturer directly.</li>
                  <li>3.17 Irrigation is covered in a 90 day warranty period after signing of the project. This includes, manufacturing failures or malfunctions, and installation failures. This does not include personal or third party damage, freezing damage or damage from other contractors. Drip emitters and backflow preventers are not included in warranty. After the 90 day warranty period, it will be the homeowners responsibility to maintain the irrigation. Too much water or too little water is not covered in warranty and further damage caused by irrigation is not covered.</li>
                  <li>3.18 Plants, trees, shrubs and grasses are covered in a 90 day warranty period after installation of the project. This warranty is only effective if ______________ installed and maintained the irrigation system. After the 90 day warranty period, it will be the homeowners responsibility to maintain and upkeep the plants, trees, shrubs and grasses. Freezing/thaw, damage to plants and tree from over or under watering, and damage by homeowner or 3rd party source will not be covered in warranty.</li>
                  <li>3.19 __________ does not warranty poured in place concrete or asphalt against cracks, reflective cracks, chipping or any other damage caused by settling or other circumstances beyond our control.</li>
                  <li>3.20 Exact color replication for concrete is not warrantied. Slight variations in color may also occur due to weather conditions or projects requiring multiple pours.</li>
                  <li>3.21 Rock, mulch, weed fabric, edging and sod is not covered in warranty</li>
                  <li>3.22 Grading and drainage is not covered in warranty. Erosion, puddles, and wet areas are very unlikely, but can occur.</li>
                  <li>3.23 When backfilling or demoing materials, there is no guarantee items won't settle over the years</li>
                  <li>3.24 If a warranty call is needed, please contact the office at ____________. After notice of what needs to be corrected, _____________ will schedule for the repair. Depending on the season, this may be up to 90 days. Warranty items may not be able to be completed until a certain time of year, in which case _______________ will wait until the time period to complete the warranty call.</li>
                  <li>3.25 No warranty work will be completed until final payment is made on the initial contract and any change orders.</li>
                  <h5> Payment:</h5>
                  <li>4.1The progress payments for this project will follow the payments outlined directly above this terms section. All progress payments will be made on time and when specified. If a progress payment is not made, ______________ may retract from the jobsite until further payment is made.</li>
                  <li>4.11 Price Is Valid For 60 days from when the contract was sent. After this time, contract will need to be looked over and resent by ___________ before moving forward</li>
                  <li>4.12 Payment methods for this project include Check and Cash. Venmo, paypal and credit card will be accepted with the exception of a 2-3% processing fee.</li>
                  <li>4.13 If the project is not paid in full within 20 days from completion of the project, the client will be charged 5% per month beyond the terms of this contract. The client must pay the project in full within 2 month(s) after the project completion date.</li>
                  <li>4.14 Final payment is due on completion of original contract not including warranty work OR change orders</li>
                  <li>4.15 Client understands for progress payments at time of processing / charging credit card client is content with progress of work/ project and will make no attempt to make any charge-back attempts. If a Credit Card used for final payment of any work done/ project completion before processing/ charging credit card client has ensured a final walk-through has been conducted and is completely satisfied with work performed/ project outcome/ completion and client agrees there will make no charge-back attempts or charge-backs processed. Instead of credit card charge back attempts clients will utilize warranty provided by _______________. If legal mitigation is needed for payment (including credit card charge-backs), client accepts responsibility for legal/ court/ lawyer fees/ penalties etc. incurred by_____________ during legal proceedings plus balance due.</li>
                  <li>4.16 If there are remaining items carried on for 2 weeks or more past the date of which the project is over 80% complete, the client should pay the remaining balance excluding an agreed amount "Hold back" for the cost of the finalizing items.__________________ will determine those costs to determine the holdback for this.</li>
                  <li>4.17 Irrigation adjustments may be required after the completion of the project. Final payment will still be made if irrigation adjustments are required as that's considered as maintenance</li>
                  <h5>Unforeseen Items:</h5>
                  <li>5.10 We will have a location service mark for all utilities before the project is started. Please do your best to not disturb these markings since it is important for _______________ to know where these markings are at the time of project.</li>
                  <li>5.11 If any utility lines are hit during the excavation, demo or installation process, due to incorrectly marked lines,________________ will not be held liable. If this is to occur, an agreement will be made between ___________________ and client to resolve the issue. Utility line include but are not limited to: (Gas, electric, comcast, cable, tela-communications, xcel, power, etc)</li>
                  <li>5.12 Any unknown objects encountered underground or aboveground, or circumstances that may stop or delay work will be considered extra work and is not covered under the original contract. Examples include, but are not limited to; boulders, large roots, construction footings, stumps, utilities, groundwater springs, etc. Additional work will be billed for these items if to occur</li>
                  <li>5.13 The client is responsible for the marking of all non-public utilities (i.e. irrigation, invisible fencing, satellite lines, etc.) before work commences, and assumes responsibility for any damages caused by unmarked lines</li>
                  <li>5.14 It is the responsibility of the property owner to mark property lines prior to the start of work. _______________ accepts no responsibility or liability for incorrectly marked property lines or errors in survey. If access through a neighboring property is required, it is the responsibility of the client to gain legal, written, or verbal authorization to proceed.</li>
                  <li>5.15 When providing concrete demo, price assumes concrete is a standard 4" thick with rebar spaced no closer than 16" and no greater in size than ½" rebar. Concrete demo price also assumes no wire mesh is originally installed inside the concrete.</li>
                  <h5>Insurance:</h5>
                  <li>6.1 If any property damage, personal injury or any other circumstances requiring insurance, please contact _____________ to resolve everything. Please see insurance policies listed below.</li>
                  <li>6.2 General liability insurance certificate:</li>
               </ul>
            </td>
            </tr>
            <tr>
               <td style="padding: 10px 14px"><b><label>Contractor Signature</label></b>  <p>Harsh</p>
               </td>
               <td><b><label>Date</label></b>  <p>22/11/21</p>
               </td>
            </tr>
            <tr>
               <td style="padding: 10px 14px"><b><label>Owner</label></b>  <p>Harsh</p>
               </td>
               <td><b><label>Company</label></b>  <p>Harsh</p>
               </td>
            </tr>
            <tr>
               <td style="padding: 10px 14px"><b><label>Customer Signature</label></b>  <p>Harsh</p>
               </td>
               <td><b><label>Date</label></b>  <p>22/09/21</p>
               </td>
            </tr>
            </table>
      
         </div>
      </body>
      
      </html>`;

      const options = {
        format: "A4",
      };
      let pdfName =
        day +
        "" +
        month +
        "" +
        year +
        "" +
        time +
        "" +
        minutes +
        "" +
        seconds +
        "-" +
        customerData.email;
      pdf
        .create(finalPreview, options)
        .toFile(`./pdf/${pdfName}.pdf`, (err, res) => {
          if (err) {
            console.log(err);
          }
        });
      const message = `<html>
      <head>
         <meta http-equiv="Content-Type" content="text/html; charset=euc-jp">
         <meta name="viewport" content="width=device-width">
         <meta http-equiv="X-UA-Compatible" content="IE=edge">
         <meta name="x-apple-disable-message-reformatting">
         <title>One Percent </title>
         <style>html,body{background-color:#fff!important;margin:0 auto !important;padding:0 !important;height:100% !important;width:100% !important;color:#888!important}.email-container{max-width:600px!important;border: 1px solid #B5BECA;
       border-radius: 12px;margin:0 auto!important}*{-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}div[style*="margin: 16px 0"]{margin:0 !important}table,td{mso-table-lspace:0pt !important;mso-table-rspace:0pt !important}table{width:100%;border-spacing:0 !important;border-collapse:collapse !important;table-layout:fixed !important;margin:0 auto !important}img{-ms-interpolation-mode:bicubic}a{text-decoration:none!important}*[x-apple-data-detectors], .unstyle-auto-detected-links *,.aBn{border-bottom:0 !important;cursor:default !important;color:inherit !important;text-decoration:none !important;font-size:inherit !important;font-weight:inherit !important;line-height:inherit !important}@media only screen and (min-device-width: 320px) and (max-device-width: 374px){u ~ div .email-container{min-width:320px !important}}@media only screen and (min-device-width: 375px) and (max-device-width: 413px){u ~ div .email-container{min-width:375px !important}}@media only screen and (min-device-width: 414px){u ~ div .email-container{min-width:414px !important}}</style>
      </head>
      <body>
         <div class="email-container">
            
            <table style="color: #000;font-size: 20px; margin-top: 80px!important">
               <tr>
                  <td style="padding: 10px 14px;"><h2>This is your Project Estimate</h2></td>
               </tr>
               <tr>
                  <td style="padding: 10px 14px;">Good ${dayoftime},<b>${customerData.name}</b>,</td>
               </tr>
               <tr>
                  <td style="padding: 10px 14px;">
    Here you will find a PDF document and a link to see our estimate. You will be able to select and unselect the options.</td>
               </tr>
               
               <tr>
                  <td style="padding: 10px 14px;">You can contact us by clicking the button below.
   </td>
               </tr>
               <tr><td style="padding: 25px 14px;"><a href="${req.protocol}://${req.hostname}:1630/pdf/${pdfName}.pdf" style="background-color: #1A73E8; color: #fff;border-radius: 20px; padding: 5px 25px" >Open PDF</a> &nbsp; <a href="${req.protocol}://${req.hostname}:1630/pdf/${pdfName}.pdf" style="background-color: #1A73E8; color: #fff;border-radius: 20px; padding: 5px 25px" >Open Link</a> </td></tr>
   
                           <tr>
                  <td style="padding: 5px 14px;">Sincerely
   </td>
               </tr>
                           <tr>
                  <td style="padding: 10px 14px;">The One Percent Software Team
   </td>
               </tr>
            </table>
            <table style=" color: #000; font-size: 20px;">
               <tr>
                  <td style="text-align: center;padding-bottom: 5px;">
                     <ul style="display: inline-block;padding: 0">
                  <li style="display: inline-block;    padding: 10px 15px;"><a href="#"><img src="http://digimonk.net:1630/facebook.png"/></a></li>
                  <li style="display: inline-block;    padding: 10px 15px;"><a href="#"><img src="http://digimonk.net:1630/twitter.png"/></a></li>
                  <li style="display: inline-block;    padding: 10px 15px;"><a href="#"><img src="http://digimonk.net:1630/instagram.png"/></a></li>
                  <li style="display: inline-block;    padding: 10px 15px;"><a href="#"><img src="http://digimonk.net:1630/youtube.png"/></a></li></ul></td>
               </tr>
               
            </table>
            <table style="background-color: #E8F1FD; font-size: 20px;border-bottom-right-radius:10px;border-bottom-left-radius:10px;">
               <tr>
                  <td style=" text-align: center;">You're receiving this email because you are a subscriber of TheOnePercent.com </td>
               </tr>
               <tr>
                  <td style="padding-bottom: 20px; text-align: center;">If you feel you received it by mistake or wish to unsubscribe,<a href="#" style="color: deepskyblue;"><b> click here</b></a></td>
               </tr>
            </table>
         </div>
      </body>
   </html>`;


      var str2 = Date.now();
      // console.log(str2);
      // console.log(`${req.protocol}://${req.hostname}:1629/pdf/${pdfName}.pdf`)
      await SentEstimationModel.findByIdAndUpdate(
        { _id: sentData._id },
        {
          $set: {
            pdfPath: `${pdfName}.pdf`,
          },
        },
        { new: true }
      );
      await CustomerLeadModel.findByIdAndUpdate(
        { _id: customerData._id },
        {
          $set: {
            estimaitonSentDate: str2,
          },
        },
        { new: true }
      );

      await sendEmail({
        email: customerData.email,
        subject: "Here is your estimation",
        message,
        attachments: [
          {
            filename: pdfName + ".pdf",
            contentType: "application/pdf",
            path: `${req.protocol}://${req.hostname}:1630/pdf/${pdfName}.pdf`,
          },
        ],
      });
    }

    res.status(200).json({
      message: "Success",
      Data: sentData,
    });
  } catch (errors) {
    // console.log(errors);
    res.status(500).json({ errors: { error: "Internal Server Error" } });
  }
};
