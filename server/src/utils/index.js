const findMissingFields = (requiredFields) => {
  const missingFields = Object.entries(requiredFields)
    .filter(([_key, value]) => !value)
    .map(([key, _value]) => key);

  return missingFields;
};

export { findMissingFields };
