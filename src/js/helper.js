import {TIMEOUT_SEC} from "./config"


const timeout = function (s) {
    return new Promise(function (_, reject) {
      setTimeout(function () {
        reject(new Error(`Request took too long! Timeout after ${s} second`));
      }, s * 1000);
    });
  };


//Cách 1
export const getJSON = async function(url) {
    try {
        //Promise.race: trả ra dữ liệu của promise nào lấy được dữ liệu thành công hoặc thất bại đầu tiên và sớm nhất ==> miễn là trả ra dữ liệu dù là thành công (data) hay thất bại (err) sớm nhất
        //Nếu fetch(url) lấy dữ liệu lâu hơn 10s thì chạy hàm timeout
        //Fetch - GET
        const fetchPro = fetch(url);
        const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
        const data = await res.json();
        if(!res.ok) throw new Error(`${data.message} (${res.status})`);
        return data;
    } catch (error) {
        throw error;
    }
}

export const sendJSON = async function(url, uploadData) {
  try {
      //Promise.race: trả ra dữ liệu của promise nào lấy được dữ liệu thành công hoặc thất bại đầu tiên và sớm nhất ==> miễn là trả ra dữ liệu dù là thành công (data) hay thất bại (err) sớm nhất
      //Nếu fetch(url) lấy dữ liệu lâu hơn 10s thì chạy hàm timeout
      //Fetch - POST
      const fetchPro = fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(uploadData)
      });
      const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
      const data = await res.json();
      if(!res.ok) throw new Error(`${data.message} (${res.status})`);
      return data;
  } catch (error) {
      throw error;
  }
}

//Cách 2 
/*
export const AJAX = async function(url, uploadData = undefined) {
  try {
    const fetchPro = uploadData ? fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(uploadData)
    }) : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    if(!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (error) {
    throw error;
  }
}
*/