import LeadSourceModel from "../../model/leadSource/leadSourceModel.js";
import StaffModel from "../../model/staff/staffModel.js";
import EstimationModel from "../../model/estimation/estimationModel.js";
import { InvoiceNumber } from "invoice-number";
import SentEstimationModel from "../../model/estimation/sentEstimateModel.js";
import sendEmail from "../../utils/sendEmail.js";
import CustomerLeadModel from "../../model/customer/customerLeadModel.js";
import pdf from "html-pdf";

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
