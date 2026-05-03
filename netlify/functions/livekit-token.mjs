import { livekitTokenHandler } from '../../server/handlers/livekitToken.js';
import { lambdaEventToNodeReqRes, nodeResToLambdaResponse } from '../../server/netlify/adapter.js';

export const handler = async (event) => {
  const { req, res } = lambdaEventToNodeReqRes(event);
  await livekitTokenHandler(req, res);
  return nodeResToLambdaResponse(res);
};
