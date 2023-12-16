function applyFiltersOnQuery(query, filters) {
    if (filters.mediaTypes.length) query += ` and MediaType in (${filters.mediaTypes.join(',')})`;
    switch (filters.price) {
        case 'below':
            query += ' and Price < 25';
            break;
        case 'between':
            query += ' and Price >= 25 and Price < 75';
            break;
        case 'above':
            query += ' and Price >= 75';
            break;
    }
    switch (filters.uploaded) {
        case 0:
            query += ' and CreatedDate < date_sub(now(), interval 1 week)';
            break;
        case 1:
            query += ' and CreatedDate < date_sub(now(), interval 1 month)';
            break;
        case 2:
            query += ' and CreatedDate < date_sub(now(), interval 6 month)';
            break;
        case 3:
            query += ' and CreatedDate < date_sub(now(), interval 1 year)';
            break;
    }
    return query;
}

function applySortOptionOnQuery(query, sortOption) {
    switch (sortOption) {
        case 'featured':
            break;
        case 'newest':
            query += ' order by CreatedDate desc';
            break;
        case 'priceDesc':
            query += ' order by Price desc';
            break;
        case 'priceAsc':
            query += ' order by Price asc';
            break;
    }
    return query;
}

module.exports = { applyFiltersOnQuery, applySortOptionOnQuery };