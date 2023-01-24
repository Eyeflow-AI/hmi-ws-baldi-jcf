function getRequestId(req) {
    return req?.app?.requestId ?? 'no-request-id';
};

export default getRequestId;