import { CollectionType } from '@libs/client/client';
import client from '@libs/client/prisma';
import withHandler from '@libs/server/withHandler';
import type { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const collection: CollectionType | any = await client.collection.findFirst({
    where: {
      networkId: req.body.networkId,
      name: req.body.name
    }
  });

  return res.json({
    ok: true,
    collection
  });
}

export default withHandler('POST', handler);
