import {
  getPortInformation
} from './automation.service.js';

export async function getPortInformationHandler(req, res) {
  const data = req.body
  console.log("🚀 ~ file: automation.controller.js:7 ~ getPortInformationHandler ~ data:", data)

  const portInformation = await getPortInformation(data);

  if (!portInformation) {
    return res.status(404).json({
      message: 'Port Information not found',
    });
  }

  return res.json(portInformation);
}

export async function userHFCPetitionHandler(req, res) {
  const { data } = req.body
  console.log("🚀 ~ file: automation.controller.js:7 ~ getPortInformationHandler ~ data:", data)

  const portInformation = await getPortInformation(data);
  console.log("🚀 ~ file: automation.controller.js:25 ~ userHFCPetitionHandler ~ portInformation:", portInformation)

  if (!portInformation) {
    return res.status(404).json({
      message: 'Port Information not found',
    });
  }

  return res.status(404).json(portInformation.data);
}