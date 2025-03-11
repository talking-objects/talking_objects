

export const fetchDataOriginAPI = async ({bodyD, language="en"}) => {
    try {
      const api = `${process.env.KB_API}`;
      const username = `${process.env.KB_USERNAME}`;
      const password = `${process.env.KB_PASSWORD}`;
  
      const encodedAuthString = Buffer.from(`${username}:${password}`).toString("base64");
      const headerAuthString = `Basic ${encodedAuthString}`;
      const bodyData = bodyD
      const response = await fetch(api, {
        method: "POST",
        headers: {
          Authorization: headerAuthString,
          "Content-Type": "application/json",
          'X-Language': language
        },
        cache: "no-store",
        body: JSON.stringify(bodyData)
      });
  
      const dataKirby = await response.json();
      return dataKirby;
    } catch (error) {
        
    }
  };
   