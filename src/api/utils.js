export function transformToParamsString(params) {
  if (!params || typeof params !== "object" || Array.isArray(params)) return "";

  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(
      ([_, v]) => v !== null && v !== undefined && v !== "",
    ),
  );

  const queryString = new URLSearchParams(cleanParams).toString();
  return queryString ? `?${queryString}` : "";
}

export function isFormData(v) {
  return typeof FormData !== "undefined" && v instanceof FormData;
}
