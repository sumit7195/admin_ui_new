import axios from "axios";

const fetchData =  () => {
  const URL =
    "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";

  const result = axios({ url: URL, method: "GET" })
  return result;
}


export default fetchData;