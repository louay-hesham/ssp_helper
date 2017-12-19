const AWS = require("aws-sdk"); // imports AWS SDK
const mime = require('mime-types') // mime type resolver
const fs = require("fs"); // utility from node.js to interact with the file system
const path = require("path"); // utility from node.js to manage file/folder paths

// configuration necessary for this script to run
const config = {
  s3BucketName: 'louay-morsi.me',
  folderPath: '../dist' // path relative script's location
};

// initialise S3 client
const s3 = new AWS.S3({ signatureVersion: 'v4' });

// resolve full folder path
const distFolderPath = path.join(__dirname, config.folderPath);

// get of list of files from 'dist' directory
fs.readdir(distFolderPath, (err, files) => {

  if(!files || files.length === 0) {
    console.log(`provided folder '${distFolderPath}' is empty or does not exist.`);
    console.log('Make sure your Angular project was compiled!');
    return;
  }

  // for each file in the directory
  for (const fileName of files) {

    // get the full path of the file
    const filePath = path.join(distFolderPath, fileName);

    // read file contents
    fs.readFile(filePath, (error, fileContent) => {
      // if unable to read file contents, throw exception
      if (error) { throw error; }
      
      // map the current file with the respective MIME type
      const mimeType = mime.lookup(fileName);

      // upload file to S3
      s3.putObject({
        Bucket: config.s3BucketName,
        Key: "ssp_helper/" + fileName,
        Body: fileContent,
        ContentType: `${mimeType}`
      }, (res) => {
        console.log(`Successfully uploaded '${fileName}' with MIME type '${mimeType}'!`);
      });

    });
  }
});