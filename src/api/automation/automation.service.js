import fs from 'fs';
import ssh2 from 'ssh2';
import textToImage from 'text-to-image';
import axios from 'axios';
import { env } from 'process';

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


// Función para ejecutar comandos SSH
const executeSSHCommand = async (config, command) => {
  return new Promise((resolve, reject) => {
    const conn = new ssh2.Client();

    conn.on('ready', () => {
      conn.exec(command, (err, stream) => {
        if (err) {
          reject(err);
          return;
        }

        let data = '';

        stream
          .on('close', (code, signal) => {
            conn.end();
            resolve(data);
          })
          .on('data', chunk => {
            data += chunk.toString();
          })
          .stderr.on('data', err => {
            reject(err.toString());
          });
      });
    });

    conn.connect(config);
  });
};

// Función para convertir texto en imagen
const convertTextToImage = async (text, imagePath) => {
  return new Promise((resolve, reject) => {
    textToImage.generate(text, { savePath: imagePath }, (err, path) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
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


export async function getPortInformation(data) {
  try {
    // get IP address from olt database
    const olt = await getOlt({ name: data.name });
    if (olt) {
      const sshSession = await executeSSHCommand(sshPublicConfig, `ssh ec640d@${olt.ipAddress}`);

      // Ejecutar el primer comando
      const firstCommandResult = await executeSSHCommand(sshSession, `show gpon onu by sn ${data.ontSerial}`);

      // Extraer la parte después de los dos puntos del resultado del primer comando
      const interface_suffix = firstCommandResult.match(/interface_name:\s*(\S+)/)[1].split(':')[1];

      // Construir el interface_name para el segundo comando
      const interface_name = `interface_name:${interface_suffix}`;

      // Ejecutar el segundo comando usando el interface_name obtenido
      const secondCommandResult = await executeSSHCommand(sshSession, `show interface ${interface_name}`);


        // Cerrar la sesión SSH
      sshSession.end();


      // Crear una imagen con el resultado del segundo comando
      await convertTextToImage(secondCommandResult, `${data.name}.png`);

      const uploadedURL = await uploadImageToMinio(`${data.name}.png`);

      // Eliminar la imagen creada
      fs.unlinkSync(`${data.name}.png`);

      // Guardar el registro en UserHFCPetition
      const userHFCPetition = await prisma.userHFCPetition.create({
        ...data,
        imageURL: uploadedURL,
      });



      return {
        data: userHFCPetition,
      }

    }
  } catch (error) {
    console.error('Error:', error);
  }
}