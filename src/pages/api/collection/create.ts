import client from '@libs/client/prisma';
import withHandler from '@libs/server/withHandler';
import type { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const collection = await client.collection.create({ data: req.body });
  return res.json({
    ok: true,
    collection
  });
}

export default withHandler('POST', handler);
