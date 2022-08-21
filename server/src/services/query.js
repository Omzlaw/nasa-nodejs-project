const DEFAULT_PAGE_LIMIT = 0;
const DEFAULT_PAGE_NUMBER = 1;

function getPagination(query) {
    const { page, limit } = query;

    const pageNumber = Math.abs(page) || DEFAULT_PAGE_NUMBER;
    const limitNumber = Math.abs(limit) || DEFAULT_PAGE_LIMIT;
    const skip = (pageNumber - 1) * limitNumber;

    return {
        skip,
        limit
    }
}

module.exports = {
    getPagination
}
