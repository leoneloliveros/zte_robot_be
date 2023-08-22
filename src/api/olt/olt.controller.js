import {
  createOlt,
  deleteOlt,
  getAllOlt,
  getOltByName,
  updateOlt,
} from './olt.service.js';

export async function getAllOltHandler(req, res) {
  const olts = await getAllOlt();

  return res.json(olts);
}

export async function createOltHandler(req, res) {
  const data = req.body;
  const olt = await createOlt(data);

  return res.json(olt);
}

export async function getOltByNameHandler(req, res) {
  const { name } = req.params

  const olt = await getOltByName(name);

  if (!olt) {
    return res.status(404).json({
      message: 'Olt not found',
    });
  }

  return res.json(olt);
}

export async function deleteOltHandler(req, res) {
  const { name } = req.olt

  const olt = await getOltByName(name);

  if (!olt) {
    return res.status(404).json({
      message: 'Olt not found',
    });
  }

  await deleteOlt(id);

  return res.json(olt);
}

export async function updateOltHandler(req, res) {

  const { olt } = req.body

  if (!olt) {
    return res.status(404).json({
      message: 'Olt not found',
    });
  }

  await updateOlt(olt);

  return res.json(olt);

}