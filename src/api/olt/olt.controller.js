import {
  createOlt,
  deleteOlt,
  getAllOlt,
  getOlt,
  updateOlt,
} from './olt.service.js';

export async function getAllOltHandler(req, res) {
  const olts = await getAllOlt();

  return res.json(olts);
}

export async function createOltHandler(req, res) {
  try {
    const data = req.body;
    const olt = await createOlt(data);

    return res.json(olt);
  } catch(err) {
    console.log("🚀 ~ file: olt.controller.js:120 ~ createOltHandler ~ err", err)
    return res.status(500).json({
      message: `Error creating Olt: ${err.message}`,
    });
  }
  
}

export async function getOltByNameHandler(req, res) {
  try {
    const { name } = req.params

    const olt = await getOlt({ name });

    if (!olt) {
      return res.status(404).json({
        message: 'Olt not found',
      });
    }

    return res.json(olt);
  } catch(err) {
    console.log("🚀 ~ file: olt.controller.js:120 ~ createOltHandler ~ err", err)
    return res.status(500).json({
      message: `Error getting Olt: ${err.message}`,
    });

  }
}

export async function deleteOltHandler(req, res) {
  try {
    const { name } = req.params

    const olt = await getOlt({ name });

    if (!olt) {
      return res.status(404).json({
        message: 'Olt not found',
      });
    }

    await deleteOlt({ name });

    return res.json(olt);
  } catch(err) {
    console.log("🚀 ~ file: olt.controller.js:120 ~ createOltHandler ~ err", err)
    return res.status(500).json({
      message: `Error deleting Olt: ${err.message}`,
    });
  }
  
}


export async function deleteOltIdHandler(req, res) {
  try {
    const { id } = req.params

    const olt = await getOlt({ id: parseInt(id) });

    if (!olt) {
      return res.status(404).json({
        message: 'Olt not found',
      });
    }

    await deleteOlt({ id: parseInt(id) });

    return res.json(olt);
  } catch(err) {
    console.log("🚀 ~ file: olt.controller.js:120 ~ createOltHandler ~ err", err)
    return res.status(500).json({
      message: `Error deleting Olt: ${err.message}`,
    });
  }
  
}
export async function updateOltHandler(req, res) {

  const { name } = req.body

  const olt = await getOlt({ name });

  if (!olt) {
    return res.status(404).json({
      message: 'Olt not found',
    });
  }

  const updated = await updateOlt(req.body);

  return res.json(updated);

}