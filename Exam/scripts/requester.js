const baseUrl = "https://baas.kinvey.com/";
const appKey = "kid_S1vqI0dar";
const appSecret = "973dc6713917477bad08d43d8af0cc24";

function createAuthorization(type) {
  return type === "Basic"
    ? `Basic ${btoa(`${appKey}:${appSecret}`)}`
    : `Kinvey ${sessionStorage.getItem("authtoken")}`;
}

function createHeader(type, httpMethod, data) {
  const headers = {
    method: httpMethod,
    headers: {
      Authorization: createAuthorization(type),
      "Content-Type": "application/json"
    }
  };

  if (httpMethod === "POST" || httpMethod === "PUT") {
    headers.body = JSON.stringify(data);
  }

  return headers;
}

function handleError(e) {
  if (!e.ok) {
    throw new Error(e.statusText);
  }

  return e;
}

function serializeData(x) {
  if (x.status === 204) {
    return x;
  }

  return x.json();
}

function fetchData(kinveyModule, endpoint, headers) {
  const url = `${baseUrl}${kinveyModule}/${appKey}/${endpoint}`;

  return fetch(url, headers)
    .then(handleError)
    .then(serializeData);
}

export function get(kinveyModule, endpoint, type) {
  const headers = createHeader(type, "GET");
  return fetchData(kinveyModule, endpoint, headers);
}

export function post(kinveyModule, endpoint, data, type) {
  const headers = createHeader(type, "POST", data);
  return fetchData(kinveyModule, endpoint, headers);
}

export function put(kinveyModule, endpoint, data, type) {
  const headers = createHeader(type, "PUT", data);
  return fetchData(kinveyModule, endpoint, headers);
}

export function del(kinveyModule, endpoint, type) {
  const headers = createHeader(type, "DELETE");
  return fetchData(kinveyModule, endpoint, headers);
}
