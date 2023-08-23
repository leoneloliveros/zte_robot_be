import fs from 'fs';
import ssh2 from 'ssh2';
import textToImage from 'text-to-image';
import axios from 'axios';
import { env } from 'process';

import {
  getOlt,
} from '../olt/olt.service.js';

// Cambia estos valores según tu configuración de Minio
const minioEndpoint = 'https://minio.example.com';
const accessKey = env.MINIO_ACCESS_KEY;
const secretKey = env.MINIO_SECRET_KEY;
const bucketName = 'cable-hfc';

const sshPrivateConfig = {
  host: env.PRIVATE_IP_OLT_SSH,
  port: 22,
  username: env.OLT_SSH_USERNAME,
  password: env.OLT_SSH_PASSWORD,
};

const sshPublicConfig = {
  host: env.PUBLIC_IP_OLT_SSH,
  port: 22,
  username: env.OLT_SSH_USERNAME,
  password: env.OLT_SSH_PASSWORD,
};

const startSSHSession = async (config) => {
  return new Promise((resolve, reject) => {
    const conn = new ssh2.Client();

    conn.on('ready', () => {
      conn.shell((err, stream) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(stream);
      });
    });

    conn.connect(config);
  });
};

const executeSSHCommand = async (stream, command, dataValue) => {
  return new Promise((resolve, reject) => {
    let data = '';
    let allData = '';
    let respondToPrompt = true; // Set to true initially to respond to prompts

    const onData = (chunk) => {
      data += chunk.toString();
      allData += chunk.toString();

      if (data.includes('password:') || data.includes('The last successful login was performed at')) {
        respondToPrompt = true
      }

      if (data.includes('No related information to show')) {
        stream.close()
      }
 
      if (respondToPrompt) {
        if (data.includes('Are you sure you want to continue connecting (yes/no)')) {
          stream.write('yes\n');
          data = '';
          respondToPrompt = false; // Disable further response to this prompt
        } 
        if (data.includes('password:')) {
          stream.write(`${env.OLT_SSH_PASS}\n`);
          data = '';
          respondToPrompt = false; // Disable further response to this prompt
        }
        if (data.includes(`${dataValue.olt}`)) {
          console.log("🚀 ~ file: automation.service.js:51 ~ stream.on ~ 'olt:':", dataValue.olt)
          stream.write(`show gpon onu by sn ${dataValue.ontSerial}\n`); 
          data = '';
          respondToPrompt = false; // Disable further response to this prompt
        }
        const regex = /searchResult\s*([^\:]+)/;
        const match = data.match(regex);

        if (match) {
          const extractedData = match[1].trim();
          console.log("Extracted Data:", extractedData);
          stream.write(`show interface ${extractedData}\n`);
          respondToPrompt = false; // Disable further response to this prompt
        }

      }
    };

    const onClose = () => {
      stream.removeListener('data', onData);
      stream.removeListener('close', onClose);
      resolve(allData);
    };

    stream.on('data', onData);
    stream.on('close', onClose);


    // Write the initial command to the stream
    stream.write(`${command}\n`);
  });
};

const convertTextToImage = async (text, imagePath) => {
  try {
    const dataUri = await textToImage.generate(text, {
      maxWidth: 800,
      fontSize: 18,
      lineHeight: 30,
      textColor: '#000000',
      margin: 20,
      bgColor: '#ffffff',
    });

    // console.log("Data URI:", dataUri);
    // Extract the content from the data URI (remove the "data:image/png;base64," prefix)
    const base64Data = dataUri.replace(/^data:image\/png;base64,/, '');

    // Write the base64 data to a file
    fs.writeFileSync(imagePath, base64Data, 'base64');
  } catch (error) {
    console.error("Error:", error);
  }
};




const uploadImageToMinio = async (imagePath) => {
  const formData = new FormData();
  formData.append('file', fs.createReadStream(imagePath));

  const response = await axios.post(`${minioEndpoint}/${bucketName}`, formData, {
    auth: {
      username: accessKey,
      password: secretKey,
    },
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.location; // This is the public URL of the uploaded file
};

// const AWS = require('aws-sdk');
// const fs = require('fs');

// // Configure AWS with your MinIO credentials
// const s3 = new AWS.S3({
//   endpoint: minioEndpoint,
//   accessKeyId: accessKey,
//   secretAccessKey: secretKey,
//   signatureVersion: 'v4', // MinIO requires v4 signature
//   s3ForcePathStyle: true, // Required for MinIO
// });

// const uploadImageToMinio = async (imagePath) => {
//   const fileContent = fs.readFileSync(imagePath);

//   const uploadParams = {
//     Bucket: bucketName,
//     Key: 'path/to/your/desired/filename.png', // Set your desired object key
//     Body: fileContent,
//     ContentType: 'image/png', // Set the content type of the uploaded file
//   };

//   try {
//     const result = await s3.upload(uploadParams).promise();
//     console.log("Image uploaded to MinIO:", result.Location);
//     return result.Location; // This is the public URL of the uploaded file
//   } catch (error) {
//     console.error("Error uploading image to MinIO:", error);
//     throw error;
//   }
// };

// //Call the function with the image path
// uploadImageToMinio('path/to/your/local/image.png')
//   .then((location) => {
//     console.log("Public URL of uploaded image:", location);
//   })
//   .catch((error) => {
//     console.error("Error:", error);
//   });


export async function getPortInformation(data) {
  try {
    // get IP address from olt database
    const olt = await getOlt({ name: data.olt });
    console.log("🚀 ~ file: automation.service.js:96 ~ getPortInformation ~ olt:", olt)
    
    if (olt) {
      const sshSession = await startSSHSession(sshPublicConfig);
      const commands_first = await executeSSHCommand(sshSession, `ssh ${env.OLT_SSH_USER}@${olt.ipAddress}`, data);


    // Cerrar la sesión SSH
     sshSession.end();


    //   // Crear una imagen con el resultado del segundo comando
    await convertTextToImage(commands_first, `./uploads/${data.olt}.png`);

    // const uploadedURL = await uploadImageToMinio(`${data.olt}.png`);

    //   // Eliminar la imagen creada
    //  fs.unlinkSync(`${data.olt}.png`);

    //   // Guardar el registro en UserHFCPetition
    //   const userHFCPetition = await prisma.userHFCPetition.create({
    //     ...data,
    //     imageURL: uploadedURL,
    //   });



    //   return {
    //     data: userHFCPetition,
    //   }

    }
  } catch (error) {
    console.error('Error:', error);
  }
}