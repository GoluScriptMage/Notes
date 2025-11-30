class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  // Filtering
  filter() {
    // take the query String new obj
    const queryObj = { ...this.queryString };

    // create excluded Fields
    const excludedFields = ["page", "sort", "limit", "fields"];

    // remove excluded from query obj
    excludedFields.forEach((el) => delete queryObj[el]);

    // replace operators with $operators
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    // find acc. to query
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  // Sorting
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  // Fields
  fields() {
    if (this.queryString.fields) {
      const queryFields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(queryFields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  // Pagination
  pagination() {
    const page = parseInt(this.queryString.page, 10) || 1;
    const limit = parseInt(this.queryString.limit, 10) || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

export default APIFeatures;