import client from '@libs/client/prisma';
import withHandler from '@libs/server/withHandler';
import type { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  let user = await client.user.findFirst({
    where: {
      networkId: req.body.networkId,
      account: req.body.account
    }
  });

  if (!user) {
    user = await client.user.create({ data: req.body });
  }
  return res.json({
    ok: true,
    user
  });
}

export default withHandler('POST', handler);
