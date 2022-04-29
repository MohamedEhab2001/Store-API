const sortFilter = (keyword, list) => {
  if (keyword) {
    const newKeyword = keyword.split(",").join(" ");
    list = list.sort(newKeyword);
  } else {
    list = list.sort("createdAt");
  }
  return list;
};

const fieldsFilter = (keyword, list) => {
  if (keyword) {
    const newKeyword = keyword.split(",").join(" ");
    list = list.select(newKeyword);
  }
  return list;
};

const pagesFilter = (keyword, list, limit, skip) => {
  if (keyword) {
    list = list.limit(limit).skip(skip);
  }
  return list;
};

const numiricFilter = (keyword, queryObjec) => {
  const Operators = {
    ">": "$gt",
    ">=": "$gte",
    "=": "$eq",
    "<": "$lt",
    "<=": "$lte",
  };
  const regExFilter = /\b(<|>|>=|=|<|<=)\b/g;
  if (keyword) {
    let filters = keyword.replace(
      regExFilter,
      (match) => `-${Operators[match]}-`
    );
    const options = ["price", "rating"];
    filters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-");
      if (options.includes(field)) {
        queryObjec[field] = { [operator]: Number(value) };
      }
    });
  }
  return queryObjec;
};

module.exports = {
  sortFilter,
  fieldsFilter,
  pagesFilter,
  numiricFilter,
};
