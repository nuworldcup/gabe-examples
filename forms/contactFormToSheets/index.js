// needed to do npm install in order to use googleapis and axios
// that's why there are node modules and a package-lock.json file
// need to compress the entire folder and upload to lambda

// process.env.email and process.env.spreadSheetId are stored in
// environment variables on the lambda for more security. You should
// probably do this with your private key too
const { google } = require("googleapis");
const axios = require('axios')

const sheets = google.sheets("v4");
let spreadsheetId = process.env.spreadSheetId;

let jwtClient = new google.auth.JWT(
    process.env.email,
    null,
    "YOUR_PRIVATE_KEY",
    ["https://www.googleapis.com/auth/spreadsheets"],
    null
);

exports.handler = (event, context, callback) => {

    axios.post('YOUR_SLACK_WEBHOOK_URL', {
        text: event.values[0] + ' just filled out the contact us form. Go look on google sheets!'
    })
    .then((res) => {
        console.log(`statusCode: ${res.statusCode}`);
        console.log(res);
    })
    .catch((error) => {
        console.error(error);
    })
    
    jwtClient.authorize(function(err, tokens) {
        // at this point the authentication is done you can now use `jwtClient`
        // to read or write to the spreadsheet
        if (err) {
            return callback(err);
        } else {
            // Do what you need to here for each submission
            // This just adds another row to the sheet
            // for NUWC you probably want to make another sheet
            // for each team that signs up
            let sheetName = "Sheet1";
            let valueInputOption = "RAW";
            let majorDimension = "ROWS";
            
            let values = [ event.values ];
            let resource = {
                values
            };
            let response = sheets.spreadsheets.values.append(
                {
                    auth: jwtClient,
                    spreadsheetId: spreadsheetId,
                    range: sheetName,
                    valueInputOption: valueInputOption,
                    resource: resource
                },
                function(err, result) {
                    if (err) {
                        return callback(err);
                    } else {
                        callback(null, {"statusCode": 200, "body": result});
                    }
                }
            );
        }
    });
};