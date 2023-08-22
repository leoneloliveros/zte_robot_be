import {
  getPortInformation
} from './automation.service.js';

export async function getPortInformationHandler(req, res) {
  const { data } = req.body
  console.log("🚀 ~ file: automation.controller.js:7 ~ getPortInformationHandler ~ data:", data)

  const portInformation = await getPortInformation(data);

  if (!portInformation) {
    return res.status(404).json({
      message: 'Port Information not found',
    });
  }

  return res.json(portInformation);
}
