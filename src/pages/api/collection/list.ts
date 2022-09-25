import client from '@libs/client/prisma';
import withHandler from '@libs/server/withHandler';
import type { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const collections = await client.collection.findMany({
    where: {
      networkId: req.body.networkId,
      account: req.body.account
    }
  });

  return res.json({
    ok: true,
    collections
  });
}

export default withHandler('POST', handler);
