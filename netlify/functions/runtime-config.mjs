import { runtimeConfigHandler } from '../../server/handlers/runtimeConfig.js';
import { lambdaEventToNodeReqRes, nodeResToLambdaResponse } from '../../server/netlify/adapter.js';

export const handler = async (event) => {
  const { req, res } = lambdaEventToNodeReqRes(event);
  await runtimeConfigHandler(req, res);
  return nodeResToLambdaResponse(res);
};
