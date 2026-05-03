import { aiTutorHandler } from '../../server/handlers/aiTutor.js';
import { lambdaEventToNodeReqRes, nodeResToLambdaResponse } from '../../server/netlify/adapter.js';

export const handler = async (event) => {
  const { req, res } = lambdaEventToNodeReqRes(event);
  await aiTutorHandler(req, res);
  return nodeResToLambdaResponse(res);
};
