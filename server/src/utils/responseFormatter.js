/**
 * Consistent API response formatter
 * Returns standardized response envelope: { success: bool, data: any, error: string|null, meta: object }
 */

function formatResponse(res, statusCode, data = null, error = null, meta = null) {
  const response = {
    success: !error && statusCode < 400,
    data,
    error: error || null,
    meta: meta || null,
    timestamp: new Date().toISOString()
  };

  return res.status(statusCode).json(response);
}

module.exports = { formatResponse };
